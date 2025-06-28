import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import {
  Button,
  Calendar,
  Dropdown,
  FileUpload,
  FilterMatchMode,
} from "@/assets/css/prime-library"; // Make sure the correct import path is used

const AppGridTable = () => {
  const [gridData, setgridData] = useState<any>([
    {
      VisitorEntryBelongingDetailId: 0,
      VisitorEntryId: 0,
      DeviceNo: "",
      DeviceName: "",
      DeviceDoc: "",
      DeviceDate: "",
    },
  ]);

  const [options, setOptions] = useState([
    {
      id: 1,
      MetaSubId: 1,
      MetaSubDescription: "Active",
    },
  ]);

  const handleInputChange = (event, rowData, rowIndex) => {
    const updatedData = [...gridData];
    updatedData[rowIndex.rowIndex][rowIndex.field] = event.target.value;
    setgridData(updatedData);
  };

  const handleDropdownChange = (event, rowData, rowIndex) => {
    const updatedData = [...gridData];
    updatedData[rowIndex.rowIndex][rowIndex.field] = event.target.value;
    setgridData(updatedData);
  };

  const handleFileChange = (event, rowData, rowIndex) => {
    const file = event.files[0];
    const updatedRows = [...gridData];
    updatedRows[rowIndex.rowIndex][rowIndex.field] = file;
    setgridData(updatedRows);
  };

  useEffect(() => {
    
  }, [gridData]);

  const textEditor = (rowData, rowIndex) => {
    return (
      <InputText
        className="w-full"
        value={rowData[rowIndex.field]}
        onChange={(e: any) => {
          handleInputChange(e, rowData, rowIndex);
        }}
      />
    );
  };
  const selectEditor = (rowData, rowIndex) => {
    return (
      <Dropdown
        value={rowData[rowIndex.field]}
        options={options}
        optionLabel={"MetaSubDescription"}
        optionValue={"MetaSubId"}
        className="w-full"
        onChange={(e) => handleDropdownChange(e, rowData, rowIndex)}
      />
    );
  };
  const dateEditor = (rowData, rowIndex) => {
    return (
      <Calendar
        className="w-full"
        onChange={(e: any) => {
          handleInputChange(e, rowData, rowIndex);
        }}
        minDate={new Date()}
        maxDate={new Date()}
        name={"DeviceDate"}
        value={rowData[rowIndex.field]}
        showIcon
      />
    );
  };
  const fileEditor = (rowData, rowIndex) => {
    return (
      <div className="col-12 md:col-3">
        <label className="form-label">Document Upload</label>
        <div className="p-inputgroup">
          <FileUpload
            mode="basic"
            chooseOptions={{ icon: "las la-upload", iconOnly: true }}
            maxFileSize={1000000}
            onSelect={(e: any) => {
              handleFileChange(e, rowData, rowIndex);
            }}
          />
          <Button icon="las la-times" />
        </div>
      </div>
    );
  };

  const handleAddRow = () => {
    const newObj = {
      id: gridData.length + 1,
      VisitorEntryBelongingDetailId: 0,
      VisitorEntryId: 0,
      DeviceNo: "",
      DeviceName: "",
      DeviceDoc: "",
      DeviceDate: "",
    };
    setgridData([...gridData, newObj]);
  };

  const handleDeleteRow = (rowIndex) => {
    const updatedgridData = [...gridData];
    updatedgridData.splice(rowIndex.rowIndex, 1);
    

    setgridData(updatedgridData);
  };

  const AddAndDeleteTemplate: React.FC<any> = (rowData) => {
    const index = gridData.indexOf(rowData);

    const handleAddRow = () => {
      const newObj = {
        VisitorEntryBelongingDetailId: 0,
        VisitorEntryId: 0,
        DeviceNo: "",
        DeviceName: "",
        DeviceDoc: "",
        DeviceDate: "",
      };
      setgridData([...gridData, newObj]);
    };

    const handleDeleteRow = () => {
      const updatedgridData = [...gridData];
      updatedgridData.splice(index, 1);
      setgridData(updatedgridData);
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
        />
        <Button
          label=""
          severity="danger"
          title="Delete"
          icon="las la-times"
          className="mr-2 p-1"
          onClick={handleDeleteRow}
        />
      </>
    );
  };

  const DeleteTemplate = (rowData, rowIndex) => {
    
    

    return (
      <>
        <Button
          label=""
          severity="danger"
          title="Delete"
          icon="las la-times"
          className="mr-2 p-1"
          onClick={() => handleDeleteRow(rowIndex)}
        />
      </>
    );
  };

  return (
    <div className="card p-fluid">
      <DataTable
        value={gridData}
        showGridlines
        paginator
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
        editMode="cell"
        rows={5}
        rowsPerPageOptions={[5, 10, 25, 50]}
        tableStyle={{ minWidth: "50rem" }}
      >
        <Column
          field="Action"
          header="Action"
          style={{ width: "15%" }}
          body={AddAndDeleteTemplate}
        />
        <Column
          field="DeviceName"
          header="DeviceName"
          style={{ width: "25%" }}
          body={(rowData, rowIndex) => textEditor(rowData, rowIndex)}
        />
        <Column
          field="DeviceNo"
          header="DeviceNo"
          style={{ width: "25%" }}
          body={(rowData, rowIndex) => textEditor(rowData, rowIndex)}
        />
        <Column
          field="DeviceDrop"
          header="DeviceDrop"
          style={{ width: "25%" }}
          body={(rowData, rowIndex) => selectEditor(rowData, rowIndex)}
        />
        <Column
          field="DeviceDate"
          header="DeviceDate"
          style={{ width: "25%" }}
          body={(rowData, rowIndex) => dateEditor(rowData, rowIndex)}
        />
        <Column
          field="DeviceFile"
          header="DeviceFile"
          style={{ width: "25%" }}
          body={(rowData, rowIndex) => fileEditor(rowData, rowIndex)}
        />
      </DataTable>
    </div>
  );
};

export default AppGridTable;
