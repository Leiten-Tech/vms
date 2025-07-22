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
} from "@/redux/slices/master/ApprovalSlice";
import { log } from "console";
import { pageLoadScript } from "@/assets/js/common-utilities";
import { Toast } from "primereact/toast";
import { confirmation } from "@/components/UtilityComp";
import { ConfirmDialog } from "primereact/confirmdialog";
import AppAlert from "@/alert/alert";

const VApprovalConfiguration = () => {
  const [Approval, setApproval] = useState(null);
  const route = useHistory();
  const dispatch: any = useDispatch();
  const loading = useSelector((state: any) => state.approval.loading);
  const allApproval = useSelector((state: any) => state.approval.ApprovalList);
  const [update, setUpdate] = useState(false);
  const [ApprovalList, setApprovalList] = useState([]);
  const toast = useRef<Toast>(null);
  useEffect(() => {
    pageLoadScript();
  });
  // Fetch Data from REDUX API CALL
  useEffect(() => {
    
    fetchApproval();
  }, []);
  const fetchApproval = () => {
    const Approval = {
      ApprovalConfigurationId: 0,
      Taskname: "SEARCHINITIALIZE",
      CompanyId: +localStorage["CompanyId"],
      PlantId: +localStorage["PlantId"],
      RoleId: +localStorage["DefaultRoleId"],
      DepartmentId: +localStorage["DeptId"],
    };
    dispatch(fetch(Approval));
  };
  const [pageConfig, setPageConfig] = useState({
    pageTitle: "Approval Configuration",
    pageHeader: {
      pageActions: [
        {
          create: true,
          clear: false,
          save: false,
          createQuery: "/home/cApprovalConfiguration",
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
        title: "Document Name",
        name: "DocumentName",
        sort: true,
        avatar: true,
        badge: false,
        colStyle: { minWidth: "6rem" },
      },
      {
        title: "Activity",
        name: "ApprovalActivityName",
        sort: true,
        avatar: false,
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
      //sales changes
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
      //   colStyle: { minWidth: "2rem",textAlign:"center" },
      // },
      //sales changes
    ],
  });
  const handleActions = {
    view: (rowData) => {
      const data = {
        ApprovalConfigurationId: rowData.data.ApprovalConfigurationId,
        CompanyId: +localStorage["CompanyId"],
        PlantId: +localStorage["PlantId"],
        RoleId: +localStorage["DefaultRoleId"],
        DepartmentId: +localStorage["DeptId"],
        Taskname: "CREATEINITIALIZE",
      };
      const dataFetched = dispatch(createInit(data));
      dataFetched
        .then((res) => {
          if (res.payload.transtatus.result == true) {
            route.push(`/home/cApprovalConfiguration`);
          }
        })
        .catch((err) => {});
      dispatch(createOrEdit(rowData));
    },
    edit: (rowData) => {
      const data = {
        ApprovalConfigurationId: rowData.data.ApprovalConfigurationId,
        CompanyId: +localStorage["CompanyId"],
        PlantId: +localStorage["PlantId"],
        RoleId: +localStorage["DefaultRoleId"],
        DepartmentId: +localStorage["DeptId"],
        Taskname: "CREATEINITIALIZE",
      };
      const dataFetched = dispatch(createInit(data));
      dataFetched
        .then((res) => {
          if (res.payload.transtatus.result == true) {
            route.push(`/home/cApprovalConfiguration`);
          }
        })
        .catch((err) => {});
      dispatch(createOrEdit(rowData));
      // setUpdate(true);
    },

    delete: (rowData) => {
      confirmation(
        `Are you sure you want to inactive this Approval
        ?`,
        "Confirmation",
        // ${rowData.data.CityName}
        () => {
          let ApprovalFormData = {
            ApprovalConfigurationId: rowData.data.ApprovalConfigurationId,
          };
          const deletedRes = dispatch(changeStatus(ApprovalFormData));
          deletedRes
            .then((res) => {
              if (res.payload.transtatus.result == true) {
                toast.current?.show({
                  severity: "success",
                  summary: "Success Message",
                  detail: res.payload.transtatus.lstErrorItem[0].Message,
                });
                fetchApproval();
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
                    data={allApproval}
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
export default VApprovalConfiguration;
