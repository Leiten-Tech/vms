import React, { useState, useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Button } from "primereact/button";
import { Rating } from "primereact/rating";
import { InputText } from "primereact/inputtext";
import { useDispatch, useSelector } from "react-redux";
import { Toast } from "primereact/toast";
import AppTable from "@/components/AppTable";
import PageHeader from "@/components/PageHeader";
import {
  createOrEdit,
  SearchInitialize,
  CreateInitialize,
  Update,
  ChangeStatus,
} from "@/redux/slices/master/routeSlice";
import { pageLoadScript } from "@/assets/js/common-utilities";
import { confirmation } from "@/components/UtilityComp";
import { ConfirmDialog } from "primereact/confirmdialog";
import { permissionService } from "@/services/PermissionService";
import { ExportClass, exportServ } from "@/services/ExportService";
import AppAlert from "@/alert/alert";

const VRoute = () => {
  const route = useHistory();
  const dispatch: any = useDispatch();
  const [screenPermissions, setScreenPermissions] = useState<any>();
  const [tableActions, setTableActions] = useState([]);
  const toast = useRef<Toast>(null);
  const { loading, RouteList, Route } = useSelector(
    (state: any) => state.route
  );

  useEffect(() => {
    getallRoute();
  }, []);

  useEffect(() => {
    pageLoadScript();
  });

  useEffect(() => {
    setScreenPermissions(permissionService({ screenId: 16 }));
  }, []);

  const getallRoute = () => {
    const route = {
      RouteId: 0,
      Taskname: "SearchInitialize",
      CompanyId: +localStorage["CompanyId"],
      PlantId: +localStorage["PlantId"],
      RoleId: +localStorage["DefaultRoleId"],
    };
    return dispatch(SearchInitialize(route));
  };

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
    pageTitle: "Route",
    pageHeader: {
      pageActions: [
        {
          create: false,
          clear: false,
          save: false,
          createQuery: "/home/cRoute",
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
      width: "10em",
      textAlign: "center",
    },
    tableRows: 10,
    tableRowsOptions: [5, 10, 25],
    tablePagination: true,
    tableActions: tableActions,
    tableColumns: [
      {
        title: "Route Code",
        name: "RouteCode",
        sort: true,
        avatar: false,
        badge: false,
        Style: {
          minWidth: "15em",
          maxWidth: "15em",
          width: "15em",
          textAlign: "left",
          justifyContent: "left",
          gap: "10px",
        },
      },
      {
        title: "Route Name",
        name: "RouteName",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: {},
      },
      {
        title: "From Location ",
        name: "FromLocation",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: {
          maxWidth: "20em",
          overflowWrap: "break-word",
        },
      },
      {
        title: "To Location ",
        name: "ToLocation",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: {
          maxWidth: "20em",
          overflowWrap: "break-word",
        },
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
      const data = getallRoute();
      data.then((res: any) => {
        fetchDataForExport(res.payload.RouteList)
          .then((dataList: any) => {
            if (exportType === "pdf") {
              exportServ.Export("Route", dataList, "pdf");
            } else if (exportType === "excel") {
              exportServ.Export("Route", dataList, "excel");
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
            "Route Code": element.RouteCode,
            "Route Name": element.RouteName,
            "From Location": element.FromLocation,
            "To Location ": element.ToLocation,
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

  const handleActions = {
    view: (rowData) => {
      const data = {
        RouteId: rowData.data.RouteId,
        CompanyId: +localStorage["CompanyId"],
        PlantId: +localStorage["PlantId"],
        RoleId: +localStorage["DefaultRoleId"],
        Taskname: "CreateInitialize",
      };
      const dataFetched = dispatch(CreateInitialize(data));
      dataFetched
        .then((res) => {
          if (res.payload.transtatus.result == true) {
            route.push("/home/cRoute");
          }
        })
        .catch((err) => {});
      dispatch(createOrEdit(rowData));
    },
    edit: (rowData) => {
      const data = {
        RouteId: rowData.data.RouteId,
        CompanyId: +localStorage["CompanyId"],
        PlantId: +localStorage["PlantId"],
        RoleId: +localStorage["DefaultRoleId"],
        Taskname: "CreateInitialize",
      };
      const dataFetched = dispatch(CreateInitialize(data));
      dataFetched
        .then((res) => {
          if (res.payload.transtatus.result == true) {
            route.push("/home/cRoute");
          }
        })
        .catch((err) => {});
      dispatch(createOrEdit(rowData));
    },
    delete: (rowData) => {
      confirmation(
        `Are you sure you want to inactive this ${rowData.data.RouteName}?`,
        "Confirmation",
        () => {
          let RouteFormData = {
            RouteId: rowData.data.RouteId,
          };
          const deletedRes = dispatch(ChangeStatus(RouteFormData));
          deletedRes
            .then((res) => {
              if (res.payload.transtatus.result == true) {
                toast.current?.show({
                  severity: "success",
                  summary: "Success Message",
                  detail: res.payload.transtatus.lstErrorItem[0].Message,
                });
                getallRoute();
              } else if (res.payload.transtatus.result == false) {
                toast.current?.show({
                  severity: "error",
                  summary: "Error Message",
                  detail: res.payload.transtatus.lstErrorItem[0].Message,
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
                    data={RouteList}
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

export default VRoute;
