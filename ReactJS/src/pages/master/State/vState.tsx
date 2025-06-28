import React, { useState, useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Button } from "primereact/button";
import { Rating } from "primereact/rating";
import { InputText } from "primereact/inputtext";
import { useDispatch, useSelector } from "react-redux";
import AppTable from "@/components/AppTable";
import PageHeader from "@/components/PageHeader";
import {
  createInit,
  createOrEdit,
  deleteStates,
  fetchStates,
} from "@/redux/slices/master/stateSlice";
import { pageLoadScript } from "@/assets/js/common-utilities";
import { ConfirmDialog } from "primereact/confirmdialog";
import { confirmation } from "@/components/UtilityComp";
import { ExportClass, exportServ } from "@/services/ExportService";
import { Toast } from "primereact/toast";
import AppAlert from "@/alert/alert";
import { sendEmail } from "@/services/EmailService";
import { permissionService } from "@/services/PermissionService";

const VState = (props) => {
  const [states, setStates] = useState(null);
  const route = useHistory();
  const [screenPermissions, setScreenPermissions] = useState<any>();

  const toast = useRef<Toast>(null);

  useEffect(() => {
    pageLoadScript();
  });

  useEffect(() => {
    setScreenPermissions(permissionService({ screenId: 5 }));
  }, []);

  const dispatch: any = useDispatch();

  let allStates = useSelector((state: any) => state.states.StateList);
  const loading = useSelector((state: any) => state.states.loading);

  // Fetch Data from REDUX API CALL
  useEffect(() => {
    fetchAllStates();
    // sendEmail({
    //   from_name: "From Visitor Management (Gate I)",
    //   whom_to_email: "arjayabalan09@gmail.com",
    //   message: "Approved visitor at Gate I",
    // });
  }, [dispatch]);

  const fetchAllStates = () => {
    const state = {
      Stateid: 0,
    };
    return dispatch(fetchStates(state));
  };

  const [selectedProducts, setSelectedProducts] = useState(null);

  const [tableActions, setTableActions] = useState([]);

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
    pageTitle: "State",
    pageHeader: {
      pageActions: [
        {
          create: false,
          clear: false,
          save: false,
          createQuery: "/home/cState",
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
      // display: "flex",
      // flexDirection: "row",
      // justifyContent: "center"
    },
    tableRows: 10,
    tableRowsOptions: [5, 10, 25],
    tablePagination: true,
    tableActions: tableActions,
    tableColumns: [
      {
        title: "Country",
        name: "CountryName",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: {},
      },
      {
        title: "State Code",
        name: "StateCode",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: { minWidth: "8rem" },
      },
      {
        title: "State Name",
        name: "StateName",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: {
          minWidth: "8rem",
        },
      },
      {
        title: "Created By",
        name: "CreatedByName",
        sort: true,
        avatar: true,
        badge: false,
        colStyle: { minWidth: "5rem" },
      },
      {
        title: "Created On",
        name: "CreatedOn",
        sort: true,
        avatar: true,
        badge: false,
        colStyle: { minWidth: "5rem" },
      },
      {
        title: "Modified By",
        name: "ModifiedByName",
        sort: true,
        avatar: true,
        badge: false,
        colStyle: { minWidth: "5rem" },
      },
      {
        title: "Modified On",
        name: "ModifiedOn",
        sort: true,
        avatar: true,
        badge: false,
        colStyle: { minWidth: "5rem" },
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
      const data = fetchAllStates();
      data.then((res: any) => {
        fetchDataForExport(res.payload.StateList)
          .then((dataList: any) => {
            if (exportType === "pdf") {
              exportServ.Export("State", dataList, "pdf");
            } else if (exportType === "excel") {
              exportServ.Export("State", dataList, "excel");
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
            Country: element.CountryName,
            "State Code": element.StateCode,
            "State Name": element.StateName,
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
      
      route.push(`/home/cState`);
      dispatch(createOrEdit(rowData));
    },
    edit: (rowData) => {
      route.push(`/home/cState`);
      dispatch(createOrEdit(rowData));
    },
    delete: (rowData) => {
      confirmation(
        `Are you sure you want to inactive this ${rowData.data.StateName}?`,
        "Confirmation",
        () => {
          let StateFormData = {
            Stateid: rowData.data.StateId,
          };
          

          const deletedRes = dispatch(deleteStates(StateFormData));
          deletedRes
            .then((res) => {
              if (res.payload.transtatus.result == true) {
                toast.current?.show({
                  severity: "success",
                  summary: "Success Message",
                  detail: res.payload.transtatus.lstErrorItem[0].Message,
                });
                fetchAllStates();
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
                    data={allStates}
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

export default VState;
