import { useRef, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Button } from "primereact/button";
import { useDispatch, useSelector } from "react-redux";

import {
  CreateInitialize,
  OnChangeCompany,
  Create,
  Update,
} from "@/redux/slices/master/instructionsSlice";
import FormFields from "@/components/FormFields";
import { Formik, useFormik } from "formik";
import { InstructionsValidationSchema } from "@/validations/Master";
import { Toast } from "@/assets/css/prime-library";
import { AppProgressSpinner } from "@/components/UtilityComp";

import { pageLoadScript } from "@/assets/js/common-utilities";
import AppAlert from "@/alert/alert";

import { Editor } from "primereact/editor";
import EditorStyle from "@/components/Common/EditorStyle";

const CInstructions = () => {
  const route = useHistory();
  const dispatch: any = useDispatch();
  const toast = useRef<Toast>(null);
  const [countryList, setCountryList] = useState([]);
  const [plantList, setPlantList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [disableSave, setDisableSave] = useState(false);
  const [text, setText] = useState("");
  const [checked, setChecked] = useState(false);


  useEffect(() => {
    pageLoadScript();
  });

  useEffect(() => {
    if (isCreate == false && HdrTable != null) {
      const data = {
        InstructionsId: HdrTable?.InstructionsId,
        Taskname: "CREATEINITIALIZE",
      };
      dispatch(CreateInitialize(data));
      //setStateList(StateList.filter(item => item.CountryId == HdrTable.CountryId));
      //setCityList(CityList.filter(item => item.StateId == HdrTable.StateId))
    }
    else {
      const data = {
        Taskname: "CREATEINITIALIZE",
        InstructionsId: 0,
      };
      dispatch(CreateInitialize(data));
    }
  }, []);

  const {
    allCompanies,
    createOrEdit,
    loading,
    error,
    CompanyList,
    StatusList,
    CountryList,
    PlantList,
    VisitorTypeList,
    InstructionsList,
    isView,
    isCreate,
    HdrTable,
    tableActions

  } = useSelector((state: any) => state.instructions);

  const formik: any = useFormik({
    initialValues: {
      InstructionsId: HdrTable != null ? HdrTable.InstructionsId : 0,
      CompanyId: HdrTable != null ? HdrTable.CompanyId : "",
      PlantId: HdrTable != null ? HdrTable.PlantId : "",
      Status: HdrTable != null ? HdrTable.Status : 1,
      VisitorTypeId: HdrTable != null ? HdrTable.VisitorTypeId : 35,
      Points: HdrTable != null ? HdrTable.Points : "",
      InstructionName: HdrTable != null ? HdrTable.InstructionName : "",
      IsEnabled: HdrTable != null ? HdrTable.IsEnabled : false,
      Version: HdrTable != null ? HdrTable.Version : 1,
    },
    validationSchema: InstructionsValidationSchema,
    onSubmit: (values: any, { resetForm }) => {


      let InstructionsFormValue = {
        Instruction: {
          InstructionsId: HdrTable != null ? HdrTable.InstructionsId : values.InstructionsId,
          CompanyId: values.CompanyId,
          PlantId: values.PlantId,
          Status: values.Status,
          VisitorTypeId: values.VisitorTypeId || 35,
          Points: values.Points,
          InstructionName: values.InstructionName,
          IsEnabled: values.IsEnabled,
          Version: values.Version
        },
      };

      if (HdrTable != null) {
        if (HdrTable.isCreate != false) {
          try {
            const updateRes = dispatch(Update(InstructionsFormValue));
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
                    route.push("/home/vInstructions");
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
          const createRes = dispatch(Create(InstructionsFormValue));
          createRes
            .then((res) => {
              setDisableSave(true);
              if (res.payload != null || !res.payload) {
                if (res.payload.transtatus.result == true) {
                  setDisableSave(false);
                  toast.current?.show({
                    severity: "success",
                    summary: "Success Message",
                    detail: res.payload.transtatus.lstErrorItem[0].Message,
                  });
                  resetForm();
                } else if (res.payload.transtatus.result == false) {
                  setDisableSave(false);

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
    formik.setFieldValue("TextInput", null);
  };

  const handleCompanySelect = (name, other, value) => {
    formik.setFieldValue("PlantId", null);
    //formik.setFieldValue("CityId", null);
    formik.setFieldValue(name, value);
    let obj = {
      Type: "OnChangeCompany",
      CompanyId: value,
    };
    var result = dispatch(OnChangeCompany(obj));
    result
      .then((res) => {
        setPlantList(res.payload.PlantList);
      })
      .catch((error) => {
        toast.current?.show({
          severity: "error",
          detail: "Error",
          summary: error,
        });
      });
    setPlantList([]);
  };

  const handleSelect = (name, other, value) => {
    formik.setFieldValue(name, value);
  };

  const renderHeader = () => {
    return (
      <EditorStyle />
    );
  };
  const header = renderHeader();
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
                  <h1>Terms & Conditions</h1>
                </div>
                <div className="md:col-6 text-right">
                  <div className="action-btn">
                    <>
                      <Button
                        label=""
                        title="Save"
                        icon="pi pi-save"
                        className="text-center"
                        disabled={isView || disableSave ? true : false}
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
                        route.push("/home/vInstructions");
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
                      <div className="grid ">
                        {!loading ? (
                          <>
                            <div className=" col-12 md:col-6">
                              <div className="md:flex">
                                <FormFields
                                  type={"text"}
                                  name={"InstructionName"}
                                  label={"Terms & Condition"}
                                  options={""}
                                  show={true}
                                  required={true}
                                  disable={isView ? true : false || isCreate ? false : true}
                                  optionLabel={""}
                                  optionValue={""}
                                  handleSelect={handleSelect}
                                  fldStyle={"md:col-6 "}
                                  formik={formik}
                                />
                                <FormFields
                                  type={"select"}
                                  name={"CompanyId"}
                                  label={"Company"}
                                  options={CompanyList}
                                  show={true}
                                  required={false}
                                  disable={isView ? true : false}
                                  optionLabel={"CompanyName"}
                                  optionValue={"CompanyId"}
                                  handleSelect={handleCompanySelect}
                                  formik={formik}
                                  fldStyle={"md:col-6 mt-2 md:mt-0"}
                                  showFilter={true}
                                />
                              </div>
                              <div className="md:flex">
                                <FormFields
                                  type={"select"}
                                  name={"PlantId"}
                                  label={"Plant"}
                                  options={plantList}
                                  show={true}
                                  required={false}
                                  disable={isView ? true : false}
                                  optionLabel={"PlantName"}
                                  optionValue={"PlantId"}
                                  handleSelect={handleSelect}
                                  formik={formik}
                                  fldStyle={"md:col-6 mt-2 md:mt-0"}
                                  showFilter={true}
                                />

                                <FormFields
                                  type={"select"}
                                  name={"VisitorTypeId"}
                                  label={"Visitor Type "}
                                  options={VisitorTypeList}
                                  show={true}
                                  required={false}
                                  disable={isView ? true : false}
                                  optionLabel={"MetaSubDescription"}
                                  optionValue={"MetaSubId"}
                                  handleSelect={handleSelect}
                                  fldStyle={"md:col-6"}
                                  formik={formik}
                                />



                              </div>
                              <div className="flex">
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
                                  fldStyle={"md:col-6 mt-2 md:mt-0"}
                                />
                                <FormFields
                                  type={"toggle"}
                                  name={"IsEnabled"}
                                  label={"Terms & Conditions Enabled"}
                                  options={""}
                                  show={true}
                                  required={false}
                                  disable={isView ? true : false}
                                  optionLabel={""}
                                  optionValue={""}
                                  handleSelect={""}
                                  formik={formik}
                                  fldStyle={"col"}
                                />
                              </div>
                            </div>
                            <div
                              className="card col-12 md:col-6"
                              style={{ textAlign: "center" }}
                            >
                              <Editor
                                name="Points"
                                value={formik.values.Points}
                                headerTemplate={header}
                                 className={`${isView ? "p-disabled": ""}`}
                                onTextChange={(e) => {
                                  formik.setFieldValue(
                                    "Points",
                                    e.htmlValue
                                  );
                                  setText(e.htmlValue);
                                }}
                                
                              
                                style={{ height: "320px", textAlign: "center" }}
                              />

                            </div>
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

export default CInstructions;
