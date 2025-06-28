import React, { useState, useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Button } from "primereact/button";
import { Rating } from "primereact/rating";
import { InputText } from "primereact/inputtext";
import { useDispatch, useSelector } from "react-redux";

import AppTable from "@/components/AppTable";
import PageHeader from "@/components/PageHeader";
import {
  changeStatus,
  CreateInit,
  createOrEdit,
  fetch,
} from "@/redux/slices/master/feedbackSlice";
import { pageLoadScript } from "@/assets/js/common-utilities";
import { ConfirmDialog } from "primereact/confirmdialog";
import AppAlert from "@/alert/alert";
import { ExportClass, exportServ } from "@/services/ExportService";
import { Toast } from "@/assets/css/prime-library";
import { permissionService } from "@/services/PermissionService";
import { confirmation } from "@/components/UtilityComp";

const VFeedback = () => {
  const route = useHistory();
  const dispatch: any = useDispatch();
  const [screenPermissions, setScreenPermissions] = useState<any>();
  const [tableActions, setTableActions] = useState([]);
  const { loading } = useSelector((state: any) => state.feedback.loading);
  const { FeedbackList } = useSelector((state: any) => state.feedback);
  const toast = useRef<Toast>(null);
  useEffect(() => {
    getallVFeedback();
  }, []);

  useEffect(() => {
    pageLoadScript();
  });

  useEffect(() => {
    setScreenPermissions(permissionService({ screenId: 15 }));
  }, []);

  const getallVFeedback = () => {
    const Feedback = {
      FeedbackId: 0,
      Taskname: "SearchInitialize",
      CompanyId: localStorage["CompanyId"],
      PlantId: localStorage["PlantId"],
      RoleId: localStorage["DefaultRoleId"],
    };
    return dispatch(fetch(Feedback));
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
    // if (
    //   screenPermissions?._Update &&
    //   tableActions.filter((item) => item.name == "edit").length == 0
    // ) {
    //   setTableActions([
    //     ...tableActions,
    //     {
    //       title: "Edit",
    //       name: "edit",
    //       disabled: false,
    //     },
    //   ]);
    // }
    // if (
    //   screenPermissions?._Delete &&
    //   tableActions.filter((item) => item.name == "delete").length == 0
    // ) {
    //   setTableActions([
    //     ...tableActions,
    //     {
    //       title: "Delete",
    //       name: "delete",
    //       disabled: false,
    //     },
    //   ]);
    // }
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

  // useEffect(() => {
  //   if (
  //     screenPermissions?._Add &&
  //     !pageConfig.pageHeader.pageActions[0].create
  //   ) {
  //     setPageConfig((prevPageConfig) => {
  //       const updatedPageHeader = {
  //         ...prevPageConfig.pageHeader,
  //         pageActions: prevPageConfig.pageHeader.pageActions.map((action) => {
  //           return {
  //             ...action,
  //             create: screenPermissions?._Add ? true : false,
  //           };
  //         }),
  //       };

  //       return {
  //         ...prevPageConfig,
  //         pageHeader: updatedPageHeader,
  //       };
  //     });
  //   }
  // }, [screenPermissions]);

  const [pageConfig, setPageConfig] = useState({
    pageTitle: "Feedback Report",
    pageHeader: {
      pageActions: [
        {
          create: false,
          clear: false,
          save: false,
          createQuery: "/home/cFeedbackReport",
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
        title: "Visitor Code",
        name: "VisitorEntryDetailCode",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: { minWidth: "6rem" },
      },
      {
        title: "Feedback User",
        name: "FeedbackUser",
        sort: true,
        avatar: true,
        badge: false,
        colStyle: { minWidth: "6rem" },
      },
      {
        title: "Mobile No",
        name: "MobileNo",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: { minWidth: "6rem" },
      },
      {
        title: "Feedback Description",
        name: "FeedbackDesc",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: { minWidth: "6rem" },
      },
      {
        title: "Submitted At",
        name: "CreatedOn",
        sort: true,
        avatar: true,
        badge: false,
        colStyle: { minWidth: "6rem" },
      },
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
      {
        title: "Status",
        name: "StatusName",
        sort: true,
        avatar: false,
        badge: true,
        colStyle: { minWidth: "3rem", textAlign: "center" },
      },
    ],
    tableExport: (exportType: string) => {
      const data = getallVFeedback();
      data.then((res: any) => {
        fetchDataForExport(res.payload.FeedbackList)
          .then((dataList: any) => {
            if (exportType === "pdf") {
              exportServ.Export("Feedback", dataList, "pdf");
            } else if (exportType === "excel") {
              exportServ.Export("Feedback", dataList, "excel");
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
            "Visitor Code": element.VisitorEntryDetailCode,
            "Feedback Code": element.FeedbackCode,
            "Feedback User": element.FeedbackUser,
            "Mobile No": element.MobileNo,
            "Feedback Description": element.FeedbackDesc,
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
        FeedbackId: rowData.data.FeedbackId,
        Taskname: "CreateInitialize",
        CompanyId: localStorage["CompanyId"],
      PlantId: localStorage["PlantId"],
      RoleId: localStorage["DefaultRoleId"],
      };
      const dataFetched = dispatch(CreateInit(data));

      dataFetched
        .then((res) => {
          if (res.payload.tranStatus.result == true) {
            route.push("/home/cFeedbackReport");
          }
        })
        .catch((err) => {});
      dispatch(createOrEdit(rowData));
    },
    edit: (rowData) => {
      const data = {
        FeedbackId: rowData.data.FeedbackId,
        Taskname: "CreateInitialize",
        CompanyId: localStorage["CompanyId"],
      PlantId: localStorage["PlantId"],
      RoleId: localStorage["DefaultRoleId"],
      };
      const dataFetched = dispatch(CreateInit(data));
      dataFetched
        .then((res) => {
          if (res.payload.tranStatus.result == true) {
            route.push("/home/cFeedbackReport");
          }
        })
        .catch((err) => {});
      dispatch(createOrEdit(rowData));
    },
    delete: (rowData) => {
      confirmation(
        `Are you sure you want to inactive this ${rowData.data.FeedbackName}?`,
        "Confirmation",
        () => {
          let FeedbackFormData = {
            FeedbackId: rowData.data.FeedbackId,
          };
          const deletedRes = dispatch(changeStatus(FeedbackFormData));
          deletedRes
            .then((res) => {
              if (res.payload.tranStatus.result == true) {
                toast.current?.show({
                  severity: "success",
                  summary: "Success Message",
                  detail: res.payload.tranStatus.lstErrorItem[0].Message,
                });
                getallVFeedback();
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
                    data={FeedbackList}
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

export default VFeedback;
