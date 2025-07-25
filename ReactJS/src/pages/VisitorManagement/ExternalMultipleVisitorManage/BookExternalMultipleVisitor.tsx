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

const VisitorDocumentHyperLink: any = (rowData: any) => {
  return (
    <a href={rowData.VisitorDocumentUrl} target="_blank">
      {rowData.VisitorDocumentName}
    </a>
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
                      chooseLabel={documentUrl}
                      auto
                      customUpload
                      ref={documentUploadRef}
                      disabled={isView}
                      onSelect={(e) => onUploadDocument(e)}
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
                    // body={(e) =>
                    //   // deleteTemplate(
                    //   //   e,
                    //   //   visitorDetailList,
                    //   //   setVisitorDetailList,
                    //   //   // isView,
                    //   //   // isCreate,
                    //   //   // toast
                    //   // )
                    // }
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

const deleteTemplate = (
  rowData,
  visitorDetailList,
  setVisitorDetailList,
  formik
) => {
  const OnDelete = () => {
    setVisitorDetailList([]);
    setVisitorDetailList(visitorDetailList.filter((f) => f != rowData));
  };
  const OnEdit = () => {
    setVisitorDetailList(visitorDetailList.filter((f) => f != rowData));
    formik.setFieldValue("FirstName", rowData.FirstName);
    formik.setFieldValue("AadharNo", rowData.AadharNo);
    formik.setFieldValue("MailId", rowData.MailId);
    formik.setFieldValue("MobileNo", rowData.MobileNo);
    formik.setFieldValue("TagNo", rowData.TagNo);
    formik.setFieldValue("VisitorCompany", rowData.VisitorCompany);
    formik.setFieldValue("TitleId", rowData.TitleId);
  };
  return (
    <>
      <Button
        label=""
        severity="danger"
        title="Delete"
        icon="las la-trash"
        className="mr-2 p-1"
        onClick={() => OnDelete()}
      />
      <Button
        label=""
        severity="success"
        title="Edit"
        icon="las la-pen"
        className="mr-2 p-1"
        onClick={() => OnEdit()}
      />
    </>
  );
};

export const VisitorDocDetailForm = (props) => {
  const {
    toast,
    isCreate,
    isView,
    setVisitorDocDetailList,
    VisitorDocDetailList,
  } = props;
  const uploadRefs = useRef({});

  const AddAndDeleteTemplate: React.FC<any> = (rowData) => {
    const index = VisitorDocDetailList.indexOf(rowData);
    const handleAddRow = () => {
      let isexist: any[] = VisitorDocDetailList.filter(
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
      setVisitorDocDetailList([...VisitorDocDetailList, newObj]);
    };
    const handleDeleteRow = () => {
      const updatedgridData = [...VisitorDocDetailList];
      updatedgridData.splice(index, 1);
      if (updatedgridData.length == 0) {
        const newObj = {
          VisitorEntryBelongingDetailId: 0,
          VisitorEntryId: 0,
          DeviceNo: "",
          DeviceName: "",
        };
        setVisitorDocDetailList([newObj]);
      } else {
        setVisitorDocDetailList(updatedgridData);
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
    const updatedData = [...VisitorDocDetailList];
    updatedData[rowIndex.rowIndex][rowIndex.field] = event.target.value;
    setVisitorDocDetailList(updatedData);
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

  const documentUploadTemplate = (rowData, rowIndex, handleFileUpload) => {
    const chooseOptions = { icon: "las la-upload", iconOnly: true };

    const ClearFileUpload = () => {
      const updatedDocs = [...VisitorDocDetailList];
      updatedDocs[rowIndex.rowIndex] = {
        ...rowData,
        UploadedImage: "",
        FileName: "",
        documentUrl: "",
        IdCardNo: "",
        IdCardUrl: "",
      };
      setVisitorDocDetailList(updatedDocs);

      const fileUploadRef = uploadRefs.current[rowIndex.rowIndex];
      if (fileUploadRef && fileUploadRef.clear) {
        fileUploadRef.clear();
      }
    };
    const handleClick = (linkValue) => {
      if (linkValue) {
        window.open(linkValue, "_blank");
      } else {
        toast.current?.show({
          severity: "warn",
          summary: "Invalid File",
          detail: "No attachment found to open.",
        });
      }
    };

    return (
      <div className="p-inputgroup">
        <div className="browse-links">
          {rowData.FileName != "" && rowData.FileName != null ? (
            <Button
              label={rowData.FileName}
              link
              onClick={() => handleClick(rowData.LocalPreviewUrl)}
            />
          ) : null}
        </div>
        <FileUpload
          ref={(el) => {uploadRefs.current[rowIndex.rowIndex] = el}}
          mode="basic"
          customUpload
          chooseOptions={chooseOptions}
          // maxFileSize={1000000}
          onSelect={(e) => handleFileUpload(e, rowIndex, rowData)}
          chooseLabel={rowData.FileName || "Upload"}
          auto
          accept=".jpeg, .jpg, .png, .pdf, .word, .xls, .xlsx"
          disabled={isView ? true : false}
        />
        <Button
          icon="las la-times"
          disabled={isView || !rowData.FileName}
          onClick={ClearFileUpload}
        />
      </div>
    );
  };

  const handleFileUpload = (e, rowIndex, rowData) => {
    const file = e.files[0];
    if (!file) return;
    const extension = file.name.split(".").pop();
    const docType = rowData.IdCardType || "Document";
    const uniqueFileName = `${docType}_${Date.now()}_${Math.floor(
      Math.random() * 10000
    )}.${extension}`;
    const renamedFile = new File([file], uniqueFileName, { type: file.type });

    const previewUrl = URL.createObjectURL(renamedFile);

    const displayName = file.name.toLowerCase().startsWith("whatsapp image")
      ? "WhatsApp Image"
      : file.name;

    const reader = new FileReader();
    reader.onloadend = () => {
      const updatedDocs = [...VisitorDocDetailList];
      updatedDocs[rowIndex.rowIndex] = {
        ...rowData,
        UploadedImage: reader.result,
        FileName: displayName,
        IdCardUrl: uniqueFileName,
        LocalPreviewUrl: previewUrl,
        RawFile: renamedFile,
      };
      setVisitorDocDetailList(updatedDocs);
    };
    reader.readAsDataURL(renamedFile);

    const ClearFileUpload = () => {
      const updatedDocs = [...VisitorDocDetailList];
      updatedDocs[rowIndex.rowIndex] = {
        ...rowData,
        UploadedImage: "",
        FileName: "",
        IdCardNo: "",
        IdCardUrl: "",
      };
      setVisitorDocDetailList(updatedDocs);

      const fileUploadRef = uploadRefs.current[rowIndex.rowIndex];
      if (fileUploadRef && fileUploadRef.clear) {
        fileUploadRef.clear();
      }
    };

    ClearFileUpload();
  };

  // return (
  //   <>
  //     <div className="sub-title">
  //       <div className="grid">
  //         <div className="col-12">
  //           <h2>Document Details</h2>
  //         </div>
  //       </div>
  //     </div>
  //     <div className="normal-table">
  //       {/* <div className="card"> */}
  //       <DataTable
  //         value={VisitorDocDetailList}
  //         showGridlines
  //         // paginator
  //         filterDisplay="menu"
  //         globalFilterFields={[
  //           "VisitorName",
  //           "DepartMentName",
  //           "Dob",
  //           "MobileNo",
  //           "MailId",
  //           "IdCardTypeName",
  //           "IdCardNo",
  //           "StatusName",
  //         ]}
  //         emptyMessage="No Data found."
  //         // editMode="cell"
  //         // rows={5}
  //         // rowsPerPageOptions={[5, 10, 25, 50, 100]}
  //         // currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Entries"
  //         // paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
  //         // tableStyle={{ minWidth: "50rem" }}
  //       >
  //         {/* <Column
  //           field="Action"
  //           header="Action"
  //           style={{ width: "35%", textAlign: "center" }}
  //           body={AddAndDeleteTemplate}
  //         /> */}
  //         <Column
  //           field="IdCardType"
  //           header="Document Name"
  //           style={{ width: "25%" }}
  //           body={(rowData, rowIndex) => textEditor(rowData, rowIndex)}
  //         />
  //         <Column
  //           field="IdCardNo"
  //           header="Document Number"
  //           style={{ width: "25%" }}
  //           body={(rowData, rowIndex) => textEditor(rowData, rowIndex)}
  //         />
  //         <Column
  //           field="IdCardUrl"
  //           header="Doument Upload"
  //           style={{ width: "25%" }}
  //           body={(rowData, rowIndex) =>
  //             documentUploadTemplate(rowData, rowIndex, handleFileUpload)
  //           }
  //         />
  //       </DataTable>
  //       {/* </div> */}
  //     </div>
  //   </>
  // );
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

const VisitorForm = (props) => {
  const {
    isView,
    isCreate,
    VisitorTypeList,
    handleSelect,
    handleOnChange,
    TitleList,
    formik,
    onUpload,
    imageUrl,
    visitorForm,
    visitorRef,
    onSubmit,
    handleChange,
    cameraOff,
    setCameraOff,
    phonenumber,
    workerList,
    setWorkerList,
    addVisitorDetail,
    visitorDetailList,
    setVisitorDetailList,
    OnClear,
    toast,
    handleMobKeyPress,
    handleMobBack,
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
                <>
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
                </>
                {/* <FormFields
                  type={"text_title"}
                  name={"CountryCode"}
                  label={"Mobile No"}
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
                  titleInputName={"MobileNo"}
                  handleKeyPress={handleMobKeyPress}
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
                {/* <FormFields
  type="text"
  name="AadharNo"
  label="Aadhar No"
  options={[]}
  show={true}
  maxLength={12} 
  required={true}
  disable={isView}
  // handleChange={handleAadhaarChange}  
  fldStyle="col-12 md:col-6"
  keyfilter="int"
  formik={formik}
  value={formik.values["AadharNo"]}
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
          <div className="text-center mb-3">
            <Button
              label="Add"
              severity="success"
              icon="las la-plus"
              title="Add"
              className="text-center"
              onClick={addVisitorDetail}
              type="submit"
            />
            <Button
              label="Clear"
              severity="danger"
              icon="las la-trash"
              title="Clear"
              className="text-center"
              onClick={() => OnClear()}
            />
          </div>
          <div className="card">
            <DataTable
              value={visitorDetailList}
              showGridlines
              paginator
              // filters={filters}
              filterDisplay="menu"
              globalFilterFields={[
                "FirstName",
                "MailId",
                "AadharNo",
                "MobileNo",
                "VisitorCompany",
                "TagNo",
              ]}
              emptyMessage="No Data Found."
              rows={5}
              // tableStyle={{ minWidth: "50rem" }}
              // rowsPerPageOptions={[5, 10, 25, 50, 100]}
              // currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Entries"
              // paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            >
              <Column
                header="Action"
                style={{
                  textAlign: "center",
                  overflowWrap: "break-word",
                  width: "5%",
                }}
                body={(e) =>
                  deleteTemplate(
                    e,
                    visitorDetailList,
                    setVisitorDetailList,
                    formik
                  )
                }
                headerClassName="text-center"
              ></Column>
              <Column
                field="FirstName"
                style={{
                  width: "5%",
                  overflowWrap: "break-word",
                }}
                header="Name"
                headerClassName="text-center"
              ></Column>
              <Column
                field="MailId"
                style={{
                  width: "5%",
                  overflowWrap: "break-word",
                }}
                header="Mail Id"
                headerClassName="text-center"
              ></Column>
              <Column
                field="MobileNo"
                header="Mobile No"
                style={{
                  width: "5%",
                  overflowWrap: "break-word",
                }}
                // body={(e) => DocumentHyperLink(e)}
                headerClassName="text-center"
              ></Column>
              {/* <Column
                field="AadharNo"
                header="Aadhar No"
                style={{
                  width: "5%",
                  overflowWrap: "break-word",
                }}
                // body={(e) => DocumentHyperLink(e)}
                headerClassName="text-center"
              ></Column> */}
              {/* <Column
                field="VisitorCompany"
                style={{
                  width: "5%",
                  overflowWrap: "break-word",
                }}
                header="Visitor Company"
                headerClassName="text-center"
              ></Column>
              <Column
                field="TagNo"
                style={{
                  width: "5%",
                  overflowWrap: "break-word",
                }}
                header="Tag No"
                headerClassName="text-center"
              ></Column> */}
            </DataTable>
          </div>
        </div>
      </div>
    </Formik>
  );
};
export const visitorForm = {
  VisitorName: "",
  MobileNo: "",
  AadharNo: "",
  Email: "",
  Gender: "",
  VisitPurpose: "",
  VisitDate: "",
  DepartmentId: "",
  IdCardType: "",
  IdCardNo: "",
  CompanyName: "",
  Designation: "",
  Status: "", // Visit status (Pending, Approved, Rejected)
  EntryTime: "", // Time of entry
  ExitTime: "", // Time of exit
  IsCheckedIn: false, // Boolean flag if visitor has checked in
  IsCheckedOut: false, // Boolean flag if visitor has checked out
  DocumentUpload: null, // Placeholder for uploaded document/image
  Remarks: "", // Additional notes or remarks
};
export const BookExternalVisitor = (props) => {
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
    addVisitorDetail,
    visitorDetailList,
    setVisitorDetailList,
    OnClear,
    TitleList,
    handleMobKeyPress,
    handleMobBack,
    VisitorDocDetailList,
    setVisitorDocDetailList,
    IsDocDetailsShow,
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
                addVisitorDetail={addVisitorDetail}
                visitorDetailList={visitorDetailList}
                setVisitorDetailList={setVisitorDetailList}
                OnClear={OnClear}
                handleMobKeyPress={handleMobKeyPress}
                handleMobBack={handleMobBack}
              />
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

              {/* <div className={isViewVM ? "p-disabled" : ""}>
                <VisitorDocDetailForm
                  VisitorDocDetailList={VisitorDocDetailList}
                  setVisitorDocDetailList={setVisitorDocDetailList}
                  isView={isViewVM}
                  isCreate={isCreateVM}
                  toast={toast}
                  IsDocDetailsShow={IsDocDetailsShow}
                />
              </div> */}
            </>
          ) : (
            <AppProgressSpinner />
          )}
        </div>
      </div>
    </>
  );
};
export default BookExternalVisitor;
