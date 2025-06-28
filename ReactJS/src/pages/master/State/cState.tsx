import { useRef, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Button } from "primereact/button";
import { useDispatch, useSelector } from "react-redux";

import {
  createInit,
  createStates,
  updateStates,
} from "@/redux/slices/master/stateSlice";
import FormFields from "@/components/FormFields";
import { Formik, useFormik } from "formik";
import { StateValidationSchema } from "@/validations/Master";
import { Toast } from "@/assets/css/prime-library";
import { AppProgressSpinner } from "@/components/UtilityComp";
import { pageLoadScript } from "@/assets/js/common-utilities";
import { permissionService } from "@/services/PermissionService";
import AppAlert from "@/alert/alert";
import { tLDS } from "@/utils/utilFunc";

const CState = () => {
  const route = useHistory();
  const dispatch: any = useDispatch();
  const toast = useRef<Toast>(null);
  const [disableSave, setDisableSave] = useState(false);

  const [screenPermissions, setScreenPermissions] = useState<any>();

  useEffect(() => {
    pageLoadScript();
  });

  useEffect(() => {
    setScreenPermissions(permissionService({ screenId: 5 }));

    if (createEditData != null) {
      if (isCreate == false) {
        const data = {
          Stateid: createEditData.StateId,
          Taskname: "CreateInitialize",
        };
        dispatch(createInit(data));
      }
    } else {
      const data = {
        Stateid: 0,
        Taskname: "CreateInitialize",
      };
      dispatch(createInit(data));
    }
  }, []);

  useEffect(() => {
    
  });
  const allStates = useSelector((state: any) => state.states.states);
  const createOrEditState = useSelector((state: any) => state.states);
  const countryList = useSelector((state: any) => state.states.CountryList);
  const statusList = useSelector((state: any) => state.states.StatusList);

  const {
    isCreate,
    isView,
    createEditData,
    loading,
    error,
    StatusList,
    CountryList,
    HdrTable,
    StateUpdateRes,
  } = useSelector((state: any) => state.states);

  const formik: any = useFormik({
    initialValues: {
      CountryName: createEditData != null ? createEditData.CountryId : "",
      StateCode: createEditData != null ? createEditData.StateCode : "",
      StateName: createEditData != null ? createEditData.StateName : "",
      Status: createEditData != null ? createEditData.Status : 1,
    },
    validationSchema: StateValidationSchema,
    onSubmit: (values, { resetForm }) => {
      setDisableSave(true);
     let StateFormValue = {
        State: {
          countryid: values.CountryName,
          statename: values.StateName,
          statecode: createEditData != null ? createEditData.StateCode : "",
          status: values.Status,
          createdby:  HdrTable != null ? HdrTable.CreatedBy : localStorage["UserId"],
          createdon:HdrTable != null ? tLDS(HdrTable.CreatedOn) : tLDS(new Date()),
          modifiedby: HdrTable != null ? +localStorage["UserId"] : null,
          modifiedon: HdrTable != null ? tLDS(new Date()) : null,
          Stateid: createEditData != null ? createEditData.StateId : 0,
        },
      };
     

      if (createEditData != null) {
        if (createEditData.isCreate != false) {
          try {
            const updateRes = dispatch(updateStates(StateFormValue));
            updateRes.then((res) => {
              if (res.payload != null || !res.payload) {
                if (res.payload.transtatus.result == true) {
                  toast.current?.show({
                    severity: "success",
                    summary: "Success Message",
                    detail: res.payload.transtatus.lstErrorItem[0].Message,
                  });
                  setDisableSave(false);
                  resetForm();
                  setTimeout(() => {
                    route.push("/home/vState");
                  }, 800);
                } else if (res.payload.transtatus.result == false) {
                  setDisableSave(false);

                  toast.current?.show({
                    severity: "error",
                    summary: "Error Message",
                    detail: res.payload.transtatus.lstErrorItem[0].Message,
                  });
                }
              }
            });
          } catch (err) {
            setDisableSave(false);

            toast.current?.show({
              severity: "warn",
              summary: "Error Message",
              detail: err,
            });
          }
        }
      } else {
        try {
          const createRes = dispatch(createStates(StateFormValue));
          createRes
            .then((res) => {
              if (res.payload != null || !res.payload) {
                if (res.payload.transtatus.result == true) {
                  toast.current?.show({
                    severity: "success",
                    summary: "Success Message",
                    detail: res.payload.transtatus.lstErrorItem[0].Message,
                  });
                  setDisableSave(false);

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
              setDisableSave(false);

              toast.current?.show({
                severity: "warn",
                summary: "Error Message",
                detail: JSON.stringify(err.payload),
              });
            });
        } catch (err) {
          setDisableSave(false);

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
                  <h1>State</h1>
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
                      // disabled={!screenPermissions._View}
                      onClick={() => {
                        route.push("/home/vState");
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
                              name={"CountryName"}
                              label={"Country Name"}
                              options={countryList}
                              show={true}
                              required={true}
                              disable={isView || !isCreate}
                              optionLabel={"CountryName"}
                              optionValue={"CountryId"}
                              handleSelect={handleSelect}
                              fldStyle={"col-12 md:col-3"}
                              showFilter={true}
                              formik={formik}
                            />
                            <FormFields
                              type={"text"}
                              name={"StateCode"}
                              label={"State Code"}
                              options={""}
                              show={isCreate == false ? true : false}
                              required={true}
                              disable={
                                isView || isCreate == false ? true : false
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
                              name={"StateName"}
                              label={"State Name"}
                              show={true}
                              required={true}
                              disable={isView ? true : false}
                              optionLabel={""}
                              optionValue={""}
                              handleSelect={""}
                              handleKeyPress={handleKeyPress}
                              fldStyle={"col-12 md:col-3"}
                              formik={formik}
                            />
                            <FormFields
                              type={"select"}
                              name={"Status"}
                              label={"Status"}
                              options={statusList}
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
                              showFilter={false}
                              showClear={false}
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

export default CState;
