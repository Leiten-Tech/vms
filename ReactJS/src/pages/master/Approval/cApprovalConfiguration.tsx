import React, { useState, useEffect, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage, useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import {
  createInit,
  create,
  update,
  OnChangeRole,
  OnChangeDepartment,
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
    if (headFormik.values.DocumentId == 34) {
      setIsHostEnabled(true);
    } else {
      setIsHostEnabled(false);
    }
    setApprovalDetailList([]);
    setApprovalDetailList(approvalDetailList.filter((f) => f != rowData));
    let tempLvl = rowData.LevelId;
    handleDSelect("LevelId", {}, tempLvl);
  };
  return (
    <Button
      label=""
      severity="danger"
      title="Delete"
      icon="las la-trash"
      className="mr-2 p-1"
      disabled={
        isView || rowInd.rowIndex !== approvalDetailList.length - 1
          ? true
          : false
      }
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
    onNotiFyApproveChange,
    onDepartmentSpecificChange,
    isDepartmentSpecificEnabled
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
              <FormFields
                type={"checkbox"}
                name={"IsNotifyApprove"}
                label={"Is Only Notification ?"}
                show={true}
                disable={isView ? true : false}
                required={false}
                fldStyle="col-12 md:col-3"
                formik={formik}
                handleChange={onNotiFyApproveChange}
              />
              <FormFields
                type={"checkbox"}
                name={"IsDepartmentSpecific"}
                label={"Is Department Specific ?"}
                show={true}
                disable={isView || isDepartmentSpecificEnabled ? true : false}
                required={false}
                fldStyle="col-12 md:col-3"
                formik={formik}
                handleChange={onDepartmentSpecificChange}
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
    DepartmentList,
    primaryUserList,
    handleRoleSelect,
    handleDepartmentSelect,
    tempUserList,
    handlePrimaryUserSelect,
    tempUserListSecondary,
    setApprovalDetailList,
    rowselect,
    onClickSelfHostCheck,
    deptType,
    isHostChecked,
    isPrimaryEnabled,
    isDeptEnabled,
    isDepartmentSpecificChecked,
    isHostEnabled,
    setIsHostEnabled,
    headFormik,
  } = props;

  const dispatch: any = useDispatch();
  const toast = useRef<Toast>(null);

  const [tempUserMap, setTempUserMap] = useState<{ [deptId: number]: any[] }>(
    {}
  );

  const handleUserChange = (e, index, field) => {
    const updatedList = [...approvalDetailList];
    updatedList[index][field] = e.value;

    // Also update UserName if needed
    if (field === "PrimaryUserId") {
      const selectedUser = tempUserList.find((u) => u.UserId === e.value);
      updatedList[index].UserName = selectedUser?.UserName ?? "";
    }

    setApprovalDetailList(updatedList);
  };

  const onDropdownOpen = (rowData) => {
    const deptId = rowData.DepartmentId;

    if (!deptId || tempUserMap[deptId]) return;

    try {
      let obj = {
        DepartmentId: deptId,
        PlantId: +localStorage["PlantId"],
      };
      dispatch(OnChangeDepartment(obj)).then((res) => {
        setTempUserMap((prev) => ({
          ...prev,
          [deptId]: res.payload?.PrimaryUserList || [],
        }));
      });
    } catch (error) {
      console.warn("Error fetching users for department:", error);
    }
  };

  const renderPrimaryUserDropdown = (rowData, rowIndex) => {
    if (rowData.DepartmentId === 0) {
      return <span>Host</span>;
    }

    const departmentUsers = rowData.availableUsers && 
    rowData.availableUsers.length > 0 &&
    rowData.availableUsers.filter(
      (u) => u.DeptId === rowData.DepartmentId
    );

    const usedUserIdsInSameDept = approvalDetailList
      ?.filter(
        (item, i) =>
          i !== rowIndex &&
          item.DepartmentId === rowData.DepartmentId &&
          item.PrimaryUserId !== 0
      )
      .map((item) => item.PrimaryUserId);

    const availableUsers = departmentUsers?.filter(
      (u) => !usedUserIdsInSameDept.includes(u.UserId)
    );

    return (
      <Dropdown
        value={rowData.PrimaryUserId}
        options={availableUsers}
        style={{
          maxWidth: "15rem",
          width: "15rem",
          minWidth: "15rem",
        }}
        optionLabel="UserName"
        optionValue="UserId"
        onChange={(e) => handleUserChange(e, rowIndex, "PrimaryUserId")}
        placeholder="Select User"
      />
    );
  };

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
                disable={isView || rowselect || !isHostEnabled ? true : false}
                handleChange={onClickSelfHostCheck}
                fldStyle={"col-12 md:col-3"}
                formik={formik}
              />
              {/* <FormFields
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
              /> */}

              <FormFields
                type={deptType}
                name={"DeptId"}
                label={"Department Name"}
                options={DepartmentList}
                show={true}
                required={true}
                disable={isView || isHostChecked || !isDeptEnabled}
                optionLabel={"DepartmentName"}
                optionValue={"DepartmentId"}
                handleSelect={handleDepartmentSelect}
                formik={formik}
                fldStyle={"col-12 md:col-3"}
              />
              <FormFields
                type={"select"}
                name={"PrimaryUserId"}
                label={"Primary User Name"}
                options={tempUserList}
                show={isPrimaryEnabled ? true : false}
                required={true}
                disable={isView || isHostChecked}
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
                show={false}
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
                "DepartmentName",
                "UserName",
                "SecUserName",
              ]}
              header={TableHeader}
              emptyMessage="No Data Found."
              rows={10}
              rowsPerPageOptions={[10, 25, 50]}
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
              {/* <Column field="RoleName" header="Role"></Column> */}
              <Column field="DepartmentName" header="Department"
              
              ></Column>
              {/* <Column field="UserName" header="Primary User"></Column> */}
              <Column
                field="PrimaryUserId"
                header="Primary User"
                style={{
                   minWidth: "30rem", 
                   width: "30rem",
                   maxWidth: "30rem",
                   }}
                body={(rowData, options) =>
                  renderPrimaryUserDropdown(rowData, options.rowIndex)
                }
              />

              {/* <Column field="SecUserName" header="Secondary User"></Column> */}
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
  const [isDepartmentSpecificChecked, setIsDepartmentSpecificChecked] =
    useState(false);
  const [isDepartmentSpecificEnabled, setIsDepartmentSpecificEnabled] =
    useState(true);
  const [isHostEnabled, setIsHostEnabled] = useState(false);
  const [isDeptEnabled, setIsDeptEnabled] = useState(true);
  const [isPrimaryEnabled, setIsPrimaryEnabled] = useState(true);
  const [deptType, setDeptType] = useState("select");
  const [triggerEffect, setTriggerEffect] = useState(0);
  
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
    DepartmentList,
    PrimaryUserList,
    IsDep,
  } = useSelector((state: any) => state.approval);

  useEffect(() => {
    pageLoadScript();
  });

  useEffect(() => {
    setPrimaryUserList(PrimaryUserList);
  }, [PrimaryUserList]);

  useEffect(() => {
  // Small defer to batch updates
  const timeout = setTimeout(() => {
    setTriggerEffect((prev) => prev + 1);
  }, 0);
  return () => clearTimeout(timeout);
}, [isHostChecked, isDepartmentSpecificChecked, DepartmentList]);

