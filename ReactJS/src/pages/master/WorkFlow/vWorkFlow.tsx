import { AppProgressSpinner } from "@/components/UtilityComp";
import { useFormik } from "formik";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  approvalupdate,
  fetch,
  ApprovalView,
} from "@/redux/slices/master/workFlowSlice";
import AppAlert from "@/alert/alert";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import FormFields from "@/components/FormFields";
import { pageLoadScript } from "@/assets/js/common-utilities";
import { FilterMatchMode } from "primereact/api";
import { InputText } from "primereact/inputtext";
import { exportServ } from "@/services/ExportService";
import { Console } from "console";

const PrevPop = (props) => {
  const { handleClosePop, visible, viewList, data } = props;

  const imageBodyTemplate = (rowData) => {
    return (
      <div key={rowData.StatusName}>
        <img src={rowData.Visitor_Image} />
      </div>
    );
  };

  const loadContent: any = (rowData, col) => {
    if (col.avatar) {
      return imageBodyTemplate(rowData);
    }
    if (col.action) {
      // return additionalIcon(rowData);
    }
    if (!col.badge || !col.action) {
      return <>{rowData[col.name]}</>;
    }
  };

  return (
    <>
      <Dialog
        visible={visible}
        onHide={() => handleClosePop()}
        className="preview-container"
      >
        <DataTable
          value={data}
          showGridlines
          // filters={filters}
          emptyMessage={"No Data Found"}
          style={{
            minWidth: "50rem",
          }}
          dataKey="id"
          paginator={true}
          rows={25}
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Entries"
          paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
          // globalFilter={globalFilter}
          // header={TableHeader}
        >
          {viewList.length > 0 &&
            viewList.map((col) => {
              return (
                <Column
                  key={col.name}
                  field={col.name}
                  header={col.title}
                  sortable={col.sort}
                  className="wrap-cell"
                  style={col.colStyle}
                  body={(rowData) => loadContent(rowData, col)}
                ></Column>
              );
            })}
        </DataTable>
      </Dialog>
    </>
  );
};

