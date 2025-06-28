import AppAlert from "@/alert/alert";
import {
  Column,
  DataTable,
  Dropdown,
  InputNumber,
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
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  OnChangePartyType,
  OnChangeVisitor,
  OnChangeVisitorType,
  create,
  createInit,
  update,
} from "@/redux/slices/visitorManagement/visitorentrySlice";
import {
  VisitorEntryValidationSchema,
  visitorEntryBelongingDeatilValidationSchema,
} from "@/validations/VisitorManagement";
import { IMAGES } from "@/assets/images/Images";

const VisitorEntryForm = (props) => {
  const {
    visitorEntryForm,
    VisitorEntryValidationSchema,
    formik,
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
    PurposeList,
    handlePoVSelect,
    toast
  } = props;
  const chooseOptions = { icon: "las la-upload", iconOnly: true };
  return (
    <Formik
      initialValues={visitorEntryForm}
      validationSchema={VisitorEntryValidationSchema}
      onSubmit={formik.handleSubmit}
    >
      <>
        <div className="white">
          <div className={isView ? "p-disabled" : ""}>
            <div className="widget-body">
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
                        name={"VisitorTypeId"}
                        label={"Visitor Type "}
                        options={VisitorTypeList}
                        show={true}
                        required={false}
                        disable={isView || !isCreate}
                        optionLabel={"MetaSubDescription"}
                        optionValue={"MetaSubId"}
                        handleSelect={onChangeVisitorType}
                        fldStyle={"col-12 md:col-4"}
                        formik={formik}
                      />
                      <FormFields
                        type={"select"}
                        name={"VisitorId"}
                        label={"Visitor Name "}
                        options={VisitorNameList}
                        show={ShowVisitorContranctor}
                        required={false}
                        disable={!VECodeDisable || isView || !isCreate}
                        optionLabel={"FirstName"}
                        optionValue={"VisitorId"}
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
                        required={false}
                        disable={!VECodeDisable || isView || !isCreate}
                        optionLabel={"EmployeeName"}
                        optionValue={"EmployeeId"}
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
                        show={!CheckboxDisable}
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
                        required={false}
                        disable={isCreate ? ValidFromDisable : true}
                        optionLabel={""}
                        optionValue={""}
                        handleChange={onChageFromDate}
                        // handleSelect={handleSelect}
                        fldStyle={"col-12 md:col-4"}
                        formik={formik}
                        minDate={new Date()}
                      />
                      <FormFields
                        type={"Calendar"}
                        name={"ValidTo"}
                        label={"Valid To"}
                        options={""}
                        show={!ValidToDisable}
                        required={false}
                        disable={ValidToDisable}
                        optionLabel={""}
                        optionValue={""}
                        handleChange={onChageToDate}
                        fldStyle={"col-12 md:col-4"}
                        formik={formik}
                        minDate={TominDate == null ? new Date() : TominDate}
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
                        style={{ minHeight: "50px",maxHeight: "50px", overflowY: "auto" }}
                      />
                    </div>
                  </div>
                  <PhotoCapture
                    onUpload={onUpload}
                    ImageUrl={imageUrl}
                    isView={isView || !isCreate}
                    cameraOff={cameraOff}
                    setCameraOff={setCameraOff}
                    fldStyle={`col-12 md:col-3 text-center`}
                    toast={toast}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="white" hidden={IsVehicleDetailsDisable}>
          {/* <div className={isView ? "p-disabled" : ""}> */}
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
                      // maxFileSize={1000000}
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
          {/* </div> */}
        </div>
      </>
    </Formik>
  );
};
const VisitorEntryBelongingDetailForm = (props) => {
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
  const textNumberEditor = (rowData, rowIndex) => {
    return (
      <>
        <InputText
          className="w-full"
          value={rowData[rowIndex.field]}
          onChange={(e: any) => {
            handleInputChange(e, rowData, rowIndex);
          }}
          maxLength={50}
          disabled={isView || !isCreate}
          keyfilter={"int"}
        />
      </>
    );
  };

  return (
    <div className="widget-body">
      <div className="normal-table">
        <div className="page-title">
          <div className="grid grid-nogutter">
            <div className="md:col-6">
              <h1>Belongings</h1>
            </div>
          </div>
        </div>
        <div className="card">
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
              body={(rowData, rowIndex) => textNumberEditor(rowData, rowIndex)}
            />
          </DataTable>
        </div>
      </div>
    </div>
  );
};
const VisitorEntryMaterialDetailForm = (props) => {
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
const VisitorEntryDetailForm = (props) => {
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
                  "Work Severity",
                  "Expiry Date",
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
                <Column field="WorkSeverity" header="Work Severity"></Column>
                <Column field="ExpirryDate" header="Expiry Date"></Column>
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
const CVisitorEntry: React.FC = () => {
  const route = useHistory();
  const toast = useRef<Toast>(null);
  const dispatch: any = useDispatch();
  const [cameraOff, setCameraOff] = useState(false);
  const [visitorDetailList, setVisitorDetailList] = useState([]);
  const [EmployeeList, setEmployeeList] = useState([]);
  const [DepartmentList, setDepartmentList] = useState([]);
  const [StatusList, setStatusList] = useState([]);
  const [TitleList, setTitleList] = useState([]);
  const [IsPreBookingList, setIsPreBookingList] = useState([]);
  const [VisitorTypeList, setVisitorTypeList] = useState([]);
  const [ProofList, setProofList] = useState([]);
  const [VisitorEntryTypeList, setVisitorEntryTypeList] = useState([]);
  const [VisitorEntryHeader, setVisitorEntryHeader] = useState<any>({});
  const [VisitorEntryDetail, setVisitorEntryDetail] = useState([]);
  const [VisitorEntryBelongingDetail, setVisitorEntryBelongingDetail] =
    useState([]);
  const [VisitorEntryList, setVisitorEntryList] = useState([]);
  const [VisitorEntryCodeList, setVisitorEntryCodeList] = useState([]);
  const [VisitorEmployeeList, setVisitorEmployeeList] = useState([]);
  const [VisitorNameList, setVisitorNameList] = useState([]);
  const [TempVisitorNameList, setTempVisitorNameList] = useState([]);
  const [VisitorWorkerList, setVisitorWorkerList] = useState([]);
  const [PreBookingList, setPreBookingList] = useState([]);
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
  const [visitorEntryDetailList, setvisitorEntryDetailList] = useState([]);
  const [PurposeList, setPurposeList] = useState([]);
  const [VisitorEntryPovDetail, setVisitorEntryPovDetail] = useState([]);
  const [VisitorEntryBelongingDetailList, setVisitorEntryBelongingDetailList] =
    useState([]);
  const [VisitorEntryMaterialDetailList, setVisitorEntryMaterialDetailList] =
    useState([]);
  const [MaterialList, setMaterialList] = useState([]);
  const [documentUrl, setDocumentUrl] = useState("");
  const [InvoiceNumberDisable, setInvoiceNumberDisable] = useState(true);
  const [DcNumberDisable, setDcNumberDisable] = useState(true);
  const [PoNumberDisable, setPoNumberDisable] = useState(true);
  const [ContainerNumberDisable, setContainerNumberDisable] = useState(true);
  const imageUploadRef = useRef<any>(null);
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
  } = useSelector((state: any) => state.visitorentry);
  useEffect(() => {
    pageLoadScript();
  });
  useEffect(() => {
    let VisitorEntryId: number = 0;
    if (isCreate == false) {
      setList();
    } else {
      CreatePageOnLoad(0);
    }
  }, []);
  const CreatePageOnLoad = (VisitorEntryId: number) => {
    const data = {
      VisitorEntryId: VisitorEntryId,
      PlantId: +localStorage["PlantId"],
      CompanyId: +localStorage["CompanyId"],
    };
    var result = dispatch(createInit(data));
    result
      .then((res) => {
        if (res.payload.tranStatus.result == true) {
          setVisitorTypeList(res.payload.VisitorTypeList);
          setIsPreBookingList(res.payload.IsPreBookingList);
          setProofList(res.payload.ProofList);
          setStatusList(res.payload.StatusList);
          setTitleList(res.payload.TitleList);
          setEmployeeList(res.payload.EmployeeList);
          setDepartmentList(res.payload.DepartmentList);
          setTempVisitorNameList(res.payload.VisitorNameList);
          setPartyTypeList(res.payload.PartyTypeList);
          setAreaList(res.payload.AreaList);
          setRouteList(res.payload.RouteList);
          setDriverList(res.payload.DriverList);
          setVehicleList(res.payload.VehicleList);
          setMaterialList(res.payload.MaterialList);
          setPurposeList(res.payload.PurposeList);
          if (isCreate == true) {
            onChangeVisitorType("VisitorTypeId", {}, 35);
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
  const setList = () => {
    setVisitorTypeList(DtoVisitorTypeList);
    setIsPreBookingList(DtoIsPreBookingList);
    setProofList(DtoProofList);
    setStatusList(DtoStatusList);
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
      obj.VisitorEntryId = x.VisitorEntryId;
      obj.VisitorId = x.VisitorId;
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
    if (DtoVisitorEntryHeader.VehicleDocumentName != "") {
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
    }
  };
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
      : null,
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
    // AreaToVisit: DtoVisitorEntryHeader
    // 	? DtoVisitorEntryHeader.AreaToVisit
    // 	: null,
    VisitorImageName: DtoVisitorEntryHeader
      ? DtoVisitorEntryHeader.VisitorImageName
      : "",
    VisitorImageUrl: DtoVisitorEntryHeader
      ? DtoVisitorEntryHeader.VisitorImageUrl
      : "",
    PurposeOfVisit: DtoVisitorEntryHeader
      ? DtoVisitorEntryHeader.PurposeOfVisit
      : null,
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
    CreatedBy: DtoVisitorEntryHeader
      ? DtoVisitorEntryHeader.CreatedBy
      : +localStorage["UserId"],
    CreatedOn: DtoVisitorEntryHeader
      ? new Date(DtoVisitorEntryHeader.CreatedOn)
      : new Date(),
    ModifiedBy: DtoVisitorEntryHeader ? +localStorage["UserId"] : null,
    ModifiedOn: DtoVisitorEntryHeader ? new Date() : null,
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
  const visitorEntryFormik: any = useFormik({
    initialValues: visitorEntryForm,
    validationSchema: VisitorEntryValidationSchema,
    onSubmit: (values: any, { resetForm }) => {
      setIsdisableSave(true);
      const formData: any = new FormData();
      if (
        values.PersonName == "" &&
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
      if (values.MobileNo == "")
        return toastValidation("Please Enter Mobile No");
      if (values.MobileNo.length < 9 || values.MobileNo.length > 15)
        return toastValidation(
          "Invalid mobile number. It should be 9 to 15 digits"
        );
      // if (!values.IdProofType)
      //   return toastValidation("Please Select ID Proof Type");
      // if (values.IdProofNo != "")
      //   return toastValidation("Please Enter ID Proof No");
      //   if (values.IdProofNo.length > 0)
      //     switch (values.IdProofType) {
      //       case 17:
      //         if (
      //           !/^[2-9]{1}[0-9]{3}\\s[0-9]{4}\\s[0-9]{4}$/.test(values.IdProofNo)
      //         )
      //           toastValidation("Please Enter Valid Aadhar Proof No");
      //         return;
      //         break;
      //     }

      if (!values.PurposeOfVisit)
        return toastValidation("Please Select Purpose of Visit");
      if (!values.ValidFrom && values.VisitorTypeId == 36)
        return toastValidation("Please Select Valid From");
      if (!values.ValidFrom && values.VisitorTypeId != 36)
        return toastValidation("Please Select Appointment Date");
      if (!values.ValidTo) return toastValidation("Please Select Valid To");
      if (values.ValidFrom > values.ValidTo)
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
            return toastValidation(
              "Please Add All the Details In Belongings."
            );
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
        if (values.ActualTravellingKm == null)
          return toastValidation("Please Enter Actual Travelling Km");
      }
      if (
        !VisitorEntryPovDetail ||
        !VisitorEntryPovDetail.length ||
        VisitorEntryPovDetail.length == 0
      ) {
        return toastValidation("Please Select Area To Visit");
      }
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
      if (List1.length > 0) {
        for (let i = 0; i < List1.length; i++) {
          const x = List1[i];
          let vedObj: any = {};
          vedObj.VisitorEntryDetailId = x.VisitorEntryDetailId ?? 0;
          vedObj.VisitorEntryId = x.VisitorEntryId ?? 0;
          vedObj.TitleId = x.TitleId;
          vedObj.FirstName = x.FirstName;
          vedObj.LastName = x.LastName;
          vedObj.DepartmentId = x.DepartmentId;
          vedObj.Dob = x.Dob;
          vedObj.MailId = x.MailId;
          vedObj.MobileNo = x.MobileNo;
          vedObj.IdCardType = x.IdCardType;
          vedObj.IdCardNo = x.IdCardNo;
          vedObj.DocumentName = x.DocumentName;
          vedObj.DocumentUrl = x.DocumentUrl;
          vedObj.Status = x.Status;
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
      if (!photo) {
        setIsdisableSave(false);
        toast.current?.show({
          severity: "warn",
          detail: "Please Capture Image",
          summary: "Warning Message",
        });
        return;
      }
      values.ValidFrom = datepipes(new Date(values.ValidFrom));
      values.ValidTo = datepipes(new Date(values.ValidTo));
      values.VisitorEntryDate = datepipes(new Date(values.VisitorEntryDate));
      values.CreatedOn = datepipes(new Date(values.CreatedOn));
      if (!isCreate) {
        values.ModifiedOn = datepipes(new Date(values.ModifiedOn));
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
      formData.append("webfiles", []);
      formData.append("digSign", null);

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
              toast.current?.show({
                severity: "success",
                summary: "Success Message",
                detail: res.payload.tranStatus.lstErrorItem[0].Message,
              });
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
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    return await response.blob();
  }
  const resetAllForm = () => {
    delete visitorEntryFormik.values.AreaToVisit;
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
    setVisitorEntryMaterialDetailList([]);
    setVisitorEntryPovDetail([]);
    setPhoto(null);
    setImageUrl(IMAGES.NO_IMG);
    setDocument(null);
    setDocumentUrl("");
    setPartyNameList([]);
    CreatePageOnLoad(0);
  };
  const onChangeVisitorType = (name, other, value) => {
    setVisitorNameList([]);
    if (isCreate) setvisitorEntryDetailList([]);
    visitorEntryFormik.setFieldValue(name, value);
    let obj = {
      VisitorTypeId: value,
      CompanyId: +localStorage["CompanyId"],
    };
    var result = dispatch(OnChangeVisitorType(obj));
    result
      .then((res) => {
        if (res.payload.tranStatus.result == true) {
          setVisitorNameList(res.payload.VisitorNameList);
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
  const onChangeVisitor = (name, other, value) => {
    visitorEntryFormik.setFieldValue(name, value);
    let visitor: any = VisitorNameList.find((f) => f.VisitorId == value);
    visitorEntryFormik.setFieldValue("PersonName", visitor.FirstName);
    visitorEntryFormik.setFieldValue("MobileNo", visitor.MobileNo);
    visitorEntryFormik.setFieldValue("IdProofType", visitor.IdCardType);
    visitorEntryFormik.setFieldValue("IdProofNo", visitor.IdCardNo);
    setIsMaterialDetailsShow(false);
    setvisitorEntryDetailList([]);
    if (
      visitorEntryFormik.values.VisitorTypeId == 36 ||
      visitorEntryFormik.values.VisitorTypeId == 35
    ) {
      let obj = {
        VisitorTypeId: visitorEntryFormik.values.VisitorTypeId,
        VisitorId: value,
        VisitorDetailIds: '',
        Detail:0
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
      if (!isCreate && !isView)
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
  const isValidFileType = (file, allowedTypes) => {
    const fileExtension = file.name
      .slice(((file.name.lastIndexOf(".") - 1) >>> 0) + 2)
      .toLowerCase();
    const fileType = file.type.toLowerCase();
    return (
      allowedTypes.includes(fileExtension) || allowedTypes.includes(fileType)
    );
  };
  const onUploadDocument = (e) => {
    const allowedTypes = ["jpeg", "jpg", "png"];
    // if (imageUrl != "") {
    //   handleCloseImage();
    // }
    if (e.files) {
      if (!isValidFileType(e.files[0], allowedTypes)) {
        toast.current?.show({
          severity: "warn",
          summary: "Error Message",
          detail:
            "Please Upload only Files with Format (Image/ JPEG, JPG, PNG)",
        });
        imageUploadRef.current?.clear();
        return;
      }
    }
    if (e.files.length > 0) {
      setDocument(e.files[0]);
      visitorEntryFormik.setFieldValue("VehicleDocumentName", e.files[0].name);
      visitorEntryFormik.setFieldValue("VehicleDocumentUrl", e.files[0].name);
      const uploadedImageUrl = URL.createObjectURL(e.files[0]);
      setDocumentUrl(uploadedImageUrl);
    } else {
      toast.current?.show({
        severity: "warn",
        summary: "Error Message",
        detail: "Please Upload only Files with Format (Image/ JPEG, JPG, PNG)",
      });
      return;
    }
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
  return (
    <>
      <div className="page-container">
        <div className="inner-page-container">
          <div className="page-title">
            <div className="grid grid-nogutter">
              <div className="md:col-6">
                <h1>Visitor Entry</h1>
              </div>
              <div className="md:col-6 text-right">
                <div className="action-btn">
                  <>
                    <Button
                      label=""
                      title="Save"
                      icon="pi pi-save"
                      className="text-center"
                      type="submit"
                      disabled={isView || IsdisableSave}
                      onClick={visitorEntryFormik.handleSubmit}
                    />
                    <Button
                      label=""
                      severity="danger"
                      icon="pi pi-trash"
                      title="Clear"
                      className="text-center"
                      disabled={isView || isCreate == false ? true : false}
                      onClick={() =>resetAllForm()}
                    />
                  </>
                  <Button
                    label=""
                    icon="pi pi-search"
                    title="Add"
                    className="p-button p-button-success text-center"
                    onClick={() => {
                      route.push("/home/vVisitorEntry");
                      setCameraOff(true);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          {!loading ? (
            <>
              <div className="form-container scroll-y">
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
                  PurposeList={PurposeList}
                  handlePoVSelect={handlePoVSelect}
                  toast={toast}
                />
                <VisitorEntryDetailForm
                  visitorEntryDetailList={visitorEntryDetailList}
                  setvisitorEntryDetailList={setvisitorEntryDetailList}
                  IsWorkerDetailsShow={IsWorkerDetailsShow}
                  isCreate={isCreate}
                />
                <div className="col-12 flex flex-row gap-3 md:col-12    ">
                  <div
                    className="white col-6 "
                    hidden={!IsBelongingDetailsShow}
                  >
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
              </div>
            </>
          ) : (
            <AppProgressSpinner />
          )}
        </div>
      </div>
      <AppAlert toast={toast} />
    </>
  );
};
export default CVisitorEntry;
