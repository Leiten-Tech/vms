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
  createInit,
  deleteNumberingSchema,
  fetchNumberingSchema,
} from "@/redux/slices/master/numberingShemaSlice";
import { pageLoadScript } from "@/assets/js/common-utilities";
import { confirmation } from "@/components/UtilityComp";
import { ExportClass, exportServ } from "@/services/ExportService";
import { ConfirmDialog } from "primereact/confirmdialog";
import AppAlert from "@/alert/alert";


const VNumberingSchema = () => {
  const [numberingSchema, setNumberingSchema] = useState(null);
  const route = useHistory();
  const toast = useRef<Toast>(null);
  const dispatch: any = useDispatch();
  const [update, setUpdate] = useState(false);

  const { NumberingSchemaViewList, loading, reload} = useSelector((state: any) => state.numberingSchema);

  useEffect(() => {
    pageLoadScript();
  });
  useEffect(() => {
    getallNumberingSchemas();
  }, []);
  const getallNumberingSchemas = () => {
    const numberingschema = {
      NumberingSchemaId: 0,
      Taskname: "SearchInitialize",
    };
    return dispatch(fetchNumberingSchema(numberingschema));
  };
  
 const [pageConfig, setPageConfig] = useState({
    pageTitle: "Numbering Schema",
    pageHeader: {
      pageActions: [
        {
          create: true,
          clear: false,
          save: false,
          createQuery: "/home/cNumberingSchema",
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
        title: "Document",
        name: "FunctionName",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: { minWidth: "10rem" },
      },
      {
        title: "Prefix",
        name: "Prefix",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: { minWidth: "10rem" },
      },
      {
        title: "Suffix",
        name: "Suffix",
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
        colStyle: { minWidth: "2rem", textAlign: "center" },
      },
    ],
    tableExport: (exportType: string) => {
      const data = getallNumberingSchemas();
      data.then((res: any) => {
        fetchDataForExport(res.payload.NumberingSchemaViewList)
          .then((dataList: any) => {
            if (exportType === 'pdf') {
              exportServ.Export('NumberingSchema', dataList, 'pdf');
            } else if (exportType === 'excel') {
              exportServ.Export('NumberingSchema', dataList, 'excel');
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
            "Document": element.FunctionName,
            "Prefix": element.Prefix,
            "Suffix": element.Suffix,
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
        NumberingSchemaId: rowData.data.NumberingSchemaId,
         Taskname: "CREATEINITIALIZE",
       };
       const dataFetched = dispatch(createInit(data));
       dataFetched
         .then((res) => {
            if (res.payload.transtatus.result == true) {
             route.push("/home/cNumberingSchema");
           }
         })
         .catch((err) => {
          });
         dispatch(createOrEdit(rowData));
      setUpdate(true);
      },
      edit: (rowData) => {
       const data = {
        NumberingSchemaId: rowData.data.NumberingSchemaId,
         Taskname: "CreateInitialize",
       };
       const dataFetched = dispatch(createInit(data));
       dataFetched
         .then((res) => {
           if (res.payload.transtatus.result == true) {
             route.push("/home/cNumberingSchema");
           }
         })
         .catch((err) => {
           });
       dispatch(createOrEdit(rowData));
       setUpdate(true);
     },
    delete: (rowData) => {
      confirmation(
        `Are you sure you want to inactive this ${rowData.data.FunctionName}?`,
        "Confirmation",
        () => {
          let NumberingSchemaFormData = {
            NumberingSchemaId: rowData.data.NumberingSchemaId,
          };
          const deletedRes = dispatch(deleteNumberingSchema(NumberingSchemaFormData));
          deletedRes
            .then((res) => {
              if (res.payload.transtatus.result == true) {
                toast.current?.show({
                  severity: "success",
                  summary: "Success Message",
                  detail: res.payload.transtatus.lstErrorItem[0].Message,
                });
                getallNumberingSchemas();
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
                    data={NumberingSchemaViewList}
                    loading={loading}
                    pageConfig={pageConfig}
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

export default VNumberingSchema;
