import { Button, Tooltip } from "@/assets/css/prime-library";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
const PhotoCapture = (props) => {
  const {
    onUpload,
    ImageUrl,
    isView,
    fldStyle,
    innerConStyle,
    innerCamStyle,
    isExternal,
    toast,
  } = props;
  const [showWebCam, setShowWebCam] = useState(false);
  const videoRef = useRef<any>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const capturedImageRef = useRef<HTMLImageElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const webcamRef = useRef(null);
  const [img, setImg] = useState(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImg(imageSrc);
  }, [webcamRef]);

  const videoConstraints = {
    width: 390,
    height: 390,
    facingMode: "user",
  };

  useEffect(() => {
    startCamera();
  }, []);

  const captureImage = () => {
    try {
      const imageSrc = videoRef.current.getScreenshot();
      if (imageSrc != null && imageSrc != "") {
        fetch(imageSrc)
          .then((res) => {
            return res.blob();
          })
          .then((blob) => {
            if (blob) {
              // Create a File object
              const capturedFile = new File(
                [blob],
                Math.random().toString(36).substring(2, 15) +
                  Math.random().toString(23).substring(2, 5) +
                  ".jpeg",
                {
                  type: "image/jpeg",
                }
              );
              // You can now use the capturedFile as a File object in your application
              onUpload(capturedFile);
              // Optional: Display the captured image

              // if (capturedImageRef.current) {
              //   capturedImageRef.current.src == ImageUrl ? ImageUrl : URL.createObjectURL(capturedFile);
              // }
            }
          });
      } else {
        startCamera()
        toast.current?.show({
          severity: "error",
          Title: "Error Message",
          summary:
            "Camera access is required. Please Enable Camera Permissions.",
        });
        return false;
      }
    } catch (err) {
      console.error("Error", err);
    }
  };

  const requestCameraAccess = async () => {
    try {
      // This will ask for camera permission
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      // setHasPermission(true);

      // Set the video stream to the video element
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      // setError(err.message);
    }
  };

  const stopCamera = async () => {
    let stream = videoRef.current.video.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach((track) => track.stop());

    videoRef.current.video.srcObject = null;
    videoRef.current.srcObject = null;
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        mediaStreamRef.current = stream; // Store the media stream reference
      }
      // if (isView) {
      //   // stopCamera();
      //   if (capturedImageRef.current) {
      //     capturedImageRef.current.src = ImageUrl;
      //   }
      // }
    } catch (error) {
      console.error("Error accessing the camera:", error);
    }
  };
  return (
    <>
      <div className={fldStyle}>
        <div
          className={
            isExternal == 0
              ? "grid"
              : "align-content-center flex-column-reverse grid"
          }
        >
          <div className={isExternal == 0 ? "col-6" : "col-8 mt-2"}>
            {!isView ? (
              <>
                <Webcam
                  mirrored
                  width={"100%"}
                  ref={videoRef}
                  screenshotQuality={1}
                  screenshotFormat="image/jpeg"
                />
                <canvas
                  ref={canvasRef}
                  className="w-full"
                  style={{ display: "none" }}
                />
                <>
                  <Tooltip target="Button" />
                  <Button
                    className="camera_action"
                    onClick={() => captureImage()}
                    aria-label="Capture Image"
                    severity="success"
                    iconPos="bottom"
                    style={{
                      marginTop: 10,
                      width: "30px",
                      height: "25px",
                    }}
                    icon="pi pi-stop-circle"
                    data-pr-tooltip={"Capture Image"}
                    data-pr-position="top"
                  />
                </>
              </>
            ) : null}
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
            <div
              className={
                ImageUrl.endsWith("no-img.png") ? "img-preview-container m-auto" : ""
              }
            >
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
    </>
  );
};

