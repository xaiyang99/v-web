import React, { useState } from "react";
import styled from "@emotion/styled";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import {
  Button,
  InputAdornment,
  InputLabel,
  Link,
  Alert as MuiAlert,
  TextField as MuiTextField,
} from "@mui/material";
import { spacing } from "@mui/system";
import { Formik } from "formik";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
// import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

import useAuth from "../../hooks/useAuth";

const Alert = styled(MuiAlert)(spacing);

const TextField = styled(MuiTextField)(spacing);
const LinkBack = styled(Link)({
  display: "flex",
  justifyContent: "center",
  color: "#17766B",
  marginTop: "8px",
  fontWeight: "bold",
});

function ResetPassword(props) {
  const { token } = props;
  const { resetPassword } = useAuth();
  const [showConfimPassword, setShowConfimPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const onShowPassword = (val) => {
    if (val === "newShow") {
      setShowPassword(!showPassword);
    } else {
      setShowConfimPassword(!showConfimPassword);
    }
  };

  return (
    <Formik
      initialValues={{
        token,
        newPassword: "",
        confirmPassword: "",
        submit: false,
      }}
      validationSchema={Yup.object().shape({
        newPassword: Yup.string()
          .required("Please enter a password.")
          .min(8, "Password must be at least 8 characters long.")
          .matches(
            /[a-z]/,
            "Password must contain at least one lowercase letter.",
            {
              message: "Your password is missing a lowercase letter.",
            },
          )
          .matches(/[0-9]/, "Password must contain at least one number.", {
            message: "Your password is missing a number.",
          }),
        confirmPassword: Yup.string()
          .required("Please confirm your password.")
          .oneOf([Yup.ref("newPassword")], "Passwords does not match"),
      })}
      onSubmit={(values, { setErrors, setStatus, setSubmitting }) => {
        try {
          resetPassword(values);
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
        isSubmitting,
        touched,
        values,
      }) => (
        <form noValidate onSubmit={handleSubmit}>
          {errors.submit && (
            <Alert mt={2} mb={1} severity="warning">
              {errors.submit}
            </Alert>
          )}

          <InputLabel sx={{ mt: 5, mb: -2 }}>New Passwored</InputLabel>
          <TextField
            type={showPassword ? "text" : "password"}
            name="newPassword"
            size="small"
            value={values.newPassword}
            error={Boolean(touched.newPassword && errors.newPassword)}
            fullWidth
            helperText={touched.newPassword && errors.newPassword}
            onBlur={handleBlur}
            onChange={handleChange}
            my={3}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {showPassword ? (
                    <AiOutlineEyeInvisible
                      style={{ cursor: "pointer" }}
                      size="18"
                      onClick={() => onShowPassword("newShow")}
                    />
                  ) : (
                    <AiOutlineEye
                      style={{ cursor: "pointer" }}
                      size="18"
                      onClick={() => onShowPassword("newShow")}
                    />
                  )}
                </InputAdornment>
              ),
            }}
          />
          <InputLabel sx={{ mb: -2 }}>Confirm Password</InputLabel>
          <TextField
            type={showConfimPassword ? "text" : "password"}
            name="confirmPassword"
            size="small"
            value={values.confirmPassword}
            error={Boolean(touched.confirmPassword && errors.confirmPassword)}
            fullWidth
            helperText={touched.confirmPassword && errors.confirmPassword}
            onBlur={handleBlur}
            onChange={handleChange}
            my={3}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {showConfimPassword ? (
                    <AiOutlineEyeInvisible
                      style={{ cursor: "pointer" }}
                      size="18"
                      onClick={() => onShowPassword("show")}
                    />
                  ) : (
                    <AiOutlineEye
                      style={{ cursor: "pointer" }}
                      size="18"
                      onClick={() => onShowPassword("show")}
                    />
                  )}
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primaryTheme"
            sx={{ borderRadius: "6px" }}
          >
            Set New Password
          </Button>
          <LinkBack href="/auth/sign-in">
            <ArrowBackIosIcon sx={{ fontSize: "15px", mt: 0.5 }} />
            Back to sign in
          </LinkBack>
        </form>
      )}
    </Formik>
  );
}

export default ResetPassword;
