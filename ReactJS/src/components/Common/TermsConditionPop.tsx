import React, { useState, useRef, useEffect } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import Signature from "./Signature";
import { blobUrlToFile } from "@/utils/utilFunc";

const TermsConditionPop = ({
  toast,
  sign,
  setSign,
  showPopup,
  setShowPopup,
  setIsdisableSave,
  setIsChecked,
  TermsConditions,
  setSignedUrl,
  signedUrl,
  formik,
  setDigSignFile,
  screenSized,
  isView
}) => {
  const [showFooter, setShowFooter] = useState(true);

  const openPrint = () => {
    const printWindow = window.open("", "", "height=1000, width=1000");
    printWindow.document.write("<html><head><title>Terms & Condition Preview</title>");
    printWindow.document.write('<style>body { font-family: Arial, sans-serif; }</style>');

    printWindow.document.write(`<h1>Terms and Conditions</h1>`);
    printWindow.document.write(`<div>${TermsConditions?.Points}</div>`);
    if (signedUrl ) {
      printWindow.document.write('<div><h2>Signature:</h2>');
      printWindow.document.write(`<img src="${signedUrl}" alt="Signature" style="max-width: 100%; max-height: 150px;"/></div>`);
    }
    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.print();
  };
    const handleSave = () => {
    if (!isView) {

      setShowPopup(false);
      if (!sign.isEmpty()) {
        let dataUrl = sign?.getTrimmedCanvas().toDataURL("image/png");
        setSignedUrl(dataUrl);
        blobUrlToFile(dataUrl)
          .then((resFile: any) => {
            setDigSignFile(resFile);
            formik.setFieldValue("DigitalSignName", resFile.name);
            formik.setFieldValue("DigitalSignUrl", resFile.name);
          })
          .catch((err) => { });

        setIsdisableSave();
      }
      if (!signedUrl || signedUrl == null) {
        toast.current?.show({
          severity: "warn",
          summary: "Warning Message",
          detail: "Agree the terms & Signature",
        });
        return;
      }
    }
    else {
      setSignedUrl(null)
      setShowPopup(false);
    }

  };

  const footerContent = (
    <div>
      <Button
        label="Done"
        value={sign}
        icon="pi pi-check"
        onClick={() => handleSave()}
        autoFocus
      />
            {isView && (
        <Button
          label="Print"
          icon="pi pi-print"
          onClick={openPrint} 
          className="p-button-secondary"
        />
      )}
    </div>
  );

  const handleScroll = (e) => {
    if (!isView) {

      const dialogContent = e.target;
      const scrollTop = dialogContent.scrollTop;
      const scrollHeight = dialogContent.scrollHeight;
      const clientHeight = dialogContent.clientHeight;

      setShowFooter(true);
    }
  };

  const handleSign = (data) => {
    if (!isView) {

      setSign(data);
    }
  };

  const handleSignSave = (data) => {
    if (!isView) {

      if (data == null || !data) {
        if (!sign?.isEmpty()) {
          let dataUrl = sign?.getTrimmedCanvas().toDataURL("image/png");
          setSignedUrl(dataUrl);
          blobUrlToFile(dataUrl)
            .then((resFile: any) => {
              setDigSignFile(resFile);
              formik.setFieldValue("DigitalSignName", resFile.name);
              formik.setFieldValue("DigitalSignUrl", resFile.name);
            })
            .catch((err) => { });
          return;
        }
      }
    }
  };
useEffect(() => {
  console.log(signedUrl);
  
})
  const handleClear = () => {
    if (!isView) {

      sign.clear();
      setSignedUrl(null);
    }
  };

  return (
    <div className="card">
      <Dialog
        header="Terms and Condition"
        visible={showPopup}
        style={{ width: "97%" }}
        onHide={() => {
          if (!showPopup) return;
          handleSave();
          setShowPopup(false);
        }}
        footer={showFooter ? footerContent : null}
      >
        <div
          style={{
            width: "100%",
            margin: "auto",
            scrollbarWidth: "none",
          }}
        >
          <div
            className="dialog-content mb-5"
            onScroll={handleScroll}
            style={{
              overflowY: "auto",
              scrollbarWidth: "none",
            }}
          >
            <div  
              dangerouslySetInnerHTML={{ __html: TermsConditions?.Points }}
            ></div>
          </div>

          <div
            className={`${screenSized ? "flex-column" : ""
              } flex flex-row-reverse gap-5 justify-content-start`}
          >
            <div className="text-center">
              {signedUrl && signedUrl != null ? (
                <img
                  src={signedUrl}
                  style={{
                    minWidth: screenSized ? "275px" : "300px",
                    maxWidth: screenSized ? "275px" : "300px",
                    objectFit: "contain",
                  }}
                  height={"150px"}
                />
              ) : (
                <div
                  className="flex flex-column justify-content-center text-2xl text-center text-red-500"
                  style={{
                    maxWidth: screenSized ? "100%" : "300px",
                    minWidth: screenSized ? "275px" : "300px",
                    height: "150px",
                  }}
                >
                  No Signature Done
                </div>
              )}
              <div className="border-top-1 w-full text-center">
                <span className="text-2xl">Signature</span>
              </div>
            </div>
            {isView ? null :
              <div
                className="flex justify-content-end align-items-center flex-column "
                style={{ scrollbarWidth: "none" }}
              >
                <Signature
                  sign={sign}
                  setSign={setSign}
                  signedUrl={signedUrl}
                  handleSign={handleSign}
                  handleSignSave={handleSignSave}
                  handleClear={handleClear}
                  screenSized={screenSized}
                />
              </div>
            }

          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default TermsConditionPop;