useEffect(() => {
  if (isHostChecked) {
    // approvalDetailFormik.setFieldValue("DeptId", []);
  } else if (isDepartmentSpecificChecked && DepartmentList && DepartmentList.length > 0) {
    const deptIds = DepartmentList.map((d) => d.DepartmentId);
    approvalDetailFormik.setFieldValue("DeptId", deptIds);
    allDeptSelect(deptIds);
  }
}, [triggerEffect]);

  const allDeptSelect = async (deptids) => {
    let allUsers: any[] = [];

    const payload = {
      DepartmentIds: deptids,
      PlantId: approvalFormik.values.PlantId,
    };

    try {
      const res = await dispatch(OnChangeDepartment(payload));

      if (res.payload?.transtatus?.result === true) {
        const primaryUsers = res.payload.PrimaryUserList || [];
        const usersWithDepts = primaryUsers.map((u) => ({
          ...u,
          DepartmentIds: deptids, 
        }));
        allUsers.push(...usersWithDepts);
        // deptids &&
        //   deptids.length > 0 &&
        //   deptids.forEach((element) => {
        //     // Optional: assign department ID to each user to track
        //     const usersWithDept = primaryUsers.map((u) => ({
        //       ...u,
        //       DepartmentId: element,
        //     }));

        //     allUsers.push(...usersWithDept);
        //   });
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail:
            res.payload.transtatus.lstErrorItem[0]?.Message || "Fetch failed",
        });
      }
      setTempUserList((prev) => {
        const merged = [...prev];

        allUsers.forEach((newUser) => {
          const alreadyExists = prev.some(
            (u) =>
              u.UserId === newUser.UserId &&
              u.DepartmentId === newUser.DepartmentId
          );
          if (!alreadyExists) {
            merged.push(newUser);
          }
        });

        return merged;
      });
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error Message",
        detail: `Error loading department ${deptids}: ${JSON.stringify(error)}`,
      });
    }
  };

  useEffect(() => {
    if (isCreate == true) {
      const data = {
        ApprovalConfigurationId: 0,
        CompanyId: +localStorage["CompanyId"],
        PlantId: +localStorage["PlantId"],
        RoleId: +localStorage["DefaultRoleId"],
        DepartmentId: +localStorage["DeptId"],
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
        obj.DepartmentId = x.DepartmentId;
        obj.PrimaryUserId = x.PrimaryUserId;
        obj.SecondaryUserId = x.SecondaryUserId;
        obj.availableUsers = PrimaryUserList;
        obj.LevelName = LevelList.find(
          (f) => f.MetaSubId == x.LevelId
        ).MetaSubDescription;
        // obj.RoleName = x.RoleId == 0 ? "Host" : RoleList && RoleList.length > 0 && RoleList.find((f) => f.RoleId == x.RoleId).RoleName;
        obj.DepartmentName =
          x.DepartmentId == 0
            ? "Host"
            : DepartmentList &&
              DepartmentList.length > 0 &&
              DepartmentList.find((f) => f.DepartmentId == x.DepartmentId)
                .DepartmentName;

        const user = PrimaryUserList?.find((f) => f.UserId == x.PrimaryUserId);
        obj.UserName = x.DepartmentId == 0 ? "Host" : user?.UserName ?? "";
        // obj.UserName =
        //   x.DepartmentId == 0
        //     ? "Host"
        //     : PrimaryUserList &&
        //       PrimaryUserList.length > 0 &&
        //       PrimaryUserList.find((f) => f.UserId == x.PrimaryUserId).UserName;
        if (obj.SecondaryUserId) {
          obj.SecUserName =
            x.RoleId == 0
              ? "Host"
              : PrimaryUserList &&
                PrimaryUserList.length > 0 &&
                PrimaryUserList.find((f) => f.UserId == x.SecondaryUserId)
                  .UserName;
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
    IsNotifyApprove: HdrTable != null ? HdrTable.IsNotifyApprove : false,
    IsDepartmentSpecific:
      HdrTable != null ? HdrTable.IsDepartmentSpecific : null,
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
    DepartmentId:
      DepartmentList &&
      DepartmentList.length > 0 &&
      DepartmentList.map((d) => d.DepartmentId),
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
        obj.DepartmentId = x.DepartmentId;
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
    setIsDepartmentSpecificEnabled(true)
    setDeptType("select")
  };

  const approvalDetailFormik: any = useFormik({
    initialValues: approvalDetailForm,
    validationSchema: ApprovalDetailValidationSchema,
    onSubmit: (values: any, { resetForm }) => {
      
      if (approvalFormik.values.DocumentId == null || !approvalFormik.values.DocumentId) {
        toast.current?.show({
          severity: "warn",
          summary: "Warning",
          detail: "Please select Document.",
          life: 4000,
        });
        return;
      }
      const isDeptSpecific = approvalFormik.values.IsDepartmentSpecific;

      if (!values.IsHost && !isDeptSpecific && !values.DeptId) {
        toast.current?.show({
          severity: "warn",
          summary: "Warning",
          detail: "Please select Is Host or Department-specific user.",
          life: 4000,
        });
        return;
      }

      const LevelName = LevelList.find(
        (f) => f.MetaSubId == values.LevelId
      )?.MetaSubDescription;

      let rowsToAdd: any[] = [];

      if (values.IsHost) {
        rowsToAdd.push({
          ApprovalConfigurationDetailId: 0,
          LevelId: values.LevelId,
          LevelName,
          IsNotifyApprove: values.IsNotifyApprove,
          RoleId: 0,
          DepartmentId: 0,
          DepartmentName: "Host",
          PrimaryUserId: 0,
          UserName: "Host",
          SecondaryUserId: 0,
          SecUserName: "",
        });
      } else if (isDeptSpecific) {
        (Array.isArray(values.DepartmentId) ? values.DepartmentId : values.DeptId).forEach((deptId) => {
          const dept = DepartmentList.find((d) => d.DepartmentId === deptId);

          const hasUsers = tempUserList.some((u) => u.DeptId === deptId);
          if (!hasUsers) return;

          rowsToAdd.push({
            ApprovalConfigurationDetailId: 0,
            LevelId: values.LevelId,
            LevelName,
            IsNotifyApprove: values.IsNotifyApprove,
            RoleId: values.RoleId,
            DepartmentId: deptId,
            DepartmentName: dept?.DepartmentName ?? "",
            availableUsers: tempUserList,
            PrimaryUserId: 0,
            UserName: "",
            SecondaryUserId: 0,
            SecUserName: "",
          });
        });
      } else if(
        (values.DeptId && values.DeptId != null)||
        (values.PrimaryUserId && values.PrimaryUserId != null) || 
       values.SecondaryUserId && values.SecondaryUserId!= null) {
        const dept = DepartmentList.find(
          (d) => d.DepartmentId === values.DeptId
        );
        const user = tempUserList.find(
          (u) => u.UserId === values.PrimaryUserId
        );
        const secUser = tempUserListSecondary.find(
          (u) => u.UserId === values.SecondaryUserId
        );

        rowsToAdd.push({
          ApprovalConfigurationDetailId: 0,
          LevelId: values.LevelId,
          LevelName,
          IsNotifyApprove: values.IsNotifyApprove,
          RoleId: values.RoleId,
          DepartmentId: values.DeptId,
          DepartmentName: dept?.DepartmentName ?? "",
          PrimaryUserId: values.PrimaryUserId,
          UserName: user?.UserName ?? "",
          SecondaryUserId: values.SecondaryUserId,
          SecUserName: secUser?.UserName ?? "",
          availableUsers: tempUserList,
        });
      }

      for (let newRow of rowsToAdd) {
        const sameLevelSameDeptExists = approvalDetailList.some(
          (f) =>
            f.LevelId === newRow.LevelId &&
            f.DepartmentId === newRow.DepartmentId
        );

        if (sameLevelSameDeptExists) {
          toast.current?.show({
            severity: "warn",
            summary: "Warning Message",
            detail: `Level already exists.`,
          });
          return;
        }

        const isHostAlreadyUsed = approvalDetailList.some(
          (entry) => entry.DepartmentId === 0
        );

        if (newRow.DepartmentId === 0 && isHostAlreadyUsed) {
          toast.current?.show({
            severity: "warn",
            summary: "Warning Message",
            detail: "Host is already assigned in another level.",
          });
          return;
        }

        if (newRow.PrimaryUserId !== 0) {
          const isSameUserUsedInSameDept = approvalDetailList.some(
            (entry) =>
              entry.DepartmentId === newRow.DepartmentId &&
              entry.PrimaryUserId === newRow.PrimaryUserId
          );
          if (isSameUserUsedInSameDept) {
            toast.current?.show({
              severity: "warn",
              summary: "Warning Message",
              detail: `User already assigned for this department at another level.`,
            });
            return;
          }
        }
      }

      setApprovalDetailList([...approvalDetailList, ...rowsToAdd]);

      if (values.IsHost) setIsHostEnabled(false);
      setIsHostChecked(false);
      approvalDetailFormik.setFieldValue("IsHost", false);
      setIsDepartmentSpecificChecked(false);
      if(approvalDetailList && approvalDetailList.length > 0) {
        let lastLvlId = approvalDetailList[approvalDetailList.length - 1].LevelId
        handleDSelect("LevelId", {}, lastLvlId != 69 ? lastLvlId + 1 : 119);
      }
      setRowSelect(false);

      const nextLevel = values.LevelId != 69 ? values.LevelId + 1 : 119;
      handleDSelect("LevelId", {}, nextLevel);
    },
  });

  const OnClear = () => {
    setIsHostEnabled(true)
    const currDeptIds = approvalDetailFormik.values.DeptId;
    if(approvalFormik.values.IsDepartmentSpecific) {

      approvalDetailFormik.resetForm({
        values: {
          ...approvalDetailFormik.initialValues,
          DeptId: currDeptIds,
        },
      });
    }
    else {
      approvalDetailFormik.resetForm()
    }

    if(approvalDetailList && approvalDetailList.length > 0) {
      let lastLvlId = approvalDetailList[approvalDetailList.length - 1].LevelId
      handleDSelect("LevelId", {}, lastLvlId != 69 ? lastLvlId + 1 : 119);
    }
    else {
      handleDSelect("LevelId", {}, 67);
    }
    // // setApprovalDetailList([]);
    setTempUserList([]);
    setTempUserListSecondary([]);
  };

  const handleSelect = (name, other, value) => {
    approvalFormik.setFieldValue(name, value);
    if (name == "DocumentId") {
      if (value == 34) {
        setIsDepartmentSpecificEnabled(false)
        if(isDepartmentSpecificChecked){
          setDeptType("multi_select");
        }
        else {
          setDeptType("select");
        }
        if (
          approvalDetailList &&
          approvalDetailList.length > 0 &&
          approvalDetailList.some((item) => item.RoleId !== 0)
        ) {
          setIsHostChecked(false);
          setIsHostEnabled(true);
        } else if (approvalDetailList.length == 0) {
          setIsHostEnabled(true);
        } else {
          setIsHostChecked(false);
          setIsHostEnabled(false);
        }
      } else {
        setIsHostEnabled(false);
        // setIsDepartmentSpecificEnabled(true)
        // setIsDepartmentSpecificChecked(false)
        setDeptType("select");
        onDepartmentSpecificChange({
          checked: false
        })
      }
    }
  };
  const handlePlantSelect = (name, other, value) => {
    approvalFormik.setFieldValue(name, value);
    approvalDetailFormik.setFieldValue("RoleId", "");
    approvalDetailFormik.setFieldValue("DepartmentId", "");
    approvalDetailFormik.setFieldValue("PrimaryUserId", "");
    approvalDetailFormik.setFieldValue("SecondaryUserId", "");
    // setTempUserList([]);
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

  const handleDepartmentSelect = async (
    name,
    other,
    value,
    type?: number,
    typevalue?: number
  ) => {
    approvalDetailFormik.setFieldValue(name, value);

    // If value is not array, wrap it in an array
    const selectedDeptIds = Array.isArray(value) ? value : [value];

    let allUsers: any[] = [];

    // for (const deptId of selectedDeptIds) {
    const payload = {
      DepartmentIds: selectedDeptIds,
      PlantId: approvalFormik.values.PlantId,
    };

    try {
      const res = await dispatch(OnChangeDepartment(payload));

      if (res.payload?.transtatus?.result === true) {
        const primaryUsers = res.payload.PrimaryUserList || [];
        let usersWithDept = [];
        selectedDeptIds &&
          selectedDeptIds.length > 0 &&
          selectedDeptIds.forEach((element) => {
            // Optional: assign department ID to each user to track
            usersWithDept = primaryUsers.map((u) => ({
              ...u,
              DepartmentId: element,
            }));
          });

        allUsers.push(...usersWithDept);

        // If called with a special type (used somewhere in your logic)
        if (type) {
          handlePrimaryUserSelect(
            "PrimaryUserId",
            {},
            typevalue,
            res.payload.PrimaryUserList
          );
        }
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail:
            res.payload.transtatus.lstErrorItem[0]?.Message || "Fetch failed",
        });
      }
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error Message",
        detail: `Error loading departments: ${JSON.stringify(error)}`,
      });
    }
    // }
    setTempUserList([])
    setTempUserList((prev) => {
      const merged = [...prev];

      allUsers.forEach((newUser) => {
        const alreadyExists = prev.some(
          (u) =>
            u.UserId === newUser.UserId &&
            u.DepartmentId === newUser.DepartmentId
        );
        if (!alreadyExists) {
          merged.push(newUser);
        }
      });

      return merged;
    });

    // setTempUserListSecondary([]);
  };

  const onNotiFyApproveChange = (value) => {
    approvalFormik.setFieldValue("IsNotifyApprove", value?.checked);
  };
  const onDepartmentSpecificChange = (e) => {
    const isChecked = e.checked;
    setIsDepartmentSpecificChecked(isChecked);
    setIsHostEnabled(true)
    approvalFormik.setFieldValue("IsDepartmentSpecific", isChecked);
    if(isChecked){
      setDeptType("multi_select")
      setIsPrimaryEnabled(false)
      // allDeptSelect(DepartmentList.map(item => item.DepartmentId));
    }
    else {
      setIsPrimaryEnabled(true)
      setDeptType("select")
    }
    if(isChecked && approvalDetailList && approvalDetailList.length > 0) {
      setApprovalDetailList([])
      OnClear()
    }
    if(isChecked) {
      approvalDetailFormik.setFieldValue("DeptId", DepartmentList.map(item => item.DepartmentId));
      setIsDeptEnabled(false)
    }
    else {
      setIsDeptEnabled(true)
      setApprovalDetailList([])
    }
    approvalDetailFormik.resetForm();
    handleDSelect("LevelId", {}, 67);
    setTempUserList([]);
    setTempUserListSecondary([]);
  };

  const onClickSelfHostCheck = (value) => {
    approvalDetailFormik.setFieldValue("IsHost", value?.checked);
    setIsHostChecked(value?.checked);
    approvalDetailFormik.setFieldValue("SecondaryUserId", null);
    approvalDetailFormik.setFieldValue("PrimaryUserId", null);
    approvalDetailFormik.setFieldValue("RoleId", null);
    approvalDetailFormik.setFieldValue("DepartmentId", null);
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
      // handleRoleSelect(
      //   "RoleId",
      //   {},
      //   rowData.data.RoleId,
      //   1,
      //   rowData.data.PrimaryUserId
      // );
      handleDepartmentSelect(
        "DepartmentId",
        {},
        rowData.data.DepartmentId,
        1,
        rowData.data.PrimaryUserId
      );
      approvalDetailFormik.setFieldValue(
        "PrimaryUserId",
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
                  onNotiFyApproveChange={onNotiFyApproveChange}
                  onDepartmentSpecificChange={onDepartmentSpecificChange}
                  isDepartmentSpecificEnabled={isDepartmentSpecificEnabled}
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
                  DepartmentList={DepartmentList}
                  primaryUserList={primaryUserList}
                  PrimaryUserList={PrimaryUserList}
                  OnClear={OnClear}
                  handleRoleSelect={handleRoleSelect}
                  handleDepartmentSelect={handleDepartmentSelect}
                  tempUserList={tempUserList}
                  setTempUserList={setTempUserList}
                  handlePrimaryUserSelect={handlePrimaryUserSelect}
                  tempUserListSecondary={tempUserListSecondary}
                  onRowSelect={onRowSelect}
                  rowselect={rowselect}
                  onClickSelfHostCheck={onClickSelfHostCheck}
                  isHostChecked={isHostChecked}
                  isDepartmentSpecificChecked={isDepartmentSpecificChecked}
                  isHostEnabled={isHostEnabled}
                  setIsHostEnabled={setIsHostEnabled}
                  deptType={deptType}
                  isDeptEnabled={isDeptEnabled}
                  isPrimaryEnabled={isPrimaryEnabled}
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
