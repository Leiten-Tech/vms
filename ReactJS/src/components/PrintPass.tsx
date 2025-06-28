import React, { useCallback, useEffect, useState, useMemo } from "react";
import "@/assets/css/style.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Button, Dialog, Toast } from "@/assets/css/prime-library";
import { IMAGES } from "@/assets/images/Images";
import QRCode from "react-qr-code";
import "../assets/css/style.css";
import { useHistory, useLocation } from "react-router-dom";

import ReactToPrint from "react-to-print";
import { Pass } from "@/components/Pass";
import {
  CheckIn,
  CheckOut,
  FilterVisitorEntryCode,
} from "@/redux/slices/visitorManagement/checkInCheckOutSlice";
import { useDispatch } from "react-redux";
import { tLDS } from "@/utils/utilFunc";
import { ConfirmDialog } from "primereact/confirmdialog";
import {
  AppProgressSpinner,
  confirmation,
  Instructions,
} from "@/components/UtilityComp";
import { AvatarImg } from "@/assets/css/img-library";

export const FooterContent = (props) => {
  const { openPrint, setpassVisible } = props;
  return (
    <div className="no-print">
      <Button
        label="Print"
        icon="pi pi-print"
        onClick={() => {
          // generatePDF();
          openPrint();
          setpassVisible(false);
        }}
        autoFocus
      />
      <Button
        label="Cancel"
        icon="pi pi-times"
        onClick={() => window.close()}
        severity="danger"
      />
    </div>
  );
};

function useQuery() {
  const { search } = useLocation();

  return useMemo(() => new URLSearchParams(search), [search]);
}

