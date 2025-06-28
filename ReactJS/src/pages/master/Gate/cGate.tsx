import { useRef, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Button } from "primereact/button";
import { useDispatch, useSelector } from "react-redux";
import {
  createInit,
  create,
  update,
  OnChangeCompany,
} from "@/redux/slices/master/gateSlice";
import FormFields from "@/components/FormFields";
import { Formik, useFormik } from "formik";
import { Toast } from "@/assets/css/prime-library";
import { AppProgressSpinner } from "@/components/UtilityComp";
import { tLDS } from "@/utils/utilFunc";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import {
  GateDetailValidationSchema,
  GateValidationSchema,
} from "@/validations/Master";
import { pageLoadScript } from "@/assets/js/common-utilities";
import { log } from "console";
import AppAlert from "@/alert/alert";
const deleteTemplate = (rowData, gateDetailList, setGateDetailList, isView) => {
  const OnDelete = () => {
    setGateDetailList([]);
    setGateDetailList(gateDetailList.filter((f) => f != rowData));
  };
  return (
    <Button
      label=""
      severity="danger"
      title="Delete"
      icon="las la-trash"
      className="mr-2 p-1"
      disabled={isView ? true : false}
      onClick={() => OnDelete()}
    />
  );
};
const GateForm = (props) => {
  const {
    isCreate,
    isView,
    createEditData,
    loading,
    error,
    StatusList,
    HdrTable,
    EmployeeList,
    CompanyList,
    formik,
    handleSelect,
    handleCompanySelect,
    OnChangeCompanyList,
    gateForm,
    gateRef,
    onSubmit,
    plantList,
    handleOnChange,
  } = props;
  return (
    <Formik
      initialValues={gateForm}
      validationSchema={GateValidationSchema}
      onSubmit={formik.handleSubmit}
    >
      <div className="white">
        <div className="widget-body">
          <div className="normal-table">
            <div className="grid">
              <FormFields
                type={"text"}
                name={"GateCode"}
                label={"Gate Code"}
                options={""}
                show={false}
                required={true}
                disable={isView || isCreate == false ? true : false}
                optionLabel={""}
                optionValue={""}
                handleSelect={""}
                formik={formik}
                fldStyle={"col-12 md:col-3"}
                onKeyPress={() => {}}
              />
              <FormFields
                type={"text"}
                name={"GateName"}
                label={"Gate Name"}
                options={""}
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
                type={"text"}
                name={"GateNo"}
                label={"Gate No"}
                options={""}
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
                name={"GateInchargeId"}
                label={"Gate Incharge Name"}
                options={EmployeeList}
                show={true}
                required={false}
                disable={isView ? true : false}
                optionLabel={"UserName"}
                optionValue={"UserId"}
                handleSelect={handleSelect}
                formik={formik}
                fldStyle={"col-12 md:col-3"}
              />
              <FormFields
                type={"select"}
                name={"CompanyId"}
                label={"Company Name"}
                options={CompanyList}
                show={true}
                required={true}
                disable={isView ? true : false}
                optionLabel={"CompanyName"}
                optionValue={"CompanyId"}
                handleSelect={handleCompanySelect}
                formik={formik}
                fldStyle={"col-12 md:col-3"}
              />
              <FormFields
                type={"select"}
                name={"PlantId"}
                label={"Plant Name"}
                options={plantList}
                show={true}
                required={true}
                disable={isView ? true : false}
                optionLabel={"PlantName"}
                optionValue={"PlantId"}
                handleSelect={handleSelect}
                formik={formik}
                fldStyle={"col-12 md:col-3"}
              />
              <FormFields
                type={"Calendar"}
                name={"GateOpenTime"}
                label={"Gate Open Time"}
                options={""}
                show={true}
                required={true}
                disable={isView ? true : false}
                optionLabel={""}
                optionValue={""}
                formik={formik}
                handleChange={handleOnChange}
                fldStyle={"col-12 md:col-3"}
                timeOnly={true}
                showTime={true}
                hourFormat={"12"}
              />
              <FormFields
                type={"Calendar"}
                name={"GateCloseTime"}
                label={"Gate Close Time"}
                options={""}
                show={true}
                required={true}
                optionLabel={""}
                optionValue={""}
                formik={formik}
                handleChange={handleOnChange}
                fldStyle={"col-12 md:col-3"}
                timeOnly={true}
                showTime={true}
                hourFormat={"12"}
                disable={isView ? true : false}
                // value={formik.values["GateCloseTime"]}
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
                  (isCreate == null || isCreate == true ? true : false)
                }
                optionLabel={"MetaSubDescription"}
                optionValue={"MetaSubId"}
                handleSelect={handleSelect}
                formik={formik}
                fldStyle={"col-12 md:col-3"}
              />
            </div>
          </div>
        </div>
      </div>
    </Formik>
  );
};
const GateDetailForm = (props) => {
  const {
    isCreate,
    isView,
    createEditData,
    loading,
    error,
    StatusList,
    HdrTable,
    EmployeeList,
    CompanyList,
    PlantList,
    formik,
    handleSelect,
    handleSecuritySelect,
    gateDetailList,
    filters,
    TableHeader,
    OnAdd,
    gateDetailForm,
    gateDetailRef,
    OnClear,
    onRowSelect,
    setGateDetailList,
    SecurityList,
  } = props;
  return (
    <Formik
      initialValues={formik.gateDetailForm}
      validationSchema={formik.GateDetailValidationSchema}
      onSubmit={formik.handleSubmit}
    >
      <div className="white">
        <div className="widget-body">
          <div className="normal-table">
            <div className="page-title">
              <div className="grid grid-nogutter">
                <div className="md:col-6">
                  <h1>Security Details</h1>
                </div>
              </div>
            </div>
            <div className="grid">
              <FormFields
                type={"select"}
                name={"SecurityId"}
                label={"Security Name"}
                options={SecurityList}
                show={true}
                required={true}
                disable={isView ? true : false}
                optionLabel={"UserName"}
                optionValue={"UserId"}
                handleSelect={handleSecuritySelect}
                formik={formik}
                fldStyle={"col-12 md:col-3"}
              />
              <FormFields
                type={"text"}
                name={"Email"}
                label={"Email"}
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
                type={"text"}
                name={"PhoneNumber"}
                label={"Phone Number"}
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
                type={"textarea"}
                name={"Address"}
                label={"Address"}
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
            </div>
            <div className="text-center mb-3">
              <Button
                label="Add"
                severity="success"
                icon="las la-plus"
                title="Add"
                className="text-center"
                onClick={formik.handleSubmit}
                type="submit"
                disabled={isView ? true : false}
              />
              <Button
                label="Delete"
                severity="danger"
                icon="las la-trash"
                title="Delete"
                className="text-center"
                onClick={() => OnClear()}
                disabled={isView ? true : false}
              />
            </div>
          </div>
          <div className="card">
            <DataTable
              value={gateDetailList}
              showGridlines
              paginator
              filters={filters}
              filterDisplay="menu"
              globalFilterFields={[
                "FirstName",
                "PhoneNumber",
                "Email",
                "Address",
              ]}
              header={TableHeader}
              emptyMessage="No Data Found."
              rows={5}
              rowsPerPageOptions={[5, 10, 25, 50]}
              tableStyle={{ minWidth: "50rem" }}
            >
              <Column
                header="Action"
                style={{
                  textAlign: "center",
                  minWidth: "5em",
                  maxWidth: "5em",
                  overflowWrap: "break-word",
                }}
                body={(e) =>
                  deleteTemplate(e, gateDetailList, setGateDetailList, isView)
                }
                headerClassName="text-center"
              ></Column>
              <Column
                field="FirstName"
                header="Security Name"
                style={{
                  minWidth: "20em",
                  maxWidth: "20em",
                  overflowWrap: "break-word",
                }}
                headerClassName="text-center"
              ></Column>
              <Column
                field="PhoneNumber"
                header="Phone Number"
                style={{
                  minWidth: "20em",
                  maxWidth: "20em",
                  overflowWrap: "break-word",
                }}
                headerClassName="text-center"
              ></Column>
              <Column
                field="Email"
                header="Mail ID"
                style={{
                  minWidth: "20em",
                  maxWidth: "20em",
                  overflowWrap: "break-word",
                }}
                headerClassName="text-center"
              ></Column>
              <Column
                field="Address"
                header="Address"
                style={{
                  minWidth: "30em",
                  maxWidth: "30em",
                  overflowWrap: "break-word",
                }}
                headerClassName="text-center"
              ></Column>
            </DataTable>
          </div>
        </div>
      </div>
    </Formik>
  );
};
const CGate = () => {
  const dispatch: any = useDispatch();
  const toast = useRef<Toast>(null);
  const route = useHistory();
  const [gateDetailList, setGateDetailList] = useState([]);
  const gateRef = useRef(null);
  const gateDetailRef = useRef(null);
  const [plantList, setPlantList] = useState([]);
  const [DisableSave, setDisableSave] = useState(false);
  const {
    isCreate,
    isView,
    createEditData,
    loading,
    error,
    StatusList,
    HdrTable,
    EmployeeList,
    CompanyList,
    PlantList,
    OnChangeCompanyList,
    GateDetailList,
    SecurityList,
  } = useSelector((state: any) => state.gate);
  useEffect(() => {
    pageLoadScript();
  });
  useEffect(() => {
    if (isCreate == false) {
      let List: any[] = [];
      if (
        GateDetailList &&
        GateDetailList.length &&
        GateDetailList.length > 0
      ) {
        for (let i = 0; i < GateDetailList.length; i++) {
          const x = GateDetailList[i];
          let obj: any = {};
          obj.GateDetailId = 0;
          obj.GateId = x.GateId ?? 0;
          obj.SecurityId = x.SecurityId;
          obj.Email = x.Email;
          obj.PhoneNumber = x.PhoneNumber;
          obj.Address = x.Address;
          obj.FirstName = SecurityList && SecurityList.length > 0 && SecurityList.find(
            (f) => f.UserId == x.SecurityId
          )?.UserName;
          List.push(obj);
        }
      }
      setGateDetailList(List);
    } else {
      const data = {
        GateId: 0,
        Taskname: "CREATEINITIALIZE",
        PlantId: localStorage["PlantId"],
        CompanyId: localStorage["CompanyId"],
        RoleId: localStorage["DefaultRoleId"],
      };
      dispatch(createInit(data));
      gateFormik.setFieldValue("GateOpenTime", null);
      gateFormik.setFieldValue("GateCloseTime", null);
      let cList = CompanyList;
      if (cList && cList.length > 0) {
        handleCompanySelect("CompanyId", {}, cList[0].CompanyId);
      }
    }
  }, []);

  useEffect(() => {
    setPlantList(OnChangeCompanyList);
  }, [OnChangeCompanyList]);
  
  useEffect(() => {
    if (isCreate) {
      let pList = plantList;
      if (pList && pList.length > 0) {
        handleSelect("PlantId", {}, pList[0].PlantId);
      }
    }
  }, [CompanyList, OnChangeCompanyList, plantList])


  const gateForm = {
    GateId: HdrTable != null ? HdrTable.GateId : 0,
    GateName: HdrTable != null ? HdrTable.GateName : "",
    GateCode: HdrTable != null ? HdrTable.GateCode : "",
    GateNo: HdrTable != null ? HdrTable.GateNo : "",
    GateInchargeId: HdrTable != null ? HdrTable.GateInchargeId : null,
    GateOpenTime: HdrTable != null ? new Date(HdrTable.GateOpenTime) : null,
    GateCloseTime: HdrTable != null ? new Date(HdrTable.GateCloseTime) : null,
    CompanyId: HdrTable != null ? HdrTable.CompanyId : null,
    PlantId: HdrTable != null ? HdrTable.PlantId : null,
    Status: HdrTable != null ? HdrTable.Status : 1,
    CreatedBy: HdrTable != null ? HdrTable.CreatedBy : localStorage["UserId"],
    CreatedOn: HdrTable != null ? tLDS(HdrTable.CreatedOn) : tLDS(new Date()),
    ModifiedBy: HdrTable != null ? localStorage["UserId"] : null,
    ModifiedOn: HdrTable != null ? tLDS(new Date()) : null,
  };

  const gateDetailForm = {
    GateDetailId: 0,
    GateId: 0,
    SecurityId: null,
    Email: "",
    PhoneNumber: "",
    Address: "",
  };
  const gateFormik: any = useFormik({
    initialValues: gateForm,
    validationSchema: GateValidationSchema,
    onSubmit: (values: any, { resetForm }) => {
      setDisableSave(true);
      let List: any[] = [];
      for (let i = 0; i < gateDetailList.length; i++) {
        const x = gateDetailList[i];
        let obj: any = {};
        obj.GateDetailId = 0;
        obj.GateId = 0;
        obj.SecurityId = x.SecurityId;
        obj.Email = x.Email;
        obj.PhoneNumber = x.PhoneNumber;
        obj.Address = x.Address;
        List.push(obj);
      }
      if (!List || !List.length || List.length == 0) {
        setDisableSave(false);
        toast.current?.show({
          severity: "warn",
          summary: "Warn Message",
          detail: "Please Add Atleast One Security Details",
        });
        return;
      }

      values.GateOpenTime = new Date(values.GateOpenTime).toLocaleDateString(
        "en-US",
        {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }
      );
      values.GateCloseTime = new Date(values.GateCloseTime).toLocaleDateString(
        "en-US",
        {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }
      );

      let GateFormValue = {
        Gate: values,
        GateDetail: List,
      };
      if (isCreate == false) {
        const updateRes = dispatch(update(GateFormValue));
        updateRes
          .then((res) => {
            if (res.payload != null || !res.payload) {
              if (res.payload.transtatus.result == true) {
                setDisableSave(false);
                toast.current?.show({
                  severity: "success",
                  summary: "Success Message",
                  detail: res.payload.transtatus.lstErrorItem[0].Message,
                });
                setTimeout(() => {
                  route.push("/home/vGate");
                }, 800);
              } else {
                setDisableSave(false);
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
        const createRes = dispatch(create(GateFormValue));
        createRes
          .then((res) => {
            if (res.payload.transtatus.result == true) {
              setDisableSave(false);
              toast.current?.show({
                severity: "success",
                summary: "Success Message",
                detail: res.payload.transtatus.lstErrorItem[0].Message,
              });
              resetAllForm();
            } else if (res.payload.transtatus.result == false) {
              setDisableSave(false);
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
  const gateDetailFormik: any = useFormik({
    initialValues: gateDetailForm,
    validationSchema: GateDetailValidationSchema,
    onSubmit: (values: any, { resetForm }) => {
      let obj: any = {};
      obj.GateDetailId = 0;
      obj.SecurityId = values.SecurityId;
      obj.FirstName = SecurityList.find(
        (f) => f.UserId == values.SecurityId
      )?.UserName;
      // obj.FirstName = values.UserName;
      obj.Email = values.Email;
      obj.PhoneNumber = values.PhoneNumber;
      obj.Address = values.Address;
      let isexist =
        gateDetailList.filter((f) => f.FirstName == obj.FirstName) || [];
      if (isexist.length > 0 && obj.GateDetailId == 0) {
        toast.current?.show({
          severity: "warn",
          summary: "Warning Message",
          detail: "Security Already Exists",
        });
        return;
      }
      setGateDetailList([...gateDetailList, obj]);
      OnClear();
    },
  });
  const handleSelect = (name, other, value) => {
    gateFormik.setFieldValue(name, value);
  };
  const handleOnChange = (event) => {
    gateFormik.setFieldValue(event.target.name, event.value);
  };
  const handleCompanySelect = (name, other, value) => {
    gateFormik.setFieldValue("PlantId", null);
    gateFormik.setFieldValue(name, value);
    let Obj = {
      CompanyId: value,
    };
    dispatch(OnChangeCompany(Obj));
  };
  const handleSecuritySelect = (name, other, value) => {
    gateDetailFormik.setFieldValue(name, value);
    let obj = SecurityList.find((f) => f.UserId == value);
    gateDetailFormik.setFieldValue("Email", obj.UserEmail);
    gateDetailFormik.setFieldValue("PhoneNumber", obj.UserTelNo);
    gateDetailFormik.setFieldValue("Address", obj.Address);
  };
  const OnAdd = () => {
    let obj: any = {};
    obj.GateDetailId = 0;
    obj.SecurityId = gateFormik.values.gateDetailForm.SecurityId;
    obj.FirstName = SecurityList.find(
      (f) => f.EmployeeId == gateFormik.values.gateDetailForm.SecurityId
    ).FirstName;
    obj.Email = gateFormik.values.gateDetailForm.Email;
    obj.PhoneNumber = gateFormik.values.gateDetailForm.PhoneNumber;
    obj.Address = gateFormik.values.gateDetailForm.Address;
    setGateDetailList([...gateDetailList, obj]);
  };
  const OnClear = () => {
    gateDetailFormik.resetForm();
  };
  const onRowSelect = (rowData) => {};
  const resetAllForm = () => {
    gateFormik.resetForm();
    gateDetailFormik.resetForm();
    setGateDetailList([]);
    setPlantList([]);
  };
  return (
    <>
      <div className="page-container">
        <div className="inner-page-container">
          <div className="page-title">
            <div className="grid grid-nogutter">
              <div className="md:col-6">
                <h1>Gate</h1>
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
                      disabled={isView || DisableSave ? true : false}
                      onClick={() => gateFormik.handleSubmit()}
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
                      route.push("/home/vGate");
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          {!loading ? (
            <>
              <div className="form-container scroll-y">
                <GateForm
                  isCreate={isCreate}
                  isView={isView}
                  createEditData={createEditData}
                  loading={loading}
                  error={error}
                  StatusList={StatusList}
                  HdrTable={HdrTable}
                  EmployeeList={EmployeeList}
                  CompanyList={CompanyList}
                  PlantList={PlantList}
                  formik={gateFormik}
                  handleSelect={handleSelect}
                  handleOnChange={handleOnChange}
                  handleCompanySelect={handleCompanySelect}
                  OnChangeCompanyList={OnChangeCompanyList}
                  gateForm={gateForm}
                  gateRef={gateRef}
                  plantList={plantList}
                />
                <GateDetailForm
                  handleSecuritySelect={handleSecuritySelect}
                  SecurityList={SecurityList}
                  isCreate={isCreate}
                  isView={isView}
                  createEditData={createEditData}
                  loading={loading}
                  error={error}
                  StatusList={StatusList}
                  HdrTable={HdrTable}
                  CompanyList={CompanyList}
                  PlantList={PlantList}
                  formik={gateDetailFormik}
                  handleSelect={handleSelect}
                  OnAdd={OnAdd}
                  gateDetailList={gateDetailList}
                  gateDetailForm={gateDetailForm}
                  gateDetailRef={gateDetailRef}
                  OnClear={OnClear}
                  onRowSelect={onRowSelect}
                  setGateDetailList={setGateDetailList}
                  GateDetailList={GateDetailList}
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
export default CGate;
