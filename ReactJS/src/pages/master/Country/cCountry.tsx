import { useRef, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Button } from "primereact/button";
import { useDispatch, useSelector } from "react-redux";
import {
  createInit,
  createCountries,
  updateCountries,
} from "@/redux/slices/master/countrySlice";
import FormFields from "@/components/FormFields";
import { Formik, useFormik } from "formik";
import { Toast } from "@/assets/css/prime-library";
import { AppProgressSpinner } from "@/components/UtilityComp";
import { pageLoadScript } from "@/assets/js/common-utilities";
import { CountryValidationSchema } from "@/validations/Master";
import AppAlert from "@/alert/alert";
import { tLDS } from "@/utils/utilFunc";


const CCountry = () => {
  const route = useHistory();
  const dispatch: any = useDispatch();
  const toast = useRef<Toast>(null);
  const[disableSave,setDisableSave]=useState(false);
  useEffect(() => {
    pageLoadScript();
  });
  useEffect(() => {
    if (createEditData != null) {
      if (isCreate == false) {
        const data = {
          Countryid: createEditData.CountryId,
          Taskname: "CREATEINITIALIZE",
        };
        dispatch(createInit(data));
      }
    } else {
      const data = {
        Countryid: 0,
        Taskname: "CREATEINITIALIZE",
      };
      dispatch(createInit(data));
    }
  }, []);
  const {
    isCreate,
    isView,
    createEditData,
    loading,
    error,
    StatusList,
    CountryList,
    Country,
    HdrTable,
  } = useSelector((state: any) => state.country);
  const formik: any = useFormik({
    initialValues: {
      CountryCode: createEditData != null ? createEditData.CountryCode : "",
      CountryName: createEditData != null ? createEditData.CountryName : "",
      CountryShortform:createEditData != null ? createEditData.CountryShortForm : "",
      Nationality: createEditData != null ? createEditData.Nationality : "",
      Status: createEditData != null ? createEditData.Status : 1,
    },
    validationSchema: CountryValidationSchema,
    onSubmit: (values: any, { resetForm }) => {
      setDisableSave(true);
      let StateFormValue = {
        CountryMaster: {
          CountryId: createEditData != null ? createEditData.CountryId : 0,
          CountryName: values.CountryName,
          CountryCode: createEditData != null ? createEditData.CountryCode : "",
          CountryShortForm: values.CountryShortform,
          Nationality: values.Nationality,
          Status: values.Status,
          CreatedBy:  createEditData != null ? createEditData.CreatedBy : localStorage["UserId"],
          CreatedOn:  createEditData != null ? tLDS(createEditData.CreatedOn) : tLDS(new Date()),
          ModifiedBy: createEditData != null ? localStorage["UserId"] : null,
          ModifiedOn: createEditData != null ? tLDS(new Date()) : null,
        },
      };
      if (createEditData != null) {
        if (createEditData.isCreate != false) {
          try {
            const updateRes = dispatch(updateCountries(StateFormValue));
            updateRes.then((res) => {
              setDisableSave(false);
              if (res.payload != null || !res.payload) {
                if (res.payload.transtatus.result == true) {
                  setDisableSave(false);
                  toast.current?.show({
                    severity: "success",
                    summary: "Success Message",
                    detail: res.payload.transtatus.lstErrorItem[0].Message,
                  });
                  resetForm();
                  setTimeout(() => {
                    route.push("/home/vCountry");
                  }, 800);
                } else if (res.payload.transtatus.result == false) {
                  setDisableSave(false);
                  toast.current?.show({
                    severity: "error",
                    summary: "Error Message",
                    detail: res.payload.transtatus.lstErrorItem[0].Message,
                  });
                  setDisableSave(false);
                  return;
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
          const createRes = dispatch(createCountries(StateFormValue));
          createRes
            .then((res) => {
              if (res.payload != null || !res.payload) {
                if (res.payload.transtatus.result == true) {
                  toast.current?.show({
                    severity: "success",
                    summary: "Success Message",
                    detail: res.payload.transtatus.lstErrorItem[0].Message,
                  });
                  setDisableSave(false);
                  resetForm();
                } else if (res.payload.transtatus.result == false) {
                  toast.current?.show({
                    severity: "warn",
                    summary: "Error Message",
                    detail: res.payload.transtatus.lstErrorItem[0].Message,
                  });
                  setDisableSave(false);
                  return;
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
                  <h1>Country</h1>
                </div>
                <div className="md:col-6 text-right">
                  <div className="action-btn">
                    <>
                      <Button
                        label=""
                        title="Save"
                        icon="pi pi-save"
                        className="text-center"
                        type="submit"
                        disabled={isView || disableSave ? true : false}
                        onClick={() => formik.handleSubmit()}
                      />
                      <Button
                        label=""
                        severity="danger"
                        icon="pi pi-trash"
                        title="Clear"
                        className="text-center"
                        disabled={(isView || isCreate == false) ? true : false}
                        onClick={() => resetForm()}
                      />
                    </>
                    <Button
                      label=""
                      icon="pi pi-search"
                      title="Back to Search"
                      className="p-button p-button-success text-center"
                      onClick={() => {
                        route.push("/home/vCountry");
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
                              name={"CountryCode"}
                              label={"Country Code"}
                              options={""}
                              show={isCreate == false ? true : false}
                              required={true}
                              disable={
                                isView || isCreate == false ? true : false
                              }
                              optionLabel={""}
                              optionValue={""}
                              handleSelect={""}
                              fldStyle={"col-12 md:col-3"}
                              formik={formik}
                            />
                            <FormFields
                              type={"text"}
                              name={"CountryName"}
                              label={"Country Name"}
                              options={""}
                              show={true}
                              required={true}
                              disable={isView ? true : false}
                              optionLabel={""}
                              optionValue={""}
                              handleSelect={""}
                              fldStyle={"col-12 md:col-3"}
                              formik={formik}
                            />
                            <FormFields
                              type={"text"}
                              name={"CountryShortform"}
                              label={"Country Shortform"}
                              options={""}
                              show={true}
                              required={true}
                              disable={isView ? true : false}
                              optionLabel={""}
                              optionValue={""}
                              handleSelect={""}
                              fldStyle={"col-12 md:col-3"}
                              formik={formik}
                            />
                            <FormFields
                              type={"text"}
                              name={"Nationality"}
                              label={"Nationality"}
                              options={""}
                              show={true}
                              required={true}
                              disable={isView ? true : false}
                              optionLabel={""}
                              optionValue={""}
                              handleSelect={""}
                              fldStyle={"col-12 md:col-3"}
                              formik={formik}
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
                              fldStyle={"col-12 md:col-3"}
                              formik={formik}
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

export default CCountry;
