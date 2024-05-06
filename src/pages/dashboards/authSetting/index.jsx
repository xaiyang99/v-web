import React, { Fragment, useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControlLabel,
  FormGroup,
  Paper,
  Typography,
} from "@mui/material";
import BreadcrumbNavigate from "../../../components/BreadcrumbNavigate";
import * as MUI from "../css/settingStyle";
import * as Icon from "../../../icons/icons";
import { useMutation } from "@apollo/client";
import { MUTATION_UPDATE_SETTING } from "../settings/apollo";
import { errorMessage, successMessage } from "../../../components/Alerts";
import useManageSetting from "../settings/hooks/useManageSetting";
import { useTranslation } from "react-i18next";
import { handleGraphqlErrors } from "../../../functions";

function AuthSetting() {
  const { t } = useTranslation();
  const [isRegister, setIsRegister] = useState(false);
  const [isFacebook, setIsFacebook] = useState(false);
  const [isgitHub, setIsGitHub] = useState(false);
  const [isGoogle, setIsGoogle] = useState(false);
  const [isFactor, setIsFactor] = useState(false);
  const [updateSetting] = useMutation(MUTATION_UPDATE_SETTING, {
    fetchPolicy: "no-cache",
  });

  const settingKeys = {
    register: "DSBRGTN",
    github: "LOGVGTS",
    google: "LOGVAGG",
    facebook: "LOGVAFB",
    _2Factor: "TFTATT",
  };

  const useDataSetting = useManageSetting();

  async function handleUpdateData(value, key) {
    try {
      const result = await updateSetting({
        variables: {
          data: {
            status: value ? "on" : "off",
          },
          where: {
            productKey: key,
          },
        },
      });

      if (result?.data?.updateGeneral_settings?._id) {
        successMessage("Data updated successfully", 2000);
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
    function getAuthSetting() {
      // Facebook
      const resFacebook = findDataSetting(settingKeys.facebook);
      if (!!resFacebook) {
        setIsFacebook(resFacebook?.status === "on" ? true : false);
      }

      // Register
      const resRegister = findDataSetting(settingKeys.register);
      if (!!resRegister) {
        setIsRegister(resRegister?.status === "on" ? true : false);
      }

      // Github
      const resGithub = findDataSetting(settingKeys.github);
      if (!!resGithub) {
        setIsGitHub(resGithub?.status === "on" ? true : false);
      }

      // Google
      const resGoogle = findDataSetting(settingKeys.google);
      if (!!resGoogle) {
        setIsGoogle(resGoogle?.status === "on" ? true : false);
      }

      // Factor Authentication
      const resFactor = findDataSetting(settingKeys._2Factor);
      if (!!resFactor) {
        setIsFactor(resFactor?.status === "on" ? true : false);
      }

      // End
    }

    getAuthSetting();
  }, [useDataSetting.data]);

  return (
    <Fragment>
      <BreadcrumbNavigate
        separatorIcon={<Icon.ForeSlash />}
        title="Setting"
        path={["Setting"]}
        readablePath={[t("_setting"), t("_auth_setting")]}
      />
      <MUI.SettingContainer>
        <Paper
          sx={{
            mt: (theme) => theme.spacing(3),
            boxShadow: (theme) => theme.baseShadow.secondary,
            flex: "1 1 0",
          }}
        >
          <MUI.SettingWrapperContainer>
            {/* Register */}
            <MUI.SettingHeaderContainer>
              <Typography variant="h2">
                {t("_disable_registration_title")}
              </Typography>

              <MUI.SettingSubHeaderContainer>
                <FormGroup row>
                  <Box className="sub-toggle" sx={{ ml: 3 }}>
                    <FormControlLabel
                      control={
                        <MUI.SwitchToggle
                          inputProps={{ "aria-label": "ant design" }}
                          checked={isRegister}
                          onChange={(e) => {
                            setIsRegister(e.target.checked);
                            handleUpdateData(
                              e.target.checked,
                              settingKeys.register,
                            );
                          }}
                        />
                      }
                    />
                    <Box className="sub-toggle-text">
                      <Typography variant="h4">
                        {t("_disable_resgistration_description")}
                      </Typography>
                    </Box>
                  </Box>
                </FormGroup>
              </MUI.SettingSubHeaderContainer>
            </MUI.SettingHeaderContainer>

            {/* Facebook */}
            <MUI.SettingHeaderContainer sx={{ pb: 3 }}>
              <Typography variant="h2">{t("_login_via_facebook")}</Typography>

              <MUI.SettingSubHeaderContainer>
                <FormGroup row>
                  <Box className="sub-toggle" sx={{ ml: 3 }}>
                    <FormControlLabel
                      control={
                        <MUI.SwitchToggle
                          inputProps={{ "aria-label": "ant design" }}
                          checked={isFacebook}
                          onChange={(e) => {
                            setIsFacebook(e.target.checked);
                            handleUpdateData(
                              e.target.checked,
                              settingKeys.facebook,
                            );
                          }}
                        />
                      }
                    />
                    <Box className="sub-toggle-text">
                      <Typography variant="h4">
                        {t("_login_via_facebook_description")}
                      </Typography>
                    </Box>
                  </Box>
                </FormGroup>
              </MUI.SettingSubHeaderContainer>
            </MUI.SettingHeaderContainer>

            {/* Google */}
            <MUI.SettingHeaderContainer sx={{ pb: 3 }}>
              <Typography variant="h2">{t("_login_via_google")}</Typography>

              <MUI.SettingSubHeaderContainer>
                <FormGroup row>
                  <Box className="sub-toggle" sx={{ ml: 3 }}>
                    <FormControlLabel
                      control={
                        <MUI.SwitchToggle
                          inputProps={{ "aria-label": "ant design" }}
                          checked={isGoogle}
                          onChange={(e) => {
                            setIsGoogle(e.target.checked);
                            handleUpdateData(
                              e.target.checked,
                              settingKeys.google,
                            );
                          }}
                        />
                      }
                    />
                    <Box className="sub-toggle-text">
                      <Typography variant="h4">
                        {t("_login_via_google_description")}
                      </Typography>
                    </Box>
                  </Box>
                </FormGroup>
              </MUI.SettingSubHeaderContainer>
            </MUI.SettingHeaderContainer>

            {/* Github */}
            <MUI.SettingHeaderContainer sx={{ pb: 3 }}>
              <Typography variant="h2">{t("_login_via_github")}</Typography>

              <MUI.SettingSubHeaderContainer>
                <FormGroup row>
                  <Box className="sub-toggle" sx={{ ml: 3 }}>
                    <FormControlLabel
                      control={
                        <MUI.SwitchToggle
                          inputProps={{ "aria-label": "ant design" }}
                          checked={isgitHub}
                          onChange={async (e) => {
                            setIsGitHub(e.target.checked);
                            await handleUpdateData(
                              e.target.checked,
                              settingKeys.github,
                            );
                          }}
                        />
                      }
                    />
                    <Box className="sub-toggle-text">
                      <Typography variant="h4">
                        {t("_login_via_github_description")}
                      </Typography>
                    </Box>
                  </Box>
                </FormGroup>
              </MUI.SettingSubHeaderContainer>
            </MUI.SettingHeaderContainer>

            {/* 2 Factor on Authentication */}
            {/* <MUI.SettingHeaderContainer>
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
                            setIsFactor(e.target.checked);
                            handleUpdateData(
                              e.target.checked,
                              settingKeys._2Factor
                            );
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
            </MUI.SettingHeaderContainer> */}
          </MUI.SettingWrapperContainer>
        </Paper>
      </MUI.SettingContainer>
    </Fragment>
  );
}

export default AuthSetting;
