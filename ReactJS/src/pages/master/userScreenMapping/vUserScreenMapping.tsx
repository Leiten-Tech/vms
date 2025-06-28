import React, { useState, useEffect, useRef } from "react";
import { DataTable, Column, Toast } from "../../../assets/css/prime-library";
import {
  Button,
  InputText,
  FilterMatchMode,
  Dropdown,
  MultiSelect,
} from "../../../assets/css/prime-library";
import { Checkbox } from "primereact/checkbox";
import { useDispatch, useSelector } from "react-redux";
import {
  createInit,
  GetUser,
  getTable,
  saveUserScreen,
} from "@/redux/slices/master/userScreenMapppingSlice";
import AppAlert from "../../../alert/alert";
import { UserScreenValidationSchema } from "@/validations/Master";
import { pageLoadScript } from "@/assets/js/common-utilities";
import { Formik, useFormik } from "formik";
import { AppProgressSpinner } from "@/components/UtilityComp";

const VUserScreenMapping = () => {
  const dispatch: any = useDispatch();
  const toast = useRef<Toast>(null);
  const { ModuleList, RoleMasterList, UserList, loading, UserScreens } =
    useSelector((state: any) => state.userScreenMapping);
  useEffect(() => {
    pageLoadScript();
  });
  const [roleList, setRoleList] = useState([]);
  const [buttonDisable, setButtonDisable] = useState(false);
  const [userNameList, setUserNameList] = useState([]);
  const [totalgridlist, settotalgridlist] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedName, setSelectedName] = useState("");
  const [moduleNameList, setModuleNameList] = useState([]);
  const [moduleName, setModuleName] = useState(null);
  const [userScreens, setUserScreens] = useState<any>([]);

  const formik: any = useFormik({
    initialValues: {
      Role: null,
      User: null,
      Module: null,
    },
    validationSchema: UserScreenValidationSchema,
    onSubmit: (values: any, { resetForm }) => {
      SaveData();
    },
  });

  useEffect(() => {
    if (UserScreens != null) {
      setButtonDisable(false);
      setUserScreens(UserScreens);
    }
  }, [UserScreens]);

  useEffect(() => {
    const data = {
      RoleId: localStorage["DefaultRoleId"],
      CompanyId: localStorage["CompanyId"],
    };
    dispatch(createInit(data));
    setUserScreens([]);
  }, []);

  useEffect(() => {
    if (RoleMasterList != null) {
      setRoleList(RoleMasterList);
    }
  }, [RoleMasterList]);

  useEffect(() => {
    if (UserList != null) {
      setUserNameList(UserList);
    }
  }, [UserList]);

  useEffect(() => {
    if (ModuleList != null) {
      setModuleNameList(ModuleList);
    }
  }, [ModuleList]);

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters["global"].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };
  const [globalFilterValue, setGlobalFilterValue] = useState<string>("");
  const renderHeader = () => {
    return (
      <div className="flex justify-content-start">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Search"
          />
        </span>
      </div>
    );
  };
  const header = renderHeader();
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [dataCreate, setDataCreate] = useState(false);
  const [dataUpdate, setDataUpdate] = useState(false);
  const [dataDelete, setDataDelete] = useState(false);
  const [dataView, setDataView] = useState(false);
  const [dataPrint, setDataPrint] = useState(false);
  const [dataApproval, setDataApproval] = useState(false);
  const customHeaderTemplate = (a: any) => (
    <div>
      <div>{a}</div>
      {a == "Create" ? (
        <Checkbox
          value={a}
          checked={dataCreate}
          onChange={() => {
            toggleAllCheckboxes(a);
          }}
        />
      ) : a == "Update" ? (
        <Checkbox
          value={a}
          checked={dataUpdate}
          onChange={() => {
            toggleAllCheckboxes(a);
          }}
        />
      ) : a == "Delete" ? (
        <Checkbox
          value={a}
          checked={dataDelete}
          onChange={() => {
            toggleAllCheckboxes(a);
          }}
        />
      ) : a == "View" ? (
        <Checkbox
          value={a}
          checked={dataView}
          onChange={() => {
            toggleAllCheckboxes(a);
          }}
        />
      ) : a == "Print" ? (
        <Checkbox
          value={a}
          checked={dataPrint}
          onChange={() => {
            toggleAllCheckboxes(a);
          }}
        />
      ) : a == "Approval" ? (
        <Checkbox
          value={a}
          checked={dataApproval}
          onChange={() => {
            toggleAllCheckboxes(a);
          }}
        />
      ) : (
        ""
      )}
    </div>
  );

  const customBodyTemplate = (rowData: any, columnName: any) => (
    <Checkbox
      checked={rowData[columnName]}
      onChange={() => toggleCheckbox(rowData, columnName, [])}
    />
  );

  const toggleCheckbox = (rowData: any, columnName: any, List: any[]) => {
    const updatedData = (List.length > 0 ? List : userScreens).map((item) =>
      item === rowData ? { ...item, [columnName]: !item[columnName] } : item
    );
    setUserScreens(updatedData);
    const allChecked = updatedData.every((item) => item[columnName]);
    if (columnName == "Create") setDataCreate(allChecked);
    if (columnName == "Update") setDataUpdate(allChecked);
    if (columnName == "Delete") setDataDelete(allChecked);
    if (columnName == "View") setDataView(allChecked);
    if (columnName == "Print") setDataPrint(allChecked);
    if (columnName == "Approval") setDataApproval(allChecked);
  };

  const onChangeUser = (e: any) => {
    formik.setFieldValue("User", e.value);
    setSelectedName(e.value);
  };
  const toggleAllCheckboxes = (a: any) => {
    const allChecked = userScreens.every((item) => item[a]);
    const updatedData = userScreens.map((item: any) => ({
      ...item,
      [a]: !allChecked,
    }));
    setUserScreens(updatedData);
    if (a == "Create") setDataCreate(!dataCreate);
    if (a == "Update") setDataUpdate(!dataUpdate);
    if (a == "Delete") setDataDelete(!dataDelete);
    if (a == "View") setDataView(!dataView);
    if (a == "Print") setDataPrint(!dataPrint);
    if (a == "Approval") setDataApproval(!dataApproval);
  };

  const SaveData = () => {
    const isAtLeastOneItemSelected = userScreens.some(
      (item) =>
        item.Create ||
        item.Update ||
        item.Delete ||
        item.View ||
        item.Print ||
        item.Approval
    );

    if (!isAtLeastOneItemSelected) {
      toast.current?.show({
        severity: "warn",
        detail: "At least one item must be selected",
        summary: "Warning Message",
      });
      return;
    }
    const saveValues = userScreens.map((item: any) => ({
      UserScreenMappingId: 0,
      UserId: formik.values["User"],
      RoleId: item.RoleId,
      CompanyId: +localStorage["CompanyId"],
      ModuleId: item.ModuleId,
      ScreenId: item.ScreenId,
      Create: item.Create,
      Update: item.Update,
      Delete: item.Delete,
      View: item.View,
      Print: item.Print,
      Approval: item.Approval,
      Status: 1,
      CreatedBy: +localStorage["UserId"],
      CreatedOn: new Date(),
      ModifiedBy: +localStorage["UserId"],
      ModifiedOn: new Date(),
    }));

    const updateRes = dispatch(
      saveUserScreen({ UserScreenMapping: saveValues })
    );
    updateRes
      .then((res) => {
        if (res.payload != null || !res.payload) {
          if (res.payload.transtatus.result == true) {
            toast.current?.show({
              severity: "success",
              summary: "Success Message",
              detail: res.payload.transtatus.lstErrorItem[0].Message,
            });
            resetScreen();
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
  };

  const onChangeModules = (e) => {
    if (e.value.length == 0) {
      formik.setFieldValue("Module", null);
    } else {
      formik.setFieldValue("Module", e.value);
    }
    setModuleName(e.value);
    if (formik.values["User"]) {
      let obj = {
        RoleId: selectedRole,
        UserId: selectedName,
        ModuleId: e.value,
      };
      ServiceCall(obj);
    } else {
      setUserScreens([]);
    }
  };

  const ServiceCall = (obj: any) => {
    var result = dispatch(getTable(obj));
    result
      .then((res) => {
        if (res.payload.transtatus.result) {
          let allScreens = res.payload.UserScreens;
          allScreens = allScreens.map((element) => ({
            ...element,
            Create: element.Create == 1 ? true : false,
            Update: element.Update == 1 ? true : false,
            Delete: element.Delete == 1 ? true : false,
            View: element.View == 1 ? true : false,
            Print: element.Print == 1 ? true : false,
            Approval: element.Approval == 1 ? true : false,
          }));
          setUserScreens(allScreens);
          const isKeyTrueForAll = (allScreens, key) => {
            return allScreens.every((item) => item[key] === true);
          };
          
          isKeyTrueForAll(allScreens, "Create")
            ? setDataCreate(true)
            : setDataCreate(false);
          isKeyTrueForAll(allScreens, "Update")
            ? setDataUpdate(true)
            : setDataUpdate(false);
          isKeyTrueForAll(allScreens, "Delete")
            ? setDataDelete(true)
            : setDataDelete(false);
          isKeyTrueForAll(allScreens, "View")
            ? setDataView(true)
            : setDataView(false);
          isKeyTrueForAll(allScreens, "Print")
            ? setDataPrint(true)
            : setDataPrint(false);
          isKeyTrueForAll(allScreens, "Approval")
            ? setDataApproval(true)
            : setDataApproval(false);
        }
      })
      .catch((err) => {});
  };

  const resetScreen = () => {
    formik.resetForm();
    formik.setFieldValue("Role", null);
    formik.setFieldValue("User", null);
    formik.setFieldValue("Module", null);
    setUserScreens([]);
    setSelectedRole([]);
    setSelectedName("");
    setModuleName([]);
    setUserNameList([]);
    setDataCreate(false);
    setDataUpdate(false);
    setDataDelete(false);
    setDataView(false);
    setDataPrint(false);
    setDataApproval(false);
  };

  const handleRoleChange = (e) => {
    formik.setFieldValue("User", null);
    formik.setFieldValue("Module", null);
    formik.setFieldValue("Role", e.target.value);
    setUserScreens([]);
    setSelectedRole(e.value);
    dispatch(GetUser({ RoleId: e.value ,PlantId: localStorage["PlantId"]}));
    setModuleName([]);
    setUserNameList([]);
    setDataCreate(false);
    setDataUpdate(false);
    setDataDelete(false);
    setDataView(false);
    setDataPrint(false);
    setDataApproval(false);
  };
  

  return (
    <>
      <Formik
        initialValues={formik.initialValues}
        validationSchema={formik.validationSchema}
        onSubmit={formik.handleSubmit}
      >
        <>
          <div className="page-container">
            <div className="inner-page-container">
              <div className="page-title">
                <div className="grid grid-nogutter">
                  <div className="md:col-6">
                    <h1>User Wise Screen Mapping</h1>
                  </div>
                  <div className="md:col-6 text-right">
                    <div className="action-btn">
                      <Button
                        label=""
                        title="Save"
                        icon="pi pi-save"
                        className="text-center"
                        disabled={buttonDisable}
                        type="submit"
                        onClick={() => formik.handleSubmit()}
                      />
                      <Button
                        label=""
                        severity="danger"
                        icon="pi pi-trash"
                        title="Clear"
                        className="text-center"
                        disabled={buttonDisable}
                        onClick={() => resetScreen()}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="form-container scroll-y">
                <div className="white">
                  <div className="widget-body">
                    <form>
                      <div className="grid">
                        <div className="col-12 md:col-3">
                          <label className="form-label">
                            User Role <span className="hlt-txt">*</span>
                          </label>
                          <Dropdown
                            name="Role"
                            value={formik.values["Role"]}
                            options={roleList}
                            optionLabel="RoleName"
                            optionValue="RoleId"
                            filter
                            onBlur={formik.handleBlur}
                            placeholder="Select Role"
                            className="w-full"
                            onChange={(e) => handleRoleChange(e)}
                          />
                          <small className="p-error">
                            {formik.touched &&
                              formik.touched["Role"] &&
                              formik.errors &&
                              formik.errors["Role"]}
                          </small>
                        </div>
                        <div className="col-12 md:col-3">
                          <label className="form-label">
                            User Name <span className="hlt-txt">*</span>
                          </label>
                          <Dropdown
                            value={formik.values["User"]}
                            options={userNameList}
                            optionLabel="UserName"
                            optionValue="UserId"
                            name="User"
                            filter
                            placeholder="Select User"
                            className="w-full"
                            onBlur={formik.handleBlur}
                            onChange={(e) => {
                              onChangeUser(e);
                              if (formik.values.Module) {
                                if (formik.values.Module.length > 0)
                                  ServiceCall({
                                    RoleId: selectedRole,
                                    UserId: e.value,
                                    ModuleId: formik.values.Module,
                                  });
                              }
                            }}
                          />
                          <small className="p-error">
                            {formik.touched &&
                              formik.touched["User"] &&
                              formik.errors &&
                              formik.errors["User"]}
                          </small>
                        </div>
                        <div className="col-12 md:col-3">
                          <label className="form-label">
                            Module Name <span className="hlt-txt">*</span>
                          </label>
                          <MultiSelect
                            value={formik.values["Module"]}
                            name="Module"
                            onChange={(e) => onChangeModules(e)}
                            options={moduleNameList}
                            optionLabel="FunctionName"
                            filter
                            onBlur={formik.handleBlur}
                            placeholder="Select Modules"
                            className="w-full"
                            optionValue="FunctionId"
                            maxSelectedLabels={3}
                          />
                          <small className="p-error">
                            {formik.touched &&
                              formik.touched["Module"] &&
                              formik.errors &&
                              formik.errors["Module"]}
                          </small>
                        </div>
                      </div>
                    </form>
                    <div className="card">
                      {!loading ? (
                        <DataTable
                          value={userScreens}
                          showGridlines
                          paginator
                          filters={filters}
                          filterDisplay="menu"
                          globalFilterFields={[
                            "ModuleName",
                            "ScreenName",
                            "Create",
                            "Update",
                            "Delete",
                            "View",
                            "Print",
                            "Approval",
                          ]}
                          header={header}
                          emptyMessage="No Data found."
                          rows={50}
                          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Entries"
                          paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                          rowsPerPageOptions={[5, 10, 25, 50, 100]}
                          tableStyle={{ minWidth: "50rem" }}
                        >
                          <Column
                            field="ModuleName"
                            header="Module"
                            style={{
                              minWidth: "15em",
                              maxWidth: "15em",
                              width: "15em",
                              textAlign: "left",
                              justifyContent: "left",
                              gap: "10px",
                            }}
                          ></Column>
                          <Column
                            field="ScreenName"
                            header="Screen"
                            style={{
                              minWidth: "15em",
                              maxWidth: "15em",
                              width: "15em",
                              textAlign: "left",
                              justifyContent: "left",
                              gap: "10px",
                            }}
                          ></Column>
                          <Column
                            field="Create"
                            header={customHeaderTemplate("Create")}
                            style={{ textAlign: "center", maxWidth: "3rem" }}
                            body={(e) => customBodyTemplate(e, "Create")}
                          ></Column>
                          <Column
                            field="Update"
                            header={customHeaderTemplate("Update")}
                            style={{ textAlign: "center", maxWidth: "3rem" }}
                            body={(e) => customBodyTemplate(e, "Update")}
                          ></Column>
                          <Column
                            field="Delete"
                            header={customHeaderTemplate("Delete")}
                            body={(e) => customBodyTemplate(e, "Delete")}
                            style={{ textAlign: "center", maxWidth: "3rem" }}
                          ></Column>
                          <Column
                            field="View"
                            header={customHeaderTemplate("View")}
                            body={(e) => customBodyTemplate(e, "View")}
                            style={{ textAlign: "center", maxWidth: "3rem" }}
                          ></Column>
                          <Column
                            field="Print"
                            header={customHeaderTemplate("Print")}
                            body={(e) => customBodyTemplate(e, "Print")}
                            style={{ textAlign: "center", maxWidth: "3rem" }}
                          ></Column>
                          <Column
                            field="Approval"
                            header={customHeaderTemplate("Approval")}
                            style={{ textAlign: "center", maxWidth: "3rem" }}
                            body={(e) => customBodyTemplate(e, "Approval")}
                          ></Column>
                        </DataTable>
                      ) : (
                        <AppProgressSpinner />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <AppAlert toast={toast} />
        </>
      </Formik>
    </>
  );
};

export default VUserScreenMapping;