export const PrintPassComponent = (props) => {
  const { printPassData, toast } = props;
  const query = useQuery();

  const componentRef = React.useRef(null);

  const onBeforeGetContentResolve = React.useRef(null);
  const dispatch: any = useDispatch();
  const [loading, setLoading] = React.useState(false);
  const [text, setText] = React.useState("old boring text");

  localStorage.setItem("passData", JSON.stringify(printPassData));

  const handleAfterPrint = React.useCallback(() => {
    const localPassData = JSON.parse(localStorage.getItem("passData"));

    // confirmation(
    //   `Do you want to Check-In for Visitor/ Worker ${localPassData.PersonName}-${localPassData.VisitorEntryCode}?`,
    //   "Confirmation",
    //   () => {
    //     verifyCheckIn();
    //   },
    //   () => {
    //     toast?.current?.show({
    //       severity: "warn",
    //       summary: "Check-In Process not Completed",
    //       detail: `You Cancelled the Check-In Process for ${localPassData.PersonName}-${localPassData.VisitorEntryCode}`,
    //     });
    //   }
    // );
  }, []);

  const handleBeforePrint = React.useCallback(() => {}, []);

  const handleOnBeforeGetContent = React.useCallback(() => {
    setLoading(true);

    return new Promise((resolve: any) => {
      onBeforeGetContentResolve.current = resolve;

      setTimeout(() => {
        setLoading(false);
        setText("New, Updated Text!");
        resolve();
      }, 2000);
    });
  }, [setLoading, setText]);

  React.useEffect(() => {
    if (
      text === "New, Updated Text!" &&
      typeof onBeforeGetContentResolve.current === "function"
    ) {
      onBeforeGetContentResolve.current();
    }
  }, [onBeforeGetContentResolve.current, text]);

  const reactToPrintContent = React.useCallback(() => {
    return componentRef.current;
  }, [componentRef.current]);

  const approvalVerify = () => {};

  const verifyCheckIn = () => {
    const localPassData = JSON.parse(localStorage.getItem("passData"));

    let obj = {
      text: localPassData.VisitorEntryCode,
      EntryType: 60,
      PlantId: +localStorage["PlantId"],
    };
    var result = dispatch(FilterVisitorEntryCode(obj));
    result
      .then((res) => {
        if (res.payload.tranStatus.result) {
          let checkInCodes = res.payload.VisitorEntryCheckInCodeList;
          let checkOutCodes = res.payload.VisitorEntryCheckOutCodeList;
          let approvalCodes = res.payload.VisitorEntryAppovalList;

          if (approvalCodes.length > 0) {
            let approvedCheck = approvalCodes.filter(
              (item) => item.DocumentNo == localPassData.VisitorEntryCode
            );

            if (
              approvedCheck &&
              approvedCheck.length > 0 &&
              approvedCheck[0].Status == 74
            ) {
              toast.current?.show({
                severity: "error",
                summary: "Error Message",
                detail:
                  "Please Approve the Visitor Entry to Start Check-In Process.",
              });
            } else {
              if (
                checkInCodes &&
                checkInCodes.length > 0 &&
                localPassData.VisitorEntryCode ==
                  checkInCodes[0].VisitorEntryCode
              ) {
                checkIn();
              } else {
                toast?.current?.show({
                  severity: "error",
                  summary: "Error Message",
                  detail:
                    "Check In Already Done for this Specific Date/ Time for this Visitor/ Worker.",
                });
              }
            }
          }
        } else {
          toast?.current?.show({
            severity: "error",
            summary: "Error Message",
            detail: res.payload.tranStatus.lstErrorItem[0].Message,
          });
        }
      })
      .catch((error) => {
        toast?.current?.show({
          severity: "error",
          summary: "Error Message",
          detail: JSON.stringify(error),
        });
      });
  };

  const checkIn = () => {
    const localPassData = JSON.parse(localStorage.getItem("passData"));

    let obj = {
      UserId: +localStorage["UserId"],
      VisitorEntryCode: localPassData.VisitorEntryCode,
      VisitorEntryDetailId: localPassData.VisitorEntryDetailId,
      Checkintime: tLDS(new Date()),
      type: "",
      CompanyId: +localStorage["CompanyId"],
      PlantId: +localStorage["PlantId"],
      RoleId: +localStorage["DefaultRoleId"],
    };
    const updateRes = dispatch(CheckIn(obj));
    updateRes
      .then((res) => {
        if (res.payload.tranStatus.result) {
          toast.current?.show({
            severity: "success",
            summary: "Success Message",
            detail: res.payload.tranStatus.lstErrorItem[0].Message,
          });
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

  const reactToPrintTrigger = React.useCallback(() => {
    return (
      <div className="mt-3 preview-container">
        <div className="widget-ftr text-center">
          <Button label="Preview" title="Preview" icon="pi pi-search" />
        </div>
      </div>
    );
  }, []);

  return (
    <div>
      {loading && <AppProgressSpinner />}
      <Pass ref={componentRef} printPassData={printPassData} />
      <ReactToPrint
        content={reactToPrintContent}
        documentTitle="VisitorPass"
        onAfterPrint={handleAfterPrint}
        onBeforeGetContent={handleOnBeforeGetContent}
        onBeforePrint={handleBeforePrint}
        removeAfterPrint
        trigger={reactToPrintTrigger}
      />
    </div>
  );
};

const PrintPass = (props) => {
  const {
    passVisible,
    setpassVisible,
    maxWidth,
    mode,
    printPassData,
    routePage,
    videoElementRef,
    setScannedText,
    scanned,
    checkinTrue,
    toast,
    setCameraOff,
    cameraOff,
    imageUrl,
    onUpload,
    show,
    check,
    isDisableSave,
    updatePassImg,
    setShow,
    setMode,
    checkedOut,
    setCheck,
    editedTrue,
    OnclickCheckin,
  } = props;

  // const [printPassData, setPrintData] = useState<any>();
  const [passType, setPassType] = useState<any>({});
  const [isPrintPrev, setIsPrintPrev] = useState<any>();
  // const routePage = useHistory();

  var keyValueArray;
  useEffect(() => {
    if (routePage?.location?.pathname != "/home/cVisitorManagement") {
      setIsPrintPrev(true);
    }
  }, []);

  const generatePDF = () => {
    const pdf = new jsPDF();

    const visitorImg: any = document.getElementById("visitor_img");
    if (visitorImg.src != "") {
      // Use window.document.documentElement to capture the entire page
      html2canvas(document.getElementById("gatePass"))
        .then((canvas) => {
          const imageData = canvas.toDataURL("image/png");
          // const imageData = getImageData();
          const imgWidth = 133;
          const imgHeight = 83;

          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();

          const x = (pdfWidth - imgWidth) / 2;
          const y = (pdfHeight - imgHeight) / 2;

          // const pdfWidth = pdf.internal.pageSize.getWidth();
          // const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
          pdf.setFillColor(235, 238, 246);
          pdf.addImage(imageData, "PNG", x, y, imgWidth, imgHeight);

          pdf.save(`${printPassData?.VisitorEntryCode}-GatePass.pdf`);
        })
        .catch((error) => {
          console.error("Error while generating PDF:", error);
        });
    }
  };

  const openPrint = () => {
    window.print();
  };

  useEffect(() => {
    // setPrintData(generateObj());
  }, []);

  useEffect(() => {
    if (printPassData) {
      switch (printPassData?.VisitorTypeId) {
        case 35:
          setPassType({
            passTypeClass: "pass-type01",
            passTypeTxt: "One Day Pass",
          });
          break;
        case 36:
          setPassType({
            passTypeClass: "pass-type03",
            passTypeTxt: "Extended Pass",
          });
          break;
        case 50:
          setPassType({
            passTypeClass: "pass-type03",
            passTypeTxt: "Contract Worker",
          });
          break;
        // case 66:
        //   setPassType({
        //     passTypeClass: "pass-type04",
        //     passTypeTxt: "Vehicle Trip",
        //   });
        //   break;
        default:
          setPassType({
            passTypeClass: "pass-type01",
            passTypeTxt: "One Day Pass",
          });
          break;
      }
    }
  }, [printPassData]);

  const generateObj = () => {
    if (localStorage.getItem("clickedRowData")) {
      keyValueArray = JSON.parse(localStorage["clickedRowData"]).data;

      return keyValueArray;
      // const desiredKeyOrder = [
      //   "VisitorImageUrl",
      //   "VisitorEntryId",
      //   "VisitorEntryCode",
      //   "VisitorEntryDate",
      //   "CompanyId",
      //   "PlantId",
      //   "GateId",
      //   "VisitorTypeId",
      //   "VisitorTypeName",
      //   "VisitorId",
      //   "PersonName",
      //   "MobileNo",
      //   "IdProofType",
      //   "IdProofNo",
      //   "VisitedEmployeeId",
      //   "ValidFrom",
      //   "ValidTo",
      //   "AccessType",
      //   "IsExtended",
      //   "IsAppointmentBooking",
      //   "IsPreBooking",
      // ];

      // const keysToDelete = [
      //   "Status",
      //   "StatusName",
      //   "CreatedbyName",
      //   "CreatedOn",
      //   "ModifiedBy",
      //   "ModifiedByName",
      //   "ModifiedOn",
      //   "Visitor_Image_Name",
      // ];

      // const updatedObject = { ...keyValueArray };
      // const rearrangedObject = {};
      // desiredKeyOrder.forEach((key) => {
      //   if (updatedObject.hasOwnProperty(key)) {
      //     rearrangedObject[key] = updatedObject[key];
      //   }
      // });

      // keysToDelete.forEach((keyToDelete) => {
      //   delete rearrangedObject[keyToDelete];
      // });

      // return rearrangedObject;
    }
  };

  const itemTemplate = () => {
    return (
      <div className="flex align-items-center flex-column">
        <i
          className="pi pi-image mt-3 p-5"
          style={{
            fontSize: "5em",
            borderRadius: "50%",
            backgroundColor: "var(--surface-b)",
            color: "var(--surface-d)",
          }}
        ></i>
        <span
          style={{ fontSize: "1.2em", color: "var(--text-color-secondary)" }}
          className="my-5"
        >
          Drag and Drop Image Here
        </span>
      </div>
    );
  };

  return (
    <>
      {/* <Dialog
        header="Visitor Pass Preview"
        className="preview-popup"
        visible={passVisible}
        style={{ width: "530px" }}
        onHide={() => setpassVisible(false)}
        footer={footerContent}
      > */}
      {/* {routePage?.location?.pathname != "/home/cVisitorManagement" ? (
        <FooterContent openPrint={openPrint} setpassVisible={setpassVisible} />
      ) : null} */}

      {printPassData && (
        <div className="align-content-center flex flex-column gap-3 justify-content-center m-5">
          {/* FOR NTN  */}
          <div className="p-3">
            <div
              className="visitor-pass-container paper-a6 shadow-1"
              id="gatePass"
            >
              <div
                className={`${passType?.passTypeClass} visitor-pass-hdr text-center`}
              >
                {passType?.passTypeTxt}
                <div className="grid">
                  <div className="col-6">
                    <div
                      className="visitor-photo"
                      style={{ borderRadius: "100%" }}
                    >
                      <img
                        src={
                          printPassData?.VisitorImageName != "" &&
                          printPassData?.VisitorImageName != null
                            ? printPassData?.VisitorImageUrl
                            : AvatarImg
                        }
                        alt={printPassData?.VisitorImageName}
                        className="w-full"
                        id="visitor_img"
                      />
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="visitor-photo right">
                      <QRCode
                        value={
                          `${printPassData?.VisitorEntryCode}:${printPassData?.VisitorEntryDetailId}` ||
                          "NO_VISITOR"
                        }
                        size={45}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-column gap-4 visitor-pass-body">
                <div className="grid">
                  <div className="col-12">
                    <div className="normal-table">
                      <table>
                        <tbody>
                          <tr>
                            <td style={{ width: "45%" }}>Visitor Entry Code</td>
                            <td style={{ width: "55%" }}>
                              <strong>
                                {printPassData?.hasOwnProperty("Visitor") &&
                                Object.keys(printPassData?.Visitor || [])
                                  .length > 0
                                  ? printPassData?.Visitor
                                      ?.VisitorEntryCodeHeader
                                  : // ? printPassData?.Visitor?.VisitorCode
                                    printPassData?.VisitorEntryCodeHeader ||
                                    "-"}
                              </strong>
                            </td>
                          </tr>

                          <tr>
                            <td style={{ width: "45%" }}>Visitor Name</td>
                            <td style={{ width: "55%" }}>
                              <strong>
                                {printPassData?.PersonName || "-"}
                              </strong>
                            </td>
                          </tr>
                          <tr>
                            <td style={{ width: "45%" }}>Visitor Company</td>
                            <td style={{ width: "55%" }}>
                              <strong>
                                {printPassData?.hasOwnProperty("Visitor") &&
                                Object.keys(printPassData?.Visitor || [])
                                  .length > 0
                                  ? printPassData?.Visitor?.VisitorCompany
                                  : printPassData?.VisitorCompany || "-"}
                              </strong>
                            </td>
                          </tr>
                          <tr>
                            <td style={{ width: "45%" }}>Plant Name</td>
                            <td style={{ width: "55%" }}>
                              <strong>
                                {printPassData?.PlantName
                                  ? printPassData?.PlantName
                                  : "-"}
                              </strong>
                            </td>
                          </tr>
                          <tr>
                            <td style={{ width: "45%" }}>Host</td>
                            <td style={{ width: "55%" }}>
                              <strong>{printPassData?.UserName || "-"}</strong>
                            </td>
                          </tr>
                          <tr>
                            <td style={{ width: "45%" }}>Purpose</td>
                            <td style={{ width: "55%" }}>
                              <strong>
                                {(printPassData.hasOwnProperty("head") &&
                                Object.keys(printPassData.head).length > 0
                                  ? printPassData?.head?.PurposeOfVisitName
                                  : printPassData?.PurposeOfVisitName) || "-"}
                              </strong>
                            </td>
                          </tr>
                          <tr>
                            <td style={{ width: "45%" }}>Mobile No</td>
                            <td style={{ width: "55%" }}>
                              <strong>
                                {printPassData?.hasOwnProperty("Visitor") &&
                                Object.keys(printPassData?.Visitor || [])
                                  .length > 0
                                  ? printPassData?.Visitor?.MobileNo
                                  : printPassData?.MobileNo || "-"}
                              </strong>
                            </td>
                          </tr>
                          <tr>
                            <td style={{ width: "45%" }}>Valid From</td>
                            <td style={{ width: "55%" }}>
                              <strong>
                                {printPassData.hasOwnProperty("head") &&
                                Object.keys(printPassData?.head).length > 0
                                  ? printPassData?.head.ValidFrom != null
                                    ? `${new Date(
                                        printPassData?.head?.ValidFrom
                                      ).getDate()}/${
                                        new Date(
                                          printPassData?.head?.ValidFrom
                                        ).getMonth() + 1
                                      }/${new Date(
                                        printPassData?.head?.ValidFrom
                                      ).getFullYear()} ${new Date(
                                        printPassData?.head?.ValidFrom
                                      )
                                        .toLocaleTimeString()
                                        .replace(
                                          /([\d]+:[\d]{2})(:[\d]{2})(.*)/,
                                          "$1$3"
                                        )}`
                                    : printPassData?.ValidFrom != null
                                    ? `${new Date(
                                        printPassData?.ValidFrom
                                      ).getDate()}/${
                                        new Date(
                                          printPassData?.ValidFrom
                                        ).getMonth() + 1
                                      }/${new Date(
                                        printPassData?.ValidFrom
                                      ).getFullYear()} ${new Date(
                                        printPassData?.ValidFrom
                                      )
                                        .toLocaleTimeString()
                                        .replace(
                                          /([\d]+:[\d]{2})(:[\d]{2})(.*)/,
                                          "$1$3"
                                        )}`
                                    : "-"
                                  : printPassData?.ValidFrom != null
                                  ? `${new Date(
                                      printPassData?.ValidFrom
                                    ).getDate()}/${
                                      new Date(
                                        printPassData?.ValidFrom
                                      ).getMonth() + 1
                                    }/${new Date(
                                      printPassData?.ValidFrom
                                    ).getFullYear()} ${new Date(
                                      printPassData?.ValidFrom
                                    )
                                      .toLocaleTimeString()
                                      .replace(
                                        /([\d]+:[\d]{2})(:[\d]{2})(.*)/,
                                        "$1$3"
                                      )}`
                                  : "-"}
                              </strong>
                            </td>
                          </tr>
                          <tr>
                            <td style={{ width: "45%" }}>Valid To</td>
                            <td style={{ width: "55%" }}>
                              <strong>
                                {printPassData.hasOwnProperty("ValidTo")
                                  ? printPassData?.ValidTo != null
                                    ? `${
                                        printPassData &&
                                        printPassData != null &&
                                        new Date(
                                          printPassData?.ValidTo
                                        ).getDate()
                                      }/${
                                        printPassData &&
                                        printPassData != null &&
                                        new Date(
                                          printPassData?.ValidTo
                                        ).getMonth() + 1
                                      }/${
                                        printPassData &&
                                        printPassData != null &&
                                        new Date(
                                          printPassData?.ValidTo
                                        ).getFullYear()
                                      }
                                    ${
                                      printPassData?.VisitorTypeId === 36
                                        ? printPassData &&
                                          printPassData != null &&
                                          new Date(printPassData?.ValidTo)
                                            .toLocaleTimeString()
                                            .replace(
                                              /([\d]+:[\d]{2})(:[\d]{2})(.*)/,
                                              "$1$3"
                                            )
                                        : ""
                                    }`
                                    : printPassData?.ValidTo != null
                                    ? printPassData?.ValidTo
                                    : "-"
                                  : "-"}
                              </strong>
                            </td>
                          </tr>

                          <tr>
                            <td style={{ width: "45%" }}>Area</td>
                            <td style={{ width: "55%" }}>
                              <strong>
                                {printPassData?.AreaToVisitName &&
                                printPassData?.AreaToVisitName != null
                                  ? printPassData?.AreaToVisitName
                                  : "-"}
                              </strong>
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={2}>
                              <hr />
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={2}>
                              <strong>Belongings</strong>
                            </td>
                          </tr>
                          {printPassData?.BelongingDetails}
                          {/* {printPassData &&
                          printPassData != null &&
                          printPassData.hasOwnProperty("belongings") &&
                          printPassData?.belongings != undefined &&
                          Object.keys(printPassData?.belongings).length > 0
                          ? printPassData?.belongings.map((a) => {
                            return (
                              <tr>
                                <td style={{ width: "45%" }}>
                                  {a.DeviceName}
                                </td>
                                <td style={{ width: "55%" }}>
                                  <strong>
                                    {a.DeviceNo != "" ? a.DeviceNo : "No"}
                                  </strong>
                                </td>
                              </tr>
                            );
                          })
                          : "-"} */}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              <div className="visitor-pass-ftr">
                <div className="grid">
                  <div className="col-6">
                    <img
                      src={IMAGES.LOGO_LG}
                      alt="Indus"
                      style={{ height: "auto", width: "100px" }}
                    />
                  </div>
                  <div className="align-items-center col-6 flex justify-content-end text-right">
                    <h2>Auth Sign</h2>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* </Dialog> */}
      {/* <div
        className="no-print"
        style={{
          padding: "15px",
        }}
      >
        <div className="card flex justify-content-center">
          <Button label="Save" onClick={generatePDF} icon="pi pi-check" />
          <Button
            label="Cancel"
            onClick={() => window.close()}
            icon="pi pi-times"
          />
        </div>
      </div>
      <div
        id="gatePass"
        style={{
          marginTop: "20px",
        }}
      >
        <div
          className="preview-right m-auto"
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "6px",
          }}
        >
          <div
            className=""
            style={{
              maxWidth: "250px",
              margin: "auto",
            }}
          >
            <div className="widget-hdr">
              <div className="sub-title">
                <div className="grid">
                  <div className="col-12">
                    <h2>Visitor Gate Pass</h2>
                  </div>
                </div>
              </div>
            </div>
            <div className="widget-body preview-final scroll-y">
              <div className="normal-table">
                <div className="grid">
                  <div className="col-12">
                    {printPassData
                      ? Object.entries(printPassData).map(([key, value]: any) => (
                          <>
                            {key == "VisitorImageUrl" ? (
                              <div className="text-center">
                                <div className="img-preview-container m-3">
                                  <img
                                    src={value}
                                    alt="logo"
                                    className="w-full"
                                  />
                                </div>
                              </div>
                            ) : null}
                            {key !== "VisitorImageUrl" ? (
                              <div key={key} className="flex ">
                                <label className="form-label">{key} :</label>
                                <div className="form-value">{value}</div>
                              </div>
                            ) : null}
                          </>
                        ))
                      : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
      <ConfirmDialog />
    </>
  );
};

export default PrintPass;
