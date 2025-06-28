import React, { useState, useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Button } from "primereact/button";
import { Rating } from "primereact/rating";
import { InputText } from "primereact/inputtext";
import { useDispatch, useSelector } from "react-redux";
import {
  EmployeeDetailValidationSchema,
  EmployeeValidationSchema,
} from "@/validations/Master";
import AppTable from "@/components/AppTable";
import PageHeader from "@/components/PageHeader";
import {
  createInit,
  createEmployee,
  updateEmployee,
} from "@/redux/slices/master/employeeSlice";
import FormFields from "@/components/FormFields";
import { Formik, useFormik } from "formik";
import { Column, DataTable, Dropdown, Toast } from "@/assets/css/prime-library";
import { FileUpload } from "primereact/fileupload";
import { AppProgressSpinner } from "@/components/UtilityComp";
import { pageLoadScript } from "@/assets/js/common-utilities";
import AppAlert from "@/alert/alert";
import { IMAGES } from "@/assets/images/Images";

const deleteTemplate = (
  rowData,
  employeeDetailList,
  setEmployeeDetailList,
  isView
) => {
  const OnDelete = () => {
    setEmployeeDetailList([]);
    setEmployeeDetailList(employeeDetailList.filter((f) => f != rowData));
  };
  return (
    <Button
      label=""
      severity="danger"
      title="Delete"
      icon="las la-trash"
      className="mr-2 p-1"
      disabled={isView ? true : false}
      onClick={() => OnDelete()}
    />
  );
};
const DocumentHyperLink: any = (rowData: any) => {
  return (
    <a style={{ color: "blue" }} href={rowData.AttachmentUrl} target="_blank">
      {rowData.AttachmentName}
    </a>
  );
};
const EmployeeForm = (props) => {
  const {
    isCreate,
    isView,
    createEditData,
    loading,
    error,
    formik,
    handleSelect,
    EmployeeStatus,
    Employee,
    EmployeeList,
    StatusList,
    RoleList,
    DepartmentList,
    GenderList,
    MaritalStatusList,
    EmployeeTypeList,
    BloodGroupList,
    ReportingPersonList,
    EmployeeDocumentDetailList,
    HdrTable,
    maxDateDob,
    date18YearsAgo,
    date18YearsAfter,
    onChangeDob,
    handleChangeDob,
    onUpload,
    itemTemplate,
    imageUrl,
    agecalc,
    onSubmit,
    handleCloseImage,
    handleChangeDate,
    imageUploadRef,
    handleDobChange
  } = props;
  const customOptions = { icon: "las la-camera-retro", iconOnly: true };
  return (
    <Formik
      initialValues={EmployeeForm}
      validationSchema={EmployeeValidationSchema}
      onSubmit={onSubmit}
    >
      <form>
        {!loading ? (
          <>
            <div className="white">
              <div className="widget-hdr">
                <div className="sub-title">
                  <div className="grid">
                    <div className="md:col-6">
                      <h2>Personal Information</h2>
                    </div>
                  </div>
                </div>
              </div>
              <div className="widget-body">
                <div className="normal-table">
                  <div className="grid">
                    <div className="col-12 md:col-3">
                      <div className="img-preview-container m-auto">
                        <FileUpload
                          mode="basic"
                          name="demo[]"
                          url="#"
                          chooseOptions={customOptions}
                          className="custom-upload inline-block"
                          accept="image/jpeg, image/png, image/jpg"
                          auto
                          chooseLabel="Upload Photo"
                          uploadHandler={onUpload}
                          disabled={isView ? true : false}
                          customUpload
                          ref={imageUploadRef}
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
                      </div>
                    </div>
                    <div className="col-12 md:col-9">
                      <div className="grid">
                        <FormFields
                          type={"text"}
                          name={"FirstName"}
                          label={"First Name"}
                          options={""}
                          show={true}
                          required={true}
                          disable={isView ? true : false}
                          optionLabel={""}
                          optionValue={""}
                          handleSelect={""}
                          formik={formik}
                          fldStyle={"col-12 md:col-4"}
                        />
                        <FormFields
                          type={"text"}
                          name={"LastName"}
                          label={"Last Name"}
                          options={""}
                          show={true}
                          required={true}
                          disable={isView ? true : false}
                          optionLabel={""}
                          optionValue={""}
                          handleSelect={""}
                          formik={formik}
                          fldStyle={"col-12 md:col-4"}
                        />
                        <FormFields
                          type={"select"}
                          name={"Gender"}
                          label={"Gender"}
                          options={GenderList}
                          show={true}
                          required={true}
                          disable={isView ? true : false}
                          optionLabel={"MetaSubDescription"}
                          optionValue={"MetaSubId"}
                          handleSelect={handleSelect}
                          formik={formik}
                          fldStyle={"col-12 md:col-4"}
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
                          handleSelect={handleSelect}
                          // handleChange={handleChangeDob}
                          handleChange={(e) => {
                            agecalc(e);
                            formik.handleChange(e);
                            handleChangeDob(e);
                          }}
                          formik={formik}
                          maxDate={date18YearsAgo}
                          fldStyle={"col-12 md:col-4"}
                        />
                        <FormFields
                          type={"text"}
                          name={"Age"}
                          label={"Age"}
                          options={""}
                          show={true}
                          required={true}
                          disable={true}
                          optionLabel={""}
                          optionValue={""}
                          handleSelect={""}
                          formik={formik}
                          fldStyle={"col-12 md:col-4"}
                        />
                        <FormFields
                          type={"select"}
                          name={"MaritalStatus"}
                          label={"Marital Status"}
                          options={MaritalStatusList}
                          show={true}
                          required={true}
                          disable={isView ? true : false}
                          optionLabel={"MetaSubDescription"}
                          optionValue={"MetaSubId"}
                          handleSelect={handleSelect}
                          formik={formik}
                          fldStyle={"col-12 md:col-4"}
                        />
                      </div>
                    </div>
                    <div className="col-12 md:col-9">
                      <div className="grid">
                        <FormFields
                          type={"select"}
                          name={"BloodGroup"}
                          label={"Blood Group"}
                          options={BloodGroupList}
                          show={true}
                          required={true}
                          disable={isView ? true : false}
                          optionLabel={"MetaSubDescription"}
                          optionValue={"MetaSubId"}
                          handleSelect={handleSelect}
                          formik={formik}
                          fldStyle={"col-12 md:col-4"}
                        />
                        <FormFields
                          type={"text"}
                          name={"Email"}
                          label={"E-Mail ID"}
                          options={""}
                          show={true}
                          required={true}
                          disable={isView ? true : false}
                          optionLabel={""}
                          optionValue={""}
                          handleSelect={""}
                          formik={formik}
                          fldStyle={"col-12 md:col-4"}
                        />
                        <FormFields
                          type={"text"}
                          name={"PrimaryMobileNo"}
                          label={"Mobile Number"}
                          options={""}
                          show={true}
                          required={true}
                          disable={isView ? true : false}
                          optionLabel={""}
                          optionValue={""}
                          handleSelect={""}
                          formik={formik}
                          fldStyle={"col-12 md:col-4"}
                          maxLength={15}
                          minLength={9}
                          keyfilter="int"
                        />
                        <FormFields
                          type={"text"}
                          name={"SecondaryMobileNo"}
                          label={"Secondary Mobile Number"}
                          options={""}
                          show={true}
                          required={false}
                          disable={isView ? true : false}
                          optionLabel={""}
                          optionValue={""}
                          handleSelect={""}
                          formik={formik}
                          fldStyle={"col-12 md:col-4"}
                          keyfilter="int"
                        />
                        <FormFields
                          type={"select"}
                          name={"Status"}
                          label={"Status"}
                          options={StatusList}
                          show={true}
                          required={true}
                          optionLabel={"MetaSubDescription"}
                          optionValue={"MetaSubId"}
                          handleSelect={handleSelect}
                          formik={formik}
                          fldStyle={"col-12 md:col-4"}
                          disable={
                            (isView ? true : false) ||
                            (isCreate == null || isCreate == true
                              ? true
                              : false)
                          }
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
                  </div>
                </div>
              </div>
            </div>
            <div className="white">
              <div className="widget-hdr">
                <div className="sub-title">
                  <div className="grid">
                    <div className="md:col-6">
                      <h2>Company Information</h2>
                    </div>
                  </div>
                </div>
              </div>
              <div className="widget-body">
                <div className="normal-table">
                  <div className="grid">
                    <FormFields
                      type={"text"}
                      name={"EmployeeCode"}
                      label={"Employee Code"}
                      options={""}
                      show={true}
                      required={true}
                      disable={true}
                      optionLabel={""}
                      optionValue={""}
                      handleSelect={""}
                      formik={formik}
                      fldStyle={"col-12 md:col-3"}
                    />
                    <FormFields
                      type={"select"}
                      name={"EmpTypeId"}
                      label={"Employee Type"}
                      options={EmployeeTypeList}
                      show={true}
                      required={true}
                      disable={isView ? true : false}
                      optionLabel={"MetaSubDescription"}
                      optionValue={"MetaSubId"}
                      handleSelect={handleSelect}
                      formik={formik}
                      fldStyle={"col-12 md:col-3"}
                    />
                    <FormFields
                      type={"text"}
                      name={"IdcardNo"}
                      label={"Employee ID Card No"}
                      options={""}
                      show={true}
                      required={true}
                      disable={isView ? true : false}
                      optionLabel={""}
                      optionValue={""}
                      handleSelect={""}
                      formik={formik}
                      fldStyle={"col-12 md:col-3"}
                    />
                    <FormFields
                      type={"Calendar"}
                      name={"DateOfJoining"}
                      label={"Date of Joining"}
                      options={""}
                      show={true}
                      required={true}
                      optionLabel={""}
                      optionValue={""}
                      handleSelect={""}
                      handleChange={(e) => {
                        // onChangeDob();
                        formik.handleChange(e);
                      }}
                      formik={formik}
                      minDate={new Date(date18YearsAfter)}
                      disable={isView ? true : false}
                      fldStyle={"col-12 md:col-3"}
                    />
                    <FormFields
                      type={"Calendar"}
                      name={"ReleavingDate"}
                      label={"Releaving Date"}
                      options={""}
                      show={true}
                      required={false}
                      disable={isView || isCreate ? true : false}
                      optionLabel={""}
                      optionValue={""}
                      handleSelect={""}
                      handleChange={handleChangeDate}
                      formik={formik}
                      fldStyle={"col-12 md:col-3"}
                      minDate={new Date(formik.values["DateOfJoining"])}
                    />
                    <FormFields
                      type={"select"}
                      name={"ReportingPerson"}
                      label={"Reporting Person"}
                      options={ReportingPersonList}
                      show={true}
                      required={true}
                      disable={isView ? true : false}
                      optionLabel={(option) => `${option.FirstName} ${option.LastName} (${option.EmployeeCode})`}
                      optionValue={"EmployeeId"}
                      handleSelect={handleSelect}
                      formik={formik}
                      fldStyle={"col-12 md:col-3"}
                    />
                    <FormFields
                      type={"select"}
                      name={"DeptId"}
                      label={"Department"}
                      options={DepartmentList}
                      show={true}
                      required={true}
                      disable={isView ? true : false}
                      optionLabel={"DepartmentName"}
                      optionValue={"DepartmentId"}
                      handleSelect={handleSelect}
                      formik={formik}
                      fldStyle={"col-12 md:col-3"}
                    />
                    <FormFields
                      type={"select"}
                      name={"DesignationId"}
                      label={"Designation"}
                      options={RoleList}
                      show={true}
                      required={true}
                      disable={isView ? true : false}
                      optionLabel={"RoleName"}
                      optionValue={"RoleId"}
                      handleSelect={handleSelect}
                      formik={formik}
                      fldStyle={"col-12 md:col-3"}
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <AppProgressSpinner />
        )}
      </form>
    </Formik>
  );
};
const EmployeeDetailForm = (props) => {
  const {
    isCreate,
    isView,
    createEditData,
    loading,
    error,
    StatusList,
    HdrTable,
    EmployeeList,
    formik,
    OnClear,
    employeeDetailList,
    filters,
    TableHeader,
    AttachmentUrl,
    onUploadDocument,
    setEmployeeDetailList,
    ClearFileUpload,
    documentUploadRef,
  } = props;
  const chooseOptions = { icon: "las la-upload", iconOnly: true };
  const handleClick = (linkValue) => {
    window.open(linkValue, "_blank");
  };
  // const handleHyperlink = () => {
  // 	if (documentUrl != "") {
  // 		window.open(documentUrl, '_blank');
  // 	}
  // };
  return (
    <Formik
      initialValues={formik.employeeDetailForm}
      validationSchema={formik.EmployeeDetailValidationSchema}
      onSubmit={formik.handleSubmit}
    >
      <div className="white">
        <div className="widget-body">
          <div className="normal-table">
            <div className="page-title">
              <div className="grid grid-nogutter">
                <div className="md:col-6">
                  <h1>Employee Document Details</h1>
                </div>
              </div>
            </div>
            <div className="grid">
              <FormFields
                type={"text"}
                name={"DocumentName"}
                label={"Document Name"}
                options={""}
                show={true}
                required={true}
                disable={isView ? true : false}
                optionLabel={""}
                optionValue={""}
                handleSelect={""}
                formik={formik}
                fldStyle={"col-12 md:col-3"}
              />
              <FormFields
                type={"text"}
                name={"DocumentNo"}
                label={"Document No"}
                options={""}
                show={true}
                required={true}
                disable={isView ? true : false}
                optionLabel={""}
                optionValue={""}
                handleSelect={""}
                formik={formik}
                fldStyle={"col-12 md:col-3"}
              />
              <div className="col-12 md:col-3">
                <label className="form-label">
                  Document Upload
                  <span className="hlt-txt">*</span>
                </label>
                <div className="p-inputgroup">
                  <div className="browse-links">
                    <Button
                      label={formik.values.AttachmentName}
                      link
                      onClick={() => handleClick(AttachmentUrl)}
                    />
                  </div>
                  <FileUpload
                    ref={documentUploadRef}
                    mode="basic"
                    chooseOptions={chooseOptions}
                    uploadHandler={onUploadDocument}
                    chooseLabel={AttachmentUrl}
                    customUpload
                    auto
                    accept="image/*,.pdf,.xlsx,.xls,.xlsm,.docx,.txt"
                    disabled={isView ? true : false}
                  />
                  <Button
                    icon="las la-times"
                    disabled={isView ? true : false}
                    onClick={ClearFileUpload}
                  />
                </div>
              </div>
              <FormFields
                type={"textarea"}
                name={"Remarks"}
                label={"Remarks"}
                options={""}
                show={true}
                required={false}
                disable={isView ? true : false}
                optionLabel={""}
                optionValue={""}
                handleSelect={""}
                formik={formik}
                fldStyle={"col-12 md:col-3"}
                maxLength="500"
                style={{ maxHeight: "100px", overflowY: "auto" }}
              />
            </div>
            <div className="text-center mb-3">
              <Button
                label="Add"
                severity="success"
                icon="las la-plus"
                title="Add"
                className="text-center"
                onClick={formik.handleSubmit}
                type="submit"
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
          </div>
          <div className="card">
            <DataTable
              value={employeeDetailList}
              showGridlines
              paginator
              filters={filters}
              filterDisplay="menu"
              globalFilterFields={[
                "DocumentName",
                "DocumentNo",
                "AttachmentName",
                "AttachmentUrl",
                "Remarks",
              ]}
              header={TableHeader}
              emptyMessage="No Data Found."
              rows={5}
              tableStyle={{ minWidth: "50rem" }}
              rowsPerPageOptions={[5, 10, 25, 50, 100]}
              currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Entries"
              paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            >
              <Column
                header="Action"
                style={{
                  textAlign: "center",
                  minWidth: "5em",
                  maxWidth: "5em",
                  overflowWrap: "break-word",
                }}
                body={(e) =>
                  deleteTemplate(
                    e,
                    employeeDetailList,
                    setEmployeeDetailList,
                    isView
                  )
                }
                headerClassName="text-center"
              ></Column>
              <Column
                field="DocumentName"
                style={{
                  minWidth: "20em",
                  maxWidth: "20em",
                  overflowWrap: "break-word",
                }}
                header="Document Name"
                headerClassName="text-center"
              ></Column>
              <Column
                field="DocumentNo"
                style={{
                  minWidth: "20em",
                  maxWidth: "20em",
                  overflowWrap: "break-word",
                }}
                header="Document Number"
                headerClassName="text-center"
              ></Column>
              <Column
                header="Attachments"
                style={{
                  minWidth: "20em",
                  maxWidth: "20em",
                  overflowWrap: "break-word",
                }}
                body={(e) => DocumentHyperLink(e)}
                headerClassName="text-center"
              ></Column>
              <Column
                field="Remarks"
                style={{
                  minWidth: "30em",
                  maxWidth: "30em",
                  overflowWrap: "break-word",
                }}
                header="Remarks"
                headerClassName="text-center"
              ></Column>
            </DataTable>
          </div>
        </div>
      </div>
    </Formik>
  );
};
const CEmployee = () => {
  const route = useHistory();
  const dispatch: any = useDispatch();
  const toast = useRef<Toast>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoName, setPhotoName] = useState();
  const [employeeAge, setEmployeeAge] = useState(0);
  const [AttachmentUrl, setAttachmentUrl] = useState("");
  const [document, setDocument] = useState<File | null>(null);
  const [employeeDetailList, setEmployeeDetailList] = useState([]);
  const [documentfiles, setDocumentfiles] = useState<File[] | null>([]);
  const [disableSave, setDisableSave] = useState(false);
  const [maxDateDob, setMaxDateDob] = useState<any>();
  const [date18YearsAgo, setDate18YearsAgo] = useState(null);
  const [date18YearsAfter, setDate18YearsAfter] = useState(null);
  const documentUploadRef = useRef<any>(null);
  const imageUploadRef = useRef<any>(null);
  const {
    isCreate,
    isView,
    createEditData,
    loading,
    error,
    StatusList,
    HdrTable,
    RoleList,
    DepartmentList,
    BloodGroupList,
    createOrEdit,
    EmployeeTypeList,
    GenderList,
    MaritalStatusList,
    ReportingPerson,
    ReportingPersonList,
    EmployeeList,
    EmployeeDocumentDetailList,
  } = useSelector((state: any) => state.employee);
  useEffect(() => {
    pageLoadScript();
  });
  useEffect(() => {
    onChangeDob();
  }, []);
  const onChangeDob = () => {
    const newDate = new Date();
    newDate.setFullYear(newDate.getFullYear() - 18);
    setDate18YearsAgo(newDate);
  };
  useEffect(() => {
    if (isCreate) {
      if (date18YearsAgo) {
        const after18 = new Date();
        after18.setFullYear(date18YearsAgo.getFullYear() + 18);
        setDate18YearsAfter(after18);
      }
    }
  }, [date18YearsAgo]);
  useEffect(() => {
    if (isCreate) {
      employeeformik.setFieldValue("Dob", date18YearsAgo);
      let obj = {
        target: {
          value: date18YearsAgo,
        },
      };
      agecalc(obj);
    }
  }, [date18YearsAgo]);
  // useEffect(() => {
  //   employeeformik.setFieldValue("DateOfJoining", date18YearsAfter);
  // }, [date18YearsAfter])

  useEffect(() => {
    if (isCreate == false) {
      let List: any[] = [];
      for (let i = 0; i < EmployeeDocumentDetailList.length; i++) {
        const x = EmployeeDocumentDetailList[i];
        let obj: any = {};
        obj.EmployeeDocumentDetailId = 0;
        obj.EmployeeId = x.EmployeeId ?? 0;
        obj.DocumentName = x.DocumentName;
        obj.DocumentNo = x.DocumentNo;
        obj.AttachmentUrl = x.AttachmentUrl;
        obj.AttachmentName = x.AttachmentName;
        obj.Remarks = x.Remarks;
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
      setEmployeeDetailList(List);
      fetchBlobFromUrl(HdrTable.ImageUrl)
        .then((blob) => {
          const file = new File([blob], HdrTable.ImageName, {
            type: "image/*",
            lastModified: 1695716506050,
          });
          setPhoto(file);
          setPhotoName(HdrTable.ImageName);
          setImageUrl(HdrTable.ImageUrl);
        })
        .catch((error) => { });
    } else {
      onChangeDob();
      const data = {
        EmployeeId: 0,
        Taskname: "CREATEINITIALIZE",
      };
      var result = dispatch(createInit(data));
      result
        .then((res) => {
          if (res.payload.transtatus.result) {
            // employeeformik.setFieldValue("Dob", date18YearsAgo);
            // employeeformik.setFieldValue("DateOfJoining", date18YearsAfter);
          } else {
            toast.current?.show({
              severity: "warn",
              summary: "Error Message",
              detail: res.payload.transtatus.lstErrorItem[0].Message,
            });
          }
        })
        .catch((error) => {
          toast.current?.show({
            severity: "warn",
            summary: "Error Message",
            detail: JSON.stringify(error),
          });
        });
    }
  }, []);
  async function fetchBlobFromUrl(url: string): Promise<Blob> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    return await response.blob();
  }
  const [imageUrl, setImageUrl] = useState<string>(IMAGES.NO_IMG);
  const employeeForm = {
    EmployeeId: HdrTable != null ? HdrTable.EmployeeId : 0,
    CompanyId:
      HdrTable != null ? HdrTable.CompanyId : localStorage["CompanyId"],
    PlantId: HdrTable != null ? HdrTable.PlantId : localStorage["PlantId"],
    EmployeeCode: HdrTable != null ? HdrTable.EmployeeCode : "",
    FirstName: HdrTable != null ? HdrTable.FirstName : "",
    LastName: HdrTable != null ? HdrTable.LastName : "",
    Dob: HdrTable != null ? new Date(HdrTable.Dob) : date18YearsAgo,
    Age: HdrTable != null ? HdrTable.Age : "",
    DesignationId: HdrTable != null ? HdrTable.DesignationId : null,
    DeptId: HdrTable != null ? HdrTable.DeptId : "",
    Email: HdrTable != null ? HdrTable.Email : "",
    PrimaryMobileNo: HdrTable != null ? HdrTable.PrimaryMobileNo : "",
    SecondaryMobileNo: HdrTable != null ? HdrTable.SecondaryMobileNo : "",
    MaritalStatus: HdrTable != null ? HdrTable.MaritalStatus : 46,
    Gender: HdrTable != null ? HdrTable.Gender : 49,
    EmpTypeId: HdrTable != null ? HdrTable.EmpTypeId : 30,
    BiometricId: HdrTable != null ? HdrTable.BiometricId : 1,
    IdcardNo: HdrTable != null ? HdrTable.IdcardNo : "",
    BloodGroup: HdrTable != null ? HdrTable.BloodGroup : 56,
    DateOfJoining: HdrTable != null ? new Date(HdrTable.DateOfJoining) : "",
    ReleavingDate:
      HdrTable != null
        ? HdrTable.ReleavingDate != null
          ? new Date(HdrTable.ReleavingDate)
          : ""
        : "",
    ReportingPerson: HdrTable != null ? HdrTable.ReportingPerson : "",
    Address: HdrTable != null ? HdrTable.Address : "",
    ImageName: HdrTable != null ? HdrTable.ImageName : "",
    ImageUrl: HdrTable != null ? HdrTable.ImageUrl : "",
    Status: HdrTable != null ? HdrTable.Status : 1,
    CreatedBy: HdrTable != null ? HdrTable.CreatedBy : localStorage["UserId"],
    CreatedOn: HdrTable != null ? new Date(HdrTable.CreatedOn) : new Date(),
    ModifiedBy: HdrTable != null ? localStorage["UserId"] : null,
    ModifiedOn: HdrTable != null ? new Date() : "",
  };
  const employeeDetailForm = {
    EmployeeDocumentDetailId: 0,
    EmployeeId: 0,
    DocumentName: "",
    DocumentNo: "",
    AttachmentUrl: "",
    AttachmentName: "",
    Remarks: "",
  };
  const employeeformik: any = useFormik({
    initialValues: employeeForm,
    validationSchema: EmployeeValidationSchema,
    onSubmit: (values: any, { resetForm }) => {
      setDisableSave(true);
      const formData = new FormData();
      let List: any[] = [];
      for (let i = 0; i < employeeDetailList.length; i++) {
        const x = employeeDetailList[i];
        let obj: any = {};
        obj.EmployeeDocumentDetailId = 0;
        obj.EmployeeId = 0;
        obj.DocumentName = x.DocumentName;
        obj.DocumentNo = x.DocumentNo;
        obj.AttachmentUrl = x.AttachmentUrl;
        obj.AttachmentName = x.AttachmentName;
        obj.Remarks = x.Remarks;
        List.push(obj);
      }
      if (!isCreate) {
        if (values.ReleavingDate) {
          values.ReleavingDate = new Date(
            values.ReleavingDate
          ).toLocaleDateString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          });
        }
      }
      values.Dob = new Date(values.Dob).toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
      values.DateOfJoining = new Date(values.DateOfJoining).toLocaleDateString(
        "en-US",
        {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }
      );
      if (values.ModifiedOn) {
        values.ModifiedOn = new Date(values.ModifiedOn).toLocaleDateString(
          "en-US",
          {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }
        );
      }
      values.CreatedOn = new Date(values.CreatedOn).toLocaleDateString(
        "en-US",
        {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }
      );

      let employeeFormValue = {
        Employee: values,
        EmployeeDocumentDetail: List,
      };

      let addedValueStringify: string = JSON.stringify(employeeFormValue);
      formData.append("input", addedValueStringify);
      formData.append("webfile", photo);
      for (var x in documentfiles) {
        var index = List.findIndex(
          (obj) => obj.AttachmentName == documentfiles[x].name
        );
        if (index != -1) {
          formData.append("webfiles", documentfiles[x]);
        }
      }
      if (HdrTable != null) {
        if (HdrTable.isCreate != false) {
          const updateRes = dispatch(updateEmployee(formData));
          updateRes.then((res) => {
            setDisableSave(false);
            if (res.payload != null || !res.payload) {
              if (res.payload.transtatus.result == true) {
                setDisableSave(false);
                toast.current?.show({
                  severity: "success",
                  summary: "Success Message",
                  detail: res.payload.transtatus.lstErrorItem[0].Message,
                });
                setTimeout(() => {
                  route.push("/home/vEmployee");
                }, 800);
              } else if (res.payload.transtatus.result == false) {
                setDisableSave(false);
                toast.current?.show({
                  severity: "warn",
                  summary: "Error Message",
                  detail: res.payload.transtatus.lstErrorItem[0].Message,
                });
              }
            }
          });
        }
      } else {
        const createRes = dispatch(createEmployee(formData));
        createRes
          .then((res) => {
            if (res.payload != null || !res.payload) {
              if (res.payload.transtatus.result == true) {
                toast.current?.show({
                  severity: "success",
                  summary: "Success Message",
                  detail: res.payload.transtatus.lstErrorItem[0].Message,
                });
                setDisableSave(false);
                ResetAllform();
              } else if (res.payload.transtatus.result == false) {
                toast.current?.show({
                  severity: "warn",
                  summary: "Error Message",
                  detail: res.payload.transtatus.lstErrorItem[0].Message,
                });
                setDisableSave(false);
                return;
              }
            }
          })
          .catch((err) => {
            toast.current?.show({
              severity: "warn",
              summary: "Error Message",
              detail: JSON.stringify(err.payload),
            });
          });
      }
    },
  });
  const employeeDetailFormik: any = useFormik({
    initialValues: employeeDetailForm,
    validationSchema: EmployeeDetailValidationSchema,
    onSubmit: (values: any, { resetForm }) => {
      if (!values.AttachmentName || values.AttachmentName == "") {
        toast.current?.show({
          severity: "error",
          summary: "Error Message",
          detail: "Please Upload the Document",
        });
        return;
      }
      let existsList: any[] = employeeDetailList.filter(
        (f) => f.DocumentName == values.DocumentName
      );
      if (existsList.length > 0) {
        toast.current?.show({
          severity: "error",
          summary: "Error Message",
          detail: "Document Name is Already Exists",
        });
      } else {
        let obj: any = {};
        obj.EmployeeDocumentDetailId = 0;
        obj.EmployeeId = 0;
        obj.DocumentName = values.DocumentName;
        obj.DocumentNo = values.DocumentNo;
        obj.AttachmentUrl = values.AttachmentUrl;
        obj.AttachmentName = values.AttachmentName;
        obj.Remarks = values.Remarks;
        setEmployeeDetailList([...employeeDetailList, obj]);
        if (document) {
          if (documentfiles.length > 0) {
            setDocumentfiles([...documentfiles, document]);
          } else {
            setDocumentfiles([document]);
          }
        }
        OnClear();
      }
    },
  });
  const OnClear = () => {
    employeeDetailFormik.resetForm();
    setDocument(null);
    setAttachmentUrl("");
  };
  const ResetAllform = () => {
    employeeformik.resetForm();
    employeeDetailFormik.resetForm();
    employeeformik.setFieldValue("Dob", date18YearsAgo);
    let obj = {
      target: {
        value: new Date(date18YearsAgo),
      },
    };
    agecalc(obj);
    setPhoto(null);
    setImageUrl(IMAGES.NO_IMG);
    setEmployeeDetailList([]);
    setAttachmentUrl("");
  };
  const handleCloseImage = () => {
    imageUploadRef.current?.clear();
    setImageUrl(IMAGES.NO_IMG);
    setPhoto(null);
    employeeformik.setFieldValue("ImageName", "");
    employeeformik.setFieldValue("ImageUrl", "");
  };
  const handleSelect = (name, other, value) => {
    employeeformik.setFieldValue(name, value);
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
  const agecalc = (e) => {
    const dateString = e.target.value;
    const dateObj = new Date(dateString);
    const year = dateObj.getFullYear();
    const CurrentYear = new Date().getFullYear();
    const age = CurrentYear - year;
    employeeformik.setFieldValue("Age", age);
    handleChangeDob(e)
  };
  const onUpload = (e: any) => {
    const allowedTypes = ["jpeg", "jpg", "png"];
    if (imageUrl != "") {
      handleCloseImage();
    }
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
      setPhoto(e.files[0]);
      employeeformik.setFieldValue("ImageName", e.files[0].name);
      const uploadedImageUrl = URL.createObjectURL(e.files[0]);
      employeeformik.setFieldValue("ImageUrl", uploadedImageUrl);
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
  const resetForm = () => {
    employeeformik.resetForm();
    employeeDetailFormik.resetForm();
    setEmployeeDetailList([]);
    setAttachmentUrl("");
    setImageUrl(IMAGES.NO_IMG);
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
      employeeDetailFormik.setFieldValue("AttachmentName", e.files[0].name);
      const uploadedImageUrl = URL.createObjectURL(e.files[0]);
      employeeDetailFormik.setFieldValue("AttachmentUrl", uploadedImageUrl);
      setAttachmentUrl(uploadedImageUrl);
    } else {
      toast.current?.show({
        severity: "warn",
        summary: "Error Message",
        detail:
          "Please Upload only Files with Format (Image/ JPEG, JPG, PNG & DOC/ WORD, EXCEL, PDF)",
      });
    }
  };
  const ClearFileUpload = () => {
    documentUploadRef.current?.clear();
    employeeDetailFormik.setFieldValue("AttachmentName", "");
    employeeDetailFormik.setFieldValue("AttachmentUrl", null);
    setAttachmentUrl("");
    setDocument(null);
  };
  const handleChangeDob = (e) => {
    if (date18YearsAgo) {
      const dateString = e.target.value;
      const dateObj = new Date(dateString);
      const after18 = new Date(dateObj);
      after18.setFullYear(dateObj.getFullYear() + 18);
      setDate18YearsAfter(after18);
      employeeformik.setFieldValue("DateOfJoining", after18)
    }
  };
  const handleChangeDate = (event) => {
    employeeformik.setFieldValue(event.target.name, event.value);
  };

  return (
    <>
      <div className="page-container">
        <div className="inner-page-container">
          <div className="page-title">
            <div className="grid grid-nogutter">
              <div className="md:col-6">
                <h1>Employee</h1>
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
                      disabled={isView || disableSave ? true : false}
                      onClick={() => employeeformik.handleSubmit()}
                    />
                    <Button
                      label=""
                      severity="danger"
                      icon="pi pi-trash"
                      title="Clear"
                      className="text-center"
                      disabled={isView || isCreate == false ? true : false}
                      onClick={ResetAllform}
                    />
                  </>
                  <Button
                    label=""
                    icon="pi pi-search"
                    title="Back to Search"
                    className="p-button p-button-success text-center"
                    onClick={() => {
                      route.push("/home/vEmployee");
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          {!loading ? (
            <>
              <div className="form-container scroll-y">
                <EmployeeForm
                  isCreate={isCreate}
                  isView={isView}
                  createEditData={createEditData}
                  loading={loading}
                  error={error}
                  StatusList={StatusList}
                  HdrTable={HdrTable}
                  EmployeeList={EmployeeList}
                  formik={employeeformik}
                  handleSelect={handleSelect}
                  RoleList={RoleList}
                  DepartmentList={DepartmentList}
                  BloodGroupList={BloodGroupList}
                  createOrEdit={createOrEdit}
                  EmployeeTypeList={EmployeeTypeList}
                  GenderList={GenderList}
                  MaritalStatusList={MaritalStatusList}
                  ReportingPerson={ReportingPerson}
                  ReportingPersonList={ReportingPersonList}
                  onUpload={onUpload}
                  EmployeeDocumentDetailList={EmployeeDocumentDetailList}
                  maxDateDob={maxDateDob}
                  date18YearsAgo={date18YearsAgo}
                  date18YearsAfter={date18YearsAfter}
                  onChangeDob={onChangeDob}
                  itemTemplate={itemTemplate}
                  imageUrl={imageUrl}
                  agecalc={agecalc}
                  handleCloseImage={handleCloseImage}
                  handleChangeDate={handleChangeDate}
                  handleChangeDob={handleChangeDob}
                  imageUploadRef={imageUploadRef}
                // handleDobChange={handleDobChange}
                />
                <EmployeeDetailForm
                  isCreate={isCreate}
                  isView={isView}
                  createEditData={createEditData}
                  loading={loading}
                  error={error}
                  StatusList={StatusList}
                  HdrTable={HdrTable}
                  formik={employeeDetailFormik}
                  handleSelect={handleSelect}
                  employeeDetailList={employeeDetailList}
                  employeeDetailForm={employeeDetailForm}
                  OnClear={OnClear}
                  setEmployeeDetailList={setEmployeeDetailList}
                  onUploadDocument={onUploadDocument}
                  ClearFileUpload={ClearFileUpload}
                  AttachmentUrl={AttachmentUrl}
                  documentUploadRef={documentUploadRef}
                />
              </div>
            </>
          ) : (
            <AppProgressSpinner />
          )}
        </div>
      </div>
      {loading ? <AppProgressSpinner /> : null}
      <AppAlert toast={toast} />
    </>
  );
};

export default CEmployee;
