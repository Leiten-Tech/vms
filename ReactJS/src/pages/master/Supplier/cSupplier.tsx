import { Formik, useFormik } from "formik";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import FormFields from "@/components/FormFields";
import { AppProgressSpinner } from "@/components/UtilityComp";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import {
  create,
  createInit,
  OnChangeCountry,
  OnChangeState,
  update,
} from "@/redux/slices/master/supplierSlice";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode } from "primereact/api";
import { Button } from "primereact/button";
import AppAlert from "@/alert/alert";
import { tLDS } from "@/utils/utilFunc";
import { pageLoadScript } from "@/assets/js/common-utilities";
import { SupplierValidationSchema } from "@/validations/Master";
//Header Form Init:
const SupplierForm = (props) => {
  const {
    isView,
    isCreate,
    SupplierTypeList,
    SupplierCategoryList,
    CountryList,
    Onchangecountry,
    Onchangestate,
    StatusList,
    handleSelect,
    handleOnChange,
    supplierForm,
    formik,
    tempStateList,
    tempCityList,
  } = props;
  return (
    <Formik
      initialValues={supplierForm}
      validationSchema={SupplierValidationSchema}
      onSubmit={onsubmit}
    >
      <div className="white">
        <div className="widget-body">
          <div className="normal-table">
            <div className="grid">
              <div className="col-12 md:col-12">
                <div className="grid">
                  <FormFields
                    type={"text"}
                    name={"SupplierCode"}
                    label={"Supplier Code "}
                    options={""}
                    show={false}
                    required={true}
                    disable={isView || isCreate == false ? true : false}
                    optionLabel={""}
                    optionValue={""}
                    handleSelect={""}
                    onKeyPress={() => {}}
                    fldStyle={"col-12 md:col-3"}
                    formik={formik}
                  />
                  <FormFields
                    type={"text"}
                    name={"SupplierName"}
                    label={"Supplier Name "}
                    options={""}
                    show={true}
                    required={true}
                    disable={isView ? true : false}
                    optionLabel={""}
                    optionValue={""}
                    handleSelect={""}
                    onKeyPress={() => {}}
                    fldStyle={"col-12 md:col-3"}
                    formik={formik}
                  />
                  <FormFields
                    type={"select"}
                    name={"SupplierCategoryId"}
                    label={"Supplier Category "}
                    options={SupplierCategoryList}
                    show={true}
                    required={true}
                    disable={isView ? true : false}
                    optionLabel={"MetaSubDescription"}
                    optionValue={"MetaSubId"}
                    handleSelect={handleSelect}
                    handleOnChange={handleOnChange}
                    fldStyle={"col-12 md:col-3"}
                    formik={formik}
                  />
                  <FormFields
                    type={"select"}
                    name={"SupplierTypeId"}
                    label={"Supplier Type "}
                    options={SupplierTypeList}
                    show={true}
                    required={true}
                    disable={isView ? true : false}
                    optionLabel={"MetaSubDescription"}
                    optionValue={"MetaSubId"}
                    handleSelect={handleSelect}
                    handleOnChange={handleOnChange}
                    fldStyle={"col-12 md:col-3"}
                    formik={formik}
                  />
                  <FormFields
                    type={"text"}
                    name={"SupplierMobileNo"}
                    label={"Contact No"}
                    options={""}
                    show={true}
                    required={true}
                    disable={isView ? true : false}
                    optionLabel={""}
                    optionValue={""}
                    handleSelect={""}
                    onKeyPress={() => {}}
                    fldStyle={"col-12 md:col-3"}
                    formik={formik}
                    maxLength={15}
                    minlength={9}
                    keyfilter="int"
                  />
                </div>
              </div>
              <div className="col-12 md:col-12">
                <div className="grid">
                  <FormFields
                    type={"text"}
                    name={"SupplierMobileNo2"}
                    label={"Secondary Contact No"}
                    options={""}
                    show={true}
                    required={false}
                    disable={isView ? true : false}
                    optionLabel={""}
                    optionValue={""}
                    handleSelect={""}
                    onKeyPress={() => {}}
                    fldStyle={"col-12 md:col-3"}
                    formik={formik}
                    maxLength={15}
                    minlength={9}
                    keyfilter="int"
                  />
                  <FormFields
                    type={"text"}
                    name={"SupplierMailId"}
                    label={"Mail ID"}
                    options={""}
                    show={true}
                    required={true}
                    disable={isView ? true : false}
                    optionLabel={""}
                    optionValue={""}
                    handleSelect={""}
                    onKeyPress={() => {}}
                    fldStyle={"col-12 md:col-3"}
                    formik={formik}
                  />
                  <FormFields
                    type={"text"}
                    name={"SupplierMailId2"}
                    label={"Secondary Mail ID"}
                    options={""}
                    show={false}
                    required={false}
                    disable={isView ? true : false}
                    optionLabel={""}
                    optionValue={""}
                    handleSelect={""}
                    onKeyPress={() => {}}
                    fldStyle={"col-12 md:col-3"}
                    formik={formik}
                  />
                  <FormFields
                    type={"text"}
                    name={"SupplierGstNo"}
                    label={"GST No "}
                    options={""}
                    show={true}
                    required={false}
                    disable={isView ? true : false}
                    optionLabel={""}
                    optionValue={""}
                    handleSelect={""}
                    onKeyPress={() => {}}
                    fldStyle={"col-12 md:col-3"}
                    formik={formik}
                    maxLength={15}
                  />
                  <FormFields
                    type={"text"}
                    name={"SupplierPanNo"}
                    label={"PAN No "}
                    options={""}
                    show={true}
                    required={false}
                    disable={isView ? true : false}
                    optionLabel={""}
                    optionValue={""}
                    handleSelect={""}
                    onKeyPress={() => {}}
                    fldStyle={"col-12 md:col-3"}
                    formik={formik}
                    maxLength={10}
                  />
                </div>
              </div>
              <div className="col-12 md:col-12">
                <div className="grid">
                  <FormFields
                    type={"text"}
                    name={"SupplierTinNo"}
                    label={"TIN No"}
                    options={""}
                    show={true}
                    required={false}
                    disable={isView ? true : false}
                    optionLabel={""}
                    optionValue={""}
                    handleSelect={""}
                    onKeyPress={() => {}}
                    fldStyle={"col-12 md:col-3"}
                    formik={formik}
                    maxLength={15}
                  />
                  <FormFields
                    type={"text"}
                    name={"SupplierEccNo"}
                    label={"ECC No "}
                    options={""}
                    show={true}
                    required={false}
                    disable={isView ? true : false}
                    optionLabel={""}
                    optionValue={""}
                    handleSelect={""}
                    onKeyPress={() => {}}
                    fldStyle={"col-12 md:col-3"}
                    formik={formik}
                    maxLength={15}
                  />
                  <FormFields
                    type={"text"}
                    name={"SupplierVatNo"}
                    label={"VAT No "}
                    options={""}
                    show={true}
                    required={false}
                    disable={isView ? true : false}
                    optionLabel={""}
                    optionValue={""}
                    handleSelect={""}
                    onKeyPress={() => {}}
                    fldStyle={"col-12 md:col-3"}
                    formik={formik}
                    maxLength={15}
                  />
                  <FormFields
                    type={"select"}
                    name={"CountryId"}
                    label={"Country "}
                    options={CountryList}
                    show={true}
                    required={true}
                    disable={isView ? true : false}
                    optionLabel={"CountryName"}
                    optionValue={"CountryId"}
                    handleSelect={Onchangecountry}
                    fldStyle={"col-12 md:col-3"}
                    formik={formik}
                  />
                </div>
              </div>
              <div className="col-12 md:col-12">
                <div className="grid">
                  <div className="col-12 md:col-9">
                    <div className="grid">
                      <FormFields
                        type={"select"}
                        name={"StateId"}
                        label={"State "}
                        options={tempStateList}
                        show={true}
                        required={true}
                        disable={isView ? true : false}
                        optionLabel={"StateName"}
                        optionValue={"StateId"}
                        handleSelect={Onchangestate}
                        fldStyle={"col-12 md:col-4"}
                        formik={formik}
                      />
                      <FormFields
                        type={"select"}
                        name={"CityId"}
                        label={"City "}
                        options={tempCityList}
                        show={true}
                        required={true}
                        disable={isView ? true : false}
                        optionLabel={"CityName"}
                        optionValue={"CityId"}
                        handleSelect={handleSelect}
                        fldStyle={"col-12 md:col-4"}
                        formik={formik}
                      />
                      <FormFields
                        type={"select"}
                        name={"Status"}
                        label={"Status "}
                        options={StatusList}
                        show={true}
                        required={true}
                        disable={
                          (isView ? true : false) ||
                          (isCreate == null || isCreate == true ? true : false)
                        }
                        optionLabel={"MetaSubDescription"}
                        optionValue={"MetaSubId"}
                        handleSelect={handleSelect}
                        fldStyle={"col-12 md:col-4"}
                        formik={formik}
                      />
                    </div>
                  </div>
                  <div className="col-12 md:col-3">
                    <div className="grid">
                      <FormFields
                        type={"textarea"}
                        name={"Address"}
                        label={"Address"}
                        options={""}
                        show={true}
                        required={true}
                        disable={isView ? true : false}
                        optionLabel={""}
                        optionValue={""}
                        handleSelect={""}
                        formik={formik}
                        fldStyle={"col-12 md:col-12"}
                        style={{ maxHeight: "100px", overflowY: "auto" }}
                        maxLength={500}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Formik>
  );
};

