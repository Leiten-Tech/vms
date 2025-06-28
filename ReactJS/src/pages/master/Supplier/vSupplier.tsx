import React, { useState, useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import AppTable from "@/components/AppTable";
import PageHeader from "@/components/PageHeader";
import {
  changestatus,
  create,
  createInit,
  createOrEdit,
  fetch,
  update,
} from "@/redux/slices/master/supplierSlice";
import { useDispatch, useSelector } from "react-redux";
import { Toast } from "primereact/toast";
import AppAlert from "@/alert/alert";
import { pageLoadScript } from "@/assets/js/common-utilities";
import { confirmation } from "@/components/UtilityComp";
import { ExportClass, exportServ } from "@/services/ExportService";
import { ConfirmDialog } from "primereact/confirmdialog";
import { permissionService } from "@/services/PermissionService";

const VSupplier = () => {
  const [visitors, setVisitors] = useState(null);
  const route = useHistory();
  const toast = useRef<Toast>(null);
  const [screenPermissions, setScreenPermissions] = useState<any>();
  const [tableActions, setTableActions] = useState([]);

  const dispatch: any = useDispatch();
  let allVisitors = useSelector((state: any) => state.supplier.SupplierHeader);
  const {
    isCreate,
    isView,
    createEditData,
    loading,
    error,
    tranStatus,
    SupplierHeader,
    SupplierList,
  } = useSelector((state: any) => state.supplier);

  useEffect(() => {
    pageLoadScript();
  });

  useEffect(() => {
    setScreenPermissions(permissionService({ screenId: 11 }));
  }, []);

  useEffect(() => {
    Fetch();
  }, []);

  useEffect(() => {
    if (
      screenPermissions?._View &&
      tableActions.filter((item) => item.name == "view").length == 0
    ) {
      setTableActions([
        ...tableActions,
        {
          title: "View",
          name: "view",
          disabled: false,
        },
      ]);
    }
    if (
      screenPermissions?._Update &&
      tableActions.filter((item) => item.name == "edit").length == 0
    ) {
      setTableActions([
        ...tableActions,
        {
          title: "Edit",
          name: "edit",
          disabled: false,
        },
      ]);
    }
    if (
      screenPermissions?._Delete &&
      tableActions.filter((item) => item.name == "delete").length == 0
    ) {
      setTableActions([
        ...tableActions,
        {
          title: "Delete",
          name: "delete",
          disabled: false,
        },
      ]);
    }
    if (
      screenPermissions?._View &&
      screenPermissions?._Update &&
      screenPermissions?._Delete
    ) {
      setPageConfig({
        ...pageConfig,
        tableAction: true,
      });
    }
  }, [screenPermissions, tableActions]);

  useEffect(() => {
    if (
      screenPermissions?._Add &&
      !pageConfig.pageHeader.pageActions[0].create
    ) {
      setPageConfig((prevPageConfig) => {
        const updatedPageHeader = {
          ...prevPageConfig.pageHeader,
          pageActions: prevPageConfig.pageHeader.pageActions.map((action) => {
            return {
              ...action,
              create: screenPermissions?._Add ? true : false,
            };
          }),
        };
        return {
          ...prevPageConfig,
          pageHeader: updatedPageHeader,
        };
      });
    }
  }, [screenPermissions]);

  useEffect(() => {
    setPageConfig({
      ...pageConfig,
      tableActions: tableActions,
    });
  }, [tableActions]);

  const [pageConfig, setPageConfig] = useState({
    pageTitle: "Supplier",
    pageHeader: {
      pageActions: [
        {
          create: false,
          clear: false,
          save: false,
          createQuery: "/home/cSupplier",
          createDispatch: () =>
            dispatch(
              createOrEdit({ data: null, isView: false, isCreate: true })
            ),
        },
      ],
    },
    tableCheckSelection: false,
    tableAction: true,
    tableActionStyle: {
      maxWidth: "10rem",
      textAlign: "center",
      justifySelf: "center",
    },
    tableRows: 10,
    tableRowsOptions: [5, 10, 25, 50, 100],
    tablePagination: true,
    tableActions: tableActions,
    tableColumns: [
      {
        title: "Supplier Code",
        name: "SupplierCode",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: { minWidth: "10rem" },
      },
      {
        title: "Supplier Name",
        name: "SupplierName",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: {
          minWidth: "10rem",
        },
      },
      {
        title: "Supplier Type",
        name: "SupplierTypeName",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: {},
      },
      {
        title: "Supplier Category",
        name: "CategoryName",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: {},
      },
      {
        title: "Created By",
        name: "CreatedByName",
        sort: true,
        avatar: true,
        badge: false,
        colStyle: { minWidth: "6rem" },
      },
      {
        title: "Created On",
        name: "CreatedOn",
        sort: true,
        avatar: true,
        badge: false,
        colStyle: { minWidth: "6rem" },
      },
      {
        title: "Modified By",
        name: "ModifiedByName",
        sort: true,
        avatar: true,
        badge: false,
        colStyle: { minWidth: "6rem" },
      },
      {
        title: "Modified On",
        name: "ModifiedOn",
        sort: true,
        avatar: true,
        badge: false,
        colStyle: { minWidth: "6rem" },
      },
      {
        title: "Status",
        name: "StatusName",
        sort: true,
        avatar: false,
        badge: true,
        colStyle: {
          minWidth: "2rem",
          textAlign: "center",
        },
      },
    ],
    tableExport: (exportType: string) => {
      const data = Fetch();
      data.then((res: any) => {
        fetchDataForExport(res.payload.SupplierList)
          .then((dataList: any) => {
            if (exportType === "pdf") {
              exportServ.Export("Supplier", dataList, "pdf");
            } else if (exportType === "excel") {
              exportServ.Export("Supplier", dataList, "excel");
            }
          })
          .catch((error) => {
            console.error(error.message);
          });
      });
    },
  });

  const fetchDataForExport = (vList) => {
    return new Promise((resolve, reject) => {
      let dataList = [];
      if (vList.length > 0) {
        vList.forEach((element) => {
          let data = {
            "Supplier Code": element.SupplierCode,
            "Supplier Name": element.SupplierName,
            "Supplier Type": element.SupplierTypeName,
            "Supplier Category": element.CategoryName,
            "Created By": element.CreatedByName,
            "Created On": element.CreatedOn,
            "Modified By": element.ModifiedByName,
            "Modified On": element.ModifiedOn,
            Status: element.StatusName,
          };
          dataList.push(data);
        });
        resolve(dataList);
      } else {
        reject(new Error("No data available for export."));
      }
    });
  };

  const Fetch = () => {
    const obj = {
      SupplierId: 0,
      CompanyId: +localStorage["CompanyId"],
      PlantId: +localStorage["PlantId"],
      RoleId: +localStorage["DefaultRoleId"],
    };
    return dispatch(fetch(obj));
  };

  const handleActions = {
    view: (rowData) => {
      const data = {
        SupplierId: rowData.data.SupplierId,
        CompanyId: +localStorage["CompanyId"],
        PlantId: +localStorage["PlantId"],
        RoleId: +localStorage["DefaultRoleId"],
      };
      const dataFetched = dispatch(createInit(data));
      dataFetched
        .then((res) => {
          if (res.payload.tranStatus.result == true) {
            route.push("/home/cSupplier");
          }
        })
        .catch((err) => {});
      dispatch(createOrEdit(rowData));
    },
    edit: (rowData) => {
      const data = {
        SupplierId: rowData.data.SupplierId,
        CompanyId: +localStorage["CompanyId"],
        PlantId: +localStorage["PlantId"],
        RoleId: +localStorage["DefaultRoleId"],
      };
      const dataFetched = dispatch(createInit(data));
      dataFetched
        .then((res) => {
          if (res.payload.tranStatus.result == true) {
            route.push("/home/cSupplier");
          }
        })
        .catch((err) => {});
      dispatch(createOrEdit(rowData));
    },
    delete: (rowData) => {
      confirmation(
        `Are you sure you want to inactive this ${rowData.data.SupplierName}?`,
        "Confirmation",
        () => {
          let SupplierFormData = {
            SupplierId: rowData.data.SupplierId,
          };
          const deletedRes = dispatch(changestatus(SupplierFormData));
          deletedRes
            .then((res) => {
              if (res.payload.tranStatus.result == true) {
                toast.current?.show({
                  severity: "success",
                  summary: "Success Message",
                  detail: res.payload.tranStatus.lstErrorItem[0].Message,
                });
                Fetch();
              } else if (res.payload.tranStatus.result == false) {
                toast.current?.show({
                  severity: "error",
                  summary: "Error Message",
                  detail: res.payload.tranStatus.lstErrorItem[0].Message,
                });
              }
            })
            .catch((err) => {
              toast.current?.show({
                severity: "error",
                summary: "Error Message",
                detail: JSON.stringify(err),
              });
            });
        },
        () => {}
      );
    },
  };

  return (
    <>
      <div className="page-container">
        <div className="inner-page-container">
          <PageHeader
            pageTitle={pageConfig.pageTitle}
            pageConfig={pageConfig}
          />
          <div className="form-container scroll-y">
            <div className="white">
              <div className="widget-body">
                <div className="card">
                  <AppTable
                    handleActions={handleActions}
                    data={SupplierList}
                    loading={loading}
                    pageConfig={pageConfig}
                    screenPermissions={screenPermissions}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ConfirmDialog />
      <AppAlert toast={toast} />
    </>
  );
};
export default VSupplier;
