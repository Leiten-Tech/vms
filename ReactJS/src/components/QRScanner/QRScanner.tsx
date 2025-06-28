import React from "react";
import QrScanner from "qr-scanner";
import { useEffect, useRef, useState } from "react";
import "../QRScanner/QRScanner.css";

const QRScanner = (props) => {
  const { scanned, setScannedText, videoElementRef } = props;
  // const qrScanner = new QrScanner(videoElement, (result) =>
  //   console.log('decoded qr code:', result)
  // );

  return (
    <div>
      <div className="videoWrapper" id="video-container">
        <video className="qrVideo" ref={videoElementRef} />
      </div>
    </div>
  );
};

export default QRScanner;