const WorkFlowDialog = (props) => {
  const { setWorkVisible, WorkVisible, formik, OnApprove, OnReject, rowData, isPopDisbaleSave } =
    props;
  useEffect(() => {
    formik.setFieldValue("Remarks", "");
  }, []);
  return (
    <Dialog
      header="Approval"
      visible={WorkVisible}
      style={{
        width: "60vw",
        maxHeight: "80vh",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
      onHide={() => setWorkVisible(false)}
    >
      <div
        style={{
          maxHeight: "200px",
        }}
      >
        <div className="white">
          <div className="widget-body">
            <div className="normal-table">
              <div className="card">
                <FormFields
                  type={"textarea"}
                  name={"Remarks"}
                  label={"Remarks"}
                  options={""}
                  show={true}
                  required={false}
                  disable={false}
                  optionLabel={""}
                  optionValue={""}
                  handleSelect={""}
                  maxLength="500"
                  formik={formik}
                  style={{ maxHeight: "100px", overflowY: "auto" }}
                />
                <div className="text-center">
                  <Button
                    label="Approve"
                    severity="success"
                    title="Approve"
                    icon="las la-check"
                    disabled={isPopDisbaleSave}
                    loading={isPopDisbaleSave}
                    className="mr-2 p-1"
                    onClick={() => OnApprove(rowData)}
                    />
                  <Button
                    label="Reject"
                    severity="danger"
                    title="Reject"
                    disabled={isPopDisbaleSave}
                    loading={isPopDisbaleSave}

                    icon="las la-check"
                    className="mr-2 p-1"
                    onClick={() => OnReject(rowData)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

const VWorkFlow = () => {
  const route = useHistory();
  const toast = useRef<Toast>(null);
  const autoCompleteRef = useRef(null);
  const dispatch: any = useDispatch();
  const [GridList, setGridList] = useState([]);
  const [workFlowList, setWorkFlowList] = useState([]);
  const [headerList, setHeaderList] = useState([]);
  const [Visible, setVisible] = useState(false);
  const [isPopDisbaleSave, setIsPopDisbaleSave] = useState(false);
  const [workFlowCountList, setWorkFlowCountListList] = useState([]);
  const [globalFilterValue, setGlobalFilterValue] = useState<string>("");
  const [sessionClearTimer, setSessionClearTimer] = useState<NodeJS.Timeout>();
  const [viewList, setViewList] = useState([]);
  const [data, setData] = useState([]);

  const {
    isCreate,
    isView,
    SearchData,
    loading,
    error,
    tranStatus,
    WorkFlowList,
  } = useSelector((state: any) => state.workflow);

  const [rowData, setRowData] = useState();
  const [WorkVisible, setWorkVisible] = useState(false);

  const OnApprove = (rowData) => {
    setIsPopDisbaleSave(true)
    
    let obj = {
      ApprovalRequest: {
        companyid: +localStorage["CompanyId"],
        plantid: +localStorage["PlantId"],
        requesterid: rowData.initiatedBy,
        documentno: rowData.DocumentNo,
        documentid: rowData.DocumentId,
        approvalid: rowData.ApprovalId,
        approvaldetailid: rowData.ApprovalDetailId,
        remarks1: rowData.Remarks1,
        remarks2: rowData.Remarks2,
        status: 75,
        approverid: +localStorage["UserId"],
        levelid: rowData.LevelId,
        alternateuser: null,
        parentid: null,
        userid: +localStorage["UserId"],
        requestfromdate: null,
        requesttodate: null,
        Isviewed: 1,
        documentactivityid: rowData.ApprovalActivityId,
        documentdetailid: rowData.DocumentId
      },
    };
    servicecall(obj);
  };
  const OnReject = (rowData) => {
    setIsPopDisbaleSave(true)

    let obj = {
      ApprovalRequest: {
        companyid: +localStorage["CompanyId"],
        plantid: +localStorage["PlantId"],
        requesterid: rowData.initiatedBy,
        documentno: rowData.DocumentNo,
        documentid: rowData.DocumentId,
        approvalid: rowData.ApprovalId,
        approvaldetailid: rowData.ApprovalDetailId,
        remarks1: rowData.Remarks1,
        remarks2: rowData.Remarks2,
        status: 76,
        approverid: +localStorage["UserId"],
        levelid: rowData.LevelId,
        alternateuser: null,
        parentid: null,
        userid: +localStorage["UserId"],
        requestfromdate: null,
        requesttodate: null,
        Isviewed: 1,
        documentactivityid: rowData.ApprovalActivityId,
        documentdetailid: rowData.DocumentId
      },
    };
    servicecall(obj);
  };
  const servicecall = (obj: any) => {
    var result = dispatch(approvalupdate(obj));
    result
      .then((res) => {
        if (res.payload.Result.tranStatus.result) {
    setIsPopDisbaleSave(false)

          toast.current?.show({
            severity: "success",
            summary: "Success Message",
            detail: res.payload.Result.tranStatus.lstErrorItem[0].Message,
          });
          setWorkVisible(false);
          PageOnLoad();
        } else {
    setIsPopDisbaleSave(false)

          toast.current?.show({
            severity: "error",
            summary: "Error Message",
            detail: res.payload.Result.tranStatus.lstErrorItem[0].Message,
          });
        }
      })
      .catch((error) => {
    setIsPopDisbaleSave(false)

        toast.current?.show({
          severity: "error",
          summary: "Error Message",
          detail: JSON.stringify(error),
        });
      });
  };

  const fetchApproval = (e) => {
    const obj = {
      VisitorEntryCode: e.DocumentNo,
    };
    var result = dispatch(ApprovalView(obj));
    result
      .then((res) => {
        if (res.payload.tranStatus.result) {
          
          const keysArray: string[] = [];
          const valuesArray: any[][] = [];

          // Iterate over each object in the data array
          res.payload.ApprovalViewList.forEach((item, index) => {
            // Extract keys dynamically
            Object.keys(item).forEach((key) => {
              // If it's a new key, add it to the keys array
              if (!keysArray.includes(key)) {
                keysArray.push(key);
              }
            });

            // Iterate over keys and store corresponding values
            keysArray.forEach((key, i) => {
              // Initialize sub-array if it's the first time encountering the key
              if (!valuesArray[i]) {
                valuesArray[i] = [];
              }
              // Push value to the respective sub-array
              valuesArray[i].push(item[key]);
            });
          });

          setVisible(true);
          const objectsArray = keysArray.map((key) => {
            const title = "";
            const name = "";
            const titleSplit = title.split(" ").concat([key]);
            const nameSplit = name.split(" ").concat([key]);
            return {
              title: titleSplit.join(" ").replaceAll("_", " "),
              name: nameSplit.join(""),
              sort: true,
              avatar: key == "Visitor_Image" ? true : false,
              badge: false,
              colStyle: { minWidth: "10rem" },
            };
          });
          setViewList(objectsArray);
          setData(res.payload.ApprovalViewList);
          setVisible(true);
        }
      })
      .catch((error) => {
        toast.current?.show({
          severity: "error",
          summary: "Error Message",
          detail: JSON.stringify(error),
        });
      });
    // route.push(rowData.DocumentUrl);
  };
  const ShowDialog = (e, setWorkVisible, setRowData) => {
    return (
      <>
        <Button
          label=""
          title="Approved"
          icon="las la-check"
          className="mr-2 p-1"
          disabled={e.Status == 75 || e.Status == 76}
          onClick={() => {
            setRowData(e);
            setWorkVisible(true);
          }}
        />
        {/* <Button
          label=""
          title="View"
          icon="las la-eye"
          className="mr-2 p-1"
          // disabled={rowData.Status == 75 || rowData.Status == 76}
          onClick={() => fetchApproval(e)}
        /> */}
        {/* <Button
                  label=""
                  title="View"
                  icon="las la-times"
                  className="mr-2 p-1"
                  // disabled={rowData.Status == 75 || rowData.Status == 76}
                  onClick={fetchApproval}
              /> */}
      </>
    );
  };

  useEffect(() => {
    PageOnLoad();
    // sessionWatcher();
  }, []);

  const sessionWatcher = () => {
    if (!sessionClearTimer) {
      setSessionClearTimer(
        setInterval(() => {
          let approvalChanged;
          if (localStorage.getItem("appPopChanged") != "") {
            approvalChanged = localStorage.getItem("appPopChanged") || "false";
          }
          if (approvalChanged) {
            // PageOnLoad();
            clearInterval(sessionClearTimer);
          }
        }, 1000)
      );
    }
  };

  useEffect(() => {
    pageLoadScript();
  });

  const PageOnLoad = () => {
    const WorkFlow = {
      WorkFlowId: 0,
      Taskname: "SearchInitialize",
      UserId: +localStorage["UserId"],
      PlantId: +localStorage["PlantId"],
      CompanyId: +localStorage["CompanyId"],
      RoleId: +localStorage["DefaultRoleId"],
      Status: 97,
    };
    var result = dispatch(fetch(WorkFlow));
    result
      .then((res) => {
        if (res.payload.tranStatus.result) {
          setGridList(res.payload.WorkFlowList);
          setWorkFlowCountListList(res.payload.WorkFlowCountList);

          let headerData = res.payload.WorkFlowCountList;
          let convertedObj = [];

          for (const key in headerData[0]) {
            if (headerData[0].hasOwnProperty(key)) {
              const count = headerData[0][key];
              let text = "";
              let description = "";
              let icon = "";
              let iconCol = "";
              let stsId = 0;

              switch (key) {
                case "approved":
                  stsId = 75;
                  text = "Approved";
                  icon = "las la-check-circle";
                  iconCol = "color03";
                  description = "No. Of Approved";
                  break;
                case "pending":
                  stsId = 74;
                  text = "Pending";
                  icon = "las la-exclamation-triangle";
                  iconCol = "color02";
                  description = "No. Of Pending";
                  break;
                case "rejected":
                  stsId = 76;
                  text = "Rejected";
                  icon = "las la-times-circle";
                  iconCol = "color05";
                  description = "No. Of Rejected";
                  break;
              }

              convertedObj.push({
                count,
                stsId,
                text,
                icon,
                iconCol,
                description,
              });
            }
          }
          const overallCount = convertedObj.reduce(
            (total, item) => total + item.count,
            0
          );
          convertedObj.push({
            count: overallCount,
            stsId: 97,
            text: "Overall",
            icon: "las la-plus-circle",
            iconCol: "color01",
            description: "OverAll",
          });

          setHeaderList(convertedObj);
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
      Remarks: "",
    },
    onSubmit: (values: any, { resetForm }) => {},
  });
  const resetallform = () => {
    formik.resetForm();
    // PageOnLoad();
  };
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const tableExport = (exportType: string) => {
    const WorkFlow = {
      WorkFlowId: 0,
      Taskname: "SearchInitialize",
      PlantId: +localStorage["PlantId"],
      UserId: +localStorage["UserId"],
      CompanyId: +localStorage["CompanyId"],
      RoleId: +localStorage["DefaultRoleId"],
      Status: 97,
    };
    const data = dispatch(fetch(WorkFlow));
    data.then((res: any) => {
      fetchDataForExport(res.payload.WorkFlowList)
        .then((dataList: any) => {
          if (exportType === "pdf") {
            exportServ.Export("WorkFlow", dataList, "pdf");
          } else if (exportType === "excel") {
            exportServ.Export("WorkFlow", dataList, "excel");
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
            "Plant Name": element.PlantName,
            "Document Type": element.DocumentType,
            "Document No": element.DocumentNo,
            Stages: element.Stages,
            "Requested Date": element.CreatedOn,
            "Approver Name": element.ApproverName,
            "Initiated By": element.initiatedByName,
            "Document Status": element.StatusName,
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

  const handleClosePop = () => {
    setVisible(false);
  };

  const handleHeaderData = (stsId) => {
    const WorkFlow = {
      WorkFlowId: 0,
      Taskname: "SearchInitialize",
      PlantId: localStorage["PlantId"],
      CompanyId: +localStorage["CompanyId"],
      RoleId: +localStorage["DefaultRoleId"],
      UserId: localStorage["UserId"],
      Status: stsId,
    };
    const result = dispatch(fetch(WorkFlow));
    result
      .then((res) => {
        if (res.payload.tranStatus.result) {
          setGridList(res.payload.WorkFlowList);
          setWorkFlowCountListList(res.payload.WorkFlowCountList);
        }
      })
      .catch((err) => {});
  };

  return (
    <>
      <div className="page-container">
        <div className="inner-page-container">
          <div className="page-title">
            <div className="grid grid-nogutter">
              <div className="md:col-6">
                <h1>Approval Workflow</h1>
              </div>
            </div>
          </div>
          {!loading ? (
            <>
              <div className="form-container scroll-y">
                <div className="grid">
                  {headerList &&
                    headerList.map((item) => {
                      return (
                        <div
                          className="col-3"
                          onClick={() => handleHeaderData(item.stsId)}
                        >
                          <div className="white">
                            <div className="widget-body flex">
                              <div className={`${item.iconCol} dashboard-icon`}>
                                <i className={item.icon}></i>
                              </div>
                              <div className="dashboard-count-label">
                                <div className="dashboard-count">
                                  {workFlowCountList.map((approve, index) => (
                                    <div
                                      key={index}
                                      style={{ fontSize: "36px" }}
                                    >
                                      {item.count}
                                    </div>
                                  ))}
                                </div>
                                <div className="dashboard-label">
                                  {item.description}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>

                <div className="white">
                  <div className="widget-body">
                    <div className="normal-table">
                      <div className="card">
                        <DataTable
                          value={GridList}
                          showGridlines
                          paginator
                          filterDisplay="menu"
                          emptyMessage="No Data found."
                          editMode="cell"
                          rows={10}
                          rowsPerPageOptions={[10, 50, 100, 500, 1000]}
                          tableStyle={{ minWidth: "50rem" }}
                          header={TableHeader}
                          dataKey="id"
                          filters={filters}
                          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Entries"
                          paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                          globalFilterFields={[
                            "PlantName",
                            "ApproverName",
                            "DocumentType",
                            "DocumentNo",
                            "Stages",
                            "CreatedOn",
                            "ApproverName",
                            "initiatedByName",
                            "StatusName",
                          ]}
                        >
                          <Column
                            header="Action"
                            body={(e) =>
                              ShowDialog(e, setWorkVisible, setRowData)
                            }
                            style={{ textAlign: "center" }}
                          ></Column>
                          <Column
                            sortable
                            field="PlantName"
                            header="Plant Name"
                          ></Column>
                          <Column
                            sortable
                            field="DocumentType"
                            header="Document Type"
                          ></Column>
                          <Column
                            sortable
                            field="DocumentNo"
                            header="Document No"
                          ></Column>
                          <Column
                            sortable
                            field="Stages"
                            header="Stages"
                          ></Column>
                          <Column
                            sortable
                            field="CreatedOn"
                            header="Requested Date"
                          ></Column>
                          <Column
                            sortable
                            field="ApproverName"
                            header="Approver Name"
                          ></Column>
                          <Column
                            sortable
                            field="initiatedByName"
                            header="Initiated By"
                          ></Column>
                          <Column
                            style={{ textAlign: "center" }}
                            sortable
                            field="StatusName"
                            header="Document Status"
                          ></Column>
                        </DataTable>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <WorkFlowDialog
                rowData={rowData}
                OnApprove={OnApprove}
                OnReject={OnReject}
                isPopDisbaleSave={isPopDisbaleSave}
                WorkVisible={WorkVisible}
                setWorkVisible={setWorkVisible}
                formik={formik}
              />
              <PrevPop
                handleClosePop={handleClosePop}
                visible={Visible}
                viewList={viewList}
                data={data}
              />
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
export default VWorkFlow;
