import FormFields from "@/components/FormFields";
import {
  AppProgressSpinner,
  confirmation,
  VisCheckBox,
} from "@/components/UtilityComp";
import { useFormik } from "formik";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkInCheckOutValidationSchema } from "@/validations/VisitorManagement";
import { useHistory } from "react-router-dom";
import {
  CheckIn,
  CheckInCkeckoutPageLoad,
  CheckOut,
  FilterVisitorEntryCode,
  OnChangeVisitorEntryCode,
  FilterVisitorEntryCodeManual,
} from "@/redux/slices/visitorManagement/checkInCheckOutSlice";
import AppAlert from "@/alert/alert";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { pageLoadScript } from "@/assets/js/common-utilities";
import { FilterMatchMode, InputText } from "@/assets/css/prime-library";
import { exportServ } from "@/services/ExportService";
import QRScanner from "@/components/QRScanner/QRScanner";
import { tLDS } from "@/utils/utilFunc";
import { ConfirmDialog } from "primereact/confirmdialog";

// vCheckInCheckOut
const VCheckInCheckOut = () => {
  const route = useHistory();
  const toast = useRef<Toast>(null);
  const autoCompleteRef = useRef(null);
  const dispatch: any = useDispatch();
  const [filteritemType, setFilteritemType] = useState([]);
  const [VisitorEntryTypeList, setVisitorEntryTypeList] = useState([]);
  const [GridList, setGridList] = useState([]);
  const [WorkerList, setWorkerList] = useState([]);
  const [globalFilterValue, setGlobalFilterValue] = useState<string>("");
  const [scanned, setScannedText] = useState("");
  const [autoEntry, setAutoEntry] = useState(false);
  const [qrData, setQRData] = useState();
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
    DtoVisitorEntryLogList,
  } = useSelector((state: any) => state.visitorentry);

  const { CheckInOutList } = useSelector((state: any) => state.checkincheckout);
  useEffect(() => {
    PageOnLoad();
  }, []);
  useEffect(() => {
    setGridList(CheckInOutList);
  }, [CheckInOutList]);
  useEffect(() => {
    pageLoadScript();
  }, []);
  const PageOnLoad = () => {
    var result = dispatch(
      CheckInCkeckoutPageLoad({
        CompanyId: +localStorage["CompanyId"],
        PlantId: +localStorage["PlantId"],
      })
    );
    result
      .then((res) => {
        if (res.payload.tranStatus.result) {
          setVisitorEntryTypeList(res.payload.VisitorEntryTypeList);
          setGridList(res.payload.VisitorEntryLogList);
        } else {
          toast.current?.show({
            severity: "error",
            summary: "Error Message",
            detail: res.payload.tranStatus.lstErrorItem[0].Message,
          });
        }
      })
      .catch((error) => {
        toast.current?.show({
          severity: "error",
          summary: "Error Message",
          detail: JSON.stringify(error),
        });
      });
  };
  const formik: any = useFormik({
    initialValues: {
      visType: 61,
      VisitorEntryCode: "",
      WorkerId: null,
    },
    validationSchema: checkInCheckOutValidationSchema,
    onSubmit: (values: any, { resetForm }) => {
      if (typeof values.VisitorEntryCode == "string") {
        toast.current?.show({
          severity: "warn",
          summary: "Warning Message",
          detail: "Please Select Visitor Entry Type & Visitor Entry Code.",
        });
        return;
      }
      if (!values.visType && !values.VisitorEntryCode) {
        toast.current?.show({
          severity: "warn",
          summary: "Warning Message",
          detail: "Please Select Visitor Entry Type & Visitor Entry Code.",
        });
        return;
      }
      if (WorkerList.length > 0 && !values.WorkerId) {
        toast.current?.show({
          severity: "warn",
          summary: "Warning Message",
          detail: "Please Select Worker Id.",
        });
        return;
      }
      if (values.visType == 60) {
        // Check In
        let obj = {
          UserId: localStorage["UserId"],
          VisitorEntryCode: values.VisitorEntryCode.VisitorEntryCode,
          VisitorEntryDetailId: values.WorkerId,
          Checkintime: tLDS(new Date()),
          type: "",
          CompanyId: +localStorage["CompanyId"],
          PlantId: +localStorage["PlantId"],
          RoleId: +localStorage["DefaultRoleId"],
        };
        const updateRes = dispatch(CheckIn(obj));
        updateRes
          .then((res) => {
            if (res.payload.tranStatus.result) {
              toast.current?.show({
                severity: "success",
                summary: "Success Message",
                detail: res.payload.tranStatus.lstErrorItem[0].Message,
              });
              resetallform();
            } else {
              toast.current?.show({
                severity: "error",
                summary: "Error Message",
                detail: res.payload.tranStatus.lstErrorItem[0].Message,
              });
            }
          })
          .catch((error) => {
            toast.current?.show({
              severity: "error",
              summary: "Error Message",
              detail: JSON.stringify(error),
            });
          });
      } else {
        let currWorker: any =
          WorkerList && WorkerList.length > 0
            ? WorkerList.filter(
                (item) => item.VisitorEntryDetailId == values.WorkerId
              )
            : null;
        if (new Date() > new Date(currWorker[0].ValidTo)) {
          confirmation(
            `Validity for this Visitor Already Expired, 
            Are you sure you want to Check Out this Visitor
            ?`,
            "Confirmation",
            () => {
              checkOutVis(values);
            },
            () => {}
          );
        }
        else {
          checkOutVis(values);
        }
      }
    },
  });
  const checkOutVis = (values) => {
    let obj = {
      UserId: localStorage["UserId"],
      VisitorEntryCode: values.VisitorEntryCode.VisitorEntryCode,
      VisitorEntryDetailId: values.WorkerId,
      Checkouttime: tLDS(new Date()),
      type: "",
    };
    const updateRes = dispatch(CheckOut(obj));
    updateRes
      .then((res) => {
        if (res.payload.tranStatus.result) {
          toast.current?.show({
            severity: "success",
            summary: "Success Message",
            detail: res.payload.tranStatus.lstErrorItem[0].Message,
          });
          resetallform();
        } else {
          toast.current?.show({
            severity: "error",
            summary: "Error Message",
            detail: res.payload.tranStatus.lstErrorItem[0].Message,
          });
        }
      })
      .catch((error) => {
        toast.current?.show({
          severity: "error",
          summary: "Error Message",
          detail: JSON.stringify(error),
        });
      });
  };
  const resetallform = () => {
    formik.resetForm();
    setWorkerList([]);
    PageOnLoad();
  };
  const handleWorkerSelect = (name, other, value) => {
    formik.setFieldValue(name, value);
  };
  const handleMetadataSelect = (name, other, value) => {
    formik.setFieldValue(name, value);
    formik.setFieldValue("VisitorEntryCode", "");
    formik.setFieldValue("WorkerId", null);
    setWorkerList([]);
  };
  const OnChangingVisitorEntryCode = (name, other, value) => {
    formik.setFieldValue(name, value);

    formik.setFieldValue("WorkerId", null);
    setWorkerList([]);
    if (typeof value == "string") {
    } else {
      let visType = formik.values.visType;
      if (!visType) {
        toast.current?.show({
          severity: "warn",
          summary: "Warning Message",
          detail: "Please Select Visitor Entry Type.",
        });
        return;
      }
      let obj = {
        VisitorEntryCode: value.VisitorEntryCode,
        EntryType: visType,
      };
      var result = dispatch(OnChangeVisitorEntryCode(obj));
      result
        .then((res) => {
          if (res.payload.tranStatus.result) {
            if (
              res.payload.VisitorEmployeeList &&
              res.payload.VisitorEmployeeList.length &&
              res.payload.VisitorEmployeeList.length > 0
            ) {
              let workers = res.payload.VisitorEmployeeList;
              setWorkerList(workers);
              if (workers && workers.length > 0 && workers.length == 1) {
                handleWorkerSelect(
                  "WorkerId",
                  {},
                  workers[0].VisitorEntryDetailId
                );
              }
            } else {
              setWorkerList([]);
            }
          } else {
            toast.current?.show({
              severity: "error",
              summary: "Error Message",
              detail: res.payload.tranStatus.lstErrorItem[0].Message,
            });
          }
        })
        .catch((error) => {
          toast.current?.show({
            severity: "error",
            summary: "Error Message",
            detail: JSON.stringify(error),
          });
        });
    }
  };
  const onChangeMatType = (e) => {
    formik.setFieldValue("VisitorEntryCode", e.query);
    let visType = formik.values.visType;
    if (!visType) {
      toast.current?.show({
        severity: "warn",
        summary: "Warning Message",
        detail: "Please Select Visitor Entry Type.",
      });
      return;
    }
    let obj = {
      text: e.query,
      EntryType: visType,
      PlantId: +localStorage["PlantId"],
      CompanyId: +localStorage["CompanyId"],
      RoleId: +localStorage["DefaultRoleId"],
    };
    var result = dispatch(FilterVisitorEntryCodeManual(obj));
    result
      .then((res) => {
        if (res.payload.tranStatus.result) {
          setFilteritemType(res.payload.VisitorEntryCheckInCodeList);
        } else {
          toast.current?.show({
            severity: "error",
            summary: "Error Message",
            detail: res.payload.tranStatus.lstErrorItem[0].Message,
          });
        }
      })
      .catch((error) => {
        toast.current?.show({
          severity: "error",
          summary: "Error Message",
          detail: JSON.stringify(error),
        });
      });
  };

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const tableExport = (exportType: string) => {
    const data = dispatch(
      CheckInCkeckoutPageLoad({
        CompanyId: +localStorage["CompanyId"],
        PlantId: +localStorage["PlantId"],
      })
    );
    data.then((res: any) => {
      fetchDataForExport(res.payload.VisitorEntryLogList)
        .then((dataList: any) => {
          if (exportType === "pdf") {
            exportServ.Export("CheckIn-CheckOut", dataList, "pdf");
          } else if (exportType === "excel") {
            exportServ.Export("CheckIn-CheckOut", dataList, "excel");
          }
        })
        .catch((error) => {
          console.error(error.message);
        });
    });
  };

  const fetchDataForExport = (vList) => {
    return new Promise((resolve, reject) => {
      let dataList = [];
      if (vList.length > 0) {
        vList.forEach((element) => {
          let data = {
            "Visitor Entry Code": element.VisitorEntryCode,
            "Visitor Type": element.VisitorTypeName,
            "Visitor Name": element.VisitorName,
            "Person to Visit": element.PersonToVisit,
            "Checked In": element.CheckedIn,
            "Checked Out": element.CheckedOut,
            "Created By": element.CreatedByName,
            "Modified By": element.ModifiedByName,
          };
          dataList.push(data);
        });
        resolve(dataList);
      } else {
        reject(new Error("No data available for export."));
      }
    });
  };

  const TableHeader = () => {
    const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      let _filters = { ...filters };

      _filters["global"].value = value;

      setFilters(_filters);
      setGlobalFilterValue(value);
    };

    const paths = ["/home/vApprovalConfiguration"];

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
              icon="pi pi-file-excel"
              severity="success"
              onClick={() => tableExport("excel")}
              data-pr-tooltip="XLS"
            />
            <Button
              type="button"
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

  useEffect(() => {
    if (scanned && scanned != "") {
      formik.setFieldValue("VisitorEntryCode", scanned.split(":")[0]);
      checkOut(scanned.split(":"));
    }
  }, [scanned]);

  const checkOut = (visEntryData) => {
    let obj = {
      UserId: localStorage["UserId"],
      VisitorEntryCode: visEntryData[0],
      VisitorEntryDetailId: visEntryData[1],
      Checkouttime: tLDS(new Date()),
      type: "",
    };
    const updateRes = dispatch(CheckOut(obj));
    updateRes
      .then((res) => {
        if (res.payload.tranStatus.result) {
          PageOnLoad();
          toast.current?.show({
            severity: "success",
            summary: "Success Message",
            detail: res.payload.tranStatus.lstErrorItem[0].Message,
          });
          setScannedText("");
        } else {
          toast.current?.show({
            severity: "error",
            summary: "Error Message",
            detail: res.payload.tranStatus.lstErrorItem[0].Message,
          });
          setScannedText("");
        }
      })
      .catch((error) => {
        toast.current?.show({
          severity: "error",
          summary: "Error Message",
          detail: JSON.stringify(error),
        });
        setScannedText("");
      });
  };

  return (
    <>
      <div className="page-container">
        <div className="inner-page-container">
          <div className="page-title">
            <div className="grid grid-nogutter">
              <div className="md:col-6">
                <h1>Check In / Check Out</h1>
              </div>
            </div>
          </div>
          {!loading ? (
            <>
              <div className="form-container scroll-y">
                <div className="white">
                  <div className="widget-body">
                    <div className="normal-table">
                      {/* <VisCheckBox
                        label={"Is Auto Entry ?"}
                        name={"IsAutoEntry"}
                        value={autoEntry}
                        handleChange={() =>
                          autoEntry ? setAutoEntry(false) : setAutoEntry(true)
                        }
                      /> */}
                      {autoEntry ? (
                        <>
                          <QRScanner
                            scanned={scanned}
                            setScannedText={setScannedText}
                          />
                          <FormFields
                            type={"text"}
                            name={"VisitorEntryCode"}
                            label={"Visitor Entry Code "}
                            options={""}
                            show={true}
                            required={false}
                            disable={true}
                            optionLabel={""}
                            optionValue={""}
                            handleSelect={""}
                            fldStyle={"col-12 md:col-2"}
                            placeHolder={"Please Enter Visitor Entry Code"}
                            formik={formik}
                          />
                        </>
                      ) : (
                        <div className="grid mt-1">
                          <FormFields
                            type={"select"}
                            name={"visType"}
                            label={"Visitor Entry Type "}
                            options={VisitorEntryTypeList}
                            show={true}
                            required={false}
                            disable={false}
                            optionLabel={"MetaSubDescription"}
                            optionValue={"MetaSubId"}
                            handleSelect={handleMetadataSelect}
                            fldStyle={"col-12 md:col-3"}
                            formik={formik}
                          />
                          <FormFields
                            type={"autocomplete"}
                            name={"VisitorEntryCode"}
                            label={"Visitor Entry Code "}
                            show={true}
                            required={true}
                            disable={false}
                            optionLabel={""}
                            optionValue={""}
                            handleChange={(e) =>
                              OnChangingVisitorEntryCode(
                                "VisitorEntryCode",
                                {},
                                e.value
                              )
                            } //on select
                            fldStyle={"col-12 md:col-3"}
                            formik={formik}
                            autoSearch={onChangeMatType} //filter Method
                            autoCompleteRef={autoCompleteRef}
                            autoSuggestions={filteritemType} //Filtered List
                            autoCompleteLbl={"VisitorEntryCode"}
                            field={"VisitorEntryCode"}
                            maxLength={20}
                            placeHolder={"Please Enter Visitor Entry Code"}
                          />
                          <FormFields
                            type={"select"}
                            name={"WorkerId"}
                            label={"Visitors / Worker Name"}
                            options={WorkerList}
                            show={true}
                            required={false}
                            disable={false}
                            optionLabel={"VisitorEmpName"}
                            optionValue={"VisitorEntryDetailId"}
                            handleSelect={handleWorkerSelect}
                            fldStyle={"col-12 md:col-3"}
                            formik={formik}
                          />
                          <div className="col-12 md:col-3">
                            <label className="form-label mt-4"> </label>
                            <Button
                              label="Check In / Check Out"
                              title="Add"
                              icon="las la-save"
                              className="mr-2 p-1"
                              type="submit"
                              onClick={formik.handleSubmit}
                            />
                            <Button
                              label="Clear"
                              severity="danger"
                              title="Clear"
                              icon="las la-times"
                              className="mr-2 p-1"
                              onClick={resetallform}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="white">
                  <div className="widget-body">
                    <div className="normal-table">
                      <div className="card">
                        <DataTable
                          value={GridList}
                          showGridlines
                          paginator
                          filters={filters}
                          filterDisplay="menu"
                          globalFilterFields={[
                            "VisitorEntryCode",
                            "VisitorTypeName",
                            "VisitorName",
                            "PersonToVisit",
                            "CheckedIn",
                            "CreatedByName",
                            "CheckedOut",
                            "ModifiedByName",
                          ]}
                          emptyMessage="No Data found."
                          editMode="cell"
                          rows={25}
                          rowsPerPageOptions={[25, 50, 100, 500, 1000]}
                          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Entries"
                          paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                          tableStyle={{ minWidth: "50rem" }}
                          header={TableHeader}
                        >
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
                          ></Column>
                          <Column
                            field="PersonToVisit"
                            header="Person to Visit"
                            sortable
                          ></Column>
                          <Column
                            field="CheckedIn"
                            header="Checked In"
                            sortable
                          ></Column>
                          <Column
                            field="CreatedByName"
                            header="Checked In By"
                            sortable
                          ></Column>
                          <Column
                            field="CheckedOut"
                            header="Checked Out"
                            sortable
                          ></Column>
                          <Column
                            field="ModifiedByName"
                            header="Checked Out By"
                            sortable
                          ></Column>
                        </DataTable>
                      </div>
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
      <ConfirmDialog />

      <AppAlert toast={toast} />
    </>
  );
};
export default VCheckInCheckOut;
