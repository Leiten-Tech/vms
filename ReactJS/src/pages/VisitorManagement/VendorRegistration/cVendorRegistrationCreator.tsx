import { Column, DataTable } from "@/assets/css/prime-library";
import FormFields from "@/components/FormFields";
import { useFormik } from "formik";
import React, { useEffect } from "react";
import { useState } from "react";
import { object } from "yup";
import { Formik } from "formik";
import { Button } from "primereact/button";
import { VisitorValidationSchema } from "@/validations/Master";
import { useHistory } from "react-router-dom";
import { AppProgressSpinner } from "@/components/UtilityComp";

import { InputText } from "primereact/inputtext";
import PhotoCapture from "@/components/PhotoCapture";

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
               
              </div>
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
              
          </div>
        </div>
      </div>
    </Formik>
  );
};

export const BookExternalVisitorVendorRegistration = (props) => {
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
      <div className="col-12">
        <div className="grid">
          <FormFields
            type={"select"}
            name={"DeptId"}
            label={"Department"}
            options={[]}
            show={true}
            required={true}
            disable={false}
            optionLabel={"DepartmentName"}
            optionValue={"DepartmentId"}
            handleSelect={() => {}}
            formik={formikVM}
            fldStyle={"col-12 md:col-4"}
          />
          <FormFields
            type={"text"}
            name={"DeptId"}
            label={"Nature of the Work"}
            options={[]}
            show={true}
            required={true}
            disable={false}
            optionLabel={"DepartmentName"}
            optionValue={"DepartmentId"}
            handleSelect={() => {}}
            formik={formikVM}
            fldStyle={"col-12 md:col-4"}
          />
          <FormFields
            type={"text"}
            name={"DeptId"}
            label={"Proposed Manpower to work"}
            options={[]}
            show={true}
            required={true}
            disable={true}
            optionLabel={"DepartmentName"}
            optionValue={"DepartmentId"}
            handleSelect={() => {}}
            formik={formikVM}
            fldStyle={"col-12 md:col-4"}
          />
        </div>
      </div>

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
              />
              {/* <div className={isViewVM ? "p-disabled" : ""}>
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

export const VendorRegistrationForm = (props) => {
  const {
    isVisMaster,
    setIsVisMaster,
    visitorEntryFormik,
    VisitorNameList,
    handleVisitorSelected,
    isViewVM,
    isCreateVM,
    VisitorTypeListVM,
    handleSelectVM,
    TitleListVM,
    CountryListVM,
    Onchangecountry,
    StateListVM,
    Onchangestate,
    CityListVM,
    IdCardListVM,
    StatusListVM,
    onUploadVM,
    itemTemplateVM,
    imageUrlVM,
    handleOnChangeVM,
    visitorForm,
    visitorRef,
    visitorFormik,
    onChangeVisitorTypeVM,
    tempStateList,
    tempCityList,
    handleCloseImage,
    handleChangeVM,
    profUploadRef,
    VisitorhandleHyperlink,
    onUploadDocumentVisitor,
    deleteDocumentsVisitor,
    documentUrlVisitor,
    documentVisitorUploadRef,
    toast,
    setVisitorEntryBelongingDetailList,
    VisitorEntryBelongingDetailList,
    pageType,
    cameraOff,
    setCameraOff,
    phonenumber,
  } = props;
  return (
    <>
      <BookExternalVisitorVendorRegistration
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
        OnchangecountryVM={Onchangecountry}
        StateListVM={StateListVM}
        OnchangestateVM={Onchangestate}
        CityListVM={CityListVM}
        IdCardListVM={IdCardListVM}
        StatusListVM={StatusListVM}
        onUploadVM={onUploadVM}
        itemTemplateVM={itemTemplateVM}
        imageUrlVM={imageUrlVM}
        handleOnChangeVM={handleOnChangeVM}
        visitorFormVM={visitorForm}
        visitorRefVM={visitorRef}
        formikVM={visitorFormik}
        onChangeVisitorTypeVM={onChangeVisitorTypeVM}
        tempStateListVM={tempStateList}
        tempCityListVM={tempCityList}
        handleCloseImageVM={handleCloseImage}
        handleChangeVM={handleChangeVM}
        profUploadRef={profUploadRef}
        VisitorhandleHyperlinkVM={VisitorhandleHyperlink}
        onUploadDocumentVisitorVM={onUploadDocumentVisitor}
        deleteDocumentsVisitorVM={deleteDocumentsVisitor}
        documentUrlVisitorVM={documentUrlVisitor}
        documentVisitorUploadRefVM={documentVisitorUploadRef}
        toast={toast}
        setVisitorEntryBelongingDetailList={setVisitorEntryBelongingDetailList}
        VisitorEntryBelongingDetailList={VisitorEntryBelongingDetailList}
        pageType={pageType}
        cameraOff={cameraOff}
        setCameraOff={setCameraOff}
        phonenumber={phonenumber}
      />
    </>
  );
};
export const VendorRegistrationPrint = () => {
  const [workPermits, setVendorRegistrations] = useState({
    VendorRegistrationId: 1,
    VendorRegistrationCompanyLogo: "",
    VendorRegistrationTitle: "Vendor Registration",
    InsurancePolicyNo: "WPMIID9823",
    ValidityPeriod: "15-10-2024 12:0",
    HeadCount: "4",
    VendorRegistrationCategory: [
      "Work At Height",
      "Evacuation & Civil Work",
      "Energy/ Electrical Installation",
      "Machine/ Moving",
      "Hot Work",
      "A M C",
      "Service",
      "Calibration",
      "Inspection & Segregation",
    ],
    EffectFrom: "15-10-2024 14:53 PM",
    EffectTo: "18-10-2024 14:53 PM",
    Footer1: {
      rows: {
        authorization: {
          vendor_contractor: "Vendor/Contractor",
          concern_dept: "Concern Dept",
          maintenance_dept: "Maintenance Dept",
          hr_dept: "HR Dept",
          plant_head: "Plant Head",
        },
        signatures: {
          vendor_contractor: "✔",
          concern_dept: "✔",
          maintenance_dept: "✔",
          hr_dept: "✔",
          plant_head: "✔",
        },
        names: {
          vendor_contractor: "N/A",
          concern_dept: "N/A",
          maintenance_dept: "N/A",
          hr_dept: "N/A",
          plant_head: "N/A",
        },
        housekeeping: {
          instruction:
            "Ensure work area must be clean by the vendor / contractor team after completion of work daily and must be maintained good housekeeping.",
        },
        other_signatures: {
          vendor_contractor: "N/A",
          concern_dept: "N/A",
          security: "N/A",
        },
        emergency_procedure: {
          instruction:
            "In case of emergency all type of work permit are considered to be cancelled & all vendor / contractor to be gathered at emergency assembly point near gate.",
        },
      },
    },
  });

  const [checkPoints, setCheckPoints] = useState({
    General: [
      {
        description:
          "Check the Age of the Manpower (less than 18 and above 50 not allowed)",
        remark: "", // Placeholder for Yes/No/N/A
      },
      {
        description:
          "Explain about the Emergency Exit Route & Safe Assembly point",
        remark: "",
      },
      {
        description: "Wear Minimum PPE: Safety Shoe & Cap",
        remark: "",
      },
    ],
    "Work At Height": [
      {
        description: "Checked availability & fitness of Platform",
        remark: "",
      },
      {
        description: "Checked availability of safe access of work area",
        remark: "",
      },
      {
        description: "Checked availability of edge protection",
        remark: "",
      },
      {
        description: "Checked availability of light at work spot",
        remark: "",
      },
      {
        description: "Checked availability of safety belt and appliances",
        remark: "",
      },
      {
        description:
          "Checked availability of provision for fixing safety belts",
        remark: "",
      },
      {
        description:
          "Checked clearance taken from respective departments in working area",
        remark: "",
      },
    ],
    "Evacuation & Civil Work": [
      {
        description:
          "Checked Caution Board for Job in Progress at working area",
        remark: "",
      },
      {
        description: "Checked availability of light at work spot",
        remark: "",
      },
    ],
    "Work on Energy & Electrical Installation": [
      {
        description:
          "Checked line is isolated by closing valve and caution board for Job in Progress at working area",
        remark: "",
      },
      {
        description: "Fuses are removed",
        remark: "",
      },
      {
        description: "Control Supply is switched off",
        remark: "",
      },
      {
        description: "Cable is disconnected at machine end",
        remark: "",
      },
      {
        description:
          "Checked electrical power to pump/valve/compressor is isolated",
        remark: "",
      },
      {
        description: "Checked air and oil from line is drained",
        remark: "",
      },
      {
        description:
          "Checked availability of water and fire extinguisher near work spot",
        remark: "",
      },
      {
        description:
          "Checked protection taken to safeguard electrical cables if any near work spot",
        remark: "",
      },
      {
        description: "Checked availability of light at work spot",
        remark: "",
      },
      {
        description:
          "Checked availability of safety appliances with job performer",
        remark: "",
      },
      {
        description:
          "Checked third-party inspection certificate of lifting equipment",
        remark: "",
      },
    ],
    "Machine/Moving": [
      {
        description: "Checked physical condition of lifting equipment",
        remark: "",
      },
      {
        description: "Maintained safe distance from suspended load",
        remark: "",
      },
      {
        description:
          "Movement of machine or part is arrested and display board for Job in Progress provided over machine",
        remark: "",
      },
    ],
    "Hot Work": [
      {
        description: "Checked proper use of PPE",
        remark: "",
      },
      {
        description:
          "Checked flammable or combustible materials are removed from worksite or covered with fire blanket",
        remark: "",
      },
      {
        description: "Checked hazardous substances are removed",
        remark: "",
      },
      {
        description:
          "Checked fire extinguishers and water available at work site",
        remark: "",
      },
      {
        description:
          "Checked earthing & Flash Arrestor of welding machine for proper lightening",
        remark: "",
      },
      {
        description: "All electrical cables must be free from cut/loose joints",
        remark: "",
      },
    ],
  });

  const contentBody1 = () => {
    return (
      <>
        <tr>
          <td className="border-1">
            <div
              className="p-2"
              style={{
                fontSize: "12px",
              }}
            >
              <div className="font-normal">Name of the Contractor Company</div>
            </div>
          </td>
          <td className="border-1" colSpan={7}>
            <div
              className="p-2"
              style={{
                fontSize: "12px",
              }}
            >
              <div>ABC Enterprises</div>
            </div>
          </td>
        </tr>
        <tr>
          <td className="border-1">
            <div
              className="p-2"
              style={{
                fontSize: "12px",
              }}
            >
              <div className="font-normal">Name of the Staff/ Authorised</div>
            </div>
          </td>
          <td className="border-1" colSpan={7}>
            <div
              className="p-2"
              style={{
                fontSize: "12px",
              }}
            >
              <div>Vijay</div>
            </div>
          </td>
        </tr>
        <tr>
          <td className="border-1">
            <div
              className="p-2"
              style={{
                fontSize: "12px",
              }}
            >
              <div className="font-normal">Department</div>
            </div>
          </td>
          <td className="border-1" colSpan={7}>
            <div
              className="p-2"
              style={{
                fontSize: "12px",
              }}
            >
              <div>IT</div>
            </div>
          </td>
        </tr>
        <tr>
          <td className="border-1">
            <div
              className="p-2"
              style={{
                fontSize: "12px",
              }}
            >
              <div className="font-normal">
                Nature of work to be Carried Out
              </div>
            </div>
          </td>
          <td className="border-1" colSpan={7}>
            <div
              className="p-2"
              style={{
                fontSize: "12px",
              }}
            >
              <div>wp</div>
            </div>
          </td>
        </tr>
        <tr>
          <td className="border-1">
            <div
              className="p-2"
              style={{
                fontSize: "12px",
              }}
            >
              <div className="font-normal">Work Location</div>
            </div>
          </td>
          <td className="border-1" colSpan={7}>
            <div
              className="p-2"
              style={{
                fontSize: "12px",
              }}
            >
              <div>Chennai</div>
            </div>
          </td>
        </tr>
        <tr>
          <td className="border-1">
            <div
              className="p-2"
              style={{
                fontSize: "12px",
              }}
            >
              <div className="font-normal">Proposed Manpower to work</div>
            </div>
          </td>
          <td className="border-1" colSpan={7}>
            <div
              className="p-2"
              style={{
                fontSize: "12px",
              }}
            >
              <div>5</div>
            </div>
          </td>
        </tr>
        <tr>
          <td className="border-1">
            <div
              className="p-2"
              style={{
                fontSize: "12px",
              }}
            >
              <div className="font-normal">Incharge Name & Contact Number</div>
            </div>
          </td>
          <td className="border-1" colSpan={7}>
            <div
              className="p-2"
              style={{
                fontSize: "12px",
              }}
            >
              <div>Raj - 5896741235</div>
            </div>
          </td>
        </tr>
        <tr>
          <td className="border-1">
            <div
              className="p-2"
              style={{
                fontSize: "12px",
              }}
            >
              <div className="font-normal">Effect from: (Date & Time):</div>
            </div>
          </td>
          <td className="border-1" colSpan={7}>
            <div
              className="p-2"
              style={{
                fontSize: "12px",
              }}
            >
              <div>Expires on: (Date & Time):</div>
            </div>
          </td>
        </tr>
      </>
    );
  };

  const contentBody2 = () => {
    return (
      <>
        <tr>
          <td className="border-1">
            <h4 className="text-center">Category</h4>
          </td>
          <td className="border-1" colSpan={6}>
            <h4 className="text-center">Check Points</h4>
          </td>
          <td className="border-1">
            <h4 className="text-center">
              <div>Remarks</div>
              <div>Yes/ No/ NA</div>
            </h4>
          </td>
        </tr>
        {checkPoints &&
          Object.keys(checkPoints).length > 0 &&
          Object.keys(checkPoints).map((category, categoryIndex) => {
            return (
              <React.Fragment key={categoryIndex}>
                {checkPoints[category].map((eachItem, itemIndex) => (
                  <tr key={`${categoryIndex}-${itemIndex}`}>
                    {itemIndex === 0 && (
                      <td
                        className="border-1"
                        rowSpan={checkPoints[category].length}
                      >
                        <div className="pl-2 pr-2 text-center">
                          <div className="font-normal">{category}</div>
                        </div>
                      </td>
                    )}
                    <td className="border-1" colSpan={6}>
                      <div className="pl-2 pr-2">
                        <div>{eachItem.description}</div>
                      </div>
                    </td>

                    <td className="border-1">
                      <div className="pl-2 pr-2 text-center">
                        <div className="text-center">
                          {eachItem.remark || "N/A"}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            );
          })}
        <tr>
          <td className="border-1" colSpan={8}>
            <div className="text-center" style={{ fontSize: "10px" }}>
              Vendor/ Contractor Pledge: We will abide the Safety Instruction &
              Procedure of the NTN. Will always use prescribed safety equipments
              when working inside NTN Premises.
            </div>
          </td>
        </tr>
      </>
    );
  };

  const footer1 = () => {
    return (
      workPermits &&
      Object.keys(workPermits.Footer1.rows).map((rowType, rowKey) => {
        return (
          <tr key={rowKey}>
            {rowType != "instruction" ? (
              <td className="border-1">
                <div className="pl-2 pr-2 text-center font-bold">
                  {rowType === "authorization" && "Authorization"}
                  {rowType === "signatures" && "Signature"}
                  {rowType === "other_signatures" && "Other Signatures"}
                </div>
              </td>
            ) : null}
            {Object.keys(workPermits.Footer1.rows[rowType]).map(
              (columnKey, columnIndex) => (
                <td
                  key={`${rowKey}-${columnIndex}`}
                  className="border-1 text-center"
                  colSpan={
                    columnKey == "vendor_contractor" ||
                    columnKey == "concern_dept"
                      ? 2
                      : columnKey == "instruction"
                      ? 7
                      : 1
                  }
                >
                  {/* {columnKey} */}
                  {workPermits.Footer1.rows[rowType][columnKey] || "N/A"}
                </td>
              )
            )}
          </tr>
        );
      })
    );
  };

  const changeVendorRegistrationTable = (layout, wpFormik, onChangeWpCatg) => {
    switch (layout) {
      case "h1":
        return (
          <tr>
            <th
              className="border-1 max-w-17rem w-17rem"
              style={{
                minWidth: "200px",
              }}
            >
              <div className="col-4">
                <div>{workPermits?.VendorRegistrationCompanyLogo}</div>
              </div>
            </th>
            <th className="border-1 p-3" colSpan={5}>
              <div className="text-center">
                <div className="text-2xl">{workPermits?.VendorRegistrationTitle}</div>
              </div>
            </th>
            <th className="border-1 p-0 w-3" colSpan={2}>
              <div className="flex align-item-center border-bottom-1 gap-2 pl-2 pr-2">
                <div>{Object.keys(workPermits)[3]}:</div>
                <div className="font-normal">
                  {workPermits?.InsurancePolicyNo}
                </div>
              </div>
              <div className="flex align-item-center border-bottom-1 gap-2 pl-2 pr-2">
                <div>{Object.keys(workPermits)[4]}:</div>
                <div className="font-normal">{workPermits?.ValidityPeriod}</div>
              </div>
              <div className="flex align-item-center gap-2 pl-2 pr-2">
                <div>{Object.keys(workPermits)[5]}:</div>
                <div className="font-normal">{workPermits?.HeadCount}</div>
              </div>
            </th>
          </tr>
        );
        break;
      case "h2":
        return (
          <tr>
            <th className="border-1 max-w-10rem w-10rem">
              <h4 className="text-center">Particular</h4>
            </th>
            <th className="border-1" colSpan={3}>
              <div className="flex align-item-center justify-content-center border-bottom-1 p-2">
                <FormFields
                  type={"checkbox"}
                  name={workPermits?.VendorRegistrationCategory[0]}
                  label={workPermits?.VendorRegistrationCategory[0]}
                  options={""}
                  show={true}
                  required={false}
                  disable={false}
                  optionLabel={""}
                  optionValue={""}
                  handleChange={onChangeWpCatg}
                  fldStyle={"flex"}
                  formik={wpFormik}
                />
              </div>
              <div className="flex align-item-center justify-content-center p-2">
                <FormFields
                  type={"checkbox"}
                  name={workPermits?.VendorRegistrationCategory[1]}
                  label={workPermits?.VendorRegistrationCategory[1]}
                  options={""}
                  show={true}
                  required={false}
                  disable={false}
                  optionLabel={""}
                  optionValue={""}
                  handleChange={onChangeWpCatg}
                  fldStyle={"flex"}
                  formik={wpFormik}
                />
              </div>
            </th>
            <th className="border-1">
              <div className="flex align-item-center justify-content-center border-bottom-1 p-2">
                <FormFields
                  type={"checkbox"}
                  name={workPermits?.VendorRegistrationCategory[2]}
                  label={workPermits?.VendorRegistrationCategory[2]}
                  options={""}
                  show={true}
                  required={false}
                  disable={false}
                  optionLabel={""}
                  optionValue={""}
                  handleChange={onChangeWpCatg}
                  fldStyle={"flex"}
                  formik={wpFormik}
                />
              </div>
              <div className="flex align-item-center justify-content-center p-2">
                <FormFields
                  type={"checkbox"}
                  name={workPermits?.VendorRegistrationCategory[3]}
                  label={workPermits?.VendorRegistrationCategory[3]}
                  options={""}
                  show={true}
                  required={false}
                  disable={false}
                  optionLabel={""}
                  optionValue={""}
                  handleChange={onChangeWpCatg}
                  fldStyle={"flex"}
                  formik={wpFormik}
                />
              </div>
            </th>
            <th className="border-1">
              <div className="flex align-item-center justify-content-center p-2">
                <FormFields
                  type={"checkbox"}
                  name={workPermits?.VendorRegistrationCategory[4]}
                  label={workPermits?.VendorRegistrationCategory[4]}
                  options={""}
                  show={true}
                  required={false}
                  disable={false}
                  optionLabel={""}
                  optionValue={""}
                  handleChange={onChangeWpCatg}
                  fldStyle={"flex"}
                  formik={wpFormik}
                />
              </div>
            </th>
            <th className="border-1">
              <div className="flex align-item-center justify-content-center border-bottom-1 p-2">
                <FormFields
                  type={"checkbox"}
                  name={workPermits?.VendorRegistrationCategory[5]}
                  label={workPermits?.VendorRegistrationCategory[5]}
                  options={""}
                  show={true}
                  required={false}
                  disable={false}
                  optionLabel={""}
                  optionValue={""}
                  handleChange={onChangeWpCatg}
                  fldStyle={"flex"}
                  formik={wpFormik}
                />
              </div>
              <div className="flex align-item-center justify-content-center p-2">
                <FormFields
                  type={"checkbox"}
                  name={workPermits?.VendorRegistrationCategory[6]}
                  label={workPermits?.VendorRegistrationCategory[6]}
                  options={""}
                  show={true}
                  required={false}
                  disable={false}
                  optionLabel={""}
                  optionValue={""}
                  handleChange={onChangeWpCatg}
                  fldStyle={"flex"}
                  formik={wpFormik}
                />
              </div>
            </th>
            <th className="border-1">
              <div className="flex align-item-center justify-content-center border-bottom-1 p-2">
                <FormFields
                  type={"checkbox"}
                  name={workPermits?.VendorRegistrationCategory[7]}
                  label={workPermits?.VendorRegistrationCategory[7]}
                  options={""}
                  show={true}
                  required={false}
                  disable={false}
                  optionLabel={""}
                  optionValue={""}
                  handleChange={onChangeWpCatg}
                  fldStyle={"flex"}
                  formik={wpFormik}
                />
              </div>
              <div className="flex align-item-center justify-content-center p-2">
                <FormFields
                  type={"checkbox"}
                  name={workPermits?.VendorRegistrationCategory[8]}
                  label={workPermits?.VendorRegistrationCategory[8]}
                  options={""}
                  show={true}
                  required={false}
                  disable={false}
                  optionLabel={""}
                  optionValue={""}
                  handleChange={onChangeWpCatg}
                  fldStyle={"flex"}
                  formik={wpFormik}
                />
              </div>
            </th>
          </tr>
        );
      case "c1":
        return contentBody1();
        break;
      case "c2":
        return contentBody2();
      case "f1":
        return footer1();
      default:
        break;
    }
  };

  const wpValid = object({});

  const wpFormik: any = useFormik({
    initialValues: {},
    validationSchema: wpValid,
    onSubmit: (values: any, { resetForm }) => {},
  });

  const onChangeWpCatg = (event) => {
    

    wpFormik.setFieldValue(event?.target?.name, event.checked);
    if (Object.keys(checkPoints).length > 0) {
      const updatedCheckPoints = Object.keys(checkPoints).map(
        (checkItem, checkKey) => {
          return {
            [checkItem]: checkPoints[checkItem].map((item) => {
              if (checkItem === event.target.name) {
                return {
                  ...item,
                  remark: event.checked ? "Yes" : "No",
                };
              }
              return item;
            }),
          };
        }
      );

      setCheckPoints((preVal) => ({
        ...preVal,
        ...updatedCheckPoints.reduce((acc, curr) => ({ ...acc, ...curr }), {}),
      }));
    }
  };

  useEffect(() => {
    
  });

  return (
    <div id="work_permit_print">
      <table className="border-1 mt-3 mb-3">
        {changeVendorRegistrationTable("h1", wpFormik, onChangeWpCatg)}
        {changeVendorRegistrationTable("h2", wpFormik, onChangeWpCatg)}
        {changeVendorRegistrationTable("c1", wpFormik, onChangeWpCatg)}
        {changeVendorRegistrationTable("c2", wpFormik, onChangeWpCatg)}
        {changeVendorRegistrationTable("f1", wpFormik, onChangeWpCatg)}
      </table>
    </div>
  );
};

