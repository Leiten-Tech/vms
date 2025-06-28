import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AppTable from "@/components/AppTable";
import PageHeader from "@/components/PageHeader";
import {
  createOrEdit,
  CreateInit,
  fetch,
  changeStatus,
} from "@/redux/slices/master/categorySlice";
import { log } from "console";
import { pageLoadScript } from "@/assets/js/common-utilities";
import { Toast } from "primereact/toast";
import { confirmation } from "@/components/UtilityComp";
import { ConfirmDialog } from "primereact/confirmdialog";
import { permissionService } from "@/services/PermissionService";
import AppAlert from "@/alert/alert";
import { exportServ } from "@/services/ExportService";

const VCategoryCPMapping = () => {
    const [City, setCity] = useState(null);
    const route = useHistory();
    const dispatch: any = useDispatch();
    const loading = useSelector((state: any) => state.category.loading);
    const allcategory = useSelector((state: any) => state.category.CategoryCPMapList);
    const [update, setUpdate] = useState(false);
    const [CityList, setCityList] = useState([]);
    const [screenPermissions, setScreenPermissions] = useState<any>();
    const [tableActions, setTableActions] = useState([]);
  
    const toast = useRef<Toast>(null);
  
    useEffect(() => {
      pageLoadScript();
    });
  
    useEffect(() => {
      setScreenPermissions(permissionService({ screenId: 17 }));
    }, []);
  
    useEffect(() => {
      fetchCategoryCPMap();
    }, []);
    const fetchCategoryCPMap = () => {
      const CategoryCPMap = {
        CategoryId: 0,
        Taskname: "SEARCHINITIALIZE",
      };
      return dispatch(fetch(CategoryCPMap));
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
    if (screenPermissions?._View && screenPermissions?._Update && screenPermissions?._Delete) {
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
      pageTitle: "Category CheckPoints Mapping",
      pageHeader: {
        pageActions: [
          {
            create: false,
            clear: false,
            save: false,
            createQuery: "/home/cCheckPointMapping",
            createDispatch: () =>
              dispatch(createOrEdit({ data: null, isView: false, isCreate: true })),
          },
        ],
      },
      tableCheckSelection: false,
      tableAction: true,
      tableActionStyle: {
        textAlign: "center",
      },
      tableRows: 10,
      tableRowsOptions: [5, 10, 25],
      tablePagination: true,
      tableActions: tableActions,
      tableColumns: [
        {
          title: "Category Name",
          name: "CategoryName",
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
          colStyle: { minWidth: "2rem" ,textAlign: "center"},
        },
      ],
      tableExport: (exportType: string) => {
        const data = fetchCategoryCPMap();
        data.then((res: any) => {
          fetchDataForExport(res.payload.CategoryMapList)
            .then((dataList: any) => {
              if (exportType === 'pdf') {
                exportServ.Export('Category CheckPoints Mapping', dataList, 'pdf');
              } else if (exportType === 'excel') {
                exportServ.Export('Category CheckPoints Mapping', dataList, 'excel');
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
              "Category": element.CountryName,
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
          CategoryId: rowData.data.CategoryId,
          Taskname: "CreateInitialize",
        };
        const dataFetched = dispatch(CreateInit(data));
        dataFetched
          .then((res) => {
            if (res.payload.tranStatus.result == true) {
              
              
              route.push("/home/cCheckPointMapping");
            }
          })
          .catch((err) => {
          });
        dispatch(createOrEdit(rowData));
      },
  
      edit: (rowData) => {
        const data = {
          CategoryId: rowData.data.CategoryId,
          Taskname: "CreateInitialize",
        };
        const dataFetched = dispatch(CreateInit(data));
        dataFetched
          .then((res) => {
            if (res.payload.tranStatus.result == true) {
              route.push("/home/cCheckPointMapping");
            }
          })
          .catch((err) => {
          });
        dispatch(createOrEdit(rowData));
      },
      delete: (rowData) => {
        confirmation(
          `Are you sure you want to inactive this ${rowData.data.CategoryName}?`,
          "Confirmation",
          () => {
            let CategoryFormData = {
              CategoryId: rowData.data.CategoryId,
            };
            const deletedRes = dispatch(changeStatus(CategoryFormData));
            deletedRes
              .then((res) => {
                if (res.payload.tranStatus.result == true) {
                  toast.current?.show({
                    severity: "success",
                    summary: "Success Message",
                    detail: res.payload.tranStatus.lstErrorItem[0].Message,
                  });
                  fetchCategoryCPMap();
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
          () => { }
        );
      },
    }
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
                      data={allcategory}
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
    )
  }

export default VCategoryCPMapping;