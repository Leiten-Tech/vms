import React, { useState, useEffect, useRef } from "react";
import { Link, useHistory } from "react-router-dom";

import { DocJPG, DocPDF, DocPNG, DocWord } from "@/assets/css/img-library";
import {
  Button,
  Calendar,
  Column,
  DataTable,
  Dialog,
  Dropdown,
  FileUpload,
  FilterMatchMode,
  InputText,
  Tooltip,
} from "@/assets/css/prime-library";
import { pageLoadScript } from "@/assets/js/common-utilities";
import FormFields from "@/components/FormFields";
import { VisitorEntryValidationSchema } from "@/validations/VisitorManagement";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import {
  create,
  update,
  createInit,
} from "@/redux/slices/WorkPermit/VendorRegSlice";
import {
  blobToURL,
  blobUrlToFile,
  fileToBlobURL,
  formConvertion,
  generateUniqueName,
  tLDS,
  urlToFile,
} from "@/utils/utilFunc";
import AppAlert from "@/alert/alert";
import { AppProgressSpinner } from "@/components/UtilityComp";
import { TabView, TabPanel } from "primereact/tabview";
import { WorkerDetails } from "@/components/Common/WorkerDetails";
import { setActiveTabs } from "@/redux/slices/visitorManagement/visitorentrySlice";

