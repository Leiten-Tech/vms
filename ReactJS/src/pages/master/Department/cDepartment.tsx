import { useState, useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Button } from "primereact/button";
import { useDispatch, useSelector } from "react-redux";
import {
  CreateInitialize,
  SearchInitialize,
  Create,
  Update,
} from "@/redux/slices/master/departmentSlice";
import FormFields from "@/components/FormFields";
import { Formik, useFormik } from "formik";
import { DepartmentValidationSchema } from "@/validations/Master";
import { Toast } from "@/assets/css/prime-library";
import { AppProgressSpinner } from "@/components/UtilityComp";
import { pageLoadScript } from "@/assets/js/common-utilities";
import AppAlert from "@/alert/alert";
import { tLDS } from "@/utils/utilFunc";

const CDepartment = () => {
  const route = useHistory();
  const dispatch: any = useDispatch();
  const toast = useRef<Toast>(null);

  useEffect(() => {
    if (isCreate == true) {
      const data = {
        Type: "CreateInitialize",
        CompanyId: +localStorage["CompanyId"],
        PlantId: +localStorage["PlantId"],
        RoleId: +localStorage["DefaultRoleId"],
        DeptId: 0,
      };
      dispatch(CreateInitialize(data));
    }
  }, []);

  const {
    isCreate,
    isView,
    createOrEdit,
    DepartmentList,
    loading,
    error,
    StatusList,
    HdrTable,
    UserList
  } = useSelector((state: any) => state.department);

  const formik: any = useFormik({
    initialValues: {
      DepartmenttId: HdrTable != null ? HdrTable.DepartmentId : 0,
      DepartmentCode: HdrTable != null ? HdrTable.DepartmentCode : "",
      DepartmentName: HdrTable != null ? HdrTable.DepartmentName : "",
      Hod: HdrTable != null ? HdrTable.Hod : "",
      Status: HdrTable != null ? HdrTable.Status : 1,
    },
    validationSchema: DepartmentValidationSchema,
    onSubmit: (values: any, { resetForm }) => {
      let DepartmentFormValue = {
        Department: {
          DepartmentId: HdrTable != null ? HdrTable.DepartmentId : 0,
          DepartmentName: values.DepartmentName,
          DepartmentCode: HdrTable != null ? HdrTable.DepartmentCode : "",
          Hod: values.Hod,
          CompanyId: localStorage["CompanyId"],
          PlantId: localStorage["PlantId"],
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
            const updateRes = dispatch(Update(DepartmentFormValue));
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
                    route.push("/home/vDepartment");
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
          const createRes = dispatch(Create(DepartmentFormValue));
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
  };

  useEffect(() => {
    pageLoadScript();
  });

  const handleSelect = (name, other, value) => {
    formik.setFieldValue(name, value);
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
                  <h1>Department</h1>
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
                        disabled={isView || isCreate == false ? true : false}
                        className="text-center"
                        onClick={() => resetForm()}
                      />
                    </>
                    <Button
                      label=""
                      icon="pi pi-search"
                      title="Back to Search"
                      className="p-button p-button-success text-center"
                      onClick={() => {
                        route.push("/home/vDepartment");
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
                            <FormFields
                              type={"text"}
                              name={"DepartmentCode"}
                              label={"Department Code"}
                              options={""}
                              show={
                                isCreate == null || isCreate == false
                                  ? true
                                  : false
                              }
                              required={true}
                              disable={
                                isView || isCreate == false || isCreate != null
                                  ? true
                                  : false
                              }
                              optionLabel={""}
                              optionValue={""}
                              handleSelect={""}
                              fldStyle={"col-12 md:col-3"}
                              formik={formik}
                            />
                            <FormFields
                              type={"text"}
                              name={"DepartmentName"}
                              label={"Department Name"}
                              show={true}
                              required={true}
                              disable={isView ? true : false}
                              optionLabel={"DepartmentName"}
                              optionValue={"DepartmentId"}
                              handleSelect={""}
                              fldStyle={"col-12 md:col-3"}
                              formik={formik}
                              maxLength={90}
                            />
                            <FormFields
                              type={"select"}
                              name={"Hod"}
                              label={"Head Of Department"}
                              options={UserList}
                              show={true}
                              required={true}
                              disable={isView ? true : false}
                              optionLabel={"UserName"}
                              optionValue={"UserId"}
                              handleSelect={handleSelect}
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
                              fldStyle={"col-12 md:col-3"}
                              handleSelect={handleSelect}
                              formik={formik}
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

export default CDepartment;
