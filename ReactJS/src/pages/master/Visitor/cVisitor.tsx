import { Formik, useFormik } from "formik";
import { Button } from "primereact/button";
import {
  VisitorDetailValidationSchema,
  VisitorValidationSchema,
} from "@/validations/Master";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import FormFields from "@/components/FormFields";
import { AppProgressSpinner } from "@/components/UtilityComp";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import {
  createVM,
  createInitVM,
  OnChangeCountryVM,
  OnChangeStateVM,
  updateVM,
} from "@/redux/slices/master/visitorSlice";
import { FileUpload } from "primereact/fileupload";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FilterMatchMode } from "primereact/api";
import { InputText } from "primereact/inputtext";
import AppAlert from "@/alert/alert";
import React from "react";
import { pageLoadScript } from "@/assets/js/common-utilities";
import { IMAGES } from "@/assets/images/Images";
const deleteTemplate: any = (
  rowData: any,
  visitorDetailList: any,
  setVisitorDetailList: any,
  isView,
  isCreate,
  toast
) => {
  const OnDelete = () => {
    if (!isCreate && !isView) {
      let obj: any = visitorDetailList.find((f) => f == rowData);
      if (obj.Status == 2) {
        toast.current?.show({
          severity: "warn",
          summary: "Warning Message",
          detail: "Visitor Already Inactivated.",
        });
        return;
      }
      obj.Status = 2;
      obj.StatusName = "Inactive";
      let List: any[] = visitorDetailList.filter((f) => f != rowData);
      List.push(obj);
      setVisitorDetailList(List);
    }
  };
  return (
    <Button
      label=""
      severity="danger"
      title="Delete"
      icon="las la-times"
      className="mr-2 p-1"
      disabled={isView ? true : false}
      onClick={() => OnDelete()}
    />
  );
};
const DocumentHyperLink: any = (rowData: any) => {
  return (
    <a style={{ color: "blue" }} href={rowData.DocumentUrl} target="_blank">
      {rowData.DocumentName}
    </a>
  );
};
const VisitorDocumentHyperLink: any = (rowData: any) => {
  return (
    <a href={rowData.VisitorDocumentUrl} target="_blank">
      {rowData.VisitorDocumentName}
    </a>
  );
};
const VisitorForm = (props) => {
  const {
    isView,
    isCreate,
    VisitorTypeList,
    handleSelect,
    handleOnChange,
    TitleList,
    formik,
    CountryList,
    Onchangecountry,
    StateList,
    Onchangestate,
    CityList,
    IdCardList,
    StatusList,
    onUpload,
    itemTemplate,
    imageUrl,
    values,
    visitorForm,
    visitorRef,
    onSubmit,
    onChangeVisitorType,
    tempStateList,
    tempCityList,
    handleCloseImage,
    handleChange,
    profUploadRef,
    VisitorhandleHyperlink,
    onUploadDocumentVisitor,
    deleteDocumentsVisitor,
    documentVisitorUploadRef,
    documentUrlVisitor,
  } = props;
  const customOptions = { icon: "las la-camera-retro", iconOnly: true };
  const chooseOptions = { icon: "las la-upload", iconOnly: true };
  return (
    <Formik
      initialValues={visitorForm}
      validationSchema={VisitorValidationSchema}
      onSubmit={onSubmit}
      ref={visitorRef}
    >
      <div className="white">
        <div className="widget-body">
          <div className="normal-table">
            <div className="grid">
              <div className="col-12 md:col-3">
                <div className="grid">
                  <div className="col-12 text-center">
                    <div className="img-preview-container m-auto">
                      <FileUpload
                        mode="basic"
                        name="demo[]"
                        chooseOptions={customOptions}
                        className="custom-upload inline-block"
                        accept="image/jpeg, image/png, image/jpg"
                        // maxFileSize={1000000}
                        auto
                        chooseLabel="Upload Photo"
                        uploadHandler={onUpload}
                        customUpload
                        disabled={isView}
                        ref={profUploadRef}
                      />
                      <div className="img-preview-hidden">
                        <img src={imageUrl} alt="logo" className="w-full" />
                      </div>
                      <a
                        className={`${
                          isView ? "p-disabled" : null
                        } img-preview-close`}
                        onClick={handleCloseImage}
                      >
                        <i className="las la-times-circle"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 md:col-9">
                <div className="grid">
                  <FormFields
                    type={"text"}
                    name={"VisitorCode"}
                    label={"Visitor Code "}
                    options={""}
                    show={false}
                    required={true}
                    disable={isView || isCreate == false ? true : false}
                    optionLabel={""}
                    optionValue={""}
                    handleSelect={""}
                    onKeyPress={() => {}}
                    fldStyle={"col-12 md:col-4"}
                    formik={formik}
                  />
                  <FormFields
                    type={"select"}
                    name={"VisitorTypeId"}
                    label={"Visitor Type "}
                    options={VisitorTypeList}
                    show={true}
                    required={true}
                    disable={isView || isCreate == false ? true : false}
                    optionLabel={"MetaSubDescription"}
                    optionValue={"MetaSubId"}
                    handleSelect={onChangeVisitorType}
                    fldStyle={"col-12 md:col-4"}
                    formik={formik}
                  />
                  <FormFields
                    type={"text_title"}
                    name={"TitleId"}
                    label={"First Name "}
                    options={TitleList}
                    show={true}
                    required={true}
                    disable={isView ? true : false}
                    optionLabel={"MetaSubDescription"}
                    optionValue={"MetaSubId"}
                    handleSelect={handleSelect}
                    handleOnChange={handleOnChange}
                    titleInputName={"FirstName"}
                    fldStyle={"col-12 md:col-4"}
                    formik={formik}
                    maxLength={50}
                  />
                  <FormFields
                    type={"text"}
                    name={"LastName"}
                    label={"Last Name "}
                    options={""}
                    show={true}
                    required={true}
                    disable={isView ? true : false}
                    optionLabel={""}
                    optionValue={""}
                    handleSelect={""}
                    fldStyle={"col-12 md:col-4"}
                    formik={formik}
                    maxLength={50}
                  />
                  {/* <FormFields
                    type={"Calendar"}
                    name={"Dob"}
                    label={"Date of Birth"}
                    options={""}
                    show={true}
                    required={true}
                    disable={isView ? true : false}
                    optionLabel={""}
                    optionValue={""}
                    handleChange={handleChange}
                    fldStyle={"col-12 md:col-4"}
                    formik={formik}
                    maxDate={new Date()}
                  />
                  <FormFields
                    type={"select"}
                    name={"IdCardType"}
                    label={"ID Card Type "}
                    options={IdCardList}
                    show={true}
                    required={true}
                    disable={isView ? true : false}
                    optionLabel={"MetaSubDescription"}
                    optionValue={"MetaSubId"}
                    handleSelect={handleSelect}
                    fldStyle={"col-12 md:col-4"}
                    formik={formik}
                  />
                  <FormFields
                    type={"text"}
                    name={"IdCardNo"}
                    label={"ID Card No "}
                    options={""}
                    show={true}
                    required={true}
                    disable={isView ? true : false}
                    optionLabel={""}
                    optionValue={""}
                    handleSelect={""}
                    fldStyle={"col-12 md:col-4"}
                    formik={formik}
                  /> */}
                </div>
              </div>
              <div className="col-12 md:col-9">
                <div className="grid">
                  {/* <FormFields
                    type={"select"}
                    name={"CountryId"}
                    label={"Country "}
                    options={CountryList}
                    show={true}
                    required={true}
                    disable={isView ? true : false}
                    optionLabel={"CountryName"}
                    optionValue={"CountryId"}
                    handleSelect={Onchangecountry}
                    fldStyle={"col-12 md:col-4"}
                    formik={formik}
                  />
                  <FormFields
                    type={"select"}
                    name={"StateId"}
                    label={"State "}
                    options={tempStateList}
                    show={true}
                    required={true}
                    disable={isView ? true : false}
                    optionLabel={"StateName"}
                    optionValue={"StateId"}
                    handleSelect={Onchangestate}
                    fldStyle={"col-12 md:col-4"}
                    formik={formik}
                  />
                  <FormFields
                    type={"select"}
                    name={"CityId"}
                    label={"City "}
                    options={tempCityList}
                    show={true}
                    required={true}
                    disable={isView ? true : false}
                    optionLabel={"CityName"}
                    optionValue={"CityId"}
                    handleSelect={handleSelect}
                    fldStyle={"col-12 md:col-4"}
                    formik={formik}
                  /> */}
                  <FormFields
                    type={"text"}
                    name={"VisitorCompany"}
                    label={"Visitor Company "}
                    options={""}
                    show={true}
                    required={false}
                    disable={isView ? true : false}
                    optionLabel={""}
                    optionValue={""}
                    handleSelect={""}
                    fldStyle={"col-12 md:col-4"}
                    formik={formik}
                    maxLength={100}
                  />
                  <FormFields
                    type={"text"}
                    name={"MailId"}
                    label={"Mail ID "}
                    options={""}
                    show={true}
                    required={false}
                    disable={isView ? true : false}
                    optionLabel={""}
                    optionValue={""}
                    handleSelect={""}
                    fldStyle={"col-12 md:col-4"}
                    formik={formik}
                  />
                  <FormFields
                    type={"text"}
                    name={"MobileNo"}
                    label={"Mobile No "}
                    options={""}
                    show={true}
                    required={true}
                    disable={isView ? true : false}
                    optionLabel={""}
                    optionValue={""}
                    handleSelect={""}
                    fldStyle={"col-12 md:col-4"}
                    formik={formik}
                    keyfilter="int"
                    maxLength={15}
                    minLength={9}
                  />
                </div>
              </div>
              <FormFields
                type={"textarea"}
                name={"Address"}
                label={"Address"}
                options={""}
                show={true}
                required={true}
                disable={isView ? true : false}
                optionLabel={""}
                optionValue={""}
                handleSelect={""}
                formik={formik}
                fldStyle={"col-12 md:col-3"}
                maxLength="500"
                style={{ maxHeight: "100px", overflowY: "auto" }}
              />
              <FormFields
                type={"select"}
                name={"Status"}
                label={"Status "}
                options={StatusList}
                show={true}
                required={true}
                optionLabel={"MetaSubDescription"}
                optionValue={"MetaSubId"}
                handleSelect={handleSelect}
                fldStyle={"col-12 md:col-3"}
                formik={formik}
                disable={
                  (isView ? true : false) ||
                  (isCreate == null || isCreate == true ? true : false)
                }
              />
              <div className="col-12 md:col-3">
                <label className="form-label">
                  Document Upload <span className="hlt-txt">*</span>
                </label>
                <div className="p-inputgroup">
                  <div className="browse-links">
                    <Button
                      label={formik.values.VisitorDocumentName}
                      link
                      onClick={VisitorhandleHyperlink}
                    />
                  </div>
                  <FileUpload
                    mode="basic"
                    chooseOptions={chooseOptions}
                    uploadHandler={onUploadDocumentVisitor}
                    chooseLabel={VisitorDocumentHyperLink}
                    auto
                    customUpload
                    ref={documentVisitorUploadRef}
                    disabled={isView}
                  />
                  <Button
                    icon="las la-times"
                    onClick={deleteDocumentsVisitor}
                    disabled={isView}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Formik>
  );
};
const VisitorDetailForm = (props) => {
  const {
    setVisitorDetailList,
    visitorDetailList,
    filters,
    TableHeader,
    TitleList,
    handleSelect,
    isView,
    DepartmentList,
    IdCardList,
    StatusList,
    OnClear,
    visitorDetailForm,
    visitorDetailRef,
    formik,
    OnDelete,
    documentUrl,
    onUploadDocument,
    disableForm,
    isCreate,
    onRowSelect,
    toast,
    deleteDocuments,
    handleHyperlink,
    handleDChange,
    documentUploadRef,
    WorkSeverityList,
  } = props;
  const chooseOptions = { icon: "las la-upload", iconOnly: true };
  return (
    <Formik
      initialValues={formik.visitorDetailForm}
      validationSchema={formik.VisitorDetailValidationSchema}
      onSubmit={formik.handleSubmit}
    >
      <div className={disableForm ? "p-hidden" : null}>
        <div className="white">
          <div className="widget-body">
            <div className="normal-table">
              <div className="page-title">
                <div className="grid grid-nogutter">
                  <div className="md:col-6">
                    <h1>Worker Details</h1>
                  </div>
                </div>
              </div>
              <div className="grid">
                <FormFields
                  type={"text_title"}
                  name={"TitleId"}
                  label={"First Name "}
                  options={TitleList}
                  show={true}
                  required={true}
                  disable={isView ? true : false}
                  optionLabel={"MetaSubDescription"}
                  optionValue={"MetaSubId"}
                  handleSelect={handleSelect}
                  titleInputName={"FirstName"}
                  fldStyle={"col-12 md:col-3"}
                  formik={formik}
                  maxLength={50}
                />
                <FormFields
                  type={"text"}
                  name={"LastName"}
                  label={"Last Name "}
                  options={""}
                  show={true}
                  required={true}
                  disable={isView ? true : false}
                  optionLabel={""}
                  optionValue={""}
                  handleSelect={""}
                  fldStyle={"col-12 md:col-3"}
                  formik={formik}
                  maxLength={50}
                />
                <FormFields
                  type={"select"}
                  name={"DepartmentId"}
                  label={"Department "}
                  options={DepartmentList}
                  show={true}
                  required={true}
                  disable={isView ? true : false}
                  optionLabel={"DepartmentName"}
                  optionValue={"DepartmentId"}
                  handleSelect={handleSelect}
                  fldStyle={"col-12 md:col-3"}
                  formik={formik}
                />
                <FormFields
                  type={"Calendar"}
                  name={"Dob"}
                  label={"Date of Birth"}
                  options={""}
                  show={true}
                  required={true}
                  disable={isView ? true : false}
                  optionLabel={""}
                  optionValue={""}
                  handleChange={handleDChange}
                  fldStyle={"col-12 md:col-3"}
                  formik={formik}
                  maxDate={new Date()}
                />
                <FormFields
                  type={"text"}
                  name={"MailId"}
                  label={"Mail ID "}
                  options={""}
                  show={true}
                  required={false}
                  disable={isView ? true : false}
                  optionLabel={""}
                  optionValue={""}
                  handleSelect={handleSelect}
                  fldStyle={"col-12 md:col-3"}
                  formik={formik}
                />
                <FormFields
                  type={"text"}
                  name={"MobileNo"}
                  label={"Mobile No "}
                  options={""}
                  show={true}
                  required={true}
                  disable={isView ? true : false}
                  optionLabel={""}
                  optionValue={""}
                  handleSelect={handleSelect}
                  fldStyle={"col-12 md:col-3"}
                  formik={formik}
                  keyfilter="int"
                  maxLength={15}
                  minLength={9}
                />
                <FormFields
                  type={"select"}
                  name={"IdCardType"}
                  label={"ID Card Type "}
                  options={IdCardList}
                  show={true}
                  required={true}
                  disable={isView ? true : false}
                  optionLabel={"MetaSubDescription"}
                  optionValue={"MetaSubId"}
                  handleSelect={handleSelect}
                  fldStyle={"col-12 md:col-3"}
                  formik={formik}
                />
                <FormFields
                  type={"text"}
                  name={"IdCardNo"}
                  label={"ID Card No "}
                  options={""}
                  show={true}
                  required={true}
                  disable={isView ? true : false}
                  optionLabel={""}
                  optionValue={""}
                  handleSelect={handleSelect}
                  fldStyle={"col-12 md:col-3"}
                  formik={formik}
                />
                <FormFields
                  type={"select"}
                  name={"WorkSeverity"}
                  label={"Work Severity "}
                  options={WorkSeverityList}
                  show={true}
                  required={true}
                  disable={isView ? true : false}
                  optionLabel={"MetaSubDescription"}
                  optionValue={"MetaSubId"}
                  handleSelect={handleSelect}
                  fldStyle={"col-12 md:col-3"}
                  formik={formik}
                />
                <div className="col-12 md:col-3">
                  <label className="form-label">
                    Document Upload <span className="hlt-txt">*</span>
                  </label>
                  <div className="p-inputgroup">
                    <div className="browse-links">
                      <Button
                        label={formik.values.DocumentName}
                        link
                        onClick={handleHyperlink}
                        disabled={isView ? true : false}
                      />
                    </div>
                    <FileUpload
                      mode="basic"
                      chooseOptions={chooseOptions}
                      uploadHandler={onUploadDocument}
                      chooseLabel={documentUrl}
                      auto
                      customUpload
                      ref={documentUploadRef}
                      disabled={isView ? true : false}
                    />
                    <Button
                      icon="las la-times"
                      onClick={deleteDocuments}
                      disabled={isView ? true : false}
                    />
                  </div>
                </div>
                <FormFields
                  type={"Calendar"}
                  name={"ExpirryDate"}
                  label={"Expiry Date"}
                  options={""}
                  show={true}
                  required={true}
                  disable={isView ? true : false}
                  optionLabel={""}
                  optionValue={""}
                  handleChange={handleDChange}
                  fldStyle={"col-12 md:col-3"}
                  formik={formik}
                  minDate={new Date()}
                />
                <FormFields
                  type={"select"}
                  name={"Status"}
                  label={"Worker Status "}
                  options={StatusList}
                  show={true}
                  required={true}
                  disable={isView ? true : false}
                  optionLabel={"MetaSubDescription"}
                  optionValue={"MetaSubId"}
                  handleSelect={handleSelect}
                  fldStyle={"col-12 md:col-3"}
                  formik={formik}
                />
              </div>
              <div className="text-center mb-2">
                <Button
                  label="Add"
                  severity="success"
                  icon="las la-plus"
                  title="Add"
                  className="text-center"
                  type="submit"
                  onClick={formik.handleSubmit}
                  disabled={isView ? true : false}
                />
                <Button
                  label="Clear"
                  severity="danger"
                  icon="las la-trash"
                  title="Clear"
                  className="text-center"
                  onClick={() => OnClear()}
                  disabled={isView ? true : false}
                />
              </div>
              <div className="card">
                <DataTable
                  value={visitorDetailList}
                  showGridlines
                  paginator
                  filters={filters}
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
                  header={TableHeader}
                  emptyMessage="No Data found."
                  rows={5}
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  tableStyle={{ minWidth: "50rem" }}
                  onRowDoubleClick={(e) => onRowSelect(e)}
                >
                  <Column
                    hidden={!isCreate || !isView}
                    header="Action"
                    style={{ textAlign: "center" }}
                    body={(e) =>
                      deleteTemplate(
                        e,
                        visitorDetailList,
                        setVisitorDetailList,
                        isView,
                        isCreate,
                        toast
                      )
                    }
                  ></Column>
                  <Column field="VisitorName" header="Worker Name"></Column>
                  <Column
                    field="DepartMentName"
                    header="Department Name"
                  ></Column>
                  <Column field="ShowDate" header="Date Of Birth"></Column>
                  <Column field="MobileNo" header="Mobile No"></Column>
                  <Column field="MailId" header="Mail ID"></Column>
                  <Column field="IdCardTypeName" header="ID Card Type"></Column>
                  <Column field="IdCardNo" header="ID Card No"></Column>
                  <Column
                    field="WorkSeverityName"
                    header="Work Severity"
                  ></Column>
                  <Column
                    header="Document"
                    body={(e) => DocumentHyperLink(e)}
                  ></Column>
                  <Column field="ShowExpirryDate" header="Expiry Date"></Column>
                  <Column field="StatusName" header="Status"></Column>
                </DataTable>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Formik>
  );
};
const CVisitor = () => {
  const route = useHistory();
  const toast = useRef<Toast>(null);
  const visitorRef: any = useRef(null);
  const visitorDetailRef: any = useRef(null);
  const dispatch: any = useDispatch();
  const [imageUrl, setImageUrl] = useState(IMAGES.NO_IMG);
  const [documentUrl, setDocumentUrl] = useState("");
  const [documentUrlVisitor, setDocumentUrlVisitor] = useState("");
  const [visitorDetailList, setVisitorDetailList] = useState([]);
  const [photo, setPhoto] = useState<File | null>(null);
  const [document, setDocument] = useState<File | null>(null);
  const [visitordocument, setVisitorDocument] = useState<File | null>(null);
  const [documentfiles, setDocumentfiles] = useState<File[] | null>([]);
  const [documentfilesVis, setDocumentfilesVis] = useState<File[] | null>([]);
  const [disableForm, setDisableForm] = useState(true);
  const [tempStateList, setTempStateList] = useState([]);
  const [tempCityList, setTempCityList] = useState([]);
  const [IsdisableSave, setIsdisableSave] = useState(false);
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
    isCreate,
    isView,
    createEditData,
    loading,
    error,
    tranStatus,
    VisitorHeader,
    VisitorTypeList,
    TitleList,
    IdCardList,
    StatusList,
    CountryList,
    StateList,
    CityList,
    DepartmentList,
    VisitorDetail,
    VisitorSearchList,
    WorkSeverityList,
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
    if (isCreate == false || isView == true) {
      if (!isCreate) {
        if (VisitorHeader.VisitorTypeId == 35) {
          setDisableForm(true);
        } else {
          setDisableForm(false);
        }
      }
      let List: any[] = [];
      for (let i = 0; i < VisitorDetail.length; i++) {
        const x = VisitorDetail[i];
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
        obj.IdCardType = x.IdCardType;
        obj.IdCardNo = x.IdCardNo;
        obj.DocumentName = x.DocumentName;
        obj.DocumentUrl = x.DocumentUrl;
        obj.Status = x.Status;
        obj.ExpirryDate = x.ExpirryDate;
        obj.WorkSeverity = x.WorkSeverity;
        obj.VisitorName =
          TitleList.find((f) => f.MetaSubId == obj.TitleId).MetaSubDescription +
          ". " +
          x.FirstName +
          " " +
          x.LastName;
        obj.DepartMentName = x.DepartmentId
          ? DepartmentList.find((f) => f.DepartmentId == x.DepartmentId)
              .DepartmentName
          : null;
        obj.IdCardTypeName = IdCardList.find(
          (d) => d.MetaSubId == x.IdCardType
        ).MetaSubDescription;
        obj.StatusName = StatusList.find(
          (d) => d.MetaSubId == x.Status
        ).MetaSubDescription;
        obj.WorkSeverityName = WorkSeverityList.find(
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
      setDocumentUrlVisitor(VisitorHeader.VisitorDocumentUrl);

      fetchBlobFromUrl(VisitorHeader.DocumentUrl)
        .then((blob) => {
          const file = new File([blob], VisitorHeader.DocumentName, {
            type: "image/*",
            lastModified: 1695716506050,
          });
          setPhoto(file);
          setImageUrl(VisitorHeader.DocumentUrl);
        })
        .catch((error) => {
          console.error("Error fetching image:", error);
        });
    } else {
      const data = {
        VisitorId: 0,
      };
      var result = dispatch(createInitVM(data));
      result
        .then((res) => {
          if (res.payload.tranStatus.result) {
            if (
              res.payload.CountryList &&
              res.payload.CountryList.length &&
              res.payload.CountryList.length > 0
            ) {
              Onchangecountry(
                "CountryId",
                {},
                res.payload.CountryList[0].CountryId
              );
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
    }
  }, []);
  useEffect(() => {
    setTempCityList(CityList);
    setTempStateList(StateList);
  }, [CityList, StateList]);
  async function fetchBlobFromUrl(url: string): Promise<Blob> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    return await response.blob();
  }
  const visitorForm = {
    VisitorId: VisitorHeader != null ? VisitorHeader.VisitorId : 0,
    VisitorCode: VisitorHeader != null ? VisitorHeader.VisitorCode : "",
    VisitorTypeId: VisitorHeader != null ? VisitorHeader.VisitorTypeId : 35,
    CompanyId:
      VisitorHeader != null
        ? VisitorHeader.CompanyId
        : localStorage["CompanyId"],
    PlantId:
      VisitorHeader != null ? VisitorHeader.PlantId : localStorage["PlantId"],
    CountryId: VisitorHeader != null ? VisitorHeader.CountryId : null,
    StateId: VisitorHeader != null ? VisitorHeader.StateId : null,
    CityId: VisitorHeader != null ? VisitorHeader.CityId : null,
    TitleId: VisitorHeader != null ? VisitorHeader.TitleId : 37,
    FirstName: VisitorHeader != null ? VisitorHeader.FirstName : "",
    LastName: VisitorHeader != null ? VisitorHeader.LastName : "",
    Dob: VisitorHeader != null ? new Date(VisitorHeader.Dob) : new Date(),
    VisitorCompany: VisitorHeader != null ? VisitorHeader.VisitorCompany : "",
    Address: VisitorHeader != null ? VisitorHeader.Address : "",
    MailId: VisitorHeader != null ? VisitorHeader.MailId : "",
    MobileNo: VisitorHeader != null ? VisitorHeader.MobileNo : "",
    IdCardType: VisitorHeader != null ? VisitorHeader.IdCardType : 17,
    IdCardNo: VisitorHeader != null ? VisitorHeader.IdCardNo : "",
    DocumentName: VisitorHeader != null ? VisitorHeader.DocumentName : "",
    DocumentUrl: VisitorHeader != null ? VisitorHeader.DocumentUrl : "",
    VisitorDocumentName:
      VisitorHeader != null ? VisitorHeader.VisitorDocumentName : "",
    VisitorDocumentUrl:
      VisitorHeader != null ? VisitorHeader.VisitorDocumentUrl : "",
    Status: VisitorHeader != null ? VisitorHeader.Status : 1,
    CreatedBy:
      VisitorHeader != null ? VisitorHeader.CreatedBy : +localStorage["UserId"],
    CreatedOn:
      VisitorHeader != null ? new Date(VisitorHeader.CreatedOn) : new Date(),
    ModifiedBy: VisitorHeader != null ? +localStorage["UserId"] : null,
    ModifiedOn: VisitorHeader != null ? new Date() : null,
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
    IdCardType: 17,
    IdCardNo: "",
    DocumentName: "",
    DocumentUrl: "",
    Status: 1,
    ExpirryDate: new Date(),
    WorkSeverity: 96,
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
  const visitorFormik: any = useFormik({
    initialValues: visitorForm,
    validationSchema: VisitorValidationSchema,
    onSubmit: (values, { resetForm }) => {
      setIsdisableSave(true);
      const formData: any = new FormData();
      let VDList: any[] = [];
      values.Dob = datepipes(new Date(values.Dob));
      values.CreatedOn = datepipes(new Date(values.CreatedOn));
      if (!isCreate) {
        values.ModifiedOn = datepipes(new Date(values.ModifiedOn));
      }
      if (isCreate) {
        if (!visitordocument) {
          setIsdisableSave(false);
          toast.current?.show({
            severity: "warn",
            summary: "Warning Message",
            detail: "Please Add Document.",
          });
          return;
        }
      }
      if (values.VisitorTypeId == 35 && isCreate == true) {
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
        object.IdCardType = values.IdCardType;
        object.IdCardNo = values.IdCardNo;
        object.DocumentName = "";
        object.DocumentUrl = "";
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
        toast.current?.show({
          severity: "warn",
          summary: "Warning Message",
          detail: "Please Add Atleast One Worker Detail.",
        });
        return;
      }
      formData.append("webfile", photo);
      formData.append("webfile1", visitordocument);
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
      if (isCreate == false) {
        

        if (
          !VisitorHeader.VisitorDocumentName ||
          VisitorHeader.VisitorDocumentName == ""
        ) {
          toast.current?.show({
            severity: "warn",
            summary: "Warning Message",
            detail: "Please Add Document.",
          });
          return;
        }
        var updateres = dispatch(updateVM(formData));
        updateres
          .then((res) => {
            if (res.payload.tranStatus.result == true) {
              toast.current?.show({
                severity: "success",
                summary: "Success Message",
                detail: res.payload.tranStatus.lstErrorItem[0].Message,
              });
              setTimeout(() => {
                route.push("/home/vVisitor");
              }, 800);
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
    },
  });
  const visitorDFormik: any = useFormik({
    initialValues: visitorDetailForm,
    validationSchema: VisitorDetailValidationSchema,
    onSubmit: (values, { resetForm }) => {
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
      obj.IdCardType = values.IdCardType;
      obj.IdCardNo = values.IdCardNo;
      obj.DocumentName = values.DocumentName || "";
      obj.DocumentUrl = values.DocumentUrl || "";
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
      obj.IdCardTypeName = IdCardList.find(
        (d) => d.MetaSubId == values.IdCardType
      ).MetaSubDescription;
      obj.StatusName = StatusList.find(
        (d) => d.MetaSubId == values.Status
      ).MetaSubDescription;
      obj.WorkSeverityName = WorkSeverityList.find(
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
  const resetAllForm = () => {
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
    Onchangecountry("CountryId", {}, CountryList[0].CountryId);
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
  const handleSelect = (name, other, value) => {
    visitorFormik.setFieldValue(name, value);
  };
  const handleChange = (event) => {
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
  const onChangeVisitorType = (name, other, value) => {
    visitorFormik.setFieldValue(name, value);
    if (value == 35) {
      setDisableForm(true);
      OnClear();
      setVisitorDetailList([]);
      setDocumentfiles([]);
    } else {
      setDisableForm(false);
    }
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
  const onUpload = (e) => {
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
  const onUploadDocument = (e) => {
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
  const deleteDocuments = () => {
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
  const handleHyperlink = () => {
    if (documentUrl != "") {
      window.open(documentUrl, "_blank");
    }
  };
  const VisitorhandleHyperlink = () => {
    if (documentUrlVisitor != "") {
      window.open(documentUrlVisitor, "_blank");
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
                <h1>Visitor</h1>
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
                      onClick={visitorFormik.handleSubmit}
                      disabled={isView || IsdisableSave}
                    />
                    <Button
                      label=""
                      severity="danger"
                      icon="pi pi-trash"
                      title="Clear"
                      className="text-center"
                      disabled={isView || isCreate == false ? true : false}
                      onClick={() => resetAllForm()}
                    />
                  </>
                  <Button
                    label=""
                    icon="pi pi-search"
                    title="Back to Search"
                    className="p-button p-button-success text-center"
                    onClick={() => {
                      route.push("/home/vVisitor");
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          {!loading ? (
            <>
              <div className="form-container scroll-y">
                <VisitorForm
                  isView={isView}
                  isCreate={isCreate}
                  VisitorTypeList={VisitorTypeList}
                  handleSelect={handleSelect}
                  TitleList={TitleList}
                  CountryList={CountryList}
                  Onchangecountry={Onchangecountry}
                  StateList={StateList}
                  Onchangestate={Onchangestate}
                  CityList={CityList}
                  IdCardList={IdCardList}
                  StatusList={StatusList}
                  onUpload={onUpload}
                  itemTemplate={itemTemplate}
                  imageUrl={imageUrl}
                  handleOnChange={handleOnChange}
                  visitorForm={visitorForm}
                  visitorRef={visitorRef}
                  formik={visitorFormik}
                  onChangeVisitorType={onChangeVisitorType}
                  tempStateList={tempStateList}
                  tempCityList={tempCityList}
                  handleCloseImage={handleCloseImage}
                  handleChange={handleChange}
                  profUploadRef={profUploadRef}
                  VisitorhandleHyperlink={VisitorhandleHyperlink}
                  onUploadDocumentVisitor={onUploadDocumentVisitor}
                  deleteDocumentsVisitor={deleteDocumentsVisitor}
                  documentUrlVisitor={documentUrlVisitor}
                  documentVisitorUploadRef={documentVisitorUploadRef}
                />
                <VisitorDetailForm
                  visitorDetailList={visitorDetailList}
                  filters={filters}
                  TableHeader={TableHeader}
                  TitleList={TitleList}
                  handleSelect={handleDSelect}
                  isView={isView}
                  DepartmentList={DepartmentList}
                  IdCardList={IdCardList}
                  StatusList={StatusList}
                  OnClear={OnClear}
                  visitorDetailForm={visitorDetailForm}
                  visitorDetailRef={visitorDetailRef}
                  formik={visitorDFormik}
                  setVisitorDetailList={setVisitorDetailList}
                  documentUrl={documentUrl}
                  onUploadDocument={onUploadDocument}
                  disableForm={disableForm}
                  isCreate={isCreate}
                  onRowSelect={onRowSelect}
                  toast={toast}
                  deleteDocuments={deleteDocuments}
                  handleHyperlink={handleHyperlink}
                  handleDChange={handleDChange}
                  documentUploadRef={documentUploadRef}
                  WorkSeverityList={WorkSeverityList}
                />
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
export default CVisitor;
