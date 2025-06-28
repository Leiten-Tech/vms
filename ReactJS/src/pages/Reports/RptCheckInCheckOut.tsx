import React, { useState, useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import FormFields from "@/components/FormFields";
import { Formik, useFormik } from "formik";
import { RptCheckInCheckOutValidationSchema } from "@/validations/Master";
import {
  Button,
  FilterMatchMode,
  InputSwitch,
  InputText,
  Toast,
} from "@/assets/css/prime-library";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import PageHeader from "@/components/PageHeader";
import {
  CreateInitialize,
  SearchInitialize,
} from "@/redux/slices/Reports/RptCheckInCheckOutSlice";
import AppAlert from "@/alert/alert";
import { Dialog } from "primereact/dialog";
import { pageLoadScript } from "@/assets/js/common-utilities";
import { AppProgressSpinner } from "@/components/UtilityComp";
import { exportServ } from "@/services/ExportService";
import { tLDS } from "@/utils/utilFunc";
import TermsConditionPop from "@/components/Common/TermsConditionPop";

const ShowDialog = (e: any, setVisible: any, setDetailData: any) => {
  return (
    <>
      <a
        style={{ color: "blue" }}
        onClick={() => {
          setDetailData(e);
          setVisible(true);
        }}
      >
        {e.VisitorName}
      </a>
    </>
  );
};

const ShowTermsDialog = (
  e: any,
  setShowPopup: any,
  setTermsConditions: any,
  setSignedUrl: any
) => {
  return (
    <>
      {+e?.IsTermsAgreed == 1 ? (
        <a
          style={{ color: "blue" }}
          onClick={() => {
            setTermsConditions(e);
            setSignedUrl(e?.DigitalSignUrl);
            setShowPopup(true);
          }}
        >
          Terms Agreed
        </a>
      ) : (
        <div>No Terms Agreed</div>
      )}
    </>
  );
};

const ReportDetail = (props) => {
  const { visible, setVisible, detailData } = props;

  let tempData = [detailData];

  const loadImage = () => {
    return (
      <img
        src={`${detailData?.VisitorImageUrl}`}
        alt={`${detailData?.VisitorName}`}
        className={"max-w-15rem"}
        style={{ maxWidth: "100%", height: "auto" }}
      />
    );
  };

  return (
    <Dialog
      header="Details"
      visible={visible}
      style={{ width: "80vw" }}
      onHide={() => setVisible(false)}
    >
      <div className="">
        <div className="white">
          <div className="widget-body">
            <div className="flex flex-column gap-5 normal-table">
              <div className="card">
                <DataTable
                  value={tempData}
                  showGridlines
                  paginator
                  filterDisplay="menu"
                  globalFilterFields={[
                    "VisitorName",
                    "MobileNo",
                    "PurposeOfVisitName",
                    "VisitorEmpName",
                    "AreatoVisitName",
                    "VisitorEntryCode",
                    "CheckedIn",
                    "CheckedOut",
                  ]}
                  emptyMessage="No Data found."
                  rows={5}
                  rowsPerPageOptions={[5, 10, 25, 50, 100]}
                  tableStyle={{ minWidth: "50rem" }}
                >
                  <Column field="VisitorName" header="Visitor Name"></Column>
                  <Column
                    field="VisitorImage"
                    header="Visitor Image"
                    body={(rowData) => loadImage()}
                  ></Column>
                  <Column field="MobileNo" header="Mobile No"></Column>
                  <Column
                    field="PurposeOfVisitName"
                    header="Purpose Of Visit "
                  ></Column>
                  <Column
                    field="VisitorEmpName"
                    header="Visited Employee"
                  ></Column>
                  <Column
                    field="AreatoVisitName"
                    header="Area to Visit"
                  ></Column>
                  <Column
                    field="VisitorEntryCode"
                    header="Visitor Entry Code"
                  ></Column>
                  <Column field="CheckedIn" header="Checked  In"></Column>
                  <Column field="CheckedOut" header="Checked  Out"></Column>
                </DataTable>
                {/* <img
                  src={`Visitor Image: ${detailData?.VisitorImageUrl}`}
                  alt={`${detailData?.VisitorName}`}
                  style={{ maxWidth: "100%", height: "auto" }}
                />
                <p
                  style={{ fontWeight: "bold" }}
                >{`Visitor Name: ${detailData?.VisitorName}`}</p>
                <p
                  style={{ fontWeight: "bold" }}
                >{`Mobile No: ${detailData?.MobileNo}`}</p>
                <p
                  style={{ fontWeight: "bold" }}
                >{`Purpose Of Visit: ${detailData?.PurposeOfVisitName}`}</p>
                <p
                  style={{ fontWeight: "bold" }}
                >{`Whom To Visit: ${detailData?.VisitorEmpName}`}</p>
                <p
                  style={{ fontWeight: "bold" }}
                >{`Area To Visit: ${detailData?.AreatoVisitName}`}</p>
                <p
                  style={{ fontWeight: "bold" }}
                >{`Visitor Entry Code: ${detailData?.VisitorEntryCode}`}</p>
                <p
                  style={{ fontWeight: "bold" }}
                >{`Checked In: ${detailData?.CheckedIn}`}</p>
                <p
                  style={{ fontWeight: "bold" }}
                >{`Checked Out: ${detailData?.CheckedOut}`}</p> */}
              </div>
              <div className="text-center">
                <Button
                  label="OK"
                  severity="success"
                  title="success"
                  icon="pi pi-check"
                  className="mr-2 p-1"
                  onClick={() => setVisible(false)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

const RptCheckInCheckOut = () => {
  const [selectedData, setSelectedData] = useState([]);
  const [plantlist, setPlantList] = useState([]);
  const [visible, setVisible] = useState(false);
  const route = useHistory();
  const [checkinCheckoutData, setCheckinCheckoutData] = useState([]);
  const [globalFilter, setGlobalFilter] = useState();
  const [modules, setModules] = useState([]);
  const [detailData, setDetailData] = useState();

  const [termsConditions, setTermsConditions] = useState<any>();
  const [showPopup, setShowPopup] = useState(false);
  const [signedUrl, setSignedUrl] = useState<any>(null);

  useEffect(() => {
    pageLoadScript();
  });

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState<string>("");
  const TableHeader = () => {
    const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      let _filters = { ...filters };

      _filters["global"].value = value;

      setFilters(_filters);
      setGlobalFilterValue(value);
    };

    const tableExport = (exportType: string) => {
      const plantIdString = formik.values.PlantName.join(",");
      const VisitorTypeIdString = formik.values.VisitorTypeId
        ? formik.values.VisitorTypeId.join(",")
        : "";
      const PovString = formik.values.PurposeOfVisit
        ? formik.values.PurposeOfVisit.join(",")
        : "";
      // let fD = new Date(formik.values.FromDate);

      // const fyear = fD.getUTCFullYear();
      // const fmonth = String(fD.getUTCMonth()).padStart(2, "0"); // Months are zero-based
      // const fday = String(fD.getUTCDate()).padStart(2, "0");

      // const fDate = `${fyear}-${fmonth}-${fday}`;
      // let tD = new Date(formik.values.ToDate);

      // const tyear = tD.getUTCFullYear();
      // const tmonth = String(tD.getUTCMonth()).padStart(2, "0"); // Months are zero-based
      // const tday = String(tD.getUTCDate()).padStart(2, "0");

      // const tDate = `${tyear}-${tmonth}-${tday}`;
      const data = {
        Taskname: "SearchInitialize",
        FromDate: new Date(formik.values.FromDate),
        ToDate: new Date(formik.values.ToDate),
        PlantId: plantIdString ? plantIdString : null,
        CompanyId: +localStorage["CompanyId"],
        VisitorTypeId: VisitorTypeIdString ? VisitorTypeIdString : null,
        PurposeOfVisit: PovString ? PovString : null,
      };
      const response = dispatch(SearchInitialize(data));
      response.then((response) => {
        fetchDataForExport(response.payload.CheckinCheckoutList)
          .then((dataList: any) => {
            if (exportType === "pdf") {
              exportServ.Export("CheckInCheckOut", dataList, "pdf");
            } else if (exportType === "excel") {
              exportServ.Export("CheckInCheckOut", dataList, "excel");
            }
          })
          .catch((error) => {
            console.error(error.message);
          });
      });
    };

    const fetchDataForExport = (CheckinCheckoutList) => {
      return new Promise((resolve, reject) => {
        let dataList = [];
        if (CheckinCheckoutList && CheckinCheckoutList.length > 0) {
          CheckinCheckoutList.forEach((element) => {
            let data = {
              "Plant Name": element.PlantName,
              "Visitor Entry Code": element.VisitorEntryCode,
              "Visitor Type": element.VisitorTypeName,
              "Visitor Name": element.VisitorName,
              "Mobile No": element.MobileNo,
              "Visitor Company": element.VisitorCompany,
              // "Vehicle No": element.VehicleNo,
              // "Vehicle Model": element.VehicleModel,
              // "Vehicle Type": element.VehicleTypeName,
              // "Driver": element.DriverName,
              Date: element.VisitorEntryDate,
              "Purpose Of Visit": element.PurposeOfVisitName,
              "Checked In": element.CheckedIn,
              "Checked Out": element.CheckedOut,
              "Stay Time": element.StayTime,
              "Checked In By": element.CheckedInBy,
              "Checked Out By": element.CheckedOutBy,
            };
            dataList.push(data);
          });
          resolve(dataList);
        } else {
          reject(new Error("No data available for export."));
        }
      });
    };

    return (
      <div className="flex justify-content-between">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Search"
          />
        </span>
        <div className="flex align-items-center justify-content-end gap-2">
          <div className="action-btn">
            <Button
              type="button"
              title="Export Excel"
              icon="pi pi-file-excel"
              severity="success"
              onClick={() => tableExport("excel")}
              data-pr-tooltip="XLS"
            />
            <Button
              type="button"
              title="Export PDF"
              icon="pi pi-file-pdf"
              severity="warning"
              onClick={() => tableExport("pdf")}
              data-pr-tooltip="PDF"
            />
          </div>
        </div>
      </div>
    );
  };

  const {
    VisitorList,
    isCreate,
    CheckinCheckoutList,
    createEditData,
    isView,
    VisitorTypeList,
    PovList,
    PlantList,
    HdrTable,
    loading,
  } = useSelector((state: any) => state.rptcheckincheckout);

  const toast = useRef<Toast>(null);
  const dispatch: any = useDispatch();

  useEffect(() => {
    const data = {
      VisitorTypeId: 0,
      Taskname: "CREATEINITIALIZE",
      PlantId: +localStorage["PlantId"],
      CompanyId: +localStorage["CompanyId"],
      RoleId: +localStorage["DefaultRoleId"],
    };
    dispatch(CreateInitialize(data));
  }, []);

  const resetForm = () => {
    formik.resetForm();
    setCheckinCheckoutData([]);
  };

  const handleSelect = (name, other, value) => {
    formik.setFieldValue(name, value);
    if (formik.values.FromDate > formik.values.ToDate) {
      toast.current?.show({
        severity: "warn",
        summary: "Warning Message",
        detail: "To Date should not be Before the From Date",
      });
      return;
    }
  };
  const formik: any = useFormik({
    initialValues: {
      FromDate: (HdrTable && HdrTable.FromDate) || new Date(),
      ToDate: (HdrTable && HdrTable.ToDate) || new Date(),
      PlantName: (HdrTable && HdrTable.PlantName) || [+localStorage["PlantId"]],
      VisitorTypeId: HdrTable != null ? HdrTable.VisitorTypeId : null,
    },
    validationSchema: RptCheckInCheckOutValidationSchema,
    onSubmit: (values: any, { resetForm }) => {
      Ondispatch();
    },
  });

  const Ondispatch = () => {
    const plantIdString = formik.values.PlantName
      ? formik.values.PlantName.join(",")
      : null;
    const VisitorTypeIdString = formik.values.VisitorTypeId
      ? formik.values.VisitorTypeId.join(",")
      : null;
    const PovString = formik.values.PurposeOfVisit
      ? formik.values.PurposeOfVisit.join(",")
      : null;

    let fD = new Date(formik.values.FromDate);

    let tD = new Date(formik.values.ToDate);

    const fyear = fD.getUTCFullYear();
    const fmonth = String(fD.getUTCMonth()).padStart(2, "0"); // Months are zero-based
    const fday = String(fD.getUTCDate()).padStart(2, "0");

    const fDate = `${fyear}-${fmonth}-${fday}`;

    const tyear = tD.getUTCFullYear();
    const tmonth = String(tD.getUTCMonth()).padStart(2, "0"); // Months are zero-based
    const tday = String(tD.getUTCDate()).padStart(2, "0");

    const tDate = `${tyear}-${tmonth}-${tday}`;
    console.log(new Date(formik.values.FromDate), formik.values.FromDate);
    console.log(new Date(formik.values.ToDate), formik.values.ToDate);

    const data = {
      Taskname: "SearchInitialize",
      // FromDate: formik.values.FromDate.toLocaleDateString("en-US", {
      //   day: "2-digit",
      //   month: "2-digit",
      //   year: "numeric",
      // }),
      // ToDate: formik.values.ToDate.toLocaleDateString("en-US", {
      //   day: "2-digit",
      //   month: "2-digit",
      //   year: "numeric",
      // }),
      FromDate: tLDS(formik.values.FromDate),
      ToDate: tLDS(formik.values.ToDate),
      PlantId: plantIdString ? plantIdString : null,
      CompanyId: +localStorage["CompanyId"],
      VisitorTypeId: VisitorTypeIdString ? VisitorTypeIdString : null,
      PurposeOfVisit: PovString ? PovString : null,
    };

    const createRes = dispatch(SearchInitialize(data));

    createRes
      .then((res) => {
        if (res.payload.transtatus.result == true) {
          setCheckinCheckoutData(res.payload.CheckinCheckoutList);
          const fromDate = formik.values.FromDate;
          const toDate = formik.values.ToDate;

          if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
            toast.current?.show({
              severity: "warn",
              summary: "Warning Message",
              detail: "To Date should not be Before the From Date",
            });
          } else {
            if (res.payload.CheckinCheckoutList.length === 0) {
              toast.current?.show({
                severity: "warn",
                summary: "Warning Message",
                detail: " No Data Available",
              });
              return;
            }
          }
        } else {
          toast.current?.show({
            severity: "error",
            summary: "Error Message",
            detail: res.payload.transtatus.lstErrorItem[0].Message,
          });
        }
      })
      .catch((err) => {
        toast.current?.show({
          severity: "warn",
          summary: "Error Message",
          detail: JSON.stringify(err.payload),
        });
      });
  };

  useEffect(() => {
    setSelectedData(CheckinCheckoutList);
  }, [CheckinCheckoutList]);

  const handleDateChange = (e) => {
    // formik.setFieldValue(name, value);
    formik.handleChange(e);

    const errors = formik.errors;
    if (errors.FromDate || errors.ToDate) {
      toast.current?.show({
        severity: "warn",
        summary: "Warning Message",
        detail: "To Date should not be Before the From Date",
      });
    }
  };

  const [pageConfig, setPageConfig] = useState({
    pageTitle: "Check In Check Out Report",
    pageHeader: {
      pageActions: [
        {
          create: false,
          clear: true,
          save: true,
          createQuery: " ",
        },
      ],
    },
    tableCheckSelection: false,
    tableAction: true,
    tableActionStyle: {
      maxWidth: "4.5rem",
      textAlign: "center",
      justifySelf: "center",
    },
    tableRows: 10,
    tableRowsOptions: [10, 50, 100, 500, 1000],
    tablePagination: true,
    tableColumns: [
      {
        title: "Plant Name",
        name: "PlantName",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: {
          minWidth: "16rem",
        },
      },
      {
        title: "Visitor Entry Code",
        name: "VisitorEntryCode",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: { minWidth: "10rem" },
      },
      {
        title: "Visitor Type",
        name: "VisitorType",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: {},
      },
      {
        title: "Visitor Name",
        name: "VisitorTypeName",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: {},
      },
      {
        title: "Vehicle No",
        name: "VehicleNo",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: {},
      },
      {
        title: "Vehicle Model",
        name: "VehicleModel",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: {},
      },
      {
        title: "Vehicle Type",
        name: "VehicleTypeName",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: {},
      },
      {
        title: "Driver",
        name: "DriverName",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: {},
      },
      {
        title: "VisitorRemarks",
        name: "Visitor Remarks",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: {},
      },
      {
        title: "Date",
        name: "VisitorEntryDate",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: {},
      },
      {
        title: "Checked In/ Entry Time",
        name: "CheckedIn",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: {},
      },
      {
        title: "Checked Out/ Exit Time",
        name: "CheckedOut",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: {},
      },
      {
        title: "Stay Time",
        name: "StayTime",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: {},
      },
      {
        title: "Checked In By",
        name: "CheckedInBy",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: {},
      },
      {
        title: "Checked Out By",
        name: "CheckedOutBy",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: {},
      },
      {
        title: "Is Terms Agree",
        name: "IsTermsAgree",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: {},
      },
    ],
  });

  return (
    <>
      <Formik
        initialValues={formik.initialValues}
        validationSchema={formik.validationSchema}
        onSubmit={formik.handleSubmit}
      >
        <div className="page-container">
          <div className="inner-page-container">
            <div className="page-title">
              <div className="grid grid-nogutter">
                <div className="md:col-6">
                  <h1>Check In Check Out Report</h1>
                </div>
              </div>
            </div>

            <div className="form-container scroll-y">
              <div className="white">
                <div className="widget-body">
                  <form>
                    <div className="normal-table">
                      <div className="grid">
                        <FormFields
                          type={"Calendar"}
                          name={"FromDate"}
                          label={"From Date"}
                          options={""}
                          show={true}
                          required={true}
                          optionLabel={"FromDate"}
                          optionValue={"FromDate"}
                          // handleSelect={handleSelect}
                          handleChange={handleDateChange}
                          formik={formik}
                          fldStyle={"col-12 md:col-3"}
                          maxDate={formik.values.ToDate}
                        />
                        <FormFields
                          type={"Calendar"}
                          name={"ToDate"}
                          label={"To Date"}
                          options={""}
                          show={true}
                          required={true}
                          optionLabel={"ToDate"}
                          optionValue={"ToDate"}
                          // handleSelect={handleSelect}
                          handleChange={handleDateChange}
                          formik={formik}
                          fldStyle={"col-12 md:col-3"}
                          minDate={formik.values.FromDate}
                        />
                        <FormFields
                          type={"multi_select"}
                          name={"PlantName"}
                          label={"Plant Name"}
                          options={PlantList}
                          show={true}
                          required={true}
                          optionLabel={"PlantName"}
                          optionValue={"PlantId"}
                          handleSelect={handleSelect}
                          fldStyle={"col-12 md:col-3"}
                          formik={formik}
                          maxSelectedLabels={3}
                        />
                        <FormFields
                          type={"multi_select"}
                          name={"VisitorTypeId"}
                          label={"Visitor Type"}
                          options={VisitorTypeList}
                          show={true}
                          required={false}
                          optionLabel={"MetaSubDescription"}
                          optionValue={"MetaSubId"}
                          handleSelect={handleSelect}
                          fldStyle={"col-12 md:col-3"}
                          formik={formik}
                          maxSelectedLabels={3}
                        />
                        <FormFields
                          type={"multi_select"}
                          name={"PurposeOfVisit"}
                          label={"Purpose Of Visit "}
                          options={PovList}
                          show={true}
                          required={false}
                          disable={!isCreate}
                          optionLabel={"MetaSubDescription"}
                          optionValue={"MetaSubId"}
                          handleSelect={handleSelect}
                          formik={formik}
                          fldStyle={"col-12 md:col-3"}
                          filter={true}
                        />
                      </div>
                    </div>
                  </form>
                  <div className="text-center mb-3">
                    <Button
                      type="button"
                      label="Search"
                      severity="success"
                      icon="pi pi-search"
                      title="Add"
                      className="text-center"
                      onClick={() => {
                        formik.handleSubmit();
                      }}
                    />
                    <Button
                      type="button"
                      label="Clear"
                      severity="danger"
                      icon="las la-trash"
                      title="Clear"
                      className="text-center"
                      onClick={() => resetForm()}
                    />
                  </div>

                  <div className="card">
                    {!loading ? (
                      <>
                        <DataTable
                          value={checkinCheckoutData}
                          showGridlines
                          filters={filters}
                          loading={loading}
                          selection={setSelectedData}
                          emptyMessage={"No Data Found"}
                          style={{
                            minWidth: "50rem",
                            textAlign: "center",
                          }}
                          dataKey="ScreenName"
                          paginator={pageConfig.tablePagination}
                          rows={pageConfig.tableRows}
                          rowsPerPageOptions={pageConfig.tableRowsOptions}
                          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Entries"
                          paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                          globalFilter={globalFilter}
                          header={TableHeader}
                        >
                          <Column
                            field="VisitorEntryDate"
                            header="Date"
                            sortable
                          ></Column>
                          <Column
                            field="PlantName"
                            header="Plant Name"
                            sortable
                          ></Column>
                          <Column
                            field="VisitorEntryCode"
                            header="Visitor Entry Code"
                            sortable
                          ></Column>
                          <Column
                            field="VisitorTypeName"
                            header="Visitor Type"
                            sortable
                          ></Column>
                          <Column
                            field="VisitorName"
                            header="Visitor Name"
                            sortable
                            body={(e) =>
                              ShowDialog(e, setVisible, setDetailData)
                            }
                          ></Column>
                          <Column
                            field="VehicleNo"
                            header="Vehicle No"
                            sortable
                          ></Column>
                          <Column
                            field="VehicleModel"
                            header="Vehicle Model"
                            sortable
                          ></Column>
                          <Column
                            field="VehicleTypeName"
                            header="Vehicle Type"
                            sortable
                          ></Column>
                          <Column
                            field="DriverName"
                            header="Driver"
                            sortable
                          ></Column>
                          <Column
                            field="PurposeOfVisitName"
                            header="Purpose Of Visit"
                            sortable
                          ></Column>
                          <Column
                            field="VisitorRemarks"
                            header="Visitor Remarks"
                            sortable
                          ></Column>
                          <Column
                            field="CheckedIn"
                            header="Checked In/ Entry Time"
                            sortable
                          ></Column>
                          <Column
                            field="CheckedOut"
                            header="Checked Out/ Exit Time"
                            sortable
                          ></Column>
                          <Column
                            field="StayTime"
                            header="Stay Time"
                            sortable
                          ></Column>
                          <Column
                            field="CheckedInBy"
                            header="Checked In By"
                            sortable
                          ></Column>
                          <Column
                            field="CheckedOutBy"
                            header="Checked Out By"
                            sortable
                          ></Column>
                          <Column
                            field="IsTermsAgree"
                            header="Is Terms Agree"
                            sortable
                            body={(e) =>
                              ShowTermsDialog(
                                e,
                                setShowPopup,
                                setTermsConditions,
                                setSignedUrl
                              )
                            }
                          ></Column>
                        </DataTable>
                        {visible ? (
                          <ReportDetail
                            visible={visible}
                            setVisible={setVisible}
                            detailData={detailData}
                          />
                        ) : null}
                        {showPopup ? (
                          <TermsConditionPop
                            TermsConditions={termsConditions}
                            toast={toast}
                            setIsChecked={{}}
                            sign={{}}
                            showPopup={showPopup}
                            setShowPopup={setShowPopup}
                            setSign={{}}
                            signedUrl={signedUrl}
                            setDigSignFile={{}}
                            setSignedUrl={setSignedUrl}
                            setIsdisableSave={{}}
                            formik={{}}
                            screenSized={{}}
                            isView={true}
                          />
                        ) : null}
                      </>
                    ) : (
                      <AppProgressSpinner />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Formik>
      <AppAlert toast={toast} />
    </>
  );
};

export default RptCheckInCheckOut;
