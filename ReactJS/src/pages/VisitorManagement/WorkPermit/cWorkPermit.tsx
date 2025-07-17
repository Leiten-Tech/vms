import React, { useState, useEffect, useRef } from "react";
import { Link, useHistory } from "react-router-dom";

import { DocJPG, DocPDF, DocPNG, DocWord } from "@/assets/css/img-library";
import {
  Button,
  Calendar,
  Checkbox,
  Column,
  DataTable,
  Dialog,
  Dropdown,
  FileUpload,
  FilterMatchMode,
  InputText,
  Sidebar,
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
  fetchVendor,
  fetchCheckPoints,
  onChangeVendor,
  GetWpPass,
} from "@/redux/slices/visitorManagement/workPermitSlice";
import {
  blobToURL,
  fileToBlobURL,
  formConvertion,
  generateUniqueName,
  tLDS,
  urlToFile,
} from "@/utils/utilFunc";
import AppAlert from "@/alert/alert";
import { AppProgressSpinner } from "@/components/UtilityComp";
import { WorkPermitPrint } from "@/pages/VisitorManagement/WorkPermit/cWorkPermitCreator";
import { TabView, TabPanel } from "primereact/tabview";
import { WorkerDetails } from "@/components/Common/WorkerDetails";
import ReactToPrint from "react-to-print";
import WPPrintPass, { WpPassContent } from "@/components/WPPrintPass";

