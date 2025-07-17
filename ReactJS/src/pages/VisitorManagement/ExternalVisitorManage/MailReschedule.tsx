import { NoImg } from "../../../assets/css/img-library";
import {
  GetRescheduleVisList,
  updateVisitorEntry,
} from "@/redux/slices/visitorManagement/externalBookEntrySlice";
import { useDispatch } from "react-redux";
import { useEffect, useMemo, useRef, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import {
  approvalupdate,
  approvalUpdateLevel,
  DSendPass,
  mailApproval,
  poppupFetch,
  poppupUpdate,
} from "@/redux/slices/master/workFlowSlice";
import { Toast } from "primereact/toast";
import AppAlert from "@/alert/alert";
import * as CryptoJS from "crypto-js";
import { MessageAlert } from "@/pages/VisitorManagement/ExternalVisitorManage/BookExternal";
import { Button } from "primereact/button";
import FormFields from "@/components/FormFields";
import { Formik } from "formik";
import { tLDS } from "@/utils/utilFunc";

// const randomBytes = (length: number): Uint8Array => {
//   const crypto = window.crypto || (window as any).msCrypto; // For IE 11 compatibility
//   const array = new Uint8Array(length);
//   crypto.getRandomValues(array);
//   return array;
// };
// const EncryptionKey: string = GenerateRandomKey(32);

// function generateToken(text: string): string {
//   const key = CryptoJS.enc.Base64.parse(EncryptionKey);
//   const iv = CryptoJS.lib.WordArray.random(16);

//   const encrypted = CryptoJS.AES.encrypt(text, key, { iv });
//   return base64UrlEncode(CryptoJS.enc.Base64.parse(encrypted.toString()));
// }

// function decryptToken(encryptedText: string): string {
//   const key = CryptoJS.enc.Base64.parse(EncryptionKey);
//   const iv = CryptoJS.lib.WordArray.random(16);

//   const decrypted = CryptoJS.AES.decrypt(
//     {
//       ciphertext: CryptoJS.enc.Base64.parse(encryptedText),
//     },
//     key,
//     { iv }
//   );

//   return decrypted.toString(CryptoJS.enc.Utf8);
// }

// function base64UrlEncode(input) {
//   return btoa(String.fromCharCode.apply(null, input))
//     .replace(/\+/g, "-")
//     .replace(/\//g, "_")
//     .replace(/=+$/, "");
// }

// function base64UrlDecode(input: string) {
//   input = input.replace(/-/g, "+").replace(/_/g, "/");
//   const padding = (4 - (input.length % 4)) % 4;
//   input = input.padEnd(input.length + padding, "=");

//   const decoded = atob(input);
//   const array = new Uint8Array(decoded.length);

//   for (let i = 0; i < decoded.length; ++i) {
//     array[i] = decoded.charCodeAt(i);
//   }

//   return array;
// }

// function GenerateRandomKey(keyLength: number): string {
//   const randomBytesArray = randomBytes(keyLength);
//   return base64UrlEncode(randomBytesArray);
// }

function useQuery() {
  const { search } = useLocation();

  return useMemo(() => new URLSearchParams(search), [search]);
}

const MailReschedule = (props) => {
  const { formik, visitorEntryForm, VisitorEntryValidationSchema } = props;

  const [currentDateTime, setCurrentDateTime] = useState("");
  const [VisitorEntry, setVisitorEntry] = useState<any>({});
  const [ApprovalRequest, setApprovalRequest] = useState<any>({});
  const [VisitorEntryDetail, setVisitorEntryDetail] = useState([]);
  const [alertMess, setAlertMess] = useState(
    "Appointment Request Processing ..."
  );
  const [resType, setResType] = useState("");
  const [From, setFrom] = useState(null);
  const [To, setTo] = useState(null);

  const route = useHistory();
  const query = useQuery();
  const dispatch: any = useDispatch();
  const toast = useRef<Toast>(null);

  const onChangeFromDate = (selectedDate) => {
    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);

    setVisitorEntry({
      ...VisitorEntry,
      ValidFrom: selectedDate,
      ValidTo: endOfDay,
      IsMeetingClose: false,
    });
  };

  const saveVisitor = (type: string) => {
    if (type == "exit") {
      if (VisitorEntry.Status != 75) {
        toast.current?.show({
          severity: "warn",
          summary: "Warning Message",
          detail: `Visit not Approved yet for the Visitor ${VisitorEntry.VisitorEntryCode} .`,
        });
        return;
      }

      if (VisitorEntry.VisitEndTime) {
        toast.current?.show({
          severity: "warn",
          summary: "Warning Message",
          detail: `Visit already ended for the Visitor ${VisitorEntry.VisitorEntryCode}.`,
        });
        return;
      }
    }

    const previousvalidfrom = new Date(VisitorEntry.PreviousValidFrom);
    const validfrom = new Date(VisitorEntry.ValidFrom);

    if (type == "resc") {
      if (previousvalidfrom.getTime() === validfrom.getTime()) {
        toast.current?.show({
          severity: "warn",
          summary: "Warning Message",
          detail: `Please reschedule a Visit for Visitor ${VisitorEntry.VisitorEntryCode}.`,
        });
        return;
      }
    }

    const tempFrom = tLDS(new Date(VisitorEntry.ValidFrom));
    const tempTo = tLDS(new Date(VisitorEntry.ValidTo));
    const prevTempFrom = tLDS(new Date(From));
    const prevTempTo = tLDS(new Date(To));
    const closed = type == "exit" ? true : false;
    const endvis = type == "exit" ? tLDS(new Date()) : null;

    const obj = {
      VisitorEntry: {
        ...VisitorEntry,
        PreviousValidFrom: prevTempFrom,
        PreviousValidTo: prevTempTo,
        ValidFrom: tempFrom,
        ValidTo: tempTo,
        VisitEndTime: endvis,
        IsMeetingClose: closed,
      },

      VisitorEntryDetail: VisitorEntryDetail.map((vd) => ({
        ...vd,
        ValidFrom: prevTempFrom,
        ValidTo: prevTempTo,
      })),
      ApprovalRequest: ApprovalRequest,
      SaveType: type,
    };
    var updateres = dispatch(updateVisitorEntry(obj));
    updateres
      .then((res) => {
        if (res.payload.tranStatus.result == true) {
          toast.current?.show({
            severity: "success",
            summary: "Success Message",
            detail: res.payload.tranStatus.lstErrorItem[0].Message,
          });
          setTimeout(() => {
            var result = dispatch(approvalUpdateLevel({ ApprovalRequest }));
            result
              .then((res) => {
                if (res.payload.tranStatus.result) {
                  setAlertMess(res.payload.tranStatus.lstErrorItem[0].Message);
                  setResType("SUCCESS");
                } else {
                  setAlertMess(res.payload.tranStatus.lstErrorItem[0].Message);
                  setResType("ERROR");
                }
              })
              .catch((error) => {
                toast.current?.show({
                  severity: "error",
                  summary: "Error Message",
                  detail: JSON.stringify(error),
                });
              });

            setVisitorEntry(VisitorEntry);
          }, 800);
        } else {
          toast.current?.show({
            severity: "warn",
            summary: "Warning Message",
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
  };

  useEffect(() => {
    document.body.classList.add("tv-bg");

    const updateDateTime = () => {
      const now = new Date();
      const day = now.getDate().toString().padStart(2, "0");
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const month = monthNames[now.getMonth()];
      const year = now.getFullYear();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const seconds = now.getSeconds().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      const formattedHours = hours.toString().padStart(2, "0");

      const formattedDateTime = `${day} ${month} ${year} ${formattedHours}:${minutes}:${seconds} ${ampm}`;
      setCurrentDateTime(formattedDateTime);
    };

    const dSendPass = dispatch(DSendPass(query.get("token")));
    dSendPass
      .then((res) => {
        if (
          res.payload.hasOwnProperty("tranStatus") &&
          res.payload.tranStatus.result
        ) {
          const dataReq = res.payload.VisitorEntryHeader.split("_");
          const VisitorEntryCode = dataReq[0];
          const CompanyId = dataReq[1];
          const PlantId = dataReq[2];
          const DocId = dataReq[3];
          const PrimUser = dataReq[4];
          const Sts = dataReq[5];
          const visTypeId = dataReq[6];
          const lvlId = dataReq[7];
          const VisitorEntryId = dataReq[8];
          const RoleId = dataReq[9];

          const ApprovalRequest = {
            companyid: CompanyId,
            plantid: PlantId,
            requesterid: PrimUser,
            documentno: VisitorEntryCode,
            approvalid: null,
            approvaldetailid: null,
            documentid: 34,
            documentdetailid: null,
            documentactivityid: 70,
            remarks1: "",
            remarks2: "",
            status: Sts,
            approverid: PrimUser,
            levelid: lvlId,
            alternateuser: null,
            parentid: null,
            userid: PrimUser,
            requestfromdate: null,
            requesttodate: null,
            Isviewed: 1,
          };
          setApprovalRequest(ApprovalRequest);

          const requestData = {
            VisitorEntryId: Number(VisitorEntryId),
            CompanyId: Number(CompanyId),
            RoleId: Number(RoleId),
            PrimaryUserId: Number(PrimUser),
          };

          var result = dispatch(GetRescheduleVisList(requestData));
          result
            .then((res) => {
              if (res.payload.tranStatus.result) {
                const VisitorEntry = res.payload.VisitorEntry;
                const VisitorEntryDetail = res.payload.VisitorEntryDetail;

                setVisitorEntry(VisitorEntry);
                setVisitorEntryDetail(VisitorEntryDetail);
                if (VisitorEntry) {
                  const List = VisitorEntry;
                  if (List.IsMeetingClose) {
                    var result = dispatch(
                      approvalUpdateLevel({ ApprovalRequest })
                    );
                    result
                      .then((res) => {
                        if (res.payload.tranStatus.result) {
                          setAlertMess(
                            res.payload.tranStatus.lstErrorItem[0].Message
                          );
                          setResType("SUCCESS");
                        } else {
                          setAlertMess(
                            res.payload.tranStatus.lstErrorItem[0].Message
                          );
                          setResType("ERROR");
                        }
                      })
                      .catch((error) => {
                        toast.current?.show({
                          severity: "error",
                          summary: "Error Message",
                          detail: JSON.stringify(error),
                        });
                      });

                    setVisitorEntry(VisitorEntry);
                  } else {
                    setVisitorEntry(VisitorEntry);
                    setFrom(VisitorEntry.ValidFrom);
                    setTo(VisitorEntry.ValidTo);
                  }
                }
              } else {
                toast.current?.show({
                  severity: "error",
                  detail: "Error",
                  summary:
                    res.payload.tranStatus?.lstErrorItem?.[0]?.Message ??
                    "Unknown error",
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

          updateDateTime();
          const interval = setInterval(updateDateTime, 1000);

          return () => {
            document.body.classList.remove("tv-bg");
            clearInterval(interval);
          };
        }
      })
      .catch((err) => {});
  }, []);

  return (
    <Formik
      initialValues={visitorEntryForm}
      validationSchema={VisitorEntryValidationSchema}
      onSubmit={(values) => {}}
    >
      {VisitorEntry?.Status == 75 && VisitorEntry.IsMeetingClose ? (
        <div style={{ overflow: "auto", height: "100vh" }}>
          <div className="flex flex-row justify-content-center align-items-center h-full">
            <div className="align-items-center flex flex-row justify-content-center m-auto w-30rem white p-5 border-round-3xl">
              <div className="col-12">
                <div className="card mb-0 text-center">
                  <div className="flex justify-content-between mb-3">
                    <div
                      className={`${
                        resType == "SUCCESS" ? "bg-green-100" : "bg-yellow-100"
                      } m-auto align-items-center border-round-lg flex justify-content-center p-3`}
                    >
                      <i
                        className={`pi ${
                          alertMess
                            ? resType != "SUCCESS"
                              ? "pi-exclamation-circle"
                              : "pi pi-check"
                            : "pi-spin pi-spinner"
                        } ${
                          resType == "SUCCESS"
                            ? "text-green-600"
                            : "text-yellow-600"
                        } text-xl`}
                      ></i>
                    </div>
                  </div>
                  <h1
                    className={`text-3xl ${
                      resType === "SUCCESS"
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {VisitorEntry
                      ? `${VisitorEntry.VisitorEntryCode} Visit Ended Already`
                      : "No Reschedule Visitor Data Found"}
                  </h1>
                </div>
              </div>
            </div>
          </div>
          <AppAlert toast={toast} />
        </div>
      ) : (
        <div className="page-container tv-container">
          <div className="p20">
            <div className="grid">
              <div className="col-3">{/* <h3>Leiten Smart VMS</h3> */}</div>
              <div className="col-6 text-center">
                <h2>Reschedule / Visitor Exit Status</h2>
              </div>
              <div className="col-3 text-end">
                <h4>{currentDateTime}</h4> {/* ✅ Live date & time here */}
              </div>
            </div>
            <div className="grid">
              <div className="col-12 text-end">
                <div className="visitor-legend p10"></div>
              </div>
            </div>
            <div className="grid">
              <div className="col-4"></div>
              <div className="col-4" key={VisitorEntry.VisitorEntryCode}>
                <div className="visitor-container p10">
                  <div className="visitor-tv-photo mr25">
                    <img
                      src={
                        VisitorEntry.VisitorImageUrl
                          ? VisitorEntry.VisitorImageUrl
                          : NoImg
                      }
                      className="w-full"
                    />
                    <div className="tv-pass-type tv-pass-type01 text-center p5 uppercase">
                      {VisitorEntry.VisitorEntryCode}
                    </div>
                  </div>
                  <div className="visitor-tv-info">
                    <div className="visitor-status visitor-status01 inline-block p510 mb5">
                      {VisitorEntry.PurposeOfVisitName}
                    </div>
                    <div className="visitor-time inline-block">
                      {new Date(VisitorEntry.ValidFrom).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </div>
                    <div
                      className="visitor-tv-name ellipsis mb10"
                      style={{ width: "320px" }}
                    >
                      {VisitorEntry.PersonName}
                    </div>
                    <div className="host-tv-name ellipsis mb10">
                      Host : {VisitorEntry.VisitedEmployeeName}
                    </div>
                    <div className="host-tv-name ellipsis mb10">
                      Area / Floor : {VisitorEntry.AreaToVisitName}
                    </div>
                    <div className="host-tv-name ellipsis mb1">
                      Reschedule Time :
                      <FormFields
                        className="inline-block p510 mb1"
                        type="Calendar"
                        name="ValidFrom"
                        show={true}
                        fldStyle={"col-12 md:col-8"}
                        optionLabel=""
                        optionValue=""
                        disable={VisitorEntry.Status == 75 || VisitorEntry.Status == 76}
                        formik={{
                          values: {
                            ValidFrom: VisitorEntry.ValidFrom
                              ? new Date(VisitorEntry.ValidFrom)
                              : null,
                          },
                        }}
                        minDate={
                          new Date(new Date().getTime() + 60 * 60 * 1000)
                        }
                        handleChange={(e) => onChangeFromDate(e.value)}
                        // minDate={new Date()}
                        showTime={true}
                      />
                    </div>
                    {/* <div className="host-tv-name ellipsis mb1">
                      <input
                        type={"checkbox"}
                        name={"IsMeetingClose"}
                        checked={VisitorEntry.IsMeetingClose || false}
                        // disabled={
                        //   new Date(visitor.previous_Valid_From).getTime() !=
                        //   new Date(visitor.Valid_From).getTime()
                        // }
                        onChange={(e) => handleCheckboxChange(e.target.checked)}
                      />{" "}
                      End Visit
                    </div>
                     */}
                  </div>
                </div>
              </div>
              <div className="col-4"></div>
            </div>
            <div className="grid">
              <div className="col-12">
                <div className="widget-ftr text-center">
                  <div className="flex flex-row justify-content-center widget-ftr text-center">
                    <div className="text-center">
                      <Button
                        label="End Visit"
                        title="End Visit"
                        icon="las la-times"
                        type="submit"
                        disabled={!VisitorEntry}
                        onClick={() => saveVisitor("exit")}
                      />
                      <Button
                        label="Reschedule Visit"
                        title="Reschedule Visit"
                        icon="pi pi-save"
                        type="submit"
                        disabled={!VisitorEntry}
                        onClick={() => saveVisitor("resc")}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <AppAlert toast={toast} />
        </div>
      )}
    </Formik>
  );
};

export default MailReschedule;
