import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";

import { Formik, Form, Field, ErrorMessage, useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import BasicDemo from "../../../alert/alert";
import {
  createInit,
  create,
  update,
  OnChangeCountry,
} from "@/redux/slices/master/citySlice";
import { Button, Dropdown, InputText } from "@/assets/css/prime-library";
import { pageLoadScript } from "@/assets/js/common-utilities";
import { AppProgressSpinner } from "@/components/UtilityComp";
import FormFields from "@/components/FormFields";
import { Toast } from "@/assets/css/prime-library";
import AppAlert from "@/alert/alert";
import { tLDS } from "@/utils/utilFunc";
import { Rating } from "primereact/rating";
import { Create, CreateInit } from "@/redux/slices/master/feedbackSlice";
import { textAlign } from "html2canvas/dist/types/css/property-descriptors/text-align";
import { ShowPass } from "@/redux/slices/visitorManagement/visitorentrySlice";
import { DecryptData } from "@/redux/slices/master/workFlowSlice";

const StarRatingEl = (props) => {
  const {
    name,
    label,
    type,
    show,
    required,
    disable,
    optionDisable,
    formik,
    optionLabel,
    optionValue,
    handleSelect,
    handleKeyPress,
    maxLength,
    maxSelectedLabels,
    titleInputholder,
    titleInputName,
    minDate,
    maxDate,
    options,
    fldStyle,
    formName,
    autoSearch,
    autoSuggestions,
    autoCompleteLbl,
    showTime,
    hourFormat,
    timeOnly,
    handleChange,
    showFilter,
    showClear,
    minFractionDigits,
    maxFractionDigits,
    min,
    max,
    mode,
    qrValue,
    qrSize,
    btnClick,
    selectionMode,
    calShowIcon,
    placeHolder,
    value,
    ...rest
  } = props;
  return (
    <>
      <div
        style={
          show
            ? null
            : {
                display: "none",
              }
        }
        className={fldStyle}
        key={name}
      >
        <label className="form-label">
          {label}
          {required ? <span className="hlt-txt"></span> : null}
          &nbsp;
        </label>
        <div className="card flex justify-content-left">
          <Rating
            name={name}
            value={value}
            onChange={handleChange}
            disabled={disable}
            color="lightblue"
            style={{
              color: "red",
            }}
          />
        </div>
      </div>
      {/* <small className="p-error text-sm">
        {
          (formName && formName.length > 0
            ? formik.touched &&
              formik.touched[formName] &&
              formik.touched[formName][name]
            : formik.touched && formik.touched[name]) &&
            (formName && formName.length > 0
              ? formik.errors &&
                formik.errors[formName] &&
                formik.errors[formName][name]
              : formik.errors && formik.errors[name])
          // (formName && formName.length > 0 ? (formik.errors && Object.keys(formik.errors).length > 0 ? formik.errors[formName][name] : null) : (formik.errors && Object.keys(formik.errors).length > 0 ? formik.errors[name] : null))
        }
      </small> */}
    </>
  );
};

const CFeedback = () => {
  const dispatch: any = useDispatch();
  const toast = useRef<Toast>(null);
  const route = useHistory();
  function useQuery() {
    const { search } = useLocation();

    return useMemo(() => new URLSearchParams(search), [search]);
  }
  const query = useQuery();

  const [feedbackGroups, setFeedbackGroups] = useState([]);
  const [currentPath, setcurrentPath] = useState(false);
  const [feedbackDetail, setFeedbackDetail] = useState([]);
  const [value, setValue] = useState(null);
  const {
    isCreate,
    isView,
    createEditData,
    loading,
    error,
    HdrTable,
    CountryList,
    StatusList,
    FeedbackGroups,
    CityList,
    OnChangeCountryList,
  } = useSelector((state: any) => state.feedback);

  useEffect(() => {
    setcurrentPath(route.location.pathname == "/home/Feedback" ? true : false);

    pageLoadScript();
  });

  useEffect(() => {
    if (isCreate == true) {
      const data = {
        FeedbackId: 0,
        Taskname: "CREATEINITIALIZE",
        CompanyId: localStorage["CompanyId"] || null,
      PlantId: +localStorage["PlantId"] || null,
      RoleId: +localStorage["DefaultRoleId"] || null,
      };
      var result = dispatch(CreateInit(data));
      result
        .then((res) => {
          if (res.payload.tranStatus.result) {
            if (
              res.payload.FeedbackGroups &&
              res.payload.FeedbackGroups.length &&
              res.payload.FeedbackGroups.length > 0
            ) {
              // New list initialValues
              const initialList = {
                FeedbackDetailId: 0,
                CompanyId: +localStorage["CompanyId"],
                PlantId: +localStorage["PlantId"],
                FeedbackId: 0,
                FeedbackType: null,
                StarRating: null,
                Status: 1,
              };

              // Combine lists
              const combinedList = res.payload.FeedbackGroups.map((group) => ({
                ...initialList,
                MetaSubId: group.MetaSubId,
                MetaSubDescription: group.MetaSubDescription,
                FeedbackType: group.MetaSubId,
              }));

              setFeedbackGroups(combinedList);
            }
          } else {
            toast.current?.show({
              severity: "error",
              summary: "Error Message",
              detail: res.payload.tranStatus.lstErrorItem[0].Message,
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
    } else if (createEditData != null) {
      const data = {
        FeedbackId: createEditData.FeedbackId,
        Taskname: "CREATEINITIALIZE",
        CompanyId: localStorage["CompanyId"] || null,
      PlantId: +localStorage["PlantId"] || null,
      RoleId: +localStorage["DefaultRoleId"] || null,
      };
      var result = dispatch(CreateInit(data));
      result
        .then((res) => {
          if (res.payload.tranStatus.result) {
            if (
              res.payload.FeedbackGroups &&
              res.payload.FeedbackGroups.length &&
              res.payload.FeedbackGroups.length > 0
            ) {
              // New list initialValues

              // Combine lists
              const combinedList = res.payload.FeedbackDetail.map((group) => ({
                ...group,
                MetaSubId: group.FeedbackType,
                MetaSubDescription: res.payload.FeedbackGroups.filter(
                  (item) => item.MetaSubId == group.FeedbackType
                )[0]?.MetaSubDescription,
              }));

              setFeedbackGroups(combinedList);
              formik.setFieldValue(
                "FeedbackDesc",
                res.payload.FeedbackHdr.FeedbackDesc
              );
            }
          } else {
            toast.current?.show({
              severity: "error",
              summary: "Error Message",
              detail: res.payload.tranStatus.lstErrorItem[0].Message,
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
  }, []);

  const formik: any = useFormik({
    initialValues: {
      FeedbackId: HdrTable != null ? HdrTable.FeedbackId : 0,
      FeedbackCode: HdrTable != null ? HdrTable.FeedbackCode : null,
      FeedbackDesc: HdrTable != null ? HdrTable.FeedbackDesc : "",
      UserId: HdrTable != null ? HdrTable.UserId : "",
      CompanyId:
        HdrTable != null ? HdrTable.CompanyId : localStorage["CompanyId"],
      PlantId: HdrTable != null ? HdrTable.PlantId : localStorage["PlantId"],
      Status: HdrTable != null ? HdrTable.Status : 1,
      CreatedBy: HdrTable != null ? HdrTable.CreatedBy : localStorage["UserId"],
      CreatedOn: HdrTable != null ? tLDS(HdrTable.CreatedOn) : tLDS(new Date()),
      ModifiedBy: HdrTable != null ? localStorage["UserId"] : null,
      ModifiedOn: HdrTable != null ? tLDS(new Date()) : null,
    },
    onSubmit: (values: any, { resetForm }) => {
      if (values.FeedbackDesc == "" || values.FeedbackDesc.length < 1) {
        toast.current?.show({
          severity: "warn",
          summary: "Error Message",
          detail: "Please Enter Description",
        });
        return;
      }
      let FeedbackFormValue = {
        Feedback: values,
      };

      if (HdrTable != null) {
        if (HdrTable.isCreate != false) {
          try {
            const updateRes = dispatch(update(FeedbackFormValue));
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
                    route.push("/home/vFeedbackReport");
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
          const createRes = dispatch(create(FeedbackFormValue));
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

  const resetAllForms = (event) => {
    event.preventDefault();
    formik.resetForm();
    setFeedbackGroups(
      feedbackGroups.map((item) => ({
        ...item,
        StarRating: 0,
      }))
    );
  };

  const handleSelect = (event) => {
    let updatedFeedbackDetail = [...feedbackGroups];
    const existingEntryIndex = updatedFeedbackDetail.findIndex(
      (item) => item.MetaSubId === event.target.name
    );

    if (existingEntryIndex !== -1) {
      updatedFeedbackDetail[existingEntryIndex].StarRating = event.target.value;
      updatedFeedbackDetail[existingEntryIndex].FeedbackType =
        event.target.name;
    }
    setFeedbackGroups(updatedFeedbackDetail);
  };

  useEffect(() => {
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    if (
      formik.values.FeedbackDesc == "" ||
      formik.values.FeedbackDesc.length < 1
    ) {
      toast.current?.show({
        severity: "warn",
        summary: "Warning Message",
        detail: "Please Enter Some Description",
      });
      return;
    }
    if(query.get("encrypted") != null && query.get("encrypted") != "") {

    const dSendPass = dispatch(DecryptData(query.get("encrypted")));
    dSendPass
      .then((res) => {
        if (
          res.payload.hasOwnProperty("tranStatus") &&
          res.payload.tranStatus.result
        ) {
          const dataReq = res.payload.VisitorEntryHeader.split("_");
          const CompanyId = dataReq[0];
          const VisitorEntryDetailId = dataReq[1];
          const PlantId = dataReq[2];
          const VisitorEntryCode = dataReq[3];
          const VisitorTypeId = dataReq[4];
          const VisitorEntryId = dataReq[5];
          let obj = {
            VisitorEntryId: VisitorEntryId,
            VisitorEntryCode: VisitorEntryCode,
            DetailId: VisitorEntryDetailId,
            CompanyId: CompanyId,
            PlantId: PlantId,
            VisitorTypeId: VisitorTypeId,
          };

          formik.values.UserId = VisitorEntryDetailId;
          formik.values.CompanyId = CompanyId;
          formik.values.PlantId = PlantId;
          let FeedbackHdr = formik.values;

          feedbackGroups.forEach((item) => {
            item.PlantId = +PlantId;
            item.CompanyId = +CompanyId;
          });
          setFeedbackGroups([...feedbackGroups]);
          let Feedback = {
            Feedback: FeedbackHdr,
            FeedbackDetail: feedbackGroups,
          };

          var createRes;
          if (createEditData == null) {
            createRes = dispatch(Create(Feedback));
          }
          createRes
            .then((res) => {
              if (res.payload.tranStatus.result == true) {
                
                toast.current?.show({
                  severity: "success",
                  summary: "Success Message",
                  detail: res.payload.tranStatus.lstErrorItem[0].Message,
                });
                resetAllForms(event);
                setTimeout(() => {
                  route.push(
                    `/home/print`
                  )
                }, 4000)
                return;
              } else {
                toast.current?.show({
                  severity: "warn",
                  summary: "Warning Message",
                  detail: res.payload.tranStatus.lstErrorItem[0].Message,
                });
              }
            })
            .catch((err) => {
              toast.current?.show({
                severity: "warn",
                summary: "Error Message",
                detail: JSON.stringify(err.payload),
              });
            });
        }
      })
      .catch((err) => {});
    }
    else {
      toast.current?.show({
        severity: "warn",
        summary: "Warning Message",
        detail: "Invalid Link, Please Load Valid Link.",
      });
    }

  };

  return (
    <>
      <Formik
        initialValues={formik.initialValues}
        onSubmit={formik.handleSubmit}
      >
        <div className={currentPath ? "" : "page-container"}>
          <div
            className={`inner-page-container `}
            style={{
              height: currentPath ? "100vh" : "",
              overflowY: currentPath ? "auto" : "initial",
            }}
          >
            <div className="page-title">
              <div className="grid grid-nogutter">
                <div className="md:col-6">
                  <h1>Feedback</h1>
                </div>
                {currentPath ? null : (
                  <div className="md:col-6 text-right">
                    <div className="action-btn">
                      <>
                        <Button
                          label=""
                          title="Save"
                          icon="pi pi-save"
                          className="text-center"
                          type="submit"
                          onClick={(e) => handleSubmit(e)}
                          disabled={isView ? true : false}
                        />
                        <Button
                          label=""
                          severity="danger"
                          icon="pi pi-trash"
                          title="Clear"
                          className="text-center"
                          disabled={isView || isCreate == false ? true : false}
                          onClick={(e) => resetAllForms(e)}
                        />
                      </>
                      <Button
                        label=""
                        icon="pi pi-search"
                        title="Back to Search"
                        className="p-button p-button-success text-center"
                        onClick={() => {
                          route.push("/home/vFeedbackReport");
                        }}
                      />
                    </div>
                  </div>
                )}
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
                            {feedbackGroups && feedbackGroups.length > 0
                              ? feedbackGroups.map((item, index) => {
                                  return (
                                    <StarRatingEl
                                      key={index}
                                      name={item.MetaSubId}
                                      label={item?.MetaSubDescription}
                                      fldStyle={"col-12 md:col-3"}
                                      options={""}
                                      show={true}
                                      required={true}
                                      disable={isView}
                                      optionLabel={""}
                                      optionValue={""}
                                      value={item.StarRating}
                                      handleChange={handleSelect}
                                      onKeyPress={() => {}}
                                    />
                                  );
                                })
                              : null}

                            <FormFields
                              type={"textarea"}
                              name={"FeedbackDesc"}
                              label={"Feedback Description"}
                              options={""}
                              show={true}
                              required={true}
                              disable={isView}
                              optionLabel={""}
                              optionValue={""}
                              handleSelect={""}
                              formik={formik}
                              fldStyle={"col-12 md:col-3"}
                              maxLength="500"
                            />
                          </>
                        ) : (
                          <AppProgressSpinner />
                        )}
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      currentPath ? "pb-2 pr-2 text-right" : "action-btn"
                    }
                  >
                    {currentPath && (
                      <>
                        <Button
                          label="Clear"
                          severity="danger"
                          icon="pi pi-trash"
                          title="Clear"
                          type="submit"
                          className="text-center"
                          disabled={isView || isCreate == false ? true : false}
                          onClick={(e) => resetAllForms(e)}
                        />
                        <Button
                          label="Save"
                          title="Save"
                          icon="pi pi-save"
                          className="text-center"
                          type="submit"
                          onClick={(e) => handleSubmit(e)}
                          disabled={isView ? true : false}
                        />
                      </>
                    )}
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

export default CFeedback;
