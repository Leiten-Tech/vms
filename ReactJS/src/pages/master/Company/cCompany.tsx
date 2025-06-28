import { useRef, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Button } from "primereact/button";
import { useDispatch, useSelector } from "react-redux";

import {
  CreateInitialize,
  OnChangeCountry,
  OnChangeState,
  Create,
  Update,
} from "@/redux/slices/master/companySlice";
import FormFields from "@/components/FormFields";
import { Formik, useFormik } from "formik";
import { CompanyValidationSchema } from "@/validations/Master";
import { Toast } from "@/assets/css/prime-library";
import { AppProgressSpinner } from "@/components/UtilityComp";
import { permissionService } from "@/services/PermissionService";
import { pageLoadScript } from "@/assets/js/common-utilities";
import AppAlert from "@/alert/alert";
import { tLDS } from "@/utils/utilFunc";

const CCompany = () => {
  const route = useHistory();
  const dispatch: any = useDispatch();
  const toast = useRef<Toast>(null);
  const [countryList, setCountryList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [disableSave, setDisableSave] = useState(false);

  useEffect(() => {
    pageLoadScript();
  });

  useEffect(() => {
    if (HdrTable != null) {
      if (isCreate == false) {
        const data = {
          CompanyId: HdrTable.CompanyId,
          Taskname: "CREATEINITIALIZE",
        };
        dispatch(CreateInitialize(data));
        setStateList(
          StateList.filter((item) => item.CountryId == HdrTable.CountryId)
        );
        setCityList(
          CityList.filter((item) => item.StateId == HdrTable.StateId)
        );
      }
    } else {
      const data = {
        CompanyId: 0,
        Taskname: "CREATEINITIALIZE",
      };
      dispatch(CreateInitialize(data));
    }
  }, []);

  const {
    allCompanies,
    createOrEdit,
    loading,
    error,
    CompanyList,
    StatusList,
    CountryList,
    CityList,
    StateList,
    isView,
    isCreate,
    HdrTable,
  } = useSelector((state: any) => state.company);

  const formik: any = useFormik({
    initialValues: {
      CompanyName: HdrTable != null ? HdrTable.CompanyName : "",
      CountryId: HdrTable != null ? HdrTable.CountryId : "",
      StateId: HdrTable != null ? HdrTable.StateId : "",
      CityId: HdrTable != null ? HdrTable.CityId : "",
      CompanyCode: HdrTable != null ? HdrTable.CompanyCode : "",
      Mail: HdrTable != null ? HdrTable.Mail : "info@leitenindia.com",
      Host: HdrTable != null ? HdrTable.Host : "mail.leitenindia.com",
      Port: HdrTable != null ? HdrTable.Port : "25",
      UserName: HdrTable != null ? HdrTable.UserName : "info@leitenindia.com",
      Password: HdrTable != null ? HdrTable.Password : "55xJpd92^",
      TrialStartDate: HdrTable != null ? HdrTable.TrialStartDate : null,
      TrialEndDate: HdrTable != null ? HdrTable.TrialEndDate : null,
      Status: HdrTable != null ? HdrTable.Status : 1,
      CheckToken: HdrTable != null ? HdrTable.CheckToken : "",
    },
    validationSchema: CompanyValidationSchema,
    onSubmit: (values: any, { resetForm }) => {
      let CompanyFormValue = {
        Company: {
          CompanyId: HdrTable != null ? HdrTable.CompanyId : 0,
          CompanyName: values.CompanyName,
          CompanyCode: HdrTable != null ? HdrTable.CompanyCode : "",
          Mail: values.Mail,
          Host: values.Host,
          Port: values.Port,
          UserName: values.UserName,
          Password: values.Password,
          Status: values.Status,
          CreatedBy:
            HdrTable != null ? HdrTable.CreatedBy : localStorage["UserId"],
          CreatedOn:
            HdrTable != null ? tLDS(HdrTable.CreatedOn) : tLDS(new Date()),
          ModifiedBy: HdrTable != null ? localStorage["UserId"] : null,
          ModifiedOn: HdrTable != null ? tLDS(new Date()) : null,
          CountryId: values.CountryId,
          StateId: values.StateId,
          CityId: values.CityId,
          TrialStartDate: HdrTable != null ? HdrTable.TrialStartDate : null,
          TrialEndDate: HdrTable != null ? HdrTable.TrialEndDate : null,
          CheckToken: HdrTable != null ? HdrTable.CheckToken : null,
        },
      };

      if (HdrTable != null) {
        if (HdrTable.isCreate != false) {
          try {
            const updateRes = dispatch(Update(CompanyFormValue));
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
                    route.push("/home/vCompany");
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
          const createRes = dispatch(Create(CompanyFormValue));
          createRes
            .then((res) => {
              setDisableSave(true);
              if (res.payload != null || !res.payload) {
                if (res.payload.transtatus.result == true) {
                  setDisableSave(false);
                  toast.current?.show({
                    severity: "success",
                    summary: "Success Message",
                    detail: res.payload.transtatus.lstErrorItem[0].Message,
                  });
                  resetForm();
                } else if (res.payload.transtatus.result == false) {
                  setDisableSave(false);

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
    setStateList([]);
    setCityList([]);
  };

  const handleCountrySelect = (name, other, value) => {
    formik.setFieldValue("StateId", null);
    formik.setFieldValue("CityId", null);
    formik.setFieldValue(name, value);
    let obj = {
      Type: "OnChangeCountry",
      CountryId: value,
    };
    var result = dispatch(OnChangeCountry(obj));
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
    setCityList([]);
  };

  const handleStateSelect = (name, other, value) => {
    formik.setFieldValue("CityId", null);
    formik.setFieldValue(name, value);
    let obj = {
      Type: "OnChangeState",
      StateId: value,
    };
    var result = dispatch(OnChangeState(obj));
    result
      .then((res) => {
        setCityList(res.payload.CityList);
      })
      .catch((error) => {
        toast.current?.show({
          severity: "error",
          detail: "Error",
          summary: error,
        });
      });
    //dispatch(OnChangeState(obj));
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
                  <h1>Company</h1>
                </div>
                <div className="md:col-6 text-right">
                  <div className="action-btn">
                    <>
                      <Button
                        label=""
                        title="Save"
                        icon="pi pi-save"
                        className="text-center"
                        disabled={isView || disableSave ? true : false}
                        type="submit"
                        onClick={() => formik.handleSubmit()}
                      />
                      <Button
                        label=""
                        severity="danger"
                        icon="pi pi-trash"
                        title="Clear"
                        disabled={isView || isCreate == false ? true : false}
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
                        route.push("/home/vCompany");
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
                              name={"CompanyCode"}
                              label={"Company Code"}
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
                              type={"text"}
                              name={"CompanyName"}
                              label={"Company Name"}
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
                              name={"CountryId"}
                              label={"Country"}
                              options={CountryList}
                              show={true}
                              required={true}
                              disable={isView ? true : false}
                              optionLabel={"CountryName"}
                              optionValue={"CountryId"}
                              handleSelect={handleCountrySelect}
                              formik={formik}
                              fldStyle={"col-12 md:col-3"}
                              showFilter={true}
                            />
                            <FormFields
                              type={"select"}
                              name={"StateId"}
                              label={"State"}
                              options={stateList}
                              show={true}
                              required={true}
                              disable={isView ? true : false}
                              optionLabel={"StateName"}
                              optionValue={"StateId"}
                              handleSelect={handleStateSelect}
                              formik={formik}
                              fldStyle={"col-12 md:col-3"}
                              showFilter={true}
                            />
                            <FormFields
                              type={"select"}
                              name={"CityId"}
                              label={"City"}
                              options={cityList}
                              show={true}
                              required={true}
                              disable={isView ? true : false}
                              optionLabel={"CityName"}
                              optionValue={"CityId"}
                              handleSelect={handleSelect}
                              formik={formik}
                              fldStyle={"col-12 md:col-3"}
                              showFilter={true}
                            />
                            <FormFields
                              type={"text"}
                              name={"Mail"}
                              label={"Mail ID"}
                              show={false}
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
                              name={"Host"}
                              label={"Host"}
                              show={false}
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
                              name={"Port"}
                              label={"Port"}
                              show={false}
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
                              name={"UserName"}
                              label={"User Name"}
                              show={false}
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
                              name={"Password"}
                              label={"Password"}
                              show={false}
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

export default CCompany;
