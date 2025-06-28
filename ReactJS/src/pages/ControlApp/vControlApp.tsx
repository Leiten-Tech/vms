import React, { useState, useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Button } from "primereact/button";
import { Rating } from "primereact/rating";
import { InputText } from "primereact/inputtext";
import { useDispatch, useSelector } from "react-redux";

import AppTable from "@/components/AppTable";
import PageHeader from "@/components/PageHeader";
import {
  createOrEdit,
  SearchInitialize,
  CreateInitialize,
  Update,
  ChangeStatus,
} from "@/redux/slices/master/areaSlice";
import { pageLoadScript } from "@/assets/js/common-utilities";
import { ConfirmDialog } from "primereact/confirmdialog";
import AppAlert from "@/alert/alert";
import { ExportClass, exportServ } from "@/services/ExportService";
import { Toast } from "@/assets/css/prime-library";
import { permissionService } from "@/services/PermissionService";
import { confirmation } from "@/components/UtilityComp";

const VControlApp = () => {
  const route = useHistory();
  const dispatch: any = useDispatch();
  const [screenPermissions, setScreenPermissions] = useState<any>();
  const [tableActions, setTableActions] = useState([]);
  const { loading, AreaList } = useSelector((state: any) => state.area);
  const toast = useRef<Toast>(null);
  useEffect(() => {
    getallArea();
  }, []);

  useEffect(() => {
    pageLoadScript();
  });

  useEffect(() => {
    setScreenPermissions(permissionService({ screenId: 15 }));
  }, []);

  const getallArea = () => {
    const area = {
      AreaId: 0,
      Taskname: "SearchInitialize",
      CompanyId: +localStorage["CompanyId"],
      PlantId: +localStorage["PlantId"],
      RoleId: +localStorage["DefaultRoleId"],
    };
    return dispatch(SearchInitialize(area));
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
    setPageConfig({
      ...pageConfig,
      tableActions: tableActions,
    });
  }, [tableActions]);

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

  const [pageConfig, setPageConfig] = useState({
    pageTitle: "License Configuraions",
    pageHeader: {
      pageActions: [
        {
          create: false,
          clear: false,
          save: false,
          createQuery: "/home/cControlApp",
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
        title: "Company",
        name: "CompanyName",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: {
          minWidth: "10rem",
        },
      },

      {
        title: "Plant Name",
        name: "PlantName",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: {},
      },
      {
        title: "License Token",
        name: "LicenseToken",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: {},
      },
      {
        title: "Trial Start Date",
        name: "TrialStartDate",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: {},
      },
      {
        title: "TrialEndDate",
        name: "Trial End Date",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: {},
      },
      {
        title: "TrialDays",
        name: "Trial Days",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: {},
      },
      {
        title: "Email Approval Enabled",
        name: "EmailApprovalEnabled",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: {},
      },
      //sales changes
      // {
      //   title: "Created By",
      //   name: "CreatedByName",
      //   sort: true,
      //   avatar: true,
      //   badge: false,
      //   colStyle: { minWidth: "6rem" },
      // },
      // {
      //   title: "Created On",
      //   name: "CreatedOn",
      //   sort: true,
      //   avatar: true,
      //   badge: false,
      //   colStyle: { minWidth: "6rem" },
      // },
      // {
      //   title: "Modified By",
      //   name: "ModifiedByName",
      //   sort: true,
      //   avatar: true,
      //   badge: false,
      //   colStyle: { minWidth: "6rem" },
      // },
      // {
      //   title: "Modified On",
      //   name: "ModifiedOn",
      //   sort: true,
      //   avatar: true,
      //   badge: false,
      //   colStyle: { minWidth: "6rem" },
      // },
      // {
      //   title: "Status",
      //   name: "StatusName",
      //   sort: true,
      //   avatar: false,
      //   badge: true,
      //   colStyle: {
      //     minWidth: "2rem",
      //     textAlign: "center",
      //   },
      // },
      //sales changes
    ],
    tableExport: (exportType: string) => {
      const data = getallArea();
      data.then((res: any) => {
        fetchDataForExport(res.payload.AreaList)
          .then((dataList: any) => {
            if (exportType === "pdf") {
              exportServ.Export("Area", dataList, "pdf");
            } else if (exportType === "excel") {
              exportServ.Export("Area", dataList, "excel");
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
            "Company Name": element.CompanyName,
            "Plant Name": element.PlantName,
            "Area Code": element.AreaCode,
            "Area Name": element.AreaName,
            //sales changes
            // "Created By": element.CreatedByName,
            // "Created On": element.CreatedOn,
            // "Modified By": element.ModifiedByName,
            // "Modified On": element.ModifiedOn,
            // "Status": element.StatusName,
            //sales changes
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
        AreaId: rowData.data.AreaId,
        RoleId: +localStorage["DefaultRoleId"],
        CompanyId: +localStorage["CompanyId"],
        PlantId: +localStorage["PlantId"],
        Taskname: "CreateInitialize",
      };
      const dataFetched = dispatch(CreateInitialize(data));
      dataFetched
        .then((res) => {
          if (res.payload.transtatus.result == true) {
            route.push("/home/cArea");
          }
        })
        .catch((err) => {});
      dispatch(createOrEdit(rowData));
    },
    edit: (rowData) => {
      const data = {
        AreaId: rowData.data.AreaId,
        RoleId: +localStorage["DefaultRoleId"],
        CompanyId: +localStorage["CompanyId"],
        PlantId: +localStorage["PlantId"],
        Taskname: "CreateInitialize",
      };
      const dataFetched = dispatch(CreateInitialize(data));
      dataFetched
        .then((res) => {
          if (res.payload.transtatus.result == true) {
            route.push("/home/cArea");
          }
        })
        .catch((err) => {});
      dispatch(createOrEdit(rowData));
    },
    delete: (rowData) => {
      confirmation(
        `Are you sure you want to inactive this ${rowData.data.AreaName}?`,
        "Confirmation",
        () => {
          let AreaFormData = {
            AreaId: rowData.data.AreaId,
          };
          const deletedRes = dispatch(ChangeStatus(AreaFormData));
          deletedRes
            .then((res) => {
              if (res.payload.transtatus.result == true) {
                toast.current?.show({
                  severity: "success",
                  summary: "Success Message",
                  detail: res.payload.transtatus.lstErrorItem[0].Message,
                });
                getallArea();
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
                    data={AreaList}
                    loading={loading}
                    pageConfig={pageConfig}
                    screenPermissions={screenPermissions}
                  />
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

export default VControlApp;
