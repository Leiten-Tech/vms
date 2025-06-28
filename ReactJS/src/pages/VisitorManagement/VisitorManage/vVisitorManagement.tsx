import AppAlert from "@/alert/alert";
import { pageLoadScript } from "@/assets/js/common-utilities";
import AppTable from "@/components/AppTable";
import PageHeader from "@/components/PageHeader";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  changestatus,
  createInit,
  createOrEdit,
  fetch,
} from "@/redux/slices/visitorManagement/visitorentrySlice";
const VVisitorManagement = () => {
  const route = useHistory();
  const toast = useRef<Toast>(null);
  const dispatch: any = useDispatch();
  const [VisitorEntryList, setVisitorEntryList] = useState([]);
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
    };
    var result = dispatch(fetch(obj));
    result
      .then((res) => {
        if (res.payload.tranStatus.result == true) {
          setVisitorEntryList(res.payload.VisitorEntryList);
        } else {
          toast.current?.show({
            severity: "error",
            detail: "Error",
            summary: res.payload.tranStatus.lstErrorItem[0].Message,
          });
        }
      })
      .catch((error) => {
        toast.current?.show({
          severity: "error",
          detail: "Error",
          summary: JSON.stringify(error),
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
          createQuery: "/home/cVisitorManagement",
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
      maxWidth: "8rem",
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
    ],
    tableColumns: [
      {
        title: "Visitor Entry Code",
        name: "VisitorEntryCode",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: { minWidth: "10rem" },
      },
      {
        title: "Visitor Name",
        name: "PersonName",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: {
          minWidth: "16rem",
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
        colStyle: {},
      },
      {
        title: "Created By",
        name: "CreatedbyName",
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
          minWidth: "2rem",
          textAlign: "center",
        },
      },
    ],
  });
  const handleActions = {
    view: (rowData) => {
      const data = {
        VisitorEntryId: rowData.data.VisitorEntryId,
      };
      const dataFetched = dispatch(createInit(data));
      dataFetched
        .then((res) => {
          
          if (res.payload.tranStatus.result == true) {
            route.push("/home/cVisitorEntry");
          }
        })
        .catch((err) => {
          
        });
      dispatch(createOrEdit(rowData));
    },
    edit: (rowData) => {
      const data = {
        VisitorEntryId: rowData.data.VisitorEntryId,
      };
      const dataFetched = dispatch(createInit(data));
      dataFetched
        .then((res) => {
          
          if (res.payload.tranStatus.result == true) {
            route.push("/home/cVisitorEntry");
          }
        })
        .catch((err) => {
          
        });
      dispatch(createOrEdit(rowData));
    },
    delete: (rowData) => {
      const data = {
        VisitorEntryId: rowData.data.VisitorEntryId,
      };
      var result = dispatch(changestatus(data));
      result
        .then((res) => {
          if (res.payload.tranStatus.result == true) {
            toast.current?.show({
              severity: "success",
              detail: "Success Message",
              summary: "Inactivated Successfully.",
            });
            Fetch();
          }
        })
        .catch((error) => {
          toast.current?.show({
            severity: "error",
            detail: "Error",
            summary: JSON.stringify(error),
          });
        });
    },
    print: (rowData) => {
      localStorage.setItem("clickedRowData", JSON.stringify(rowData));
      window.open("/home/print");
    },
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
      <AppAlert toast={toast} />
    </>
  );
};
export default VVisitorManagement;
