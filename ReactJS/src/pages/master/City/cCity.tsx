import React, { useState, useEffect, useRef } from "react";
import { Link, useHistory } from "react-router-dom";

import { Formik, Form, Field, ErrorMessage, useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import BasicDemo from "../../../alert/alert";
import {
  createInit,
  create,
  update,
  OnChangeCountry,
} from "@/redux/slices/master/citySlice";
import { CityValidationSchema } from "@/validations/Master";
import { Button, Dropdown, InputText} from "@/assets/css/prime-library";
import { pageLoadScript } from "@/assets/js/common-utilities";
import { AppProgressSpinner } from "@/components/UtilityComp";
import FormFields from "@/components/FormFields";
import { Toast } from "@/assets/css/prime-library";
import AppAlert from "@/alert/alert";
import { tLDS } from "@/utils/utilFunc";

const CCityMaster = () => {
  const dispatch: any = useDispatch();
  const toast = useRef<Toast>(null);
  const route = useHistory();
  const [stateList, setStateList] = useState([]);
  const {
    isCreate,
    isView,
    createEditData,
    loading,
    error,
    HdrTable,
    CountryList,
    StatusList,
    StateList,
    CityList,
    OnChangeCountryList,
  } = useSelector((state: any) => state.city);

  useEffect(() => {
    pageLoadScript();
  });

  useEffect(() => {
    if (isCreate == true) {
      const data = {
        CityId: 0,
        Taskname: "CREATEINITIALIZE",
      };
      dispatch(createInit(data));
    } else {
      setStateList(StateList);
    }
  }, []);
  useEffect(() => {
    setStateList(StateList);
  }, [StateList]);

  const formik: any = useFormik({
    initialValues: {
      CityId: HdrTable != null ? HdrTable.CityId : 0,
      CountryId: HdrTable != null ? +HdrTable.CountryId : null,
      StateId: HdrTable != null ? +HdrTable.StateId : null,
      CityName: HdrTable != null ? HdrTable.CityName : "",
      CityCode: HdrTable != null ? HdrTable.CityCode : "",
      CompanyId:
        HdrTable != null ? HdrTable.CompanyId : localStorage["CompanyId"],
      PlantId: HdrTable != null ? HdrTable.PlantId : localStorage["PlantId"],
      Status: HdrTable != null ? HdrTable.Status : 1,
      CreatedBy: HdrTable != null ? HdrTable.CreatedBy : localStorage["UserId"],
      CreatedOn: HdrTable != null ? tLDS(HdrTable.CreatedOn) : tLDS(new Date()),
      ModifiedBy: HdrTable != null ? localStorage["UserId"] : null,
      ModifiedOn:  HdrTable != null ? tLDS(new Date()) : null,
    },
    validationSchema: CityValidationSchema,
    onSubmit: (values: any, { resetForm }) => {
     let CityFormValue = {
        City: values,
      };
  
  if (HdrTable != null) {
    if (HdrTable.isCreate != false) {
      try {
        const updateRes = dispatch(update(CityFormValue));
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
                route.push("/home/vCity");
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
      const createRes = dispatch(create(CityFormValue));
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
  
  const resetAllForms = () => {
    formik.resetForm();
    setStateList([]);
  };
  const handleSelect = (name, other, value) => {
    formik.setFieldValue(name, value);
  };
  const handleCountrySelect = (name, other, value) => {
    
    
    formik.setFieldValue(name, value);
    formik.setFieldValue("StateId", null);
    let Obj = {
      CountryId: value,
    };
    var result = dispatch(OnChangeCountry(Obj));
    result
      .then((res) => {
        setStateList(res.payload.StateList);
      })
      .catch((error) => {
        toast.current?.show({
          severity: "error",
          detail: "Error",
          summary: error,
        });
      });
  };

  return (
    <>
    <Formik
      initialValues={formik.initialValues}
      validationSchema={CityValidationSchema}
      onSubmit={formik.handleSubmit}
    >
      <div className="page-container">
        <div className="inner-page-container">
          <div className="page-title">
            <div className="grid grid-nogutter">
              <div className="md:col-6">
                <h1>City</h1>
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
                      onClick={() => formik.handleSubmit()}
                      disabled={isView ? true : false}
                    />
                    <Button
                      label=""
                      severity="danger"
                      icon="pi pi-trash"
                      title="Clear"
                      className="text-center"
                      disabled={(isView || isCreate == false) ? true : false}
                      onClick={() => resetAllForms()}
                    />
                  </>
                  <Button
                    label=""
                    icon="pi pi-search"
                    title="Back to Search"
                    className="p-button p-button-success text-center"
                    onClick={() => {
                      route.push("/home/vCity");
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
                              name={"CityCode"}
                              label={"City Code"}
                              options={""}
                              show={
                                isCreate == null || isCreate == false
                                  ? true
                                  : false
                              }
                              required={true}
                              disable={
                                isView || isCreate == false || isCreate != null
                                  ? true
                                  : false
                              }
                              optionLabel={""}
                              optionValue={""}
                              handleSelect={""}
                              fldStyle={"col-12 md:col-3"}
                              formik={formik}
                            />
                          <FormFields
                            type={"select"}
                            name={"CountryId"}
                            label={"Country Name"}
                            options={CountryList}
                            show={true}
                            required={true}
                            optionLabel={"CountryName"}
                            optionValue={"CountryId"}
                            handleSelect={handleCountrySelect}
                            disable={isView || !isCreate}
                            formik={formik}
                            fldStyle={"col-12 md:col-3"}
                            showFilter={true}
                          />
                          <FormFields
                            type={"select"}
                            name={"StateId"}
                            label={"State Name"}
                            options={stateList}
                            show={true}
                            required={true}
                            disable={isView || !isCreate}
                            optionLabel={"StateName"}
                            optionValue={"StateId"}
                            handleSelect={handleSelect}
                            formik={formik}
                            fldStyle={"col-12 md:col-3"}
                            showFilter={true}
                          />
                          <FormFields
                            type={"text"}
                            name={"CityCode"}
                            label={"City Code"}
                            options={""}
                            show={false}
                            required={true}
                            disabled={
                              isView || isCreate == false ? true : false
                            }
                            optionLabel={""}
                            optionValue={""}
                            handleSelect={""}
                            formik={formik}
                            fldStyle={"col-12 md:col-3"}
                            onKeyPress={() => {}}
                          />
                          <FormFields
                            type={"text"}
                            name={"CityName"}
                            label={"City Name"}
                            show={true}
                            required={true}
                            disable={isView ? true : false}
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

export default CCityMaster;
