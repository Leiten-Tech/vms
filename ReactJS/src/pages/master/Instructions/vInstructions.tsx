import { useState, useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Toast } from "primereact/toast";
import { useDispatch, useSelector } from "react-redux";

import AppTable from "@/components/AppTable";
import PageHeader from "@/components/PageHeader";
import {
  CreateInitialize,
  createOrEdit,
  ChangeStatus,
  SearchInitialize,
} from "@/redux/slices/master/instructionsSlice";
import { pageLoadScript } from "@/assets/js/common-utilities";
import { confirmation } from "@/components/UtilityComp";
import { ConfirmDialog } from "primereact/confirmdialog";
import { permissionService } from "@/services/PermissionService";
import AppAlert from "@/alert/alert";
import { exportServ } from "@/services/ExportService";

const VInstructions = () => {
  const [companies, setCompanies] = useState(null);
  //const [update, setUpdate] = useState(false);
  const route = useHistory();
  const [screenPermissions, setScreenPermissions] = useState<any>();
  const toast = useRef<Toast>(null);
  const dispatch: any = useDispatch();
  const [tableActions, setTableActions] = useState([]);

  const { InstructionsList,loading } = useSelector(
    (state: any) => state.instructions
  );

  
  

  useEffect(() => {
    pageLoadScript();
  });

  useEffect(() => {
    setScreenPermissions(permissionService({ screenId: 39 }));
  }, []);


  useEffect(() => {
    getallInstructions();
  }, []);

  const getallInstructions = () => {
    const instruction = {
      InstructionsId: 0,
      Taskname: "SearchInitialize",
    };
    return dispatch(SearchInitialize(instruction));
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
    
  });

  useEffect(() => {
    
    setPageConfig({
      ...pageConfig,
      tableActions: tableActions,
    });
  }, [tableActions]);


  const [pageConfig, setPageConfig] = useState({
    pageTitle: "Terms & Conditions",
    pageHeader: {
      pageActions: [
        {
          create: false,
          clear: false,
          save: false,
          createQuery: "/home/cInstructions",
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
      width: "120px",
      textAlign: "center",
    },
    tableRows: 10,
    tableRowsOptions: [5, 10, 25],
    tablePagination: true,
    tableActions: tableActions,
    tableColumns: [
      {
        title: "Company Name",
        name: "CompanyName",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: { minWidth: "16rem" },
      },
      {
        title: "Intruction Name",
        name: "InstructionName",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: { minWidth: "16rem" },
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
        title: "Visitor Type",
        name: "VisitorTypeName",
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
        badge: false,
        colStyle: { minWidth: "16rem" },
      },
      
    ],
    tableExport: (exportType: string) => {
      const data = getallInstructions();
      data.then((res: any) => {
        fetchDataForExport(res.payload.InstructionsList)
          .then((dataList: any) => {
            if (exportType === "pdf") {
              exportServ.Export("Instructions", dataList, "pdf");
            } else if (exportType === "excel") {
              exportServ.Export("Instructions", dataList, "excel");
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
            "Instruction Name":element.InstructionName,
            "Plant Name": element.PlantName,
            "Visitor Type": element.VisitorTypeName,
            "Status": element.StatusName,
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
        InstructionsId: rowData.data.InstructionsId,
        Taskname: "CreateInitialize",
      };
      const dataFetched = dispatch(CreateInitialize(data));
      dataFetched
        .then((res) => {
          if (res.payload.transtatus.result == true) {
            route.push("/home/cInstructions");
          }
        })
        .catch((err) => {});
      dispatch(createOrEdit(rowData));
    },
    edit: (rowData) => {
      const data = {
        InstructionsId: rowData.data.InstructionsId,
        Taskname: "CreateInitialize",
      };
      const dataFetched = dispatch(CreateInitialize(data));
      dataFetched
        .then((res) => {
          if (res.payload.transtatus.result == true) {
            route.push("/home/cInstructions");
          }
        })
        .catch((err) => {});
      dispatch(createOrEdit(rowData));
    },
    delete: (rowData) => {
      confirmation(
        `Are you sure you want to inactive this ${rowData.data.CompanyName}?`,
        "Confirmation",
        () => {
          let InstructionsFormData = {
            InstructionsId: rowData.data.InstructionsId,
          };
          const deletedRes = dispatch(ChangeStatus(InstructionsFormData));
          deletedRes
            .then((res) => {
              if (res.payload.transtatus.result == true) {
                toast.current?.show({
                  severity: "success",
                  summary: "Success Message",
                  detail: res.payload.transtatus.lstErrorItem[0].Message,
                });
                getallInstructions();
              } else if (res.payload.transtatus.result == false) {
                toast.current?.show({
                  severity: "warn",
                  summary: "Warning Message",
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
                    data={InstructionsList}
                    loading={loading}
                    pageConfig={pageConfig}
                    screenPermissions={screenPermissions}
                    tableActions={tableActions}
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

export default VInstructions;
