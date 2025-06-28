import { useState, useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Button } from "primereact/button";
import { useDispatch, useSelector } from "react-redux";
import {
  CreateInitialize,
  SearchInitialize,
  Create,
  Update,
} from "@/redux/slices/master/routeSlice";
import FormFields from "@/components/FormFields";
import { Formik, useFormik } from "formik";
import { RouteValidationSchema } from "@/validations/Master";
import { Toast } from "@/assets/css/prime-library";
import { AppProgressSpinner } from "@/components/UtilityComp";
import { pageLoadScript } from "@/assets/js/common-utilities";
import AppAlert from "@/alert/alert";
import { tLDS } from "@/utils/utilFunc";

const CRoute = () => {
  const route = useHistory();
  const dispatch: any = useDispatch();
  const toast = useRef<Toast>(null);

  useEffect(() => {
    if (HdrTable != null) {
      if (isCreate == false) {
        const data = {
          RouteId: HdrTable.RouteId,
          Taskname: "CREATEINITIALIZE",
          CompanyId: +localStorage["CompanyId"],
          PlantId: +localStorage["PlantId"],
          RoleId: +localStorage["DefaultRoleId"],
        };
        dispatch(CreateInitialize(data));
      }
    } else {
      const data = {
        RouteId: 0,
        Taskname: "CREATEINITIALIZE",
        CompanyId: +localStorage["CompanyId"],
        PlantId: +localStorage["PlantId"],
        RoleId: +localStorage["DefaultRoleId"],
      };
      dispatch(CreateInitialize(data));
    }
  }, []);

  const {
    isCreate,
    isView,
    createOrEdit,
    RouteList,
    Route,
    loading,
    error,
    StatusList,
    HdrTable,
  } = useSelector((state: any) => state.route);
  const formik: any = useFormik({
    initialValues: {
      RouteCode: HdrTable != null ? HdrTable.RouteCode : "",
      RouteName: HdrTable != null ? HdrTable.RouteName : "",
      FromLocation: HdrTable != null ? HdrTable.FromLocation : "",
      ToLocation: HdrTable != null ? HdrTable.ToLocation : "",
      RouteDesc: HdrTable != null ? HdrTable.RouteDesc : "",
      RouteDistanceInKm:
        HdrTable != null ? parseFloat(HdrTable.RouteDistanceInKm) : 0.0,
      Status: HdrTable != null ? HdrTable.Status : 1,
    },
    validationSchema: RouteValidationSchema,
    onSubmit: (values: any, { resetForm }) => {
      let RouteFormValue = {
        Route: {
          RouteId: HdrTable != null ? HdrTable.RouteId : 0,
          RouteCode: HdrTable != null ? HdrTable.RouteCode : "",
          RouteName: values.RouteName,
          RouteDesc: values.RouteDesc,
          RouteDistanceInKm: values.RouteDistanceInKm,
          FromLocation: values.FromLocation,
          ToLocation: values.ToLocation,
          CompanyId: localStorage["CompanyId"],
          PlantId: localStorage["PlantId"],
          Status: values.Status,
          CreatedBy:
            HdrTable != null ? HdrTable.CreatedBy : localStorage["UserId"],
          CreatedOn:
            HdrTable != null ? tLDS(HdrTable.CreatedOn) : tLDS(new Date()),
          ModifiedBy: HdrTable != null ? +localStorage["UserId"] : null,
          ModifiedOn: HdrTable != null ? tLDS(new Date()) : null,
        },
      };

      if (HdrTable != null) {
        if (HdrTable.isCreate != false) {
          try {
            const updateRes = dispatch(Update(RouteFormValue));
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
                    route.push("/home/vRoute");
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
          const createRes = dispatch(Create(RouteFormValue));
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

  useEffect(() => {
    pageLoadScript();
  });

  const handleSelect = (name, other, value) => {
    formik.setFieldValue(name, value);
  };
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
                  <h1>Route</h1>
                </div>
                <div className="md:col-6 text-right">
                  <div className="action-btn">
                    <>
                      <Button
                        label=""
                        title="Save"
                        icon="pi pi-save"
                        disabled={isView ? true : false}
                        className="text-center"
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
                        route.push("/home/vRoute");
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
                            <div className="col-12 md:col-9">
                              <div className="grid">
                                <FormFields
                                  type={"text"}
                                  name={"RouteCode"}
                                  label={"Route Code"}
                                  options={""}
                                  show={
                                    isCreate == null || isCreate == false
                                      ? true
                                      : false
                                  }
                                  required={true}
                                  disable={
                                    isView ||
                                    isCreate == false ||
                                    isCreate != null
                                      ? true
                                      : false
                                  }
                                  optionLabel={""}
                                  optionValue={""}
                                  handleSelect={""}
                                  fldStyle={"col-12 md:col-4"}
                                  formik={formik}
                                />
                                <FormFields
                                  type={"text"}
                                  name={"RouteName"}
                                  label={"Route Name"}
                                  options={""}
                                  show={true}
                                  required={true}
                                  disable={isView ? true : false}
                                  optionLabel={"RouteName"}
                                  optionValue={"RouteId"}
                                  handleSelect={""}
                                  formik={formik}
                                  fldStyle={"col-12 md:col-4"}
                                  maxLength={50}
                                />
                                <FormFields
                                  type={"text"}
                                  name={"FromLocation"}
                                  label={"From Location"}
                                  options={""}
                                  show={true}
                                  required={true}
                                  disable={isView ? true : false}
                                  optionLabel={"FromLocation"}
                                  optionValue={"FromLocation"}
                                  handleSelect={""}
                                  formik={formik}
                                  fldStyle={"col-12 md:col-4"}
                                  maxLength={90}
                                />
                                <FormFields
                                  type={"text"}
                                  name={"ToLocation"}
                                  label={"To Location"}
                                  options={""}
                                  show={true}
                                  required={true}
                                  disable={isView ? true : false}
                                  optionLabel={"ToLocation"}
                                  optionValue={"ToLocation"}
                                  handleSelect={""}
                                  formik={formik}
                                  fldStyle={"col-12 md:col-4"}
                                  maxLength={90}
                                />
                                <FormFields
                                  type={"text"}
                                  inputMode={"numeric"}
                                  value={formik.values.RouteDistanceInKm || ""}
                                  name={"RouteDistanceInKm"}
                                  label={"Distance(in Kms)"}
                                  options={""}
                                  show={true}
                                  required={true}
                                  disable={isView ? true : false}
                                  optionLabel={"RouteDistanceInKm"}
                                  optionValue={"RouteDistanceInKm"}
                                  handleSelect={""}
                                  formik={formik}
                                  fldStyle={"col-12 md:col-4"}
                                  maxFractionDigits={2}
                                  minFractionDigits={2}
                                  onChange={(e) => {
                                    const inputValue = e.target.value;

                                    if (
                                      inputValue.trim() === "" ||
                                      !isNaN(inputValue)
                                    ) {
                                      formik.setFieldValue(
                                        e.target.name,
                                        inputValue.trim()
                                      );
                                    }
                                  }}
                                  mode={"decimal"}
                                  maxLength={20}
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
                                  fldStyle={"col-12 md:col-4"}
                                />
                              </div>
                            </div>
                            <FormFields
                              type={"textarea"}
                              name={"RouteDesc"}
                              label={"Route Description"}
                              options={""}
                              show={true}
                              required={false}
                              disable={isView ? true : false}
                              optionLabel={"RouteDesc"}
                              optionValue={""}
                              handleSelect={""}
                              formik={formik}
                              fldStyle={"col-12 md:col-3"}
                              maxLength={500}
                              style={{ maxHeight: "100px", overflowY: "auto" }}
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

export default CRoute;
