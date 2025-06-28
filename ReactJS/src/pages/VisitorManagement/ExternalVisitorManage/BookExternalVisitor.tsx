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

import { FileUpload } from "primereact/fileupload";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FilterMatchMode } from "primereact/api";
import { InputText } from "primereact/inputtext";
import AppAlert from "@/alert/alert";
import React from "react";
import { pageLoadScript } from "@/assets/js/common-utilities";
import { IMAGES } from "@/assets/images/Images";
import BookExternalVisitorEntry from "@/pages/VisitorManagement/ExternalVisitorManage/BookExternalVisitorEntry";
import PhotoCapture from "@/components/PhotoCapture";
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
          // paginator
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
          // editMode="cell"
          // rows={5}
          // rowsPerPageOptions={[5, 10, 25, 50, 100]}
          // currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Entries"
          // paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
          // tableStyle={{ minWidth: "50rem" }}
        >
          {/* <Column
            field="Action"
            header="Action"
            style={{ width: "35%", textAlign: "center" }}
            body={AddAndDeleteTemplate}
          /> */}
          <Column
            field="DeviceName"
            header="Property Name"
            style={{ width: "40%" }}
            body={(rowData, rowIndex) => textEditor(rowData, rowIndex)}
          />
          {/* <Column
            field="SerialNo"
            header="Serial No"
            style={{ width: "40%" }}
            body={(rowData, rowIndex) => textEditor(rowData, rowIndex)}
          /> */}
          <Column
            field="DeviceNo"
            header="Serial No"
            style={{ width: "25%" }}
            body={(rowData, rowIndex) => textEditor(rowData, rowIndex)}
          />
        </DataTable>
        {/* </div> */}
      </div>
    </>
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
    saveVisitorDetails,
    cameraOff,
    setCameraOff,
    phonenumber,
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
      <div className="grid">
        <div className="col-12">
          <div className="grid">
            <div className="col-12 md:col-8">
              <div className="grid">
                <div className={"col-12 md:col-6"}>
                  <label className="form-label">
                    {"WhatsApp Mobile No"}
                    <span className="hlt-txt">*</span>
                  </label>

                  <div className="p-inputgroup flex-1">
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
                    />
                    <InputText
                      className="w-full"
                      name={"MobileNo"}
                      disabled={isView ? true : false}
                      onBlur={formik.handleBlur}
                      onChange={(e) => {
                        handleMobKeyPress(e);
                        formik.handleChange;
                      }}
                      onKeyDown={handleMobBack}
                      value={formik.values["MobileNo"]}
                      autoComplete="new-password"
                      placeholder={"Enter WhatsApp Mobile No"}
                      maxLength={10}
                      minLength={10}
                      keyfilter={"int"}
                    />
                  </div>
                  <small className="p-error text-sm">
                    {formik.touched &&
                      formik.touched["MobileNo"] &&
                      formik.errors &&
                      formik.errors["MobileNo"]}
                  </small>
                </div>
                {/* <FormFields
                  type={"text_title"}
                  name={"MobileNo"}
                  label={"Mobile No "}
                  options={phonenumber}
                  show={true}
                  required={true}
                  disable={isView ? true : false}
                  optionLabel={"CountryCode"}
                  optionValue={"CountryCode"}
                  handleSelect={handleSelect}
                  optionDisable={true}
                  fldStyle={"col-12 md:col-6"}
                  formik={formik}
                  keyfilter="int"
                  maxLength={10}
                  minLength={10}
                  titleInputName={"CountryCode"}
                /> */}
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
                  type={"text_title"}
                  name={"TitleId"}
                  label={"Name "}
                  options={TitleList}
                  show={true}
                  required={true}
                  disable={isView ? true : false}
                  optionLabel={"MetaSubDescription"}
                  optionValue={"MetaSubId"}
                  handleSelect={handleSelect}
                  handleOnChange={handleOnChange}
                  titleInputName={"FirstName"}
                  fldStyle={"col-12 md:col-6"}
                  formik={formik}
                  maxLength={50}
                />
                {/* <FormFields
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
                /> */}
                <FormFields
                  type={"Calendar"}
                  name={"Dob"}
                  label={"Date of Birth"}
                  options={""}
                  show={false}
                  required={true}
                  disable={isView ? true : false}
                  optionLabel={""}
                  optionValue={""}
                  handleChange={handleChange}
                  fldStyle={"col-12 md:col-6"}
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
                  handleSelect={""}
                  fldStyle={"col-12 md:col-6"}
                  formik={formik}
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
                  fldStyle={"col-12 md:col-6"}
                  formik={formik}
                  maxLength={100}
                />
                <FormFields
                  type={"text"}
                  name={"TagNo"}
                  label={"Tag No "}
                  options={""}
                  show={true}
                  required={false}
                  disable={isView ? true : false}
                  optionLabel={""}
                  optionValue={""}
                  handleSelect={""}
                  fldStyle={"col-12 md:col-6"}
                  formik={formik}
                  // keyfilter="int"
                  // maxLength={15}
                  // minLength={9}
                />
                <FormFields
                  type={"textarea"}
                  name={"Address"}
                  label={"Address"}
                  options={""}
                  show={false}
                  required={false}
                  disable={isView ? true : false}
                  optionLabel={""}
                  optionValue={""}
                  handleSelect={""}
                  formik={formik}
                  fldStyle={"col-12 md:col-12"}
                  maxLength="500"
                  style={{ maxHeight: "100px", overflowY: "auto" }}
                />
              </div>
            </div>
            <div className="col-12 md:col-4">
              {/* <div className="img-preview-container m-auto">
                <FileUpload
                  mode="basic"
                  name="demo[]"
                  chooseOptions={customOptions}
                  className="custom-upload inline-block"
                  accept="image/jpeg, image/png, image/jpg"
                  auto
                  chooseLabel="Upload Photo"
                  onSelect={onUpload}
                  customUpload
                  disabled={isView}
                  ref={profUploadRef}
                // maxFileSize={1000000}
                // uploadHandler={onUpload}
                />
                <div className="img-preview-hidden">
                  <img src={imageUrl} alt="logo" className="w-full" />
                </div>
                <a
                  className={`${isView ? "p-disabled" : null
                    } img-preview-close`}
                  onClick={handleCloseImage}
                >
                  <i className="las la-times-circle"></i>
                </a>
              </div> */}
              <PhotoCapture
                onUpload={onUpload}
                ImageUrl={imageUrl}
                isView={isView || !isCreate}
                cameraOff={cameraOff}
                setCameraOff={setCameraOff}
                fldStyle={`col-12 text-center`}
                toast={toast}
                isExternal={0}
              />
            </div>
          </div>
          {/* <div className="col-12"> */}

          {/* <div className="grid"> */}

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
            /> */}
          {/* <FormFields
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
            /> */}
          {/* <FormFields
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

          {/* </div> */}
          {/* </div> */}

          {/* <FormFields
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
              /> */}
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
                  show={false}
                  required={true}
                  disable={isView ? true : false}
                  optionLabel={""}
                  optionValue={null}
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
                  label={"ID Proof Type "}
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
                  label={"ID Proof No "}
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
                  <Column
                    field="IdCardTypeName"
                    header="ID Proof Type"
                  ></Column>
                  <Column field="IdCardNo" header="ID Proof No"></Column>
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
const BookExternalVisitor = (props) => {
  const {
    setIsVisMaster,
    isVisMaster,
    visitorEntryFormik,
    VisitorNameList,
    handleVisitorSelected,
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
    formikVM,
    onChangeVisitorTypeVM,
    tempStateListVM,
    tempCityListVM,
    handleCloseImageVM,
    handleChangeVM,
    profUploadRef,
    VisitorhandleHyperlinkVM,
    onUploadDocumentVisitorVM,
    deleteDocumentsVisitorVM,
    documentUrlVisitorVM,
    documentVisitorUploadRefVM,
    loadingVM,
    toast,
    VisitorEntryBelongingDetailList,
    setVisitorEntryBelongingDetailList,
    IsBelongingDetailsShow,
    pageType,
    cameraOff,
    setCameraOff,
    phonenumber,
    TitleList,
    handleMobKeyPress,
    handleMobBack
  } = props;

  const route = useHistory();
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
      <div className="widget-hdr">
        <div className="sub-title">
          <div className="grid">
            <div className="col-12">
              <h2>{`${pageType ? "Visitor" : "Visitor"} Information`}</h2>
            </div>
          </div>
        </div>
      </div>
      <div className="widget-body">
        <div className="normal-table">
          {!loadingVM ? (
            <>
              <VisitorForm
                isView={isViewVM}
                isCreate={isCreateVM}
                VisitorTypeList={VisitorTypeListVM}
                handleSelect={handleSelectVM}
                TitleList={TitleList}
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
                formik={formikVM}
                onChangeVisitorType={onChangeVisitorTypeVM}
                tempStateList={tempStateListVM}
                tempCityList={tempCityListVM}
                handleCloseImage={handleCloseImageVM}
                handleChange={handleChangeVM}
                profUploadRef={profUploadRef}
                VisitorhandleHyperlink={VisitorhandleHyperlinkVM}
                onUploadDocumentVisitor={onUploadDocumentVisitorVM}
                deleteDocumentsVisitor={deleteDocumentsVisitorVM}
                documentUrlVisitor={documentUrlVisitorVM}
                documentVisitorUploadRef={documentVisitorUploadRefVM}
                toast={toast}
                phonenumber={phonenumber}
                handleMobKeyPress={handleMobKeyPress}
                handleMobBack={handleMobBack}
              />
              {/* <div className="col-12 flex flex-row gap-3 md:col-12"> */}
              {/* <div className="white col-12" > */}
              <div className={isViewVM ? "p-disabled" : ""}>
                <VisitorEntryBelongingDetailForm
                  VisitorEntryBelongingDetailList={
                    VisitorEntryBelongingDetailList
                  }
                  setVisitorEntryBelongingDetailList={
                    setVisitorEntryBelongingDetailList
                  }
                  isView={isViewVM}
                  isCreate={isCreateVM}
                  toast={toast}
                  IsBelongingDetailsShow={IsBelongingDetailsShow}
                />
              </div>
              {/* </div> */}
              {/* </div> */}
            </>
          ) : (
            <AppProgressSpinner />
          )}
        </div>
      </div>

      {/* <div className="border-gray-400 border-top-1 white"> */}
      {/* <div className="flex flex-row justify-content-end widget-ftr text-center"> */}
      {/* <div className='widget-ftr text-center'>
            <Button label="Save" title="Save" icon='pi pi-save' />
            <Button label="Cancel" severity='danger' className='preview-close' title="Cancel" icon='pi pi-times-circle' />
          </div> */}
      {/* </div> */}
      {/* </div> */}
    </>
  );
};
export default BookExternalVisitor;
