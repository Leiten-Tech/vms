import BookExternalVisitor from "@/pages/VisitorManagement/ExternalVisitorManage/BookExternalVisitor";
import BookExternalVisitorEntry from "@/pages/VisitorManagement/ExternalVisitorManage/BookExternalVisitorEntry";
import React from "react";
import { useEffect, useRef, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { pageLoadScript } from "@/assets/js/common-utilities";
import { Formik, useFormik } from "formik";
import { VisitorEntryValidationSchema } from "@/validations/VisitorManagement";
import { IMAGES } from "@/assets/images/Images";
import { useHistory } from "react-router-dom";
import {
  OnChangePartyType,
  OnChangeVisitor,
  OnChangeVisitorType,
  create,
  createInit,
  update,
  fetch,
  OnChangeDepartment,
  OnChangePlant,
  OnEnterMobileNo,
} from "@/redux/slices/visitorManagement/externalBookEntrySlice";
import AppAlert from "@/alert/alert";
import { Button } from "primereact/button";
import {
  externalVisitor,
  mobileNoPattern,
  VisitorDetailValidationSchema,
} from "@/validations/Master";
import {
  Checkbox,
  FilterMatchMode,
  InputSwitch,
  InputText,
} from "@/assets/css/prime-library";
import {
  createVM,
  createInitVM,
  OnChangeCountryVM,
  OnChangeStateVM,
  updateVM,
} from "@/redux/slices/master/externalBookVisitor";
import { AppointmentImg } from "@/assets/css/img-library";
import { useLocation } from "react-router-dom";
import { checkTrial, tLDS } from "@/utils/utilFunc";
import { checkAuthTrial, logout } from "@/redux/slices/common/authSlice";
import { AppProgressSpinner } from "@/components/UtilityComp";
import { DecryptData } from "@/redux/slices/master/workFlowSlice";
import { WarningPop } from "@/alert/WarningAlert";
import TermsConditionPop from "@/components/Common/TermsConditionPop";
import FormFields from "@/components/FormFields";

function useQuery() {
  const { search } = useLocation();

  return useMemo(() => new URLSearchParams(search), [search]);
}

export const MessageAlert = (props) => {
  const { successData } = props;

  return (
    <div className="flex flex-row justify-content-center align-items-center h-full">
      <div className="align-items-center flex flex-row justify-content-center m-auto white p-5 border-round-3xl">
        <div className="col-12">
          <div className="card mb-0 text-center">
            <div className="flex justify-content-between mb-3">
              <div className="m-auto align-items-center bg-green-100 border-round-lg flex justify-content-center p-3">
                <i className="pi pi-check text-green-500 text-xl"></i>
              </div>
            </div>
            <h1 className="text-green-500 text-3xl">
              Appointment Sent for Approval, will notify you the Status shortly
              on Mail/ WhatsApp.
            </h1>
            <span className="text-green-500 text-2xl font-large">
              Your Reference No: <b>{successData.VisitorEntryCode}</b>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const BookExternal = (props) => {
  const route = useHistory();
  const [isVisMaster, setIsVisMaster] = useState(false);
  const [findVis, setFindVis] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [successData, setSuccessData] = useState({});
  const [checked, setChecked] = useState(true);
  const [loadingPage, setLoadingPage] = useState(false);
  const [pageType, setPageType] = useState(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [dialogVisible, setDialogVisible] = useState<boolean>(false);
  const [VisitorNameList, setVisitorNameList] = useState([]);
  const [visitorEntryDetailList, setvisitorEntryDetailList] = useState([]);
  const [bookedVisitor, setBookedVisitor] = useState({});
  const query = useQuery();
  const [isWarningPop, setIsWarningPop] = useState(false);
  const [currVisData, setCurrVisData] = useState({});
  const [currMobNo, setCurrMobNo] = useState<string>();

  // const [TempVisitorNameList, setTempVisitorNameList] = useState([]);
  const [TempEmployeeList, setTempEmployeeList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchId, setSearchId] = useState("");
  const [vhSelected, setVHselected] = useState(false);
  const [selectedVisitor, setSelectedVisitor] = useState<any>();
  const [selectedHost, setSelectedHost] = useState<any>();
  const [selectedVeh, setSelectedVeh] = useState<any>();
  const [selectedInv, setSelectedInv] = useState<any>(false);
  const [showEntryDetail, setShowEntryDetail] = useState(false);
  const [selectedData, setSelectedData] = useState<any>({});
  const [isIndCon, setIsIndCon] = useState(false);
  const [VisitorEntryBooked, setVisitorEntryBooked] = useState<any>([]);
  const [TempVisitorEntryBooked, setVisitorTempEntryBooked] = useState<any>([]);
  const toast = useRef<any>(null);
  //  Visitor Entry Create
  const [cameraOff, setCameraOff] = useState(false);
  const [EmployeeList, setEmployeeList] = useState([]);
  const [DepartmentList, setDepartmentList] = useState([]);
  const [StatusList, setStatusList] = useState([]);
  const [TitleList, setTitleList] = useState([]);
  const [IsPreBookingList, setIsPreBookingList] = useState([]);
  const [VisitorTypeList, setVisitorTypeList] = useState([]);
  const [ProofList, setProofList] = useState([]);
  const [TempVisitorNameList, setTempVisitorNameList] = useState([]);
  const [imageUrl, setImageUrl] = useState(IMAGES.NO_IMG);
  const [photo, setPhoto] = useState<File | null>(null);
  const [document, setDocument] = useState<File | null>(null);
  const autoCompleteRef = useRef<any>(null);
  const [filteritemType, setFilteritemType] = useState([]);
  const [PartyTypeList, setPartyTypeList] = useState([]);
  const [AreaList, setAreaList] = useState([]);
  const [RouteList, setRouteList] = useState([]);
  const [PartyNameList, setPartyNameList] = useState([]);
  const [DriverList, setDriverList] = useState([]);
  const [VehicleList, setVehicleList] = useState([]);
  const [TempVehicleList, setTempVehicleList] = useState<any>();
  const [VECodeDisable, setVECodeDisable] = useState(true);
  const [ValidFromDisable, setValidFromDisable] = useState(true);
  const [ValidToDisable, setValidToDisable] = useState(true);
  const [TominDate, setTominDate] = useState(null);
  const [CheckboxDisable, setCheckboxDisable] = useState(false);
  const [HideVehicleDD, setHideVehicleDD] = useState(false);
  const [HideDriverDD, setHideDriverDD] = useState(false);
  const [IsDeliveryChallan, setIsDeliveryChallan] = useState(false);
  const [IsInvoiceBased, setIsInvoiceBased] = useState(false);
  const [IsVehicleTripBased, setIsVehicleTripBased] = useState(false);
  const [IsPartyDisable, setIsPartyDisable] = useState(false);
  const [IsVehicleDetailsDisable, setIsVehicleDetailsDisable] = useState(true);
  const [IsMaterialDetailsShow, setIsMaterialDetailsShow] = useState(false);
  const [IsBelongingDetailsShow, setIsBelongingDetailsShow] = useState(false);
  const [IsWorkerDetailsShow, setIsWorkerDetailsShow] = useState(false);
  const [ShowVisitorContranctor, setShowVisitorContranctor] = useState(true);
  const [IsdisableSave, setIsdisableSave] = useState(false);
  const [VisitorEntryBelongingDetailList, setVisitorEntryBelongingDetailList] =
    useState<any>([]);
  const [VisitorEntryMaterialDetailList, setVisitorEntryMaterialDetailList] =
    useState([]);
  const [MaterialList, setMaterialList] = useState([]);
  const [documentUrl, setDocumentUrl] = useState("");
  const [InvoiceNumberDisable, setInvoiceNumberDisable] = useState(true);
  const [DcNumberDisable, setDcNumberDisable] = useState(true);
  const [PoNumberDisable, setPoNumberDisable] = useState(true);
  const [ContainerNumberDisable, setContainerNumberDisable] = useState(true);
  const [initFldDisable, setInitFldDisable] = useState(true);
  const [contWorker, setContWorker] = useState(true);
  const [contHead, setContHead] = useState<any>({});
  const [PurposeList, setPurposeList] = useState([]);
  const [VisitorEntryPovDetail, setVisitorEntryPovDetail] = useState([]);
  const [passData, setPassData] = useState<any>();
  const [screenChanged, setScreenChanged] = useState<any>(false);
  const [plantDisable, setPlantDisable] = useState<any>(false);
  const [selectedPlant, setSelectedPlant] = useState();
  const dispatch: any = useDispatch();
  const phonenumber = [{ Id: 1, CountryCode: "+91", CountryName: "India" }];
  const [accessData, setAccessData] = useState<any>();
  const [sign, setSign] = useState<any>();
  const [signedUrl, setSignedUrl] = useState<any>(null);
  const [digSignFile, setDigSignFile] = useState<any>(null);
  const [isTermsNeeded, setIsTermsNeeded] = useState<any>(false);
  const [screenSized, setScreenSized] = useState<any>(false);
  const [pageTypeTogg, setPageTypeTogg] = useState(false);

  const [trialClearTimer, setTrialClearTimer] = useState<NodeJS.Timeout>();

  const {
    isCreate,
    isView,
    SearchData,
    loading,
    error,
    tranStatus,
    DtoEmployeeList,
    DtoDepartmentList,
    DtoStatusList,
    DtoTitleList,
    DtoIsPreBookingList,
    DtoVisitorTypeList,
    DtoProofList,
    DtoVisitorEntryTypeList,
    DtoVisitorEntryHeader,
    DtoVisitorEntryDetail,
    DtoVisitorEntryBelongingDetail,
    DtoVisitorEntryMaterialDetail,
    DtoVisitorEntryList,
    DtoVisitorEntryCodeList,
    DtoVisitorEmployeeList,
    DtoVisitorNameList,
    DtoVisitorWorkerList,
    DtoPreBookingList,
    DtoPartyTypeList,
    DtoAreaList,
    DtoRouteList,
    DtoPartyNameList,
    DtoDriverList,
    DtoVehicleList,
    DtoMaterialList,
    DtoPurposeList,
    DtoVisitorEntryPovDetail,
    DtoPlantList,
    TermsConditions,
  } = useSelector((state: any) => state.externalBookEntry);

  useEffect(() => {
    if (
      query &&
      query.size > 0 &&
      query.get("accessToken") != null &&
      query.get("accessToken") != ""
    ) {
      const dSendPass = dispatch(DecryptData(query.get("accessToken")));
      dSendPass.then((res) => {
        if (
          res.payload.hasOwnProperty("tranStatus") &&
          res.payload.tranStatus.result
        ) {
          setAccessData(JSON.parse(res.payload.VisitorEntryHeader));
        }
      });
    }
  }, []);

  const getId = (idType) => {
    if (query && query.size >= 0) {
      switch (idType) {
        case 1:
          return accessData && accessData?.CompanyId;
        case 0:
          return +accessData?.PlantId;
        case 2:
          return query.get("GateId");
      }
    } else {
      switch (idType) {
        case 1:
          return +localStorage["CompanyId"];
        case 0:
          return +localStorage["PlantId"];
        case 2:
          return query.get("GateId");
      }
    }
  };
  // Visitor Entry Functions
  const visitorEntryForm = {
    VisitorEntryId: DtoVisitorEntryHeader
      ? DtoVisitorEntryHeader.VisitorEntryId
      : 0,
    VisitorEntryCode: DtoVisitorEntryHeader
      ? DtoVisitorEntryHeader.VisitorEntryCode
      : "",
    VisitorEntryDate: DtoVisitorEntryHeader
      ? new Date(DtoVisitorEntryHeader.VisitorEntryDate)
      : new Date(),
    CompanyId: DtoVisitorEntryHeader
      ? DtoVisitorEntryHeader.CompanyId
      : accessData && accessData?.CompanyId,
    PlantId: DtoVisitorEntryHeader ? DtoVisitorEntryHeader.PlantId : null,
    GateId: DtoVisitorEntryHeader
      ? DtoVisitorEntryHeader.GateId
      : localStorage["GateId"],
    VisitorTypeId: DtoVisitorEntryHeader
      ? DtoVisitorEntryHeader.VisitorTypeId
      : 35,
    VisitorId: DtoVisitorEntryHeader ? DtoVisitorEntryHeader.VisitorId : null,
    PersonName: DtoVisitorEntryHeader ? DtoVisitorEntryHeader.PersonName : "",
    MobileNo: DtoVisitorEntryHeader ? DtoVisitorEntryHeader.MobileNo : "",
    TagNo: DtoVisitorEntryHeader ? DtoVisitorEntryHeader.TagNo : "",
    IdProofType: DtoVisitorEntryHeader
      ? DtoVisitorEntryHeader.IdProofType
      : null,
    IdProofNo: DtoVisitorEntryHeader ? DtoVisitorEntryHeader.IdProofNo : "",
    VisitedEmployeeId: DtoVisitorEntryHeader
      ? DtoVisitorEntryHeader.VisitedEmployeeId
      : null,
    ValidFrom: DtoVisitorEntryHeader
      ? new Date(DtoVisitorEntryHeader.ValidFrom)
      : new Date(),
    ValidTo: DtoVisitorEntryHeader
      ? new Date(DtoVisitorEntryHeader.ValidTo)
      : new Date(),
    AccessType: DtoVisitorEntryHeader ? DtoVisitorEntryHeader.AccessType : null,
    IsExtended: DtoVisitorEntryHeader
      ? DtoVisitorEntryHeader.IsExtended
      : false,
    IsAppointmentBooking: DtoVisitorEntryHeader
      ? DtoVisitorEntryHeader.IsAppointmentBooking
      : false,
    IsPreBooking: DtoVisitorEntryHeader
      ? DtoVisitorEntryHeader.IsPreBooking
      : 16,
    VisitorRemarks: DtoVisitorEntryHeader
      ? DtoVisitorEntryHeader.VisitorRemarks
      : "",
    PurposeOfVisit: DtoVisitorEntryHeader
      ? DtoVisitorEntryHeader.PurposeOfVisit
      : "",
    AreaToVisit: DtoVisitorEntryHeader
      ? DtoVisitorEntryHeader.AreaToVisit
      : null,
    VisitorImageName: DtoVisitorEntryHeader
      ? DtoVisitorEntryHeader.VisitorImageName
      : "",
    VisitorImageUrl: DtoVisitorEntryHeader
      ? DtoVisitorEntryHeader.VisitorImageUrl
      : "",
    PartyType: DtoVisitorEntryHeader ? DtoVisitorEntryHeader.PartyType : null,
    PartyName: DtoVisitorEntryHeader ? DtoVisitorEntryHeader.PartyName : null,
    InvoiceNumber: DtoVisitorEntryHeader
      ? DtoVisitorEntryHeader.InvoiceNumber
      : "",
    DcNumber: DtoVisitorEntryHeader ? DtoVisitorEntryHeader.DcNumber : "",
    PoNumber: DtoVisitorEntryHeader ? DtoVisitorEntryHeader.PoNumber : "",
    ContainerNumber: DtoVisitorEntryHeader
      ? DtoVisitorEntryHeader.ContainerNumber
      : "",
    IsExistingVehicle: DtoVisitorEntryHeader
      ? DtoVisitorEntryHeader.IsExistingVehicle
      : null,
    VehicleName: DtoVisitorEntryHeader ? DtoVisitorEntryHeader.VehicleName : "",
    VehicleNo: DtoVisitorEntryHeader ? DtoVisitorEntryHeader.VehicleNo : "",
    IsExistingDriver: DtoVisitorEntryHeader
      ? DtoVisitorEntryHeader.IsExistingDriver
      : null,
    DriverId: DtoVisitorEntryHeader ? DtoVisitorEntryHeader.DriverId : "",
    VehicleDocumentName: DtoVisitorEntryHeader
      ? DtoVisitorEntryHeader.VehicleDocumentName
      : "",
    VehicleDocumentUrl: DtoVisitorEntryHeader
      ? DtoVisitorEntryHeader.VehicleDocumentUrl
      : "",
    RouteId: DtoVisitorEntryHeader ? DtoVisitorEntryHeader.RouteId : null,
    NumberOfPassengers: DtoVisitorEntryHeader
      ? DtoVisitorEntryHeader.NumberOfPassengers
      : "",
    PlannedTravellingKm: DtoVisitorEntryHeader
      ? DtoVisitorEntryHeader.PlannedTravellingKm
      : "",
    ActualTravellingKm: DtoVisitorEntryHeader
      ? DtoVisitorEntryHeader.ActualTravellingKm
      : "",
    Status: DtoVisitorEntryHeader ? DtoVisitorEntryHeader.Status : 74,
    CreatedBy: 0,
    CreatedOn: DtoVisitorEntryHeader
      ? new Date(DtoVisitorEntryHeader.CreatedOn)
      : new Date(),
    ModifiedBy: 0,
    ModifiedOn: DtoVisitorEntryHeader ? new Date() : null,
    IsExternal: 1,
    IsInternalAppointment: 0,
  };

  function checkSCreen(x) {
    if (x.matches) {
      setScreenChanged(true);
    } else {
      setScreenChanged(false);
    }
  }

  useEffect(() => {
    var x = window.matchMedia("(max-width: 767px)");
    x.addEventListener("change", function () {
      checkSCreen(x);
    });
  });

  // const trialWatcher = () => {
  //   if (!trialClearTimer) {
  //     setTrialClearTimer(
  //       setInterval(() => {
  //           logoutRedirect();
  //           clearInterval(trialClearTimer);
  //       }, 1000)
  //     );
  //   }
  // };

  const logoutRedirect = () => {
    const checkTrialRes = dispatch(checkAuthTrial({}));
    checkTrialRes
      .then((res) => {
        if (res.payload.tranStatus.result == true) {
        } else {
          toast.current?.show({
            severity: "warn",
            summary: "Warning Message",
            detail: res.payload.tranStatus.lstErrorItem[0].Message,
          });
          // route.push("/");
          return;
        }
      })
      .catch((err) => {});
  };

  const visitorEntryFormik: any = useFormik({
    initialValues: visitorEntryForm,
    validationSchema: VisitorEntryValidationSchema,
    onSubmit: (values: any, { resetForm }) => {
      setIsdisableSave(true);
      values.IsExternal = true;
      const formData: any = new FormData();

      // if (
      //   values.PersonName == "" &&
      //   (values.VisitorTypeId == 35 || values.VisitorTypeId == 36)
      // )
      //   return toastValidation("Please Select Visitor Name");
      // if (
      //   values.PersonName == "" &&
      //   values.VisitorTypeId != 35 &&
      //   values.VisitorTypeId != 36
      // )
      //   return toastValidation("Please Enter Visitor Name");

      // if (values.MobileNo == "")
      //   return toastValidation("Please Enter Mobile No");
      // if (values.MobileNo.length < 9 || values.MobileNo.length > 15)
      //   return toastValidation(
      //     "Invalid mobile number. It should be 9 to 15 digits"
      //   );
      // if (!values.IdProofType)
      //   return toastValidation("Please Select ID Proof Type");
      // if (values.IdProofNo == "")
      //   return toastValidation("Please Enter ID Proof No");

      // if (values.IdProofNo != "")
      //   if (values.idProofType === 17 && !/^\d{12}$/.test(values.IdProofNo)) {
      //     return toastValidation("Please Enter Valid Aadhar Proof No");
      //   }

      // if (values.AreaToVisit == "" || values.AreaToVisit == null)    // area to visit
      //   return toastValidation("Please Select Area To Visit");
      // if (!values.ValidFrom && values.VisitorTypeId == 36)
      //   return toastValidation("Please Select Valid From");

      // if (!values.ValidTo) return toastValidation("Please Select Valid To");
      // if (values.VisitorTypeId == 64 || values.VisitorTypeId == 65) {
      //   if (!values.PartyType)
      //     return toastValidation("Please Select Party Type");
      //   if (!values.PartyName)
      //     return toastValidation("Please Select Party Name");
      //   if (
      //     !VisitorEntryMaterialDetailList ||
      //     !VisitorEntryMaterialDetailList.length ||
      //     VisitorEntryMaterialDetailList.length == 0
      //   )
      //     return toastValidation("Please Add Material Details");
      //   let exists: any[] = VisitorEntryMaterialDetailList.filter(
      //     (f) => f.MaterialId == null || f.Qty == ""
      //   );
      //   if (exists.length > 0)
      //     return toastValidation(
      //       "Please Add All the Details In Material Details."
      //     );
      // }
      // if (
      //   (values.VisitorTypeId == 35 || values.VisitorTypeId == 36) &&
      //   VisitorEntryBelongingDetailList.length > 0
      // ) {
      //   let exists: any[] = VisitorEntryBelongingDetailList.filter(
      //     (f) => f.DeviceName == "" && f.DeviceNo == ""
      //   );
      //   if (VisitorEntryBelongingDetailList.length == 1 && exists.length > 0) {
      //   } else {
      //     let existsval: any[] = VisitorEntryBelongingDetailList.filter(
      //       (f) => f.DeviceName == "" || f.DeviceNo == ""
      //     );
      //     if (existsval.length > 0)
      //       return toastValidation(
      //         "Please Add All the Details In Belonging Details."
      //       );
      //   }
      // }
      // if (values.VisitorTypeId == 64 && values.DcNumber == "")
      //   return toastValidation("Please Enter DC Number");
      // if (values.VisitorTypeId == 65 && values.InvoiceNumber == "")
      //   return toastValidation("Please Enter Invoice Number");
      // if (values.VisitorTypeId != 35 && values.VisitorTypeId != 36) {
      //   if (values.VehicleName == "" && values.IsExistingVehicle)
      //     return toastValidation("Please Select Vehicle Name");
      //   if (values.VehicleName == "" && !values.IsExistingVehicle)
      //     return toastValidation("Please Enter Vehicle Name");
      //   if (values.VehicleNo == "")
      //     return toastValidation("Please Enter Vehicle No");
      //   if (!values.RouteId) return toastValidation("Select Route");
      //   if (values.PlannedTravellingKm == "")
      //     return toastValidation("Please Enter Planned Travelling Km");
      //   if (values.ActualTravellingKm == "")
      //     return toastValidation("Please Enter Actual Travelling Km");

      //   if (
      //     !VisitorEntryPovDetail ||
      //     !VisitorEntryPovDetail.length ||
      //     VisitorEntryPovDetail.length == 0
      //   ) {
      //     return toastValidation("Please Select Area To Visit");
      //   }
      // }

      let List1: any[] = visitorEntryDetailList;
      let List2: any[] = VisitorEntryBelongingDetailList;
      let List3: any[] = VisitorEntryMaterialDetailList;
      if (values.VisitorTypeId == 35) {
        List3 = [];
        // List1 = [];
      }
      if (values.VisitorTypeId == 36) {
        List3 = [];
      }
      if (values.VisitorTypeId == 64) {
        List1 = [];
        List2 = [];
      }
      if (values.VisitorTypeId == 65) {
        List1 = [];
        List2 = [];
      }
      if (values.VisitorTypeId == 66) {
        List3 = [];
        List1 = [];
      }
      let ListvisitorEntryDetailList: any[] = [],
        ListVisitorEntryBelongingDetailList: any[] = [],
        ListVisitorEntryMaterialDetailList: any[] = [];

      let validToDateDtl = new Date(
        values.ValidFrom.getFullYear(),
        values.ValidFrom.getMonth(),
        values.ValidFrom.getDate()
      );
      if (values.VisitorTypeId == 35) {
        validToDateDtl.setHours(23, 59, 59, 999);
      }

      if (List1.length > 0) {
        for (let i = 0; i < List1.length; i++) {
          const x = List1[i];
          let vedObj: any = {};
          vedObj.VisitorEntryDetailId = x.VisitorEntryDetailId ?? 0;
          vedObj.VisitorEntryDetailCode = x.VisitorDetailCode ?? 0;
          vedObj.VisitorEntryId = x.VisitorEntryId ?? 0;
          vedObj.VisitorId = x.VisitorDetailId ?? 0;
          vedObj.TitleId = x.TitleId;
          vedObj.FirstName = x.FirstName;
          vedObj.LastName = x.LastName;
          vedObj.DepartmentId = x.DepartmentId;
          vedObj.Dob = x.Dob;
          vedObj.MailId = x.MailId;
          vedObj.MobileNo = x.MobileNo;
          vedObj.TagNo = x.TagNo;
          vedObj.VisitorCompany = x.VisitorCompany;
          vedObj.DigitalSignName = x.DigitalSignName || "";
          vedObj.DigitalSignUrl = x.DigitalSignUrl || "";
          vedObj.SignedVersion = x.SignedVersion || 0;
          vedObj.IsTermsAgreed = x.IsTermsAgreed || 0;
          vedObj.IdCardType = x.IdCardType;
          vedObj.IdCardNo = x.IdCardNo;
          vedObj.DocumentName = x.DocumentName;
          vedObj.DocumentUrl = x.DocumentName;
          vedObj.Status = x.Status;
          vedObj.ValidFrom = tLDS(values.ValidFrom);
          vedObj.ValidTo =
            values.VisitorTypeId == 35
              ? datepipes(validToDateDtl)
              : tLDS(values.ValidTo);
          vedObj.IsEditedImage = 1;
          ListvisitorEntryDetailList.push(vedObj);
        }
      }
      if (List2.length > 0) {
        for (let i = 0; i < List2.length; i++) {
          const x = List2[i];
          let vebdObj: any = {};
          vebdObj.VisitorEntryBelongingDetailId =
            x.VisitorEntryBelongingDetailId ?? 0;
          vebdObj.VisitorEntryId = x.VisitorEntryId ?? 0;
          vebdObj.DeviceNo = x.DeviceNo;
          vebdObj.DeviceName = x.DeviceName;
          ListVisitorEntryBelongingDetailList.push(vebdObj);
        }
      }
      if (List3.length > 0) {
        for (let i = 0; i < List3.length; i++) {
          const x = List3[i];
          let vemdObj: any = {};
          vemdObj.VisitorEntryMaterialDetailId =
            x.VisitorEntryMaterialDetailId ?? 0;
          vemdObj.VisitorEntryId = x.VisitorEntryId ?? 0;
          vemdObj.MaterialId = x.MaterialId;
          vemdObj.Uom = x.Uom;
          vemdObj.Qty = x.Qty;
          ListVisitorEntryMaterialDetailList.push(vemdObj);
        }
      }
      // if (!photo) {
      //   setIsdisableSave(false);
      //   toast.current?.show({
      //     severity: "warn",
      //     detail: "Please Capture Image",
      //     summary: "Warning Message",
      //   });
      //   return;
      // }

      if (values.VisitorTypeId == 35) {
        var validto = new Date(
          values.ValidFrom.getFullYear(),
          values.ValidFrom.getMonth(),
          values.ValidFrom.getDate()
        );
        validto.setHours(23, 59, 59, 999);
      }
      values.ValidFrom = datepipes(new Date(values.ValidFrom));

      values.ValidTo =
        values.VisitorTypeId == 35
          ? datepipes(validto)
          : datepipes(new Date(values.ValidTo));
      values.VisitorEntryDate = datepipes(new Date(values.VisitorEntryDate));
      values.CreatedOn = datepipes(new Date(values.CreatedOn));
      values.TagNo = visitorFormik.values["TagNo"];
      values.CompanyId = accessData && accessData?.CompanyId;
      values.GateId = accessData && accessData?.GateId;
      values.IsInternalAppointment = 0;
      values.IsExternal = 1;
      values.IsEditedImage = 1;
      if (!isCreate) {
        values.ModifiedOn = datepipes(new Date(values.ModifiedOn));
      }
      if (values.GateId == "null" || values.GateId == "") {
        values.GateId = null;
      }
      let obj = {
        VisitorEntry: values,
        VisitorEntryDetail: ListvisitorEntryDetailList ?? [],
        VisitorEntryBelongingDetail: ListVisitorEntryBelongingDetailList ?? [],
        VisitorEntryMaterialDetail: ListVisitorEntryMaterialDetailList ?? [],
        VisitorEntryAtvDetail: VisitorEntryPovDetail ?? [],
      };
      let input: string = JSON.stringify(obj);
      formData.append("input", input);
      formData.append("webfile", photo);
      formData.append("webfile1", document);
      formData.append("digSign", digSignFile);
      formData.append("webfiles", []);

      if (isCreate == false) {
        var updateres = dispatch(update(formData));
        updateres
          .then((res) => {
            if (res.payload.tranStatus.result == true) {
              toast.current?.show({
                severity: "success",
                summary: "Success Message",
                detail: res.payload.tranStatus.lstErrorItem[0].Message,
              });
              setTimeout(() => {
                route.push("/home/vVisitorEntry");
              }, 800);
              setVisible(false);
            } else {
              toast.current?.show({
                severity: "error",
                summary: "Error Message",
                detail: res.payload.tranStatus.lstErrorItem[0].Message,
              });
              setIsdisableSave(false);
            }
          })
          .catch((error) => {
            setIsdisableSave(false);
            toast.current?.show({
              severity: "error",
              summary: "Error",
              detail: JSON.stringify(error),
            });
          });
      } else {
        var updateres = dispatch(create(formData));
        updateres
          .then((res) => {
            if (res.payload.tranStatus.result == true) {
              setIsdisableSave(false);
              // toast.current?.show({
              //   severity: "success",
              //   summary: "Success Message",
              //   detail: res.payload.tranStatus.lstErrorItem[0].Message,
              // });
              setIsCompleted(true);
              setSuccessData(res.payload.VisitorEntryHeader);
              setCurrMobNo("");
              // fetchVisEntryDtl(res.payload.VisitorEntryHeader);
              setVisible(false);
              resetAllForm();
            } else {
              setIsdisableSave(false);
              toast.current?.show({
                severity: "error",
                summary: "Error",
                detail: res.payload.tranStatus.lstErrorItem[0].Message,
              });
            }
          })
          .catch((error) => {
            setIsdisableSave(false);
            toast.current?.show({
              severity: "error",
              summary: "Error",
              detail: JSON.stringify(error),
            });
          });
      }
    },
  });

  const handleVisitorSelected = (visitorId, updatedList) => {
    setVisitorNameList(updatedList);

    let selectedVis = updatedList
      .filter((item) =>
        item.VisitorDetails.some((i) => i.VisitorDetailId === visitorId)
      )
      .map((item) => ({
        ...item,
        VisitorDetails: item.VisitorDetails.filter(
          (i) => i.VisitorDetailId === visitorId
        ),
      }));

    let selectedVisitorDetails = selectedVis.flatMap(
      (item) => item.VisitorDetails
    );

    // let selectedVis = updatedList.filter(
    //   (item) => item.VisitorDetailId === visitorId
    // );
    // setFindVis(selectedVis);
    // onChangeVisitor("VisitorId", {}, selectedVis[0].VisitorId, updatedList);

    onChangeVisitor(
      "VisitorId",
      {},
      selectedVisitorDetails[0].VisitorDetailId,
      updatedList
    );
  };

  useEffect(() => {});

  // useEffect(() => {
  //   if (findVis.length > 0) {
  //     onChangeVisitor("VisitorId", {}, findVis[0].VisitorId);

  //   }
  // }, [VisitorNameList, findVis]);

  const setList = () => {
    setVisitorTypeList(DtoVisitorTypeList);
    setIsPreBookingList(DtoIsPreBookingList);
    setProofList(DtoProofList);
    setStatusList(DtoStatusList);
    setTitleList(DtoTitleList);
    // setEmployeeList(DtoEmployeeList);
    setDepartmentList(DtoDepartmentList);
    setTempVisitorNameList(DtoVisitorNameList);
    setPartyTypeList(DtoPartyTypeList);
    // setAreaList(DtoAreaList);
    setRouteList(DtoRouteList);
    setDriverList(DtoDriverList);
    setVehicleList(DtoVehicleList);
    setMaterialList(DtoMaterialList);
    setPurposeList(DtoPurposeList);
    let List: any[] = [];
    for (let i = 0; i < DtoVisitorEntryDetail.length; i++) {
      const x = DtoVisitorEntryDetail[i];
      let obj: any = {};
      obj.VisitorEntryDetailId = x.VisitorEntryDetailId;
      obj.VisitorEntryDetailCode = x.VisitorDetailCode;
      obj.VisitorEntryId = x.VisitorEntryId;
      obj.VisitorId = x.VisitorId;
      obj.TitleId = x.TitleId;
      obj.FirstName = x.FirstName;
      obj.LastName = x.LastName;
      obj.DepartmentId = x.DepartmentId;
      obj.Dob = new Date(x.Dob);
      obj.MailId = x.MailId;
      obj.MobileNo = x.MobileNo;
      obj.TagNo = x.TagNo;
      obj.VisitorCompany = x.VisitorCompany;
      obj.DigitalSignName = x.DigitalSignName || "";
      obj.DigitalSignUrl = x.DigitalSignUrl || "";
      obj.SignedVersion = x.SignedVersion || 0;
      obj.IsTermsAgreed = x.IsTermsAgreed || 0;
      obj.IdCardType = x.IdCardType;
      obj.IdCardNo = x.IdCardNo;
      obj.DocumentName = x.DocumentName;
      obj.DocumentUrl = x.DocumentUrl;
      obj.Status = x.Status;
      obj.VisitorName =
        DtoTitleList.find((f) => f.MetaSubId == x.TitleId).MetaSubDescription +
        "." +
        obj.FirstName +
        " " +
        obj.LastName;
      obj.StatusName = DtoStatusList.find(
        (f) => f.MetaSubId == x.Status
      ).MetaSubDescription;
      obj.IdCardTypeName = DtoProofList.find(
        (f) => f.MetaSubId == x.IdCardType
      ).MetaSubDescription;
      if (x.DepartmentId) {
        obj.DepartMentName = DtoDepartmentList.find(
          (f) => f.DepartmentId == x.DepartmentId
        ).DepartmentName;
      } else {
        obj.DepartMentName = "";
      }
      const formattedDate = new Date(x.Dob).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      obj.ShowDate = formattedDate;
      List.push(obj);
    }
    setvisitorEntryDetailList(List);
    setVisitorEntryBelongingDetailList(DtoVisitorEntryBelongingDetail);
    setVisitorEntryMaterialDetailList(DtoVisitorEntryMaterialDetail);

    setVisitorEntryPovDetail(DtoVisitorEntryPovDetail);
    onChangeVisitorType(
      "VisitorTypeId",
      {},
      DtoVisitorEntryHeader.VisitorTypeId
    );
    if (DtoVisitorEntryHeader.PartyType) {
      OnChangePartyTypes("PartyType", {}, DtoVisitorEntryHeader.PartyType);
    }
    let SavedPovList = DtoVisitorEntryPovDetail.map((f) => f.AreaToVisit);
    handlePoVSelect("AreaToVisit", {}, SavedPovList, 1);
    fetchBlobFromUrl(DtoVisitorEntryHeader.VisitorImageUrl)
      .then((blob) => {
        const file = new File([blob], DtoVisitorEntryHeader.VisitorImageName, {
          type: "image/*",
          lastModified: 1695716506050,
        });
        setPhoto(file);
        setImageUrl(DtoVisitorEntryHeader.VisitorImageUrl);
      })
      .catch((error) => {
        toast.current?.show({
          severity: "error",
          detail: "Error",
          summary: JSON.stringify(error),
        });
      });
    if (
      DtoVisitorEntryHeader.VisitorTypeId == 64 ||
      DtoVisitorEntryHeader.VisitorTypeId == 65 ||
      DtoVisitorEntryHeader.VisitorTypeId == 66
    ) {
      fetchBlobFromUrl(DtoVisitorEntryHeader.VehicleDocumentUrl)
        .then((blob) => {
          const file = new File(
            [blob],
            DtoVisitorEntryHeader.VehicleDocumentName,
            {
              type: "image/*",
              lastModified: 1695716506050,
            }
          );
          setDocument(file);
          setDocumentUrl(DtoVisitorEntryHeader.VehicleDocumentUrl);
        })
        .catch((error) => {
          toast.current?.show({
            severity: "error",
            detail: "Error",
            summary: JSON.stringify(error),
          });
        });
    }
  };

  const CreatePageOnLoadCVisitorEntry = (VisitorEntryId: number) => {
    if (
      query &&
      query.size >= 0 &&
      accessData &&
      accessData?.CompanyId != "" &&
      accessData &&
      accessData?.CompanyId != null
    ) {
      localStorage.setItem("CompanyId", accessData && accessData?.CompanyId);
    }
    const data = {
      VisitorEntryId: VisitorEntryId,
      CompanyId: accessData && accessData?.CompanyId,
      RoleId: 1,
    };
    var result = dispatch(createInit(data));
    result
      .then((res) => {
        if (res.payload.tranStatus.result == true) {
          if (
            query &&
            query.size >= 0 &&
            accessData?.PlantId != "" &&
            accessData?.PlantId != null
          ) {
            let plantFound = res.payload.PlantList.filter(
              (plant) => plant.PlantId == +accessData?.PlantId
            );
            if (plantFound && plantFound.length > 0) {
              handlePlantSelect("PlantId", {}, +accessData?.PlantId);
              setPlantDisable(true);
            } else {
              setPlantDisable(false);
            }
          } else {
            setPlantDisable(false);
          }
          setVisitorTypeList(res.payload.VisitorTypeList);
          setIsPreBookingList(res.payload.IsPreBookingList);
          setProofList(res.payload.ProofList);
          setStatusList(res.payload.StatusList);
          setTitleList(res.payload.TitleList);

          // setEmployeeList(res.payload.EmployeeList);
          setDepartmentList(res.payload.DepartmentList);
          setTempVisitorNameList(res.payload.VisitorNameList);
          setVisitorNameList(res.payload.VisitorNameList);
          setPartyTypeList(res.payload.PartyTypeList);
          // setAreaList(res.payload.AreaList);
          setRouteList(res.payload.RouteList);
          setDriverList(res.payload.DriverList);
          setVehicleList(res.payload.VehicleList);
          setTempVehicleList(res.payload.VehicleList);
          setMaterialList(res.payload.MaterialList);
          setPurposeList(res.payload.PurposeList);
          setLocation(
            res.payload.CountryList,
            res.payload.StateList,
            res.payload.CityList
          );
          if (isCreate == true) {
            if (
              +selectedData?.selectedType != 66 &&
              +selectedData?.selectedType != 65
            ) {
              // onChangeVisitorType(
              //   "VisitorTypeId",
              //   {},
              //   selectedData?.selectedType
              // );
            }
            // let mobobj: any = {};
            // let lapobj: any = {};
            // mobobj.VisitorEntryBelongingDetailId = 0;
            // mobobj.VisitorEntryId = 0;
            // mobobj.DeviceNo = "";
            // mobobj.DeviceName = "Mobile";
            // lapobj.VisitorEntryBelongingDetailId = 0;
            // lapobj.VisitorEntryId = 0;
            // lapobj.DeviceNo = "";
            // lapobj.DeviceName = "Laptop";
            // setVisitorEntryBelongingDetailList([mobobj,lapobj]);
            let matobj: any = {};
            matobj.VisitorEntryMaterialDetailId = 0;
            matobj.VisitorEntryId = 0;
            matobj.MaterialId = null;
            matobj.Uom = null;
            matobj.Qty = "";
            setVisitorEntryMaterialDetailList([matobj]);

            // visitorEntryFormik.setFieldValue(
            //   "VisitedEmployeeId",
            //   selectedData.selectedWhomToVisit
            // );
          } else {
          }
        } else {
          toast.current?.show({
            severity: "error",
            detail: "Error",
            summary: res.payload.tranStatus.lstErrorItem[0].Message,
          });
        }
      })
      .catch((error) => {
        toast.current?.show({
          severity: "error",
          detail: "Error",
          summary: JSON.stringify(error),
        });
      });
  };

  useEffect(() => {});

  // useEffect(() => {
  //   onChangeVisitorType("VisitorTypeId", {}, selectedData.selectedType);
  // }, [selectedData]);

  const handleSelect = (name, other, value) => {
    visitorEntryFormik.setFieldValue(name, value);
    if (name == "PlantId") {
      setSelectedPlant(value);
      visitorEntryFormik.setFieldValue("AreaToVisit", null);
    }
  };
  const handlePoVSelect = (name, other, value, type: number = 0) => {
    visitorEntryFormik.setFieldValue(name, value);
    if (type == 0) {
      setVisitorEntryPovDetail([]);
      let List: any[] = [];
      for (let i = 0; i < value.length; i++) {
        const x = value[i];
        let Obj: any = {};
        Obj.VisitorEntryAtvDetailId = 0;
        Obj.VisitorEntryId = 0;
        Obj.AreaToVisit = x;
        List.push(Obj);
      }
      setVisitorEntryPovDetail(List);
    }
  };
  const handleRouteSelect = (name, other, value) => {
    visitorEntryFormik.setFieldValue(name, value);
    let Planned = RouteList.find((f) => f.RouteId == value).RouteDistanceInKm;
    visitorEntryFormik.setFieldValue("PlannedTravellingKm", Planned);
  };
  const handleChange = (event) => {
    visitorEntryFormik.setFieldValue(event.target.name, event.value);
  };
  const OnSelectVisitorCode = (name, other, value) => {
    visitorEntryFormik.setFieldValue(name, value);
  };

  const toastValidation = (message: string) => {
    setIsdisableSave(false);
    toast.current?.show({
      severity: "warn",
      summary: "Warning Message",
      detail: message,
    });
    return;
  };

  const fetchVisEntryDtl = (reqData) => {
    let cData = {
      VisitorEntryId: reqData.VisitorEntryId,
      RoleId: 1,
    };
    var fetchData = dispatch(createInit(cData));
    fetchData
      .then((res) => {
        if (![65, 66].includes(reqData.VisitorTypeId)) {
          let data: any = {
            data: res.payload.VisitorEntryHeader,
          };
          setShowEntryDetail(true);
          setVisible(false);
          localStorage.setItem("clickedRowData", JSON.stringify(data));
        }
        setVisible(false);
      })
      .catch((err) => {});
  };
  const datepipes = (date: any) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };
  async function fetchBlobFromUrl(url: string): Promise<Blob> {
    const response: any = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    return await response.blob();
  }
  const resetAllForm = () => {
    visitorEntryFormik.resetForm();
    visitorFormik.resetForm();
    visitorDFormik.resetForm();
    let mobobj: any = {};
    let lapobj: any = {};
    mobobj.VisitorEntryBelongingDetailId = 0;
    mobobj.VisitorEntryId = 0;
    mobobj.DeviceNo = "";
    mobobj.DeviceName = "Mobile";
    lapobj.VisitorEntryBelongingDetailId = 0;
    lapobj.VisitorEntryId = 0;
    lapobj.DeviceNo = "";
    lapobj.DeviceName = "Laptop";
    setVisitorEntryBelongingDetailList([mobobj, lapobj]);
    let matobj: any = {};
    matobj.VisitorEntryMaterialDetailId = 0;
    matobj.VisitorEntryId = 0;
    matobj.MaterialId = null;
    matobj.Uom = null;
    matobj.Qty = "";
    setVisitorEntryMaterialDetailList([matobj]);
    setVisitorEntryMaterialDetailList([]);
    setVisitorEntryPovDetail([]);
    setPhoto(null);
    setImageUrl(IMAGES.NO_IMG);
    setDocument(null);
    setDocumentUrl("");
    setPartyNameList([]);
    visitorFormik.setFieldValue("CountryCode", "+91");
    handleCloseImage();
    setIsVisMaster(false);
    // CreatePageOnLoad(0);
    // setVisible(false);
  };

  const onChangeVisitor = (name, other, value, updatedList) => {
    visitorEntryFormik.setFieldValue(name, value);

    if (updatedList.length > 0) {
      // let visitor: any = updatedList.find((f) => f.VisitorId == value);
      let visitor: any = updatedList.find((f) =>
        f.VisitorDetails.find((i) => i.VisitorDetailId == value)
      );
      if (visitor) {
        visitorEntryFormik.setFieldValue("PersonName", visitor.FirstName);
        visitorEntryFormik.setFieldValue("MobileNo", visitor.MobileNo);
        visitorEntryFormik.setFieldValue("IdProofType", visitor.IdCardType);
        visitorEntryFormik.setFieldValue("VisitorId", visitor.VisitorId);
        visitorEntryFormik.setFieldValue("IdProofNo", visitor.IdCardNo);
        visitorEntryFormik.setFieldValue("TagNo", visitor.TagNo);
        setIsMaterialDetailsShow(false);
        setvisitorEntryDetailList([]);

        if (
          visitorEntryFormik.values.VisitorTypeId == 36 ||
          visitorEntryFormik.values.VisitorTypeId == 35
        ) {
          let obj = {
            VisitorTypeId: visitorEntryFormik.values.VisitorTypeId,
            VisitorId: value,
            VisitorDetailIds: "",
            Detail: 0,
          };
          var result = dispatch(OnChangeVisitor(obj));
          result
            .then((res) => {
              if (res.payload.tranStatus.result == true) {
                let List: any[] = res.payload.VisitorWorkerList;
                for (let i = 0; i < List.length; i++) {
                  const x = List[i];
                  x.Dob = new Date(x.Dob);
                  const formattedDate = x.Dob.toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  });
                  x.ShowDate = formattedDate;
                }
                setvisitorEntryDetailList(List);
              } else {
                toast.current?.show({
                  severity: "error",
                  detail: "Error",
                  summary: res.payload.tranStatus.lstErrorItem[0].Message,
                });
              }
            })
            .catch((error) => {
              toast.current?.show({
                severity: "error",
                detail: "Error",
                summary: JSON.stringify(error),
              });
            });
        }
      }
    }
  };
  useEffect(() => {
    if (visitorEntryDetailList && visitorEntryDetailList.length > 0) {
      visitorEntryFormik.handleSubmit();
      setIsdisableSave(false);
      toast.current?.show({
        severity: "success",
        summary: "Success Message",
        detail: "Appoinment Booked Succeessfully",
      });
    }
  }, [visitorEntryDetailList]);
  const OnChangePartyTypes = (name, other, value) => {
    visitorEntryFormik.setFieldValue(name, value);
    let obj = {
      PartyType: value,
    };
    var result = dispatch(OnChangePartyType(obj));
    result
      .then((res) => {
        if (res.payload.tranStatus.result == true) {
          setPartyNameList(res.payload.PartyNameList);
        } else {
          toast.current?.show({
            severity: "error",
            detail: "Error",
            summary: res.payload.tranStatus.lstErrorItem[0].Message,
          });
        }
      })
      .catch((error) => {
        toast.current?.show({
          severity: "error",
          detail: "Error",
          summary: JSON.stringify(error),
        });
      });
  };
  const onClickIsAppointmentBooking = (event) => {
    visitorEntryFormik.setFieldValue(event.target.name, event.checked);
    let VisitorTypeId: number = event.value
      ? event.value
      : visitorEntryFormik.values.VisitorTypeId;
    let obj = {
      target: { name: "ValidFrom" },
      value: DtoVisitorEntryHeader
        ? new Date(DtoVisitorEntryHeader.ValidFrom)
        : new Date(),
      VisitorTypeId: VisitorTypeId,
    };
    let isexisvehicle = {
      target: { name: "IsExistingVehicle" },
      checked: DtoVisitorEntryHeader
        ? DtoVisitorEntryHeader.IsExistingVehicle
        : true,
    };
    onClickIsExistingVehicle(isexisvehicle);
    let isexisdriver = {
      target: { name: "IsExistingDriver" },
      checked: DtoVisitorEntryHeader
        ? DtoVisitorEntryHeader.IsExistingDriver
        : true,
    };
    onClickIsExistingDriver(isexisdriver);
    setIsPartyDisable(true);
    setIsDeliveryChallan(false);
    setIsInvoiceBased(false);
    setIsVehicleTripBased(false);
    setIsVehicleDetailsDisable(true);
    setShowVisitorContranctor(true);
    setIsMaterialDetailsShow(false);
    if (isCreate) {
      visitorEntryFormik.setFieldValue("PartyType", null);
      visitorEntryFormik.setFieldValue("PartyName", null);
      visitorEntryFormik.setFieldValue("RouteId", null);
      visitorEntryFormik.setFieldValue("NumberOfPassengers", "");
      visitorEntryFormik.setFieldValue("PlannedTravellingKm", "");
      visitorEntryFormik.setFieldValue("ActualTravellingKm", "");
      visitorEntryFormik.setFieldValue("ValidFrom", new Date());
      visitorEntryFormik.setFieldValue("ValidTo", new Date());
      setPartyNameList([]);
      setVisitorEntryMaterialDetailList([]);
      setVisitorEntryBelongingDetailList([]);
      // setvisitorEntryDetailList([]);
      let mobobj: any = {};
      let lapobj: any = {};
      mobobj.VisitorEntryBelongingDetailId = 0;
      mobobj.VisitorEntryId = 0;
      mobobj.DeviceNo = "";
      mobobj.DeviceName = "Mobile";
      lapobj.VisitorEntryBelongingDetailId = 0;
      lapobj.VisitorEntryId = 0;
      lapobj.DeviceNo = "";
      lapobj.DeviceName = "Laptop";
      setVisitorEntryBelongingDetailList([mobobj, lapobj]);
      let matobj: any = {};
      matobj.VisitorEntryMaterialDetailId = 0;
      matobj.VisitorEntryId = 0;
      matobj.MaterialId = null;
      matobj.Uom = null;
      matobj.Qty = "";
      setVisitorEntryMaterialDetailList([matobj]);
    }
    setIsBelongingDetailsShow(false);
    setIsWorkerDetailsShow(false);
    setInvoiceNumberDisable(true);
    setDcNumberDisable(true);
    setPoNumberDisable(true);
    setContainerNumberDisable(true);
    setCheckboxDisable(true);
    if (VisitorTypeId == 35) {
      //Individual
      setIsBelongingDetailsShow(true);
      setCheckboxDisable(false);
      if (event.checked) {
        setValidFromDisable(false);
        setValidToDisable(true);
      } else {
        setValidFromDisable(true);
        setValidToDisable(true);
      }
      onChageFromDate(obj);
    } else if (VisitorTypeId == 36) {
      //Contractor
      setIsBelongingDetailsShow(true);
      setIsWorkerDetailsShow(true);
      if (event.checked) {
        setValidFromDisable(false);
        setValidToDisable(false);
        onChageFromDate(obj);
      } else {
        setValidFromDisable(true);
        setValidToDisable(true);
      }
    } else {
      setShowVisitorContranctor(false);

      if (VisitorTypeId == 64) {
        //Delivery Challan
        setIsPartyDisable(false);
        setIsDeliveryChallan(true);
        setIsVehicleDetailsDisable(false);
        setIsMaterialDetailsShow(true);
        setValidFromDisable(true);
        setValidToDisable(true);
        setInvoiceNumberDisable(false);
        setDcNumberDisable(false);
        setContainerNumberDisable(false);
      } else if (VisitorTypeId == 65) {
        //Invoice Based
        setIsPartyDisable(false);
        setIsInvoiceBased(true);
        setIsVehicleDetailsDisable(false);
        setIsMaterialDetailsShow(true);
        setValidFromDisable(true);
        setValidToDisable(true);
        setInvoiceNumberDisable(false);
        setPoNumberDisable(false);
        setContainerNumberDisable(false);
      } else if (VisitorTypeId == 66) {
        //Vehicle Trip Based
        setIsVehicleTripBased(true);
        setIsVehicleDetailsDisable(false);
        setValidFromDisable(true);
        setValidToDisable(true);
      }
    }
  };
  const handleIsPreBook = (event) => {
    visitorEntryFormik.setFieldValue(event.target.name, event.value);
    let idprebooking = event.value;
    if (idprebooking == 15) {
      //Yes
      route.push("/home/vVisitorEntry");
    } else {
      //No
      visitorEntryFormik.setFieldValue("VisitorEntryCode", "");
      visitorEntryFormik.setFieldValue("VisitorEntryDate", new Date());
      onChangeVisitorType("VisitorTypeId", {}, 35);
      onChangeVisitorTypeVM("VisitorTypeId", {}, 35);
    }
  };
  const onChageFromDate = (event) => {
    visitorEntryFormik.setFieldValue(event.target.name, event.value);
    let VisitorTypeId = event.VisitorTypeId
      ? event.VisitorTypeId
      : visitorEntryFormik.values.VisitorTypeId;
    if (VisitorTypeId == 35) {
      //Indivudal
      visitorEntryFormik.setFieldValue("ValidTo", event.value);
    } else if (VisitorTypeId == 36) {
      //Contractor
      visitorEntryFormik.setFieldValue("ValidTo", null);
      setTominDate(event.value);
    }
  };
  const onChageToDate = (event) => {
    visitorEntryFormik.setFieldValue(event.target.name, event.value);
  };
  const onClickIsExistingVehicle = (event) => {
    visitorEntryFormik.setFieldValue(event.target.name, event.checked);
    if (isCreate) {
      visitorEntryFormik.setFieldValue("VehicleName", "");
      visitorEntryFormik.setFieldValue("VehicleNo", "");
    }
    setHideVehicleDD(event.checked);
  };
  const OnChangeVehicle = (name, other, value) => {
    visitorEntryFormik.setFieldValue(name, value);

    visitorEntryFormik.setFieldValue(
      "VehicleNo",
      VehicleList.find((f) => f.VehicleName == value).VehicleNo
    );
  };
  const onClickIsExistingDriver = (event) => {
    visitorEntryFormik.setFieldValue(event.target.name, event.checked);
    if (isCreate) visitorEntryFormik.setFieldValue("DriverId", "");
    setHideDriverDD(event.checked);
  };
  const onChangeMatType = (name, other, value) => {
    visitorEntryFormik.setFieldValue(name, value);
  };
  const onUpload = (e) => {
    setPhoto(e);
    visitorEntryFormik.setFieldValue("VisitorImageName", e.name);
    visitorEntryFormik.setFieldValue("VisitorImageUrl", e.name);
    const uploadedImageUrl = URL.createObjectURL(e);
    setImageUrl(uploadedImageUrl);
  };
  const onUploadDocument = (e) => {
    setDocument(e.files[0]);
    visitorEntryFormik.setFieldValue("VehicleDocumentName", e.files[0].name);
    visitorEntryFormik.setFieldValue("VehicleDocumentUrl", e.files[0].name);
    const uploadedImageUrl = URL.createObjectURL(e.files[0]);
    setDocumentUrl(uploadedImageUrl);
  };
  const deleteDocuments = () => {
    setDocumentUrl("");
    setDocument(null);
    visitorEntryFormik.setFieldValue("VehicleDocumentName", "");
    visitorEntryFormik.setFieldValue("VehicleDocumentUrl", "");
  };
  const handleHyperlink = () => {
    if (documentUrl != "") {
      window.open(documentUrl, "_blank");
    }
  };
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

  const loadMobileNo = () => {
    if (
      visitorFormik.values.MobileNo == "" ||
      visitorFormik.values.MobileNo == null
    ) {
      return toastValidation("Please Enter WhatsApp Mobile No.");
    }
    if (visitorFormik.values.MobileNo.length != 10) {
      return toastValidation("Please Enter Valid WhatsApp Mobile No.");
    }
   
    let mobNo = {
      MobileNo: visitorFormik.values.MobileNo,
      PlantId: accessData && accessData?.PlantId,
      CompanyId: accessData && accessData?.CompanyId,
      RoleId: (accessData && accessData?.RoleId) || 0,
    };
    var updateres = dispatch(OnEnterMobileNo(mobNo));
    updateres
      .then((res) => {
        if (res.payload.tranStatus.result == true) {
          if (
            res.payload.VisitorEntryHeader != "" &&
            res.payload.VisitorEntryHeader != null
          ) {
            let vData = res.payload.VisitorEntryHeader;
            setCurrVisData(vData);
            loadVisData(vData);
            setPageTypeTogg(false);
          }
          // else {
          //   loadVisData({
          //     PersonName: "",
          //     VisitorCompany: "",
          //     MailId: "",
          //     IdCardType: null,
          //     IdCardNo: "",
          //     TagNo: "",
          //   });
          // }
        }
      })
      .catch((err) => {});
  };

  const loadVisData = (vData) => {
    visitorFormik.setFieldValue("FirstName", vData.PersonName);
    visitorFormik.setFieldValue("VisitorCompany", vData.VisitorCompany);
    visitorFormik.setFieldValue("MobileNo", vData.MobileNo);
    visitorFormik.setFieldValue("MailId", vData.MailId);
    visitorFormik.setFieldValue("IdProofType", vData.IdCardType);
    visitorFormik.setFieldValue("IdProofNo", vData.IdCardNo);
    visitorFormik.setFieldValue("TagNo", vData.TagNo);
    visitorFormik.setFieldValue("IsTermsAgreed", vData.IsTermsAgreed);
    visitorFormik.setFieldValue("DigitalSignName", vData.DigitalSignName);
    visitorFormik.setFieldValue("DigitalSignUrl", vData.DigitalSignUrl);
    if (vData.IsTermsAgreed &&isTermsNeeded) {
      console.log(vData.DigitalSignUrl);
      if (vData.DigitalSignUrl != null) {
        setSignedUrl(vData.DigitalSignUrl);
      }
      setIsChecked(true);
      setIsdisableSave(false);
      handleTermsCheck({
        target: {
          name: "IsTermsAgreed",
          checked: true,
        },
      });
      toast.current?.show({
        severity: "info",
        summary: "Info Message",
        detail: "You have Already Agreed to Terms and Conditions.",
        life: 6000,
      });
      return;
    }

    visitorEntryFormik.setFieldValue("FirstName", vData.PersonName);
    visitorEntryFormik.setFieldValue("VisitorCompany", vData.VisitorCompany);
    visitorEntryFormik.setFieldValue("MailId", vData.MailId);
    visitorEntryFormik.setFieldValue("MobileNo", vData.MobileNo);
    visitorEntryFormik.setFieldValue("IdProofType", vData.IdCardType);
    visitorEntryFormik.setFieldValue("IdProofNo", vData.IdCardNo);
    visitorEntryFormik.setFieldValue("TagNo", vData.TagNo);
  };

  const onChangeVisitorType = (name, other, value) => {
    setVisitorNameList([]);
    if (isCreate) setvisitorEntryDetailList([]);
    visitorEntryFormik.setFieldValue(name, value);
    setVisType([], value);
    // let obj = {
    //   VisitorTypeId: value,
    //   CompanyId: accessData && accessData?.CompanyId,
    //   RoleId: 1,
    // };
    // var result = dispatch(OnChangeVisitorType(obj));
    // result
    //   .then((res) => {
    //     if (res.payload.tranStatus.result == true) {
    //       setVisitorNameList(res.payload.VisitorNameList);
    //       setTempVisitorNameList(res.payload.VisitorNameList);
    //       setVehicleList(res.payload.VehicleList);
    //       setTempVehicleList(res.payload.VehicleList);
    //       if (isCreate) {
    //         visitorEntryFormik.setFieldValue("VisitorId", null);
    //         visitorEntryFormik.setFieldValue("PersonName", "");
    //         visitorEntryFormik.setFieldValue("MobileNo", "");
    //         visitorEntryFormik.setFieldValue("IdProofType", null);
    //         visitorEntryFormik.setFieldValue("IdProofNo", "");
    //         visitorEntryFormik.setFieldValue("InvoiceNumber", "");
    //         visitorEntryFormik.setFieldValue("DcNumber", "");
    //         visitorEntryFormik.setFieldValue("PoNumber", "");
    //         visitorEntryFormik.setFieldValue("ContainerNumber", "");
    //       }
    //       let event = {
    //         target: { name: "IsAppointmentBooking" },
    //         checked: true,
    //         value: value,
    //       };
    //       onClickIsAppointmentBooking(event);
    //     } else {
    //       toast.current?.show({
    //         severity: "error",
    //         detail: "Error",
    //         summary: res.payload.tranStatus.lstErrorItem[0].Message,
    //       });
    //     }
    //   })
    //   .catch((error) => {
    //     toast.current?.show({
    //       severity: "error",
    //       detail: "Error",
    //       summary: JSON.stringify(error),
    //     });
    //   });
  };
  const setVisType = (res, value) => {
    if (res && res.length > 0) {
      setVisitorNameList(res.payload.VisitorNameList);
      setTempVisitorNameList(res.payload.VisitorNameList);
      setVehicleList(res.payload.VehicleList);
      setTempVehicleList(res.payload.VehicleList);
    }
    if (isCreate) {
      visitorEntryFormik.setFieldValue("VisitorId", null);
      visitorEntryFormik.setFieldValue("PersonName", "");
      visitorEntryFormik.setFieldValue("MobileNo", "");
      visitorEntryFormik.setFieldValue("IdProofType", null);
      visitorEntryFormik.setFieldValue("IdProofNo", "");
      visitorEntryFormik.setFieldValue("InvoiceNumber", "");
      visitorEntryFormik.setFieldValue("DcNumber", "");
      visitorEntryFormik.setFieldValue("PoNumber", "");
      visitorEntryFormik.setFieldValue("ContainerNumber", "");
    }
    let event = {
      target: { name: "IsAppointmentBooking" },
      checked: true,
      value: value,
    };
    onClickIsAppointmentBooking(event);
  };
  const handlePlantSelect = (name, other, value) => {
    visitorEntryFormik.setFieldValue("DeptId", null);
    visitorEntryFormik.setFieldValue("VisitedEmployeeId", null);
    visitorEntryFormik.setFieldValue("AreaToVisit", null);
    setEmployeeList([]);
    setPlantWiseDepartmentList([]);
    setAreaList([]);
    visitorEntryFormik.setFieldValue(name, value);
    let obj = {
      PlantId: value,
    };
    var result = dispatch(OnChangePlant(obj));
    result
      .then((res) => {
        if (res.payload.tranStatus.result == true) {
          let areaList = res.payload.AreaList;
          setPlantWiseDepartmentList(res.payload.OnchangePlantList);
          setAreaList(areaList);
          if (areaList && areaList.length > 0 && areaList.length == 1) {
            handlePoVSelect("AreaToVisit", {}, [areaList[0]?.AreaId], 0);
          }
        } else {
          toast.current?.show({
            severity: "error",
            detail: "Error",
            summary: res.payload.tranStatus.lstErrorItem[0].Message,
          });
        }
      })
      .catch((error) => {
        toast.current?.show({
          severity: "error",
          detail: "Error",
          summary: JSON.stringify(error),
        });
      });
  };
  const handleDepartmentSelect = (name, other, value) => {
    visitorEntryFormik.setFieldValue(name, value);
    let obj = {
      DeptId: value,
      PlantId: visitorEntryFormik.values.PlantId,
    };
    var result = dispatch(OnChangeDepartment(obj));
    result
      .then((res) => {
        if (res.payload.tranStatus.result == true) {
          setEmployeeList(res.payload.EmployeeList);
        } else {
          toast.current?.show({
            severity: "error",
            detail: "Error",
            summary: res.payload.tranStatus.lstErrorItem[0].Message,
          });
        }
      })
      .catch((error) => {
        toast.current?.show({
          severity: "error",
          detail: "Error",
          summary: JSON.stringify(error),
        });
      });
  };
  // Visitor Entry Functions

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 760) {
        setScreenSized(true);
      } else if (window.innerWidth >= 760) {
        setScreenSized(false);
      }
    };
    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  });

  useEffect(() => {
    pageLoadScript();
    setSelectedData({
      ...selectedData,
      selectedType: 35,
    });
    // if (accessData && accessData != null) {
    //   if (query && query.size > 0 && query.get("accessToken")) {
    //     if (checked || !checked) {
    //       const checkTrialRes = dispatch(
    //         checkAuthTrial({
    //           accessToken: query.get("accessToken"),
    //         })
    //       );
    //       checkTrialRes
    //         .then((res) => {
    //           let resP = res.payload;

    //           if (res.payload.tranStatus.result == true) {
    //             setIsWarningPop(false);
    //             CreatePageOnLoad(0);
    //             pageTypeChanged({ value: false });
    //           } else {
    //             // toast.current?.show({
    //             //   severity: "warn",
    //             //   summary: "Warning Message",
    //             //   detail: res.payload.tranStatus.lstErrorItem[0].Message,
    //             // });
    //             setIsWarningPop(true);
    //             resP?.tranStatus?.lstErrorItem &&
    //               resP?.tranStatus?.lstErrorItem.length > 0 &&
    //               resP?.tranStatus?.lstErrorItem.forEach((element) => {
    //                 toast.current?.show({
    //                   severity: "warn",
    //                   summary: element.Title,
    //                   detail: element.Message,
    //                 });
    //               });
    //             // setLoadingPage(true);
    //             // setTimeout(() => {
    //             //   route.push("/");
    //             // }, 1500);
    //             // return;
    //           }
    //         })
    //         .catch((err) => {});
    //     }
    //   }
    // }
  }, [checked, accessData]);

  const handleToastNotify = (error) => {
    toast?.current?.show({
      severity: "error",
      detail: "Error",
      summary: "error",
    });
    toast.current?.show({
      severity: "error",
      summary: "Error Message",
      detail: error.payload.tranStatus.lstErrorItem[0].Message,
    });
    toast.current?.show({
      severity: "error",
      summary: "Error Message",
      detail: JSON.stringify(error),
    });
    toast.current?.show({
      severity: "error",
      summary: "Error Message",
      detail: "Check In Already Done for this Specific Date/ Time.",
    });
    toast.current?.show({
      severity: "success",
      summary: "Success Message",
      detail: error.payload.tranStatus.lstErrorItem[0].Message,
    });
  };

  useEffect(() => {
    if (!checked) {
      if (
        selectedData?.selectedType != 66 ||
        selectedData?.selectedType != 65
      ) {
        if (
          selectedVisitor &&
          selectedHost &&
          Object.keys(selectedVisitor).length > 0 &&
          Object.keys(selectedHost).length > 0
        ) {
          if (selectedVisitor && selectedHost) {
            setVisible(true);
            // setShowEntryDetail(true);
          }
        }
      }
      if (selectedVeh) {
        if (Object.keys(selectedVeh).length > 0) {
          setVisible(true);
          // setShowEntryDetail(true);
        }
      }

      if (selectedInv) {
        setVisible(true);
      }
    }
  }, [selectedVisitor, selectedHost, selectedVeh, selectedInv]);

  const CreatePageOnLoad = (VisitorEntryId: number) => {
    if (checked) {
      // setSearchConfig({
      //   isVisitor: false,
      //   isContract: false,
      //   isVehTrip: false,
      //   isInvoice: false,
      // });
      // Fetch();
      const data = {
        VisitorEntryId: VisitorEntryId,
        CompanyId: accessData && accessData?.CompanyId,
        RoleId: 1,
      };
      var result = dispatch(createInit(data));
      result
        .then((res) => {
          if (res.payload.tranStatus.result == true) {
            // setEmployeeList(res.payload.EmployeeList);
            // setTempEmployeeList(res.payload.EmployeeList);

            setVisitorNameList(res.payload.VisitorNameList);
            setTempVisitorNameList(res.payload.VisitorNameList);
          }
        })
        .catch((error) => {});
    } else {
      // setSearchConfig({
      //   isVisitor: true,
      //   isContract: false,
      //   isVehTrip: false,
      //   isInvoice: false,
      // });
      const data = {
        VisitorEntryId: VisitorEntryId,
        CompanyId: accessData && accessData?.CompanyId,
        RoleId: 1,
      };
      var result = dispatch(createInit(data));
      result
        .then((res) => {
          if (res.payload.tranStatus.result == true) {
            // setEmployeeList(res.payload.EmployeeList);
            // setTempEmployeeList(res.payload.EmployeeList);

            setVisitorNameList(res.payload.VisitorNameList);
            setTempVisitorNameList(res.payload.VisitorNameList);
          }
        })
        .catch((error) => {});
    }
  };

  const Fetch = () => {
    let obj = {
      PlantId: accessData && accessData?.GateId,
    };
    var result = dispatch(fetch(obj));
    result
      .then((res) => {
        if (res.payload.tranStatus.result == true) {
          setVisitorEntryBooked(
            res.payload.VisitorEntryList.filter(
              (item) => item.IsAppointmentBooking == true
            )
          );
          setVisitorTempEntryBooked(
            res.payload.VisitorEntryList.filter(
              (item) => item.IsAppointmentBooking == true
            )
          );
        } else {
          toast.current?.show({
            severity: "error",
            detail: "Error",
            summary: res.payload.tranStatus.lstErrorItem[0].Message,
          });
        }
      })
      .catch((error) => {
        toast.current?.show({
          severity: "error",
          detail: "Error",
          summary: JSON.stringify(error),
        });
      });
  };
  // const itemTemplate = () => {
  //   return (
  //     <div className="flex align-items-center flex-column">
  //       <i
  //         className="pi pi-image mt-3 p-5"
  //         style={{
  //           fontSize: "5em",
  //           borderRadius: "50%",
  //           backgroundColor: "var(--surface-b)",
  //           color: "var(--surface-d)",
  //         }}
  //       ></i>
  //       <span
  //         style={{ fontSize: "1.2em", color: "var(--text-color-secondary)" }}
  //         className="my-5"
  //       >
  //         Drag and Drop Image Here
  //       </span>
  //     </div>
  //   );
  // };
  const customHeader = (
    <React.Fragment>
      <h2 style={{ marginBottom: 0 }}>Sidebar</h2>
    </React.Fragment>
  );

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchId == "visit_search") {
        const filteredResults = TempVisitorNameList.filter((item) =>
          item.FirstName.toLowerCase().includes(searchTerm.toLowerCase())
        );

        setVisitorNameList(filteredResults);
        if (searchTerm == "") setVisitorNameList(TempVisitorNameList);
      }
      if (searchId == "host_search") {
        const filteredResults = TempEmployeeList.filter((item) =>
          item.EmployeeName.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setEmployeeList(filteredResults);
        if (searchTerm == "") setEmployeeList(TempEmployeeList);
      }
      if (searchId == "vehicle_search") {
        const filteredResults = TempVehicleList.filter((item) =>
          item.VehicleNo.includes(searchTerm)
        );
        setVehicleList(filteredResults);
        if (searchTerm == "") setVehicleList(TempVehicleList);
      }
      if (searchId == "appointment_search") {
        const filteredResults = TempVisitorEntryBooked.filter((item) =>
          item.VisitorEntryCode.includes(searchTerm)
        );
        setVisitorEntryBooked(filteredResults);
        if (searchTerm == "") setVisitorEntryBooked(TempVisitorEntryBooked);
      }
      // if(searchId == "visitor_search" || searchId == "host_search") {
      //   if(selectedData.selectedType == 36) {

      //   }
      // }
    }, 10);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, searchId]);
  // }, [searchTerm, VisitorNameList, EmployeeList, searchId]);

  const handleSearchAction = (e) => {
    setSearchTerm(e.target.value);
    setSearchId(e.target.id);
  };

  const handleEmployeeSelect = (e, item) => {
    if (item) {
      setSelectedData({
        ...selectedData,
        selectedWhomToVisit: item.UserId,
      });
      setSelectedHost(item);
      setEmployeeList({
        ...EmployeeList,
      });
      const updatedEmpHost = EmployeeList.map((element) => ({
        ...element,
        IsActive: element.UserId === item.UserId,
      }));

      setEmployeeList(updatedEmpHost);
    }
  };

  const handleVisitorSelect = (e, item) => {
    if (item) {
      setSelectedData({
        ...selectedData,
        selectedVisitorId: item.VisitorId,
      });
      setSelectedVisitor(item);
      setVisitorNameList({
        ...VisitorNameList,
      });

      const updatedVistEmp = VisitorNameList.map((element) => ({
        ...element,
        IsActive: element.VisitorId === item.VisitorId,
      }));

      setVisitorNameList(updatedVistEmp);
    }
  };

  const handleVehicleSelect = (e, item) => {
    if (item) {
      setSelectedVeh({
        ...selectedVeh,
        vehicleNo: item.VehicleNo,
      });

      const updatedVisitVeh = VehicleList.map((element) => ({
        ...element,
        IsActive: element.VehicleNo === item.VehicleNo,
      }));

      setVehicleList(updatedVisitVeh);
      OnChangeVehicle("VehicleName", {}, item.VehicleName);
    }
  };

  const handleBookedVisitor = (e, item) => {
    if (item) {
      let filtEmp = EmployeeList.filter(
        (emp) => emp.EmployeeId == item.VisitedEmployeeId
      );
      let filtVis = VisitorNameList.filter(
        (emp) => emp.VisitorId == item.VisitorId
      );

      handleVisitorSelect(e, filtVis[0]);
      handleEmployeeSelect(e, filtEmp[0]);
      setSelectedData({
        ...selectedData,
        selectedVisitorId: item.VisitorId,
      });
      setBookedVisitor(item);
      let dataObj = {
        data: item,
      };
      let obj = {
        VisitorEntryId: item?.VisitorEntryId,
        CompanyId: accessData && accessData?.CompanyId,
        RoleId: 1,
      };
      const workerList = dispatch(createInit(obj));
      workerList
        .then((res) => {
          setContWorker(res.payload.VisitorEntryDetail);
          setContHead(res.payload.VisitorEntryHeader);
          handleWorkerPass(
            e,
            res.payload.VisitorEntryDetail[0],
            res.payload.VisitorEntryHeader
          );
          setDialogVisible(true);
        })
        .catch((err) => {});
    }
  };

  const handleWorkerPass = (e, item, contract) => {
    if (item && contHead) {
      let filtEmp = EmployeeList.filter((emp) =>
        emp.EmployeeId == Object.keys(contHead).length > 0
          ? contHead.VisitedEmployeeId
          : contract.VisitedEmployeeId
      );

      let filtVis = VisitorNameList.filter((emp) =>
        emp.VisitorId == contract ? contract.VisitorId : contHead.VisitorId
      );

      handleVisitorSelect(e, filtVis[0]);
      handleEmployeeSelect(e, filtEmp[0]);
      setSelectedData({
        ...selectedData,
        selectedVisitorId: contract ? contract.VisitorId : contHead.VisitorId,
      });

      item = {
        ...item,
        VisitorImageUrl: contract
          ? contract.VisitorImageUrl
          : contHead.VisitorImageUrl,
        VisitorEntryCode: contract
          ? contract.VisitorEntryCode
          : contHead.VisitorEntryCode,
        PersonName: item.FirstName + " " + item.LastName,
        PersonToVisit: filtEmp && filtEmp[0]?.EmployeeName,
        VisitorEntryDate: contract
          ? contract.VisitorEntryDate
          : contHead.VisitorEntryDate,
        AreaToVisitName: contract
          ? contract.AreaToVisitName
          : contHead.AreaToVisitName,
        VisitedEmployeeId: contract
          ? contract.VisitedEmployeeId
          : contHead.VisitedEmployeeId,
        VisitorTypeId: contract
          ? contract.VisitorTypeId == 36
            ? 50
            : contract.VisitorTypeId
          : contHead.VisitorTypeId == 36
          ? 50
          : contHead.VisitorTypeId,
      };
      setBookedVisitor(item);
      let dataObj = {
        data: item,
      };

      setPassData(dataObj.data);
      // localStorage.setItem("clickedRowData", JSON.stringify(dataObj));
      // setShowEntryDetail(true);
    }
  };

  // const handleSearchAction = (e) => {
  //   if (e.target.id === "visitor_search") {
  //     const searchValue = e.target.value.toLowerCase();
  //

  //     if (searchValue == "" || searchValue == undefined) {
  //       setVisitorNameList(TempVisitorNameList);
  //     } else {
  //       const filteredList = VisitorNameList.filter((element) => {
  //         const searchTxt = element.FirstName.toLowerCase().replace(" ", "");
  //         return searchTxt.includes(searchValue);
  //       });

  //       setVisitorNameList(filteredList);
  //     }
  //   } else {
  //     setVisitorNameList(TempVisitorNameList);
  //   }
  // };

  const handleClosePop = () => {
    setVisible(false);
    setSelectedVisitor({});
    setSelectedHost({});
    setSelectedVeh({});
    setSelectedInv(false);
    const updatedVistEmp = VisitorNameList.map((element) => ({
      ...element,
      IsActive: false,
    }));
    setVisitorNameList(updatedVistEmp);
    const updatedEmpHost = EmployeeList.map((element) => ({
      ...element,
      IsActive: false,
    }));
    setEmployeeList(updatedEmpHost);
    const updatedVeh = VehicleList.map((element) => ({
      ...element,
      IsActive: false,
    }));
    setVehicleList(updatedVeh);
  };
  // Visitor Master
  // Visitor Master

  const saveVisitorDetails = () => {
    if (!isVisMaster == true) {
      // visitorFormik.handleSubmit();

      const validTrue = checkVisEntryValidation(visitorEntryFormik.values);
      if (validTrue == true) {
        setIsVisMaster(true);
      }
    } else {
      localStorage.setItem(
        "visMaster",
        JSON.stringify(visitorEntryFormik.values)
      );
      // visitorEntryFormik.setFieldValue(
      //   "VisitorId",
      //   visitorFormik.values.FirstName + " " + visitorFormik.values.LastName
      // );
      setIsVisMaster(false);
    }
  };

  const checkVisMasterValidation = (values) => {
    const emailRegExp = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    if (values.TitleId == "" || values.TitleId == null)
      return toastValidation("Please Select Title.");
    if (values.FirstName == "" || values.FirstName == null)
      return toastValidation(
        `Please Enter ${pageType ? "Worker" : "Visitor"} Name.`
      );
    // if (values.MailId == "" || values.MailId == null)
    //   return toastValidation("Please enter Mail ID.");
    if (
      !emailRegExp.test(values.MailId) &&
      values.MailId == "" &&
      values.MailId == null
    )
      return toastValidation("Please Enter Valid Mail ID.");
    if (values.MobileNo == "" || values.MobileNo == null)
      return toastValidation("Please Enter Mobile No.");
    if (values.MobileNo.length != 10)
      return toastValidation("Please Enter Valid Mobile No.");
   
    // if (values.Address == "" || values.Address == null)
    // return toastValidation("Please Enter Address.");
    if (
      values.DocumentUrl == "" ||
      values.DocumentUrl == null ||
      values.DocumentName == "" ||
      values.DocumentName == null
    )
      return toastValidation("Please Capture Image.");
    return true;
  };

  const checkVisEntryValidation = (values) => {
    if (values.PlantId == "" || values.PlantId == null)
      return toastValidation("Please Select Plant");
    if (!values.VisitedEmployeeId)
      return toastValidation("Please Select Person To Visit");
    if (!values.ValidFrom && values.VisitorTypeId != 36)
      return toastValidation("Please Select Appointment Date");
    if (values.PurposeOfVisit == null || values.PurposeOfVisit == "") {
      return toastValidation("Please Select Purpose Of Visit");
    }
    return true;
  };

  const saveVisitor = () => {
    const checkVisValidations = checkVisMasterValidation(visitorFormik.values);

    if (checkVisValidations == true) {
      if (
        !visitorEntryFormik.values.ValidTo &&
        visitorEntryFormik.values.VisitorTypeId == 36
      )
        return toastValidation("Please Select Valid To Date");
      visitorFormik.handleSubmit();
    }
  };

  // VIS MASTER
  const visitorRef: any = useRef(null);
  const visitorDetailRef: any = useRef(null);

  const [imageUrlVM, setImageUrlVM] = useState(IMAGES.NO_IMG);
  const [documentUrlVM, setDocumentUrlVM] = useState("");
  const [documentUrlVisitor, setDocumentUrlVisitor] = useState("");
  const [visitorDetailList, setVisitorDetailList] = useState([]);
  const [PlantWiseDepartmentList, setPlantWiseDepartmentList] = useState([]);
  const [photoVM, setPhotoVM] = useState<File | null>(null);
  const [documentVM, setDocumentVM] = useState<File | null>(null);
  const [visitordocument, setVisitorDocument] = useState<File | null>(null);
  const [documentfiles, setDocumentfiles] = useState<File[] | null>([]);
  const [documentfilesVis, setDocumentfilesVis] = useState<File[] | null>([]);
  const [disableForm, setDisableForm] = useState(true);
  const [tempStateList, setTempStateList] = useState([]);
  const [tempCityList, setTempCityList] = useState([]);
  const [IsdisableSaveVM, setIsdisableSaveVM] = useState(false);
  const documentUploadRef = useRef<any>(null);
  const documentVisitorUploadRef = useRef<any>(null);
  const profUploadRef = useRef<any>(null);
  const [rowIndex, setRowIndex] = useState(-1);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState<string>("");

  useEffect(() => {
    pageLoadScript();
  });

  const {
    isCreateVM,
    isViewVM,
    createEditData,
    loadingVM,
    errorVM,
    tranStatusVM,
    VisitorHeaderVM,
    VisitorTypeListVM,
    TitleListVM,
    IdCardListVM,
    StatusListVM,
    CountryListVM,
    StateListVM,
    CityListVM,
    DepartmentListVM,
    VisitorDetailVM,
    VisitorSearchList,
    WorkSeverityListVM,
  } = useSelector((state: any) => state.externalBookVisitor);

  const TableHeader = () => {
    const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      let _filters = { ...filters };
      _filters["global"].value = value;
      setFilters(_filters);
      setGlobalFilterValue(value);
    };
    return (
      <div className="flex justify-content-between">
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
  useEffect(() => {
    if (isCreate == false || isView == true) {
      if (!isCreate) {
        if (VisitorHeaderVM.VisitorTypeId == 35) {
          setDisableForm(true);
        } else {
          setDisableForm(false);
        }
      }
      let List: any[] = [];
      for (let i = 0; i < VisitorDetailVM.length; i++) {
        const x = VisitorDetailVM[i];
        let obj: any = {};
        obj.VisitorDetailId = x.VisitorDetailId;
        obj.VisitorId = x.VisitorId;
        obj.TitleId = x.TitleId;
        obj.FirstName = x.FirstName;
        obj.LastName = x.LastName;
        obj.DepartmentId = x.DepartmentId;
        obj.Dob = new Date(x.Dob);
        obj.MailId = x.MailId;
        obj.MobileNo = x.MobileNo;
        obj.TagNo = x.TagNo;
        obj.VisitorCompany = x.VisitorCompany;
        obj.DigitalSignName = x.DigitalSignName || "";
        obj.DigitalSignUrl = x.DigitalSignUrl || "";
        obj.SignedVersion = x.SignedVersion || 0;
        obj.IsTermsAgreed = x.IsTermsAgreed || 0;
        obj.IdCardType = x.IdCardType;
        obj.IdCardNo = x.IdCardNo;
        obj.DocumentName = x.DocumentName;
        obj.DocumentUrl = x.DocumentUrl;
        obj.Status = x.Status;
        obj.ExpirryDate = x.ExpirryDate;
        obj.WorkSeverity = x.WorkSeverity;
        obj.VisitorName =
          TitleListVM.find((f) => f.MetaSubId == obj.TitleId)
            .MetaSubDescription +
          ". " +
          x.FirstName +
          " " +
          x.LastName;
        obj.DepartMentName = x.DepartmentId
          ? DepartmentList.find((f) => f.DepartmentId == x.DepartmentId)
              .DepartmentName
          : null;
        obj.IdCardTypeName = IdCardListVM.find(
          (d) => d.MetaSubId == x.IdCardType
        ).MetaSubDescription;
        obj.StatusName = StatusList.find(
          (d) => d.MetaSubId == x.Status
        ).MetaSubDescription;
        obj.WorkSeverityName = WorkSeverityListVM.find(
          (d) => d.MetaSubId == x.WorkSeverity
        ).MetaSubDescription;
        const formattedDate = new Date(x.Dob).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
        obj.ShowDate = formattedDate;
        const formattedExDate = new Date(x.ExpirryDate).toLocaleDateString(
          "en-GB",
          {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }
        );
        obj.ShowExpirryDate = formattedExDate;
        List.push(obj);
        fetchBlobFromUrl(obj.DocumentUrl)
          .then((blob) => {
            const file = new File([blob], obj.DocumentName, {
              type: "image/*",
              lastModified: 1695716506050,
            });

            setDocumentfiles([...documentfiles, file]);
          })
          .catch((error) => {
            console.error("Error fetching image:", error);
          });
      }
      setVisitorDetailList(List);
      setDocumentUrlVisitor(VisitorHeaderVM.VisitorDocumentUrl);

      fetchBlobFromUrl(VisitorHeaderVM.DocumentUrl)
        .then((blob) => {
          const file = new File([blob], VisitorHeaderVM.DocumentName, {
            type: "image/*",
            lastModified: 1695716506050,
          });
          setPhoto(file);
          setImageUrl(VisitorHeaderVM.DocumentUrl);
        })
        .catch((error) => {
          console.error("Error fetching image:", error);
        });
    } else {
      // const data = {
      //   VisitorId: 0,
      //   CompanyId: accessData && accessData?.CompanyId,
      // };
      // var result = dispatch(createInitVM(data));
      // result
      //   .then((res) => {
      //     if (res.payload.tranStatus.result) {
      //       if (
      //         res.payload.CountryList &&
      //         res.payload.CountryList.length &&
      //         res.payload.CountryList.length > 0
      //       ) {
      //         Onchangecountry(
      //           "CountryId",
      //           {},
      //           res.payload.CountryList[0].CountryId
      //         );
      //       }
      //     } else {
      //       toast.current?.show({
      //         severity: "error",
      //         summary: "Error",
      //         detail: res.payload.tranStatus.lstErrorItem.message,
      //       });
      //     }
      //   })
      //   .catch((error) => {
      //     toast.current?.show({
      //       severity: "error",
      //       summary: "Error",
      //       detail: JSON.stringify(error),
      //     });
      //   });
    }
  }, []);

  const setLocation = (countList, stateList, cityList) => {
    visitorFormik.setFieldValue(
      "CountryId",
      (countList && countList[0].CountryId) || 1
    );
    visitorFormik.setFieldValue(
      "StateId",
      (stateList && stateList[0].StateId) || 1
    );
    visitorFormik.setFieldValue(
      "CityId",
      (cityList && cityList[0].CityId) || 1
    );
  };

  useEffect(() => {
    setTempCityList(CityListVM);
    setTempStateList(StateListVM);
  }, [CityListVM, StateListVM]);
  async function fetchBlobFromUrlVM(url: string): Promise<Blob> {
    const response: any = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    return await response.blob();
  }
  const visitorForm = {
    VisitorId: VisitorHeaderVM != null ? VisitorHeaderVM.VisitorId : 0,
    VisitorCode: VisitorHeaderVM != null ? VisitorHeaderVM.VisitorCode : "",
    VisitorTypeId: VisitorHeaderVM != null ? VisitorHeaderVM.VisitorTypeId : 35,
    CompanyId:
      VisitorHeaderVM != null
        ? VisitorHeaderVM.CompanyId
        : accessData && accessData?.CompanyId,
    PlantId:
      VisitorHeaderVM != null
        ? VisitorHeaderVM.PlantId
        : accessData && accessData?.PlantId,
    CountryId: VisitorHeaderVM != null ? VisitorHeaderVM.CountryId : null,
    StateId: VisitorHeaderVM != null ? VisitorHeaderVM.StateId : null,
    CityId: VisitorHeaderVM != null ? VisitorHeaderVM.CityId : null,
    TitleId: VisitorHeaderVM != null ? VisitorHeaderVM.TitleId : 37,
    FirstName: VisitorHeaderVM != null ? VisitorHeaderVM.FirstName : "",
    LastName: VisitorHeaderVM != null ? VisitorHeaderVM.LastName : "",
    Dob: VisitorHeaderVM != null ? new Date(VisitorHeaderVM.Dob) : new Date(),
    VisitorCompany:
      VisitorHeaderVM != null ? VisitorHeaderVM.VisitorCompany : "",
    Address: VisitorHeaderVM != null ? VisitorHeaderVM.Address : "",
    MailId: VisitorHeaderVM != null ? VisitorHeaderVM.MailId : "",
    MobileNo: VisitorHeaderVM != null ? VisitorHeaderVM.MobileNo : "",
    TagNo: VisitorHeaderVM != null ? VisitorHeaderVM.TagNo : "",
    IdCardType: VisitorHeaderVM != null ? VisitorHeaderVM.IdCardType : 17,
    IdCardNo: VisitorHeaderVM != null ? VisitorHeaderVM.IdCardNo : "",
    DocumentName: VisitorHeaderVM != null ? VisitorHeaderVM.DocumentName : "",
    DocumentUrl: VisitorHeaderVM != null ? VisitorHeaderVM.DocumentUrl : "",
    VisitorDocumentName:
      VisitorHeaderVM != null ? VisitorHeaderVM.VisitorDocumentName : "",
    VisitorDocumentUrl:
      VisitorHeaderVM != null ? VisitorHeaderVM.VisitorDocumentUrl : "",
    Status: VisitorHeaderVM != null ? VisitorHeaderVM.Status : 1,
    CreatedBy: 0,
    CreatedOn:
      VisitorHeaderVM != null
        ? new Date(VisitorHeaderVM.CreatedOn)
        : new Date(),
    ModifiedBy: 0,
    ModifiedOn: VisitorHeaderVM != null ? new Date() : null,
  };
  const visitorDetailForm = {
    VisitorDetailId: 0,
    VisitorId: 0,
    TitleId: 37,
    FirstName: "",
    LastName: "",
    DepartmentId: null,
    Dob: new Date(),
    MailId: "",
    MobileNo: "",
    TagNo: "",
    VisitorCompany: "",
    DigitalSignName: "",
    DigitalSignUrl: "",
    SignedVersion: 0,
    IsTermsAgreed: false,
    IdCardType: 17,
    IdCardNo: "",
    DocumentName: "",
    DocumentUrl: "",
    Status: 1,
    ExpirryDate: new Date(),
    WorkSeverity: 96,
  };
  const datepipesVM = (date: any) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };
  const visitorFormik: any = useFormik({
    initialValues: visitorForm,
    validationSchema: externalVisitor,
    onSubmit: (values: any, { resetForm }) => {
      if (isVisMaster) {
        setIsdisableSave(true);
        const formData: any = new FormData();
        let VDList: any[] = [];
        values.Dob = datepipes(new Date(values.Dob));
        values.CreatedOn = datepipes(new Date(values.CreatedOn));
        if (!isCreate) {
          values.ModifiedOn = datepipes(new Date(values.ModifiedOn));
        }
        // if (isCreate) {
        //   if (!visitordocument) {
        //     setIsdisableSave(false);
        //     toast.current?.show({
        //       severity: "warn",
        //       summary: "Warning Message",
        //       detail: "Please Add Document.",
        //     });
        //     return;
        //   }
        // }
        if (
          values.VisitorTypeId == 35 ||
          (values.VisitorTypeId == 36 && isCreate == true)
        ) {
          // Individual
          let object: any = {};
          object.VisitorDetailId = 0;
          object.VisitorId = 0;
          object.TitleId = values.TitleId;
          object.FirstName = values.FirstName;
          object.LastName = values.LastName;
          object.DepartmentId = null;
          object.Dob = values.Dob;
          object.MailId = values.MailId;
          object.MobileNo = values.MobileNo;
          object.TagNo = values.TagNo;
          object.VisitorCompany = values.VisitorCompany;
          object.DigitalSignName = values.DigitalSignName || "";
          object.DigitalSignUrl = values.DigitalSignUrl || "";
          object.SignedVersion = values.SignedVersion;
          object.IsTermsAgreed = values.IsTermsAgreed;
          object.IdCardType = values.IdCardType;
          object.IdCardNo = values.IdCardNo;
          object.DocumentName = values.DocumentName;
          object.DocumentUrl = values.DocumentUrl;
          object.Status = values.Status;
          object.ExpirryDate = new Date();
          object.WorkSeverity = 96;
          VDList.push(object);
        } else if (values.VisitorTypeId == 35 && isCreate == false) {
          visitorDetailList.forEach((object) => {
            object.TitleId = values.TitleId;
            object.FirstName = values.FirstName;
            object.LastName = values.LastName;
            object.Dob = values.Dob;
            object.MailId = values.MailId;
            object.MobileNo = values.MobileNo;
            object.TagNo = values.TagNo;
            object.VisitorCompany = values.VisitorCompany;
            object.DigitalSignName = values.DigitalSignName || "";
            object.DigitalSignUrl = values.DigitalSignUrl || "";
            object.SignedVersion = values.SignedVersion;
            object.IsTermsAgreed = values.IsTermsAgreed;
            object.IdCardType = values.IdCardType;
            object.IdCardNo = values.IdCardNo;
          });
          VDList = visitorDetailList;
        } else {
          visitorDetailList.forEach((object) => {
            delete object.VisitorName;
            delete object.DepartMentName;
            delete object.IdCardTypeName;
            delete object.StatusName;
            delete object.ShowExpirryDate;
            delete object.WorkSeverityName;
            object.Dob = datepipes(new Date(object.Dob));
            object.ExpirryDate = datepipes(new Date(object.ExpirryDate));
          });
          VDList = visitorDetailList;
        }
        if (VDList.length == 0) {
          setIsdisableSave(false);
          // toast.current?.show({
          //   severity: "warn",
          //   summary: "Warning Message",
          //   detail: "Please Add Atleast One Worker Detail.",
          // });
          // return;
        }
        formData.append("webfile", photo);
        formData.append("webfile1", visitordocument);
        formData.append("digSign", null);

        for (var x in documentfiles) {
          var index = VDList.findIndex(
            (obj) => obj.DocumentName == documentfiles[x].name
          );

          if (index != -1) {
            formData.append("webfiles", documentfiles[x]);
          }
        }
        for (var y in documentfilesVis) {
          var index = VDList.findIndex(
            (obj) => obj.DocumentName == documentfilesVis[x].name
          );

          if (index != -1) {
            formData.append("webfile1", documentfilesVis[x]);
          }
        }
        values.MobileNo = values.MobileNo;
        values.CompanyId = accessData && accessData?.CompanyId;
        values.PlantId = visitorEntryFormik.values.PlantId;
        let obj = {
          Visitor: values,
          VisitorDetail: VDList,
          IsMultiple: false,
        };
        let input: string = JSON.stringify(obj);
        formData.append("input", input);

        if (isCreate == false) {
          if (!VisitorHeaderVM.VisitorDocumentUrl) {
            toast.current?.show({
              severity: "warn",
              summary: "Warning Message",
              detail: "Please Add Document.",
            });
            return;
          }
          var updateres = dispatch(update(formData));
          updateres
            .then((res) => {
              if (res.payload.tranStatus.result == true) {
                toast.current?.show({
                  severity: "success",
                  summary: "Success Message",
                  detail: res.payload.tranStatus.lstErrorItem[0].Message,
                });
                // setTimeout(() => {
                //   route.push("/home/vVisitor");
                // }, 800);
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
              toast.current?.show({
                severity: "error",
                summary: "Error",
                detail: JSON.stringify(error),
              });
            });
        } else {
          var updateres = dispatch(createVM(formData));
          updateres
            .then((res) => {
              if (res.payload.tranStatus.result == true) {
                setIsVisMaster(false);
                handleVisitorSelected(
                  // res.payload?.VisitorHeader?.VisitorId,
                  res.payload?.VisitorHeader?.VisitorDetails[0]
                    ?.VisitorDetailId,
                  res.payload?.VisitorList
                );
                // visitorEntryFormik.handleSubmit();
                // resetAllForm();
              } else {
                setIsdisableSave(false);
                toast.current?.show({
                  severity: "warn",
                  summary: "Warning",
                  detail: res.payload.tranStatus.lstErrorItem[0].Message,
                });
              }
            })
            .catch((error) => {
              setIsdisableSave(false);
              toast.current?.show({
                severity: "error",
                summary: "Error",
                detail: error,
              });
            });
        }
      }
    },
  });
  const visitorDFormik: any = useFormik({
    initialValues: visitorDetailForm,
    validationSchema: VisitorDetailValidationSchema,
    onSubmit: (values: any, { resetForm }) => {
      if (!document) {
        toast.current?.show({
          severity: "warn",
          summary: "Warning Message",
          detail: "Please Add Document.",
        });
        return;
      }
      let obj: any = {};
      obj.VisitorDetailId = values.VisitorDetailId;
      obj.VisitorId = values.VisitorId;
      obj.TitleId = values.TitleId;
      obj.FirstName = values.FirstName.trim();
      obj.LastName = values.LastName.trim();
      obj.DepartmentId = values.DepartmentId;
      obj.Dob = values.Dob;
      obj.MailId = values.MailId;
      obj.MobileNo = values.MobileNo;
      obj.TagNo = values.TagNo;
      obj.VisitorCompany = values.VisitorCompany;
      obj.DigitalSignName = values.DigitalSignName || "";
      obj.DigitalSignUrl = values.DigitalSignUrl || "";
      obj.SignedVersion = values.SignedVersion;
      obj.IsTermsAgreed = values.IsTermsAgreed;
      obj.IdCardType = values.IdCardType;
      obj.IdCardNo = values.IdCardNo;
      obj.DocumentName = values.DocumentName || "";
      obj.DocumentUrl = values.DocumentUrl || "";
      obj.Status = values.Status;
      obj.ExpirryDate = values.ExpirryDate;
      obj.WorkSeverity = values.WorkSeverity;
      obj.VisitorName =
        TitleListVM.find((f) => f.MetaSubId == values.TitleId)
          .MetaSubDescription +
        ". " +
        obj.FirstName +
        " " +
        obj.LastName;
      obj.DepartMentName = DepartmentList.find(
        (f) => f.DepartmentId == values.DepartmentId
      ).DepartmentName;
      obj.IdCardTypeName = IdCardListVM.find(
        (d) => d.MetaSubId == values.IdCardType
      ).MetaSubDescription;
      obj.StatusName = StatusList.find(
        (d) => d.MetaSubId == values.Status
      ).MetaSubDescription;
      obj.WorkSeverityName = WorkSeverityListVM.find(
        (d) => d.MetaSubId == values.WorkSeverity
      ).MetaSubDescription;
      const formattedDate = values.Dob.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      obj.ShowDate = formattedDate;
      const formattedExDate = values.ExpirryDate.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      obj.ShowExpirryDate = formattedExDate;
      if (rowIndex == -1) {
        let isexistName =
          visitorDetailList.filter((f) => f.VisitorName == obj.VisitorName) ||
          [];
        if (isexistName.length > 0 && obj.VisitorDetailId == 0) {
          toast.current?.show({
            severity: "warn",
            summary: "Warning Message",
            detail: "Worker Already Exists",
          });
          return;
        }
        let isexistMoNo =
          visitorDetailList.filter((f) => f.MobileNo == obj.MobileNo) || [];
        if (isexistMoNo.length > 0 && obj.VisitorDetailId == 0) {
          toast.current?.show({
            severity: "warn",
            summary: "Warning Message",
            detail: "Mobile No Already Exists",
          });
          return;
        }
        if (obj.MailId != "") {
          let isexisMail =
            visitorDetailList.filter((f) => f.MailId == obj.MailId) || [];
          if (isexisMail.length > 0 && obj.VisitorDetailId == 0) {
            toast.current?.show({
              severity: "warn",
              summary: "Warning Message",
              detail: "Mail ID Already Exists",
            });
            return;
          }
        }
        setVisitorDetailList([...visitorDetailList, obj]);
      } else {
        let List: any[] = visitorDetailList;
        List[rowIndex] = obj;
        setVisitorDetailList(List);
        setRowIndex(-1);
      }
      if (document) {
        if (documentfiles.length > 0) {
          setDocumentfiles([...documentfiles, document]);
        } else {
          setDocumentfiles([document]);
        }
      }
      OnClear();
    },
  });
  const resetAllFormVM = () => {
    visitorFormik.resetForm();
    visitorDFormik.resetForm();
    setDocumentfiles(([] = []));
    setDocument(null);
    setPhoto(null);
    setDisableForm(true);
    setVisitorDetailList(([] = []));
    setImageUrl(IMAGES.NO_IMG);
    setDocumentUrl("");
    setTempStateList([]);
    setTempCityList([]);
    Onchangecountry("CountryId", {}, CountryListVM[0].CountryId);
  };
  const onRowSelect = (rowData) => {
    setDocument(null);

    visitorDFormik.setFieldValue("", rowData);
    visitorDFormik.setFieldValue(
      "VisitorDetailId",
      rowData.data.VisitorDetailId
    );
    visitorDFormik.setFieldValue("VisitorId", rowData.data.VisitorId);
    visitorDFormik.setFieldValue("TitleId", rowData.data.TitleId);
    visitorDFormik.setFieldValue("FirstName", rowData.data.FirstName);
    visitorDFormik.setFieldValue("LastName", rowData.data.LastName);
    visitorDFormik.setFieldValue("DepartmentId", rowData.data.DepartmentId);
    visitorDFormik.setFieldValue("Dob", rowData.data.Dob);
    visitorDFormik.setFieldValue("MailId", rowData.data.MailId);
    visitorDFormik.setFieldValue("MobileNo", rowData.data.MobileNo);
    visitorDFormik.setFieldValue("TagNo", rowData.data.TagNo);
    visitorDFormik.setFieldValue("VisitorCompany", rowData.data.VisitorCompany);
    visitorDFormik.setFieldValue("IdCardType", rowData.data.IdCardType);
    visitorDFormik.setFieldValue("IdCardNo", rowData.data.IdCardNo);
    visitorDFormik.setFieldValue("DocumentName", rowData.data.DocumentName);
    visitorDFormik.setFieldValue("DocumentUrl", rowData.data.DocumentUrl);
    visitorDFormik.setFieldValue("Status", rowData.data.Status);
    visitorDFormik.setFieldValue(
      "ExpirryDate",
      new Date(rowData.data.ExpirryDate)
    );
    visitorDFormik.setFieldValue("WorkSeverity", rowData.data.WorkSeverity);
    let abc = documentfiles[rowData.index];

    setDocumentUrl(rowData.data.DocumentUrl);
    setDocument(abc);
    setRowIndex(rowData.index);
  };
  const handleSelectVM = (name, other, value) => {
    visitorFormik.setFieldValue(name, value);
  };
  const handleChangeVM = (event) => {
    visitorFormik.setFieldValue(event.target.name, event.value);
  };
  const handleDChangeVM = (event) => {
    visitorDFormik.setFieldValue(event.target.name, event.value);
  };
  const handleDSelectVM = (name, other, value) => {
    visitorDFormik.setFieldValue(name, value);
  };
  const handleOnChangeVM = (name, formName, value) => {
    visitorFormik.setFieldValue(
      name ?? visitorFormik[formName][name],
      visitorFormik,
      value
    );
  };
  const OnClear = () => {
    visitorDFormik.resetForm();
    setDocument(null);
    setDocumentUrl("");
  };
  const onChangeVisitorTypeVM = (name, other, value) => {
    visitorFormik.setFieldValue(name, value);
    // if (value == 35) {
    //   setDisableForm(true);
    //   OnClear();
    //   setVisitorDetailList([]);
    //   setDocumentfiles([]);
    // } else {
    //   setDisableForm(false);
    // }
  };
  const handleCloseImage = () => {
    setImageUrlVM(IMAGES.NO_IMG);
    setPhotoVM(null);
    visitorFormik.setFieldValue("DocumentName", "");
    visitorFormik.setFieldValue("DocumentUrl", "");
    visitorEntryFormik.setFieldValue("VisitorImageName", "");
    visitorEntryFormik.setFieldValue("VisitorImageUrl", "");
    profUploadRef.current?.clear();
  };
  const Onchangecountry = (name, other, value) => {
    setTempStateList([]);
    setTempCityList([]);
    visitorFormik.setFieldValue(name, value);
    visitorFormik.setFieldValue("StateId", null);
    let Obj = {
      CountryId: value,
    };
    var result = dispatch(OnChangeCountryVM(Obj));
    result
      .then((res) => {
        if (res.payload.tranStatus.result) {
          setTempStateList(res.payload.StateList);
          if (
            res.payload.StateList &&
            res.payload.StateList.length &&
            res.payload.StateList.length > 0
          ) {
            Onchangestate("StateId", {}, res.payload.StateList[0].StateId);
          }
        } else {
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: res.payload.tranStatus.lstErrorItem.message,
          });
        }
      })
      .catch((error) => {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: JSON.stringify(error),
        });
      });
  };
  const Onchangestate = (name, other, value) => {
    setTempCityList([]);
    visitorFormik.setFieldValue(name, value);
    visitorFormik.setFieldValue("CityId", null);
    let Obj = {
      StateId: value,
    };
    var result = dispatch(OnChangeStateVM(Obj));
    result
      .then((res) => {
        if (res.payload.tranStatus.result) {
          setTempCityList(res.payload.CityList);
          if (
            res.payload.CityList &&
            res.payload.CityList.length &&
            res.payload.CityList.length > 0
          ) {
            handleSelect("CityId", {}, res.payload.CityList[0].CityId);
          }
        } else {
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: res.payload.tranStatus.lstErrorItem.message,
          });
        }
      })
      .catch((error) => {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: JSON.stringify(error),
        });
      });
  };
  const onUploadVM = (e) => {
    if (
      e.type != "image/jpeg" &&
      e.type != "image/png" &&
      e.type != "image/jpg"
    ) {
      toast.current?.show({
        severity: "warn",
        summary: "Error Message",
        detail: "Please Upload only Files with Format (Image/ JPEG, JPG, PNG)",
      });
      return;
    }
    setPhoto(e);
    visitorFormik.setFieldValue("DocumentName", e.name);
    visitorFormik.setFieldValue("DocumentUrl", e.name);
    visitorEntryFormik.setFieldValue("VisitorImageName", e.name);
    visitorEntryFormik.setFieldValue("VisitorImageUrl", e.name);
    const uploadedImageUrl = URL.createObjectURL(e);
    setImageUrlVM(uploadedImageUrl);
  };
  const isValidFileType = (file, allowedTypes) => {
    const fileExtension = file.name
      .slice(((file.name.lastIndexOf(".") - 1) >>> 0) + 2)
      .toLowerCase();
    const fileType = file.type.toLowerCase();

    return (
      allowedTypes.includes(fileExtension) || allowedTypes.includes(fileType)
    );
  };
  const onUploadDocumentVisitor = (e) => {
    if (documentVisitorUploadRef.current) {
      deleteDocumentsVisitor();
    }
    const allowedTypes = [
      "jpeg",
      "jpg",
      "png",
      "pdf",
      "doc",
      "docx",
      "xls",
      "xlsx",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];
    if (e.files) {
      if (!isValidFileType(e.files[0], allowedTypes)) {
        toast.current?.show({
          severity: "warn",
          summary: "Error Message",
          detail:
            "Please Upload only Files with Format (Image/ JPEG, JPG, PNG & DOC/ WORD, EXCEL, PDF)",
        });
        documentVisitorUploadRef.current?.clear();
        return;
      }
    }
    if (e.files.length > 0) {
      setVisitorDocument(e.files[0]);
      visitorFormik.setFieldValue("VisitorDocumentName", e.files[0].name);
      const uploadedImageUrl = URL.createObjectURL(e.files[0]);

      visitorFormik.setFieldValue("VisitorDocumentUrl", e.files[0].name);
      setDocumentUrlVisitor(uploadedImageUrl);
    } else {
      toast.current?.show({
        severity: "warn",
        summary: "Error Message",
        detail:
          "Please Upload only Files with Format (Image/ JPEG, JPG, PNG & DOC/ WORD, EXCEL, PDF)",
      });
      return;
    }
  };
  const onUploadDocumentVM = (e) => {
    if (documentUploadRef.current) {
      deleteDocuments();
    }
    const allowedTypes = [
      "jpeg",
      "jpg",
      "png",
      "pdf",
      "doc",
      "docx",
      "xls",
      "xlsx",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];
    if (e.files) {
      if (!isValidFileType(e.files[0], allowedTypes)) {
        toast.current?.show({
          severity: "warn",
          summary: "Error Message",
          detail:
            "Please Upload only Files with Format (Image/ JPEG, JPG, PNG & DOC/ WORD, EXCEL, PDF)",
        });
        documentUploadRef.current?.clear();
        return;
      }
    }
    if (e.files.length > 0) {
      setDocument(e.files[0]);
      visitorDFormik.setFieldValue("DocumentName", e.files[0].name);
      const uploadedImageUrl = URL.createObjectURL(e.files[0]);

      visitorDFormik.setFieldValue("DocumentUrl", e.files[0].name);
      setDocumentUrl(uploadedImageUrl);
    } else {
      toast.current?.show({
        severity: "warn",
        summary: "Error Message",
        detail:
          "Please Upload only Files with Format (Image/ JPEG, JPG, PNG & DOC/ WORD, EXCEL, PDF)",
      });
      return;
    }
  };
  const deleteDocumentsVM = () => {
    documentUploadRef.current?.clear();
    setDocumentUrl("");
    setDocument(null);
    visitorDFormik.setFieldValue("DocumentName", "");
    visitorDFormik.setFieldValue("DocumentUrl", "");
  };
  const deleteDocumentsVisitor = () => {
    documentVisitorUploadRef.current?.clear();
    setDocumentUrlVisitor("");
    setVisitorDocument(null);
    visitorFormik.setFieldValue("VisitorDocumentName", "");
    visitorFormik.setFieldValue("VisitorDocumentUrl", "");
  };
  const handleHyperlinkVM = () => {
    if (documentUrl != "") {
      window.open(documentUrl, "_blank");
    }
  };
  const VisitorhandleHyperlink = () => {
    if (documentUrlVisitor != "") {
      window.open(documentUrlVisitor, "_blank");
    }
  };
  const itemTemplateVM = () => {
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

  // useEffect(() => {
  //   if (
  //     visitorFormik.values.CountryCode != "" &&
  //     visitorFormik.values.CountryCode != null &&
  //     visitorFormik.values.CountryCode.length == 10
  //   ) {
  //     loadMobileNo();
  //   } else {
  //     loadVisData({
  //       PersonName: "",
  //       MailId: "",
  //       VisitorCompany: "",
  //       IdCardType: null,
  //       IdCardNo: "",
  //       TagNo: "",
  //     });
  //   }
  // }, [visitorFormik.values.CountryCode]);

  const handleMobKeyPress = (event) => {
    visitorFormik.setFieldValue("MobileNo", event?.target?.value);
    setCurrMobNo(event?.target?.value);
    console.log(event);
  };

  useEffect(() => {
    if (currMobNo != "" && currMobNo != null && currMobNo.length == 10) {
      loadMobileNo();
    }
  }, [currMobNo]);

  const handleMobBack = (event) => {
    if (event?.keyCode == 8 && visitorFormik.values?.MobileNo.length <= 10) {
      loadVisData({
        PersonName: "",
        VisitorCompany: "",
        MailId: "",
        IdCardType: null,
        IdCardNo: "",
        TagNo: "",
        IsTermsAgreed: false,
        DigitalSignName: "",
        DigitalSignUrl: "",
      });
      setIsdisableSave(true);
      setSignedUrl(null);
    }
    else {
      setIsdisableSave(false);
    }
  };

  const pageTypeChanged = (e) => {
    setSelectedData({
      ...selectedData,
      selectedType: e.value ? 36 : 35,
    });
    if (accessData) {
      onChangeVisitorType("VisitorTypeId", {}, e.value ? 36 : 35);
    }
    onChangeVisitorTypeVM("VisitorTypeId", {}, e.value ? 36 : 35);
    setPageType(e.value);
  };

  useEffect(() => {
    if (accessData) {
      onChangeVisitorType("VisitorTypeId", {}, false ? 36 : 35);
    }
  }, [accessData]);

  useEffect(() => {
    handleSelectVM("CountryCode", {}, "+91");
  }, []);
  const [isChecked, setIsChecked] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const handleTxtTermsCheck = () => {
    setShowPopup(true);
    if (!visitorDFormik.values["IsTermsAgreed"]) {
      handleTermsCheck({
        target: {
          name: "IsTermsAgreed",
          checked: true,
        },
      });
    }
  };

  useEffect(() => {
    setIsTermsNeeded(TermsConditions?.IsEnabled);
  }, [TermsConditions]);

  const handleTermsCheck = (event) => {
    event?.target?.checked ? setShowPopup(true) : setShowPopup(false);
    setIsChecked(event?.target?.checked ? true : false);
    event?.target?.checked
      ? visitorFormik.setFieldValue("SignedVersion", TermsConditions?.Version)
      : visitorFormik.setFieldValue("SignedVersion", 0);
    visitorFormik.setFieldValue(event?.target?.name, event?.target?.checked);
  };

  const checkSaveDisable = () => {
    if (isTermsNeeded) {
      return (
        IsdisableSave ||
        !isChecked ||
        !signedUrl ||
        signedUrl === null ||
        signedUrl === ""
      );
    } else {
      return IsdisableSave;
    }
  };
  // VIS MASTER
  return (
    <div style={{ overflow: "auto", height: "100vh" }}>
      <div
        className="appointment-page"
        style={{ backgroundImage: "url(" + AppointmentImg + ")" }}
      >
        <div className="center-container">
          {isWarningPop && !pageTypeTogg ? (
            <WarningPop
              data={"Trial has been Expired."}
              secData={"Please Contact the Administrator."}
            />
          ) : null}
          {isCompleted || isWarningPop || pageTypeTogg ? null : (
            <div className="white mb20 appointment-hdr">
              <div className="widget-body">
                <div className="flex gap-3 justify-content-center">
                  <div className="flex align-items-center">
                    <h2 className="ml-2 mr-2">One Day Pass</h2>
                    <InputSwitch
                      checked={pageType}
                      onChange={(e) => pageTypeChanged(e)}
                    />
                    <h2 className="ml-2">Extended Pass</h2>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* {isWarningPop ? (
            <WarningPop
              data={"Trial has been Expired."}
              secData={"Please Contact the Administrator."}
            />
          ) : ( */}
          {isWarningPop || pageTypeTogg ? null : (
            <div
              className={`${
                screenChanged ? "" : ""
              } appointment-container scroll-y`}
            >
              <div
                className={`${
                  screenChanged ? "h-full" : isCompleted ? "" : "white"
                }`}
              >
                {!isCompleted && !isWarningPop ? (
                  <div className="progress-bar">
                    <ul>
                      <li className={`host-info completed`}>
                        Host Information
                      </li>
                      <li
                        className={`visitor-info ${
                          !isVisMaster ? "" : "completed"
                        }`}
                      >
                        {`${pageType ? "Visitor" : "Visitor"} Information`}
                      </li>
                    </ul>
                  </div>
                ) : null}
                {isCompleted && !isWarningPop ? (
                  <MessageAlert successData={successData} />
                ) : isVisMaster && !isWarningPop ? (
                  <BookExternalVisitor
                    isVisMaster={isVisMaster}
                    setIsVisMaster={setIsVisMaster}
                    visitorEntryFormik={visitorEntryFormik}
                    VisitorNameList={VisitorNameList}
                    handleVisitorSelected={handleVisitorSelected}
                    isViewVM={isViewVM}
                    isCreateVM={isCreateVM}
                    VisitorTypeListVM={VisitorTypeListVM}
                    handleSelectVM={handleSelectVM}
                    TitleListVM={TitleListVM}
                    CountryListVM={CountryListVM}
                    OnchangecountryVM={Onchangecountry}
                    StateListVM={StateListVM}
                    OnchangestateVM={Onchangestate}
                    CityListVM={CityListVM}
                    IdCardListVM={IdCardListVM}
                    StatusListVM={StatusListVM}
                    onUploadVM={onUploadVM}
                    itemTemplateVM={itemTemplateVM}
                    imageUrlVM={imageUrlVM}
                    handleOnChangeVM={handleOnChangeVM}
                    visitorFormVM={visitorForm}
                    visitorRefVM={visitorRef}
                    formikVM={visitorFormik}
                    onChangeVisitorTypeVM={onChangeVisitorTypeVM}
                    tempStateListVM={tempStateList}
                    tempCityListVM={tempCityList}
                    handleCloseImageVM={handleCloseImage}
                    handleChangeVM={handleChangeVM}
                    profUploadRef={profUploadRef}
                    VisitorhandleHyperlinkVM={VisitorhandleHyperlink}
                    onUploadDocumentVisitorVM={onUploadDocumentVisitor}
                    deleteDocumentsVisitorVM={deleteDocumentsVisitor}
                    documentUrlVisitorVM={documentUrlVisitor}
                    documentVisitorUploadRefVM={documentVisitorUploadRef}
                    toast={toast}
                    setVisitorEntryBelongingDetailList={
                      setVisitorEntryBelongingDetailList
                    }
                    VisitorEntryBelongingDetailList={
                      VisitorEntryBelongingDetailList
                    }
                    pageType={pageType}
                    cameraOff={cameraOff}
                    setCameraOff={setCameraOff}
                    phonenumber={phonenumber}
                    TitleList={TitleList}
                    handleMobKeyPress={handleMobKeyPress}
                    handleMobBack={handleMobBack}
                  />
                ) : (
                  <BookExternalVisitorEntry
                    isCreate={isCreate}
                    PlantList={DtoPlantList}
                    isView={isView}
                    loading={loading}
                    visitorEntryFormik={visitorEntryFormik}
                    selectedData={selectedData}
                    setShowEntryDetail={setShowEntryDetail}
                    setVisible={setVisible}
                    setVisitorNameList={setVisitorNameList}
                    VisitorNameList={VisitorNameList}
                    visitorEntryDetailList={visitorEntryDetailList}
                    setvisitorEntryDetailList={setvisitorEntryDetailList}
                    setVisitorEntryBelongingDetailList={
                      setVisitorEntryBelongingDetailList
                    }
                    setList={setList}
                    visitorEntryForm
                    VisitorEntryValidationSchema
                    onUpload={onUpload}
                    itemTemplate={itemTemplate}
                    imageUrl={imageUrl}
                    IsPreBookingList={IsPreBookingList}
                    VisitorTypeList={VisitorTypeList}
                    onChangeVisitorType={onChangeVisitorType}
                    handleSelect={handleSelect}
                    autoCompleteRef={autoCompleteRef}
                    OnSelectVisitorCode={OnSelectVisitorCode}
                    onChangeMatType={onChangeMatType}
                    filteritemType={filteritemType}
                    handleIsPreBook={handleIsPreBook}
                    VECodeDisable={VECodeDisable}
                    EmployeeList={EmployeeList}
                    onChangeVisitor={onChangeVisitor}
                    ProofList={ProofList}
                    ValidFromDisable={ValidFromDisable}
                    ValidToDisable={ValidToDisable}
                    onChageFromDate={onChageFromDate}
                    TominDate={TominDate}
                    CheckboxDisable={CheckboxDisable}
                    onClickIsExistingVehicle={onClickIsExistingVehicle}
                    HideVehicleDD={HideVehicleDD}
                    HideDriverDD={HideDriverDD}
                    onUploadDocument={onUploadDocument}
                    documentUrl={documentUrl}
                    onClickIsExistingDriver={onClickIsExistingDriver}
                    OnChangePartyTypes={OnChangePartyTypes}
                    PartyTypeList={PartyTypeList}
                    PartyNameList={PartyNameList}
                    AreaList={AreaList}
                    RouteList={RouteList}
                    onClickIsAppointmentBooking={onClickIsAppointmentBooking}
                    DriverList={DriverList}
                    VehicleList={VehicleList}
                    IsDeliveryChallan={IsDeliveryChallan}
                    IsInvoiceBased={IsInvoiceBased}
                    IsVehicleTripBased={IsVehicleTripBased}
                    IsPartyDisable={IsPartyDisable}
                    IsVehicleDetailsDisable={IsVehicleDetailsDisable}
                    ShowVisitorContranctor={ShowVisitorContranctor}
                    IsMaterialDetailsShow={IsMaterialDetailsShow}
                    InvoiceNumberDisable={InvoiceNumberDisable}
                    DcNumberDisable={DcNumberDisable}
                    PoNumberDisable={PoNumberDisable}
                    ContainerNumberDisable={ContainerNumberDisable}
                    StatusList={StatusList}
                    OnChangeVehicle={OnChangeVehicle}
                    onChageToDate={onChageToDate}
                    deleteDocuments={deleteDocuments}
                    handleHyperlink={handleHyperlink}
                    cameraOff={cameraOff}
                    setCameraOff={setCameraOff}
                    handleChange={handleChange}
                    handleRouteSelect={handleRouteSelect}
                    initFldDisable={initFldDisable}
                    CreatePageOnLoadCVisitorEntry={
                      CreatePageOnLoadCVisitorEntry
                    }
                    resetAllForm={resetAllForm}
                    IsWorkerDetailsShow={IsWorkerDetailsShow}
                    IsBelongingDetailsShow={IsBelongingDetailsShow}
                    VisitorEntryBelongingDetailList={
                      VisitorEntryBelongingDetailList
                    }
                    VisitorEntryMaterialDetailList={
                      VisitorEntryMaterialDetailList
                    }
                    setVisitorEntryMaterialDetailList={
                      setVisitorEntryMaterialDetailList
                    }
                    MaterialList={MaterialList}
                    PurposeList={PurposeList}
                    IsdisableSave={IsdisableSave}
                    toast={toast}
                    handlePoVSelect={handlePoVSelect}
                    selectedPlant={selectedPlant}
                    handleVisitorSelected={handleVisitorSelected}
                    pageType={pageType}
                    handlePlantSelect={handlePlantSelect}
                    handleDepartmentSelect={handleDepartmentSelect}
                    PlantWiseDepartmentList={PlantWiseDepartmentList}
                    plantDisable={plantDisable}
                    route={route}
                    setLoadingPage={setLoadingPage}
                    query={query}
                    accessData={accessData}
                    handleMobKeyPress={handleMobKeyPress}
                    handleMobBack={handleMobBack}
                    setIsWarningPop={setIsWarningPop}
                    pageTypeChanged={pageTypeChanged}
                    setPageTypeTogg={setPageTypeTogg}
                  />
                )}
                {!isCompleted && !isWarningPop ? (
                  <div className="widget-ftr text-center">
                    <div className="text-center">
                      <div className="action-btn">
                        <Button
                          label=""
                          title="Prev"
                          icon="las la-arrow-left"
                          className="text-center"
                          onClick={saveVisitorDetails}
                          disabled={!isVisMaster}
                        />
                        <Button
                          label=""
                          title="Next"
                          icon="las la-arrow-right"
                          className="text-center"
                          onClick={saveVisitorDetails}
                          disabled={isVisMaster}
                        />
                      </div>
                    </div>
                  </div>
                ) : null}
                {isVisMaster && !isCompleted ? (
                  <div className="widget-ftr text-center">
                    {/* <FormFields
                      type={"checkbox"}
                      name={"IsTermsAgreed"}
                      label={"I agree with the terms and conditions"}
                      show={true}
                      required={true}
                      disable={false}
                      fldStyle={
                        "col-12 md:col-4 flex align-items-center w-fit m-auto"
                      }
                      handleChange={handleTermsCheck}
                      formik={visitorDFormik}
                    /> */}
                    {isTermsNeeded ? (
                      <div className="flex align-items-center w-fit m-auto cursor-pointer">
                        <Checkbox
                          inputId={"IsTermsAgreed"}
                          name={"IsTermsAgreed"}
                          checked={visitorFormik.values["IsTermsAgreed"]}
                          onChange={handleTermsCheck}
                          disabled={false}
                        />
                        <span
                          // htmlFor={"IsTermsAgreed"}
                          onClick={handleTxtTermsCheck}
                          className="ml-2 text-blue-700 cursor-pointer select-none"
                        >
                          I agree with the terms and conditions
                        </span>
                      </div>
                    ) : null}
                  </div>
                ) : null}
                {isVisMaster && !isCompleted ? (
                  <div className="widget-ftr text-center">
                    <div className="flex flex-row justify-content-center widget-ftr text-center">
                      <div className="text-center">
                        <Button
                          label="Save"
                          title="Save"
                          icon="pi pi-save"
                          type="submit"
                          disabled={checkSaveDisable()}
                          onClick={saveVisitor}
                        />
                        <Button
                          label="Cancel"
                          severity="danger"
                          className="preview-close"
                          title="Cancel"
                          icon="pi pi-times-circle"
                          disabled={IsdisableSave}
                          // disabled={isView || isCreate == false ? true : false}
                          onClick={() => resetAllForm()}
                        />
                        {/* <Button
                    label="Clear"
                    severity="danger"
                    className="preview-close"
                    title="Clear"
                    icon="pi pi-times-circle"
                    disabled={isView || isCreate == false ? true : false}
                    onClick={() => resetAllForm()}
                  /> */}
                        {/*<Button
              label="Save"
              title="Save"
              icon="pi pi-save"
              type="submit"
              disabled={isView || IsdisableSave}
            onClick={visitorEntryFormik.handleSubmit}
            /> */}
                      </div>
                      {/* <Button
                  label="Next"
                  title="Next"
                  icon="pi pi-arrow-right"
                  type="submit"
                  //   disabled={isView || IsdisableSave}
                  onClick={visitorEntryFormik.handleSubmit}
                /> */}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          )}
          {/* )} */}
        </div>
      </div>
      {showPopup ? (
        <TermsConditionPop
          TermsConditions={TermsConditions}
          toast={toast}
          setIsChecked={setIsChecked}
          sign={sign}
          showPopup={showPopup}
          setShowPopup={setShowPopup}
          setSign={setSign}
          signedUrl={signedUrl}
          setDigSignFile={setDigSignFile}
          setSignedUrl={setSignedUrl}
          setIsdisableSave={setIsdisableSave}
          formik={visitorFormik}
          screenSized={screenSized}
          isView={false}
        />
      ) : null}
      <AppAlert toast={toast} />
      {loadingPage ? <AppProgressSpinner /> : null}
    </div>
  );
};

export default BookExternal;
