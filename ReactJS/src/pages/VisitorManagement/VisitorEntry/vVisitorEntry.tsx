import AppAlert from "@/alert/alert";
import { pageLoadScript } from "@/assets/js/common-utilities";
import AppTable from "@/components/AppTable";
import PageHeader from "@/components/PageHeader";
import { confirmation } from "@/components/UtilityComp";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  CheckIn,
  CheckOut,
} from "@/redux/slices/visitorManagement/checkInCheckOutSlice";
import {
  changestatus,
  createInit,
  createOrEdit,
  fetch,
} from "@/redux/slices/visitorManagement/visitorentrySlice";
import PrintPass from "@/components/PrintPass";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { tLDS } from "@/utils/utilFunc";

const VVisitorEntry = () => {
  const route = useHistory();
  const toast = useRef<Toast>(null);
  const dispatch: any = useDispatch();
  const [VisitorEntryList, setVisitorEntryList] = useState([]);
  const [selectedData, setselectedData] = useState();
  const [passVisible, setpassVisible] = useState<boolean>(false);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const { loading, createEditData } = useSelector(
    (state: any) => state.visitor
  );

  useEffect(() => {
    pageLoadScript();
  });
  useEffect(() => {
    Fetch();
  }, []);

  const Fetch = () => {
    let obj = {
      PlantId: +localStorage["PlantId"],
      FromDate: new Date().toLocaleDateString("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
      ToDate: new Date().toLocaleDateString("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
    };
    var result = dispatch(fetch(obj));
    result
      .then((res) => {
        if (res.payload.tranStatus.result == true) {
          setVisitorEntryList(res.payload.VisitorEntryList);
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
  const [pageConfig, setPageConfig] = useState({
    pageTitle: "Visitor Entry",
    pageHeader: {
      pageActions: [
        {
          create: true,
          clear: false,
          save: false,
          createQuery: "/home/cVisitorEntry",
          createDispatch: () =>
            dispatch(
              createOrEdit({ data: null, isView: false, isCreate: true })
            ),
        },
      ],
    },
    tableCheckSelection: false,
    tableAction: true,
    tableActionStyle: {
      minWidth: "14rem",
      maxWidth: "14rem",
      textAlign: "center",
      justifySelf: "center",
    },
    tableRows: 10,
    tableRowsOptions: [5, 10, 25],
    tablePagination: true,
    tableActions: [
      {
        title: "View",
        name: "view",
      },
      {
        title: "Edit",
        name: "edit",
      },
      {
        title: "Delete",
        name: "delete",
      },
      {
        title: "Print",
        name: "print",
      },
      {
        title: "Approval",
        name: "self_approval",
      },
    ],
    tableColumns: [
      {
        title: "Visitor Entry Code",
        name: "VisitorEntryCode",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: { minWidth: "6rem" },
      },
      {
        title: "Visitor Name",
        name: "PersonName",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: {
          minWidth: "10rem",
        },
      },
      {
        title: "Visitor Type",
        name: "VisitorTypeName",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: {},
      },
      {
        title: "Mobile No",
        name: "MobileNo",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: { minWidth: "7rem" },
      },
      {
        title: "Person To Visit",
        name: "PersonToVisit",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: {},
      },
      {
        title: "Purpose Of Visit",
        name: "PurposeOfVisitName",
        sort: true,
        avatar: true,
        badge: false,
        colStyle: { minWidth: "6rem" },
      },
      {
        title: "Created By",
        name: "CreatedbyName",
        sort: true,
        avatar: true,
        badge: false,
        colStyle: { minWidth: "8rem" },
      },
      {
        title: "Created On",
        name: "CreatedOn",
        sort: true,
        avatar: true,
        badge: false,
        colStyle: { minWidth: "6rem" },
      },
      {
        title: "Modified By",
        name: "ModifiedByName",
        sort: true,
        avatar: true,
        badge: false,
        colStyle: { minWidth: "8rem" },
      },
      {
        title: "Modified On",
        name: "ModifiedOn",
        sort: true,
        avatar: true,
        badge: false,
        colStyle: { minWidth: "6rem" },
      },
      {
        title: "Status",
        name: "StatusName",
        sort: true,
        avatar: false,
        badge: true,
        colStyle: {
          minWidth: "7rem",
          textAlign: "center",
        },
      },
      {
        title: "CheckOut",
        name: "CheckOut",
        sort: true,
        avatar: false,
        badge: false,
        action: true,
        colStyle: {
          minWidth: "7rem",
          maxWidth: "8rem",
          textAlign: "center",
        },
      },
    ],
  });
  const handleActions = {
    view: (rowData) => {
      const data = {
        VisitorEntryId: rowData.data.VisitorEntryId,
        PlantId: +localStorage["PlantId"],
        CompanyId: +localStorage["CompanyId"],
      };
      const dataFetched = dispatch(createInit(data));
      dataFetched
        .then((res) => {
          if (res.payload.tranStatus.result == true) {
            route.push("/home/cVisitorEntry");
          } else {
            toast.current?.show({
              severity: "error",
              summary: "Error Message",
              detail: res.payload.tranStatus.lstErrorItem[0].Message,
            });
          }
        })
        .catch((err) => {
          toast.current?.show({
            severity: "error",
            summary: "Error Message",
            detail: JSON.stringify(err),
          });
        });
      dispatch(createOrEdit(rowData));
    },
    edit: (rowData) => {
      const data = {
        VisitorEntryId: rowData.data.VisitorEntryId,
        PlantId: +localStorage["PlantId"],
        CompanyId: +localStorage["CompanyId"],
      };
      const dataFetched = dispatch(createInit(data));
      dataFetched
        .then((res) => {
          if (res.payload.tranStatus.result == true) {
            route.push("/home/cVisitorEntry");
          } else {
            toast.current?.show({
              severity: "error",
              summary: "Error Message",
              detail: res.payload.tranStatus.lstErrorItem[0].Message,
            });
          }
        })
        .catch((err) => {
          toast.current?.show({
            severity: "error",
            summary: "Error Message",
            detail: JSON.stringify(err),
          });
        });
      dispatch(createOrEdit(rowData));
    },
    delete: (rowData) => {
      confirmation(
        `Are you sure you want to inactive this Visitor (${rowData.data.PersonName}[${rowData.data.VisitorEntryCode}]) ?`,
        "Confirmation",
        () => {
          const data = {
            VisitorEntryId: rowData.data.VisitorEntryId,
          };
          var result = dispatch(changestatus(data));
          result
            .then((res) => {
              if (res.payload.tranStatus.result == true) {
                toast.current?.show({
                  severity: "success",
                  summary: "Success Message",
                  detail: "Inactivated Successfully.",
                });
                Fetch();
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
        },
        () => {}
      );
    },
    print: (rowData) => {
      //   setpassVisible(true);
      //   setselectedData(rowData.data);
      localStorage.setItem("clickedRowData", JSON.stringify(rowData));
      window.open("/home/print");
    },
    approval: (rowData) => {
      let obj = {
        UserId: localStorage["UserId"],
        VisitorEntryCode: rowData.data.VisitorEntryCode,
        VisitorEntryDetailId: rowData.data.VisitorEntryDetailId,
        Checkintime: tLDS(new Date()),
        type: "SelfApproval",
        CompanyId: +localStorage["CompanyId"],
        PlantId: +localStorage["PlantId"],
        RoleId: +localStorage["DefaultRoleId"],
      };
      var result = dispatch(CheckIn(obj));
      result
        .then((res) => {
          if (res.payload.tranStatus.result) {
            toast.current?.show({
              severity: "success",
              summary: "Success Message",
              detail: "Checked In Successfully.",
            });
            Fetch();
          } else {
            toast.current?.show({
              severity: "error",
              summary: "Error",
              detail: res.payload.tranStatus.lstErrorItem[0].Message,
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
    },
    checkOut: (rowData) => {
      let obj = {
        UserId: localStorage["UserId"],
        VisitorEntryCode: rowData.data.VisitorEntryCode,
        VisitorEntryDetailId: rowData.data.VisitorEntryDetailId,
        Checkouttime:tLDS(new Date()),

      };
      var result = dispatch(CheckOut(obj));
      result
        .then((res) => {
          if (res.payload.tranStatus.result) {
            toast.current?.show({
              severity: "success",
              summary: "Success Message",
              detail: "Checked Out Successfully.",
            });
            Fetch();
          } else {
            toast.current?.show({
              severity: "error",
              summary: "Error",
              detail: res.payload.tranStatus.lstErrorItem[0].Message,
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
    },
  };
  const handleFromChange = (e) => {
    setFromDate(e.target.value);
  };
  const handleToChange = (e) => {
    setToDate(e.target.value);
  };
  const SearchData = () => {
    if (!fromDate || fromDate == null) {
      toast.current?.show({
        severity: "error",
        summary: "Error Message",
        detail: "Please Select From Date.",
      });
      return;
    }
    if (!toDate || toDate == null) {
      toast.current?.show({
        severity: "error",
        summary: "Error Message",
        detail: "Please Select To Date.",
      });
      return;
    }

    let obj = {
      PlantId: +localStorage["PlantId"],
      FromDate: fromDate.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
      ToDate: toDate.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
    };
    var result = dispatch(fetch(obj));
    result
      .then((res) => {
        if (res.payload.tranStatus.result == true) {
          setVisitorEntryList(res.payload.VisitorEntryList);
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
  return (
    <>
      <div className="page-container">
        <div className="inner-page-container">
          <PageHeader
            pageTitle={pageConfig.pageTitle}
            pageConfig={pageConfig}
          />
          <div className="form-container scroll-y">
            <div className="white">
              <div className="widget-body">
                <div className="card">
                  <div>
                    <label
                      className="form-label"
                      style={{ marginRight: "20px" }}
                    >
                      From Date :
                    </label>
                    <Calendar
                      dateFormat={"dd/mm/yy"}
                      showIcon
                      onChange={handleFromChange}
                      style={{
                        width: "200px",
                        marginBottom: "20px",
                        marginRight: "20px",
                      }}
                      value={fromDate}
                    />
                    <label
                      className="form-label"
                      style={{ marginRight: "20px" }}
                    >
                      To Date :
                    </label>
                    <Calendar
                      dateFormat={"dd/mm/yy"}
                      showIcon
                      onChange={handleToChange}
                      style={{ width: "200px", marginBottom: "20px" }}
                      value={toDate}
                    />
                    <Button
                      label="Search"
                      severity="success"
                      title="Search"
                      icon="las la-search"
                      style={{ marginBottom: "20px ", marginLeft: "20px" }}
                      onClick={SearchData}
                    />
                  </div>
                  <AppTable
                    handleActions={handleActions}
                    data={VisitorEntryList}
                    loading={loading}
                    pageConfig={pageConfig}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ConfirmDialog />
      <AppAlert toast={toast} />
      {/* <PrintPass
        passVisible={passVisible}
        setpassVisible={setpassVisible}
        printData={selectedData}
      /> */}
    </>
  );
};
export default VVisitorEntry;
