import React, { useState, useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Button } from "primereact/button";
import { Rating } from "primereact/rating";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { useDispatch, useSelector } from "react-redux";

import AppTable from "@/components/AppTable";
import PageHeader from "@/components/PageHeader";
import {
  CreateInitialize,
  createOrEdit,
  Create,
  Update,
  ChangeStatus,
  SearchInitialize,
} from "@/redux/slices/master/companySlice";
import { pageLoadScript } from "@/assets/js/common-utilities";
import { confirmation } from "@/components/UtilityComp";
import { ConfirmDialog } from "primereact/confirmdialog";
import { permissionService } from "@/services/PermissionService";
import AppAlert from "@/alert/alert";
import { ExportClass, exportServ } from "@/services/ExportService";
import { textAlign } from "html2canvas/dist/types/css/property-descriptors/text-align";

const VCompany = () => {
  const [companies, setCompanies] = useState(null);
  //const [update, setUpdate] = useState(false);
  const route = useHistory();
  const [screenPermissions, setScreenPermissions] = useState<any>();
  const toast = useRef<Toast>(null);
  const dispatch: any = useDispatch();
  const [tableActions, setTableActions] = useState([]);

  const { CompanyList, loading } = useSelector((state: any) => state.company);

  useEffect(() => {
    pageLoadScript();
  });

  useEffect(() => {
    setScreenPermissions(permissionService({ screenId: 14 }));
  }, []);

 
  useEffect(() => {
    getallCompany();
  }, []);

  const getallCompany = () => {
    const company = {
      CompanyId: 0,
      Taskname: "SearchInitialize",
    };
    return dispatch(SearchInitialize(company));
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
    
  })


 useEffect(() => {
    
    setPageConfig({
      ...pageConfig,
      tableActions: tableActions,
    });
  }, [tableActions]);

 const [pageConfig, setPageConfig] = useState({
    pageTitle: "Company",
    pageHeader: {
      pageActions: [
        {
          create: false,
          clear: false,
          save: false,
          createQuery: "/home/cCompany",
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
        title: "Company Code",
        name: "CompanyCode",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: { minWidth: "10rem" },
      },
      {
        title: "Company Name",
        name: "CompanyName",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: { minWidth: "16rem" },
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
         colStyle: { minWidth: "2rem" ,textAlign:"center"},
       
      },
    ],
    tableExport: (exportType: string) => {
      const data = getallCompany();
      data.then((res: any) => {
        fetchDataForExport(res.payload.CompanyList)
          .then((dataList: any) => {
            if (exportType === 'pdf') {
              exportServ.Export('Company', dataList, 'pdf');
            } else if (exportType === 'excel') {
              exportServ.Export('Company', dataList, 'excel');
            }
          })
          .catch((error) => {
            console.error(error.message);
          })
      })
    }
  });
  const fetchDataForExport = (vList) => {
    return new Promise((resolve, reject) => {
      let dataList = []
      if (vList.length > 0) {
        vList.forEach((element) => {
          let data = {
            "Company Code": element.CompanyCode,
            "Company Name": element.CompanyName,
            "Created By": element.CreatedByName,
            "Created On": element.CreatedOn,
            "Modified By": element.ModifiedByName,
            "Modified On": element.ModifiedOn,
            "Status": element.StatusName,
          };
          dataList.push(data);
        });
        resolve(dataList);
      } else {
        reject(new Error('No data available for export.'));
      }
    });
  }

 
  const handleActions = {
    view: (rowData) => {
         const data = {
            CompanyId: rowData.data.CompanyId,
            Taskname: "CreateInitialize",
          };
          const dataFetched = dispatch(CreateInitialize(data));
          dataFetched
            .then((res) => {
               if (res.payload.transtatus.result == true) {
                route.push("/home/cCompany");
              }
            })
            .catch((err) => {
             });
           dispatch(createOrEdit(rowData));
         },
         edit: (rowData) => {
          const data = {
            CompanyId: rowData.data.CompanyId,
            Taskname: "CreateInitialize",
          };
          const dataFetched = dispatch(CreateInitialize(data));
          dataFetched
            .then((res) => {
              if (res.payload.transtatus.result == true) {
                route.push("/home/cCompany");
              }
            })
            .catch((err) => {
              });
          dispatch(createOrEdit(rowData));
        },
    delete: (rowData) => {
      confirmation(
        `Are you sure you want to inactive this ${rowData.data.CompanyName}?`,
        "Confirmation",
        () => {
          let CompanyFormData = {
            CompanyId: rowData.data.CompanyId,
          };
          const deletedRes = dispatch(ChangeStatus(CompanyFormData));
          deletedRes
            .then((res) => {
              if (res.payload.transtatus.result == true) {
                toast.current?.show({
                  severity: "success",
                  summary: "Success Message",
                  detail: res.payload.transtatus.lstErrorItem[0].Message,
                });
                getallCompany();
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
                    data={CompanyList}
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

export default VCompany;
