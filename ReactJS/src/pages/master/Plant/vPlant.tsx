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
  SearchInitialize,
  CreateInitialize,
  Update,
  ChangeStatus,
} from "@/redux/slices/master/plantSlice";
import { pageLoadScript } from "@/assets/js/common-utilities";
import {
  confirmation,
  Instructions,
  PoweredBy,
} from "@/components/UtilityComp";
import { ConfirmDialog } from "primereact/confirmdialog";
import { permissionService } from "@/services/PermissionService";
import { ExportClass, exportServ } from "@/services/ExportService";
import AppAlert from "@/alert/alert";
import { Dialog, Sidebar } from "@/assets/css/prime-library";
import QRCode from "react-qr-code";
import "../../../assets/css/style.css";
import ReactToPrint from "react-to-print";
import { IMAGES } from "@/assets/images/Images";

export const QRPop = (props) => {
  const { visible, handleClosePop, qrValue, qrTxt, handlePrint, componentRef } =
    props;
  return (
    <Sidebar
      visible={visible}
      onHide={() => handleClosePop()}
      className="no-print"
      style={{
        width: "50vw",
        minWidth: "50vw",
        maxWidth: "50vw",
        height: "90vh",
        minHeight: "90vh",
        maxHeight: "90vh",
        top: "45%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        borderRadius: 10,
      }}
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
      <div
        id="qr_preview"
        ref={componentRef}
        className="flex flex-column justify-content-between relative text-center"
      >
        <div
          className="flex flex-column justify-content-between relative text-center gap-2 border-1 border-round-2xl border-black-alpha-30"
          style={{
            gap: "10px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: "15px",
              padding: "10px",
              paddingBottom: "0px"
            }}
          >
            <div>
              <img
                style={{
                  maxWidth: 130,
                }}
                src={IMAGES.NewPhone}
                alt=""
              />
            </div>
            <div>
              <h1 style={{ margin: "0px", marginBottom: "5px" }} className="text-2xl">
                SCAN HERE FOR {qrTxt}
              </h1>
              <div className="qr_code" style={{
                width: "375px",
                margin: "auto"
              }}>
                <QRCode value={qrValue || ""} size={350} />
              </div>
            </div>
            <div>
              <img
                style={{
                  maxWidth: 130,
                }}
                src={IMAGES.NewPhone}
                alt=""
              />
            </div>
          </div>
          {/* <div
            style={{
              maxWidth: "800px",
            }}
          >
            <Instructions />
          </div> */}
          <div style={{
            padding: "10px"
          }}>
            <PoweredBy />
            <div className="p-3 text-center no-print">
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
          </div>
        </div>
      </div>
    </Sidebar>
  );
};

