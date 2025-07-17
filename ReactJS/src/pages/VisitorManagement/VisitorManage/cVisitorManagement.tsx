import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  BackImg,
  VisitorImg,
  ContractorImg,
  InvoiceImg,
  VehicleTripImg,
  DeliveryChallanImg,
} from "../../../assets/css/img-library";
import {
  Button,
  Calendar,
  Dialog,
  FilterMatchMode,
  InputNumber,
  InputSwitch,
  InputText,
  Sidebar,
} from "@/assets/css/prime-library";
import { ContDetail, SearchContainer } from "@/components/VisitorComp";
import { useDispatch, useSelector } from "react-redux";
import { pageLoadScript } from "@/assets/js/common-utilities";
import CVisitorEntryCreator from "../VisitorEntry/cVisitorEntryCreator";
import { PrintPassComponent } from "@/components/PrintPass";
import { useFormik } from "formik";
import { VisitorEntryValidationSchema } from "@/validations/VisitorManagement";
import { IMAGES } from "@/assets/images/Images";
import { useHistory } from "react-router-dom";
import {
  createVM,
  createInitVM,
  OnChangeCountryVM,
  OnChangeStateVM,
  updateVM,
} from "@/redux/slices/master/visitorSlice";
import {
  OnChangePartyType,
  OnChangeVisitor,
  OnChangeVisitorType,
  create,
  createInit,
  update,
  fetch,
  VehicleData,
  OnChangeVisHost,
  OnChangeEntryDetail,
  ShowPass,
  OnChangeWorkPermit,
} from "@/redux/slices/visitorManagement/visitorentrySlice";
import AppAlert from "@/alert/alert";
import { AppProgressSpinner, confirmation } from "@/components/UtilityComp";
import CVisitorCreator from "@/pages/master/Visitor/cVisitorCreator";
import CVehicleCreator from "@/pages/master/Vehicle/cVehicleCreator";
import CEmployeeCreator from "@/pages/master/Employee/cEmployeeCreator";
import { CheckIn } from "@/redux/slices/visitorManagement/checkInCheckOutSlice";
import { tLDS } from "@/utils/utilFunc";
import { sendPass } from "@/redux/slices/master/ApprovalSlice";
import {
  VisitorDetailValidationSchema,
  VisitorValidationSchema,
} from "@/validations/Master";
import { createOrEdit } from "@/redux/slices/master/visitorentrySlice";
import {
  CWorkPermitCreator,
  WorkPermitForm,
  WorkPermitPrint,
} from "@/pages/VisitorManagement/WorkPermit/cWorkPermitCreator";
import { ColumnEditorOptions, ColumnEvent } from "primereact/column";
import { InputNumberValueChangeEvent } from "primereact/inputnumber";
import {
  FilterDrive,
  FilterVehicleNo,
  OnChangeExistVehicleNo,
  OnChangeVehicleNo,
  OnEnterMobileNo,
} from "@/redux/slices/visitorManagement/externalBookEntrySlice";
import { QRPop } from "@/pages/master/Vehicle/vVehicle";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import { DecryptData, EncryptData } from "@/redux/slices/master/workFlowSlice";

export const CVisitorInfo = (props) => {
  const { tabConfig, itemTemplate, sHost, sVisit, passData, toast } = props;

  return (
    <div className="col-12">
      <div className="white">
        <div className="widget-hdr">
          <div className="sub-title">
            <div className="grid">
              <div className="col-12">
                <h2>Visitor Information</h2>
              </div>
            </div>
          </div>
        </div>
        {/* <div className="widget-body">
          <div className="visitor-name">
            {sVisit?.PersonName}
            {sVisit?.FirstName + " " + sVisit?.LastName}
            <span className="emp-id"> - {sVisit?.VisitorEntryCode}</span>
            <span className="emp-id"> - {sVisit?.VisitorCode}</span>
          </div>
          <div className="visitor-company">
            <strong>{sVisit?.VisitorCompany || "-"}</strong>
          </div>
          <div className="visitor-company">{sVisit?.MailId}</div>
          <div className="visitor-company">{sVisit?.MobileNo}</div>
        </div> */}
        <div className="widget-body">
          <div className="visitor-name">
            {/* {sVisit?.PersonName} */}
            {passData?.PersonName || "-"}
            {/* <span className="emp-id"> - {sVisit?.VisitorEntryCode}</span> */}
            <span className="emp-id"> - {passData?.VisitorEntryCode}</span>
          </div>
          <div className="visitor-company">
            <strong>{passData?.VisitorCompany || "-"}</strong>
          </div>
          <div className="visitor-company">{passData?.MailId}</div>
          <div className="visitor-company">{passData?.MobileNo}</div>
        </div>
      </div>
      <div className="white">
        <div className="widget-hdr">
          <div className="sub-title">
            <div className="grid">
              <div className="col-12">
                <h2>Host Information</h2>
              </div>
            </div>
          </div>
        </div>
        <div className="widget-body">
          <div className="visitor-name">
            {sHost?.UserName} -<span className="emp-id">{sHost?.UserCode}</span>
          </div>
          <div className="visitor-company">
            <strong>{sHost?.CompanyName}</strong>
          </div>
          <div className="visitor-company">{sHost?.UserEmail}</div>
          <div className="visitor-company">{sHost?.MobileNo}</div>
        </div>
      </div>
    </div>
  );
};

export const CVistorDetail = (props) => {
  const { tabConfig, itemTemplate, sHost, sVisit, passData, toast } = props;

  const printRef = useRef(null);

  const handlePrint = () => {
    window.open();
  };

  return (
    <div className="inner-page-container p-2 grid flex-column dp_pass">
      <div className="col-12">
        <PrintPassComponent printPassData={passData} toast={toast} />
        {/* <PrintPass printRef={printRef} printPassData={passData} /> */}
      </div>
    </div>
  );
};

