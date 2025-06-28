import { useEffect, useRef } from "react";
import { Formik, FormikHelpers, FormikValues, useFormik } from "formik";
import { AppslogoBig, LoginBg } from "../../assets/css/img-library";
import {
  Button,
  InputText,
  Password,
  Dropdown,
  Toast,
} from "../../assets/css/prime-library";
import { AuthValidationScheam } from "@/validations/Master";
import { event } from "jquery";
import { useDispatch, useSelector } from "react-redux";
import { login } from "@/redux/slices/common/authSlice";
import { useHistory } from "react-router-dom";
import { showToast } from "@/redux/slices/common/alertsSlice";
import { AppProgressSpinner } from "@/components/UtilityComp";
import AppAlert from "@/alert/alert";
import { Divider } from "primereact/divider";
import { jwtDecode } from "jwt-decode";
import { checkTrial } from "@/utils/utilFunc";

const Login = () => {
  const dispatch: any = useDispatch();
  const route = useHistory();

  const toast = useRef<Toast>(null);

  const { user, loading } = useSelector((state: any) => state.auth);

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

  const formik: any = useFormik({
    initialValues: {
      // UserName: "",
      MobileNo: "",
      PassWord: "",
    },
    onSubmit: (values, event: any) => {
      const user = dispatch(login(values));
      user
        .then((res) => {
          if (res) {
            if (res != null) {
              if (res.payload.tranStatus.result == false) {
                toast.current?.show({
                  severity: "warn",
                  summary: "Login Error",
                  detail: res.payload.tranStatus.lstErrorItem[0].Message,
                  life: 5000,
                });
              } else if (res.payload.tranStatus.result == true) {
                if (localStorage.getItem("data_AuthToken")) {
                  var trialRes = checkTrial();
                  if (trialRes) {
                    if (trialRes.result) {
                      toast.current?.show({
                        severity: "success",
                        summary: "Login Success",
                        detail: res.payload.tranStatus.lstErrorItem[0].Message,
                      });
                      if (localStorage.getItem("data_AuthToken")) {
                        if (localStorage["data_AuthToken"].length > 1) {
                          let defRole = localStorage["DefaultRoleId"];
                          if (defRole == "4") {
                            route.push("/home/cVisitorManagement");
                          } else {
                            route.push("/home/cVisitorManagement");
                          }
                        }
                      }
                    } else {
                      trialRes?.lstErrorItem &&
                        trialRes?.lstErrorItem.length > 0 &&
                        trialRes?.lstErrorItem.forEach((element) => {
                          toast.current?.show({
                            severity: "warn",
                            summary: element.Title,
                            detail: element.Message,
                            life: 5000,
                          });
                        });
                      return;
                    }
                  }

                  // }
                }
              }
            }
          }
        })
        .catch((err) => {
          toast.current?.show({
            severity: "warn",
            summary: JSON.stringify(err),
            detail: "",
          });
        });
    },
    validationSchema: AuthValidationScheam,
  });

  const handleOnEnter = (e) => {
    if (e.keyCode == 13) {
      e.preventDefault();
      e.stopPropagation();
      formik.handleSubmit();
    }
  };

  function decodeToken(token: any) {
    try {
      const decodedToken = jwtDecode(token);

      return decodedToken;
    } catch (error) {
      console.error("Invalid token:", error);
      return null;
    }
  }

  return (
    <>
      <div className="login-page">
        <div className="flex align-items-center justify-content-center">
          <div className="col-4 h-full flex align-items-center justify-content-center login-left">
            <div className="login-container">
              <div className="text-center">
                <img
                  style={{
                    width: "150px",
                  }}
                  src={AppslogoBig}
                  alt=""
                />
              </div>
              <Formik
                initialValues={formik.initialValues}
                validationSchema={AuthValidationScheam}
                onSubmit={formik.handleSubmit}
              >
                <div className="grid">
                  {/* <div className="col-12">
                    <label className="form-label">
                      Username <span className="hlt-txt">*</span>
                    </label>
                    <InputText
                      id="UserName"
                      value={formik.values["UserName"]}
                      name="UserName"
                      className="w-full"
                      onChange={formik.handleChange}
                      onKeyDown={handleOnEnter}
                    />
                    <small className="p-error">
                      {formik.touched["UserName"] && formik.errors["UserName"]}
                    </small>
                  </div> */}
                  <div className="col-12">
                    <label className="form-label">
                      Mobile No <span className="hlt-txt">*</span>
                    </label>
                    <InputText
                      id="MobileNo"
                      value={formik.values["MobileNo"]}
                      name="MobileNo"
                      className="w-full"
                      onChange={formik.handleChange}
                      onKeyDown={handleOnEnter}
                      keyfilter={"int"}
                      maxLength={10}
                      autoComplete="off"
                    />
                    <small className="p-error">
                      {formik.touched["MobileNo"] && formik.errors["MobileNo"]}
                    </small>
                  </div>
                  <div className="col-12">
                    <label className="form-label">
                      Password <span className="hlt-txt">*</span>
                    </label>
                    <Password
                      id="PassWord"
                      name="PassWord"
                      value={formik.values["PassWord"]}
                      className="w-full"
                      onChange={formik.handleChange}
                      onKeyDown={handleOnEnter}
                      feedback={false}
                      header={header}
                      footer={footer}
                      autoComplete="off"
                      toggleMask
                    />
                    <small className="p-error">
                      {formik.touched["PassWord"] && formik.errors["PassWord"]}
                    </small>
                  </div>

                  <div className="col-12 text-center">
                    <Button
                      label="Login"
                      icon="pi pi-sign-in"
                      className="text-center"
                      type="submit"
                      onClick={() => formik.handleSubmit()}
                    />
                  </div>
                </div>
              </Formik>
            </div>
          </div>
          <div className="col-8 h-full flex align-items-center justify-content-center login-right">
            <img src={LoginBg} alt="" className="w-full" />
          </div>
        </div>
      </div>

      {loading ? <AppProgressSpinner /> : null}

      <AppAlert toast={toast} />
      {/* <Toast ref={toast} /> */}
    </>
  );
};

export default Login;
