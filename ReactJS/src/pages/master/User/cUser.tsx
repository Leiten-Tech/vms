import React, { useState, useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Button } from "primereact/button";
import { Rating } from "primereact/rating";
import { InputText } from "primereact/inputtext";
import { useDispatch, useSelector } from "react-redux";
import AppTable from "@/components/AppTable";
import PageHeader from "@/components/PageHeader";
import {
  OnChangeCompany,
  OnChangePlant,
  createInit,
  createUsers,
  fetchUsers,
  updateUsers,
  ScreenMapping,
} from "@/redux/slices/master/userSlice";
import FormFields from "@/components/FormFields";
import { Formik, useFormik } from "formik";
import { UserValidationSchema } from "@/validations/Master";
import {
  Dropdown,
  Toast,
  MultiSelect,
  FileUpload,
} from "@/assets/css/prime-library";
import { AppProgressSpinner } from "@/components/UtilityComp";
import AppAlert from "@/alert/alert";
import {
  blobToURL,
  blobUrlToFile,
  fileToBlobURL,
  tLDS,
  urlToFile,
} from "@/utils/utilFunc";
import { pageLoadScript } from "@/assets/js/common-utilities";
import { Divider } from "primereact/divider";
import { IMAGES } from "@/assets/images/Images";
import ImageCropper, {
  centerAspectCrop,
  useDebounceEffect,
} from "@/components/ImageCropper/ImageCropper";

import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  Crop,
  PixelCrop,
  convertToPixelCrop,
} from "react-image-crop";
import { canvasPreview } from "@/components/ImageCropper/CanvasPreview";

