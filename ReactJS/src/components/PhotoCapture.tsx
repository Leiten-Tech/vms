import { Button, Tooltip } from "@/assets/css/prime-library";
import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";

const PhotoCapture = (props) => {
  const {
    onUpload,
    ImageUrl,
    isView,
    fldStyle,
    isExternal,
    toast,
  } = props;

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const capturedImageRef = useRef(null);

  const [orientationWarning, setOrientationWarning] = useState("");

  useEffect(() => {
    startCamera();
    // loadFaceModels();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          facingMode: "user",
        }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const loadFaceModels = async () => {
    // await faceapi.nets.tinyFaceDetector.load('/models/');
    // await faceapi.nets.faceLandmark68Net.load('/models/');
  };

  const rotateAndCorrectImage = async (imageDataUrl, callback) => {
    const img = new Image();
    img.onload = async function () {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const width = img.width;
      const height = img.height;

      // Set canvas to image size
      canvas.width = width;
      canvas.height = height;
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);

      const isValid = await detectFaceOrientation(img);
      if (!isValid) return;

      canvas.toBlob((blob) => {
        if (blob) {
          callback(blob);
        }
      }, "image/jpeg", 1); // 100% quality
    };
    img.src = imageDataUrl;
  };

  const detectFaceOrientation = async (imageEl) => {
    const detections = await faceapi
      .detectAllFaces(imageEl, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks();

    if (detections.length === 0) {
      setOrientationWarning("⚠️ No face detected.");
      resetWebcam();
      // return false;
    }

    if (detections.length > 1) {
      setOrientationWarning("⚠️ Multiple faces detected. Please ensure only one person is in the frame.");
      resetWebcam();
      return false;
    }

    const detection = detections[0];
    const landmarks = detection.landmarks;
    const leftEye = landmarks.getLeftEye();
    const rightEye = landmarks.getRightEye();

    const dx = rightEye[0].x - leftEye[0].x;
    const dy = rightEye[0].y - leftEye[0].y;
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

    if (Math.abs(angle) < 10) {
      setOrientationWarning("");
      return true;
    } else {
      setOrientationWarning("⚠️ Please hold the camera straight (Face is tilted).");
      resetWebcam();
      return false;
    }
  };

  const resetWebcam = () => {
    
      startCamera();
    
  };

  const captureImage = () => {
    try {
      const imageSrc = videoRef.current.getScreenshot();
      if (imageSrc) {
        rotateAndCorrectImage(imageSrc, (blob) => {
          const file = new File(
            [blob],
            `capture_${Date.now()}.jpeg`,
            { type: "image/jpeg" }
          );
          onUpload(file);
        });
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Camera access is required.",
        });
        startCamera();
      }
    } catch (err) {
      console.error("Capture error", err);
    }
  };

  return (
    <div className={fldStyle}>
      <div className={isExternal === 0 ? "grid" : "align-content-center flex-column-reverse grid"}>
        <div className={isExternal === 0 ? "col-6" : "col-12 mt-2"}>
          {!isView && (
            <>
              <Webcam
                mirrored
                ref={videoRef}
                screenshotFormat="image/jpeg"
                screenshotQuality={1}
                width="100%"
                videoConstraints={{
                  width: { ideal: 1920 },
                  height: { ideal: 1080 },
                  facingMode: "user"
                }}
              />
              <canvas
                ref={canvasRef}
                className="w-full"
                style={{ display: "none" }}
              />
              <Tooltip target="Button" />
              <Button
                className="camera_action"
                onClick={captureImage}
                aria-label="Capture Image"
                severity="success"
                iconPos="bottom"
                style={{ marginTop: 10, width: "30px", height: "25px" }}
                icon="pi pi-stop-circle"
                data-pr-tooltip="Capture Image"
              />
              {orientationWarning && (
                <div style={{ color: "red", marginTop: "10px" }}>{orientationWarning}</div>
              )}
            </>
          )}
        </div>
        <div
          className={
            ImageUrl.endsWith("no-img.png") && isExternal == 0
              ? "col-6"
              : isExternal == 1
              ? "col-6 m-auto"
              : "col-6"
          }
        >
          <div className={ImageUrl.endsWith("no-img.png") ? "img-preview-container m-auto" : ""}>
            <img
              className="w-full"
              ref={capturedImageRef}
              src={ImageUrl}
              alt="Captured"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoCapture;
