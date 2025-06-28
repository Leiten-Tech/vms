import { useState, useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Button } from "primereact/button";
import { Rating } from "primereact/rating";
import { InputText } from "primereact/inputtext";
import { useDispatch, useSelector } from "react-redux";

import AppTable from "@/components/AppTable";

import {
  CreateInitialize,
  Create,
  Update,
} from "@/redux/slices/master/roleSlice";
import FormFields from "@/components/FormFields";
import { Formik, useFormik } from "formik";
import { RoleValidationSchema } from "@/validations/Master";
import { Toast } from "@/assets/css/prime-library";
import { AppProgressSpinner } from "@/components/UtilityComp";
import { pageLoadScript } from "@/assets/js/common-utilities";
import AppAlert from "@/alert/alert";
import { tLDS } from "@/utils/utilFunc";

const CRole = () => {
  const route = useHistory();
  const dispatch: any = useDispatch();
  const toast = useRef<Toast>(null);

  useEffect(() => {
    pageLoadScript();
  });

  const [desgOpt, setDesgOpt] = useState([
    {
      name: "IsDesignation",
      key: true,
    },
  ]);

  useEffect(() => {
    if (HdrTable != null) {
      if (isCreate == false) {
        const data = {
          RoleId: HdrTable.RoleId,
          Taskname: "CREATEINITIALIZE",
          CompanyId: +localStorage["CompanyId"],
          PlantId: +localStorage["PlantId"],
        };
        dispatch(CreateInitialize(data));
      }
    } else {
      const data = {
        RoleId: 0,
        Taskname: "CREATEINITIALIZE",
        CompanyId: +localStorage["CompanyId"],
        PlantId: +localStorage["PlantId"],
      };
      dispatch(CreateInitialize(data));
    }
  }, []);

  const {
    isCreate,
    isView,
    createEditData,
    createOrEdit,
    loading,
    error,
    RoleCreateRes,
    RoleUpdateRes,
    StatusList,
    RoleList,
    HdrTable,
  } = useSelector((state: any) => state.role);

  const formik: any = useFormik({
    initialValues: {
      RoleId: HdrTable != null ? HdrTable.RoleId : 0,
      RoleCode: HdrTable != null ? HdrTable.RoleCode : "",
      RoleName: HdrTable != null ? HdrTable.RoleName : "",
      CompanyId: localStorage["CompanyId"],
      PlantId: localStorage["PlantId"],
      Status: HdrTable != null ? HdrTable.Status : 1,
      CreatedBy: HdrTable != null ? HdrTable.CreatedBy : localStorage["UserId"],
      CreatedOn: HdrTable != null ? tLDS(HdrTable.CreatedOn || new Date()) : tLDS(new Date()),
      ModifiedBy: HdrTable != null ? localStorage["UserId"] : null,
      ModifiedOn: HdrTable != null ? tLDS(new Date()) : null,
      IsDesignation: HdrTable != null ? HdrTable.IsDesignation : true,
      IsSystemGenerated: HdrTable != null ? HdrTable.IsSystemGenerated : false,
    },
    validationSchema: RoleValidationSchema,
    onSubmit: (values: any, { resetForm }) => {
      let RoleFormValue = {
        Role: values,
      };

      if (HdrTable != null) {
        if (HdrTable.isCreate != false) {
          try {
            const updateRes = dispatch(Update(RoleFormValue));
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
                    route.push("/home/vRole");
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
          const createRes = dispatch(Create(RoleFormValue));
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

  const handleSelect = (name, other, value) => {
    formik.setFieldValue(name, value);
  };

  const handleKeyPress = (e) => {
    const inputValue = e.target.value;
    if (inputValue.length >= 10) {
      e.preventDefault();
    }
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
                  <h1>Role</h1>
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
                        route.push("/home/vRole");
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
                              name={"RoleCode"}
                              label={"Role Code"}
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
                              onKeyPress={handleKeyPress}
                              fldStyle={"col-12 md:col-3"}
                              formik={formik}
                            />
                            <FormFields
                              type={"text"}
                              name={"RoleName"}
                              label={"Role Name"}
                              show={true}
                              required={true}
                              disable={isView ? true : false}
                              optionLabel={""}
                              optionValue={""}
                              handleSelect={""}
                              handleKeyPress={handleKeyPress}
                              fldStyle={"col-12 md:col-3"}
                              formik={formik}
                              maxLength={"30"}
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
                              type={"checkbox"}
                              name={"IsDesignation"}
                              label={"Is Designation"}
                              options={""}
                              show={false}
                              required={true}
                              disable={isView ? true : false}
                              optionLabel={""}
                              optionValue={""}
                              fldStyle={"col-12 md:col-4"}
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

export default CRole;