const CWorkPermit = () => {
  const history = useHistory();
  const dispatch: any = useDispatch();

  const [visible, setVisible] = useState(false);
  const [workOrganisers, setWorkOrganisers] = useState([]);
  const [companyDocList, setCompanyDocList] = useState<any>([]);
  const [departments, setDepartments] = useState<any>([]);
  const [filteritemType, setFilteritemType] = useState([]);
  const [checkPointsAll, setCheckPointsAll] = useState([]);
  const [checkPointsPrint, setCheckPointsPrint] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState();
  const [dialogVisible, setDialogVisible] = useState<boolean>(false);
  const [passData, setPassData] = useState<any>();
  const onBeforeGetContentResolve = React.useRef(null);
  const componentRef = React.useRef(null);
  const handleBeforePrint = React.useCallback(() => {}, []);
  const reactToPrintTrigger = React.useCallback(() => {
    return (
      <div className="mt-3 preview-container">
        <div className="widget-ftr text-center">
          <Button label="Preview" title="Preview" icon="pi pi-search" />
        </div>
      </div>
    );
  }, []);
  const handleOnBeforeGetContent = React.useCallback(() => {
    // setLoading(true);
    // return new Promise((resolve: any) => {
    //   onBeforeGetContentResolve.current = resolve;
    //   setTimeout(() => {
    //     setLoading(false);
    //     setText("New, Updated Text!");
    //     resolve();
    //   }, 2000);
    // });
  }, []);

  const reactToPrintContent = React.useCallback(() => {
    return componentRef.current;
  }, [componentRef.current]);
  const [allVendorRegs, setAllVendorRegs] = useState<any>([]);
  // const [wpAppConfig, setWpAppConfig] = useState<any>([]);
  const [wpFootSign, setWpFootSign] = useState<any>([
    // {
    //   Name: "Vendor/ Contractor",
    // },
    // {
    //   Name: "",
    // },
    // {
    //   Name: "Concern Dept",
    // },
    // {
    //   Name: "",
    // },
    // {
    //   Name: "Security",
    // },
    // {
    //   Name: "",
    // },
  ]);
  const [workBtnDisable, setWorkBtnDisable] = useState<any>({});
  const [categories, setCategories] = useState<any>([]);
  const [wpCatDetails, setWpCatDetails] = useState<any>([]);
  const [wpApprovalDetails, setApprovalDetails] = useState<any>([]);

  const [workerDocList, setWorkerDocList] = useState([]);
  const [workerStatusList, setWorkerStatusList] = useState([]);
  const [statusList, setStatusList] = useState([]);

  const [workerPermitAll, setWorkerPermitAll] = useState(false);
  const [workPermitWorkers, setWorkPermitWorkers] = useState([]);
  const [tempWorkPermitWorkersGrid, setTempWorkPermitWorkersGrid] = useState(
    []
  );
  const [selectAllWpWorkers, setSelectAllWpWorkers] = useState(false);
  const [docPopVisible, setDocPopVisible] = useState<any>();
  const [currentDocinApproval, setCurrentDocinApproval] = useState<any>();

  const [WorkPermitHeader, setWorkPermitHeader] = useState<any>();
  const [wpCompanyDocs, setWpCompanyDocs] = useState([]);

  const [wpWorkerDetails, setWpWorkerDetails] = useState<any>([]);
  const [workerDocs, setWorkerDocs] = useState([]);
  const [workerTempDocs, setWorkerTempDocs] = useState([]);
  const [wpWorkerDocs, setWpWorkerDocs] = useState([]);
  const [workerDocsFiles, setWorkerDocsFiles] = useState([]);
  // const [wpCompanyDetails, setWpCompanyDetails] = useState([]);
  const [workerMode, setWorkerMode] = useState(true);

  const [companyDocs, setCompanyDocs] = useState([]);
  const [maxValidDate, setMaxValidDate] = useState<any>(null);
  const [companyDocsFiles, setCompanyDocsFiles] = useState([]);

  const [previewDoc, setPreviewDoc] = useState<any>();
  const [isDisableSave, setIsdisableSave] = useState<any>();
  const [showPrint, setShowPrint] = useState<any>(false);

  const [editGridData, setEditGridData] = useState<any>();
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeGridInd, setActiveGridInd] = useState(0);
  const CompanyDocRef: any = useRef(null);
  const WorkerDocRef: any = useRef(null);
  const autoCompleteRef: any = useRef(null);

  const toast = useRef<any>(null);
  const phonenumber = [{ Id: 1, CountryCode: "+91", CountryName: "India" }];

  const {
    isCreate,
    isView,
    loading,
    error,
    tranStatus,
    createEditData,
    WorkOrganiser,
    CompanyDocs,
    WorkDocs,
    WorkerStatusList,
    VendorWorkersList,
  } = useSelector((state: any) => state.workPermit);

  const workPermitForm = {
    WorkPermitId: createEditData ? createEditData.WorkPermitId : 0,
    WorkPermitCode: createEditData ? createEditData.WorkPermitCode : "",
    WorkPermitDate: createEditData
      ? new Date(createEditData.WorkPermitDate)
      : new Date(),
    CompanyId: createEditData
      ? createEditData.CompanyId
      : localStorage["CompanyId"],
    PlantId: createEditData ? createEditData.PlantId : localStorage["PlantId"],
    GateId: createEditData ? createEditData.GateId : localStorage["GateId"],
    DeptId: createEditData ? createEditData.DeptId : null,
    VendorRegId: createEditData ? createEditData.VendorRegId : "",
    ValidFrom: createEditData ? createEditData.ValidFrom : "",
    ValidTo: createEditData ? createEditData.ValidTo : null,
    ContractValidity:
      createEditData != null
        ? [
            new Date(createEditData?.ValidFrom),
            new Date(createEditData?.ValidTo),
          ]
        : new Date(),
    ContractName: createEditData ? createEditData.ContractName : "",
    WorkOrganizer: createEditData ? createEditData.WorkOrganizer : "",
    PoNo: createEditData ? createEditData.PoNo : "",
    StatusRemarks: createEditData ? createEditData.StatusRemarks : "",
    Status: createEditData ? createEditData.Status : 74,
    DocStatus: createEditData ? createEditData.DocStatus : 74,
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

  const workPermitFormik: any = useFormik({
    initialValues: workPermitForm,
    validationSchema: VisitorEntryValidationSchema,
    onSubmit: (values: any, { resetForm }) => {
      setIsdisableSave(true);

      let validatedWorkPermit = validateWorkPermit();
      // let tempCharge =
      //   workPermitWorkers &&
      //   workPermitWorkers.length > 0 &&
      //   workPermitWorkers.some((item) => item.IsIncharge == 1);
      let tempChargeWorking = workPermitWorkers.some(
        (item) =>
          (item.IsIncharge == 1 || item.IsIncharge == true) &&
          (item.IsWorking == 1 || item.IsWorking == true)
      );
      let tempWorking =
        workPermitWorkers &&
        workPermitWorkers.length > 0 &&
        workPermitWorkers.some((item) => item.IsWorking == true);
      if (validatedWorkPermit) {
        if (!tempWorking) {
          setIsdisableSave(false);
          setActiveIndex(1);
          toastValidation("Please Add an Working Person.");
          return;
        }
        if (!tempChargeWorking) {
          setIsdisableSave(false);
          setActiveIndex(1);
          toastValidation(
            "Please Select an InCharge Person, Incharge Person should be a Working Person."
          );
          return;
        }
      }
      if (validatedWorkPermit && tempChargeWorking && tempWorking) {
        let sendValues = { ...values };
        sendValues.ValidFrom = tLDS(values.ContractValidity[0]);
        sendValues.ValidTo = tLDS(values.ContractValidity[1]);
        sendValues.WorkPermitDate = tLDS(new Date());
        sendValues.VendorRegId = sendValues?.VendorRegId?.VendorRegId;

        const wpWorkers = wpWorkerDetails.map((item) => ({
          ...item,
          ValidFrom: tLDS(item.ValidFrom),
          ValidTo: tLDS(item.ValidTo),
        }));

        delete sendValues.ContractValidity;
        delete sendValues.WorkerPhoneNo;
        delete sendValues.CompanyDocType;
        delete sendValues.CompanyDocNumber;
        delete sendValues.WorkerName;
        delete sendValues.CountryCode;
        delete sendValues.WorkerMailID;
        delete sendValues.WorkerStatus;
        delete sendValues.WorkerDocType;
        delete sendValues.WorkerDocNumber;

        const cpDetailsMap = [...checkPointsAll];

        const { CompanyId, PlantId, GateId } = localStorage;

        const updatedCPDetailMap = cpDetailsMap.map((item) => {
          const checkpointsForCategory = checkPointsPrint[item.CategoryName];

          if (checkpointsForCategory) {
            const matchingCheckpoint = checkpointsForCategory.find(
              (checkItem) => checkItem.description === item.Description
            );

            if (matchingCheckpoint) {
              return {
                ...item,
                CpDes: matchingCheckpoint.description,
                Remarks: matchingCheckpoint.remark,
                CompanyId: +CompanyId,
                PlantId: +PlantId,
                GateId: +GateId,
              };
            }
          }

          return {
            ...item,
            CpDes: item.Description,
            CompanyId: +CompanyId,
            PlantId: +PlantId,
            GateId: +GateId,
          };
        });

        let obj: any = {
          WorkerPermit: sendValues,
          WorkerPermitWorkers: wpWorkers,
          // WorkerPermitCompanyDocs: wpCompanyDocs,
          WorkerPermitWorkerDocs: wpWorkerDocs,
          WorkerPermitCpMapDetails: updatedCPDetailMap,
          WorkerPermitNature: wpCatDetails,
          WorkerPermitAppDetail: wpApprovalDetails,
        };
        // let input: string = JSON.stringify(obj);
        // formData.append("input", input);
        // formData.append("companyFiles", companyDocsFiles);
        // formData.append("workerFiles", workerDocsFiles);

        setIsdisableSave(false);
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
                    setList(res, {});
                  });
                  setDocPopVisible(false);
                  setCurrentDocinApproval({});
                  return;
                } else {
                  setIsdisableSave(false);
                  resetAllForm();
                  setDocPopVisible(false);
                  setTimeout(() => {
                    history.push("/home/vWorkPermit");
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

  const validateWorkPermit = () => {
    const emailRegExp = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    // if (
    //   workPermitFormik.values.ContractName == "" ||
    //   workPermitFormik.values.ContractName == null
    // ) {
    //   return toastValidation("Please Enter Contract Name.");
    // }
    if (
      workPermitFormik.values.VendorRegId == "" ||
      workPermitFormik.values.VendorRegId == null
    ) {
      return toastValidation("Please Select Vendor.");
    }
    if (
      workPermitFormik.values.WorkOrganizer == "" ||
      workPermitFormik.values.WorkOrganizer == null
    ) {
      return toastValidation("Please Select WorkOrganizer.");
    }
    if (
      (workPermitFormik.values.ContractValidity &&
        workPermitFormik.values.ContractValidity == "") ||
      workPermitFormik.values.ContractValidity == null
    ) {
      return toastValidation("Please Select Contract Validity.");
    }
    if (
      (workPermitFormik.values.ContractValidity &&
        workPermitFormik.values.ContractValidity[0] == "") ||
      workPermitFormik.values.ContractValidity[0] == null
    ) {
      return toastValidation("Please Select Contract Validity From.");
    }
    if (
      (workPermitFormik.values.ContractValidity &&
        workPermitFormik.values.ContractValidity[1] == "") ||
      workPermitFormik.values.ContractValidity[1] == null
    ) {
      return toastValidation("Please Select Contract Validity To.");
    }
    if (
      workPermitFormik.values.DeptId == "" ||
      workPermitFormik.values.DeptId == null
    ) {
      return toastValidation("Please Select Department.");
    }
    // if (
    //   workPermitFormik.values.PoNo == "" ||
    //   workPermitFormik.values.PoNo == null
    // ) {
    //   return toastValidation("Please Enter PoDoc RefNo.");
    // }
    if (wpCatDetails && wpCatDetails.length == 0) {
      return toastValidation("Please Enter Atleast One Work Nature");
    }

    return true;
  };

  const approveDocument = (btn) => {
    if (
      btn == 1 &&
      formik.values.Remarks == null &&
      formik.values.Remarks == ""
    ) {
      return toastValidation("Please Enter Remarks");
    } else {
      let updatedWpWorkerDetails = [...wpWorkerDetails];
      let workerDetailIndex: any = updatedWpWorkerDetails.findIndex(
        (it) => it.WPWorkerDetailId == currentDocinApproval.WPWorkerDetailId
      );

      if (workerDetailIndex !== -1) {
        const wpWorkerDocs = [
          ...updatedWpWorkerDetails[workerDetailIndex].WpWorkerDocs,
        ];
        const docIndex = wpWorkerDocs.findIndex(
          (doc) => doc.WPWorkerDocId === currentDocinApproval.WPWorkerDocId
        );

        if (docIndex !== -1) {
          wpWorkerDocs[docIndex] = {
            ...wpWorkerDocs[docIndex],
            Status: btn == 0 ? 75 : 76,
            Remarks: formik.values.Remarks,
          };

          updatedWpWorkerDetails[workerDetailIndex] = {
            ...updatedWpWorkerDetails[workerDetailIndex],
            WpWorkerDocs: wpWorkerDocs,
          };
          setWpWorkerDetails(updatedWpWorkerDetails);
        }
      }
      let updatedWpWorkerDetails2 = [...updatedWpWorkerDetails];
      updatedWpWorkerDetails2.forEach((wpWorkerDoc2) => {
        if (
          wpWorkerDoc2.WpWorkerDocs.every(
            (docItemAllStatusCheck) => docItemAllStatusCheck.Status == 75
          )
        ) {
          workPermitFormik.setFieldValue("DocStatus", 75);
        } else if (
          wpWorkerDoc2.WpWorkerDocs.some(
            (docItemAllStatusCheck) => docItemAllStatusCheck.Status == 76
          )
        ) {
          workPermitFormik.setFieldValue("DocStatus", 76);
        } else if (
          wpWorkerDoc2.WpWorkerDocs.some(
            (docItemAllStatusCheck) => docItemAllStatusCheck.Status == 74
          )
        ) {
          workPermitFormik.setFieldValue("DocStatus", 74);
        }
      });
      workPermitFormik.handleSubmit();
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
        workPermitFormik.setFieldValue(name, value);
      }
    } else {
      workPermitFormik.setFieldValue(name, value);
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
    handleSelect("WorkerStatus", {}, 1);
  }, []);

  const createInitService = () => {
    const data = {
      WorkPermitId: createEditData ? createEditData.WorkPermitId : 0,
      PlantId: +localStorage["PlantId"],
      CompanyId: +localStorage["CompanyId"],
    };
    const result = dispatch(createInit(data));
    return result;
  };

  useEffect(() => {
    if (createEditData != null) {
      if (isCreate == false) {
        const result = createInitService();
        result.then((res) => {
          let tempVendors = res.payload.VendorRegs;
          let foundVendor = tempVendors.filter(
            (item) =>
              item.VendorRegId == res.payload.WorkPermitHeader?.VendorRegId
          );
          setWorkPermitHeader(res.payload.WorkPermitHeader);
          onChangeVendorId("VendorRegId", {}, foundVendor[0]);
          // setList(res, {});
        });
      }
    } else {
      const data = {
        WorkPermitId: 0,
        PlantId: +localStorage["PlantId"],
        CompanyId: +localStorage["CompanyId"],
      };
      const result = dispatch(createInit(data));
      result.then((res) => {
        workPermitFormik.setFieldValue("WorkerStatus", 1);
        handleSelect("WorkerStatus", {}, 1);
        // workPermitFormik.setFieldValue("CategoryId", [1]);
        // if (
        //   !workPermitFormik.values.CategoryId ||
        //   workPermitFormik.values.CategoryId.length > 0
        //     ? workPermitFormik.values.CategoryId.some((item) => item != 1)
        //     : true
        // ) {
        handleWorkNature(
          "CategoryId",
          {},
          [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
          [],
          res.payload.Categories
        );
        // }
        setWorkerDocList(res.payload.WorkDocs);
        setStatusList(res.payload.StatusList);
        setWorkOrganisers(res.payload.WorkOrganiser);
        setWorkerStatusList(res.payload.WorkerStatusList);
        setDepartments(res.payload.Departments);
        setCategories(res.payload.Categories);
        setAllVendorRegs(res.payload.VendorRegs);
        setApprovalDetails(res.payload.WpApprovalList);
        const tempWpFootSign = [
          ...res.payload.WpApprovalList?.slice(0, 2), // First two elements
          res.payload.WpApprovalList?.slice(-1)[0], // Last element
        ];
        setWpFootSign(tempWpFootSign);
      });
    }
  }, []);

  const getAppList = (appLst) => {
    return (
      appLst &&
      appLst.length > 0 &&
      appLst.map((app) => {
        let tempApp: any = {};

        tempApp.WpApprovalDetailId = app.WpApprovalDetailId || 0;
        tempApp.WorkPermitId = app.WorkPermitId || 0;
        tempApp.DeptId = app.DeptId || app.DepartmentId;
        tempApp.UserName = app.UserName || "";
        tempApp.DepartmentName = app.DepartmentName || "";
        tempApp.PrimaryUserId = app.PrimaryUserId || null;
        tempApp.SecondaryUserId = app.SecondaryUserId || null;
        tempApp.DigitalSign = app.DigitalSign || "";
        tempApp.DigitalSignUrl = app.DigitalSignUrl || "";
        tempApp.Status = app.Status || 1;
        tempApp.Remarks1 = app.Remarks1 || "";
        tempApp.Remarks2 = app.Remarks2 || "";
        tempApp.CreatedBy = app.CreatedBy || "";
        tempApp.CreatedOn = app.CreatedOn || "";
        tempApp.ModifiedBy = app.ModifiedBy || "";
        tempApp.ModifiedOn = app.ModifiedOn || "";

        return tempApp;
      })
    );
  };

  useEffect(() => {});

  useEffect(() => {
    if (activeIndex == 2) {
      // if (
      //   !workPermitFormik.values.CategoryId ||
      //   workPermitFormik.values.CategoryId.length > 0
      //     ? workPermitFormik.values.CategoryId.some((item) => item != 1)
      //     : true
      // ) {
      handleWorkNature(
        "CategoryId",
        {},
        workPermitFormik.values.CategoryId,
        [],
        []
      );
      // }
    }
  }, [activeIndex]);

  const setList = (res, resChangeVendor) => {
    let tempWorkerDetails =
      resChangeVendor?.tempWorkerDetail &&
      resChangeVendor?.tempWorkerDetail.length > 0 &&
      createEditData == null
        ? resChangeVendor?.tempWorkerDetail
        : res.payload.WpWorkerDetail;
    let tempWorkerDocDetails =
      resChangeVendor?.tempWorkerDocDetail &&
      resChangeVendor?.tempWorkerDocDetail.length > 0 &&
      createEditData == null
        ? resChangeVendor?.tempWorkerDocDetail
        : res.payload.WpWorkerDocDetail;

    let tempCompDocDetails = res.payload.WpCompanyDocDetail;
    setWpCompanyDocs(tempCompDocDetails);

    let tempWpApprovalLists =
      resChangeVendor?.tempWpApprovalList &&
      resChangeVendor?.tempWpApprovalList.length > 0 &&
      createEditData == null
        ? resChangeVendor?.tempWpApprovalList
        : res.payload.WpApprovalList;
    // if (!tempWpApprovalLists || tempWpApprovalLists.length == 0) {
    //   resetAllForm();
    //   return toastValidation(
    //     "Please Create Approval Configuration for Work Permit."
    //   );
    // }
    let workPermitHead =
      resChangeVendor?.tempVendorHeader && createEditData == null
        ? resChangeVendor?.tempVendorHeader
        : res.payload.WorkPermitHeader;

    setWorkerDocList(res.payload.WorkDocs);
    setStatusList(res.payload.StatusList);
    setWorkOrganisers(res.payload.WorkOrganiser);
    setWorkerStatusList(res.payload.WorkerStatusList);
    setDepartments(res.payload.Departments);
    setCategories(res.payload.Categories);
    if (createEditData != null) {
      setWpCatDetails(res.payload.WpCategoryDetail);
    }
    const tempApprLists = getAppList(tempWpApprovalLists);
    if (tempApprLists && tempApprLists.length > 0) {
      setApprovalDetails(tempApprLists);
      const tempWpFootSign = [
        ...tempApprLists?.slice(0, 2),
        tempApprLists?.slice(-1)[0],
      ];
      setWpFootSign(tempWpFootSign);
    }

    if (createEditData != null) {
      let tempSelectedWorkNature = res.payload.WpCategoryDetail.map(
        (item) => item.CategoryId
      );
      // if (
      //   !workPermitFormik.values.CategoryId ||
      //   workPermitFormik.values.CategoryId.length > 0
      //     ? workPermitFormik.values.CategoryId.some((item) => item != 1)
      //     : true
      // ) {
      handleWorkNature(
        "CategoryId",
        {},
        tempSelectedWorkNature,
        res.payload.WpCategoryDetail,
        res.payload.Categories
      );
      // }
    }

    if (workPermitHead) {
      // setWorkPermitHeader(workPermitHead);
      workPermitFormik.setFieldValue("ContractValidity", [
        new Date(workPermitHead.ValidFrom),
        new Date(workPermitHead.ValidTo),
      ]);

      workPermitFormik.setFieldValue(
        "ValidFrom",
        new Date(workPermitHead.ValidFrom)
      );
      workPermitFormik.setFieldValue("DeptId", workPermitHead.DeptId);
      workPermitFormik.setFieldValue(
        "ValidTo",
        new Date(workPermitHead.ValidTo)
      );
    }

    // workerDoc = { file: { ...event.files } };
    // if (workPermitFormik.values.WorkerDocType) {
    //   workerDoc.WorkerDocType = workerDocList.filter(
    //     (item) => item.MetaSubId == workPermitFormik.values.WorkerDocType
    //   )[0].MetaSubDescription;
    // }
    // workerDoc.WorkerDocRefNo = workPermitFormik.values.WorkerDocNumber;
    // workerDoc.FileName =
    //   event.files[0].lastModified + "_" + event.files[0].name;
    // workerDoc.FileBlobUrl = blobToURL(event.files[0]);
    if (tempWorkerDetails && tempWorkerDetails.length > 0) {
      workPermitFormik.setFieldValue(
        "Manpower",
        tempWorkerDetails?.filter((item) => item.IsWorking == true).length
      );
    }
    let workerDtl = JSON.parse(JSON.stringify(tempWorkerDetails));
    let workerDoc: any = {};
    if (tempWorkerDocDetails && tempWorkerDocDetails.length > 0) {
      const wpWorkerDocsTemp = [...tempWorkerDocDetails];
      if (workerDtl && workerDtl.length > 0) {
        const promises = workerDtl.map(async (item, workInd) => {
          item.MobileNo = item.MobileNo;
          item.MailId = item.MailId;
          item.WpValidFrom =
            item.ValidFrom && item.ValidFrom != ""
              ? new Date(item.ValidFrom)
              : new Date(workPermitFormik?.values?.ValidFrom);
          item.WpValidTo =
            item.ValidTo && item.ValidTo != ""
              ? new Date(item.ValidTo)
              : new Date(workPermitFormik?.values?.ValidTo);
          item.WpContractValidity =
            item.WpValidFrom &&
            item.WpValidFrom !== "" &&
            item.WpValidTo &&
            item.WpValidTo !== ""
              ? [new Date(item.WpValidFrom), new Date(item.WpValidTo)]
              : workPermitFormik?.values?.ContractValidity;
          item.WorkerStatus = item.Status == 1 ? "Active" : "In Active";
          item.IsIncharge = item.IsIncharge || 0;
          item.IsWorking = item.IsWorking || false;
          item.WpWorkerDocs = [];

          const docPromises = wpWorkerDocsTemp
            .filter((element) => {
              const detailIdKey =
                Object.keys(resChangeVendor).length > 0 &&
                createEditData == null
                  ? "VRWorkerDetailId"
                  : "WPWorkerDetailId";

              return element[detailIdKey] === item[detailIdKey];
            })
            .map(async (element) => {
              const docDtl = { ...element };
              docDtl.FileName = element.DocumentName;

              var resFile = null;
              if (element.DocumentFullUrl != null) {
                resFile = await urlToFile(element.DocumentFullUrl);
              }

              docDtl.file = resFile;
              docDtl.file.FileName = element.DocumentName;
              docDtl.FileBlobUrl = fileToBlobURL(resFile);
              docDtl.WorkerDocRefNo = element.DocumentNo;
              docDtl.DocTypeName = element.DocumentTypeName;
              docDtl.Workerindex = workInd;

              return docDtl;
            });

          item.WpWorkerDocs = await Promise.all(docPromises);
          return item;
        });

        Promise.all(promises).then((updatedWorkerDtl) => {
          const allWorkerDocs = updatedWorkerDtl.flatMap((item) =>
            item.WpWorkerDocs.map((doc) => doc.file)
          );

          const documentMap = new Map();

          // Populate document map
          tempWorkerDocDetails.forEach((doc) => {
            const workerId =
              Object.keys(resChangeVendor).length > 0 && createEditData == null
                ? doc.VRWorkerDetailId
                : doc.WPWorkerDetailId;
            if (!documentMap.has(workerId)) {
              documentMap.set(workerId, []);
            }
            documentMap.get(workerId).push(doc);
          });

          const combinedList = tempWorkerDetails.map((worker, index) => ({
            ...worker,
            WpWorkerDocs: (
              documentMap.get(
                Object.keys(resChangeVendor).length > 0 &&
                  createEditData == null
                  ? worker.VRWorkerDetailId
                  : worker.WPWorkerDetailId
              ) || []
            ).map((doc) => ({
              ...doc,
              Workerindex: index,
            })),
          }));

          // let updatedCombinedList = combinedList.map((combItem) => {
          //   delete combItem.VRWorkerDetailId;
          //   delete combItem.VRWorkerDocId;
          //   combItem.WpWorkerDetailId = 0;
          //   combItem.WpWorkerDocId = 0;
          // });
          setWpWorkerDetails(combinedList);
          setWorkerDocsFiles(allWorkerDocs);
          setWorkPermitWorkers(updatedWorkerDtl);
          setTempWorkPermitWorkersGrid(
            updatedWorkerDtl.filter((item) => item.IsWorking)
          );
          setWorkerPermitAll(
            updatedWorkerDtl.filter((item) => item.IsWorking).length ===
              updatedWorkerDtl.length
          );
        });
      }
    }

    // setWpCompanyDocs(res.payload.WpCompanyDocDetail);

    // let companyDtl = JSON.parse(JSON.stringify(res.payload.WpCompanyDocDetail));
    // const wpCompanyDocs = [...res.payload.WpCompanyDocDetail];
    // // const promisesCompanyDocs = companyDtl.map(async (item) => {

    // const docPromises = wpCompanyDocs.map(async (element) => {
    //   const docDtl = { ...element };
    //   docDtl.FileName = element.DocumentName;

    //   const resFile = await urlToFile(element.DocumentFullUrl);

    //   docDtl.file = resFile;
    //   docDtl.FileBlobUrl = fileToBlobURL(resFile);

    //   docDtl.CompanyDocRefNo = element.DocumentNo;
    //   return docDtl;
    // });
    // let companyDocsAll = Promise.all(docPromises);
    // item = await Promise.all(docPromises);
    // return item;
    // });

    // Promise.all(docPromises).then((updatedCompanyDtl) => {
    //   let allCompanyDocs = updatedCompanyDtl.map((item) => item.file);
    //   setCompanyDocsFiles(allCompanyDocs);
    //   setCompanyDocs(updatedCompanyDtl);
    // });

    //     let compDoc: any = {};
    //     compDoc = { file: { ...event.files[0] } };

    //
    //

    //     if (workPermitFormik.values.CompanyDocType) {
    //       compDoc.CompanyDocType = companyDocList.filter(
    //         (item) => item.MetaSubId == workPermitFormik.values.CompanyDocType
    //       )[0].MetaSubDescription;
    //     }
    // +
    //     compDoc.CompanyDocRefNo = workPermitFormik.values.CompanyDocNumber;
    //     compDoc.FileName = event.files[0].lastModified + "_" + event.files[0].name;

    // setWorkPermitWorkers([
    //   ...workPermitWorkers,
    //   {
    //     WorkerName: res.payload.WorkPermitHeader.WorkerName,
    //     WorkerPhoneNo: res.payload.WorkPermitHeader.CountryCode,
    //     WorkerMailID: res.payload.WorkPermitHeader.WorkerMailID,
    //     WorkerStatus: res.payload.WorkPermitHeader.WorkerStatus
    //       ? "Active"
    //       : "In Active",
    //     WorkerDocs: workerDocs,
    //   },
    // ]);
  };

  const [globalFilterValue, setGlobalFilterValue] = useState<string>("");
  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };
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
    workPermitFormik.setFieldValue(event.target.name, event.value);

    if (event.target.name == "ContractValidity") {
      var validto;
      if(event?.value[1] != null){
        validto = new Date(
          event?.value[1].getFullYear(),
          event?.value[1].getMonth(),
          event?.value[1].getDate()
        );
        validto.setHours(23, 59, 59, 999);
      }
      else {
        validto = event?.value[1]
      }
      wpWorkerDetails.map((workItem) => {
        (workItem.ValidFrom = event?.value[0]),
          (workItem.ValidTo = validto),
          (workItem.WpContractValidity = [event?.value[0], validto]);
      });
      workPermitWorkers.map((workItem) => {
        (workItem.ValidFrom = event?.value[0]),
          (workItem.ValidTo = validto),
          (workItem.WpContractValidity = [event?.value[0], validto]);
      });
      workPermitFormik.setFieldValue("WpContractValidity", [
        event?.value[0],
        validto,
      ]);
    }
  };

  const handleInchargeChange = (event, rowData, rowIndex, col) => {
    if (rowData.Status == 2) {
      toast.current?.show({
        severity: "warn",
        summary: "Warning Message",
        detail: "Please Select Active Worker.",
      });
      return;
    }

    const isChecked = event.checked ? 1 : 0;

    const workPermitWorkersDtl = workPermitWorkers.map((worker, index) => {
      return {
        ...worker,
        IsIncharge: index === rowIndex.rowIndex && isChecked === 1 ? 1 : 0,
      };
    });
    setWorkPermitWorkers(workPermitWorkersDtl);
    setTempWorkPermitWorkersGrid(
      workPermitWorkersDtl.filter((item) => item.IsWorking)
    );
    setWorkerPermitAll(
      workPermitWorkersDtl.filter((item) => item.IsWorking).length ===
        workPermitWorkers.length
    );

    const wpWorkerDetailsDtl = wpWorkerDetails.map((worker, index) => {
      return {
        ...worker,
        IsIncharge: index === rowIndex.rowIndex && isChecked === 1 ? 1 : 0,
      };
    });
    setWpWorkerDetails(wpWorkerDetailsDtl);
  };

  const handleSelect = (name, other, value) => {
    workPermitFormik.setFieldValue(name, value);
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

  const companyDocUpload = (event) => {
    if (event.files[0]) {
      const validatedFile: any = fileValidate(event.files[0], 1);
      if (validatedFile) {
        let compDoc: any = {};
        let compDocsDetail: any = {};

        compDoc = { file: event.files[0] };

        if (workPermitFormik.values.CompanyDocType) {
          compDoc.CompanyDocType = companyDocList.filter(
            (item) => item.MetaSubId == workPermitFormik.values.CompanyDocType
          )[0].MetaSubDescription;
        }
        compDoc.CompanyDocRefNo = workPermitFormik.values.CompanyDocNumber;
        compDoc.FileName =
          event.files[0].lastModified + "_" + event.files[0].name;
        compDoc.FileBlobUrl = blobToURL(event.files[0]);

        compDocsDetail.CompanyId = +localStorage["CompanyId"];
        compDocsDetail.PlantId = +localStorage["PlantId"];
        compDocsDetail.GateId = +localStorage["GateId"];
        compDocsDetail.WPCompanyDocId = 0;
        compDocsDetail.WorkPermitId = 0;
        compDocsDetail.DocumentName =
          event.files[0].lastModified + "_" + event.files[0].name;
        compDocsDetail.DocumentNo = workPermitFormik.values.CompanyDocNumber;
        compDocsDetail.DocumentUrl =
          event.files[0].lastModified + "_" + event.files[0].name;
        compDocsDetail.Remarks = "";

        setCompanyDocs([...companyDocs, compDoc]);
        compDoc.file.FileName = compDoc.FileName;
        setCompanyDocsFiles([...companyDocsFiles, compDoc.file]);
        setWpCompanyDocs([...wpCompanyDocs, compDocsDetail]);

        workPermitFormik.setFieldValue("CompanyDocType", []);
        workPermitFormik.setFieldValue("CompanyDocNumber", "");
        CompanyDocRef?.current?.clear();
      }
    } else {
      return toastValidation("Please Select Valid Files Pdf or Png, Jpeg");
    }
  };

  var generatedWorkerIndex = null;
  const getNextWorkerIndex = (ind) => {
    if (wpWorkerDetails.length === 0) {
      return 0;
    }
    if (generatedWorkerIndex !== null) {
      return generatedWorkerIndex;
    }

    const workerIndices: any = new Set(
      wpWorkerDetails.flatMap((detail) =>
        detail.WpWorkerDocs.map((doc) => doc.Workerindex)
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

        if (workPermitFormik.values.WorkerDocType) {
          workerDoc.WorkerDocTypeName = workerDocList.filter(
            (item) => item.MetaSubId == workPermitFormik.values.WorkerDocType
          )[0].MetaSubDescription;
        }
        workerDoc.DocTypeName = workerDocList.filter(
          (item) => item.MetaSubId == workPermitFormik.values.WorkerDocType
        )[0].MetaSubDescription;
        workerDoc.DocumentNo = workPermitFormik.values.WorkerDocNumber;

        workerDoc.CompanyId = +localStorage["CompanyId"];
        workerDoc.PlantId = +localStorage["PlantId"];
        workerDoc.GateId = +localStorage["GateId"];
        workerDoc.DocumentType = workPermitFormik.values.WorkerDocType;
        workerDoc.WorkerDocRefNo = workPermitFormik.values.WorkerDocNumber;
        workerDoc.DocumentName = currentFileName;
        workerDoc.DocumentUrl = currentFileName;
        workerDoc.FileName = currentFileName;
        workerDoc.FileBlobUrl = blobToURL(event.files[0]);
        workerDoc.Status = 75;
        workerDoc.Workerindex = currWorkerInd;

        workerDocsDetail.CompanyId = +localStorage["CompanyId"];
        workerDocsDetail.PlantId = +localStorage["PlantId"];
        workerDocsDetail.GateId = +localStorage["GateId"];
        workerDocsDetail.WPCompanyDocId = 0;
        workerDocsDetail.WPWorkerDetailId = 0;
        workerDocsDetail.DocumentName = currentFileName;
        workerDocsDetail.FileName = currentFileName;
        workerDocsDetail.DocumentNo = workPermitFormik.values.WorkerDocNumber;
        workerDocsDetail.DocumentType = workPermitFormik.values.WorkerDocType;
        workerDocsDetail.DocumentUrl = currentFileName;
        workerDocsDetail.Remarks = "";
        workerDocsDetail.Status = 74;
        workerDocsDetail.file = event.files[0];
        workerDocsDetail.Workerindex = currWorkerInd;

        setWorkerDocs([...workerDocs, workerDoc]);
        setWorkerTempDocs([...workerTempDocs, workerDoc]);
        workerDoc.file.FileName = workerDoc.FileName;
        workerDocsDetail.file.FileName = workerDocsDetail.FileName;
        setWorkerDocsFiles([...workerDocsFiles, workerDoc.file]);
        setWpWorkerDocs([...wpWorkerDocs, workerDocsDetail]);
        resetWorkerDoc();
      }
    } else {
      return toastValidation("Please Select Valid Files Pdf or Png, Jpeg");
    }
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
      window.open(item?.FileBlobUrl);
    }
  };

  const deleteWorkerFile = (item, e) => {
    e.stopPropagation();

    let foundDoc = workerDocs.filter((cDoc) => cDoc.FileName == item.FileName);
    let filteredWorkerDocsFiles = workerDocsFiles.filter(
      (file) => !foundDoc.some((doc) => doc.file.name === file.name)
    );
    setWorkerDocsFiles(filteredWorkerDocsFiles);

    let foundDocInd = workerDocs.indexOf(foundDoc[0]);
    if (foundDocInd >= 0 && foundDocInd < workerDocs.length) {
      let dupWorkerDocs = [...workerDocs];
      let filteredCDoc = dupWorkerDocs.splice(foundDocInd, 1);

      setWorkerDocs(dupWorkerDocs);
      setWorkerTempDocs(dupWorkerDocs);
      workPermitFormik.setFieldValue("WorkerDocType", []);
      workPermitFormik.setFieldValue("WorkerDocNumber", "");
      WorkerDocRef?.current?.clear();
    }

    let foundWpDoc = wpWorkerDocs.filter(
      (cDoc) => cDoc.FileName == item.FileName
    );
    let foundWpDocInd = wpWorkerDocs.indexOf(foundDoc[0]);
    if (foundWpDocInd >= 0 && foundWpDocInd < wpWorkerDocs.length) {
      let dupWpWorkerDocs = [...wpWorkerDocs];
      let filteredCWpDoc = dupWpWorkerDocs.splice(foundWpDocInd, 1);
      setWpWorkerDocs(dupWpWorkerDocs);

      workPermitFormik.setFieldValue("WorkerDocType", []);
      workPermitFormik.setFieldValue("WorkerDocNumber", "");
      WorkerDocRef?.current?.clear();
    }
  };

  const deleteCompanyFile = (item, e) => {
    e.stopPropagation();

    let foundDoc = companyDocs.filter((cDoc) => cDoc.FileName == item.FileName);
    let filteredCompanyDocsFiles = companyDocsFiles.filter(
      (file) => !foundDoc.some((doc) => doc.file.name === file.name)
    );
    setCompanyDocsFiles(filteredCompanyDocsFiles);

    let foundDocInd = companyDocs.indexOf(foundDoc[0]);
    if (foundDocInd >= 0 && foundDocInd < companyDocs.length) {
      let dupCompanyDocs = [...companyDocs];
      let filteredCDoc = dupCompanyDocs.splice(foundDocInd, 1);

      setCompanyDocs(dupCompanyDocs);
      workPermitFormik.setFieldValue("CompanyDocType", []);
      workPermitFormik.setFieldValue("CompanyDocNumber", "");
      CompanyDocRef?.current?.clear();
    }

    let foundWpDoc = wpCompanyDocs.filter(
      (cDoc) => cDoc.FileName == item.FileName
    );
    let foundWpDocInd = wpCompanyDocs.indexOf(foundDoc[0]);
    if (foundWpDocInd >= 0 && foundWpDocInd < wpCompanyDocs.length) {
      let dupWpCompanyDocs = [...wpCompanyDocs];
      let filteredCWpDoc = dupWpCompanyDocs.splice(foundWpDocInd, 1);

      setWpCompanyDocs(dupWpCompanyDocs);

      workPermitFormik.setFieldValue("CompanyDocType", []);
      workPermitFormik.setFieldValue("CompanyDocNumber", "");
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
      workPermitFormik.values.WorkerName == "" ||
      workPermitFormik.values.WorkerName == null
    ) {
      return toastValidation("Please Enter Worker Name.");
    }
    if (
      workPermitFormik?.values?.WpContractValidity == null ||
      workPermitFormik?.values?.WpContractValidity[0] == "" ||
      workPermitFormik?.values?.WpContractValidity == null ||
      workPermitFormik?.values?.WpContractValidity[0] == null
    ) {
      return toastValidation("Please Select Validity From.");
    }
    if (
      workPermitFormik?.values?.WpContractValidity == null ||
      workPermitFormik?.values?.WpContractValidity[1] == "" ||
      workPermitFormik?.values?.WpContractValidity == null ||
      workPermitFormik?.values?.WpContractValidity[1] == null
    ) {
      return toastValidation("Please Select Validity To.");
    }
    if (
      workPermitFormik.values.CountryCode == "" ||
      workPermitFormik.values.CountryCode == null
    ) {
      return toastValidation("Please Enter Phone No.");
    }
    if (workPermitFormik.values.CountryCode.length != 10) {
      return toastValidation("Please Enter Valid Phone No.");
    }
    // if (
    //   workPermitFormik.values.WorkerMailID == "" ||
    //   workPermitFormik.values.WorkerMailID == null
    // ) {
    //   return toastValidation("Please Enter Mail ID.");
    // }
    if (
      workPermitFormik.values.WorkerMailID != "" &&
      workPermitFormik.values.WorkerMailID != null &&
      !emailRegExp.test(workPermitFormik.values.WorkerMailID)
    ) {
      return toastValidation("Please Enter Valid Mail ID.");
    }
    let emailExists = false;
    if (workPermitFormik.values.WorkerMailID != null) {
      workPermitWorkers.forEach((itemWP, itemInd) => {
        if (
          workPermitFormik.values.WorkerMailID != "" &&
          workPermitFormik.values.WorkerMailID == itemWP.WorkerMailID &&
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
    workPermitWorkers.forEach((itemWP, itemInd) => {
      if (
        workPermitFormik.values.CountryCode != "" &&
        workPermitFormik.values.CountryCode === itemWP.MobileNo &&
        (activeGridInd != itemInd || workerMode)
      ) {
        mobileExists = true;
      }
    });
    if (mobileExists) {
      return toastValidation("Mobile No Already Exists for a Worker.");
    }
    if (
      workPermitFormik.values.WorkerStatus == "" ||
      workPermitFormik.values.WorkerStatus == null
    ) {
      return toastValidation("Please Select Worker Status.");
    }
    if (workerDocs && workerDocs.length == 0) {
      return toastValidation("Please Upload Atleast One Worker Document");
    }
    return true;
  };

  const resetWorker = () => {
    workPermitFormik.setFieldValue("WorkerName", "");
    workPermitFormik.setFieldValue("CountryCode", "");
    workPermitFormik.setFieldValue("WorkerMailID", "");
    workPermitFormik.setFieldValue("WorkerStatus", 1);
    workPermitFormik.setFieldValue("WpContractValidity", []);
    resetWorkerDoc();
    setWpWorkerDocs([]);
    // setWpWorkerDetails([]);
    setWorkerDocs([]);
    setWorkerTempDocs([]);
    setWorkerDocsFiles([]);
    setWorkerMode(true);
  };
  const resetWorkerDoc = () => {
    workPermitFormik.setFieldValue("WorkerDocType", []);
    workPermitFormik.setFieldValue("WorkerDocNumber", "");
    WorkerDocRef?.current?.clear();
  };

  const addWorker = () => {
    let validated: any = validateGridWorkers();
    if (validated) {
      var vto = workPermitFormik?.values?.WpContractValidity[1];
      if(vto && vto != null) {
        vto = new Date(
          workPermitFormik?.values?.WpContractValidity[1].getFullYear(),
          workPermitFormik?.values?.WpContractValidity[1].getMonth(),
          workPermitFormik?.values?.WpContractValidity[1].getDate()
        );
        vto.setHours(23, 59, 59, 999);
      }
      if (workerMode) {
        setWorkPermitWorkers([
          ...workPermitWorkers,
          {
            WorkerName: workPermitFormik.values.WorkerName,
            WpContractValidity: workPermitFormik?.values?.WpContractValidity,
            ValidFrom: workPermitFormik?.values?.WpContractValidity[0],
            ValidTo: vto,
            MobileNo: workPermitFormik.values.CountryCode,
            MailId: workPermitFormik.values.WorkerMailID,
            WorkerStatus:
              workPermitFormik.values.WorkerStatus == 1
                ? "Active"
                : "In Active",
            Status: workPermitFormik.values.WorkerStatus,
            IsWorking: workPermitFormik.values.IsWorking || 0,
            IsIncharge: workPermitFormik.values.IsIncharge || 0,
            WorkerDocs: workerTempDocs,
          },
        ]);
        const currInd = workerTempDocs.map((doc) => doc.Workerindex)[0];
        setWpWorkerDetails([
          ...wpWorkerDetails,
          {
            WpWorkerDetailId: 0,
            WorkPermitId: 0,
            WpContractValidity: workPermitFormik?.values?.WpContractValidity,
            ValidFrom: workPermitFormik.values.WpContractValidity[0],
            ValidTo: vto,
            WorkerName: workPermitFormik.values.WorkerName,
            MobileNo: workPermitFormik.values.CountryCode,
            MailId: workPermitFormik.values.WorkerMailID,
            Status: workPermitFormik.values.WorkerStatus,
            IsWorking: workPermitFormik.values.IsWorking || 0,
            IsIncharge: workPermitFormik.values.IsIncharge || 0,
            WpWorkerDocs: wpWorkerDocs.filter(
              (wpItem) => wpItem.Workerindex == currInd
            ),
          },
        ]);
      } else {
        let combinedArray = [];
        if (wpWorkerDocs && wpWorkerDocs.length > 0) {
          workerDocs.forEach((docItem, docIndex) => {
            const matchingWpItem = wpWorkerDocs.find((wpItem, wpIndex) => {
              return (
                docItem.Workerindex === wpItem.Workerindex &&
                docItem.DocumentType === wpItem.DocumentType &&
                (wpItem.FileName === docItem.FileName ||
                  wpItem.DocumentName === docItem.DocumentName)
              );
            });

            if (matchingWpItem) {
              combinedArray.push({
                ...docItem,
                ...matchingWpItem,
              });
            } else {
              combinedArray.push({ ...docItem });
            }
          });
        } else {
          combinedArray = [...workerDocs];
        }

        let tempWorkerDocs = [...combinedArray];

        if (editGridData) {
          let tempWorkPermitWorkers = [...workPermitWorkers];

          // const venRegInd = tempWorkPermitWorkers.findIndex(
          //   (vItem) => vItem.WorkerPhoneNo == editGridData.WorkerPhoneNo
          // );
          const venRegInd = activeGridInd;
          const updateWorkPermitWorkers = tempWorkPermitWorkers[venRegInd];

          updateWorkPermitWorkers.WorkerName =
            workPermitFormik.values.WorkerName;
          updateWorkPermitWorkers.MobileNo =
            workPermitFormik.values.CountryCode;
          updateWorkPermitWorkers.MailId = workPermitFormik.values.WorkerMailID;
          updateWorkPermitWorkers.WpContractValidity =
            workPermitFormik?.values?.WpContractValidity;
          updateWorkPermitWorkers.ValidFrom =
            workPermitFormik?.values?.WpContractValidity[0];
          updateWorkPermitWorkers.ValidTo =
            vto;
          updateWorkPermitWorkers.Status = workPermitFormik.values.WorkerStatus;
          updateWorkPermitWorkers.WorkerStatus =
            workPermitFormik.values.WorkerStatus == 1 ? "Active" : "In Active";
          if (updateWorkPermitWorkers.IsIncharge == 1) {
            if (workPermitFormik.values.WorkerStatus == 2) {
              updateWorkPermitWorkers.IsIncharge = 2;
            } else {
              updateWorkPermitWorkers.IsIncharge =
                updateWorkPermitWorkers.IsIncharge;
            }
          }
          if (updateWorkPermitWorkers.IsWorking == 1) {
            if (workPermitFormik.values.WorkerStatus == 2) {
              updateWorkPermitWorkers.IsWorking = 0;
            } else {
              updateWorkPermitWorkers.IsWorking =
                updateWorkPermitWorkers.IsWorking;
            }
          }
          updateWorkPermitWorkers.WorkerDocs = [];
          updateWorkPermitWorkers.WorkerDocs = tempWorkerDocs;

          delete editGridData.WpWorkerDocs;
          editGridData.WorkerName = workPermitFormik.values.WorkerName;
          editGridData.WorkerPhoneNo = workPermitFormik.values.CountryCode;
          editGridData.WpContractValidity =
            workPermitFormik?.values?.WpContractValidity;
          editGridData.ValidFrom =
            workPermitFormik?.values?.WpContractValidity[0];
          editGridData.ValidTo =
          vto;
          editGridData.WorkerMailID = workPermitFormik.values.WorkerMailID;
          editGridData.Status = workPermitFormik.values.WorkerStatus;
          editGridData.WorkerStatus =
            workPermitFormik.values.WorkerStatus == 1 ? "Active" : "In Active";
          if (editGridData.IsIncharge == 1) {
            if (workPermitFormik.values.WorkerStatus == 2) {
              editGridData.IsIncharge = 0;
            } else {
              editGridData.IsIncharge = editGridData.IsIncharge;
            }
          }
          if (editGridData.IsWorking == 1) {
            if (workPermitFormik.values.WorkerStatus == 2) {
              editGridData.IsWorking = 0;
            } else {
              editGridData.IsWorking = editGridData.IsWorking;
            }
          }
          editGridData.WpWorkerDocs = [];
          editGridData.WpWorkerDocs = tempWorkerDocs;

          setWorkPermitWorkers(tempWorkPermitWorkers);

          let updatedWpWorkerDetails = [...wpWorkerDetails];

          const indexToUpdate = activeGridInd;

          // const indexToUpdate = updatedWpWorkerDetails.findIndex(
          //   (item) => item.VRWorkerDetailId === editGridData.VRWorkerDetailId
          // );
          // const indexToUpdate = updatedWpWorkerDetails.findIndex(
          //   (item) => item.WPWorkerDetailId === editGridData.WPWorkerDetailId
          // );
          let itemUpdateToDateDocs = [...tempWorkerDocs];
          // itemUpdateToDateDocs.forEach((itemDel: any) => {
          //   delete itemDel.file;
          // });
          if (indexToUpdate !== -1) {
            const itemToUpdate = updatedWpWorkerDetails[indexToUpdate];
            if (itemToUpdate) {
              itemToUpdate.WorkerName = workPermitFormik.values.WorkerName;
              itemToUpdate.MobileNo = workPermitFormik.values.CountryCode;
              itemToUpdate.MailId = workPermitFormik.values.WorkerMailID;
              itemToUpdate.Status = workPermitFormik.values.WorkerStatus;
              itemToUpdate.WpContractValidity =
                workPermitFormik.values.WpContractValidity;
              itemToUpdate.ValidFrom =
                workPermitFormik.values.WpContractValidity[0];
              itemToUpdate.ValidTo =
                vto;
              itemToUpdate.WpWorkerDocs = [];
              itemToUpdate.WpWorkerDocs = itemUpdateToDateDocs;
              setWpWorkerDetails(updatedWpWorkerDetails);
            }
          } else {
            let newupdatedWpWorkerDetails = updatedWpWorkerDetails;
            editGridData.WpWorkerDocs = editGridData.WpWorkerDocs;
            newupdatedWpWorkerDetails.push(editGridData);
            setWpWorkerDetails(newupdatedWpWorkerDetails);
          }
        } else {
          setWorkPermitWorkers([
            ...workPermitWorkers,
            {
              WorkerName: workPermitFormik.values.WorkerName,
              MobileNo: workPermitFormik.values.CountryCode,
              WpContractValidity: workPermitFormik.values.WpContractValidity,
              ValidFrom: workPermitFormik.values.WpContractValidity[0],
              ValidTo: vto,
              MailId: workPermitFormik.values.WorkerMailID,
              WorkerStatus:
                workPermitFormik.values.WorkerStatus == 1
                  ? "Active"
                  : "In Active",
              Status: workPermitFormik.values.WorkerStatus,
              WorkerDocs: workerDocs,
            },
          ]);
          setWpWorkerDetails([
            ...wpWorkerDetails,
            {
              WpWorkerDetailId: 0,
              WorkPermitId: 0,
              WorkerName: workPermitFormik.values.WorkerName,
              WpContractValidity: workPermitFormik.values.WpContractValidity,
              ValidFrom: workPermitFormik.values.WpContractValidity[0],
              ValidTo: vto,
              MobileNo: workPermitFormik.values.CountryCode,
              MailId: workPermitFormik.values.WorkerMailID,
              Status: workPermitFormik.values.WorkerStatus,
              WpWorkerDocs: wpWorkerDocs,
            },
          ]);
        }

        // const existingWorkerIndex = workPermitWorkers.findIndex(
        //   (worker) => worker.WpWorkerDetailId === 0
        // );
        // if (existingWorkerIndex !== -1) {
        //   const updatedWorkPermitWorkers = [...workPermitWorkers];
        //   updatedWorkPermitWorkers[existingWorkerIndex] = {
        //     ...updatedWorkPermitWorkers[existingWorkerIndex],
        //     WorkerName: workPermitFormik.values.WorkerName,
        //     WorkerPhoneNo: workPermitFormik.values.CountryCode,
        //     WorkerMailID: workPermitFormik.values.WorkerMailID,
        //     WorkerStatus: workPermitFormik.values.WorkerStatus
        //       ? "Active"
        //       : "In Active",
        //     WorkerDocs: workerDocs,
        //   };
        //   setWorkPermitWorkers(updatedWorkPermitWorkers);
        // }

        // const existingWpWorkerIndex = wpWorkerDetails.findIndex(
        //   (worker) => worker.WpWorkerDetailId !== 0
        // );
        // if (existingWpWorkerIndex !== -1) {
        //   // Update existing object
        //   const updatedWpWorkerDetails = [...wpWorkerDetails];
        //   updatedWpWorkerDetails[existingWpWorkerIndex] = {
        //     ...updatedWpWorkerDetails[existingWpWorkerIndex],
        //     WorkerName: workPermitFormik.values.WorkerName,
        //     MobileNo: workPermitFormik.values.CountryCode,
        //     MailId: workPermitFormik.values.WorkerMailID,
        //     Status: workPermitFormik.values.WorkerStatus,
        //     WpWorkerDocs: wpWorkerDocs,
        //   };
        //   setWpWorkerDetails(updatedWpWorkerDetails);
        // }
        setWorkerMode(true);
      }

      workPermitFormik.setFieldValue("WorkerName", "");
      workPermitFormik.setFieldValue("CountryCode", "");
      workPermitFormik.setFieldValue("WpContractValidity", null);
      workPermitFormik.setFieldValue("WpValidFrom", null);
      workPermitFormik.setFieldValue("WpValidTo", null);
      workPermitFormik.setFieldValue("WorkerMailID", "");
      workPermitFormik.setFieldValue("WorkerStatus", 1);
      setWorkerTempDocs([]);
      // setWorkerDocs([]);
      // setWpWorkerDocs([]);
    }
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
          {rowData.WpWorkerDocs &&
            rowData.WpWorkerDocs.map((item) => {
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
                  {WorkPermitHeader?.PrimaryUserId == +localStorage["UserId"] ||
                  rowData?.Status == 2 ? (
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

  const editWorkPermitWorker = (rowData, colItem) => {
    setWorkerMode(false);
    setEditGridData(rowData);
    setActiveGridInd(colItem.rowIndex);

    workPermitFormik.setFieldValue("WorkerName", rowData.WorkerName);
    workPermitFormik.setFieldValue(
      "WpContractValidity",
      rowData?.WpContractValidity ? rowData?.WpContractValidity : null
    );
    workPermitFormik.setFieldValue(
      "WpValidFrom",
      rowData.WpValidFrom ? rowData.WpValidFrom : null
    );
    workPermitFormik.setFieldValue(
      "WpValidTo",
      rowData.WpValidTo ? rowData.WpValidTo : null
    );
    workPermitFormik.setFieldValue("CountryCode", rowData.MobileNo);
    workPermitFormik.setFieldValue("WorkerMailID", rowData.MailId);
    workPermitFormik.setFieldValue(
      "WorkerStatus",
      rowData.WorkerStatus == "Active" ? 1 : 2
    );

    let rowDataFound = rowData.WpWorkerDocs
      ? rowData.WpWorkerDocs
      : rowData.WorkerDocs;
    let tempWorkerDocs = [...rowDataFound];

    if (WorkDocs && WorkDocs.length > 0) {
      tempWorkerDocs.map((tDocItem) => {
        tDocItem.WorkerDocTypeName = WorkDocs.filter(
          (item) => item.MetaSubId == tDocItem.DocumentType
        )[0].MetaSubDescription;
      });
    }
    setWorkerDocs(rowDataFound);
    setWorkerTempDocs(rowDataFound);
    setWpWorkerDocs(rowDataFound);

    let allWorkerDocs =
      rowDataFound &&
      rowDataFound.length > 0 &&
      rowDataFound.map((item) => item.file);
    setWorkerDocsFiles(allWorkerDocs);

    // let updateRowDataWpWorkerDtls = [...wpWorkerDetails];
    // setWpWorkerDetails(updateRowDataWpWorkerDtls);

    // let deleteRowData = [...workPermitWorkers];
    // deleteRowData.splice(colItem.rowIndex, 1);
    // setWorkPermitWorkers(deleteRowData);

    // let removedElement = updateRowDataWpWorkerDtls.splice(
    //   colItem.rowIndex,
    //   1
    // )[0];

    // updateRowDataWpWorkerDtls.splice(colItem.rowIndex, 1);
    // let removedEl = [removedElement];

    // setWpWorkerDocs(removedEl.map((item) => item.WpWorkerDocs)[0]);
  };

  const deleteWorkPermitWorker = (rowData, colItem) => {
    let deleteRowData = [...workPermitWorkers];
    deleteRowData.splice(colItem.rowIndex, 1);
    setWorkPermitWorkers(deleteRowData);

    let deleteRowDataWpWorkerDtls = [...wpWorkerDetails];
    deleteRowDataWpWorkerDtls.splice(colItem.rowIndex, 1);
    setWpWorkerDetails(deleteRowDataWpWorkerDtls);
    if (deleteRowDataWpWorkerDtls && deleteRowDataWpWorkerDtls.length == 0) {
      setWorkerPermitAll(false);
    }
    setWorkerMode(true);
    workPermitFormik.setFieldValue("WorkerName", "");
    workPermitFormik.setFieldValue("CountryCode", "");
    workPermitFormik.setFieldValue("WorkerMailID", "");
    workPermitFormik.setFieldValue("WpValidFrom", null);
    workPermitFormik.setFieldValue("WpValidTo", null);
    workPermitFormik.setFieldValue("WorkerStatus", 1);
    workPermitFormik.setFieldValue("WorkerDocType", null);
    workPermitFormik.setFieldValue("WorkerDocNumber", "");
    workPermitFormik.setFieldValue("WpContractValidity", null);
    setWorkerDocs([]);
    setWorkerDocsFiles([]);
    setWorkerTempDocs([]);
    setWpWorkerDocs([]);
    clearWorkerDoc();
    // }
  };
  const clearWorkerDoc = () => {
    WorkerDocRef?.current?.clear();
  };
  const actionBodyTemplate: any = (rowData, colItem) => {
    return (
      <div className="action-btn">
        <React.Fragment>
          <Button
            label=""
            title="Edit"
            icon="pi pi-pencil"
            className="mr-2 p-1 p-button-success"
            disabled={isView || rowData?.Status == 2}
            onClick={() => editWorkPermitWorker(rowData, colItem)}
          />
          <Button
            label=""
            severity="danger"
            icon="pi pi-trash"
            title="Delete"
            className="mr-2 p-1"
            disabled={isView || rowData?.Status == 2}
            onClick={() => deleteWorkPermitWorker(rowData, colItem)}
          />
        </React.Fragment>
      </div>
    );
  };

  const resetAllForm = () => {
    workPermitFormik.resetForm();
    resetOnlyForm();
  };

  const resetOnlyForm = () => {
    workPermitFormik.setFieldValue(
      "CategoryId",
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    );

    setWpWorkerDocs([]);
    setWpWorkerDetails([]);
    setWorkerDocs([]);
    setWorkerTempDocs([]);
    setWorkerDocsFiles([]);
    // setWpCatDetails([])
    // setWpAppConfig([])
    setCheckPointsPrint([]);
    // setWorkerDocList([]);
    setApprovalDetails([]);
    setWpFootSign([]);
    setWpCompanyDocs([]);
    setCompanyDocs([]);
    setCompanyDocsFiles([]);
    // setCompanyDocList([]);
    setActiveIndex(0);
    setWorkPermitWorkers([]);
    handleSelect("WorkerPhoneNo", {}, "+91");
    handleSelect("WorkerStatus", {}, 1);
    setWorkerMode(true);
  };

  const workPermitPrint = () => {
    setShowPrint(true);
  };

  const tabChange = (e) => {
    // pageLoadScript();
    if (e.index == 1) {
      let validWp = validateWorkPermit();
      if (!validWp) {
        setActiveIndex(0);
        return;
      } else {
        setActiveIndex(e.index);
      }
    } else if (e.index == 2) {
      let validWp = validateWorkPermit();
      let tempChargeWorking = workPermitWorkers.some(
        (item) =>
          (item.IsIncharge == 1 || item.IsIncharge == true) &&
          (item.IsWorking == 1 || item.IsWorking == true)
      );
      let tempWorking = workPermitWorkers.some(
        (item) => item.IsWorking == true
      );
      if (!validWp) {
        setActiveIndex(0);
        return;
      } else if (workPermitWorkers && workPermitWorkers.length == 0) {
        setActiveIndex(1);
        return toastValidation("Please Add Atleast One Worker");
      } else if (!tempWorking) {
        setActiveIndex(1);
        toastValidation("Please Add an Working Person.");
        return;
      } else if (!tempChargeWorking) {
        setActiveIndex(1);
        toastValidation(
          "Please Select an InCharge Person, Incharge Person should be a Working Person."
        );
        return;
      } else {
        setActiveIndex(e.index);
      }
    } else {
      setActiveIndex(e.index);
    }
  };

  const handlePrint = () => {
    var divContents = document.getElementById("work_permit_print").innerHTML;
    var a = window.open("", "", "height=1000, width=1000");

    a.document.write("<html>");
    a.document.write('<body style="padding:10px 20px;margin: 0px auto">');
    a.document.write(divContents);
    a.document.write(
      `</body>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap');
        * {
          font-family: 'Open Sans', sans-serif;
          font-weight: normal;
          font-size: 11px;
          margin: 0px;
        }
        .p-checkbox-box .p-highlight{
        display: none;
        }
        .p-hidden-accessible{border:0;clip:rect(0 0 0 0);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px}
        .no-print { display: none; }
        h4{font-weight: 700;}
        .text-center { text-align: center; }
        .border-1 { border-width: 1px !important; border-style: solid; }
        table { border-collapse: collapse; vertical-align: top; width: 100%; }
        .p-2 { padding: 0.5rem !important; }
        .pl-2 { padding-left: 0.5rem !important; }
        .pr-2 { padding-right: 0.5rem !important; }
        .gap-2 { gap: 0.5rem !important; }
        .flex { display: flex !important; }
        .col-12 { flex: 0 0 auto; padding: 0.5rem; width: 100%; }
        .font-bold { font-weight: 700 !important; }
        .border-bottom-1 { border-bottom-width: 1px !important; border-bottom-style: solid; }
        .border-right-1 { border-right-width: 1px !important; border-right-style: solid; }
        .text-2xl { font-size: 1.5rem !important; }
        .justify-content-center { justify-content: center !important; }
        .align-items-center { align-items: center !important; }
        .max-h-7rem {max-height: 7rem !important;}
        .max-h-3rem {max-height: 3rem !important;}
        .max-w-7rem {max-width: 7rem !important;}
        .max-h-5rem {max-height: 5rem !important;}
        .max-w-15rem {max-width: 15rem !important;}
        .max-w-12rem {max-width: 12rem !important;}
        .m-auto {margin: auto;}
        .d-block {display: block;}
        .flex-column{flex-direction: column;}
        /* Media query for print */
        @media print {
          body {
            margin: 0;  /* Remove default print margins */
          }
          @page {
            margin: 0;  /* Remove default page margins */
          }
        }
      </style>
      </html>`
    );

    a.document.close();
    a.print();
  };

  const HeadPrint = () => {
    return (
      <Button
        label="Print"
        severity="help"
        title="Print"
        icon="las la-print"
        className="p-1"
        // disabled={
        //   (WorkPermitHeader?.Status == 74 ||
        //     !isCreate ||
        //     isCreate) ||
        //   (WorkPermitHeader?.Status == 121 && isView)
        // }
        disabled={
          !isView ||
          WorkPermitHeader?.Status === 74 ||
          WorkPermitHeader?.Status === 76 ||
          WorkPermitHeader?.Status === 121
        }
        onClick={() => handlePrint()}
      />
    );
  };

  const handleWorkNature = (
    name,
    other,
    value,
    wpCatDtls = [],
    categorys = []
  ) => {
    let tempVal = [];

    tempVal = value;
    if (!tempVal.includes(1)) {
      tempVal.push(1);
    }

    workPermitFormik.setFieldValue(name, tempVal);

    const categoryArr = value.sort((a, b) => a - b).join(",");
    let vendChange = {
      CategoryId: categoryArr,
      PlantId: +localStorage["PlantId"],
      CompanyId: +localStorage["CompanyId"],
      WorkPermitId: (createEditData && createEditData.WorkPermitId) || 0,
    };
    const checkPntsFetched = dispatch(fetchCheckPoints(vendChange));
    checkPntsFetched
      .then((res) => {
        let tempCheckPnts = res.payload.WpCheckPoints;
        if (tempCheckPnts && tempCheckPnts.length > 0) {
          setCheckPointsAll(tempCheckPnts);

          const tempRem = checkPointRemTransform;
          setCheckPointsPrint(tempRem);
        }
      })
      .catch((err) => {
        toast.current?.show({
          severity: "error",
          summary: "Error Message",
          detail: JSON.stringify(error),
        });
      });
    const updatedCats = updateCategories(
      name,
      other,
      value,
      1,
      122,
      wpCatDtls,
      categorys
    );
  };

  const checkPointRemTransform = checkPointsAll.reduce((acc, item) => {
    if (createEditData && createEditData.WorkPermitId > 0) {
      if (!acc[item.CategoryName]) {
        acc[item.CategoryName] = [];
      }
      acc[item.CategoryName].push({
        description: item.Description,
        remark: item.Remarks,
      });
    } else {
      if (!acc[item.CategoryName]) {
        acc[item.CategoryName] = [];
      }
      acc[item.CategoryName].push({
        description: item.Description,
        remark: item.CategoryId == 1 ? 15 : null,
      });
    }

    return acc;
  }, {});

  const updateCategories = (
    name,
    other,
    value,
    type,
    remark,
    wpCatDtls = [],
    categorys = []
  ) => {
    let updatedCategoryDetails;
    var tempWpCatDtl =
      wpCatDtls && wpCatDtls.length > 0 ? wpCatDtls : wpCatDetails;

    var tempCatgorys =
      categorys && categorys.length > 0 ? categorys : categories;

    if (type === 1) {
      // If type is 1, use CategoryId to filter and update

      updatedCategoryDetails = tempWpCatDtl.filter((cat) =>
        value.includes(cat.CategoryId)
      );

      value.forEach((categoryId) => {
        const newCat = {
          CompanyId: +localStorage["CompanyId"],
          PlantId: +localStorage["PlantId"],
          GateId: +localStorage["GateId"],
          WPCategoryDetailId: 0,
          WorkPermitId: 0,
          CategoryId: categoryId,
          CategoryName: tempCatgorys.find(
            (catItem) => catItem.CategoryId === categoryId
          )?.CategoryName,
          RemarkStatus: remark,
        };

        const index = updatedCategoryDetails.findIndex(
          (cat) => cat.CategoryId === categoryId
        );

        if (index !== -1) {
          updatedCategoryDetails[index] = newCat;
        } else {
          updatedCategoryDetails.push(newCat);
        }
      });
    } else if (type === 0) {
      const categoryId = tempCatgorys.find(
        (catItem) => catItem.CategoryName === value
      )?.CategoryId;

      if (categoryId !== undefined) {
        const newCat = {
          CompanyId: +localStorage["CompanyId"],
          PlantId: +localStorage["PlantId"],
          GateId: +localStorage["GateId"],
          WPCategoryDetailId: 0,
          WorkPermitId: 0,
          CategoryId: categoryId,
          CategoryName: tempCatgorys.find(
            (catItem) => catItem.CategoryId === categoryId
          )?.CategoryName,
          RemarkStatus: remark,
        };

        // Check if the category already exists in wpCatDetails
        const index = tempWpCatDtl.findIndex(
          (cat) => cat.CategoryName === value
        );

        if (index !== -1) {
          // Update the existing entry
          updatedCategoryDetails = [...tempWpCatDtl];
          updatedCategoryDetails[index] = newCat;
        } else {
          // Add new entry
          updatedCategoryDetails = [...tempWpCatDtl, newCat];
        }
      } else {
        updatedCategoryDetails = [...tempWpCatDtl]; // If no match, retain existing details
      }
    }

    setWpCatDetails(updatedCategoryDetails);
  };

  const handleWpNext = (e) => {
    tabChange(e);
    // let validatedWorkPermit = validateWorkPermit();
    // if (validatedWorkPermit && !isView) {
    //   setActiveIndex(1);
    // }
  };

  const handleWpDetailNext = (e) => {
    tabChange(e);
    // let validWp = validateWorkPermit();
    // let tempCharge = workPermitWorkers.some((item) => item.IsIncharge == 1);
    // if (wpWorkerDetails && wpWorkerDetails.length == 0 && !isView) {
    //   setActiveIndex(1);
    //   return toastValidation("Please Enter Atleast One Worker");
    // }
    // else if (!validWp || !workPermitWorkers || workPermitWorkers.length == 0) {
    //   setActiveIndex(2);
    // }
  };

  const onChangeVendorId = (name, other, value) => {
    workPermitFormik.setFieldValue(name, value);

    if (typeof value == "string") {
    } else {
      // let vendType = workPermitFormik.values.VendorId;
      // if (!vendType) {
      //   toast.current?.show({
      //     severity: "warn",
      //     summary: "Warning Message",
      //     detail: "Please Select Vendor Name.",
      //   });
      //   return;
      // }
      let vendId = {
        VendorId: value?.VendorRegId,
        WorkPermitId: (createEditData && createEditData.WorkPermitId) || 0,
        PlantId: +localStorage["PlantId"],
        CompanyId: +localStorage["CompanyId"],
      };
      const vendorFetched = dispatch(onChangeVendor(vendId));
      vendorFetched
        .then((res) => {
          if (
            res.payload.WorkPermitHeader &&
            res.payload.WorkPermitHeader != ""
          ) {
            let resChangeVendor = {
              tempVendorHeader: res.payload.WorkPermitHeader,
              tempWorkerDetail: res.payload.WpWorkerDetail,
              tempWorkerDocDetail: res.payload.WpWorkerDocDetail,
              tempWpApprovalList: res.payload.WpApprovalList,
            };
            const result = createInitService();
            result.then((res) => {
              setList(res, resChangeVendor);
            });

            // setWpWorkerDetails(tempVendWorkers);
            // let tempVend = filteritemType.filter(
            //   (item) => item.VendorRegId == value.VendorRegId
            // )[0];
            // workPermitFormik.setFieldValue("ContractValidity", [
            //   new Date(tempVend.ValidFrom),
            //   new Date(tempVend.ValidTo),
            // ]);
            // setMaxValidDate(new Date(tempVend.ValidTo));
          }
        })
        .catch((err) => {
          toast.current?.show({
            severity: "error",
            summary: "Error Message",
            detail: JSON.stringify(error),
          });
        });

      // let obj = {
      //   VendorName: value.VendorName,
      //   text: vendType,
      // };
      // var result = dispatch(onChangeVendor(obj));
      // result
      //   .then((res) => {
      //     if (res.payload.tranStatus.result) {
      //       if (
      //         res.payload.VendorList &&
      //         res.payload.VendorList.length &&
      //         res.payload.VendorList.length > 0
      //       ) {
      //         let vendors = res.payload.VendorList;
      //       }
      //     } else {
      //       toast.current?.show({
      //         severity: "error",
      //         summary: "Error Message",
      //         detail: res.payload.tranStatus.lstErrorItem[0].Message,
      //       });
      //     }
      //   })
      //   .catch((error) => {
      //     toast.current?.show({
      //       severity: "error",
      //       summary: "Error Message",
      //       detail: JSON.stringify(error),
      //     });
      //   });
    }
  };

  const checkVendorSelected = (e) => {
    // if(filteritemType && filteritemType.length > 0) {
    //   if(filteritemType.some(item => item.VendorName != e?.target?.value) && e?.target?.value != ""){
    //     workPermitFormik.setFieldValue("VendorRegId", "")
    //     toast.current?.show({
    //       severity: "warn",
    //       summary: "Warning Message",
    //       detail: "Please Select Valid Vendor.",
    //     });
    //     return
    //   }
    // }
  };

  const onChangeVendorName = (e) => {
    workPermitFormik.setFieldValue("VendorRegId", e?.query);

    resetOnlyForm();
    resetWorker();
    let vendChange = {
      text: e.query,
      PlantId: +localStorage["PlantId"],
      CompanyId: +localStorage["CompanyId"],
    };
    const vendorFetched = dispatch(fetchVendor(vendChange));
    vendorFetched
      .then((res) => {
        let tempVendors = res.payload.VendorList;
        if (tempVendors && tempVendors.length > 0) {
          setFilteritemType(tempVendors);
        } else {
          setFilteritemType([]);
          workPermitFormik.setFieldValue("VendorRegId", null);
          toast.current?.show({
            severity: "warn",
            summary: "Warning Message",
            detail: res.payload.tranStatus.lstErrorItem[0].Message,
          });
        }
      })
      .catch((err) => {
        toast.current?.show({
          severity: "error",
          summary: "Error Message",
          detail: JSON.stringify(error),
        });
      });
  };

  const handleActions = {
    check: (rowData) => {},
  };

  useEffect(() => {
    if (workPermitWorkers && workPermitWorkers.length > 0) {
      if (
        workPermitWorkers?.filter((item) => item.IsWorking == true).length > 0
      ) {
        workPermitFormik.setFieldValue(
          "Manpower",
          workPermitWorkers?.filter((item) => item.IsWorking == true).length
        );
      } else {
        workPermitFormik.setFieldValue("Manpower", 0);
      }
      // const updateWpWorkerDetails = () => {
      //   setWpWorkerDetails(workPermitWorkers);
      // };
      // updateWpWorkerDetails();

      setWorkPermitWorkers(workPermitWorkers);
      setTempWorkPermitWorkersGrid(
        workPermitWorkers.filter((item) => item.IsWorking)
      );
      setWorkerPermitAll(
        workPermitWorkers.filter((item) => item.IsWorking).length ===
          workPermitWorkers.length
      );
    }
  }, [workPermitWorkers]);
  const onSelectWorkerGridSelect = (event) => {};

  const onSelectWorkerGridUnSelect = (event) => {
    const updateWorkPermitWorkers = () => {
      setWorkPermitWorkers((prevWorkers) => {
        const updatedWorkers = prevWorkers.map((worker) => {
          const isMatch = [event.data].some((tempWorker) => {
            // if (tempWorker.VRWorkerDetailId) {
            //   return tempWorker.VRWorkerDetailId === worker.VRWorkerDetailId;
            // } else if (tempWorker.WPWorkerDetailId) {
            //   return tempWorker.WPWorkerDetailId === worker.WPWorkerDetailId;
            // }
            if (tempWorker.MobileNo) {
              return tempWorker.MobileNo === worker.MobileNo;
            }
            return false;
          });
          return isMatch ? { ...worker, IsWorking: false } : worker;
        });

        setTempWorkPermitWorkersGrid(
          updatedWorkers.filter((item) => item.IsWorking)
        );
        if (updatedWorkers && updatedWorkers.length > 0) {
          if (
            updatedWorkers?.filter((item) => item.IsWorking == true).length > 0
          ) {
            workPermitFormik.setFieldValue(
              "Manpower",
              updatedWorkers?.filter((item) => item.IsWorking == true).length
            );
          } else {
            workPermitFormik.setFieldValue("Manpower", 0);
          }
        }
        // setTempWorkPermitWorkersGrid(value.length > 1 ? updatedWorkers : value);
        // setWorkerPermitAll(value.length === updatedWorkers.length);
        return updatedWorkers;
      });
    };

    updateWorkPermitWorkers();

    const updateWpWorkerDetails = () => {
      setWpWorkerDetails((prevWpDtl) =>
        prevWpDtl.map((worker) => {
          const match = [event.data].find((tempWorker) => {
            // if (tempWorker.WPWorkerDetailId) {
            //   return tempWorker.WPWorkerDetailId === worker.WPWorkerDetailId;
            // }
            // if (tempWorker.VRWorkerDetailId) {
            //   return tempWorker.VRWorkerDetailId === worker.VRWorkerDetailId;
            // }
            if (tempWorker.MobileNo) {
              return tempWorker.MobileNo === worker.MobileNo;
            }
            return false;
          });
          return match ? { ...worker, IsWorking: false } : worker;
        })
      );
    };
    updateWpWorkerDetails();
  };
  const onSelectWorkerGrid = (event) => {
    const value = event.value;
    if (
      value &&
      value.length > 0 &&
      value.some((itemVal) => itemVal.Status == 2)
    ) {
      return toastValidation("Please Select Active Worker.");
    }

    const updateWorkPermitWorkers = () => {
      setWorkPermitWorkers((prevWorkers) => {
        const updatedWorkers = prevWorkers.map((worker) => {
          const isMatch = value.some((tempWorker) => {
            // if (tempWorker.VRWorkerDetailId) {
            //   return tempWorker.VRWorkerDetailId === worker.VRWorkerDetailId;
            // } else if (tempWorker.WPWorkerDetailId) {
            //   return tempWorker.WPWorkerDetailId === worker.WPWorkerDetailId;
            // }
            if (tempWorker.MobileNo) {
              return tempWorker.MobileNo === worker.MobileNo;
            }
            return false;
          });
          return isMatch ? { ...worker, IsWorking: true } : worker;
        });

        setTempWorkPermitWorkersGrid(
          updatedWorkers.filter((item) => item.IsWorking)
        );
        // setTempWorkPermitWorkersGrid(value.length > 1 ? updatedWorkers : value);
        setWorkerPermitAll(value.length === updatedWorkers.length);
        if (updatedWorkers && updatedWorkers.length > 0) {
          if (
            updatedWorkers?.filter((item) => item.IsWorking == true).length > 0
          ) {
            workPermitFormik.setFieldValue(
              "Manpower",
              updatedWorkers?.filter((item) => item.IsWorking == true).length
            );
          } else {
            workPermitFormik.setFieldValue("Manpower", 0);
          }
        }
        return updatedWorkers;
      });
    };

    updateWorkPermitWorkers();

    const updateWpWorkerDetails = () => {
      setWpWorkerDetails((prevWpDtl) =>
        prevWpDtl.map((worker) => {
          const match = value.find((tempWorker) => {
            // if (tempWorker.WPWorkerDetailId) {
            //   return tempWorker.WPWorkerDetailId === worker.WPWorkerDetailId;
            // }
            // if (tempWorker.VRWorkerDetailId) {
            //   return tempWorker.VRWorkerDetailId === worker.VRWorkerDetailId;
            // }
            if (tempWorker.MobileNo) {
              return tempWorker.MobileNo === worker.MobileNo;
            }
            return false;
          });
          return match ? { ...worker, IsWorking: true } : worker;
        })
      );
    };
    updateWpWorkerDetails();
  };

  const onSelectWorkerAllGrid = (event) => {
    const selectAllCheck = event.checked;
    if (workPermitWorkers.filter((itemW) => itemW.Status == 2).length > 0) {
      toast.current?.show({
        severity: "warn",
        summary: "Warning Message",
        detail: "In Active Workers are not Selected.",
      });
    }

    if (selectAllCheck) {
      setWorkerPermitAll(true);
      setTempWorkPermitWorkersGrid(
        workPermitWorkers.map((item) => ({
          ...item,
          IsWorking: item.Status == 2 ? false : true,
        }))
      );
      setWorkPermitWorkers(
        workPermitWorkers.map((item) => ({
          ...item,
          IsWorking: item.Status == 2 ? false : true,
        }))
      );
      setWpWorkerDetails(
        wpWorkerDetails.map((item) => ({
          ...item,
          IsWorking: item.Status == 2 ? false : true,
        }))
      );
    } else {
      setWorkerPermitAll(false);
      setTempWorkPermitWorkersGrid([]);
      setWorkPermitWorkers(
        workPermitWorkers.map((item) => ({ ...item, IsWorking: false }))
      );
      setWpWorkerDetails(
        wpWorkerDetails.map((item) => ({ ...item, IsWorking: false }))
      );
    }
  };

  const [pageConfig, setPageConfig] = useState<any>({
    tableActionStyle: {
      textAlign: "center",
      minWidth: "7rem",
    },
    tableGridHeadSelMode: "checkbox",
    tableGridSelMode: true,
    dataKey: "WPWorkerDetailId",
    disableRowSel: () => !isView,
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
        name: "MobileNo",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: { minWidth: "4rem" },
      },
      {
        title: "Worker Mail ID",
        name: "MailId",
        sort: true,
        avatar: true,
        badge: false,
        colStyle: { minWidth: "6rem" },
      },
      {
        title: "Worker Status",
        name: "WorkerStatus",
        sort: true,
        avatar: false,
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
      //   name: "Worker Docs",
      //   sort: true,
      //   avatar: false,
      //   badge: false,
      //   action: true,
      //   colOn: "docs",
      //   colStyle: { minWidth: "6rem" },
      // },
      {
        title: "Is Incharge?",
        name: "IsIncharge",
        sort: true,
        avatar: false,
        badge: false,
        action: true,
        colOn: "is_incharge",
        colStyle: { minWidth: "2rem" },
      },
      {
        title: "Generate Pass",
        name: "GeneratePass",
        sort: true,
        avatar: false,
        badge: false,
        action: true,
        colOn: "generate_pass",
        colStyle: { minWidth: "6rem" },
      },
    ],
    // loadContent,
    // actionBodyTemplate,
    tableAddActions: [
      {
        title: "Is Working ?",
        name: "is_working",
        disabled: false,
        colOn: "is_working",
        id: "is_working",
      },
      {
        title: "Is InCharge?",
        name: "is_incharge",
        disabled: false,
        colOn: "is_incharge",
        id: "is_incharge",
      },
      {
        title: "Generate Pass",
        name: "generate_pass",
        disabled: false,
        colOn: "generate_pass",
        id: "generate_pass",
      },
    ],
  });

  const handlePassPrint = (rowData, event, name) => {
    let tempType;
    if (name == "print_wa") {
      tempType = 102;
    } else if (name == "print_email") {
      tempType = 101;
    } else {
      tempType = 100;
    }
    let vendChange = {
      SendType: tempType,
      MailType: "true",
      WorkPermitId: workPermitFormik?.values?.WorkPermitId,
      WPWorkerDetailId: rowData?.WPWorkerDetailId,
      PlantId: +localStorage["PlantId"],
      CompanyId: +localStorage["CompanyId"],
    };
    const getWpPass = dispatch(GetWpPass(vendChange));
    getWpPass
      .then((res) => {
        let tempWpPass = res.payload.WpPassHead;
        if (tempWpPass && tempWpPass != null) {
          if (res.payload.tranStatus.result == true) {
            setPassData(tempWpPass);
            if (tempType == 100) {
              setDialogVisible(true);
            }
            if (tempType == 101 && tempWpPass?.MailId != null) {
              setWorkBtnDisable({
                mailDisable: true,
                workerDtlId: rowData?.WPWorkerDetailId,
              });
            }
            if (tempType == 102) {
              setWorkBtnDisable({
                waDisable: true,
                workerDtlId: rowData?.WPWorkerDetailId,
              });
            }
            toast.current?.show({
              severity: "success",
              summary: "Success Message",
              detail: res.payload.tranStatus.lstErrorItem[0].Message,
            });
          } else {
            toast.current?.show({
              severity: "warn",
              summary: "Warning Message",
              detail: res.payload.tranStatus.lstErrorItem[0].Message,
            });
          }
        }
      })
      .catch((err) => {
        // toast.current?.show({
        //   severity: "error",
        //   summary: "Error Message",
        //   detail: JSON.stringify(error),
        // });
      });
  };

  const disablePassPrint = (rowData) => {
    if (workPermitFormik.values.Status == 75 && rowData.IsWorking && isView) {
      return false;
    }
    return true;
  };

  const handleClosePassPrev = () => {
    setDialogVisible(false);
  };

  const openPrint = () => {
    window.print();
  };
  const handleAfterPrint = React.useCallback(() => {}, []);

  // Props
  // Work Permit Print
  let wpHeader = {
    WorkPermitHeader,
    wpFormHead: {
      ...workPermitFormik,
      InsuranceValidTo: new Date(),
      WorkOrgName:
        workOrganisers &&
        workOrganisers.filter(
          (wo) => wo.UserId == workPermitFormik.values.WorkOrganizer
        )[0],
      DeptName:
        departments &&
        departments.filter(
          (wo) => wo.DepartmentId == workPermitFormik.values.DeptId
        )[0],
      CatName:
        categories &&
        categories.filter(
          (wo) => wo.CategoryId == workPermitFormik.values.CategoryId
        )[0],
      wpCatDetails:
        wpCatDetails &&
        wpCatDetails.map((catDet) => catDet.CategoryName).join(", "),
    },
    isView,
    createEditData,
    isCreate,
    toast,
    wpWorkerDetails,
    wpCompanyDocs,
    updateCategories,
    categories: wpCatDetails,
    wpApprovalDetails,
    wpFootSign,
    setWpCatDetails,
    checkPoints: checkPointsPrint,
    setCheckPoints: setCheckPointsPrint,
  };
  // Work Permit Print
  const allowExpansion = (rowData) => {
    return (
      (rowData?.WpWorkerDocs && rowData?.WpWorkerDocs?.length > 0) ||
      (rowData?.WorkerDocs && rowData?.WorkerDocs?.length > 0)
    );
  };
  // Worker Detail Props
  let workerGridProp = {
    gridData: workPermitWorkers,
    selections: tempWorkPermitWorkersGrid,
    selectAll: workerPermitAll,
    selectGridValue: onSelectWorkerGrid,
    selectGridValueSelect: onSelectWorkerGridSelect,
    selectGridValueUnSelect: onSelectWorkerGridUnSelect,
    onSelectWorkerAllGrid: onSelectWorkerAllGrid,
    filters,
    header,
    handleInchargeChange,
    // actionBodyTemplate,
    editAction: editWorkPermitWorker,
    delAction: deleteWorkPermitWorker,
    filesContent: filesWorkerContent,
    workerDocs,
    pageConfig,
    isView,
    handlePassPrint,
    disablePassPrint,
    workBtnDisable,
    allowExpansion,
  };

  let workerDetailProp = {
    isCreate,
    isView,
    wdFormik: workPermitFormik,
    phonenumber,
    docUpload,
    handleSelect,
    workerDocUpload,
    workerStatusList,
    workerDocs,
    workerTempDocs,
    workDocTypes: workerDocList,
    previewFile,
    deleteWorkerFile,
    wpWorkerDetails,
    filters,
    header,
    onChangeWorkerDocType,
    // actionBodyTemplate,
    editAction: editWorkPermitWorker,
    delAction: deleteWorkPermitWorker,
    filesContent,
    addWorker: addWorker,
    resetWorker,
    WorkDocs,
    workerMode,
    WorkerDocRef,
    handleWpDetailNext,
    editWorkPermitWorker,
    deleteWorkPermitWorker,
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
              <h1>Work Permit</h1>
            </div>
            <div className="md:col-6 text-right">
              <div className="action-btn">
                {activeIndex == 2 ? <HeadPrint /> : null}
                <Button
                  label=""
                  title="Save"
                  icon="pi pi-save"
                  className="text-center"
                  disabled={isView || isDisableSave}
                  onClick={workPermitFormik.handleSubmit}
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
                    history.push("/home/vWorkPermit");
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
            paddingTop: 0,
            borderTopRightRadius: 10,
          }}
          onTabChange={(e) => tabChange(e)}
          activeIndex={activeIndex}
        >
          <TabPanel
            style={{
              minWidth: 125,
              background: "#ebeef6",
            }}
            header="Work Permit"
            leftIcon="pi pi-calendar mr-2"
          >
            {/* <div className="page-container"> */}
            <div>
              {/*<div className="border-bottom-1 border-gray-300 page-title pl-2">
                 <div className="grid">
                  <div className="md:col-6">
                    <h2>Vendor Information</h2>
                  </div>
                  <div className="md:col-6 text-right">
                    <div className="action-btn">
                      <Button
                        label=""
                        title="Save"
                        icon="pi pi-save"
                        className="text-center"
                        disabled={isView || isDisableSave}
                        onClick={workPermitFormik.handleSubmit}
                      />
                       <Button
                        label=""
                        title="Approve"
                        icon="pi pi-check"
                        className="text-center"
                        disabled={isView || isDisableSave}
                        onClick={() => {}}
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
                          history.push("/home/vWorkPermit");
                        }}
                      />
                    </div>
                  </div>
                </div> 
              </div>*/}
              <div className="tab-parent-container scroll-y">
                {!loading ? (
                  <>
                    <div className="grid">
                      <div className="md:col-12">
                        <div className="white">
                          {/* <div className="widget-hdr">
                            <div className="sub-title">
                              <div className="grid">
                                <div className="md:col-6">
                                  <h2>Vendor Information</h2>
                                </div>
                              </div>
                            </div>
                          </div> */}
                          <div className="widget-body">
                            <div className="normal-table">
                              <div className="grid">
                                <div className="col-12 md:col-12">
                                  <div className="grid">
                                    {/* <FormFields
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
                                      formik={workPermitFormik}
                                    /> */}
                                    <FormFields
                                      type={"autocomplete"}
                                      name={"VendorRegId"}
                                      label={"Vendor Name "}
                                      show={true}
                                      required={true}
                                      disable={isView || createEditData != null}
                                      optionLabel={""}
                                      optionValue={""}
                                      handleChange={(e) =>
                                        onChangeVendorId(
                                          "VendorRegId",
                                          {},
                                          e.value
                                        )
                                      } //on select
                                      fldStyle={"col-12 md:col-3"}
                                      formik={workPermitFormik}
                                      autoSearch={onChangeVendorName}
                                      autoCompleteRef={autoCompleteRef}
                                      autoSuggestions={filteritemType}
                                      autoCompleteLbl={"VendorName"}
                                      field={"VendorName"}
                                      maxLength={100}
                                      placeHolder={"Please Select Vendor Name"}
                                      onBlur={(e) => checkVendorSelected(e)}
                                      dropdownAc={true}
                                    />
                                    <FormFields
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
                                      formik={workPermitFormik}
                                    />

                                    <FormFields
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
                                      formik={workPermitFormik}
                                      maxLength={50}
                                    />

                                    <FormFields
                                      type={"text"}
                                      name={"Manpower"}
                                      label={"Proposed Manpower to work"}
                                      options={[]}
                                      show={true}
                                      required={true}
                                      disable={true}
                                      optionLabel={""}
                                      optionValue={""}
                                      handleSelect={() => {}}
                                      formik={workPermitFormik}
                                      fldStyle={"col-12 md:col-3"}
                                    />
                                  </div>
                                  <div className="grid">
                                    <FormFields
                                      type={"text"}
                                      name={"ContractName"}
                                      label={"Contract Name "}
                                      options={""}
                                      show={true}
                                      required={false}
                                      disable={isView || false}
                                      optionLabel={""}
                                      optionValue={""}
                                      handleChange={handleChange}
                                      fldStyle={"col-12 md:col-3"}
                                      formik={workPermitFormik}
                                      minDate={new Date()}
                                      // maxDate={new Date()}
                                      selectionMode={"range"}
                                      maxLength={50}
                                    />
                                    <FormFields
                                      type={"Calendar"}
                                      name={"ContractValidity"}
                                      label={"Contract Validity "}
                                      options={""}
                                      show={true}
                                      required={false}
                                      disable={isView || false}
                                      optionLabel={""}
                                      optionValue={""}
                                      handleChange={handleChange}
                                      fldStyle={"col-12 md:col-3"}
                                      formik={workPermitFormik}
                                      minDate={
                                        workPermitFormik.values.ValidFrom &&
                                        workPermitFormik.values.ValidFrom != ""
                                          ? new Date(
                                              workPermitFormik.values.ValidFrom
                                            )
                                          : new Date()
                                      }
                                      maxDate={
                                        workPermitFormik.values.ValidTo &&
                                        workPermitFormik.values.ValidTo != ""
                                          ? new Date(
                                              workPermitFormik.values.ValidTo
                                            )
                                          : null
                                      }
                                      selectionMode={"range"}
                                    />
                                    <FormFields
                                      type={"select"}
                                      name={"DeptId"}
                                      label={"Department"}
                                      options={departments}
                                      show={true}
                                      required={true}
                                      disable={isView || false}
                                      optionLabel={"DepartmentName"}
                                      optionValue={"DepartmentId"}
                                      handleSelect={handleSelect}
                                      formik={workPermitFormik}
                                      fldStyle={"col-12 md:col-3"}
                                    />
                                    <FormFields
                                      type={"multi_select"}
                                      name={"CategoryId"}
                                      label={"Nature of the Work"}
                                      options={categories}
                                      show={true}
                                      required={true}
                                      disable={isView || false}
                                      optionLabel={"CategoryName"}
                                      optionValue={"CategoryId"}
                                      handleSelect={handleWorkNature}
                                      formik={workPermitFormik}
                                      fldStyle={"col-12 md:col-3"}
                                      optionDisabled={(option) =>
                                        option.CategoryName == "General"
                                          ? true
                                          : false
                                      }
                                      // optionDisabled={(option) => option.CategoryName == "General" ? true: false}
                                    />
                                    <FormFields
                                      type={"select"}
                                      name={"Status"}
                                      label={"Status "}
                                      options={statusList}
                                      show={isCreate || isView ? false : true}
                                      required={false}
                                      disable={
                                        isCreate ||
                                        createEditData != null ||
                                        isView
                                      }
                                      optionLabel={"MetaSubDescription"}
                                      optionValue={"MetaSubId"}
                                      handleSelect={handleSelect}
                                      fldStyle={"col-12 md:col-3"}
                                      formik={workPermitFormik}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="border-top-1 border-gray-300 page-title pt-2 mt-4">
                              <div className="text-right">
                                <Button
                                  label="Next"
                                  icon="pi pi-arrow-right"
                                  onClick={() =>
                                    handleWpNext({
                                      index: 1,
                                    })
                                  }
                                  autoFocus
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <AppProgressSpinner />
                )}
              </div>
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
              style={{ width: "95vw" }}
              onHide={() => setVisible(false)}
              footer={PrevfooterContent}
            >
              <div
                style={{
                  textAlign: "center",
                }}
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
            {/* </div> */}
          </TabPanel>
          <TabPanel
            style={{
              minWidth: 125,
              backgroundColor: "#ebeef6",
            }}
            header="Worker Details"
            leftIcon="pi pi-users mr-2"
          >
            <div className="tab-parent-container scroll-y">
              <WorkerDetails
                wdProp={workerDetailProp}
                wGProp={workerGridProp}
              />
            </div>
          </TabPanel>
          <TabPanel
            style={
              {
                // minWidth: 125,
              }
            }
            header="Print"
            rightIcon="pi pi-print ml-2"
          >
            {/* <div className="border-bottom-1 border-gray-300 page-title pl-2">
              <div className="grid">
                <div className="md:col-6"></div>
                <div className="md:col-6 text-right">
                  <div className="action-btn">
                    <HeadPrint />
                  </div>
                </div>
              </div>
            </div> */}
            <div className="tab-parent-container scroll-y">
              {activeIndex == 2 ? (
                <WorkPermitPrint wpHeader={wpHeader} />
              ) : null}
            </div>
          </TabPanel>
        </TabView>

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
        </Dialog>

        <Sidebar
          visible={dialogVisible}
          onHide={() => handleClosePassPrev()}
          className="preview-container"
          fullScreen
        >
          <div className="widget-body">
            <div className="grid">
              {/* FOR NTN  8- 3*/}
              <div
                className="white"
                style={{
                  maxWidth: "1200px",
                  margin: "auto",
                }}
              >
                {/* <WPPrintPass
                  openPrint={openPrint}
                  setPassVisible={handleClosePassPrev}
                  setPassData={setPassData}
                  /> */}
                <WpPassContent
                  printPassData={passData}
                  componentRef={componentRef}
                />
                <ReactToPrint
                  content={reactToPrintContent}
                  documentTitle="WorkPermitPass"
                  onAfterPrint={handleAfterPrint}
                  onBeforeGetContent={handleOnBeforeGetContent}
                  onBeforePrint={handleBeforePrint}
                  removeAfterPrint
                  trigger={reactToPrintTrigger}
                />
              </div>
            </div>
          </div>
        </Sidebar>

        <AppAlert toast={toast} />
      </div>
    </div>
  );
};

export default CWorkPermit;
