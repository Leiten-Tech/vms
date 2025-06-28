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

const CArea = () => {
  const route = useHistory();
  const dispatch: any = useDispatch();
  const toast = useRef<Toast>(null);
  const [plantList, setPlantList] = useState([]);
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
                    route.push("/home/vArea");
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

  return (
    <>
      <Formik
        initialValues={formik.initialValues}
        validationSchema={formik.validationSchema}
        onSubmit={formik.handleSubmit}
      >
        <div className="page-container">
          <div className="inner-page-container">
            <div className="page-title">
              <div className="grid grid-nogutter">
                <div className="md:col-6">
                  <h1>Area</h1>
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
                        route.push("/home/vArea");
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="form-container scroll-y">
              <form>
                <div className="white">
                  <div className="widget-body">
                    <div className="normal-table">
                      <div className="grid">
                        {!loading ? (
                          <>
                            <div className="col-12 md:col-9">
                              <div className="grid">
                                <FormFields
                                  type={"select"}
                                  name={"CompanyId"}
                                  label={"Company"}
                                  options={CompanyList}
                                  show={true}
                                  required={true}
                                  disable={isView || !isCreate}
                                  optionLabel={"CompanyName"}
                                  optionValue={"CompanyId"}
                                  handleSelect={handleCompanySelect}
                                  formik={formik}
                                  fldStyle={"col-12 md:col-4"}
                                  showFilter={true}
                                />
                                <FormFields
                                  type={"select"}
                                  name={"PlantId"}
                                  label={"Plant"}
                                  options={plantList}
                                  show={true}
                                  required={true}
                                  disable={isView || !isCreate}
                                  optionLabel={"PlantName"}
                                  optionValue={"PlantId"}
                                  handleSelect={handleSelect}
                                  formik={formik}
                                  fldStyle={"col-12 md:col-4"}
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
                                  fldStyle={"col-12 md:col-4"}
                                />

                                <FormFields
                                  type={"text"}
                                  name={"AreaName"}
                                  label={"Area Name"}
                                  options={""}
                                  show={true}
                                  required={true}
                                  disable={isView ? true : false}
                                  optionLabel={"AreaName"}
                                  optionValue={"AreaId"}
                                  handleSelect={""}
                                  formik={formik}
                                  fldStyle={"col-12 md:col-4"}
                                  maxLength={90}
                                />
                              </div>
                            </div>

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
                          </>
                        ) : (
                          <AppProgressSpinner />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Formik>
      <AppAlert toast={toast} />
    </>
  );
};

export default CArea;
