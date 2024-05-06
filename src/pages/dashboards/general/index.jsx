import {
  Box,
  FormControlLabel,
  FormGroup,
  Paper,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import * as MUI from "../css/settingStyle";
import BreadcrumbNavigate from "../../../components/BreadcrumbNavigate";
import * as Icon from "../../../icons/icons";
import { useDropzone } from "react-dropzone";
import FileDoc from "@mui/icons-material/ReceiptSharp";
import {
  FileList,
  FileListItem,
  TicketBodyUpload,
  TicketContainerWrapper,
  TicketHeader,
} from "../../client-dashboard/css/ticketStyle";
import {
  BrowseImageButton,
  ButtonUpload,
} from "../../client-dashboard/ticket/style";
import { FiUpload } from "react-icons/fi";
import {
  ConvertBytetoMBandGB,
  bunnyImagePublic,
  handleGraphqlErrors,
  keyBunnyCDN,
  linkBunnyCDN,
} from "../../../functions";
import { errorMessage, successMessage } from "../../../components/Alerts";
import { useMutation } from "@apollo/client";
import { MUTATION_UPDATE_SETTING } from "../settings/apollo";
import axios from "axios";
import { LoadingButton } from "@mui/lab";
import useManageSetting from "../settings/hooks/useManageSetting";
import { useTranslation } from "react-i18next";
import CryptoJS from "crypto-js";
import useSecretEncrypted from "../secretKey/hooks/useSecretEncrypt";

function GeneralSetting() {
  const { t } = useTranslation();
  const [theme, setTheme] = useState("light");
  const [viewMode, setViewMode] = useState("list");
  const [themeChange, setThemeChange] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [formField, setFormField] = useState({
    bunnyKey: "",
    hostBunny: "",
    stripPublic: "",
    stripSecret: "",
  });

  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [updateSetting] = useMutation(MUTATION_UPDATE_SETTING);
  const [oldFavIcon, setOldFavIcon] = useState("");
  const matchImage = ["image/png", "image/jpeg", "image/jpg"];
  const useDataEncryption = useSecretEncrypted();

  const {
    REACT_APP_SETTING_BUNNY_KEY,
    REACT_APP_SETTING_BUNNY_HOST_KEY,
    REACT_APP_SETTING_STRIP_PUBLIC_KEY,
    REACT_APP_SETTING_STRIP_SECRET_KEY,
  } = process.env;

  let bunnyAccessKey = REACT_APP_SETTING_BUNNY_KEY;
  let bunnyHostKey = REACT_APP_SETTING_BUNNY_HOST_KEY;
  let stripPublicKey = REACT_APP_SETTING_STRIP_PUBLIC_KEY;
  let stripSecretKey = REACT_APP_SETTING_STRIP_SECRET_KEY;

  const settingKeys = {
    theme: "STDMALM",
    viewMode: "DVMLAGH",
    allowThemeChange: "ATMECHE",
    favIcon: "FCIFCPM",
    allowPricing: "ALSPNG",
    accessBunny: "bnnyky",
    hostBunny: "lnkhbn",
    stripPublic: "stpkys",
    stripSecret: "jwewjr",
    categoryEncryped: "SKFBBST",
  };
  const encryptedSettingKeys = {
    bunnyKey: "sckfbn",
    hostBunny: "hbnsck",
    publicStrip: "stkehp",
    secretStrip: "kpwjen",
  };

  const useDataSetting = useManageSetting();

  const onDrop = useCallback(
    (acceptedFiles) => {
      acceptedFiles.forEach(() => {
        setFile(acceptedFiles[0]);
      });
    },
    [file],
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
  });

  function handleChange(e) {
    const { name, value } = e.target;

    setFormField((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  }

  const onUpdateTheme = async (e) => {
    const { value } = e.target;
    setTheme(value);

    try {
      const result = await updateSetting({
        variables: {
          data: {
            action: value,
          },
          where: {
            productKey: settingKeys.theme,
          },
        },
      });

      if (result?.data?.updateGeneral_settings?._id) {
        successMessage("Theme updated successfully", 2000);
      }
    } catch (error) {
      let cutErr = error.message.replace(/(ApolloError: )?Error: /, "");
      errorMessage(handleGraphqlErrors(cutErr), 3000);
    }
  };

  const onUpdateViewMode = async (e) => {
    const { value } = e.target;
    setViewMode(value);

    try {
      const result = await updateSetting({
        variables: {
          data: {
            action: value,
          },
          where: {
            productKey: settingKeys.viewMode,
          },
        },
      });

      if (result?.data?.updateGeneral_settings?._id) {
        successMessage("View mode updated successfully", 2000);
      }
    } catch (error) {
      let cutErr = error.message.replace(/(ApolloError: )?Error: /, "");
      errorMessage(handleGraphqlErrors(cutErr), 3000);
    }
  };

  const onUpdateSwitch = async (value, productKey) => {
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
        successMessage("Allow theme change updated successfully", 2000);
      }
    } catch (error) {
      let cutErr = error.message.replace(/(ApolloError: )?Error: /, "");
      errorMessage(handleGraphqlErrors(cutErr), 3000);
    }
  };

  const onSaveData = async () => {
    const bunnyURL = linkBunnyCDN;
    const AccessKey = keyBunnyCDN;
    const bunnyPublic = bunnyImagePublic;

    try {
      let dataUpdate = [
        {
          action: handleEncryptedData(bunnyAccessKey, formField.bunnyKey),
          productKey: settingKeys.accessBunny,
        },
        {
          action: handleEncryptedData(bunnyHostKey, formField.hostBunny),
          productKey: settingKeys.hostBunny,
        },
        {
          action: handleEncryptedData(stripPublicKey, formField.stripPublic),
          productKey: settingKeys.stripPublic,
        },
        {
          action: handleEncryptedData(stripSecretKey, formField.stripSecret),
          productKey: settingKeys.stripSecret,
        },
      ];

      for (let i = 0; i < dataUpdate.length; i++) {
        await updateSetting({
          variables: {
            data: {
              action: dataUpdate[i].action,
            },
            where: {
              productKey: dataUpdate[i].productKey,
            },
          },
        });
      }

      if (file) {
        if (matchImage.indexOf(file?.type) === -1) {
          errorMessage(
            "Format file is not valid, file support only jpg, jpeg, png",
            3000,
          );
          return;
        }

        let extension = file?.name?.split(".")[1];
        let newName = Math.floor(1111111111111 + Math.random() * 9999999999999);

        setIsLoading(true);
        const result = await axios.put(
          `${bunnyURL}/image/${newName}.${extension}`,
          file,
          {
            headers: {
              AccessKey,
              "Content-Type": "multipart/form-data",
            },
          },
        );

        if (result.status === 201) {
          const responseUpdate = await updateSetting({
            variables: {
              data: {
                action: bunnyPublic + "/" + `${newName}.${extension}`,
              },
              where: {
                productKey: settingKeys.favIcon,
              },
            },
          });

          if (responseUpdate.data?.updateGeneral_settings?._id) {
            const bunnyPath = `${bunnyURL}image/${oldFavIcon}`;
            await fetch(bunnyPath, {
              method: "DELETE",
              headers: {
                AccessKey,
              },
            })
              .then(() => {})
              .catch((error) => {
                console.log(error);
              })
              .finally(() => {
                setIsLoading(false);
              });
          }
        }
      }

      successMessage("Data was updated successfully", 2000);
    } catch (error) {
      setIsLoading(false);
      let cutErr = error.message.replace(/(ApolloError: )?Error: /, "");
      errorMessage(handleGraphqlErrors(cutErr), 3000);
    }
  };

  function handleSetFormField(key, value) {
    setFormField((prev) => {
      return {
        ...prev,
        [key]: value,
      };
    });
  }

  const findDataSetting = (productKey) => {
    const dataSetting = useDataSetting.data?.find(
      (data) => data?.productKey === productKey,
    );

    return dataSetting;
  };

  function handleEncryptedData(key, value) {
    const dataValue = CryptoJS.AES.encrypt(value, key).toString();

    return dataValue;
  }

  function handleDecryptedData(key, value) {
    try {
      const dataValue = CryptoJS.AES.decrypt(value, key).toString(
        CryptoJS.enc.Utf8,
      );

      return dataValue;
    } catch (error) {
      console.log(error);
    }
  }

  function handleFindEncryptedSecret(key) {
    const dataValue = useDataEncryption.data?.find(
      (item) => item.productKey === key,
    );
    if (dataValue) {
      return dataValue;
    }

    return null;
  }

  useEffect(() => {
    const getDataSettings = () => {
      // Theme
      const dataTheme = findDataSetting(settingKeys.theme);
      if (dataTheme?.action === "dark") {
        setTheme("dark");
      } else {
        setTheme("light");
      }

      // Theme Change
      const themeChange = findDataSetting(settingKeys.allowThemeChange);
      if (themeChange?.status === "on") {
        setThemeChange(true);
      }

      // ViewMode
      const viewMode = findDataSetting(settingKeys.viewMode);
      if (!!viewMode) {
        if (viewMode?.action === "grid") {
          setViewMode("grid");
        } else {
          setViewMode("list");
        }
      }

      // Fav icon
      const favIconData = findDataSetting(settingKeys.favIcon);
      if (!!favIconData) {
        let indexOfpublic = favIconData?.action?.indexOf("image");
        if (indexOfpublic !== -1) {
          let str = favIconData?.action?.substring(indexOfpublic + 6);
          setOldFavIcon(str);
        }
      }

      // Allow pricing
      const dataPricing = findDataSetting(settingKeys.allowPricing);
      if (!!dataPricing) {
        if (dataPricing?.status === "on") {
          setShowPricing(true);
        } else {
          setShowPricing(false);
        }
      }

      // ***** Input *****
      // bunny key
      const dataBunnyKey = findDataSetting(settingKeys.accessBunny);
      if (!!dataBunnyKey) {
        const bunnyDecrpted = handleDecryptedData(
          bunnyAccessKey,
          dataBunnyKey?.action || "",
        );
        handleSetFormField("bunnyKey", bunnyDecrpted || "");
        // setFormField((prev) => {
        //   return {
        //     ...prev,
        //     bunnyKey: bunnyDecrpted,
        //   };
        // });
      } else {
        handleSetFormField("bunnyKey", "");
      }

      // host bunny key
      const dataHostBunny = findDataSetting(settingKeys.hostBunny);
      if (!!dataHostBunny) {
        const hostDecode = handleDecryptedData(
          bunnyHostKey,
          dataHostBunny?.action || "",
        );
        handleSetFormField("hostBunny", hostDecode || "");
        // setFormField((prev) => {
        //   return {
        //     ...prev,
        //     hostBunny: hostDecode || "",
        //   };
        // });
      } else {
        handleSetFormField("hostBunny", "");
      }

      // bunny key
      const dataStripPublic = findDataSetting(settingKeys.stripPublic);
      if (!!dataStripPublic) {
        const stripPublicDecode = handleDecryptedData(
          stripPublicKey,
          dataStripPublic?.action || "",
        );
        handleSetFormField("stripPublic", stripPublicDecode || "");
        // setFormField((prev) => {
        //   return {
        //     ...prev,
        //     stripPublic: stripPublicDecode,
        //   };
        // });
      } else {
        handleSetFormField("stripPublic", "");
      }

      // bunny key
      const dataStripSecret = findDataSetting(settingKeys.stripSecret);
      if (!!dataStripSecret) {
        const stripKeyDecode = handleDecryptedData(
          stripSecretKey,
          dataStripSecret?.action || "",
        );
        handleSetFormField("stripSecret", stripKeyDecode || "");
        // setFormField((prev) => {
        //   return {
        //     ...prev,
        //     stripSecret: stripKeyDecode,
        //   };
        // });
      } else {
        handleSetFormField("stripSecret", "");
      }
    };

    getDataSettings();
  }, [useDataSetting.data]);

  useEffect(() => {
    function handleEncryptData() {
      const dataBunny = handleFindEncryptedSecret(
        encryptedSettingKeys.bunnyKey,
      );
      bunnyAccessKey = dataBunny?.action || "";

      const dataHost = handleFindEncryptedSecret(
        encryptedSettingKeys.hostBunny,
      );
      bunnyHostKey = dataHost?.action || "";

      const dataPublic = handleFindEncryptedSecret(
        encryptedSettingKeys.publicStrip,
      );
      stripPublicKey = dataPublic?.action || "";

      const dataSecret = handleFindEncryptedSecret(
        encryptedSettingKeys.secretStrip,
      );
      stripSecretKey = dataSecret?.action || "";
    }

    handleEncryptData();
  }, [useDataEncryption.data]);

  return (
    <Fragment>
      <BreadcrumbNavigate
        separatorIcon={<Icon.ForeSlash />}
        title="Setting"
        path={["Setting"]}
        readablePath={[t("_setting"), t("_general_setting")]}
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
            {/* Theme */}
            <MUI.SettingHeaderContainer>
              <Typography variant="h2">{t("_site_theme")}</Typography>
              <Typography variant="h4">
                {t("_site_theme_description")}
              </Typography>

              {/* Theme mode */}
              <MUI.SettingSubHeaderContainer>
                <RadioGroup
                  row
                  value={theme}
                  onChange={(e) => onUpdateTheme(e)}
                >
                  <Box sx={{ display: "flex", gap: "1rem" }}>
                    <MUI.GroupFormControl
                      name="theme"
                      value="light"
                      control={<MUI.BpRadio />}
                      label={t("_light_mode")}
                    />
                    <MUI.GroupFormControl
                      name="theme"
                      value="dark"
                      control={<MUI.BpRadio />}
                      label={t("_dark_mode")}
                    />
                  </Box>
                </RadioGroup>
              </MUI.SettingSubHeaderContainer>
            </MUI.SettingHeaderContainer>

            {/* View Mode */}
            <MUI.SettingHeaderContainer>
              <Typography variant="h2">{t("_default_view_mode")}</Typography>
              <Typography variant="h4">
                {t("_default_view_mode_description")}
              </Typography>

              <MUI.SettingSubHeaderContainer>
                <RadioGroup
                  row
                  value={viewMode}
                  onChange={(e) => onUpdateViewMode(e)}
                >
                  <Box sx={{ display: "flex", gap: "1rem" }}>
                    <MUI.GroupFormControl
                      value="list"
                      control={<MUI.BpRadio />}
                      label={t("_list_view")}
                    />
                    <MUI.GroupFormControl
                      value="grid"
                      control={<MUI.BpRadio />}
                      label={t("_grid_view")}
                    />
                  </Box>
                </RadioGroup>
              </MUI.SettingSubHeaderContainer>
            </MUI.SettingHeaderContainer>

            {/* Allow show pricing */}
            <MUI.SettingHeaderContainer>
              <Typography variant="h2">{t("_allow_pricing")}</Typography>

              <MUI.SettingSubHeaderContainer>
                <FormGroup row>
                  <Box className="sub-toggle" sx={{ ml: 3 }}>
                    <FormControlLabel
                      control={
                        <MUI.SwitchToggle
                          inputProps={{ "aria-label": "ant design" }}
                          checked={showPricing}
                          onChange={(e) => {
                            onUpdateSwitch(
                              e.target.checked,
                              settingKeys.allowPricing,
                            );
                            setShowPricing(e.target.checked);
                          }}
                        />
                      }
                    />
                    <Box className="sub-toggle-text">
                      <Typography variant="h4">
                        {t("_allow_pricing_description")}
                      </Typography>
                    </Box>
                  </Box>
                </FormGroup>
              </MUI.SettingSubHeaderContainer>
            </MUI.SettingHeaderContainer>

            {/* Allow theme change */}
            <MUI.SettingHeaderContainer>
              <Typography variant="h2">{t("_allow_theme_change")}</Typography>

              <MUI.SettingSubHeaderContainer>
                <FormGroup row>
                  <Box className="sub-toggle" sx={{ ml: 3 }}>
                    <FormControlLabel
                      control={
                        <MUI.SwitchToggle
                          inputProps={{ "aria-label": "ant design" }}
                          checked={themeChange}
                          onChange={(e) => {
                            onUpdateSwitch(
                              e.target.checked,
                              settingKeys.allowThemeChange,
                            );
                            setThemeChange(e.target.checked);
                          }}
                        />
                      }
                    />
                    <Box className="sub-toggle-text">
                      <Typography variant="h4">
                        {t("_allow_theme_description")}
                      </Typography>
                    </Box>
                  </Box>
                </FormGroup>
              </MUI.SettingSubHeaderContainer>
            </MUI.SettingHeaderContainer>

            {/* Input */}
            <MUI.SettingHeaderContainer>
              <Typography variant="h2">{t("_access_bunny")}</Typography>
              <TextField
                name="bunnyKey"
                placeholder="Bunny key"
                size="small"
                fullWidth={true}
                onChange={handleChange}
                value={formField.bunnyKey}
              />
            </MUI.SettingHeaderContainer>

            {/* Input */}
            <MUI.SettingHeaderContainer>
              <Typography variant="h2">{t("_host_bunny")}</Typography>
              <TextField
                name="hostBunny"
                placeholder="Host bunny"
                size="small"
                fullWidth={true}
                onChange={handleChange}
                value={formField.hostBunny}
              />
            </MUI.SettingHeaderContainer>

            {/* Input */}
            <MUI.SettingHeaderContainer>
              <Typography variant="h2">{t("_strip_public")}</Typography>
              <TextField
                name="stripPublic"
                placeholder="Strip public"
                size="small"
                fullWidth={true}
                onChange={handleChange}
                value={formField.stripPublic}
              />
            </MUI.SettingHeaderContainer>

            {/* Input */}
            <MUI.SettingHeaderContainer>
              <Typography variant="h2">{t("_strip_secret")}</Typography>
              <TextField
                name="stripSecret"
                placeholder="Strip secret"
                size="small"
                fullWidth={true}
                onChange={handleChange}
                value={formField.stripSecret}
              />
            </MUI.SettingHeaderContainer>

            {/* Upload file */}
            <MUI.SettingHeaderContainer>
              <MUI.SettingUploadContainer
                sx={{
                  boxShadow: (theme) => theme.baseShadow.secondary,
                  flex: "1 1 0",
                }}
              >
                <Box sx={{ padding: "20px" }}>
                  <Typography className="fav-text" variant="h4">
                    {t("_fovicon")}
                  </Typography>
                  <TicketContainerWrapper {...getRootProps()}>
                    <TicketBodyUpload>
                      <TicketHeader>
                        <ButtonUpload
                          style={{ marginBottom: "8px" }}
                          variant="text"
                        >
                          <FiUpload
                            sx={{
                              fontSize: "30px",
                            }}
                          />
                        </ButtonUpload>
                        <Typography variant="h4">
                          {t("_drag_drop_to_upload")}
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="span">or</Typography>
                        </Box>
                        <BrowseImageButton
                          style={{ marginTop: "1rem" }}
                          type="button"
                          variant="outlined"
                          onClick={() => {}}
                        >
                          {t("_choose_image")}
                          <input {...getInputProps()} hidden={true} />
                        </BrowseImageButton>
                      </TicketHeader>

                      {!!file && (
                        <FileList mt={3}>
                          <FileListItem>
                            <Box className="box-img">
                              <FileDoc className="icon" />
                            </Box>
                            <Box>
                              <Typography component="p">{file.name}</Typography>
                              <Typography component="span">
                                {ConvertBytetoMBandGB(file.size)}
                              </Typography>
                            </Box>
                          </FileListItem>
                        </FileList>
                      )}
                    </TicketBodyUpload>
                  </TicketContainerWrapper>
                </Box>
              </MUI.SettingUploadContainer>
            </MUI.SettingHeaderContainer>

            {/* Line Action */}
            <MUI.SettingLineAction></MUI.SettingLineAction>

            {/* Action */}
            <MUI.SettingAction>
              <LoadingButton
                type="button"
                variant="contained"
                loading={isLoading}
                onClick={onSaveData}
              >
                Save data
              </LoadingButton>
            </MUI.SettingAction>
          </MUI.SettingWrapperContainer>
        </Paper>
      </MUI.SettingContainer>
    </Fragment>
  );
}

export default GeneralSetting;
