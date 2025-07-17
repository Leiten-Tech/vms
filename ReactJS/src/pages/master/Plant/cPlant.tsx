import { useState, useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Button } from "primereact/button";
import { useDispatch, useSelector } from "react-redux";
import {
  CreateInitialize,
  OnChangeCountry,
  OnChangeState,
  OnChangeDepartment,
  Create,
  Update,
} from "@/redux/slices/master/plantSlice";
import { NotificationDetailValidationSchema } from "@/validations/Master";
import FormFields from "@/components/FormFields";
import { Formik, useFormik } from "formik";
import { PlantValidationSchema } from "@/validations/Master";
import {
  Toast,
  Column,
  DataTable,
  Calendar,
  Checkbox,
  Dialog,
  Dropdown,
  FileUpload,
  FilterMatchMode,
  InputText,
  Sidebar,
  Tooltip,
} from "@/assets/css/prime-library";
import { AppProgressSpinner } from "@/components/UtilityComp";
import AppAlert from "@/alert/alert";
import { TabView, TabPanel } from "primereact/tabview";
import { tLDS } from "@/utils/utilFunc";
import { pageLoadScript } from "@/assets/js/common-utilities";
import { EncryptData } from "@/redux/slices/master/workFlowSlice";

const CPlant = () => {
  const route = useHistory();
  const dispatch: any = useDispatch();
  const toast = useRef<Toast>(null);
  const [countryList, setCountryList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [tempUserListSecondary, setTempUserListSecondary] = useState([]);
  const [tempUserList, setTempUserList] = useState([]);
  const [cityList, setCityList] = useState([]);
  // const [DepartmentList, setDepartmentList] = useState([]);
  const [rowIndex, setRowIndex] = useState(-1);
  const [rowselect, setRowSelect] = useState(false);
  const [plantNotifyDetailList, setPlantNotifyDetailList] = useState([]);

  const {
    isCreate,
    isView,
    createOrEdit,
    CompanyList,
    PlantList,
    PlantTypeList,
    loading,
    CountryList,
    CityList,
    StateList,
    error,
    StatusList,
    LevelList,
    DepartmentList,
    HdrTable,
    DetailList,
    PrimaryUserList,
  } = useSelector((state: any) => state.plant);

  useEffect(() => {
    pageLoadScript();
  });

  useEffect(() => {
    if (isCreate == true) {
      const data = {
        Type: "CreateInitialize",
        PlantId: 0,
        CompanyId: +localStorage["CompanyId"],
        RoleId: +localStorage["DefaultRoleId"],
      };
      dispatch(CreateInitialize(data));
    }
    setStateList(StateList);
    setCityList(CityList);
  }, []);

  const generateQrCodes = (data) => {
    if (
      localStorage.getItem("data_companyList") &&
      localStorage.getItem("data_companyList") != null &&
      localStorage.getItem("data_companyList") != "null"
    ) {
      let decodedTokenVal: any = JSON.parse(
        localStorage.getItem("data_companyList")
      )[0];
      let decPntTokenVal: any = JSON.parse(
        localStorage.getItem("data_LoggedPlant")
      );
      var dataObj = {
        PlantId: data.PlantId,
        CompanyId: data.CompanyId,
        GateId: +localStorage["GateId"],
        CheckToken: decodedTokenVal.CheckToken,
        PlantCheckToken: decPntTokenVal.CheckToken,
      };
      const encryptData = dispatch(EncryptData(JSON.stringify(dataObj)));
      encryptData
        .then((res) => {
          if (
            res.payload.hasOwnProperty("tranStatus") &&
            res.payload.tranStatus.result
          ) {
            formik.setFieldValue("UrlToken", res.payload.VisitorEntryHeader);

            data.UrlToken = res.payload.VisitorEntryHeader;
            let plantUpdate = {
              Plant: data,
            };
            const updateRes = dispatch(Update(plantUpdate));
            updateRes.then((res) => {
              if (res.payload != null || !res.payload) {
                if (res.payload.transtatus.result == true) {
                } else if (res.payload.transtatus.result == false) {
                }
              }
            });
          }
        })
        .catch((err) => {});
    }
  };

  const validatePlantTabBeforeSwitch = async (index) => {
    if (index === 1) {
      const errors = await formik.validateForm();
      // if (Object.keys(errors).length > 0) {
      //   toast.current?.show({
      //     severity: "warn",
      //     summary: "Please fill all required Plant fields before proceeding.",
      //   });
      //   return;
      // }
    }
    setActiveIndex(index);
  };

  const formik: any = useFormik({
    initialValues: {
      CompanyId: HdrTable != null ? HdrTable.CompanyId : "",
      PlantCode: HdrTable != null ? HdrTable.PlantCode : "",
      PlantType: HdrTable != null ? HdrTable.PlantType : "",
      PlantName: HdrTable != null ? HdrTable.PlantName : "",
      CountryId: HdrTable != null ? HdrTable.CountryId : "",
      StateId: HdrTable != null ? HdrTable.StateId : "",
      CityId: HdrTable != null ? HdrTable.CityId : "",
      Address: HdrTable != null ? HdrTable.Address : "",
      Geolocation: HdrTable != null ? HdrTable.GeoLocation : "",
      AlertAfterMins: HdrTable != null ? HdrTable.AlertAfterMins : "",
      ReportTimer: HdrTable != null ? HdrTable.ReportTimer : "",
      ToMail: HdrTable != null ? HdrTable.ToMail : "",
      CcMail: HdrTable != null ? HdrTable.CcMail : "",
      
      IsNotification: HdrTable != null ? HdrTable.IsNotification : false,
      Status: HdrTable != null ? HdrTable.Status : 1,
      UrlToken:
        HdrTable != null
          ? import.meta.env.VITE_LOCAL_URL + HdrTable.UrlToken
          : "",
      CheckToken: HdrTable != null ? HdrTable.CheckToken : "",
    },
    validationSchema: PlantValidationSchema,
    onSubmit: (values: any, { resetForm }) => {
      let PlantFormValue = {
        Plant: {
          PlantId: HdrTable != null ? HdrTable.PlantId : 0,
          PlantCode: HdrTable != null ? HdrTable.PlantCode : "",
          PlantName: values.PlantName,
          PlantType: values.PlantType,
          Address: values.Address,
          Geolocation: values.Geolocation,
          AlertAfterMins: values.AlertAfterMins,
          ReportTimer: values.ReportTimer,
          ToMail: values.ToMail,
          CcMail: values.CcMail,
          IsNotification: values.IsNotification,
          CountryId: values.CountryId,
          StateId: values.StateId,
          CityId: values.CityId,
          CompanyId: values.CompanyId,
          Status: values.Status,
          CreatedBy:
            HdrTable != null ? HdrTable.CreatedBy : localStorage["UserId"],
          CreatedOn:
            HdrTable != null ? tLDS(HdrTable.CreatedOn) : tLDS(new Date()),
          ModifiedBy: HdrTable != null ? localStorage["UserId"] : null,
          ModifiedOn: HdrTable != null ? tLDS(new Date()) : null,
          UrlToken: HdrTable != null ? HdrTable.UrlToken : "",
          CheckToken: HdrTable != null ? HdrTable.CheckToken : "",
        },

        PlantNotificationDetails: plantNotifyDetailList.map((item) => ({
          PlantNotificationDetailId: item.PlantNotificationDetailId || 0,
          LevelId: item.LevelId,
          DepartmentId: item.DepartmentId,
          PrimaryUserId: item.PrimaryUserId,
          SecondaryUserId: item.SecondaryUserId,
          Status: item.Status ?? 1,
        })),
      };
      if (HdrTable != null) {
        if (HdrTable.isCreate != false) {
          try {
            const updateRes = dispatch(Update(PlantFormValue));
            updateRes.then((res) => {
              if (res.payload != null || !res.payload) {
                if (res.payload.transtatus.result == true) {
                  generateQrCodes(res.payload.HdrTable);

                  toast.current?.show({
                    severity: "success",
                    summary: "Success Message",
                    detail: res.payload.transtatus.lstErrorItem[0].Message,
                  });
                  resetForm();
                  setTimeout(() => {
                    route.push("/home/vPlant");
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
          const createRes = dispatch(Create(PlantFormValue));
          createRes
            .then((res) => {
              if (res.payload != null || !res.payload) {
                if (res.payload.transtatus.result == true) {
                  generateQrCodes(res.payload.HdrTable);
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

  const plantNotificationDetailForm = {
    PlantNotificationDetailId: 0,
    PlantId: 0,
    LevelId: "",
    DepartmentId: "",
    PrimaryUserId: "",
    SecondaryUserId: "",
    Status: 1,
  };

  const resetForm = () => {
    formik.resetForm();
    formik.setFieldValue("ReportTimer", "");
    formik.setFieldValue("ToMail", "");
    formik.setFieldValue("CcMail", "");
    plantNotificationDetailFormik.resetForm();
    setStateList([]);
    setTempUserList([]);
    setTempUserListSecondary([]);
    // setDepartmentList([]);
    setCityList([]);
  };

  const plantNotificationDetailFormik: any = useFormik({
    initialValues: plantNotificationDetailForm,
    validationSchema: NotificationDetailValidationSchema,
    onSubmit: (values: any, { resetForm }) => {
      console.log("Submitted Values →", values);

      const obj: any = {
        PlantNotificationDetailId: 0,
        PlantId: HdrTable?.PlantId || 0,
        LevelId: values.LevelId,
        DepartmentId: values.DepartmentId,
        PrimaryUserId: values.PrimaryUserId,
        SecondaryUserId: values.SecondaryUserId,
        Status: 1,
        LevelName:
          LevelList.find((f) => f.MetaSubId === values.LevelId)
            ?.MetaSubDescription || "",
        DepartmentName:
          DepartmentList.find((f) => f.DepartmentId === values.DepartmentId)
            ?.DepartmentName || "",
        UserName:
          tempUserList.find((f) => f.UserId === values.PrimaryUserId)
            ?.UserName || "",
        SecUserName: values.SecondaryUserId
          ? tempUserListSecondary.find(
              (f) => f.UserId === values.SecondaryUserId
            )?.UserName || ""
          : "",
      };

      const isLevelExist = plantNotifyDetailList.some(
        (f) => f.LevelId === obj.LevelId
      );
      const isUserExist = plantNotifyDetailList.some(
        (f) => f.PrimaryUserId === obj.PrimaryUserId
      );

      if (isLevelExist) {
        toast.current?.show({
          severity: "warn",
          summary: "Warning Message",
          detail: "Level Already Exists",
        });
        return;
      }

      if (isUserExist) {
        toast.current?.show({
          severity: "warn",
          summary: "Warning Message",
          detail: "Primary User Already Exists",
        });
        return;
      }

      setPlantNotifyDetailList([...plantNotifyDetailList, obj]);
      resetForm(); // resets both forms
      setRowSelect(false);
    },
  });

  const Onchangecountry = (name, other, value) => {
    try {
      setStateList([]);
      setCityList([]);
      formik.setFieldValue("StateId", null);
      formik.setFieldValue("CityId", null);
      formik.setFieldValue(name, value);
      let Obj = {
        CountryId: value,
      };
      const response = dispatch(OnChangeCountry(Obj));
      response.then((res) => {
        setStateList(res.payload.StateList);
      });
    } catch (error) {
      toast.current?.show({
        severity: "error",
        detail: "Error",
        summary: error.message || "An error occurred",
      });
    }
  };

  const Onchangestate = (name, other, value) => {
    try {
      setCityList([]);
      formik.setFieldValue("CityId", null);
      formik.setFieldValue(name, value);
      let Obj = {
        StateId: value,
      };
      const res = dispatch(OnChangeState(Obj));
      res.then((res) => {
        setCityList(res.payload.CityList);
      });
    } catch (error) {
      toast.current?.show({
        severity: "error",
        detail: "Error",
        summary: error.message || "An error occurred",
      });
    }
  };

  const handleSelect = (name, other, value) => {
    formik.setFieldValue(name, value);
  };

  const handleDSelect = (name, other, value) => {
    plantNotificationDetailFormik.setFieldValue(name, value);
  };

  useEffect(() => {
    if (isCreate === true) {
      const data = {
        Type: "CreateInitialize",
        PlantId: 0,
        CompanyId: +localStorage["CompanyId"],
        RoleId: +localStorage["DefaultRoleId"],
      };
      dispatch(CreateInitialize(data));
    } else {
      let List: any[] = [];
      for (let i = 0; i < DetailList.length; i++) {
        const x = DetailList[i];
        let obj: any = {};
        obj.PlantNotificationDetailId = x.PlantNotificationDetailId ?? 0;
        obj.PlantId = x.PlantId ?? 0;
        obj.LevelId = x.LevelId;
        obj.DepartmentId = x.DepartmentId;
        obj.PrimaryUserId = x.PrimaryUserId;
        obj.SecondaryUserId = x.SecondaryUserId;
        obj.LevelName = LevelList.find(
          (f) => f.MetaSubId == x.LevelId
        ).MetaSubDescription;
        obj.DepartmentName = DepartmentList.find(
          (f) => f.DepartmentId == x.DepartmentId
        ).DepartmentName;
        obj.UserName = PrimaryUserList.find(
          (f) => f.UserId == x.PrimaryUserId
        ).UserName;
        if (obj.SecondaryUserId) {
          obj.SecUserName = PrimaryUserList.find(
            (f) => f.UserId == x.SecondaryUserId
          ).UserName;
        }
        List.push(obj);
      }
      setPlantNotifyDetailList(List);
    }
  }, []);

  const handleDepartmentSelect = (
    name,
    other,
    value,
    type?: number,
    typevalue?: number
  ) => {
    plantNotificationDetailFormik.setFieldValue(name, value);
    let Obj = {
      DepartmentId: value,
      CompanyId: +localStorage["CompanyId"],
    };
    const OnChangeDepartmentRes = dispatch(OnChangeDepartment(Obj));
    OnChangeDepartmentRes.then((res) => {
      if (res.payload.transtatus.result == true) {
        setTempUserList(res.payload.PrimaryUserList);
        if (type) {
          handlePrimaryUserSelect(
            "PrimaryUserId",
            {},
            typevalue,
            res.payload.PrimaryUserList
          );
        }
        setTempUserListSecondary([]);
      } else if (res.payload.transtatus.result == false) {
        toast.current?.show({
          severity: "error",
          summary: "Error Message",
          detail: res.payload.transtatus.lstErrorItem[0].Message,
        });
      }
    }).catch((error) => {
      toast.current?.show({
        severity: "error",
        summary: "Error Message",
        detail: JSON.stringify(error),
      });
    });
  };

  const handlePrimaryUserSelect = (
    name,
    other,
    value,
    ListForOnRowSelect: any[] = []
  ) => {
    plantNotificationDetailFormik.setFieldValue(name, value);
    let List: any[] = [];
    if (ListForOnRowSelect.length > 0) {
      List = ListForOnRowSelect.filter((f) => f.UserId != value);
    } else {
      List = tempUserList.filter((f) => f.UserId != value);
    }
    setTempUserListSecondary(List);
  };

  const OnClear = () => {
    plantNotificationDetailFormik.resetForm();
    setTempUserList([]);
    setTempUserListSecondary([]);
  };

  const deleteTemplate = (rowData, list, setList, isView) => {
    if (isView) return;

    const updatedList = list.filter((item) => item !== rowData);
    setList(updatedList);

    toast.current?.show({
      severity: "info",
      summary: "Deleted",
      detail: `${rowData.LevelName} removed.`,
    });
  };

  return (
    <>
      <Formik
        initialValues={formik.initialValues}
        validationSchema={PlantValidationSchema}
        onSubmit={formik.handleSubmit}
      >
        <div className="page-container">
          <div className="inner-page-container">
            <div className="page-title">
              <div className="grid grid-nogutter">
                <div className="md:col-6">
                  <h1>Plant</h1>
                </div>
                <div className="md:col-6 text-right">
                  <div className="action-btn">
                    <>
                      <Button
                        title="Save"
                        icon="pi pi-save"
                        className="text-center"
                        disabled={isView}
                        type="button"
                        onClick={() => {
                          if (plantNotifyDetailList.length === 0) {
                            toast.current?.show({
                              severity: "warn",
                              summary: "Warning Message",
                              detail:
                                "Please add at least one Notification Detail.",
                            });
                            return;
                          }
                          formik.handleSubmit();
                        }}
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
                        route.push("/home/vPlant");
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <TabView
              activeIndex={activeIndex}
              onTabChange={(e) => validatePlantTabBeforeSwitch(e.index)}
              pt={{
                nav: {
                  style: {
                    justifyContent: "start",
                    gap: 10,
                  },
                },
              }}
              panelContainerStyle={{
                padding: 0,
                paddingTop: 0,
                borderTopRightRadius: 10,
              }}
            >
              <TabPanel
                header="Plant"
                style={{ minWidth: 100, background: "#ebeef6" }}
                leftIcon="pi pi-id-card mr-2"
              >
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
                                      handleSelect={handleSelect}
                                      formik={formik}
                                      fldStyle={"col-12 md:col-4"}
                                      showFilter={true}
                                    />
                                    <FormFields
                                      type={"text"}
                                      name={"PlantCode"}
                                      label={"Plant Code"}
                                      options={""}
                                      show={
                                        isCreate == null || isCreate == false
                                          ? false
                                          : false
                                      }
                                      required={true}
                                      disable={
                                        isView || isCreate == false
                                          ? true
                                          : false
                                      }
                                      optionLabel={""}
                                      optionValue={""}
                                      handleSelect={""}
                                      formik={formik}
                                      fldStyle={"col-12 md:col-4"}
                                    />
                                    <FormFields
                                      type={"select"}
                                      name={"PlantType"}
                                      label={"Plant Type"}
                                      options={PlantTypeList}
                                      show={true}
                                      required={true}
                                      disable={isView ? true : false}
                                      optionLabel={"MetaSubDescription"}
                                      optionValue={"MetaSubId"}
                                      handleSelect={handleSelect}
                                      formik={formik}
                                      fldStyle={"col-12 md:col-4"}
                                    />
                                    <FormFields
                                      type={"text"}
                                      name={"PlantName"}
                                      label={"Plant Name"}
                                      options={""}
                                      show={true}
                                      required={true}
                                      disable={isView ? true : false}
                                      optionLabel={"PlantName"}
                                      optionValue={"PlantId"}
                                      handleSelect={""}
                                      formik={formik}
                                      fldStyle={"col-12 md:col-4"}
                                      maxLength={90}
                                    />
                                    <FormFields
                                      type={"select"}
                                      name={"CountryId"}
                                      label={"Country"}
                                      options={CountryList}
                                      show={true}
                                      required={true}
                                      disable={isView ? true : false}
                                      optionLabel={"CountryName"}
                                      optionValue={"CountryId"}
                                      handleSelect={Onchangecountry}
                                      formik={formik}
                                      fldStyle={"col-12 md:col-4"}
                                      showFilter={true}
                                    />
                                    <FormFields
                                      type={"select"}
                                      name={"StateId"}
                                      label={"State"}
                                      options={stateList}
                                      show={true}
                                      required={true}
                                      disable={isView ? true : false}
                                      optionLabel={"StateName"}
                                      optionValue={"StateId"}
                                      handleSelect={Onchangestate}
                                      formik={formik}
                                      fldStyle={"col-12 md:col-4"}
                                      showFilter={true}
                                    />
                                    <FormFields
                                      type={"select"}
                                      name={"CityId"}
                                      label={"City"}
                                      options={cityList}
                                      show={true}
                                      required={true}
                                      disable={isView ? true : false}
                                      optionLabel={"CityName"}
                                      optionValue={"CityId"}
                                      handleSelect={handleSelect}
                                      formik={formik}
                                      fldStyle={"col-12 md:col-4"}
                                      showFilter={true}
                                    />
                                  </div>
                                </div>

                                <FormFields
                                  type={"textarea"}
                                  name={"Address"}
                                  label={"Address"}
                                  options={""}
                                  show={true}
                                  required={false}
                                  disable={isView ? true : false}
                                  optionLabel={"Address"}
                                  optionValue={""}
                                  handleSelect={""}
                                  formik={formik}
                                  fldStyle={"col-12 md:col-3"}
                                  maxLength={500}
                                  style={{
                                    maxHeight: "100px",
                                    overflowY: "auto",
                                  }}
                                />
                                <FormFields
                                  type={"text"}
                                  name={"Geolocation"}
                                  label={"Geolocation"}
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
              </TabPanel>

              <TabPanel
                header="Notification Details"
                leftIcon="pi pi-users mr-2"
                style={{ minWidth: 100, background: "#ebeef6" }}
              >
                <div className="tab-parent-container scroll-y">
                  <Formik
                    initialValues={plantNotificationDetailFormik}
                    validationSchema={NotificationDetailValidationSchema}
                    onSubmit={plantNotificationDetailFormik.handleSubmit}
                  >
                    {/* onSubmit={plantNotificationDetailFormik.handleSubmit}> */}
                    <div className="white">
                      <div className="widget-body">
                        <div className="normal-table">
                          <div className="page-title">
                            <div className="grid grid-nogutter">
                              <div className="md:col-6">
                                <h1>Notification Detail</h1>
                              </div>
                            </div>
                          </div>
                          <div className="grid">
                            <div className="field-checkbox col-12 md:col-3">
                              <Checkbox
                                inputId="IsNotification"
                                name="IsNotification"
                                checked={formik.values["IsNotification"]}
                                onChange={(e) => {
                                  const isChecked = e.checked;
                                  formik.setFieldValue("IsNotification", isChecked);
                                  if (!isChecked) {
                                    formik.setFieldValue("AlertAfterMins", "");
                                  }
                                }}
                                disabled={isView}
                              />
                              <label htmlFor="IsNotification" className="mr-2">
                                Is Notification Alert
                              </label>
                            </div>
                            <FormFields
                              type={"text"}
                              name="AlertAfterMins"
                              value={formik.values["AlertAfterMins"]}
                              label={"Alert Notification (In Minutes)"}
                              show={true}
                              required={formik.values["IsNotification"]}
                              disable={!formik.values["IsNotification"] || isView}
                              formik={formik}
                              fldStyle={"col-12 md:col-3"}
                            />
                              <FormFields
                              type={"number"}
                              name="ReportTimer"
                              value={formik.values["ReportTimer"]}
                              label={"Report Timer (Check-in/Check-out)"}
                              show={true}
                              // required={formik.values["IsNotification"]}
                               disable={isView}
                            
                              formik={formik}
                              fldStyle={"col-12 md:col-3"}
                            />
                             <FormFields
                              type={"text"}
                              name="ToMail"
                              value={formik.values["ToMail"]}
                              label={"To Mail"}
                              show={true}
                                disable={isView}
                              // required={formik.values["IsNotification"]}
                              // disable={!formik.values["IsNotification"] || isView}
                              formik={formik}
                              fldStyle={"col-12 md:col-3"}
                            />
                                 <FormFields
                              type={"text"}
                              name="CcMail"
                              value={formik.values["CcMail"]}
                              label={"Cc Mail "}
                              show={true}
                                 disable={isView}
                              // required={formik.values["IsNotification"]}
                              // disable={!formik.values["IsNotification"] || isView}
                              formik={formik}
                              fldStyle={"col-12 md:col-3"}
                            />
                          </div>
                          <div className="grid">
                            <div className="field-checkbox col-12 md:col-12">
                              <FormFields
                                type={"select"}
                                name={"LevelId"}
                                label={"Level Name"}
                                options={LevelList}
                                show={true}
                                required={true}
                                value={formik.values["LevelId"]} // ✅ correct
                                // disable={rowselect}
                                // disable={(isView ? true : false) || rowselect}
                                optionLabel={"MetaSubDescription"}
                                optionValue={"MetaSubId"}
                                handleSelect={handleDSelect}
                                formik={plantNotificationDetailFormik}
                                fldStyle={"col-12 md:col-3"}
                              />
                              <FormFields
                                type={"select"}
                                name={"DepartmentId"}
                                label={"Department Name"}
                                options={DepartmentList}
                                show={true}
                                required={true}
                                disable={isView ? true : false}
                                optionLabel={"DepartmentName"}
                                optionValue={"DepartmentId"}
                                handleSelect={handleDepartmentSelect}
                                formik={plantNotificationDetailFormik}
                                fldStyle={"col-12 md:col-3"}
                                value={formik.values["DepartmentId"]}
                              />
                              <FormFields
                                type={"select"}
                                name={"PrimaryUserId"}
                                label={"Primary User Name"}
                                options={tempUserList}
                                show={true}
                                required={true}
                                disable={isView ? true : false}
                                optionLabel={"UserName"}
                                optionValue={"UserId"}
                                handleSelect={handlePrimaryUserSelect}
                                formik={plantNotificationDetailFormik}
                                fldStyle={"col-12 md:col-3"}
                                value={formik.values["UserId"]}
                              />
                              <FormFields
                                type={"select"}
                                name={"SecondaryUserId"}
                                label={"Secondary User Name"}
                                options={tempUserListSecondary}
                                show={true}
                                required={false}
                                disable={isView ? true : false}
                                optionLabel={"UserName"}
                                optionValue={"UserId"}
                                handleSelect={handleDSelect}
                                formik={plantNotificationDetailFormik}
                                fldStyle={"col-12 md:col-3"}
                                value={formik.values["UserId"]}
                              />
                            </div>
                          </div>
                          <div className="text-center mb-3">
                            <Button
                              label="Add"
                              severity="success"
                              icon="las la-plus"
                              title="Add"
                              className="text-center"
                              onClick={() => {
                                console.log("Button clicked");
                                plantNotificationDetailFormik.handleSubmit();
                              }}
                              type="button"
                              disabled={isView}
                            />
                            <Button
                              label="Clear"
                              severity="danger"
                              icon="las la-trash"
                              title="Clear"
                              className="text-center"
                              onClick={() => OnClear()}
                              disabled={isView }
                            />
                          </div>
                        </div>
                        <div className="card">
                          <DataTable
                            value={plantNotifyDetailList}
                            showGridlines
                            paginator
                            // filters={filters}
                            filterDisplay="menu"
                            globalFilterFields={[
                              "LevelName",
                              "DepartmentName",
                              "UserName",
                              "SecUserName",
                            ]}
                            // header={TableHeader}
                            emptyMessage="No Data Found."
                            rows={5}
                            rowsPerPageOptions={[5, 10, 25, 50]}
                            tableStyle={{ minWidth: "50rem" }}
                            // onRowDoubleClick={(e) => onRowSelect(e)}
                          >
                            <Column
                              header="Action"
                              style={{ textAlign: "center", width: "100px" }}
                              body={(rowData) => (
                                <Button
                                  icon="pi pi-trash"
                                  className="p-button-rounded p-button-danger p-button-sm"
                                  title="Delete"
                                  onClick={() =>
                                    deleteTemplate(
                                      rowData,
                                      plantNotifyDetailList,
                                      setPlantNotifyDetailList,
                                      isView
                                    )
                                  }
                                  disabled={isView}
                                />
                              )}
                            />
                            <Column field="LevelName" header="Level"></Column>
                            <Column
                              field="DepartmentName"
                              header="Department"
                            ></Column>
                            <Column
                              field="UserName"
                              header="Primary User"
                            ></Column>
                            <Column
                              field="SecUserName"
                              header="Secondary User"
                            ></Column>
                          </DataTable>
                        </div>
                      </div>
                    </div>
                  </Formik>
                </div>
              </TabPanel>
            </TabView>
          </div>
        </div>
      </Formik>
      <AppAlert toast={toast} />
    </>
  );
};

export default CPlant;
