import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import React, { useState } from "react";
import { Tag } from "primereact/tag";
import { AppProgressSpinner, getSeverity } from "./UtilityComp";
import {
  InputText,
  FilterMatchMode,
  InputSwitch,
} from "../assets/css/prime-library";
import { useHistory } from "react-router-dom";
import { exportServ } from "@/services/ExportService";

const statusBodyTemplate = (rowData, col) => {
  return (
    <div key={rowData[col.name]}>{rowData[col.name] || "-"}</div>
    // <Tag
    //   value={rowData.StatusName}
    //   severity={getSeverity(rowData.StatusName)}
    // ></Tag>
  );
};

const AppTable = (props) => {
  const {
    data,
    pageConfig,
    selectedData,
    setSelectedData,
    globalFilter,
    loading,
    handleActions,
    viewdisabled,
    editdisabled,
    deletedisabled,
    screenPermissions,
  } = props;
  const [globalFilterValue, setGlobalFilterValue] = useState<string>("");
  const routePage = useHistory();
  const [checked, setChecked] = useState(false);

  const [disableVentryDisable, setDisableVentryDisable] = useState(false);

  const disableVisitorEntry = (rowData) => {
    if (routePage) {
      if (
        ["/home/vVisitorEntry", "/home/vVisitorManagement"].includes(
          routePage?.location?.pathname
        )
      ) {
        if (rowData.VisitorTypeId != 36) {
          return true;
        } else {
          return false;
        }
      }
    }
    if (["/home/vVendorRegistration"].includes(routePage.location.pathname)) {
      if (
        rowData.Status == 74 || 
        rowData.Status == 76 ||
        (
          (rowData.CreatedBy != +localStorage["UserId"]) && 
          (+localStorage["DefaultRoleId"] !== 1 && +localStorage["DefaultRoleId"] !== 2)
        )
      ) {
        return true;
      } else {
        return false; 
      }
    }
    if (["/home/vWorkPermit"].includes(routePage.location.pathname)) {
      if (
        rowData.Status == 74 || 
        rowData.Status == 76 ||
        (
          (rowData.CreatedBy != +localStorage["UserId"]) && 
          (+localStorage["DefaultRoleId"] !== 1 && +localStorage["DefaultRoleId"] !== 2)
        ) ||
        rowData.VendorStatus != 75
      ) {
        return true;
      } else {
        return false;
      }
    }
    if (["/home/vRole"].includes(routePage.location.pathname)) {
      if (rowData.IsSystemGenerated == 1 || rowData.IsSystemGenerated == true) {
        return true;
      } else {
        return false;
      }
    }
  };
  const disableDeleteVisitorEntry = (rowData) => {
    if (routePage) {
      if (
        ["/home/vVisitorEntry", "/home/vVisitorManagement"].includes(
          routePage.location.pathname
        )
      ) {
        if (
          rowData.Status == 75 ||
          rowData.Status == 76 ||
          rowData.Status == 74
        ) {
          return true;
        }
      }
      if (["/home/vVendorRegistration"].includes(routePage.location.pathname)) {
        if (
          rowData.Status == 74 || 
          rowData.Status == 121 ||
          (
            (rowData.CreatedBy != +localStorage["UserId"]) && 
            (+localStorage["DefaultRoleId"] !== 1 && +localStorage["DefaultRoleId"] !== 2)
          )
        ) {
          return true;
        } else {
          return false;
        }
      }
      if (["/home/vWorkPermit"].includes(routePage.location.pathname)) {
        if (
          rowData.Status == 74 || 
          rowData.Status == 121 ||
          (
            (rowData.CreatedBy != +localStorage["UserId"]) && 
            (+localStorage["DefaultRoleId"] !== 1 && +localStorage["DefaultRoleId"] !== 2)
          )
        ) {
          return true;
        } else {
          return false;
        }
      }
      if (["/home/vRole"].includes(routePage.location.pathname)) {
        if (rowData.IsSystemGenerated == 1 || rowData.IsSystemGenerated == true) {
          return true;
        } else {
          return false;
        }
      }
      if (["/home/vCheckPointMapping"].includes(routePage.location.pathname)) {
        if (rowData.IsSysGenerated == 1 || rowData.IsSysGenerated == true) {
          return true;
        } else {
          return false;
        }
      }
    }
  };
  const disableApprovalVisitorEntry = (rowData) => {
    if (routePage) {
      if (
        ["/home/vVisitorEntry", "/home/vVisitorManagement"].includes(
          routePage.location.pathname
        )
      ) {
        if (
          rowData.VisitorTypeId == 35 &&
          rowData.IsAppointmentBooking == false &&
          rowData.Status == 74
        ) {
          return false;
        } else {
          return true;
        }
      }
      if (["/home/vVendorRegistration"].includes(routePage.location.pathname)) {
        if (
          // (rowData.DisableApprove == 1 && rowData.DisableInProg == 1) ||
          rowData.Status == 75 ||
          rowData.Status == 76 ||
          rowData.Status == 121
        ) {
          return true;
        } else {
          return false;
        }
      }
      if (["/home/vWorkPermit"].includes(routePage.location.pathname)) {
        if (
          rowData.Status == 75 ||
          rowData.Status == 76 ||
          rowData.Status == 121
          // || rowData.PrimaryUserId != +localStorage["UserId"]
        ) {
          return true;
        } else {
          return false;
        }
      }
    }
  };
  const disablePrintVisitorEntry = (rowData) => {
    if (routePage) {
      if (
        ["/home/vVisitorEntry", "/home/vVisitorManagement"].includes(
          routePage?.location?.pathname
        )
      ) {
        if (rowData.Status == 73) {
          return false;
        }

        if ([65, 66].includes(rowData.VisitorTypeId)) {
          return true;
        }
      }
    }
  };

  const actionBodyTemplate: any = (rowData) => {
    return (
      <div className="action-btn">
        <React.Fragment>
          {pageConfig.tableActions.map((item) => {
            return (
              (item.name === "view" && (
                <Button
                  label=""
                  title="View"
                  icon="pi pi-eye"
                  className="mr-2 p-1"
                  disabled={viewdisabled ? viewdisabled : false}
                  onClick={() =>
                    handleActions.view({ data: rowData, isView: true })
                  }
                />
              )) ||
              (item.name === "edit" && (
                <Button
                  label=""
                  title="Edit"
                  icon="pi pi-pencil"
                  className="mr-2 p-1 p-button-success"
                  disabled={
                    (editdisabled ? editdisabled : false) ||
                    disableVisitorEntry(rowData)
                  }
                  onClick={() =>
                    handleActions.edit({ data: rowData, isView: false })
                  }
                />
              )) ||
              (item.name === "delete" && (
                <Button
                  label=""
                  severity="danger"
                  icon="pi pi-trash"
                  title="Delete"
                  className="mr-2 p-1"
                  disabled={
                    (deletedisabled ? deletedisabled : rowData.Status == 2) ||
                    disableDeleteVisitorEntry(rowData)
                  }
                  onClick={() =>
                    handleActions.delete({ data: rowData, isView: false })
                  }
                />
              )) ||
              (item.name === "print" && (
                <Button
                  label=""
                  severity="warning"
                  icon="pi pi-print"
                  title="Print"
                  className="mr-2 p-1"
                  disabled={disablePrintVisitorEntry(rowData)}
                  onClick={() =>
                    handleActions.print({ data: rowData, isView: false })
                  }
                />
              )) ||
              (item.name === "self_approval" && (
                <Button
                  label=""
                  severity="info"
                  icon="pi pi-check-square"
                  title="Self Approval"
                  className="mr-2 p-1"
                  disabled={disableApprovalVisitorEntry(rowData)}
                  onClick={() => {
                    handleActions.approval({ data: rowData, isView: false });
                  }}
                />
              )) ||
              (item.name === "approval" && (
                <Button
                  label=""
                  severity="info"
                  icon="pi pi-check"
                  title="Approval"
                  className="mr-2 p-1"
                  disabled={disableApprovalVisitorEntry(rowData)}
                  onClick={() => {
                    handleActions.approve({ data: rowData, isView: false });
                  }}
                />
              )) ||
              (item.name === "reject" && (
                <Button
                  label=""
                  severity="danger"
                  icon="pi pi-times-circle"
                  title="Reject"
                  className="mr-2 p-1"
                  disabled={disableApprovalVisitorEntry(rowData)}
                  onClick={() => {
                    handleActions.reject({ data: rowData, isView: false });
                  }}
                />
              ))
            );
          })}
        </React.Fragment>
      </div>
    );
  };

  const additionalIcon = (rowData) => {
    return (
      <div className="action-btn">
        <React.Fragment>
          {pageConfig &&
            pageConfig.hasOwnProperty("tableAddActions") &&
            pageConfig?.tableAddActions.map((item) => {
              return (
                item.name === "print" && (
                  <Button
                    label=""
                    severity="warning"
                    icon="pi pi-print"
                    title={item.title}
                    className="mr-2 p-1"
                    disabled={rowData.Status == 2}
                    onClick={() =>
                      handleActions.print({
                        data: rowData,
                        isView: false,
                        rowItem: item,
                      })
                    }
                  />
                )
              );
            })}
        </React.Fragment>
      </div>
    );
  };
  const additionalAutoAppIcon = (rowData) => {
    return (
      <div className="action-btn">
        <React.Fragment>
          {pageConfig &&
            pageConfig.hasOwnProperty("tableAddActions") &&
            pageConfig?.tableAddActions.map((item) => {
              return (
                item.name === "is_auto_approve" && (
                  <InputSwitch
                    checked={rowData.IsAutoApprove}
                    onChange={(e) => {
                      setChecked(e.value);
                      handleActions.isAutoApprove({
                        data: e.value,
                        rowData,
                        isView: false,
                      });
                    }}
                  />
                )
              );
            })}
        </React.Fragment>
      </div>
    );
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
        {!routePage.location.pathname.includes(paths) &&
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
        ) : null}
      </div>
    );
  };

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const loadActionContent = (rowData) => {
    return actionBodyTemplate(rowData);
  };

  const loadContent: any = (rowData, col) => {
    if (col.badge) {
      return statusBodyTemplate(rowData, col);
    }
    if (col.action) {
      if (col.colOn === "print") {
        return additionalIcon(rowData);
      } else {
        return additionalAutoAppIcon(rowData);
      }
    }
    if (!col.badge || !col.action) {
      return <>{rowData[col.name]}</>;
    }
  };


  return (
    <>
      {loading ? (
        <AppProgressSpinner />
      ) : (
        <DataTable
          value={data}
          showGridlines
          filters={filters}
          selection={selectedData}
          emptyMessage={"No Data Found"}
          style={{
            minWidth: "50rem",
          }}
          onSelectionChange={(e) => setSelectedData(e.value)}
          // dataKey="id"
          paginator={pageConfig.tablePagination}
          rows={pageConfig.tableRows}
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Entries"
          paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
          globalFilter={globalFilter}
          header={TableHeader}
        >
          {pageConfig.tableAction ? (
            <Column
              field={"Action"}
              header={"Action"}
              style={pageConfig.tableActionStyle}
              body={loadActionContent}
              headerClassName="text-center"
            ></Column>
          ) : null}
          {pageConfig.tableCheckSelection ? (
            <Column selectionMode="multiple" exportable={false}></Column>
          ) : null}

          {pageConfig.tableColumns.length > 0 &&
            pageConfig.tableColumns.map((col, ind) => {
              return (
                <Column
                  key={ind}
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
      )}
    </>
  );
};

export default AppTable;
