import AppAlert from "@/alert/alert";
import { pageLoadScript } from "@/assets/js/common-utilities";
import AppTable from "@/components/AppTable";
import PageHeader from "@/components/PageHeader";
import { confirmation } from "@/components/UtilityComp";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  CheckIn,
  CheckOut,
} from "@/redux/slices/visitorManagement/checkInCheckOutSlice";
import {
  changestatus,
  createInit,
  createOrEdit,
  fetch,
} from "@/redux/slices/WorkPermit/VendorRegSlice";
import PrintPass from "@/components/PrintPass";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import {
  approvalUpdateLevel,
  poppupFetch,
  poppupUpdate,
} from "@/redux/slices/master/workFlowSlice";
import FormFields from "@/components/FormFields";
import { useFormik } from "formik";
import { Dialog } from "@/assets/css/prime-library";
import { tLDS } from "@/utils/utilFunc";

const VVendorRegistration = () => {
  const route = useHistory();
  const toast = useRef<Toast>(null);
  const dispatch: any = useDispatch();
  const [VendorRegList, setVendorRegList] = useState([]);
  const [selectedData, setselectedData] = useState();

  const [statusRemark, setStatusRemark] = useState();
  const [poppupObj, setPoppupObj] = useState<any>();

  const [visible, setVisible] = useState<any>();

  const [isPopDisableSave, setIsPopDisableSave] = useState<boolean>(false);
  const [passVisible, setpassVisible] = useState<boolean>(false);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const { loading, createEditData } = useSelector(
    (state: any) => state.visitor
  );

  useEffect(() => {
    pageLoadScript();
  });
  useEffect(() => {
    Fetch();
  }, []);

  const formik: any = useFormik({
    initialValues: {
      Remarks: "",
    },
    onSubmit: (values: any, { resetForm }) => {},
  });

  const Fetch = () => {
    let obj = {
      PlantId: +localStorage["PlantId"],
      UserId: +localStorage["UserId"],
      // FromDate: new Date().toLocaleDateString("en-US", {
      //   day: "2-digit",
      //   month: "2-digit",
      //   year: "numeric",
      // }),
      // ToDate: new Date().toLocaleDateString("en-US", {
      //   day: "2-digit",
      //   month: "2-digit",
      //   year: "numeric",
      // }),
    };
    var result = dispatch(fetch(obj));
    result
      .then((res) => {
        if (res.payload.tranStatus.result == true) {
          setVendorRegList(res.payload.VendorRegList);
        } else {
          toast.current?.show({
            severity: "error",
            summary: "Error Message",
            detail: res.payload.tranStatus.lstErrorItem[0].Message,
          });
        }
      })
      .catch((error) => {
        toast.current?.show({
          severity: "error",
          summary: "Error Message",
          detail: JSON.stringify(error),
        });
      });
  };
  const [pageConfig, setPageConfig] = useState({
    pageTitle: "Vendor Registration",
    pageHeader: {
      pageActions: [
        {
          create: true,
          clear: false,
          save: false,
          createQuery: "/home/cVendorRegistration",
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
      minWidth: "14rem",
      maxWidth: "14rem",
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
      {
        title: "Approval",
        name: "approval",
      },
      {
        title: "Reject",
        name: "reject",
      },
    ],

    tableColumns: [
      {
        title: "Vendor Registration Code",
        name: "VendorRegCode",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: { minWidth: "6rem" },
      },
      {
        title: "Vendor Name",
        name: "VendorName",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: {
          minWidth: "10rem",
        },
      },
      {
        title: "Vendor Registration Date",
        name: "VendorRegDate",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: {},
      },
      {
        title: "Valid From",
        name: "ValidFrom",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: { minWidth: "7rem" },
      },
      {
        title: "Valid To",
        name: "ValidTo",
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
        colStyle: {
          minWidth: "7rem",
          textAlign: "center",
        },
      },
    ],
  });
  const handleActions = {
    view: (rowData) => {
      const data = {
        VendorRegId: rowData.data.VendorRegId,
        PlantId: +localStorage["PlantId"],
        CompanyId: +localStorage["CompanyId"],
        UserId: +localStorage["UserId"],
      };
      const dataFetched = dispatch(createInit(data));
      dataFetched
        .then((res) => {
          if (res.payload.tranStatus.result == true) {
            route.push("/home/cVendorRegistration");
          } else {
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
      dispatch(createOrEdit(rowData));
    },
    edit: (rowData) => {
      const data = {
        VendorRegId: rowData.data.VendorRegId,
        PlantId: +localStorage["PlantId"],
        CompanyId: +localStorage["CompanyId"],
        UserId: +localStorage["UserId"],
      };
      const dataFetched = dispatch(createInit(data));
      dataFetched
        .then((res) => {
          if (res.payload.tranStatus.result == true) {
            route.push("/home/cVendorRegistration");
          } else {
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
      dispatch(createOrEdit(rowData));
    },
    delete: (rowData) => {
      confirmation(
        `Are you sure you want to inactive this Vendor Registration (${rowData.data.VendorName}[${rowData.data.VendorRegCode}]) ?`,
        "Confirmation",
        () => {
          const data = {
            VendorRegId: rowData.data.VendorRegId,
          };
          var result = dispatch(changestatus(data));
          result
            .then((res) => {
              if (res.payload.tranStatus.result == true) {
                toast.current?.show({
                  severity: "success",
                  summary: "Success Message",
                  detail: "Cancelled Successfully.",
                });
                Fetch();
              } else {
                toast.current?.show({
                  severity: "error",
                  summary: "Error Message",
                  detail: res.payload.tranStatus.lstErrorItem[0].Message,
                });
              }
            })
            .catch((error) => {
              toast.current?.show({
                severity: "error",
                summary: "Error Message",
                detail: JSON.stringify(error),
              });
            });
        },
        () => {}
      );
    },
    print: (rowData) => {
      //   setpassVisible(true);
      //   setselectedData(rowData.data);
      localStorage.setItem("clickedRowData", JSON.stringify(rowData));
      window.open("/home/print");
    },
    approval: (rowData) => {
      let obj = {
        UserId: localStorage["UserId"],
        VendorRegCode: rowData.data.VendorRegCode,
        VendorRegDetailId: rowData.data.VendorRegDetailId,
        Checkintime: tLDS(new Date()),
        type: "SelfApproval",
        CompanyId: +localStorage["CompanyId"],
        PlantId: +localStorage["PlantId"],
        RoleId: +localStorage["DefaultRoleId"],
      };
      var result = dispatch(CheckIn(obj));
      result
        .then((res) => {
          if (res.payload.tranStatus.result) {
            toast.current?.show({
              severity: "success",
              summary: "Success Message",
              detail: "Checked In Successfully.",
            });
            Fetch();
          } else {
            toast.current?.show({
              severity: "error",
              summary: "Error",
              detail: res.payload.tranStatus.lstErrorItem[0].Message,
            });
          }
        })
        .catch((error) => {
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: JSON.stringify(error),
          });
        });
    },
    approve: (rowData) => {
      
      ApprovalPopupShow(rowData);
    },
    reject: (rowData) => {
      
      ApprovalPopupShow(rowData);
    },
    checkOut: (rowData) => {
      let obj = {
        UserId: localStorage["UserId"],
        VendorRegCode: rowData.data.VendorRegCode,
        VendorRegDetailId: rowData.data.VendorRegDetailId,
        Checkouttime: tLDS(new Date()),
  
      };
      var result = dispatch(CheckOut(obj));
      result
        .then((res) => {
          if (res.payload.tranStatus.result) {
            toast.current?.show({
              severity: "success",
              summary: "Success Message",
              detail: "Checked Out Successfully.",
            });
            Fetch();
          } else {
            toast.current?.show({
              severity: "error",
              summary: "Error",
              detail: res.payload.tranStatus.lstErrorItem[0].Message,
            });
          }
        })
        .catch((error) => {
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: JSON.stringify(error),
          });
        });
    },
  };
  // Approval Update Level
  const ApprovalPopupShow = (rowData) => {
    

    if (!visible) {
      let obj = {
        UserId: +localStorage["UserId"],
        PlantId: +localStorage["PlantId"],
        RoleId: +localStorage["DefaultRoleId"],
        Type: "PopupFetchWp",
        DocumentCode: rowData?.data?.VendorRegCode,
      };
      var result = dispatch(poppupFetch(obj));
      result
        .then((res) => {
          if (res.payload.tranStatus.result) {
            if (
              res.payload.workflowpopups &&
              res.payload.workflowpopups.length > 0
            ) {
              setPoppupObj(res.payload.workflowpopups[0]);
              setVisible(true);
            }
            else {
              toast.current?.show({
                severity: "warn",
                detail: "This request is waiting for another user's approval.",
                summary: "Warning",
                life: 5000
              });
              return
            }
          } else {
            toast.current?.show({
              severity: "warn",
              detail: "Warning",
              summary: res.payload.tranStatus.lstErrorItem[0].Message,
            });
            setVisible(false);
          }
        })
        .catch((error) => {
          toast.current?.show({
            severity: "error",
            detail: "Error",
            summary: JSON.stringify(error),
          });
        });
    }
  };

  const OnApproveLevel = (poppupObj: any) => {
    setIsPopDisableSave(true)
    
    let obj = {
      ApprovalRequest: {
        companyid: +localStorage["CompanyId"],
        plantid: +localStorage["PlantId"],
        requesterid: poppupObj.initiatedBy,
        documentno: poppupObj.DocumentNo,
        documentid: poppupObj.DocumentId,
        documentactivityid: poppupObj.ApprovalActivityId,
        documentdetailid: poppupObj.ApprovalDetailId,
        approvalid: null,
        approvaldetailid: null,
        remarks1: statusRemark,
        remarks2: statusRemark,
        status: 75,
        approverid: +localStorage["UserId"],
        levelid: poppupObj.LevelId,
        alternateuser: null,
        parentid: null,
        userid: +localStorage["UserId"],
        requestfromdate: null,
        requesttodate: null,
        Isviewed: 1,
      },
    };
    servicecallLevel(obj);
  };
  const OnRejectLevel = (poppupObj: any) => {
    setIsPopDisableSave(true)

    let obj = {
      ApprovalRequest: {
        companyid: +localStorage["CompanyId"],
        plantid: +localStorage["PlantId"],
        requesterid: poppupObj.initiatedBy,
        documentno: poppupObj.DocumentNo,
        documentid: poppupObj.DocumentId,
        documentactivityid: poppupObj.ApprovalActivityId,
        documentdetailid: poppupObj.ApprovalDetailId,
        approvalid: null,
        approvaldetailid: null,
        remarks1: statusRemark,
        remarks2: statusRemark,
        status: 76,
        approverid: +localStorage["UserId"],
        levelid: poppupObj.LevelId,
        alternateuser: null,
        parentid: null,
        userid: +localStorage["UserId"],
        requestfromdate: null,
        requesttodate: null,
        Isviewed: 1,
      },
    };
    servicecallLevel(obj);
  };
  const servicecallLevel = (obj: any) => {
    var result = dispatch(approvalUpdateLevel(obj));
    result
      .then((res) => {
        if (res.payload.tranStatus.result) {
    setIsPopDisableSave(false)

          Fetch();
          toast.current?.show({
            severity: "success",
            summary: "Success Message",
            detail: res.payload.tranStatus.lstErrorItem[0].Message,
          });
          setVisible(false);
        } else {
    setIsPopDisableSave(false)

          toast.current?.show({
            severity: "warn",
            summary: "Warning Message",
            detail: res.payload.tranStatus.lstErrorItem[0].Message,
          });

          setVisible(false);
        }
      })
      .catch((error) => {
    setIsPopDisableSave(false)

        toast.current?.show({
          severity: "error",
          summary: "Error Message",
          detail: JSON.stringify(error),
        });
      });
  };
  // Approval Update Level
  const handleFromChange = (e) => {
    setFromDate(e.target.value);
  };
  const handleToChange = (e) => {
    setToDate(e.target.value);
  };
  const SearchData = () => {
    if (!fromDate || fromDate == null) {
      toast.current?.show({
        severity: "error",
        summary: "Error Message",
        detail: "Please Select From Date.",
      });
      return;
    }
    if (!toDate || toDate == null) {
      toast.current?.show({
        severity: "error",
        summary: "Error Message",
        detail: "Please Select To Date.",
      });
      return;
    }

    let obj = {
      PlantId: +localStorage["PlantId"],
      UserId: +localStorage["UserId"],
      FromDate: fromDate.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
      ToDate: toDate.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
    };
    var result = dispatch(fetch(obj));
    result
      .then((res) => {
        if (res.payload.tranStatus.result == true) {
          setVendorRegList(res.payload.VendorRegList);
        } else {
          toast.current?.show({
            severity: "error",
            summary: "Error Message",
            detail: res.payload.tranStatus.lstErrorItem[0].Message,
          });
        }
      })
      .catch((error) => {
        toast.current?.show({
          severity: "error",
          summary: "Error Message",
          detail: JSON.stringify(error),
        });
      });
  };
  const Approvalclose = (DocNo: string) => {
    let obj = {
      UserId: localStorage["UserId"],
      DocNo: DocNo,
      ApprovalDetailId: poppupObj["ApprovalDetailId"],
    };
    var result = dispatch(poppupUpdate(obj));
    result
      .then((res) => {
        if (res.payload.tranStatus.result) {
          setVisible(false);
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
  };
  const footerContent = (
    <div>
      <Button
        label="Approve"
        severity="success"
        title="Approve"
        icon="las la-check"
        className="mr-2 p-1"
        disabled={isPopDisableSave}
        loading={isPopDisableSave}

        onClick={() => OnApproveLevel(poppupObj)}
      />
      <Button
        label="Reject"
        severity="danger"
        title="Reject"
        icon="las la-check"
        className="mr-2 p-1"
        disabled={isPopDisableSave}
        loading={isPopDisableSave}
        onClick={() => OnRejectLevel(poppupObj)}
      />
    </div>
  );
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
                    data={VendorRegList}
                    loading={loading}
                    pageConfig={pageConfig}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Dialog
        header={
          "Approval For " +
          poppupObj?.FunctionName +
          " ( " +
          poppupObj?.DocumentNo +
          " ) "
        }
        visible={visible}
        position="bottom-right"
        style={{ width: "50vw" }}
        onHide={() => setVisible(false)}
        footer={footerContent}
        draggable={false}
        resizable={false}
      >
        <FormFields
          type={"textarea"}
          name={"Remarks"}
          label={"Remarks"}
          options={""}
          show={true}
          required={false}
          disable={false}
          optionLabel={""}
          optionValue={""}
          handleSelect={""}
          maxLength="500"
          formik={formik}
          style={{ maxHeight: "100px", overflowY: "auto" }}
        />
      </Dialog>

      <ConfirmDialog />
      <AppAlert toast={toast} />
      {/* <PrintPass
        passVisible={passVisible}
        setpassVisible={setpassVisible}
        printData={selectedData}
      /> */}
    </>
  );
};
export default VVendorRegistration;
