import AppAlert from "@/alert/alert";
import {
  Column,
  DataTable,
  Dropdown,
  InputSwitch,
  InputText,
  RadioButton,
} from "@/assets/css/prime-library";
import { pageLoadScript } from "@/assets/js/common-utilities";
import AppGridTable from "@/components/AppGridTable";
import FormFields from "@/components/FormFields";
import PhotoCapture from "@/components/PhotoCapture";
import { AppProgressSpinner } from "@/components/UtilityComp";
import { Formik, useFormik } from "formik";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { RadioButtonChangeEvent } from "primereact/radiobutton";
import { Toast } from "primereact/toast";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  VisitorEntryValidationSchema,
  visitorEntryBelongingDeatilValidationSchema,
} from "@/validations/VisitorManagement";
import { IMAGES } from "@/assets/images/Images";
import CVisitorCreator from "@/pages/master/Visitor/cVisitorCreator";
import {
  OnChangeVehicleNo,
  OnChangeExistVehicleNo,
} from "@/redux/slices/visitorManagement/externalBookEntrySlice";

export const VisitorEntryForm = (props) => {
  const {
    visitorEntryForm,
    VisitorEntryValidationSchema,
    formik,
    onUpload,
    isView,
    imageUrl,
    tabConfig,
    IsPreBookingList,
    VisitorTypeList,
    onChangeVisitorType,
    onChangeVehicleType,
    isCreate,
    handleSelect,
    autoCompleteRef,
    vehicleNoInputRef,
    VisitorNameList,
    onChangeVisitor,
    handleIsPreBook,
    EmployeeList,
    ProofList,
    onClickIsAppointmentBooking,
    ValidFromDisable,
    ValidToDisable,
    onChageFromDate,
    onChageToDate,
    TominDate,
    CheckboxDisable,
    onClickIsExistingDriver,
    OnChangePartyTypes,
    PartyTypeList,
    PartyNameList,
    AreaList,
    RouteList,
    DriverList,
    IsPartyDisable,
    IsVehicleDetailsDisable,
    ShowVisitorContranctor,
    IsMaterialDetailsShow,
    refTableDisable,
    InvoiceNumberDisable,
    DcNumberDisable,
    PoNumberDisable,
    ContainerNumberDisable,
    StatusList,
    cameraOff,
    setCameraOff,
    handleChange,
    handleRouteSelect,
    initFldDisable,
    PurposeList,
    ChallanTypeList,
    handlePoVSelect,
    isCurrentCreate,
    toast,
    changeField,
    onCheckboxChange,
    VisitorEntryRefDetailList,
    setVisitorEntryRefDetailList,
    VehicleNoList,
    RefTypeList,
    VehicleTypeList,
    OnChangeDriver,
    FilterVehNo,
    FilterVehNoCleared,
    FilterDriver,
    handleScanVehNo,
    setVehData,
    handleVehicleNoChange,
    enableScan,
    addBtnClass,
    scanInputRef,
    handleScanInput,
    isScanMode,
    FilterVehNoWrapped,
    vehMAxLen
  } = props;

  const [vehicleSuggestions, setVehicleSuggestions] = useState([]);
  const [disableDropdown, setDisableDropdown] = useState(false);
  const [disableVehicleType, setDisableVehicleType] = useState(false);

  const dispatch: any = useDispatch();

  useEffect(() => {
    if (VehicleTypeList?.length > 0 && !formik.values.VehicleTypeId) {
      formik.setFieldValue("VehicleTypeId", VehicleTypeList[0].MetaSubId);
    }
  }, [VehicleTypeList]);

  // const handleVehicleNoChange = async (e: any) => {
  //   let vehicleNo = e?.value?.VehicleNo || e?.value;
  //   if (!vehicleNo) return;

  //   vehicleNo = vehicleNo.toUpperCase();
  //   formik.setFieldValue("VehicleNo", vehicleNo);

  //   const currentType = tabConfig?.find((t) => t.active)?.type;
  //   const isOutScreen = currentType === 102;

  //   const isNewVehicle = !VehicleNoList?.some(
  //     (v) => v.VehicleNo?.toLowerCase() === vehicleNo.toLowerCase()
  //   );

  //   if (isOutScreen && isNewVehicle) {
  //     const now = new Date();
  //     formik.setFieldValue("ExitTime", now);
  //   }

  //   const vehicleEntries = VehicleNoList?.filter(
  //     (v: any) => v.VehicleNo?.toLowerCase() === vehicleNo.toLowerCase()
  //   );

  //   const hasIn = vehicleEntries?.some(
  //     (v) => v.EntryType === "In" || v.EntryType === 101
  //   );
  //   const hasOut = vehicleEntries?.some(
  //     (v) => v.EntryType === "Out" || v.EntryType === 102
  //   );
  //   const isFullyProcessed = hasIn && hasOut;

  //   const payload = {
  //     VehicleNo: vehicleNo,
  //     VisitorEntryId: e?.value?.VisitorEntryId != null && e?.value?.VisitorEntryId != 0
  //       ?e?.value?.VisitorEntryId : 0,
  //     EntryType: formik?.values?.EntryType
  //   };

  //   try {
  //     let result;

  //     if (e?.value?.VisitorEntryId == 0 || isFullyProcessed) {
  //       result = await dispatch(OnChangeVehicleNo(payload));
  //     } else {
  //       result = await dispatch(OnChangeExistVehicleNo(payload));
  //     }

  //     const hdr = result?.payload?.VisitorEntryHeader;
  //     // if (
  //     //   result?.payload?.tranStatus?.result == true &&
  //     //   result?.payload?.tranStatus?.lstErrorItem.length > 0 &&
  //     //   hdr?.VisitorEntryId != 0 &&
  //     //   hdr?.VisitorEntryId != null
  //     // ) {
  //     //   toast?.current?.show({
  //     //     severity: "success",
  //     //     summary: "Data Found Successfully",
  //     //     detail: result?.payload?.tranStatus?.lstErrorItem[0].Message,
  //     //   });
  //     // }
  //     // if (hdr?.VisitorEntryId == null) {
  //       setVehData(result);
  //     // }
  //   } catch (err: any) {
  //     toast?.current?.show({
  //       severity: "error",
  //       summary: "Error",
  //       detail: err?.message || "Something went wrong.",
  //     });
  //   }
  // };

  return (
    <Formik
      initialValues={visitorEntryForm}
      validationSchema={VisitorEntryValidationSchema}
      onSubmit={formik.handleSubmit}
    >
      <>
        {/* <div className="white"> */}
        {IsVehicleDetailsDisable ? (
          <div className={isView ? "p-disabled" : ""}>
            {/* <div className="widget-body"> */}
            <div className="normal-table">
              <div className="grid">
                <div className="col-12 md:col-9">
                  <div className="grid">
                    <FormFields
                      type={"radiobox"}
                      name={"IsPreBooking"}
                      label={"Is Pre Booking ?"}
                      options={IsPreBookingList}
                      show={false}
                      required={false}
                      disable={isView || isCreate}
                      handleChange={handleIsPreBook}
                      formik={formik}
                      fldStyle={"col-12 md:col-4"}
                    />
                    <FormFields
                      type={"text"}
                      name={"VisitorEntryCode"}
                      label={"Visitor Entry Code "}
                      options={""}
                      show={false}
                      required={false}
                      disable={true}
                      optionLabel={""}
                      optionValue={""}
                      handleSelect={""}
                      fldStyle={"col-12 md:col-4"}
                      formik={formik}
                    />
                    <FormFields
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
                      fldStyle={"col-12 md:col-4"}
                      formik={formik}
                    />
                    <FormFields
                      type={"select"}
                      name={"ChallanType"}
                      label={"Challan Type "}
                      options={ChallanTypeList}
                      show={!IsPartyDisable}
                      required={true}
                      disable={isCreate ? IsPartyDisable : true}
                      optionLabel={"MetaSubDescription"}
                      optionValue={"MetaSubId"}
                      handleSelect={handleSelect}
                      fldStyle={"col-12 md:col-4"}
                      formik={formik}
                    />
                    <FormFields
                      type={"select"}
                      name={"VisitorId"}
                      label={"Visitor Name "}
                      options={VisitorNameList}
                      show={isCurrentCreate ? false : true}
                      disable={isCurrentCreate ? false : true}
                      required={false}
                      optionLabel={"FirstName"}
                      optionValue={"VisitorDetailId"}
                      handleSelect={onChangeVisitor}
                      fldStyle={"col-12 md:col-4"}
                      formik={formik}
                    />
                    <FormFields
                      type={"text"}
                      name={"PersonName"}
                      label={"Visitor Name "}
                      options={""}
                      show={!ShowVisitorContranctor}
                      required={false}
                      disable={isView || !isCurrentCreate}
                      optionLabel={""}
                      optionValue={""}
                      handleSelect={""}
                      fldStyle={"col-12 md:col-4"}
                      formik={formik}
                      maxLength={100}
                    />
                    <FormFields
                      type={"Calendar"}
                      name={"VisitorEntryDate"}
                      label={"Visitor Entry Date"}
                      options={""}
                      show={false}
                      required={false}
                      disable={true}
                      optionLabel={""}
                      optionValue={""}
                      handleChange={handleChange}
                      fldStyle={"col-12 md:col-4"}
                      formik={formik}
                      maxDate={new Date()}
                    />
                    <FormFields
                      type={"select"}
                      name={"VisitedEmployeeId"}
                      label={"Person to Visit"}
                      options={EmployeeList}
                      show={true}
                      required={true}
                      disable={isCurrentCreate ? false : true}
                      optionLabel={"UserName"}
                      optionValue={"UserId"}
                      handleSelect={handleSelect}
                      fldStyle={"col-12 md:col-4"}
                      formik={formik}
                    />
                    <FormFields
                      type={"text"}
                      name={"MobileNo"}
                      label={"Mobile No "}
                      options={""}
                      show={!ShowVisitorContranctor}
                      required={false}
                      disable={isCreate ? ShowVisitorContranctor : true}
                      optionLabel={""}
                      optionValue={""}
                      handleSelect={""}
                      fldStyle={"col-12 md:col-4"}
                      formik={formik}
                      keyfilter="int"
                      maxLength={15}
                      minLength={9}
                    />
                    <FormFields
                      type={"select"}
                      name={"IdProofType"}
                      label={"ID Proof Type "}
                      options={ProofList}
                      show={!ShowVisitorContranctor}
                      required={false}
                      disable={isCreate ? ShowVisitorContranctor : true}
                      optionLabel={"MetaSubDescription"}
                      optionValue={"MetaSubId"}
                      handleSelect={handleSelect}
                      fldStyle={"col-12 md:col-4"}
                      formik={formik}
                    />
                    <FormFields
                      type={"text"}
                      name={"IdProofNo"}
                      label={"ID Proof No "}
                      options={""}
                      show={!ShowVisitorContranctor}
                      required={false}
                      disable={isCreate ? ShowVisitorContranctor : true}
                      optionLabel={""}
                      optionValue={""}
                      handleSelect={""}
                      fldStyle={"col-12 md:col-4"}
                      formik={formik}
                      maxLength="20"
                    />
                    <FormFields
                      type={"multi_select"}
                      name={"AreaToVisit"}
                      label={"Area To Visit "}
                      options={AreaList.filter(
                        (f) => f.PlantId == +localStorage["PlantId"]
                      )}
                      show={true}
                      required={false}
                      disable={isView || !isCreate}
                      optionLabel={"AreaName"}
                      optionValue={"AreaId"}
                      handleSelect={handlePoVSelect}
                      fldStyle={"col-12 md:col-4"}
                      formik={formik}
                    />
                    <FormFields
                      type={"select"}
                      name={"PartyType"}
                      label={"Party Type "}
                      options={PartyTypeList}
                      show={!IsPartyDisable}
                      required={false}
                      disable={isCreate ? IsPartyDisable : true}
                      optionLabel={"MetaSubDescription"}
                      optionValue={"MetaSubId"}
                      handleSelect={OnChangePartyTypes}
                      fldStyle={"col-12 md:col-4"}
                      formik={formik}
                    />
                    <FormFields
                      type={"select"}
                      name={"PartyName"}
                      label={"Party Name "}
                      options={PartyNameList}
                      show={!IsPartyDisable}
                      required={false}
                      disable={isCreate ? IsPartyDisable : true}
                      optionLabel={"RefName"}
                      optionValue={"RefId"}
                      handleSelect={handleSelect}
                      fldStyle={"col-12 md:col-4"}
                      formik={formik}
                    />
                    <FormFields
                      type={"checkbox"}
                      name={"IsAppointmentBooking"}
                      label={"Is Appointment Booking "}
                      options={""}
                      show={false}
                      required={false}
                      disable={isCreate ? CheckboxDisable : true}
                      optionLabel={""}
                      optionValue={""}
                      handleChange={onClickIsAppointmentBooking}
                      fldStyle={"col-12 md:col-4"}
                      formik={formik}
                    />
                    <FormFields
                      type={"Calendar"}
                      name={"ValidFrom"}
                      label={
                        formik.values.VisitorTypeId == 36
                          ? "Valid From"
                          : "Appointment Date"
                      }
                      options={""}
                      show={true}
                      required={true}
                      disable={isCreate ? ValidFromDisable : true}
                      optionLabel={""}
                      optionValue={""}
                      handleChange={onChageFromDate}
                      fldStyle={"col-12 md:col-4"}
                      formik={formik}
                      minDate={new Date()}
                      showTime={true}
                    />
                    <FormFields
                      type={"Calendar"}
                      name={"ValidTo"}
                      label={"Valid To"}
                      options={""}
                      show={!ValidToDisable}
                      required={true}
                      disable={ValidToDisable}
                      optionLabel={""}
                      optionValue={""}
                      handleChange={onChageToDate}
                      fldStyle={"col-12 md:col-4"}
                      formik={formik}
                      minDate={TominDate == null ? new Date() : TominDate}
                      showTime={true}
                    />
                    <FormFields
                      type={"text"}
                      name={"DcNumber"}
                      label={"Dc Number "}
                      options={""}
                      show={!DcNumberDisable}
                      required={false}
                      disable={isCreate ? DcNumberDisable : true}
                      optionLabel={""}
                      optionValue={""}
                      handleSelect={""}
                      fldStyle={"col-12 md:col-4"}
                      formik={formik}
                      maxLength="20"
                    />
                    <FormFields
                      type={"text"}
                      name={"InvoiceNumber"}
                      label={"Invoice Number "}
                      options={""}
                      show={!InvoiceNumberDisable}
                      required={false}
                      disable={isCreate ? InvoiceNumberDisable : true}
                      optionLabel={""}
                      optionValue={""}
                      handleSelect={""}
                      fldStyle={"col-12 md:col-4"}
                      formik={formik}
                      maxLength="20"
                    />
                    <FormFields
                      type={"text"}
                      name={"PoNumber"}
                      label={"Po Number "}
                      options={""}
                      show={!PoNumberDisable}
                      required={false}
                      disable={isCreate ? PoNumberDisable : true}
                      optionLabel={""}
                      optionValue={""}
                      handleSelect={""}
                      fldStyle={"col-12 md:col-4"}
                      formik={formik}
                      maxLength="20"
                    />
                    <FormFields
                      type={"text"}
                      name={"ContainerNumber"}
                      label={"Container Number "}
                      options={""}
                      show={!ContainerNumberDisable}
                      required={false}
                      disable={isCreate ? ContainerNumberDisable : true}
                      optionLabel={""}
                      optionValue={""}
                      handleSelect={""}
                      fldStyle={"col-12 md:col-4"}
                      formik={formik}
                      maxLength="20"
                    />
                    <FormFields
                      type={"select"}
                      name={"Status"}
                      label={"Status "}
                      options={StatusList}
                      show={false}
                      required={false}
                      disable={true}
                      optionLabel={"MetaSubDescription"}
                      optionValue={"MetaSubId"}
                      handleSelect={handleSelect}
                      fldStyle={"col-12 md:col-4"}
                      formik={formik}
                    />
                    <FormFields
                      type={""}
                      name={""}
                      label={""}
                      options={""}
                      show={formik.values.VisitorTypeId == 66}
                      required={false}
                      disable={true}
                      optionLabel={""}
                      optionValue={""}
                      handleSelect={""}
                      fldStyle={"col-12 md:col-4"}
                      formik={formik}
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
                      fldStyle={"col-12 md:col-4"}
                      filter={true}
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
                      fldStyle={"col-12 md:col-4"}
                      maxLength="500"
                      style={{
                        minHeight: "50px",
                        maxHeight: "50px",
                        overflowY: "auto",
                      }}
                    />
                  </div>
                </div>
                <PhotoCapture
                  onUpload={onUpload}
                  ImageUrl={imageUrl}
                  isView={isView || !isCreate}
                  cameraOff={cameraOff}
                  setCameraOff={setCameraOff}
                  isExternal={0}
                  fldStyle={`col-12 md:col-3 text-center`}
                  toast={toast}
                />
              </div>
            </div>
            {/* </div> */}
            {/* </div> */}
          </div>
        ) : (
          <div hidden={IsVehicleDetailsDisable}>
            <div className={isView ? "p-disabled" : ""}>
              <div className="normal-table flex">
                <div className="grid pl-2 pr-4">
                  <FormFields
                    type={"radiobox"}
                    name={"VehicleTypeId"}
                    label={"Vehicle Type "}
                    options={VehicleTypeList}
                    show={changeField["VehicleTypeId"]?.show}
                    required={changeField["VehicleTypeId"]?.required}
                    disable={changeField["VehicleTypeId"]?.enable}
                    optionLabel={"MetaSubDescription"}
                    optionValue={"MetaSubId"}
                    handleChange={onChangeVehicleType}
                    fldStyle={`col-12 md:col-12
                    `}
                    formik={formik}
                  />
                  <FormFields
                    type={"autocomplete_btn"}
                    name={"VehicleNo"}
                    label={"Vehicle No"}
                    show={changeField["VehicleNo"]?.show}
                    required={true}
                    disable={changeField["VehicleNo"]?.disable}
                    fldStyle={"col-12 md:col-3"}
                    formik={formik}
                    // autoCompleteRef={autoCompleteRef}
                    autoSuggestions={disableDropdown ? [] : VehicleNoList}
                    autoCompleteLbl={"VehicleNo"}
                    field={"VehicleNo"}
                    maxLength={vehMAxLen}
                    placeHolder={"Please Enter Vehicle No"}
                    OnClear={FilterVehNoCleared}
                    autoFocus={true}
                    forceSelection={false}
                    autoSearch={FilterVehNoWrapped}
                    handleChange={handleVehicleNoChange}
                    // onKeyDown={isScanMode ? FilterVehNoWrapped : undefined}
                    inputRef={autoCompleteRef}
                    addBtnEve={enableScan}
                    addBtnClass={addBtnClass}
                    readOnly={false}
                  />
                  {/* <input
                    ref={scanInputRef}
                    type="text"
                    style={{
                      position: "absolute",
                      opacity: 0,
                      height: 0,
                      width: 0,
                      pointerEvents: "none"
                    }}
                    onInput={handleScanInput}
                    autoFocus
                  /> */}

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
                    type={"autocomplete"}
                    name={"DriverName"}
                    label={"Driver "}
                    options={""}
                    show={changeField["DriverName"]?.show}
                    required={false}
                    disable={changeField["DriverName"]?.disable}
                    optionLabel={""}
                    optionValue={""}
                    handleSelect={""}
                    handleChange={(e) =>
                      OnChangeDriver("DriverName", {}, e.value)
                    }
                    fldStyle={"col-12 md:col-3"}
                    formik={formik}
                    autoSearch={FilterDriver}
                    autoCompleteRef={autoCompleteRef}
                    autoSuggestions={DriverList}
                    autoCompleteLbl={"UserName"}
                    field={"UserId"}
                    maxLength={30}
                    placeHolder={"Please Enter Driver"}
                    OnClear={FilterVehNoCleared}
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
                    type={"number"}
                    name={"NumberOfPassengers"}
                    label={"No.Of Passengers "}
                    options={""}
                    show={changeField["NumberOfPassengers"]?.show}
                    required={changeField["NumberOfPassengers"]?.required}
                    disable={changeField["NumberOfPassengers"]?.disable}
                    optionLabel={""}
                    optionValue={""}
                    handleSelect={""}
                    fldStyle={"col-12 md:col-3"}
                    formik={formik}
                    keyfilter={"int"}
                    maxLength={5}
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
                    maxLength={20}
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
                    maxLength={20}
                  />
                  <FormFields
                    type={"select"}
                    name={"PurposeOfVisit"}
                    label={"Purpose Of Visit "}
                    options={PurposeList}
                    show={changeField["PurposeOfVisit"]?.show}
                    required={changeField["PurposeOfVisit"]?.required}
                    disable={changeField["PurposeOfVisit"]?.disable}
                    optionLabel={"MetaSubDescription"}
                    optionValue={"MetaSubId"}
                    handleSelect={handleSelect}
                    formik={formik}
                    fldStyle={"col-12 md:col-3"}
                    filter={true}
                  />

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
                    show={changeField["VisitorRemarks"]?.show}
                    required={changeField["VisitorRemarks"]?.required}
                    disable={
                      changeField["VisitorRemarks"]?.disable ||
                      isView ||
                      !isCreate
                    }
                    optionLabel={""}
                    optionValue={""}
                    handleSelect={""}
                    formik={formik}
                    fldStyle={"col-12 md:col-6"}
                    maxLength="500"
                    style={{
                      minHeight: "50px",
                      maxHeight: "50px",
                      overflowY: "auto",
                    }}
                  />
                </div>

                <div
                  className={`grid ${
                    formik?.values?.VehicleTypeId == 128 ? "hidden" : ""
                  }`}
                >
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
                        refTableDisable={refTableDisable}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    </Formik>
  );
};
export const VisitorEntryBelongingDetailForm = (props) => {
  const {
    VisitorEntryBelongingDetailList,
    isView,
    setVisitorEntryBelongingDetailList,
    toast,
    isCreate,
  } = props;
  const AddAndDeleteTemplate: React.FC<any> = (rowData) => {
    const index = VisitorEntryBelongingDetailList.indexOf(rowData);
    const handleAddRow = () => {
      let isexist: any[] = VisitorEntryBelongingDetailList.filter(
        (f) => f.DeviceName == "" || f.DeviceNo == ""
      );
      if (isexist.length > 0) {
        toast?.current?.show({
          severity: "warn",
          detail: "Please Enter Device Name And No.",
          summary: "Warning Message",
        });
        return;
      }
      const newObj = {
        VisitorEntryBelongingDetailId: 0,
        VisitorEntryId: 0,
        DeviceNo: "",
        DeviceName: "",
      };
      setVisitorEntryBelongingDetailList([
        ...VisitorEntryBelongingDetailList,
        newObj,
      ]);
    };
    const handleDeleteRow = () => {
      const updatedgridData = [...VisitorEntryBelongingDetailList];
      updatedgridData.splice(index, 1);
      if (updatedgridData.length == 0) {
        const newObj = {
          VisitorEntryBelongingDetailId: 0,
          VisitorEntryId: 0,
          DeviceNo: "",
          DeviceName: "",
        };
        setVisitorEntryBelongingDetailList([newObj]);
      } else {
        setVisitorEntryBelongingDetailList(updatedgridData);
      }
    };
    return (
      <>
        <Button
          label=""
          severity="success"
          title="Add"
          icon="las la-plus"
          className="mr-2 p-1"
          onClick={handleAddRow}
          disabled={isView || !isCreate}
        />
        <Button
          label=""
          severity="danger"
          title="Delete"
          icon="las la-times"
          className="mr-2 p-1"
          onClick={handleDeleteRow}
          disabled={isView || !isCreate}
        />
      </>
    );
  };
  const handleInputChange = (event, rowData, rowIndex) => {
    const updatedData = [...VisitorEntryBelongingDetailList];
    updatedData[rowIndex.rowIndex][rowIndex.field] = event.target.value;
    setVisitorEntryBelongingDetailList(updatedData);
  };
  const textEditor = (rowData, rowIndex) => {
    return (
      <InputText
        className="w-full"
        value={rowData[rowIndex.field]}
        onChange={(e: any) => {
          handleInputChange(e, rowData, rowIndex);
        }}
        maxLength={50}
        disabled={isView || !isCreate}
      />
    );
  };

  return (
    <>
      <div className="sub-title">
        <div className="grid">
          <div className="col-12">
            <h2>Belongings</h2>
          </div>
        </div>
      </div>
      <div className="normal-table">
        {/* <div className="card"> */}
        <DataTable
          value={VisitorEntryBelongingDetailList}
          showGridlines
          paginator
          filterDisplay="menu"
          globalFilterFields={[
            "VisitorName",
            "DepartMentName",
            "Dob",
            "MobileNo",
            "MailId",
            "IdCardTypeName",
            "IdCardNo",
            "StatusName",
          ]}
          emptyMessage="No Data found."
          editMode="cell"
          rows={5}
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Entries"
          paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
          tableStyle={{ minWidth: "50rem" }}
        >
          <Column
            field="Action"
            header="Action"
            style={{ width: "15%", textAlign: "center" }}
            body={AddAndDeleteTemplate}
          />
          <Column
            field="DeviceName"
            header="Property Name"
            style={{ width: "25%" }}
            body={(rowData, rowIndex) => textEditor(rowData, rowIndex)}
          />
          <Column
            field="DeviceNo"
            header="No Of Count"
            style={{ width: "25%" }}
            body={(rowData, rowIndex) => textEditor(rowData, rowIndex)}
          />
        </DataTable>
        {/* </div> */}
      </div>
    </>
  );
};
export const VisitorEntryRefDetailForm = (props) => {
  const {
    VisitorEntryRefDetailList,
    setVisitorEntryRefDetailList,
    isView,
    toast,
    RefTypeList,
    isCreate,
    refTableDisable,
  } = props;

  const AddAndDeleteTemplate: React.FC<any> = (rowData) => {
    const index = VisitorEntryRefDetailList.indexOf(rowData);
    const handleAddRow = () => {
      let isexist: any[] = VisitorEntryRefDetailList.filter(
        (f) => f.RefValue == "" || f.RefTypeId == null
      );
      if (isexist.length > 0) {
        toast?.current?.show({
          severity: "warn",
          detail: "Please Select Reference Type and Reference Value",
          summary: "Warning Message",
        });
        return;
      }
      const newObj = {
        VisitorEntryRefDetailId: 0,
        VisitorEntryId: 0,
        RefTypeId: null,
        RefValue: "",
        adisable: false,
        ddisable: false,
        idisable: false,
        cdisable: false,
        show: true,
      };
      setVisitorEntryRefDetailList([...VisitorEntryRefDetailList, newObj]);
    };
    const handleDeleteRow = () => {
      const updatedgridData = [...VisitorEntryRefDetailList];
      updatedgridData.splice(index, 1);
      let matobj: any = {};
      matobj.VisitorEntryRefDetailId = 0;
      matobj.VisitorEntryId = 0;
      (matobj.RefTypeId = null),
        (matobj.RefValue = ""),
        setVisitorEntryRefDetailList(matobj);
      if (updatedgridData.length == 0) {
        const newObj = {
          VisitorEntryRefDetailId: 0,
          VisitorEntryId: 0,
          RefTypeId: null,
          RefValue: "",
          adisable: false,
          ddisable: false,
          idisable: false,
          cdisable: false,
          show: true,
        };
        setVisitorEntryRefDetailList([newObj]);
      } else {
        setVisitorEntryRefDetailList(updatedgridData);
      }
    };
    return (
      <>
        <Button
          label=""
          severity="success"
          title="Add"
          icon="las la-plus"
          className={`mr-2 p-1 ${rowData?.adisable ? "p-disabled" : ""} ${
            rowData?.show ? "" : "hidden"
          }`}
          onClick={handleAddRow}
          disabled={isView || !isCreate}
        />
        <Button
          label=""
          severity="danger"
          title="Delete"
          icon="las la-times"
          className={`mr-2 p-1 ${rowData?.cdisable ? "p-disabled" : ""} ${
            rowData?.show ? "" : "hidden"
          }`}
          onClick={handleDeleteRow}
          disabled={isView || !isCreate}
        />
      </>
    );
  };
  const handleDropdownChange = (event, rowData, rowIndex) => {
    let alreadyexists = VisitorEntryRefDetailList.find(
      (f) => f.RefTypeId == event.target.value
    );
    if (alreadyexists) {
      toast?.current?.show({
        severity: "warn",
        summary: "Warning Message",
        detail: "Reference Type Already Exists.",
      });
      return;
    }
    const updatedData = [...VisitorEntryRefDetailList];
    updatedData[rowIndex.rowIndex][rowIndex.field] = event.target.value;
    setVisitorEntryRefDetailList(updatedData);
  };
  const handleInputChange = (event, rowData, rowIndex) => {
    const updatedData = [...VisitorEntryRefDetailList];
    updatedData[rowIndex.rowIndex][rowIndex.field] = event.target.value;
    setVisitorEntryRefDetailList(updatedData);
  };
  const selectEditor = (rowData, rowIndex) => {
    return (
      <Dropdown
        value={rowData[rowIndex.field]}
        options={RefTypeList}
        optionLabel={"MetaSubDescription"}
        optionValue={"MetaSubId"}
        className={`w-full ${rowData?.ddisable ? "p-disabled" : ""}`}
        onChange={(e) => handleDropdownChange(e, rowData, rowIndex)}
        filter={true}
        disabled={isView || !isCreate}
      />
    );
  };
  const textEditor = (rowData, rowIndex) => {
    return (
      <InputText
        className={`w-full ${rowData?.idisable ? "p-disabled" : ""}`}
        value={rowData[rowIndex.field]}
        onChange={(e: any) => {
          handleInputChange(e, rowData, rowIndex);
        }}
        maxLength={20}
        disabled={
          isView ||
          !isCreate ||
          rowData["RefTypeId"] == null ||
          rowData["RefTypeId"] == ""
        }
      />
    );
  };
  return (
    <div className="widget-body">
      <div className="normal-table">
        <div className="page-title">
          <div className="grid grid-nogutter">
            <div className="md:col-6 mb-2">
              <h2>Reference Details</h2>
            </div>
          </div>
        </div>
        <div className="card">
          <DataTable
            value={VisitorEntryRefDetailList}
            showGridlines
            paginator
            filterDisplay="menu"
            globalFilterFields={[]}
            emptyMessage="No Data found."
            editMode="cell"
            rows={5}
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Entries"
            paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            tableStyle={{ minWidth: "40rem" }}
            className={refTableDisable ? "p-disabled" : ""}
          >
            <Column
              field="Action"
              header="Action"
              style={{ width: "15%" }}
              body={AddAndDeleteTemplate}
            />
            <Column
              field="RefTypeId"
              header="Reference Type"
              style={{ width: "25%" }}
              body={(rowData, rowIndex) => selectEditor(rowData, rowIndex)}
            />
            <Column
              field="RefValue"
              header="Reference No"
              style={{ width: "25%" }}
              body={(rowData, rowIndex) => textEditor(rowData, rowIndex)}
            />
          </DataTable>
        </div>
      </div>
    </div>
  );
};

export const VisitorEntryMaterialDetailForm = (props) => {
  const {
    VisitorEntryMaterialDetailList,
    setVisitorEntryMaterialDetailList,
    isView,
    toast,
    MaterialList,
    isCreate,
  } = props;
  const AddAndDeleteTemplate: React.FC<any> = (rowData) => {
    const index = VisitorEntryMaterialDetailList.indexOf(rowData);
    const handleAddRow = () => {
      let isexist: any[] = VisitorEntryMaterialDetailList.filter(
        (f) => f.MaterialId == null || f.Qty == ""
      );
      if (isexist.length > 0) {
        toast?.current?.show({
          severity: "warn",
          detail: "Please Enter Device Name And No.",
          summary: "Warning Message",
        });
        return;
      }
      const newObj = {
        VisitorEntryMaterialDetailId: 0,
        VisitorEntryId: 0,
        MaterialId: null,
        Uom: null,
        Qty: "",
      };
      setVisitorEntryMaterialDetailList([
        ...VisitorEntryMaterialDetailList,
        newObj,
      ]);
    };
    const handleDeleteRow = () => {
      const updatedgridData = [...VisitorEntryMaterialDetailList];
      updatedgridData.splice(index, 1);
      let matobj: any = {};
      matobj.VisitorEntryMaterialDetailId = 0;
      matobj.VisitorEntryId = 0;
      matobj.MaterialId = 0;
      matobj.Uom = 0;
      matobj.Qty = "";
      setVisitorEntryMaterialDetailList(matobj);
      if (updatedgridData.length == 0) {
        const newObj = {
          VisitorEntryMaterialDetailId: 0,
          VisitorEntryId: 0,
          MaterialId: null,
          Uom: null,
          Qty: "",
        };
        setVisitorEntryMaterialDetailList([newObj]);
      } else {
        setVisitorEntryMaterialDetailList(updatedgridData);
      }
    };
    return (
      <>
        <Button
          label=""
          severity="success"
          title="Add"
          icon="las la-plus"
          className="mr-2 p-1"
          onClick={handleAddRow}
          disabled={isView || !isCreate}
        />
        <Button
          label=""
          severity="danger"
          title="Delete"
          icon="las la-times"
          className="mr-2 p-1"
          onClick={handleDeleteRow}
          disabled={isView || !isCreate}
        />
      </>
    );
  };
  const handleDropdownChange = (event, rowData, rowIndex) => {
    let alreadyexists = VisitorEntryMaterialDetailList.find(
      (f) => f.MaterialId == event.target.value
    );
    if (alreadyexists) {
      toast?.current?.show({
        severity: "warn",
        summary: "Warning Message",
        detail: "Material Already Exists.",
      });
      return;
    }
    const updatedData = [...VisitorEntryMaterialDetailList];
    updatedData[rowIndex.rowIndex][rowIndex.field] = event.target.value;
    updatedData[rowIndex.rowIndex]["Uom"] = MaterialList.find(
      (f) => f.MaterialId == event.target.value
    ).Uom;
    setVisitorEntryMaterialDetailList(updatedData);
  };
  const handleInputChange = (event, rowData, rowIndex) => {
    const updatedData = [...VisitorEntryMaterialDetailList];
    updatedData[rowIndex.rowIndex][rowIndex.field] = event.target.value;
    setVisitorEntryMaterialDetailList(updatedData);
  };
  const selectEditor = (rowData, rowIndex) => {
    return (
      <Dropdown
        value={rowData[rowIndex.field]}
        options={MaterialList}
        optionLabel={"MaterialName"}
        optionValue={"MaterialId"}
        className="w-full"
        onChange={(e) => handleDropdownChange(e, rowData, rowIndex)}
        filter={true}
        disabled={isView || !isCreate}
      />
    );
  };
  const textEditor = (rowData, rowIndex) => {
    return (
      <InputText
        className="w-full"
        keyfilter="int"
        value={rowData[rowIndex.field]}
        onChange={(e: any) => {
          handleInputChange(e, rowData, rowIndex);
        }}
        maxLength={10}
        disabled={isView || !isCreate}
      />
    );
  };
  return (
    <div className="widget-body">
      <div className="normal-table">
        <div className="page-title">
          <div className="grid grid-nogutter">
            <div className="md:col-6">
              <h1>Material Details</h1>
            </div>
          </div>
        </div>
        <div className="card">
          <DataTable
            value={VisitorEntryMaterialDetailList}
            showGridlines
            paginator
            filterDisplay="menu"
            globalFilterFields={[]}
            emptyMessage="No Data found."
            editMode="cell"
            rows={5}
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Entries"
            paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            tableStyle={{ minWidth: "50rem" }}
          >
            <Column
              field="Action"
              header="Action"
              style={{ width: "15%" }}
              body={AddAndDeleteTemplate}
            />
            <Column
              field="MaterialId"
              header="Material Name"
              style={{ width: "25%" }}
              body={(rowData, rowIndex) => selectEditor(rowData, rowIndex)}
            />
            <Column
              field="Qty"
              header="Qty"
              style={{ width: "25%" }}
              body={(rowData, rowIndex) => textEditor(rowData, rowIndex)}
            />
          </DataTable>
        </div>
      </div>
    </div>
  );
};
export const VisitorEntryDetailForm = (props) => {
  const { visitorEntryDetailList, IsWorkerDetailsShow, isView } = props;
  const DocumentHyperLink: any = (rowData: any) => {
    return (
      <a style={{ color: "blue" }} href={rowData.DocumentUrl} target="_blank">
        {rowData.DocumentName}
      </a>
    );
  };
  return (
    <div className="white" hidden={!IsWorkerDetailsShow}>
      <div className={isView ? "p-disabled" : ""}>
        <div className="widget-body">
          <div className="normal-table">
            <div className="page-title">
              <div className="grid grid-nogutter">
                <div className="md:col-6">
                  <h1>Worker Detail</h1>
                </div>
              </div>
            </div>
            <div className="card">
              <DataTable
                value={visitorEntryDetailList}
                showGridlines
                paginator
                filterDisplay="menu"
                globalFilterFields={[
                  "VisitorName",
                  "DepartMentName",
                  "Dob",
                  "MobileNo",
                  "MailId",
                  "IdCardTypeName",
                  "IdCardNo",
                  "StatusName",
                ]}
                emptyMessage="No Data found."
                rows={5}
                rowsPerPageOptions={[5, 10, 25, 50, 100]}
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Entries"
                paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                tableStyle={{ minWidth: "50rem" }}
              >
                <Column field="VisitorName" header="Worker Name"></Column>
                <Column
                  field="DepartMentName"
                  header="Department Name"
                ></Column>
                <Column field="ShowDate" header="Date Of Birth"></Column>
                <Column field="MailId" header="Mail ID"></Column>
                <Column field="MobileNo" header="Mobile No"></Column>
                <Column field="IdCardTypeName" header="ID Card Type"></Column>
                <Column field="IdCardNo" header="ID Card No"></Column>
                <Column
                  header="Document"
                  body={(e) => DocumentHyperLink(e)}
                ></Column>
                <Column field="StatusName" header="Status"></Column>
              </DataTable>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CVisitorEntryCreator = (props) => {
  const visEntryRef = useRef(null);
  const {
    toast,
    visitorEntryFormik,
    isCreate,
    isView,
    loading,
    selectedData,
    VisitorNameList,
    setVisitorEntryBelongingDetailList,
    setList,
    visitorEntryForm,
    VisitorEntryValidationSchema,
    onUpload,
    itemTemplate,
    imageUrl,
    IsPreBookingList,
    VisitorTypeList,
    onChangeVisitorType,
    handleSelect,
    autoCompleteRef,
    OnSelectVisitorCode,
    onChangeMatType,
    filteritemType,
    handleIsPreBook,
    VECodeDisable,
    EmployeeList,
    onChangeVisitor,
    ProofList,
    onClickIsAppointmentBooking,
    ValidFromDisable,
    ValidToDisable,
    onChageFromDate,
    TominDate,
    CheckboxDisable,
    onClickIsExistingVehicle,
    HideVehicleDD,
    HideDriverDD,
    onUploadDocument,
    documentUrl,
    onClickIsExistingDriver,
    OnChangePartyTypes,
    PartyTypeList,
    PartyNameList,
    AreaList,
    RouteList,
    DriverList,
    VehicleList,
    IsDeliveryChallan,
    IsInvoiceBased,
    IsVehicleTripBased,
    IsPartyDisable,
    IsVehicleDetailsDisable,
    ShowVisitorContranctor,
    IsMaterialDetailsShow,
    InvoiceNumberDisable,
    DcNumberDisable,
    PoNumberDisable,
    ContainerNumberDisable,
    StatusList,
    OnChangeVehicle,
    onChageToDate,
    deleteDocuments,
    handleHyperlink,
    cameraOff,
    setCameraOff,
    handleChange,
    handleRouteSelect,
    initFldDisable,
    CreatePageOnLoadCVisitorEntry,
    resetAllForm,
    IsBelongingDetailsShow,
    VisitorEntryBelongingDetailList,
    VisitorEntryMaterialDetailList,
    setVisitorEntryMaterialDetailList,
    MaterialList,
    PurposeList,
    ChallanTypeList,
    IsdisableSave,
    IsDisableClear,
    handlePoVSelect,
    setCheckedVehicle,
    checkedVehicle,
    setVisitorShow,
    fetchAllData,
    visType,

    isViewVM,
    isCreateVM,
    VisitorTypeListVM,
    handleSelectVM,
    TitleListVM,
    CountryListVM,
    OnchangecountryVM,
    StateListVM,
    OnchangestateVM,
    CityListVM,
    IdCardListVM,
    StatusListVM,
    onUploadVM,
    itemTemplateVM,
    imageUrlVM,
    handleOnChangeVM,
    visitorFormVM,
    visitorRefVM,
    visitorFormikVM,
    onChangeVisitorTypeVM,
    tempStateListVM,
    tempCityListVM,
    handleCloseImageVM,
    handleChangeVM,
    profUploadRefVM,
    VisitorhandleHyperlinkVM,
    onUploadDocumentVisitorVM,
    deleteDocumentsVisitorVM,
    documentUrlVisitorVM,
    documentVisitorUploadRefVM,
    visitorDetailListVM,
    filtersVM,
    TableHeaderVM,
    DepartmentListVM,
    OnClearVM,
    visitorDetailFormVM,
    visitorDetailRefVM,
    setVisitorDetailListVM,
    documentUrlVM,
    onUploadDocumentVM,
    disableFormVM,
    onRowSelectVM,
    toastVM,
    deleteDocumentsVM,
    handleHyperlinkVM,
    handleDChangeVM,
    documentUploadRefVM,
    WorkSeverityListVM,
    loadingVM,
    handleDSelectVM,
    visitorDFormikVM,
    saveVisitor,
    setCreateVisEnt,
    createVisEnt,
    VisType,
    isCurrentCreate,
    onChangeVehicleType,
    checkControl,
    changeField,
    onCheckboxChange,
    VisitorEntryRefDetailList,
    setVisitorEntryRefDetailList,
    VehicleNoList,
    RefTypeList,
    setRefTypeList,
    checkVehAction,
    resetAllVehForm,
    clearForm,
    VehicleTypeList,
    OnChangeVehNo,
    OnChangeDriver,
    FilterDriver,
    FilterVehNo,
    FilterVehNoCleared,
    refTableDisable,
    switchDisable,
    changeEntryType,
    handleMobKeyPress,
    handleMobBack,
    setVehData,
    onChangeVeh,
    selectedVeh,
    setSelectedVeh,
    handleVehicleNoChange,
    enableScan,
    addBtnClass,
    isScanMode,
    handleScanInput,
    scanInputRef,
    FilterVehNoWrapped,
    vehMAxLen,
    vehicleNoInputRef
  } = props;

  const vehicleNoRef = useRef(null);

  const [isScanning, setIsScanning] = useState(false);
  const scanTimeout = useRef<any>(null);
  const lastKeyTime = useRef(0);

  const handleScanVehNo = (e) => {
      if (isScanMode) {
      
      const allowedKeys = ["Enter", "Tab"];
      const isControl = allowedKeys.includes(e.key);

      if (!isControl && e.key.length === 1) {
        e.preventDefault();
        return
      }
    }

    // const currentTime = new Date().getTime();

    // if (currentTime - lastKeyTime.current < 50) {
    //   setIsScanning(true);
    //   clearTimeout(scanTimeout.current);
    //   scanTimeout.current = setTimeout(() => {
    //     setIsScanning(false);
    //   }, 300);
    // } else {
    //   setIsScanning(false);
    // }

    // lastKeyTime.current = currentTime;
  };

  useEffect(() => {
    pageLoadScript();
  });

  useEffect(() => {
    if (isCreate == false) {
      setList();
    } else {
      if (selectedData?.selectedType != 66) {
        CreatePageOnLoadCVisitorEntry(0);
      }
    }
  }, []);

  return (
    <div ref={visEntryRef}>
      {!IsVehicleDetailsDisable ? (
        <div className="white appointment-hdr">
          <>
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
                            visitorEntryFormik?.values?.EntryType == 102
                              ? true
                              : false
                          }
                          name={"EntryType"}
                          onChange={(e) => {
                            changeEntryType(e);
                          }}
                          disabled={switchDisable}
                        />
                      </td>
                      <td style={{ width: "50%" }}>In</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </>
        </div>
      ) : null}
      <div className="white">
        <div className="widget-hdr">
          <div className="sub-title">
            <div className="grid">
              <div className="col-12 flex">
                <h2>
                  {!IsVehicleDetailsDisable
                    ? "Vehicle Information"
                    : "Visitor Entry"}
                </h2>
              </div>
            </div>
          </div>
        </div>
        <div className="widget-body">
          {!loading ? (
            <>
              <VisitorEntryForm
                visitorEntryForm={visitorEntryForm}
                VisitorEntryValidationSchema={VisitorEntryValidationSchema}
                formik={visitorEntryFormik}
                onUpload={onUpload}
                itemTemplate={itemTemplate}
                isView={isView}
                imageUrl={imageUrl}
                IsPreBookingList={IsPreBookingList}
                VisitorTypeList={VisitorTypeList}
                onChangeVisitorType={onChangeVisitorType}
                isCreate={isCreate}
                handleSelect={handleSelect}
                autoCompleteRef={autoCompleteRef}
                OnSelectVisitorCode={OnSelectVisitorCode}
                onChangeMatType={onChangeMatType}
                filteritemType={filteritemType}
                VisitorNameList={VisitorNameList}
                handleIsPreBook={handleIsPreBook}
                VECodeDisable={VECodeDisable}
                EmployeeList={EmployeeList}
                onChangeVisitor={onChangeVisitor}
                ProofList={ProofList}
                vehicleNoRef={vehicleNoRef}
                onClickIsAppointmentBooking={onClickIsAppointmentBooking}
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
                DriverList={DriverList}
                VehicleList={VehicleList}
                PurposeList={PurposeList}
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
                ChallanTypeList={ChallanTypeList}
                OnChangeVehicle={OnChangeVehicle}
                onChageToDate={onChageToDate}
                deleteDocuments={deleteDocuments}
                handleHyperlink={handleHyperlink}
                cameraOff={cameraOff}
                setCameraOff={setCameraOff}
                handleChange={handleChange}
                handleRouteSelect={handleRouteSelect}
                initFldDisable={initFldDisable}
                IsdisableSave={IsdisableSave}
                handlePoVSelect={handlePoVSelect}
                setCheckedVehicle={setCheckedVehicle}
                checkedVehicle={checkedVehicle}
                createVisEnt={createVisEnt}
                setCreateVisEnt={setCreateVisEnt}
                isCurrentCreate={isCurrentCreate}
                toast={toast}
                onChangeVehicleType={onChangeVehicleType}
                checkControl={checkControl}
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
                OnChangeVehNo={OnChangeVehNo}
                OnChangeDriver={OnChangeDriver}
                FilterVehNo={FilterVehNo}
                FilterVehNoCleared={FilterVehNoCleared}
                FilterDriver={FilterDriver}
                refTableDisable={refTableDisable}
                handleScanVehNo={handleScanVehNo}
                setVehData={setVehData}
                onChangeVeh={onChangeVeh}
                handleVehicleNoChange={handleVehicleNoChange}
                enableScan={enableScan}
                addBtnClass={addBtnClass}
                scanInputRef={scanInputRef}
                handleScanInput={handleScanInput}
                isScanMode={isScanMode}
                FilterVehNoWrapped={FilterVehNoWrapped}
                vehMAxLen={vehMAxLen}
                vehicleNoInputRef={vehicleNoInputRef}
              />

              {IsVehicleDetailsDisable && isCurrentCreate ? (
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
                  OnchangecountryVM={OnchangecountryVM}
                  StateListVM={StateListVM}
                  OnchangestateVM={OnchangestateVM}
                  CityListVM={CityListVM}
                  IdCardListVM={IdCardListVM}
                  StatusListVM={StatusListVM}
                  onUploadVM={onUploadVM}
                  itemTemplateVM={itemTemplateVM}
                  imageUrlVM={imageUrlVM}
                  handleOnChangeVM={handleOnChangeVM}
                  visitorFormVM={visitorFormVM}
                  OnChangeVehNo={OnChangeVehNo}
                  visitorRefVM={visitorRefVM}
                  visitorFormikVM={visitorFormikVM}
                  onChangeVisitorTypeVM={onChangeVisitorTypeVM}
                  tempStateListVM={tempStateListVM}
                  tempCityListVM={tempCityListVM}
                  handleCloseImageVM={handleCloseImageVM}
                  handleChangeVM={handleChangeVM}
                  profUploadRefVM={profUploadRefVM}
                  VisitorhandleHyperlinkVM={VisitorhandleHyperlinkVM}
                  onUploadDocumentVisitorVM={onUploadDocumentVisitorVM}
                  deleteDocumentsVisitorVM={deleteDocumentsVisitorVM}
                  documentUrlVisitorVM={documentUrlVisitorVM}
                  documentVisitorUploadRefVM={documentVisitorUploadRefVM}
                  visitorDetailListVM={visitorDetailListVM}
                  filtersVM={filtersVM}
                  TableHeaderVM={TableHeaderVM}
                  DepartmentListVM={DepartmentListVM}
                  OnClearVM={OnClearVM}
                  visitorDetailFormVM={visitorDetailFormVM}
                  visitorDetailRefVM={visitorDetailRefVM}
                  setVisitorDetailListVM={setVisitorDetailListVM}
                  documentUrlVM={documentUrlVM}
                  onUploadDocumentVM={onUploadDocumentVM}
                  disableFormVM={disableFormVM}
                  onRowSelectVM={onRowSelectVM}
                  toastVM={toastVM}
                  deleteDocumentsVM={deleteDocumentsVM}
                  handleHyperlinkVM={handleHyperlinkVM}
                  handleDChangeVM={handleDChangeVM}
                  documentUploadRefVM={documentUploadRefVM}
                  WorkSeverityListVM={WorkSeverityListVM}
                  loadingVM={loadingVM}
                  handleDSelectVM={handleDSelectVM}
                  visitorDFormikVM={visitorDFormikVM}
                  VisType={VisType}
                  isCurrentCreate={isCurrentCreate}
                  handleMobKeyPress={handleMobKeyPress}
                  handleMobBack={handleMobBack}
                />
              ) : null}
              <div className="col-12 flex flex-row gap-3 md:col-12">
                <div hidden={!IsBelongingDetailsShow}>
                  <div
                    className={isView ? "p-disabled" : ""}
                    hidden={!IsBelongingDetailsShow}
                  >
                    <VisitorEntryBelongingDetailForm
                      VisitorEntryBelongingDetailList={
                        VisitorEntryBelongingDetailList
                      }
                      setVisitorEntryBelongingDetailList={
                        setVisitorEntryBelongingDetailList
                      }
                      isView={isView}
                      isCreate={isCreate}
                      toast={toast}
                      IsBelongingDetailsShow={IsBelongingDetailsShow}
                    />
                  </div>
                </div>
                <div className="white col-6" hidden={!IsMaterialDetailsShow}>
                  <div className={isView ? "p-disabled" : ""}>
                    <VisitorEntryMaterialDetailForm
                      VisitorEntryMaterialDetailList={
                        VisitorEntryMaterialDetailList
                      }
                      setVisitorEntryMaterialDetailList={
                        setVisitorEntryMaterialDetailList
                      }
                      isView={isView}
                      isCreate={isCreate}
                      toast={toast}
                      MaterialList={MaterialList}
                      IsMaterialDetailsShow={IsMaterialDetailsShow}
                    />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <AppProgressSpinner />
          )}
        </div>

        <div className="widget-ftr text-center">
          <Button
            label="Save"
            title="Save"
            icon="pi pi-save"
            type="submit"
            disabled={isView || IsdisableSave}
            onClick={
              VisType != 66 ? saveVisitor : visitorEntryFormik.handleSubmit
            }
          />

          <Button
            label="Clear"
            title="Clear"
            icon="pi pi-times-circle"
            severity="danger"
            className="preview-close"
            disabled={isView || isCreate === false || IsDisableClear}
            onClick={() => {
              if (selectedData?.selectedType === 66) {
                clearForm();
              } else {
                resetAllForm();
              }
              CreatePageOnLoadCVisitorEntry(0);
            }}
          />
        </div>
      </div>
    </div>
  );
};
export default CVisitorEntryCreator;