export const CVendorRegistrationCreator = (props) => {
  const {
    WPworkPermitWorkers,
    WPfilters,
    WPheader,
    WPactionBodyTemplate,
    WPfilesContent,
    WPcellEditor,
    WPonCellEditComplete,
  } = props;
  return (
    <div className="white">
      <div className="widget-hdr">
        <div className="sub-title">
          <div className="grid">
            <div className="md:col-6">
              <h2>Workers List</h2>
            </div>
          </div>
        </div>
      </div>
      <div className="widget-body">
        <div className="card">
          <DataTable
            value={WPworkPermitWorkers}
            showGridlines
            paginator
            filters={WPfilters}
            filterDisplay="menu"
            globalFilterFields={[
              "WorkerName",
              "WorkerPhoneNo",
              "WorkerMailID",
              "WorkerStatus",
            ]}
            header={WPheader}
            emptyMessage="No Data found."
            rows={50}
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
            tableStyle={{ minWidth: "50rem" }}
          >
            {/* <Column
              field={"Action"}
              header={"Action"}
              style={{
                textAlign: "center",
              }}
              body={WPactionBodyTemplate}
              headerClassName="text-center"
            ></Column> */}
            <Column sortable field="WorkerName" header="Visitor Name"></Column>
            <Column
              sortable
              field="WorkerMailID"
              header="Worker Mail ID"
            ></Column>
            <Column sortable field="WorkerPhoneNo" header="Phone No"></Column>
            <Column
              sortable
              field="Validity"
              header="Validity"
              //   editor={(options) => WPcellEditor(options)}
              body={(rowData, rowIndex) => WPcellEditor(rowData, rowIndex)}
              //   onCellEditComplete={WPonCellEditComplete}
            ></Column>
            <Column
              sortable
              field="WorkerStatus"
              header="Worker Status"
            ></Column>
          </DataTable>
        </div>
      </div>
    </div>
  );
};
