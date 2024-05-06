import styled from "@emotion/styled";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import {
  Box,
  Button,
  InputLabel,
  Link,
  Alert as MuiAlert,
  TextField as MuiTextField,
} from "@mui/material";
import { spacing } from "@mui/system";
import { Formik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";

import ReCAPTCHA from "react-google-recaptcha";
import { recaptchaKey } from "../../functions";
import useAuth from "../../hooks/useAuth";
import useManageSetting from "../../pages/dashboards/settings/hooks/useManageSetting";
import { useLocation, useNavigate } from "react-router-dom";
//components
const LinkBack = styled(Link)({
  display: "flex",
  justifyContent: "center",
  color: "#17766B",
  marginTop: "10px",
  fontWeight: "bold",
});

const Alert = styled(MuiAlert)(spacing);

const TextField = styled(MuiTextField)(spacing);

function ForgetPassword() {
  const [captcha, setCaptcha] = useState(false);

  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [showCaptcha, setShowCaptcha] = useState(false);
  const { forgetPassowrd, resetForgetPassword } = useAuth();
  const settingKeys = {
    forgetCaptcha: "ECOTFOR",
  };
  const useDataSetting = useManageSetting();

  const captchaStyle = {
    transform: "scale(0.9)",
    width: "100%",
  };

  function handleData(data) {
    if (data) setCaptcha(false);
  }

  function handleClearDateForgetPassword() {
    resetForgetPassword();
  }

  useEffect(() => {
    function getDataSetting() {
      const resData = useDataSetting.data?.find(
        (data) => data?.productKey === settingKeys.forgetCaptcha,
      );

      if (!!resData) {
        const forgetCaptcha = resData?.status;
        if (forgetCaptcha === "on") {
          setCaptcha(true);
          setShowCaptcha(true);
        }
      }
    }

    getDataSetting();
  }, [useDataSetting.data]);

  useEffect(() => {
    const handleNavigation = () => {
      handleClearDateForgetPassword();
    };

    if (!pathname.includes("/auth/forgot-password")) {
      handleNavigation();
    }

    function handleBeforeUnload(event) {
      if (event.type !== "beforeunload") {
        if (!pathname.includes("/auth/forgot-password")) {
          handleNavigation();
        }
      }
    }
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [pathname, navigate]);

  return (
    <Formik
      initialValues={{
        email: "",
        submit: false,
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string()
          .email("Must be a valid email")
          .max(255)
          .required("Email is required"),
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          if (!captcha) {
            await forgetPassowrd(values.email);
          }
        } catch (error) {
          const message = error.message || "Something went wrong";
          setStatus({ success: false });
          setErrors({ submit: message });
          setSubmitting(false);
        }
      }}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        touched,
        values,
      }) => (
        <form noValidate onSubmit={handleSubmit}>
          {errors.submit && (
            <Alert mt={2} mb={1} severity="warning">
              {errors.submit}
            </Alert>
          )}
          <InputLabel sx={{ mt: 5, mb: -2 }}>Email</InputLabel>
          <TextField
            type="email"
            name="email"
            size="small"
            value={values.email}
            error={Boolean(touched.email && errors.email)}
            fullWidth
            helperText={touched.email && errors.email}
            onBlur={handleBlur}
            onChange={handleChange}
            my={3}
            placeholder="john.deos@gmail.com"
          />

          {showCaptcha && (
            <Box sx={{ margin: "auto", display: "table", mt: 2, mb: 5 }}>
              <ReCAPTCHA
                sitekey={recaptchaKey}
                onChange={handleData}
                onExpired={(e) => {
                  console.error(e);
                }}
                style={captchaStyle}
              />
            </Box>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primaryTheme"
            disabled={captcha}
            sx={{ borderRadius: "6px" }}
          >
            Send Reset Link
          </Button>
          <LinkBack
            href="/auth/sign-in"
            onClick={() => {
              handleClearDateForgetPassword();
            }}
          >
            <ArrowBackIosIcon sx={{ fontSize: "15px", mt: 0.5 }} />
            Back to sign in
          </LinkBack>
        </form>
      )}
    </Formik>
  );
}

export default ForgetPassword;
