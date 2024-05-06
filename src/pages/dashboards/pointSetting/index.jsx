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
import * as yup from "yup";
import { Formik } from "formik";
import { useMutation } from "@apollo/client";
import { MUTATION_UPDATE_SETTING } from "../settings/apollo";
import { errorMessage, successMessage } from "../../../components/Alerts";
import useManageSetting from "../settings/hooks/useManageSetting";
import { useTranslation } from "react-i18next";
import { handleGraphqlErrors, inputNumberOnly } from "../../../functions";

function PointSetting() {
  const { t } = useTranslation();
  const [isRedeem, setRedeem] = useState(false);
  const [isCoin, setCoin] = useState(false);
  const [dataForm, setDataForm] = useState({
    download: "",
    max: "",
    min: "",
    gb: "",
  });

  const [updateSetting] = useMutation(MUTATION_UPDATE_SETTING, {
    fetchPolicy: "no-cache",
  });
  const useDataSetting = useManageSetting();

  const settingKeys = {
    redeem: "RDOMEWM",
    coin: "EGCOIFF",
    download: "DLODAWO",
    gb: "DOJEWEJ",
    min: "MPAMONR",
    max: "MSUCRDY",
  };

  const initialForm = {
    download: dataForm.download,
    min: dataForm.min,
    max: dataForm.max,
    gb: dataForm.gb,
  };

  const validateSchema = yup.object().shape({
    download: yup.number().required("Download is required"),
    min: yup.number().required("Min is required"),
    max: yup.number().required("Max is required"),
    gb: yup.number().required("GB is required"),
  });

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

  async function submitForm(values) {
    const dataUpdate = [
      { key: settingKeys.download, value: String(values.download) },
      { key: settingKeys.gb, value: String(values.gb) },
      { key: settingKeys.min, value: String(values.min) },
      { key: settingKeys.max, value: String(values.max) },
    ];

    try {
      dataUpdate.map(async (el) => {
        await updateSetting({
          variables: {
            data: {
              action: el.value,
            },
            where: {
              productKey: el.key,
            },
          },
        });
      });

      successMessage("Data updated successful", 2000);
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
    function getDataSettings() {
      // Redeem
      const resRedeem = findDataSetting(settingKeys.redeem);
      if (!!resRedeem) {
        setRedeem(resRedeem?.status === "on" ? true : false);
      }

      // Coin
      const resCoin = findDataSetting(settingKeys.coin);
      if (!!resCoin) {
        setCoin(resCoin?.status === "on" ? true : false);
      }

      // Download
      const resDownload = findDataSetting(settingKeys.download);
      if (!!resDownload) {
        setDataForm((prev) => {
          return {
            ...prev,
            download: parseInt(resDownload?.action || "0"),
          };
        });
      }

      // Min
      const resMin = findDataSetting(settingKeys.min);
      if (!!resMin) {
        setDataForm((prev) => {
          return {
            ...prev,
            min: parseInt(resMin?.action || "0"),
          };
        });
      }

      // Max
      const resMax = findDataSetting(settingKeys.max);
      if (!!resMax) {
        setDataForm((prev) => {
          return {
            ...prev,
            max: parseInt(resMax?.action || "0"),
          };
        });
      }

      // GB
      const resGB = findDataSetting(settingKeys.gb);
      if (!!resGB) {
        setDataForm((prev) => {
          return {
            ...prev,
            gb: parseInt(resGB?.action || "0"),
          };
        });
      }

      // End
    }

    getDataSettings();
  }, [useDataSetting.data]);

  return (
    <Fragment>
      <BreadcrumbNavigate
        separatorIcon={<Icon.ForeSlash />}
        title="Setting"
        path={["Setting"]}
        readablePath={[t("_setting"), t("_point_setting")]}
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
            {/* Redeem */}
            <MUI.SettingHeaderContainer>
              <Typography variant="h2">{t("_redeem")}</Typography>
              <MUI.SettingSubHeaderContainer>
                <FormGroup row>
                  <Box className="sub-toggle" sx={{ ml: 3 }}>
                    <FormControlLabel
                      control={
                        <MUI.SwitchToggle
                          inputProps={{ "aria-label": "ant design" }}
                          checked={isRedeem}
                          onChange={(e) => {
                            setRedeem(e.target.checked);
                            handleUpdateData(
                              e.target.checked,
                              settingKeys.redeem,
                            );
                          }}
                        />
                      }
                    />
                    <Box className="sub-toggle-text">
                      <Typography variant="h4">
                        {t("_redeem_description")}
                      </Typography>
                    </Box>
                  </Box>
                </FormGroup>
              </MUI.SettingSubHeaderContainer>
            </MUI.SettingHeaderContainer>

            {/* Coin */}
            <MUI.SettingHeaderContainer>
              <Typography variant="h2">{t("_get_coin")}</Typography>
              <MUI.SettingSubHeaderContainer>
                <FormGroup row>
                  <Box className="sub-toggle" sx={{ ml: 3 }}>
                    <FormControlLabel
                      control={
                        <MUI.SwitchToggle
                          inputProps={{ "aria-label": "ant design" }}
                          checked={isCoin}
                          onChange={(e) => {
                            setCoin(e.target.checked);
                            handleUpdateData(
                              e.target.checked,
                              settingKeys.coin,
                            );
                          }}
                        />
                      }
                    />
                    <Box className="sub-toggle-text">
                      <Typography variant="h4">
                        {t("_get_coin_description")}
                      </Typography>
                    </Box>
                  </Box>
                </FormGroup>
              </MUI.SettingSubHeaderContainer>
            </MUI.SettingHeaderContainer>

            {/* Form submit */}
            <Formik
              initialValues={initialForm}
              validationSchema={validateSchema}
              enableReinitialize={true}
              onSubmit={submitForm}
            >
              {({ errors, values, touched, handleChange, handleSubmit }) => (
                <form onSubmit={handleSubmit}>
                  {/* 1 Download */}
                  <MUI.SettingHeaderContainer sx={{ pt: 2 }}>
                    <MUI.SettingUserForm>
                      <MUI.SettingLabel>
                        {t("_download_get_point")}
                      </MUI.SettingLabel>
                      <TextField
                        name="download"
                        type="text"
                        placeholder="Enter point..."
                        size="small"
                        fullWidth={true}
                        error={Boolean(touched.download && errors.download)}
                        helperText={touched.download && errors.download}
                        onChange={handleChange}
                        onKeyPress={inputNumberOnly}
                        value={values.download}
                      />
                      {touched.download && errors.download ? null : (
                        <MUI.SettingHint>
                          {t("_download_get_point_description")}
                        </MUI.SettingHint>
                      )}
                    </MUI.SettingUserForm>
                  </MUI.SettingHeaderContainer>

                  {/* 1 GB */}
                  <MUI.SettingHeaderContainer>
                    <MUI.SettingUserForm>
                      <MUI.SettingLabel>
                        {t("_coin_change_storage")}
                      </MUI.SettingLabel>
                      <TextField
                        name="gb"
                        size="small"
                        type="number"
                        placeholder="Enter point..."
                        fullWidth={true}
                        error={Boolean(touched.gb && errors.gb)}
                        helperText={touched.gb && errors.gb}
                        onChange={handleChange}
                        value={values.gb}
                      />
                      {touched.gb && errors.gb ? null : (
                        <MUI.SettingHint>
                          {t("_coin_change_storage_description")}
                        </MUI.SettingHint>
                      )}
                    </MUI.SettingUserForm>
                  </MUI.SettingHeaderContainer>

                  {/* Min points */}
                  <MUI.SettingHeaderContainer>
                    <MUI.SettingUserForm>
                      <MUI.SettingLabel>
                        {t("_min_point_can_redeem")}
                      </MUI.SettingLabel>
                      <TextField
                        name="min"
                        size="small"
                        type="text"
                        placeholder="Enter point..."
                        fullWidth={true}
                        error={Boolean(touched.min && errors.min)}
                        helperText={touched.min && errors.min}
                        onChange={handleChange}
                        onKeyPress={inputNumberOnly}
                        value={values.min}
                      />

                      {touched.min && errors.min ? null : (
                        <MUI.SettingHint>
                          {t("_min_point_can_redeem_description")}
                        </MUI.SettingHint>
                      )}
                    </MUI.SettingUserForm>
                  </MUI.SettingHeaderContainer>

                  {/* Max storage */}
                  <MUI.SettingHeaderContainer>
                    <MUI.SettingUserForm>
                      <MUI.SettingLabel>
                        {t("_max_storage_user_can_redeem")}
                      </MUI.SettingLabel>
                      <TextField
                        name="max"
                        size="small"
                        type="number"
                        placeholder="Enter point..."
                        fullWidth={true}
                        error={Boolean(touched.max && errors.max)}
                        helperText={touched.max && errors.max}
                        onChange={handleChange}
                        value={values.max}
                      />

                      {touched.max && errors.max ? null : (
                        <MUI.SettingHint>
                          {t("_max_storage_user_can_redeem_description")}
                        </MUI.SettingHint>
                      )}
                    </MUI.SettingUserForm>
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

export default PointSetting;