export const ChangePass = (props) => {
  const { formik, header, footer } = props;
  return (
    <div className="white">
      <div className="widget-body">
        <div className="normal-table">
          <div className="page-title">
            <div className="grid grid-nogutter">
              <div className="md:col-6">
                <h1>Change Password</h1>
              </div>
            </div>
          </div>
          <div className="grid">
            <FormFields
              type={"password"}
              name={"ChangePassword"}
              label={"New Password"}
              show={true}
              required={false}
              disable={false}
              feedback={true}
              formik={formik}
              fldStyle={"col-12 md:col-4"}
              header={header}
              footer={footer}
              autoComplete="new-password"
              toggleMask
            />
            <FormFields
              type={"password"}
              name={"ConfirmPassword"}
              label={"Confirm Password"}
              show={true}
              required={false}
              disable={false}
              feedback={true}
              formik={formik}
              fldStyle={"col-12 md:col-4"}
              header={header}
              footer={footer}
              autoComplete="new-password"
              toggleMask
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const CUser = () => {
  const route = useHistory();
  const dispatch: any = useDispatch();
  const [defaultPlantList, setDefaultPlantList] = useState();
  const [defaultGateList, setDefaultGateList] = useState();
  const [isEmpDisable, setIsEmpDisable] = useState(false);
  const [isChangePass, setIsChangePass] = useState(false);
  const [defaultCompanyList, setDefaultCompanyList] = useState();
  const [userCompanyMap, setUserCompanyMap] = useState([]);
  const [userPlantMap, setUserPlantMap] = useState([]);
  const [userGateMap, setUserGateMap] = useState([]);
  const [userRoleMap, setUserRoleMap] = useState([]);
  const [defaultRoleList, setDefaultRoleList] = useState();
  const [photo, setPhoto] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<any>(IMAGES.NO_IMG);
  const [photoName, setPhotoName] = useState();
  const toast = useRef<Toast>(null);
  const [plantList, SetPlantList] = useState([]);
  const [gateList, SetGateList] = useState([]);
  const [roleList, SetRoleList] = useState([]);
  const [disableSave, setDisableSave] = useState(false);
  const header = <div className="font-bold mb-3">Pick a password</div>;
  const footer = (
    <>
      <Divider />
      <p className="mt-2">Suggestions</p>
      <ul className="pl-2 ml-2 mt-0 line-height-3">
        <li>Minimum 8 characters</li>
        <li>At least one lowercase</li>
        <li>At least one uppercase</li>
        <li>At least one numeric</li>
        <li>At least one special character</li>
      </ul>
    </>
  );
  useEffect(() => {
    pageLoadScript();
  });
  useEffect(() => {
    if (isCreate == true) {
      const data = {
        UserId: +localStorage["UserId"],
        RoleId: +localStorage["DefaultRoleId"],
        PlantId: +localStorage["PlantId"],
        CompanyId: +localStorage["CompanyId"],
      };
      dispatch(createInit(data));
      let SavedCompanyList =
        UserCompanyMapList &&
        UserCompanyMapList.length > 0 &&
        UserCompanyMapList.map((f) => f.CompanyId);

      let SavedPlantList =
        UserPlantMapList &&
        UserPlantMapList.length > 0 &&
        UserPlantMapList.map((f) => f.PlantId);

      let SavedRoleList =
        UserRoleMapList &&
        UserRoleMapList.length > 0 &&
        UserRoleMapList.map((f) => f.RoleId);

      let SavedGateList =
        UserGateMapList &&
        UserGateMapList.length > 0 &&
        UserGateMapList.map((f) => f.GateId);

      if (SavedCompanyList && SavedCompanyList.length > 0) {
        handleCompanySelect("CompanyNames", {}, SavedCompanyList, 1);
      }

      if (SavedPlantList && SavedPlantList.length > 0) {
        handlePlantSelect("PlantNames", {}, SavedPlantList, 1);
      }

      if (SavedRoleList && SavedRoleList.length > 0) {
        handleRoleSelect("RoleNames", {}, SavedRoleList, 1);
      }

      if (SavedGateList && SavedGateList.length > 0) {
        handleGateSelect("GateNames", {}, SavedGateList, 1);
      }
    } else if (isCreate == false) {
      setIsEmpDisable(true);
      setUserCompanyMap(HdrTable.UserCompanyMaps);
      setUserPlantMap(HdrTable.UserPlantMaps);
      setUserRoleMap(HdrTable.UserRoleMaps);
      setUserGateMap(HdrTable.UserGateMaps);
      let SavedCompanyList = HdrTable.UserCompanyMaps.map((f) => f.CompanyId);
      if (SavedCompanyList && SavedCompanyList.length > 0) {
        handleCompanySelect("CompanyNames", {}, SavedCompanyList, 1);
      }
      let SavedPlantList = HdrTable.UserPlantMaps.map((f) => f.PlantId);
      if (SavedPlantList && SavedPlantList.length > 0) {
        handlePlantSelect("PlantNames", {}, SavedPlantList, 1);
      }
      let SavedGateList = HdrTable.UserGateMaps.map((f) => f.GateId);
      if (SavedGateList && SavedGateList.length > 0) {
        handleGateSelect("GateNames", {}, SavedGateList, 1);
      }
      let SavedRoleList = HdrTable.UserRoleMaps.map((f) => f.RoleId);
      handleRoleSelect("RoleNames", {}, SavedRoleList, 1);

      if (
        HdrTable.DigitalSignName &&
        HdrTable.DigitalSignName != null &&
        HdrTable.DigitalSignName != ""
      ) {
        fetchBlobFromUrl(HdrTable.DigitalSign)
          .then((blob) => {
            const file = new File([blob], HdrTable.DigitalSignName, {
              type: "image/*",
              lastModified: 1695716506050,
            });
            const blobUrl = URL.createObjectURL(blob);
            setDigitalSignUrl(blobUrl);
          })
          .catch((error) => {
            console.error("Error fetching image:", error);
          });
      }
      if (
        HdrTable.DigitalSignName &&
        HdrTable.DigitalSignName != null &&
        HdrTable.DigitalSignName != ""
      ) {
        fetchBlobFromUrl(HdrTable.UserImageUrl)
          .then((blob) => {
            const file = new File([blob], HdrTable.UserImageName, {
              type: "image/*",
              lastModified: 1695716506050,
            });
            setPhoto(file);
            setImageUrl(HdrTable.UserImageUrl);
          })
          .catch((error) => {
            console.error("Error fetching image:", error);
          });
      }
    } else {
      SetPlantList(PlantList);
      SetRoleList(RoleList);
      SetGateList(GateList);
    }
  }, []);
  const allUsers = useSelector((state: any) => state.user);
  const createOrEditState = useSelector((state: any) => state.user);
  const countryList = useSelector((state: any) => state.user.CountryList);
  const statusList = useSelector((state: any) => state.user.StatusList);
  const imageUploadRef = useRef<any>(null);
  const {
    isCreate,
    isView,
    createEditData,
    loading,
    error,
    StatusList,
    UserList,
    HdrTable,
    EmployeeList,
    CompanyList,
    RoleList,
    PlantList,
    GateList,
    UserRoleMapList,
    UserCompanyMapList,
    UserPlantMapList,
    UserGateMapList,
    transtatus,
    DepartmentList,
  } = useSelector((state: any) => state.user);
  useEffect(() => {
    SetPlantList(PlantList);
  }, [PlantList]);
  useEffect(() => {
    SetGateList(GateList);
  }, [GateList]);
  useEffect(() => {
    SetRoleList(RoleList);
  }, [RoleList]);
  const formik: any = useFormik({
    initialValues: {
      UserId: HdrTable != null ? HdrTable.UserId : 0,
      UserName: HdrTable != null ? HdrTable.UserName : "",
      UserCode: HdrTable != null ? HdrTable.UserCode : "",
      Password: HdrTable != null ? HdrTable.Password : "",
      ChangePassword: "",
      ConfirmPassword: "",
      CompanyId: HdrTable != null ? HdrTable.UserCompanyMaps : null,
      PlantId: HdrTable != null ? HdrTable.PlantId : null,
      GateId: HdrTable != null ? HdrTable.GateId : null,
      EmpId: HdrTable != null ? HdrTable.EmpId : null,
      DefaultRoleId: HdrTable != null ? HdrTable.DefaultRoleId : null,
      UserEmail: HdrTable != null ? HdrTable.UserEmail : "",
      UserTelNo: HdrTable != null ? HdrTable.UserTelNo : "",
      Status: HdrTable != null ? HdrTable.Status : 1,
      CreatedBy: HdrTable != null ? HdrTable.CreatedBy : localStorage["UserId"],
      CreatedOn: HdrTable != null ? tLDS(HdrTable.CreatedOn) : tLDS(new Date()),
      ModifiedBy: HdrTable != null ? localStorage["UserId"] : null,
      ModifiedOn: HdrTable != null ? tLDS(new Date()) : null,
      IsBlocked: HdrTable != null ? HdrTable.IsBlocked : false,
      UserImageName: HdrTable != null ? HdrTable.UserImageName : "",
      UserImageUrl: HdrTable != null ? HdrTable.UserImageUrl : "",
      DigitalSign: HdrTable != null ? HdrTable.DigitalSign : "",
      DigitalSignName: HdrTable != null ? HdrTable.DigitalSignName : "",
      DeptId: HdrTable != null ? HdrTable.DeptId : null,
      SecondaryMobileNo: HdrTable != null ? HdrTable.SecondaryMobileNo : "",
      Address: HdrTable != null ? HdrTable.Address : "",
    },
    validationSchema: UserValidationSchema,
    onSubmit: (values: any) => {
      setDisableSave(true);
      if (createEditData != null) {
        if (
          (values.ChangePassword && values.ChangePassword != null) ||
          (values.ConfirmPassword && values.ConfirmPassword != null)
        ) {
          if (values.ChangePassword != values.ConfirmPassword) {
            toast.current?.show({
              severity: "warn",
              summary: "Warning Message",
              detail: "New & Confirm Passwords do not Match.",
            });
            setDisableSave(false);
            return;
          } else if (values.ChangePassword == values.ConfirmPassword) {
            values.Password = values.ConfirmPassword;
            values.isChangePass = true;
            setIsChangePass(true);
          }
        }
      }
      const formData = new FormData();
      if (
        values.RoleNames &&
        values.CompanyNames &&
        values.PlantNames &&
        values.GateNames
      ) {
      } else {
        toast.current?.show({
          severity: "warn",
          summary: "Warning Message",
          detail:
            "Please Ensure that you have selected Atleast Company, Roles, Plants, Gates & their Defaults",
        });
        setDisableSave(false);
        return;
      }
      values.DigitalSign = values.DigitalSignName;
      let UserFormValue = {
        User: values,
        UserCompanyMap: userCompanyMap,
        UserPlantMap: userPlantMap,
        UserGateMap: userGateMap || [],
        UserRoleMap: userRoleMap,
        Type: values.isChangePass || false,
      };

      let addedValueStringify: string = JSON.stringify(UserFormValue);
      formData.append("input", addedValueStringify);
      formData.append("webfile", photo);
      formData.append("digitalSign", DigitalSignCroppedDoc);
      // if (HdrTable != null) {
        if (isCreate == false) {
          var createres = dispatch(updateUsers(formData));
          createres
            .then((res) => {
              setDisableSave(false);
              if (res.payload.transtatus.result == true) {
                setDisableSave(false);
                setIsChangePass(false);

                toast.current?.show({
                  severity: "success",
                  summary: "Success Message",
                  detail: res.payload.transtatus.lstErrorItem[0].Message,
                });
                resetAllForms();
                setTimeout(() => {
                  route.push("/home/vUser");
                }, 800);
              } else {
                setDisableSave(false);
                toast.current?.show({
                  severity: "error",
                  detail: res.payload.transtatus.lstErrorItem[0].Message,
                  summary: "Error",
                });
              }
            })
            .catch((error) => {
              toast.current?.show({
                severity: "error",
                detail: "Error",
                summary: JSON.stringify(error),
              });
            });
        }
      // }
       else {
        var createres = dispatch(createUsers(formData));
        createres
          .then((res) => {
            setDisableSave(false);
            if (res.payload.transtatus.result == true) {
              setIsChangePass(false);

              toast.current?.show({
                severity: "success",
                detail: res.payload.transtatus.lstErrorItem[0].Message,
                summary: "Success Messsage",
              });
              {
                res.payload.HdrTable.UserId;
                let obj = {
                  NewUserId: res.payload.HdrTable.UserId,
                  RoleId: res.payload.HdrTable.DefaultRoleId,
                };
                var screenMapping = dispatch(ScreenMapping(obj));
                screenMapping
                  .then((res) => {
                    if (res.payload.transtatus.result == true) {
                    } else {
                      setDisableSave(false);
                      return;
                    }
                  })
                  .catch((error) => {
                    toast.current?.show({
                      severity: "error",
                      detail: "Error",
                      summary: JSON.stringify(error),
                    });
                  });
              }
              resetAllForms();
            } else {
              setDisableSave(false);
              toast.current?.show({
                severity: "error",
                summary: "Error",
                detail: res.payload.transtatus.lstErrorItem[0].Message,
              });
              setDisableSave(false);
              return;
            }
          })
          .catch((error) => {
            toast.current?.show({
              severity: "error",
              detail: "Error",
              summary: JSON.stringify(error),
            });
          });
      }
    },
  });
  const resetAllForms = () => {
    delete formik.values.RoleNames;
    delete formik.values.CompanyNames;
    delete formik.values.PlantNames;
    delete formik.values.GateNames;
    formik.resetForm();
    setPhoto(null);
    setDigitalSignDoc(null);
    setDigitalSignCroppedDoc(null);
    setDigitalSignUrl(null);
    setImageUrl(IMAGES.NO_IMG);
    setDefaultCompanyList(null);
    setDefaultPlantList(null);
    setDefaultGateList(null);
    setDefaultRoleList(null);
    SetPlantList([]);
    SetGateList([]);
    SetRoleList([]);
    setDisableSave(false)
  };
  const handleSelect = (name, other, value) => {
    formik.setFieldValue(name, value);
  };
  const handleCompanySelect = (name, other, value, type: number = 0) => {
    formik.setFieldValue("CompanyId", null);
    formik.setFieldValue("PlantNames", []);
    formik.setFieldValue("PlantId", null);
    formik.setFieldValue("GateNames", []);
    formik.setFieldValue("GateId", null);
    formik.setFieldValue(name, value);
    setUserCompanyMap([]);
    SetPlantList([]);
    setDefaultPlantList(null);
    SetGateList([]);
    setDefaultGateList(null);
    let List: any[] = [];
    for (let i = 0; i < value.length; i++) {
      const x = value[i];
      let Obj: any = {};
      Obj.UserCompanyMapId = 0;
      Obj.CompanyId = x;
      Obj.UserId = 0;
      Obj.Accountingyear = new Date().getFullYear;
      Obj.IsDefault = false;
      Obj.Status = 1;
      List.push(Obj);
    }
    setUserCompanyMap(List);
    setDefaultCompanyList(null);
    setDefaultCompanyList(
      CompanyList.filter((f) => value.some((item) => item == f.CompanyId))
    );
    if (List && List.length > 0 && type == 1) {
      handleDefCompanySelect(
        "CompanyId",
        {},
        !isCreate ? HdrTable.CompanyId : List[0].CompanyId,
        List
      );
    }
  };
  const handleDefCompanySelect = (name, other, value, List: any[] = []) => {
    formik.setFieldValue("PlantNames", []);
    formik.setFieldValue("PlantId", null);
    formik.setFieldValue("GateNames", []);
    formik.setFieldValue("GateId", null);
    formik.setFieldValue(name, value);
    setUserCompanyMap(null);
    SetPlantList([]);
    setDefaultPlantList(null);
    SetGateList([]);
    setDefaultGateList(null);
    let obj: any = (List.length > 0 ? List : userCompanyMap).find(
      (f) => f.CompanyId == value
    );
    if (obj) {
      let ListB: any[] = (List.length > 0 ? List : userCompanyMap).filter(
        (f) => f.CompanyId != value
      );
      ListB.forEach((item) => (item.IsDefault = false));
      obj.IsDefault = true;
      ListB.push(obj);
      setUserCompanyMap(ListB);
    }
    let obj1 = {
      Companyid: value,
    };
    var result = dispatch(OnChangeCompany(obj1));
    result
      .then((res) => {
        SetPlantList(res.payload.PlantList);
      })
      .catch((error) => {
        toast.current?.show({
          severity: "error",
          detail: "Error",
          summary: JSON.stringify(error),
        });
      });
  };
  const handlePlantSelect = (
    name,
    other,
    value,
    type: number = 0,
    plist: any = []
  ) => {
    formik.setFieldValue("PlantId", null);
    formik.setFieldValue("GateNames", []);
    formik.setFieldValue("GateId", null);
    formik.setFieldValue(name, value);
    SetGateList([]);
    setDefaultGateList(null);
    setUserPlantMap(null);
    let List: any[] = [];
    for (let i = 0; i < value.length; i++) {
      const x = value[i];
      let Obj: any = {};
      Obj.UserPlantMapId = 0;
      Obj.CompanyId = PlantList.find((f) => f.PlantId == x).CompanyId;
      Obj.UserId = 0;
      Obj.PlantId = x;
      Obj.AccountingYear = new Date().getFullYear();
      Obj.IsDefault = false;
      Obj.Status = 1;
      List.push(Obj);
    }
    setUserPlantMap(List);
    setDefaultPlantList(null);

    setDefaultPlantList(
      PlantList.filter((f) => value.some((item) => item == f.PlantId))
    );
    if (List && List.length > 0 && type == 1) {
      handleDefPlantSelect(
        "PlantId",
        {},
        !isCreate ? HdrTable.PlantId : List[0].PlantId,
        List
      );
    }
  };
  const handleDefPlantSelect = (name, other, value, List: any[] = []) => {
    formik.setFieldValue("GateNames", []);
    formik.setFieldValue("GateId", null);
    formik.setFieldValue(name, value);
    SetGateList([]);
    setDefaultGateList(null);
    setUserPlantMap(null);
    let obj = (List.length > 0 ? List : userPlantMap).find(
      (f) => f.PlantId == value
    );
    let ListB = (List.length > 0 ? List : userPlantMap).filter(
      (f) => f.PlantId != value
    );
    if (ListB && ListB.length > 0) {
      ListB.forEach((item) => (item.IsDefault = false));
    }
    if (obj) {
      obj.IsDefault = true;
      ListB.push(obj);
    }
    setUserPlantMap(ListB);
    let obj1 = {
      Plantid: value,
      CompanyId: +localStorage["CompanyId"],
    };
    var result = dispatch(OnChangePlant(obj1));
    result
      .then((res) => {
        SetGateList(res.payload.GateList);
      })
      .catch((error) => {
        toast.current?.show({
          severity: "error",
          detail: "Error",
          summary: JSON.stringify(error),
        });
      });
  };
  const handleGateSelect = (name, other, value, type: number = 0) => {
    formik.setFieldValue("GateId", null);
    formik.setFieldValue(name, value);
    setUserGateMap(null);
    let List: any[] = [];
    for (let i = 0; i < value.length; i++) {
      const x = value[i];
      let Obj: any = {};
      Obj.UserGateMapId = 0;
      Obj.CompanyId = GateList.find((f) => f.GateId == x)?.CompanyId;
      Obj.UserId = 0;
      Obj.PlantId = GateList.find((f) => f.GateId == x)?.PlantId;
      Obj.GateId = x;
      Obj.AccountingYear = new Date().getFullYear();
      Obj.IsDefault = false;
      Obj.Status = 1;
      List.push(Obj);
    }
    setUserGateMap(List);
    setDefaultGateList(null);
    setDefaultGateList(
      GateList.filter((f) => value.some((item) => item == f.GateId))
    );
    if (List && List.length > 0 && type == 1) {
      handleDefGateSelect(
        "GateId",
        {},
        !isCreate ? HdrTable.GateId : List[0].GateId,
        List
      );
    }
  };
  const handleDefGateSelect = (name, other, value, List: any[] = []) => {
    setUserGateMap(null);
    formik.setFieldValue(name, value);
    let obj = (List.length > 0 ? List : userGateMap).find(
      (f) => f.GateId == value
    );
    let ListB = (List.length > 0 ? List : userGateMap).filter(
      (f) => f.GateId != value
    );
    if (ListB && ListB.length > 0) {
      ListB.forEach((item) => (item.IsDefault = false));
    }
    if (obj) {
      obj.IsDefault = true;
      ListB.push(obj);
    }
    setUserGateMap(ListB);
  };
  const handleRoleSelect = (name, other, value, type: number = 0) => {
    formik.setFieldValue("DefaultRoleId", null);
    formik.setFieldValue(name, value);
    setUserRoleMap(null);
    let List: any[] = [];
    for (let i = 0; i < value.length; i++) {
      const x = value[i];
      let Obj: any = {};
      Obj.UserRoleMapId = 0;
      // Obj.CompanyId = RoleList.find((f) => f.RoleId == x).CompanyId;
      Obj.CompanyId = +localStorage["CompanyId"];
      Obj.UserId = 0;
      Obj.RoleId = x;
      Obj.AccountingYear = new Date().getFullYear();
      Obj.IsDefault = false;
      Obj.Status = 1;
      List.push(Obj);
    }
    setUserRoleMap(List);
    setDefaultRoleList(null);
    setDefaultRoleList(
      RoleList.filter((f) => value.some((item) => item == f.RoleId))
    );
    if (List && List.length > 0 && type == 1) {
      handleDefRoleSelect(
        "DefaultRoleId",
        {},
        !isCreate ? HdrTable.DefaultRoleId : List[0].RoleId,
        List
      );
    }
  };
  const handleDefRoleSelect = (name, other, value, List: any[] = []) => {
    setUserRoleMap(null);
    formik.setFieldValue(name, value);
    let obj = (List.length > 0 ? List : userRoleMap).find(
      (f) => f.RoleId == value
    );
    if (obj) {
      let ListB = (List.length > 0 ? List : userRoleMap).filter(
        (f) => f.RoleId != value
      );
      if (ListB && ListB.length > 0) {
        ListB.forEach((i) => (i.IsDefault = false));
      }
      obj.IsDefault = true;
      ListB.push(obj);
      setUserRoleMap(ListB);
    }
  };
  const handleCloseImage = () => {
    imageUploadRef.current?.clear();
    setImageUrl(IMAGES.NO_IMG);
    setPhoto(null);
    formik.setFieldValue("UserImageName", "");
    formik.setFieldValue("UserImageUrl", "");
  };
  const itemTemplate = () => {
    return (
      <div className="flex align-items-center flex-column">
        <i
          className="pi pi-image mt-3 p-5"
          style={{
            fontSize: "5em",
            borderRadius: "50%",
            backgroundColor: "var(--surface-b)",
            color: "var(--surface-d)",
          }}
        ></i>
        <span
          style={{ fontSize: "1.2em", color: "var(--text-color-secondary)" }}
          className="my-5"
        >
          Drag and Drop Image Here
        </span>
      </div>
    );
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
  const onUpload = (e: any) => {
    const allowedTypes = ["jpeg", "jpg", "png"];
    if (imageUrl != "") {
      handleCloseImage();
    }
    if (e.files) {
      if (!isValidFileType(e.files[0], allowedTypes)) {
        toast.current?.show({
          severity: "warn",
          summary: "Error Message",
          detail:
            "Please Upload only Files with Format (Image/ JPEG, JPG, PNG)",
        });
        imageUploadRef.current?.clear();
        return;
      }
    }
    if (e.files.length > 0) {
      setPhoto(e.files[0]);
      formik.setFieldValue("UserImageName", e.files[0].name);
      formik.setFieldValue("UserImageUrl", e.files[0].name);
      const uploadedImageUrl = URL.createObjectURL(e.files[0]);
      setImageUrl(uploadedImageUrl);
    } else {
      toast.current?.show({
        severity: "warn",
        summary: "Error Message",
        detail: "Please Upload only Files with Format (Image/ JPEG, JPG, PNG)",
      });
      return;
    }
  };
  async function fetchBlobFromUrl(url: string): Promise<Blob> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    return await response.blob();
  }

  const handleEmployeeSelect = (name, other, value) => {
    let obj = EmployeeList.find((f) => f.EmployeeId == value);
    formik.setFieldValue("UserEmail", obj.Email);
    formik.setFieldValue("UserTelNo", obj.PrimaryMobileNo);
    let obj1 = EmployeeList.find((f) => f.EmployeeId == value);
    formik.setFieldValue(name, value);
    if (obj.ImageName) {
      formik.setFieldValue("UserImageName", obj.ImageName);
      formik.setFieldValue("UserImageUrl", obj.ImageName);
      fetchBlobFromUrl(obj.ImageUrl)
        .then((blob) => {
          const file = new File([blob], obj.ImageName, {
            type: "image/*",
            lastModified: 1695716506050,
          });
          setPhoto(file);
          setImageUrl(obj.ImageUrl);
        })
        .catch((error) => {
          console.error("Error fetching image:", error);
        });
    } else {
      setImageUrl(IMAGES.NO_IMG);
      setPhoto(null);
    }
  };

  const customOptions = { icon: "las la-camera-retro", iconOnly: true };

  // Digital Sign Upload

  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const hiddenAnchorRef = useRef<HTMLAnchorElement>(null);
  const blobUrlRef = useRef("");
  const digitalSignDocRef = useRef(null);

  const chooseOptions = { icon: "las la-upload", iconOnly: true };

  const [DigitalSignUrl, setDigitalSignUrl] = useState<any>();
  const [DigitalSignCroppedDoc, setDigitalSignCroppedDoc] = useState<any>("");
  const [DigitalSignDoc, setDigitalSignDoc] = useState<any>();

  const [imgSrc, setImgSrc] = useState("");
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [aspect, setAspect] = useState<number | undefined>(16 / 9);

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
    }
  }

  const cropSave = () => {};

  const handleClick = (linkValue) => {
    window.open(linkValue, "_blank");
  };

  const ClearFileUpload = () => {
    digitalSignDocRef.current?.clear();
    // formik.setFieldValue("AttachmentName", "");
    formik.setFieldValue("DigitalSign", null);
    formik.setFieldValue("DigitalSignName", null);
    setDigitalSignUrl(null);
    setDigitalSignDoc(null);
  };

  async function onDownloadCropClick() {
    const image = imgRef.current;
    const previewCanvas = previewCanvasRef.current;
    if (!image || !previewCanvas || !completedCrop) {
      throw new Error("Crop canvas does not exist");
    }
    // if (completedCrop.width < 100 || completedCrop.height < 100) {
    //   toast.current?.show({
    //     severity: "warn",
    //     summary: "Warning Message",
    //     detail: "Please keep the Cropped Size of Width 150px & Height 150px",
    //   });
    //   return;
    // }
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const offscreen = new OffscreenCanvas(
      completedCrop.width * scaleX,
      completedCrop.height * scaleY
    );
    const ctx = offscreen.getContext("2d");
    if (!ctx) {
      throw new Error("No 2d context");
    }

    ctx.drawImage(
      previewCanvas,
      0,
      0,
      previewCanvas.width,
      previewCanvas.height,
      0,
      0,
      offscreen.width,
      offscreen.height
    );
    const blob = await offscreen.convertToBlob({
      type: "image/png",
      quality: 1,
    });

    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
    }
    blobUrlRef.current = URL.createObjectURL(blob);

    setDigitalSignUrl(blobUrlRef.current);
    blobUrlToFile(blobUrlRef.current)
      .then((resFile: any) => {
        formik.setFieldValue("DigitalSign", resFile.name);
        formik.setFieldValue("DigitalSignName", resFile.name);
        setShowCropper(false);
        setDigitalSignCroppedDoc(resFile);
      })
      .catch((err) => {});
  }

  useDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        canvasPreview(
          imgRef.current,
          previewCanvasRef.current,
          completedCrop,
          scale,
          rotate
        );
      }
    },
    100,
    [completedCrop, scale, rotate]
  );

  function handleToggleAspectClick() {
    if (aspect) {
      setAspect(undefined);
    } else {
      setAspect(16 / 9);

      if (imgRef.current) {
        const { width, height } = imgRef.current;
        const newCrop = centerAspectCrop(width, height, 16 / 9);
        setCrop(newCrop);
        // Updates the preview
        setCompletedCrop(convertToPixelCrop(newCrop, width, height));
      }
    }
  }

  function onSelectFile(e: any) {
    if (e && e?.files && e?.files.length > 0) {
      setShowCropper(true);
      setCrop(undefined);
      const reader = new FileReader();
      setDigitalSignDoc(e?.files[0]);
      reader.addEventListener("load", () =>
        setImgSrc(reader.result?.toString() || "")
      );
      reader.readAsDataURL(e?.files[0]);
    }
  }

  // Digital Sign Upload

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
                  <h1>User</h1>
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
                        className="text-center"
                        disabled={isEmpDisable || isView}
                        onClick={() => resetAllForms()}
                      />
                    </>
                    <Button
                      label=""
                      icon="pi pi-search"
                      title="Back to Search"
                      className="p-button p-button-success text-center"
                      onClick={() => {
                        route.push("/home/vUser");
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
                            <div className="col-12 md:col-3">
                              <div className="img-preview-container m-auto">
                                <FileUpload
                                  mode="basic"
                                  name="demo[]"
                                  url="#"
                                  chooseOptions={customOptions}
                                  className="custom-upload inline-block"
                                  accept="image/jpeg, image/png, image/jpg"
                                  // maxFileSize={1000000}
                                  auto
                                  chooseLabel="Upload Photo"
                                  onSelect={onUpload}
                                  disabled={isView ? true : false}
                                  customUpload
                                  ref={imageUploadRef}
                                />
                                <div className="img-preview-hidden">
                                  <img
                                    src={imageUrl}
                                    alt="logo"
                                    className="w-full"
                                  />
                                </div>
                                <a
                                  className={`${
                                    isView ? "p-disabled" : null
                                  } img-preview-close`}
                                  onClick={handleCloseImage}
                                >
                                  <i className="las la-times-circle"></i>
                                </a>
                              </div>
                            </div>
                            <div className="col-9 md:col-9">
                              <div className="grid">
                                {/*<FormFields
                                  type={"select"}
                                  name={"EmpId"}
                                  label={"Employee Name"}
                                  options={EmployeeList}
                                  show={true}
                                  required={true}
                                  disable={
                                    isView || isEmpDisable ? true : false
                                  }
                                  optionLabel={"FirstName"}
                                  optionValue={"EmployeeId"}
                                  handleSelect={handleEmployeeSelect}
                                  formik={formik}
                                  fldStyle={"col-12 md:col-4"}
                                />*/}
                                <FormFields
                                  type={"text"}
                                  name={"UserCode"}
                                  label={"User Code"}
                                  options={""}
                                  show={false}
                                  required={true}
                                  disable={false}
                                  optionLabel={""}
                                  optionValue={""}
                                  handleSelect={""}
                                  formik={formik}
                                  fldStyle={"col-12 md:col-3"}
                                />
                                <FormFields
                                  type={"text"}
                                  name={"UserName"}
                                  label={"User Name"}
                                  show={true}
                                  required={true}
                                  disable={isView ? true : false}
                                  optionLabel={""}
                                  optionValue={""}
                                  handleSelect={""}
                                  formik={formik}
                                  fldStyle={"col-12 md:col-4"}
                                />
                                <FormFields
                                  type={"password"}
                                  name={"Password"}
                                  label={"Password"}
                                  show={true}
                                  required={true}
                                  disable={isView || createEditData != null}
                                  optionLabel={""}
                                  optionValue={""}
                                  handleSelect={""}
                                  feedback={true}
                                  formik={formik}
                                  fldStyle={"col-12 md:col-4"}
                                  header={header}
                                  footer={footer}
                                  toggleMask={
                                    isView || createEditData != null
                                      ? false
                                      : true
                                  }
                                />
                                <FormFields
                                  type={"select"}
                                  name={"DeptId"}
                                  label={"Department"}
                                  options={DepartmentList}
                                  show={true}
                                  required={true}
                                  disable={isView ? true : false}
                                  optionLabel={"DepartmentName"}
                                  optionValue={"DepartmentId"}
                                  handleSelect={handleSelect}
                                  formik={formik}
                                  fldStyle={"col-12 md:col-4"}
                                />
                                <FormFields
                                  type={"text"}
                                  name={"UserEmail"}
                                  label={"E-Mail ID"}
                                  options={""}
                                  show={true}
                                  required={false}
                                  disable={isView ? true : false}
                                  optionLabel={""}
                                  optionValue={""}
                                  handleSelect={""}
                                  formik={formik}
                                  fldStyle={"col-12 md:col-4"}
                                />
                                <FormFields
                                  type={"text"}
                                  name={"UserTelNo"}
                                  label={"Mobile Number"}
                                  options={""}
                                  show={true}
                                  required={true}
                                  disable={isView ? true : false}
                                  optionLabel={""}
                                  optionValue={""}
                                  handleSelect={""}
                                  formik={formik}
                                  fldStyle={"col-12 md:col-4"}
                                  maxLength={10}
                                  minLength={9}
                                  keyfilter="int"
                                />

                                <FormFields
                                  type={"text"}
                                  name={"SecondaryMobileNo"}
                                  label={"Secondary Mobile Number"}
                                  options={""}
                                  show={true}
                                  required={false}
                                  disable={isView ? true : false}
                                  optionLabel={""}
                                  optionValue={""}
                                  handleSelect={""}
                                  formik={formik}
                                  fldStyle={"col-12 md:col-4"}
                                  maxLength={15}
                                  minLength={9}
                                  keyfilter="int"
                                />
                              </div>
                            </div>
                            <div className="col-9 md:col-9">
                              <div className="grid">
                                <FormFields
                                  type={"multi_select"}
                                  name={"CompanyNames"}
                                  label={"Company Name"}
                                  options={CompanyList}
                                  show={true}
                                  required={true}
                                  disable={isView ? true : false}
                                  optionLabel={"CompanyName"}
                                  optionValue={"CompanyId"}
                                  handleSelect={handleCompanySelect}
                                  formik={formik}
                                  fldStyle={"col-12 md:col-4"}
                                />

                                <FormFields
                                  type={"select"}
                                  name={"CompanyId"}
                                  label={"Default Company"}
                                  options={defaultCompanyList}
                                  show={true}
                                  required={true}
                                  disable={isView ? true : false}
                                  optionLabel={"CompanyName"}
                                  optionValue={"CompanyId"}
                                  handleSelect={handleDefCompanySelect}
                                  showFilter={true}
                                  formik={formik}
                                  fldStyle={"col-12 md:col-4"}
                                />
                                <FormFields
                                  type={"multi_select"}
                                  name={"PlantNames"}
                                  label={"Plant Name"}
                                  options={plantList}
                                  show={true}
                                  required={true}
                                  disable={isView ? true : false}
                                  optionLabel={"PlantName"}
                                  optionValue={"PlantId"}
                                  handleSelect={handlePlantSelect}
                                  formik={formik}
                                  fldStyle={"col-12 md:col-4"}
                                />

                                <FormFields
                                  type={"select"}
                                  name={"PlantId"}
                                  label={"Default Plant"}
                                  options={defaultPlantList}
                                  show={true}
                                  required={true}
                                  disable={isView ? true : false}
                                  optionLabel={"PlantName"}
                                  optionValue={"PlantId"}
                                  showFilter={true}
                                  handleSelect={handleDefPlantSelect}
                                  formik={formik}
                                  fldStyle={"col-12 md:col-4"}
                                />
                                <FormFields
                                  type={"multi_select"}
                                  name={"RoleNames"}
                                  label={"Role Name"}
                                  options={RoleList}
                                  show={true}
                                  required={true}
                                  disable={isView ? true : false}
                                  optionLabel={"RoleName"}
                                  optionValue={"RoleId"}
                                  handleSelect={handleRoleSelect}
                                  formik={formik}
                                  fldStyle={"col-12 md:col-4"}
                                />
                                <FormFields
                                  type={"select"}
                                  name={"DefaultRoleId"}
                                  label={"Default Role"}
                                  options={defaultRoleList}
                                  show={true}
                                  required={true}
                                  disable={isView ? true : false}
                                  optionLabel={"RoleName"}
                                  optionValue={"RoleId"}
                                  handleSelect={handleDefRoleSelect}
                                  showFilter={true}
                                  formik={formik}
                                  fldStyle={"col-12 md:col-4"}
                                />
                                <FormFields
                                  type={"multi_select"}
                                  name={"GateNames"}
                                  label={"Gate Name"}
                                  options={gateList}
                                  show={true}
                                  required={false}
                                  disable={isView ? true : false}
                                  optionLabel={"GateName"}
                                  optionValue={"GateId"}
                                  handleSelect={handleGateSelect}
                                  formik={formik}
                                  fldStyle={"col-12 md:col-4"}
                                />
                                <FormFields
                                  type={"select"}
                                  name={"GateId"}
                                  label={"Default Gate"}
                                  options={defaultGateList}
                                  show={true}
                                  required={false}
                                  disable={isView ? true : false}
                                  optionLabel={"GateName"}
                                  optionValue={"GateId"}
                                  showFilter={true}
                                  handleSelect={handleDefGateSelect}
                                  formik={formik}
                                  fldStyle={"col-12 md:col-4"}
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
                                  fldStyle={"col-12 md:col-4"}
                                />
                              </div>
                            </div>
                            <div className="col-12 md:col-3">
                              <div className="grid">
                                <div className="col-12">
                                  <ImageCropper
                                    digitalSignDocRef={digitalSignDocRef}
                                    previewCanvasRef={previewCanvasRef}
                                    chooseOptions={chooseOptions}
                                    onSelectFile={onSelectFile}
                                    DigitalSignUrl={DigitalSignUrl}
                                    isView={isView}
                                    handleClick={handleClick}
                                    formik={formik}
                                    ClearFileUpload={ClearFileUpload}
                                    imgSrc={imgSrc}
                                    crop={crop}
                                    setCrop={setCrop}
                                    completedCrop={completedCrop}
                                    setCompletedCrop={setCompletedCrop}
                                    aspect={aspect}
                                    imgRef={imgRef}
                                    scale={scale}
                                    rotate={rotate}
                                    onImageLoad={onImageLoad}
                                    showCropper={showCropper}
                                    setShowCropper={setShowCropper}
                                    cropSave={cropSave}
                                    onDownloadCropClick={onDownloadCropClick}
                                  />
                                </div>
                                <FormFields
                                  type={"textarea"}
                                  name={"Address"}
                                  label={"Address"}
                                  options={""}
                                  show={true}
                                  required={false}
                                  disable={isView ? true : false}
                                  optionLabel={""}
                                  optionValue={""}
                                  handleSelect={""}
                                  formik={formik}
                                  fldStyle={"col-12"}
                                  maxLength="500"
                                  style={{
                                    maxHeight: "100px",
                                    overflowY: "auto",
                                  }}
                                />
                              </div>
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
              {createEditData != null ? (
                <ChangePass formik={formik} header={header} footer={footer} />
              ) : null}
            </div>
          </div>
        </div>
      </Formik>
      <AppAlert toast={toast} />
    </>
  );
};

export default CUser;
