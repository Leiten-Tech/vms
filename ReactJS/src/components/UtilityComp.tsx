import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Toast } from "primereact/toast";
import { hideToast } from "@/redux/slices/common/alertsSlice";
import { ProgressSpinner } from "primereact/progressspinner";
import { Dialog } from "primereact/dialog";
import { confirmDialog } from "primereact/confirmdialog";
import { Checkbox } from "@/assets/css/prime-library";
import { IMAGES } from "@/assets/images/Images";

export const VisCheckBox = (props) => {
  const { name, label, handleChange, value } = props;
  return (
    <>
      <div className={"col-12 md:col-3"} key={name}>
        <div className="flex align-items-center">
          <Checkbox
            inputId={name}
            name={name}
            checked={value}
            onChange={handleChange}
          />
          <label htmlFor={name} className="ml-2">
            {label}
          </label>
        </div>
      </div>
    </>
  );
};

export const NoResults = (props) => {
  const { text } = props;
  return (
    <div className="col-12 white select">
      <div className="widget-body">
        <div className="visitor-name text-overflow-ellipsis white-space-nowrap overflow-hidden">
          {text}
        </div>
      </div>
    </div>
  );
};

export const confirmation = (message, header, accept, reject) => {
  confirmDialog({
    message: message,
    header: header,
    rejectClassName: "p-button-danger",
    icon: "pi pi-exclamation-triangle",
    accept,
    reject,
  });
};

export const getSeverity = (status) => {
  switch (status) {
    case "Active":
      return "success";
    case "Inactive":
      return "warning";
    case "OUTOFSTOCK":
      return "danger";

    default:
      return null;
  }
};

export function AppProgressSpinner() {
  return (
    <div className="page-loader">
      <ProgressSpinner
        style={{ width: "50px", height: "50px" }}
        strokeWidth="3"
        fill="var(--surface-ground)"
        animationDuration=".5s"
      />
    </div>
  );
}

export function PoweredBy() {
  const [imageWidth, setImageWidth] = useState("100px"); // Default width
  const imageRef = useRef(null);

  useEffect(() => {
    const imgElement = imageRef.current;

    const updateImageSize = () => {
      if (imgElement) {
        setImageWidth(`${imgElement.naturalWidth}px`);
      }
    };

    if (imgElement && imgElement.complete) {
      updateImageSize();
    } else {
      imgElement.onload = updateImageSize;
    }

    return () => {
      if (imgElement) {
        imgElement.onload = null; 
      }
    };
  }, []);

  return (
    <div className="mb-1 mr-5 text-right">
      <div className="font-bold mb-1 text-gray-600">Powered By</div>
      <img
        src={IMAGES.LOGO_LG}
        alt={"Leiten Technologies Pvt Ltd."}
        ref={imageRef}
        style={{
          width: imageWidth,
          maxWidth: "100px"
        }}
      />
    </div>
  );
}

export const Instructions = () => {
  return (
    <div className="align-content-center flex flex-column justify-content-center pt-2 text-center">
      <h1 className="text-2xl" style={{ margin: "0px", marginBottom: "5px" }}>
        Instructions
      </h1>
      <div className="col-12">
        <div
          style={{
            maxWidth: "100%",
          }}
          className="m-auto"
        >
          <img
            src={IMAGES.INSTRUCTIONS}
            alt="Instructions"
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

const ToastComponent = () => {
  const dispatch = useDispatch();

  const { severity, summary, detail, life } = useSelector(
    (state: any) => state.alerts
  );

  const toastRef = useRef(null);

  const onHide = () => {
    dispatch(hideToast());
  };

  return (
    <Toast
      ref={toastRef}
      position="top-right"
      onHide={onHide}
      {...{ severity, summary, detail, life }}
    />
  );
};

export default ToastComponent;
