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
  deleteCustomer,
  fetchCustomer,
} from "@/redux/slices/master/customerSlice";
import { confirmation } from "@/components/UtilityComp";
import { Toast } from "primereact/toast";
import AppAlert from "@/alert/alert";
import { permissionService } from "@/services/PermissionService";
import { ConfirmDialog } from "primereact/confirmdialog";
import { exportServ } from "@/services/ExportService";
const VCustomer = () => {
  const [customerList, setCustomerList] = useState(null);
  const route = useHistory();
  const toast = useRef<Toast>(null);
  const dispatch: any = useDispatch();
  const loading = useSelector((state: any) => state.customer.loading);
  const reload = useSelector((state: any) => state.customer.reload);
  const [screenPermissions, setScreenPermissions] = useState<any>();
  const [tableActions, setTableActions] = useState([]);

  const HdrTable = useSelector((state: any) => state.customer.HdrTable);
  const createEditData = useSelector(
    (state: any) => state.customer.createEditData
  );
  const AllCustomerList = useSelector(
    (state: any) => state.customer.CustomerList
  );
  const [update, setUpdate] = useState(false);
  const [openPrint, setOpenPrint] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    setScreenPermissions(permissionService({ screenId: 23 }));
  }, []);

  const fetchCustomers = () => {
    const Customer = {
      CustomerId: 0,
      Taskname: "SEARCHINITIALIZE",
      CompanyId: +localStorage["CompanyId"],
    };
    return dispatch(fetchCustomer(Customer));
  };

  useEffect(() => {
    setCustomerList(AllCustomerList);
  }, [AllCustomerList]);

  useEffect(() => {
    if (HdrTable != null && update) {
      route.push(`/home/cCustomer`);
    }
  }, [HdrTable]);
  // Assign Data  to STATE

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
    pageTitle: "Customer",
    pageHeader: {
      pageActions: [
        {
          create: false,
          clear: false,
          save: false,
          createQuery: "/home/cCustomer",
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
    tableActions:  tableActions,
    tableColumns: [
      {
        title: "Customer Name",
        name: "CustomerName",
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
        title: "Country Name",
        name: "CountryName",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: { minWidth: "10rem" },
      },
      {
        title: "State Name",
        name: "StateName",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: {},
      },
      {
        title: "City Name",
        name: "CityName",
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
      const data = fetchCustomers();
      data.then((res: any) => {
        fetchDataForExport(res.payload.CustomerList)
          .then((dataList: any) => {
            if (exportType === 'pdf') {
              exportServ.Export('Customer', dataList, 'pdf');
            } else if (exportType === 'excel') {
              exportServ.Export('Customer', dataList, 'excel');
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
            "Customer Name": element.CustomerName,
            "Company Name": element.CompanyName,
            "Country Name": element.CountryName,
            "State Name": element.StateName,
            "City Name": element.CityName,
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
      setOpenPrint(null);
      const data = {
        CustomerId: rowData.data.CustomerId,
      };
      dispatch(createInit(data));
      dispatch(createOrEdit(rowData));
      setUpdate(true);
    },
    edit: (rowData) => {
      setOpenPrint(null);
      const data = {
        CustomerId: rowData.data.CustomerId,
      };
      dispatch(createInit(data));
      dispatch(createOrEdit(rowData));
      setUpdate(true);
    },
    delete: (rowData) => {
      confirmation(
        `Are you sure you want to inactive this Customer (${rowData.data.CustomerName}) ?`,
        "Confirmation",
        () => {
          let CustomerFormData = {
            CustomerId: rowData.data.CustomerId,
          };
          const deletedRes = dispatch(deleteCustomer(CustomerFormData));
          deletedRes
            .then((res) => {
              if (res.payload.transtatus.result == true) {
                toast.current?.show({
                  severity: "success",
                  summary: "Success Message",
                  detail: res.payload.transtatus.lstErrorItem[0].Message,
                });
                const data = {
                  CustomerId: 0,
                };
                dispatch(fetchCustomer(data));
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
        () => { }
      );
    },
    print: (rowData) => {
      printPdf();
    },
  };
  const printPdf = () => {
    localStorage.setItem("dataForPrint", JSON.stringify(createEditData));
    window.open("/home/print", "_blank");
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
                    data={customerList}
                    loading={loading}
                    pageConfig={pageConfig}
                    screenPermissions={screenPermissions}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* {openPrint!=null&&<PrintComponent
         data={openPrint}/>} */}
      </div>
      <ConfirmDialog />
      <AppAlert toast={toast} />
    </>
  );
};

export default VCustomer;
