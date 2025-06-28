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
} from "@/redux/slices/master/vehicleSlice";
import { log } from "console";
import { pageLoadScript } from "@/assets/js/common-utilities";
import { Toast } from "primereact/toast";
import { confirmation, PoweredBy } from "@/components/UtilityComp";
import { ConfirmDialog } from "primereact/confirmdialog";
import { permissionService } from "@/services/PermissionService";
import AppAlert from "@/alert/alert";
import { ExportClass, exportServ } from "@/services/ExportService";
import { Sidebar } from "primereact/sidebar";
import QRCode from "react-qr-code";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

export const QRPop = (props) => {
  const {
    visible,
    handleClosePop,
    qrValue,
    qrTxt,
    handlePrint,
    componentRef,
    selectedData,
    route,
  } = props;

  return (
    <Dialog
      visible={visible}
      onHide={() => handleClosePop()}
      className="no-print"
      style={{
        width: "auto",
        height: "100%"
      }}
      footer={
        <div className="text-center no-print">
          <Button
            className="no-print"
            label="Cancel"
            title="Cancel"
            icon="pi pi-times-circle"
            severity="danger"
            onClick={() => handleClosePop()}
          />
          <Button
            className="no-print"
            label="Print"
            title="Print"
            icon="pi pi-print"
            onClick={() => handlePrint()}
          />
        </div>
      }
      // style={{
      //   width: "50vw",
      //   minWidth: "50vw",
      //   maxWidth: "50vw",
      //   height: "40vh",
      //   minHeight: "70vh",
      //   maxHeight: "70vh",
      //   top: "30%",
      //   left: "50%",
      //   transform: "translate(-50%, -50%)",
      //   borderRadius: 10,
      // }}
      // closeIcon={() => (
      //   <div className="no-print">
      //     <Button
      //       icon="pi pi-times"
      //       rounded
      //       severity="danger"
      //       aria-label="Cancel"
      //       iconPos={"left"}
      //     />
      //   </div>
      // )}
    >
      <div id="qr_preview" ref={componentRef} className="text-center">
        <div
          style={{
            width: "340px",
            height: "430px",
            // background-color: red;
            textAlign: "center",
            padding: "10px",
          }}
        >
          <div
            style={{
              fontSize: "12px",
              marginBottom: "10px"
            }}
          >
            SCAN HERE FOR {qrTxt}
          </div>
          <h2 className="text-bluegray-700">
            Vehicle No: {selectedData?.data?.VehicleNo}
          </h2>
          <div className="qr_code">
            <QRCode value={qrValue || ""} size={240} />
          </div>
          <div>
            <div
              className="col-12"
              style={{
                padding: "5px",
                maxWidth: "280px",
                margin: "auto"
              }}
            >
              <div className="normal-table">
                <table className="text-left">
                  <tbody>
                    <tr>
                      <td style={{ width: "45%", fontSize: "12px" }}>
                        Vehicle Type :
                      </td>
                      <td style={{ width: "55%", fontSize: "12px" }}>
                        <span>
                          {selectedData?.data?.VehicleTypeName || "-"}
                        </span>
                      </td>
                    </tr>
                    {/* <tr>
                      <td style={{ width: "45%", fontSize: "12px" }}>
                        Vehicle Name :
                      </td>
                      <td style={{ width: "55%", fontSize: "12px" }}>
                        <span>{selectedData?.data?.VehicleName || "-"}</span>
                      </td>
                    </tr> */}
                    <tr>
                      <td style={{ width: "45%", fontSize: "12px" }}>
                        Driver Name :
                      </td>
                      <td style={{ width: "55%", fontSize: "12px" }}>
                        <span>{selectedData?.data?.DriverName || "-"}</span>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ width: "45%", fontSize: "12px" }}>
                        Vehicle Model :
                      </td>
                      <td style={{ width: "55%", fontSize: "12px" }}>
                        <span>{selectedData?.data?.VehicleModel || "-"}</span>
                      </td>
                    </tr>
                    {route?.location?.pathname != "/home/vVehicle" ? (
                      <>
                        <tr>
                          <td style={{ width: "45%", fontSize: "12px" }}>
                            Entry On:
                          </td>
                          <td style={{ width: "55%", fontSize: "12px" }}>
                            <span>
                              {selectedData?.data?.EntryTime != null
                                ? new Intl.DateTimeFormat("en-US", {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit",
                                    hour12: true,
                                  }).format(
                                    new Date(selectedData?.data?.EntryTime)
                                  )
                                : "-"}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td style={{ width: "45%", fontSize: "12px" }}>
                            Exit On :
                          </td>
                          <td style={{ width: "55%", fontSize: "12px" }}>
                            <span>
                              {selectedData?.data?.ExitTime != null
                                ? new Intl.DateTimeFormat("en-US", {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit",
                                    hour12: true,
                                  }).format(
                                    new Date(selectedData?.data?.ExitTime)
                                  )
                                : "-"}
                            </span>
                          </td>
                        </tr>
                      </>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div style={{
            padding:"10px 0px",
            textAlign: "right"
          }}>
            <PoweredBy />
          </div>
        </div>
      </div>
    </Dialog>
  );
};

