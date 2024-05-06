import React, { Fragment, useEffect, useState } from "react";
import {
  Box,
  Button,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import * as MUI from "../css/settingStyle";
import * as Icon from "../../../icons/icons";
import BreadcrumbNavigate from "../../../components/BreadcrumbNavigate";
import { Formik } from "formik";
import IconClose from "@mui/icons-material/Close";
import * as yup from "yup";
import { v4 as uuid4 } from "uuid";
import { useMutation } from "@apollo/client";
import { MUTATION_UPDATE_SETTING } from "../settings/apollo";
import { errorMessage, successMessage } from "../../../components/Alerts";
import {
  ConvertBinaryToByte,
  ConvertStorage,
  handleGraphqlErrors,
  inputNumberOnly,
} from "../../../functions";
import useManageSetting from "../settings/hooks/useManageSetting";
import { useTranslation } from "react-i18next";

function FileUploadSetting() {
  const { t } = useTranslation();
  const [allowFile, setAllowFile] = useState("");
  const [blockType, setBlockType] = useState("");
  const [allowFiles, setAllowFiles] = useState([]);
  const [blockTypes, setBlockTypes] = useState([]);
  const [dataEvent, setDataEvent] = useState({
    max: "",
    time: "",
    perDay: "",
  });
  const [updateSetting] = useMutation(MUTATION_UPDATE_SETTING);

  const useDataSetting = useManageSetting();

  const initialForm = {
    maxSize: dataEvent.max,
    convertMaxSize: "GB",
    maxTime: dataEvent.time,
    maxPerDay: dataEvent.perDay,
  };

  const validateSchema = yup.object().shape({
    maxSize: yup.number().required("File size is required"),
    maxTime: yup.number().required("File pertime is required"),
    maxPerDay: yup.number().required("File perday is required"),
  });

  const settingKeys = {
    maxSize: "MXULDFE",
    maxPerDay: "MUPFAPD",
    maxTime: "MUPEAPD",
    allowFile: "ALWFTUD",
    blockFile: "BFTUPOD",
  };

  function addFileType(evt) {
    if ((evt.charCode || evt.keyCode) === 13) {
      evt.preventDefault();

      if (evt.target.value) {
        setAllowFiles((prev) => [
          ...prev,
          {
            id: uuid4().toString(),
            name: allowFile,
          },
        ]);
        setAllowFile("");
      }
    }
  }

  function removeFileType(data) {
    const updateFile = allowFiles.filter((file) => file?.id !== data?.id);
    setAllowFiles(() => [...updateFile]);
  }

  function addBlockFileType(evt) {
    if ((evt.charCode || evt.keyCode) === 13) {
      evt.preventDefault();

      if (evt.target.value) {
        setBlockTypes((prev) => [
          ...prev,
          {
            id: uuid4().toString(),
            name: blockType,
          },
        ]);
        setBlockType("");
      }
    }
  }

  function removeBlockFileType(data) {
    const updateFile = blockTypes.filter((file) => file?.id !== data?.id);
    setBlockTypes(() => [...updateFile]);
  }

  function onKeyDown(evt) {
    if ((evt.charCode || evt.keyCode) === 13) {
      evt.preventDefault();
    }
  }

  async function onSubmitForm(values) {
    const convertFile = ConvertStorage({
      data: values.maxSize,
      byte: values.convertMaxSize,
    });

    const updateData = [
      {
        key: settingKeys.maxSize,
        value: String(convertFile),
      },
      {
        key: settingKeys.maxPerDay,
        value: String(values.maxPerDay),
      },
      {
        key: settingKeys.maxTime,
        value: String(values.maxTime),
      },
    ];

    if (!blockTypes.length) {
      errorMessage("Please select some files block files type", 2000);
      return;
    }

    try {
      const allowData = allowFiles.map((allow) => allow?.name).join(",");
      const blockData = blockTypes.map((block) => block?.name).join(",");

      const dataFiles = [
        {
          key: settingKeys.allowFile,
          value: String(allowData),
        },
        {
          key: settingKeys.blockFile,
          value: String(blockData),
        },
      ];

      updateData.map(async (el) => {
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

      if (dataFiles.length) {
        dataFiles.map(async (el) => {
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
      }

      successMessage("Data updated successfully", 2000);
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
      // Allow Files
      const resAllowFile = findDataSetting(settingKeys.allowFile);
      if (!!resAllowFile) {
        if (resAllowFile?.action) {
          const mergeAllowFiles = resAllowFile?.action?.split(",") || [];
          const updateAllowFiles = mergeAllowFiles?.map((data) => {
            return {
              id: uuid4().toString(),
              name: data,
            };
          });
          setAllowFiles(updateAllowFiles);
        } else {
          setAllowFiles([]);
        }
      }

      // Block Files
      const resBlockFile = findDataSetting(settingKeys.blockFile);
      if (!!resBlockFile) {
        const mergeBlockFiles = resBlockFile?.action?.split(",") || [];
        const updateBlockFiles = mergeBlockFiles.map((data) => {
          return {
            id: uuid4().toString(),
            name: data,
          };
        });
        setBlockTypes(updateBlockFiles);
      }

      // Max Size
      const resMaxSize = findDataSetting(settingKeys.maxSize);
      if (!!resMaxSize) {
        const convertFile = ConvertBinaryToByte({
          data: resMaxSize?.action || "1",
          byte: initialForm.convertMaxSize,
        });

        setDataEvent((prev) => {
          return {
            ...prev,
            max: convertFile,
          };
        });
      }

      // Max Time
      const resMaxTime = findDataSetting(settingKeys.maxTime);
      if (!!resMaxTime) {
        setDataEvent((prev) => {
          return {
            ...prev,
            time: resMaxTime?.action,
          };
        });
      }

      // Max Perday
      const resPerday = findDataSetting(settingKeys.maxPerDay);
      if (!!resPerday) {
        setDataEvent((prev) => {
          return {
            ...prev,
            perDay: resPerday?.action,
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
        readablePath={[t("_setting"), t("_file_setting")]}
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
            {/* Upload header */}
            <MUI.SettingHeaderContainer>
              <Typography variant="h2">{t("_upload_title")}</Typography>
              <Typography variant="h4">{t("_upload_description")}</Typography>
            </MUI.SettingHeaderContainer>

            <Formik
              initialValues={initialForm}
              validationSchema={validateSchema}
              enableReinitialize={true}
              onSubmit={onSubmitForm}
            >
              {({ handleSubmit, handleChange, values, errors, touched }) => (
                <form onSubmit={handleSubmit} onKeyDown={onKeyDown}>
                  {/* Max upload file per/time */}
                  <MUI.SettingHeaderContainer>
                    <MUI.SettingLabel>{t("_max_upload_size")}</MUI.SettingLabel>
                    <TextField
                      name="maxSize"
                      type="number"
                      size="small"
                      placeholder="Enter amount"
                      fullWidth={true}
                      error={Boolean(touched.maxSize && errors.maxSize)}
                      helperText={touched.maxSize && errors.maxSize}
                      onChange={handleChange}
                      value={values.maxSize}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="start">
                            <Select
                              sx={{
                                ml: -3,
                                ".MuiOutlinedInput-notchedOutline": {
                                  border: 0,
                                },
                                "&:active": {
                                  outline: "none",
                                },
                                "&:focus": {
                                  outline: "none",
                                },
                                "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                  {
                                    border: "none",
                                  },
                              }}
                              variant="outlined"
                              size="small"
                              name="convertMaxSize"
                              value={values.convertMaxSize}
                              onChange={handleChange}
                            >
                              <MenuItem value="MB">MB</MenuItem>
                              <MenuItem value="GB">GB</MenuItem>
                            </Select>
                          </InputAdornment>
                        ),
                      }}
                    />
                    {!(touched.maxSize && errors.maxSize) && (
                      <MUI.SettingHint>
                        {t("_max_upload_size_description")}
                      </MUI.SettingHint>
                    )}
                  </MUI.SettingHeaderContainer>

                  {/* Max upload file amount per/time */}
                  <MUI.SettingHeaderContainer>
                    <MUI.SettingLabel>
                      {t("_max_upload_amount_per_time")}
                    </MUI.SettingLabel>
                    <TextField
                      name="maxTime"
                      size="small"
                      type="text"
                      placeholder="Enter amount"
                      fullWidth={true}
                      error={Boolean(touched.maxTime && errors.maxTime)}
                      helperText={touched.maxTime && errors.maxTime}
                      onChange={handleChange}
                      onKeyPress={inputNumberOnly}
                      value={values.maxTime}
                    />

                    {!(touched.maxTime && errors.maxTime) && (
                      <MUI.SettingHint>
                        {t("_max_upload_amount_per_time_description")}
                      </MUI.SettingHint>
                    )}
                  </MUI.SettingHeaderContainer>

                  {/* Max upload file amount per/day */}
                  <MUI.SettingHeaderContainer>
                    <MUI.SettingLabel>
                      {t("_max_upload_amount_per_day")}
                    </MUI.SettingLabel>
                    <TextField
                      name="maxPerDay"
                      size="small"
                      type="text"
                      placeholder="Enter amount"
                      fullWidth={true}
                      error={Boolean(touched.maxPerDay && errors.maxPerDay)}
                      helperText={touched.maxPerDay && errors.maxPerDay}
                      onChange={handleChange}
                      onKeyPress={inputNumberOnly}
                      value={values.maxPerDay}
                    />
                    {!(touched.maxPerDay && errors.maxPerDay) && (
                      <MUI.SettingHint>
                        {t("_max_upload_amount_per_day_description")}
                      </MUI.SettingHint>
                    )}
                  </MUI.SettingHeaderContainer>

                  {/* Allow File Type */}
                  <MUI.SettingHeaderContainer>
                    <MUI.SettingLabel>{t("_allow_file_type")}</MUI.SettingLabel>
                    <TextField
                      size="small"
                      placeholder="Add files type..."
                      fullWidth={true}
                      value={allowFile}
                      onChange={(e) => setAllowFile(e.target.value)}
                      onBlur={(e) => setAllowFile(e.target.value)}
                      onKeyDown={addFileType}
                    />
                    <MUI.SettingHint>
                      {t("_allow_file_type_description")}
                    </MUI.SettingHint>

                    <MUI.SettingBoxTypeFileContainer sx={{ mt: 2 }}>
                      {!allowFiles.length ? (
                        <Box className="empty-type">
                          <Typography component="span">
                            No file type selected
                          </Typography>
                        </Box>
                      ) : (
                        <MUI.SettingBoxTypeFileItem
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            flexWrap: "wrap",
                          }}
                        >
                          {allowFiles?.map((file, index) => (
                            <MUI.SettingBoxTypeFile
                              key={index}
                              onClick={() => removeFileType(file)}
                            >
                              <Typography component="span">
                                {file.name}
                              </Typography>
                              <Box className="icon-del">
                                <IconClose className="icon" />
                              </Box>
                            </MUI.SettingBoxTypeFile>
                          ))}
                        </MUI.SettingBoxTypeFileItem>
                      )}
                    </MUI.SettingBoxTypeFileContainer>
                  </MUI.SettingHeaderContainer>

                  {/* Block File Type */}
                  <MUI.SettingHeaderContainer>
                    <MUI.SettingLabel>{t("_block_file_type")}</MUI.SettingLabel>
                    <TextField
                      size="small"
                      placeholder="Add files type..."
                      fullWidth={true}
                      value={blockType}
                      onChange={(e) => setBlockType(e.target.value)}
                      onBlur={(e) => setBlockType(e.target.value)}
                      onKeyDown={addBlockFileType}
                    />
                    <MUI.SettingHint>
                      {t("_block_file_type_description")}
                    </MUI.SettingHint>

                    <MUI.SettingBoxTypeFileContainer sx={{ mt: 2 }}>
                      {!blockTypes.length ? (
                        <Box className="empty-type">
                          <Typography component="span">
                            No file type selected
                          </Typography>
                        </Box>
                      ) : (
                        <MUI.SettingBoxTypeFileItem
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            flexWrap: "wrap",
                          }}
                        >
                          {blockTypes?.map((file, index) => (
                            <MUI.SettingBoxTypeFile
                              key={index}
                              onClick={() => removeBlockFileType(file)}
                            >
                              <Typography component="span">
                                {file.name}
                              </Typography>
                              <Box className="icon-del">
                                <IconClose className="icon" />
                              </Box>
                            </MUI.SettingBoxTypeFile>
                          ))}
                        </MUI.SettingBoxTypeFileItem>
                      )}
                    </MUI.SettingBoxTypeFileContainer>
                  </MUI.SettingHeaderContainer>

                  {/* Line Action */}
                  <MUI.SettingLineAction></MUI.SettingLineAction>

                  {/* Action */}
                  <MUI.SettingAction>
                    <Button
                      type="submit"
                      variant="contained"
                      // onClick={onUpdateSetting}
                    >
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

export default FileUploadSetting;
