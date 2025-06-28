import React, { useState, useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Button } from "primereact/button";
import { Rating } from "primereact/rating";
import { InputText } from "primereact/inputtext";
import { useDispatch, useSelector } from "react-redux";

import AppTable from "@/components/AppTable";
import PageHeader from "@/components/PageHeader";
import {
  createInit,
  createNumberingSchema,
  updateNumberingSchema,
} from "@/redux/slices/master/numberingShemaSlice";
import FormFields from "@/components/FormFields";
import { Formik, useFormik } from "formik";
import { NumberingSchemaValidationSchema, StateValidationSchema } from "@/validations/Master";
import { Dropdown, Toast } from "@/assets/css/prime-library";
import { pageLoadScript } from "@/assets/js/common-utilities";
import { AppProgressSpinner } from "@/components/UtilityComp";
import AppAlert from "@/alert/alert";

const CNumberingShema = () => {
  const route = useHistory();
  const dispatch: any = useDispatch();
  const toast = useRef<Toast>(null);

  useEffect(() => {
    pageLoadScript();
  });
  
 
  useEffect(() => {
    if (NumberingSchema != null) {
      if (isCreate == false) {
        const data = {
          NumberingSchemaId: NumberingSchema.NumberingSchemaId,
          Taskname: "CREATEINITIALIZE",
        };
        dispatch(createInit(data));
      }
    } else {
      const data = {
        NumberingSchemaId: 0,
        Taskname: "CREATEINITIALIZE",
      };
      dispatch(createInit(data));
    }
  }, []);

  
  
  const {createTranstatus, 
    numberingSchemaUpdateList, 
   createOrEdit ,
   DocumentList,
   error,
   SymbolList,
   DateFormatList ,
   StatusList, 
   NumberingSchema,
   loading,
   isView,
   isCreate} = useSelector((state: any) => state.numberingSchema); 
  


  const formik: any = useFormik({
    initialValues: {
      Document:
      NumberingSchema != null
          ? NumberingSchema.DocumentId   
          : "",
      EnterPrefix:
      NumberingSchema != null
          ? NumberingSchema.Prefix
          : "",
      SymbolFields:
      NumberingSchema != null
      ? NumberingSchema.SymbolId
      : "",
      DateFormat :
      NumberingSchema != null
          ? NumberingSchema.DateFormat
          : "",
      Entersuffix :
      NumberingSchema != null
          ? NumberingSchema.Suffix
          : "",
      Status :
      NumberingSchema != null
          ? NumberingSchema.Status
          : 1,
    },
     validationSchema: NumberingSchemaValidationSchema,
    onSubmit: (values :any, { resetForm }) => {
      let NumberingSchemaFormValue = {
     NumberingSchema: {
        NumberingSchemaId:NumberingSchema != null?NumberingSchema.NumberingSchemaId:0,
        PlantId: 1,
        DocumentId:values.Document,
        Prefix: values.EnterPrefix,
        SymbolId: values.SymbolFields,
        Suffix: values.Entersuffix,
        Createdby: 1,
        Createdon: new Date(),
        Modifiedby: 2,
        Modifiedon:new Date(),
        Status:values.Status,
        DateFormat:values.DateFormat
    }
      };

    if (NumberingSchema != null) {
        if (NumberingSchema.isCreate != false) {
          try {
            const updateRes = dispatch(updateNumberingSchema(NumberingSchemaFormValue));
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
                    route.push("/home/vNumberingSchema");
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
          const createRes = dispatch(createNumberingSchema(NumberingSchemaFormValue));
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

  const handleSelect = (name, other, value) => {
    formik.setFieldValue(name, value);
  };

  const resetForm = () => {
    formik.resetForm();
   
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
                  <h1>Numbering Schema</h1>
                </div>
                <div className="md:col-6 text-right">
                  <div className="action-btn">
                    <>
                      <Button
                        label=""
                        title="Save"
                        icon="pi pi-save"
                        disabled={isView ? true : false}
                        className="text-center"
                        type="submit"
                        onClick={() => formik.handleSubmit()}
                      />
                      <Button
                        label=""
                        severity="danger"
                        icon="pi pi-trash"
                        disabled={isView || isCreate == false ? true : false}
                        title="Clear"
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
                        route.push("/home/vNumberingSchema");
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
                              type={"select"}
                              name={"Document"}
                              label={"Document"}
                              options={DocumentList}
                              show={true}
                              required={true}
                              disable={isView ? true : false}
                              optionLabel={"FunctionName"}
                              optionValue={"FunctionId"}
                              handleSelect={handleSelect}
                              fldStyle={"col-12 md:col-3"}
                              formik={formik}
                            />
                             <FormFields
                              type={"text"}
                              name={"EnterPrefix"}
                              label={"Enter Prefix"}
                              options={""}
                              show={true}
                              required={true}
                              disable={isView ? true : false}
                              optionLabel={""}
                              optionValue={""}
                              handleSelect={""}
                              formik={formik}
                              fldStyle={"col-12 md:col-3"}
                              maxLength={8}
                            />
                             <FormFields
                              type={"select"}
                              name={"SymbolFields"}
                              label={"Symbol Fields"}
                              options={SymbolList}
                              show={true}
                              required={true}
                              disable={isView ? true : false}
                              optionLabel={"MetaSubDescription"}
                              optionValue={"MetaSubId"}
                              handleSelect={handleSelect}
                              formik={formik}
                              fldStyle={"col-12 md:col-3"}
                            />
                             <FormFields
                              type={"select"}
                              name={"DateFormat"}
                              label={"Date Format"}
                              options={DateFormatList}
                              show={true}
                              required={true}
                              disable={isView ? true : false}
                              optionLabel={"MetaSubDescription"}
                              optionValue={"MetaSubId"}
                              handleSelect={handleSelect}
                              fldStyle={"col-12 md:col-3"}
                              formik={formik}
                              
                            />
                             <FormFields
                              type={"text"}
                              name={"Entersuffix"}
                              label={"Enter suffix"}
                              options={""}
                              show={true}
                              required={true}
                              disable={ isView ? true : false}
                              optionLabel={""}
                              optionValue={""}
                              handleSelect={""}
                              fldStyle={"col-12 md:col-3"}
                              formik={formik}
                              maxLength={8}
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
                              fldStyle={"col-12 md:col-3"}
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

export default CNumberingShema;
