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
import * as Icon from "../../../icons/icons";
import * as MUI from "../css/settingStyle";
import BreadcrumbNavigate from "../../../components/BreadcrumbNavigate";
import { errorMessage, successMessage } from "../../../components/Alerts";
import { useMutation } from "@apollo/client";
import { MUTATION_UPDATE_SETTING } from "../settings/apollo";
import useManageSetting from "../settings/hooks/useManageSetting";
import { useTranslation } from "react-i18next";
import { handleGraphqlErrors, inputNumberOnly } from "../../../functions";

function UserSetting() {
  const { t } = useTranslation();
  const [dataLink, setDataLink] = useState("");
  const [isDeactivUser, setIsDeactiveUser] = useState(false);
  const [updateSetting] = useMutation(MUTATION_UPDATE_SETTING, {
    fetchPolicy: "no-cache",
  });

  const settingKey = {
    linkUser: "HMFDCAU",
    activeUser: "DUAUDTA",
  };

  const useDataSetting = useManageSetting();

  async function handleCheck(e) {
    setIsDeactiveUser(e);
    try {
      const res = await updateSetting({
        variables: {
          data: { status: e ? "on" : "off" },
          where: {
            productKey: settingKey.activeUser,
          },
        },
      });

      if (res?.data?.updateGeneral_settings?._id) {
        successMessage(
          "Allow users delete accounts were updated successfully",
          2000,
        );
      }
    } catch (error) {
      let cutErr = error.message.replace(/(ApolloError: )?Error: /, "");
      errorMessage(handleGraphqlErrors(cutErr), 3000);
    }
  }

  async function onUpdateData() {
    if (!dataLink) return;
    try {
      const res = await updateSetting({
        variables: {
          data: { action: dataLink },
          where: {
            productKey: settingKey.linkUser,
          },
        },
      });

      if (res?.data?.updateGeneral_settings?._id) {
        successMessage("Link user updated successfully", 2000);
      }
    } catch (error) {
      let cutErr = error.message.replace(/(ApolloError: )?Error: /, "");
      errorMessage(handleGraphqlErrors(cutErr), 3000);
    }
  }

  function findDataSetting(productKey) {
    const dataSetting = useDataSetting.data?.find(
      (data) => data?.productKey === productKey,
    );

    return dataSetting;
  }

  useEffect(() => {
    function getDataSettings() {
      const linkUser = findDataSetting(settingKey.linkUser);
      if (!!linkUser) {
        setDataLink(linkUser?.action || "0");
      }
      // Deactive User
      const deactiveUser = findDataSetting(settingKey.activeUser);
      if (!!deactiveUser) {
        if (deactiveUser?.status === "on") {
          setIsDeactiveUser(true);
        } else {
          setIsDeactiveUser(false);
        }
      }
    }

    getDataSettings();
  }, [useDataSetting.data]);

  return (
    <Fragment>
      <BreadcrumbNavigate
        separatorIcon={<Icon.ForeSlash />}
        title="Setting"
        path={["Setting"]}
        readablePath={[t("_setting"), t("_user_setting_title")]}
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
            <MUI.SettingHeaderContainer>
              <Typography variant="h2">{t("_anonymouse_user")}</Typography>
              <Typography variant="h4">
                {t("_anonymouse_user_description")}
              </Typography>
            </MUI.SettingHeaderContainer>

            {/* Link Fiedl */}
            <MUI.SettingHeaderContainer sx={{ pt: 1 }}>
              <MUI.SettingUserForm>
                <MUI.SettingLabel htmlFor="labelLink">
                  {t("_link")}
                </MUI.SettingLabel>
                <TextField
                  id="labelLink"
                  type="text"
                  placeholder="Enter link amount"
                  size="small"
                  fullWidth={true}
                  value={dataLink}
                  onChange={(e) => setDataLink(e.target.value)}
                  onKeyPress={inputNumberOnly}
                />
              </MUI.SettingUserForm>
            </MUI.SettingHeaderContainer>

            {/* Deactive check user */}
            <MUI.SettingHeaderContainer sx={{ pt: 1 }}>
              <Typography variant="h2">{t("_deactive_user")}</Typography>

              <MUI.SettingSubHeaderContainer>
                <FormGroup row>
                  <Box className="sub-toggle" sx={{ ml: 3 }}>
                    <FormControlLabel
                      control={
                        <MUI.SwitchToggle
                          inputProps={{ "aria-label": "ant design" }}
                          checked={isDeactivUser}
                          onChange={(e) => handleCheck(e.target.checked)}
                        />
                      }
                    />
                    <Box className="sub-toggle-text">
                      <Typography variant="h4">
                        {t("_deactive_user_description")}
                      </Typography>
                    </Box>
                  </Box>
                </FormGroup>
              </MUI.SettingSubHeaderContainer>
            </MUI.SettingHeaderContainer>

            {/* Line Action */}
            <MUI.SettingLineAction></MUI.SettingLineAction>

            <MUI.SettingAction>
              <Button
                type="button"
                variant="contained"
                disabled={dataLink ? false : true}
                onClick={onUpdateData}
              >
                {t("_upload_button")}
              </Button>
            </MUI.SettingAction>
          </MUI.SettingWrapperContainer>
        </Paper>
      </MUI.SettingContainer>
    </Fragment>
  );
}

export default UserSetting;
