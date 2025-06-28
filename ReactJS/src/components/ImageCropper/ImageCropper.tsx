import React, { useState, useRef, DependencyList, useEffect } from "react";

import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  Crop,
  PixelCrop,
  convertToPixelCrop,
} from "react-image-crop";
import { canvasPreview } from "./CanvasPreview";

export function useDebounceEffect(
  fn: () => void,
  waitTime: number,
  deps?: DependencyList
) {
  useEffect(() => {
    const t = setTimeout(() => {
      fn.apply(undefined, deps);
    }, waitTime);

    return () => {
      clearTimeout(t);
    };
  }, deps);
}

import "react-image-crop/dist/ReactCrop.css";
import { Button, Dialog, FileUpload } from "@/assets/css/prime-library";
export function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

export default function ImageCropper(props) {
  const {
    digitalSignDocRef,
    previewCanvasRef,
    chooseOptions,
    onSelectFile,
    AttachmentUrl,
    isView,
    handleClick,
    formik,
    ClearFileUpload,
    imgSrc,
    crop,
    setCrop,
    completedCrop,
    setCompletedCrop,
    DigitalSignUrl,
    aspect,
    imgRef,
    scale,
    rotate,
    onImageLoad,
    showCropper,
    setShowCropper,
    cropSave,
    onDownloadCropClick,
  } = props;

  return (
    <div className="App">
      <div className="Crop-Controls">
        {/* <input type="file" accept="image/*" onChange={onSelectFile} /> */}
        <label className="form-label">Digital Sign Upload</label>
        <div className="p-inputgroup">
          <div className="browse-links">
            <Button
              type="button"
              label={formik.values.DigitalSignName}
              link
              onClick={() => handleClick(DigitalSignUrl)}
            />
          </div>
          <FileUpload
            ref={digitalSignDocRef}
            mode="basic"
            chooseOptions={chooseOptions}
            uploadHandler={onSelectFile}
            chooseLabel={formik.values.DigitalSignName}
            customUpload
            auto
            accept="image/*,.pdf.docx"
            disabled={isView ? true : false}
          />
          <Button
            type="button"
            icon="las la-times"
            disabled={isView ? true : false}
            onClick={ClearFileUpload}
          />
        </div>
        {/* <div>
          <label htmlFor="scale-input">Scale: </label>
          <input
            id="scale-input"
            type="number"
            step="0.1"
            value={scale}
            disabled={!imgSrc}
            onChange={(e) => setScale(Number(e.target.value))}
          />
        </div>
        <div>
          <label htmlFor="rotate-input">Rotate: </label>
          <input
            id="rotate-input"
            type="number"
            value={rotate}
            disabled={!imgSrc}
            onChange={(e) =>
              setRotate(Math.min(180, Math.max(-180, Number(e.target.value))))
            }
          />
        </div>
        <div>
          <button onClick={handleToggleAspectClick}>
            Toggle aspect {aspect ? "off" : "on"}
          </button>
        </div> */}
      </div>
      <Dialog
        header="Image Cropper"
        footer={(props) => {
          return (
            <Button
              label="Crop"
              title="Crop"
              icon="pi pi-save"
              className="text-center"
              disabled={isView}
              onClick={() => onDownloadCropClick()}
            />
          );
        }}
        visible={showCropper}
        style={{
          width: "90%",
          maxWidth: 850,
          height: "90vh",
          maxHeight: "90vh",
        }}
        position="center"
        onHide={() => setShowCropper(false)}
        draggable={false}
      >
        <div className="align-content-center flex justify-content-center">
          {!!imgSrc && (
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              // aspect={aspect}
              // minWidth={400}
              // maxHeight={100}
              // circularCrop
            >
              <img
                ref={imgRef}
                alt="Crop me"
                src={imgSrc}
                style={{
                  transform: `scale(${scale}) rotate(${rotate}deg)`,
                  maxHeight: "400px",
                  minWidth: "400px",
                }}
                onLoad={onImageLoad}
              />
            </ReactCrop>
          )}
          {!!completedCrop && (
            <>
              <div>
                <canvas
                  ref={previewCanvasRef}
                  style={{
                    maxWidth: 350,
                    border: "1px solid black",
                    objectFit: "contain",
                    width:
                      completedCrop.width < 200
                        ? completedCrop.width + 200
                        : completedCrop.width,
                    height:
                      completedCrop.height < 200
                        ? completedCrop.height + 200
                        : completedCrop.height,
                    margin: "15px",
                    minHeight: 300,
                    minWidth: "350px",
                  }}
                />
                <div className="bg-blue-50 flex font-bold justify-content-center m-4 p-2">
                  Width - {Math.trunc(completedCrop.width)} / Height -{" "}
                  {Math.trunc(completedCrop.height)}
                </div>
              </div>
            </>
          )}
        </div>
      </Dialog>
    </div>
  );
}
