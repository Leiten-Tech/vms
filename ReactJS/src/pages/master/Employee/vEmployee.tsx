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
  deleteEmployee,
  fetchEmployee,
} from "@/redux/slices/master/employeeSlice";
import { pageLoadScript } from "@/assets/js/common-utilities";
import { Toast } from "primereact/toast";
import { confirmation } from "@/components/UtilityComp";
import { ConfirmDialog } from "primereact/confirmdialog";
import AppAlert from "@/alert/alert";
import { ExportClass, exportServ } from "@/services/ExportService";

const VEmployee = () => {
  const [employeeList, setEmployeeList] = useState(null);
  const route = useHistory();
  const toast = useRef<Toast>(null);
  useEffect(() => {
    pageLoadScript();
  });
  const dispatch: any = useDispatch();
  const HdrTable = useSelector((state: any) => state.employee.HdrTable);
  const EmployeeList = useSelector((state: any) => state.employee.EmployeeList);
  const loading = useSelector((state: any) => state.employee.loading);
  const reload = useSelector((state: any) => state.employee.reload);
  const [update, setUpdate] = useState(false);
  // Fetch Data from REDUX API CALL
  useEffect(() => {
    fetchAllEmp();
  }, []);
  const fetchAllEmp = () => {
    const data = {
      EmployeeId: 0,
    };
    return dispatch(fetchEmployee(data));
  };
  useEffect(() => {
    setEmployeeList(EmployeeList);
  }, [EmployeeList]);
  useEffect(() => {
    if (HdrTable != null && update) {
      route.push(`/home/cEmployee`);
    }
  }, [HdrTable]);
  const [pageConfig, setPageConfig] = useState({
    pageTitle: "Employee",
    pageHeader: {
      pageActions: [
        {
          create: true,
          clear: false,
          save: false,
          createQuery: "/home/cEmployee",
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
      {
        title: "Employee Code",
        name: "EmployeeCode",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: { minWidth: "16rem" },
      },
      {
        title: "Employee Name",
        name: "EmployeeName",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: { minWidth: "16rem", maxWidth: "20rem" },
      },
      {
        title: "Role",
        name: "RoleName",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: { minWidth: "10rem" },
      },
      {
        title: "Plant",
        name: "PlantName",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: { minWidth: "10rem" },
      },
      {
        title: "Department",
        name: "DepartmentName",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: { minWidth: "16rem" },
      },
      {
        title: "Contact No",
        name: "PrimaryMobileNo",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: { minWidth: "10rem" },
      },
      {
        title: "Mail ID",
        name: "Email",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: { minWidth: "10rem" },
      },
      {
        title: "Created By",
        name: "CreatedByName",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: { minWidth: "10rem" },
      },
      {
        title: "Created On",
        name: "CreatedOn",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: { minWidth: "16rem" },
      },
      {
        title: "Modified By",
        name: "ModifiedByName",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: { minWidth: "10rem" },
      },
      {
        title: "Modified On",
        name: "ModifiedOn",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: { minWidth: "16rem" },
      },
      {
        title: "Status",
        name: "StatusName",
        sort: true,
        avatar: false,
        badge: true,
        colStyle: { minWidth: "6rem", textAlign: "center" },
      },
    ],
    tableExport: (exportType: string) => {
      const data = fetchAllEmp();
      data.then((res: any) => {
        fetchDataForExport(res.payload.EmployeeList, exportType)
          .then((dataList: any) => {
            if (exportType === "pdf") {
              exportServ.Export("Employee", dataList, "pdf");
            } else if (exportType === "excel") {
              exportServ.Export("Employee", dataList, "excel");
            }
          })
          .catch((error) => {
            console.error(error.message);
          });
      });
    },
  });
  

  const fetchDataForExport = (vList,exportType) => {
    return new Promise((resolve, reject) => {
      let dataList = [];
  
      if (vList.length > 0) {
        vList.forEach((element) => {
          let data = {
            "Employee Code": element.EmployeeCode,
            "Employee Name": element.EmployeeName,
            "Role": element.RoleName,
            "Plant": element.PlantName,
            "Department": element.DepartmentName,
            "Contact No": element.PrimaryMobileNo,
            "Mail ID": element.Email,
            "Status": element.StatusName,
          };
  
          // Conditionally add more columns for Excel export
          if (exportType === "excel") {
            data["Created By"] = element.CreatedByName;
            data["Created On"] = element.CreatedOn;
            data["Modified By"] = element.ModifiedByName;
            data["Modified On"] = element.ModifiedOn;
          }
  
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
        EmployeeId: rowData.data.EmployeeId,
      };
      dispatch(createInit(data));
      dispatch(createOrEdit(rowData));
      setUpdate(true);
    },
    edit: (rowData) => {
      const data = {
        EmployeeId: rowData.data.EmployeeId,
      };
      const dataFetched = dispatch(createInit(data));
      dataFetched
        .then((res) => {
          if (res.payload.transtatus.result == true) {
            route.push("/home/cEmployee");
          }
        })
        .catch((err) => {
          
        });
      dispatch(createOrEdit(rowData));
      setUpdate(true);
    },
    delete: (rowData) => {
      confirmation(
        `Are you sure you want to inactive this Employee ${rowData.data.EmployeeName}?`,
        "Confirmation",
        () => {
          let EmployeeFormData = {
            EmployeeId: rowData.data.EmployeeId,
          };
          const deletedRes = dispatch(deleteEmployee(EmployeeFormData));
          deletedRes
            .then((res) => {
              if (res.payload.transtatus.result == true) {
                toast.current?.show({
                  severity: "success",
                  summary: "Success Message",
                  detail: res.payload.transtatus.lstErrorItem[0].Message,
                });
                fetchAllEmp();
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
                    data={employeeList}
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
export default VEmployee;
