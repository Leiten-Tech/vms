import { useState, useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Button } from "primereact/button";
import { useDispatch, useSelector } from "react-redux";
import {
  CreateInitialize,
  SearchInitialize,
  OnChangeCompany,
  Create,
  Update,
} from "@/redux/slices/master/areaSlice";
import FormFields from "@/components/FormFields";
import { Formik, useFormik } from "formik";
import { AreaValidationSchema } from "@/validations/Master";
import { Toast } from "@/assets/css/prime-library";
import { AppProgressSpinner } from "@/components/UtilityComp";
import { pageLoadScript } from "@/assets/js/common-utilities";
import AppAlert from "@/alert/alert";
import { tLDS } from "@/utils/utilFunc";
import { CDataGrid } from "@/components/Common/CDataGrid";

const CControlApp = () => {
  const route = useHistory();
  const dispatch: any = useDispatch();
  const toast = useRef<Toast>(null);
  const [plantList, setPlantList] = useState([]);
  const [rowData, setRowData] = useState([
    {
      PlantName: "UNIT-1",
      TrialStartDate: "19-12-2024",
      TrialEndDate: "19-12-2024",
      TrialDays: "20",
      IsWAApprovalEnabled: true,
      IsEMApprovalEnabled: true,
      Status: "Active",
    },
  ]);

  const [pageConfig, setPageConfig] = useState({
    pageTitle: "Role Wise Screen Mapping",
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
      minWidth: "3rem",
      maxWidth: "3rem",
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
    ],
    tableColumns: [
      {
        title: "Plant Name",
        name: "PlantName",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: {
          minWidth: "5rem",
          maxWidth: "5rem",
        },
      },
      {
        title: "Trial Start Date",
        name: "TrialStartDate",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: {
          minWidth: "5rem",
          maxWidth: "5rem",
        },
      },
      {
        title: "Trial End Date",
        name: "TrialEndDate",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: {
          minWidth: "5rem",
          maxWidth: "5rem",
        },
      },
      {
        title: "Trial Days",
        name: "TrialDays",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: {
          minWidth: "5rem",
          maxWidth: "5rem",
        },
      },
      {
        title: "Is WhatsApp Approval Enabled",
        name: "IsWAApprovalEnabled",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: {
          minWidth: "5rem",
          maxWidth: "5rem",
        },
      },
      {
        title: "Is Email Approval Enabled",
        name: "IsEMApprovalEnabled",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: {
          minWidth: "5rem",
          maxWidth: "5rem",

        },
      },
      {
        title: "Modules",
        name: "Modules",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: {
          minWidth: "5rem",
          maxWidth: "5rem",

        },
      },
      {
        title: "Status",
        name: "Status",
        sort: true,
        avatar: false,
        badge: false,
        colStyle: {
          minWidth: "5rem",
          maxWidth: "5rem",
        },
      },
    ],
  });

  useEffect(() => {
    pageLoadScript();
  });

  useEffect(() => {
    if (isCreate == true) {
      const data = {
        AreaId: 0,
        CompanyId: +localStorage["CompanyId"],
        RoleId: +localStorage["DefaultRoleId"],
        PlantId: +localStorage["PlantId"],
        Taskname: "CREATEINITIALIZE",
      };
      dispatch(CreateInitialize(data));
    } else {
      handleCompanySelect(
        "CompanyId",
        {},
        HdrTable.CompanyId,
        HdrTable.PlantId
      );
    }
  }, []);
  const {
    isCreate,
    isView,
    createOrEdit,
    CompanyList,
    PlantList,
    loading,
    AreaList,
    Area,
    error,
    StatusList,
    HdrTable,
  } = useSelector((state: any) => state.area);

  const formik: any = useFormik({
    initialValues: {
      CompanyId: HdrTable != null ? HdrTable.CompanyId : "",
      PlantId: HdrTable != null ? HdrTable.PlantId : null,
      AreaName: HdrTable != null ? HdrTable.AreaName : "",
      Status: HdrTable != null ? HdrTable.Status : 1,
    },
    validationSchema: AreaValidationSchema,
    onSubmit: (values: any, { resetForm }) => {
      let AreaFormValue = {
        Area: {
          AreaId: HdrTable != null ? HdrTable.AreaId : 0,
          AreaCode: HdrTable != null ? HdrTable.AreaCode : "",
          AreaName: values.AreaName,
          CompanyId: values.CompanyId,
          PlantId: values.PlantId,
          Status: values.Status,
          CreatedBy:
            HdrTable != null ? HdrTable.CreatedBy : localStorage["UserId"],
          CreatedOn:
            HdrTable != null ? tLDS(HdrTable.CreatedOn) : tLDS(new Date()),
          ModifiedBy: HdrTable != null ? localStorage["UserId"] : null,
          ModifiedOn: HdrTable != null ? tLDS(new Date()) : null,
        },
      };
      if (HdrTable != null) {
        if (HdrTable.isCreate != false) {
          try {
            const updateRes = dispatch(Update(AreaFormValue));
            updateRes.then((res) => {
              if (res.payload != null || !res.payload) {
                if (res.payload.transtatus.result == true) {
                  toast.current?.show({
                    severity: "success",
                    summary: "Success Message",
                    detail: res.payload.transtatus.lstErrorItem[0].Message,
                  });
                  resetForm();
                  setTimeout(() => {
                    route.push("/home/vControlApp");
                  }, 800);
                } else if (res.payload.transtatus.result == false) {
                  toast.current?.show({
                    severity: "error",
                    summary: "Error Message",
                    detail: res.payload.transtatus.lstErrorItem[0].Message,
                  });
                }
              }
            });
          } catch (err) {
            toast.current?.show({
              severity: "warn",
              summary: "Error Message",
              detail: err,
            });
          }
        }
      } else {
        try {
          const createRes = dispatch(Create(AreaFormValue));
          createRes
            .then((res) => {
              if (res.payload != null || !res.payload) {
                if (res.payload.transtatus.result == true) {
                  toast.current?.show({
                    severity: "success",
                    summary: "Success Message",
                    detail: res.payload.transtatus.lstErrorItem[0].Message,
                  });
                  resetForm();
                } else if (res.payload.transtatus.result == false) {
                  toast.current?.show({
                    severity: "warn",
                    summary: "Error Message",
                    detail: res.payload.transtatus.lstErrorItem[0].Message,
                  });
                }
              }
            })
            .catch((err) => {
              toast.current?.show({
                severity: "warn",
                summary: "Error Message",
                detail: JSON.stringify(err.payload),
              });
            });
        } catch (err) {
          toast.current?.show({
            severity: "warn",
            summary: "Error Message",
            detail: JSON.stringify(err.payload),
          });
        }
      }
    },
  });

  const resetForm = () => {
    formik.resetForm();
    setPlantList([]);
  };

  const handleSelect = (name, other, value) => {
    formik.setFieldValue(name, value);
  };

  const handleCompanySelect = (name, other, value, PlantId?: number) => {
    formik.setFieldValue(name, value);
    formik.setFieldValue("PlantId", PlantId ? PlantId : null);
    let Obj = {
      CompanyId: value,
      PlantId: +localStorage["PlantId"],
      RoleId: +localStorage["DefaultRoleId"],
    };
    var result = dispatch(OnChangeCompany(Obj));
    result
      .then((res) => {
        if (res.payload.transtatus.result) {
          setPlantList(res.payload.PlantList);
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

  const dataGrid = {
    gridData: rowData,
    pageConfig: pageConfig
  };

  return (
    <>
      <Formik
        initialValues={formik.initialValues}
        validationSchema={formik.validationSchema}
        onSubmit={formik.handleSubmit}
      >
        <div className="inner-page-container">
          <div className="page-title">
            <div className="grid grid-nogutter">
              <div className="md:col-6">
                <h1>License Configuration</h1>
              </div>
              <div className="md:col-6 text-right">
                <div className="action-btn">
                  <>
                    <Button
                      label=""
                      title="Save"
                      icon="pi pi-save"
                      className="text-center"
                      disabled={isView ? true : false}
                      type="submit"
                      onClick={() => formik.handleSubmit()}
                    />
                    <Button
                      label=""
                      severity="danger"
                      icon="pi pi-trash"
                      title="Clear"
                      className="text-center"
                      disabled={isView || isCreate == false ? true : false}
                      onClick={() => resetForm()}
                    />
                  </>
                  <Button
                    label=""
                    icon="pi pi-search"
                    title="Back to Search"
                    className="p-button p-button-success text-center"
                    onClick={() => {
                      route.push("/home/vControlApp");
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="form-container scroll-y">
            <form>
              <>
                <div className="widget-body">
                  <div className="normal-table">
                    <div className="grid gap-1">
                      {!loading ? (
                        <>
                          <div className="white col-12 md:col-12">
                            <div className="widget-hdr">
                              <div className="sub-title">
                                <h2>License Information</h2>
                              </div>
                            </div>
                            <div className="widget-body">
                              <div className="grid">
                                <FormFields
                                  type={"text"}
                                  name={"CompanyName"}
                                  label={"Company"}
                                  show={true}
                                  required={true}
                                  disable={isView || !isCreate}
                                  formik={formik}
                                  fldStyle={"col-12 md:col-3"}
                                  showFilter={true}
                                />
                                <FormFields
                                  type={"text"}
                                  name={"CINNo"}
                                  label={"CIN Number"}
                                  options={""}
                                  show={true}
                                  required={true}
                                  disable={false}
                                  formik={formik}
                                  fldStyle={"col-12 md:col-3"}
                                />
                                <FormFields
                                  type={"select"}
                                  name={"HostingType"}
                                  label={"Hosting Type"}
                                  options={plantList}
                                  show={true}
                                  required={false}
                                  disable={isView || !isCreate}
                                  optionLabel={"MetaSubDescription"}
                                  optionValue={"MetaSubId"}
                                  handleSelect={handleSelect}
                                  formik={formik}
                                  fldStyle={"col-12 md:col-3"}
                                />
                                <FormFields
                                  type={"text"}
                                  name={"HostingDomain"}
                                  label={"Hosting Domain"}
                                  options={""}
                                  show={true}
                                  required={false}
                                  disable={false}
                                  formik={formik}
                                  fldStyle={"col-12 md:col-3"}
                                />
                                <FormFields
                                  type={"text"}
                                  name={"LicenseCost"}
                                  label={"License Cost"}
                                  options={""}
                                  show={true}
                                  required={false}
                                  disable={false}
                                  formik={formik}
                                  fldStyle={"col-12 md:col-3"}
                                />

                                <FormFields
                                  type={"text"}
                                  name={"AreaCode"}
                                  label={"Area Code"}
                                  options={""}
                                  show={false}
                                  required={true}
                                  disable={
                                    isView || isCreate == false ? true : false
                                  }
                                  optionLabel={""}
                                  optionValue={""}
                                  handleSelect={""}
                                  formik={formik}
                                  fldStyle={"col-12 md:col-3"}
                                />
                                <FormFields
                                  type={"text"}
                                  name={"LicenseToken"}
                                  label={"License Token"}
                                  options={""}
                                  show={true}
                                  required={true}
                                  disable={true}
                                  optionLabel={""}
                                  optionValue={""}
                                  handleSelect={""}
                                  formik={formik}
                                  fldStyle={"col-12 md:col-3"}
                                />
                                <FormFields
                                  type={"text"}
                                  name={"Trial Days"}
                                  label={"Trial Days"}
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
                                  type={"Calendar"}
                                  name={"TrialStartDate"}
                                  label={"Trial Start Date"}
                                  options={""}
                                  show={true}
                                  required={false}
                                  disable={isView ? true : false}
                                  optionLabel={""}
                                  optionValue={""}
                                  handleChange={{}}
                                  fldStyle={"col-12 md:col-3"}
                                  formik={formik}
                                />
                                <FormFields
                                  type={"Calendar"}
                                  name={"TrialEndDate"}
                                  label={"Trial End Date"}
                                  options={""}
                                  show={true}
                                  required={false}
                                  disable={isView ? true : false}
                                  optionLabel={""}
                                  optionValue={""}
                                  handleChange={{}}
                                  fldStyle={"col-12 md:col-3"}
                                  formik={formik}
                                />
                                <FormFields
                                  type={"text"}
                                  name={"PONo"}
                                  label={"PO Number"}
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
                                  name={"AppVersion"}
                                  label={"App Version"}
                                  options={""}
                                  show={true}
                                  required={false}
                                  disable={false}
                                  formik={formik}
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
                                    (isCreate == null || isCreate == true
                                      ? true
                                      : false)
                                  }
                                  optionLabel={"MetaSubDescription"}
                                  optionValue={"MetaSubId"}
                                  handleSelect={handleSelect}
                                  formik={formik}
                                  fldStyle={"col-12 md:col-3"}
                                />
                                <FormFields
                                  type={"toggle"}
                                  name={"WhatsAppApprovalEnabled"}
                                  label={"Is WhatsApp Approval Enabled ?"}
                                  options={""}
                                  show={true}
                                  required={true}
                                  disable={false}
                                  optionLabel={""}
                                  optionValue={""}
                                  handleSelect={""}
                                  formik={formik}
                                  fldStyle={"col-12 md:col-3"}
                                />
                                <FormFields
                                  type={"toggle"}
                                  name={"EmailApprovalEnabled"}
                                  label={"Is Email Approval Enabled ?"}
                                  options={""}
                                  show={true}
                                  required={true}
                                  disable={false}
                                  optionLabel={""}
                                  optionValue={""}
                                  handleSelect={""}
                                  formik={formik}
                                  fldStyle={"col-12 md:col-3"}
                                />
                              </div>
                            </div>
                          </div>
                          {/* <div className="white col-12 md:col">
                            <div className="widget-hdr">
                              <div className="sub-title">
                                <h2>Notifications</h2>
                              </div>
                            </div>
                            <div className="widget-body">
                              <div className="grid">
                                
                              </div>
                            </div>
                          </div> */}

                          <div className="white col-12 md:col-12">
                            <CDataGrid dataGrid={dataGrid} />
                          </div>
                        </>
                      ) : (
                        <AppProgressSpinner />
                      )}
                    </div>
                  </div>
                </div>
              </>
            </form>
          </div>
        </div>
      </Formik>
      <AppAlert toast={toast} />
    </>
  );
};

export default CControlApp;
