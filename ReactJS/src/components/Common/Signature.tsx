import React, { useRef, useState } from "react";

import SignatureCanvas from "react-signature-canvas";
import { Button } from "primereact/button";

const Signature = ({
  sign,
  setSign,
  handleSign,
  handleSignSave,
  handleClear,
  signedUrl,
  screenSized
}) => {
  return (
    <div className="flex gap-2 w-full justify-content-center flex-row-reverse flex-column">
      <div
        style={{ border: "1px solid black", width: "500", height: 150 }}
        className=""
      >
        <SignatureCanvas
          className="w-full"
          canvasProps={{ width: screenSized ? "275px" : "500", height: 150, className: "sigCanvas" }}
          ref={(data) => handleSign(data)}
        />
      </div>
      <span className="text-600 font-italic text-center">
        I Understand this is a legal Representation of my signature
      </span>
      <div className="flex flex-row-reverse gap-2 mt-2">
        <Button
          label="Clear"
          severity="secondary"
          className=""
          title="delete"
          icon="pi pi-eraser"
          onClick={() => handleClear()}
        />
        <Button
          label="Save"
          severity="info"
          className=""
          title="save"
          icon="pi pi-check"
          onClick={() => handleSignSave(null)}
        />
      </div>
    </div>
  );
};

export default Signature;
