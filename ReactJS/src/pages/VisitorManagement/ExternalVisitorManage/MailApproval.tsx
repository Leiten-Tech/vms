import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
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

const randomBytes = (length: number): Uint8Array => {
  const crypto = window.crypto || (window as any).msCrypto; // For IE 11 compatibility
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return array;
};
const EncryptionKey: string = GenerateRandomKey(32);

function generateToken(text: string): string {
  const key = CryptoJS.enc.Base64.parse(EncryptionKey);
  const iv = CryptoJS.lib.WordArray.random(16);

  const encrypted = CryptoJS.AES.encrypt(text, key, { iv });
  return base64UrlEncode(CryptoJS.enc.Base64.parse(encrypted.toString()));
}

function decryptToken(encryptedText: string): string {
  const key = CryptoJS.enc.Base64.parse(EncryptionKey);
  const iv = CryptoJS.lib.WordArray.random(16);

  const decrypted = CryptoJS.AES.decrypt(
    {
      ciphertext: CryptoJS.enc.Base64.parse(encryptedText),
    },
    key,
    { iv }
  );

  return decrypted.toString(CryptoJS.enc.Utf8);
}

function base64UrlEncode(input) {
  return btoa(String.fromCharCode.apply(null, input))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64UrlDecode(input: string) {
  input = input.replace(/-/g, "+").replace(/_/g, "/");
  const padding = (4 - (input.length % 4)) % 4;
  input = input.padEnd(input.length + padding, "=");

  const decoded = atob(input);
  const array = new Uint8Array(decoded.length);

  for (let i = 0; i < decoded.length; ++i) {
    array[i] = decoded.charCodeAt(i);
  }

  return array;
}

function GenerateRandomKey(keyLength: number): string {
  const randomBytesArray = randomBytes(keyLength);
  return base64UrlEncode(randomBytesArray);
}

function useQuery() {
  const { search } = useLocation();

  return useMemo(() => new URLSearchParams(search), [search]);
}

const MailApproval = () => {
  const route = useHistory();
  const query = useQuery();
  const dispatch: any = useDispatch();
  const toast = useRef<Toast>(null);

  const [visible, setVisible] = useState(false);
  const [alertMess, setAlertMess] = useState(
    "Appointment Request Processing ..."
  );
  const [resType, setResType] = useState("");

  useEffect(() => {
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

          // if (visTypeId != 36 || visTypeId != 35) {
          //   const mailApprove = dispatch(mailApproval(query.get("token")));
          //   mailApprove
          //     .then((res) => {
          //       if (res.payload.tranStatus.result) {
          //         // toast.current?.show({
          //         //   severity: "success",
          //         //   summary: "Success Message",
          //         //   detail: res.payload.tranStatus.lstErrorItem[0].Message,
          //         // });
          //         setAlertMess(res.payload.tranStatus.lstErrorItem[0].Message);
          //         setResType("SUCCESS");
          //       } else {
          //         // toast.current?.show({
          //         //   severity: "error",
          //         //   summary: "Error Message",
          //         //   detail: res.payload.tranStatus.lstErrorItem[0].Message,
          //         // });
          //         setAlertMess(res.payload.tranStatus.lstErrorItem[0].Message);
          //         setResType("ERROR");
          //       }
          //     })
          //     .catch((error) => {
          //       toast.current?.show({
          //         severity: "error",
          //         summary: "Error Message",
          //         detail: JSON.stringify(error),
          //       });
          //     });
          // } 
          // else {
            let obj = {
              ApprovalRequest: {
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
              },
            };
            var result = dispatch(approvalUpdateLevel(obj));
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
          // }
        }
      })
      .catch((err) => {});

    // servicecall(obj);
  }, []);

  // const OnApprove = (poppupObj: any) => {
  //   let obj = {
  //     ApprovalRequest: {
  //       companyid: +localStorage["CompanyId"],
  //       plantid: +localStorage["PlantId"],
  //       requesterid: poppupObj.initiatedBy,
  //       documentno: poppupObj.DocumentNo,
  //       documentid: poppupObj.DocumentId,
  //       documentdetailid: null,
  //       remarks1: "",
  //       remarks2: "",
  //       status: 75,
  //       approverid: +localStorage["UserId"],
  //       levelid: poppupObj.LevelId,
  //       alternateuser: null,
  //       parentid: null,
  //       userid: +localStorage["UserId"],
  //       requestfromdate: null,
  //       requesttodate: null,
  //       Isviewed: 1,
  //     },
  //   };
  //   servicecall(obj);
  // };
  // const OnReject = (poppupObj: any) => {
  //   let obj = {
  //     ApprovalRequest: {
  //       companyid: +localStorage["CompanyId"],
  //       plantid: +localStorage["PlantId"],
  //       requesterid: poppupObj.initiatedBy,
  //       documentno: poppupObj.DocumentNo,
  //       documentid: poppupObj.DocumentId,
  //       documentdetailid: null,
  //       remarks1: "",
  //       remarks2: "",
  //       status: 76,
  //       approverid: +localStorage["UserId"],
  //       levelid: poppupObj.LevelId,
  //       alternateuser: null,
  //       parentid: null,
  //       userid: +localStorage["UserId"],
  //       requestfromdate: null,
  //       requesttodate: null,
  //       Isviewed: 1,
  //     },
  //   };
  //   servicecall(obj);
  // };

  const servicecall = (obj: any) => {
    var result = dispatch(approvalupdate(obj));
    result
      .then((res) => {
        if (res.payload.Result.tranStatus.result) {
          toast.current?.show({
            severity: "success",
            summary: "Success Message",
            detail: res.payload.Result.tranStatus.lstErrorItem[0].Message,
          });
        } else {
          toast.current?.show({
            severity: "error",
            summary: "Error Message",
            detail: res.payload.Result.tranStatus.lstErrorItem[0].Message,
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

  return (
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
                  resType == "SUCCESS" ? "text-green-600" : "text-yellow-600"
                }`}
              >
                {alertMess}
              </h1>
            </div>
          </div>
        </div>
      </div>
      <AppAlert toast={toast} />
    </div>
  );
};

export default MailApproval;
