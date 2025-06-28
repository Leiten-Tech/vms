import React, { useState, useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AppTable from "@/components/AppTable";
import PageHeader from "@/components/PageHeader";
import {
  createOrEdit,
  createInit,
  deleteUsers,
  fetchUsers,
} from "@/redux/slices/master/userSlice";
import { pageLoadScript } from "@/assets/js/common-utilities";
import { confirmation } from "@/components/UtilityComp";
import { Toast } from "primereact/toast";
import { ConfirmDialog } from "primereact/confirmdialog";
import AppAlert from "@/alert/alert";
import { ExportClass, exportServ } from "@/services/ExportService";

const VUser = () => {
  const [user, setUser] = useState(null);
  const route = useHistory();
  const dispatch: any = useDispatch();
  const allUsers = useSelector((user: any) => user.user.UserList);
  const loading = useSelector((user: any) => user.user.loading);
  const [update, setUpdate] = useState(false);
  const toast = useRef<Toast>(null);
  // Fetch Data from REDUX API CALL
  useEffect(() => {
    fetchUser();
  }, []);
  useEffect(() => {
    pageLoadScript();
  });
  const fetchUser = () => {
    const user = {
      UserId: 0,
      Taskname: "SearchInitialize",
      PlantId: localStorage["PlantId"],
      RoleId: localStorage["DefaultRoleId"],
      CompanyId: localStorage["CompanyId"],
    };
    return dispatch(fetchUsers(user));
  };
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [pageConfig, setPageConfig] = useState({
    pageTitle: "User",
    pageHeader: {
      pageActions: [
        {
          create: true,
          clear: false,
          save: false,
          createQuery: "/home/cUser",
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
      // {
      //   title: "Employee Name",
      //   name: "EmpName",
      //   sort: true,
      //   avatar: false,
      //   badge: false,
      //   colStyle: { minWidth: "10rem", maxWidth: "20rem" },
      // },
      {
        title: "User Name",
        name: "UserName",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: { minWidth: "10rem", maxWidth: "20rem" },
      },
      {
        title: "Role Name",
        name: "DefaultRoleName",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: {},
      },
      {
        title: "Company Name",
        name: "CompanyName",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: { minWidth: "10rem" },
      },
      {
        title: "Plant Name",
        name: "PlantName",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: {},
      },
      //sales changes
      // {
      //   title: "Created By",
      //   name: "CreatedByName",
      //   sort: true,
      //   avatar: true,
      //   badge: false,
      //   colStyle: { minWidth: "6rem" },
      // },
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
      //   name: "Status",
      //   sort: true,
      //   avatar: false,
      //   badge: true,
      //   colStyle: { minWidth: "2rem", textAlign: "center" },
      // },
      //sales changes
    ],
    tableExport: (exportType: string) => {
      const data = fetchUser();
      data.then((res: any) => {
        fetchDataForExport(res.payload.UserList)
          .then((dataList: any) => {
            if (exportType === "pdf") {
              exportServ.Export("User", dataList, "pdf");
            } else if (exportType === "excel") {
              exportServ.Export("User", dataList, "excel");
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
            // "Employee Name": element.EmpName,
            "User Name": element.UserName,
            "Role Name": element.DefaultRoleName,
            "Company Name": element.CompanyName,
            "Plant Name": element.PlantName,
            //sales changes
            // "Created By": element.CreatedByName,
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
        UserId: rowData.data.UserId,
        Taskname: "CREATEINITIALIZE",
        RoleId: +localStorage["DefaultRoleId"]
          ? +localStorage["DefaultRoleId"]
          : rowData.data.DefaultRoleId,
        CompanyId: +localStorage["CompanyId"]
          ? +localStorage["CompanyId"]
          : rowData.data.CompanyId,
        PlantId: +localStorage["PlantId"]
          ? +localStorage["PlantId"]
          : rowData.data.PlantId,
      };
      const dataFetched = dispatch(createInit(data));
      dataFetched
        .then((res) => {
          if (res.payload.transtatus.result == true) {
            route.push(`/home/cUser`);
          }
        })
        .catch((err) => {});
      dispatch(createOrEdit(rowData));
      setUpdate(true);
    },
    edit: (rowData) => {
      const data = {
        UserId: rowData.data.UserId,
        RoleId: +localStorage["DefaultRoleId"]
          ? +localStorage["DefaultRoleId"]
          : rowData.data.DefaultRoleId,
        CompanyId: +localStorage["CompanyId"]
          ? +localStorage["CompanyId"]
          : rowData.data.CompanyId,
        Taskname: "CREATEINITIALIZE",
        PlantId: +localStorage["PlantId"]
          ? +localStorage["PlantId"]
          : rowData.data.PlantId,
      };
      const dataFetched = dispatch(createInit(data));
      dataFetched
        .then((res) => {
          if (res.payload.transtatus.result == true) {
            route.push("/home/cUser");
          }
        })
        .catch((err) => {});
      dispatch(createOrEdit(rowData));
    },
    delete: (rowData) => {
      confirmation(
        `Are you sure you want to inactive this user (${rowData.data.UserName}) ?`,
        "Confirmation",
        () => {
          let UserFormData = {
            UserId: rowData.data.UserId,
          };
          const deletedRes = dispatch(deleteUsers(UserFormData));
          deletedRes
            .then((res) => {
              if (res.payload.transtatus.result == true) {
                toast.current?.show({
                  severity: "success",
                  summary: "Success Message",
                  detail: res.payload.transtatus.lstErrorItem[0].Message,
                });
                fetchUser();
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
                    data={allUsers}
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
export default VUser;
