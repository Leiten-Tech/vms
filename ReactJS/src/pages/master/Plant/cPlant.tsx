import { useState, useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Button } from "primereact/button";
import { useDispatch, useSelector } from "react-redux";
import {
  CreateInitialize,
  SearchInitialize,
  OnChangeCountry,
  OnChangeState,
  Create,
  Update,
} from "@/redux/slices/master/plantSlice";
import FormFields from "@/components/FormFields";
import { Formik, useFormik } from "formik";
import { PlantValidationSchema } from "@/validations/Master";
import { Toast } from "@/assets/css/prime-library";
import { AppProgressSpinner } from "@/components/UtilityComp";
import AppAlert from "@/alert/alert";
import { tLDS } from "@/utils/utilFunc";
import { pageLoadScript } from "@/assets/js/common-utilities";
import { EncryptData } from "@/redux/slices/master/workFlowSlice";
import pako from "pako";

const CPlant = () => {
  const route = useHistory();
  const dispatch: any = useDispatch();
  const toast = useRef<Toast>(null);
  const [countryList, setCountryList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);

  useEffect(() => {
    pageLoadScript();
  });

  useEffect(() => {
    if (isCreate == true) {
      const data = {
        Type: "CreateInitialize",
        PlantId: 0,
        CompanyId: +localStorage["CompanyId"],
        RoleId: +localStorage["DefaultRoleId"],
      };
      dispatch(CreateInitialize(data));
    }
    setStateList(StateList);
    setCityList(CityList);

  }, []);

  const generateQrCodes = (data) => {
    if (
      localStorage.getItem("data_companyList") &&
      localStorage.getItem("data_companyList") != null &&
      localStorage.getItem("data_companyList") != "null"
    ) {
      let decodedTokenVal: any = JSON.parse(
        localStorage.getItem("data_companyList")
      )[0];
      let decPntTokenVal: any = JSON.parse(
        localStorage.getItem("data_LoggedPlant")
      );
      var dataObj = {
        PlantId: data.PlantId,
        CompanyId: data.CompanyId,
        GateId: +localStorage["GateId"],
        CheckToken: decodedTokenVal.CheckToken,
        PlantCheckToken: decPntTokenVal.CheckToken
      };
      const encryptData = dispatch(EncryptData(JSON.stringify(dataObj)));
      encryptData
        .then((res) => {
          if (
            res.payload.hasOwnProperty("tranStatus") &&
            res.payload.tranStatus.result
          ) {
            formik.setFieldValue("UrlToken", res.payload.VisitorEntryHeader);

            data.UrlToken = res.payload.VisitorEntryHeader;
            let plantUpdate = {
              Plant: data,
            };
            const updateRes = dispatch(Update(plantUpdate));
            updateRes.then((res) => {
              if (res.payload != null || !res.payload) {
                if (res.payload.transtatus.result == true) {
                } else if (res.payload.transtatus.result == false) {
                }
              }
            });
          }
        })
        .catch((err) => {});
    }
  };

  const {
    isCreate,
    isView,
    createOrEdit,
    CompanyList,
    PlantList,
    PlantTypeList,
    loading,
    CountryList,
    CityList,
    StateList,
    error,
    StatusList,
    HdrTable,
  } = useSelector((state: any) => state.plant);
  const formik: any = useFormik({
    initialValues: {
      CompanyId: HdrTable != null ? HdrTable.CompanyId : "",
      PlantCode: HdrTable != null ? HdrTable.PlantCode : "",
      PlantType: HdrTable != null ? HdrTable.PlantType : "",
      PlantName: HdrTable != null ? HdrTable.PlantName : "",
      CountryId: HdrTable != null ? HdrTable.CountryId : "",
      StateId: HdrTable != null ? HdrTable.StateId : "",
      CityId: HdrTable != null ? HdrTable.CityId : "",
      Address: HdrTable != null ? HdrTable.Address : "",
      Geolocation: HdrTable != null ? HdrTable.GeoLocation : "",
      Status: HdrTable != null ? HdrTable.Status : 1,
      UrlToken:
        HdrTable != null
          ? import.meta.env.VITE_LOCAL_URL + HdrTable.UrlToken
          : "",
      CheckToken: HdrTable != null ? HdrTable.CheckToken : "",
    },
    validationSchema: PlantValidationSchema,
    onSubmit: (values: any, { resetForm }) => {
      let PlantFormValue = {
        Plant: {
          PlantId: HdrTable != null ? HdrTable.PlantId : 0,
          PlantCode: HdrTable != null ? HdrTable.PlantCode : "",
          PlantName: values.PlantName,
          PlantType: values.PlantType,
          Address: values.Address,
          Geolocation: values.Geolocation,
          CountryId: values.CountryId,
          StateId: values.StateId,
          CityId: values.CityId,
          CompanyId: values.CompanyId,
          Status: values.Status,
          CreatedBy:
            HdrTable != null ? HdrTable.CreatedBy : localStorage["UserId"],
          CreatedOn:
            HdrTable != null ? tLDS(HdrTable.CreatedOn) : tLDS(new Date()),
          ModifiedBy: HdrTable != null ? localStorage["UserId"] : null,
          ModifiedOn: HdrTable != null ? tLDS(new Date()) : null,
          UrlToken: HdrTable != null ? HdrTable.UrlToken : "",
          CheckToken: HdrTable != null ? HdrTable.CheckToken : "",
        },
      };
      if (HdrTable != null) {
        if (HdrTable.isCreate != false) {
          try {
            const updateRes = dispatch(Update(PlantFormValue));
            updateRes.then((res) => {
              if (res.payload != null || !res.payload) {
                if (res.payload.transtatus.result == true) {
                  generateQrCodes(res.payload.HdrTable);

                  toast.current?.show({
                    severity: "success",
                    summary: "Success Message",
                    detail: res.payload.transtatus.lstErrorItem[0].Message,
                  });
                  resetForm();
                  setTimeout(() => {
                    route.push("/home/vPlant");
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
          const createRes = dispatch(Create(PlantFormValue));
          createRes
            .then((res) => {
              if (res.payload != null || !res.payload) {
                if (res.payload.transtatus.result == true) {
                  generateQrCodes(res.payload.HdrTable);
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
    setStateList([]);
    setCityList([]);
  };

  const Onchangecountry = (name, other, value) => {
    try {
      setStateList([]);
      setCityList([]);
      formik.setFieldValue("StateId", null);
      formik.setFieldValue("CityId", null);
      formik.setFieldValue(name, value);
      let Obj = {
        CountryId: value,
      };
      const response = dispatch(OnChangeCountry(Obj));
      response.then((res) => {
        setStateList(res.payload.StateList);
      });
    } catch (error) {
      toast.current?.show({
        severity: "error",
        detail: "Error",
        summary: error.message || "An error occurred",
      });
    }
  };

  const Onchangestate = (name, other, value) => {
    try {
      setCityList([]);
      formik.setFieldValue("CityId", null);
      formik.setFieldValue(name, value);
      let Obj = {
        StateId: value,
      };
      const res = dispatch(OnChangeState(Obj));
      res.then((res) => {
        setCityList(res.payload.CityList);
      });
    } catch (error) {
      toast.current?.show({
        severity: "error",
        detail: "Error",
        summary: error.message || "An error occurred",
      });
    }
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
                  <h1>Plant</h1>
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
                        route.push("/home/vPlant");
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
                                  type={"select"}
                                  name={"CompanyId"}
                                  label={"Company"}
                                  options={CompanyList}
                                  show={true}
                                  required={true}
                                  disable={isView || !isCreate}
                                  optionLabel={"CompanyName"}
                                  optionValue={"CompanyId"}
                                  handleSelect={handleSelect}
                                  formik={formik}
                                  fldStyle={"col-12 md:col-4"}
                                  showFilter={true}
                                />
                                <FormFields
                                  type={"text"}
                                  name={"PlantCode"}
                                  label={"Plant Code"}
                                  options={""}
                                  show={
                                    isCreate == null || isCreate == false
                                      ? false
                                      : false
                                  }
                                  required={true}
                                  disable={
                                    isView || isCreate == false ? true : false
                                  }
                                  optionLabel={""}
                                  optionValue={""}
                                  handleSelect={""}
                                  formik={formik}
                                  fldStyle={"col-12 md:col-4"}
                                />
                                <FormFields
                                  type={"select"}
                                  name={"PlantType"}
                                  label={"Plant Type"}
                                  options={PlantTypeList}
                                  show={true}
                                  required={true}
                                  disable={isView ? true : false}
                                  optionLabel={"MetaSubDescription"}
                                  optionValue={"MetaSubId"}
                                  handleSelect={handleSelect}
                                  formik={formik}
                                  fldStyle={"col-12 md:col-4"}
                                />
                                <FormFields
                                  type={"text"}
                                  name={"PlantName"}
                                  label={"Plant Name"}
                                  options={""}
                                  show={true}
                                  required={true}
                                  disable={isView ? true : false}
                                  optionLabel={"PlantName"}
                                  optionValue={"PlantId"}
                                  handleSelect={""}
                                  formik={formik}
                                  fldStyle={"col-12 md:col-4"}
                                  maxLength={90}
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
                                  handleSelect={Onchangecountry}
                                  formik={formik}
                                  fldStyle={"col-12 md:col-4"}
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
                                  handleSelect={Onchangestate}
                                  formik={formik}
                                  fldStyle={"col-12 md:col-4"}
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
                                  fldStyle={"col-12 md:col-4"}
                                  showFilter={true}
                                />
                              </div>
                            </div>
                            <FormFields
                              type={"textarea"}
                              name={"Address"}
                              label={"Address"}
                              options={""}
                              show={true}
                              required={false}
                              disable={isView ? true : false}
                              optionLabel={"Address"}
                              optionValue={""}
                              handleSelect={""}
                              formik={formik}
                              fldStyle={"col-12 md:col-3"}
                              maxLength={500}
                              style={{ maxHeight: "100px", overflowY: "auto" }}
                            />
                            <FormFields
                              type={"text"}
                              name={"Geolocation"}
                              label={"Geolocation"}
                              options={""}
                              show={true}
                              required={false}
                              disable={isView ? true : false}
                              optionLabel={""}
                              optionValue={""}
                              handleSelect={""}
                              formik={formik}
                              fldStyle={"col-12 md:col-3"}
                              maxLength={50}
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
                            {/* <FormFields
                              type={"qr_code"}
                              name={"UrlToken"}
                              label={"Plant Appointment URL"}
                              options={""}
                              show={true}
                              required={false}
                              disable={isView ? true : false}
                              optionLabel={""}
                              optionValue={""}
                              handleSelect={""}
                              formik={formik}
                              fldStyle={"col-12 md:col-3"}
                              qrSize={100}
                              btnClick={printQrCode}
                            />
                            <FormFields
                              type={"qr_code"}
                              name={"CheckToken"}
                              label={"Check In/ Out Verify"}
                              options={""}
                              show={true}
                              required={false}
                              disable={isView ? true : false}
                              optionLabel={""}
                              optionValue={""}
                              handleSelect={""}
                              formik={formik}
                              fldStyle={"col-12 md:col-3"}
                              qrSize={100}
                              btnClick={printQrCode}
                            /> */}
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

export default CPlant;