const CVisitorManagement = () => {
  const route = useHistory();

  const [pageType, setPageType] = useState<any>("s1");
  const phonenumber = [{ Id: 1, CountryCode: "+91", CountryName: "India" }];
  const [vehPopVisible, setVehPopVisible] = useState<any>(false);
  const [encryptedValue, setEncryptedValue] = useState<any>();
  const componentRef = React.useRef(null);

  const [selectedVehData, setSelectedVehData] = useState<any>({});
  const [selectedEntryData, setSelectedEntryData] = useState<any>({});
  const [checked, setChecked] = useState(false);
  const [checkedVehicle, setCheckedVehicle] = useState(false);
  const [updateCheckVeh, setUpdateCheckVeh] = useState(false);
  const [vehicleDetails, setVehicleDetails] = useState([]);
  const [visible, setVisible] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<any>({});
  const [visitorShow, setVisitorShow] = useState<boolean>(false);
  const [WorkPermitShow, setWorkPermitShow] = useState<boolean>(false);
  const [vehicleShow, setVehicleShow] = useState<boolean>(false);
  const [employeeShow, setEmployeeShow] = useState<boolean>(false);
  const [dialogVisible, setDialogVisible] = useState<boolean>(false);
  const [refTableDisable, setRefTableDisable] = useState<boolean>(false);
  const [IsDisableClear, setIsDisableClear] = useState<boolean>(false);
  const [switchDisable, setSwitchDisable] = useState<boolean>(false);
  const [currMobNo, setCurrMobNo] = useState<string>();

  const [VisitorNameList, setVisitorNameList] = useState([]);
  const [updatedVisitorNameList, setupdatedVisitorNameList] = useState([]);
  const [updatedBelongingList, setupdatedBelongingList] = useState([]);
  const [visitorEntryDetailList, setvisitorEntryDetailList] = useState([]);
  const [visitorEntryDetailListNew, setvisitorEntryDetailListNew] = useState(
    []
  );
  const [VisitorEntryRefDetailList, setVisitorEntryRefDetailList] = useState([
    {
      VisitorEntryRefDetailId: 0,
      VisitorEntryId: 0,
      RefTypeId: null,
      RefValue: "",
      adisable: false,
      cdisable: true,
      ddisable: false,
      idisable: false,
      show: true,
    },
  ]);
  const [bookedVisitor, setBookedVisitor] = useState({});
  const [TempEmployeeList, setTempEmployeeList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchId, setSearchId] = useState("");
  const [vhSelected, setVHselected] = useState(false);

  const [selectedWP, setSelectedWP] = useState<any>();
  const [selectedWPWorkerDetails, setSelectedWPWorkerDetails] = useState<any>();
  const [selectedWPEntryDetails, setSelectedWPEntryDetails] = useState<any>();
  const [selectedWPHeader, setSelectedWPHeader] = useState<any>();

  const [selectedVisitor, setSelectedVisitor] = useState<any>();
  const [selectedHost, setSelectedHost] = useState<any>({});
  const [selectedVeh, setSelectedVeh] = useState<any>();
  const [selectedInv, setSelectedInv] = useState<any>(false);
  const [isCurrentCreate, setIsCurrentCreate] = useState<any>(true);

  const [showEntryDetail, setShowEntryDetail] = useState(false);
  const [passVisible, setpassVisible] = useState(false);

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
  const [DeliveryChallanList, setDeliveryChallanList] = useState([]);
  const [TitleList, setTitleList] = useState([]);
  const [IsPreBookingList, setIsPreBookingList] = useState([]);
  const [VisitorTypeList, setVisitorTypeList] = useState([]);
  const [ProofList, setProofList] = useState([]);
  const [TempVisitorNameList, setTempVisitorNameList] = useState([]);
  const [imageUrl, setImageUrl] = useState(IMAGES.NO_IMG);
  const [photo, setPhoto] = useState<File | null>(null);
  const [documentUp, setDocument] = useState<File | null>(null);
  const autoCompleteRef = useRef<any>(null);
  const [filteritemType, setFilteritemType] = useState([]);
  const [PartyTypeList, setPartyTypeList] = useState([]);
  const [AreaList, setAreaList] = useState([]);
  const [RouteList, setRouteList] = useState([]);
  const [PartyNameList, setPartyNameList] = useState([]);
  const [DriverList, setDriverList] = useState([]);
  const [WorkPermitList, setWorkPermitList] = useState<any>([]);
  const [TempWorkPermitList, setTempWorkPermitList] = useState<any>([]);
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

  const [isVisMaster, setIsVisMaster] = useState(true);
  const [createVisEnt, setCreateVisEnt] = useState(true);

  const [visType, setVisType] = useState<any>(35);
  const [selectedVehType, setSelectedVehType] = useState<any>(1);
  // X X X Visitor Entry Create
  const [changeField, setChangeField] = useState<any>({});
  const PlantId = +localStorage["PlantId"];
  const CompanyId = +localStorage["CompanyId"];

  // VEHICLE TYPE
  const [tempRefTypeList, setTempRefTypeList] = useState([]);
  const [RefTypeList, setRefTypeList] = useState([]);
  const [VehicleTypeList, setVehicleTypeList] = useState([]);
  const [VehicleNoList, setVehicleNoList] = useState([]);
  const [checkVehAction, setCheckVehAction] = useState(true);
  const [vehicleHead, setVehicleHead] = useState<any>();

  const scanInputRef = useRef<any>("");
  const vehicleNoInputRef = useRef<any>("");
  const [vehMAxLen, setVehMAxLen] = useState<any>(30);
  const [isScanMode, setIsScanMode] = useState<any>(true);
  const [addBtnClass, setAddBtnClass] = useState<any>(true);
  const scanBufferRef = useRef("");
  const lastKeyTimeRef = useRef(Date.now());
  const debounceTimeoutRef = useRef(null);
  const SCAN_MIN_LENGTH = 12;
  const SCAN_IDLE_TIMEOUT = 100;

  // VEHICLE TYPE

  const [tabConfig, setTabConfig] = useState<any>([
    // {id: 0, visitorTypeImg: BackImg, visitorTypeTxt: "Back", type: "BACK" },
    {
      id: 1,
      visitorTypeImg: VisitorImg,
      visitorTypeTxt: "One Day Pass",
      active: true,
      disable: false,
      type: 35,
    },
    {
      id: 2,
      visitorTypeImg: ContractorImg,
      visitorTypeTxt: "Extended Pass",
      disable: false,
      type: 36,
    },

    {
      id: 4,
      visitorTypeImg: VehicleTripImg,
      visitorTypeTxt: "Vehicle Entry",
      disable: false,
      type: 66,
    },
    // {
    //   id: 3,
    //   visitorTypeImg: ContractorImg,
    //   visitorTypeTxt: "Work Permit",
    //   disable: false,
    //   type: 100,
    // },
    // {
    //   id: 3,
    //   visitorTypeImg: DeliveryChallanImg,
    //   visitorTypeTxt: "Delivery Challan",
    //   disable: false,
    //   type: 64,
    // },
    // // {id:3,visitorTypeImg:InterviewImg, visitorTypeTxt:"Interview"},
    // {
    //   id: 5,
    //   visitorTypeImg: InvoiceImg,
    //   visitorTypeTxt: "Invoice",
    //   disable: false,
    //   type: 65,
    // },
    // {
    //   id: 6,
    //   visitorTypeImg: NextImg,
    //   visitorTypeTxt: "Next",
    //   type: "NEXT",
    // },
  ]);
  // const [searchConfig, setSearchConfig] = useState({
  //   isVisitor: true,
  //   isContract: false,
  //   isVehTrip: false,
  //   isInvoice: false,
  // });

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
    DtoChallanTypeList,
    DtoRouteList,
    DtoPartyNameList,
    DtoDriverList,
    DtoVehicleList,
    DtoMaterialList,
    DtoPurposeList,
    DtoVisitorEntryPovDetail,
    tabConfigs,
    activeTabs,
  } = useSelector((state: any) => state.visitorentry);

  const dispatch: any = useDispatch();

  useEffect(() => {
    pageLoadScript();
  });

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
      : localStorage["CompanyId"],
    PlantId: DtoVisitorEntryHeader
      ? DtoVisitorEntryHeader.PlantId
      : localStorage["PlantId"],
    GateId: DtoVisitorEntryHeader
      ? DtoVisitorEntryHeader.GateId
      : localStorage["GateId"],

    VisitorTypeId: DtoVisitorEntryHeader
      ? DtoVisitorEntryHeader.VisitorTypeId
      : 35,
    VisitorId: DtoVisitorEntryHeader ? DtoVisitorEntryHeader.VisitorId : null,
    PersonName: DtoVisitorEntryHeader ? DtoVisitorEntryHeader.PersonName : "",
    MobileNo: DtoVisitorEntryHeader ? DtoVisitorEntryHeader.MobileNo : "",
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
    VehicleType: DtoVisitorEntryHeader ? DtoVisitorEntryHeader.VehicleType : "",
    VehicleName: DtoVisitorEntryHeader ? DtoVisitorEntryHeader.VehicleName : "",
    VehicleModel: DtoVisitorEntryHeader
      ? DtoVisitorEntryHeader.VehicleModel
      : "",
    VehicleNo: DtoVisitorEntryHeader ? DtoVisitorEntryHeader.VehicleNo : "",
    IsExistingDriver: DtoVisitorEntryHeader
      ? DtoVisitorEntryHeader.IsExistingDriver
      : null,
    EntryType: vehicleHead ? vehicleHead.EntryType : null,
    EntryTime: DtoVisitorEntryHeader
      ? new Date(DtoVisitorEntryHeader.EntryTime)
      : tLDS(new Date()),
    ExitTime:
      DtoVisitorEntryHeader?.ExitTime != null
        ? DtoVisitorEntryHeader?.ExitTime
        : null,
    IsEwayBillNo: DtoVisitorEntryHeader
      ? DtoVisitorEntryHeader.IsEwayBillNo
      : false,
    IsEinvBillNo: DtoVisitorEntryHeader
      ? DtoVisitorEntryHeader.IsEinvBillNo
      : false,
    DriverId: DtoVisitorEntryHeader ? DtoVisitorEntryHeader.DriverId : "",
    DriverName: DtoVisitorEntryHeader ? DtoVisitorEntryHeader.DriverName : "",
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
    StartingKm: DtoVisitorEntryHeader ? DtoVisitorEntryHeader.StartingKm : "",
    EndingKm: DtoVisitorEntryHeader ? DtoVisitorEntryHeader.EndingKm : "",
    PlannedTravellingKm: DtoVisitorEntryHeader
      ? DtoVisitorEntryHeader.PlannedTravellingKm
      : "",
    ActualTravellingKm: DtoVisitorEntryHeader
      ? DtoVisitorEntryHeader.ActualTravellingKm
      : "",
    Status: DtoVisitorEntryHeader ? DtoVisitorEntryHeader.Status : 74,
    //Status: DtoVisitorEntryHeader ? DtoVisitorEntryHeader.Status : 74,
    CreatedBy: DtoVisitorEntryHeader
      ? DtoVisitorEntryHeader.CreatedBy
      : +localStorage["UserId"],
    CreatedOn: DtoVisitorEntryHeader
      ? new Date(DtoVisitorEntryHeader.CreatedOn)
      : new Date(),
    ModifiedBy: DtoVisitorEntryHeader ? +localStorage["UserId"] : null,
    ModifiedOn: DtoVisitorEntryHeader ? new Date() : null,
    ChallanType: DtoVisitorEntryHeader ? DtoVisitorEntryHeader.ChallanType : 98,
  };

  const visitorEntryFormik: any = useFormik({
    initialValues: visitorEntryForm,
    validationSchema: VisitorEntryValidationSchema,
    onSubmit: (values: any, { resetForm }) => {
      values.IsExternal = false;
      values.VisitorTypeId = tabConfig.filter((t) => t.active == true)[0]?.type;

      if (values) {
        let gotData;
        const vNo = values?.VehicleNo?.VehicleNo ?? values?.VehicleNo;

        const vehicleExists =
          vNo &&
          VehicleNoList &&
          VehicleNoList.length > 0 &&
          VehicleNoList.filter((item) => item.VehicleNo === vNo).length > 0;

        const shouldCheck =
          values?.VehicleNo !== "" &&
          values?.VisitorEntryId === 0 &&
          !updateCheckVeh;

        const isOwnVehicle =
          values.VehicleTypeId == 129 &&
          values.VisitorEntryId == 0 &&
          !updateCheckVeh &&
          values?.VehicleNo != "";

        if (
          values.VisitorTypeId == 66 &&
          ((vehicleExists && shouldCheck) || isOwnVehicle)
        ) {
          const obj = {
            VehicleNo: vNo,
            VisitorEntryId: values?.VisitorEntryId,
          };

          try {
            dispatch(OnChangeVehicleNo(obj)).then((resV) => {
              if (
                resV?.payload?.tranStatus?.result &&
                resV.payload?.VisitorEntryHeader &&
                Object.keys(resV.payload.VisitorEntryHeader).length > 0
              ) {
                gotData = resV.payload.VisitorEntryHeader;

                if (gotData.VisitorEntryId > 0) {
                  confirmDialog({
                    message: `Vehicle ${
                      gotData.EntryType == 102 ? "IN" : "OUT"
                    } Data Found for the Vehicle ${gotData.VehicleNo}!`,
                    header: "Confirmation",
                    acceptClassName: "text-right",
                    icon: "pi pi-exclamation-triangle",
                    accept: () => {
                      setSelectedEntryData(gotData);
                      setUpdateCheckVeh(true);

                      visitorEntryFormik.setValues({
                        ...visitorEntryFormik.values,
                        VisitorEntryId: gotData.VisitorEntryId,
                        VehicleNo: gotData.VehicleNo ?? "",
                        PurposeOfVisit: gotData.PurposeOfVisit ?? null,
                        VehicleModel: gotData.VehicleModel ?? "",
                        EntryTime: gotData.EntryTime
                          ? new Date(gotData.EntryTime)
                          : null,
                        ExitTime: gotData.ExitTime
                          ? new Date(gotData.ExitTime)
                          : null,
                        DriverName: gotData.DriverName ?? "",
                        DriverId: gotData.DriverId ?? null,
                        NumberOfPassengers: gotData.NumberOfPassengers ?? 0,
                        RouteId: gotData.RouteId ?? null,
                        Remarks: gotData.Remarks ?? "",
                      });
                    },
                    rejectClassName: "hidden",
                    acceptLabel: "Ok",
                  });
                } else {
                  const vNo = values?.VehicleNo?.VehicleNo ?? values?.VehicleNo;
                  if (vNo != undefined && vNo != "" && vNo != null) {
                    proceedToSave(values);
                  }
                }
              } else {
                const vNo = values?.VehicleNo?.VehicleNo ?? values?.VehicleNo;
                if (vNo != undefined && vNo != "" && vNo != null) {
                  proceedToSave(values);
                }
              }
            });
          } catch (error) {
            console.error("Error in OnChangeVehicleNo:", error);
          }
        } else {
          // const vNo = values?.VehicleNo?.VehicleNo ?? values?.VehicleNo;
          // if (vNo != undefined && vNo != "" && vNo != null) {
          proceedToSave(values);
          // }
        }
      }
    },
  });

  const shouldTriggerOnChange = useMemo(() => {
    return (
      selectedVeh &&
      selectedVeh?.hasOwnProperty("vehicleNo") &&
      VehicleNoList &&
      VehicleNoList.length > 0 &&
      selectedVeh?.vehicleNo !== ""
    );
  }, [visitorEntryFormik?.values?.VehicleNo, VehicleNoList, selectedVeh]);

  useEffect(() => {
    if (shouldTriggerOnChange) {
      if (
        !selectedVeh?.entryTime ||
        selectedVeh?.entryTime == null ||
        !selectedVeh?.exitTime ||
        selectedVeh?.exitTime == null
      ) {
        // handleVehicleNoChange("VehicleNo", {}, selectedVeh?.vehicleNo);
      }
    }
  }, [shouldTriggerOnChange]);

  const proceedToSave = (values) => {
    setIsdisableSave(true);
    const formData: any = new FormData();
    if (values.VisitorTypeId != 66) {
      if (
        values.VisitorId == "" &&
        (values.VisitorTypeId == 35 || values.VisitorTypeId == 36)
      )
        return toastValidation("Please Select Visitor Name");
      if (
        values.PersonName == "" &&
        values.VisitorTypeId != 35 &&
        values.VisitorTypeId != 36
      )
        return toastValidation("Please Enter Visitor Name");
      if (!values.VisitedEmployeeId)
        return toastValidation("Please Select Person To Visit");
      if (values.IdProofNo != "")
        if (values.idProofType === 17 && !/^\d{12}$/.test(values.IdProofNo)) {
          return toastValidation("Please Enter Valid Aadhar Proof No");
        }
      if (!values.ValidFrom && values.VisitorTypeId == 36)
        return toastValidation("Please Select Valid From");
      if (!values.ValidFrom && values.VisitorTypeId != 36)
        return toastValidation("Please Select Appointment Date");
      if (values.VisitorTypeId == 36 && !values.ValidTo)
        return toastValidation("Please Select Valid To");
      if (values.VisitorTypeId == 36 && values.ValidFrom > values.ValidTo)
        return toastValidation("From Date Should Not be Greater Than To Date");
      if (values.VisitorTypeId == 64 || values.VisitorTypeId == 65) {
        if (!values.PartyType)
          return toastValidation("Please Select Party Type");
        if (!values.PartyName)
          return toastValidation("Please Select Party Name");
        if (
          !VisitorEntryMaterialDetailList ||
          !VisitorEntryMaterialDetailList.length ||
          VisitorEntryMaterialDetailList.length == 0
        )
          return toastValidation("Please Add Material Details");
        let exists: any[] = VisitorEntryMaterialDetailList.filter(
          (f) => f.MaterialId == null || f.Qty == ""
        );
        if (exists.length > 0)
          return toastValidation(
            "Please Add All the Details In Material Details."
          );
      }
      if (
        (values.VisitorTypeId == 35 || values.VisitorTypeId == 36) &&
        VisitorEntryBelongingDetailList.length > 0
      ) {
        let exists: any[] = VisitorEntryBelongingDetailList.filter(
          (f) => f.DeviceName == "" && f.DeviceNo == ""
        );
        if (VisitorEntryBelongingDetailList.length == 1 && exists.length > 0) {
        } else {
          let existsval: any[] = VisitorEntryBelongingDetailList.filter(
            (f) => f.DeviceName == "" || f.DeviceNo == ""
          );
          if (existsval.length > 0)
            return toastValidation("Please Add All the Details In Belongings.");
        }
      }
      if (values.VisitorTypeId == 64 && values.DcNumber == "")
        return toastValidation("Please Enter DC Number");
      if (values.VisitorTypeId == 65 && values.InvoiceNumber == "")
        return toastValidation("Please Enter Invoice Number");
      if (values.VisitorTypeId != 35 && values.VisitorTypeId != 36) {
        if (values.VehicleName == "" && values.IsExistingVehicle)
          return toastValidation("Please Select Vehicle Name");
        if (values.VehicleName == "" && !values.IsExistingVehicle)
          return toastValidation("Please Enter Vehicle Name");
        if (values.VehicleNo == "")
          return toastValidation("Please Enter Vehicle No");
        if (!values.RouteId) return toastValidation("Select Route");
        if (values.PlannedTravellingKm == "")
          return toastValidation("Please Enter Planned Travelling Km");
        if (values.ActualTravellingKm == "")
          return toastValidation("Please Enter Actual Travelling Km");
        if (
          !VisitorEntryPovDetail ||
          !VisitorEntryPovDetail.length ||
          VisitorEntryPovDetail.length == 0
        ) {
          return toastValidation("Please Select Area To Visit");
        }
      }
      if (values.PurposeOfVisit == null || values.PurposeOfVisit == "") {
        return toastValidation("Please Select Purpose Of Visit");
      }
    } else if (values.VisitorTypeId == 66) {
      if (values.VehicleNo == "" || values.VehicleNo == null)
        return toastValidation("Please Select Vehicle No");

      if (values.IsEwayBillNo) {
        let tempEwayCheck = VisitorEntryRefDetailList?.filter(
          (item) => item.RefTypeId == 130
        );
        let tempEwayCheckRefVal = VisitorEntryRefDetailList?.filter(
          (item) => item.RefTypeId == 130
        );
        if (!tempEwayCheck || tempEwayCheck.length == 0) {
          return toastValidation("Please Add Eway Bill in Reference Details.");
        } else if (
          tempEwayCheckRefVal[0].RefValue == null ||
          tempEwayCheckRefVal[0].RefValue == ""
        ) {
          return toastValidation(
            "Please Add Eway Bill No in Reference Details."
          );
        }
      }
      if (values.IsEinvBillNo) {
        let tempEinvCheck = VisitorEntryRefDetailList?.filter(
          (item) => item.RefTypeId == 131
        );
        let tempEinvCheckRefVal = VisitorEntryRefDetailList?.filter(
          (item) => item.RefTypeId == 131
        );
        if (!tempEinvCheck || tempEinvCheck.length == 0) {
          return toastValidation(
            "Please Add EInvoice No in Reference Details."
          );
        } else if (
          tempEinvCheckRefVal[0].RefValue == null ||
          tempEinvCheckRefVal[0].RefValue == ""
        ) {
          return toastValidation(
            "Please Add EInvoice Bill No in Reference Details."
          );
        }
      }
      if (values.PurposeOfVisit == null || values.PurposeOfVisit == "")
        return toastValidation("Please Select Purpose Of Visit");
      if (
        checkedVehicle &&
        values.StartingKm != 0.0 &&
        values.EndingKm != 0.0 &&
        values.StartingKm > values.EndingKm
      )
        return toastValidation("Ending Km Should not Less than Starting Km ");
    }

    let List1: any[] = visitorEntryDetailList;
    let List2: any[] = VisitorEntryBelongingDetailList;
    let List3: any[] = VisitorEntryMaterialDetailList;
    let List4: any[] = VisitorEntryRefDetailList;
    if (values.VisitorTypeId == 35) {
      List3 = [];
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
      List1 = [];
      List2 = [];
      List3 = [];
    }
    let ListvisitorEntryDetailList: any[] = [],
      ListVisitorEntryBelongingDetailList: any[] = [],
      ListVisitorEntryMaterialDetailList: any[] = [],
      ListvehicleReferenceDetailList: any[] = [];

    let validToDateDtl;

    if (values.ValidFrom) {
      const validFromDate =
        values.ValidFrom instanceof Date
          ? values.ValidFrom
          : new Date(values.ValidFrom);

      validToDateDtl = new Date(
        validFromDate.getFullYear(),
        validFromDate.getMonth(),
        validFromDate.getDate()
      );

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
        vedObj.DocumentName = documentUrl;
        vedObj.DocumentUrl = documentUrl;
        vedObj.Status = x.Status;
        vedObj.ValidFrom = tLDS(values.ValidFrom);
        vedObj.ValidTo =
          values.VisitorTypeId == 35
            ? datepipes(validToDateDtl)
            : tLDS(values.ValidTo);
        vedObj.IsEditedImage = true;
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
        if (
          (vemdObj.Uom != null && vemdObj.Uom != "" && vemdObj.Qty != null) ||
          vemdObj.Qty != ""
        ) {
          ListVisitorEntryMaterialDetailList.push(vemdObj);
        }
      }
    }
    if (List4.length > 0) {
      for (let i = 0; i < List4.length; i++) {
        const x = List4[i];
        let vebdObj: any = {};
        vebdObj.VisitorEntryRefDetailId = x.VisitorEntryRefDetailId ?? 0;
        vebdObj.VisitorEntryId = x.VisitorEntryId ?? 0;
        vebdObj.RefTypeId = x.RefTypeId;
        vebdObj.RefValue = x.RefValue;
        if (
          (vebdObj.RefTypeId != null &&
            vebdObj.RefTypeId != "" &&
            vebdObj.RefValue != null) ||
          vebdObj.RefValue != ""
        ) {
          ListvehicleReferenceDetailList.push(vebdObj);
        }
      }
    }
    if (!photo && values.VisitorTypeId != 66) {
      setIsdisableSave(false);
      toast.current?.show({
        severity: "warn",
        detail: "Please Capture Image",
        summary: "Warning Message",
      });
      return;
    }
    // var validto = new Date(
    //   values.ValidFrom.getFullYear(),
    //   values.ValidFrom.getMonth(),
    //   values.ValidFrom.getDate()
    // );
    // validto.setHours(23, 59, 59, 999);
    var validto;

    if (values.ValidFrom) {
      // Ensure we are working with a Date object
      const validFromDate =
        values.ValidFrom instanceof Date
          ? values.ValidFrom
          : new Date(values.ValidFrom);

      // Add one day to the date
      validto = new Date(
        validFromDate.getFullYear(),
        validFromDate.getMonth(),
        validFromDate.getDate()
      );

      // Set time to end of the day
      validto.setHours(23, 59, 59, 999);
    }
    values.ValidFrom = datepipes(new Date(values.ValidFrom));

    values.ValidFrom = datepipes(new Date(values.ValidFrom));
    if (values.VisitorTypeId == 66) {
      values.EntryTime =
        values.EntryTime != null && values.EntryTime != ""
          ? tLDS(new Date(values.EntryTime))
          : null;
      values.ExitTime =
        values.ExitTime != null && values.ExitTime != ""
          ? tLDS(new Date(values.ExitTime))
          : null;
    }
    values.ValidTo =
      values.VisitorTypeId == 35
        ? datepipes(validto)
        : datepipes(new Date(values.ValidTo));
    values.VisitorEntryDate = datepipes(new Date(values.VisitorEntryDate));
    values.CreatedOn = datepipes(new Date(values.CreatedOn));
    values.IsInternalAppointment = false;
    // values.VisitorId = visitorEntryDetailList[0].VisitorDetailId;

    if (!isCreate || checkedVehicle) {
      values.ModifiedOn = datepipes(new Date());
      values.ModifiedBy = +localStorage["UserId"];
    }
    if (values.GateId == "null" || values.GateId == "") {
      values.GateId = null;
    }
    values.VehicleNo = values.VehicleNo.VehicleNo
      ? values.VehicleNo.VehicleNo
      : values.VehicleNo;

    let obj = {
      VisitorEntry: values,
      VisitorEntryDetail: ListvisitorEntryDetailList ?? [],
      VisitorEntryRefDetail: ListvehicleReferenceDetailList ?? [],
      VisitorEntryBelongingDetail: ListVisitorEntryBelongingDetailList ?? [],
      VisitorEntryMaterialDetail: ListVisitorEntryMaterialDetailList ?? [],
      VisitorEntryAtvDetail: VisitorEntryPovDetail ?? [],
    };
    let input: string = JSON.stringify(obj);
    formData.append("input", input);
    formData.append("webfile", photo);
    formData.append("webfile1", document);
    formData.append("webfiles", []);
    formData.append("digSign", null);

    if (values.VisitorTypeId != 66) {
      if (!createVisEnt) {
        var updateres = dispatch(update(formData));
        updateres
          .then((res) => {
            if (res.payload.tranStatus.result == true) {
              toast.current?.show({
                severity: "success",
                summary: "Success Message",
                detail: res.payload.tranStatus.lstErrorItem[0].Message,
              });

              setVisible(false);
              setIsdisableSave(false);
              handleTabAction({
                target: {
                  value: values.VisitorTypeId,
                  id: values.VisitorTypeId,
                },
              });
              resetAllForm();
            } else {
              handleTabAction({
                target: {
                  value: values.VisitorTypeId,
                  id: values.VisitorTypeId,
                },
              });
              setIsdisableSave(false);
              toast.current?.show({
                severity: "error",
                summary: "Error Message",
                detail: res.payload.tranStatus.lstErrorItem[0].Message,
              });
            }
          })
          .catch((error) => {
            handleTabAction({
              target: {
                value: values.VisitorTypeId,
                id: values.VisitorTypeId,
              },
            });
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
              toast.current?.show({
                severity: "success",
                summary: "Success Message",
                detail: res.payload.tranStatus.lstErrorItem[0].Message,
              });
              setVisible(false);
              // if (
              //   +selectedData.selectedType == 35 ||
              //   (+selectedData.selectedType == 36 &&
              //     +selectedData.selectedType != 66)
              // ) {
              if (+selectedData.selectedType == 35) {
                handleBookedVisitor(
                  event,
                  res.payload.VisitorEntryHeader,
                  false
                );
                onChangeVisitorType(
                  "VisitorTypeId",
                  {},
                  +selectedData.selectedType
                );
              } else if (+selectedData.selectedType == 36) {
                handleTabAction({
                  target: {
                    value: values.VisitorTypeId,
                    id: values.VisitorTypeId,
                  },
                });
              }
              if (
                values.IsAppointmentBooking == false &&
                +selectedData.selectedType != 66
              ) {
                let obj = {
                  VisitorEntryDetailId:
                    res.payload.VisitorEntryDetail[0].VisitorEntryDetailId,
                  VisitorEntryCode:
                    res.payload.VisitorEntryHeader.VisitorEntryCode,
                };
                selfApproval(obj);
              }
              // fetchVisEntryDtl(res.payload.VisitorEntryHeader);
              // handleTabAction({
              //   target: {
              //     value: values.VisitorTypeId,
              //     id: values.VisitorTypeId
              //   },
              // });
              setIsdisableSave(false);
              resetAllForm();
            } else {
              handleTabAction({
                target: {
                  value: values.VisitorTypeId,
                  id: values.VisitorTypeId,
                },
              });
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
            handleTabAction({
              target: {
                value: values.VisitorTypeId,
                id: values.VisitorTypeId,
              },
            });
            toast.current?.show({
              severity: "error",
              summary: "Error",
              detail: JSON.stringify(error),
            });
          });
      }
    } else if (values.VisitorTypeId == 66) {
      if (!checkVehAction) {
        var updateres = dispatch(update(formData));
        updateres
          .then((res) => {
            if (res.payload.tranStatus.result == true) {
              toast.current?.show({
                severity: "success",
                summary: "Success Message",
                detail: res.payload.tranStatus.lstErrorItem[0].Message,
              });
              let dataObj = { ...values };
              dataObj.VehicleTypeName =
                VehicleTypeList && VehicleTypeList.length > 0
                  ? VehicleTypeList.filter(
                      (item) => item.MetaSubId == values.VehicleTypeId
                    )[0]?.MetaSubDescription
                  : "-";
              if (values?.DriverId != null) {
                dataObj.DriverName =
                  DriverList && DriverList.length > 0
                    ? DriverList.filter(
                        (item) => item.UserId == values.DriverId
                      )[0]?.UserName
                    : "-";
              }
              if (values?.DriverName != null) {
                dataObj.DriverName = values.DriverName || "-";
              }
              setSelectedVehData({
                data: dataObj,
              });
              setVisible(false);
              setIsdisableSave(false);

              resetAllVehForm();
              setVehicleNoList([]);
              setSelectedVeh({});
            } else {
              setIsdisableSave(false);
              toast.current?.show({
                severity: "error",
                summary: "Error Message",
                detail: res.payload.tranStatus.lstErrorItem[0].Message,
              });
              setVehicleNoList([]);
              setSelectedVeh({});
            }
          })
          .catch((error) => {
            setIsdisableSave(false);
            setVehicleNoList([]);
            setSelectedVeh({});
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
              handleVehPassPrev();
              setIsdisableSave(false);
              toast.current?.show({
                severity: "success",
                summary: "Success Message",
                detail: res.payload.tranStatus.lstErrorItem[0].Message,
              });
              let dataObj = { ...values };
              dataObj.VehicleTypeName =
                VehicleTypeList && VehicleTypeList.length > 0
                  ? VehicleTypeList.filter(
                      (item) => item.MetaSubId == values.VehicleTypeId
                    )[0]?.MetaSubDescription
                  : "-";
              if (values?.DriverId != null) {
                dataObj.DriverName =
                  DriverList && DriverList.length > 0
                    ? DriverList.filter(
                        (item) => item.UserId == values.DriverId
                      )[0]?.UserName
                    : "-";
              }
              if (values?.DriverName != null) {
                dataObj.DriverName = values.DriverName || "-";
              }
              setSelectedVehData({
                data: dataObj,
              });
              setVisible(false);
              resetAllVehForm();
              setVehicleNoList([]);
              setSelectedVeh({});
            } else {
              setIsdisableSave(false);
              setVehicleNoList([]);
              setSelectedVeh({});
              toast.current?.show({
                severity: "error",
                summary: "Error",
                detail: res.payload.tranStatus.lstErrorItem[0].Message,
              });
            }
          })
          .catch((error) => {
            setIsdisableSave(false);
            setVehicleNoList([]);
            setSelectedVeh({});
            toast.current?.show({
              severity: "error",
              summary: "Error",
              detail: JSON.stringify(error),
            });
          });
      }
    }
  };

  const changeEntryType = (e) => {
    resetOnlyForm();

    if (!e.target.value) {
      visitorEntryFormik.setFieldValue("EntryTime", null);
      visitorEntryFormik.setFieldValue("ExitTime", new Date());
    } else if (e.target.value) {
      visitorEntryFormik.setFieldValue("EntryTime", new Date());
      visitorEntryFormik.setFieldValue("ExitTime", null);
    }
    setRefTypeList([]);
    setVisitorEntryRefDetailList([
      {
        VisitorEntryRefDetailId: 0,
        VisitorEntryId: 0,
        show: true,
        RefTypeId: null,
        RefValue: "",
        adisable: false,
        cdisable: true,
        ddisable: false,
        idisable: false,
      },
    ]);
    if (!checkVehAction) {
      resetAllVehForm();
    }
    onCheckboxChange(
      {
        target: {
          name: "IsEwayBillNo",
        },
        checked: false,
      },
      {
        clr: false,
      }
    );
    onCheckboxChange(
      {
        target: {
          name: "IsEinvBillNo",
        },
        checked: false,
      },
      {
        clr: false,
      }
    );
    visitorEntryFormik?.setFieldValue(
      "EntryType",
      e.target.value == true ? 102 : 103
    );
    if (!e.target.value) {
      visitorEntryFormik.setFieldValue("EntryTime", null);
      visitorEntryFormik.setFieldValue("ExitTime", new Date());
    } else if (e.target.value) {
      visitorEntryFormik.setFieldValue("EntryTime", new Date());
      visitorEntryFormik.setFieldValue("ExitTime", null);
    }
    setSelectedEntryData({
      ...selectedEntryData,
      VehicleTypeId: visitorEntryFormik.values.VehicleTypeId,
      VehicleNo: "",
      DriverId: null,
      PurposeOfVisit: null,
      EntryType: 102,
      NumberOfPassengers: "",
      DriverName: null,
      StartingKm: "",
      EndingKm: "",
      IsEwayBillNo: false,
      IsEinvBillNo: false,
      VisitorRemarks: "",
      EntryTime: !e.target.value ? null : new Date(),
      ExitTime: !e.target.value ? new Date() : null,
    });
    setSelectedVehType(visitorEntryFormik.values.VehicleTypeId);
    checkVehControl();
  };

  const handleVehPassPrevPrint = (e, item) => {
    e.stopPropagation();

    const data = {
      VisitorEntryId: 0,
      VisitorTypeId: tabConfig.filter((t) => t.active == true)[0]?.type,
      CompanyId: +localStorage["CompanyId"],
      PlantId: +localStorage["PlantId"],
      RoleId: +localStorage["DefaultRoleId"],
    };
    var result = dispatch(createInit(data));
    result.then((res) => {
      if (res.payload.tranStatus.result == true) {
        let dataObj = { ...item };
        dataObj.VehicleTypeName =
          res.payload.VehicleTypeList && res.payload.VehicleTypeList.length > 0
            ? res.payload.VehicleTypeList.filter(
                (itemRes) => itemRes.MetaSubId == item.VehicleTypeId
              )[0]?.MetaSubDescription
            : "-";
        if (item?.DriverId != null) {
          dataObj.DriverName =
            res.payload.DriverList && res.payload.DriverList.length > 0
              ? res.payload.DriverList.filter(
                  (itemRes) => itemRes.UserId == item.DriverId
                )[0]?.UserName
              : "-";
        }
        if (item?.DriverName != null) {
          dataObj.DriverName = item.DriverName || "-";
        }
        setSelectedVehData({
          data: dataObj,
        });
      }
    });
  };

  useEffect(() => {
    if (
      selectedVehData &&
      Object.keys(selectedVehData).length > 0 &&
      tabConfig.filter((t) => t.active == true)[0]?.type == 66 &&
      ((selectedVehData?.data?.EntryTime != null &&
        selectedVehData?.data?.ExitTime == null) ||
        (selectedVehData?.data?.EntryTime == null &&
          selectedVehData?.data?.ExitTime != null) ||
        isCurrentCreate)
    ) {
      getScanCode(selectedVehData?.data?.VehicleNo);
    }
  }, [selectedVehData]);

  const handleVehPassPrev = () => {
    setVehPopVisible(true);
  };

  const handleEditData = (itemData) => {
    setCreateVisEnt(false);
    setIsBelongingDetailsShow(false);
    const data = {
      VisitorId: itemData.VisitorId,
      PlantId: +localStorage["PlantId"],
      CompanyId: +localStorage["CompanyId"],
      RoleId: +localStorage["DefaultRoleId"],
    };
    var result = dispatch(createInitVM(data));
    result
      .then((res) => {
        if (res.payload.tranStatus.result) {
          let data = {
            ...res.payload.VisitorHeader,
          };
          data.VisitorDetails = res.payload.VisitorDetail;

          loadVisitorFormikValues(data);
          setVisitorShow(true);
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

  const editData = (itemData) => {
    dispatch(createOrEdit(itemData));
    setCreateVisEnt(false);
    loadVisCreateInit(itemData.VisitorId);
    const data = {
      VisitorEntryId: itemData.VisitorEntryId,
      VisitorTypeId: tabConfig.filter((t) => t.active == true)[0]?.type,
      PlantId: +localStorage["PlantId"],
      CompanyId: +localStorage["CompanyId"],
      RoleId: +localStorage["DefaultRoleId"],
    };
    const dataFetched = dispatch(createInit(data));
    dataFetched
      .then((res) => {
        if (res.payload.tranStatus.result == true) {
          loadEditValues(res.payload.VisitorEntryHeader);
          setVisible(true);
        } else {
          toast.current?.show({
            severity: "error",
            summary: "Error Message",
            detail: res.payload.tranStatus.lstErrorItem[0].Message,
          });
        }
      })
      .catch((err) => {
        toast.current?.show({
          severity: "error",
          summary: "Error Message",
          detail: JSON.stringify(err),
        });
      });
  };

  const selfApproval = (itemData) => {
    let obj = {
      UserId: localStorage["UserId"],
      VisitorEntryCode: itemData.VisitorEntryCode,
      VisitorEntryDetailId: itemData.VisitorEntryDetailId,
      Checkintime: tLDS(new Date()),
      type: "SelfApproval",
      CompanyId: +localStorage["CompanyId"],
      PlantId: +localStorage["PlantId"],
      RoleId: +localStorage["DefaultRoleId"],
    };
    var result = dispatch(CheckIn(obj));
    result
      .then((res) => {
        if (res.payload.tranStatus.result) {
          toast.current?.show({
            severity: "success",
            summary: "Success Message",
            detail: "Checked In Successfully.",
          });
          Fetch();
        } else {
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: res.payload.tranStatus.lstErrorItem[0].Message,
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

  const setList = () => {
    setVisitorTypeList(DtoVisitorTypeList);
    setIsPreBookingList(DtoIsPreBookingList);
    setProofList(DtoProofList);
    setStatusList(DtoStatusList);
    setDeliveryChallanList(DtoChallanTypeList);
    setTitleList(DtoTitleList);
    setEmployeeList(DtoEmployeeList);
    setDepartmentList(DtoDepartmentList);
    setTempVisitorNameList(DtoVisitorNameList);
    setPartyTypeList(DtoPartyTypeList);
    setAreaList(DtoAreaList);
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
      obj.VisitorId = x.VisitorDetailId;
      obj.TitleId = x.TitleId;
      obj.FirstName = x.FirstName;
      obj.LastName = x.LastName;
      obj.DepartmentId = x.DepartmentId;
      obj.Dob = new Date(x.Dob);
      obj.MailId = x.MailId;
      obj.MobileNo = x.MobileNo;
      obj.IdCardType = x.IdCardType;
      obj.IdCardNo = x.IdCardNo;
      obj.DocumentName = x.DocumentName;
      obj.DocumentUrl = x.DocumentName;
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
    const data = {
      VisitorEntryId: VisitorEntryId,
      VisitorTypeId: tabConfig.filter((t) => t.active == true)[0]?.type,
      CompanyId: +localStorage["CompanyId"],
      PlantId: +localStorage["PlantId"],
      RoleId: +localStorage["DefaultRoleId"],
    };
    var result = dispatch(createInit(data));
    result
      .then((res) => {
        if (res.payload.tranStatus.result == true) {
          setVisitorTypeList(res.payload.VisitorTypeList);
          setIsPreBookingList(res.payload.IsPreBookingList);
          setProofList(res.payload.ProofList);
          setStatusList(res.payload.StatusList);
          setDeliveryChallanList(res.payload.ChallanTypeList);
          setVehicleTypeList(res.payload.VehicleTypeList);
          setTempRefTypeList(res.payload.RefList);
          setTitleList(res.payload.TitleList);
          setEmployeeList(res.payload.EmployeeList);
          setDepartmentList(res.payload.DepartmentList);
          setTempVisitorNameList(res.payload.VisitorNameList);
          setVisitorNameList(res.payload.VisitorNameList);
          setPartyTypeList(res.payload.PartyTypeList);
          setAreaList(res.payload.AreaList);
          setRouteList(res.payload.RouteList);
          setDriverList(res.payload.DriverList);
          setVehicleList(res.payload.VehicleList);
          setTempVehicleList(res.payload.VehicleList);
          setMaterialList(res.payload.MaterialList);
          setWorkPermitList(res.payload.WorkPermitList);
          setTempWorkPermitList(res.payload.WorkPermitList);

          setPurposeList(res.payload.PurposeList);
          if (+selectedData?.selectedType == 66 && isCurrentCreate) {
            FilterVehNo(
              {
                query: selectedVeh?.vehicleNo,
              },
              "NOSCAN"
            );
            onChangeVehicleType(
              {
                target: {
                  name: "VehicleTypeId",
                },
                value: 28,
              },
              {
                type: 1,
              }
            );
          }
          if (isCreate == true) {
            if (
              +selectedData?.selectedType != 66 &&
              +selectedData?.selectedType != 65
            ) {
              onChangeVisitorType(
                "VisitorTypeId",
                {},
                selectedData?.selectedType
              );
            }
            let obj: any = {};
            obj.VisitorEntryBelongingDetailId = 0;
            obj.VisitorEntryId = 0;
            obj.DeviceNo = "";
            obj.DeviceName = "";
            setVisitorEntryBelongingDetailList([obj]);
            let matobj: any = {};
            matobj.VisitorEntryMaterialDetailId = 0;
            matobj.VisitorEntryId = 0;
            matobj.MaterialId = null;
            matobj.Uom = null;
            matobj.Qty = "";
            setVisitorEntryMaterialDetailList([matobj]);
            if (!isCurrentCreate) {
              visitorEntryFormik.setFieldValue(
                "VisitedEmployeeId",
                selectedData.selectedWhomToVisit
              );
            }
          }
          // if(selectedData?.selectedType == 66) {
          //   setCheckedVehicle(true);
          //   setVisible(true);
          // }
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

  useEffect(() => {
    if (selectedData?.selectedType == 66) {
      setCheckedVehicle(true);
      setVisible(true);
    }
  }, [VehicleTypeList]);

  const handleSelect = (name, other, value) => {
    visitorEntryFormik.setFieldValue(name, value);
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
    let obj: any = {};
    obj.VisitorEntryBelongingDetailId = 0;
    obj.VisitorEntryId = 0;
    obj.DeviceNo = "";
    obj.DeviceName = "";
    setVisitorEntryBelongingDetailList([obj]);
    let matobj: any = {};
    matobj.VisitorEntryMaterialDetailId = 0;
    matobj.VisitorEntryId = 0;
    matobj.MaterialId = null;
    matobj.Uom = null;
    matobj.Qty = "";
    setVisitorEntryMaterialDetailList([matobj]);
    setVisitorEntryPovDetail([]);
    setPhoto(null);
    setImageUrl(IMAGES.NO_IMG);
    setDocument(null);
    setDocumentUrl("");
    setPartyNameList([]);
    setSearchTerm("");
    setSelectedHost({});
    setSelectedVisitor({});
    setSelectedVeh({});
    setIsdisableSave(false);
    if (visible) {
      CreatePageOnLoad(0);
    }
    // setVisible(false);
    // setCheckedVehicle(false);
    // handleTabAction({
    //   target: {
    //     value: 35,
    //     id: 35,
    //   },
    // });
    resetAllFormVM();
  };

  useEffect(() => {
    if (!isCurrentCreate) {
      if (VisitorNameList && VisitorNameList.length > 0) {
        // onChangeVisitor("VisitorId", {}, selectedData.selectedVisitorId, []);
        onChangeVisitor("VisitorId", {}, selectedData.selectedVisitorId, []);
        handleSelect(
          "VisitedEmployeeId",
          {},
          selectedData?.selectedWhomToVisit
        );

        // const updatedTabConfig = tabConfig.map((item) => ({
        //   ...item,
        //   active: item.type === +selectedData?.selectedType,
        // }));
        // setTabConfig(updatedTabConfig);
      }
    }
  }, [VisitorNameList]);

  const onChangeVisitor = (name, other, value, updatedList) => {
    visitorEntryFormik.setFieldValue(name, value);

    if (updatedList && updatedList.length > 0) {
      let visitor: any = updatedList.find((f) =>
        f.VisitorDetails?.find((i) => i.VisitorDetailId == value)
      );
      if (visitor) {
        loadFoundVis(visitor, value);
      }
    } else if (VisitorNameList && VisitorNameList.length > 0) {
      let visitor: any = VisitorNameList.find(
        (i) => i.VisitorDetailId == value
      );
      if (visitor) {
        loadFoundVis(visitor, value);
      }
    }
  };

  const loadFoundVis = (visitor, value) => {
    visitorEntryFormik.setFieldValue("PersonName", visitor.FirstName);
    visitorEntryFormik.setFieldValue("VisitorId", visitor.VisitorDetailId);
    visitorEntryFormik.setFieldValue("MobileNo", visitor.MobileNo);
    visitorEntryFormik.setFieldValue("IdProofType", visitor.IdCardType);
    visitorEntryFormik.setFieldValue("IdProofNo", visitor.IdCardNo);
    visitorEntryFormik.setFieldValue("VisitorTypeId", visitor.VisitorTypeId);
    // setIsMaterialDetailsShow(false);
    setvisitorEntryDetailList([]);
    if (
      visitorEntryFormik.values.VisitorTypeId == 36 ||
      visitorEntryFormik.values.VisitorTypeId == 35
    ) {
      let visDtlId;
      if (visitor && visitor.hasOwnProperty("VisitorDetails")) {
        visDtlId = visitor?.VisitorDetails[0]?.VisitorDetailId;
      } else {
        visDtlId = visitor?.VisitorDetailId;
      }
      let obj = {
        VisitorTypeId: visitorEntryFormik.values.VisitorTypeId,
        VisitorId: visDtlId,
        VisitorDetailIds: "",
        PlantId: +localStorage["PlantId"],
        CompanyId: +localStorage["CompanyId"],
        RoleId: +localStorage["DefaultRoleId"],
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
  };

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
      let obj1: any = {};
      obj1.VisitorEntryBelongingDetailId = 0;
      obj1.VisitorEntryId = 0;
      obj1.DeviceNo = "";
      obj1.DeviceName = "";
      setVisitorEntryBelongingDetailList([obj1]);
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
      visitorEntryFormik.setFieldValue("ValidTo", null);
    } else if (VisitorTypeId == 36) {
      //Contractor
      // if (!isCreate && !isView)
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
  const onChangeVehicleType = (event, type: any = 0) => {
    resetOnlyForm();
    if (type == 0) {
      visitorEntryFormik.setFieldValue("VisitorEntryId", 0);
    }
    visitorEntryFormik.setFieldValue("VehicleNo", "");
    visitorEntryFormik.setFieldValue(event.target.name, event.value);
    if (visitorEntryFormik.values.EntryType == 102) {
      visitorEntryFormik.setFieldValue("EntryTime", new Date());
      visitorEntryFormik.setFieldValue("ExitTime", null);
    } else if (visitorEntryFormik.values.EntryType == 103) {
      visitorEntryFormik.setFieldValue("EntryTime", null);
      visitorEntryFormik.setFieldValue("ExitTime", new Date());
    }
    setSelectedEntryData({
      ...selectedEntryData,
      VehicleTypeId: event.value,
      VehicleNo: "",
      DriverId: null,
      PurposeOfVisit: null,
      EntryType: 102,
      NumberOfPassengers: "",
      DriverName: null,
      StartingKm: "",
      EndingKm: "",
      IsEwayBillNo: false,
      IsEinvBillNo: false,
      VisitorRemarks: "",
      EntryTime: visitorEntryFormik.values.EntryType == 102 ? new Date() : null,
      ExitTime: visitorEntryFormik.values.EntryType == 103 ? null : new Date(),
    });
    setSelectedVehType(event.value);
    checkVehControl();
    setUpdateCheckVeh(false);
  };
  const OnChangeVehicle = (name, other, value, vehNo) => {
    visitorEntryFormik.setFieldValue(name, value);

    visitorEntryFormik.setFieldValue(
      "VehicleNo",
      VehicleList.find((f) => f.VehicleNo == vehNo).VehicleNo
    );
  };
  const OnChangeDriver = (name, other, value) => {
    visitorEntryFormik.setFieldValue(name, value.UserName);
    visitorEntryFormik.setFieldValue("DriverId", value.UserId);
    // if (DriverList && DriverList.length > 0) {
    //   visitorEntryFormik.setFieldValue(
    //     "DriverId",
    //     DriverList.find((f) => f.UserId == value).UserId
    //   );
    // }
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
    visitorFormik.setFieldValue("DocumentName", e.name);
    visitorFormik.setFieldValue("DocumentUrl", e.name);
    setDocumentUrl(e.name);
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

  const onChangeVisitorType = (name, other, value) => {
    setVisitorNameList([]);

    if (isCreate) setvisitorEntryDetailList([]);
    visitorEntryFormik.setFieldValue(name, value);
    let obj = {
      VisitorTypeId: value,
      CompanyId: +localStorage["CompanyId"],
      PlantId: +localStorage["PlantId"],
      RoleId: +localStorage["DefaultRoleId"],
    };

    var result = dispatch(OnChangeVisitorType(obj));
    result
      .then((res) => {
        if (res.payload.tranStatus.result == true) {
          setVisitorNameList(res.payload.VisitorNameList);
          setTempVisitorNameList(res.payload.VisitorNameList);
          setVehicleList(res.payload.VehicleList);
          setTempVehicleList(res.payload.VehicleList);
          setWorkPermitList(res.payload.WorkPermitList);
          setTempWorkPermitList(res.payload.WorkPermitList);
          if (isCreate) {
            // visitorEntryFormik.setFieldValue("VisitorId", null);
            // visitorEntryFormik.setFieldValue("PersonName", "");
            // visitorEntryFormik.setFieldValue("MobileNo", "");
            visitorEntryFormik.setFieldValue("IdProofType", null);
            visitorEntryFormik.setFieldValue("IdProofNo", "");
            visitorEntryFormik.setFieldValue("InvoiceNumber", "");
            visitorEntryFormik.setFieldValue("DcNumber", "");
            visitorEntryFormik.setFieldValue("PoNumber", "");
            visitorEntryFormik.setFieldValue("ContainerNumber", "");
          }
          let event = {
            target: { name: "IsAppointmentBooking" },
            checked: isCreate
              ? value == 36
                ? true
                : false
              : DtoVisitorEntryHeader.IsAppointmentBooking,
            value: value,
          };
          onClickIsAppointmentBooking(event);
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
    pageLoadScript();
    setSelectedData({
      ...selectedData,
      selectedType: tabConfig.filter((t) => t.active == true)[0]?.type,
    });
    if (checked || !checked) {
      CreatePageOnLoad(0);
    }
  }, [checked, tabConfig]);

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

  const handleVehEntryCreate = () => {
    setIsCurrentCreate(true);
    CreatePageOnLoadCVisitorEntry(0);
    visitorEntryFormik.setFieldValue("EntryType", 102);
    visitorEntryFormik.setFieldValue("EntryTime", new Date());
    visitorEntryFormik.setFieldValue("ExitTime", null);
  };

  useEffect(() => {
    if (!checked) {
      if (
        selectedData?.selectedType != 66 &&
        selectedData?.selectedType != 65 &&
        !dialogVisible
      ) {
        if (selectedData?.selectedType == 100) {
          route.push("/home/cWorkPermit");
        } else if (
          selectedVisitor &&
          selectedHost &&
          Object.keys(selectedVisitor).length > 0 &&
          Object.keys(selectedHost).length > 0
        ) {
          if (selectedVisitor && selectedHost) {
            setIsCurrentCreate(false);
            setVisible(true);
          }
        }
      }
      if (selectedVeh) {
        if (Object.keys(selectedVeh).length > 0) {
          let obj = {
            VehicleData: selectedVeh.vehicleNo,
            CompanyId: +localStorage["CompanyId"],
            PlantId: +localStorage["PlantId"],
          };
          CreatePageOnLoadCVisitorEntry(0);
          if (selectedVeh?.entryType != 103) {
            visitorEntryFormik.setFieldValue("EntryType", 102);
          }
        }
      }
      if (selectedWP) {
        route.push("/home/cWorkPermit");
      }
      if (selectedInv) {
        setVisible(true);
      }
    }
  }, [selectedVisitor, selectedHost, selectedVeh, selectedInv, selectedWP]);

  const loadEditValues = (headerData) => {
    const data = {
      VisitorTypeId: headerData.VisitorTypeId,
      VisitorId: headerData.VisitorId,
      UserId: headerData.VisitedEmployeeId,
      VisitorEntryCode: headerData.VisitorEntryCode,
      CompanyId: +localStorage["CompanyId"],
      PlantId: +localStorage["PlantId"],
      RoleId: +localStorage["DefaultRoleId"],
    };
    var result = dispatch(OnChangeVisHost(data));
    result
      .then((res) => {
        if (res.payload.tranStatus.result == true) {
          if (
            res.payload.LastVisitorEntryList &&
            res.payload.LastVisitorEntryList.length > 0
          ) {
            loadVisitorEntryFormikValues(res.payload.LastVisitorEntryList);
            loadVisitorBelongingFormikValues(
              res.payload.LastVisitorEntryBelongList
            );
            loadVisitorFormikValues(res.payload.LastVisitorEntryList);
            // setCreateVisEnt(false);
            setVisible(true);
            // setShowEntryDetail(true);
          } else {
            // setShowEntryDetail(true);
          }
        }
      })
      .catch((error) => {});
  };

  const loadVisitorBelongingFormikValues = (lastBelongList) => {};

  const loadVisitorFormikValues = (lastVisList) => {
    visitorFormik.setFieldValue(
      "FirstName",
      lastVisList.hasOwnProperty("WorkerName")
        ? lastVisList.WorkerName
        : lastVisList.FirstName
    );
    visitorFormik.setFieldValue("VisitorCode", lastVisList.VisitorCode);
    visitorFormik.setFieldValue("VisitorCompany", lastVisList.VisitorCompany);
    visitorFormik.setFieldValue("VisitorId", lastVisList.VisitorId);
    visitorFormik.setFieldValue("MailId", lastVisList.MailId);
    visitorFormik.setFieldValue("MobileNo", lastVisList.MobileNo);
    visitorFormik.setFieldValue("Status", lastVisList.Status);

    visitorDFormik.setFieldValue(
      "VisitorDetailId",
      lastVisList.VisitorDetails[0].VisitorDetailId
    );
    visitorDFormik.setFieldValue(
      "VisitorDetailCode",
      lastVisList.VisitorDetails[0].VisitorDetailCode
    );
    visitorDFormik.setFieldValue(
      "VisitorId",
      lastVisList.VisitorDetails[0].VisitorId
    );
    visitorDFormik.setFieldValue(
      "TitleId",
      lastVisList.VisitorDetails[0].TitleId
    );
    visitorDFormik.setFieldValue(
      "FirstName",
      lastVisList.VisitorDetails[0].FirstName
    );
    visitorDFormik.setFieldValue(
      "LastName",
      lastVisList.VisitorDetails[0].LastName
    );
    visitorDFormik.setFieldValue(
      "DepartmentId",
      lastVisList.VisitorDetails[0].DepartmentId
    );
    visitorDFormik.setFieldValue("Dob", lastVisList.VisitorDetails[0].Dob);
    visitorDFormik.setFieldValue(
      "MailId",
      lastVisList.VisitorDetails[0].MailId
    );
    visitorDFormik.setFieldValue(
      "MobileNo",
      lastVisList.VisitorDetails[0].MobileNo
    );
    visitorDFormik.setFieldValue(
      "IdCardType",
      lastVisList.VisitorDetails[0].IdCardType
    );
    visitorDFormik.setFieldValue(
      "IdCardNo",
      lastVisList.VisitorDetails[0].IdCardNo
    );
    visitorDFormik.setFieldValue(
      "DocumentName",
      lastVisList.VisitorDetails[0].DocumentName
    );
    visitorDFormik.setFieldValue(
      "DocumentUrl",
      lastVisList.VisitorDetails[0].DocumentUrl
    );
    visitorDFormik.setFieldValue(
      "Status",
      lastVisList.VisitorDetails[0].Status
    );
    visitorDFormik.setFieldValue(
      "ExpirryDate",
      new Date(lastVisList.VisitorDetails[0].ExpirryDate)
    );
    visitorDFormik.setFieldValue(
      "WorkSeverity",
      lastVisList.VisitorDetails[0].WorkSeverity
    );
  };

  const loadVisitorEntryFormikValues = (lastVisEntList) => {
    let visEntKeys = Object.keys(visitorEntryForm);
    lastVisEntList &&
      lastVisEntList.map((item) => {
        Object.entries(item).map(([key, item]) => {
          if (visEntKeys.includes(key)) {
            visEntKeys.forEach((insKey) => {
              visitorEntryFormik.setFieldValue(key, item);
            });
          }
        });
      });
    onChangeVisitor("VisitorId", {}, lastVisEntList[0].VisitorDetailId, []);
    handleSelect("PersonToVisit", {}, lastVisEntList[0].VisitedEmployeeId);

    // let SavedPovList = DtoVisitorEntryPovDetail.map((f) => f.AreaToVisit);
    // handlePoVSelect("AreaToVisit", {}, SavedPovList, 1);
    // fetchBlobFromUrl(DtoVisitorEntryHeader.VisitorImageUrl)
    //   .then((blob) => {
    //     const file = new File([blob], DtoVisitorEntryHeader.VisitorImageName, {
    //       type: "image/*",
    //       lastModified: 1695716506050,
    //     });
    //     setPhoto(file);
    //     setImageUrl(DtoVisitorEntryHeader.VisitorImageUrl);
    //   })
    //   .catch((error) => {
    //     toast.current?.show({
    //       severity: "error",
    //       detail: "Error",
    //       summary: JSON.stringify(error),
    //     });
    //   });
  };

  const handleSelectedPop = () => {
    setVisible(true);
    setCreateVisEnt(true);
    setIsCurrentCreate(true);
  };

  const CreatePageOnLoad = (VisitorEntryId: number) => {
    if (checked) {
      Fetch();
      fetchAllData(VisitorEntryId);
    } else {
      fetchAllData(VisitorEntryId);
    }
  };

  const fetchAllData = (VisitorEntryId) => {
    const data = {
      VisitorEntryId: VisitorEntryId,
      VisitorTypeId: tabConfig.filter((t) => t.active == true)[0]?.type,
      CompanyId: +localStorage["CompanyId"],
      PlantId: +localStorage["PlantId"],
      RoleId: +localStorage["DefaultRoleId"],
    };
    var result = dispatch(createInit(data));
    result
      .then((res) => {
        if (res.payload.tranStatus.result == true) {
          setEmployeeList(res.payload.EmployeeList);
          setTempEmployeeList(res.payload.EmployeeList);

          setVisitorNameList(res.payload.VisitorNameList);
          setTempVisitorNameList(res.payload.VisitorNameList);
        }
      })
      .catch((error) => {});
  };

  const Fetch = () => {
    let obj = {
      PlantId: +localStorage["PlantId"],
      CompanyId: +localStorage["CompanyId"],
      UserId: +localStorage["UserId"],
      RoleId: +localStorage["DefaultRoleId"],
    };
    var result = dispatch(fetch(obj));
    result
      .then((res) => {
        if (res.payload.tranStatus.result == true) {
          setVisitorEntryBooked(res.payload.VisitorEntryList);
          setVisitorTempEntryBooked(res.payload.VisitorEntryList);
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

  const customHeader = (
    <React.Fragment>
      <h2 style={{ marginBottom: 0 }}>Sidebar</h2>
    </React.Fragment>
  );

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchId == "visit_search") {
        const filteredResults = TempVisitorNameList.filter(
          (item) =>
            item.FirstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.VisitorCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.MobileNo.includes(searchTerm)
        );
        setVisitorNameList(filteredResults);
        if (searchTerm == "") setVisitorNameList(TempVisitorNameList);
      }
      if (searchId == "host_search") {
        const filteredResults = TempEmployeeList.filter((item) =>
          item.UserName.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setEmployeeList(filteredResults);
        if (searchTerm == "") setEmployeeList(TempEmployeeList);
      }
      if (searchId == "vehicle_search") {
        const filteredResults = TempVehicleList.filter((item) =>
          item.VehicleNo.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setVehicleList(filteredResults);
        if (searchTerm == "") setVehicleList(TempVehicleList);
      }
      if (searchId == "appointment_search") {
        const filteredResults = TempVisitorEntryBooked.filter((item) =>
          item.VisitorEntryCode.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setVisitorEntryBooked(filteredResults);
        if (searchTerm == "") setVisitorEntryBooked(TempVisitorEntryBooked);
      }
      if (searchId == "work_permit_search") {
        const filteredResults = TempWorkPermitList.filter(
          (item) =>
            item.WorkPermitCode.toLowerCase().includes(
              searchTerm.toLowerCase()
            ) ||
            item.ContractorName.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setWorkPermitList(filteredResults);
        if (searchTerm == "") setWorkPermitList(TempWorkPermitList);
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

  const handleEmployeeSelect = (item) => {
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

  const handleVisitorSelect = (item) => {
    if (item && item?.Status != 2) {
      setSelectedData({
        ...selectedData,
        selectedVisitorId: item.VisitorDetailId,
      });
      setSelectedVisitor(item);
      setVisitorNameList({
        ...VisitorNameList,
      });

      const updatedVistEmp = VisitorNameList.map((element) => ({
        ...element,
        IsActive: element.VisitorDetailId === item.VisitorDetailId,
        // IsActive: element.VisitorId === item.VisitorId,
      }));

      setVisitorNameList(updatedVistEmp);
    } else if (item && item?.Status == 2) {
      toast.current?.show({
        severity: "warn",
        summary: "Warning Message",
        detail: "Visitor is blacklisted.",
      });
      return;
    }
  };

  const handleDriverSelect = (e, item) => {
    if (item) {
      OnChangeDriver("DriverId", {}, item.DriverId);
    }
  };

  const handleWorkPermitSelect = (e, item) => {
    if (item) {
      setSelectedWP({
        ...selectedWP,
        ...item,
      });
    }
  };
  const handleVehicleSelect = (e, item) => {
    if (item) {
      setIsCurrentCreate(false);
      setSelectedVeh({
        ...selectedVeh,
        vehicleNo: item.VehicleNo,
        entryType: item.EntryType,
        exitTime: item.ExitTime,
        entryTime: item.EntryTime,
        visitorEntryId: item.VisitorEntryId,
      });
      const updatedVisitVeh = VehicleList.map((element) => ({
        ...element,
        IsActive: element.VisitorEntryId === item.VisitorEntryId,
      }));
      visitorEntryFormik.setFieldValue("VehicleNo", item.VehicleNo);
      visitorEntryFormik.setFieldValue("VisitorEntryId", item.VisitorEntryId);
      setVehicleList(updatedVisitVeh);
      OnChangeExistVehNo(item);
      // OnChangeVehicle("VehicleName", {}, item.VehicleName, item.VehicleNo);
      handleSelect("DriverId", {}, item.DriverId);
    }
  };
  const handleBookedVisitor = (e, item, detail) => {
    if (item) {
      let filtEmp = EmployeeList.filter(
        (emp) => emp.UserId == item.VisitedEmployeeId
      );
      let filtVis = updatedVisitorNameList.filter(
        // (vis) => vis.VisitorCode == item.VisitorEntryCode
        (emp) => emp.VisitorDetailId == item.VisitorId
      );

      // handleVisitorSelect(item);
      handleVisitorSelect(filtVis[0]);
      // handleVisitorSelect(VisitorNameList[0]);
      handleEmployeeSelect(filtEmp[0]);

      setSelectedData({
        ...selectedData,
        selectedVisitorId: item.VisitorDetailId,
      });
      setBookedVisitor(item);
      let dataObj = {
        data: item,
      };
      let DetailObj = {
        VisitorEntryId: item?.VisitorEntryId,
        VisitorEntryDetailId: item?.VisitorEntryDetailId
          ? item?.VisitorEntryDetailId
          : item?.VisitorEntryDetails[0]?.VisitorEntryDetailId,
        CompanyId: +localStorage["CompanyId"],
        PlantId: +localStorage["PlantId"],
        RoleId: +localStorage["DefaultRoleId"],
      };
      const getDetail = dispatch(OnChangeEntryDetail(DetailObj));
      getDetail.then((response) => {
        handleSendPass(item, response, detail);
      });
    }
  };

  const handleSendPass = (item, response, detail) => {
    let detailIds;
    let entryIds;
    let entryCodes;
    let entryTypeIds;

    if (!detail) {
      // detailIds = item?.VisitorEntryDetailId;
      detailIds =
        response.payload.OnChangeEntryDetailList[0].VisitorEntryDetailId;
      entryIds = item?.VisitorEntryId;
      entryCodes = item?.VisitorEntryCode;
      entryTypeIds = item?.VisitorTypeId;
    } else {
      detailIds = item?.VisitorEntryDetailId;
      entryIds = item?.VisitorEntryId;
      entryCodes = item?.VisitorEntryCode;
      entryTypeIds = item?.VisitorTypeId;
    }
    let obj = {
      VisitorEntryId: entryIds,
      VisitorEntryCode: entryCodes,
      DetailId: detailIds,
      // DetailId: response.OnChangeEntryDetailList[0].VisitorEntryDetailId,
      CompanyId: +localStorage["CompanyId"],
      PlantId: +localStorage["PlantId"],
      VisitorTypeId: item?.VisitorTypeId,
    };
    const workerList = dispatch(ShowPass(obj));
    workerList
      .then((res) => {
        // setContWorker(res.payload.VisitorEntryDetail);
        // setContHead(res.payload.VisitorEntryHeader);
        if (res.payload.tranStatus.result == true) {
          let VisitorEntry = {
            VisitorEntryCode: res.payload.VisitorEntryHeader.VisitorEntryCode,
            VisitorTypeId: res.payload.VisitorEntryHeader.VisitorTypeId,
          };
          let visDtl = res.payload.VisitorEntryDetails;

          setContWorker(visDtl);
          setContHead(res.payload.VisitorEntryHeader);
          setupdatedVisitorNameList(res.payload.UpdatedVisitorNameList);
          setvisitorEntryDetailListNew(res.payload.VisitorEntryDetails);
          setupdatedBelongingList(res.payload.VisitorEntryBelongingDetail);
          handlePassPreview(
            res.payload.VisitorEntryHeader,
            res.payload.UpdatedVisitorNameList,
            res.payload.VisitorEntryBelongingDetail
          );
        } else {
          toast.current?.show({
            severity: "error",
            detail: "Error",
            summary: res.payload.tranStatus.lstErrorItem[0].Message,
          });
        }
      })
      .catch((err) => {});
  };

  const handlePassPreview = (
    item,
    UpdatedVisitorNameLists,
    VisitorEntryBelongingDetails
  ) => {
    let filtEmp = EmployeeList.filter(
      (emp) => emp.UserId == item.VisitedEmployeeId
    );
    let filtVis;
    if (UpdatedVisitorNameLists && UpdatedVisitorNameLists.length > 0) {
      filtVis = UpdatedVisitorNameLists.filter(
        (emp) => emp.VisitorDetailId == item.VisitorId
      );
    } else {
      filtVis = updatedVisitorNameList.filter(
        (emp) => emp.VisitorDetailId == item.VisitorId
      );
    }

    handleVisitorSelect(filtVis[0]);
    handleEmployeeSelect(filtEmp[0]);

    setSelectedData({
      ...selectedData,
      selectedVisitorId: item.VisitorId,
    });

    setBookedVisitor(item);
    let dataObj = {
      data: {
        ...item,
        belongings: VisitorEntryBelongingDetails
          ? VisitorEntryBelongingDetails
          : updatedBelongingList,
      },
    };
    setPassData(item);
    setDialogVisible(true);
  };

  const handleTabAction = (e) => {
    if (e && e.hasOwnProperty("type")) {
      e.stopPropagation();
    }

    if (e.target.id != "BACK") {
      const clickedType = e.target.id;

      setSelectedData({
        ...selectedData,
        selectedType: +e.target.id,
      });

      const updatedTabConfig = tabConfig.map((item) => ({
        ...item,
        active: item.type === +clickedType,
      }));

      setSelectedVisitor({});
      setSelectedHost({});

      onChangeVisitorType("VisitorTypeId", {}, +e.target.id);
      onChangeVisitorTypeVM("VisitorTypeId", {}, +e.target.id);

      setVisType(+e.target.id);
      if (+e.target.id == 65) {
        setSelectedInv(true);
      }

      setTabConfig(updatedTabConfig);
      handleClosePop();
    } else if ((e.target.id = "BACK")) {
      setShowEntryDetail(false);
      setBookedVisitor({});
      setVisitorEntryBooked(TempVisitorEntryBooked);
    }
  };

  const getScanCode = (val) => {
    var scannedval;
    if (val) {
      const encryptData = dispatch(EncryptData(val));

      encryptData
        .then((res) => {
          if (
            res.payload.hasOwnProperty("tranStatus") &&
            res.payload.tranStatus.result
          ) {
            setEncryptedValue("E^^_"+ res.payload.VisitorEntryHeader);
            setVehPopVisible(true);
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
  };

  const handleCloseVehPop = () => {
    setVehPopVisible(false);
    setSelectedVehData({});
  };
  const handleClosePop = () => {
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

    setSelectedInv(false);
    setVisible(false);
    resetAllForm();
    setSelectedEntryData({
      ...selectedEntryData,
      VehicleTypeId: visitorEntryFormik.values.VehicleTypeId,
      VehicleNo: "",
      DriverId: null,
      PurposeOfVisit: null,
      EntryType: 102,
      NumberOfPassengers: "",
      DriverName: null,
      StartingKm: "",
      EndingKm: "",
      IsEwayBillNo: false,
      IsEinvBillNo: false,
      VisitorRemarks: "",
      EntryTime: new Date(),
      ExitTime: null,
    });
    setRefTableDisable(false);
    setIsdisableSave(false);
    setIsDisableClear(false);
    setSwitchDisable(false);
    setVehicleNoList([]);
    setSelectedVeh({});
    setIsCurrentCreate(true);
    setCheckVehAction(true);
    setUpdateCheckVeh(false);
    visitorEntryFormik.resetForm();
  };
  const handleVisClosePop = () => {
    setVisitorShow(false);
    resetAllForm();
    resetAllFormVM();
  };
  const handleWPClosePop = () => {
    setWorkPermitShow(false);
    setSelectedWP({});
  };
  const handleVehClosePop = () => {
    setVehicleShow(false);
  };
  const handleEmpClosePop = () => {
    setEmployeeShow(false);
  };

  const saveVisitorDetails = () => {
    if (!isVisMaster == true) {
      const validTrue = checkVisEntryValidation(visitorEntryFormik.values);
      if (validTrue == true) {
        setIsVisMaster(true);
      }
    } else {
      localStorage.setItem(
        "visMaster",
        JSON.stringify(visitorEntryFormik.values)
      );

      setIsVisMaster(false);
    }
  };

  const checkVisMasterValidation = (values) => {
    const emailRegExp = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    if (values.TitleId == "" || values.TitleId == null)
      return toastValidation("Please Select Title.");
    if (values.FirstName == "" || values.FirstName == null)
      return toastValidation(
        `Please Enter ${
          values.VisitorTypeId == 36 ? "Worker" : "Visitor"
        } Name.`
      );

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

    return true;
  };

  const checkVisEntryValidation = (values) => {
    if (values.PlantId == "" || values.PlantId == null)
      return toastValidation("Please Select Plant");
    if (!values.VisitedEmployeeId)
      return toastValidation("Please Select Person To Visit");
    if (!values.ValidFrom && values.VisitorTypeId != 36)
      return toastValidation("Please Select Appointment Date");
    if (!values.ValidTo && values.VisitorTypeId == 36)
      return toastValidation("Please Select Valid To");
    if (!photo && values.VisitorTypeId != 66) {
      setIsdisableSave(false);
      toast.current?.show({
        severity: "warn",
        detail: "Please Capture Image",
        summary: "Warning Message",
      });
      return;
    }
    if (values.PurposeOfVisit == null || values.PurposeOfVisit == "") {
      return toastValidation("Please Select Purpose Of Visit");
    }
    return true;
  };

  const saveVmaster = () => {
    const checkVisValidations = checkVisMasterValidation(visitorFormik.values);
    if (checkVisValidations == true) {
      visitorFormik.handleSubmit();
    }
  };

  const saveVisitor = () => {
    const validTrue = checkVisEntryValidation(visitorEntryFormik.values);
    if (validTrue == true) {
      if (isCurrentCreate) {
        const checkVisValidations = checkVisMasterValidation(
          visitorFormik.values
        );
        if (checkVisValidations == true) {
          visitorFormik.handleSubmit();
        }
      } else {
        visitorEntryFormik.handleSubmit();
      }
    }
  };

  useEffect(() => {
    if (isCurrentCreate) {
      if (visitorEntryDetailList && visitorEntryDetailList.length > 0) {
        visitorEntryFormik.handleSubmit();
        setIsdisableSave(false);
        setVisible(false);
      }
    }
  }, [visitorEntryDetailList]);

  const handleClosePassPrev = () => {
    resetAllForm();
    setDialogVisible(false);
    setVisible(false);
  };

  // VISITOR MASTER
  const visitorRef: any = useRef(null);
  const visitorDetailRef: any = useRef(null);
  const [imageUrlVM, setImageUrlVM] = useState(IMAGES.NO_IMG);
  const [documentUrlVM, setDocumentUrlVM] = useState("");
  const [documentUrlVisitor, setDocumentUrlVisitor] = useState("");
  const [visitorDetailList, setVisitorDetailList] = useState([]);
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
  // useEffect(() => {
  //   onChangeVisitorType("VisitorTypeId", {}, visType);
  // }, [visType]);

  const {
    isCreateVM,
    isViewVM,
    createEditDataVM,
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
    VisitorSearchListVM,
    WorkSeverityListVM,
  } = useSelector((state: any) => state.visitor);

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
    if (!createVisEnt && VisitorHeaderVM && VisitorDetailVM) {
      if (!createVisEnt) {
        if (VisitorHeaderVM && VisitorHeaderVM.VisitorTypeId == 35) {
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
        obj.VisitorDetailCode = x.VisitorDetailCode;
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
        obj.DocumentUrl = x.DocumentName;
        obj.Status = x.Status;
        obj.ExpirryDate = x.ExpirryDate;
        obj.WorkSeverity = x.WorkSeverity;
        obj.VisitorName =
          // TitleList.find((f) => f.MetaSubId == obj.TitleId).MetaSubDescription +
          // ". " +
          x.FirstName + " " + x.LastName;
        obj.DepartMentName = x.DepartmentId
          ? DepartmentList.find((f) => f.DepartmentId == x.DepartmentId)
              .DepartmentName
          : null;
        obj.IdCardTypeName = IdCardListVM.find(
          (d) => d.MetaSubId == x.IdCardType
        )?.MetaSubDescription;
        obj.StatusName = StatusListVM.find(
          (d) => d.MetaSubId == x.Status
        ).MetaSubDescription;
        obj.WorkSeverityName = WorkSeverityListVM.find(
          (d) => d.MetaSubId == x.WorkSeverity
        )?.MetaSubDescription;
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
      }

      setVisitorDetailList(List);
      setDocumentUrlVisitor(VisitorHeaderVM.VisitorDocumentUrl);
    } else {
      loadVisCreateInit(0);
    }
  }, [createVisEnt, VisitorHeaderVM, VisitorDetailVM]);

  const loadVisCreateInit = (visId) => {
    const data = {
      VisitorId: visId,
      PlantId: +localStorage["PlantId"],
      CompanyId: +localStorage["CompanyId"],
      RoleId: +localStorage["DefaultRoleId"],
    };
    var result = dispatch(createInitVM(data));
    result
      .then((res) => {
        if (res.payload.tranStatus.result) {
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
        : localStorage["CompanyId"],
    PlantId:
      VisitorHeaderVM != null
        ? VisitorHeaderVM.PlantId
        : localStorage["PlantId"],
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
    IdCardType: VisitorHeaderVM != null ? VisitorHeaderVM.IdCardType : 17,
    IdCardNo: VisitorHeaderVM != null ? VisitorHeaderVM.IdCardNo : "",
    DocumentName: VisitorHeaderVM != null ? VisitorHeaderVM.DocumentName : "",
    DocumentUrl: VisitorHeaderVM != null ? VisitorHeaderVM.DocumentUrl : "",
    VisitorDocumentName:
      VisitorHeaderVM != null ? VisitorHeaderVM.VisitorDocumentName : "",
    VisitorDocumentUrl:
      VisitorHeaderVM != null ? VisitorHeaderVM.VisitorDocumentUrl : "",
    Status: VisitorHeaderVM != null ? VisitorHeaderVM.Status : 1,
    CreatedBy:
      VisitorHeaderVM != null
        ? VisitorHeaderVM.CreatedBy
        : +localStorage["UserId"],
    CreatedOn:
      VisitorHeaderVM != null
        ? new Date(VisitorHeaderVM.CreatedOn)
        : new Date(),
    ModifiedBy: VisitorHeaderVM != null ? +localStorage["UserId"] : null,
    ModifiedOn: VisitorHeaderVM != null ? new Date() : null,
  };

  const visitorDetailForm = {
    VisitorDetailId: 0,
    VisitorDetailCode: "",
    VisitorId: 0,
    TitleId: 37,
    FirstName: "",
    LastName: "",
    DepartmentId: null,
    Dob: new Date(),
    MailId: "",
    MobileNo: "",
    VisitorCompany: "",
    TagNo: "",
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

  const visitorFormik: any = useFormik({
    initialValues: visitorForm,
    validationSchema: VisitorValidationSchema,
    onSubmit: (values: any, { resetForm }) => {
      values.VisitorTypeId = tabConfig.filter((t) => t.active == true)[0]?.type;

      setIsdisableSave(true);
      const formData: any = new FormData();
      let VDList: any[] = [];
      values.Dob = datepipes(new Date(values.Dob));
      values.CreatedOn = datepipes(new Date(values.CreatedOn));
      if (!createVisEnt) {
        values.ModifiedOn = datepipes(new Date(values.ModifiedOn));
      }

      if (
        (values.VisitorTypeId == 35 || values.VisitorTypeId == 36) &&
        isCurrentCreate &&
        createVisEnt
      ) {
        // Individual
        let object: any = {};
        object.VisitorDetailId = 0;
        object.VisitorDetailCode = "";
        object.VisitorId = 0;
        object.TitleId = values.TitleId;
        object.FirstName = values.FirstName;
        object.LastName = values.LastName;
        object.DepartmentId = values.departmentName;
        object.Dob = values.Dob;
        object.MailId = values.MailId;
        object.MobileNo = values.MobileNo;
        object.TagNo = values.TagNo;
        object.VisitorCompany = values.VisitorCompany;
        object.DigitalSignName = values.DigitalSignName || "";
        object.DigitalSignUrl = values.DigitalSignUrl || "";
        object.SignedVersion = values.SignedVersion || 0;
        object.IsTermsAgreed = values.IsTermsAgreed || 0;
        object.IdCardType = values.IdCardType;
        object.IdCardNo = values.IdCardNo;
        object.DocumentName = values.DocumentName;
        object.DocumentUrl = values.DocumentName;
        object.Status = values.Status;
        object.ExpirryDate = new Date();
        object.WorkSeverity = 96;
        VDList.push(object);
      } else if (
        (values.VisitorTypeId == 35 || values.VisitorTypeId == 36) &&
        (!isCurrentCreate || !createVisEnt)
      ) {
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
          object.SignedVersion = values.SignedVersion || 0;
          object.IsTermsAgreed = values.IsTermsAgreed || 0;
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
      let obj = {
        Visitor: values,
        VisitorDetail: VDList,
      };
      let input: string = JSON.stringify(obj);
      formData.append("input", input);
      if (!createVisEnt) {
        var updateres = dispatch(updateVM(formData));
        updateres
          .then((res) => {
            if (res.payload.tranStatus.result == true) {
              setIsdisableSave(false);
              setVisitorShow(false);
              fetchAllData(0);

              toast.current?.show({
                severity: "success",
                summary: "Success Message",
                detail: res.payload.tranStatus.lstErrorItem[0].Message,
              });
              setCreateVisEnt(true);
              resetAllFormVM();
            } else {
              setIsdisableSave(false);
              toast.current?.show({
                severity: "error",
                summary: "Error Message",
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
              setIsdisableSave(false);
              setVisitorShow(false);
              handleVisitorSelected(
                res.payload?.VisitorHeader?.VisitorDetails[0]?.VisitorDetailId,
                res.payload?.VisitorList
              );
            } else {
              setIsdisableSave(false);
              toast.current?.show({
                severity: "warn",
                summary: "Warning",
                detail: res.payload.tranStatus.lstErrorItem[0].Message,
                life: 6000,
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
    },
  });
  const visitorDFormik: any = useFormik({
    initialValues: visitorDetailForm,
    validationSchema: VisitorDetailValidationSchema,
    onSubmit: (values, { resetForm }) => {
      let obj: any = {};
      obj.VisitorDetailId = values.VisitorDetailId;
      obj.VisitorDetailCode = values.VisitorDetailCode;
      obj.VisitorId = values.VisitorId;
      obj.TitleId = values.TitleId;
      obj.FirstName = values.FirstName.trim();
      obj.LastName = values.LastName.trim();
      obj.DepartmentId = values.DepartmentId;
      obj.Dob = values.Dob;
      obj.MailId = values.MailId;
      obj.MobileNo = values.MobileNo;
      obj.IdCardType = values.IdCardType;
      obj.IdCardNo = values.IdCardNo;
      obj.DocumentName = values.DocumentName || "";
      obj.DocumentUrl = values.DocumentName || "";
      obj.Status = values.Status;
      obj.ExpirryDate = values.ExpirryDate;
      obj.WorkSeverity = values.WorkSeverity;
      obj.VisitorName =
        TitleList.find((f) => f.MetaSubId == values.TitleId)
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
      obj.StatusName = StatusListVM.find(
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
          setDocumentfiles([...documentfiles, documentUp]);
        } else {
          setDocumentfiles([documentUp]);
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
    // setIsBelongingDetailsShow(false);
    // Onchangecountry("CountryId", {}, CountryListVM[0].CountryId);
  };
  const onRowSelect = (rowData) => {
    setDocument(null);
    visitorDFormik.setFieldValue("", rowData);
    visitorDFormik.setFieldValue(
      "VisitorDetailId",
      rowData.data.VisitorDetailId
    );
    visitorDFormik.setFieldValue(
      "VisitorDetailCode",
      rowData.data.VisitorDetailCode
    );
    visitorDFormik.setFieldValue("VisitorId", rowData.data.VisitorId);
    visitorDFormik.setFieldValue("TitleId", rowData.data.TitleId);
    visitorDFormik.setFieldValue("FirstName", rowData.data.FirstName);
    visitorDFormik.setFieldValue("LastName", rowData.data.LastName);
    visitorDFormik.setFieldValue("DepartmentId", rowData.data.DepartmentId);
    visitorDFormik.setFieldValue("Dob", rowData.data.Dob);
    visitorDFormik.setFieldValue("MailId", rowData.data.MailId);
    visitorDFormik.setFieldValue("MobileNo", rowData.data.MobileNo);
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
  const handleDChange = (event) => {
    visitorDFormik.setFieldValue(event.target.name, event.value);
  };
  const handleDSelect = (name, other, value) => {
    visitorDFormik.setFieldValue(name, value);
  };
  const handleOnChange = (name, formName, value) => {
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
    setImageUrl(IMAGES.NO_IMG);
    setPhoto(null);
    profUploadRef.current?.clear();
    visitorFormik.setFieldValue("DocumentName", "");
    visitorFormik.setFieldValue("DocumentUrl", "");
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
    if (imageUrl != "") {
      handleCloseImage();
    }
    if (
      e.files[0].type != "image/jpeg" &&
      e.files[0].type != "image/png" &&
      e.files[0].type != "image/jpg"
    ) {
      toast.current?.show({
        severity: "warn",
        summary: "Error Message",
        detail: "Please Upload only Files with Format (Image/ JPEG, JPG, PNG)",
      });
      return;
    }
    if (e.files.length > 0) {
      setPhoto(e.files[0]);
      visitorFormik.setFieldValue("DocumentName", e.files[0].name);
      visitorFormik.setFieldValue("DocumentUrl", e.files[0].name);
      const uploadedImageUrl = URL.createObjectURL(e.files[0]);
      setImageUrl(uploadedImageUrl);
    } else {
      toast.current?.show({
        severity: "warn",
        summary: "Error Message",
        detail: "Please Upload only Files with Format (Image/ JPEG, JPG, PNG)",
      });
      return;
    }
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
  // VISITOR MASTER

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
    //   (item) => item.VisitorDetails.filter(i=>i.VisitorDetailId === visitorId  )
    // );
    // let selectedVis = updatedList.filter(
    //   (item) => item.VisitorDetails.VisitorDetailId === visitorId
    // );

    // setFindVis(selectedVis);
    if (selectedVisitorDetails && selectedVisitorDetails.length > 0) {
      onChangeVisitor(
        "VisitorId",
        {},
        selectedVisitorDetails[0].VisitorDetailId,
        updatedList
      );
    }
  };

  // Vehicle

  useEffect(() => {
    checkVehControl();
  }, [selectedEntryData]);

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
        .text-2xl { font-size: 1.5rem !important; }
        .justify-content-center { justify-content: center !important; }
        .align-items-center { align-items: center !important; }
  
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

  const changeStage = (type) => {
    setPageType(type);
  };

  const onCheckboxChange = (e, clr) => {
    visitorEntryFormik.setFieldValue(e?.target?.name, e?.checked);
    if (clr) {
      setVisitorEntryRefDetailList([
        {
          VisitorEntryRefDetailId: 0,
          VisitorEntryId: 0,
          RefTypeId: null,
          RefValue: "",
          adisable: false,
          cdisable: true,
          show: true,
          ddisable: false,
          idisable: false,
        },
      ]);
    } else {
      if (e?.checked) {
        let tempRefLst = tempRefTypeList.filter(
          (item) => item.MetaSubId == e?.target?.id
        );
        setRefTypeList((prevList) => [...prevList, ...tempRefLst]);
        const updatedVisitorDetails = VisitorEntryRefDetailList.map((item) => {
          if (!item.RefTypeId) {
            return {
              ...item,
              RefTypeId: e?.target?.id,
            };
          }
          return item;
        });
        setVisitorEntryRefDetailList(updatedVisitorDetails);
      } else {
        setRefTypeList((prevList) =>
          prevList.filter((item) => item.MetaSubId !== e?.target?.id)
        );
        const updatedVisitorDetails = VisitorEntryRefDetailList.filter(
          (item) => item.RefTypeId !== e?.target?.id
        );

        // setVisitorEntryRefDetailList(updatedVisitorDetails);
        if (updatedVisitorDetails.length > 0) {
          setVisitorEntryRefDetailList(updatedVisitorDetails);
        } else {
          const clearedData = VisitorEntryRefDetailList.map((item) =>
            item.RefTypeId === e?.target?.id
              ? { ...item, RefValue: "", RefTypeId: null }
              : item
          );
          setVisitorEntryRefDetailList(clearedData);
        }
      }
    }
  };

  const OnChangeExistVehNo = async (value) => {
    if (value && value.VisitorEntryId > 0) {
      const payload = {
        VisitorEntryId: value?.VisitorEntryId ?? 0,
      };

      var result = await dispatch(OnChangeExistVehicleNo(payload));
      if (result) {
        if (result?.payload?.tranStatus?.result) {
          if (result && result?.payload?.tranStatus?.lstErrorItem.length > 0) {
            toast?.current?.show({
              severity: "success",
              summary: "Data Found Successfully",
              detail: result?.payload?.tranStatus?.lstErrorItem[0].Message,
            });
          }

          const veHdr = result?.payload?.VisitorEntryHeader;
          const veDetail = result?.payload?.VisitorEntryDetails;
          const veRefLst = result?.payload?.RefList;
          updateVehData(veHdr, veDetail, veRefLst);
          disableVehForm();
          if (
            veHdr?.VisitorEntryId > 0 &&
            veHdr?.EntryTime != null &&
            veHdr?.ExitTime != null
          ) {
            disableVehDataForm();
          }
        }
      }
    }
  };

  const handleVehicleNoChange = async (e, other, value) => {
    let vehicleNo = e?.value?.VehicleNo || e?.value;
    if (!vehicleNo) return;

    vehicleNo = vehicleNo.toUpperCase();
    visitorEntryFormik.setFieldValue("VehicleNo", vehicleNo);

    const payload = {
      VehicleNo: vehicleNo,
      VisitorEntryId: 0,
    };

    try {
      let result;
      result = await dispatch(OnChangeVehicleNo(payload));
      const veHdr = result?.payload?.VisitorEntryHeader;
      const veDetail = result?.payload?.VisitorEntryDetails;
      const RefLst = result?.payload?.RefList;
      if (result && result?.payload?.tranStatus?.lstErrorItem.length > 0) {
        toast?.current?.show({
          severity: "success",
          summary: "Data Found Successfully",
          detail: result?.payload?.tranStatus?.lstErrorItem[0].Message,
        });
      }
      updateVehData(veHdr, veDetail, RefLst);
      disableVehForm();
      if (veHdr?.VisitorEntryId > 0) {
        setCheckVehAction(false);
      } else if (veHdr?.VisitorEntryId == null || veHdr?.VisitorEntryId == 0) {
        setCheckVehAction(true);
      }
    } catch (err: any) {
      toast?.current?.show({
        severity: "error",
        summary: "Error",
        detail: err?.message || "Something went wrong.",
      });
    }
  };

  const disableVehForm = () => {
    setChangeField((prevState) => ({
      ...prevState,
      VehicleNo: {
        disable: true,
        show: true,
      },
    }));
  };

  const updateVehData = (veHdr, veDtl, veRefList) => {
    if (veHdr && Object.keys(veHdr).length && Object.keys(veHdr).length > 0) {
      setVehDataForm(veHdr, veDtl, veRefList);
    }
  };

  // const setVehData = (res, val) => {
  //   if (
  //     res.payload.VisitorEntryHeader &&
  //     Object.keys(res.payload.VisitorEntryHeader).length &&
  //     Object.keys(res.payload.VisitorEntryHeader).length > 0
  //   ) {
  //     if (res?.payload.VisitorEntryHeader?.EntryType == 103) {
  //       setSelectedEntryData({
  //         ...res.payload.VisitorEntryHeader,
  //         EntryType: res?.payload.VisitorEntryHeader?.EntryType,
  //       });
  //       visitorEntryFormik.setFieldValue(
  //         "VehicleTypeId",
  //         res?.payload.VisitorEntryHeader?.VehicleTypeId
  //       );
  //       setSelectedVehType(res?.payload.VisitorEntryHeader?.VehicleTypeId);

  //       setIsCurrentCreate(false);
  //       setVehDataForm(res);
  //       setCheckVehAction(false);
  //     } else if (res?.payload.VisitorEntryHeader?.EntryType == 102) {
  //       setSelectedEntryData({
  //         ...res.payload.VisitorEntryHeader,
  //         EntryType: res?.payload.VisitorEntryHeader?.EntryType,
  //       });
  //       visitorEntryFormik.setFieldValue(
  //         "VehicleTypeId",
  //         res?.payload.VisitorEntryHeader?.VehicleTypeId
  //       );
  //       setSelectedVehType(res?.payload.VisitorEntryHeader?.VehicleTypeId);
  //       setIsCurrentCreate(false);
  //       setVehDataForm(res);
  //       setCheckVehAction(false);
  //     } else {
  //       setSelectedEntryData({
  //         ...res.payload.VisitorEntryHeader,
  //         EntryType: res?.payload.VisitorEntryHeader?.EntryType,
  //       });
  //       visitorEntryFormik.setFieldValue(
  //         "VehicleTypeId",
  //         res?.payload.VisitorEntryHeader?.VehicleTypeId
  //       );
  //       setSelectedVehType(res?.payload.VisitorEntryHeader?.VehicleTypeId);
  //       setIsCurrentCreate(true);
  //       setVehDataForm(res);
  //       setCheckVehAction(true);
  //     }

  //     if (
  //       res?.payload.VisitorEntryHeader?.ExitTime != null &&
  //       res?.payload.VisitorEntryHeader?.EntryTime != null
  //     ) {
  //       disableVehDataForm();
  //     }
  //   } else {
  //     resetOnlyForm();
  //     visitorEntryFormik.setFieldValue(name, val);
  //     visitorEntryFormik.setFieldValue("VehicleTypeId", val?.VehicleTypeId);
  //     setSelectedVehType(val?.VehicleTypeId);
  //     setCheckVehAction(true);
  //   }
  // };

  useEffect(() => {
    if (
      !isCurrentCreate &&
      tabConfig.filter((t) => t.active == true)[0]?.type == 66 &&
      visitorEntryFormik?.values?.EntryType == 103
    ) {
      disableVehDataForm();
    }
  }, [isCurrentCreate]);

  const setVehDataForm = (veHdr, veDtl, veRefList) => {
    visitorEntryFormik.setFieldValue("VehicleTypeId", veHdr?.VehicleTypeId);
    setSelectedVehType(veHdr?.VehicleTypeId);
    visitorEntryFormik.setFieldValue(
      "VisitorEntryId",
      veHdr?.VisitorEntryId ?? 0
    );
    visitorEntryFormik.setFieldValue("VisitorTypeId", 66);
    visitorEntryFormik.setFieldValue(
      "VisitorEntryCode",
      veHdr?.VisitorEntryCode
    );
    visitorEntryFormik.setFieldValue("VehicleModel", veHdr?.VehicleModel);
    visitorEntryFormik.setFieldValue(
      "VisitorEntryDate",
      veHdr?.VisitorEntryDate != null
        ? new Date(veHdr?.VisitorEntryDate)
        : new Date()
    );
    visitorEntryFormik.setFieldValue("VisitorRemarks", veHdr?.VisitorRemarks);
    const entryType = veHdr?.EntryType;
    let entryCreate = veHdr?.VisitorEntryId == 0 ? true : false;
    let changeEntryTypee =
      veHdr?.VisitorEntryId > 0 &&
      ((veHdr?.EntryTime != null && veHdr?.ExitTime == null) ||
        (veHdr?.ExitTime != null && veHdr?.EntryTime == null));
    if (
      veHdr?.VisitorEntryId != 0 &&
      veHdr?.VisitorEntryId != null &&
      veHdr?.EntryTime != null &&
      veHdr?.ExitTime != null
    ) {
      visitorEntryFormik.setFieldValue("EntryTime", new Date(veHdr.EntryTime));
    } else if (entryType === 102) {
      if (veHdr?.EntryTime != null) {
        visitorEntryFormik.setFieldValue(
          "EntryTime",
          new Date(veHdr.EntryTime)
        );
      } else {
        visitorEntryFormik.setFieldValue("EntryTime", new Date());
      }
      if (entryCreate) {
        visitorEntryFormik.setFieldValue("ExitTime", null);
      } else if (changeEntryTypee) {
        visitorEntryFormik.setFieldValue(
          "EntryType",
          veHdr?.EntryType == 102 ? 103 : 102
        );
        visitorEntryFormik.setFieldValue("ExitTime", new Date());
        setCheckVehAction(false);
      }
    }
    if (
      veHdr?.VisitorEntryId != 0 &&
      veHdr?.VisitorEntryId != null &&
      veHdr?.EntryTime != null &&
      veHdr?.ExitTime != null
    ) {
      visitorEntryFormik.setFieldValue("ExitTime", new Date(veHdr.ExitTime));
    } else if (entryType === 103) {
      if (veHdr?.ExitTime != null) {
        visitorEntryFormik.setFieldValue("ExitTime", new Date(veHdr.ExitTime));
      } else {
        visitorEntryFormik.setFieldValue("ExitTime", new Date());
      }
      if (entryCreate) {
        visitorEntryFormik.setFieldValue("EntryTime", null);
      } else if (changeEntryTypee) {
        visitorEntryFormik.setFieldValue(
          "EntryType",
          veHdr?.EntryType == 103 ? 102 : 103
        );
        visitorEntryFormik.setFieldValue("EntryTime", new Date());
        setCheckVehAction(false);
      }
    }
    visitorEntryFormik.setFieldValue("StartingKm", veHdr?.StartingKm ?? 0.0);
    visitorEntryFormik.setFieldValue("EndingKm", veHdr?.EndingKm ?? 0.0);
    visitorEntryFormik.setFieldValue(
      "NumberOfPassengers",
      veHdr?.NumberOfPassengers
    );
    visitorEntryFormik.setFieldValue(
      "IsEwayBillNo",
      veHdr?.IsEwayBillNo == 1 ? true : false
    );
    visitorEntryFormik.setFieldValue(
      "IsEinvBillNo",
      veHdr?.IsEinvBillNo == 1 ? true : false
    );
    visitorEntryFormik.setFieldValue("Status", veHdr?.Status ?? 75);
    if (veHdr?.DriverName != "") {
      visitorEntryFormik.setFieldValue("DriverName", veHdr?.DriverName);
    }

    handleSelect("DriverId", {}, +veHdr?.DriverId);

    handleSelect("PurposeOfVisit", {}, veHdr?.PurposeOfVisit);

    if (veDtl && veDtl.length > 0) {
      const combinedRefList = veDtl.flatMap((element) =>
        veRefList.filter(
          (item) =>
            item.MetaSubId === element.RefTypeId &&
            (veHdr.IsEinvBillNo === 1 ||
              veHdr.IsEinvBillNo === true ||
              veHdr.IsEwayBillNo === 1 ||
              veHdr.IsEwayBillNo === true)
        )
      );
      setRefTypeList(combinedRefList);
    }
    setVehicleHead(veHdr);
    if (veDtl && veDtl.length > 0) {
      const updatedVisitorDetails = veDtl.map((item) => ({
        ...item,
        disable: true,
        show: true,
        adisable: veDtl.length <= 1 ? false : true,
        cdisable: true,
        ddisable:
          veHdr?.IsEinvBillNo == 1
            ? true
            : false || veHdr?.IsEwayBillNo == 1
            ? true
            : false,
        idisable:
          veHdr?.IsEinvBillNo == 1
            ? true
            : false || veHdr?.IsEwayBillNo == 1
            ? true
            : false,
      }));

      setVisitorEntryRefDetailList(updatedVisitorDetails);
    } else {
      setVisitorEntryRefDetailList([
        {
          VisitorEntryRefDetailId: 0,
          VisitorEntryId: 0,
          RefTypeId: null,
          RefValue: "",
          adisable: false,
          cdisable: false,
          show: true,
          ddisable: false,
          idisable: false,
        },
      ]);
    }
    if (veHdr?.IsEwayBillNo == 1) {
      setChangeField((prevState) => ({
        ...prevState,
        IsEwayBillNo: {
          disable: true,
          show: true,
          required: false,
        },
      }));
    } else {
      setChangeField((prevState) => ({
        ...prevState,
        IsEwayBillNo: {
          disable: false,
          show: true,
          required: false,
        },
      }));
    }

    if (veHdr?.IsEinvBillNo == 1) {
      setChangeField((prevState) => ({
        ...prevState,
        IsEinvBillNo: {
          disable: true,
          show: true,
          required: false,
        },
      }));
    } else {
      setChangeField((prevState) => ({
        ...prevState,
        IsEwayBillNo: {
          disable: false,
          show: true,
          required: false,
        },
      }));
    }
  };

  const disableVehDataForm = () => {
    setChangeField((prevState) => ({
      ...prevState,
      VehicleTypeId: {
        disable: true,
        enable: true,
        show: true,
        disablec: true,
      },
      VehicleName: {
        disable: true,
        show: false,
      },
      VehicleNo: {
        disable: true,
        show: true,
      },
      DriverId: {
        disable: true,
        show: false,
      },
      DriverName: {
        disable: true,
        show: true,
      },
      StartingKm: {
        disable: true,
        show: false,
        required: false,
      },
      EndingKm: {
        disable: true,
        show: false,
        required: false,
      },
      IsEinvBillNo: {
        disable: true,
        show: true,
        required: false,
      },
      IsEwayBillNo: {
        disable: true,
        show: true,
        required: false,
      },
      PurposeOfVisit: {
        disable: true,
        show: true,
        required: true,
      },
      NumberOfPassengers: {
        disable: true,
        show: true,
        required: true,
      },
      VisitorRemarks: {
        disable: true,
        show: true,
        required: false,
      },
    }));
    // checkVehControl()
    setRefTableDisable(true);
    setIsdisableSave(true);
    setIsDisableClear(true);
    setSwitchDisable(true);
  };
  const enableVehDataForm = () => {
    checkVehControl();
    setRefTableDisable(false);
    setIsdisableSave(false);
    setIsDisableClear(false);
    setSwitchDisable(false);
  };
  const FilterVehNoCleared = () => {
    // resetAllVehForm();
  };

  const FilterDriver = (e) => {
    visitorEntryFormik.setFieldValue("DriverName", e.query);
    // let visType = visitorEntryFormik.values.visType;
    // if (!visType) {
    //   toast.current?.show({
    //     severity: "warn",
    //     summary: "Warning Message",
    //     detail: "Please Select Visitor Entry Type.",
    //   });
    //   return;
    // }
    if (e.query && e.query != "" && e.query != null) {
      let obj = {
        text: e.query,
        EntryType: visType,
        PlantId: +localStorage["PlantId"],
        CompanyId: +localStorage["CompanyId"],
        RoleId: +localStorage["DefaultRoleId"],
      };
      var result = dispatch(FilterDrive(obj));
      result
        .then((res) => {
          if (res.payload.tranStatus.result) {
            setDriverList(res.payload.DriverList);
          } else {
            toast.current?.show({
              severity: "error",
              summary: "Error Message",
              detail: res.payload.tranStatus.lstErrorItem[0].Message,
            });
          }
        })
        .catch((error) => {
          toast.current?.show({
            severity: "error",
            summary: "Error Message",
            detail: JSON.stringify(error),
          });
        });
    }
  };

  function isEncryptedAesString(input) {
    const base64urlRegex = /^[A-Za-z0-9_-]+$/;
    return input.length <= 24 && base64urlRegex.test(input);
  }
  const FilterVehNoWrapped = (e) => {
    const fullValue = e.query?.trim();
    const prefix = "E^^_";

    const isScan = fullValue.startsWith(prefix);

    if (isScan) {
      const token = fullValue.substring(prefix.length);

      dispatch(DecryptData(token))
        .then((res) => {
          if (
            res?.error?.message === "Rejected" ||
            !res.payload?.tranStatus?.result
          ) {
            toast.current?.show({
              severity: "warn",
              summary: "Warning Message",
              detail: "Invalid Scan Data, Please Scan Again",
            });
            return;
          }

          const q = res.payload?.VisitorEntryHeader;
          if (q) {
            handleVehicleNoChange(
              {
                value: q,
              },
              {},
              q
            );
          }
        })
        .catch((error) => {
          toast.current?.show({
            severity: "error",
            summary: "Error Message",
            detail: JSON.stringify(error),
          });
        });
    } else {
      FilterVehNo(e, "NOSCAN");
    }
  };

  // const FilterVehNoWrapped = (e) => {
  //   if (isScanMode) {
  //     visitorEntryFormik.setFieldValue("VehicleNo", "");
  //     toast.current?.show({
  //       severity: "warn",
  //       summary: "Not Allowed During Scan Mode",
  //       detail: "Kindly Disable Scan Mode to Search Vehicle No.",
  //     });
  //     return;
  //   }

  //   FilterVehNo(e);
  // };

  // useEffect(() => {
  //   if (isScanMode && scanInputRef.current) {
  //     scanInputRef.current.focus();
  //   }
  // }, [isScanMode]);

  const handleScanInput = (e) => {
    console.log(e);

    const scannedValue = e.target.value;

    setTimeout(() => {
      if (isEncryptedAesString(scannedValue)) {
      } else {
        console.warn("Invalid scan:", scannedValue);
      }

      e.target.value = "";
    }, 100);
  };

  const enableScan = (event) => {
    const scanEnabled = !event;
    console.log(event);

    setIsScanMode(scanEnabled);
    setAddBtnClass(scanEnabled);
    resetAllVehForm();
    setChangeField((prevState) => ({
      ...prevState,
      VehicleNo: {
        disable: false,
        show: true,
      },
    }));
    if (event) {
      setVehMAxLen(15);
    } else {
      setVehMAxLen(30);
      // setChangeField((prevState) => ({
      //   ...prevState,
      //   VehicleNo: {
      //     disable: true,
      //     show: true,
      //   },
      // }));
    }
  };

  const FilterVehNo = (e, type) => {
    visitorEntryFormik.setFieldValue("VehicleNo", e.query);

    if (e.query && e.query != "" && e.query != null) {
      let obj = {
        text: e.query,
        EntryType: visType,
        PlantId: +localStorage["PlantId"],
        CompanyId: +localStorage["CompanyId"],
        RoleId: +localStorage["DefaultRoleId"],
      };
      var result = dispatch(FilterVehicleNo(obj));
      result
        .then((res) => {
          if (res.payload.tranStatus.result) {
            setVehicleNoList(res.payload.VehicleNoList);
          } else {
            toast.current?.show({
              severity: "error",
              summary: "Error Message",
              detail: res.payload.tranStatus.lstErrorItem[0].Message,
            });
          }
        })
        .catch((error) => {
          toast.current?.show({
            severity: "error",
            summary: "Error Message",
            detail: JSON.stringify(error),
          });
        });
      // }
    }
  };

  const validateVehicleNumber = (number) => {
    const regex = /^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/i;
    return regex.test(number);
  };

  const handleInputChange = (e) => {
    const input = e.target.value.toUpperCase();
    visitorEntryFormik.setFieldValue("VehicleNo", input);
  };

  const checkVehControl = () => {
    let formVals = selectedEntryData;
    if (formVals?.EntryType == 102) {
      if (formVals.VehicleTypeId == 28) {
        setChangeField((prevState) => ({
          ...prevState,
          VehicleName: {
            disable: true,
            show: true,
          },
          VehicleNo: {
            disable:
              formVals?.VisitorEntryId != 0 &&
              formVals?.VehicleNo != null &&
              formVals?.VehicleNo != ""
                ? true
                : false,
            show: true,
          },
          DriverId: {
            disable:
              formVals?.VisitorEntryId != 0 &&
              formVals?.DriverId != null &&
              formVals?.DriverId != ""
                ? true
                : false,
            show: true,
          },
          DriverName: {
            disable:
              formVals?.EntryTime != null &&
              formVals?.ExitTime != null &&
              formVals?.DriverName != null &&
              formVals?.DriverName != ""
                ? true
                : false,
            show: true,
          },
          StartingKm: {
            disable:
              formVals?.StartingKm != null && formVals?.StartingKm != ""
                ? true
                : false,
            show: true,
            required: false,
          },
          EndingKm: {
            disable:
              formVals?.EndingKm != null && formVals?.EndingKm != ""
                ? true
                : false,
            show: true,
            required: false,
          },
          IsEwayBillNo: {
            disable:
              formVals?.IsEwayBillNo == 1 || formVals?.IsEwayBillNo == true
                ? true
                : false,
            show: true,
            required: false,
          },
          IsEinvBillNo: {
            disable:
              formVals?.IsEinvBillNo == 1 || formVals?.IsEinvBillNo == true
                ? true
                : false,
            show: true,
            required: false,
          },
          VehicleTypeId: {
            disable: false,
            show: true,
            disablec:
              formVals?.VehicleTypeId != null &&
              formVals?.VehicleTypeId != "" &&
              !isCurrentCreate
                ? true
                : false,
          },
          PurposeOfVisit: {
            disable:
              formVals?.EntryTime != null &&
              formVals?.ExitTime != null &&
              formVals?.PurposeOfVisit != null &&
              formVals?.PurposeOfVisit != ""
                ? true
                : false,
            show: true,
            disablec: false,
            required: true,
          },
          VisitorRemarks: {
            disable:
              formVals?.EntryTime != null &&
              formVals?.ExitTime != null &&
              formVals?.VisitorRemarks != null &&
              formVals?.VisitorRemarks != ""
                ? true
                : false,
            show: true,
            disablec:
              formVals?.VisitorRemarks != null && formVals?.VisitorRemarks != ""
                ? true
                : false,
          },
          NumberOfPassengers: {
            disable:
              formVals?.NumberOfPassengers != null &&
              formVals?.NumberOfPassengers != ""
                ? true
                : false,
            show: true,
            required: false,
          },
        }));
      } else if (formVals?.VehicleTypeId == 128) {
        setChangeField((prevState) => ({
          ...prevState,
          VehicleName: {
            disable: false,
            show: false,
          },
          VehicleNo: {
            disable:
              formVals?.VisitorEntryId != 0 &&
              formVals?.VehicleNo != null &&
              formVals?.VehicleNo != ""
                ? true
                : false,
            show: true,
          },
          DriverId: {
            disable:
              formVals?.VisitorEntryId != 0 &&
              formVals?.DriverId != null &&
              formVals?.DriverId != ""
                ? true
                : false,
            show: true,
          },
          DriverName: {
            disable:
              formVals?.EntryTime != null &&
              formVals?.ExitTime != null &&
              formVals?.DriverName != null &&
              formVals?.DriverName != ""
                ? true
                : false,
            show: true,
          },
          StartingKm: {
            disable:
              formVals?.StartingKm != null && formVals?.StartingKm != ""
                ? true
                : false,
            show: false,
            required: false,
          },
          EndingKm: {
            disable:
              formVals?.EndingKm != null && formVals?.EndingKm != ""
                ? true
                : false,
            show: false,
            required: false,
          },
          IsEwayBillNo: {
            disable:
              formVals?.IsEwayBillNo == 1 || formVals?.IsEwayBillNo == true
                ? true
                : false,
            show: false,
            required: false,
          },
          IsEinvBillNo: {
            disable:
              formVals?.IsEinvBillNo == 1 || formVals?.IsEinvBillNo == true
                ? true
                : false,
            show: false,
            required: false,
          },
          VehicleTypeId: {
            disable: false,
            show: true,
            disablec:
              formVals?.VehicleTypeId != null &&
              formVals?.VehicleTypeId != "" &&
              !isCurrentCreate
                ? true
                : false,
          },
          PurposeOfVisit: {
            disable:
              formVals?.EntryTime != null &&
              formVals?.ExitTime != null &&
              formVals?.PurposeOfVisit != null &&
              formVals?.PurposeOfVisit != ""
                ? true
                : false,
            show: true,
            disablec: false,
            required: true,
          },
          VisitorRemarks: {
            disable:
              formVals?.EntryTime != null &&
              formVals?.ExitTime != null &&
              formVals?.VisitorRemarks != null &&
              formVals?.VisitorRemarks != ""
                ? true
                : false,
            show: true,
            disablec:
              formVals?.VisitorRemarks != null && formVals?.VisitorRemarks != ""
                ? true
                : false,
          },
          NumberOfPassengers: {
            disable:
              formVals?.NumberOfPassengers != null &&
              formVals?.NumberOfPassengers != ""
                ? true
                : false,
            show: true,
            required: false,
          },
        }));
      } else if (formVals?.VehicleTypeId == 129) {
        setChangeField((prevState) => ({
          ...prevState,
          VehicleName: {
            disable: false,
            show: false,
          },
          VehicleNo: {
            disable:
              formVals?.VisitorEntryId != 0 &&
              formVals?.VehicleNo != null &&
              formVals?.VehicleNo != ""
                ? true
                : false,
            show: true,
          },
          DriverId: {
            disable:
              formVals?.VisitorEntryId != 0 &&
              formVals?.DriverId != null &&
              formVals?.DriverId != ""
                ? true
                : false,
            show: false,
          },
          DriverName: {
            disable:
              formVals?.EntryTime != null &&
              formVals?.ExitTime != null &&
              formVals?.DriverName != null &&
              formVals?.DriverName != ""
                ? true
                : false,
            show: true,
          },
          StartingKm: {
            disable:
              formVals?.StartingKm != null && formVals?.StartingKm != ""
                ? true
                : false,
            show: false,
            required: false,
          },
          EndingKm: {
            disable:
              formVals?.EndingKm != null && formVals?.EndingKm != ""
                ? true
                : false,
            show: false,
            required: false,
          },
          IsEwayBillNo: {
            disable:
              formVals?.IsEwayBillNo == 1 ||
              (formVals?.IsEwayBillNo == true &&
                formVals?.EntryTime != null &&
                formVals?.ExitTime != null)
                ? true
                : false,
            show: true,
            required: false,
          },
          IsEinvBillNo: {
            disable:
              formVals?.IsEinvBillNo == 1 ||
              (formVals?.IsEinvBillNo == true &&
                formVals?.EntryTime != null &&
                formVals?.ExitTime != null)
                ? true
                : false,
            show: true,
            required: false,
          },
          VehicleTypeId: {
            disable: false,
            show: true,
            disablec:
              formVals?.VehicleTypeId != null &&
              formVals?.VehicleTypeId != "" &&
              !isCurrentCreate
                ? true
                : false,
          },
          PurposeOfVisit: {
            disable:
              formVals?.EntryTime != null &&
              formVals?.ExitTime != null &&
              formVals?.PurposeOfVisit != null &&
              formVals?.PurposeOfVisit != ""
                ? true
                : false,
            show: true,
            disablec: false,
            required: true,
          },
          VisitorRemarks: {
            disable:
              formVals?.EntryTime != null &&
              formVals?.ExitTime != null &&
              formVals?.VisitorRemarks != null &&
              formVals?.VisitorRemarks != ""
                ? true
                : false,
            show: true,
            disablec:
              formVals?.VisitorRemarks != null && formVals?.VisitorRemarks != ""
                ? true
                : false,
          },
          NumberOfPassengers: {
            disable:
              formVals?.NumberOfPassengers != null &&
              formVals?.NumberOfPassengers != ""
                ? true
                : false,
            show: true,
            required: false,
          },
        }));
      } else if (formVals.VehicleTypeId == 29) {
        setChangeField((prevState) => ({
          ...prevState,
          VehicleName: {
            disable:
              formVals?.VehicleName != null && formVals?.VehicleName != ""
                ? true
                : false,
            show: true,
          },
          VehicleNo: {
            disable:
              formVals?.VisitorEntryId != 0 &&
              formVals?.VehicleNo != null &&
              formVals?.VehicleNo != ""
                ? true
                : false,
            show: true,
          },
          DriverId: {
            disable:
              formVals?.VisitorEntryId != 0 &&
              formVals?.DriverId != null &&
              formVals?.DriverId != ""
                ? true
                : false,
            show: true,
          },
          DriverName: {
            disable:
              formVals?.VisitorEntryId != 0 &&
              formVals?.DriverName != null &&
              formVals?.DriverName != ""
                ? true
                : false,
            show: true,
          },
          StartingKm: {
            disable:
              formVals?.StartingKm != null && formVals?.StartingKm != ""
                ? true
                : false,
            show: false,
            required: false,
          },
          EndingKm: {
            disable:
              formVals?.EndingKm != null && formVals?.EndingKm != ""
                ? true
                : false,
            show: false,
            required: false,
          },
          IsEwayBillNo: {
            disable:
              formVals?.IsEwayBillNo == 1 || formVals?.IsEwayBillNo == true
                ? true
                : false,
            show: true,
            required: false,
          },
          IsEinvBillNo: {
            disable:
              formVals?.IsEinvBillNo == 1 || formVals?.IsEinvBillNo == true
                ? true
                : false,
            show: true,
            required: false,
          },
          VehicleTypeId: {
            disable:
              formVals?.VehicleTypeId != null && formVals?.VehicleTypeId != ""
                ? true
                : false,
            show: true,
            disablec:
              formVals?.VehicleTypeId != null &&
              formVals?.VehicleTypeId != "" &&
              !isCurrentCreate
                ? true
                : false,
          },
          PurposeOfVisit: {
            disable:
              formVals?.EntryTime != null &&
              formVals?.ExitTime != null &&
              formVals?.PurposeOfVisit != null &&
              formVals?.PurposeOfVisit != ""
                ? true
                : false,
            show: true,
            disablec: false,
            required: true,
          },
          VisitorRemarks: {
            disable:
              formVals?.VisitorRemarks != null &&
              formVals?.VisitorRemarks != "" &&
              formVals?.EntryTime != null &&
              formVals?.ExitTime != null
                ? true
                : false,
            show: true,
            disablec:
              formVals?.VisitorRemarks != null &&
              formVals?.VisitorRemarks != "" &&
              formVals?.EntryTime != null &&
              formVals?.ExitTime != null
                ? true
                : false,
          },
          NumberOfPassengers: {
            disable:
              formVals?.NumberOfPassengers != null &&
              formVals?.NumberOfPassengers != "" &&
              formVals?.EntryTime != null &&
              formVals?.ExitTime != null
                ? true
                : false,
            show: true,
            required: false,
          },
        }));
      }
    } else if (formVals?.EntryType == 103) {
      if (formVals.VehicleTypeId == 28) {
        setChangeField((prevState) => ({
          ...prevState,
          VehicleName: {
            disable: true,
            show: true,
          },
          VehicleNo: {
            disable:
              formVals?.EntryTime != null &&
              formVals?.ExitTime != null &&
              formVals?.VehicleNo != null &&
              formVals?.VehicleNo != ""
                ? true
                : false,
            show: true,
          },
          DriverId: {
            disable: true,
            show: true,
          },
          DriverName: {
            disable: true,
            show: true,
          },
          StartingKm: {
            disable: true,
            show: true,
            required: false,
          },
          EndingKm: {
            disable: true,
            show: true,
            required: false,
          },
          IsEwayBillNo: {
            disable:
              formVals?.IsEwayBillNo == 1 || formVals?.IsEwayBillNo == true
                ? true
                : false,
            show: true,
            required: false,
          },
          IsEinvBillNo: {
            disable:
              formVals?.IsEinvBillNo == 1 || formVals?.IsEinvBillNo == true
                ? true
                : false,
            show: true,
            required: false,
          },
          VehicleTypeId: {
            disable: true,
            show: true,
            disablec: true,
          },
          PurposeOfVisit: {
            disable:
              formVals?.EntryTime != null &&
              formVals?.ExitTime != null &&
              formVals?.PurposeOfVisit != null &&
              formVals?.PurposeOfVisit != ""
                ? true
                : false,
            show: true,
            disablec:
              formVals?.EntryTime != null &&
              formVals?.ExitTime != null &&
              formVals?.PurposeOfVisit != null &&
              formVals?.PurposeOfVisit != ""
                ? true
                : false,
            required: true,
          },
          VisitorRemarks: {
            disable:
              formVals?.EntryTime != null &&
              formVals?.ExitTime != null &&
              formVals?.VisitorRemarks != null &&
              formVals?.VisitorRemarks != ""
                ? true
                : false,
            show: true,
            disablec:
              formVals?.VisitorRemarks != null && formVals?.VisitorRemarks != ""
                ? true
                : false,
          },
          NumberOfPassengers: {
            disable:
              (formVals?.EntryTime != null && formVals?.ExitTime != null) ||
              (formVals?.NumberOfPassengers != null &&
                formVals?.NumberOfPassengers != "")
                ? true
                : false,
            show: true,
            required: false,
          },
        }));
      } else if (formVals.VehicleTypeId == 29) {
        setChangeField((prevState) => ({
          ...prevState,
          VehicleName: {
            disable: true,
            show: true,
          },
          VehicleNo: {
            disable:
              formVals?.VehicleNo != null && formVals?.VehicleNo != ""
                ? true
                : false,
            show: true,
          },
          DriverId: {
            disable: true,
            show: true,
          },
          DriverName: {
            disable: true,
            show: true,
          },
          StartingKm: {
            disable: true,
            show: false,
            required: false,
          },
          EndingKm: {
            disable: true,
            show: false,
            required: false,
          },
          IsEwayBillNo: {
            disable:
              formVals?.IsEwayBillNo == 1 || formVals?.IsEwayBillNo == true
                ? true
                : false,
            show: true,
            required: false,
          },
          IsEinvBillNo: {
            disable:
              formVals?.IsEinvBillNo == 1 || formVals?.IsEinvBillNo == true
                ? true
                : false,

            show: true,
            required: false,
          },
          VehicleTypeId: {
            disable: true,
            show: true,
            disablec: true,
          },
          PurposeOfVisit: {
            disable:
              formVals?.EntryTime != null &&
              formVals?.ExitTime != null &&
              formVals?.PurposeOfVisit != null &&
              formVals?.PurposeOfVisit != ""
                ? true
                : false,
            show: true,
            disablec:
              (formVals?.EntryTime != null && formVals?.ExitTime != null) ||
              (formVals?.PurposeOfVisit != null &&
                formVals?.PurposeOfVisit != "")
                ? true
                : false,
            required: true,
          },
          VisitorRemarks: {
            disable:
              formVals?.EntryTime != null &&
              formVals?.ExitTime != null &&
              formVals?.VisitorRemarks != null &&
              formVals?.VisitorRemarks != ""
                ? true
                : false,
            show: true,
            disablec:
              formVals?.VisitorRemarks != null && formVals?.VisitorRemarks != ""
                ? true
                : false,
          },
          NumberOfPassengers: {
            disable:
              formVals?.NumberOfPassengers != null &&
              formVals?.NumberOfPassengers != "" &&
              formVals?.EntryTime != null &&
              formVals?.ExitTime != null
                ? true
                : false,
            show: true,
            required: false,
          },
        }));
      } else if (formVals.VehicleTypeId == 128) {
        setChangeField((prevState) => ({
          ...prevState,
          VehicleName: {
            disable: false,
            show: false,
          },
          VehicleNo: {
            disable:
              formVals?.VehicleNo != null && formVals?.VehicleNo != ""
                ? true
                : false,
            disablec:
              formVals?.VehicleNo != null && formVals?.VehicleNo != ""
                ? true
                : false,
            show: true,
          },

          DriverId: {
            disable: true,

            show: true,
          },
          DriverName: {
            disable: true,

            show: true,
          },
          StartingKm: {
            disable: true,

            show: false,
            required: false,
          },
          EndingKm: {
            disable: true,
            show: false,
            required: false,
          },
          IsEwayBillNo: {
            disable: true,
            show: false,
            required: false,
          },
          IsEinvBillNo: {
            disable: true,

            show: false,
            required: false,
          },
          VehicleTypeId: {
            disable: false,
            show: true,
            disablec: true,
          },
          PurposeOfVisit: {
            disable:
              formVals?.EntryTime != null &&
              formVals?.ExitTime != null &&
              formVals?.PurposeOfVisit != null &&
              formVals?.PurposeOfVisit != ""
                ? true
                : false,
            show: true,
            disablec:
              (formVals?.EntryTime != null && formVals?.ExitTime != null) ||
              (formVals?.PurposeOfVisit != null &&
                formVals?.PurposeOfVisit != "")
                ? true
                : false,
            required: true,
          },
          VisitorRemarks: {
            disable:
              formVals?.EntryTime != null &&
              formVals?.ExitTime != null &&
              formVals?.VisitorRemarks != null &&
              formVals?.VisitorRemarks != ""
                ? true
                : false,

            show: true,
            disablec:
              formVals?.VisitorRemarks != null && formVals?.VisitorRemarks != ""
                ? true
                : false,
          },
          NumberOfPassengers: {
            disable: true,
            show: true,
            required: false,
          },
        }));
      } else if (formVals.VehicleTypeId == 129) {
        setChangeField((prevState) => ({
          ...prevState,
          VehicleName: {
            disable: false,
            show: false,
          },
          VehicleNo: {
            disable: true,

            show: true,
          },
          DriverId: {
            disable: true,

            show: false,
          },
          DriverName: {
            disable: true,

            show: true,
          },
          StartingKm: {
            disable: true,

            show: false,
            required: false,
          },
          EndingKm: {
            disable: true,

            show: false,
            required: false,
          },
          IsEwayBillNo: {
            disable:
              formVals?.IsEwayBillNo == 1 ||
              (formVals?.IsEwayBillNo == true &&
                formVals?.EntryTime != null &&
                formVals?.ExitTime != null)
                ? true
                : false,

            show: true,
            required: false,
          },
          IsEinvBillNo: {
            disable:
              formVals?.IsEinvBillNo == 1 ||
              (formVals?.IsEinvBillNo == true &&
                formVals?.EntryTime != null &&
                formVals?.ExitTime != null)
                ? true
                : false,

            show: true,
            required: false,
          },
          VehicleTypeId: {
            disable: false,
            show: true,
            disablec: true,
          },
          PurposeOfVisit: {
            disable: true,

            show: true,
            disablec: false,
            required: true,
          },
          VisitorRemarks: {
            disable: true,

            show: true,
            disablec: true,
          },
          NumberOfPassengers: {
            disable: true,
            show: true,
            required: false,
          },
        }));
      }
    }
  };

  const clearForm = () => {
    visitorEntryFormik.setFieldValue("VehicleNo", "");
    visitorEntryFormik.setFieldValue("VisitorEntryId", 0);
    visitorEntryFormik.setFieldValue("EntryType", 102);
    resetOnlyForm();
  };

  const resetOnlyForm = () => {
    visitorEntryFormik.setFieldValue("VisitorTypeId", 66);
    visitorEntryFormik.setFieldValue("DriverId", null);
    visitorEntryFormik.setFieldValue("DriverName", "");
    // visitorEntryFormik.setFieldValue("VisitorEntryId", 0);
    // visitorEntryFormik.setFieldValue("VisitorEntryCode", "");
    visitorEntryFormik.setFieldValue("VisitorEntryDate", new Date());
    visitorEntryFormik.setFieldValue("EntryTime", new Date());
    visitorEntryFormik.setFieldValue("ExitTime", null);
    visitorEntryFormik.setFieldValue("IsEwayBillNo", false);
    visitorEntryFormik.setFieldValue("IsEinvBillNo", false);
    visitorEntryFormik.setFieldValue("StartingKm", 0.0);
    visitorEntryFormik.setFieldValue("EndingKm", 0.0);
    visitorEntryFormik.setFieldValue("VehicleName", "");
    visitorEntryFormik.setFieldValue("Status", 1);
    visitorEntryFormik.setFieldValue("NumberOfPassengers", "");
    visitorEntryFormik.setFieldValue("VisitorRemarks", "");
    handleSelect("PurposeOfVisit", {}, null);
    let obj: any = {};
    obj.VisitorEntryRefDetailId = 0;
    obj.VisitorEntryId = 0;
    obj.RefTypeId = "";
    obj.RefValue = "";
    obj.show = true;
    obj.adisable = false;
    obj.cdisable = false;
    obj.ddisable = false;
    obj.idisable = false;
    setVisitorEntryRefDetailList([obj]);
    setSelectedEntryData({
      ...selectedEntryData,
      VehicleTypeId: visitorEntryFormik.values.VehicleTypeId,
      VehicleNo: "",
      DriverId: null,
      PurposeOfVisit: null,
      EntryType: 102,
      NumberOfPassengers: "",
      DriverName: null,
      StartingKm: "",
      EndingKm: "",
      IsEwayBillNo: false,
      IsEinvBillNo: false,
      VisitorRemarks: "",
      EntryTime: new Date(),
      ExitTime: null,
    });

    setRefTypeList([]);
    setCheckVehAction(true);
    setIsCurrentCreate(true);
  };

  const resetAllVehForm = () => {
    visitorEntryFormik.resetForm();
    visitorEntryFormik.setFieldValue("VisitorTypeId", 66);
    onChangeVisitorType("VisitorTypeId", {}, 66);
    let obj: any = {};
    obj.VisitorEntryRefDetailId = 0;
    obj.VisitorEntryId = 0;
    obj.RefTypeId = null;
    obj.RefValue = "";
    obj.show = true;
    obj.adisable = false;
    obj.cdisable = false;
    obj.ddisable = false;
    obj.idisable = false;
    setVisitorEntryRefDetailList([obj]);
    setRefTypeList([]);
    setIsdisableSave(false);
    setPhoto(null);
    setImageUrl(IMAGES.NO_IMG);
    CreatePageOnLoad(0);
    setSearchTerm("");
    // setVisible(false);
    onChangeVehicleType(
      {
        target: {
          name: "VehicleTypeId",
        },
        value: 28,
      },
      {
        type: 1,
      }
    );
    visitorEntryFormik?.setFieldValue("EntryType", 102);
    onCheckboxChange(
      {
        target: {
          name: "IsEwayBillNo",
        },
        checked: false,
      },
      {
        clr: true,
      }
    );
    setChangeField((prevState) => ({
      ...prevState,
      IsEwayBillNo: {
        disable: false,
        show: true,
        required: false,
      },
    }));
    onCheckboxChange(
      {
        target: {
          name: "IsEinvBillNo",
        },
        checked: false,
      },
      {
        clr: true,
      }
    );
    setChangeField((prevState) => ({
      ...prevState,
      IsEinvBillNo: {
        disable: false,
        show: true,
        required: false,
      },
    }));
    setUpdateCheckVeh(false);
    setSelectedEntryData({
      ...selectedEntryData,
      VehicleTypeId: visitorEntryFormik.values.VehicleTypeId,
      VehicleNo: "",
      DriverId: null,
      PurposeOfVisit: null,
      EntryType: 102,
      NumberOfPassengers: "",
      DriverName: null,
      StartingKm: "",
      EndingKm: "",
      IsEwayBillNo: false,
      IsEinvBillNo: false,
      VisitorRemarks: "",
      EntryTime: new Date(),
      ExitTime: null,
    });
    // setVisitorEntryMaterialDetailList([]);
    // setVisitorEntryPovDetail([]);
    // setDocument(null);
    // setDocumentUrl("");
    // setPartyNameList([]);
    // setSelectedHost({});
    // setSelectedVisitor({});
    // setSelectedVeh({});
    // setCheckedVehicle(false);
  };

  const handleVehPrint = () => {
    // window.print();

    var divContents = document.getElementById("qr_preview").innerHTML;
    var a = window.open("", "", "height=1000, width=1000");
    a.document.write("<html><head><title>QR Code Preview</title></head>");
    a.document.write(
      `<body style="margin: 0; padding: 0;">
        ${divContents}
      </body>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,700;1,700&display=swap');
        * { font-family: 'Open Sans', sans-serif; }
        .no-print { display: none; }
        .qr_code {
          margin: auto;
          margin-top: 15px;
          text-align: center;
          border: 2px solid #000000;
          padding: 10px;
          border-radius: 10px;
          width: 260px;
        }
          .text-gray-600 {color: #6c757d !important;}
        .text-center { text-align: center; }
        .text-5xl {
          font-size: 2.5rem !important;
          text-align: center;
          font-family: 'Open Sans', sans-serif;
          font-weight: 700;
        }
        .text-3xl {
          font-size: 1.75rem !important;
        }
        .text-bluegray-700 { color: #576375 !important; }
        h2 { font-size: 16px; }
        table td { font-weight: 100; }
        @media print {
          @page {
            margin: 0; /* Remove default page margins */
          }
          body {
            margin: 0; /* Remove default body margins */
          }
        }
      </style>`
    );
    a.document.close();
    a.print();
  };
  // VEHICLE TYPE

  // useEffect(() => {
  //   if (
  //     visitorFormik.values.MobileNo != "" &&
  //     visitorFormik.values.MobileNo != null &&
  //     visitorFormik.values.MobileNo.length == 10
  //   ) {
  //     loadMobileNo();
  //   } else {
  //     loadVisData({
  //       PersonName: "",
  //       VisitorCompany: "",
  //       MailId: "",
  //       IdCardType: null,
  //       IdCardNo: "",
  //       TagNo: "",
  //     });
  //   }
  // }, [visitorFormik.values.MobileNo]);

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
      PlantId: visitorFormik.values.PlantId,
      CompanyId: visitorFormik.values.CompanyId,
      RoleId: +localStorage["DefaultRoleId"],
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
            loadVisData(vData);
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
    visitorFormik.setFieldValue("CountryCode", vData.MobileNo);
    visitorFormik.setFieldValue("MailId", vData.MailId);
    visitorFormik.setFieldValue("IdProofType", vData.IdCardType);
    visitorFormik.setFieldValue("IdProofNo", vData.IdCardNo);
    visitorFormik.setFieldValue("TagNo", vData.TagNo);

    visitorEntryFormik.setFieldValue("FirstName", vData.PersonName);
    visitorEntryFormik.setFieldValue("VisitorCompany", vData.VisitorCompany);
    visitorEntryFormik.setFieldValue("MailId", vData.MailId);
    visitorEntryFormik.setFieldValue("CountryCode", vData.MobileNo);
    visitorEntryFormik.setFieldValue("IdProofType", vData.IdCardType);
    visitorEntryFormik.setFieldValue("IdProofNo", vData.IdCardNo);
    visitorEntryFormik.setFieldValue("TagNo", vData.TagNo);
  };

  const handleMobKeyPress = (event) => {
    visitorFormik.setFieldValue("MobileNo", event?.target?.value);
    setCurrMobNo(event?.target?.value);
  };

  const handleMobBack = (event) => {
    if (event?.keyCode == 8 && visitorFormik.values.MobileNo.length <= 1) {
      loadVisData({
        PersonName: "",
        VisitorCompany: "",
        MailId: "",
        MobileNo: "",
        IdCardType: null,
        IdCardNo: "",
        TagNo: "",
      });
    }
  };

  useEffect(() => {
    if (
      currMobNo != "" &&
      currMobNo != null &&
      currMobNo.length == 10 &&
      createVisEnt
    ) {
      loadMobileNo();
    }
  }, [currMobNo]);

  return (
    <>
      <div>
        <div className="page-container">
          <div className="inner-page-container visitor-info">
            <div className="card flex justify-content-center">
              <Sidebar
                visible={visible}
                onHide={() => handleClosePop()}
                className="preview-container"
                fullScreen
              >
                <CVisitorEntryCreator
                  tabConfig={tabConfig}
                  isCreate={isCreate}
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
                  ChallanTypeList={DtoChallanTypeList}
                  OnChangeVehicle={OnChangeVehicle}
                  onChageToDate={onChageToDate}
                  deleteDocuments={deleteDocuments}
                  handleHyperlink={handleHyperlink}
                  cameraOff={cameraOff}
                  setCameraOff={setCameraOff}
                  handleChange={handleChange}
                  handleRouteSelect={handleRouteSelect}
                  initFldDisable={initFldDisable}
                  CreatePageOnLoadCVisitorEntry={CreatePageOnLoadCVisitorEntry}
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
                  checkedVehicle={checkedVehicle}
                  setCheckedVehicle={setCheckedVehicle}
                  vehicleDetails={vehicleDetails}
                  setVisitorShow={setVisitorShow}
                  fetchAllData={fetchAllData}
                  VisType={visType}
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
                  handleOnChangeVM={handleOnChange}
                  visitorFormVM={visitorForm}
                  visitorRefVM={visitorRef}
                  visitorFormikVM={visitorFormik}
                  onChangeVisitorTypeVM={onChangeVisitorTypeVM}
                  tempStateListVM={tempStateList}
                  tempCityListVM={tempCityList}
                  handleCloseImageVM={handleCloseImage}
                  handleChangeVM={handleChangeVM}
                  profUploadRefVM={profUploadRef}
                  VisitorhandleHyperlinkVM={VisitorhandleHyperlink}
                  onUploadDocumentVisitorVM={onUploadDocumentVisitor}
                  deleteDocumentsVisitorVM={deleteDocumentsVisitor}
                  documentUrlVisitorVM={documentUrlVisitor}
                  documentVisitorUploadRefVM={documentVisitorUploadRef}
                  visitorDetailListVM={visitorDetailList}
                  filtersVM={filters}
                  TableHeaderVM={TableHeader}
                  DepartmentListVM={DepartmentListVM}
                  OnClearVM={OnClear}
                  visitorDetailFormVM={visitorDetailForm}
                  visitorDetailRefVM={visitorDetailRef}
                  setVisitorDetailListVM={setVisitorDetailList}
                  documentUrlVM={documentUrlVM}
                  onUploadDocumentVM={onUploadDocumentVM}
                  disableFormVM={disableForm}
                  onRowSelectVM={onRowSelect}
                  toastVM={toast}
                  deleteDocumentsVM={deleteDocumentsVM}
                  handleHyperlinkVM={handleHyperlinkVM}
                  handleDChangeVM={handleDChange}
                  documentUploadRefVM={documentUploadRef}
                  WorkSeverityListVM={WorkSeverityListVM}
                  loadingVM={loadingVM}
                  handleDSelectVM={handleDSelect}
                  visitorDFormikVM={visitorDFormik}
                  saveVisitor={saveVisitor}
                  setCreateVisEnt={setCreateVisEnt}
                  createVisEnt={createVisEnt}
                  isCurrentCreate={isCurrentCreate}
                  onChangeVehicleType={onChangeVehicleType}
                  // checkControl={checkControl}
                  changeField={changeField}
                  onCheckboxChange={onCheckboxChange}
                  VisitorEntryRefDetailList={VisitorEntryRefDetailList}
                  setVisitorEntryRefDetailList={setVisitorEntryRefDetailList}
                  VehicleNoList={VehicleNoList}
                  RefTypeList={RefTypeList}
                  setRefTypeList={setRefTypeList}
                  checkVehAction={checkVehAction}
                  resetAllVehForm={resetAllVehForm}
                  clearForm={clearForm}
                  VehicleTypeList={VehicleTypeList}
                  OnChangeDriver={OnChangeDriver}
                  FilterVehNo={FilterVehNo}
                  FilterVehNoWrapped={FilterVehNoWrapped}
                  FilterDriver={FilterDriver}
                  FilterVehNoCleared={FilterVehNoCleared}
                  refTableDisable={refTableDisable}
                  IsDisableClear={IsDisableClear}
                  switchDisable={switchDisable}
                  handleInputChange={handleInputChange}
                  changeEntryType={changeEntryType}
                  handleMobKeyPress={handleMobKeyPress}
                  handleMobBack={handleMobBack}
                  handleVehicleNoChange={handleVehicleNoChange}
                  enableScan={enableScan}
                  addBtnClass={addBtnClass}
                  isScanMode={isScanMode}
                  scanInputRef={scanInputRef}
                  handleScanInput={handleScanInput}
                  vehMAxLen={vehMAxLen}
                  vehicleNoInputRef={vehicleNoInputRef}
                />
              </Sidebar>
              <Dialog
                visible={visitorShow}
                onHide={() => handleVisClosePop()}
                className="preview-container"
                style={{
                  width: "50%",
                  minHeight: "55vh",
                  position: "relative",
                }}
              >
                <CVisitorCreator
                  setVisitorShow={setVisitorShow}
                  fetchAllData={fetchAllData}
                  visType={visType}
                  isViewVM={isViewVM}
                  isCreateVM={isCreateVM}
                  VisitorTypeListVM={VisitorTypeListVM}
                  handleSelectVM={handleSelectVM}
                  TitleListVM={TitleListVM}
                  CountryListVM={CountryListVM}
                  StateListVM={StateListVM}
                  CityListVM={CityListVM}
                  IdCardListVM={IdCardListVM}
                  StatusListVM={StatusListVM}
                  onUploadVM={onUploadVM}
                  itemTemplateVM={itemTemplateVM}
                  imageUrlVM={imageUrlVM}
                  OnchangecountryVM={Onchangecountry}
                  OnchangestateVM={Onchangestate}
                  handleOnChangeVM={handleOnChange}
                  visitorFormVM={visitorForm}
                  visitorRefVM={visitorRef}
                  visitorFormikVM={visitorFormik}
                  onChangeVisitorTypeVM={onChangeVisitorType}
                  tempStateListVM={tempStateList}
                  tempCityListVM={tempCityList}
                  handleCloseImageVM={handleCloseImage}
                  handleChangeVM={handleChange}
                  profUploadRefVM={profUploadRef}
                  VisitorhandleHyperlinkVM={VisitorhandleHyperlink}
                  onUploadDocumentVisitorVM={onUploadDocumentVisitor}
                  deleteDocumentsVisitorVM={deleteDocumentsVisitor}
                  documentUrlVisitorVM={documentUrlVisitor}
                  documentVisitorUploadRefVM={documentVisitorUploadRef}
                  visitorDetailListVM={visitorDetailList}
                  filtersVM={filters}
                  TableHeaderVM={TableHeader}
                  DepartmentListVM={DepartmentList}
                  OnClearVM={OnClear}
                  visitorDetailFormVM={visitorDetailForm}
                  visitorDetailRefVM={visitorDetailRef}
                  setVisitorDetailListVM={setVisitorDetailList}
                  documentUrlVM={documentUrl}
                  onUploadDocumentVM={onUploadDocument}
                  disableFormVM={disableForm}
                  onRowSelectVM={onRowSelect}
                  toastVM={toast}
                  deleteDocumentsVM={deleteDocuments}
                  handleHyperlinkVM={handleHyperlink}
                  handleDChangeVM={handleDChange}
                  documentUploadRefVM={documentUploadRef}
                  loadingVM={loading}
                  handleDSelectVM={handleDSelect}
                  visitorDFormikVM={visitorDFormik}
                  createVisEnt={createVisEnt}
                  resetAllVehForm={resetAllVehForm}
                  IsBelongingDetailsShow={IsBelongingDetailsShow}
                  VisitorEntryBelongingDetailList={
                    VisitorEntryBelongingDetailList
                  }
                  setVisitorEntryBelongingDetailList={
                    setVisitorEntryBelongingDetailList
                  }
                  toast={toast}
                  handleMobKeyPress={handleMobKeyPress}
                  handleMobBack={handleMobBack}
                  saveVmaster={saveVmaster}
                />
              </Dialog>
              <Sidebar
                visible={WorkPermitShow}
                onHide={() => handleWPClosePop()}
                pt={{
                  header: {
                    style: {
                      backgroundColor: "#f0f0f0",
                      overflow: "hidden",
                      borderTopLeftRadius: "5px",
                      borderTopRightRadius: "5px",
                      padding: "6px",
                    },
                  },
                }}
                className="preview-container bg-white"
                fullScreen
              >
                {pageType == "s1" ? (
                  <WorkPermitForm
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
                    Onchangecountry={Onchangecountry}
                    StateListVM={StateListVM}
                    Onchangestate={Onchangestate}
                    CityListVM={CityListVM}
                    IdCardListVM={IdCardListVM}
                    StatusListVM={StatusListVM}
                    onUploadVM={onUploadVM}
                    itemTemplateVM={itemTemplateVM}
                    imageUrlVM={imageUrlVM}
                    handleOnChange={handleOnChange}
                    visitorForm={visitorForm}
                    visitorRef={visitorRef}
                    visitorFormik={visitorFormik}
                    onChangeVisitorTypeVM={onChangeVisitorTypeVM}
                    tempStateList={tempStateList}
                    tempCityList={tempCityList}
                    handleCloseImage={handleCloseImage}
                    handleChangeVM={handleChangeVM}
                    profUploadRef={profUploadRef}
                    VisitorhandleHyperlink={VisitorhandleHyperlink}
                    onUploadDocumentVisitor={onUploadDocumentVisitor}
                    deleteDocumentsVisitor={deleteDocumentsVisitor}
                    documentUrlVisitor={documentUrlVisitor}
                    documentVisitorUploadRef={documentVisitorUploadRef}
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
                  />
                ) : (
                  <WorkPermitPrint />
                )}

                <div className="text-center mb-2">
                  {pageType == "s2" ? (
                    <Button
                      label="Prev"
                      title="Prev"
                      icon="pi pi-arrow-left"
                      className="text-center"
                      onClick={() => changeStage("s1")}
                      disabled={IsdisableSave}
                    />
                  ) : null}
                  {pageType == "s1" ? (
                    <>
                      <Button
                        label="Send for Approval"
                        title="Send for Approval"
                        icon="pi pi-save"
                        className="text-center"
                        onClick={() => changeStage("s2")}
                        disabled={IsdisableSave}
                      />
                      <Button
                        label="Next"
                        title="Next"
                        icon="pi pi-arrow-right"
                        className="text-center"
                        onClick={() => changeStage("s2")}
                        disabled={IsdisableSave}
                      />
                    </>
                  ) : null}
                  {pageType == "s2" ? (
                    <>
                      <Button
                        label="Save"
                        title="Save"
                        icon="pi pi-save"
                        className="text-center"
                        onClick={() => {}}
                        disabled={IsdisableSave}
                      />
                      <Button
                        label="Print"
                        title="Print"
                        icon="pi pi-save"
                        className="text-center"
                        onClick={() => handlePrint()}
                        disabled={IsdisableSave}
                      />
                    </>
                  ) : null}
                </div>
              </Sidebar>
            </div>
            <>
              <div className="grid">
                <div className="col-12 preview-left">
                  <div className="form-container scroll-y">
                    <div className="normal-table visitor-table">
                      <table>
                        <tbody>
                          <tr>
                            <td style={{ width: "50%" }} className="text-right">
                              Pre-Appointment?
                            </td>
                            <td>
                              <InputSwitch
                                checked={checked}
                                onChange={(e) => setChecked(e.value)}
                              />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {!checked && (
                      <div className="flex justify-content-center flex-wrap visitor-type">
                        {tabConfig &&
                          tabConfig.map((visitorLink: any) => (
                            <div
                              id={visitorLink.type}
                              key={visitorLink.id}
                              className={`${
                                visitorLink.disable
                                  ? "opacity-70 pointer-events-none"
                                  : ""
                              }
                          ${visitorLink.active ? "select white" : "white"}`}
                              onClick={handleTabAction}
                            >
                              <div
                                id={visitorLink.type}
                                style={{
                                  userSelect: "none",
                                }}
                              >
                                <img
                                  id={visitorLink.type}
                                  src={visitorLink.visitorTypeImg}
                                  alt={visitorLink.visitorTypeTxt}
                                />
                                <h5 id={visitorLink.type}>
                                  {visitorLink.visitorTypeTxt}
                                </h5>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}

                    {/* Appointment Container  */}
                    {showEntryDetail ? (
                      <></>
                    ) : (
                      <div className="appointment-container">
                        <SearchContainer
                          checked={checked}
                          selectedData={selectedData}
                          setVisible={setVisible}
                          VisitorNameList={VisitorNameList}
                          VisitorEmployeeList={EmployeeList}
                          VisitorEntryBooked={VisitorEntryBooked}
                          VehicleList={VehicleList}
                          handleSearchAction={handleSearchAction}
                          setSelectedVisitor={setSelectedVisitor}
                          setSelectedHost={setSelectedHost}
                          selectedHost={selectedHost}
                          handleEmployeeSelect={handleEmployeeSelect}
                          handleVisitorSelect={handleVisitorSelect}
                          handleBookedVisitor={handleBookedVisitor}
                          handleVehicleSelect={handleVehicleSelect}
                          isIndCon={isIndCon}
                          visitorShow={visitorShow}
                          setVisitorShow={setVisitorShow}
                          setVehicleShow={setVehicleShow}
                          setEmployeeShow={setEmployeeShow}
                          toast={toast}
                          editData={editData}
                          searchTerm={searchTerm}
                          handleSelectedPop={handleSelectedPop}
                          handleEditData={handleEditData}
                          handleWorkPermitSelect={handleWorkPermitSelect}
                          WorkPermitList={WorkPermitList}
                          setCheckedVehicle={setCheckedVehicle}
                          handleVehEntryCreate={handleVehEntryCreate}
                          resetAllVehForm={resetAllVehForm}
                          openPrint={handleVehPassPrevPrint}
                        />
                        <ContDetail
                          dialogVisible={dialogVisible}
                          setDialogVisible={setDialogVisible}
                          setVisible={setVisible}
                          contWorker={contWorker}
                          handlePassPreview={handleBookedVisitor}
                          passData={passData}
                          selectedHost={selectedHost}
                          selectedVisitor={selectedVisitor}
                          tabConfig={tabConfig}
                          itemTemplate={itemTemplate}
                          toast={toast}
                          handleClosePassPrev={handleClosePassPrev}
                          setpassVisible={setpassVisible}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          </div>
        </div>
      </div>
      <QRPop
        visible={vehPopVisible}
        handleClosePop={handleCloseVehPop}
        qrValue={encryptedValue}
        qrTxt={"Vehicle Entry"}
        handlePrint={handleVehPrint}
        componentRef={componentRef}
        selectedData={selectedVehData}
      />
      {loading ? <AppProgressSpinner /> : null}
      <ConfirmDialog
        pt={{
          headerIcons: {
            hidden: true,
            className: "d-none",
          },
        }}
      />

      <AppAlert toast={toast} />
    </>
  );
};

export default CVisitorManagement;
