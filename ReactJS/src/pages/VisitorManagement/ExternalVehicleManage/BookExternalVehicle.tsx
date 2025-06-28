import React, { useState, useEffect, useRef, useMemo } from "react";
import { pageLoadScript } from "@/assets/js/common-utilities";
import FormFields from "@/components/FormFields";
import { VisitorEntryRefDetailForm } from "@/pages/VisitorManagement/VisitorEntry/cVisitorEntryCreator";
import { VisitorEntryValidationSchema } from "@/validations/VisitorManagement";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { IMAGES } from "@/assets/images/Images";
import { tLDS } from "@/utils/utilFunc";
import { InputSwitch } from "primereact/inputswitch";
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
  FilterVehicleNo,
  OnChangeVehicleNo,
} from "@/redux/slices/visitorManagement/externalBookEntrySlice";
import { AppointmentImg } from "@/assets/css/img-library";
import { Button } from "primereact/button";
import AppAlert from "@/alert/alert";
import { AppProgressSpinner } from "@/components/UtilityComp";

function useQuery() {
  const { search } = useLocation();

  return useMemo(() => new URLSearchParams(search), [search]);
}

const BookExternalVehicle = () => {
  const route = useHistory();
  const query = useQuery();

  const [pageType, setPageType] = useState<any>("s1");
  const phonenumber = [{ Id: 1, CountryCode: "+91", CountryName: "India" }];
  const [loadingPage, setLoadingPage] = useState(false);
  const [checkVehAction, setCheckVehAction] = useState(true);
  const [checked, setChecked] = useState(false);
  const [checkedVehicle, setCheckedVehicle] = useState(true);
  const [vehicleDetails, setVehicleDetails] = useState([]);
  const [visible, setVisible] = useState<boolean>(false);
  const [visitorShow, setVisitorShow] = useState<boolean>(false);
  const [WorkPermitShow, setWorkPermitShow] = useState<boolean>(false);
  const [vehicleShow, setVehicleShow] = useState<boolean>(false);
  const [employeeShow, setEmployeeShow] = useState<boolean>(false);
  const [dialogVisible, setDialogVisible] = useState<boolean>(false);

  const [VisitorNameList, setVisitorNameList] = useState([]);
  const [updatedVisitorNameList, setupdatedVisitorNameList] = useState([]);
  const [updatedBelongingList, setupdatedBelongingList] = useState([]);
  const [vehicleInformationList, setvehicleInformationList] = useState([]);
  const [visitorEntryDetailListNew, setvisitorEntryDetailListNew] = useState(
    []
  );

  const [bookedVisitor, setBookedVisitor] = useState({});
  // const [TempVisitorNameList, setTempVisitorNameList] = useState([]);
  // const [EmployeeList, setEmployeeList] = useState([]);
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
  const [isCurrentCreate, setIsCurrentCreate] = useState<any>(false);

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
  const [vehicleHead, setVehicleHead] = useState<any>();
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
  const [VehicleTypeList, setVehicleTypeList] = useState([]);
  const [RefTypeList, setRefTypeList] = useState([]);
  const [tempRefTypeList, setTempRefTypeList] = useState([]);
  const [VehicleList, setVehicleList] = useState([]);
  const [VehicleNoList, setVehicleNoList] = useState([]);
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

  // const [vehicleReferenceDetailList, setvehicleReferenceDetailList] =
  //   useState<any>([]);
  const [VisitorEntryMaterialDetailList, setVisitorEntryMaterialDetailList] =
    useState([]);
  const [VisitorEntryRefDetailList, setVisitorEntryRefDetailList] = useState([
    {
      VisitorEntryRefDetailId: 0,
      VisitorEntryId: 0,
      RefTypeId: null,
      RefValue: "",
    },
  ]);
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
  } = useSelector((state: any) => state.externalBookEntry);
  

  const dispatch: any = useDispatch();

  useEffect(() => {
    pageLoadScript();
  });

  useEffect(() => {
    let VisitorEntryId: number = 0;
    if (isCreate == false) {
    } else {
      CreatePageOnLoadCVisitorEntry(0);
      formik.setFieldValue("EntryType", 102);
    }
  }, []);

  const getId = (idType) => {
    if (query && query.size >= 0) {
      switch (idType) {
        case 1:
          return query.get("CompanyId");
        case 0:
          return query.get("PlantId");
        case 2:
          return 1;
      }
    } else {
      switch (idType) {
        case 1:
          return +localStorage["CompanyId"];
        case 0:
          return +localStorage["PlantId"];
        case 2:
          return 1;
      }
    }
  };

  // Visitor Entry Functions
  const visitorEntryForm = {
    VisitorEntryId: vehicleHead ? vehicleHead.VisitorEntryId : 0,
    VisitorEntryCode: vehicleHead ? vehicleHead.VisitorEntryCode : "",
    VisitorEntryDate: vehicleHead
      ? new Date(vehicleHead.VisitorEntryDate)
      : new Date(),
    CompanyId: vehicleHead ? vehicleHead.CompanyId : getId(1),
    PlantId: vehicleHead ? vehicleHead.PlantId : getId(0),
    GateId: vehicleHead ? vehicleHead.GateId : localStorage["GateId"],
    VisitorTypeId: vehicleHead ? vehicleHead.VisitorTypeId : 66,
    VisitorId: vehicleHead ? vehicleHead.VisitorDetailId : null,
    PersonName: vehicleHead ? vehicleHead.PersonName : "",
    MobileNo: vehicleHead ? vehicleHead.MobileNo : "",
    IdProofType: DtoVisitorEntryHeader
      ? DtoVisitorEntryHeader.IdProofType
      : null,
    IdProofNo: DtoVisitorEntryHeader ? DtoVisitorEntryHeader.IdProofNo : "",
    VisitedEmployeeId: DtoVisitorEntryHeader
      ? DtoVisitorEntryHeader.VisitedEmployeeId
      : null,
    ValidFrom: vehicleHead ? new Date(vehicleHead.ValidFrom) : new Date(),
    ValidTo: vehicleHead ? new Date(vehicleHead.ValidTo) : new Date(),
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
    VisitorRemarks: vehicleHead ? vehicleHead.VisitorRemarks : "",
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
    ChallanType: vehicleHead ? vehicleHead.ChallanType : 98,
    VehicleType: DtoVisitorEntryHeader ? DtoVisitorEntryHeader.VehicleType : "",
    VehicleName: DtoVisitorEntryHeader ? DtoVisitorEntryHeader.VehicleName : "",
    VehicleNo: DtoVisitorEntryHeader ? DtoVisitorEntryHeader.VehicleNo : "",
    IsExistingDriver: DtoVisitorEntryHeader
      ? DtoVisitorEntryHeader.IsExistingDriver
      : null,
    EntryType: vehicleHead ? vehicleHead.EntryType : null,
    EntryTime: DtoVisitorEntryHeader
      ? new Date(DtoVisitorEntryHeader.EntryTime)
      : tLDS(new Date()),
    ExitTime: DtoVisitorEntryHeader ? DtoVisitorEntryHeader.ExitTime : null,
    IsEwayBillNo: DtoVisitorEntryHeader
      ? DtoVisitorEntryHeader.IsEwayBillNo
      : false,
    IsEinvBillNo: DtoVisitorEntryHeader
      ? DtoVisitorEntryHeader.IsEinvBillNo
      : false,
    DriverId: DtoVisitorEntryHeader ? DtoVisitorEntryHeader.DriverId : "",
    VehicleDocumentName: DtoVisitorEntryHeader
      ? DtoVisitorEntryHeader.VehicleDocumentName
      : "",
    VehicleDocumentUrl: DtoVisitorEntryHeader
      ? DtoVisitorEntryHeader.VehicleDocumentUrl
      : "",
    RouteId: DtoVisitorEntryHeader ? DtoVisitorEntryHeader.RouteId : null,
    NumberOfPassengers: DtoVisitorEntryHeader
      ? +DtoVisitorEntryHeader.NumberOfPassengers
      : "",
    StartingKm: DtoVisitorEntryHeader ? DtoVisitorEntryHeader.StartingKm : "",
    EndingKm: DtoVisitorEntryHeader ? DtoVisitorEntryHeader.EndingKm : "",
    PlannedTravellingKm: vehicleHead ? vehicleHead.PlannedTravellingKm : "",
    ActualTravellingKm: vehicleHead ? vehicleHead.ActualTravellingKm : "",
    Status: vehicleHead ? vehicleHead.Status : 1,
    //Status: DtoVisitorEntryHeader ? DtoVisitorEntryHeader.Status : 74,
    CreatedBy: vehicleHead ? +localStorage["UserId"] : null,
    CreatedOn: vehicleHead ? new Date(vehicleHead.CreatedOn) : new Date(),
    ModifiedBy: vehicleHead ? +localStorage["UserId"] : null,
    ModifiedOn: vehicleHead ? new Date() : null,
  };

  const formik: any = useFormik({
    initialValues: visitorEntryForm,
    validationSchema: VisitorEntryValidationSchema,
    onSubmit: (values: any, { resetForm }) => {
      values.IsExternal = false;

      setIsdisableSave(true);
      const formData: any = new FormData();
      if (values.VisitorTypeId == 66) {
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
            return toastValidation(
              "Please Select Eway Bill No in Reference Details."
            );
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
        // if (values.DriverId == "" || values.DriverId == null)
        //   return toastValidation("Please Select Driver Name");
        // if (
        //   (!checkedVehicle && values.StartingKm == null) ||
        //   values.StartingKm == ""
        // )
        //   return toastValidation("Please Enter Starting Km");
        // if (
        //   (checkedVehicle && values.EndingKm == null) ||
        //   values.EndingKm == ""
        // )
        //   return toastValidation("Please Enter Ending Km");
        if (values.PurposeOfVisit == null || values.PurposeOfVisit == "")
          return toastValidation("Please Select Purpose Of Visit");
        if (checkedVehicle && values.StartingKm > values.EndingKm)
          return toastValidation("Ending Km Should not Less than Starting Km ");
      }
      values.VehicleNo = values.VehicleNo.VehicleNo
        ? values.VehicleNo.VehicleNo
        : values.VehicleNo;

      let List1: any[] = vehicleInformationList;
      let List2: any[] = VisitorEntryRefDetailList;
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
        let validToDateDtl = new Date(
          values.ValidFrom.getFullYear(),
          values.ValidFrom.getMonth(),
          values.ValidFrom.getDate()
        );
        validToDateDtl.setHours(23, 59, 59, 999);
      }
      let ListvehicleInformationList: any[] = [],
        ListvehicleReferenceDetailList: any[] = [];
      // ListVisitorEntryMaterialDetailList: any[] = [];
      // if (List1.length > 0) {
      //   for (let i = 0; i < List1.length; i++) {
      //     const x = List1[i];
      //     let vedObj: any = {};
      //     vedObj.VehicleName = x.VehicleName ?? 0;
      //     vedObj.VehicleNo = x.VehicleNo ?? 0;
      //     vedObj.NumberOfPassengers = x.NumberOfPassengers ?? 0;
      //     vedObj.DriverId = x.DriverId ?? 0;
      //     vedObj.StartingKm = x.StartingKm;
      //     vedObj.EndingKm = x.EndingKm;
      //     vedObj.Entry_Time = x.EntryTime;
      //     vedObj.Exit_Time = x.ExitTime;
      //     ListvehicleInformationList.push(vedObj);
      //   }
      // }
      if (List2.length > 0) {
        for (let i = 0; i < List2.length; i++) {
          const x = List2[i];
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
      // if (List3.length > 0) {
      //   for (let i = 0; i < List3.length; i++) {
      //     const x = List3[i];
      //     let vemdObj: any = {};
      //     vemdObj.VisitorEntryMaterialDetailId =
      //       x.VisitorEntryMaterialDetailId ?? 0;
      //     vemdObj.VisitorEntryId = x.VisitorEntryId ?? 0;
      //     vemdObj.MaterialId = x.MaterialId;
      //     vemdObj.Uom = x.Uom;
      //     vemdObj.Qty = x.Qty;
      //     ListVisitorEntryMaterialDetailList.push(vemdObj);
      //   }
      // }
      if (!photo && values.VisitorTypeId != 66) {
        setIsdisableSave(false);
        toast.current?.show({
          severity: "warn",
          detail: "Please Capture Image",
          summary: "Warning Message",
        });
        return;
      }
      var validto = new Date(
        values.ValidFrom.getFullYear(),
        values.ValidFrom.getMonth(),
        values.ValidFrom.getDate()
      );
      validto.setHours(23, 59, 59, 999);
      values.ValidFrom = datepipes(new Date(values.ValidFrom));

      values.ValidFrom = datepipes(new Date(values.ValidFrom));
      values.EntryTime =
        values.EntryTime != null && values.EntryTime != ""
          ? tLDS(new Date(values.EntryTime))
          : null;
      values.ExitTime =
        values.ExitTime != null && values.ExitTime != ""
          ? tLDS(new Date(values.ExitTime))
          : null;
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

      let obj = {
        VisitorEntry: values,
        VisitorEntryDetail: [],
        VisitorEntryBelongingDetail: [],
        VisitorEntryRefDetail: ListvehicleReferenceDetailList ?? [],
        VisitorEntryMaterialDetail: [],
        VisitorEntryAtvDetail: VisitorEntryPovDetail ?? [],
      };
      let input: string = JSON.stringify(obj);
      formData.append("input", input);
      formData.append("webfile", photo);
      formData.append("webfile1", document);
      formData.append("webfiles", []);
      formData.append("digSign", null);

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
              setVisible(false);
              setIsdisableSave(false);

              resetAllForm();
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
  const handleRouteSelect = (name, other, value) => {
    formik.setFieldValue(name, value);
    let Planned = RouteList.find((f) => f.RouteId == value).RouteDistanceInKm;
    formik.setFieldValue("PlannedTravellingKm", Planned);
  };
  const handleChange = (event) => {
    formik.setFieldValue(event.target.name, event.value);
  };
  const OnSelectVisitorCode = (name, other, value) => {
    formik.setFieldValue(name, value);
  };
  const handleSelect = (name, other, value) => {
    formik.setFieldValue(name, value);
  };
  const onClickIsExistingDriver = (event) => {
    formik.setFieldValue(event.target.name, event.checked);
    if (isCreate) formik.setFieldValue("DriverId", "");
    setHideDriverDD(event.checked);
  };
  const onChangeVehicleType = (event) => {
    formik.setFieldValue(event.target.name, event.value);
    setSelectedVehType(event.value);
    resetOnlyForm();
    checkControl();
  };
  const OnChangeVehNo = (name, other, value) => {
    formik.setFieldValue(name, value);
    if (!value) {
      // Clear all fields if the value is cleared
      resetAllForm();
      return;
    }
    if (typeof value == "string") {
    } else {
      // let visType = formik.values.visType;
      // if (!visType) {
      //   toast.current?.show({
      //     severity: "warn",
      //     summary: "Warning Message",
      //     detail: "Please Select Visitor Entry Type.",
      //   });
      //   return;
      // }
      let obj = {
        VehicleNo: value.VehicleNo,
      };
      var result = dispatch(OnChangeVehicleNo(obj));
      result
        .then((res) => {
          if (res.payload.tranStatus.result) {
            if (
              res.payload.VisitorEntryHeader &&
              Object.keys(res.payload.VisitorEntryHeader).length &&
              Object.keys(res.payload.VisitorEntryHeader).length > 0
            ) {
              formik.setFieldValue(
                "VisitorEntryId",
                res?.payload.VisitorEntryHeader?.VisitorEntryId
              );
              formik.setFieldValue(
                "VisitorEntryCode",
                res?.payload.VisitorEntryHeader?.VisitorEntryCode
              );
              formik.setFieldValue(
                "VisitorEntryDate",
                new Date(res?.payload.VisitorEntryHeader?.VisitorEntryDate)
              );
              formik.setFieldValue(
                "VisitorRemarks",
                res?.payload.VisitorEntryHeader?.VisitorRemarks
              );
              formik.setFieldValue("EntryType", 103);
              formik.setFieldValue(
                "EntryTime",
                new Date(res?.payload.VisitorEntryHeader?.EntryTime)
              );
              formik.setFieldValue(
                "ExitTime",
                res?.payload.VisitorEntryHeader?.ExitTime == null
                  ? new Date()
                  : new Date(res?.payload.VisitorEntryHeader?.ExitTime)
              );
              formik.setFieldValue(
                "StartingKm",
                res?.payload.VisitorEntryHeader?.StartingKm
              );
              formik.setFieldValue(
                "EndingKm",
                res?.payload.VisitorEntryHeader?.EndingKm
              );
              formik.setFieldValue(
                "NoOfPassengers",
                res?.payload.VisitorEntryHeader?.NoOfPassengers
              );
              formik.setFieldValue(
                "IsEwayBillNo",
                res?.payload.VisitorEntryHeader?.IsEwayBillNo
              );
              formik.setFieldValue(
                "IsEinvBillNo",
                res?.payload.VisitorEntryHeader?.IsEinvBillNo
              );
              handleSelect(
                "DriverId",
                {},
                +res?.payload.VisitorEntryHeader?.DriverId
              );
              handleSelect(
                "PurposeOfVisit",
                {},
                res?.payload.VisitorEntryHeader?.PurposeOfVisit
              );
              setCheckVehAction(false);
              res.payload.VisitorEntryDetails.forEach((element) => {
                setRefTypeList(
                  tempRefTypeList.filter(
                    (item) =>
                      item.RefTypeId === element?.MetaSubId &&
                      (res?.payload.VisitorEntryHeader?.IsEinvBillNo ||
                        res?.payload.VisitorEntryHeader?.IsEwayBillNo)
                  )
                );
              });
              setVehicleHead(res.payload.VisitorEntryHeader);
              if(res.payload.VisitorEntryDetails.length > 0) {

                setVisitorEntryRefDetailList(res.payload.VisitorEntryDetails);
              }
              else {
                setVisitorEntryRefDetailList([{
                  VisitorEntryRefDetailId: 0,
                  VisitorEntryId: 0,
                  RefTypeId: null,
                  RefValue: "",
                }])
              }
              setChangeField((prevState) => ({
                ...prevState,
                IsEwayBillNo: {
                  disable: true,
                  show: true,
                  required: false,
                },
                IsEinvBillNo: {
                  disable: true,
                  show: true,
                  required: false,
                },
              }));
              toast.current?.show({
                severity: "success",
                summary: "Data Found Successfully",
                detail: res.payload.tranStatus.lstErrorItem[0].Message,
              });
            } else {
              resetOnlyForm();
              formik.setFieldValue(name, value);

              setCheckVehAction(true);
            }
          } else {
            toast.current?.show({
              severity: "success",
              summary: "Success Message",
              detail: res.payload.tranStatus.lstErrorItem[0].Message,
            });
          }
        })
        .catch((error) => {
          // toast.current?.show({
          //   severity: "error",
          //   summary: "Error Message",
          //   detail: JSON.stringify(error),
          // });
        });
    }
  };
  const FilterVehNo = (e) => {
    formik.setFieldValue("VehicleNo", e.query);
    // let visType = formik.values.visType;
    // if (!visType) {
    //   toast.current?.show({
    //     severity: "warn",
    //     summary: "Warning Message",
    //     detail: "Please Select Visitor Entry Type.",
    //   });
    //   return;
    // }
    let obj = {
      text: e.query,
      EntryType: visType,
      PlantId: getId(0),
      CompanyId: getId(1),
      RoleId: getId(2),
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
  };

  // const onCheckboxChange = (e) => {
  //   formik.setFieldValue(e?.target?.name, e?.checked)
  //   if (e?.checked) {
  //     let tempRefLst =  tempRefTypeList.filter((item) => item.MetaSubId ==  e?.target?.id)
  //     setRefTypeList(tempRefLst);
  //   } else {
  //     setRefTypeList([]);
  //   }
  // };

  const onCheckboxChange = (e) => {
    formik.setFieldValue(e?.target?.name, e?.checked);
    if (e?.checked) {
      let tempRefLst = tempRefTypeList.filter(
        (item) => item.MetaSubId == e?.target?.id
      );
      setRefTypeList((prevList) => [...prevList, ...tempRefLst]);
    } else {
      setRefTypeList((prevList) =>
        prevList.filter((item) => item.MetaSubId !== e?.target?.id)
      );
    }
  };

  useEffect(() => {
    checkControl();
  }, [formik.values.VehicleTypeId]);

  const checkControl = () => {
    console.log(
      formik.values.VehicleTypeId,
      VehicleTypeList?.filter(
        (item) => item.MetaSubId == formik.values.VehicleTypeId
      )[0]?.MetaSubDescription
    );

    if (formik.values.VehicleTypeId == 129) {
      setChangeField((prevState) => ({
        ...prevState,
        VehicleName: {
          disable: false,
          show: false,
        },
        VehicleNo: {
          disable: false,
          show: true,
        },
        DriverId: {
          disable: false,
          show: false,
        },
        DriverName: {
          disable: false,
          show: true,
        },
        StartingKm: {
          disable: false,
          show: false,
          required: false,
        },
        EndingKm: {
          disable: false,
          show: false,
          required: false,
        },
        IsEwayBillNo: {
          disable: false,
          show: true,
          required: false,
        },
        IsEinvBillNo: {
          disable: false,
          show: true,
          required: false,
        },
      }));
    } else if (formik.values.VehicleTypeId == 128) {
      setChangeField((prevState) => ({
        ...prevState,
        VehicleName: {
          disable: true,
          show: true,
        },
        VehicleNo: {
          disable: false,
          show: true,
        },
        DriverId: {
          disable: true,
          show: true,
        },
        DriverName: {
          disable: false,
          show: false,
        },
        StartingKm: {
          disable: false,
          show: false,
          required: false,
        },
        EndingKm: {
          disable: false,
          show: false,
          required: false,
        },
        IsEwayBillNo: {
          disable: false,
          show: false,
          required: false,
        },
        IsEinvBillNo: {
          disable: false,
          show: false,
          required: false,
        },
      }));
    } else if (formik.values.VehicleTypeId == 29) {
      setChangeField((prevState) => ({
        ...prevState,
        VehicleName: {
          disable: true,
          show: true,
        },
        VehicleNo: {
          disable: false,
          show: true,
        },
        DriverId: {
          disable: false,
          show: true,
        },
        DriverName: {
          disable: false,
          show: false,
        },
        StartingKm: {
          disable: false,
          show: false,
          required: false,
        },
        EndingKm: {
          disable: false,
          show: false,
          required: false,
        },
        IsEwayBillNo: {
          disable: false,
          show: true,
          required: false,
        },
        IsEinvBillNo: {
          disable: false,
          show: true,
          required: false,
        },
      }));
    } else {
      setChangeField((prevState) => ({
        ...prevState,
        VehicleName: {
          disable: true,
          show: true,
        },
        VehicleNo: {
          disable: false,
          show: true,
        },
        DriverId: {
          disable: false,
          show: true,
        },
        DriverName: {
          disable: false,
          show: false,
        },
        StartingKm: {
          disable: false,
          show: true,
          required: false,
        },
        EndingKm: {
          disable: false,
          show: true,
          required: false,
        },
        IsEwayBillNo: {
          disable: false,
          show: true,
          required: false,
        },
        IsEinvBillNo: {
          disable: false,
          show: true,
          required: false,
        },
      }));
    }
  };

  useEffect(() => {
    
  });

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

  const resetOnlyForm = () => {
    formik.setFieldValue("VehicleNo", "");
    formik.setFieldValue("DriverId", null);
    formik.setFieldValue("EntryTime", new Date());
    formik.setFieldValue("ExitTime", null);
    formik.setFieldValue("IsEwayBillNo", false);
    formik.setFieldValue("IsEinvBillNo", false);
    formik.setFieldValue("StartingKm", "");
    formik.setFieldValue("EndingKm", "");
    formik.setFieldValue("VehicleName", "");
    formik.setFieldValue("Status", 1);
    formik.setFieldValue("NumberOfPassengers", "");
    handleSelect("PurposeOfVisit", {}, null);
  };
  const resetAllForm = () => {
    formik.resetForm();
    let obj: any = {};
    obj.VisitorEntryRefDetailId = 0;
    obj.VisitorEntryId = 0;
    obj.RefTypeId = "";
    obj.RefValue = "";
    setVisitorEntryRefDetailList([obj]);
    setRefTypeList([]);
    setIsdisableSave(false);
    setPhoto(null);
    setImageUrl(IMAGES.NO_IMG);
    // CreatePageOnLoad(0);
    setVisible(false);
    setSearchTerm("");
    onChangeVehicleType({
      target: {
        name: "VehicleTypeId",
      },
      value: 28,
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
  const CreatePageOnLoad = (VisitorEntryId: number) => {
    if (checked) {
      Fetch();
      fetchAllData(VisitorEntryId);

      // const data = {
      //   VisitorEntryId: VisitorEntryId,
      //   CompanyId: getId(1),
      //   PlantId: getId(0),
      // };
      // var result = dispatch(createInit(data));
      // result
      //   .then((res) => {
      //     if (res.payload.tranStatus.result == true) {
      //       setEmployeeList(res.payload.EmployeeList);
      //       setTempEmployeeList(res.payload.EmployeeList);
      //       setVisitorNameList(res.payload.VisitorNameList);
      //       setTempVisitorNameList(res.payload.VisitorNameList);
      //     }
      //   })
      //   .catch((error) => {});
    } else {
      fetchAllData(VisitorEntryId);
    }
  };

  const CreatePageOnLoadCVisitorEntry = (VisitorEntryId: number) => {
    const data = {
      VisitorEntryId: VisitorEntryId,
      CompanyId: getId(1),
      PlantId: getId(0),
      RoleId: getId(2),
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
          onChangeVehicleType({
            target: {
              name: "VehicleTypeId",
            },
            value: 28,
          });
          if (isCreate == true) {
            if (
              +selectedData?.selectedType != 66 &&
              +selectedData?.selectedType != 65
            ) {
            }
            let obj: any = {};
            obj.VisitorEntryRefDetailId = 0;
            obj.VisitorEntryId = 0;
            obj.RefTypeId = "";
            obj.RefValue = "";
            setVisitorEntryRefDetailList([obj]);

            if (!isCurrentCreate) {
              formik.setFieldValue(
                "VisitedEmployeeId",
                selectedData.selectedWhomToVisit
              );
            }
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

  const fetchAllData = (VisitorEntryId) => {
    const data = {
      VisitorEntryId: VisitorEntryId,
      CompanyId: getId(1),
      PlantId: getId(0),
      RoleId: getId(2),
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
      PlantId: getId(0),
      CompanyId: getId(1),
      UserId: +localStorage["UserId"],
      RoleId: getId(2),
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

  const toastValidation = (message: string) => {
    setIsdisableSave(false);
    toast.current?.show({
      severity: "warn",
      summary: "Warning Message",
      detail: message,
    });
    return;
  };

  const saveVisitor = () => {
    // const checkVisValidations = checkVisMasterValidation(visitorFormik.values);
    // if (checkVisValidations == true) {
    //   if (
    //     !formik.values.ValidTo &&
    //     formik.values.VisitorTypeId == 36
    //   )
    //     return toastValidation("Please Select Valid To Date");
    formik.handleSubmit();
    // }
  };

  return (
    <div style={{ overflow: "auto", height: "100vh" }}>
      <div
        className="appointment-page"
        style={{ backgroundImage: "url(" + AppointmentImg + ")" }}
      >
        <div className="center-container ">
          <div className="white mb20 appointment-hdr">
            <div className="col-12 md:col-12">
              <div className="normal-table visitor-table">
                <table>
                  <tbody>
                    <tr>
                      <td style={{ width: "50%" }} className="text-right">
                        Out
                      </td>
                      <td>
                        <InputSwitch
                          checked={
                            formik.values?.EntryType == 102 ? true : false
                          }
                          name={"EntryType"}
                          onChange={(e) => {
                            setRefTypeList([]);
                            if (!checkVehAction) {
                              resetAllForm();
                            }
                            formik.setFieldValue(
                              "EntryType",
                              e.target.value == true ? 102 : 103
                            );
                          }}
                          //disabled={isView || !isCreate || initFldDisable}
                        />
                      </td>
                      <td style={{ width: "50%" }}>In</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className={`appointment-container scroll-y white`}>
            <div className="sub-title">
              <div className="grid">
                <div className="col-12">
                  <h2>{`Vehicle Information`}</h2>
                </div>
              </div>
            </div>
            <div className={"p-3"}>
              <div className="normal-table">
                {/* <div className="page-title">
                  <div className="grid grid-nogutter">
                    <div className="md:col-6">
                      <h1>Vehicle Information</h1>
                      <InputSwitch
                            checked={checkedVehicle}
                            onChange={(e) => setCheckedVehicle(e.target.value)
                            }
                          />
                    </div>
                  </div>
                </div> */}

                <div className="grid pl-2 pr-4">
                  {/* {!initFldDisable ? (
              <FormFields
                type={"checkbox"}
                name={"IsExistingVehicle"}
                label={"Is Existing Vehicle "}
                options={""}
                show={false}
                required={false}
                disable={isView || !isCreate}
                optionLabel={""}
                optionValue={""}
                handleChange={onClickIsExistingVehicle}
                fldStyle={"col-12 md:col-3"}
                formik={formik}
              />
            ) : (
              <FormFields type={""} fldStyle={"col-12 md:col-3"} show={false} />
            )} */}
                  {/* <FormFields
                type={"select"}
                name={"VehicleName"}
                label={"Vehicle Name "}
                options={VehicleList}
                show={HideVehicleDD}
                required={false}
                disable={isView || !isCreate}
                optionLabel={"VehicleNameAndNo"}
                optionValue={"VehicleName"}
                handleSelect={OnChangeVehicle}
                fldStyle={"col-12 md:col-3"}
                formik={formik}
              /> */}

                  {/* <FormFields
                type={"select"}
                name={"VisitorTypeId"}
                label={"Visitor Type "}
                options={VisitorTypeList}
                show={true}
                required={false}
                disable={isView || !isCreate || initFldDisable}
                optionLabel={"MetaSubDescription"}
                optionValue={"MetaSubId"}
                handleSelect={onChangeVisitorType}
                fldStyle={"col-12 md:col-3"}
                formik={formik}
              /> */}

                  <FormFields
                    type={"radiobox"}
                    name={"VehicleTypeId"}
                    label={"Vehicle Type "}
                    options={VehicleTypeList}
                    show={true}
                    required={false}
                    disable={isView || !isCreate || initFldDisable}
                    optionLabel={"MetaSubDescription"}
                    optionValue={"MetaSubId"}
                    handleChange={onChangeVehicleType}
                    fldStyle={"col-12 md:col-12"}
                    formik={formik}
                  />
                  <FormFields
                    type={"autocomplete"}
                    name={"VehicleNo"}
                    label={"Vehicle No "}
                    options={""}
                    show={changeField["VehicleNo"]?.show}
                    required={true}
                    // disable={isCreate ? HideVehicleDD : true}
                    disable={changeField["VehicleNo"]?.disable}
                    optionLabel={""}
                    optionValue={""}
                    handleSelect={""}
                    handleChange={(e) =>
                      OnChangeVehNo("VehicleNo", {}, e.value)
                    }
                    fldStyle={"col-12 md:col-3"}
                    formik={formik}
                    maxLength="50"
                    autoSearch={FilterVehNo} //filter Method
                    autoCompleteRef={autoCompleteRef}
                    autoSuggestions={VehicleNoList} //Filtered List
                    autoCompleteLbl={"VehicleNo"}
                    field={"VehicleNo"}
                    placeHolder={"Please Enter Vehicle No"}
                  />
                  {/* <FormFields
                    type={"text"}
                    name={"VehicleName"}
                    label={"Vehicle Name "}
                    options={""}
                    show={changeField["VehicleName"]?.show}
                    required={false}
                    disable={
                      isView || !isCreate || changeField["VehicleName"]?.disable
                    }
                    optionLabel={""}
                    optionValue={""}
                    handleSelect={""}
                    fldStyle={"col-12 md:col-3"}
                    formik={formik}
                    maxLength="50"
                  /> */}

                  {/* <div className="col-12 md:col-3">
                <label className="form-label">Document Upload</label>
                <div className="p-inputgroup">
                  <div className="browse-links">
                    <Button
                      label={formik.values.VehicleDocumentName}
                      link
                      onClick={handleHyperlink}
                    />
                  </div>
                  <FileUpload
                    mode="basic"
                    chooseOptions={chooseOptions}
                    url="/api/upload"
                    maxFileSize={1000000}
                    onSelect={onUploadDocument}
                    chooseLabel={documentUrl}
                    auto
                    disabled={isView || !isCreate}
                  />
                  <Button
                    icon="las la-times"
                    disabled={isView || !isCreate}
                    onClick={deleteDocuments}
                  />
                </div>
              </div> */}
                  <FormFields
                    type={"checkbox"}
                    name={"IsExistingDriver"}
                    label={"Is Existing Driver "}
                    options={""}
                    show={false}
                    required={false}
                    disable={isView || !isCreate}
                    optionLabel={""}
                    optionValue={""}
                    handleChange={onClickIsExistingDriver}
                    fldStyle={"col-12 md:col-3"}
                    formik={formik}
                  />
                  <FormFields
                    type={"select"}
                    name={"DriverId"}
                    label={"Driver Name "}
                    options={DriverList}
                    show={changeField["DriverId"]?.show}
                    required={false}
                    disable={
                      isView || !isCreate || changeField["DriverId"]?.disable
                    }
                    optionLabel={"UserName"}
                    optionValue={"UserId"}
                    handleSelect={handleSelect}
                    fldStyle={"col-12 md:col-3"}
                    formik={formik}
                  />
                  <FormFields
                    type={"text"}
                    name={"DriverName"}
                    label={"Driver Name "}
                    options={""}
                    show={changeField["DriverName"]?.show}
                    required={false}
                    disable={
                      isView || !isCreate || changeField["DriverName"]?.disable
                    }
                    optionLabel={""}
                    optionValue={""}
                    handleSelect={""}
                    fldStyle={"col-12 md:col-3"}
                    formik={formik}
                    maxLength="50"
                  />
                  <FormFields
                    type={"Calendar"}
                    name={"EntryTime"}
                    label={"Entry Time"}
                    options={""}
                    show={true}
                    required={false}
                    disable={true}
                    optionLabel={""}
                    optionValue={""}
                    handleChange={handleChange}
                    fldStyle={"col-12 md:col-3"}
                    formik={formik}
                    minDate={new Date()}
                    showTime={true}
                  />
                  <FormFields
                    type={"Calendar"}
                    name={"ExitTime"}
                    label={"Exit Time"}
                    options={""}
                    show={true}
                    required={false}
                    disable={true}
                    optionLabel={""}
                    optionValue={""}
                    handleChange={handleChange}
                    fldStyle={"col-12 md:col-3"}
                    formik={formik}
                    showTime={true}
                  />

                  <FormFields
                    type={"select"}
                    name={"RouteId"}
                    label={"Route "}
                    options={RouteList}
                    show={false}
                    required={false}
                    disable={isView || !isCreate}
                    optionLabel={"RouteName"}
                    optionValue={"RouteId"}
                    handleSelect={handleRouteSelect}
                    fldStyle={"col-12 md:col-3"}
                    formik={formik}
                  />
                  <FormFields
                    type={"text"}
                    name={"NumberOfPassengers"}
                    label={"No.Of Passengers "}
                    options={""}
                    show={true}
                    required={false}
                    // disable={isCreate ? IsVehicleDetailsDisable : true}
                    disable={false}
                    optionLabel={""}
                    optionValue={""}
                    handleSelect={""}
                    fldStyle={"col-12 md:col-3"}
                    formik={formik}
                    keyfilter={"int"}
                    maxLength="10"
                  />

                  <FormFields
                    type={"number"}
                    name={"StartingKm"}
                    label={"Starting Km"}
                    options={""}
                    show={changeField["StartingKm"]?.show}
                    required={changeField["StartingKm"]?.required}
                    disable={changeField["StartingKm"]?.disable}
                    optionLabel={""}
                    optionValue={""}
                    handleSelect={""}
                    fldStyle={"col-12 md:col-3"}
                    formik={formik}
                    maxFractionDigits={2}
                    minFractionDigits={2}
                    mode={"decimal"}
                    max={999999999}
                  />
                  <FormFields
                    type={"number"}
                    name={"EndingKm"}
                    label={"Ending Km"}
                    options={""}
                    show={changeField["EndingKm"]?.show}
                    required={changeField["EndingKm"]?.required}
                    disable={changeField["EndingKm"]?.disable}
                    optionLabel={""}
                    optionValue={""}
                    handleSelect={""}
                    fldStyle={"col-12 md:col-3"}
                    formik={formik}
                    maxFractionDigits={2}
                    minFractionDigits={2}
                    mode={"decimal"}
                    max={999999999}
                  />
                  <FormFields
                    type={"select"}
                    name={"PurposeOfVisit"}
                    label={"Purpose Of Visit "}
                    options={PurposeList}
                    show={true}
                    required={true}
                    disable={!isCreate}
                    optionLabel={"MetaSubDescription"}
                    optionValue={"MetaSubId"}
                    handleSelect={handleSelect}
                    formik={formik}
                    fldStyle={"col-12 md:col-3"}
                    filter={true}
                  />
                  {/* <FormFields
                type={""}
                name={""}
                label={""}
                options={""}
                show={true}
                required={false}
                disable={isView || !isCreate}
                optionLabel={""}
                optionValue={""}
                handleSelect={""}
                fldStyle={"col-12 md:col-3"}
                formik={formik}
              /> */}
                  <FormFields
                    type={"checkbox"}
                    name={"IsEwayBillNo"}
                    label={"E-Way Bill No "}
                    id={130}
                    options={""}
                    show={changeField["IsEwayBillNo"]?.show}
                    required={false}
                    disable={
                      isView ||
                      !isCreate ||
                      changeField["IsEwayBillNo"]?.disable
                    }
                    optionLabel={""}
                    optionValue={""}
                    handleChange={(e) => onCheckboxChange(e)}
                    fldStyle={"col-12 md:col-3"}
                    formik={formik}
                  />
                  <FormFields
                    type={"checkbox"}
                    name={"IsEinvBillNo"}
                    id={131}
                    label={"E-Invoice No "}
                    options={""}
                    show={changeField["IsEinvBillNo"]?.show}
                    required={false}
                    disable={
                      isView ||
                      !isCreate ||
                      changeField["IsEinvBillNo"]?.disable
                    }
                    optionLabel={""}
                    optionValue={""}
                    handleChange={(e) => onCheckboxChange(e)}
                    fldStyle={"col-12 md:col-3"}
                    formik={formik}
                  />
                  <FormFields
                    type={"textarea"}
                    name={"VisitorRemarks"}
                    label={"Visitor Remarks "}
                    options={""}
                    show={true}
                    required={false}
                    disable={isView || !isCreate}
                    optionLabel={""}
                    optionValue={""}
                    handleSelect={""}
                    formik={formik}
                    fldStyle={"col-12 md:col-3"}
                    maxLength="500"
                    style={{ maxHeight: "80px", overflowY: "auto" }}
                  />
                </div>

                <div className="grid">
                  <div className="">
                    <div className={isView ? "p-disabled" : ""}>
                      <VisitorEntryRefDetailForm
                        VisitorEntryRefDetailList={VisitorEntryRefDetailList}
                        setVisitorEntryRefDetailList={
                          setVisitorEntryRefDetailList
                        }
                        isView={isView}
                        isCreate={isCreate}
                        RefTypeList={RefTypeList}
                        IsMaterialDetailsShow={IsMaterialDetailsShow}
                        toast={toast}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="widget-ftr white text-center">
            <div className="flex flex-row justify-content-center widget-ftr text-center">
              <div className="text-center">
                <Button
                  label="Save"
                  title="Save"
                  icon="pi pi-save"
                  type="submit"
                  disabled={IsdisableSave}
                  onClick={saveVisitor}
                />
                <Button
                  label="Clear"
                  severity="danger"
                  className="preview-close"
                  title="Clear"
                  icon="pi pi-times-circle"
                  // disabled={isView || isCreate == false ? true : false}
                  onClick={() => resetAllForm()}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <AppAlert toast={toast} />
      {loadingPage ? <AppProgressSpinner /> : null}
    </div>
  );
};
export default BookExternalVehicle;
