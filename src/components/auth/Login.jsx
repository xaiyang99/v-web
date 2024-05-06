import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import * as Yup from "yup";
import { Formik } from "formik";

import {
  Checkbox,
  FormControlLabel,
  TextField as MuiTextField,
  InputLabel,
  Box,
} from "@mui/material";
import { spacing } from "@mui/system";

import useAuth from "../../hooks/useAuth";
import { ButtonLoginAdmin, PasswordBox, PasswordForget } from "./css/style";
import { PasswordForgetBox } from "./css/style";
import ReCAPTCHA from "react-google-recaptcha";
import { recaptchaKey } from "../../functions";
import useManageSetting from "../../pages/dashboards/settings/hooks/useManageSetting";
import "./css/recaptchaStyle.css";

const TextField = styled(MuiTextField)(spacing);

function SignIn() {
  const [captcha, setCaptcha] = useState(false);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [hideRemember, setHideRemember] = useState(false);
  const { logIn } = useAuth();
  const useDataSetting = useManageSetting();

  const settingKeys = {
    loginCaptcha: "ECPTCHP",
    rememberMe: "RMBMEEB",
  };

  function handleData(data) {
    if (data) setCaptcha(false);
  }

  function handleExpired() {
    window.location.reload();
  }

  function findDataSetting(productKey) {
    const res = useDataSetting.data?.find(
      (data) => data?.productKey === productKey,
    );

    return res;
  }

  useEffect(() => {
    function getDataSetting() {
      const loginData = findDataSetting(settingKeys.loginCaptcha);
      if (!!loginData) {
        const activeCaptcha = loginData?.status;
        if (activeCaptcha === "on") {
          setCaptcha(true);
          setShowCaptcha(true);
        }
      }

      const rememeberMeData = findDataSetting(settingKeys.rememberMe);
      if (!!rememeberMeData) {
        const status = rememeberMeData?.status;
        if (status === "on") {
          setHideRemember(true);
        }
      }
    }

    getDataSetting();
  }, [useDataSetting.data]);

  return (
    <Formik
      initialValues={{
        username: "",
        password: "",
      }}
      validationSchema={Yup.object().shape({
        username: Yup.string().max(255).required("Username is required"),
        password: Yup.string().max(255).required("Password is required"),
      })}
      onSubmit={async (values, { setErrors, setStatus }) => {
        try {
          await logIn(values.username, values.password);
        } catch (error) {
          const message = error.message || "Something went wrong";
          setStatus({ success: false });
          setErrors({ submit: message });
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
        <form
          style={{ width: "100%", display: "flex", flexDirection: "column" }}
          onSubmit={handleSubmit}
        >
          <InputLabel sx={{ textAlign: "left" }}>Email or Username</InputLabel>
          <TextField
            type="text"
            name="username"
            label="Username"
            fullWidth={true}
            error={Boolean(touched.username && errors.username)}
            helperText={touched.username && errors.username}
            value={values.username}
            onChange={handleChange}
            my={2}
          />
          <PasswordBox>
            <PasswordForgetBox>
              <InputLabel>Password</InputLabel>
              <PasswordForget href="/auth/forgot-password">
                Forget Password?
              </PasswordForget>
            </PasswordForgetBox>
          </PasswordBox>
          <TextField
            type="password"
            name="password"
            label="Password"
            error={Boolean(touched.password && errors.password)}
            fullWidth={true}
            helperText={touched.password && errors.password}
            onBlur={handleBlur}
            value={values.password}
            onChange={handleChange}
            my={2}
          />
          {hideRemember && (
            <FormControlLabel
              sx={{ color: "#6F6B7D" }}
              control={<Checkbox color="primary" />}
              label="Remember me"
            />
          )}

          {showCaptcha && (
            <Box sx={{ margin: "auto", mt: 4, mb: 1 }}>
              <ReCAPTCHA
                sitekey={recaptchaKey}
                onChange={handleData}
                onExpired={handleExpired}
              />
            </Box>
          )}

          <ButtonLoginAdmin
            type="submit"
            variant="contained"
            fullWidth={true}
            disabled={captcha}
          >
            Sign in
          </ButtonLoginAdmin>
        </form>
      )}
    </Formik>
  );
}

export default SignIn;