const VVehicle = () => {
  const [Vehicle, setVehicle] = useState(null);
  const route = useHistory();
  const dispatch: any = useDispatch();
  const loading = useSelector((state: any) => state.vehicle.loading);
  const allVehicle = useSelector((state: any) => state.vehicle.VehicleList);
  const [update, setUpdate] = useState(false);
  const [visible, setVisible] = useState(false);
  const [qrValue, setQrValue] = useState<any>();
  const [qrTxt, setQrTxt] = useState<any>();
  const [selectedData, setSelectedData] = useState<any>();
  const [screenPermissions, setScreenPermissions] = useState<any>();
  const [tableActions, setTableActions] = useState([]);
  const [VehicleList, setVehicleList] = useState([]);
  const toast = useRef<Toast>(null);
  // const [exportService] = useState(() => new ExportService());

  const componentRef = React.useRef(null);

  useEffect(() => {
    pageLoadScript();
  });

  useEffect(() => {
    setScreenPermissions(permissionService({ screenId: 7 }));
  }, []);

  const handleClosePop = () => {
    setVisible(false);
  };

  const handlePrint = () => {
    // window.print();

    var divContents = document.getElementById("qr_preview").innerHTML;
    var a = window.open("", "", "height=1000, width=1000");
    a.document.write("<html><head><title>QR Code Preview</title></head>");
    a.document.write(
      `<body style="margin: 0; padding: 0;">
        ${divContents}
      </body>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,700;1,700&display=swap');
        * { font-family: 'Open Sans', sans-serif; }
        .no-print { display: none; }
        .qr_code {
          margin: auto;
          margin-top: 15px;
          text-align: center;
          border: 2px solid #000000;
          padding: 10px;
          border-radius: 10px;
          width: 260px;
        }
          .text-gray-600 {color: #6c757d !important;}
        .text-center { text-align: center; }
        .text-5xl {
          font-size: 2.5rem !important;
          text-align: center;
          font-family: 'Open Sans', sans-serif;
          font-weight: 700;
        }
        .text-3xl {
          font-size: 1.75rem !important;
        }
        .text-bluegray-700 { color: #576375 !important; }
        h2 { font-size: 16px; }
        table td { font-weight: 100; }
        @media print {
          @page {
            margin: 0; /* Remove default page margins */
          }
          body {
            margin: 0; /* Remove default body margins */
          }
        }
      </style>`
    );
    a.document.close();
    a.print();
  };

  // Fetch Data from REDUX API CALL
  useEffect(() => {
    fetchVehicle();
  }, []);

  const fetchVehicle = () => {
    const vehicle = {
      VehicleId: 0,
      Taskname: "SEARCHINITIALIZE",
      CompanyId: +localStorage["CompanyId"],
      PlantId: +localStorage["PlantId"],
      RoleId: +localStorage["DefaultRoleId"],
    };
    return dispatch(fetch(vehicle));
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
    setPageConfig({
      ...pageConfig,
      tableActions: tableActions,
    });
  }, [tableActions]);

  const [pageConfig, setPageConfig] = useState({
    pageTitle: "Vehicle",
    pageHeader: {
      pageActions: [
        {
          create: false,
          clear: false,
          save: false,
          createQuery: "/home/cVehicle",
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
    tableActions: tableActions,
    tableAddActions: [
      {
        title: "Check In/ Out Print",
        name: "print",
        disabled: false,
        colOn: "print",
        id: "check_in_out_qr",
      },
    ],
    tableColumns: [
      {
        title: "Vehicle Code",
        name: "VehicleCode",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: { minWidth: "6rem" },
      },
      // {
      //   title: "Vehicle Name",
      //   name: "VehicleName",
      //   sort: true,
      //   avatar: false,
      //   badge: false,
      //   colStyle: { minWidth: "6rem" },
      // },
      {
        title: "Vehicle No",
        name: "VehicleNo",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: {},
      },
      {
        title: "Vehicle Type",
        name: "VehicleTypeName",
        sort: true,
        avatar: true,
        badge: false,
        colStyle: { minWidth: "6rem" },
      },
      {
        title: "Last Vehicle Fc Date",
        name: "VehicleFcDate",
        sort: true,
        avatar: true,
        badge: false,
        colStyle: { minWidth: "6rem" },
      },
      {
        title: "Last Service Date",
        name: "ServiceDate",
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
        colStyle: { minWidth: "2rem" },
      },
      {
        title: "Print",
        name: "print",
        sort: true,
        avatar: false,
        badge: false,
        action: true,
        colOn: "print",
        colStyle: {
          minWidth: "7rem",
          maxWidth: "8rem",
          textAlign: "center",
        },
      },
    ],
    tableExport: (exportType: string) => {
      const data = fetchVehicle();
      data.then((res: any) => {
        fetchDataForExport(res.payload.VehicleList)
          .then((dataList: any) => {
            if (exportType === "pdf") {
              exportServ.Export("Vehicle", dataList, "pdf");
            } else if (exportType === "excel") {
              exportServ.Export("Vehicle", dataList, "excel");
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
            "Vehicle Code": element.VehicleCode,
            // "Vehicle Name": element.VehicleName,
            "Vehicle No": element.VehicleNo,
            "Vehicle Type": element.VehicleTypeName,
            "Last Vehicle Fc Date": element.VehicleFcDate,
            "Last Service Date": element.ServiceDate,
            "Created By": element.CreatedByName,
            "Created On": element.CreatedOn,
            "Modified By": element.ModifiedByName,
            "Modified On": element.ModifiedOn,
            Status: element.StatusName,
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
        VehicleId: rowData.data.VehicleId,
        Taskname: "CREATEINITIALIZE",
        CompanyId: +localStorage["CompanyId"],
        PlantId: +localStorage["PlantId"],
        RoleId: +localStorage["DefaultRoleId"],
      };
      const dataFetched = dispatch(createInit(data));
      dataFetched
        .then((res) => {
          if (res.payload.transtatus.result == true) {
            route.push(`/home/cVehicle`);
          }
        })
        .catch((err) => {});
      dispatch(createOrEdit(rowData));
      setUpdate(true);
    },
    edit: (rowData) => {
      const data = {
        VehicleId: rowData.data.VehicleId,
        Taskname: "CREATEINITIALIZE",
        CompanyId: +localStorage["CompanyId"],
        PlantId: +localStorage["PlantId"],
        RoleId: +localStorage["DefaultRoleId"],
      };
      const dataFetched = dispatch(createInit(data));
      dataFetched
        .then((res) => {
          if (res.payload.transtatus.result == true) {
            route.push(`/home/cVehicle`);
          }
        })
        .catch((err) => {});
      dispatch(createOrEdit(rowData));

      if (rowData.VehicleType === 29 && !rowData.SupplierId) {
        toast.current?.show({
          severity: "error",
          summary: "Error Message",
          detail: "Please Select Supplier Name",
        });
        return;
      }
    },
    delete: (rowData) => {
      confirmation(
        `Are you sure you want to inactive this ${rowData.data.VehicleNo}?`,
        "Confirmation",
        () => {
          let VehicleFormData = {
            VehicleId: rowData.data.VehicleId,
          };
          const deletedRes = dispatch(changeStatus(VehicleFormData));
          deletedRes
            .then((res) => {
              if (res.payload.transtatus.result == true) {
                toast.current?.show({
                  severity: "success",
                  summary: "Success Message",
                  detail: res.payload.transtatus.lstErrorItem[0].Message,
                });
                fetchVehicle();
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
    print: (rowData) => {
      if (rowData.rowItem.id == "appointment_qr") {
        setQrValue(import.meta.env.VITE_LOCAL_URL + rowData.data.UrlToken);
        setQrTxt("APPOINTMENT");
        setSelectedData(rowData);
        setVisible(true);
      } else if (rowData.rowItem.id == "check_in_out_qr") {
        setQrValue(rowData.data.VehicleToken);
        setQrTxt("VEHICLE ENTRY");
        setSelectedData(rowData);
        setVisible(true);
      }
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
                    data={allVehicle}
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
      <QRPop
        visible={visible}
        handleClosePop={handleClosePop}
        qrValue={qrValue}
        qrTxt={qrTxt}
        handlePrint={handlePrint}
        componentRef={componentRef}
        selectedData={selectedData}
        route={route}
      />
      <AppAlert toast={toast} />
    </>
  );
};
export default VVehicle;
