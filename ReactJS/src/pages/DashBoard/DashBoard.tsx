import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  Button,
  Calendar,
  Chart,
  Column,
  DataTable,
  Dialog,
  FilterMatchMode,
  InputText,
  Menu,
  Sidebar,
  Toast,
} from "../../assets/css/prime-library";
import { dashOnClick, fetch } from "@/redux/slices/DashBoard/DashBoardSlice";
import { useDispatch } from "react-redux";
import { maxHeight, pageLoadScript } from "@/assets/js/common-utilities";
import { IMAGES } from "@/assets/images/Images";
import { object } from "yup";
import { useHistory } from "react-router-dom";
import { MenuItem } from "primereact/menuitem";
import AppAlert from "@/alert/alert";
import { decodeToken } from "@/utils/utilFunc";
import { EncryptData } from "@/redux/slices/master/workFlowSlice";

export const DashBoardDetails = (props) => {
  const {
    visible,
    handleClosePop,
    data,
    filters,
    TableHeader,
    globalFilter,
    loadContent,
    viewList,
  } = props;
  return (
    <Dialog
      visible={visible}
      onHide={() => handleClosePop()}
      className="preview-container"
    >
      <DataTable
        value={data}
        showGridlines
        filters={filters}
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
        globalFilter={globalFilter}
        header={TableHeader}
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
  );
};

