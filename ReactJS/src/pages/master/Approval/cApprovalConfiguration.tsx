import React, { useState, useEffect, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage, useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import BasicDemo from "../../../alert/alert";
import {
  createInit,
  create,
  update,
  OnChangeRole,
} from "@/redux/slices/master/ApprovalSlice";
import {
  ApprovalDetailValidationSchema,
  ApprovalValidationSchema,
} from "@/validations/Master";
import {
  Button,
  Column,
  DataTable,
  Dropdown,
  InputText,
  Toast,
} from "@/assets/css/prime-library";
import { pageLoadScript } from "@/assets/js/common-utilities";
import { AppProgressSpinner } from "@/components/UtilityComp";
import FormFields from "@/components/FormFields";
import AppAlert from "../../../alert/alert";

const deleteTemplate = (
  rowData,
  rowInd,
  approvalDetailList,
  setApprovalDetailList,
  isView,
  setIsHostEnabled,
  headFormik,
  handleDSelect
) => {
  const OnDelete = () => {
    if(headFormik.values.DocumentId == 34){
      setIsHostEnabled(true)
    }else {
      setIsHostEnabled(false)
    }
    setApprovalDetailList([]);
    setApprovalDetailList(approvalDetailList.filter((f) => f != rowData));
    let tempLvl = rowData.LevelId
    handleDSelect("LevelId", {}, tempLvl)
  };
  return (
    <Button
      label=""
      severity="danger"
      title="Delete"
      icon="las la-trash"
      className="mr-2 p-1"
      disabled={isView || rowInd.rowIndex !== approvalDetailList.length - 1 ? true : false}
      onClick={() => OnDelete()}
    />
  );
};
const ApprovalForm = (props) => {
  const {
    isCreate,
    isView,
    createEditData,
    loading,
    error,
    StatusList,
    PlantList,
    DocumentList,
    ActivityList,
    LevelList,
    HdrTable,
    DetailList,
    ApprovalList,
    transtatus,
    approvalForm,
    formik,
    handleSelect,
    approvalDetailList,
    handlePlantSelect,
  } = props;
  return (
    <Formik
      initialValues={approvalForm}
      validationSchema={ApprovalValidationSchema}
      onSubmit={formik.handleSubmit}
    >
      <div className="white">
        <div className="widget-body">
          <div className="normal-table">
            <div className="grid">
              <FormFields
                type={"select"}
                name={"PlantId"}
                label={"Plant Name"}
                options={PlantList}
                show={true}
                required={true}
                disable={isView ? true : false}
                optionLabel={"PlantName"}
                optionValue={"PlantId"}
                handleSelect={handlePlantSelect}
                formik={formik}
                fldStyle={"col-12 md:col-3"}
              />
              <FormFields
                type={"select"}
                name={"DocumentId"}
                label={"Document Name"}
                options={DocumentList}
                show={true}
                required={true}
                disable={isView ? true : false}
                optionLabel={"FunctionName"}
                optionValue={"FunctionId"}
                handleSelect={handleSelect}
                formik={formik}
                fldStyle={"col-12 md:col-3"}
              />
              <FormFields
                type={"select"}
                name={"ApprovalActivityId"}
                label={"Operation / Activity"}
                options={ActivityList}
                show={true}
                required={true}
                disable={isView ? true : false}
                optionLabel={"MetaSubDescription"}
                optionValue={"MetaSubId"}
                handleSelect={handleSelect}
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
const ApprovalDetailForm = (props) => {
  const {
    filters,
    TableHeader,
    OnAdd,
    OnClear,
    onRowSelect,
    // setGateDetailList,
    isCreate,
    isView,
    createEditData,
    loading,
    error,
    StatusList,
    PlantList,
    DocumentList,
    ActivityList,
    LevelList,
    HdrTable,
    DetailList,
    ApprovalList,
    transtatus,
    approvalForm,
    formik,
    handleDSelect,
    approvalDetailList,
    RoleList,
    primaryUserList,
    handleRoleSelect,
    tempUserList,
    handlePrimaryUserSelect,
    tempUserListSecondary,
    setApprovalDetailList,
    rowselect,
    onClickSelfHostCheck,
    isHostChecked,
    isHostEnabled,
    setIsHostEnabled,
    headFormik
  } = props;
  return (
    <Formik
      initialValues={formik.approvalDetailForm}
      validationSchema={formik.ApprovalDetailValidationSchema}
      onSubmit={formik.handleSubmit}
    >
      <div className="white">
        <div className="widget-body">
          <div className="normal-table">
            <div className="page-title">
              <div className="grid grid-nogutter">
                <div className="md:col-6">
                  <h1>Approval Detail</h1>
                </div>
              </div>
            </div>
            <div className="grid">
              <FormFields
                type={"select"}
                name={"LevelId"}
                label={"Level Name"}
                options={LevelList}
                show={true}
                required={true}
                // disable={(isView ? true : false) || rowselect}
                disable={true}
                optionLabel={"MetaSubDescription"}
                optionValue={"MetaSubId"}
                handleSelect={handleDSelect}
                formik={formik}
                fldStyle={"col-12 md:col-3"}
              />
            </div>
            <div className="grid">
              <FormFields
                type={"checkbox"}
                name={"IsHost"}
                label={"Is Host User"}
                show={true}
                required={false}
                disable={isView || !isHostEnabled || rowselect ? true : false}
                handleChange={onClickSelfHostCheck}
                fldStyle={"col-12 md:col-3"}
                formik={formik}
              />
              <FormFields
                type={"select"}
                name={"RoleId"}
                label={"Role Name"}
                options={RoleList}
                show={true}
                required={true}
                disable={isView || isHostChecked ? true : false}
                optionLabel={"RoleName"}
                optionValue={"RoleId"}
                handleSelect={handleRoleSelect}
                formik={formik}
                fldStyle={"col-12 md:col-3"}
              />
              <FormFields
                type={"select"}
                name={"PrimaryUserId"}
                label={"Primary User Name"}
                options={tempUserList}
                show={true}
                required={true}
                disable={isView || isHostChecked ? true : false}
                optionLabel={"UserName"}
                optionValue={"UserId"}
                handleSelect={handlePrimaryUserSelect}
                formik={formik}
                fldStyle={"col-12 md:col-3"}
              />
              <FormFields
                type={"select"}
                name={"SecondaryUserId"}
                label={"Secondary User Name"}
                options={tempUserListSecondary}
                show={true}
                required={false}
                disable={isView || isHostChecked ? true : false}
                optionLabel={"UserName"}
                optionValue={"UserId"}
                handleSelect={handleDSelect}
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
                disabled={isView}
              />
              <Button
                label="Clear"
                severity="danger"
                icon="las la-trash"
                title="Clear"
                className="text-center"
                onClick={() => OnClear()}
                disabled={isView || rowselect ? true : false}
              />
            </div>
          </div>
          <div className="card">
            <DataTable
              value={approvalDetailList}
              showGridlines
              paginator
              filters={filters}
              filterDisplay="menu"
              globalFilterFields={[
                "LevelName",
                "RoleName",
                "UserName",
                "SecUserName",
              ]}
              header={TableHeader}
              emptyMessage="No Data Found."
              rows={5}
              rowsPerPageOptions={[5, 10, 25, 50]}
              tableStyle={{ minWidth: "50rem" }}
              // onRowDoubleClick={(e) => onRowSelect(e)}
            >
              <Column
                header="Action"
                style={{ textAlign: "center" }}
                body={(e, i) =>
                  deleteTemplate(
                    e,
                    i,
                    approvalDetailList,
                    setApprovalDetailList,
                    isView,
                    setIsHostEnabled,
                    headFormik,
                    handleDSelect
                  )
                }
              ></Column>
              <Column field="LevelName" header="Level"></Column>
              <Column field="RoleName" header="Role"></Column>
              <Column field="UserName" header="Primary User"></Column>
              <Column field="SecUserName" header="Secondary User"></Column>
            </DataTable>
          </div>
        </div>
      </div>
    </Formik>
  );
};

const CApproval = () => {
  const dispatch: any = useDispatch();
  const toast = useRef<Toast>(null);
  const route = useHistory();
  const [approvalDetailList, setApprovalDetailList] = useState([]);
  const [primaryUserList, setPrimaryUserList] = useState([]);
  const [tempUserList, setTempUserList] = useState([]);
  const [tempUserListSecondary, setTempUserListSecondary] = useState([]);
  const [rowIndex, setRowIndex] = useState(-1);
  const [rowselect, setRowSelect] = useState(false);
  const [isHostChecked, setIsHostChecked] = useState(false);
  const [isHostEnabled, setIsHostEnabled] = useState(false);
  const {
    isCreate,
    isView,
    createEditData,
    loading,
    error,
    StatusList,
    PlantList,
    DocumentList,
    ActivityList,
    LevelList,
    HdrTable,
    DetailList,
    ApprovalList,
    transtatus,
    RoleList,
    PrimaryUserList,
  } = useSelector((state: any) => state.approval);

  useEffect(() => {
    pageLoadScript();
  });

  useEffect(() => {
    setPrimaryUserList(PrimaryUserList);
  }, [PrimaryUserList]);

  useEffect(() => {
    if (isCreate == true) {
      const data = {
        ApprovalConfigurationId: 0,
        CompanyId: +localStorage["CompanyId"],
        PlantId: +localStorage["PlantId"],
        RoleId: +localStorage["DefaultRoleId"],
        Taskname: "CREATEINITIALIZE",
      };
      dispatch(createInit(data));
    } else {
      let List: any[] = [];
      for (let i = 0; i < DetailList.length; i++) {
        const x = DetailList[i];
        let obj: any = {};
        obj.ApprovalConfigurationDetailId = 0;
        obj.ApprovalConfigurationId = x.ApprovalConfigurationId ?? 0;
        obj.LevelId = x.LevelId;
        obj.RoleId = x.RoleId;
        obj.PrimaryUserId = x.PrimaryUserId;
        obj.SecondaryUserId = x.SecondaryUserId;
        obj.LevelName = LevelList.find(
          (f) => f.MetaSubId == x.LevelId
        ).MetaSubDescription;
        obj.RoleName = x.RoleId == 0 ? "Host" : RoleList && RoleList.length > 0 && RoleList.find((f) => f.RoleId == x.RoleId).RoleName;
        obj.UserName = x.RoleId == 0 ? "Host" : PrimaryUserList && PrimaryUserList.length > 0 && PrimaryUserList.find(
          (f) => f.UserId == x.PrimaryUserId
        ).UserName;
        if (obj.SecondaryUserId) {
          obj.SecUserName = x.RoleId == 0 ? "Host" : PrimaryUserList && PrimaryUserList.length > 0 && PrimaryUserList.find(
            (f) => f.UserId == x.SecondaryUserId
          ).UserName;
        }
        List.push(obj);
      }
      setApprovalDetailList(List);
    }
  }, []);
  const approvalForm = {
    ApprovalConfigurationId:
      HdrTable != null ? HdrTable.ApprovalConfigurationId : 0,
    CompanyId:
      HdrTable != null ? HdrTable.CompanyId : localStorage["CompanyId"],
    PlantId: HdrTable != null ? HdrTable.PlantId : +localStorage["PlantId"],
    DocumentId: HdrTable != null ? HdrTable.DocumentId : null,
    ApprovalActivityId: HdrTable != null ? HdrTable.ApprovalActivityId : 70,
    Status: HdrTable != null ? HdrTable.Status : 1,
    CreatedBy: HdrTable != null ? HdrTable.CreatedBy : localStorage["UserId"],
    CreatedOn: HdrTable != null ? HdrTable.CreatedOn : new Date(),
    ModifiedBy: HdrTable != null ? localStorage["UserId"] : null,
    ModifiedOn: HdrTable != null ? new Date() : null,
  };
  const approvalDetailForm = {
    ApprovalConfigurationDetailId: 0,
    ApprovalConfigurationId: 0,
    IsHost: false,
    LevelId: 67 || 68 || 69,
    RoleId: null,
    PrimaryUserId: null,
    SecondaryUserId: null,
    Status: null,
  };
  const approvalFormik: any = useFormik({
    initialValues: approvalForm,
    validationSchema: ApprovalValidationSchema,
    onSubmit: (values: any, { resetForm }) => {
      let List: any[] = [];
      if (
        !approvalDetailList ||
        !approvalDetailList.length ||
        approvalDetailList.length == 0
      ) {
        toast.current?.show({
          severity: "error",
          summary: "Error Message",
          detail: "Please Add Atleast One Item In The Grid.",
        });
        return;
      }
      for (let i = 0; i < approvalDetailList.length; i++) {
        const x = approvalDetailList[i];
        let obj: any = {};
        obj.ApprovalConfigurationDetailId = 0;
        obj.ApprovalConfigurationId = 0;
        obj.LevelId = x.LevelId;
        obj.RoleId = x.RoleId;
        obj.PrimaryUserId = x.PrimaryUserId;
        obj.SecondaryUserId = x.SecondaryUserId;
        obj.Status = x.Status;
        List.push(obj);
      }
      let ApprovalFormValue = {
        ApprovalConfiguration: values,
        ApprovalConfigurationDetail: List,
      };
      if (isCreate == false) {
        const updateRes = dispatch(update(ApprovalFormValue));
        updateRes
          .then((res) => {
            if (res.payload != null || !res.payload) {
              if (res.payload.transtatus.result == true) {
                toast.current?.show({
                  severity: "success",
                  summary: "Success Message",
                  detail: res.payload.transtatus.lstErrorItem[0].Message,
                });
                setTimeout(() => {
                  route.push("/home/vApprovalConfiguration");
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
        const createRes = dispatch(create(ApprovalFormValue));
        createRes
          .then((res) => {
            if (res.payload.transtatus.result == true) {
              toast.current?.show({
                severity: "success",
                summary: "Success Message",
                detail: res.payload.transtatus.lstErrorItem[0].Message,
              });
              resetAllForms();
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
  const resetAllForms = () => {
    approvalFormik.resetForm();
    approvalDetailFormik.resetForm();
    setTempUserList([]);
    setTempUserListSecondary([]);
    setApprovalDetailList([]);
  };
  const approvalDetailFormik: any = useFormik({
    initialValues: approvalDetailForm,
    validationSchema: ApprovalDetailValidationSchema,
    onSubmit: (values: any, { resetForm }) => {
      let obj: any = {};
      obj.ApprovalConfigurationDetailId = 0;
      obj.LevelId = values.LevelId;
      obj.RoleId = values.IsHost ? 0 : values.RoleId;
      obj.PrimaryUserId = values.IsHost ? 0 : values.PrimaryUserId;
      obj.SecondaryUserId = values.IsHost ? 0 : values.SecondaryUserId;
      obj.LevelName = LevelList.find(
        (f) => f.MetaSubId == values.LevelId
      ).MetaSubDescription;
      obj.RoleName = values.IsHost
        ? "Host"
        : RoleList && RoleList.length > 0
        ? RoleList.find((f) => f.RoleId == values.RoleId).RoleName
        : 0;
      obj.UserName = values.IsHost
        ? "Host"
        : tempUserList && tempUserList.length > 0
        ? tempUserList.find((f) => f.UserId == values.PrimaryUserId).UserName
        : 0;
      if (values.SecondaryUserId) {
        obj.SecUserName = tempUserListSecondary.find(
          (f) => f.UserId == values.SecondaryUserId
        ).UserName;
      }
      if (rowIndex == -1) {
        let isexist =
          approvalDetailList.filter((f) => f.LevelName == obj.LevelName) || [];
        let isUserexist =
          approvalDetailList.filter((f) => f.UserName == obj.UserName) || [];
        if (isexist.length > 0) {
          toast.current?.show({
            severity: "warn",
            summary: "Warning Message",
            detail: "Level Already Exists",
          });
          return;
        }
        if (isUserexist.length > 0) {
          toast.current?.show({
            severity: "warn",
            summary: "Warning Message",
            detail: "User Name Already Exists",
          });
          return;
        }
        setApprovalDetailList([...approvalDetailList, obj]);
        if(obj.RoleId == 0) {
          setIsHostEnabled(false);
        }
        setIsHostChecked(false);
        handleDSelect("LevelId", {}, 1)
      } else {
        let isexist =
          approvalDetailList.filter(
            (f) =>
              f.LevelName == obj.LevelName &&
              f.ApprovalConfigurationDetailId !=
                obj.ApprovalConfigurationDetailId
          ) || [];
        let isUserexist =
          approvalDetailList.filter((f) => f.UserName == obj.UserName) || [];
        if (isexist.length > 0) {
          toast.current?.show({
            severity: "warn",
            summary: "Warning Message",
            detail: "Level Already Exists",
          });
          return;
        }
        if (isUserexist.length > 0) {
          toast.current?.show({
            severity: "warn",
            summary: "Warning Message",
            detail: "User Name Already Exists",
          });
          return;
        }
        let List: any[] = approvalDetailList;
        List[rowIndex] = obj;
        setApprovalDetailList(List);
        if (List && List.some(item => item.RoleId === 0)) {
          setIsHostEnabled(false);
        }
        
        setIsHostChecked(false);
      }
      OnClear();
      setRowSelect(false);
      let tempLvl = values.LevelId != 69 ? values.LevelId + 1 : 119
      handleDSelect("LevelId", {}, tempLvl)
    },
  });
  const OnClear = () => {
    approvalDetailFormik.resetForm();
    setTempUserList([]);
    setTempUserListSecondary([]);
  };
  const handleSelect = (name, other, value) => {
    approvalFormik.setFieldValue(name, value);
    if (name == "DocumentId") {
      if (value == 34) {
        if(approvalDetailList && approvalDetailList.length > 0 && approvalDetailList.some(item => item.RoleId !== 0)) {
          setIsHostChecked(false);
          setIsHostEnabled(true);
        }
        else if (approvalDetailList.length == 0){
          setIsHostEnabled(true);
        }
        else {
          setIsHostChecked(false);
          setIsHostEnabled(false);
        }
      } else {
        setIsHostEnabled(false);
      }
    }
  };
  const handlePlantSelect = (name, other, value) => {
    approvalFormik.setFieldValue(name, value);
    approvalDetailFormik.setFieldValue("RoleId", "");
    approvalDetailFormik.setFieldValue("PrimaryUserId", "");
    approvalDetailFormik.setFieldValue("SecondaryUserId", "");
    setTempUserList([]);
    setTempUserListSecondary([]);
  };
  const handleDSelect = (name, other, value) => {
    approvalDetailFormik.setFieldValue(name, value);
  };
  const handlePrimaryUserSelect = (
    name,
    other,
    value,
    ListForOnRowSelect: any[] = []
  ) => {
    approvalDetailFormik.setFieldValue(name, value);
    let List: any[] = [];
    if (ListForOnRowSelect.length > 0) {
      List = ListForOnRowSelect.filter((f) => f.UserId != value);
    } else {
      List = tempUserList.filter((f) => f.UserId != value);
    }
    setTempUserListSecondary(List);
  };
  const handleRoleSelect = (
    name,
    other,
    value,
    type?: number,
    typevalue?: number
  ) => {
    approvalDetailFormik.setFieldValue(name, value);
    let Obj = {
      RoleId: value,
      PlantId: approvalFormik.values.PlantId,
    };
    const OnChangeRoleRes = dispatch(OnChangeRole(Obj));
    OnChangeRoleRes.then((res) => {
      if (res.payload.transtatus.result == true) {
        setTempUserList(res.payload.PrimaryUserList);
        if (type) {
          handlePrimaryUserSelect(
            "PrimaryUserId",
            {},
            typevalue,
            res.payload.PrimaryUserList
          );
        }
        setTempUserListSecondary([]);
      } else if (res.payload.transtatus.result == false) {
        toast.current?.show({
          severity: "error",
          summary: "Error Message",
          detail: res.payload.transtatus.lstErrorItem[0].Message,
        });
      }
    }).catch((error) => {
      toast.current?.show({
        severity: "error",
        summary: "Error Message",
        detail: JSON.stringify(error),
      });
    });
  };

  const onClickSelfHostCheck = (value) => {
    approvalDetailFormik.setFieldValue("IsHost", value?.checked);
    setIsHostChecked(value?.checked);
    approvalDetailFormik.setFieldValue("SecondaryUserId",null);
    approvalDetailFormik.setFieldValue("PrimaryUserId",null);
    approvalDetailFormik.setFieldValue("RoleId",null);
  };

  const onRowSelect = (rowData) => {
    if (!isView) {
      approvalDetailFormik.setFieldValue("", rowData);
      approvalDetailFormik.setFieldValue(
        "ApprovalConfigurationDetailId",
        rowData.data.ApprovalConfigurationDetailId
      );
      approvalDetailFormik.setFieldValue(
        "ApprovalConfigurationId",
        rowData.data.ApprovalConfigurationId
      );
      approvalDetailFormik.setFieldValue("LevelId", rowData.data.LevelId);
      handleRoleSelect(
        "RoleId",
        {},
        rowData.data.RoleId,
        1,
        rowData.data.PrimaryUserId
      );
      approvalDetailFormik.setFieldValue(
        "SecondaryUserId",
        rowData.data.SecondaryUserId
      );
      setRowIndex(rowData.index);
      setRowSelect(true);
    }
  };
  return (
    <>
      <div className="page-container">
        <div className="inner-page-container">
          <div className="page-title">
            <div className="grid grid-nogutter">
              <div className="md:col-6">
                <h1>Approval Configuration</h1>
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
                      onClick={() => approvalFormik.handleSubmit()}
                      disabled={isView ? true : false}
                    />
                    <Button
                      label=""
                      severity="danger"
                      icon="pi pi-trash"
                      title="Clear"
                      className="text-center"
                      disabled={isView || isCreate == false ? true : false}
                      onClick={() => resetAllForms()}
                    />
                  </>
                  <Button
                    label=""
                    icon="pi pi-search"
                    title="Back to Search"
                    className="p-button p-button-success text-center"
                    onClick={() => {
                      route.push("/home/vApprovalConfiguration");
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          {!loading ? (
            <>
              <div className="form-container scroll-y">
                <ApprovalForm
                  isCreate={isCreate}
                  isView={isView}
                  createEditData={createEditData}
                  loading={loading}
                  error={error}
                  HdrTable={HdrTable}
                  StatusList={StatusList}
                  PlantList={PlantList}
                  DocumentList={DocumentList}
                  ActivityList={ActivityList}
                  approvalForm={approvalForm}
                  formik={approvalFormik}
                  handleSelect={handleSelect}
                  handlePlantSelect={handlePlantSelect}
                />
                <ApprovalDetailForm
                  isCreate={isCreate}
                  isView={isView}
                  createEditData={createEditData}
                  loading={loading}
                  error={error}
                  StatusList={StatusList}
                  HdrTable={HdrTable}
                  handleDSelect={handleDSelect}
                  DetailList={DetailList}
                  approvalDetailForm={approvalDetailForm}
                  formik={approvalDetailFormik}
                  headFormik={approvalFormik}
                  LevelList={LevelList}
                  setApprovalDetailList={setApprovalDetailList}
                  approvalDetailList={approvalDetailList}
                  RoleList={RoleList}
                  primaryUserList={primaryUserList}
                  PrimaryUserList={PrimaryUserList}
                  OnClear={OnClear}
                  handleRoleSelect={handleRoleSelect}
                  tempUserList={tempUserList}
                  setTempUserList={setTempUserList}
                  handlePrimaryUserSelect={handlePrimaryUserSelect}
                  tempUserListSecondary={tempUserListSecondary}
                  onRowSelect={onRowSelect}
                  rowselect={rowselect}
                  onClickSelfHostCheck={onClickSelfHostCheck}
                  isHostChecked={isHostChecked}
                  isHostEnabled={isHostEnabled}
                  setIsHostEnabled={setIsHostEnabled}
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

export default CApproval;