export default PhotoCapture;
// import { Button, Tooltip } from "@/assets/css/prime-library";
// import React, { useCallback, useEffect, useRef, useState } from "react";
// import Webcam from "react-webcam";
// const PhotoCapture = (props) => {
//   const { onUpload, ImageUrl, isView, cameraOff, setCameraOff } = props;
//   const [showWebCam, setShowWebCam] = useState(false);
//   const videoRef = useRef<any>(null);
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const capturedImageRef = useRef<HTMLImageElement>(null);
//   const mediaStreamRef = useRef<MediaStream | null>(null);

//

//   const startCamera = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//

//       if (videoRef.current) {
//
//         videoRef.current.srcObject = stream;
//         mediaStreamRef.current = stream; // Store the media stream reference
//       }
//       if (isView) {
//         stopCamera();
//         if (capturedImageRef.current) {
//           capturedImageRef.current.src = ImageUrl;
//         }
//       }
//     } catch (error) {
//       console.error("Error accessing the camera:", error);
//     }
//   };
//   // useEffect(() => {
//   //
//   //   cameraOff ? stopCamera() : startCamera();

//   //   return () => {
//   //   };
//   // }, [cameraOff]);

//   useEffect(() => {
//     startCamera();
//   }, []);

//   const captureImage = () => {
//     try {
//       stopCamera()
//       const imageSrc = videoRef.current.getScreenshot();
//       fetch(imageSrc)
//         .then((res) => {
//           return res.blob();
//         })
//         .then((blob) => {
//           if (blob) {
//             // Create a File object
//             const capturedFile = new File(
//               [blob],
//               Math.random().toString(36).substring(2, 15) +
//                 Math.random().toString(23).substring(2, 5) +
//                 ".jpeg",
//               {
//                 type: "image/jpeg",
//               }
//             );
//             // You can now use the capturedFile as a File object in your application
//             onUpload(capturedFile);
//             // Optional: Display the captured image

//             // if (capturedImageRef.current) {
//             //   capturedImageRef.current.src == ImageUrl ? ImageUrl : URL.createObjectURL(capturedFile);
//             // }
//           }
//         });
//     } catch (err) {
//       console.error("Error", err);
//     }
//   };
//   const stopCamera = () => {
//     // if (mediaStreamRef.current) {
//     //   mediaStreamRef.current.getTracks().forEach((track) => track.stop());
//     //   if (videoRef.current) {
//     //     videoRef.current.srcObject = null; // Clear the video source
//     //   }
//     // }

//     let stream = videoRef.current.video.srcObject;
//     const tracks = stream.getTracks();

//     tracks.forEach(track => track.stop());
//     videoRef.current.video.srcObject = null;
//   };
//   // const stopCamera = () => {
//   //   if (videoRef.current) {
//   //     const tracks = videoRef.current.getTracks();
//   //     tracks.forEach((track) => track.stop());
//   //     videoRef.current = null;
//   //   }
//   // };

//   return (
//     <>
//       <div className="col-12 md:col-3">
//         <div className="grid">
//           <div className="col-6 text-center">
//             {!isView ? (
//               <>
//                 <Webcam
//                   mirrored
//                   width={"100%"}
//                   ref={videoRef}
//                   screenshotQuality={1}
//                   screenshotFormat="image/jpeg"
//                 />
//                 <canvas
//                   ref={canvasRef}
//                   className="w-full"
//                   style={{ display: "none" }}
//                 />
//                 <>
//                   <Tooltip target="Button" />
//                   <Button
//                     className="camera_action"
//                     onClick={() => captureImage()}
//                     aria-label="Capture Image"
//                     severity="success"
//                     icon="pi pi-stop-circle"
//                     data-pr-tooltip={"Capture Image"}
//                     data-pr-position="top"
//                   />
//                 </>
//               </>
//             ) : null}
//           </div>
//           <div className="col-6 text-center">
//             <div className="img-preview-container">
//               <img
//                 className="w-full"
//                 ref={capturedImageRef}
//                 src={ImageUrl}
//                 alt="Captured"
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default PhotoCapture;
