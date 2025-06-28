import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AppTable from "@/components/AppTable";
import PageHeader from "@/components/PageHeader";
import {
  createOrEdit,
  createInit,
  fetch,
  changeStatus,
} from "@/redux/slices/master/gateSlice";
import { log } from "console";
import { pageLoadScript } from "@/assets/js/common-utilities";
import { confirmation } from "@/components/UtilityComp";
import { Toast } from "primereact/toast";
import { ConfirmDialog } from "primereact/confirmdialog";
import { permissionService } from "@/services/PermissionService";
import AppAlert from "@/alert/alert";
import { textAlign } from "html2canvas/dist/types/css/property-descriptors/text-align";
import { ExportClass, exportServ } from "@/services/ExportService";

const VGate = () => {
  const [Gates, setGates] = useState(null);
  const route = useHistory();
  const dispatch: any = useDispatch();
  const [screenPermissions, setScreenPermissions] = useState<any>();
  const [tableActions, setTableActions] = useState([]);
  const loading = useSelector((state: any) => state.gate.loading);
  const allGates = useSelector((state: any) => state.gate.GateList);
  const [update, setUpdate] = useState(false);
  const toast = useRef<Toast>(null);
  useEffect(() => {
    pageLoadScript();
  });

  useEffect(() => {
    setScreenPermissions(permissionService({ screenId: 19 }));
  }, []);

  // Fetch Data from REDUX API CALL
  useEffect(() => {
    fetchGate();
  }, []);
  const fetchGate = () => {
    const gate = {
      GateId: 0,
      Taskname: "SEARCHINITIALIZE",
      CompanyId: +localStorage["CompanyId"],
      PlantId: +localStorage["PlantId"],
      RoleId: +localStorage["DefaultRoleId"],
    };
    return dispatch(fetch(gate));
  };
  useEffect(() => {
    setGates(allGates);
  }, [allGates]);

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
    pageTitle: "Gate",
    pageHeader: {
      pageActions: [
        {
          create: false,
          clear: false,
          save: false,
          createQuery: "/home/cGate",
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
      textAlign: "center",
      minWidth: "10rem",
    },
    tableRows: 10,
    tableRowsOptions: [5, 10, 25],
    tablePagination: true,
    tableActions: tableActions,
    tableColumns: [
      {
        title: "Gate Code",
        name: "GateCode",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: { minWidth: "6rem" },
      },
      {
        title: "Gate Name",
        name: "GateName",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: { minWidth: "6rem" },
      },
      {
        title: "Gate No",
        name: "GateNo",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: {},
      },
      {
        title: "Incharge Name",
        name: "FirstName",
        sort: true,
        avatar: true,
        badge: false,
        colStyle: { minWidth: "6rem" },
      },
      {
        title: "Company Name",
        name: "CompanyName",
        sort: true,
        avatar: true,
        badge: false,
        colStyle: { minWidth: "6rem" },
      },
      {
        title: "Plant Name",
        name: "PlantName",
        sort: true,
        avatar: true,
        badge: false,
        colStyle: { minWidth: "6rem" },
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
        colStyle: { minWidth: "2rem", textAlign: "center" },
      },
    ],
    tableExport: (exportType: string) => {
      const data = fetchGate();
      data.then((res: any) => {
        fetchDataForExport(res.payload.GateList)
          .then((dataList: any) => {
            if (exportType === "pdf") {
              exportServ.Export("Gate", dataList, "pdf");
            } else if (exportType === "excel") {
              exportServ.Export("Gate", dataList, "excel");
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
            "Gate Code": element.GateCode,
            "Gate Name": element.GateName,
            "Gate No": element.GateNo,
            "Incharge Name": element.FirstName,
            "Company Name": element.CompanyName,
            "Plant Name": element.PlantName,
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
        GateId: rowData.data.GateId,
        Taskname: "CREATEINITIALIZE",
        PlantId: localStorage["PlantId"],
        CompanyId: localStorage["CompanyId"],
        RoleId: localStorage["DefaultRoleId"],
      };
      const dataFetched = dispatch(createInit(data));
      dataFetched
        .then((res) => {
          if (res.payload.transtatus.result == true) {
            route.push(`/home/cGate`);
          }
        })
        .catch((err) => {});
      dispatch(createOrEdit(rowData));
    },
    edit: (rowData) => {
      const data = {
        GateId: rowData.data.GateId,
        Taskname: "CREATEINITIALIZE",
        PlantId: localStorage["PlantId"],
        CompanyId: localStorage["CompanyId"],
        RoleId: localStorage["DefaultRoleId"],
      };
      const dataFetched = dispatch(createInit(data));
      dataFetched
        .then((res) => {
          if (res.payload.transtatus.result == true) {
            route.push(`/home/cGate`);
          }
        })
        .catch((err) => {});
      dispatch(createOrEdit(rowData));
    },
    delete: (rowData) => {
      confirmation(
        `Are you sure you want to inactive this ${rowData.data.GateName}?`,
        "Confirmation",
        () => {
          let GateFormData = {
            GateId: rowData.data.GateId,
          };
          const deletedRes = dispatch(changeStatus(GateFormData));
          deletedRes
            .then((res) => {
              if (res.payload.transtatus.result == true) {
                toast.current?.show({
                  severity: "success",
                  summary: "Success Message",
                  detail: res.payload.transtatus.lstErrorItem[0].Message,
                });
                fetchGate();
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
                    data={Gates}
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
export default VGate;