const Dashboard = () => {
  const currentDate = new Date();
  // const sixDaysAgo = new Date(currentDate);
  // sixDaysAgo.setDate(currentDate.getDate() - 6);
  const [dates, setDates] = useState<any>([currentDate, currentDate]);
  const [visitorContractorLine, setvisitorContractorLine] = useState({});
  const [chartOptions1, setchartOptions1] = useState({});
  const [povPieData, setpovPieData] = useState({});
  const [chartOptions2, setChartOptions2] = useState({});
  const [visitorContractorpiedata, setvisitorContractorpiedata] = useState({});
  const dispatch: any = useDispatch();
  const toast = useRef<Toast>(null);
  const [allData, setAllData] = useState<any>();
  const [visitorList, setVisitorList] = useState([]);
  const [countList, setCountList] = useState<any>({});
  const [imageUrl, setImageUrl] = useState<string>(IMAGES.NO_DATA);
  const [showChart, setShowChart] = useState(false);
  const [showVisCon, setShowVisCon] = useState(false);
  const [chartData, setChartData] = useState({});
  const [chartDataPOV, setChartDataPOV] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  const [headerList, setHeaderList] = useState([]);
  const [chartOptionsPOV, setChartOptionsPOV] = useState({});
  const [chartType, setChartType] = useState("bar");
  const [chartTypePOV, setChartTypePOV] = useState("pie");
  const menuRight = useRef<Menu>(null);
  const menuRightPOV = useRef<Menu>(null);
  const route = useHistory();
  //chart config
  const documentStyle = getComputedStyle(document.documentElement);
  const documentStyle2 = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue("--text-color");
  const textColorSecondary = documentStyle.getPropertyValue(
    "--text-color-secondary"
  );
  const surfaceBorder = documentStyle.getPropertyValue("--surface-border");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState<string>("");
  const [globalFilter, setGlobalFilter] = useState();
  const [visible, setVisible] = useState<boolean>(false);
  const [data, setData] = useState([]);
  const [viewList, setViewList] = useState([]);
  const PlantId = +localStorage["PlantId"];
  const CompanyId = +localStorage["CompanyId"];
  const GateId = +localStorage["GateId"];

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
        {/* {!routePage.location.pathname.includes(paths) &&
        screenPermissions?._Print ? (
          <div className="flex align-items-center justify-content-end gap-2">
            <div className="action-btn">
              <Button
                type="button"
                icon="pi pi-file-excel"
                title="Export Excel"
                severity="success"
                onClick={() => pageConfig.tableExport("excel")}
                data-pr-tooltip="XLS"
              />
              <Button
                type="button"
                icon="pi pi-file-pdf"
                title="Export PDF"
                severity="warning"
                onClick={() => pageConfig.tableExport("pdf")}
                data-pr-tooltip="PDF"
              />
            </div>
          </div>
        ) : null} */}
      </div>
    );
  };

  const statusBodyTemplate = (rowData) => {
    return <div key={rowData.StatusName}>{rowData.StatusName}</div>;
  };

  const loadContent: any = (rowData, col) => {
    if (col.badge) {
      return statusBodyTemplate(rowData);
    }
    if (!col.badge || !col.action) {
      return <>{rowData[col.name]}</>;
    }
  };
  const handleClosePop = () => {
    setVisible(false);
  };
  const defoptions = {
    maintainAspectRatio: false,
    aspectRatio: 0.6,
    plugins: {
      legend: {
        labels: {
          boxWidth: 20,
          boxHeight: 20,
          color: textColor,
        },
        position: "top",
      },
    },
    scales: {
      x: {
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: surfaceBorder,
        },
      },
      y: {
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: surfaceBorder,
        },
      },
    },
  };

  const pieDonOption = {
    plugins: {
      legend: {
        position: "right",
        align: "center",
        // rtl:true,
        labels: {
          boxWidth: 20,
          boxHeight: 20,
          paddingLeft: 20,
        },
      },
    },
  };

  const baroptions = {
    maintainAspectRatio: false,
    aspectRatio: 0.8,
    plugins: {
      legend: {
        labels: {
          fontColor: textColor,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: textColorSecondary,
          font: {
            weight: 500,
          },
        },
        grid: {
          display: false,
          drawBorder: false,
        },
      },
      y: {
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: surfaceBorder,
          drawBorder: false,
        },
      },
    },
  };

  // const itemsDot: MenuItem[] = [
  //     { label: 'Download as PDF' },
  //     { label: 'Download as Excel' }
  // ];

  const itemsChart: MenuItem[] = [
    {
      id: "bar",
      label: "Bar Chart",
      command: (e) => {
        handleChartChange(e);
      },
    },
    {
      id: "pie",
      label: "Pie Chart",
      command: (e) => {
        handleChartChange(e);
      },
    },
    {
      id: "line",
      label: "Line Chart",
      command: (e) => {
        handleChartChange(e);
      },
    },
    {
      id: "doughnut",
      label: "Donut Chart",
      command: (e) => {
        handleChartChange(e);
      },
    },
  ];
  const itemsChartPOV: MenuItem[] = [
    {
      id: "pie",
      label: "Pie Chart",
      command: (e) => {
        handleChartChangePOV(e);
      },
    },
    {
      id: "doughnut",
      label: "Donut Chart",
      command: (e) => {
        handleChartChangePOV(e);
      },
    },
  ];

  useEffect(() => {
    pageLoadScript();
  });
  useEffect(() => {
    fetchVisitors(dates);
  }, []);

  const handleChartChange = (e) => {
    setChartType(e.item.id);
  };
  const handleChartChangePOV = (e) => {
    setChartTypePOV(e.item.id);
  };

  const fetchVisitorEntry = () => {
    route.push("/home/vVisitor");
  };

  const fetchCheckinCheckOut = () => {
    route.push("/home/vCheckInOut");
  };
  const generateLineChart = (
    viscountobj,
    concountobj,
    invoicedcountobj,
    tripcountobj,
    Workpermitcountobj
  ) => {
    let tempVisCountObj = { ...viscountobj };
    let tempConCountObj = { ...concountobj };
    delete tempVisCountObj.Count;
    delete tempConCountObj.Count;
    const data = {
      labels: Object.keys(tempVisCountObj),
      datasets: [
        {
          label: "Visitors",
          data: Object.values(tempVisCountObj),
          fill: false,
          borderColor: documentStyle.getPropertyValue("--blue-500"),
          tension: 0.4,
        },

        {
          label: "Contractors",
          data: Object.values(tempConCountObj),
          fill: false,
          borderColor: documentStyle.getPropertyValue("--pink-500"),
          tension: 0.4,
        },
        // {
        //   label: "Invoiced Based",
        //   data: Object.values(invoicedcountobj),
        //   fill: false,
        //   borderColor: documentStyle.getPropertyValue("--yellow-500"),
        //   tension: 0.4,
        // },
        {
          label: "Vehicle Trip Based",
          data: Object.values(tripcountobj),
          fill: false,
          borderColor: documentStyle.getPropertyValue("--purple-500"),
          tension: 0.4,
        },
        {
          label: "Work Permit",
          data: Object.values(Workpermitcountobj),
          fill: false,
          borderColor: documentStyle.getPropertyValue("--yellow-500"),
          tension: 0.4,
        },
      ],
    };
    setChartOptions(defoptions);
    setChartData(data);
  };
  const generatePieChartPOV = (allData, documentStyle2) => {
    if (allData) {
      setChartOptionsPOV(pieDonOption);
      const allValuesAreZero = Object.values(allData.PurposeOfVisitList).every(
        (value) => value === 0
      );
      if (!allData.PurposeOfVisitList || allValuesAreZero) {
        setChartDataPOV({});
      } else {
        const data2 = {
          labels: Object.keys(allData.PurposeOfVisitList),
          datasets: [
            {
              data: Object.values(allData.PurposeOfVisitList),
              backgroundColor: [
                documentStyle2.getPropertyValue("--blue-500"),
                documentStyle2.getPropertyValue("--yellow-500"),
                documentStyle2.getPropertyValue("--green-500"),
                documentStyle2.getPropertyValue("--red-500"),
                documentStyle2.getPropertyValue("--purple-500"),
                documentStyle2.getPropertyValue("--orange-500"),
                documentStyle2.getPropertyValue("--pink-500"),
                documentStyle2.getPropertyValue("--gray-500"),
                documentStyle2.getPropertyValue("--red-400"),
                documentStyle2.getPropertyValue("--cyan-500"),
                documentStyle2.getPropertyValue("--teal-500"),
                documentStyle2.getPropertyValue("--orange-400"),
                documentStyle2.getPropertyValue("--indigo-500"),
                documentStyle2.getPropertyValue("--cyan-600"),
                documentStyle2.getPropertyValue("--yellow-300"),
                documentStyle2.getPropertyValue("--blue-400"),
              ],
              hoverBackgroundColor: [
                documentStyle2.getPropertyValue("--blue-400"),
                documentStyle2.getPropertyValue("--yellow-400"),
                documentStyle2.getPropertyValue("--green-400"),
                documentStyle2.getPropertyValue("--red-400"),
                documentStyle2.getPropertyValue("--purple-400"),
                documentStyle2.getPropertyValue("--orange-400"),
                documentStyle2.getPropertyValue("--pink-400"),
                documentStyle2.getPropertyValue("--gray-400"),
                documentStyle2.getPropertyValue("--red-300"),
                documentStyle2.getPropertyValue("--cyan-400"),
                documentStyle2.getPropertyValue("--teal-400"),
                documentStyle2.getPropertyValue("--orange-300"),
                documentStyle2.getPropertyValue("--indigo-400"),
                documentStyle2.getPropertyValue("--cyan-500"),
                documentStyle2.getPropertyValue("--yellow-200"),
                documentStyle2.getPropertyValue("--blue-300"),
              ],
            },
          ],
        };
        setChartDataPOV(data2);
      }
    }
  };
  const generatePieChart = (
    viscountobj,
    concountobj,
    tempviscountobj,
    tempconcountobj,
    tempinvoicedcountobj,
    temptripcountobj,
    Workpermitcountobj,
    tempWorkpermitcountobj,
    documentStyle2
  ) => {
    setChartOptions(pieDonOption);
    // delete viscountobj.Count;
    // delete concountobj.Count;
    viscountobj = { ...countList };
    setCountList(viscountobj);
    let ListA = [
      { Type: "Visitors", Count: tempviscountobj },
      { Type: "Contractors", Count: tempconcountobj },
      // { Type: "Invoiced Based", Count: tempinvoicedcountobj },
      { Type: "Vehicle Trip Based", Count: temptripcountobj },
      { Type: "Work Permit", Count: tempWorkpermitcountobj },
    ];
    const piedata = {
      labels: ListA.map((x) => x.Type),
      datasets: [
        {
          data: ListA.map((x) => x.Count),
          backgroundColor: [
            documentStyle2.getPropertyValue("--blue-500"),
            documentStyle2.getPropertyValue("--pink-500"),
            documentStyle2.getPropertyValue("--yellow-500"),
            documentStyle2.getPropertyValue("--purple-500"),
          ],
          hoverBackgroundColor: [
            documentStyle2.getPropertyValue("--blue-400"),
            documentStyle2.getPropertyValue("--pink-400"),
            documentStyle2.getPropertyValue("--yellow-400"),
            documentStyle2.getPropertyValue("--purple-400"),
          ],
        },
      ],
    };
    setChartData(piedata);
  };

  const generateBarChart = (allData, viscountobj) => {
    let tempVisCount = { ...viscountobj };
    setCountList(viscountobj);

    delete tempVisCount.Count;

    const bardata = {
      labels: Object.keys(tempVisCount),
      datasets: [
        {
          label: "One Day Visitor",
          backgroundColor: documentStyle.getPropertyValue("--blue-500"),
          borderColor: documentStyle.getPropertyValue("--blue-500"),
          data: Object.values(allData.VisitorCountList),
        },
        {
          label: "Extented Visitor",
          backgroundColor: documentStyle.getPropertyValue("--pink-500"),
          borderColor: documentStyle.getPropertyValue("--pink-500"),
          data: Object.values(allData.ContractorCountList),
        },
        // {
        //   label: "Invoiced Based",
        //   backgroundColor: documentStyle.getPropertyValue("--yellow-500"),
        //   borderColor: documentStyle.getPropertyValue("--yellow-500"),
        //   data: Object.values(allData.InvoicedCountList),
        // },
        {
          label: "Vehicle Trip Based",
          backgroundColor: documentStyle.getPropertyValue("--yellow-500"),
          borderColor: documentStyle.getPropertyValue("--yellow-500"),
          data: Object.values(allData.VehicleTripCountList),
        },
        {
          label: "Vendor Registration",
          backgroundColor: documentStyle.getPropertyValue("--purple-500"),
          borderColor: documentStyle.getPropertyValue("--purple-500"),
          data: Object.values(allData.WorkpermitCountList),
        },
      ],
    };
    setChartData(bardata);
    setChartOptions(baroptions);
  };

  useEffect(() => {});

  const handleHeaderClick = (stsId) => {
    let dashboard = {};
    dashboard = {
      Taskname: "SEARCHINITIALIZE",
      PlantId: +localStorage["PlantId"],
      CompanyId: +localStorage["CompanyId"],
      UserId: +localStorage["UserId"],
      RoleId: +localStorage["DefaultRoleId"],
      Header: 0,
      FromDate: dates[0].toLocaleDateString("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
      ToDate: dates[1].toLocaleDateString("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
      StsId: stsId,
    };

    var result = dispatch(dashOnClick(dashboard));
    result
      .then((res) => {
        if (res.payload.transtatus.result) {
          // Initialize arrays to hold keys and values
          const keysArray: string[] = [];
          const valuesArray: any[][] = [];

          // Iterate over each object in the data array
          res.payload.ViewList.forEach((item, index) => {
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
              avatar: false,
              badge: false,
              colStyle: { minWidth: "10rem" },
            };
          });

          setViewList(objectsArray);
          setData(res.payload.ViewList);
        } else {
          toast.current?.show({
            severity: "error",
            detail: "Error",
            summary: res.payload.transtatus.lstErrorItem[0].Message,
          });
        }
      })
      .catch((error) => {
        toast.current?.show({
          severity: "error",
          detail: "Error",
          summary: error,
        });
      });
  };
  const fetchVisitors = (dates) => {
    let dashboard = {};
    dashboard = {
      Taskname: "SEARCHINITIALIZE",
      PlantId: +localStorage["PlantId"],
      UserId: +localStorage["UserId"],
      CompanyId: +localStorage["CompanyId"],
      RoleId: +localStorage["DefaultRoleId"],
      Header: 0,
      FromDate: dates[0].toLocaleDateString("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
      ToDate: dates[1].toLocaleDateString("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
    };

    var result = dispatch(fetch(dashboard));
    result
      .then((res) => {
        if (res.payload.transtatus.result) {
          setVisitorList(res.payload.VisitorList);
          setAllData(res.payload);
          generatePieChartPOV(allData, documentStyle2);
          let headerData = res.payload.VisitorList;
          let convertedObj = [];

          for (const key in headerData[0]) {
            if (headerData[0].hasOwnProperty(key)) {
              const count = headerData[0][key];
              let text = "";
              let description = "";
              let icon = "";
              let iconCol = "";
              let stsId = 0;
              let Path = "";

              switch (key) {
                case "Individual":
                  stsId = 77;
                  text = "One Day Pass";
                  icon = "las la-user-clock";
                  iconCol = "color01";
                  description = "One Day Pass Issued";
                  Path = "/home/vVisitor";
                  break;
                case "Contractor":
                  stsId = 78;
                  text = "Extended Pass";
                  icon = "las la-users";
                  iconCol = "color04";
                  description = "Extended Pass Issued";
                  Path = "/home/vVisitor";
                  break;
                case "checkedIn":
                  stsId = 79;
                  text = "CheckedIn";
                  icon = "las la-sign-out-alt";
                  iconCol = "color02";
                  description = "Checked In Count";
                  Path = "/home/vCheckInOut";
                  break;
                case "checkedOut":
                  stsId = 80;
                  text = "checkedOut";
                  icon = "las la-sign-out-alt";
                  iconCol = "color03";
                  description = "Checked Out Count";
                  Path = "/home/vCheckInOut";
                  break;

                case "GateActive":
                  stsId = 81;
                  text = "GateActive";
                  icon = "las la-dungeon";
                  iconCol = "color02";
                  description = "Active Gates";
                  // Path = "/home/vCheckInOut";
                  break;
                // case "InvoiceBased":
                //   stsId = 82;
                //   text = "InvoiceBased";
                //   icon = "las la-file-invoice-dollar";
                //   iconCol = "color03";
                //   description = "Invoices";
                //   // Path = "/home/vCheckInOut";
                //   break;
                case "SecurityLoged":
                  stsId = 83;
                  text = "SecurityLoged";
                  icon = "las la-shield-alt";
                  iconCol = "color04";
                  description = "No Of Security Logged";
                  // Path = "/home/vCheckInOut";
                  break;
                case "VehicleTripBased":
                  stsId = 84;
                  text = "VehicleTripBased";
                  icon = "las la-taxi";
                  iconCol = "color02";
                  description = "Vehicle Entry";
                  // Path = "/home/vCheckInOut";
                  break;
                case "VisitUser":
                  stsId = 85;
                  text = "VisitUser";
                  icon = "las la-user";
                  iconCol = "color03";
                  description = "Visitors Appointment";
                  // Path = "/home/vCheckInOut";
                  break;
                case "approved":
                  stsId = 86;
                  text = "approved";
                  icon = "las la-check-circle";
                  iconCol = "color01";
                  description = " Visitors Appointment";
                  // Path = "/home/vCheckInOut";
                  break;
                case "pendingApproval":
                  stsId = 87;
                  text = "pendingApproval";
                  icon = "las la-pause-circle";
                  iconCol = "color04";
                  description = "Pending Approvals";
                  // Path = "/home/vCheckInOut";
                  break;
                case "InsideVisitor":
                  stsId = 88;
                  text = "InsideVisitor";
                  icon = "las la-pause-circle";
                  iconCol = "color04";
                  description = "Visitors inside the company";
                  // Path = "/home/vCheckInOut";
                  break;
                case "checkedInAll":
                  stsId = 89;
                  text = "checkedInAll";
                  icon = "las la-sign-out-alt";
                  iconCol = "color02";
                  description = "Checked In Count";
                  Path = "/home/vCheckInOut";
                  break;
                case "checkedOutAll":
                  stsId = 90;
                  text = "checkedOutAll";
                  icon = "las la-sign-out-alt";
                  iconCol = "color03";
                  description = "Checked Out Count";
                  Path = "/home/vCheckInOut";
                  break;
              }

              convertedObj.push({
                count,
                stsId,
                text,
                icon,
                iconCol,
                description,
                Path,
              });
            }
          }
          convertedObj.push({
            stsId: 100,
            text: "Appoinment",
            icon: "las la-sign-out-alt",
            iconCol: "color03",
            description: "Checked Out Count",
            Path: "/home/cAppointment",
          });

          setHeaderList(convertedObj);
        } else {
          toast.current?.show({
            severity: "error",
            detail: "Error",
            summary: res.payload.transtatus.lstErrorItem[0].Message,
          });
        }
      })
      .catch((error) => {
        toast.current?.show({
          severity: "error",
          detail: "Error",
          summary: error,
        });
      });
  };

  useEffect(() => {
    if (allData) {
      changeChart();
    }
  }, [allData, chartType]);

  useEffect(() => {
    if (chartTypePOV) {
      generatePieChartPOV(allData, documentStyle2);
    }
  }, [allData, chartTypePOV]);

  const changeChart = () => {
    if (allData) {
      let viscountobj = allData.VisitorCountList;
      let tempviscountobj: number;

      if (viscountobj.hasOwnProperty("Count")) {
        tempviscountobj = viscountobj.Count;
      } else {
        tempviscountobj = countList.Count;
      }
      let concountobj = allData.ContractorCountList;
      let tempconcountobj: number = concountobj.Count;
      let invoicedcountobj = allData.InvoicedCountList;
      let tempinvoicedcountobj: number = invoicedcountobj.Count;
      let tripcountobj = allData.VehicleTripCountList;
      let temptripcountobj: number = tripcountobj.Count;
      let Workpermitcountobj = allData.WorkpermitCountList;
      let tempWorkpermitcountobj: number = Workpermitcountobj.Count;

      switch (chartType) {
        case "bar":
          generateBarChart(allData, viscountobj);
          break;
        case "pie":
          generatePieChart(
            viscountobj,
            concountobj,
            tempviscountobj,
            tempconcountobj,
            tempinvoicedcountobj,
            temptripcountobj,
            Workpermitcountobj,
            tempWorkpermitcountobj,
            documentStyle2
          );
          break;
        case "line":
          generateLineChart(
            viscountobj,
            concountobj,
            invoicedcountobj,
            tripcountobj,
            Workpermitcountobj
          );
          break;
        case "doughnut":
          generatePieChart(
            viscountobj,
            concountobj,
            tempviscountobj,
            tempconcountobj,
            tempinvoicedcountobj,
            temptripcountobj,
            Workpermitcountobj,
            tempWorkpermitcountobj,
            documentStyle2
          );
          break;
        default:
          break;
      }
      if (
        tempviscountobj == 0 &&
        tempconcountobj == 0 &&
        temptripcountobj == 0 &&
        tempinvoicedcountobj == 0 &&
        tempWorkpermitcountobj == 0
      ) {
        setChartData({});
      }
    }
  };

  const handleDateChange = (selectedDate) => {
    const fromDate = new Date(selectedDate.value[0]);
    const sevenDayBefore = new Date(fromDate);
    sevenDayBefore.setDate(fromDate.getDate() + 6);
    let toDate = null;
    // fromDate.setDate(selectedDate.value[0].getDate() - 6);
    if (selectedDate.value[1] != null) {
      toDate = new Date(selectedDate.value[1]);
      if (toDate > sevenDayBefore) {
        toast.current?.show({
          severity: "warn",
          summary: "Warning Message",
          detail: "Please Select Date between 7 days",
        });
        return;
      }
    }
    if (fromDate != null && toDate != null) {
      fetchVisitors([fromDate, toDate]);
      setChartData([fromDate, toDate]);
    }
    setDates([fromDate, toDate]);
  };

  // const handleHeaderData = (stsId) => {
  //
  //   const dashboard = {
  //     Taskname: "SEARCHINITIALIZE",
  //     PlantId: localStorage["PlantId"],
  //     UserId: localStorage["UserId"],
  //     RoleId: localStorage["DefaultRoleId"],
  //     FromDate: dates[0].toLocaleDateString("en-US", {
  //       day: "2-digit",
  //       month: "2-digit",
  //       year: "numeric",
  //     }),
  //     ToDate: dates[1].toLocaleDateString("en-US", {
  //       day: "2-digit",
  //       month: "2-digit",
  //       year: "numeric",
  //     }),
  //   };
  //   const result = dispatch(fetch(dashboard));
  //   result
  //     .then((res) => {
  //       if (res.payload.tranStatus.result) {

  //       }
  //     })
  //     .catch((err) => {
  //
  //     });
  // };
  const ShowDialog = (e: any) => {
    route.push("/home/vVisitor");
    //

    // return (
    //   <>
    //     <a
    //       style={{ color: "blue" }}
    //       onClick={() => {
    //         // setDetailData(e);
    //         // setVisible(true);
    //       }}
    //     >
    //       {e.VisitorName}
    //     </a>
    //   </>
    // );
  };

  const handleAppointment = () => {
    if (
      localStorage.getItem("data_companyList") &&
      localStorage.getItem("data_companyList") != null &&
      localStorage.getItem("data_companyList") != "null"
    ) {
      let decodedTokenVal: any = JSON.parse(
        localStorage.getItem("data_companyList")
      )[0];
      let decPntTokenVal: any = JSON.parse(
        localStorage.getItem("data_LoggedPlant")
      );

      var data = {
        PlantId: PlantId,
        CompanyId: CompanyId,
        GateId: GateId,
        CheckToken: decodedTokenVal.CheckToken,
        PlantCheckToken: decPntTokenVal.CheckToken
      };
      const encryptData = dispatch(EncryptData(JSON.stringify(data)));
      encryptData
        .then((res) => {
          if (
            res.payload.hasOwnProperty("tranStatus") &&
            res.payload.tranStatus.result && 
            res.payload.VisitorEntryHeader != ""
          ) {
            window.open(
              `/home/vAppointment?accessToken=${res.payload.VisitorEntryHeader}`,
              "_blank"
            );
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  return (
    <>
      <div className="page-container">
        <div className="inner-page-container">
          <div className="page-title">
            <div className="grid grid-nogutter">
              <div className="md:col-6">
                <h1>VMS Dashboard</h1>
              </div>
              <div className="md:col-6 text-right">
                <div className="action-btn dashboard-search">
                  View On :&nbsp;
                  <Calendar
                    value={dates}
                    onChange={(e) => handleDateChange(e)}
                    dateFormat={"dd/mm/yy"}
                    selectionMode="range"
                    readOnlyInput
                    maxDate={new Date()}
                  />
                </div>
                {/* <Sidebar
                  visible={true}
                  onHide={() => {}}
                  className="preview-container"
                  fullScreen
                >
                  yhvgtfgh
                </Sidebar> */}
              </div>
            </div>
          </div>
          <div className="form-container scroll-y">
            <div className="grid">
              {headerList &&
                headerList.map((item) => {
                  return item?.stsId != 100 ? (
                    <div
                      className="col-3"
                      onClick={() => handleHeaderClick(item.stsId)}
                    >
                      <div className="white">
                        <div className="widget-body flex">
                          <div className={`${item.iconCol} dashboard-icon`}>
                            <i className={item.icon}></i>
                          </div>
                          <div className="dashboard-count-label">
                            <div className="dashboard-count">
                              {visitorList.map((approve, index) => (
                                <div key={index} style={{ fontSize: "36px" }}>
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
                  ) : (
                    <>
                      <div className="col-3">
                        <div className="white">
                          <div
                            className="widget-body flex cursor-pointer"
                            onClick={handleAppointment}
                          >
                            <div className="dashboard-icon color01">
                              <i className="las la-plus-circle"></i>
                            </div>
                            <div className="dashboard-count-label">
                              <div className="dashboard-count text-3xl">
                                Create Appointment
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* <div className="col-3">
                      <div className="white">
                      <a
                          href={`/home/cVehicleEntry?PlantId=${PlantId}&CompanyId=${CompanyId}`}
                          target="_blank"
                          className="widget-body flex"
                        >
                          <div className="dashboard-icon color01">
                            <i className="las la-plus-circle"></i>
                          </div>
                          <div className="dashboard-count-label">
                            <div className="dashboard-count">
                              Create Vehicle Entry
                            </div>
                          </div>
                        </a>
                      </div>
                    </div> */}
                    </>
                  );
                })}
            </div>
            <div className="grid">
              <div className="col-6">
                <div className="white">
                  <div className="widget-hdr">
                    <div className="sub-title">
                      <div className="grid">
                        <div className="col-8">
                          <h2>Visitor Wise Check IN/Out Details (In No's)</h2>
                        </div>
                        <div className="col-4 text-end">
                          <div className="widget-filter">
                            <div className="filter-container inline-block">
                              <Button
                                onClick={(event) =>
                                  menuRight.current.toggle(event)
                                }
                                title="Choose Chart"
                                aria-haspopup
                              >
                                <i className="las la-chart-bar vertical-align-middle"></i>
                              </Button>
                              <Menu
                                model={itemsChart}
                                popup
                                ref={menuRight}
                                popupAlignment="right"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="widget-body">
                    <div className="card">
                      {chartData && Object.keys(chartData).length > 0 ? (
                        <Chart
                          type={chartType}
                          data={chartData}
                          options={chartOptions}
                          className="chart-height"
                          style={{ height: "520px" }}
                        />
                      ) : (
                        <img
                          src={imageUrl}
                          alt="logo"
                          className="w-full"
                          style={{ maxHeight: "520px" }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="white">
                  <div className="widget-hdr">
                    <div className="sub-title">
                      <div className="grid">
                        <div className="col-8">
                          <h2>
                            Visitor Details Purpose of Visit Wise(In No's)
                          </h2>
                        </div>
                        <div className="col-4 text-end">
                          <div className="widget-filter">
                            <div className="filter-container inline-block">
                              <Button
                                onClick={(event) =>
                                  menuRightPOV.current.toggle(event)
                                }
                                title="Choose Chart"
                                aria-haspopup
                              >
                                <i className="las la-chart-bar vertical-align-middle"></i>
                              </Button>
                              <Menu
                                model={itemsChartPOV}
                                popup
                                ref={menuRightPOV}
                                popupAlignment="right"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="widget-body">
                    <div className="widget-body">
                      <div className="card flex justify-content-center">
                        {chartDataPOV &&
                        Object.keys(chartDataPOV).length > 0 ? (
                          <Chart
                            type={chartTypePOV}
                            data={chartDataPOV}
                            options={chartOptionsPOV}
                            className="chart-full-width"
                            style={{ maxHeight: "500px", width: "600px" }}
                          />
                        ) : (
                          <img
                            src={imageUrl}
                            alt="logo"
                            className="w-full"
                            style={{ maxHeight: "505px" }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <AppAlert toast={toast} />
        <DashBoardDetails
          visible={visible}
          handleClosePop={handleClosePop}
          data={data}
          filters={filters}
          TableHeader={TableHeader}
          globalFilter={globalFilter}
          loadContent={loadContent}
          viewList={viewList}
        />
      </div>
    </>
  );
};

export default Dashboard;
