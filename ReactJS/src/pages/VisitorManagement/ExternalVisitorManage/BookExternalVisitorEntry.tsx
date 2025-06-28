import AppAlert from "@/alert/alert";
import {
  Column,
  DataTable,
  Dropdown,
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
import { checkAuthTrial } from "@/redux/slices/common/authSlice";

export const VisitorEntryForm = (props) => {
  const {
    visitorEntryForm,
    VisitorEntryValidationSchema,
    formik,
    pageType,
    onUpload,
    itemTemplate,
    isView,
    imageUrl,
    IsPreBookingList,
    VisitorTypeList,
    onChangeVisitorType,
    isCreate,
    handleSelect,
    autoCompleteRef,
    OnSelectVisitorCode,
    onChangeMatType,
    filteritemType,
    VisitorNameList,
    onChangeVisitor,
    handleIsPreBook,
    VECodeDisable,
    EmployeeList,
    OnchangePlantList,
    ProofList,
    onClickIsAppointmentBooking,
    ValidFromDisable,
    ValidToDisable,
    onChageFromDate,
    onChageToDate,
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
    deleteDocuments,
    handleHyperlink,
    cameraOff,
    setCameraOff,
    handleChange,
    handleRouteSelect,
    initFldDisable,
    PurposeList,
    handlePoVSelect,
    selectedPlant,
    PlantList,
    handlePlantSelect,
    handleDepartmentSelect,
    PlantWiseDepartmentList,
    plantDisable,
  } = props;
  const chooseOptions = { icon: "las la-upload", iconOnly: true };

  return (
    <Formik
      initialValues={visitorEntryForm}
      validationSchema={VisitorEntryValidationSchema}
      onSubmit={formik.handleSubmit}
    >
      <>
        <>
          <div className="normal-table">
            <div className="grid">
              <div className="col-12">
                <div className="grid">
                  <FormFields
                    type={"radiobox"}
                    name={"IsPreBooking"}
                    label={"Is Pre Booking ?"}
                    options={IsPreBookingList}
                    show={false}
                    required={false}
                    disable={isView || !isCreate}
                    optionLabel={""}
                    optionValue={""}
                    handleSelect={""}
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
                    name={"PlantId"}
                    label={"Plant Name"}
                    options={PlantList}
                    show={true}
                    required={true}
                    disable={isView || plantDisable ? true : false}
                    optionLabel={"PlantName"}
                    optionValue={"PlantId"}
                    handleSelect={handlePlantSelect}
                    formik={formik}
                    fldStyle={"col-12 md:col-4"}
                  />
                  <FormFields
                    type={"select"}
                    name={"DeptId"}
                    label={"Department Name"}
                    options={PlantWiseDepartmentList}
                    show={true}
                    required={true}
                    disable={isView ? true : false}
                    optionLabel={"DepartmentName"}
                    optionValue={"DepartmentId"}
                    handleSelect={handleDepartmentSelect}
                    formik={formik}
                    fldStyle={"col-12 md:col-4"}
                  />
                  <FormFields
                    type={"select"}
                    name={"VisitorTypeId"}
                    label={"Visitor Type "}
                    options={VisitorTypeList}
                    show={false}
                    required={false}
                    disable={isView || !isCreate || initFldDisable}
                    optionLabel={"MetaSubDescription"}
                    optionValue={"MetaSubId"}
                    handleSelect={onChangeVisitorType}
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
                    disable={isView || !isCreate}
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
                    // disable={
                    //   !VECodeDisable ||
                    //   isView ||
                    //   !isCreate ||
                    //   formik.values["VisitorTypeId"] == 66 ||
                    //   formik.values["VisitorTypeId"] == 65
                    //     ? false
                    //     : initFldDisable
                    // }
                    optionLabel={"UserName"}
                    optionValue={"UserId"}
                    handleSelect={handleSelect}
                    fldStyle={"col-12 md:col-4"}
                    formik={formik}
                  />
                  {/* <FormFields
                    type={"select"}
                    name={"VisitedEmployeeId"}
                    label={"Person to Visit"}
                    options={EmployeeList}
                    show={true}
                    required={false}
                    // disable={
                    //   isView ||
                    //   formik.values["VisitorTypeId"] == 66 ||
                    //   formik.values["VisitorTypeId"] == 65
                    //     ? false
                    //     : initFldDisable
                    // }
                    optionLabel={"EmployeeName"}
                    optionValue={"EmployeeId"}
                    handleSelect={handleSelect}
                    fldStyle={"col-12 md:col-4"}
                    formik={formik}
                  /> */}
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
                    options={AreaList}
                    show={true}
                    required={false}
                    disable={isView || !isCreate}
                    optionLabel={"AreaName"}
                    optionValue={"AreaId"}
                    handleSelect={handlePoVSelect}
                    fldStyle={"col-12 md:col-4"}
                    formik={formik}
                  />
                  {/* <FormFields
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
                  /> */}
                  {/* <FormFields
                    type={"checkbox"}
                    name={"IsAppointmentBooking"}
                    label={"Is Appointment Booking "}
                    options={""}
                    show={!CheckboxDisable}
                    required={false}
                    disable={isCreate ? CheckboxDisable : true}
                    optionLabel={""}
                    optionValue={""}
                    handleChange={onClickIsAppointmentBooking}
                    fldStyle={"col-12 md:col-4"}
                    formik={formik}
                  /> */}
                  <FormFields
                    type={"Calendar"}
                    name={"ValidFrom"}
                    label={pageType ? "Valid From" : "Appointment Date"}
                    options={""}
                    show={true}
                    required={true}
                    disable={false}
                    optionLabel={""}
                    optionValue={""}
                    handleChange={onChageFromDate}
                    // handleSelect={handleSelect}
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
                    show={pageType}
                    required={false}
                    disable={false}
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
                    show={false}
                    required={false}
                    disable={isView || !isCreate}
                    optionLabel={""}
                    optionValue={""}
                    handleSelect={""}
                    formik={formik}
                    fldStyle={"col-12 md:col-4"}
                    maxLength="500"
                    style={{ maxHeight: "80px", overflowY: "auto" }}
                  />
                </div>
              </div>
              {/* <PhotoCapture
                onUpload={onUpload}
                ImageUrl={imageUrl}
                isView={isView || !isCreate}
                cameraOff={cameraOff}
                setCameraOff={setCameraOff}
              /> */}
            </div>
          </div>
        </>
        <div className="white" hidden={IsVehicleDetailsDisable}>
          <div className={isView ? "p-disabled" : ""}>
            <div className="widget-body">
              <div className="normal-table">
                <div className="page-title">
                  <div className="grid grid-nogutter">
                    <div className="md:col-6">
                      <h1>Vehicle & Driver Details</h1>
                    </div>
                  </div>
                </div>
                <div className="grid">
                  {!initFldDisable ? (
                    <FormFields
                      type={"checkbox"}
                      name={"IsExistingVehicle"}
                      label={"Is Existing Vehicle "}
                      options={""}
                      show={true}
                      required={false}
                      disable={isView || !isCreate}
                      optionLabel={""}
                      optionValue={""}
                      handleChange={onClickIsExistingVehicle}
                      fldStyle={"col-12 md:col-3"}
                      formik={formik}
                    />
                  ) : (
                    <FormFields
                      type={""}
                      fldStyle={"col-12 md:col-3"}
                      show={true}
                    />
                  )}
                  <FormFields
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
                  />
                  <FormFields
                    type={"text"}
                    name={"VehicleName"}
                    label={"Vehicle Name "}
                    options={""}
                    show={!HideVehicleDD}
                    required={false}
                    disable={isView || !isCreate}
                    optionLabel={""}
                    optionValue={""}
                    handleSelect={""}
                    fldStyle={"col-12 md:col-3"}
                    formik={formik}
                    maxLength="50"
                  />
                  <FormFields
                    type={"text"}
                    name={"VehicleNo"}
                    label={"Vehicle No "}
                    options={""}
                    show={true}
                    required={false}
                    disable={isCreate ? HideVehicleDD : true}
                    optionLabel={""}
                    optionValue={""}
                    handleSelect={""}
                    fldStyle={"col-12 md:col-3"}
                    formik={formik}
                    maxLength="50"
                  />
                  <div className="col-12 md:col-3">
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
                  </div>
                  <FormFields
                    type={"checkbox"}
                    name={"IsExistingDriver"}
                    label={"Is Existing Driver "}
                    options={""}
                    show={true}
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
                    options={EmployeeList.filter((f) => f.DesignationId == 5)}
                    show={HideDriverDD}
                    required={false}
                    disable={isView || !isCreate}
                    optionLabel={"EmployeeName"}
                    optionValue={"EmployeeName"}
                    handleSelect={handleSelect}
                    fldStyle={"col-12 md:col-3"}
                    formik={formik}
                  />
                  <FormFields
                    type={"text"}
                    name={"DriverId"}
                    label={"Driver Name "}
                    options={""}
                    show={!HideDriverDD}
                    required={false}
                    disable={isView || !isCreate}
                    optionLabel={""}
                    optionValue={""}
                    handleSelect={""}
                    fldStyle={"col-12 md:col-3"}
                    formik={formik}
                    maxLength="50"
                  />
                  <FormFields
                    type={"select"}
                    name={"RouteId"}
                    label={"Route "}
                    options={RouteList}
                    show={true}
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
                    disable={isCreate ? IsVehicleDetailsDisable : true}
                    optionLabel={""}
                    optionValue={""}
                    handleSelect={""}
                    fldStyle={"col-12 md:col-3"}
                    formik={formik}
                    keyfilter={"int"}
                    maxLength="10"
                  />
                  <FormFields
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
                  />
                  <FormFields
                    type={"number"}
                    name={"PlannedTravellingKm"}
                    label={"Planned Travelling Km "}
                    options={""}
                    show={true}
                    required={false}
                    disable={isCreate ? IsVehicleDetailsDisable : true}
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
                    name={"ActualTravellingKm"}
                    label={"Actual Travelling Km "}
                    options={""}
                    show={true}
                    required={false}
                    disable={isCreate ? IsVehicleDetailsDisable : true}
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    </Formik>
  );
};

export const VisitorEntryBelongingDetailForm = (props) => {
  const {
    visitorEntryBelongingDetailForm,
    formik,
    VisitorEntryBelongingDetailList,
    TableHeader,
    filters,
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
        toast.current?.show({
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
    <div className="widget-body">
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
          // currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Entries"
          // paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
          // tableStyle={{ minWidth: "50rem" }}
        >
          <Column
            field="Action"
            header="Action"
            style={{ width: "30%", textAlign: "center" }}
            body={AddAndDeleteTemplate}
          />
          <Column
            field="DeviceName"
            header="Property Name"
            style={{ width: "40%" }}
            body={(rowData, rowIndex) => textEditor(rowData, rowIndex)}
          />
          <Column
            field="DeviceNo"
            header="No Of Count"
            style={{ width: "30%" }}
            body={(rowData, rowIndex) => textEditor(rowData, rowIndex)}
          />
        </DataTable>
        {/* </div> */}
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
    IsMaterialDetailsShow,
    isCreate,
  } = props;
  const AddAndDeleteTemplate: React.FC<any> = (rowData) => {
    const index = VisitorEntryMaterialDetailList.indexOf(rowData);
    const handleAddRow = () => {
      let isexist: any[] = VisitorEntryMaterialDetailList.filter(
        (f) => f.MaterialId == null || f.Qty == ""
      );
      if (isexist.length > 0) {
        toast.current?.show({
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
      toast.current?.show({
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
  const { visitorEntryDetailList, IsWorkerDetailsShow, isView, isCreate } =
    props;
  const chooseOptions = { icon: "las la-upload", iconOnly: true };
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

const BookExternalVisitorEntry = (props) => {
  const visEntryRef = useRef(null);
  const {
    toast,
    tabConfig,
    visitorEntryFormik,
    pageType,
    isCreate,
    isView,
    loading,
    selectedData,
    setShowEntryDetail,
    setVisible,
    VisitorNameList,
    visitorEntryDetailList,
    setvisitorEntryDetailList,
    setVisitorTypeList,
    setIsPreBookingList,
    setProofList,
    setStatusList,
    setTitleList,
    setEmployeeList,
    setDepartmentList,
    setTempVisitorNameList,
    setVisitorNameList,
    setPartyTypeList,
    setAreaList,
    setRouteList,
    setDriverList,
    setVehicleList,
    setMaterialList,
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
    accessData,
    resetAllForm,
    IsWorkerDetailsShow,
    IsBelongingDetailsShow,
    VisitorEntryBelongingDetailList,
    VisitorEntryMaterialDetailList,
    setVisitorEntryMaterialDetailList,
    MaterialList,
    PurposeList,
    IsdisableSave,
    handlePoVSelect,
    selectedPlant,
    PlantList,
    handleVisitorSelected,
    handlePlantSelect,
    handleDepartmentSelect,
    PlantWiseDepartmentList,
    setPlantWiseDepartmentList,
    plantDisable,
    route,
    setLoadingPage,
    query,
    handleMobKeyPress,
    setIsWarningPop,
    pageTypeChanged,
    setPageTypeTogg,
  } = props;

  const dispatch: any = useDispatch();

  // const [VisitorNameList, setVisitorNameList] = useState([]);
  // const [visitorEntryDetailList, setvisitorEntryDetailList] = useState([]);

  //Unused
  const [visitorDetailList, setVisitorDetailList] = useState([]);
  const [VisitorEntryTypeList, setVisitorEntryTypeList] = useState([]);
  const [VisitorEntryHeader, setVisitorEntryHeader] = useState<any>({});
  const [VisitorEntryDetail, setVisitorEntryDetail] = useState([]);
  const [VisitorEntryBelongingDetail, setVisitorEntryBelongingDetail] =
    useState([]);
  const [VisitorEntryList, setVisitorEntryList] = useState([]);
  const [VisitorEntryCodeList, setVisitorEntryCodeList] = useState([]);
  const [VisitorEmployeeList, setVisitorEmployeeList] = useState([]);
  const [PreBookingList, setPreBookingList] = useState([]);
  const [VisitorWorkerList, setVisitorWorkerList] = useState([]);
  // X X X Unused

  useEffect(() => {
    pageLoadScript();
  });

  useEffect(() => {
    if (accessData && accessData != null) {
      let VisitorEntryId: number = 0;
      if (isCreate == false) {
        setList();
      } else {
        if (
          query &&
          query.size >= 0 &&
          (visitorEntryFormik.values.VisitedEmployeeId == null ||
            visitorEntryFormik.values.VisitedEmployeeId == "")
        ) {
          setLoadingPage(true);
          const checkTrialRes = dispatch(
            checkAuthTrial({
              accessToken: query.get("accessToken"),
            })
          );
          checkTrialRes
            .then((res) => {
              let resP = res.payload;
              if (res.payload.tranStatus.result == true) {
                setLoadingPage(false);
                setIsWarningPop(false);
                setPageTypeTogg(false);
                CreatePageOnLoadCVisitorEntry(0);
                // pageTypeChanged({ value: false });
              } else {
                setLoadingPage(false);
                setIsWarningPop(true);
                setPageTypeTogg(false);
                resP?.tranStatus?.lstErrorItem &&
                  resP?.tranStatus?.lstErrorItem.length > 0 &&
                  resP?.tranStatus?.lstErrorItem.forEach((element) => {
                    toast.current?.show({
                      severity: "warn",
                      summary: element.Title,
                      detail: element.Message,
                    });
                  });
                // setTimeout(() => {
                //   route.push("/");
                // }, 2000);
                return;
              }
            })
            .catch((err) => {
              setLoadingPage(false);
            });
        }
      }
    }
  }, [accessData]);

  const saveVisitor = () => {
    visitorEntryFormik.handleSubmit();
  };

  return (
    <>
      <div className="white" ref={visEntryRef}>
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
          {!loading ? (
            <>
              {/* <div className="form-container scroll-y"> */}
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
                PlantList={PlantList}
                selectedPlant={selectedPlant}
                pageType={pageType}
                handlePlantSelect={handlePlantSelect}
                handleDepartmentSelect={handleDepartmentSelect}
                PlantWiseDepartmentList={PlantWiseDepartmentList}
                plantDisable={plantDisable}
              />
              {/* <VisitorEntryDetailForm
                visitorEntryDetailList={visitorEntryDetailList}
                setvisitorEntryDetailList={setvisitorEntryDetailList}
                IsWorkerDetailsShow={IsWorkerDetailsShow}
                isCreate={isCreate}
              /> */}
              {/* <div className="col-12 flex flex-row gap-3 md:col-12">
                <div className="white col-12" hidden={!IsBelongingDetailsShow}>
                  <div className={isView ? "p-disabled" : ""}>
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
              </div> */}
              {/* <div className="white col-6" hidden={!IsMaterialDetailsShow}>
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
                </div> */}
              {/* </div> */}
              {/* </div> */}
            </>
          ) : (
            <AppProgressSpinner />
          )}
        </div>
      </div>
      {/* <AppAlert toast={toast} /> */}
    </>
  );
};
export default BookExternalVisitorEntry;
