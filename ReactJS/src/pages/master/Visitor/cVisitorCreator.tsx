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
import { forwardRef, useEffect, useRef, useState } from "react";

import { FileUpload } from "primereact/fileupload";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FilterMatchMode } from "primereact/api";
import { InputText } from "primereact/inputtext";
import AppAlert from "@/alert/alert";
import React from "react";
import { pageLoadScript } from "@/assets/js/common-utilities";
import { IMAGES } from "@/assets/images/Images";
import { VisitorEntryBelongingDetailForm } from "@/pages/VisitorManagement/VisitorEntry/cVisitorEntryCreator";
import { Dropdown } from "primereact/dropdown";
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
const VisitorForm = forwardRef((props: any, visitorRef) => {
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
    onSubmit,
    profUploadRef,
    onChangeVisitorType,
    tempStateList,
    tempCityList,
    handleCloseImage,
    handleChange,
    VisitorhandleHyperlink,
    onUploadDocumentVisitor,
    deleteDocumentsVisitor,
    documentVisitorUploadRef,
    documentUrlVisitor,
    VisType,
    isCurrentCreate,
    createVisEnt,
    IsBelongingDetailsShow,
    VisitorEntryBelongingDetailList,
    setVisitorEntryBelongingDetailList,
    toast,
    handleMobKeyPress,
    handleMobBack
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
      {/* <div className="white"> */}
      <div className="widget-body">
        <div className="normal-table">
          <div className="grid">
            {/* <div className="col-12 md:col-3">
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
              </div> */}
            <div className="col-12 md:col-12">
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
                  fldStyle={"col-12 md:col-3"}
                  formik={formik}
                />
                <FormFields
                  type={"select"}
                  name={"VisitorTypeId"}
                  label={"Visitor Type "}
                  options={VisitorTypeList}
                  show={false}
                  required={true}
                  // disable={isView || isCreate == false ? true : false}
                  disable={true}
                  optionLabel={"MetaSubDescription"}
                  optionValue={"MetaSubId"}
                  handleSelect={onChangeVisitorType}
                  fldStyle={"col-12 md:col-3"}
                  formik={formik}
                />
                {/* <FormFields
                  type={"text"}
                  name={"TitleId"}
                  label={"Worker Name "}
                  options={TitleList}
                  show={true}
                  required={true}
                  disable={isView ? true : false}
                  optionLabel={"MetaSubDescription"}
                  optionValue={"MetaSubId"}
                  handleSelect={handleSelect}
                  handleOnChange={handleOnChange}
                  titleInputName={"FirstName"}
                  fldStyle={"col-12 md:col-3"}
                  formik={formik}
                  maxLength={50}
                /> */}
                <>
                  <div className={"col-12 md:col-3"}>
                    <label className="form-label">
                      {"WhatsApp Mobile No"}
                      <span className="hlt-txt">*</span>
                    </label>

                    {/* <div className="p-inputgroup flex-1">
                      <Dropdown
                        className="small-combo"
                        id={"CountryCode"}
                        name={"CountryCode"}
                        value={formik.values["CountryCode"]}
                        options={phonenumber}
                        onBlur={formik.handleBlur}
                        optionLabel={"CountryCode"}
                        optionValue={"CountryCode"}
                        disabled={true}
                        onChange={(e) => {
                          handleSelect(e.target.value);
                        }}
                      /> */}
                      <InputText
                        className="w-full"
                        name={"MobileNo"}
                        disabled={isView ? true : false}
                        onBlur={formik.handleBlur}
                        onChange={(e) => {
                          handleMobKeyPress(e)
                        }}
                        onKeyDown={handleMobBack}
                        value={formik.values["MobileNo"]}
                        autoComplete="new-password"
                        placeholder={"Enter WhatsApp Mobile No"}
                        maxLength={10}
                        minLength={10}
                        keyfilter={"int"}
                      />
                    {/* </div> */}
                    <small className="p-error text-sm">
                      {formik.touched &&
                        formik.touched["MobileNo"] &&
                        formik.errors &&
                        formik.errors["MobileNo"]}
                    </small>
                  </div>
                </>
                {/* <FormFields
                  type={"text"}
                  name={"MobileNo"}
                  label={"Mobile No "}
                  options={""}
                  show={true}
                  required={true}
                  disable={
                    isView || (!createVisEnt && !isCurrentCreate) ? true : false
                  }
                  optionLabel={""}
                  optionValue={""}
                  handleSelect={""}
                  fldStyle={"col-12 md:col-3"}
                  formik={formik}
                  keyfilter="int"
                  maxLength={10}
                  minLength={10}
                /> */}
                <FormFields
                  type={"text"}
                  name={"FirstName"}
                  label={`${VisType == 36 ? "Worker" : "Visitor"} Name`}
                  options={""}
                  show={true}
                  required={true}
                  disable={
                    isView || (!createVisEnt && !isCurrentCreate) ? true : false
                  }
                  optionLabel={""}
                  optionValue={""}
                  handleSelect={""}
                  fldStyle={"col-12 md:col-3"}
                  formik={formik}
                  maxLength={50}
                />
                <FormFields
                  type={"text"}
                  name={"LastName"}
                  label={"Last Name "}
                  options={""}
                  show={false}
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
                  fldStyle={"col-12 md:col-3"}
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
                  disable={
                    isView ? true : false
                  }
                  optionLabel={""}
                  optionValue={""}
                  handleSelect={""}
                  fldStyle={"col-12 md:col-3"}
                  formik={formik}
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
            <div hidden={!IsBelongingDetailsShow}>
              <div
                className={isView ? "p-disabled" : ""}
                hidden={!IsBelongingDetailsShow}
              >
                sd
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
            {!isCurrentCreate ? (
              <div className="col-12 md:col-9">
                <div className="grid">
                  {/* <div className="col-12 md:col-4">
                   <label className="form-label">
                     Document Upload 
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
                 </div> */}
                  {!isCurrentCreate ? (
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
                      fldStyle={"col-12 md:col-4"}
                      formik={formik}
                      disable={false}
                      appendTo={"self"}
                      // disable={
                      //   (isView ? true : false) ||
                      //   (isCreate == null || isCreate == true ? true : false)
                      // }
                    />
                  ) : null}
                  <FormFields
                    type={"textarea"}
                    name={"Address"}
                    label={"Address"}
                    options={""}
                    show={false}
                    required={true}
                    disable={isView ? true : false}
                    optionLabel={""}
                    optionValue={""}
                    handleSelect={""}
                    formik={formik}
                    fldStyle={"col-12 md:col-4"}
                    maxLength="500"
                    style={{ maxHeight: "100px", overflowY: "auto" }}
                  />

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
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      {/* </div> */}
    </Formik>
  );
});
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
const CVisitorCreator = (props) => {
  const {
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
    VisType,
    isCurrentCreate,
    createVisEnt,
    resetAllVehForm,
    IsBelongingDetailsShow,
    VisitorEntryBelongingDetailList,
    setVisitorEntryBelongingDetailList,
    toast,
    handleMobKeyPress,
    handleMobBack,
    saveVmaster
  } = props;

  return (
    <>
      {/* <div className="page-container"> */}
      {/* <div className="inner-page-container"> */}
      <div>
        <div className="white">
          <div className="widget-hdr">
            <div className="sub-title">
              <div className="grid">
                <div className="col-12">
                  <h2>{`${
                    VisType == 36 ? "Worker" : "Visitor"
                  } Information`}</h2>
                </div>
                {/* <div className="md:col-6 text-right">
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
                </div> */}
              </div>
            </div>
            {!loadingVM ? (
              <>
                <VisitorForm
                  isView={isViewVM}
                  isCreate={isCreateVM}
                  VisitorTypeList={VisitorTypeListVM}
                  handleSelect={handleSelectVM}
                  TitleList={TitleListVM}
                  CountryList={CountryListVM}
                  Onchangecountry={OnchangecountryVM}
                  StateList={StateListVM}
                  Onchangestate={OnchangestateVM}
                  CityList={CityListVM}
                  IdCardList={IdCardListVM}
                  StatusList={StatusListVM}
                  onUpload={onUploadVM}
                  itemTemplate={itemTemplateVM}
                  imageUrl={imageUrlVM}
                  handleOnChange={handleOnChangeVM}
                  visitorForm={visitorFormVM}
                  visitorRef={visitorRefVM}
                  formik={visitorFormikVM}
                  onChangeVisitorType={onChangeVisitorTypeVM}
                  tempStateList={tempStateListVM}
                  tempCityList={tempCityListVM}
                  handleCloseImage={handleCloseImageVM}
                  handleChange={handleChangeVM}
                  profUploadRef={profUploadRefVM}
                  VisitorhandleHyperlink={VisitorhandleHyperlinkVM}
                  onUploadDocumentVisitor={onUploadDocumentVisitorVM}
                  deleteDocumentsVisitor={deleteDocumentsVisitorVM}
                  documentUrlVisitor={documentUrlVisitorVM}
                  documentVisitorUploadRef={documentVisitorUploadRefVM}
                  VisType={VisType}
                  isCurrentCreate={isCurrentCreate}
                  createVisEnt={createVisEnt}
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
                />
                {/* <VisitorDetailForm
                  visitorDetailList={visitorDetailListVM}
                  filters={filtersVM}
                  TableHeader={TableHeaderVM}
                  TitleList={TitleListVM}
                  handleSelect={handleDSelectVM}
                  isView={isViewVM}
                  DepartmentList={DepartmentListVM}
                  IdCardList={IdCardListVM}
                  StatusList={StatusListVM}
                  OnClear={OnClearVM}
                  visitorDetailForm={visitorDetailFormVM}
                  visitorDetailRef={visitorDetailRefVM}
                  formik={visitorDFormikVM}
                  setVisitorDetailList={setVisitorDetailListVM}
                  documentUrl={documentUrlVM}
                  onUploadDocument={onUploadDocumentVM}
                  disableForm={disableFormVM}
                  isCreate={isCreateVM}
                  onRowSelect={onRowSelectVM}
                  toast={toastVM}
                  deleteDocuments={deleteDocumentsVM}
                  handleHyperlink={handleHyperlinkVM}
                  handleDChange={handleDChangeVM}
                  documentUploadRef={documentUploadRefVM}
                  WorkSeverityList={WorkSeverityListVM}
                /> */}
              </>
            ) : (
              <AppProgressSpinner />
            )}
          </div>
          {!isCurrentCreate ? (
            <div className="widget-ftr text-center">
              <Button
                label="Save"
                title="Save"
                icon="pi pi-save"
                type="submit"
                onClick={saveVmaster}
                // disabled={isView || IsdisableSave}
              />
              <Button
                label="Clear"
                severity="danger"
                className="preview-close"
                title="Clear"
                icon="pi pi-times-circle"
                // disabled={isView || isCreate == false ? true : false}
                onClick={() => {
                  visitorFormikVM.resetForm()
                  visitorDFormikVM.resetForm()
                  setVisitorShow(false);
                }}
              />
            </div>
          ) : null}
        </div>
      </div>

      {/* </div> */}
      {/* </div> */}
      {/* <AppAlert toast={toast} /> */}
    </>
  );
};
export default CVisitorCreator;