//Main Form:
const CSupplier = () => {
  const route = useHistory();
  const toast = useRef<Toast>(null);
  const dispatch: any = useDispatch();
  const [tempStateList, setTempStateList] = useState([]);
  const [tempCityList, setTempCityList] = useState([]);

  useEffect(() => {
    pageLoadScript();
  });

  //Assign Initial Value:
  const {
    isCreate,
    isView,
    createEditData,
    loading,
    error,
    SupplierTypeList,
    SupplierCategoryList,
    StatusList,
    CountryList,
    StateList,
    CityList,
    SupplierHeader,
    StateUpdateRes,
  } = useSelector((state: any) => state.supplier);

  // useEffect(() => {
  //   //Update Or View:
  //   if (isCreate == false || isView == true) {
  //     if (!isCreate && !isView) {
  //     }
  //   }
  //   //Create Screen:
  //   else {
  //     const data = {
  //       SupplierId: 0,
  //     };
  //     dispatch(createInit(data));
  //   }
  // }, []);

  useEffect(() => {
    if (SupplierHeader != null) {
      if (isCreate == false) {
        const data = {
          SupplierId: SupplierHeader.SupplierId,
          Taskname: "CREATEINITIALIZE",
          CompanyId: +localStorage["CompanyId"],
          PlantId: +localStorage["PlantId"],
          RoleId: +localStorage["DefaultRoleId"],
        };
        dispatch(createInit(data));
        setTempStateList(
          StateList.filter((item) => item.CountryId == SupplierHeader.CountryId)
        );
        setTempCityList(
          CityList.filter((item) => item.StateId == SupplierHeader.StateId)
        );
      }
    } else {
      const data = {
        SupplierId: 0,
        Taskname: "CREATEINITIALIZE",
        CompanyId: +localStorage["CompanyId"],
        PlantId: +localStorage["PlantId"],
        RoleId: +localStorage["DefaultRoleId"],
      };
      dispatch(createInit(data));
    }
  }, []);

  //Initial Value:
  const supplierForm = {
    SupplierId: SupplierHeader != null ? SupplierHeader.SupplierId : 0,
    SupplierCode: SupplierHeader != null ? SupplierHeader.SupplierCode : "",
    SupplierName: SupplierHeader != null ? SupplierHeader.SupplierName : "",
    SupplierTypeId: SupplierHeader != null ? SupplierHeader.SupplierTypeId : 25,
    SupplierCategoryId:
      SupplierHeader != null ? SupplierHeader.SupplierCategoryId : 23,
    SupplierPanNo: SupplierHeader != null ? SupplierHeader.SupplierPanNo : "",
    SupplierTinNo: SupplierHeader != null ? SupplierHeader.SupplierTinNo : "",
    SupplierEccNo: SupplierHeader != null ? SupplierHeader.SupplierEccNo : "",
    SupplierGstNo: SupplierHeader != null ? SupplierHeader.SupplierGstNo : "",
    SupplierCstNo: SupplierHeader != null ? SupplierHeader.SupplierCstNo : "",
    SupplierVatNo: SupplierHeader != null ? SupplierHeader.SupplierVatNo : "",
    SupplierMobileNo:
      SupplierHeader != null ? SupplierHeader.SupplierMobileNo : "",
    SupplierMobileNo2:
      SupplierHeader != null ? SupplierHeader.SupplierMobileNo2 : "",
    SupplierMailId: SupplierHeader != null ? SupplierHeader.SupplierMailId : "",
    SupplierMailId2:
      SupplierHeader != null ? SupplierHeader.SupplierMailId2 : "",
    Address: SupplierHeader != null ? SupplierHeader.Address : "",
    CompanyId:
      SupplierHeader != null
        ? SupplierHeader.CompanyId
        : localStorage["CompanyId"],
    PlantId:
      SupplierHeader != null ? SupplierHeader.PlantId : localStorage["PlantId"],
    CountryId: SupplierHeader != null ? SupplierHeader.CountryId : "",
    StateId: SupplierHeader != null ? SupplierHeader.StateId : "",
    CityId: SupplierHeader != null ? SupplierHeader.CityId : "",
    Status: SupplierHeader != null ? SupplierHeader.Status : 1,
    CreatedBy:
      SupplierHeader != null
        ? SupplierHeader.CreatedBy
        : localStorage["UserId"],
    CreatedOn:
      SupplierHeader != null
        ? tLDS(SupplierHeader.CreatedOn || new Date())
        : tLDS(new Date()),
    ModifiedBy: SupplierHeader != null ? localStorage["UserId"] : null,
    ModifiedOn: SupplierHeader != null ? tLDS(new Date()) : null,
    SeriesId: SupplierHeader != null ? SupplierHeader.SeriesId : 0,
    SupplierAreaCode:
      SupplierHeader != null ? SupplierHeader.SupplierAreaCode : 0,
    SupplierIsLocal:
      SupplierHeader != null ? SupplierHeader.SupplierIsLocal : false,
    SupplierImageName:
      SupplierHeader != null ? SupplierHeader.SupplierImageName : "",
    SupplierImageUrl:
      SupplierHeader != null ? SupplierHeader.SupplierImageUrl : "",
  };

  //Supplier Header Form Creation:
  const supplierFormik: any = useFormik({
    initialValues: supplierForm,
    validationSchema: SupplierValidationSchema,
    onSubmit: (values: any, { resetForm }) => {
      let DList: any[] = [];
      let obj = {
        Supplier: values,
        SupplierDetail: DList,
      };

      if (isCreate == false) {
        var updateres = dispatch(update(obj));
        updateres
          .then((res) => {
            if (res.payload.tranStatus.result == true) {
              toast.current?.show({
                severity: "success",
                summary: "Success Message",
                detail: res.payload.tranStatus.lstErrorItem[0].Message,
              });
              resetAllForm();
              setTimeout(() => {
                route.push("/home/vSupplier");
              }, 800);
            } else {
              toast.current?.show({
                severity: "error",
                summary: "Error Message",
                detail: res.payload.tranStatus.lstErrorItem[0].Message,
              });
            }
          })
          .catch((error) => {
            toast.current?.show({
              severity: "error",
              detail: "Error",
              summary: JSON.stringify(error),
            });
          });
      } else {
        var updateres = dispatch(create(obj));
        updateres
          .then((res) => {
            if (res.payload.tranStatus.result == true) {
              toast.current?.show({
                severity: "success",
                summary: "Success Message",
                detail: res.payload.tranStatus.lstErrorItem[0].Message,
              });
              resetAllForm();
            } else {
              toast.current?.show({
                severity: "warn",
                summary: "Warning Message",
                detail: res.payload.tranStatus.lstErrorItem[0].Message,
              });
            }
          })
          .catch((error) => {
            toast.current?.show({
              severity: "error",
              summary: "Error Message",
              detail: "Error",
            });
          });
      }
    },
  });
  const handleSelect = (name, other, value) => {
    supplierFormik.setFieldValue(name, value);
  };
  const handleOnChange = (name, formName, value) => {
    supplierFormik.setFieldValue(
      name ?? supplierFormik[formName][name],
      supplierFormik,
      value
    );
  };

  const Onchangecountry = (name, other, value) => {
    try {
      setTempStateList([]);
      setTempCityList([]);
      supplierFormik.setFieldValue("StateId", null);
      supplierFormik.setFieldValue("CityId", null);
      supplierFormik.setFieldValue(name, value);
      let Obj = {
        CountryId: value,
        CompanyId: +localStorage["CompanyId"],
        PlantId: +localStorage["PlantId"],
        RoleId: +localStorage["DefaultRoleId"],
      };
      const response = dispatch(OnChangeCountry(Obj));
      response.then((response) => {
        setTempStateList(response.payload.StateList);
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
      setTempCityList([]);
      supplierFormik.setFieldValue("CityId", null);
      supplierFormik.setFieldValue(name, value);
      let Obj = {
        StateId: value,
        CompanyId: +localStorage["CompanyId"],
        PlantId: +localStorage["PlantId"],
        RoleId: +localStorage["DefaultRoleId"],
      };
      const res = dispatch(OnChangeState(Obj));
      res.then((res) => {
        setTempCityList(res.payload.CityList);
      });
    } catch (error) {
      toast.current?.show({
        severity: "error",
        detail: "Error",
        summary: error.message || "An error occurred",
      });
    }
  };

  //Clear Function:
  const resetAllForm = () => {
    supplierFormik.resetForm();
    setTempStateList([]);
    setTempCityList([]);
  };

  return (
    <>
      <div className="page-container">
        <div className="inner-page-container">
          <div className="page-title">
            <div className="grid grid-nogutter">
              <div className="md:col-6">
                <h1>Supplier</h1>
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
                      disabled={isView == true ? true : false}
                      onClick={supplierFormik.handleSubmit}
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
                      route.push("/home/vSupplier");
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          {!loading ? (
            <>
              <div className="form-container scroll-y">
                <SupplierForm
                  isView={isView}
                  isCreate={isCreate}
                  SupplierTypeList={SupplierTypeList}
                  SupplierCategoryList={SupplierCategoryList}
                  CountryList={CountryList}
                  Onchangecountry={Onchangecountry}
                  StateList={StateList}
                  Onchangestate={Onchangestate}
                  CityList={CityList}
                  StatusList={StatusList}
                  handleSelect={handleSelect}
                  handleOnChange={handleOnChange}
                  supplierForm={supplierForm}
                  formik={supplierFormik}
                  tempStateList={tempStateList}
                  tempCityList={tempCityList}
                />
              </div>
            </>
          ) : (
            <AppProgressSpinner />
          )}
        </div>
      </div>
      <AppAlert toast={toast} />
    </>
  );
};

export default CSupplier;