const CVendorRegistration = () => {
  const history = useHistory();
  const dispatch: any = useDispatch();

  const [visible, setVisible] = useState(false);
  const [workOrganisers, setWorkOrganisers] = useState([]);

  const [docPopVisible, setDocPopVisible] = useState<any>();
  const [currentDocinApproval, setCurrentDocinApproval] = useState<any>();
  const [compDocTypeList, setCompDocTypes] = useState<any>([]);

  const [vendorRegCompDocs, setVendorRegCompDocs] = useState([]);
  const [vrWorkerDocs, setVrWorkerDocs] = useState([]);
  const [VendorRegHeader, setVendorRegHeader] = useState<any>();

  // const [vrCompanyDetails, setVrCompanyDetails] = useState([]);

  // Company Docs
  const CompanyDocRef: any = useRef(null);

  const [companyTempDoc, setCompanyTempDoc] = useState<any>({});
  const [companyDocUrl, setCompanyDocUrl] = useState<any>("");
  const [companyDocs, setCompanyDocs] = useState<any>([]);
  const [companyDocsFiles, setCompanyDocsFiles] = useState([]);
  const [vrCompanyDocs, setVrCompanyDocs] = useState([]);
  const [workDocTypes, setWorkDocTypes] = useState([]);

  // Worker Docs
  const WorkerDocRef: any = useRef(null);

  const [workerDocs, setWorkerDocs] = useState([]);
  const [workerTempDocs, setWorkerTempDocs] = useState([]);

  const [vendorRegWorkers, setVendorRegWorkers] = useState([]);
  const [workerDocsFiles, setWorkerDocsFiles] = useState([]);
  const [vrWorkerDetails, setVrWorkerDetails] = useState([]);
  const [workerStatusList, setWorkerStatusList] = useState([]);
  const [vendorStatusList, setVendorStatusList] = useState([]);
  const [approvalConfigList, setApprovalConfigList] = useState([]);
  const [workerMode, setWorkerMode] = useState(true);

  const [previewDoc, setPreviewDoc] = useState<any>();
  const [isDisableSave, setIsdisableSave] = useState<any>();

  const [editGridData, setEditGridData] = useState<any>();
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeGridInd, setActiveGridInd] = useState(0);

  const [compMode, setCompMode] = useState(true);
  const [updatedindex, setupdatedindex] = useState<any>();
  const [workerupdatedindex, setworkerupdatedindex] = useState<any>();

  const toast = useRef<any>(null);
  const phonenumber = [{ Id: 1, CountryCode: "+91", CountryName: "India" }];

  // Worker Details
  const [workerDetailGrid, setWorkerDetailGrid] = useState();
  // Worker Details

  const {
    isCreate,
    isView,
    loading,
    error,
    tranStatus,
    createEditData,
    WorkOrganiser,
    CompanyDocs,
    WorkDocTypesSlice,
    WorkerStatusList,
  } = useSelector((state: any) => state.vendorReg);

  const vendorRegForm = {
    VendorRegId: createEditData ? createEditData.VendorRegId : 0,
    VendorRegCode: createEditData ? createEditData.VendorRegCode : "",
    VendorRegDate: createEditData
      ? new Date(createEditData.VendorRegDate)
      : new Date(),
    CompanyId: createEditData
      ? createEditData.CompanyId
      : localStorage["CompanyId"],
    PlantId: createEditData ? createEditData.PlantId : localStorage["PlantId"],
    GateId: createEditData ? createEditData.GateId : localStorage["GateId"],
    ValidFrom: createEditData ? createEditData.ValidFrom : "",
    ValidTo: createEditData ? createEditData.ValidTo : null,
    InsuranceValidFrom: createEditData ? createEditData.InsuranceValidFrom : "",
    InsuranceValidTo: createEditData ? createEditData.InsuranceValidTo : null,
    VendorName: createEditData ? createEditData.VendorName : "",
    // WorkOrganizer: createEditData ? createEditData.WorkOrganizer : "",
    // PoNo: createEditData ? createEditData.PoNo : "",
    StatusRemarks: createEditData ? createEditData.StatusRemarks : "",
    Status: createEditData ? createEditData.Status : 74,
    DocStatus: createEditData ? createEditData.DocStatus : 75,
    CreatedBy: createEditData
      ? createEditData.CreatedBy
      : +localStorage["UserId"],
    CreatedOn: createEditData
      ? tLDS(new Date(createEditData.CreatedOn))
      : tLDS(new Date()),
    ModifiedBy: createEditData ? +localStorage["UserId"] : null,
    ModifiedOn: createEditData ? tLDS(new Date()) : null,
  };

  const formik: any = useFormik({
    initialValues: {
      Remarks: "",
    },
    onSubmit: (values: any, { resetForm }) => {},
  });

  const vendorRegFormik: any = useFormik({
    initialValues: vendorRegForm,
    validationSchema: VisitorEntryValidationSchema,
    onSubmit: (values: any, { resetForm }) => {
      // if(!approvalConfigList || approvalConfigList.length == 0) {
      //   toast.current?.show({
      //     severity: "warn",
      //     summary: "Warning Message",
      //     detail: "Please Create Approval Configuration for Vendor Registration.",
      //   });
      //   return
      // }
      setIsdisableSave(true);

      let validatedVendorRegistration = validateVendorRegistration(values);
      if (validatedVendorRegistration) {
        let sendValues = { ...values };
        sendValues.ValidFrom = tLDS(values.VendorValidity[0]);
        sendValues.ValidTo = tLDS(values.VendorValidity[1]);
        sendValues.InsuranceValidFrom = tLDS(values.InsuranceValidity[0]);
        sendValues.InsuranceValidTo = tLDS(values.InsuranceValidity[1]);
        sendValues.VendorRegDate = tLDS(new Date());

        const vrWorkers = vrWorkerDetails.map((item) => ({
          ...item,
          ValidFrom: tLDS(item.ValidFrom),
          ValidTo: tLDS(item.ValidTo),
        }));

        delete sendValues.VendorValidity;
        delete sendValues.InsuranceValidity;
        delete sendValues.WorkerPhoneNo;
        delete sendValues.CompanyDocType;
        delete sendValues.CompanyDocNumber;
        delete sendValues.WorkerName;
        delete sendValues.CountryCode;
        delete sendValues.WorkerMailID;
        delete sendValues.WorkerStatus;
        delete sendValues.WorkerDocType;
        delete sendValues.WorkerDocNumber;

        let obj: any = {
          VendorReg: sendValues,
          VendorRegWorkers: vrWorkers,
          VendorRegCompanyDocs: vrCompanyDocs,
          // WorkerPermitWorkerDocs: vrWorkerDocs,
        };
        setIsdisableSave(false);
        console.log(obj);

        // let input: string = JSON.stringify(obj);
        // formData.append("input", input);
        // formData.append("companyFiles", companyDocsFiles);
        // formData.append("workerFiles", workerDocsFiles);

        let formDataObj = formConvertion(
          obj,
          companyDocsFiles,
          workerDocsFiles
        );
        if (isCreate) {
          var createRes = dispatch(create(formDataObj));
          createRes
            .then((res) => {
              if (res.payload.tranStatus.result == true) {
                setIsdisableSave(false);
                resetAllForm();
                toast.current?.show({
                  severity: "success",
                  summary: "Success Message",
                  detail: res.payload.tranStatus.lstErrorItem[0].Message,
                });
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
            });
        } else {
          var updateRes = dispatch(update(formDataObj));
          updateRes
            .then((res) => {
              if (res.payload.tranStatus.result == true) {
                setIsdisableSave(false);
                if (
                  currentDocinApproval &&
                  Object.keys(currentDocinApproval).length > 0
                ) {
                  toast.current?.show({
                    severity: "success",
                    summary: "Success Message",
                    detail: "Document Status Updated Successfully.",
                  });
                  const result = createInitService();
                  result.then((res) => {
                    setList(res);
                  });
                  setDocPopVisible(false);
                  setCurrentDocinApproval({});
                  return;
                } else {
                  setIsdisableSave(false);
                  resetAllForm();
                  setDocPopVisible(false);
                  setTimeout(() => {
                    history.push("/home/vVendorRegistration");
                  }, 800);
                  toast.current?.show({
                    severity: "success",
                    summary: "Success Message",
                    detail: res.payload.tranStatus.lstErrorItem[0].Message,
                  });
                }
              } else {
                toast.current?.show({
                  severity: "warn",
                  summary: "Warning Message",
                  detail: res.payload.tranStatus.lstErrorItem[0].Message,
                });
                setIsdisableSave(false);
                setDocPopVisible(false);
              }
            })
            .catch((error) => {
              setIsdisableSave(false);
            });
        }
      } else {
        setIsdisableSave(false);
      }
    },
  });

  const additionalIcon = (rowData, rowIndex, col) => {
    return (
      <div className="action-btn">
        {/* <React.Fragment>
          {pageConfig &&
            pageConfig.hasOwnProperty("tableAddActions") &&
            pageConfig?.tableAddActions.map((item) => {
              return (
                item.name === "is_incharge" && (
                  <div className="flex m-auto">
                    <Checkbox
                      inputId={"IsIncharge?"}
                      name={"IsIncharge?"}
                      checked={rowData.IsInCharge == 1 ? true : false}
                      onChange={(e) =>
                        handleInchargeChange(e, rowData, rowIndex, col)
                      }
                      disabled={false}
                    />
                    <label htmlFor={name} className="ml-2">
                      {label}
                    </label>
                  </div>
                )
              );
            })}
        </React.Fragment> */}
      </div>
    );
  };

  const loadContent: any = (rowData, rowIndex, col) => {
    // if (col.badge) {
    //   return statusBodyTemplate(rowData, col);
    // }
    if (col.action) {
      if (col.colOn === "is_incharge") {
        return additionalIcon(rowData, rowIndex, col);
      }
      if (col.colOn === "docs") {
        return filesWorkerContent(rowData);
      }
    }
    if (!col.badge || !col.action) {
      return <>{rowData[col.name]}</>;
    }
  };

  const [pageConfig, setPageConfig] = useState<any>({
    tableActionStyle: {
      textAlign: "center",
      minWidth: "7rem",
    },
    tableAction: true,
    tableColumns: [
      {
        title: "Worker Name",
        name: "WorkerName",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: { minWidth: "10rem" },
      },
      {
        title: "Worker Phone No",
        name: "WorkerPhoneNo",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: { minWidth: "16rem" },
      },
      {
        title: "Worker Mail ID",
        name: "WorkerMailID",
        sort: true,
        avatar: true,
        badge: false,
        colStyle: { minWidth: "6rem" },
      },
      {
        title: "Validity",
        name: "Validity",
        sort: true,
        avatar: false,
        badge: false,
        colOn: "validity",
        action: true,
        colStyle: { minWidth: "6rem" },
      },
      // {
      //   title: "Worker Docs",
      //   name: "WorkerDocs",
      //   sort: true,
      //   avatar: false,
      //   badge: false,
      //   action: true,
      //   colOn: "docs",
      //   colStyle: { minWidth: "6rem" },
      // },
      {
        title: "Worker Status",
        name: "WorkerStatus",
        sort: true,
        avatar: true,
        badge: false,
        colStyle: { minWidth: "6rem" },
      },
      // {
      //   title: "Is Incharge?",
      //   name: "IsIncharge",
      //   sort: true,
      //   avatar: false,
      //   badge: false,
      //   action: false,
      //   colOn: "is_incharge",
      //   colStyle: { minWidth: "2rem" },
      // },
    ],
    loadContent,
    tableAddActions: [
      {
        title: "Is InCharge?",
        name: "is_incharge",
        disabled: false,
        colOn: "is_incharge",
        id: "is_incharge",
      },
      {
        title: "Worker Docs",
        name: "docs",
        disabled: false,
        colOn: "docs",
        id: "docs",
      },
    ],
  });

  const validateVendorRegistration = (values) => {
    const emailRegExp = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    if (
      vendorRegFormik.values.VendorName == "" ||
      vendorRegFormik.values.VendorName == null
    ) {
      return toastValidation("Please Enter Vendor Name.");
    }
    // if (
    //   vendorRegFormik.values.WorkOrganizer == "" ||
    //   vendorRegFormik.values.WorkOrganizer == null
    // ) {
    //   return toastValidation("Please Select WorkOrganizer.");
    // }
    if (
      (vendorRegFormik.values.VendorValidity &&
        vendorRegFormik.values.VendorValidity == "") ||
      vendorRegFormik.values.VendorValidity == null
    ) {
      return toastValidation("Please Select Vendor Validity.");
    }
    if (
      !vendorRegFormik.values.hasOwnProperty("VendorValidity") ||
      !vendorRegFormik.values.VendorValidity ||
      vendorRegFormik.values.VendorValidity[0] == "" ||
      vendorRegFormik.values.VendorValidity[0] == null
    ) {
      return toastValidation("Please Select Vendor Validity From.");
    }
    if (
      !vendorRegFormik.values.hasOwnProperty("VendorValidity") ||
      !vendorRegFormik.values.VendorValidity ||
      vendorRegFormik.values.VendorValidity[1] == "" ||
      vendorRegFormik.values.VendorValidity[1] == null
    ) {
      return toastValidation("Please Select Vendor Validity To.");
    }
    if (
      (vendorRegFormik.values.InsuranceValidity &&
        vendorRegFormik.values.InsuranceValidity == "") ||
      vendorRegFormik.values.InsuranceValidity == null
    ) {
      return toastValidation("Please Select Insurance Validity.");
    }
    if (
      (vendorRegFormik.values.InsuranceValidity &&
        vendorRegFormik.values.InsuranceValidity[0] == "") ||
      vendorRegFormik.values.InsuranceValidity[0] == null
    ) {
      return toastValidation("Please Select Insurance Validity From.");
    }
    if (
      (vendorRegFormik.values.InsuranceValidity &&
        vendorRegFormik.values.InsuranceValidity[1] == "") ||
      vendorRegFormik.values.InsuranceValidity[1] == null
    ) {
      return toastValidation("Please Select Insurance Validity To.");
    }
    // if (
    //   vendorRegFormik.values.PoNo == "" ||
    //   vendorRegFormik.values.PoNo == null
    // ) {
    //   return toastValidation("Please Enter PoDoc RefNo.");
    // }
    if (companyDocsFiles && companyDocsFiles.length == 0) {
      return toastValidation("Please Enter Atleast One Company Document");
    }
    if (
      vrCompanyDocs &&
      vrCompanyDocs.length > 0 &&
      vrCompanyDocs.filter((item) => item.DocumentType == 115).length == 0
    ) {
      setActiveIndex(0);
      return toastValidation("Please Add Company Insurance Document");
    }
    // if (vrWorkerDetails && vrWorkerDetails.length == 0) {
    //   return toastValidation("Please Enter Atleast One Worker");
    // }
    return true;
  };

  const handleClick = (linkValue) => {
    window.open(linkValue, "_blank");
  };

  const approveDocument = (btn) => {
    if (
      btn == 1 &&
      formik.values.Remarks == null &&
      formik.values.Remarks == ""
    ) {
      return toastValidation("Please Enter Remarks");
    } else {
      let updatedVrWorkerDetails = [...vrWorkerDetails];
      let workerDetailIndex: any = updatedVrWorkerDetails.findIndex(
        (it) => it.VRWorkerDetailId == currentDocinApproval.VRWorkerDetailId
      );

      if (workerDetailIndex !== -1) {
        const vrWorkerDocs = [
          ...updatedVrWorkerDetails[workerDetailIndex].VrWorkerDocs,
        ];
        const docIndex = vrWorkerDocs.findIndex(
          (doc) => doc.VRWorkerDocId === currentDocinApproval.VRWorkerDocId
        );

        if (docIndex !== -1) {
          vrWorkerDocs[docIndex] = {
            ...vrWorkerDocs[docIndex],
            Status: btn == 0 ? 75 : 76,
            Remarks: formik.values.Remarks,
          };

          updatedVrWorkerDetails[workerDetailIndex] = {
            ...updatedVrWorkerDetails[workerDetailIndex],
            VrWorkerDocs: vrWorkerDocs,
          };
          setVrWorkerDetails(updatedVrWorkerDetails);
        }
      }
      let updatedVrWorkerDetails2 = [...updatedVrWorkerDetails];
      updatedVrWorkerDetails2.forEach((vrWorkerDoc2) => {
        if (
          vrWorkerDoc2.VrWorkerDocs.every(
            (docItemAllStatusCheck) => docItemAllStatusCheck.Status == 75
          )
        ) {
          vendorRegFormik.setFieldValue("DocStatus", 75);
        } else if (
          vrWorkerDoc2.VrWorkerDocs.some(
            (docItemAllStatusCheck) => docItemAllStatusCheck.Status == 76
          )
        ) {
          vendorRegFormik.setFieldValue("DocStatus", 76);
        } else if (
          vrWorkerDoc2.VrWorkerDocs.some(
            (docItemAllStatusCheck) => docItemAllStatusCheck.Status == 74
          )
        ) {
          vendorRegFormik.setFieldValue("DocStatus", 74);
        }
      });
      vendorRegFormik.handleSubmit();
    }
  };

  const onChangeWorkerDocType = (name, other, value) => {
    if (workerTempDocs && workerTempDocs.length > 0) {
      let foundDocType = workerTempDocs.find((d) => d.DocumentType == value);
      if (foundDocType) {
        return toastValidation(
          "Already Exists, Please Select Different Document Type."
        );
      } else {
        vendorRegFormik.setFieldValue(name, value);
      }
    } else {
      vendorRegFormik.setFieldValue(name, value);
    }
  };
  const onChangeCompanyDocType = (name, other, value) => {
    if (vrCompanyDocs && vrCompanyDocs.length > 0) {
      let foundDocType = vrCompanyDocs.find((d) => d.DocumentType == value);
      if (foundDocType) {
        return toastValidation(
          "Already Exists, Please Select Different Document Type."
        );
      } else {
        vendorRegFormik.setFieldValue(name, value);
      }
    } else {
      vendorRegFormik.setFieldValue(name, value);
    }
  };
  const footerContent = (
    <div>
      <Button
        label="Approve"
        icon="pi pi-check"
        onClick={() => approveDocument(0)}
        autoFocus
      />
      <Button
        label="Reject"
        icon="pi pi-times"
        onClick={() => approveDocument(1)}
        severity="danger"
      />
    </div>
  );
  const PrevfooterContent = (
    <div>
      {/* <Button
        label="Approve"
        icon="pi pi-check"
        onClick={() => approveDocument(0)}
        autoFocus
      /> */}
      <Button
        label="Cancel"
        icon="pi pi-times"
        onClick={() => setVisible(false)}
        severity="danger"
      />
    </div>
  );

  useEffect(() => {
    pageLoadScript();
  });

  useEffect(() => {
    handleSelect("WorkerPhoneNo", {}, "+91");
  }, []);

  const createInitService = () => {
    const data = {
      VendorRegId: createEditData.VendorRegId,
      PlantId: +localStorage["PlantId"],
      CompanyId: +localStorage["CompanyId"],
      UserId: +localStorage["UserId"],
    };
    const result = dispatch(createInit(data));
    return result;
  };

  useEffect(() => {
    if (createEditData != null) {
      if (isCreate == false) {
        const result = createInitService();
        result.then((res) => {
          setList(res);
        });
      }
    } else {
      const data = {
        VendorRegId: 0,
        PlantId: +localStorage["PlantId"],
        CompanyId: +localStorage["CompanyId"],
        UserId: +localStorage["UserId"],
      };
      const result = dispatch(createInit(data));
      result.then((res) => {
        vendorRegFormik.setFieldValue("WorkerStatus", 1);
        setCompDocTypes(res.payload.CompanyDocs);
        setWorkDocTypes(res.payload.WorkDocs);
        setWorkOrganisers(res.payload.WorkOrganiser);
        setWorkerStatusList(res.payload.WorkerStatusList);
        setVendorStatusList(res.payload.VendorStatusList);
        setApprovalConfigList(res.payload.ApprovalConfig);
      });
    }
  }, []);

  const loadDocName = (docTypeId) => {
    return compDocTypeList.filter((item) => item.MetaSubId == docTypeId)[0]
      .MetaSubDescription;
  };

  const setList = (res) => {
    setCompDocTypes(res.payload.CompanyDocs);
    setWorkDocTypes(res.payload.WorkDocs);
    setWorkOrganisers(res.payload.WorkOrganiser);
    setWorkerStatusList(res.payload.WorkerStatusList);
    handleSelect("WorkerStatus", {}, 1);
    setVendorStatusList(res.payload.VendorStatusList);
    setApprovalConfigList(res.payload.ApprovalConfig);
    setVrCompanyDocs(res.payload.VrCompanyDocDetail);
    setVendorRegHeader(res.payload.VendorRegHeader);
    vendorRegFormik.setFieldValue("VendorValidity", [
      new Date(res.payload.VendorRegHeader.ValidFrom),
      new Date(res.payload.VendorRegHeader.ValidTo),
    ]);
    if (
      res.payload.VendorRegHeader.InsuranceValidFrom != null &&
      res.payload.VendorRegHeader.InsuranceValidTo != null
    ) {
      vendorRegFormik.setFieldValue("InsuranceValidity", [
        new Date(res.payload.VendorRegHeader.InsuranceValidFrom),
        new Date(res.payload.VendorRegHeader.InsuranceValidTo),
      ]);
    } else {
      vendorRegFormik.setFieldValue("InsuranceValidity", []);
    }
    vendorRegFormik.setFieldValue("PoNo", res.payload.VendorRegHeader.PoNo);

    // workerDoc = { file: { ...event.files } };
    // if (vendorRegFormik.values.WorkerDocType) {
    //   workerDoc.WorkerDocType = workDocTypes.filter(
    //     (item) => item.MetaSubId == vendorRegFormik.values.WorkerDocType
    //   )[0].MetaSubDescription;
    // }
    // workerDoc.WorkerDocRefNo = vendorRegFormik.values.WorkerDocNumber;
    // workerDoc.FileName =
    //   event.files[0].lastModified + "_" + event.files[0].name;
    // workerDoc.FileBlobUrl = blobToURL(event.files[0]);

    let workerDtl = JSON.parse(JSON.stringify(res.payload.VrWorkerDetail));
    let workerDoc: any = {};
    const vrWorkerDocsTemp = [...res.payload.VrWorkerDocDetail];
    const promises = workerDtl.map(async (item, workInd) => {
      item.WorkerPhoneNo = item.MobileNo;
      item.WorkerMailID = item.MailId;
      item.ValidFrom =
        item.ValidFrom && item.ValidFrom != ""
          ? new Date(item.ValidFrom)
          : new Date(vendorRegFormik?.values?.ValidFrom);
      item.ValidTo =
        item.ValidTo && item.ValidTo != ""
          ? new Date(item.ValidTo)
          : new Date(vendorRegFormik?.values?.ValidTo);
      item.WpContractValidity =
        item.ValidFrom &&
        item.ValidFrom !== "" &&
        item.ValidTo &&
        item.ValidTo !== ""
          ? [new Date(item.ValidFrom), new Date(item.ValidTo)]
          : vendorRegFormik?.values?.VendorValidity;
      item.WorkerStatus = item.Status == 1 ? "Active" : "In Active";
      item.WorkerDocs = [];

      const docPromises = vrWorkerDocsTemp
        .filter((element) => item.VRWorkerDetailId === element.VRWorkerDetailId)
        .map(async (element) => {
          const docDtl = { ...element };
          docDtl.FileName = element.DocumentName;

          var resFile = null;
          if (element.DocumentFullUrl != null) {
            resFile = await urlToFile(element.DocumentFullUrl);
          }

          docDtl.file = resFile;
          docDtl.FileBlobUrl = fileToBlobURL(resFile);
          docDtl.file.FileName = element.DocumentName;
          docDtl.WorkerDocRefNo = element.DocumentNo;
          docDtl.DocTypeName = element.DocumentTypeName;
          docDtl.Workerindex = workInd;

          return docDtl;
        });

      item.WorkerDocs = await Promise.all(docPromises);
      return item;
    });

    Promise.all(promises).then((updatedWorkerDtl) => {
      const allWorkerDocs = updatedWorkerDtl.flatMap((item) =>
        item.WorkerDocs.map((doc) => doc.file)
      );

      const documentMap = new Map();

      // Populate document map
      res.payload.VrWorkerDocDetail.forEach((doc) => {
        const workerId = doc.VRWorkerDetailId;
        if (!documentMap.has(workerId)) {
          documentMap.set(workerId, []);
        }
        documentMap.get(workerId).push(doc);
      });

      const combinedList = res.payload.VrWorkerDetail.map((worker, index) => ({
        ...worker,
        VrWorkerDocs: (documentMap.get(worker.VRWorkerDetailId) || []).map(
          (doc) => ({
            ...doc,
            Workerindex: index,
          })
        ),
      }));
      setVrWorkerDetails(combinedList);
      setWorkerDocsFiles(allWorkerDocs);
      setVendorRegWorkers(updatedWorkerDtl);
      // const workerDocDetails = res.payload.VrWorkerDocDetail;

      // const filteredWorkerDetails = workerDocDetails.filter((workerDetail) => {
      //   return res.payload.VrWorkerDetail.some(
      //     (docDetail) =>
      //       docDetail.VRWorkerDetailId === workerDetail.VRWorkerDetailId
      //   );
      // });
      //
    });

    let companyDtl = JSON.parse(JSON.stringify(res.payload.VrCompanyDocDetail));
    const vrCompanyDocs = [...res.payload.VrCompanyDocDetail];

    const CompPromises = companyDtl.map(async (element) => {
      const docDtl = { ...element };
      docDtl.FileName = element.DocumentName;
      docDtl.DocumentTypeName = res.payload.CompanyDocs.filter(
        (item) => item.MetaSubId == element.DocumentType
      )[0].MetaSubDescription;

      const resFile = await urlToFile(element.DocumentFullUrl);
      docDtl.file = resFile;
      docDtl.FileBlobUrl = fileToBlobURL(resFile);
      docDtl.DocumentLink = docDtl.FileBlobUrl;

      docDtl.CompanyDocRefNo = element.DocumentNo;
      return docDtl;
    });

    Promise.all(CompPromises).then((updatedCompanyDtl) => {
      let allCompanyDocs = updatedCompanyDtl.map((item) => item.file);
      setCompanyDocsFiles(allCompanyDocs);
      setCompanyDocs(updatedCompanyDtl);
      setVrCompanyDocs(updatedCompanyDtl);
    });

    // const promisesCompanyDocs = companyDtl.map(async (item) => {
    // let companyDocsAll = Promise.all(docPromises);
    // item = await Promise.all(docPromises);
    // return item;
    // });
    //     let compDoc: any = {};
    //     compDoc = { file: { ...event.files[0] } };

    //
    //

    //     if (vendorRegFormik.values.CompanyDocType) {
    //       compDoc.CompanyDocType = compDocTypeList.filter(
    //         (item) => item.MetaSubId == vendorRegFormik.values.CompanyDocType
    //       )[0].MetaSubDescription;
    //     }
    // +
    //     compDoc.CompanyDocRefNo = vendorRegFormik.values.CompanyDocNumber;
    //     compDoc.FileName = event.files[0].lastModified + "_" + event.files[0].name;
    // setVendorRegWorkers([
    //   ...vendorRegWorkers,
    //   {
    //     WorkerName: res.payload.VendorRegHeader.WorkerName,
    //     WorkerPhoneNo: res.payload.VendorRegHeader.CountryCode,
    //     WorkerMailID: res.payload.VendorRegHeader.WorkerMailID,
    //     WorkerStatus: res.payload.VendorRegHeader.WorkerStatus
    //       ? "Active"
    //       : "In Active",
    //     WorkerDocs: workerDocs,
    //   },
    // ]);
  };
  useEffect(() => {}, [
    vrWorkerDetails,
    vendorRegWorkers,
    workerDocs,
    workerDocsFiles,
  ]);

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let _filters = { ...filters };

    // @ts-ignore
    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };
  const [globalFilterValue, setGlobalFilterValue] = useState<string>("");
  const renderHeader = () => {
    return (
      <div className="flex justify-content-start">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Keyword Search"
          />
        </span>
      </div>
    );
  };
  const header = renderHeader();
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  function navigateTo(url: string) {
    history.push(url);
  }
  const itemTemplate = () => {
    return (
      <div className="flex align-items-center flex-column">
        <i
          className="pi pi-image mt-3 p-5"
          style={{
            fontSize: "5em",
            borderRadius: "50%",
            backgroundColor: "var(--surface-b)",
            color: "var(--surface-d)",
          }}
        ></i>
        <span
          style={{ fontSize: "1.2em", color: "var(--text-color-secondary)" }}
          className="my-5"
        >
          Drag and Drop Image Here
        </span>
      </div>
    );
  };

  const chooseOptions = { icon: "las la-upload", iconOnly: true };
  const customOptions = { icon: "las la-camera-retro", iconOnly: true };
  const docUpload = { icon: "las la-cloud-upload-alt" };

  const handleChange = (event) => {
    vendorRegFormik.setFieldValue(event.target.name, event.value);
    var validto;
    if (event?.value[1] != null) {
      validto = new Date(
        event?.value[1].getFullYear(),
        event?.value[1].getMonth(),
        event?.value[1].getDate()
      );
      validto.setHours(23, 59, 59, 999);
    } else {
      validto = event?.value[1];
    }

    if (event.target.name == "VendorValidity") {
      vrWorkerDetails.map((vendItem) => {
        (vendItem.ValidFrom = event?.value[0]),
          (vendItem.ValidTo = validto),
          (vendItem.WpContractValidity = [event?.value[0], validto]);
      });
      vendorRegWorkers.map((vendItem) => {
        (vendItem.ValidFrom = event?.value[0]),
          (vendItem.ValidTo = validto),
          (vendItem.WpContractValidity = [event?.value[0], validto]);
      });
      vendorRegFormik.setFieldValue("WpContractValidity", [
        event?.value[0],
        validto,
      ]);
    }
  };
  const handleInsVal = (event) => {
    vendorRegFormik.setFieldValue(event.target.name, event.value);
    var validto;
    validto = new Date(
      event?.value[1].getFullYear(),
      event?.value[1].getMonth(),
      event?.value[1].getDate()
    );
    vendorRegFormik.setFieldValue("VendorValidity", [event?.value[0], validto]);
  };

  const handleSelect = (name, other, value) => {
    vendorRegFormik.setFieldValue(name, value);
  };
  const handlePhoneNo = (event, value) => {
    //   setVrWorkerDocs((prevItem) =>
    //   prevItem.map((item) =>
    //     item.Workerindex === workerupdatedindex
    //       ? { ...item, WorkerPhoneNo: event?.target?.value }
    //       : item
    //   )
    // );
  };

  const fileValidate = (file, type) => {
    let fileTypes = [
      ".csv",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];
    if (fileTypes.includes(file.type)) {
      if (type == 1) {
        CompanyDocRef?.current.clear();
      } else {
        WorkerDocRef?.current.clear();
      }
      return toastValidation("Please Select Valid Files Pdf or Png, Jpeg");
    }
    let fileTypesValid = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "application/pdf",
    ];
    if (!fileTypesValid.includes(file.type)) {
      if (type == 1) {
        CompanyDocRef?.current.clear();
      } else {
        WorkerDocRef?.current.clear();
      }
      return toastValidation("Please Select Valid Files Pdf or Png, Jpeg");
    }
    return true;
  };

  // const compDocUp = (event) => {
  //   if (event.files[0]) {
  //     const validatedFile: any = fileValidate(event.files[0], 1);
  //     if (validatedFile) {
  //       let compDoc: any = {};
  //       let compDocsDetail: any = {};

  //       compDoc = { file: event.files[0] };

  //       if (vendorRegFormik.values.CompanyDocType) {
  //         compDoc.CompanyDocType = compDocTypeList.filter(
  //           (item) => item.MetaSubId == vendorRegFormik.values.CompanyDocType
  //         )[0].MetaSubDescription;
  //       }
  //       compDoc.CompanyDocRefNo = vendorRegFormik.values.CompanyDocNumber;
  //       compDoc.FileName =
  //         event.files[0].lastModified + "_" + event.files[0].name;
  //       compDoc.FileBlobUrl = blobToURL(event.files[0]);

  //       compDocsDetail.CompanyId = +localStorage["CompanyId"];
  //       compDocsDetail.PlantId = +localStorage["PlantId"];
  //       compDocsDetail.GateId = +localStorage["GateId"];
  //       compDocsDetail.VRCompanyDocId = 0;
  //       compDocsDetail.VendorRegId = 0;
  //       compDocsDetail.DocumentType = vendorRegFormik.values.CompanyDocType;
  //       compDocsDetail.DocumentName =
  //         event.files[0].lastModified + "_" + event.files[0].name;
  //       compDocsDetail.DocumentNo = vendorRegFormik.values.CompanyDocNumber;
  //       compDocsDetail.DocumentUrl =
  //         event.files[0].lastModified + "_" + event.files[0].name;
  //       compDocsDetail.Remarks = "";

  //       setCompanyDocUrl(compDoc.FileBlobUrl);
  //       setCompanyDocs([...companyDocs, compDoc]);
  //       compDoc.file.FileName = compDoc.FileName;
  //       setCompanyDocsFiles([...companyDocsFiles, compDoc.file]);
  //       setVrCompanyDocs([...vrCompanyDocs, compDocsDetail]);

  //       vendorRegFormik.setFieldValue("CompanyDocType", []);
  //       vendorRegFormik.setFieldValue("CompanyDocNumber", "");
  //       CompanyDocRef?.current?.clear();
  //     }
  //   } else {
  //     return toastValidation("Please Select Valid Files Pdf or Png, Jpeg");
  //   }
  // };

  const compDocUploader = (event) => {
    const validatedFile: any = fileValidate(event.files[0], 1);

    if (validatedFile) {
      let compDoc: any = {};
      compDoc = { file: event.files[0] };

      if (vendorRegFormik.values.CompanyDocType) {
        compDoc.CompanyDocTypeName = compDocTypeList.filter(
          (item) => item.MetaSubId == vendorRegFormik.values.CompanyDocType
        )[0].MetaSubDescription;
        compDoc.CompanyDocType = vendorRegFormik.values.CompanyDocType;
      }
      compDoc.CompanyDocRefNo = vendorRegFormik.values.CompanyDocNumber;
      compDoc.FileName = generateUniqueName(event.files[0]);
      compDoc.FileBlobUrl = blobToURL(event.files[0]);
      setCompanyTempDoc({
        ...compDoc,
        DocumentName: event.files[0].name,
        DocumentLink: blobToURL(event.files[0]),
      });
      setCompanyDocUrl(compDoc.FileBlobUrl);
      // setCompanyDocs([...companyDocs, compDoc]);
    }
  };

  const compValidCheck = () => {
    if (
      vendorRegFormik.values.CompanyDocType == null ||
      vendorRegFormik.values.CompanyDocType == ""
    ) {
      return toastValidation("Please Select Company Document Type.");
    }
    if (
      vendorRegFormik.values.CompanyDocNumber == null ||
      vendorRegFormik.values.CompanyDocNumber == ""
    ) {
      return toastValidation("Please Select Company Document No.");
    }
    if (
      !companyTempDoc ||
      companyTempDoc == null ||
      companyTempDoc == "" ||
      !Object.keys(companyTempDoc).length
    ) {
      return toastValidation("Please Upload Company Document.");
    }
    return true;
  };

  const clearCompDoc = () => {
    vendorRegFormik.setFieldValue("CompanyDocType", null);
    vendorRegFormik.setFieldValue("CompanyDocNumber", "");
    setCompMode(true);
    ClearFileUpload();
  };

  const loadCompValue = (rowData, colItem) => {
    vendorRegFormik.setFieldValue("CompanyDocType", rowData.DocumentType);
    vendorRegFormik.setFieldValue("CompanyDocNumber", rowData.DocumentNo);
    blobUrlToFile(rowData?.DocumentLink)
      .then((resFile) => {
        setCompanyTempDoc({
          file: resFile,
          DocumentName: splitName(rowData?.DocumentName),
          DocumentLink: rowData?.DocumentLink,
        });
        setCompanyDocUrl(rowData?.DocumentLink);
      })
      .catch((err) => {});
  };

  const editCompDoc = (rowData, colItem) => {
    setupdatedindex(colItem.rowIndex);
    setCompMode(false);
    loadCompValue(rowData, colItem);
  };

  const findDocumentIndex = (docs, docToFind) => {
    return docs.findIndex((doc) => doc.DocumentType === docToFind.DocumentType);
  };
  const addCompDoc = () => {
    const compValid = !compMode ? true : compValidCheck();

    if (compValid) {
      let compDoc: any = {};
      let compDocsDetail: any = {};
      compDoc = { file: companyTempDoc };

      if (vendorRegFormik.values.CompanyDocType) {
        compDoc.CompanyDocTypeName = compDocTypeList.filter(
          (item) => item.MetaSubId == vendorRegFormik.values.CompanyDocType
        )[0].MetaSubDescription;
      }
      compDoc.CompanyDocType = vendorRegFormik.values.CompanyDocType;
      compDoc.CompanyDocRefNo = vendorRegFormik.values.CompanyDocNumber;
      compDoc.DocumentName =
        companyTempDoc?.file?.lastModified + "_" + companyTempDoc?.file?.name;
      compDoc.FileName =
        companyTempDoc?.file?.lastModified + "_" + companyTempDoc?.file?.name;
      compDoc.FileBlobUrl = blobToURL(companyDocs);
      compDoc.file.file.FileName = compDoc.FileName;

      compDocsDetail.CompanyId = +localStorage["CompanyId"];
      compDocsDetail.PlantId = +localStorage["PlantId"];
      compDocsDetail.GateId = +localStorage["GateId"];
      compDocsDetail.VRCompanyDocId = 0;
      compDocsDetail.VendorRegId = 0;
      compDocsDetail.DocumentLink = companyTempDoc?.DocumentLink;
      compDocsDetail.DocumentName =
        companyTempDoc?.file?.lastModified + "_" + companyTempDoc?.DocumentName;
      compDocsDetail.DocumentUrl =
        companyTempDoc?.file?.lastModified + "_" + companyTempDoc?.DocumentName;
      compDocsDetail.FileName =
        companyTempDoc?.file?.lastModified + "_" + companyTempDoc?.DocumentName;
      if (vendorRegFormik.values.CompanyDocType) {
        compDocsDetail.DocumentType = vendorRegFormik.values.CompanyDocType;
        compDocsDetail.DocumentTypeName = compDocTypeList.filter(
          (item) => item.MetaSubId == vendorRegFormik.values.CompanyDocType
        )[0].MetaSubDescription;
      }
      compDocsDetail.DocumentNo = vendorRegFormik.values.CompanyDocNumber;
      compDocsDetail.Remarks = "";
      compDocsDetail.Status = 75;

      if (compMode) {
        setCompanyDocs([...companyDocs, compDoc]);
        setCompanyDocsFiles([...companyDocsFiles, compDoc?.file?.file]);
        setVrCompanyDocs([...vrCompanyDocs, compDocsDetail]);
      } else {
        // const indexToUpdate = findDocumentIndex(vrCompanyDocs, compDocsDetail);
        const indexToUpdate = updatedindex;

        if (indexToUpdate !== -1) {
          const updatedCompanyDocs = [...companyDocs];
          const updatedCompanyDocsFiles = [...companyDocsFiles];
          const updatedVrCompanyDocs = [...vrCompanyDocs];

          updatedCompanyDocs[indexToUpdate] = compDoc;
          updatedCompanyDocsFiles[indexToUpdate] = compDoc?.file?.file;
          updatedVrCompanyDocs[indexToUpdate] = compDocsDetail;

          setCompanyDocs(updatedCompanyDocs);
          setCompanyDocsFiles(updatedCompanyDocsFiles);
          setVrCompanyDocs(updatedVrCompanyDocs);
        }
      }

      // setCompanyDocs([...companyDocs, compDoc]);
      // setCompanyDocsFiles([...companyDocsFiles, compDoc?.file?.file]);
      // setVrCompanyDocs([...vrCompanyDocs, compDocsDetail]);

      clearCompDoc();
    }
  };
  var generatedWorkerIndex = null;
  const getNextWorkerIndex = (ind) => {
    if (vrWorkerDetails.length === 0) {
      return 0;
    }
    if (generatedWorkerIndex !== null) {
      return generatedWorkerIndex;
    }

    const workerIndices = new Set(
      vrWorkerDetails.flatMap((detail) =>
        detail.VrWorkerDocs.map((doc) => doc.Workerindex)
      )
    );

    const maxIndex = Math.max(...workerIndices);
    generatedWorkerIndex = maxIndex + 1;

    return generatedWorkerIndex;
  };

  const workerDocUpload = (event) => {
    if (event.files[0]) {
      const validatedFile: any = fileValidate(event.files[0], 0);
      if (validatedFile) {
        let workerDoc: any = {};
        let workerDocsDetail: any = {};

        workerDoc = { file: event.files[0] };
        var currentFileName = generateUniqueName(event.files[0]);
        var currWorkerInd = workerMode
          ? getNextWorkerIndex(activeGridInd)
          : activeGridInd;

        if (vendorRegFormik.values.WorkerDocType) {
          workerDoc.WorkerDocTypeName = workDocTypes.filter(
            (item) => item.MetaSubId == vendorRegFormik.values.WorkerDocType
          )[0].MetaSubDescription;
        }

        workerDoc.CompanyId = +localStorage["CompanyId"];
        workerDoc.PlantId = +localStorage["PlantId"];
        workerDoc.GateId = +localStorage["GateId"];
        workerDoc.DocumentType = vendorRegFormik.values.WorkerDocType;
        workerDoc.WorkerDocRefNo = vendorRegFormik.values.WorkerDocNumber;
        workerDoc.DocumentNo = vendorRegFormik.values.WorkerDocNumber;
        workerDoc.DocTypeName = workDocTypes.filter(
          (item) => item.MetaSubId == vendorRegFormik.values.WorkerDocType
        )[0].MetaSubDescription;
        workerDoc.DocumentName = currentFileName;
        workerDoc.DocumentUrl = currentFileName;
        workerDoc.FileName = currentFileName;
        workerDoc.FileBlobUrl = blobToURL(event.files[0]);
        workerDoc.Status = 75;
        workerDoc.Workerindex = currWorkerInd;

        workerDocsDetail.CompanyId = +localStorage["CompanyId"];
        workerDocsDetail.PlantId = +localStorage["PlantId"];
        workerDocsDetail.GateId = +localStorage["GateId"];
        workerDocsDetail.VRCompanyDocId = 0;
        workerDocsDetail.VRWorkerDetailId = 0;
        workerDocsDetail.DocumentName = currentFileName;
        workerDocsDetail.FileName = currentFileName;
        workerDocsDetail.DocumentNo = vendorRegFormik.values.WorkerDocNumber;
        workerDocsDetail.DocumentUrl = currentFileName;
        workerDocsDetail.DocTypeName = workDocTypes.filter(
          (item) => item.MetaSubId == vendorRegFormik.values.WorkerDocType
        )[0].MetaSubDescription;
        workerDocsDetail.DocumentType = vendorRegFormik.values.WorkerDocType;
        workerDocsDetail.Remarks = "";
        workerDocsDetail.Status = 75;
        workerDocsDetail.file = event.files[0];
        workerDocsDetail.Workerindex = currWorkerInd;

        setWorkerDocs([...workerDocs, workerDoc]);
        setWorkerTempDocs([...workerTempDocs, workerDoc]);
        workerDoc.file.FileName = workerDoc.FileName;
        workerDocsDetail.file.FileName = workerDocsDetail.FileName;
        setWorkerDocsFiles([...workerDocsFiles, workerDoc.file]);
        setVrWorkerDocs([...vrWorkerDocs, workerDocsDetail]);

        // vendorRegFormik.setFieldValue("WorkerDocType", []);
        // vendorRegFormik.setFieldValue("WorkerDocNumber", "");
        clearWorkerDoc();
      }
    } else {
      return toastValidation("Please Select Valid Files Pdf or Png, Jpeg");
    }
  };

  const resetWorker = () => {
    vendorRegFormik.setFieldValue("WorkerName", "");
    vendorRegFormik.setFieldValue("CountryCode", "");
    vendorRegFormik.setFieldValue("WorkerMailID", "");
    vendorRegFormik.setFieldValue("WorkerStatus", 1);
    vendorRegFormik.setFieldValue("WpContractValidity", null);

    vendorRegFormik.setFieldValue("WorkerDocType", null);
    vendorRegFormik.setFieldValue("WorkerDocNumber", "");

    setVrWorkerDocs([]);
    // setVrWorkerDetails([]);
    setWorkerDocs([]);
    setWorkerTempDocs([]);
    setWorkerDocsFiles([]);
    clearWorkerDoc();
    setWorkerMode(true);
  };

  const addWorker = () => {
    let validated: any = validateGridWorkers();
    if (validated) {
      if (workerMode) {
        setVendorRegWorkers([
          ...vendorRegWorkers,
          {
            WorkerName: vendorRegFormik.values.WorkerName,
            WpContractValidity: vendorRegFormik?.values?.WpContractValidity,
            ValidFrom: vendorRegFormik?.values?.WpContractValidity[0],
            ValidTo: vendorRegFormik?.values?.WpContractValidity[1],
            WorkerPhoneNo: vendorRegFormik.values.CountryCode,
            WorkerMailID: vendorRegFormik.values.WorkerMailID,
            WorkerStatus:
              vendorRegFormik.values.WorkerStatus == 1 ? "Active" : "In Active",
            WorkerDocs: workerTempDocs,
          },
        ]);
        const currInd = workerTempDocs.map((doc) => doc.Workerindex)[0];
        setVrWorkerDetails([
          ...vrWorkerDetails,
          {
            VRWorkerDetailId: 0,
            VendorRegId: 0,
            WpContractValidity: vendorRegFormik?.values?.WpContractValidity,
            ValidFrom: vendorRegFormik.values.WpContractValidity[0],
            ValidTo: vendorRegFormik.values.WpContractValidity[1],
            WorkerName: vendorRegFormik.values.WorkerName,
            MobileNo: vendorRegFormik.values.CountryCode,
            MailId: vendorRegFormik.values.WorkerMailID,
            Status: vendorRegFormik.values.WorkerStatus,
            VrWorkerDocs: vrWorkerDocs.filter(
              (vrItem) => vrItem.Workerindex == currInd
            ),
          },
        ]);
      } else {
        let combinedArray = [];
        if (vrWorkerDocs && vrWorkerDocs.length > 0) {
          workerDocs.forEach((docItem, docIndex) => {
            const matchingVrItem = vrWorkerDocs.find((vrItem, vrIndex) => {
              return (
                docItem.Workerindex === vrItem.Workerindex &&
                docItem.DocumentType === vrItem.DocumentType &&
                (vrItem.FileName === docItem.FileName ||
                  vrItem.DocumentName === docItem.DocumentName)
                // vrItem.WorkerPhoneNo === docItem.WorkerPhoneNo &&
              );
            });

            if (matchingVrItem) {
              combinedArray.push({
                ...docItem,
                ...matchingVrItem,
              });
            } else {
              combinedArray.push({ ...docItem });
            }
          });
        } else {
          combinedArray = [...workerTempDocs];
        }

        let tempWorkerDocs = [...combinedArray];

        if (editGridData) {
          let tempVendorRegWork = [...vendorRegWorkers];
          // const venRegInd = tempVendorRegWork.findIndex(
          //   (vItem, index) => index == workerupdatedindex
          // );
          const venRegInd = activeGridInd;

          const updateVendReg = tempVendorRegWork[venRegInd];

          updateVendReg.WorkerName = vendorRegFormik.values.WorkerName;
          updateVendReg.WorkerPhoneNo = vendorRegFormik.values.CountryCode;
          updateVendReg.WorkerMailID = vendorRegFormik.values.WorkerMailID;
          updateVendReg.WpContractValidity =
            vendorRegFormik?.values?.WpContractValidity;
          updateVendReg.ValidFrom =
            vendorRegFormik?.values?.WpContractValidity[0];
          updateVendReg.ValidTo =
            vendorRegFormik?.values?.WpContractValidity[1];
          updateVendReg.WorkerStatus =
            vendorRegFormik.values.WorkerStatus == 1 ? "Active" : "In Active";
          updateVendReg.WorkerDocs = [];
          updateVendReg.WorkerDocs = tempWorkerDocs;

          delete editGridData.WorkerDocs;
          editGridData.WorkerName = vendorRegFormik.values.WorkerName;
          editGridData.WorkerPhoneNo = vendorRegFormik.values.CountryCode;
          editGridData.WorkerMailID = vendorRegFormik.values.WorkerMailID;
          editGridData.WpContractValidity =
            vendorRegFormik?.values?.WpContractValidity;
          editGridData.ValidFrom =
            vendorRegFormik?.values?.WpContractValidity[0];
          editGridData.ValidTo = vendorRegFormik?.values?.WpContractValidity[1];
          editGridData.WorkerStatus =
            vendorRegFormik.values.WorkerStatus == 1 ? "Active" : "In Active";
          editGridData.WorkerDocs = [];
          editGridData.WorkerDocs = tempWorkerDocs;

          setVendorRegWorkers(tempVendorRegWork);

          let updatedVrWorkerDetails = [...vrWorkerDetails];

          const indexToUpdate = activeGridInd;

          // const indexToUpdate = updatedVrWorkerDetails.findIndex(
          //   (item, index) => index == workerupdatedindex
          // );
          let itemUpdateToDateDocs = [...tempWorkerDocs];
          // itemUpdateToDateDocs.forEach((itemDel: any) => {
          //   delete itemDel.file;
          // });
          if (indexToUpdate !== -1) {
            const itemToUpdate = updatedVrWorkerDetails[indexToUpdate];
            // const newVrWorkerDetails = [...updatedVrWorkerDetails];
            if (itemToUpdate) {
              itemToUpdate.WorkerName = vendorRegFormik.values.WorkerName;
              itemToUpdate.MobileNo = vendorRegFormik.values.CountryCode;
              itemToUpdate.MailId = vendorRegFormik.values.WorkerMailID;
              itemToUpdate.Status = vendorRegFormik.values.WorkerStatus;
              itemToUpdate.WpContractValidity =
                vendorRegFormik.values.WpContractValidity;
              itemToUpdate.ValidFrom =
                vendorRegFormik.values.WpContractValidity[0];
              itemToUpdate.ValidTo =
                vendorRegFormik.values.WpContractValidity[1];
              itemToUpdate.VrWorkerDocs = [...itemUpdateToDateDocs];
              setVrWorkerDetails(updatedVrWorkerDetails);
            }
            // const itemToUpdate = updatedVrWorkerDetails[indexToUpdate];
            // itemToUpdate.WorkerName = vendorRegFormik.values.WorkerName;
            // itemToUpdate.MobileNo = vendorRegFormik.values.CountryCode;
            // itemToUpdate.MailId = vendorRegFormik.values.WorkerMailID;
            // itemToUpdate.Status = vendorRegFormik.values.WorkerStatus;
            // itemToUpdate.VrWorkerDocs = [];
            // itemToUpdate.VrWorkerDocs = itemUpdateToDateDocs;
            // setVrWorkerDetails(updatedVrWorkerDetails);
          } else {
            const newUpdatedVrWorkerDetails = [
              ...updatedVrWorkerDetails,
              { ...editGridData, VrWorkerDocs: editGridData.WorkerDocs },
            ];

            setVrWorkerDetails(newUpdatedVrWorkerDetails);
            // let newupdatedVrWorkerDetails = updatedVrWorkerDetails;
            // editGridData.VrWorkerDocs = editGridData.WorkerDocs;
            // newupdatedVrWorkerDetails.push(editGridData);
            // setVrWorkerDetails(newupdatedVrWorkerDetails);
          }
        } else {
          setVendorRegWorkers([
            ...vendorRegWorkers,
            {
              WorkerName: vendorRegFormik.values.WorkerName,
              WpContractValidity: vendorRegFormik.values.WpContractValidity,
              ValidFrom: vendorRegFormik.values.WpContractValidity[0],
              ValidTo: vendorRegFormik.values.WpContractValidity[1],
              WorkerPhoneNo: vendorRegFormik.values.CountryCode,
              WorkerMailID: vendorRegFormik.values.WorkerMailID,
              WorkerStatus:
                vendorRegFormik.values.WorkerStatus == 1
                  ? "Active"
                  : "In Active",
              WorkerDocs: workerDocs,
            },
          ]);
          setVrWorkerDetails([
            ...vrWorkerDetails,
            {
              VRWorkerDetailId: 0,
              VendorRegId: 0,
              WorkerName: vendorRegFormik.values.WorkerName,
              WpContractValidity: vendorRegFormik.values.WpContractValidity,
              ValidFrom: vendorRegFormik.values.WpContractValidity[0],
              ValidTo: vendorRegFormik.values.WpContractValidity[1],
              MobileNo: vendorRegFormik.values.CountryCode,
              MailId: vendorRegFormik.values.WorkerMailID,
              Status: vendorRegFormik.values.WorkerStatus,
              VrWorkerDocs: vrWorkerDocs,
            },
          ]);
        }

        // const existingWorkerIndex = vendorRegWorkers.findIndex(
        //   (worker) => worker.VRWorkerDetailId === 0
        // );
        // if (existingWorkerIndex !== -1) {
        //   const updatedVendorRegistrationWorkers = [...vendorRegWorkers];
        //   updatedVendorRegistrationWorkers[existingWorkerIndex] = {
        //     ...updatedVendorRegistrationWorkers[existingWorkerIndex],
        //     WorkerName: vendorRegFormik.values.WorkerName,
        //     WorkerPhoneNo: vendorRegFormik.values.CountryCode,
        //     WorkerMailID: vendorRegFormik.values.WorkerMailID,
        //     WorkerStatus: vendorRegFormik.values.WorkerStatus
        //       ? "Active"
        //       : "In Active",
        //     WorkerDocs: workerDocs,
        //   };
        //   setVendorRegWorkers(updatedVendorRegistrationWorkers);
        // }

        // const existingVrWorkerIndex = vrWorkerDetails.findIndex(
        //   (worker) => worker.VRWorkerDetailId !== 0
        // );
        // if (existingVrWorkerIndex !== -1) {
        //   // Update existing object
        //   const updatedVrWorkerDetails = [...vrWorkerDetails];
        //   updatedVrWorkerDetails[existingVrWorkerIndex] = {
        //     ...updatedVrWorkerDetails[existingVrWorkerIndex],
        //     WorkerName: vendorRegFormik.values.WorkerName,
        //     MobileNo: vendorRegFormik.values.CountryCode,
        //     MailId: vendorRegFormik.values.WorkerMailID,
        //     Status: vendorRegFormik.values.WorkerStatus,
        //     VrWorkerDocs: vrWorkerDocs,
        //   };
        //   setVrWorkerDetails(updatedVrWorkerDetails);
        // }
        setWorkerMode(true);
      }

      vendorRegFormik.setFieldValue("WorkerName", "");
      vendorRegFormik.setFieldValue("CountryCode", "");
      vendorRegFormik.setFieldValue("WorkerMailID", "");
      vendorRegFormik.setFieldValue("WorkerStatus", 1);
      vendorRegFormik.setFieldValue("WorkerDocType", null);
      vendorRegFormik.setFieldValue("WorkerDocNumber", "");
      vendorRegFormik.setFieldValue("WpContractValidity", null);
      vendorRegFormik.setFieldValue("ValidFrom", null);
      vendorRegFormik.setFieldValue("ValidTo", null);
      // setWorkerDocs([]);
      setWorkerTempDocs([]);
      // setVrWorkerDocs([]);
      // clearWorkerDoc();
    }
  };

  const editVendorRegistrationWorker = (rowData, colItem) => {
    setActiveGridInd(colItem.rowIndex);

    setWorkerMode(false);
    setEditGridData(rowData);
    vendorRegFormik.setFieldValue("WorkerName", rowData.WorkerName);
    vendorRegFormik.setFieldValue("CountryCode", rowData.WorkerPhoneNo);
    vendorRegFormik.setFieldValue("WorkerMailID", rowData.WorkerMailID);
    vendorRegFormik.setFieldValue(
      "WpContractValidity",
      rowData?.WpContractValidity ? rowData?.WpContractValidity : null
    );
    vendorRegFormik.setFieldValue(
      "ValidFrom",
      rowData.ValidFrom ? rowData.ValidFrom : null
    );
    vendorRegFormik.setFieldValue(
      "ValidTo",
      rowData.ValidTo ? rowData.ValidTo : null
    );
    vendorRegFormik.setFieldValue(
      "WorkerStatus",
      rowData.WorkerStatus == "Active" ? 1 : 2
    );

    let rowDataFound = rowData.VrWorkerDocs
      ? rowData.VrWorkerDocs
      : rowData.WorkerDocs;
    let tempWorkerDocs = [...rowDataFound];

    if (workDocTypes && workDocTypes.length > 0) {
      tempWorkerDocs.map((tDocItem) => {
        tDocItem.WorkerDocTypeName = workDocTypes.filter(
          (item) => item.MetaSubId == tDocItem.DocumentType
        )[0].MetaSubDescription;
      });
    }
    setWorkerTempDocs(rowDataFound);
    setVrWorkerDocs(rowDataFound);
    setWorkerDocs(rowDataFound);

    let allWorkerDocs =
      rowDataFound &&
      rowDataFound.length > 0 &&
      rowDataFound.map((item) => item.file);
    setWorkerDocsFiles(allWorkerDocs);

    // let updateRowDataVrWorkerDtls = [...vrWorkerDetails];
    // setVrWorkerDetails(updateRowDataVrWorkerDtls);

    // setWorkerDocs(rowDataFound);
    // setWorkerTempDocs(
    //   rowDataFound.filter(
    //     (itemDoc) =>
    //       (itemDoc.WorkerPhoneNo &&
    //         itemDoc.WorkerPhoneNo === rowData.WorkerPhoneNo) ||
    //       (itemDoc.VRWorkerDetailId &&
    //         itemDoc.VRWorkerDetailId === rowData.VRWorkerDetailId)
    //   )
    // );
    // let removedElement = updateRowDataVrWorkerDtls.splice(
    //   colItem.rowIndex,
    //   1
    // )[0];

    // updateRowDataVrWorkerDtls.slice(colItem.rowIndex, 1);
    // let removedEl = [removedElement];

    // setVrWorkerDocs(
    //   updateRowDataVrWorkerDtls.map((item) => item.VrWorkerDocs)[colItem.rowIndex]
    // );
  };

  const deleteVendorRegistrationWorker = (rowData, colItem) => {
    let deleteRowData = [...vendorRegWorkers];
    deleteRowData.splice(colItem.rowIndex, 1);
    setVendorRegWorkers(deleteRowData);

    let deleteRowDataVrWorkerDtls = [...vrWorkerDetails];
    deleteRowDataVrWorkerDtls.splice(colItem.rowIndex, 1);
    setVrWorkerDetails(deleteRowDataVrWorkerDtls);
    if (deleteRowDataVrWorkerDtls && deleteRowDataVrWorkerDtls.length == 0) {
      // setWorkerPermitAll(false);
    }

    setWorkerMode(true);
    vendorRegFormik.setFieldValue("WorkerName", "");
    vendorRegFormik.setFieldValue("CountryCode", "");
    vendorRegFormik.setFieldValue("WorkerMailID", "");
    vendorRegFormik.setFieldValue("WorkerStatus", 1);
    vendorRegFormik.setFieldValue("WorkerDocType", null);
    vendorRegFormik.setFieldValue("WorkerDocNumber", "");
    setWorkerDocs([]);
    setWorkerTempDocs([]);
    clearWorkerDoc();
  };

  const clearWorkerDoc = () => {
    vendorRegFormik.setFieldValue("WorkerDocType", null);
    vendorRegFormik.setFieldValue("WorkerDocNumber", "");
    WorkerDocRef?.current?.clear();
  };

  const previewFile = (item) => {
    if (
      item?.file?.type == "image/png" ||
      item?.file?.type == "image/jpeg" ||
      item?.file?.type == "image/jpg"
    ) {
      setPreviewDoc(
        item?.file?.objectURL
          ? item?.file?.objectURL
          : item?.DocumentUrl.startsWith("http://") ||
            item?.DocumentUrl.startsWith("https://")
          ? item?.DocumentUrl
          : item?.DocumentFullUrl
      );
      setVisible(true);
    } else {
      // let docUrl: any = blobToURL(item.file);
      setPreviewDoc(item?.FileBlobUrl);
      //
      window.open(item?.FileBlobUrl);
    }
  };

  const deleteWorkerFile = (item, e, index) => {
    e.stopPropagation();

    let foundDoc = workerDocs.filter(
      (cDoc) => cDoc.DocumentType == item.DocumentType
    );
    // let filteredWorkerDocsFiles = workerDocsFiles.filter(
    //   (file) => !foundDoc.some((doc) => doc.file.name === file.name)
    // );
    // setWorkerDocsFiles(filteredWorkerDocsFiles);

    let filteredWorkerDocsFiles = workerDocsFiles.filter(
      (docss, index) => !foundDoc.some((doc, docIndex) => docIndex === index)
    );
    setWorkerDocsFiles(filteredWorkerDocsFiles);

    let foundDocInd = workerDocs.indexOf(foundDoc[0]);
    if (foundDocInd >= 0 && foundDocInd < workerDocs.length) {
      let dupWorkerDocs = [...workerDocs];
      let filteredCDoc = dupWorkerDocs.splice(foundDocInd, 1);

      setWorkerDocs(dupWorkerDocs);
      setWorkerTempDocs(dupWorkerDocs);
      vendorRegFormik.setFieldValue("WorkerDocType", []);
      vendorRegFormik.setFieldValue("WorkerDocNumber", "");
      WorkerDocRef?.current?.clear();
    }
    if (vrWorkerDocs && vrWorkerDocs.length > 0) {
      let foundVrDoc = vrWorkerDocs.filter(
        (cDoc) => cDoc.DocumentType == item.DocumentType
      );
      let foundVrDocInd = vrWorkerDocs.indexOf(foundVrDoc[0]);
      if (foundVrDocInd >= 0 && foundVrDocInd < vrWorkerDocs.length) {
        let dupVrWorkerDocs = [...vrWorkerDocs];
        let filteredCVrDoc = dupVrWorkerDocs.splice(foundVrDocInd, 1);
        setVrWorkerDocs(dupVrWorkerDocs);

        vendorRegFormik.setFieldValue("WorkerDocType", []);
        vendorRegFormik.setFieldValue("WorkerDocNumber", "");
        WorkerDocRef?.current?.clear();
      }
    }
  };

  const deleteCompanyFile = (item, colItem, e) => {
    e.stopPropagation();

    let foundDoc = companyDocs.filter((cDoc) => cDoc.FileName == item.FileName);
    let filteredCompanyDocsFiles = companyDocsFiles.filter(
      (file) => !foundDoc.some((doc) => doc.file.name === file.name)
    );
    setCompanyDocsFiles(filteredCompanyDocsFiles);

    // let foundDocInd = companyDocs.indexOf(foundDoc[0]);
    let foundDocInd = colItem.rowIndex;
    if (foundDocInd >= 0 && foundDocInd < companyDocs.length) {
      let dupCompanyDocs = [...companyDocs];
      let filteredCDoc = dupCompanyDocs.splice(foundDocInd, 1);

      setCompanyDocs(dupCompanyDocs);
      vendorRegFormik.setFieldValue("CompanyDocType", []);
      vendorRegFormik.setFieldValue("CompanyDocNumber", "");
      CompanyDocRef?.current?.clear();
    }

    let foundVrDoc = vrCompanyDocs.filter(
      (cDoc) => cDoc.FileName == item.FileName
    );
    // let foundVrDocInd = vrCompanyDocs.indexOf(foundVrDoc[0]);
    let foundVrDocInd = colItem.rowIndex;
    if (foundVrDocInd >= 0 && foundVrDocInd < vrCompanyDocs.length) {
      let dupVrCompanyDocs = [...vrCompanyDocs];
      let filteredCVrDoc = dupVrCompanyDocs.splice(foundVrDocInd, 1);

      setVrCompanyDocs(dupVrCompanyDocs);

      vendorRegFormik.setFieldValue("CompanyDocType", []);
      vendorRegFormik.setFieldValue("CompanyDocNumber", "");
      CompanyDocRef?.current?.clear();
    }
  };

  const toastValidation = (message: string) => {
    toast.current?.show({
      severity: "warn",
      summary: "Warning Message",
      detail: message,
    });
    return;
  };

  const validateGridWorkers = () => {
    const emailRegExp = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    if (
      vendorRegFormik.values.WorkerName == "" ||
      vendorRegFormik.values.WorkerName == null
    ) {
      return toastValidation("Please Enter Worker Name.");
    }
    if (
      !vendorRegFormik.values?.VendorValidity ||
      vendorRegFormik.values.VendorValidity[0] === "" ||
      vendorRegFormik.values.VendorValidity[0] == null
    ) {
      return toastValidation("Please Select Vendor Validity From.");
    }
    if (
      !vendorRegFormik.values?.VendorValidity ||
      vendorRegFormik.values.VendorValidity[1] === "" ||
      vendorRegFormik.values.VendorValidity[1] == null
    ) {
      return toastValidation("Please Select Vendor Validity To.");
    }

    if (
      !vendorRegFormik.values?.WpContractValidity ||
      vendorRegFormik.values.WpContractValidity[0] === "" ||
      vendorRegFormik.values.WpContractValidity[0] === null
    ) {
      return toastValidation("Please Select Worker Validity From.");
    }
    if (
      !vendorRegFormik.values?.WpContractValidity ||
      vendorRegFormik.values.WpContractValidity[1] === "" ||
      vendorRegFormik.values.WpContractValidity[1] === null
    ) {
      return toastValidation("Please Select Worker Validity To.");
    }
    if (
      vendorRegFormik.values.CountryCode == "" ||
      vendorRegFormik.values.CountryCode == null
    ) {
      return toastValidation("Please Enter Phone No.");
    }
    if (vendorRegFormik.values.CountryCode.length != 10) {
      return toastValidation("Please Enter Valid Phone No.");
    }
    // if (
    //   vendorRegFormik.values.WorkerMailID == "" ||
    //   vendorRegFormik.values.WorkerMailID == null
    // ) {
    //   return toastValidation("Please Enter Mail ID.");
    // }
    if (
      vendorRegFormik.values.WorkerMailID != "" &&
      vendorRegFormik.values.WorkerMailID != null &&
      !emailRegExp.test(vendorRegFormik.values.WorkerMailID)
    ) {
      return toastValidation("Please Enter Valid Mail ID.");
    }
    let emailExists = false;
    if (vendorRegFormik.values.WorkerMailID != null) {
      vendorRegWorkers.forEach((itemVR, itemInd) => {
        if (
          vendorRegFormik.values.WorkerMailID != "" &&
          vendorRegFormik.values.WorkerMailID == itemVR.WorkerMailID &&
          (activeGridInd != itemInd || workerMode)
        ) {
          emailExists = true;
        }
      });
    }
    if (emailExists) {
      return toastValidation("Mail ID Already Exists for a Worker.");
    }
    let mobileExists = false;
    vendorRegWorkers.forEach((itemVR, itemInd) => {
      if (
        vendorRegFormik.values.CountryCode != "" &&
        vendorRegFormik.values.CountryCode == itemVR.WorkerPhoneNo &&
        (activeGridInd != itemInd || workerMode)
      ) {
        mobileExists = true;
      }
    });
    if (mobileExists) {
      return toastValidation("Mobile No Already Exists for a Worker.");
    }
    if (
      vendorRegFormik.values.WorkerStatus == "" ||
      vendorRegFormik.values.WorkerStatus == null
    ) {
      return toastValidation("Please Select Worker Status.");
    }
    if (workerTempDocs && workerTempDocs.length == 0) {
      return toastValidation("Please Upload Atleast One Worker Document.");
    }
    // if(workerDocs && !(new Set(workerDocs.map(item => item.DocumentNo)).size === workerDocs.length)) {
    //   return toastValidation("Same Document Numbers Found, Please Add Unique Document No.");
    // }
    return true;
  };

  const docApproveCheck = (rowData, item) => {
    setDocPopVisible(true);
    setCurrentDocinApproval(item);
  };

  const splitName = (data) => {
    return data?.split("_")[1];
  };

  const filesWorkerContent = (rowData) => {
    return (
      <div>
        <div className="flex flex-column">
          {rowData?.WorkerDocs &&
            rowData?.WorkerDocs.map((wItem) => {
              return (
                <a
                  className="text-blue-600 underline"
                  target="_blank"
                  href={wItem?.FileBlobUrl}
                >
                  {splitName(wItem?.FileName)}
                </a>
              );
            })}
        </div>
      </div>
    );
  };

  const filesContent = (rowData) => {
    return (
      <div>
        <div className="flex flex-column">
          <a
            className="text-blue-600 underline"
            target="_blank"
            href={rowData?.DocumentLink}
          >
            {splitName(rowData?.DocumentName)}
          </a>
        </div>
        {/* <div>
          {rowData.WorkerDocs &&
            rowData.WorkerDocs.map((item) => {
              return (
                <div className="align-items-center border-1 border-black-alpha-20 border-round flex justify-content-between mb-3 p-2">
                  <div className="flex flex-column">
                    <a
                      className="text-blue-600 underline"
                      target="_blank"
                      href={item.FileBlobUrl}
                    >
                      {item.FileName}
                    </a>
                    <div className="mt-1">
                      <span className="font-bold">Status:</span>{" "}
                      {item?.Status == 74 || item?.Status == null
                        ? "In Progress"
                        : item.Status == 76
                        ? "Rejected"
                        : "Approved"}
                    </div>
                    <div className="mt-2">
                      <span className="font-bold">Remarks:</span>{" "}
                      {item.Remarks || "-"}
                    </div>
                  </div>
                  {VendorRegHeader?.PrimaryUserId ==
                    +localStorage["UserId"] || rowData?.Status == 2 ? (
                    <div className="flex">
                      <Button
                        label=""
                        severity="info"
                        icon="pi pi-check"
                        title="Approval"
                        className="mr-2 p-1"
                        disabled={item.Status == 75}
                        onClick={() => docApproveCheck(rowData, item)}
                      />
                      <Button
                        label=""
                        severity="danger"
                        icon="pi pi-times-circle"
                        title="Reject"
                        className="mr-2 p-1"
                        disabled={item.Status == 75}
                        onClick={() => docApproveCheck(rowData, item)}
                      />
                    </div>
                  ) : null}
                </div>
              );
            })}
        </div> */}
      </div>
    );
  };

  const actionBodyCompTemplate: any = (rowData, colItem) => {
    return (
      <div className="action-btn">
        <React.Fragment>
          <Button
            label=""
            title="Edit"
            icon="pi pi-pencil"
            className="mr-2 p-1 p-button-success"
            disabled={isView || rowData?.Status == 2}
            onClick={() => editCompDoc(rowData, colItem)}
          />
          <Button
            label=""
            severity="danger"
            icon="pi pi-trash"
            title="Remove"
            className="mr-2 p-1"
            disabled={isView || rowData?.Status == 2}
            onClick={(event) => deleteCompanyFile(rowData, colItem, event)}
          />
        </React.Fragment>
      </div>
    );
  };

  const resetAllForm = () => {
    vendorRegFormik.resetForm();
    vendorRegFormik.setFieldValue("WorkerName", "");
    vendorRegFormik.setFieldValue("CountryCode", "");
    vendorRegFormik.setFieldValue("WorkerMailID", "");
    clearCompDoc();

    setVrWorkerDocs([]);
    setVrWorkerDetails([]);
    setWorkerDocs([]);
    setWorkerTempDocs([]);
    setWorkerDocsFiles([]);
    // setWorkDocTypes([]);

    setVrCompanyDocs([]);
    setCompanyDocs([]);
    setCompanyDocsFiles([]);
    setIsdisableSave(false);
    // setCompDocTypes([]);

    setVendorRegWorkers([]);
    handleSelect("WorkerPhoneNo", {}, "+91");
    handleSelect("WorkerStatus", {}, 1);
    setWorkerMode(true);
    setActiveIndex(0);
  };

  const tabChange = (e) => {
    if (e.index == 1) {
      if (
        vendorRegFormik.values.VendorName == "" ||
        vendorRegFormik.values.VendorName == null
      ) {
        return toastValidation("Please Enter Vendor Name.");
      }
      if (
        !vendorRegFormik.values?.VendorValidity ||
        vendorRegFormik.values.VendorValidity[0] === "" ||
        vendorRegFormik.values.VendorValidity[0] == null
      ) {
        return toastValidation("Please Select Vendor Validity From.");
      }
      if (
        !vendorRegFormik.values?.VendorValidity ||
        vendorRegFormik.values.VendorValidity[1] === "" ||
        vendorRegFormik.values.VendorValidity[1] == null
      ) {
        return toastValidation("Please Select Vendor Validity To.");
      }
      if (
        !vendorRegFormik.values?.InsuranceValidity ||
        vendorRegFormik.values.InsuranceValidity[0] === "" ||
        vendorRegFormik.values.InsuranceValidity[0] == null
      ) {
        return toastValidation("Please Select Insurance Validity From.");
      }
      if (
        !vendorRegFormik.values?.InsuranceValidity ||
        vendorRegFormik.values.InsuranceValidity[1] === "" ||
        vendorRegFormik.values.InsuranceValidity[1] == null
      ) {
        return toastValidation("Please Select Insurance Validity To.");
      }
      if (
        !vendorRegFormik.values?.InsuranceValidity ||
        vendorRegFormik.values.InsuranceValidity[1] === "" ||
        vendorRegFormik.values.InsuranceValidity[1] == null
      ) {
        return toastValidation("Please Select Insurance Validity To.");
      }

      if (vrCompanyDocs && vrCompanyDocs.length == 0) {
        return toastValidation("Please Upload Atleast One Documents Details");
      }
    }
    pageLoadScript();
    setActiveIndex(e.index);
  };

  const handleInchargeChange = (event, rowData, rowIndex, col) => {
    // const isChecked = event.checked ? 1 : 0;
    // const updatedWpWorkerDetails = [...wpWorkerDetails];
    // updatedWpWorkerDetails[rowIndex.rowIndex] = {
    //   ...updatedWpWorkerDetails[rowIndex.rowIndex],
    //   IsInCharge: isChecked,
    // };
    // setWpWorkerDetails(updatedWpWorkerDetails);
  };

  const ClearFileUpload = () => {
    CompanyDocRef.current?.clear();
    // vendorRegFormik.setFieldValue("DigitalSign", null);
    // vendorRegFormik.setFieldValue("DigitalSignName", null);
    setCompanyTempDoc(null);
    setCompanyDocUrl(null);
    setCompanyDocs([]);
  };

  const handleWpDetailNext = () => {
    setActiveIndex(1);
  };
  const allowExpansion = (rowData) => {
    return rowData.WorkerDocs.length > 0;
  };
  // Props
  // Worker Detail Props
  let workerGridProp = {
    gridData: vendorRegWorkers,
    filters,
    header,
    isView,
    handleInchargeChange,
    editAction: editVendorRegistrationWorker,
    delAction: deleteVendorRegistrationWorker,
    filesContent: filesWorkerContent,
    workerTempDocs: workerTempDocs,
    pageConfig,
    handleChange,
    allowExpansion,
  };

  let workerDetailProp = {
    isCreate,
    isView,
    wdFormik: vendorRegFormik,
    updatePhoneNo: handlePhoneNo,
    phonenumber,
    docUpload,
    handleSelect,
    editAction: editVendorRegistrationWorker,
    delAction: deleteVendorRegistrationWorker,
    onChangeWorkerDocType,
    workerDocUpload,
    workerStatusList,
    workerTempDocs: workerTempDocs,
    previewFile,
    deleteWorkerFile,
    vendorRegWorkers,
    filters,
    header,
    filesContent,
    addWorker: addWorker,
    resetWorker,
    workDocTypes,
    workerMode,
    WorkerDocRef,
    handleChange,
  };
  // Worker Detail Props
  // Props

  return (
    <div className="page-container">
      <div className="inner-page-container">
        <div className="page-title">
          <div className="grid grid-nogutter">
            <div className="md:col-6">
              <h1>Vendor Registration</h1>
            </div>
            <div className="md:col-6 text-right">
              <div className="action-btn">
                <Button
                  label=""
                  title="Save"
                  icon="pi pi-save"
                  className="text-center"
                  disabled={isView || isDisableSave}
                  onClick={vendorRegFormik.handleSubmit}
                />
                <Button
                  label=""
                  severity="danger"
                  icon="pi pi-trash"
                  title="Clear"
                  className="text-center"
                  disabled={isView || !isCreate}
                  onClick={() => resetAllForm()}
                />

                <Button
                  label=""
                  icon="pi pi-search"
                  title="Search"
                  className="p-button p-button-success text-center"
                  onClick={() => {
                    history.push("/home/vVendorRegistration");
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <TabView
          pt={{
            nav: {
              style: {
                justifyContent: "start",
                gap: 10,
              },
            },
          }}
          panelContainerStyle={{
            padding: 0,
            backgroundColor: "#ebeef6",
          }}
          onTabChange={(e) => tabChange(e)}
          activeIndex={activeIndex}
        >
          <TabPanel
            style={{
              minWidth: 125,
            }}
            header="Vendor Information"
            leftIcon="pi pi-id-card mr-2"
          >
            <div className="tab-parent-container scroll-y">
              {!loading ? (
                <div className="white">
                  <div className="grid">
                    <div className="col-12">
                      {/* <div className="white"> */}
                      {/* <div className="widget-hdr">
                          <div className="sub-title">
                            <div className="grid">
                              <div className="md:col-6">
                                <h2>Vendor Information</h2>
                              </div>
                            </div>
                          </div>
                        </div> */}
                      <div className="widget-body pb-0">
                        <div className="normal-table">
                          <div className="grid">
                            <div className="col-12 md:col-12 pb-0">
                              <div className="grid">
                                <FormFields
                                  type={"text"}
                                  name={"VendorName"}
                                  label={"Vendor Name "}
                                  options={""}
                                  show={true}
                                  required={true}
                                  disable={isView}
                                  optionLabel={""}
                                  optionValue={""}
                                  handleSelect={""}
                                  fldStyle={"col-12 md:col-3"}
                                  formik={vendorRegFormik}
                                />
                                {/* <FormFields
                                  type={"select"}
                                  name={"WorkOrganizer"}
                                  label={"Work Organizer "}
                                  options={workOrganisers}
                                  show={true}
                                  required={true}
                                  disable={isView}
                                  optionLabel={"UserName"}
                                  optionValue={"UserId"}
                                  handleSelect={handleSelect}
                                  fldStyle={"col-12 md:col-3"}
                                  formik={vendorRegFormik}
                                /> */}
                                <FormFields
                                  type={"Calendar"}
                                  name={"InsuranceValidity"}
                                  label={"Insurance Validity "}
                                  options={""}
                                  show={true}
                                  required={true}
                                  disable={isView}
                                  optionLabel={""}
                                  optionValue={""}
                                  handleChange={handleInsVal}
                                  fldStyle={"col-12 md:col-3"}
                                  formik={vendorRegFormik}
                                  minDate={new Date()}
                                  // maxDate={new Date()}
                                  selectionMode={"range"}
                                />
                                <FormFields
                                  type={"Calendar"}
                                  name={"VendorValidity"}
                                  label={"Vendor Validity "}
                                  options={""}
                                  show={true}
                                  required={true}
                                  disable={isView}
                                  optionLabel={""}
                                  optionValue={""}
                                  handleChange={handleChange}
                                  fldStyle={"col-12 md:col-3"}
                                  formik={vendorRegFormik}
                                  minDate={
                                    (vendorRegFormik?.values
                                      ?.InsuranceValidity &&
                                      vendorRegFormik?.values
                                        ?.InsuranceValidity[0]) ||
                                    new Date()
                                  }
                                  maxDate={
                                    vendorRegFormik?.values
                                      ?.InsuranceValidity &&
                                    vendorRegFormik?.values
                                      ?.InsuranceValidity[1]
                                  }
                                  selectionMode={"range"}
                                />

                                {/* <FormFields
                                  type={"text"}
                                  name={"PoNo"}
                                  label={"PO No / Doc Ref No "}
                                  options={""}
                                  show={true}
                                  required={false}
                                  disable={isView}
                                  optionLabel={""}
                                  optionValue={""}
                                  handleSelect={""}
                                  fldStyle={"col-12 md:col-3"}
                                  formik={vendorRegFormik}
                                /> */}
                                <FormFields
                                  type={"select"}
                                  name={"Status"}
                                  label={"Status "}
                                  options={vendorStatusList}
                                  show={!isCreate || isView}
                                  required={false}
                                  disable={!isCreate || isView}
                                  optionLabel={"MetaSubDescription"}
                                  optionValue={"MetaSubId"}
                                  handleSelect={handleSelect}
                                  fldStyle={"col-12 md:col-3"}
                                  formik={vendorRegFormik}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* </div> */}
                    </div>
                    <div className="col-12 pb-0">
                      {/* <div className="white"> */}
                      <div className="grid white">
                        <div
                          className="md:col-4 appointment-left"
                          style={{
                            width: "20%",
                          }}
                        >
                          <div className="widget-hdr">
                            <div className="sub-title">
                              <div className="grid">
                                <div className="md:col-9">
                                  <h2>Company Documents</h2>
                                </div>
                                {/* <div className="md:col-3 pl-0 text-right">
                                  <div className="action-btn">
                                    <Button
                                      label="Clear"
                                      severity="danger"
                                      icon="las la-trash"
                                      title="Clear"
                                      className="text-center"
                                      onClick={() => clearCompDoc()}
                                    />
                                    <Button
                                      label="Add"
                                      severity="success"
                                      icon="las la-arrow-right"
                                      title="Add"
                                      className="text-center"
                                      onClick={() => addCompDoc()}
                                      type="submit"
                                    />
                                  </div>
                                </div> */}
                              </div>
                            </div>
                          </div>
                          <div className="widget-body pb-0">
                            <div className="normal-table">
                              <div className="grid">
                                <div className="col-12">
                                  <div className="grid">
                                    <FormFields
                                      type={"select"}
                                      name={"CompanyDocType"}
                                      label={"Choose Doc Type "}
                                      options={compDocTypeList}
                                      show={true}
                                      required={true}
                                      disable={isView}
                                      optionLabel={"MetaSubDescription"}
                                      optionValue={"MetaSubId"}
                                      handleSelect={(name, other, value) =>
                                        onChangeCompanyDocType(
                                          name,
                                          other,
                                          value
                                        )
                                      }
                                      fldStyle={"col-12"}
                                      formik={vendorRegFormik}
                                    />
                                    <FormFields
                                      type={"text"}
                                      name={"CompanyDocNumber"}
                                      label={"Doc Number "}
                                      options={""}
                                      show={true}
                                      required={true}
                                      disable={isView}
                                      optionLabel={""}
                                      optionValue={""}
                                      handleSelect={""}
                                      maxLength="30"
                                      fldStyle={"col-12"}
                                      formik={vendorRegFormik}
                                    />
                                  </div>
                                </div>
                                <div className="col-12">
                                  <label className="form-label">
                                    Document Upload
                                    {/* <span className="hlt-txt">*</span> */}
                                  </label>
                                  <div className="p-inputgroup">
                                    <div className="browse-links">
                                      {/* <Button
                                        label={companyTempDoc?.DocumentName}
                                        link
                                        onClick={() =>
                                          handleClick(companyDocUrl)
                                        }
                                      /> */}

                                      {companyTempDoc?.DocumentName != "" &&
                                      companyTempDoc?.DocumentName != null ? (
                                        <Button
                                          label={companyTempDoc?.DocumentName}
                                          link
                                          onClick={() =>
                                            handleClick(companyDocUrl)
                                          }
                                        />
                                      ) : null}
                                    </div>
                                    <FileUpload
                                      ref={CompanyDocRef}
                                      mode="basic"
                                      chooseOptions={chooseOptions}
                                      chooseLabel={companyTempDoc?.DocumentName}
                                      customUpload
                                      onSelect={(event) =>
                                        compDocUploader(event)
                                      }
                                      auto
                                      maxFileSize={1000000}
                                      accept="image/*,.pdf,.xlsx,.xls,.xlsm,.docx,.txt"
                                      disabled={isView}
                                    />
                                    <Button
                                      icon="las la-times"
                                      disabled={
                                        isView ||
                                        companyTempDoc == null ||
                                        companyTempDoc == ""
                                      }
                                      onClick={ClearFileUpload}
                                    />
                                  </div>
                                  {/* <FileUpload
                                    mode="basic"
                                    name="CompanyFileUpload"
                                    // className="docs-upload"
                                    // accept="image/*"
                                    maxFileSize={1000000}
                                    chooseOptions={docUpload}
                                    chooseLabel="Upload File"
                                    customUpload
                                    onSelect={(event) =>
                                      addCompDoc(event)
                                    }
                                    ref={CompanyDocRef}
                                    disabled={
                                      isView ||
                                      vendorRegFormik.values.CompanyDocType ==
                                        null ||
                                      vendorRegFormik.values.CompanyDocType ==
                                        "" ||
                                      vendorRegFormik.values
                                        .CompanyDocNumber == null ||
                                      vendorRegFormik.values
                                        .CompanyDocNumber == ""
                                    }
                                  /> */}
                                </div>
                                {/* <div className="col-12 md:col-5">
                              <Tooltip target=".docs-preview-container.white" />
                              <div className="grid">
                                {companyDocs &&
                                  companyDocs.map((item) => {
                                    return (
                                      <div className="col-4 md:col-4 text-center">
                                        <div
                                          className="docs-preview-container white m-auto"
                                          onClick={() => previewFile(item)}
                                          data-pr-tooltip={item.CompanyDocType}
                                          data-pr-position="top"
                                        >
                                          <img
                                            src={
                                              item &&
                                              item.hasOwnProperty("file") &&
                                              item?.file?.type == "image/png"
                                                ? DocPNG
                                                : (item &&
                                                    item.hasOwnProperty(
                                                      "file"
                                                    ) &&
                                                    item?.file?.type ==
                                                      "image/jpeg") ||
                                                  (item &&
                                                    item.hasOwnProperty(
                                                      "file"
                                                    ) &&
                                                    item?.file?.type ==
                                                      "image/jpg")
                                                ? DocJPG
                                                : DocPDF
                                            }
                                            alt="logo"
                                          />
                                          <a
                                            className="img-preview-close"
                                            title="Delete"
                                            aria-disabled={isView}
                                            onClick={(e) =>
                                              deleteCompanyFile(item, e)
                                            }
                                          >
                                            <i className="las la-times-circle"></i>
                                          </a>
                                        </div>
                                      </div>
                                    );
                                  })}
                                <div className="col-4 md:col-4 text-center">
                            <div
                              className="docs-preview-container white m-auto"
                              onClick={() => setVisible(true)}
                              data-pr-tooltip="Aadhaar"
                              data-pr-position="top"
                            >
                              <img src={DocWord} alt="logo" />
                              <a className="img-preview-close" title="Delete">
                                <i className="las la-times-circle"></i>
                              </a>
                            </div>
                          </div>
                          <div className="col-4 md:col-4 text-center">
                            <div
                              className="docs-preview-container white m-auto"
                              onClick={() => setVisible(true)}
                              data-pr-tooltip="ESI Doc"
                              data-pr-position="top"
                            >
                              <img src={DocJPG} alt="logo" />
                              <a className="img-preview-close" title="Delete">
                                <i className="las la-times-circle"></i>
                              </a>
                            </div>
                          </div>
                          <div className="col-4 md:col-4 text-center">
                            <div
                              className="docs-preview-container white m-auto"
                              onClick={() => setVisible(true)}
                              data-pr-tooltip="PF Doc"
                              data-pr-position="top"
                            >
                              <img src={DocPNG} alt="logo" />
                              <a className="img-preview-close" title="Delete">
                                <i className="las la-times-circle"></i>
                              </a>
                            </div>
                          </div>
                              </div>
                            </div> */}
                              </div>
                            </div>
                          </div>
                          <div className="widget-foot">
                            <div className="md:col-12 text-right border-top-1 border-gray-300 page-title pt-2">
                              <div className="">
                                <Button
                                  label="Clear"
                                  title="Clear"
                                  severity="danger"
                                  icon="pi pi-ban"
                                  className="text-center"
                                  disabled={isView}
                                  onClick={() => clearCompDoc()}
                                />
                                <Button
                                  label={compMode ? "Add" : "Update"}
                                  severity="success"
                                  icon="las la-arrow-right"
                                  title={compMode ? "Add" : "Update"}
                                  className="text-center"
                                  disabled={isView}
                                  onClick={() => addCompDoc()}
                                  type="submit"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div
                          className="md:col-8 appointment-right"
                          style={{
                            width: "80%",
                          }}
                        >
                          <div className="">
                            <div className="widget-hdr">
                              <div className="sub-title">
                                <div className="grid">
                                  <div className="md:col-6">
                                    <h2>Documents Details</h2>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="widget-body">
                              <div className="card">
                                <DataTable
                                  value={vrCompanyDocs}
                                  showGridlines
                                  paginator
                                  filters={filters}
                                  filterDisplay="menu"
                                  globalFilterFields={[
                                    "DocumentName",
                                    "DocumentTypeName",
                                    "DocumentNo",
                                  ]}
                                  header={header}
                                  emptyMessage="No Data found."
                                  rows={50}
                                  rowsPerPageOptions={[5, 10, 25, 50, 100]}
                                  tableStyle={{ minWidth: "50rem" }}
                                >
                                  <Column
                                    field={"Action"}
                                    header={"Action"}
                                    style={{
                                      textAlign: "center",
                                    }}
                                    body={(rowData, rowInd) =>
                                      actionBodyCompTemplate(rowData, rowInd)
                                    }
                                    headerClassName="text-center"
                                  ></Column>

                                  <Column
                                    sortable
                                    field="DocumentTypeName"
                                    header="Document Type"
                                  ></Column>
                                  <Column
                                    sortable
                                    field="DocumentNo"
                                    header="Document Number"
                                  ></Column>
                                  <Column
                                    sortable
                                    field="DocumentName"
                                    header="Document Name"
                                    body={filesContent}
                                  ></Column>
                                </DataTable>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* </div> */}
                    </div>
                  </div>
                  <div className="border-top-1 border-gray-300 page-title pt-2 mt-4 pr-4 pb-3">
                    <div className="text-right">
                      <Button
                        label="Next"
                        icon="pi pi-arrow-right"
                        onClick={() => handleWpDetailNext()}
                        autoFocus
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <AppProgressSpinner />
              )}
            </div>
          </TabPanel>

          <TabPanel
            style={
              {
                // minWidth: 125,
              }
            }
            header="Worker Information"
            rightIcon="pi pi-users ml-2"
          >
            <WorkerDetails wdProp={workerDetailProp} wGProp={workerGridProp} />
          </TabPanel>
        </TabView>
      </div>

      <Dialog
        header={
          "Approve " +
          currentDocinApproval?.DocumentName +
          " ( " +
          currentDocinApproval?.DocumentNo +
          " ) ?"
        }
        visible={docPopVisible}
        position="bottom-right"
        style={{ width: "50vw" }}
        onHide={() => setDocPopVisible(false)}
        footer={footerContent}
        draggable={false}
        resizable={false}
      >
        <FormFields
          type={"textarea"}
          name={"Remarks"}
          label={"Remarks"}
          options={""}
          show={true}
          required={false}
          disable={false}
          optionLabel={""}
          optionValue={""}
          handleSelect={""}
          maxLength="500"
          formik={formik}
          style={{ maxHeight: "100px", overflowY: "auto" }}
        />
      </Dialog>
      <Dialog
        header="Preview Document"
        visible={visible}
        onHide={() => setVisible(false)}
        footer={PrevfooterContent}
      >
        <div
          style={{
            minWidth: "500px",
            maxWidth: "800px",
            minHeight: "200px",
          }}
          className="flex justify-content-center align-items-center"
        >
          <img
            style={{
              width: "50%",
              height: "100%",
              objectFit: "contain",
            }}
            src={previewDoc}
            alt={previewDoc}
          />
        </div>
        {/* <p className="m-0">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p> */}
      </Dialog>

      <AppAlert toast={toast} />
    </div>
  );
};

export default CVendorRegistration;