const VPlant = () => {
  const route = useHistory();
  const dispatch: any = useDispatch();
  const [screenPermissions, setScreenPermissions] = useState<any>();
  const toast = useRef<Toast>(null);
  const [tableActions, setTableActions] = useState([]);
  const { loading, PlantList } = useSelector((state: any) => state.plant);
  const [visible, setVisible] = useState(false);
  const [qrValue, setQrValue] = useState<any>();
  const [qrTxt, setQrTxt] = useState<any>();

  const componentRef = React.useRef(null);

  useEffect(() => {
    pageLoadScript();
  });

  useEffect(() => {
    setScreenPermissions(permissionService({ screenId: 24 }));
  }, []);

  useEffect(() => {
    getallPlant();
  }, []);

  const handleClosePop = () => {
    setVisible(false);
  };

  const handlePrint = () => {
    // window.print();

    var divContents = document.getElementById("qr_preview").innerHTML;
    var a = window.open("", "", "height=1000, width=1000");
    a.document.write("<html>");
    a.document.write('<body style="padding:15px;">');
    a.document.write(divContents);
    a.document.write(
      `</body><style>@import url('https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,700;1,700&display=swap');*{font-family: 'Open Sans', sans-serif;}.no-print {display: none;}.w-12rem {width: 12rem !important}.m-3 {
    margin: 1rem !important;}.font-bold {font-weight: 700 !important;}.qr_code{margin-top:15px;text-align:center;border: 2px solid #000000;
    padding: 10px;
    border-radius: 10px;}.text-center{text-align: center}.text-5xl{font-size: 2.5rem !important;text-align: center;font-family: 'Open Sans', sans-serif;font-weight: 700;}.text-gray-600 {color: #6c757d !important;}
    .text-right{
    text-align: right}
    .relative {
    position: relative !important;
    }
    .justify-content-between {
        justify-content: space-between !important;
    }
    .flex-column {
        flex-direction: column !important;
    }
    .text-center {
        text-align: center !important;
    }
        .m-auto{margin: auto;}
    .flex {
        display: flex !important;
    }.h-full{
    height: 100%;}
    .w-full{width: 100%;}
    .gap-5{gap: 2rem !important;}.border-black-alpha-30{border-color: rgba(0, 0, 0, 0.3) !important;}
    .border-1 {
    border-width: 1px !important;
    border-style: solid;
}.border-round-2xl {
    border-radius: 1rem !important;
}.border-top-1 {
    border-top-width: 1px !important;
    border-top-style: solid;
}.text-2xl {
    font-size: 1.5rem !important;
}.mb-1{margin-bottom: 1px}
.mr-5{margin-right: 5px}
    </style></html>`
    );
    a.document.close();
    a.print();
  };

  const getallPlant = () => {
    const plant = {
      PlantId: 0,
      Taskname: "SearchInitialize",
      CompanyId: +localStorage["CompanyId"],
      RoleId: +localStorage["DefaultRoleId"],
    };
    return dispatch(SearchInitialize(plant));
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
    pageTitle: "Plant",
    pageHeader: {
      pageActions: [
        {
          create: false,
          clear: false,
          save: false,
          createQuery: "/home/cPlant",
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
      minWidth: "10rem",
      maxWidth: "10rem",
      textAlign: "center",
      justifySelf: "center",
    },
    tableRows: 10,
    tableRowsOptions: [5, 10, 25],
    tablePagination: true,
    tableActions: tableActions,
    tableAddActions: [
      {
        title: "Appointment QRCode Print",
        name: "print",
        disabled: false,
        colOn: "print",
        id: "appointment_qr",
      },
      // {
      //   title: "Check In/ Out Print",
      //   name: "print",
      //   disabled: false,
      //   colOn: "print",
      //   id: "check_in_out_qr",
      // },
      {
        title: "Is Auto Approve",
        name: "is_auto_approve",
        disabled: false,
        colOn: "is_auto_approve",
        id: "is_auto_approve",
      },
    ],
    tableFenoActions: [
      {
        title: "Is Auto Approve",
        name: "is_auto_approve",
        disabled: false,
        id: "is_auto_approve",
      },
    ],
    tableColumns: [
      {
        title: "Company",
        name: "CompanyName",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: {
          minWidth: "10rem",
        },
      },
      {
        title: "Plant Code",
        name: "PlantCode",
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
        colStyle: {
          minWidth: "2rem",
          textAlign: "center",
        },
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
          minWidth: "5rem",
          maxWidth: "5rem",
          textAlign: "center",
        },
      },
      {
        title: "Is Auto Approve",
        name: "is_auto_approve",
        sort: true,
        avatar: false,
        badge: false,
        action: true,
        colOn: "is_auto_approve",
        colStyle: {
          minWidth: "7rem",
          maxWidth: "8rem",
          textAlign: "center",
        },
      },
    ],
    tableExport: (exportType: string) => {
      const data = getallPlant();
      data.then((res: any) => {
        fetchDataForExport(res.payload.PlantList)
          .then((dataList: any) => {
            if (exportType === "pdf") {
              exportServ.Export("Plant", dataList, "pdf");
            } else if (exportType === "excel") {
              exportServ.Export("Plant", dataList, "excel");
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
            "Company Name": element.CompanyName,
            "Plant Code": element.PlantCode,
            "Plant Name": element.PlantName,
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
        PlantId: rowData.data.PlantId,
        Taskname: "CreateInitialize",
        CompanyId: +localStorage["CompanyId"],
        RoleId: +localStorage["DefaultRoleId"],
      };
      const dataFetched = dispatch(CreateInitialize(data));
      dataFetched
        .then((res) => {
          if (res.payload.transtatus.result == true) {
            route.push("/home/cPlant");
          }
        })
        .catch((err) => {});
      dispatch(createOrEdit(rowData));
    },
    edit: (rowData) => {
      const data = {
        PlantId: rowData.data.PlantId,
        CompanyId: +localStorage["CompanyId"],
        RoleId: +localStorage["DefaultRoleId"],
        Taskname: "CreateInitialize",
      };
      const dataFetched = dispatch(CreateInitialize(data));
      dataFetched
        .then((res) => {
          if (res.payload.transtatus.result == true) {
            route.push("/home/cPlant");
          }
        })
        .catch((err) => {});
      dispatch(createOrEdit(rowData));
    },
    delete: (rowData) => {
      confirmation(
        `Are you sure you want to inactive this ${rowData.data.PlantName}?`,
        "Confirmation",
        () => {
          let PlantFormData = {
            PlantId: rowData.data.PlantId,
          };
          const deletedRes = dispatch(ChangeStatus(PlantFormData));
          deletedRes
            .then((res) => {
              if (res.payload.transtatus.result == true) {
                toast.current?.show({
                  severity: "success",
                  summary: "Success Message",
                  detail: res.payload.transtatus.lstErrorItem[0].Message,
                });
                getallPlant();
              } else if (res.payload.transtatus.result == false) {
                toast.current?.show({
                  severity: "warn",
                  summary: "Warning Message",
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
        setQrValue(import.meta.env.VITE_LOCAL_URL + "?accessToken=" + rowData.data.UrlToken);
        setQrTxt("APPOINTMENT/ CHECK-IN/ CHECK-OUT");
        setVisible(true);
      } else if (rowData.rowItem.id == "check_in_out_qr") {
        setQrValue(rowData.data.UrlToken);
        setQrTxt("CHECK IN/ OUT");
        setVisible(true);
      }
    },
    isAutoApprove: (value) => {
      let Obj;
      let IsEnabled;
      if (value.data == false) {
        Obj = {
          Plant: { ...value.rowData, IsAutomaticApprove: false },
        };
        IsEnabled = 1;
      } else if (value.data == true) {
        Obj = {
          Plant: { ...value.rowData, IsAutomaticApprove: true },
        };
        IsEnabled = 0;
      }
      try {
        const updateRes = dispatch(Update(Obj));
        updateRes.then((res) => {
          if (res.payload.transtatus.result == true) {
            toast.current?.show({
              severity: "success",
              summary: "Success Message",
              detail: `Automatic Approve ${
                IsEnabled == 0 ? "Enabled" : "Dissabled"
              } Successfully`,
            });
            getallPlant();
          } else if (res.payload.transtatus.result == false) {
            toast.current?.show({
              severity: "error",
              summary: "Error Message",
              detail: res.payload.transtatus.lstErrorItem[0].Message,
            });
            getallPlant();
          }
        });
      } catch (err) {
        toast.current?.show({
          severity: "warn",
          summary: "Error Message",
          detail: err,
        });
      }
    },
  };
  const AutoApprove = () => {};
  return (
    <>
      <div className="page-container no-print">
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
                    data={PlantList}
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
      {/* <ReactToPrint
        content={reactToPrintContent}
        documentTitle="QRCodePop"
        onAfterPrint={handleAfterPrint}
        onBeforeGetContent={handleOnBeforeGetContent}
        onBeforePrint={handleBeforePrint}
        removeAfterPrint
        trigger={reactToPrintTrigger}
      /> */}
      <QRPop
        visible={visible}
        handleClosePop={handleClosePop}
        qrValue={qrValue}
        qrTxt={qrTxt}
        handlePrint={handlePrint}
        componentRef={componentRef}
      />
      <AppAlert toast={toast} />
    </>
  );
};

export default VPlant;
