import { useRef, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Button } from "primereact/button";
import { useDispatch, useSelector } from "react-redux";
import {
  createInit,
  create,
  update,
  OnChangeCompany,
} from "@/redux/slices/master/vehicleSlice";
import FormFields from "@/components/FormFields";
import { Formik, useFormik } from "formik";
import { Toast } from "@/assets/css/prime-library";
import { AppProgressSpinner } from "@/components/UtilityComp";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { pageLoadScript } from "@/assets/js/common-utilities";
import { tLDS } from "@/utils/utilFunc";
import { InputText } from "primereact/inputtext";
import { FileUpload } from "primereact/fileupload";
import {
  VehicleDetailValidationSchema,
  VehicleValidationSchema,
} from "@/validations/Master";
import { color } from "html2canvas/dist/types/css/types/color";
import AppAlert from "@/alert/alert";
import { EncryptData } from "@/redux/slices/master/workFlowSlice";

const deleteTemplate = (
  rowData,
  vehicleDetailList,
  setVehicleDetailList,
  isView
) => {
  const OnDelete = () => {
    setVehicleDetailList([]);
    setVehicleDetailList(vehicleDetailList.filter((f) => f != rowData));
  };
  return (
    <Button
      label=""
      severity="danger"
      title="Delete"
      icon="las la-trash"
      className="mr-2 p-1"
      disabled={isView ? true : false}
      onClick={() => OnDelete()}
    />
  );
};
const DocumentHyperLink: any = (rowData: any) => {
  return (
    <a style={{ color: "blue" }} href={rowData.AttachmentUrl} target="_blank">
      {rowData.AttachmentName}
    </a>
  );
};
const VehicleForm = (props) => {
// const { PurposeList } = useSelector((state: any) => state.vehicle)
  const {
    isCreate,
    isView,
    createEditData,
    loading,
    error,
    StatusList,
    HdrTable,
    EmployeeList,
    CompanyList,
    OnChangeCompanyList,
    plantList,
    VehicleMasterList,
    VehicleTypeList,
    SupplierList,
    PurposeList,
    DriverList,
    PlantList,
    VehicleList,
    formik,
    handleSelect,
    handleCompanySelect,
    handleSupplierSelect,
    DisableSupplier,
    handleVehicleSelect,
    onSubmit,
  } = props;
  return (
    <Formik
      initialValues={VehicleForm}
      validationSchema={VehicleValidationSchema}
      onSubmit={onSubmit}
    >
      <div className="white">
        <div className="widget-body">
          <div className="normal-table">
            <div className="grid">
              <FormFields
                type={"text"}
                name={"VehicleCode"}
                label={"Vehicle Code"}
                options={""}
                show={false}
                required={true}
                disable={isView || isCreate == false ? true : false}
                optionLabel={""}
                optionValue={""}
                handleSelect={""}
                formik={formik}
                fldStyle={"col-12 md:col-3"}
                onKeyPress={() => {}}
              />
              <FormFields
                type={"select"}
                name={"VehicleType"}
                label={"Vehicle Type"}
                options={VehicleTypeList}
                show={true}
                required={true}
                disable={isView ? true : false}
                optionLabel={"MetaSubDescription"}
                optionValue={"MetaSubId"}
                handleSelect={handleVehicleSelect}
                formik={formik}
                fldStyle={"col-12 md:col-3"}
              />
              {/* <FormFields
                type={"text"}
                name={"VehicleName"}
                label={"Vehicle Name"}
                options={""}
                show={true}
                required={false}
                disable={isView ? true : false}
                optionLabel={""}
                optionValue={""}
                handleSelect={""}
                formik={formik}
                fldStyle={"col-12 md:col-3"}
              /> */}
              <FormFields
                type={"text"}
                name={"VehicleNo"}
                label={"Vehicle No"}
                options={""}
                show={true}
                required={true}
                disable={isView ? true : false}
                optionLabel={""}
                optionValue={""}
                handleSelect={""}
                formik={formik}
                fldStyle={"col-12 md:col-3"}
                maxLength={25}
              />
              <FormFields
                type={"text"}
                name={"VehicleModel"}
                label={"Vehicle Model"}
                options={""}
                show={true}
                required={false}
                disable={isView ? true : false}
                optionLabel={""}
                optionValue={""}
                handleSelect={""}
                formik={formik}
                fldStyle={"col-12 md:col-3"}
                maxLength={50}
              />
              <FormFields
                type={"select"}
                name={"DriverId"}
                label={"Driver Name"}
                options={DriverList}
                show={true}
                required={false}
                disable={isView ? true : false}
                optionLabel={"UserName"}
                optionValue={"UserId"}
                handleSelect={handleSelect}
                formik={formik}
                fldStyle={"col-12 md:col-3"}
              />
              <div className="col-12 md:col-12">
                <div className="grid">
                  <FormFields
                    type={"select"}
                    name={"SupplierId"}
                    label={"Supplier Name"}
                    options={SupplierList}
                    show={true}
                    required={false}
                    disable={formik.values.VehicleType != 29 || isView ? true : false}
                    optionLabel={"SupplierName"}
                    optionValue={"SupplierId"}
                    handleSelect={handleSupplierSelect}
                    formik={formik}
                    fldStyle={"col-12 md:col-3"}
                  />
                  <FormFields
                    type={"text"}
                    name={"SupplierMobileNo"}
                    label={"Supplier Mobile No"}
                    options={""}
                    show={true}
                    required={false}
                    disable={true}
                    optionLabel={""}
                    optionValue={""}
                    handleSelect={""}
                    formik={formik}
                    fldStyle={"col-12 md:col-3"}
                  />
                  <FormFields
                    type={"text"}
                    name={"SupplierAddress"}
                    label={"Supplier Address"}
                    options={""}
                    show={true}
                    required={false}
                    disable={true}
                    optionLabel={""}
                    optionValue={""}
                    handleSelect={""}
                    formik={formik}
                    fldStyle={"col-12 md:col-3"}
                  />

                  <FormFields
                    type={"select"}
                    name={"PurposeOfVisit"}
                    label={"Purpose Of Visit "}
                    options={PurposeList}
                    show={true}
                    required={true}
                    // disable={!isCreate}
                     disable={isView ? true : false}
                    optionLabel={"MetaSubDescription"}
                    optionValue={"MetaSubId"}
                    handleSelect={handleSelect}
                    formik={formik}
                    fldStyle={"col-12 md:col-3"}
                    filter={true}
                  />

                  <FormFields
                    type={"Calendar"}
                    name={"VehicleFcDate"}
                    label={"Last Vehicle FC Date"}
                    options={""}
                    show={true}
                    required={false}
                    disable={isView ? true : false}
                    optionLabel={""}
                    optionValue={""}
                    formik={formik}
                    handleChange={formik.handleChange}
                    fldStyle={"col-12 md:col-3"}
                  />
                  <FormFields
                    type={"Calendar"}
                    name={"ServiceDate"}
                    label={"Next Service Date"}
                    options={""}
                    show={true}
                    required={false}
                    disable={isView ? true : false}
                    optionLabel={""}
                    optionValue={""}
                    formik={formik}
                    handleChange={formik.handleChange}
                    fldStyle={"col-12 md:col-3"}
                  />
                  <FormFields
                    type={"select"}
                    name={"Status"}
                    label={"Status"}
                    options={StatusList}
                    show={true}
                    required={true}
                    disable={
                      (isView ? true : false) ||
                      (isCreate == null || isCreate == true ? true : false)
                    }
                    optionLabel={"MetaSubDescription"}
                    optionValue={"MetaSubId"}
                    handleSelect={handleSelect}
                    formik={formik}
                    fldStyle={"col-12 md:col-3"}
                  />
             
              
          
            <FormFields
                type={"text"}
                name={"Remarks"}
                label={"Remarks"}
                options={""}
                show={true}
                required={false}
                disable={isView ? true : false}
                optionLabel={""}
                optionValue={""}
                handleSelect={""}
                formik={formik}
                fldStyle={"col-12 md:col-3"}
                // maxLength="500"
                // style={{ maxHeight: "70px", overflowY: "auto" }}
              />
              </div>
                 </div>
          </div>
            </div>
        </div>
      </div>
    </Formik>
  );
};
const VehicleDetailForm = (props) => {
  const {
    isCreate,
    isView,
    createEditData,
    loading,
    error,
    StatusList,
    HdrTable,
    EmployeeList,
    VehicleMasterList,
    VehicleTypeList,
    formik,
    OnClear,
    vehicleDetailList,
    filters,
    TableHeader,
    AttachmentUrl,
    onUploadDocument,
    setVehicleDetailList,
    ClearFileUpload,
    handleClick,
  } = props;
  const chooseOptions = { icon: "las la-upload", iconOnly: true };
  return (
    <Formik
      initialValues={formik.vehicleDetailForm}
      validationSchema={formik.VehicleDetailValidationSchema}
      onSubmit={formik.handleSubmit}
    >
      <div className="white">
        <div className="widget-body">
          <div className="normal-table">
            <div className="page-title">
              <div className="grid grid-nogutter">
                <div className="md:col-6">
                  <h1>Document Details</h1>
                </div>
              </div>
            </div>
            <div className="grid">
              <FormFields
                type={"text"}
                name={"DocumentName"}
                label={"Document Name"}
                options={""}
                show={true}
                required={true}
                disable={isView ? true : false}
                optionLabel={""}
                optionValue={""}
                handleSelect={""}
                formik={formik}
                fldStyle={"col-12 md:col-3"}
              />
              <FormFields
                type={"text"}
                name={"DocumentNo"}
                label={"Document No"}
                options={""}
                show={true}
                required={true}
                disable={isView ? true : false}
                optionLabel={""}
                optionValue={""}
                handleSelect={""}
                formik={formik}
                fldStyle={"col-12 md:col-3"}
              />
              <div className="col-12 md:col-3">
                {/* <label className="form-label">Document Upload<span className="hlt-txt">*</span></label>
                <div className="p-inputgroup">
                  <div className='browse-links'>
                    <Button label={formik.values.AttachmentName} link
                      onClick={() => handleClick(AttachmentUrl)} />
                  </div>
                  <InputText
                    placeholder=""
                    name={"AttachmentName"}
                    value={AttachmentUrl}
                    disabled
                  />
                  <FileUpload
                    mode="basic"
                    chooseOptions={chooseOptions}
                    maxFileSize={1000000}
                    onSelect={onUploadDocument}
                    chooseLabel={AttachmentUrl}
                    disabled={isView ? true : false}
                    auto
                  />
                  <Button
                    icon="las la-times"
                    disabled={isView ? true : false}
                    onClick={ClearFileUpload}
                  />
                </div> */}
                <label className="form-label">
                  Document Upload
                  <span className="hlt-txt">*</span>
                </label>
                <div className="p-inputgroup">
                  <div className="browse-links">
                    {formik.values.AttachmentName  != "" &&
                    formik.values.AttachmentName  != null ?
                    <Button
                    label={formik.values.AttachmentName}
                    link
                    onClick={() => handleClick(AttachmentUrl)}
                    />
                 :null }
                  </div>
                  <FileUpload
                    mode="basic"
                    chooseOptions={chooseOptions}
                    // maxFileSize={1000000}
                    onSelect={onUploadDocument}
                    chooseLabel={AttachmentUrl}
                    auto
                    accept=".jpeg, .jpg, .png, .pdf, .word, .xls, .xlsx"
                    disabled={isView ? true : false}
                  />
                  <Button
                    icon="las la-times"
                    disabled={isView ? true : false}
                    onClick={ClearFileUpload}
                  />
                </div>
              </div>
              <FormFields
                type={"textarea"}
                name={"Remarks"}
                label={"Remarks"}
                options={""}
                show={true}
                required={false}
                disable={isView ? true : false}
                optionLabel={""}
                optionValue={""}
                handleSelect={""}
                formik={formik}
                fldStyle={"col-12 md:col-3"}
                maxLength="500"
                style={{ maxHeight: "100px", overflowY: "auto" }}
              />
            </div>

            <div className="text-center mb-3">
              <Button
                label="Add"
                severity="success"
                icon="las la-plus"
                title="Add"
                className="text-center"
                onClick={formik.handleSubmit}
                type="submit"
                disabled={isView ? true : false}
              />
              <Button
                label="Delete"
                severity="danger"
                icon="las la-trash"
                title="Delete"
                className="text-center"
                onClick={() => OnClear()}
                disabled={isView ? true : false}
              />
            </div>
          </div>
          <div className="card">
            <DataTable
              value={vehicleDetailList}
              showGridlines
              paginator
              filters={filters}
              filterDisplay="menu"
              globalFilterFields={[
                "DocumentName",
                "DocumentNo",
                "AttachmentName",
                "AttachmentUrl",
                "Remarks",
              ]}
              header={TableHeader}
              emptyMessage="No Data Found."
              rows={5}
              rowsPerPageOptions={[5, 10, 25, 50]}
              tableStyle={{ minWidth: "50rem" }}
            >
              <Column
                header="Action"
                style={{
                  textAlign: "center",
                  minWidth: "5em",
                  maxWidth: "5em",
                }}
                body={(e) =>
                  deleteTemplate(
                    e,
                    vehicleDetailList,
                    setVehicleDetailList,
                    isView
                  )
                }
                headerClassName="text-center"
              ></Column>
              <Column
                field="DocumentName"
                style={{
                  minWidth: "20em",
                  maxWidth: "20em",
                  overflowWrap: "break-word",
                }}
                header="Document Name"
                headerClassName="text-center"
              ></Column>
              <Column
                field="DocumentNo"
                header="Document Number"
                headerClassName="text-center"
              ></Column>
              <Column
                header="Document URL"
                style={{
                  minWidth: "20em",
                  maxWidth: "20em",
                  overflowWrap: "break-word",
                }}
                body={(e) => DocumentHyperLink(e)}
                headerClassName="text-center"
              ></Column>
              <Column
                field="Remarks"
                style={{
                  minWidth: "30em",
                  maxWidth: "30em",
                  overflowWrap: "break-word",
                }}
                header="Remarks"
                headerClassName="text-center"
              ></Column>
            </DataTable>
          </div>
        </div>
      </div>
    </Formik>
  );
};
const CVehicle = () => {
  const dispatch: any = useDispatch();
  const toast = useRef<Toast>(null);
  const route = useHistory();
  const [DisableSupplier, setDisableSupplier] = useState(true);
  const [vehicleDetailList, setVehicleDetailList] = useState([]);
  const [plantList, setPlantList] = useState([]);
  //  const [PurposeList, setPurposeList] = useState([]);
  const [AttachmentUrl, setAttachmentUrl] = useState("");
  const [document, setDocument] = useState<File | null>(null);
  const [documentfiles, setDocumentfiles] = useState<File[] | null>([]);
  const [photo, setPhoto] = useState<File | null>(null);
  const [disableSave, setDisableSave] = useState(false);
  const documentUploadRef = useRef<any>(null);
  const {
    isCreate,
    isView,
    createEditData,
    loading,
    error,
    StatusList,
    HdrTable,
    EmployeeList,
    PurposeList,
    CompanyList,
    PlantList,
    OnChangeCompanyList,
    VehicleMasterList,
    VehicleTypeList,
    SupplierList,
    VehicleList,
    VehicleDetailList,
    DriverList
  } = useSelector((state: any) => state.vehicle);
  useEffect(() => {
    pageLoadScript();
  });
  useEffect(() => {
    if (isCreate == false) {
      let List: any[] = [];
      for (let i = 0; i < VehicleDetailList.length; i++) {
        const x = VehicleDetailList[i];
        let obj: any = {};
        obj.VehicleDocumentDetailId = 0;
        obj.VehicleId = x.VehicleId ?? 0;
        obj.DocumentName = x.DocumentName;
        obj.DocumentNo = x.DocumentNo;
        obj.AttachmentUrl = x.AttachmentUrl;
        obj.AttachmentName = x.AttachmentName;
        obj.Remarks = x.Remarks;
        List.push(obj);
      }
      setVehicleDetailList(List);
      if (HdrTable.VehicleType === 29) {
        setDisableSupplier(false);
      }
    } else {
      const data = {
        VehicleId: 0,
        Taskname: "CREATEINITIALIZE",
        CompanyId: +localStorage["CompanyId"],
        PlantId: +localStorage["PlantId"],
        RoleId: +localStorage["DefaultRoleId"],
      };
      dispatch(createInit(data))
    }
  }, []);
  async function fetchBlobFromUrl(url: string): Promise<Blob> {
    const response = await fetch(url);
    setAttachmentUrl(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    return await response.blob();
  }

  const generateQrCodes = (data) => {
    const encryptData = dispatch(
      EncryptData(data.VehicleNo)
    );
    encryptData
      .then((res) => {
        if (
          res.payload.hasOwnProperty("tranStatus") &&
          res.payload.tranStatus.result
        ) {
          vehicleFormik.setFieldValue(
            "VehicleToken",
            "E^^_"+ res.payload.VisitorEntryHeader
          );

          data.VehicleToken = "E^^_" + res.payload.VisitorEntryHeader;

          const formData = new FormData();
          let List: any[] = [];
          for (let i = 0; i < vehicleDetailList.length; i++) {
            const x = vehicleDetailList[i];
            let obj: any = {};
            obj.VehicleDocumentDetailId = 0;
            obj.VehicleId = 0;
            obj.DocumentName = x.DocumentName;
            obj.DocumentNo = x.DocumentNo;
            obj.AttachmentUrl = x.AttachmentUrl;
            obj.AttachmentName = x.AttachmentName;
            obj.Remarks = x.Remarks;
            List.push(obj);
          }

          let vehicleUpdate = {
            Vehicle: data,
            VehicleDocumentDetail: List,
          };
          let addedValueStringify: string = JSON.stringify(vehicleUpdate);
          formData.append("input", addedValueStringify);
          for (var x in documentfiles) {
            var index = List.findIndex(
              (obj) => obj.AttachmentName == documentfiles[x].name
            );
            if (index != -1) {
              formData.append("webfiles", documentfiles[x]);
            }
          }
          const updateRes = dispatch(update(formData));
          updateRes.then((res) => {
            if (res.payload != null || !res.payload) {
              resetAllForm();
              if (res.payload.transtatus.result == true) {
              } else if (res.payload.transtatus.result == false) {
              }
            }
          });
        }
      })
      .catch((err) => {});
  };

  const checkSuppActive = (suppId) => {
    let isExists = SupplierList.filter(
      (item) => item.SupplierId == HdrTable.SupplierId && item.Status == 1
    );
    if (isExists.length == 0) {
      return false;
    }
    return true;
  };
  const vehicleForm = {
    VehicleId: HdrTable != null ? HdrTable.VehicleId : 0,
    VehicleCode: HdrTable != null ? HdrTable.VehicleCode : "",
    VehicleName: HdrTable != null ? HdrTable.VehicleName : "",
    CompanyId:
      HdrTable != null ? HdrTable.CompanyId : localStorage["CompanyId"],
    PlantId: HdrTable != null ? HdrTable.PlantId : localStorage["PlantId"],
    VehicleType: HdrTable != null ? HdrTable.VehicleType : 28,
    VehicleNo: HdrTable != null ? HdrTable.VehicleNo : "",
    SupplierId:
      HdrTable != null
        ? checkSuppActive(HdrTable.SupplierId)
          ? HdrTable.SupplierId
          : null
        : null,
    DriverId: HdrTable != null ? HdrTable.DriverId : null,
    SupplierMobileNo: HdrTable != null ? HdrTable.SupplierMobileNo : "",
    SupplierAddress: HdrTable != null ? HdrTable.SupplierAddress : "",
    VehicleModel: HdrTable != null ? HdrTable.VehicleModel : "",
    PurposeOfVisit: HdrTable != null ? HdrTable.PurposeOfVisit : null,
    EmployeeId: HdrTable != null ? HdrTable.EmployeeId : null,
    VehicleFcDate: HdrTable != null   && HdrTable?.VehicleFcDate != null? new Date(HdrTable.VehicleFcDate) :null,
    ServiceDate: HdrTable != null && HdrTable?.ServiceDate != null ? new Date(HdrTable.ServiceDate) :null,
    Remarks: HdrTable != null ? HdrTable.Remarks : "",
    Status: HdrTable != null ? HdrTable.Status : 1,
    CreatedBy: HdrTable != null ? HdrTable.CreatedBy : localStorage["UserId"],
    CreatedOn: HdrTable != null ? tLDS(HdrTable.CreatedOn) : tLDS(new Date()),
    ModifiedBy: HdrTable != null ? localStorage["UserId"] : null,
    ModifiedOn: HdrTable != null ? tLDS(new Date()) : null,
    VehicleToken: HdrTable != null ? HdrTable.VehicleToken : "",
  };
  const vehicleDetailForm = {
    VehicleDocumentDetailId: 0,
    VehicleId: 0,
    DocumentName: "",
    DocumentNo: "",
    AttachmentUrl: "",
    AttachmentName: "",
    Remarks: "",
  };
  const vehicleFormik: any = useFormik({
    initialValues: vehicleForm,
    validationSchema: VehicleValidationSchema,
    onSubmit: (values: any, { resetForm }) => {
      setDisableSave(true);
      if (values.VehicleType == 29) {
        if (!values.SupplierId) {
          toast.current?.show({
            severity: "error",
            summary: "Error Message",
            detail: "Please Select Supplier Name",
          });
          setDisableSave(false);
          return;
        }
      }
      const formData = new FormData();
      let List: any[] = [];
      for (let i = 0; i < vehicleDetailList.length; i++) {
        const x = vehicleDetailList[i];
        let obj: any = {};
        obj.VehicleDocumentDetailId = 0;
        obj.VehicleId = 0;
        obj.DocumentName = x.DocumentName;
        obj.DocumentNo = x.DocumentNo;
        obj.AttachmentUrl = x.AttachmentUrl;
        obj.AttachmentName = x.AttachmentName;
        obj.Remarks = x.Remarks;
        List.push(obj);
      }
      // if (!List || !List.length || List.length == 0) {
      //   toast.current?.show({
      //     severity: "error",
      //     summary: "Error Message",
      //     detail: "Please Add AtLeast One Document Detail.",
      //   });
      //   setDisableSave(false);
      //   return;
      // }
      let vehicleFormValue = {
        Vehicle: values,
        VehicleDocumentDetail: List,
      };
      let addedValueStringify: string = JSON.stringify(vehicleFormValue);
      formData.append("input", addedValueStringify);
      for (var x in documentfiles) {
        var index = List.findIndex(
          (obj) => obj.AttachmentName == documentfiles[x].name
        );
        if (index != -1) {
          formData.append("webfiles", documentfiles[x]);
        }
      }

      if (isCreate == false) {
        const updateRes = dispatch(update(formData));
        updateRes
          .then((res) => {
            setDisableSave(false);
            if (res.payload != null || !res.payload) {
              if (res.payload.transtatus.result == true) {
                setDisableSave(false);
                if (res.payload.VehicleType == 29) {
                  if (!res.payload.SupplierId) {
                    toast.current?.show({
                      severity: "error",
                      summary: "Error Message",
                      detail: "Please Select Supplier Name",
                    });
                    return;
                  }
                }
                toast.current?.show({
                  severity: "success",
                  summary: "Success Message",
                  detail: res.payload.transtatus.lstErrorItem[0].Message,
                });
                setTimeout(() => {
                  route.push("/home/vVehicle");
                }, 800);
              } else {
                setDisableSave(false);
                toast.current?.show({
                  severity: "error",
                  summary: "Error Message",
                  detail: res.payload.transtatus.lstErrorItem[0].Message,
                });
              }
            }
          })
          .catch((error) => {
            toast.current?.show({
              severity: "error",
              summary: "Error Message",
              detail: error,
            });
          });
      } else {
        const createRes = dispatch(create(formData));
        createRes
          .then((res) => {
            if (res.payload.transtatus.result == true) {
              setDisableSave(false);
              generateQrCodes(res.payload.HdrTable);
              toast.current?.show({
                severity: "success",
                summary: "Success Message",
                detail: res.payload.transtatus.lstErrorItem[0].Message,
              });
            } else if (res.payload.transtatus.result == false) {
              setDisableSave(false);
              toast.current?.show({
                severity: "error",
                summary: "Error Message",
                detail: res.payload.transtatus.lstErrorItem[0].Message,
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
      // resetForm();
    },
  });
  const vehicleDetailFormik: any = useFormik({
    initialValues: vehicleDetailForm,
    validationSchema: VehicleDetailValidationSchema,
    onSubmit: (values: any, { resetForm }) => {
      if (!values.AttachmentName || values.AttachmentName == "") {
        toast.current?.show({
          severity: "error",
          summary: "Error Message",
          detail: "Please Upload the Document",
        });
        return;
      }
      let existsList: any[] = vehicleDetailList.filter(
        (f) => f.DocumentName == values.DocumentName
      );
      if (existsList.length > 0) {
        toast.current?.show({
          severity: "error",
          summary: "Error Message",
          detail: "Document Name is Already Exists",
        });
      } else {
        let obj: any = {};
        obj.VehicleDocumentDetailId = 0;
        obj.VehicleId = 0;
        obj.DocumentName = values.DocumentName;
        obj.DocumentNo = values.DocumentNo;
        obj.AttachmentUrl = values.AttachmentUrl;
        obj.AttachmentName = values.AttachmentName;
        obj.Remarks = values.Remarks;
        setVehicleDetailList([...vehicleDetailList, obj]);
        if (document) {
          if (documentfiles.length > 0) {
            setDocumentfiles([...documentfiles, document]);
          } else {
            setDocumentfiles([document]);
          }
        }
        OnClear();
      }
    },
  });
  const handleSelect = (name, other, value) => {
    vehicleFormik.setFieldValue(name, value);
  };
  const handleCompanySelect = (name, other, value) => {
    vehicleFormik.setFieldValue(name, value);
    let Obj = {
      CompanyId: value,
    };
    dispatch(OnChangeCompany(Obj));
  };
  const resetAllForm = () => {
    vehicleFormik.resetForm();
    vehicleDetailFormik.resetForm();
    setVehicleDetailList([]);
    setAttachmentUrl("");
  };
  const handleSupplierSelect = (name, other, value) => {
    vehicleFormik.setFieldValue(name, value);
    let obj = SupplierList.find((f) => f.SupplierId == value);
    vehicleFormik.setFieldValue("SupplierMobileNo", obj.SupplierMobileNo);
    vehicleFormik.setFieldValue("SupplierAddress", obj.Address);
  };
  const handleVehicleSelect = (name, other, value) => {
    vehicleFormik.setFieldValue(name, value);
    if (value != 29) {
      //Own
      vehicleFormik.setFieldValue("SupplierId", null);
      vehicleFormik.setFieldValue("SupplierMobileNo", "");
      vehicleFormik.setFieldValue("SupplierAddress", "");
      // setDisableSupplier(true);
    }
    setDisableSupplier(!DisableSupplier);
    // else {
    //   setDisableSupplier(false);
    // }
  };
  const OnClear = () => {
    vehicleDetailFormik.resetForm();
    setDocument(null);
    setAttachmentUrl("");
  };
  const isValidFileType = (file, allowedTypes) => {
    const fileExtension = file.name
      .slice(((file.name.lastIndexOf(".") - 1) >>> 0) + 2)
      .toLowerCase();
    const fileType = file.type.toLowerCase();
    return (
      allowedTypes.includes(fileExtension) || allowedTypes.includes(fileType)
    );
  };
  // const onUploadDocument = (e) => {
  //   setDocument(e.files[0]);
  //   vehicleDetailFormik.setFieldValue("AttachmentName", e.files[0].name);
  //   const uploadedImageUrl = URL.createObjectURL(e.files[0]);
  //   vehicleDetailFormik.setFieldValue("AttachmentUrl", uploadedImageUrl);
  //   setAttachmentUrl(uploadedImageUrl);
  // };
  const onUploadDocument = (e) => {
    const allowedTypes = [
      "jpeg",
      "jpg",
      "png",
      "pdf",
      "doc",
      "docx",
      "xls",
      "xlsx",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];
    if (e.files) {
      if (!isValidFileType(e.files[0], allowedTypes)) {
        toast.current?.show({
          severity: "warn",
          summary: "Error Message",
          detail:
            "Please Upload only Files with Format (Image/ JPEG, JPG, PNG & DOC/ WORD, EXCEL, PDF)",
        });
        documentUploadRef.current?.clear();
        return;
      }
    }

    if (e.files.length > 0) {
      setDocument(e.files[0]);
      vehicleDetailFormik.setFieldValue("AttachmentName", e.files[0].name);
      const uploadedImageUrl = URL.createObjectURL(e.files[0]);
      vehicleDetailFormik.setFieldValue("AttachmentUrl", uploadedImageUrl);
      setAttachmentUrl(uploadedImageUrl);
    } else {
      toast.current?.show({
        severity: "warn",
        summary: "Error Message",
        detail:
          "Please Upload only Files with Format (Image/ JPEG, JPG, PNG & DOC/ WORD, EXCEL, PDF)",
      });
    }
  };
  const ClearFileUpload = () => {
    vehicleDetailFormik.setFieldValue("AttachmentName", null);
    vehicleDetailFormik.setFieldValue("AttachmentUrl", null);
    setAttachmentUrl("");
  };
  // const handleClick = (linkValue) => {
  //   window.open(linkValue, "_blank");
  // };
  const handleClick = (linkValue) => {
  if (linkValue) {
    window.open(linkValue, "_blank");
  } else {
    toast.current?.show({
      severity: "warn",
      summary: "Invalid File",
      detail: "No attachment found to open.",
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
                <h1>Vehicle</h1>
              </div>
              <div className="md:col-6 text-right">
                <div className="action-btn">
                  <>
                    <Button
                      label=""
                      title="Save"
                      icon="pi pi-save"
                      className="text-center"
                      type="submit"
                      disabled={isView || disableSave ? true : false}
                      onClick={() => vehicleFormik.handleSubmit()}
                    />
                    <Button
                      label=""
                      severity="danger"
                      icon="pi pi-trash"
                      title="Clear"
                      className="text-center"
                      disabled={isView || isCreate == false ? true : false}
                      onClick={() => resetAllForm()}
                    />
                  </>
                  <Button
                    label=""
                    icon="pi pi-search"
                    title="Back to Search"
                    className="p-button p-button-success text-center"
                    onClick={() => {
                      route.push("/home/vVehicle");
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          {!loading ? (
            <>
              <div className="form-container scroll-y">
                <VehicleForm
                  isCreate={isCreate}
                  isView={isView}
                  createEditData={createEditData}
                  loading={loading}
                  error={error}
                  StatusList={StatusList}
                  HdrTable={HdrTable}
                  EmployeeList={EmployeeList}
                  CompanyList={CompanyList}
                  PlantList={PlantList}
                  formik={vehicleFormik}
                  handleSelect={handleSelect}
                  handleCompanySelect={handleCompanySelect}
                  OnChangeCompanyList={OnChangeCompanyList}
                  plantList={plantList}
                  SupplierList={SupplierList}
                  VehicleTypeList={VehicleTypeList}
                  handleSupplierSelect={handleSupplierSelect}
                  handleVehicleSelect={handleVehicleSelect}
                  DisableSupplier={DisableSupplier}
                  OnClear={OnClear}
                  DriverList={DriverList}
                  PurposeList={PurposeList}
                />
                <VehicleDetailForm
                  isCreate={isCreate}
                  isView={isView}
                  createEditData={createEditData}
                  loading={loading}
                  error={error}
                  StatusList={StatusList}
                  HdrTable={HdrTable}
                  CompanyList={CompanyList}
                  PlantList={PlantList}
                  formik={vehicleDetailFormik}
                  handleSelect={handleSelect}
                  vehicleDetailList={vehicleDetailList}
                  vehicleDetailForm={vehicleDetailForm}
                  OnClear={OnClear}
                  setVehicleDetailList={setVehicleDetailList}
                  onUploadDocument={onUploadDocument}
                  ClearFileUpload={ClearFileUpload}
                  AttachmentUrl={AttachmentUrl}
                  handleClick={handleClick}
                />
              </div>
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
export default CVehicle;
