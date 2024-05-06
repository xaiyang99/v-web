import React, { Fragment, useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import * as MUI from "../css/settingStyle";
import * as Icon from "../../../icons/icons";
import BreadcrumbNavigate from "../../../components/BreadcrumbNavigate";
import { MUTATION_UPDATE_SETTING } from "../settings/apollo";
import { useMutation } from "@apollo/client";
import { errorMessage, successMessage } from "../../../components/Alerts";
import * as yup from "yup";
import { Formik } from "formik";
import useManageSetting from "../settings/hooks/useManageSetting";
import { useTranslation } from "react-i18next";
import { handleGraphqlErrors, inputNumberOnly } from "../../../functions";

function DownloadSetting() {
  const { t } = useTranslation();
  const [isHideDownload, setHideDownload] = useState(false);
  const [isHideLink, setHideLink] = useState(false);
  const [isHideFile, setHideFile] = useState(false);
  const [dataEvent, setDataEvent] = useState({ expire: "AEADEFO", amount: "" });
  const [updateSetting] = useMutation(MUTATION_UPDATE_SETTING);
  const useDataSetting = useManageSetting();

  const settingKeys = {
    download: "HDLABTO",
    link: "HLINPFS",
    file: "HFPWFCE",
    amount: "ASALPAS",
    categoryKey: "AEADEFD",
  };

  const initialForm = {
    expire: dataEvent.expire,
    amount: dataEvent.amount,
  };
  const validateSchema = yup.object().shape({
    expire: yup.string().required("Expire is required"),
    amount: yup.string().required("Amount ads is required"),
  });

  const expireDates = [
    {
      productKey: "AEADEFO",
      value: "3",
      name: "Auto expire after download every files",
    },
    {
      productKey: "APIDFTE",
      value: "1",
      name: "1 Day",
    },
    {
      productKey: "JEWLEEU",
      value: "7",
      name: "7 Days",
    },
    {
      productKey: "JOWJEJH",
      value: "1",
      name: "1 Month",
    },
    {
      productKey: "JWOEUWO",
      value: "3",
      name: "3 Month",
    },
    {
      productKey: "OIWEJEJ",
      value: "6",
      name: "6 Month",
    },
  ];

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
    let dataExpire = expireDates?.find(
      (data) => data?.productKey === values.expire,
    );

    try {
      if (dataExpire) {
        const response = await updateSetting({
          variables: {
            data: {
              status: "off",
            },

            where: {
              categoryKey: settingKeys.categoryKey,
            },
          },
        });

        if (response.data?.updateGeneral_settings?._id) {
          await updateSetting({
            variables: {
              data: {
                status: "on",
              },
              where: {
                productKey: dataExpire.productKey,
              },
            },
          });

          await updateSetting({
            variables: {
              data: {
                action: String(values.amount),
              },
              where: {
                productKey: settingKeys.amount,
              },
            },
          });

          successMessage("Data updated successfully", 2000);
        }
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
    function getDataSettings() {
      // Hide Download
      const resHideDownload = findDataSetting(settingKeys.download);
      if (!!resHideDownload) {
        setHideDownload(resHideDownload?.status === "on" ? true : false);
      }

      // Hide Link
      const resHideLink = findDataSetting(settingKeys.link);
      if (!!resHideLink) {
        setHideLink(resHideLink?.status === "on" ? true : false);
      }

      // Hide File
      const resHideFile = findDataSetting(settingKeys.file);
      if (!!resHideFile) {
        setHideFile(resHideFile?.status === "on" ? true : false);
      }

      // Expired date
      const responseExpireDate = useDataSetting.data?.filter(
        (data) => data?.categoryKey === settingKeys.categoryKey,
      );
      if (!!responseExpireDate?.length) {
        const result = responseExpireDate?.find((el) => el.status === "on");
        if (result) {
          setDataEvent((prev) => {
            return {
              ...prev,
              expire: result?.productKey,
            };
          });
        }
      }

      // Amount
      const resAmount = findDataSetting(settingKeys.amount);
      if (!!resAmount) {
        setDataEvent((prev) => {
          return {
            ...prev,
            amount: resAmount?.action || "0",
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
        readablePath={["Setting", "File setting landing page"]}
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
            {/* Dowload header */}
            <MUI.SettingHeaderContainer>
              <Typography variant="h2">{t("_download_title")}</Typography>
              <Typography variant="h4">{t("_download_description")}</Typography>
            </MUI.SettingHeaderContainer>

            <Formik
              initialValues={initialForm}
              validationSchema={validateSchema}
              enableReinitialize={true}
              onSubmit={submitForm}
            >
              {({ handleChange, handleSubmit, errors, touched, values }) => (
                <form onSubmit={handleSubmit}>
                  {/* Expired link date default */}
                  <MUI.SettingHeaderContainer>
                    <MUI.SettingLabel>
                      {t("_expired_link_default")}
                    </MUI.SettingLabel>
                    <FormControl fullWidth>
                      <Select
                        id="expire-date"
                        name="expire"
                        size="small"
                        error={Boolean(touched.expire && errors.expire)}
                        onChange={handleChange}
                        value={values.expire}
                      >
                        {expireDates.map((item, index) => (
                          <MenuItem value={item.productKey} key={index}>
                            {item.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <MUI.SettingHint>
                      {t("_expired_link_default_description")}
                    </MUI.SettingHint>
                  </MUI.SettingHeaderContainer>

                  {/* hide all dowload */}
                  <MUI.SettingHeaderContainer>
                    <Typography variant="h2">
                      {t("_hide_download_all")}
                    </Typography>

                    <MUI.SettingSubHeaderContainer>
                      <FormGroup row>
                        <Box className="sub-toggle" sx={{ ml: 3 }}>
                          <FormControlLabel
                            control={
                              <MUI.SwitchToggle
                                inputProps={{ "aria-label": "ant design" }}
                                checked={isHideDownload}
                                onChange={(e) => {
                                  setHideDownload(e.target.checked);
                                  handleUpdateData(
                                    e.target.checked,
                                    settingKeys.download,
                                  );
                                }}
                              />
                            }
                          />
                          <Box className="sub-toggle-text">
                            <Typography variant="h4">
                              {t("_hide_download_all_description")}
                            </Typography>
                          </Box>
                        </Box>
                      </FormGroup>
                    </MUI.SettingSubHeaderContainer>
                  </MUI.SettingHeaderContainer>

                  {/* hide links */}
                  <MUI.SettingHeaderContainer>
                    <Typography variant="h2">
                      {t("_hide_link_password")}
                    </Typography>

                    <MUI.SettingSubHeaderContainer>
                      <FormGroup row>
                        <Box className="sub-toggle" sx={{ ml: 3 }}>
                          <FormControlLabel
                            control={
                              <MUI.SwitchToggle
                                inputProps={{ "aria-label": "ant design" }}
                                checked={isHideLink}
                                onChange={(e) => {
                                  setHideLink(e.target.checked);
                                  handleUpdateData(
                                    e.target.checked,
                                    settingKeys.link,
                                  );
                                }}
                              />
                            }
                          />
                          <Box className="sub-toggle-text">
                            <Typography variant="h4">
                              {t("_hide_link_password_description")}
                            </Typography>
                          </Box>
                        </Box>
                      </FormGroup>
                    </MUI.SettingSubHeaderContainer>
                  </MUI.SettingHeaderContainer>

                  {/* hide file */}
                  <MUI.SettingHeaderContainer>
                    <Typography variant="h2">
                      {t("_hide_file_password")}
                    </Typography>

                    <MUI.SettingSubHeaderContainer>
                      <FormGroup row>
                        <Box className="sub-toggle" sx={{ ml: 3 }}>
                          <FormControlLabel
                            control={
                              <MUI.SwitchToggle
                                inputProps={{ "aria-label": "ant design" }}
                                checked={isHideFile}
                                onChange={(e) => {
                                  setHideFile(e.target.checked);
                                  handleUpdateData(
                                    e.target.checked,
                                    settingKeys.file,
                                  );
                                }}
                              />
                            }
                          />
                          <Box className="sub-toggle-text">
                            <Typography variant="h4">
                              {t("_hide_file_password_description")}
                            </Typography>
                          </Box>
                        </Box>
                      </FormGroup>
                    </MUI.SettingSubHeaderContainer>
                  </MUI.SettingHeaderContainer>

                  {/* ads */}
                  <MUI.SettingHeaderContainer sx={{ pt: 2 }}>
                    <MUI.SettingLabel>
                      {t("_amount_of_add_showing")}
                    </MUI.SettingLabel>

                    <TextField
                      type="text"
                      name="amount"
                      placeholder="Enter amount"
                      size="small"
                      fullWidth={true}
                      error={Boolean(touched.amount && errors.amount)}
                      helperText={touched.amount && errors.amount}
                      onChange={handleChange}
                      onKeyPress={inputNumberOnly}
                      value={values.amount}
                    />
                    {!(touched.amount && errors.amount) && (
                      <MUI.SettingHint>
                        {t("_amount_of_add_showing_description")}
                      </MUI.SettingHint>
                    )}
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

export default DownloadSetting;
