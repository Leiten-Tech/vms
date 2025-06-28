import React, {
  useCallback,
  useEffect,
  useState,
  useMemo,
  useRef,
} from "react";
import "@/assets/css/style.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Button, Dialog, Toast } from "@/assets/css/prime-library";
import { IMAGES } from "@/assets/images/Images";
import QRCode from "react-qr-code";
import "../assets/css/style.css";
import { useHistory, useLocation } from "react-router-dom";
import { CreateInitialize } from "@/redux/slices/master/PreviewPassSlice";
import { useDispatch } from "react-redux";
import { ConfirmDialog } from "primereact/confirmdialog";
import { DecryptData, DSendPass } from "@/redux/slices/master/workFlowSlice";
import { ShowPass } from "@/redux/slices/visitorManagement/visitorentrySlice";
import { pageLoadScript } from "@/assets/js/common-utilities";
import PhotoCapture from "@/components/PhotoCapture";
import { updateImage } from "@/redux/slices/visitorManagement/externalBookEntrySlice";
import AppAlert from "@/alert/alert";
import QRScanner from "./QRScanner/QRScanner";
import QrScanner from "qr-scanner";
import { tLDS } from "@/utils/utilFunc";
import {
  CheckIn,
  CheckInCkeckoutPageLoad,
  CheckOut,
  FilterVisitorEntryCode,
} from "@/redux/slices/visitorManagement/checkInCheckOutSlice";
import { MessageAlert } from "@/pages/VisitorManagement/ExternalVisitorManage/BookExternal";
import { AvatarImg } from "@/assets/css/img-library";
import { Instructions } from "@/components/UtilityComp";

