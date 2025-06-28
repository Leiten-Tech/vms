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
  createInit,
  createCustomer,
  updateCustomer,
  OnChangeCountry,
  OnChangeState,
} from "@/redux/slices/master/customerSlice";
import FormFields from "@/components/FormFields";
import { Formik, useFormik } from "formik";
import { customerValidationSchema } from "@/validations/Master";
import { Dropdown, Toast } from "@/assets/css/prime-library";
import PhotoCapture from "@/components/PhotoCapture";
import { tLDS } from "@/utils/utilFunc";
import AppAlert from "@/alert/alert";
const CCustomer = () => {
  const route = useHistory();
  const dispatch: any = useDispatch();
  const toast = useRef<Toast>(null);
  const {
    CityList,
    StatusList,
    loading,
    isView,
    CountryList,
    StateList,
    HdrTable,
    isCreate
  } = useSelector((state: any) => state.customer);
  const [stateList, SetStateList] = useState([]);
  const [cityList, SetCityList] = useState([]);
  const createOrEdit = useSelector(
    (state: any) => state.customer.createEditData
  );
  const updatetranstatus = useSelector(
    (state: any) => state.customer.updatetranstatus
  );
  const createTranstatus = useSelector(
    (state: any) => state.customer.createTranstatus
  );

  useEffect(() => {
    if (isCreate == true) {
      const data = {
        CustomerId: 0,
      };
      dispatch(createInit(data));
    }
    else {
      handleCountrySelect("CountryId", {}, HdrTable.CountryId, 1)
    }
  }, []);
  const formik: any = useFormik({
    initialValues: {
      CustomerCode: HdrTable != null ? HdrTable.CustomerCode : "",
      CustomerName: HdrTable != null ? HdrTable.CustomerName : "",
      CountryId: HdrTable != null ? HdrTable.CountryId : "",
      StateId: HdrTable != null ? HdrTable.StateId : "",
      CityId: HdrTable != null ? HdrTable.CityId : "",
      CompanyId: HdrTable != null ? HdrTable.CompanyId : localStorage["CompanyId"],
      PlantId: HdrTable != null ? HdrTable.PlantId : localStorage["PlantId"],
      ContactPerson: HdrTable != null ? HdrTable.ContactPerson : "",
      PhoneNumber: HdrTable != null ? HdrTable.PhoneNumber : "",
      Email: HdrTable != null ? HdrTable.Email : "",
      Address: HdrTable != null ? HdrTable.Address : "",
      Status: HdrTable != null ? HdrTable.Status : 1,
      CreatedBy: HdrTable != null ? HdrTable.CreatedBy : localStorage["UserId"],
      CreatedOn: HdrTable != null ? HdrTable.CreatedOn : new Date(),
      ModifiedBy: HdrTable != null ? localStorage["UserId"] : null,
      ModifiedOn: HdrTable != null ? new Date() : null,
    },
    validationSchema: customerValidationSchema,
    onSubmit: (values: any, { resetForm }) => {
      const formData = new FormData();
      let customerValue = {
        Customer: {
          CustomerId: HdrTable != null ? HdrTable.CustomerId : 0,
          CustomerCode: values.CustomerCode,
          CustomerName: values.CustomerName,
          CountryId: values.CountryId,
          StateId: values.StateId,
          CityId: values.CityId,
          CompanyId: localStorage["CompanyId"],
          PlantId: localStorage["PlantId"],
          CustomerImageName: "",
          CustomerImageUrl: "",
          CreatedBy: localStorage["UserId"],
          CreatedOn: HdrTable != null ? tLDS(HdrTable.CreatedOn) : tLDS(new Date()),
          ModifiedBy: localStorage["UserId"],
          ModifiedOn: HdrTable != null ? tLDS(new Date()) : null,
          Status: values.Status,
          ContactPerson: values.ContactPerson,
          PhoneNumber: values.PhoneNumber,
          Email: values.Email,
          Address: values.Address
        },
        CustomerBillingDetail: [
          {
            CustomerId: 1,
            BillingAddress1: "",
            BillingAddress2: "",
            CityId: 1,
            StateId: values.State,
            CountryId: values.Country,
            PinCode: "",
            ContactPerson: "",
            Phone1: "",
            Phone2: "",
            MobileNo: "",
            MailId: "",
            CompanyId: localStorage["CompanyId"],
            PlantId: localStorage["PlantId"],
            Status: 1,
            CreatedBy: localStorage["UserId"],
            CreatedOn: new Date(),
            ModifiedBy: localStorage["UserId"],
            ModifiedOn: new Date(),
          },
        ],
      };
      // let addedValueStringifyB: string = JSON.stringify(billingDetails)
      let addedValueStringify: string = JSON.stringify(customerValue);
      formData.append("input", addedValueStringify);
      // formData.append('inputone', addedValueStringifyB);
      formData.append("webfile", "");
      if (isCreate == false) {
        const updateRes = dispatch(updateCustomer(formData));
        // dispatch(updateCustomer(formData));
        updateRes
          .then((res) => {
            if (res.payload != null || !res.payload) {
              if (res.payload.transtatus.result == true) {
                toast.current?.show({
                  severity: "success",
                  summary: "Success Message",
                  detail: res.payload.transtatus.lstErrorItem[0].Message,
                });
                resetAllForm()
                setTimeout(() => {
                  route.push("/home/vCustomer");
                }, 800);
              } else {
                toast.current?.show({
                  severity: "error",
                  summary: "Error Message",
                  detail: res.payload.transtatus.lstErrorItem[0].Message,
                });
              }
            }
          })
          .catch((error) => {
            toast.current?.show({
              severity: "error",
              summary: "Error Message",
              detail: error,
            });
          });
      } else {
        const createRes = dispatch(createCustomer(formData));
        createRes
          .then((res) => {
            if (res.payload.transtatus.result == true) {
              toast.current?.show({
                severity: "success",
                summary: "Success Message",
                detail: res.payload.transtatus.lstErrorItem[0].Message,
              });
              resetAllForm()
            } else if (res.payload.transtatus.result == false) {
              toast.current?.show({
                severity: "error",
                summary: "Error Message",
                detail: res.payload.transtatus.lstErrorItem[0].Message,
              });
            }
          })
          .catch((error) => {
            toast.current?.show({
              severity: "error",
              summary: "Error Message",
              detail: JSON.stringify(error),
            });
          });
      }
    },
  });
  console.log(HdrTable, 'HdrTable')
  const handleSelect = (name, other, value) => {
    formik.setFieldValue(name, value);
  };
  const handleCountrySelect =  (name, other, value, type: number = 0) => {
    formik.setFieldValue("StateId",null);
    formik.setFieldValue("CityId",null);
    formik.setFieldValue(name, value);
    SetStateList(null);
    SetCityList(null);
    let Obj = {
      CountryId: value,
    };
    var result =  dispatch(OnChangeCountry(Obj));
    result
      .then((res) => {
        SetStateList(res.payload.OnChangeCountry);
        if (!isCreate && type == 1) {
          handleStateSelect("StateId", {}, HdrTable.StateId, 1)
        }
      })
      .catch((error) => {
        toast.current?.show({
          severity: "error",
          detail: "Error",
          summary: error,
        });
      });
  };
  const handleStateSelect =  (name, other, value, type: number = 0) => {
    SetCityList(null);
    formik.setFieldValue("CityId",null);
    formik.setFieldValue(name, value);
    let Obj = {
      StateId: value,
    };
    var result = dispatch(OnChangeState(Obj));
    result
      .then((res) => {
        SetCityList(res.payload.OnChangeState);
        if (!isCreate && type == 1) {
          handleSelect("CityId", {}, HdrTable.CityId)
        }
      })
      .catch((error) => {
        toast.current?.show({
          severity: "error",
          detail: "Error",
          summary: error,
        });
      });
  };
  const resetAllForm = () => {
    formik.resetForm();
    SetCityList([]);
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
                  <h1>Customer</h1>
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
                        disabled={isView ? true : false}
                        onClick={() => formik.handleSubmit()}
                      />
                      <Button
                        label=""
                        severity="danger"
                        icon="pi pi-trash"
                        title="Clear"
                        className="text-center"
                        disabled={isView || isCreate == false ? true : false}
                        onClick={() => resetAllForm()}
                      />
                    </>
                    <Button
                      label=""
                      icon="pi pi-search"
                      title="Back to Search"
                      className="p-button p-button-success text-center"
                      onClick={() => {
                        route.push("/home/vCustomer");
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
                                  name={"CustomerCode"}
                                  label={"Customer Code"}
                                  options={""}
                                  show={true}
                                  required={false}
                                  disable={true}
                                  optionLabel={""}
                                  optionValue={""}
                                  handleSelect={""}
                                  formik={formik}
                                  fldStyle={"col-12 md:col-4"}
                                />
                                <FormFields
                                  type={"text"}
                                  name={"CustomerName"}
                                  label={"Customer Name"}
                                  options={""}
                                  show={true}
                                  required={true}
                                  disable={isView ? true : false}
                                  optionLabel={""}
                                  optionValue={""}
                                  handleSelect={""}
                                  formik={formik}
                                  fldStyle={"col-12 md:col-4"}
                                />
                                <FormFields
                                  type={"text"}
                                  name={"ContactPerson"}
                                  label={"Contact Person Name"}
                                  options={""}
                                  show={true}
                                  required={true}
                                  disable={isView ? true : false}
                                  optionLabel={""}
                                  optionValue={""}
                                  handleSelect={""}
                                  formik={formik}
                                  fldStyle={"col-12 md:col-4"}
                                />
                                <FormFields
                                  type={"text"}
                                  name={"PhoneNumber"}
                                  label={"Phone number"}
                                  options={""}
                                  show={true}
                                  required={true}
                                  disable={isView ? true : false}
                                  optionLabel={""}
                                  optionValue={""}
                                  handleSelect={""}
                                  formik={formik}
                                  maxLength="15"
                                  minLength={9}
                                  fldStyle={"col-12 md:col-4"}
                                />
                                <FormFields
                                  type={"text"}
                                  name={"Email"}
                                  label={"Email ID"}
                                  options={""}
                                  show={true}
                                  required={true}
                                  disable={isView ? true : false}
                                  optionLabel={""}
                                  optionValue={""}
                                  handleSelect={""}
                                  formik={formik}
                                  fldStyle={"col-12 md:col-4"}
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
                                  fldStyle={"col-12 md:col-4"}
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
                              optionLabel={""}
                              optionValue={""}
                              handleSelect={""}
                              maxLength="500"
                              formik={formik}
                              fldStyle={"col-12 md:col-3"}
                              style={{ maxHeight: "100px", overflowY: "auto" }}
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
                              fldStyle={"col-12 md:col-3"}
                              formik={formik}
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
                              optionLabel={"MetaSubDescription"}
                              optionValue={"MetaSubId"}
                              handleSelect={handleSelect}
                              fldStyle={"col-12 md:col-3"}
                              formik={formik}
                              disable={
                                (isView ? true : false) ||
                                (isCreate == null || isCreate == true
                                  ? true
                                  : false)
                              }
                            />
                          </>
                        ) : (
                          "loading"
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

export default CCustomer;
