import React, { useState, useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Button } from "primereact/button";
import { Rating } from "primereact/rating";
import { InputText } from "primereact/inputtext";
import { useDispatch, useSelector } from "react-redux";
import { FileUpload } from "primereact/fileupload";
import AppTable from "@/components/AppTable";
import PageHeader from "@/components/PageHeader";
import {
  CreateInitialize,
  Create,
  Update,
} from "@/redux/slices/master/shiftSlice";
import FormFields from "@/components/FormFields";
import { Formik, useFormik } from "formik";
import { AppProgressSpinner } from "@/components/UtilityComp";
import { Toast } from "@/assets/css/prime-library";
import { shiftValidationSchema } from "@/validations/Master";
import { pageLoadScript } from "@/assets/js/common-utilities";
import { Dropdown } from "@/assets/css/prime-library";
import { tLDS } from "@/utils/utilFunc";
import AppAlert from "@/alert/alert";

const CShift = () => {
  const route = useHistory();
  const dispatch: any = useDispatch();
  const toast = useRef<Toast>(null);

  useEffect(() => {
    if (HdrTable != null) {
      if (isCreate == false) {
        const data = {
          ShiftId: HdrTable.ShiftId,
          Taskname: "CREATEINITIALIZE",
          CompanyId: +localStorage["CompanyId"],
          PlantId: +localStorage["PlantId"],
          RoleId: +localStorage["DefaultRoleId"],
        };
        dispatch(CreateInitialize(data));
      }
    } else {
      const data = {
        ShiftId: 0,
        Taskname: "CREATEINITIALIZE",
        CompanyId: +localStorage["CompanyId"],
        PlantId: +localStorage["PlantId"],
        RoleId: +localStorage["DefaultRoleId"],
      };
      dispatch(CreateInitialize(data));
    }
  }, []);

  const {
    cityList,
    loading,
    isView,
    isCreate,
    CountryList,
    stateList,
    createOrEdit,
    HdrTable,
    StatusList,
  } = useSelector((state: any) => state.shift);
  const [fromTime, setFromTime] = useState(null);
  const [toTime, setToTime] = useState(null);

  const formik: any = useFormik({
    initialValues: {
      ShiftName: HdrTable != null ? HdrTable.ShiftName : "",
      ShiftType: HdrTable != null ? HdrTable.ShiftType : "",
      FromTime: HdrTable != null ? new Date(HdrTable.ShiftFromTime) : null,
      ToTime: HdrTable != null ? new Date(HdrTable.ShiftToTime) : null,
      ShiftHours: HdrTable != null ? HdrTable.ShiftHours : "",
      Status: HdrTable != null ? HdrTable.Status : 1,
    },
    validationSchema: shiftValidationSchema,
    onSubmit: (values: any, { resetForm }) => {
      if (values.ShiftHours == 0) {
        toast.current?.show({
          severity: "warn",
          summary: "Warning Message",
          detail: " Shift Hours cannot be 0",
        });
        return;
      }

      let shiftValue = {
        Shift: {
          ShiftId: HdrTable != null ? HdrTable.ShiftId : 0,
          ShiftCode: HdrTable != null ? HdrTable.ShiftCode : "",
          ShiftName: values.ShiftName,
          ShiftFromTime: values.FromTime,
          ShiftToTime: values.ToTime,
          ShiftType: values.ShiftType,
          ShiftHours: values.ShiftHours,
          CompanyId: localStorage["CompanyId"],
          PlantId: localStorage["PlantId"],
          Status: values.Status,
          CreatedBy:
            HdrTable != null ? HdrTable.CreatedBy : localStorage["UserId"],
          CreatedOn:
            HdrTable != null ? tLDS(HdrTable.CreatedOn) : tLDS(new Date()),
          ModifiedBy: HdrTable != null ? localStorage["UserId"] : null,
          ModifiedOn: HdrTable != null ? tLDS(new Date()) : null,
        },
      };

      if (HdrTable != null) {
        if (HdrTable.isCreate != false) {
          try {
            const updateRes = dispatch(Update(shiftValue));
            updateRes.then((res) => {
              if (res.payload != null || !res.payload) {
                if (res.payload.transtatus.result == true) {
                  toast.current?.show({
                    severity: "success",
                    summary: "Success Message",
                    detail: res.payload.transtatus.lstErrorItem[0].Message,
                  });
                  resetForm();
                  setTimeout(() => {
                    route.push("/home/vShift");
                  }, 800);
                } else if (res.payload.transtatus.result == false) {
                  toast.current?.show({
                    severity: "error",
                    summary: "Error Message",
                    detail: res.payload.transtatus.lstErrorItem[0].Message,
                  });
                }
              }
            });
          } catch (err) {
            toast.current?.show({
              severity: "warn",
              summary: "Error Message",
              detail: err,
            });
          }
        }
      } else {
        try {
          const createRes = dispatch(Create(shiftValue));
          createRes
            .then((res) => {
              if (res.payload != null || !res.payload) {
                if (res.payload.transtatus.result == true) {
                  toast.current?.show({
                    severity: "success",
                    summary: "Success Message",
                    detail: res.payload.transtatus.lstErrorItem[0].Message,
                  });
                  resetForm();
                } else if (res.payload.transtatus.result == false) {
                  toast.current?.show({
                    severity: "warn",
                    summary: "Error Message",
                    detail: res.payload.transtatus.lstErrorItem[0].Message,
                  });
                }
              }
            })
            .catch((err) => {
              toast.current?.show({
                severity: "warn",
                summary: "Error Message",
                detail: JSON.stringify(err.payload),
              });
            });
        } catch (err) {
          toast.current?.show({
            severity: "warn",
            summary: "Error Message",
            detail: JSON.stringify(err.payload),
          });
        }
      }
    },
  });

  const resetForm = () => {
    formik.resetForm();
  };

  const handleSelect = (name, other, value) => {
    formik.setFieldValue(name, value);
  };
  const handleFromTimeChange = (event) => {
    formik.setFieldValue(event.target.name, event.target.value);

    if (event.target.name == "FromTime") {
      setFromTime(event.target.value);
    }
    if (event.target.name == "ToTime") {
      setToTime(event.target.value);
    }
  };

  useEffect(() => {
    if (formik.values.FromTime && formik.values.ToTime) {
      const fromTime = new Date(formik.values.FromTime);
      const toTime = new Date(formik.values.ToTime);
      let timeDifferenceInMilliseconds = toTime.getTime() - fromTime.getTime();
      if (timeDifferenceInMilliseconds < 0) {
        const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
        timeDifferenceInMilliseconds += oneDayInMilliseconds;
      }
      const timeDifferenceInHours =
        timeDifferenceInMilliseconds / (1000 * 60 * 60);
      const minutes = (timeDifferenceInHours % 1) * 60;
      const positiveShiftHours = Math.max(timeDifferenceInHours).toFixed(2);
      const formattedShiftHours = `${Math.floor(Number(positiveShiftHours))}${
        minutes > 0 ? `.${Math.round(minutes)}` : ""
      }`;
      formik.setFieldValue("ShiftHours", formattedShiftHours);
    }
  }, [formik.values.FromTime, formik.values.ToTime]);

  return (
    <>
      <Formik
        initialValues={formik.initialValues}
        validationSchema={formik.validationSchema}
        onSubmit={formik.handleSubmit}
      >
        <div className="page-container">
          <div className="inner-page-container">
            <div className="page-title">
              <div className="grid grid-nogutter">
                <div className="md:col-6">
                  <h1>Shift</h1>
                </div>
                <div className="md:col-6 text-right">
                  <div className="action-btn">
                    <>
                      <Button
                        label=""
                        title="Save"
                        icon="pi pi-save"
                        className="text-center"
                        disabled={isView ? true : false}
                        type="submit"
                        onClick={() => formik.handleSubmit()}
                      />
                      <Button
                        label=""
                        severity="danger"
                        icon="pi pi-trash"
                        disabled={isView || isCreate == false ? true : false}
                        title="Clear"
                        className="text-center"
                        onClick={() => resetForm()}
                      />
                    </>
                    <Button
                      label=""
                      icon="pi pi-search"
                      title="Back to Search"
                      className="p-button p-button-success text-center"
                      onClick={() => {
                        route.push("/home/vShift");
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="form-container scroll-y">
              <form>
                <div className="white">
                  <div className="widget-body">
                    <div className="normal-table">
                      <div className="grid">
                        {!loading ? (
                          <>
                            <FormFields
                              type={"text"}
                              name={"ShiftName"}
                              label={"Shift Name"}
                              options={""}
                              show={true}
                              required={false}
                              disable={isView ? true : false}
                              optionLabel={""}
                              optionValue={""}
                              handleSelect={""}
                              formik={formik}
                              fldStyle={"col-12 md:col-3"}
                              maxLength={90}
                            />
                            <FormFields
                              type={"Calendar"}
                              name={"FromTime"}
                              label={"From Time"}
                              options={""}
                              show={true}
                              showTime={true}
                              hourFormat={"24"}
                              timeOnly={true}
                              required={true}
                              disable={isView ? true : false}
                              optionLabel={""}
                              optionValue={""}
                              handleSelect={""}
                              handleChange={handleFromTimeChange}
                              formik={formik}
                              fldStyle={"col-12 md:col-3"}
                            />
                            <FormFields
                              type={"Calendar"}
                              name={"ToTime"}
                              label={"To Time"}
                              options={""}
                              show={true}
                              showTime={true}
                              timeOnly={true}
                              hourFormat={"24"}
                              required={true}
                              disable={isView ? true : false}
                              optionLabel={""}
                              optionValue={""}
                              handleSelect={""}
                              handleChange={handleFromTimeChange}
                              formik={formik}
                              fldStyle={"col-12 md:col-3"}
                            />
                            <FormFields
                              type={"text"}
                              name={"ShiftHours"}
                              label={"Shift Hours"}
                              options={""}
                              show={true}
                              required={true}
                              disable={true}
                              optionLabel={""}
                              optionValue={""}
                              handleSelect={""}
                              formik={formik}
                              fldStyle={"col-12 md:col-3"}
                            />
                            <FormFields
                              type={"select"}
                              name={"Status"}
                              label={"Status"}
                              options={StatusList}
                              show={true}
                              required={true}
                              disable={
                                (isView ? true : false) ||
                                (isCreate == null || isCreate == true
                                  ? true
                                  : false)
                              }
                              optionLabel={"MetaSubDescription"}
                              optionValue={"MetaSubId"}
                              handleSelect={handleSelect}
                              formik={formik}
                              fldStyle={"col-12 md:col-3"}
                            />
                          </>
                        ) : (
                          <AppProgressSpinner />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Formik>
      <AppAlert toast={toast} />
    </>
  );
};

export default CShift;