const PassContent = (props) => {
  const {
    maxWidth,
    mode,
    printPassData,
    passType,
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
    setHasScanned,
    setIsPlantListLoaded
  } = props;

  const FooterContent = () => {
    return (
      <div className="no-print">
        {show ? (
          <>
            {check ? null : ( // /> //   autoFocus //   onClick={() => updatePassImg()} //   icon="pi pi-save" //   disabled={isDisableSave} //   label="Check In" // <Button
              <Button
                label="Update Image"
                disabled={isDisableSave}
                icon="pi pi-save"
                onClick={() => updatePassImg()}
                autoFocus
              />
            )}
            {/* {hasFlash && check ? (
              <Button
                label={`Flash ${flashTxt}`}
                disabled={isDisableSave}
                icon="pi pi-video"
                onClick={() => flashToggle()}
                autoFocus
              />
            ) : null} */}
            <Button
              label="Cancel"
              disabled={isDisableSave}
              icon="pi pi-times"
              onClick={() => {
                setHasScanned(false);
                setMode({ ...mode, UPDATE: false, CHECKIN: false });
                setShow(false);
                setIsPlantListLoaded(false);
              }}
              severity="danger"
            />
          </>
        ) : (
          <>
            {!checkedOut ? (
              <>
                {checkinTrue ? (
                  <Button
                    label="Edit Image"
                    icon="pi pi-user-edit"
                    onClick={() => {
                      setMode({ ...mode, UPDATE: true });
                      setShow(true);
                      setCheck(false);
                    }}
                    autoFocus
                  />
                ) : null}
                {!checkinTrue || editedTrue ? (
                  <Button
                    label={
                      checkinTrue && editedTrue ? "Check In " : "Check Out "
                    }
                    icon={`pi ${
                      checkinTrue && editedTrue ? "pi-sign-in" : "pi-sign-out"
                    }`}
                    onClick={() => {
                      setMode({ ...mode, CHECKIN: true });
                      setShow(true);
                      setCheck(true);
                      OnclickCheckin();
                    }}
                    autoFocus
                  />
                ) : null}
              </>
            ) : null}
            {/* ) : (
              <Button
                label="Check Out "
                icon="pi pi-save"
                onClick={() => {
                  setMode({ ...mode, CHECKIN: true });
                  setShow(true);
                  setCheck(true);
                  OnclickCheckin();
                }}
                autoFocus
              />
            )} */}
          </>
        )}

        {/* <Button
          label="Print"
          icon="pi pi-print"
          onClick={() => {
            // generatePDF();
            openPrint();
            setPassVisible(false);
          }}
          autoFocus
        /> */}
      </div>
    );
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "25px",
        padding: "20px",
        overflow: "auto",
        maxWidth: maxWidth,
      }}
    >
      {!mode.CHECKIN && !mode.UPDATE && !mode.CHECKOUT
        ? printPassData && (
            <div
              style={{
                minWidth: "310px",
              }}
              className="visitor-pass-container"
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
                                  : printPassData?.VisitorEntryCodeHeader ||
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
                                {printPassData?.VisitorCompany
                                  ? printPassData?.VisitorCompany
                                  : "-"}
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
                            <td style={{ width: "45%" }}>Checked In</td>
                            <td style={{ width: "55%" }}>
                              <strong>
                                {printPassData.hasOwnProperty("head") &&
                                Object.keys(printPassData?.head).length > 0
                                  ? printPassData?.head.CheckedIn != null
                                    ? `${new Date(
                                        printPassData?.head?.CheckedIn
                                      ).getDate()}/${
                                        new Date(
                                          printPassData?.head?.CheckedIn
                                        ).getMonth() + 1
                                      }/${new Date(
                                        printPassData?.head?.CheckedIn
                                      ).getFullYear()} ${new Date(
                                        printPassData?.head?.CheckedIn
                                      )
                                        .toLocaleTimeString()
                                        .replace(
                                          /([\d]+:[\d]{2})(:[\d]{2})(.*)/,
                                          "$1$3"
                                        )}`
                                    : printPassData?.CheckedIn != null
                                    ? `${new Date(
                                        printPassData?.CheckedIn
                                      ).getDate()}/${
                                        new Date(
                                          printPassData?.CheckedIn
                                        ).getMonth() + 1
                                      }/${new Date(
                                        printPassData?.CheckedIn
                                      ).getFullYear()} ${new Date(
                                        printPassData?.CheckedIn
                                      )
                                        .toLocaleTimeString()
                                        .replace(
                                          /([\d]+:[\d]{2})(:[\d]{2})(.*)/,
                                          "$1$3"
                                        )}`
                                    : "-"
                                  : printPassData?.CheckedIn != null
                                  ? `${new Date(
                                      printPassData?.CheckedIn
                                    ).getDate()}/${
                                      new Date(
                                        printPassData?.CheckedIn
                                      ).getMonth() + 1
                                    }/${new Date(
                                      printPassData?.CheckedIn
                                    ).getFullYear()} ${new Date(
                                      printPassData?.CheckedIn
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
                            <td style={{ width: "45%" }}>Checked Out</td>
                            <td style={{ width: "55%" }}>
                              <strong>
                                {printPassData.hasOwnProperty("head") &&
                                Object.keys(printPassData?.head).length > 0
                                  ? printPassData?.head.CheckedOut != null
                                    ? `${new Date(
                                        printPassData?.head?.CheckedOut
                                      ).getDate()}/${
                                        new Date(
                                          printPassData?.head?.CheckedOut
                                        ).getMonth() + 1
                                      }/${new Date(
                                        printPassData?.head?.CheckedOut
                                      ).getFullYear()} ${new Date(
                                        printPassData?.head?.CheckedOut
                                      )
                                        .toLocaleTimeString()
                                        .replace(
                                          /([\d]+:[\d]{2})(:[\d]{2})(.*)/,
                                          "$1$3"
                                        )}`
                                    : printPassData?.CheckedOut != null
                                    ? `${new Date(
                                        printPassData?.CheckedOut
                                      ).getDate()}/${
                                        new Date(
                                          printPassData?.CheckedOut
                                        ).getMonth() + 1
                                      }/${new Date(
                                        printPassData?.CheckedOut
                                      ).getFullYear()} ${new Date(
                                        printPassData?.CheckedOut
                                      )
                                        .toLocaleTimeString()
                                        .replace(
                                          /([\d]+:[\d]{2})(:[\d]{2})(.*)/,
                                          "$1$3"
                                        )}`
                                    : "-"
                                  : printPassData?.CheckedOut != null
                                  ? `${new Date(
                                      printPassData?.CheckedOut
                                    ).getDate()}/${
                                      new Date(
                                        printPassData?.CheckedOut
                                      ).getMonth() + 1
                                    }/${new Date(
                                      printPassData?.CheckedOut
                                    ).getFullYear()} ${new Date(
                                      printPassData?.CheckedOut
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
                            <td style={{ width: "45%" }}>Area</td>
                            <td style={{ width: "55%" }}>
                              <strong>{printPassData?.AreaToVisitName}</strong>
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
                          <tr>
                            <td colSpan={2}>
                              <div>{printPassData?.BelongingDetails}</div>
                              {/* <div>
                            {printPassData?.BelongingDetails?.split(
                              ", "
                            ).map((item, index) => (
                              <span key={index}>{item}</span> 
                            ))}
                          </div> */}
                            </td>
                          </tr>

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
                {/* <div
                  style={{
                    maxWidth: "450px",
                    margin: "auto",
                  }}
                >
                  <Instructions />
                </div> */}
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
          )
        : null}
      {mode.UPDATE ? (
        <div className="align-items-center flex flex-column gap-5 justify-content-center">
          <div className="page-title">
            <div className="md:col-12">
              <h1>Update Your Photo</h1>
            </div>
          </div>
          <PhotoCapture
            onUpload={onUpload}
            ImageUrl={imageUrl}
            isView={false}
            cameraOff={cameraOff}
            setCameraOff={setCameraOff}
            isExternal={1}
            fldStyle={`col-12 md:col-6 text-center`}
            toast={toast}
          />
        </div>
      ) : null}
      {mode.CHECKIN ? (
        <div className="align-items-center flex flex-column gap-2 justify-content-center">
          <div className="page-title">
            <div className="md:col-12">
              {checkinTrue ? <h1>Check In</h1> : <h1>Check Out</h1>}
            </div>
          </div>
          <QRScanner
            scanned={scanned}
            setScannedText={setScannedText}
            videoElementRef={videoElementRef}
          />
        </div>
      ) : null}
      {routePage?.location?.pathname != "/home/cVisitorManagement" ? (
        <FooterContent />
      ) : null}
    </div>
  );
};

function useQuery() {
  const { search } = useLocation();

  return useMemo(() => new URLSearchParams(search), [search]);
}

const PrintPassPreview = () => {
  const [printPassData, setPrintPassData] = useState<any>();
  const [visEntry, setVisEntry] = useState<any>();
  const [visEntryDetails, setVisEntryDetails] = useState<any>();
  const [passVisible, setPassVisible] = useState<any>(false);
  const [isCamShow, setIsCamShow] = useState<any>(false);
  const query = useQuery();
  const dispatch: any = useDispatch();
  const [imageUrl, setImageUrl] = useState(IMAGES.NO_IMG);
  const [photo, setPhoto] = useState<File | null>(null);
  const [cameraOff, setCameraOff] = useState(false);
  const [isDisableSave, setIsdisableSave] = useState(false);
  const [show, setShow] = useState(false);
  const [check, setCheck] = useState(false);
  const [scanned, setScannedText] = useState("");
  const [visitorEntryDetailList, setvisitorEntryDetailList] = useState([]);
  const [VisitorEntryBelongingDetailList, setVisitorEntryBelongingDetailList] =
    useState<any>([]);
  const [VisitorEntryPovDetail, setVisitorEntryPovDetail] = useState([]);
  const [mode, setMode] = useState({
    UPDATE: false,
    CHECKIN: false,
    CHECKOUT: false,
  });
  const [maxWidth, setMaxWidth] = useState("");
  const toast = useRef<any>(null);
  // const [printPassData, setPrintData] = useState<any>();
  const [passType, setPassType] = useState<any>({});
  const [isPrintPrev, setIsPrintPrev] = useState<any>();
  const [isCalled, setIsCalled] = useState<any>(false);
  const routePage = useHistory();
  var keyValueArray;
  const videoElementRef = useRef(null);
  var qrScanner;
  const [plantList, setPlantList] = useState([]);
  const [flashTxt, setFlashTxt] = useState("Off");
  const [checkinTrue, setCheckinTrue] = useState(true);
  const [editedTrue, setEditedTrue] = useState(false);
  const [hasFlash, setHasFlash] = useState(true);
  const [checkedOut, setCheckedOut] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);
  const videoContainer = document.getElementById("video-container");

  const [isPlantListLoaded, setIsPlantListLoaded] = useState(false);

  useEffect(() => {
    if (plantList && plantList.length > 0 && !isPlantListLoaded) {
      setIsPlantListLoaded(true);
    }
  }, [plantList]);

  useEffect(() => {
    pageLoadScript();
  });

  useEffect(() => {
    loadPass();
  }, []);

  useEffect(() => {
    if (routePage?.location?.pathname != "/home/cVisitorManagement") {
      setIsPrintPrev(true);
    }
  }, []);

  const loadPass = () => {
    if (!printPassData) {
      getPass();
    } else {
      setLoading(false);
    }
  };
  const getPass = () => {
    const handlePassPreview = (
      item,
      UpdatedVisitorNameLists,
      VisitorEntryBelongingDetails
    ) => {
      let dataObj = {
        data: {
          ...item,
          belongings: VisitorEntryBelongingDetails,
        },
      };
      setPrintPassData(item);
      if (item.CheckedIn != null) {
        setCheckinTrue(false);
      }
      if (item.CheckedOut != null) {
        setCheckedOut(true);
      }
      if (item.IsEditedImage == 1) {
        setEditedTrue(true);
      }
    };
    setLoading(true);

    if (query.get("encrypted") != null && query.get("encrypted") != "") {
      const dSendPass = dispatch(DecryptData(query.get("encrypted")));
      dSendPass
        .then((res) => {
          if (
            res.payload.hasOwnProperty("tranStatus") &&
            res.payload.tranStatus.result
          ) {
            const dataReq = res.payload.VisitorEntryHeader.split("_");
            const CompanyId = dataReq[0];
            const VisitorEntryDetailId = dataReq[1];
            const PlantId = dataReq[2];
            const VisitorEntryCode = dataReq[3];
            const VisitorTypeId = dataReq[4];
            const VisitorEntryId = dataReq[5];
            let obj = {
              VisitorEntryId: VisitorEntryId,
              VisitorEntryCode: VisitorEntryCode,
              DetailId: VisitorEntryDetailId,
              CompanyId: CompanyId,
              PlantId: PlantId,
              VisitorTypeId: VisitorTypeId,
            };

            const workerList = dispatch(ShowPass(obj));
            workerList
              .then((res) => {
                // setContWorker(res.payload.VisitorEntryDetail);
                // setContHead(res.payload.VisitorEntryHeader);
                if (res.payload.tranStatus.result == true) {
                  setLoading(false);

                  // let VisitorEntry = {
                  //   VisitorEntryCode:
                  //     res.payload.VisitorEntryHeader.VisitorEntryCodeHeader,
                  //   // res.payload.VisitorEntryHeader.VisitorEntryCode,
                  //   VisitorTypeId: res.payload.VisitorEntryHeader.VisitorTypeId,
                  // };
                  // let visDtl = res.payload.VisitorEntryDetails;
                  if (
                    res.payload.VisitorEntryHeader &&
                    Object.keys(res.payload.VisitorEntryHeader).length > 0
                  ) {
                    setVisEntry(res.payload.VisitorEntryHeader);
                    setVisEntryDetails(res.payload.VisitorEntryDetails);

                    handlePassPreview(
                      res.payload.VisitorEntryHeader,
                      res.payload.UpdatedVisitorNameList,
                      res.payload.VisitorEntryBelongingDetail
                    );
                  } else {
                    setLoading(false);
                    setPrintPassData({});
                  }
                } else {
                  setLoading(false);
                  // toast.current?.show({
                  //   severity: "error",
                  //   detail: "Error",
                  //   summary: res.payload.tranStatus.lstErrorItem[0].Message,
                  // });
                }
              })
              .catch((err) => {
                setLoading(false);
              });
          }
        })
        .catch((err) => {
          setLoading(false);
        });
    } else if (query.get("encrypted") == null || query.get("encrypted") == "") {
      setLoading(false);
    }
    // decryptToken(toDecryptToken).then((decryptedText) => {
    //
    // });
  };
  const getId = (idType) => {
    if (printPassData && printPassData != null) {
      if (idType == 1) {
        return printPassData?.CompanyId;
      } else if (idType == 2) {
        return printPassData?.PlantId;
      } else if (idType == 3) {
        return printPassData?.RoleId;
      }
    } else {
      if (idType == 1) {
        return +localStorage["CompanyId"];
      } else if (idType == 2) {
        return +localStorage["PlantId"];
      } else if (idType == 3) {
        return +localStorage["DefaultRoleId"];
      }
    }
  };

  const scannedCheckIn = (scanned) => {
    var plantValid = true;
    if (scanned && scanned != "" && scanned != null) {
      if (plantList && plantList.length > 0) {
        const urlParams = new URL(scanned);
        const accessTok = urlParams.searchParams.get("accessToken");
        plantList.some((plant) => {
          if (
            plant.PlantId == printPassData.PlantId &&
            plant.URLToken == accessTok
          ) {
            plantValid = false;
            return true;
          }
        });
      }
      if (plantValid == true) {
        toast.current?.show({
          severity: "warn",
          summary: "Warning Message",
          detail: "Invalid Code, Kindly Scan Valid Code.",
        });
        setIsPlantListLoaded(false)

        setHasScanned(false);
        setMode({ ...mode, UPDATE: false, CHECKIN: false });
        setShow(false);
        return;
      } else {
        if (editedTrue == true) {
          if (qrScanner && qrScanner != null && scanned != "") {
            qrScanner.stop();
          }
          verifyCheckInOrOut(printPassData);
        } else {
          toast.current?.show({
            severity: "warn",
            summary: "Warning Message",
            detail: "Kindly Update Image ",
          });
          setHasScanned(false);
          setMode({ ...mode, UPDATE: false, CHECKIN: false });
          setShow(false);
          return;
        }
      }
    }
  };

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
  const memoizedScannedCheckIn = useMemo(() => scannedCheckIn, []);

  useEffect(() => {
    if (!isPlantListLoaded) return;

    const video: HTMLVideoElement = videoElementRef.current;
    if (video) {
      qrScanner = new QrScanner(
        video,
        (result) => {
          setScannedText(result.data);
          if (result.data !== "" && !hasScanned) {
            scannedCheckIn(result.data);
          }
        },
        {
          returnDetailedScanResult: true,
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      );

      qrScanner.start();
      updateFlashAvailability();
      qrScanner._updateOverlay();
    }

    return () => {
      // Cleanup if needed
      if (qrScanner) {
        qrScanner.stop();
      }
    };
  }, [isPlantListLoaded, hasScanned, memoizedScannedCheckIn]);
  
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
        case 117:
          setPassType({
            passTypeClass: "pass-type05",
            passTypeTxt: "Vendor Registration",
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

  const updatePassImg = () => {
    if (!photo) {
      setIsdisableSave(false);
      toast.current?.show({
        severity: "warn",
        detail: "Please Capture Image",
        summary: "Warning Message",
      });
      return;
    }

    const formData: any = new FormData();
    let vEntry = {
      ...visEntry,
      VisitorImageName: photo.name,
      VisitorImageUrl: photo.name,
      VisitorEntryCode: visEntry.VisitorEntryCodeHeader,
    };
    let vEntryDetails = visEntryDetails.map((item) => {
      if (printPassData.VisitorEntryDetailId == item.VisitorEntryDetailId) {
        let newItem = { ...item };

        newItem.DocumentName = photo.name;
        newItem.DocumentUrl = photo.name;
        newItem.IsEditedImage = 1;

        return newItem;
      } else {
        return item;
      }
    });

    visEntryUpdate(vEntry, vEntryDetails, formData);
    // let vEntryDetails = [{
    //   ...visEntryDetails,
    //   DocumentName: photo.name,
    //   DocumentUrl: photo.name,
    // }];
  };
  const visEntryUpdate = (vEntry, vEntryDetails, formData) => {
    let obj = {
      VisitorEntry: vEntry,
      VisitorEntryDetail: vEntryDetails ?? [],
    };
    let input: string = JSON.stringify(obj);
    formData.append("input", input);
    formData.append("webfile", photo);
    formData.append("webfile1", photo);
    formData.append("digSign", photo);

    var updateres = dispatch(updateImage(formData));

    updateres
      .then((res) => {
        if (res.payload.tranStatus.result == true) {
          toast.current?.show({
            severity: "success",
            summary: "Success Message",
            detail: res.payload.tranStatus.lstErrorItem[0].Message,
          });
          setIsdisableSave(false);
          window.location.reload();
        } else {
          setIsdisableSave(false);
          toast.current?.show({
            severity: "warn",
            summary: "Warning Message",
            detail: res.payload.tranStatus.lstErrorItem[0].Message,
          });
        }
      })
      .catch((error) => {
        setIsdisableSave(false);
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: JSON.stringify(error),
        });
      });
  };

  const onUpload = (e) => {
    setPhoto(e);
    const uploadedImageUrl = URL.createObjectURL(e);
    setImageUrl(uploadedImageUrl);
  };

  const OnclickCheckin = () => {
    let Obj = {
      Type: "CreateInitialize",
      CompanyId: printPassData?.CompanyId,
    };
    var result = dispatch(CreateInitialize(Obj));
    result
      .then((res) => {
        setPlantList(res.payload.PlantList);
      })
      .catch((error) => {
        toast.current?.show({
          severity: "error",
          detail: "Error",
          summary: error,
        });
      });
  };

  const PassCheckIn = () => {
    let obj = {
      UserId: printPassData?.VisitedEmployeeId,
      VisitorEntryCode: printPassData?.VisitorEntryCodeHeader,
      // VisitorEntryCode: printPassData?.VisitorEntryCode,
      VisitorEntryDetailId: printPassData?.VisitorEntryDetailId,
      Checkintime: tLDS(new Date()),
      type: "",
      CompanyId: getId(1),
      PlantId: getId(2),
      RoleId: getId(3),
    };
    const updateRes = dispatch(CheckIn(obj));
    updateRes
      .then((res) => {
        if (res.payload.tranStatus.result) {
          setScannedText("");
          setHasScanned(false);
          dispatch(
            CheckInCkeckoutPageLoad({ CompanyId: getId(1), PlantId: getId(2) })
          );
          setCheckinTrue(false);
          toast.current?.show({
            severity: "success",
            summary: "Success Message",
            detail: res.payload.tranStatus.lstErrorItem[0].Message,
          });
          setIsPlantListLoaded(false)

          if (qrScanner && qrScanner != null) {
            qrScanner.stop();
          }
          setMode({ ...mode, UPDATE: false, CHECKIN: false });
          setShow(false);
          setCheckinTrue(false);
        } else {
          setScannedText("");
          setHasScanned(false);

          dispatch(
            CheckInCkeckoutPageLoad({ CompanyId: getId(1), PlantId: getId(2) })
          );
          setIsPlantListLoaded(false)

          toast.current?.show({
            severity: "warn",
            summary: "Warning Message",
            detail: res.payload.tranStatus.lstErrorItem[0].Message,
          });
        }
        getPass();
      })
      .catch((error) => {
        dispatch(
          CheckInCkeckoutPageLoad({ CompanyId: getId(1), PlantId: getId(2) })
        );
        setIsPlantListLoaded(false)

        setHasScanned(false);

        toast.current?.show({
          severity: "error",
          summary: "Error Message",
          detail: JSON.stringify(error),
        });
      });
  };

  const PassCheckOut = () => {
    let obj = {
      UserId: printPassData?.VisitedEmployeeId,
      VisitorEntryCode: printPassData?.VisitorEntryCodeHeader,
      // VisitorEntryCode: printPassData?.VisitorEntryCode,
      VisitorEntryDetailId: printPassData?.VisitorEntryDetailId,
      Checkouttime: tLDS(new Date()),
      type: "",
    };
    const updateRes = dispatch(CheckOut(obj));
    updateRes
      .then((res) => {
        if (res.payload.tranStatus.result) {
          setHasScanned(false);

          setScannedText("");
          dispatch(
            CheckInCkeckoutPageLoad({ CompanyId: getId(1), PlantId: getId(2) })
          );
          toast.current?.show({
            severity: "success",
            summary: "Success Message",
            detail: res.payload.tranStatus.lstErrorItem[0].Message,
          });
          if (qrScanner && qrScanner != null) {
            qrScanner.stop();
          }
        setIsPlantListLoaded(false)

          setMode({ ...mode, UPDATE: false, CHECKIN: false });
          setShow(false);
          setCheckedOut(true);
          setTimeout(() => {
            window.location.reload();
          }, 4000);
        } else {
          setHasScanned(false);

          setScannedText("");
          dispatch(
            CheckInCkeckoutPageLoad({ CompanyId: getId(1), PlantId: getId(2) })
          );
        setIsPlantListLoaded(false)

          toast.current?.show({
            severity: "warn",
            summary: "Warning Message",
            detail: res.payload.tranStatus.lstErrorItem[0].Message,
          });
        }
      })
      .catch((error) => {
        dispatch(
          CheckInCkeckoutPageLoad({ CompanyId: getId(1), PlantId: getId(2) })
        );
        setHasScanned(false);

        toast.current?.show({
          severity: "warn",
          summary: "Warning Message",
          detail: JSON.stringify(error),
        });
        setScannedText("");
      });
  };

  const updateFlashAvailability = () => {
    qrScanner.hasFlash().then((hasFlash) => {
      if (hasFlash) {
        setHasFlash(true);
      } else {
        setHasFlash(false);
      }
    });
  };

  const flashToggle = () => {
    qrScanner
      .toggleFlash()
      .then(() =>
        qrScanner.isFlashOn() ? setFlashTxt("On") : setFlashTxt("Off")
      );
  };

  const verifyCheckInOrOut = (e) => {
    if (qrScanner && qrScanner != null && scanned != "") {
      qrScanner.stop();
    }
    setScannedText("");
    setHasScanned(false);

    var scannedCode = printPassData?.VisitorEntryCodeHeader;
    // var scannedCode = printPassData?.VisitorEntryCode;
    var scannedDtlId = printPassData?.VisitorEntryDetailId;

    let obj = {
      text: scannedCode,
      EntryType: 60,
      PlantId: printPassData?.PlantId,
    };
    // if (!isCalled) {
    var result = dispatch(FilterVisitorEntryCode(obj));
    result
      .then((res) => {
        if (res.payload.tranStatus.result) {
          let checkInCodes = res.payload.VisitorEntryCheckInCodeList;
          let checkOutCodesL = res.payload.VisitorEntryCheckOutLCodeList;
          let checkOutCodesM = res.payload.VisitorEntryCheckOutMCodeList;
          let checkedInOutCodes = res.payload.VisitorEntryCheckedInOutCodeList;
          let approvalCodes = res.payload.VisitorEntryAppovalList;
          if (approvalCodes.length > 0) {
            let approvedCheck = approvalCodes.filter(
              (item) => item.DocumentNo == scannedCode
            );
            if (
              approvedCheck &&
              approvedCheck.length > 0 &&
              approvedCheck[0].Status == 74
            ) {
              toast.current?.show({
                severity: "warn",
                summary: "Warning Message",
                detail:
                  "Please Approve the Visitor Entry to Start Check-In Process.",
              });
              if (qrScanner && qrScanner != null) {
                qrScanner.stop();
              }
              setHasScanned(false);
              setMode({ ...mode, UPDATE: false, CHECKIN: false });
              setShow(false);
              return;
            } else {
              if (
                checkedInOutCodes.length == 0 &&
                checkInCodes.length == 0 &&
                checkOutCodesL.length == 0 &&
                checkOutCodesM.length == 0
              ) {
                toast.current?.show({
                  severity: "warn",
                  summary: "Warning Message",
                  detail: "Invalid Code, Kindly Scan Valid Code",
                });
                setIsPlantListLoaded(false)
                setScannedText("");
                if (qrScanner && qrScanner != null) {
                  qrScanner.stop();
                }
                setHasScanned(false);
                setMode({ ...mode, UPDATE: false, CHECKIN: false });
                setShow(false);
                return;
              } else {
                if (checkedInOutCodes && checkedInOutCodes.length > 0) {
                  checkedInOutCodes.forEach((element) => {
                    if (
                      element.VisitorEntryCode == scannedCode &&
                      element.VisitorEntryDetailId == scannedDtlId.toString()
                    ) {
                      toast?.current?.show({
                        severity: "warn",
                        summary: "Warning",
                        detail: `This Visitor ${element.PersonName}-${element.VisitorEntryCode} is Already Checked Out`,
                      });
                setIsPlantListLoaded(false)

                      setScannedText("");
                      if (qrScanner && qrScanner != null) {
                        qrScanner.stop();
                      }
                      setHasScanned(false);
                      setMode({ ...mode, UPDATE: false, CHECKIN: false });
                      setShow(false);
                      return;
                    }
                  });
                }

                checkInCodes.forEach((element) => {
                  if (
                    checkInCodes &&
                    checkInCodes.length > 0 &&
                    scannedCode == element.VisitorEntryCode &&
                    scannedDtlId == element.VisitorEntryDetailId.toString()
                  ) {
                    PassCheckIn();
                    setHasScanned(true);
                  }
                });

                if (!checkinTrue) {
                  checkOutCodesL.forEach((element) => {
                    if (
                      checkOutCodesL &&
                      checkOutCodesL.length > 0 &&
                      scannedCode == element.VisitorEntryCode &&
                      scannedDtlId == element.VisitorEntryDetailId.toString()
                    ) {
                      setScannedText("");
                      toast?.current?.show({
                        severity: "warn",
                        summary: "Warning Message",
                        detail: "kindly check-out after 10 seconds",
                      });
                      if (qrScanner && qrScanner != null) {
                        qrScanner.stop();
                      }
                      setHasScanned(false);
                      setMode({ ...mode, UPDATE: false, CHECKIN: false });
                      setShow(false);
                      return;
                    }
                  });

                  checkOutCodesM.forEach((element) => {
                    if (
                      checkOutCodesM &&
                      checkOutCodesM.length > 0 &&
                      scannedCode == element.VisitorEntryCode &&
                      scannedDtlId == element.VisitorEntryDetailId.toString()
                    ) {
                      if (!checkinTrue) PassCheckOut();
                    }
                  });
                }
              }
            }
          } else {
            toast.current?.show({
              severity: "warn",
              summary: "Warning Message",
              detail: "Invalid Code, Please Scan Valid Code",
            });
            setIsPlantListLoaded(false)

            if (qrScanner && qrScanner != null) {
              qrScanner.stop();
            }
            setHasScanned(false);
            setMode({ ...mode, UPDATE: false, CHECKIN: false });
            setShow(false);
            return;
          }
        } else {
          toast?.current?.show({
            severity: "warn",
            summary: "Warning Message",
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
    // }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 600) {
        // setMaxWidth("350px");
      } else if (window.innerWidth <= 700) {
        // setMaxWidth("350px");
      } else if (window.innerWidth <= 1200) {
        // setMaxWidth("500px");
      } else {
        // setMaxWidth("600px");
      }
    };
    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  });

  const LoadingPass = () => {
    return (
      <div className="flex h-fit">
        <div className="flex flex-row justify-content-center align-items-center h-full">
          <div className="align-items-center flex flex-row justify-content-center m-auto white p-5 border-round-3xl w-18rem">
            <div className="col-12">
              <div className="card mb-0 text-center">
                <div className="flex justify-content-between mb-3">
                  <div className="m-auto align-items-center bg-blue-100 border-round-lg flex justify-content-center p-3">
                    <i className="pi pi-spinner text-blue-400 text-xl pi-spin"></i>
                  </div>
                </div>
                <h1 className="text-blue-400 text-3xl">Loading,</h1>
                <h4 className="text-black-alpha-30 text-xl font-normal">
                  Please Wait...
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ExpiredPass = ({ passData }) => {
    return (
      <div className="flex h-fit flex-column gap-5">
        <div className="flex flex-row justify-content-center align-items-center h-full">
          <div className="align-items-center flex flex-row justify-content-center m-auto w-9 white p-2 border-round-3xl">
            <div className="col-12">
              <div className="card mb-0 text-center">
                <div className="flex justify-content-between mb-3">
                  <div className="m-auto align-items-center bg-orange-100 border-round-lg flex justify-content-center p-3">
                    <i className="pi pi-times-circle text-orange-400 text-xl"></i>
                  </div>
                </div>
                {passData?.VisitorTypeId == 36 &&
                passData?.CheckedIn != null &&
                passData?.CheckedOut != null ? (
                  <>
                    <h1 className="text-orange-400 text-2xl">
                      Today's pass has expired.
                    </h1>
                    <div className="text-orange-400 text-2xl">
                      Please visitor this Link again tomorrow for a new day
                      pass!
                    </div>
                  </>
                ) : (
                  <h1 className="text-orange-400 text-2xl">
                    Pass has expired/ No Data to Show.
                  </h1>
                )}
              </div>
            </div>
          </div>
        </div>
        {passData &&
        Object.keys(passData).length > 0 &&
        query.get("encrypted") != "" &&
        query.get("encrypted") != null ? (
          <div className="text-center ">
            <h2 className="mb-2">Give Us Your Feedback</h2>
            <Button
              label="Feedback"
              icon="pi pi-comment"
              onClick={() =>
                routePage.push(
                  `/home/Feedback?encrypted=${query.get("encrypted")}`
                )
              }
            />
          </div>
        ) : null}
      </div>
    );
  };

  const checkPassValidity = () => {
    if (loading) {
      return <LoadingPass />;
    }
    if (printPassData && Object.keys(printPassData).length > 0) {
      let passD = printPassData;
      if (
        passD?.ValidTo &&
        new Date(passD?.ValidTo).getTime() >= new Date().getTime()
      ) {
        if (passD?.CheckedOut == null) {
          return (
            <PassContent
              checkedOut={checkedOut}
              setCheck={setCheck}
              editedTrue={editedTrue}
              OnclickCheckin={OnclickCheckin}
              setMode={setMode}
              setShow={setShow}
              check={check}
              show={show}
              isDisableSave={isDisableSave}
              updatePassImg={updatePassImg}
              routePage={routePage}
              videoElementRef={videoElementRef}
              setScannedText={setScannedText}
              scanned={scanned}
              checkinTrue={checkinTrue}
              toast={toast}
              setCameraOff={setCameraOff}
              cameraOff={cameraOff}
              imageUrl={imageUrl}
              onUpload={onUpload}
              maxWidth={maxWidth}
              passType={passType}
              mode={mode}
              printPassData={printPassData}
              setHasScanned={setHasScanned}
              setIsPlantListLoaded={setIsPlantListLoaded}
            />
          );
        } else if (passD?.CheckedOut != null) {
          return <ExpiredPass passData={passD} />;
        } else {
          return <LoadingPass />;
        }
      } else {
        return <ExpiredPass passData={passD} />;
      }
    } else if (query.get("encrypted") == null || query.get("encrypted") == "") {
      return <ExpiredPass passData={{}} />;
    } else {
      return <ExpiredPass passData={{}} />;
    }
  };

  return (
    <div
      className="print-page-container"
      style={{ height: "100vh", overflowY: "auto" }}
    >
      <div
        className={`align-items-center flex justify-content-center ${
          printPassData &&
          Object.keys(printPassData).length > 0 &&
          printPassData.hasOwnProperty("CheckedOut") &&
          printPassData.CheckedOut == null
            ? ""
            : "h-full"
        }`}
      >
        {/* <Dialog
        header="Visitor Pass Preview"
        className="preview-popup"
        visible={passVisible}
        style={{ width: "530px" }}
        onHide={() => setpassVisible(false)}
        footer={footerContent}
        > */}

        {checkPassValidity()}

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
        <AppAlert toast={toast} />
        <ConfirmDialog />
      </div>
    </div>
  );
};

export default PrintPassPreview;
