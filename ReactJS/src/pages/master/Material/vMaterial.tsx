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
  createInit,
  deleteMaterial,
  fetchMaterial,
} from "@/redux/slices/master/materialSlice";
import { pageLoadScript } from "@/assets/js/common-utilities";
import { Toast } from "@/assets/css/prime-library";
import AppAlert from "@/alert/alert";
import { ConfirmDialog } from "primereact/confirmdialog";
import { ExportClass, exportServ } from "@/services/ExportService";
import { confirmation } from "@/components/UtilityComp";
import { permissionService } from "@/services/PermissionService";

const VMaterial = () => {
  const [material, setMaterial] = useState(null);
  const route = useHistory();

  const toast = useRef<Toast>(null);
  const [screenPermissions, setScreenPermissions] = useState<any>();
  const [tableActions, setTableActions] = useState([]);

  const dispatch: any = useDispatch();
  const allMaterial = useSelector((state: any) => state.material.MaterialList);
  const loading = useSelector((state: any) => state.numberingSchema.loading);
  const reload = useSelector((state: any) => state.numberingSchema.reload);
  const [update, setUpdate] = useState(false);
  const HdrTable = useSelector((state: any) => state.material.HdrTable);
  useEffect(() => {
    pageLoadScript();
  });

  useEffect(() => {
    setScreenPermissions(permissionService({ screenId: 6 }));
  }, []);


  useEffect(() => {
    if (reload) {
      const data = {
        MaterialId: 0,
      };
      dispatch(fetchMaterial(data));
    }
  }, [reload]);
  // Fetch Data from REDUX API CALL
  useEffect(() => {
    fetchAllMat();
  }, []);

  const fetchAllMat = () => {
    const data = {
      MaterialId: 0,
    };
    return dispatch(fetchMaterial(data));
  };
  useEffect(() => {
    setMaterial(allMaterial);
  }, [allMaterial]);
  useEffect(() => {
    if (HdrTable != null && update) {
      route.push(`/home/cMaterial`);
    }
  }, [HdrTable]);

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
    pageTitle: "Material",
    pageHeader: {
      pageActions: [
        {
          create: false,
          clear: false,
          save: false,
          createQuery: "/home/cMaterial",
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
    },
    tableRows: 10,
    tableRowsOptions: [5, 10, 25],
    tablePagination: true,
    tableActions: tableActions,
    tableColumns: [
      {
        title: "Material Category",
        name: "MaterialCategoryName",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: { minWidth: "16rem" },
      },
      {
        title: "Material Type",
        name: "MaterialTypeName",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: { minWidth: "10rem" },
      },
      {
        title: "Material Code",
        name: "MaterialCode",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: {},
      },
      {
        title: "Material Name",
        name: "MaterialName",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: {},
      },
      {
        title: "Created By",
        name: "CreatedByName",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: { textAlign: "center" },
      },
      {
        title: "Created On",
        name: "CreatedOn",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: {},
      },
      {
        title: "Modified By",
        name: "ModifiedByName",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: { textAlign: "center" },
      },
      {
        title: "Modified On",
        name: "ModifiedOn",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: {},
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
      const data = fetchAllMat();
      data.then((res: any) => {
        fetchDataForExport(res.payload.MaterialList)
          .then((dataList: any) => {
            if (exportType === 'pdf') {
              exportServ.Export('Material', dataList, 'pdf');
            } else if (exportType === 'excel') {
              exportServ.Export('Material', dataList, 'excel');
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
            "Material Category": element.MaterialCategoryName,
            "Material Type": element.MaterialTypeName,
            "Material Code": element.MaterialCode,
            "Material Name": element.MaterialName,
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
        MaterialId: rowData.data.MaterialId,
      };
      dispatch(createInit(data));
      dispatch(createOrEdit(rowData));
      setUpdate(true);
    },
    edit: (rowData) => {
      const data = {
        MaterialId: rowData.data.MaterialId,
        Taskname: "CreateInitialize",
      };
   const dataFetched = dispatch(createInit(data));
          dataFetched
            .then((res) => {
              if (res.payload.transtatus.result == true) {
                route.push("/home/cMaterial");
              }
            })
            .catch((err) => {
              });
          dispatch(createOrEdit(rowData));
        },
    delete: (rowData) => {
      confirmation(
        `Are you sure you want to inactive this ${rowData.data.MaterialName}?`,
        "Confirmation",
        () => {
          let data = {
            MaterialId: rowData.data.MaterialId,
          };
          const deletedRes = dispatch(deleteMaterial(data));
          deletedRes
            .then((res) => {
              if (res.payload.transtatus.result == true) {
                toast.current?.show({
                  severity: "success",
                  summary: "Success Message",
                  detail: res.payload.transtatus.lstErrorItem[0].Message,
                });
                fetchAllMat();
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
                    data={material}
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

export default VMaterial;
