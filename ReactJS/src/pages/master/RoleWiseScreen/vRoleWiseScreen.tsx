import React, { useState, useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import FormFields from "@/components/FormFields";
import { Formik, useFormik } from "formik";
import { RoleWiseScreenValidationSchema } from "@/validations/Master";
import {
  Button,
  FilterMatchMode,
  InputSwitch,
  InputText,
  Toast,
} from "@/assets/css/prime-library";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import PageHeader from "@/components/PageHeader";
import {
  CreateInitialize,
  Create,
  GetDefaultModules,
  GetFunctions,
} from "@/redux/slices/master/rolewisescreenSlice";
import AppAlert from "../../../alert/alert";
import { pageLoadScript } from "@/assets/js/common-utilities";
import { AppProgressSpinner } from "@/components/UtilityComp";

const VRoleWiseScreen = () => {
  const [selectedData, setSelectedData] = useState([]);
  const [listForCreate, setListForCreate] = useState([]);
  const [allScreensForApp, setAllScreensForApp] = useState([]);
  const [globalFilter, setGlobalFilter] = useState();
  const [modules, setModules] = useState([]);

  useEffect(() => {
    pageLoadScript();
  });

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState<string>("");
  const TableHeader = () => {
    const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      let _filters = { ...filters };

      _filters["global"].value = value;

      setFilters(_filters);
      setGlobalFilterValue(value);
    };

    return (
      <div className="flex justify-content-between">
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
  const {
    ModuleList,
    RoleMasterList,
    RolewiseScreenMappingViewList,
    AllScreens,
    isCreate,
    FunctionRoleMapList,
    createEditData,
    isView,
    loading,
  } = useSelector((state: any) => state.roleWiseScreen);

  const toast = useRef<Toast>(null);
  const dispatch: any = useDispatch();

  const resetForm = () => {
    setAllScreensForApp([]);
    formik.resetForm();
  };

  const handleSelect = (name, other, value) => {
    formik.setFieldValue(name, value);
  };

  const handleGridSelect = (value: any) => {
    setSelectedData(value);
    setListForCreate([]);
    let ListA: any[] = [];
    for (let i = 0; i < value.length; i++) {
      let obj: any = {};
      const x = value[i];
      obj.FunctionRoleMapId = 0;
      obj.RoleId = formik.values.RoleName;
      obj.FunctionId = x.ScreenId;
      obj.CompanyId = +localStorage["CompanyId"];
      obj.PlantId = +localStorage["PlantId"];
      obj.Status = 1;
      obj.CreatedBy = +localStorage["UserId"];
      obj.CreatedOn = new Date();
      obj.ModifiedBy = +localStorage["UserId"];
      obj.ModifiedOn = new Date();
      ListA.push(obj);
    }
    setListForCreate(ListA);
  };

  const tempfunction = () => {};
  

  const formik: any = useFormik({
    initialValues: {
      RoleName: createEditData != null ? createEditData.RoleName : null,
      ModuleName: createEditData != null ? createEditData.ModuleName : null,
      ScreenName: createEditData != null ? createEditData.ScreenName : null,
    },
    validationSchema: RoleWiseScreenValidationSchema,
    onSubmit: () => {
      if (listForCreate.length == 0) {
        toast.current?.show({
          severity: "warn",
          summary: "Validation Error",
          detail: "Please select at least one screen in the grid.",
        });
        return;
      }
      let RoleWiseFormValue = {
        FunctionRoleMap: listForCreate,
      };
      const createRes = dispatch(Create(RoleWiseFormValue));
      createRes
        .then((res) => {
          if (res.payload.transtatus.result == true) {
            toast.current?.show({
              severity: "success",
              summary: "Success Message",
              detail: res.payload.transtatus.lstErrorItem[0].Message,
            });
            resetAllForm();
          } else {
            toast.current?.show({
              severity: "error",
              summary: "Error Message",
              detail: res.payload.transtatus.lstErrorItem[0].Message,
            });
          }
        })
        .catch((err) => {
          toast.current?.show({
            severity: "warn",
            summary: "Error Message",
            detail: JSON.stringify(err.payload),
          });
        });
    },
  });
  

  const resetAllForm = () => {
    formik.resetForm();
    setListForCreate([]);
    setAllScreensForApp([]);
  };
  const handleRoleSelect = (name, other, value) => {
    formik.setFieldValue(name, value);
    let obj = {
      RoleId: value,
      CompanyId: localStorage["CompanyId"],
    };
    const ReturnedData = dispatch(GetDefaultModules(obj));

    ReturnedData.then(
      (res) => {
        
        setAllScreensForApp(res.payload.AllScreens);
        var roleSelected = res.payload.RolewiseScreenMappingViewList;
        // const roleSelectedModuleIds = new Set(
        //   roleSelected.map((screen) => screen.ModuleId)
        // );

        // const uniqueModuleIds = [
        //   ...new Set(
        //     res.payload.AllScreens.filter((screen) =>
        //       roleSelectedModuleIds.has(screen.ModuleId)
        //     ).map((screen) => screen.ModuleId)
        //   ),
        // ];
        // 

        formik.setFieldValue("ModuleName", null);
      },
      (error) => {}
    );
  };

  useEffect(() => {
    setSelectedData(RolewiseScreenMappingViewList);
  }, [RolewiseScreenMappingViewList]);

  const handleModuleSelect = (name, other, value) => {
    formik.setFieldValue("Module", value);
    formik.setFieldValue(name, value);
    let FilteredList = AllScreens.filter((f) =>
      value.some((x) => x == f.ModuleId)
    );
    setAllScreensForApp(FilteredList);
  };

  useEffect(() => {
    const data = {
      RoleId: localStorage["DefaultRoleId"],
      CompanyId: localStorage["CompanyId"],
      Taskname: "CreateInitialize",
    };
    dispatch(CreateInitialize(data));
  }, []);

  useEffect(() => {
    setModules(ModuleList);
    handleGridSelect(RolewiseScreenMappingViewList);
    
  }, [ModuleList, RolewiseScreenMappingViewList]);

  const [pageConfig, setPageConfig] = useState({
    pageTitle: "Role Wise Screen Mapping",
    pageHeader: {
      pageActions: [
        {
          create: false,
          clear: true,
          save: true,
          createQuery: " ",
        },
      ],
    },
    tableCheckSelection: false,
    tableAction: true,
    tableActionStyle: {
      maxWidth: "4.5rem",
      textAlign: "center",
      justifySelf: "center",
    },
    tableRows: 10,
    tableRowsOptions: [5, 10, 25],
    tablePagination: true,
    tableActions: [
      {
        title: "View",
        name: "view",
      },
      {
        title: "Edit",
        name: "edit",
      },
      {
        title: "Delete",
        name: "delete",
      },
    ],
    tableColumns: [
      {
        title: "Role Name",
        name: "RoleName",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: {
          minWidth: "16rem",
        },
      },
      {
        title: "Module Name",
        name: "ModuleName",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: { minWidth: "10rem" },
      },
      {
        title: "Screen Name",
        name: "ScreenName",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: {},
      },
    ],
  });

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
                  <h1>Role Wise Screen Mapping</h1>
                </div>
                <div className="md:col-6 text-right">
                  <div className="action-btn">
                    <>
                      <Button
                        label=""
                        title="Save"
                        icon="pi pi-save"
                        className="text-center"
                        onClick={() => formik.handleSubmit()}
                      />
                      <Button
                        label=""
                        severity="danger"
                        icon="pi pi-trash"
                        title="Clear"
                        className="text-center"
                        onClick={() => resetForm()}
                      />
                    </>
                  </div>
                </div>
              </div>
            </div>

            <div className="form-container scroll-y">
              <div className="white">
                <div className="widget-body">
                  <form>
                    <div className="normal-table">
                      <div className="grid">
                        <FormFields
                          type={"select"}
                          name={"RoleName"}
                          label={"Role Name"}
                          options={RoleMasterList}
                          show={true}
                          required={true}
                          disable={isView ? true : false}
                          optionLabel={"RoleName"}
                          optionValue={"RoleId"}
                          handleSelect={handleRoleSelect}
                          fldStyle={"col-12 md:col-3"}
                          formik={formik}
                        />
                        <FormFields
                          type={"multi_select"}
                          name={"ModuleName"}
                          label={"Module Name"}
                          options={modules}
                          show={true}
                          required={true}
                          disable={isView ? true : false}
                          optionLabel={"FunctionName"}
                          optionValue={"FunctionId"}
                          handleSelect={handleModuleSelect}
                          fldStyle={"col-12 md:col-3"}
                          formik={formik}
                          maxSelectedLabels={3}
                        />
                      </div>
                    </div>
                  </form>

                  <div className="card">
                    {!loading ? (
                      <DataTable
                        value={allScreensForApp}
                        showGridlines
                        filters={filters}
                        loading={loading}
                        selection={selectedData}
                        emptyMessage={"No Data Found"}
                        style={{
                          minWidth: "50rem",
                          textAlign: "center",
                        }}
                        onSelectionChange={(e) => {
                          handleGridSelect(e.value);
                        }}
                        dataKey="ScreenName"
                        paginator={pageConfig.tablePagination}
                        rows={pageConfig.tableRows}
                        rowsPerPageOptions={pageConfig.tableRowsOptions}
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Entries"
                        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                        globalFilter={globalFilter}
                        header={TableHeader}
                      >
                        <Column
                          selectionMode="multiple"
                          headerStyle={{ width: "5rem", textAlign: "center" }}
                          bodyStyle={{ textAlign: "center" }}
                        ></Column>
                        <Column
                          field="ModuleName"
                          header="Module Name"
                          sortable
                        ></Column>
                        <Column
                          field="ScreenName"
                          header="Screen Name"
                          sortable
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
      </Formik>
      <AppAlert toast={toast} />
    </>
  );
};

export default VRoleWiseScreen;
