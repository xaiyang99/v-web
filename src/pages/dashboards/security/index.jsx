import React, { Fragment, useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControlLabel,
  FormGroup,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import * as MUI from "../css/settingStyle";
import * as Icon from "../../../icons/icons";
import BreadcrumbNavigate from "../../../components/BreadcrumbNavigate";
import { useMutation } from "@apollo/client";
import { MUTATION_UPDATE_SETTING } from "../settings/apollo";
import { errorMessage, successMessage } from "../../../components/Alerts";
import * as yup from "yup";
import { Formik } from "formik";
import useManageSetting from "../settings/hooks/useManageSetting";
import { useTranslation } from "react-i18next";
import { handleGraphqlErrors, inputNumberOnly } from "../../../functions";

function SecuritySetting() {
  const { t } = useTranslation();
  const [loginCaptcha, setLoginCaptcha] = useState(false);
  const [registerCaptcha, setRegisterCaptcha] = useState(false);
  const [filedropCaptcha, setFiledropCaptcha] = useState(false);
  const [forgetCaptcha, setForgetCaptcha] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isFactor, setIsFactor] = useState(false);
  const [data, setData] = useState({
    loginLimit: "",
    registerLimit: "",
  });
  const [updateSetting] = useMutation(MUTATION_UPDATE_SETTING);

  const validateSchema = yup.object().shape({
    loginLimit: yup.number().required("Login Limit is required"),
    registerLimit: yup.number().required("Register Limit is required"),
  });

  const settingKeys = {
    loginLimit: "LGONLIG",
    registerLimit: "REISTLI",
    loginCaptcha: "ECPTCHP",
    filedropCaptcha: "FDCHPA",
    registerCaptcha: "ENCOTHP",
    forgetCaptcha: "ECOTFOR",
    rememberMe: "RMBMEEB",
    _2Factor: "TFAITCG",
  };

  const useDataSetting = useManageSetting();

  async function onSubmitForm(values) {
    // loginLimit and registerLimit

    try {
      const resLogin = await updateSetting({
        variables: {
          data: {
            action: values?.loginLimit?.toString(),
          },
          where: {
            productKey: settingKeys.loginLimit,
          },
        },
      });

      if (resLogin?.data?.updateGeneral_settings?._id) {
        //
        const resRegister = await updateSetting({
          variables: {
            data: {
              action: values?.registerLimit?.toString(),
            },
            where: {
              productKey: settingKeys.registerLimit,
            },
          },
        });

        if (resRegister?.data?.updateGeneral_settings?._id) {
          successMessage("Security data was updated successfully", 2000);
        }
      }
    } catch (error) {
      let cutErr = error.message.replace(/(ApolloError: )?Error: /, "");
      errorMessage(handleGraphqlErrors(cutErr), 3000);
    }
  }

  async function onUpdateToggle(value, productKey) {
    try {
      const result = await updateSetting({
        variables: {
          data: {
            status: value ? "on" : "off",
          },
          where: {
            productKey,
          },
        },
      });

      if (result?.data?.updateGeneral_settings?._id) {
        successMessage("Data was updated successfully", 2000);
      }
    } catch (error) {
      let cutErr = error.message.replace(/(ApolloError: )?Error: /, "");
      errorMessage(handleGraphqlErrors(cutErr), 3000);
    }
  }

  const findDataSetting = (productKey) => {
    const dataSetting = useDataSetting.data?.find(
      (data) => data?.productKey === productKey,
    );

    return dataSetting;
  };

  useEffect(() => {
    async function getDataSettings() {
      // Login Captcha
      const resLogin = findDataSetting(settingKeys.loginCaptcha);
      if (!!resLogin) {
        setLoginCaptcha(resLogin?.status === "on" ? true : false);
      }

      // Register Captcha
      const resRegister = findDataSetting(settingKeys.registerCaptcha);
      if (!!resRegister) {
        setRegisterCaptcha(resRegister?.status === "on" ? true : false);
      }

      // Forget Captcha
      const resForget = findDataSetting(settingKeys.forgetCaptcha);
      if (!!resForget) {
        setForgetCaptcha(resForget?.status === "on" ? true : false);
      }

      // Remember Me
      const resRemember = findDataSetting(settingKeys.rememberMe);
      if (!!resRemember) {
        setRememberMe(resRemember?.status === "on" ? true : false);
      }

      // Factor Authentication
      const resFactor = findDataSetting(settingKeys._2Factor);
      if (!!resFactor) {
        setIsFactor(resFactor?.status === "on" ? true : false);
      }

      // file drop captcha
      const resFiledrop = findDataSetting(settingKeys.filedropCaptcha);
      if (!!resFiledrop) {
        setFiledropCaptcha(resFiledrop?.status === "on" ? true : false);
      }

      // End
    }

    getDataSettings();
  }, [useDataSetting.data]);

  useEffect(() => {
    async function getLimitData() {
      const resLogin = await useDataSetting.data?.find(
        (data) => data?.productKey === settingKeys.loginLimit,
      );

      if (!!resLogin) {
        setData((prev) => {
          return {
            ...prev,
            loginLimit: parseInt(resLogin?.action || ""),
          };
        });
      }

      const resRegister = await useDataSetting.data?.find(
        (data) => data?.productKey === settingKeys.registerLimit,
      );

      if (!!resRegister) {
        setData((prev) => {
          return {
            ...prev,
            registerLimit: parseInt(resRegister?.action || ""),
          };
        });
      }
    }

    getLimitData();
  }, [useDataSetting.data]);

  return (
    <Fragment>
      <BreadcrumbNavigate
        separatorIcon={<Icon.ForeSlash />}
        title="Setting"
        path={["Setting"]}
        readablePath={[t("_setting"), t("_security_setting")]}
      />
      <MUI.SettingContainer>
        <Paper
          sx={{
            mt: (theme) => theme.spacing(3),
            boxShadow: (theme) => theme.baseShadow.secondary,
            flex: "1 1 0",
          }}
        >
          {/* {JSON.stringify(useLoginLimit.loginLimit?.action)} */}
          <MUI.SettingWrapperContainer>
            <Formik
              initialValues={{
                loginLimit: data.loginLimit,
                registerLimit: data.registerLimit,
              }}
              validationSchema={validateSchema}
              enableReinitialize={true}
              onSubmit={onSubmitForm}
            >
              {({ errors, touched, handleChange, handleSubmit, values }) => (
                <form onSubmit={handleSubmit}>
                  {/* Login */}
                  <MUI.SettingHeaderContainer>
                    <MUI.SettingLabel>{t("_login_limit")}</MUI.SettingLabel>
                    <TextField
                      name="loginLimit"
                      type="text"
                      size="small"
                      placeholder="Enter amount"
                      fullWidth={true}
                      error={Boolean(touched.loginLimit && errors.loginLimit)}
                      helperText={touched.loginLimit && errors.loginLimit}
                      onChange={handleChange}
                      onKeyPress={inputNumberOnly}
                      value={values.loginLimit || parseInt("0")}
                    />

                    {!(errors.loginLimit && touched.loginLimit) && (
                      <MUI.SettingHint>
                        {t("_login_limit_description")}
                      </MUI.SettingHint>
                    )}
                  </MUI.SettingHeaderContainer>

                  {/* Registration */}
                  <MUI.SettingHeaderContainer>
                    <MUI.SettingLabel>{t("_register_limit")}</MUI.SettingLabel>
                    <TextField
                      name="registerLimit"
                      type="text"
                      size="small"
                      placeholder="Enter amount"
                      fullWidth={true}
                      error={Boolean(
                        touched.registerLimit && errors.registerLimit,
                      )}
                      helperText={touched.registerLimit && errors.registerLimit}
                      onChange={handleChange}
                      onKeyPress={inputNumberOnly}
                      value={values.registerLimit || parseInt("0")}
                    />

                    {!(errors.registerLimit && touched.registerLimit) && (
                      <MUI.SettingHint>
                        {t("_register_limit_description")}
                      </MUI.SettingHint>
                    )}
                  </MUI.SettingHeaderContainer>

                  {/* login Captcha */}
                  <MUI.SettingHeaderContainer sx={{ pb: 3 }}>
                    <Typography variant="h2">
                      {t("_login_enable_captach_title")}
                    </Typography>
                    <MUI.SettingSubHeaderContainer>
                      <FormGroup row>
                        <Box className="sub-toggle" sx={{ ml: 3 }}>
                          <FormControlLabel
                            control={
                              <MUI.SwitchToggle
                                inputProps={{ "aria-label": "ant design" }}
                                checked={loginCaptcha}
                                onChange={(e) => {
                                  const checked = e.target.checked;
                                  setLoginCaptcha(checked);
                                  onUpdateToggle(
                                    checked,
                                    settingKeys.loginCaptcha,
                                  );
                                }}
                              />
                            }
                          />
                          <Box className="sub-toggle-text">
                            <Typography variant="h4">
                              {t("_login_enable_captach_description")}
                            </Typography>
                          </Box>
                        </Box>
                      </FormGroup>
                    </MUI.SettingSubHeaderContainer>
                  </MUI.SettingHeaderContainer>

                  {/* register Captcha */}
                  <MUI.SettingHeaderContainer sx={{ pb: 3 }}>
                    <Typography variant="h2">
                      {t("_register_enable_captach_title")}
                    </Typography>
                    <MUI.SettingSubHeaderContainer>
                      <FormGroup row>
                        <Box className="sub-toggle" sx={{ ml: 3 }}>
                          <FormControlLabel
                            control={
                              <MUI.SwitchToggle
                                inputProps={{ "aria-label": "ant design" }}
                                checked={registerCaptcha}
                                onChange={(e) => {
                                  const checked = e.target.checked;
                                  setRegisterCaptcha(checked);
                                  onUpdateToggle(
                                    checked,
                                    settingKeys.registerCaptcha,
                                  );
                                }}
                              />
                            }
                          />
                          <Box className="sub-toggle-text">
                            <Typography variant="h4">
                              {t("_register_enable_captach_description")}
                            </Typography>
                          </Box>
                        </Box>
                      </FormGroup>
                    </MUI.SettingSubHeaderContainer>
                  </MUI.SettingHeaderContainer>

                  {/* filedrop Captcha */}
                  <MUI.SettingHeaderContainer sx={{ pb: 3 }}>
                    <Typography variant="h2">
                      Enable captcha on the filedrop page
                    </Typography>
                    <MUI.SettingSubHeaderContainer>
                      <FormGroup row>
                        <Box className="sub-toggle" sx={{ ml: 3 }}>
                          <FormControlLabel
                            control={
                              <MUI.SwitchToggle
                                inputProps={{ "aria-label": "ant design" }}
                                checked={filedropCaptcha}
                                onChange={(e) => {
                                  const checked = e.target.checked;
                                  setFiledropCaptcha(checked);
                                  onUpdateToggle(
                                    checked,
                                    settingKeys.filedropCaptcha,
                                  );
                                }}
                              />
                            }
                          />
                          <Box className="sub-toggle-text">
                            <Typography variant="h4">
                              {t("_filedrop_enable_captach_description")}
                            </Typography>
                          </Box>
                        </Box>
                      </FormGroup>
                    </MUI.SettingSubHeaderContainer>
                  </MUI.SettingHeaderContainer>

                  {/* forget password Captcha */}
                  <MUI.SettingHeaderContainer sx={{ pb: 3 }}>
                    <Typography variant="h2">
                      {t("_forget_password_enable_captach_title")}
                    </Typography>
                    <MUI.SettingSubHeaderContainer>
                      <FormGroup row>
                        <Box className="sub-toggle" sx={{ ml: 3 }}>
                          <FormControlLabel
                            control={
                              <MUI.SwitchToggle
                                inputProps={{ "aria-label": "ant design" }}
                                checked={forgetCaptcha}
                                onChange={(e) => {
                                  const checked = e.target.checked;
                                  setForgetCaptcha(checked);
                                  onUpdateToggle(
                                    checked,
                                    settingKeys.forgetCaptcha,
                                  );
                                }}
                              />
                            }
                          />
                          <Box className="sub-toggle-text">
                            <Typography variant="h4">
                              {t("_forget_password_enable_captach_description")}
                            </Typography>
                          </Box>
                        </Box>
                      </FormGroup>
                    </MUI.SettingSubHeaderContainer>
                  </MUI.SettingHeaderContainer>

                  {/* remember me */}
                  <MUI.SettingHeaderContainer sx={{ pb: 3 }}>
                    <Typography variant="h2">
                      {t("_remember_me_title")}
                    </Typography>
                    <MUI.SettingSubHeaderContainer>
                      <FormGroup row>
                        <Box className="sub-toggle" sx={{ ml: 3 }}>
                          <FormControlLabel
                            control={
                              <MUI.SwitchToggle
                                inputProps={{ "aria-label": "ant design" }}
                                checked={rememberMe}
                                onChange={(e) => {
                                  const checked = e.target.checked;
                                  setRememberMe(checked);
                                  onUpdateToggle(
                                    checked,
                                    settingKeys.rememberMe,
                                  );
                                }}
                              />
                            }
                          />
                          <Box className="sub-toggle-text">
                            <Typography variant="h4">
                              {t("_remember_me_description")}
                            </Typography>
                          </Box>
                        </Box>
                      </FormGroup>
                    </MUI.SettingSubHeaderContainer>
                  </MUI.SettingHeaderContainer>

                  {/* 2-Factor on Authentication */}
                  <MUI.SettingHeaderContainer>
                    <Typography variant="h2">{t("_2fa_title")}</Typography>
                    <MUI.SettingSubHeaderContainer>
                      <FormGroup row>
                        <Box className="sub-toggle" sx={{ ml: 3 }}>
                          <FormControlLabel
                            control={
                              <MUI.SwitchToggle
                                inputProps={{ "aria-label": "ant design" }}
                                checked={isFactor}
                                onChange={(e) => {
                                  const checked = e.target.checked;
                                  setIsFactor(checked);
                                  onUpdateToggle(checked, settingKeys._2Factor);
                                }}
                              />
                            }
                          />
                          <Box className="sub-toggle-text">
                            <Typography variant="h4">
                              {t("_2fa_description")}
                            </Typography>
                          </Box>
                        </Box>
                      </FormGroup>
                    </MUI.SettingSubHeaderContainer>
                  </MUI.SettingHeaderContainer>

                  {/* Line Action */}
                  <MUI.SettingLineAction></MUI.SettingLineAction>

                  {/* Action */}
                  <MUI.SettingAction>
                    <Button type="submit" variant="contained">
                      {t("_save_button")}
                    </Button>
                  </MUI.SettingAction>
                </form>
              )}
            </Formik>
          </MUI.SettingWrapperContainer>
        </Paper>
      </MUI.SettingContainer>
    </Fragment>
  );
}

export default SecuritySetting;
