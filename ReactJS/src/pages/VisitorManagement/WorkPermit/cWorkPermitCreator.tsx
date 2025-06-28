import {
  Checkbox,
  Column,
  DataTable,
  Dialog,
} from "@/assets/css/prime-library";
import FormFields from "@/components/FormFields";
import { useFormik } from "formik";
import React, { useEffect, useMemo, useRef } from "react";
import { useState } from "react";
import { object } from "yup";
import { Formik } from "formik";
import { Button } from "primereact/button";
import { VisitorValidationSchema } from "@/validations/Master";
import { useHistory } from "react-router-dom";
import { AppProgressSpinner } from "@/components/UtilityComp";

import { InputText } from "primereact/inputtext";
import PhotoCapture from "@/components/PhotoCapture";
import { Card } from "primereact/card";
import { IMAGES } from "@/assets/images/Images";
import { TriStateCheckbox } from "primereact/tristatecheckbox";

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
              <div className="grid"></div>
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
          <div className="card"></div>
        </div>
      </div>
    </Formik>
  );
};

export const BookExternalVisitorWorkPermit = (props) => {
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
    openWorkerDetails,
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
            handleSelect={() => openWorkerDetails()}
            formik={formikVM}
            fldStyle={"col-12 md:col-4"}
          />
        </div>
      </div>

      <div className="widget-hdr">
        <div className="sub-title">
          <div className="grid">
            <div className="col-12">
              <h2>{`${pageType ? "Contractor" : "Visitor"} Information`}</h2>
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

export const WorkPermitForm = (props) => {
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
    openWorkerDetails,
  } = props;
  return (
    <>
      <BookExternalVisitorWorkPermit
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
        openWorkerDetails={openWorkerDetails}
      />
    </>
  );
};
export const WorkPermitPrint = (props) => {
  const {
    wpFormHead,
    wpWorkerDetails,
    wpCompanyDocs,
    categories,
    setWpCatDetails,
    checkPoints,
    setCheckPoints,
    updateCategories,
    wpApprovalDetails,
    wpFootSign,
    isView,
    createEditData,
    isCreate,
    toast,
  } = props.wpHeader;

  const [editingIndex, setEditingIndex] = useState(null);
  const [cpUpdated, setCpUpdated] = useState(false);
  const [workerDetailShow, setWorkerDetailShow] = useState(false);
  const hasUpdated = useRef(false);
  useEffect(() => {
    const handlePrintShortcut = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "p") {
        e.preventDefault();
        toast.current?.show({
          severity: "warn",
          detail: "Printing Disabled on this Page.",
          summary: "Warning Message",
        });
        return;
      }
    };
    window.addEventListener("keydown", handlePrintShortcut);

    return () => {
      window.removeEventListener("keydown", handlePrintShortcut);
    };
  }, []);

  // const TOTAL_COLUMNS = 7;
  // const baseColspan = Math.floor(TOTAL_COLUMNS / categories.length);
  // let remainder = TOTAL_COLUMNS % categories.length;

  // const maxColumns = 7;
  // let currentColumns = 0;

  const totalColumns = 7;
  // const categoriesPerColumn = Math.ceil(
  //   categories && categories.length / totalColumns
  // );

  const [workPermits, setWorkPermits] = useState({
    WorkPermitId: 1,
    WorkPermitCompanyLogo: "",
    WorkPermitTitle: "Work Permit",
    InsurancePolicyNo: "WPMIID9823",
    ValidityPeriod: "15-10-2024 12:0",
    HeadCount: "4",
    WorkPermitCategory: [
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

  const checkDefAllCp = () => {
    let eve = {
      target: {
        name: "General",
      },
      checked: true,
    };
    onChangeWpCatg(eve);
    let eve1 = {
      target: {
        name: "Calibration",
      },
      checked: true,
    };
    onChangeWpCatg(eve1);
    let eve2 = {
      target: {
        name: "Service",
      },
      checked: true,
    };
    onChangeWpCatg(eve2);
    let eve3 = {
      target: {
        name: "A M C",
      },
      checked: true,
    };
    onChangeWpCatg(eve3);
    let eve4 = {
      target: {
        name: "Hot Work",
      },
      checked: true,
    };
    onChangeWpCatg(eve4);
    let eve5 = {
      target: {
        name: "Machine/ Moving",
      },
      checked: true,
    };
    onChangeWpCatg(eve5);
    let eve6 = {
      target: {
        name: "Energy/ Electrical Installation",
      },
      checked: true,
    };
    onChangeWpCatg(eve6);
    let eve7 = {
      target: {
        name: "Work At Height",
      },
      checked: true,
    };
    onChangeWpCatg(eve7);
    let eve8 = {
      target: {
        name: "Evacuation & Civil Work",
      },
      checked: true,
    };
    onChangeWpCatg(eve8);
    let eve9 = {
      target: {
        name: "Inspection & Segregation",
      },
      checked: true,
    };
    onChangeWpCatg(eve9);
  };

  useEffect(() => {
    if (cpUpdated == false) {
      if (checkPoints && Object.keys(checkPoints).length > 0) {
        let ev = {
          target: {
            checked: true,
          },
        };
        handleRemarkChange(ev, checkPoints[0], 0);
      }
      checkDefAllCp();
    }
    if (checkPoints && Object.keys(checkPoints).length > 0) {
      setCpUpdated(true);
    }
  }, []);

  const loadDateTime = (dateString) => {
    if (dateString && dateString != null) {
      const datePart = dateString.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      const timePart = dateString.toLocaleTimeString().toUpperCase();

      return datePart + " " + timePart;
    }

    return "-";
  };

  const calculateColSpans = (numCategories) => {
    if (numCategories === 1) return [7];
    if (numCategories === 2) return [4, 3];
    if (numCategories === 3) return [2, 2, 3];
    if (numCategories === 4) return [2, 2, 2, 1];
    if (numCategories === 5) return [2, 2, 1, 1, 1];
    if (numCategories === 6) return [2, 1, 1, 1, 1, 1];
    if (numCategories >= 7) return Array(7).fill(1);

    return [7];
  };

  const renderCategories = () => {
    const colSpans = calculateColSpans(categories.length);
    return colSpans.map((colSpan, index) => {
      return (
        <th
          className={`${index < colSpans.length - 1 ? "border-right-1" : ""}`}
          key={index}
          colSpan={colSpan}
        >
          {index < categories.length && (
            <div
              className={`flex align-items-center justify-content-center p-2 ${
                index % 2 === 0 ? "" : ""
              }`}
            >
              <FormFields
                type={"checkbox"}
                name={categories[index]?.CategoryName}
                label={categories[index]?.CategoryName}
                options={""}
                show={true}
                required={false}
                disable={
                  categories[index]?.CategoryName === "General" || isView
                    ? true
                    : false
                }
                optionLabel={""}
                optionValue={""}
                handleChange={onChangeWpCatg}
                fldStyle={"flex"}
                formik={wpFormik}
              />
            </div>
          )}
        </th>
      );
    });
  };

  // const renderCategories = () => {
  //   return Array.from({ length: totalColumns }, (_, columnIndex) => {
  //     return (
  //       <th
  //         className={`${
  //           columnIndex < totalColumns - 2 ? "border-right-1" : ""
  //         }`}
  //         key={columnIndex}
  //         colSpan={columnIndex === 0 ? 3 : null}
  //       >
  //         {Array.from({ length: categoriesPerColumn }, (_, categoryIndex) => {
  //           const categoryPosition =
  //             columnIndex * categoriesPerColumn + categoryIndex;
  //           if (categoryPosition < categories.length) {
  //             return (
  //               <div
  //                 className={`flex align-item-center justify-content-center p-2 ${
  //                   categoryPosition % 2 == 0 ? "border-bottom-1" : null
  //                 }`}
  //                 key={categoryPosition}
  //               >
  //                 <FormFields
  //                   type={"checkbox"}
  //                   name={categories[categoryPosition]?.CategoryName}
  //                   label={categories[categoryPosition]?.CategoryName}
  //                   options={""}
  //                   show={true}
  //                   required={false}
  //                   disable={categories[categoryPosition]?.CategoryName == "General" ? true :false}
  //                   optionLabel={""}
  //                   optionValue={""}
  //                   handleChange={onChangeWpCatg}
  //                   fldStyle={"flex"}
  //                   formik={wpFormik}
  //                 />
  //               </div>
  //             );
  //           }
  //           return null; // Return null if there's no category to render
  //         })}
  //       </th>
  //     );
  //   });
  // };

  // const categoryColspans = categories.map((category, index) => {
  //   const colspan = baseColspan + (remainder > 0 ? 1 : 0);
  //   remainder -= 1;
  //   return { category, colspan };
  // });

  // const limitedCategoryColspans = categoryColspans
  //   .map((catItem) => {
  //     const remainingColumns = maxColumns - currentColumns;
  //     const colspan = Math.min(catItem.colspan, remainingColumns);
  //     currentColumns += colspan;
  //     return { ...catItem, colspan };
  //   })
  //   .filter((catItem) => catItem.colspan > 0);
  // const remainingCategories = categories.slice(limitedCategoryColspans.length);

  const contentBody1 = (openWorkerDetails) => {
    const InChargeWorker = (wpWorkerDetails) => {
      return (
        <div>
          {/* {JSON.stringify(wpWorkerDetails)} */}
          {wpWorkerDetails && wpWorkerDetails.length > 0 ? (
            wpWorkerDetails.map((item, index) => {
              return item.IsIncharge == 1 ? (
                <div key={index}>
                  {item?.WorkerName} - {item.MobileNo}
                </div>
              ) : null;
            })
          ) : (
            <div>No worker is Incharge.</div>
          )}
        </div>
      );
    };

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
              <div className="font-normal">Name of the Vendor</div>
            </div>
          </td>
          <td className="border-1" colSpan={7}>
            <div
              className="p-2"
              style={{
                fontSize: "12px",
              }}
            >
              <div>{wpFormHead?.values?.VendorRegId?.VendorName}</div>
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
              <div>{wpFormHead?.WorkOrgName?.UserName}</div>
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
              <div>{wpFormHead?.DeptName?.DepartmentName}</div>
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
              <div>{wpFormHead?.wpCatDetails}</div>
            </div>
          </td>
        </tr>
        {/* <tr>
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
        </tr> */}
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
          <td
            className="border-1"
            colSpan={7}
            style={{
              cursor: "pointer",
            }}
            onClick={() => openWorkerDetails()}
          >
            <div
              className="p-2"
              style={{
                fontSize: "12px",
              }}
            >
              <div className="font-bold text-primary-700">
                {wpWorkerDetails &&
                  wpWorkerDetails?.filter((item) => item.IsWorking)?.length}
              </div>
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
              {InChargeWorker(wpWorkerDetails)}
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
              <div className="font-bold">Effect from: (Date & Time): </div>
            </div>
          </td>
          <td className="border-1" colSpan={7}>
            <div
              className="p-2 flex gap-5"
              style={{
                fontSize: "13px",
              }}
            >
              {wpFormHead?.values?.ContractValidity
                ? loadDateTime(wpFormHead?.values?.ContractValidity[0])
                : null}
              <div>
                <span className="font-bold">Expires on: (Date & Time): </span>

                {wpFormHead?.values?.ContractValidity
                  ? loadDateTime(wpFormHead?.values?.ContractValidity[1])
                  : null}
              </div>
            </div>
          </td>
        </tr>
      </>
    );
  };

  const handleRemoveItem = (category, itemIndex) => {
    // setCheckPoints((prevCheckPoints) => {
    //   const updatedCategory = [...prevCheckPoints[category]];
    //   updatedCategory.splice(itemIndex, 1);
    //   return {
    //     ...prevCheckPoints,
    //     [category]: updatedCategory,
    //   };
    // });
  };

  const handleRemarkChange = (event, category, itemIndex) => {
    if (category && checkPoints) {
      setCheckPoints((prevCheckPoints) => {
        const updatedCategory = [...prevCheckPoints[category]];
        updatedCategory[itemIndex].remark =
          event.target.value == true
            ? 15
            : event.target.value == false
            ? 16
            : 122;

        return {
          ...prevCheckPoints,
          [category]: updatedCategory,
        };
      });
      updateCategories(
        "CategoryId",
        {},
        category,
        0,
        event.target.value == true ? 15 : event.target.value == false ? 16 : 122
      );
    }
  };

  const handleDescriptionChange = (category, itemIndex, value) => {
    // setCheckPoints((prevCheckPoints) => {
    //   const updatedCategory = [...prevCheckPoints[category]];
    //   updatedCategory[itemIndex].description = value;
    //   return { ...prevCheckPoints, [category]: updatedCategory };
    // });
  };

  // Save the edited description and exit editing mode
  const handleSaveEdit = (e) => {
    e.stopPropagation();
    setEditingIndex(null);
  };
  const handleCancelEdit = (e) => {
    e.stopPropagation();
    setEditingIndex(null);
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
                {checkPoints &&
                  checkPoints[category].map((eachItem, itemIndex) => (
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
                      <td
                        className="border-1 p-1"
                        colSpan={6}
                        // onClick={() =>
                        //   setEditingIndex(`${category}-${itemIndex}`)
                        // }
                      >
                        <div className="flex justify-content-start align-items-center">
                          {/* <div
                          className="p-1 text-center no-print"
                          style={{
                            width: "22px",
                            maxWidth: "22px",
                          }}
                        >
                          <Button
                            icon="pi pi-times"
                            severity="danger"
                            aria-label="Cancel"
                            className="m-0 p-button p-button-danger p-button-icon-only p-component w-min"
                            onClick={() =>
                              handleRemoveItem(category, itemIndex)
                            }
                          />
                        </div> */}
                          <div className="pl-2 pr-2">
                            {/* {editingIndex === `${category}-${itemIndex}` ? (
                            <div className="flex gap-2 p-1 align-items-center">
                              <input
                                type="text"
                                className="p-inputtext p-component"
                                value={eachItem.description}
                                onChange={(e) =>
                                  handleDescriptionChange(
                                    category,
                                    itemIndex,
                                    e.target.value
                                  )
                                }
                                style={{ width: "300px" }}
                              />
                              <Button
                                icon="pi pi-save"
                                severity="success"
                                aria-label="Save"
                                style={{
                                  width: 22,
                                  height: 22,
                                }}
                                className="m-0 p-button p-button-icon-only p-component"
                                onClick={(e) => handleSaveEdit(e)}
                              />
                              <Button
                                icon="pi pi-times"
                                severity="danger"
                                aria-label="Cancel"
                                style={{
                                  width: 22,
                                  height: 22,
                                }}
                                className="m-0 p-button p-button-danger p-button-icon-only p-component"
                                onClick={(e) => handleCancelEdit(e)}
                              />
                              {/* <button onClick={handleSaveEdit}>Save</button> 
                              {/* <button onClick={() => setEditingIndex(null)}>
                                Cancel
                              </button> 
                            </div> 
                           ) : (*/}
                            <div>{eachItem.description}</div>
                            {/* )} */}
                          </div>
                        </div>
                      </td>

                      <td className="border-1">
                        <div className="pl-2 pr-2 text-center">
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: 600,
                            }}
                          >
                            <TriStateCheckbox
                              className="no-print"
                              value={
                                eachItem.remark === 15
                                  ? true
                                  : eachItem.remark === 16
                                  ? false
                                  : null
                              }
                              onChange={(e) =>
                                handleRemarkChange(e, category, itemIndex)
                              }
                              disabled={
                                category == "General" || isView ? true : false
                              }
                            />
                            {/* <Checkbox
                              className="no-print"
                              checked={eachItem.remark}
                              onChange={(e) =>
                                handleRemarkChange(e, category, itemIndex)
                              }
                              disabled={
                                category == "General" || isView ? true : false
                              }
                            /> */}
                            {eachItem.remark === 15 ? (
                              <span
                                style={{
                                  marginLeft: "10px",
                                  color: "#00cb66",
                                }}
                              >
                                Yes
                              </span>
                            ) : eachItem.remark === 16 ? (
                              <span
                                style={{
                                  marginLeft: "10px",
                                  color: "#ff1f1f",
                                }}
                              >
                                No
                              </span>
                            ) : (
                              <span
                                style={{ marginLeft: "10px", color: "#999999" }}
                              >
                                N/A
                              </span>
                            )}
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
    const colSpans = calculateColSpans(wpApprovalDetails.length);

    return (
      <tr>
        <td
          className="border-1"
          style={{
            minHeight: 70,
            height: "auto",
            maxHeight: 70,
          }}
        >
          <div className="pl-2 pr-2 text-center font-bold">Authorization</div>
        </td>
        {wpApprovalDetails &&
          wpApprovalDetails.length > 0 &&
          wpApprovalDetails.map((columnVal, columnIndex) => (
            <td
              key={columnIndex}
              className="border-1 text-center pl-2 pr-2 text-center font-bold"
              colSpan={colSpans[columnIndex] || 1}
              style={{
                minWidth: columnIndex == 1 ? 100 : "auto",
              }}
            >
              {columnVal.DepartmentName}
            </td>
          ))}
      </tr>
    );
  };
  const footer2 = () => {
    const colSpans = calculateColSpans(wpApprovalDetails.length);

    return (
      <tr>
        <td
          className="border-1"
          style={{
            minHeight: 70,
            height: 70,
            maxHeight: 70,
          }}
        >
          <div className="pl-2 pr-2 text-center font-bold">Signature</div>
        </td>

        {wpApprovalDetails?.length > 0 &&
          wpApprovalDetails.map((columnVal, columnIndex) => (
            <td
              key={columnIndex}
              className="border-1 text-center pl-1 pr-1 text-center font-bold relative"
              colSpan={colSpans[columnIndex] || 1}
            >
              {columnVal?.DigitalSign != "" ? (
                <div className="flex flex-column align-items-center">
                  <img
                    src={columnVal?.DigitalSignUrl}
                    className="max-w-7rem max-h-7rem"
                  />
                  <div
                    style={{
                      fontSize: "10px",
                    }}
                  >
                    {loadDateTime(new Date(columnVal?.ModifiedOn))}
                  </div>
                </div>
              ) : (
                <div
                  className="text-red-500 font-normal"
                  style={{
                    transform: "rotate(-45deg)",
                  }}
                >
                  No Signature
                </div>
              )}
            </td>
          ))}
        {/* {wpApprovalDetails &&
          wpApprovalDetails.length > 0 &&
          wpApprovalDetails.map((columnVal, columnIndex) => (
            <td
              key={columnIndex}
              className="border-1 text-center pl-1 pr-1 text-center font-bold relative"
              colSpan={columnIndex < 3 ? 1 : 2}
            >
              {columnVal?.DigitalSign != "" ? (
                <div className="flex flex-column align-items-center">
                  <img
                    src={columnVal?.DigitalSignUrl}
                    className="max-w-7rem max-h-7rem"
                  />
                  <div
                    style={{
                      fontSize: "10px",
                    }}
                  >
                    {loadDateTime(new Date(columnVal?.ModifiedOn))}
                  </div>
                </div>
              ) : (
                <div
                  className="text-red-500 font-normal"
                  style={{
                    transform: "rotate(-45deg)",
                  }}
                >
                  No Signature
                </div>
              )}
            </td>
          ))} */}
      </tr>
    );
  };
  const footer3 = () => {
    const colSpans = calculateColSpans(wpApprovalDetails.length);

    return (
      <tr>
        <td
          className="border-1"
          style={{
            minHeight: 70,
            height: "auto",
            maxHeight: 70,
          }}
        >
          <div className="pl-2 pr-2 text-center font-bold">Name</div>
        </td>

        {wpApprovalDetails &&
          wpApprovalDetails.length > 0 &&
          wpApprovalDetails.map((columnVal, columnIndex) => (
            <td
              key={columnIndex}
              className="border-1 text-center pl-2 pr-2 text-center font-bold"
              colSpan={colSpans[columnIndex] || 1}
            >
              {columnVal?.UserName}
            </td>
          ))}
      </tr>
    );
  };
  const footer4 = () => {
    return (
      <tr>
        <td
          className="border-1"
          style={{
            minHeight: 70,
            height: "auto",
            maxHeight: 70,
          }}
          colSpan={8}
        >
          <div className="pl-2 pr-2 text-center">
            Ensure work area must be clean by the vendor / contractor team after
            completion of work daily and must be maintained good housekeeping.
          </div>
        </td>
      </tr>
    );
  };
  const footer5 = () => {
    return (
      <tr>
        <td
          className="border-1"
          style={{
            minHeight: 70,
            height: 70,
            maxHeight: 70,
          }}
        >
          <div className="pl-2 pr-2 text-center font-bold">Signature</div>
        </td>
        {wpFootSign &&
          wpFootSign.length > 0 &&
          wpFootSign.map((columnVal, columnIndex) => (
            <React.Fragment key={columnIndex}>
              <td
                className="border-1 text-center pl-2 pr-2 font-bold"
                colSpan={columnIndex < 2 ? 1 : 2}
              >
                {columnVal?.DepartmentName}
              </td>
              <td
                className="border-1 text-center pl-1 pr-1 text-center font-bold relative"
                colSpan={columnIndex < 2 ? 1 : 2}
              >
                {columnVal?.DigitalSign !== "" ? (
                  <div>
                    <img
                      src={columnVal?.DigitalSignUrl}
                      className="max-w-7rem max-h-7rem"
                      alt="Digital Signature"
                    />
                    <div
                      style={{
                        fontSize: "10px",
                      }}
                    >
                      {loadDateTime(new Date(columnVal?.ModifiedOn))}
                    </div>
                  </div>
                ) : (
                  <div
                    className="text-red-500 font-normal"
                    style={{
                      transform: "rotate(-45deg)",
                    }}
                  >
                    No Signature
                  </div>
                )}
              </td>
            </React.Fragment>
          ))}

        {/* {wpFootSign &&
          wpFootSign.length > 0 &&
          wpFootSign.map((columnVal, columnIndex) => (
            <td
              key={columnIndex}
              className="border-1 text-center pl-2 pr-2 text-center font-bold"
              colSpan={wpFootSign.length - 1 == columnIndex ? 2 : 1}
              style={
                {
                  // minWidth: 50,
                }
              }
            >
              {columnVal.Name}
              
            </td>
          ))} */}
      </tr>
    );
  };
  const footer6 = () => {
    return (
      <tr>
        <td
          className="border-1"
          style={{
            minHeight: 70,
            height: "auto",
            maxHeight: 70,
          }}
          colSpan={8}
        >
          <div className="pl-2 pr-2 text-center">
            In case of emergency all type of work permit are considered to be
            cancelled & all vendor / contractor to be gathered at emergency
            assembly point near gate.
          </div>
        </td>
      </tr>
    );
  };

  const changeWorkPermitTable = (
    layout,
    wpFormik,
    onChangeWpCatg,
    openWorkerDetails
  ) => {
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
              <div className="text-center">
                <div>{workPermits?.WorkPermitCompanyLogo}</div>
                <img
                  className="d-block m-auto max-h-3rem max-w-12rem"
                  src={IMAGES.LOGO_LG}
                  alt="company-logo"
                />
              </div>
            </th>
            <th className="border-1 p-3" colSpan={5}>
              <div className="text-center">
                <div className="text-2xl">{workPermits?.WorkPermitTitle}</div>
              </div>
            </th>
            <th className="border-1 p-0 w-3" colSpan={2}>
              <div className="flex align-item-center border-bottom-1 gap-2 pl-2 pr-2">
                <div>{Object.keys(workPermits)[3]}:</div>
                <div className="font-normal">
                  {wpCompanyDocs && wpCompanyDocs?.length > 0
                    ? wpCompanyDocs?.filter(
                        (item) => item.DocumentType == 115
                      )[0]?.DocumentNo
                    : "-"}
                </div>
              </div>
              <div className="flex align-item-center border-bottom-1 gap-2 pl-2 pr-2">
                <div>{Object.keys(workPermits)[4]}:</div>
                <div className="font-normal">
                  {loadDateTime(wpFormHead?.InsuranceValidTo)}
                </div>
              </div>
              <div className="flex align-item-center gap-2 pl-2 pr-2">
                <div>{Object.keys(workPermits)[5]}:</div>
                <div className="font-normal">
                  {wpWorkerDetails &&
                    wpWorkerDetails?.filter((item) => item.IsWorking)?.length}
                </div>
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
            {renderCategories()}
            {/* {categoryColspans && categoryColspans.length > 0
              ? categoryColspans.map((catItem, index) => {
                  return (
                    <th className="border-1" colSpan={catItem.colspan}>
                      <div className="flex align-item-center justify-content-center border-bottom-1 p-2">
                        <FormFields
                          type={"checkbox"}
                          name={catItem.category.CategoryName}
                          label={catItem.category.CategoryName}
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
                  );
                })
              : null} */}
            {/* <th className="border-1" colSpan={3}>
              <div className="flex align-item-center justify-content-center border-bottom-1 p-2">
                <FormFields
                  type={"checkbox"}
                  name={workPermits?.WorkPermitCategory[0]}
                  label={workPermits?.WorkPermitCategory[0]}
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
                  name={workPermits?.WorkPermitCategory[1]}
                  label={workPermits?.WorkPermitCategory[1]}
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
                  name={workPermits?.WorkPermitCategory[2]}
                  label={workPermits?.WorkPermitCategory[2]}
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
                  name={workPermits?.WorkPermitCategory[3]}
                  label={workPermits?.WorkPermitCategory[3]}
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
                  name={workPermits?.WorkPermitCategory[4]}
                  label={workPermits?.WorkPermitCategory[4]}
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
                  name={workPermits?.WorkPermitCategory[5]}
                  label={workPermits?.WorkPermitCategory[5]}
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
                  name={workPermits?.WorkPermitCategory[6]}
                  label={workPermits?.WorkPermitCategory[6]}
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
                  name={workPermits?.WorkPermitCategory[7]}
                  label={workPermits?.WorkPermitCategory[7]}
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
                  name={workPermits?.WorkPermitCategory[8]}
                  label={workPermits?.WorkPermitCategory[8]}
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
            </th> */}
          </tr>
        );
      case "c1":
        return contentBody1(openWorkerDetails);
        break;
      case "c2":
        return contentBody2();
      case "f1":
        return footer1();
      case "f2":
        return footer2();
      case "f3":
        return footer3();
      case "f4":
        return footer4();
      case "f5":
        return footer5();
      case "f6":
        return footer6();
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
      const updatedCheckPoints = Object.keys(checkPoints).map((checkItem) => {
        return {
          [checkItem]: checkPoints[checkItem].map((item) => {
            if (checkItem === event.target.name) {
              return {
                ...item,
                remark:
                  event.checked == true
                    ? 15
                    : event.checked == false
                    ? 16
                    : 122,
              };
            }
            return item;
          }),
        };
      });

      setCheckPoints((preVal) => ({
        ...preVal,
        ...updatedCheckPoints.reduce((acc, curr) => ({ ...acc, ...curr }), {}),
      }));
    }
  };

  // useEffect(() => {
  //   const onChangeWpCatgTrue = () => {
  //     if (Object.keys(checkPoints).length > 0) {
  //       const updatedCheckPoints = Object.keys(checkPoints).map((checkItem) => {
  //         return {
  //           [checkItem]: checkPoints[checkItem].map((item) => {
  //               return {
  //                 ...item,
  //                 remark: true,
  //               };
  //           }),
  //         };
  //       });
  //       setCheckPoints((preVal) => ({
  //         ...preVal,
  //         ...updatedCheckPoints.reduce((acc, curr) => ({ ...acc, ...curr }), {}),
  //       }));
  //     }
  //   };
  //   onChangeWpCatgTrue()

  // }, [])
  useEffect(() => {
    if (
      Object.keys(checkPoints).length > 0 &&
      !hasUpdated.current &&
      isCreate
    ) {
      const updatedCheckPoints = Object.keys(checkPoints).reduce(
        (acc, checkItem) => {
          acc[checkItem] = checkPoints[checkItem].map((item) => ({
            ...item,
            remark: 15,
          }));
          return acc;
        },
        {}
      );

      setCheckPoints(updatedCheckPoints);
      hasUpdated.current = true;
    }
  }, [checkPoints]);

  const openWorkerDetails = () => {
    setWorkerDetailShow(true);
  };

  return (
    <>
      <div className="m-auto w-9" id="work_permit_print">
        <table className="border-1 mt-3 mb-3">
          {changeWorkPermitTable(
            "h1",
            wpFormik,
            onChangeWpCatg,
            openWorkerDetails
          )}
          {changeWorkPermitTable(
            "h2",
            wpFormik,
            onChangeWpCatg,
            openWorkerDetails
          )}
          {changeWorkPermitTable(
            "c1",
            wpFormik,
            onChangeWpCatg,
            openWorkerDetails
          )}
          {changeWorkPermitTable(
            "c2",
            wpFormik,
            onChangeWpCatg,
            openWorkerDetails
          )}
          {changeWorkPermitTable(
            "f1",
            wpFormik,
            onChangeWpCatg,
            openWorkerDetails
          )}
          {changeWorkPermitTable(
            "f2",
            wpFormik,
            onChangeWpCatg,
            openWorkerDetails
          )}
          {changeWorkPermitTable(
            "f3",
            wpFormik,
            onChangeWpCatg,
            openWorkerDetails
          )}
          {changeWorkPermitTable(
            "f4",
            wpFormik,
            onChangeWpCatg,
            openWorkerDetails
          )}
          {changeWorkPermitTable(
            "f5",
            wpFormik,
            onChangeWpCatg,
            openWorkerDetails
          )}
          {changeWorkPermitTable(
            "f6",
            wpFormik,
            onChangeWpCatg,
            openWorkerDetails
          )}
        </table>
      </div>
      <Dialog
        header="Workers Details"
        visible={workerDetailShow}
        style={{ width: "55vw" }}
        draggable={false}
        onHide={() => setWorkerDetailShow(false)}
      >
        <DataTable
          value={
            wpWorkerDetails && wpWorkerDetails?.filter((item) => item.IsWorking)
          }
          showGridlines
          paginator
          filterDisplay="menu"
          globalFilterFields={["WorkerName", "MailId", "MobileNo", "Status"]}
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
          <Column sortable field="WorkerName" header="Worker Name"></Column>
          <Column sortable field="MailId" header="Mail Id"></Column>
          <Column sortable field="MobileNo" header="Mobile No"></Column>
          <Column
            sortable
            field="Status"
            header="Status"
            body={(rowData, rowIndex) =>
              rowData.Status == 1 ? "Active" : "In Active"
            }
          ></Column>
        </DataTable>
      </Dialog>
    </>
  );
};

export const CWorkPermitCreator = (props) => {
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
