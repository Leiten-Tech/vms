import React, { useState, useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import AppTable from "@/components/AppTable";
import PageHeader from "@/components/PageHeader";
import {
  changestatus,
  createVM,
  createInitVM,
  createOrEdit,
  fetch,
  updateVM,
} from "@/redux/slices/master/visitorSlice";
import { useDispatch, useSelector } from "react-redux";
import { Toast } from "primereact/toast";
import AppAlert from "@/alert/alert";
import { pageLoadScript } from "@/assets/js/common-utilities";
import { confirmation } from "@/components/UtilityComp";
import { ExportClass, exportServ } from "@/services/ExportService";
import { ConfirmDialog } from "primereact/confirmdialog";
import FormFields from "@/components/FormFields";
import { Dropdown } from "primereact/dropdown";

const VVisitor = () => {
  const [visitors, setVisitors] = useState(null);
  const route = useHistory();
  const toast = useRef<Toast>(null);
  const dispatch: any = useDispatch();
  let allVisitors = useSelector((state: any) => state.visitor.VisitorList);
  const [visType, setVisType] = useState(97)
  const {
    isCreate,
    isView,
    createEditData,
    loading,
    error,
    tranStatus,
    VisitorHeader,
    VisitorTypeList,
    TitleList,
    IdCardList,
    StatusList,
    CountryList,
    StateList,
    CityList,
    DepartmentList,
    VisitorDetail,
    VisitorSearchList,
    VisitorTypeSearchList
  } = useSelector((state: any) => state.visitor);

  useEffect(() => {
    pageLoadScript();
  });

  useEffect(() => {
    Fetch();
  }, []);
  const [pageConfig, setPageConfig] = useState({
    pageTitle: "Visitor",
    pageHeader: {
      pageActions: [
        {
          create: true,
          clear: false,
          save: false,
          createQuery: "/home/cVisitor",
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
      maxWidth: "12rem",
      textAlign: "center",
      justifySelf: "center",
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
        title: "Visitor Code",
        name: "VisitorCode",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: { minWidth: "10rem" },
      },
      {
        title: "Visitor Name",
        name: "VisitorName",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: {
          minWidth: "16rem",
        },
      },
      {
        title: "Visitor Type",
        name: "VisitorTypeName",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: {},
      },
      {
        title: "Visitor Company",
        name: "VisitorCompany",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: {},
      },
      {
        title: "Mobile No",
        name: "MobileNo",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: {},
      },
      {
        title: "Created By",
        name: "CreatedbyName",
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
        fetchDataForExport(res.payload.VisitorSearchList)
          .then((dataList: any) => {
            if (exportType === "pdf") {
              exportServ.Export("Visitor", dataList, "pdf");
            } else if (exportType === "excel") {
              exportServ.Export("Visitor", dataList, "excel");
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
            "Visitor Code": element.VisitorCode,
            "Visitor Name": element.VisitorName,
            "Visitor Type": element.VisitorTypeName,
            "Visitor Company": element.VisitorCompany,
            "Mobile No": element.MobileNo,
            "Created By": element.CreatedbyName,
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
  const Fetch = () => {
    
    
    const obj = {
      SearchType: visType
    };
    return dispatch(fetch(obj));
  };

  const handleActions = {
    view: (rowData) => {
      const data = {
        VisitorId: rowData.data.VisitorId,
      };
      const dataFetched = dispatch(createInitVM(data));
      dataFetched
        .then((res) => {
          if (res.payload.tranStatus.result == true) {
            route.push("/home/cVisitor");
          } else {
            toast.current?.show({
              severity: "error",
              detail: "Error",
              summary: res.payload.tranStatus.lstErrorItem[0].Message,
            });
          }
        })
        .catch((err) => {
          toast.current?.show({
            severity: "error",
            detail: "Error",
            summary: JSON.stringify(error),
          });
        });
      dispatch(createOrEdit(rowData));
    },
    edit: (rowData) => {
      const data = {
        VisitorId: rowData.data.VisitorId,
      };
      const dataFetched = dispatch(createInitVM(data));
      dataFetched
        .then((res) => {
          if (res.payload.tranStatus.result == true) {
            route.push("/home/cVisitor");
          } else {
            toast.current?.show({
              severity: "error",
              detail: "Error",
              summary: res.payload.tranStatus.lstErrorItem[0].Message,
            });
          }
        })
        .catch((err) => {
          toast.current?.show({
            severity: "error",
            detail: "Error",
            summary: JSON.stringify(error),
          });
        });
      dispatch(createOrEdit(rowData));
    },
    delete: (rowData) => {
      confirmation(
        `Are you sure you want to inactive this Visitor (${rowData.data.VisitorName} - ${rowData.data.VisitorCode}) ?`,
        "Confirmation",
        () => {
          const data = {
            VisitorId: rowData.data.VisitorId,
          };
          var result = dispatch(changestatus(data));
          result
            .then((res) => {
              if (res.payload.tranStatus.result == true) {
                toast.current?.show({
                  severity: "success",
                  detail: "Inactivated Successfully.",
                  summary: "Success Message",
                });
                Fetch();
              } else {
                toast.current?.show({
                  severity: "error",
                  detail: "Error",
                  summary: res.payload.tranStatus.lstErrorItem[0].Message,
                });
              }
            })
            .catch((error) => {
              toast.current?.show({
                severity: "error",
                detail: "Error",
                summary: JSON.stringify(error),
              });
            });
        },
        () => { }
      );
    },
  };

  const handleTypeChange = (e) => {
    
    
    setVisType(e.target.value);
    const obj = {
      SearchType: e.target.value
    };
    return dispatch(fetch(obj));
  }
  useEffect(() => {
    
    setVisType(visType)
    
    
  }, [visType])
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
                  <label className="form-label">
                    Visitor Type  :
                  </label>
                  <Dropdown
                    value={visType}
                    options={VisitorTypeSearchList}
                    optionLabel="MetaSubDescription"
                    optionValue="MetaSubId"
                    name="MetaSubDescription"
                    filter
                    onChange={(e) => handleTypeChange(e)}
                    style={{ width: "200px", marginBottom: "20px", marginLeft: "20px" }}
                  />
                  <AppTable
                    handleActions={handleActions}
                    data={VisitorSearchList}
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
export default VVisitor;
