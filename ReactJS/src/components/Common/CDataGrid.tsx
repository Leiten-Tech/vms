import {
  Button,
  Checkbox,
  Column,
  InputText,
  React,
} from "@/assets/css/prime-library";
import { DataTable } from "primereact/datatable";
import { useState } from "react";

export const CDataGrid = (props) => {
  const { dataGrid } = props;
  const [expandedRows, setExpandedRows] = useState(null);

  const loadContent: any = (rowData, rowIndex, col) => {
    // if (col.badge) {
    //   return statusBodyTemplate(rowData, col);
    // }
    if (col.action) {
      if (col.colOn === "is_incharge") {
        return additionalIcon(rowData, rowIndex, col);
      }
      if (col.colOn === "generate_pass") {
        return additionalPrintIcon(rowData, rowIndex, col);
      }
      if (col.colOn === "is_working") {
        return additionalIcon(rowData, rowIndex, col);
      }

      if (col.colOn === "docs") {
        return dataGrid.filesContent(rowData);
      }
      if (col.colOn === "validity") {
        if (rowData["ValidFrom"] != null && rowData["ValidTo"] != null) {
          const validFrom =
            typeof rowData["ValidFrom"] === "string"
              ? new Date(rowData["ValidFrom"])
              : rowData["ValidFrom"];
          const validTo =
            typeof rowData["ValidTo"] === "string"
              ? new Date(rowData["ValidTo"])
              : rowData["ValidTo"];

          return (
            <>
              {validFrom.toLocaleDateString("en-GB", {
                day: "2-digit",
                year: "numeric",
                month: "2-digit",
              }) +
                " - " +
                validTo.toLocaleDateString("en-GB", {
                  day: "2-digit",
                  year: "numeric",
                  month: "2-digit",
                })}
            </>
          );
        }
      }
    }
    if ((!col.badge || !col.action) && typeof rowData[col.name] != "object") {
      return <>{rowData[col.name]}</>;
    }
  };

  const additionalIcon = (rowData, rowIndex, col) => {
    return (
      <div className="action-btn">
        <React.Fragment>
          {dataGrid?.pageConfig &&
            dataGrid?.pageConfig.hasOwnProperty("tableAddActions") &&
            dataGrid?.pageConfig?.tableAddActions.map((item) => {
              switch (item.name) {
                case "is_incharge":
                  return (
                    <div className="flex m-auto" key={item.name}>
                      <Checkbox
                        inputId={"IsIncharge?"}
                        name={"IsIncharge"}
                        checked={rowData.IsIncharge == 1 ? true : false}
                        onChange={(e) =>
                          dataGrid?.handleInchargeChange(
                            e,
                            rowData,
                            rowIndex,
                            col
                          )
                        }
                        disabled={dataGrid?.isView ? true : false}
                      />
                    </div>
                  );

                default:
                  return null;
              }
            })}
        </React.Fragment>
      </div>
    );
  };
  const additionalPrintIcon = (rowData, rowIndex, col) => {
    return (
      <div className="action-btn">
        <React.Fragment>
          {dataGrid?.pageConfig &&
            dataGrid?.pageConfig.hasOwnProperty("tableAddActions") &&
            dataGrid?.pageConfig?.tableAddActions.map((item) => {
              switch (item.name) {
                case "generate_pass":
                  return (
                    <div className="flex m-auto" key={item.name}>
                      <Button
                        label=""
                        id="print"
                        severity="warning"
                        icon="pi pi-print"
                        title="Print"
                        className="mr-2 p-1"
                        disabled={dataGrid?.disablePassPrint(rowData)}
                        onClick={(event) =>
                          dataGrid?.handlePassPrint(rowData, event, "print")
                        }
                      />
                      <Button
                        label=""
                        id="print_email"
                        severity="info"
                        icon="pi pi-envelope"
                        title="Mail Pass"
                        className="mr-2 p-1"
                        disabled={
                          dataGrid?.disablePassPrint(rowData) ||
                          (dataGrid?.workBtnDisable?.mailDisable &&
                            dataGrid?.workBtnDisable?.workerDtlId ==
                              rowData.WPWorkerDetailId)
                        }
                        onClick={(event) =>
                          dataGrid?.handlePassPrint(
                            rowData,
                            event,
                            "print_email"
                          )
                        }
                      />
                      <Button
                        label=""
                        id="print_wa"
                        severity="success"
                        icon="pi pi-whatsapp"
                        title="WhatsApp Pass"
                        className="mr-2 p-1"
                        disabled={
                          dataGrid?.disablePassPrint(rowData) ||
                          (dataGrid?.workBtnDisable?.waDisable &&
                            dataGrid?.workBtnDisable?.workerDtlId ==
                              rowData.WPWorkerDetailId)
                        }
                        onClick={(event) =>
                          dataGrid?.handlePassPrint(rowData, event, "print_wa")
                        }
                      />
                    </div>
                  );

                default:
                  return null;
              }
            })}
        </React.Fragment>
      </div>
    );
  };

  const actionBodyTemplate: any = (rowData, colItem) => {
    return (
      <div className="action-btn">
        <React.Fragment>
          <Button
            label=""
            title="Add"
            icon="pi pi-plus"
            className="mr-2 p-1 p-button-success"
            disabled={dataGrid?.isView}
            onClick={() => dataGrid?.editAction(rowData, colItem)}
          />
          <Button
            label=""
            severity="danger"
            icon="pi pi-trash"
            title="Delete"
            className="mr-2 p-1"
            disabled={dataGrid?.isView}
            onClick={() => dataGrid?.delAction(rowData, colItem)}
          />
        </React.Fragment>
      </div>
    );
  };
  const splitName = (data) => {
    return data?.split("_")[1];
  };
  const fContent = (rowData) => {
    return (
      <a
        className="text-blue-600 underline"
        target="_blank"
        href={rowData?.FileBlobUrl}
      >
        {splitName(rowData?.FileName)}
      </a>
    );
  };
  const rowExpansionTemplate = (data) => {
    return (
      <div>
        <DataTable value={data.WorkerDocs || data.WpWorkerDocs}>
          {/* <Column field="id" header="Id" sortable></Column> */}
          <Column field="DocTypeName" header="Document Type"></Column>
          <Column field="DocumentNo" header="Document No"></Column>
          <Column
            field="DocumentUrl"
            header="Document URL"
            body={fContent}
          ></Column>
        </DataTable>
      </div>
    );
  };

  const onRowExpand = (event) => {};

  const textEditor = (options) => {
    return (
      <InputText
        type="text"
        value={options.value}
        className="w-10rem"
        onChange={(e) => options.editorCallback(e.target.value)}
        onKeyDown={(e) => e.stopPropagation()}
      />
    );
  };
  const cellEditor = (options) => {
    return textEditor(options);
  };

  return (
    <DataTable
      value={dataGrid?.gridData}
      showGridlines
      paginator
      filterDisplay="menu"
      globalFilterFields={dataGrid?.pageConfig?.tableColumns}
      emptyMessage="No Data found."
      rows={50}
      rowsPerPageOptions={[5, 10, 25, 50, 100]}
      tableStyle={{ minWidth: "50rem" }}
      dataKey={dataGrid?.dataKey}
    >
      {dataGrid?.pageConfig?.tableGridSelMode ? (
        <Column
          selectionMode="multiple"
          exportable={false}
          className={dataGrid?.isView ? "p-disabled" : ""}
        ></Column>
      ) : null}
      {dataGrid?.pageConfig?.tableAction ? (
        <Column
          field={"Action"}
          header={"Action"}
          style={dataGrid?.pageConfig?.tableActionStyle}
          body={(rowData, rowIndex) => actionBodyTemplate(rowData, rowIndex)}
          headerClassName="text-center"
        ></Column>
      ) : null}

      {dataGrid?.pageConfig?.tableColumns.length > 0 &&
        dataGrid?.pageConfig?.tableColumns.map((col) => {
          return (
            <Column
              key={col.name}
              field={col.name}
              header={col.title}
              sortable={col.sort}
              className="wrap-cell"
              style={col.colStyle}
              body={(rowData, rowIndex) => loadContent(rowData, rowIndex, col)}
              editor={(options) => cellEditor(options)}
            ></Column>
          );
        })}
      {/* <Column
        field={"Action"}
        header={"Action"}
        style={{
          textAlign: "center",
        }}
        body={dataGrid?.actionBodyTemplate}
        headerClassName="text-center"
      ></Column>
      <Column sortable field="WorkerName" header="Visitor Name"></Column>
      <Column sortable field="WorkerMailID" header="Worker Mail ID"></Column>
      <Column sortable field="WorkerPhoneNo" header="Phone No"></Column>
      <Column
        sortable
        field="WorkerDocs"
        header="Worker Docs"
        body={dataGrid?.filesContent}
      ></Column>
      <Column sortable field="WorkerStatus" header="Worker Status"></Column> */}
    </DataTable>
  );
};
