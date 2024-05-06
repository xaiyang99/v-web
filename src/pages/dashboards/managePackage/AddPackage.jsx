import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLazyQuery, useMutation } from "@apollo/client";
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  FormGroup,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import Switch from "@mui/material/Switch";
import { styled } from "@mui/material/styles";
import { Formik } from "formik";
import {
  errorMessage as errMessage,
  successMessage,
} from "../../../components/Alerts";
import BreadcrumbNavigate from "../../../components/BreadcrumbNavigate";
import { ConvertStorage, inputNumberOnly } from "../../../functions";
import * as Icon from "../../../icons/icons";
import { CREATE_PACKAGE, QUERY_CURRENCY } from "./apollo";
import { SketchPicker } from "react-color";
import IconBox from "@mui/icons-material/Inventory";
import {
  AntSwitch,
  ColorPickerCircle,
  ColorPickerContainer,
  ColorPickerWrapper,
  HeaderColorPicker,
  HueKey,
  HuePickerContent,
  HuePickerHeaderColor,
  HuePickerListContainer,
  HuePickerStyled,
  HueValue,
  HueValueContainer,
  StyledTextarea,
} from "../css/packageStyle";
import "./packageStyle.css";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: "left",
  color: theme.palette.text.secondary,
}));

const CustomLabelInput = styled(InputLabel)({
  color: "black",
  marginBottom: 1,
});

const CustomButton = styled(Button)({
  borderRadius: "6px",
});

function AddPackage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [checked, setChecked] = React.useState(false);
  const [isCaptcha, setIsCaptcha] = useState(false);
  const [isDownload, setIsDownload] = useState(false);
  const [isBatch, setIsBatch] = useState(false);
  const [isUnlimit, setIsUnlimit] = useState(false);
  const [isExpiredLink, setIsExpiredLink] = useState(false);
  const [isDownloadFolder, setIsDownloadFolder] = useState(false);
  const [isRemoteUpload, setIsRemoteUpload] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);

  const [textColors, setTextColors] = useState({
    hex: "#17766B",
    hsl: {
      h: "",
      s: "",
      l: "",
    },
    rgb: {
      r: "23",
      g: "118",
      b: "107",
    },
  });
  const [bgColors, setBgColors] = useState({
    hex: "#17766B",
    hsl: {
      h: "",
      s: "",
      l: "",
    },
    rgb: {
      r: "23",
      g: "118",
      b: "107",
    },
  });

  const convertMathFloor = (val) => {
    return Math.floor(val * 100);
  };

  const convertedObject = (val) => {
    const h = Math.floor(parseInt(val.h || 0));
    const s = convertMathFloor(val.s);
    const l = convertMathFloor(val.l);

    return `${h}, ${s}, ${l}`;
  };

  const [createPackage] = useMutation(CREATE_PACKAGE);
  const [getCurrency, { data: isCurrency }] = useLazyQuery(QUERY_CURRENCY, {
    fetchPolicy: "no-cache",
  });

  const [dataPackage, setDataPackage] = useState({
    name: "",
    desc: "",
    storage: "",
    annualPrice: 0,
    monthlyPrice: 0,
    sort: "",
    multipleUpload: "",
    downloadPerday: "",
    uploadPerday: "",
    maxDownloadSize: "",
    discount: 0,
    currency: "",
    converStorage: "GB",
    status: "active",
    convertMultipleUpload: "limit",
    convertUploadPerday: "limit",
    convertDownloadPerday: "limit",
    support: "normal",
    downloadOption: "direct",
    unlimitFiledrop: "",
  });

  const onSubmitForm = async (values, action) => {
    let convered = ConvertStorage({
      data: values.storage,
      byte: values.converStorage,
    });
    try {
      let newData = {
        name: values.name,
        sort: values.sort,
        annualPrice: parseInt(values.annualPrice) || 0,
        monthlyPrice: parseInt(values.monthlyPrice) || 0,
        description: values.desc,
        storage: `${convered}`,
        multipleUpload: values.convertMultipleUpload,
        numberOfFileUpload:
          values.convertMultipleUpload === "limit"
            ? parseInt(values.multipleUpload)
            : null,
        uploadPerDay: values.convertUploadPerday,
        fileUploadPerDay:
          values.convertUploadPerday === "limit"
            ? parseInt(values.uploadPerday)
            : null,
        maxUploadSize: values.maxDownloadSize.toString(),
        currencyId: parseInt(values.currency),
        status: "active",
        support: values.support,
        downLoadOption: values.downloadOption,
        textColor: textColors.hex,
        bgColor: bgColors.hex,
        multipleDownload: isDownload ? 1 : 0,
        ads: checked ? 1 : 0,
        captcha: isCaptcha ? 1 : 0,
        batchDownload: isBatch ? 1 : 0,
        unlimitedDownload: isUnlimit ? 1 : 0,
        customExpiredLink: isExpiredLink ? 1 : 0,
        downloadFolder: isDownloadFolder ? 1 : 0,
        remoteUpload: isRemoteUpload ? 1 : 0,
        iosApplication: isIOS ? 1 : 0,
        androidApplication: isAndroid ? 1 : 0,
      };

      if (convered) {
        await createPackage({
          variables: {
            input: newData,
          },
          onCompleted: () => {
            setDataPackage({});
            setChecked(false);
            setIsDownload(false);
            setIsCaptcha(false);
            successMessage("Created a new package success", 2000);
            window.history.back();
          },
        });
        action.resetForm();
      }
    } catch (error) {
      let cutErr = error.message.replace(/(ApolloError: )?Error: /, "");

      if (cutErr === "Duplicate entry") {
        errMessage(
          "This package is aready exist!. Please change package name",
          3000,
        );
      } else if (cutErr === "LOGIN_IS_REQUIRED") {
        errorMessage("Please login again.", 3000);
      } else {
        errMessage("Something went wrong!", 3000);
      }
    }
  };

  const errorMessage = (error) => {
    return <div style={{ color: "red", fontSize: "12px" }}>{error}</div>;
  };

  const validate = (values) => {
    let errors = {};

    if (!values.support) {
      errors.support = "Support is required";
    }
    if (!values.downloadOption) {
      errors.downloadOption = "Dowload option is required";
    }
    if (!values.sort) {
      errors.sort = "Sort is required";
    }
    if (!values.name) {
      errors.name = "Name is required";
    }

    if (!values.annualPrice) {
      errors.annualPrice = "Annual price is required";
    }

    if (!values.monthlyPrice) {
      errors.monthlyPrice = "Monthly price is required";
    }

    if (!values.desc) {
      errors.desc = "Description is required";
    }
    if (!values.storage) {
      errors.storage = "Storage is required";
    }
    if (!values.currency) {
      errors.currency = "Currency is required";
    }
    if (values.convertMultipleUpload === "limit") {
      if (!values.multipleUpload) {
        errors.multipleUpload = "Multiple upload is required";
      }
    }
    if (values.convertUploadPerday === "limit") {
      if (!values.uploadPerday) {
        errors.uploadPerday = "Upload perday is required";
      }
    }
    if (!values.maxDownloadSize) {
      errors.maxDownloadSize = "Max doawnload size is required";
    }

    if (!values.unlimitFiledrop) {
      errors.unlimitFiledrop = "Unlimit Filedrop is required";
    }

    return errors;
  };

  useEffect(() => {
    getCurrency({
      variables: {},
    });
  }, []);

  return (
    <Formik
      initialValues={dataPackage}
      validate={validate}
      onSubmit={onSubmitForm}
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
      }) => (
        <form noValidate onSubmit={handleSubmit}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              paddingBottom: "20px",
            }}
          >
            <BreadcrumbNavigate
              separatorIcon={<Icon.ForeSlash />}
              titlePath="/dashboard/package_manage"
              path={["package_manage", "create_package"]}
              readablePath={[t("_package_topic"), t("_create_package")]}
            />

            <Paper
              sx={{
                mt: (theme) => theme.spacing(3),
                boxShadow: (theme) => theme.baseShadow.secondary,
                flex: "1 1 0%",
                paddingBottom: "40px",
              }}
            >
              <Card>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <IconBox sx={{ mr: 2 }} /> {t("_create_package_title")}
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 600,
                      }}
                    ></Typography>
                  </Box>
                  <Box sx={{ flexGrow: 1, mt: 4 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={12} md={12} lg={12}>
                        {/* Package */}
                        <Item>
                          <CustomLabelInput>
                            {t("_package_topic")}
                          </CustomLabelInput>
                          <TextField
                            size="small"
                            type="text"
                            fullWidth
                            placeholder={t("_package_topic")}
                            variant="outlined"
                            onBlur={handleBlur}
                            name="name"
                            error={Boolean(touched.name && errors.name)}
                            value={values.name || ""}
                            onChange={handleChange}
                          />
                          {errors.name &&
                            touched.name &&
                            errorMessage(errors.name)}
                        </Item>
                      </Grid>

                      <Grid item xs={12} sm={12} md={6} lg={6}>
                        {/* Annual Price */}
                        <Item>
                          <CustomLabelInput>Annual price</CustomLabelInput>
                          <FormControl fullWidth>
                            <TextField
                              type="text"
                              size="small"
                              placeholder="Annual price"
                              fullWidth={true}
                              variant="outlined"
                              name="annualPrice"
                              error={Boolean(
                                touched.annualPrice && errors.annualPrice,
                              )}
                              value={values.annualPrice || ""}
                              onChange={handleChange}
                              onKeyPress={inputNumberOnly}
                            />
                            {touched.annualPrice &&
                              errors.annualPrice &&
                              errorMessage(errors.annualPrice)}
                          </FormControl>
                        </Item>
                      </Grid>
                      <Grid item xs={12} sm={12} md={6} lg={6}>
                        {/* Monthly Price */}
                        <Item>
                          <CustomLabelInput>Monthly price</CustomLabelInput>
                          <FormControl fullWidth>
                            <TextField
                              type="text"
                              size="small"
                              placeholder="Monthly price"
                              fullWidth={true}
                              variant="outlined"
                              name="monthlyPrice"
                              error={Boolean(
                                touched.monthlyPrice && errors.monthlyPrice,
                              )}
                              value={values.monthlyPrice || ""}
                              onChange={handleChange}
                              onKeyPress={inputNumberOnly}
                            />
                            {touched.monthlyPrice &&
                              errors.monthlyPrice &&
                              errorMessage(errors.monthlyPrice)}
                          </FormControl>
                        </Item>
                      </Grid>

                      <Grid item xs={12} sm={12}>
                        {/* Sort */}
                        <Item>
                          <CustomLabelInput>{t("_sort")}</CustomLabelInput>
                          <TextField
                            type="text"
                            size="small"
                            placeholder={t("_sort")}
                            fullWidth={true}
                            variant="outlined"
                            name="sort"
                            error={Boolean(touched.sort && errors.sort)}
                            value={values.sort || ""}
                            onChange={handleChange}
                            onKeyPress={inputNumberOnly}
                          />
                          {touched.sort &&
                            errors.sort &&
                            errorMessage(errors.sort)}
                        </Item>
                      </Grid>

                      <Grid item xs={12} sm={12} md={12} lg={12}>
                        {/* Desc */}
                        <Item>
                          <CustomLabelInput>
                            {t("_description")}
                          </CustomLabelInput>
                          <StyledTextarea
                            maxRows={20}
                            minRows={3}
                            aria-label="maximum height"
                            placeholder={t("_description")}
                            name="desc"
                            // error={Boolean(touched.desc && errors.desc)}
                            value={values.desc}
                            onChange={handleChange}
                          />
                          {errors.desc &&
                            touched.desc &&
                            errorMessage(errors.desc)}
                        </Item>
                      </Grid>

                      <Grid item xs={12} sm={12} md={6} lg={6}>
                        {/* Desc */}
                        <Item>
                          <CustomLabelInput>
                            Unlimited File drop
                          </CustomLabelInput>
                          <TextField
                            onKeyPress={inputNumberOnly}
                            name="unlimitFiledrop"
                            type="text"
                            placeholder="Unlimited File drop"
                            fullWidth={true}
                            size="small"
                            error={Boolean(
                              touched.unlimitFiledrop && errors.unlimitFiledrop,
                            )}
                            onChange={handleChange}
                            value={values.unlimitFiledrop}
                          />
                          {errors.unlimitFiledrop &&
                            touched.unlimitFiledrop &&
                            errorMessage(errors.unlimitFiledrop)}
                        </Item>
                      </Grid>

                      <Grid item xs={12} sm={12} md={6} lg={6}>
                        {/* Currrency */}
                        <Item>
                          <InputLabel id="demo-select-small-label">
                            {t("_currency")}
                          </InputLabel>
                          <FormControl required fullWidth>
                            <Select
                              size="small"
                              labelId="demo-select-small-label"
                              id="demo-select-small"
                              placeholder={t("_currency")}
                              name="currency"
                              error={Boolean(
                                errors.currency && touched.currency,
                              )}
                              value={values.currency || ""}
                              onChange={handleChange}
                            >
                              {isCurrency?.getCurrency?.data?.map(
                                (item, index) => (
                                  <MenuItem value={item._id} key={index}>
                                    {item.name}
                                  </MenuItem>
                                ),
                              )}
                            </Select>
                          </FormControl>
                          {errors.currency &&
                            touched.currency &&
                            errorMessage(errors.currency)}
                        </Item>
                      </Grid>

                      <Grid item xs={12} sm={12} md={6} lg={6}>
                        {/* Storage */}
                        <Item>
                          <CustomLabelInput>{t("_storage")}</CustomLabelInput>
                          <TextField
                            type="text"
                            id="outlined-end-adornment"
                            size="small"
                            placeholder={t("_storage")}
                            fullWidth
                            variant="outlined"
                            name="storage"
                            onKeyPress={inputNumberOnly}
                            error={Boolean(touched.storage && errors.storage)}
                            value={values.storage}
                            onChange={handleChange}
                            InputProps={{
                              startAdornment: (
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
                                    name="converStorage"
                                    value={values.converStorage}
                                    onChange={handleChange}
                                  >
                                    <MenuItem value="GB">GB</MenuItem>
                                    <MenuItem value="TB">TB</MenuItem>
                                  </Select>
                                </InputAdornment>
                              ),
                            }}
                          />

                          {errors.storage &&
                            touched.storage &&
                            errorMessage(errors.storage)}
                        </Item>
                      </Grid>

                      <Grid item xs={12} sm={12} md={6} lg={6}>
                        {/* Multiple Upload */}
                        <Item>
                          <CustomLabelInput>
                            {t("_multiple_upload")}
                          </CustomLabelInput>
                          <TextField
                            type="text"
                            name="multipleUpload"
                            id="outlined-end-adornment"
                            size="small"
                            placeholder={t("_multiple_upload")}
                            fullWidth
                            variant="outlined"
                            disabled={
                              values?.convertMultipleUpload === "unlimited"
                                ? true
                                : false
                            }
                            error={Boolean(
                              touched.multipleUpload && errors.multipleUpload,
                            )}
                            value={
                              values?.convertMultipleUpload === "unlimited"
                                ? 0
                                : values.multipleUpload || ""
                            }
                            onChange={handleChange}
                            onKeyPress={inputNumberOnly}
                            InputProps={{
                              startAdornment: (
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
                                    name="convertMultipleUpload"
                                    value={values.convertMultipleUpload}
                                    onChange={handleChange}
                                  >
                                    <MenuItem value="limit">
                                      {t("_limit")}
                                    </MenuItem>
                                    <MenuItem value="unlimited">
                                      {t("_unlimit")}
                                    </MenuItem>
                                  </Select>
                                </InputAdornment>
                              ),
                            }}
                          />

                          {errors.multipleUpload &&
                            touched.multipleUpload &&
                            errorMessage(errors.multipleUpload)}
                        </Item>
                      </Grid>
                      <Grid item xs={12} sm={12} md={6} lg={6}>
                        {/* Upload / Perday */}
                        <Item>
                          <CustomLabelInput>
                            {t("_upload_perday")}
                          </CustomLabelInput>
                          <TextField
                            type="text"
                            id="outlined-end-adornment"
                            size="small"
                            placeholder={t("_upload_perday")}
                            fullWidth
                            disabled={
                              values?.convertUploadPerday === "unlimited"
                                ? true
                                : false
                            }
                            variant="outlined"
                            name="uploadPerday"
                            error={Boolean(
                              touched.uploadPerday && errors.uploadPerday,
                            )}
                            value={
                              values?.convertUploadPerday === "unlimited"
                                ? 0
                                : values.uploadPerDay
                            }
                            onChange={handleChange}
                            onKeyPress={inputNumberOnly}
                            InputProps={{
                              startAdornment: (
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
                                    name="convertUploadPerday"
                                    value={values.convertUploadPerday}
                                    onChange={handleChange}
                                  >
                                    <MenuItem value="limit">
                                      {t("_limit")}
                                    </MenuItem>
                                    <MenuItem value="unlimited">
                                      {t("_unlimit")}
                                    </MenuItem>
                                  </Select>
                                </InputAdornment>
                              ),
                            }}
                          />

                          {errors.uploadPerday &&
                            touched.uploadPerday &&
                            errorMessage(errors.uploadPerday)}
                        </Item>
                      </Grid>

                      <Grid item xs={12} sm={12} md={6} lg={6}>
                        {/* Max download size */}
                        <Item>
                          <CustomLabelInput>
                            {t("_max_download_size")}
                          </CustomLabelInput>
                          <TextField
                            size="small"
                            type="number"
                            placeholder={t("_max_download_size")}
                            fullWidth
                            variant="outlined"
                            name="maxDownloadSize"
                            error={Boolean(
                              touched.maxDownloadSize && errors.maxDownloadSize,
                            )}
                            value={values.maxDownloadSize || ""}
                            onChange={handleChange}
                          />
                          {errors.maxDownloadSize &&
                            touched.maxDownloadSize &&
                            errorMessage(errors.maxDownloadSize)}
                        </Item>
                      </Grid>

                      <Grid item xs={12} sm={12} md={6} lg={6}>
                        {/* Support */}
                        <Item>
                          <CustomLabelInput>
                            {t("_support_type")}
                          </CustomLabelInput>
                          <FormControl fullWidth>
                            <Select
                              id="support-select"
                              labelId="demo-select-small-label"
                              size="small"
                              name="support"
                              error={Boolean(touched.support && errors.support)}
                              onChange={handleChange}
                              value={values.support}
                            >
                              <MenuItem value="" disabled={true}>
                                {t("_support_type")}
                              </MenuItem>
                              <MenuItem value="normal">{t("_normal")}</MenuItem>
                              <MenuItem value="premium">
                                {t("_premium")}
                              </MenuItem>
                            </Select>
                          </FormControl>
                          {touched.support &&
                            errors.support &&
                            errorMessage(errors.support)}
                        </Item>
                      </Grid>

                      <Grid item xs={12} sm={12} md={6} lg={6}>
                        {/* Download Option */}
                        <Item>
                          <CustomLabelInput>
                            {t("_download_option")}
                          </CustomLabelInput>
                          <FormControl fullWidth>
                            <Select
                              size="small"
                              labelId="select-download-option"
                              id="download-option-select"
                              name="downloadOption"
                              error={Boolean(
                                touched.downloadOption && errors.downloadOption,
                              )}
                              value={values.downloadOption || ""}
                              onChange={handleChange}
                            >
                              <MenuItem value="" disabled={true}>
                                {t("_download_option")}
                              </MenuItem>
                              <MenuItem value="direct">
                                {t("_direct_download")}
                              </MenuItem>
                              <MenuItem value="another">
                                {t("_another_download")}
                              </MenuItem>
                            </Select>
                          </FormControl>
                          {errors.downloadOption &&
                            touched.downloadOption &&
                            errorMessage(errors.downloadOption)}
                        </Item>
                      </Grid>
                    </Grid>

                    {/* Colors */}
                    <Grid container>
                      {/* Text Coor */}
                      <Grid item xs={12} sm={12} lg={6}>
                        <Item>
                          <CustomLabelInput sx={{ mb: 3 }}>
                            {t("_text_color")}
                          </CustomLabelInput>

                          <ColorPickerWrapper>
                            <HeaderColorPicker>
                              <ColorPickerCircle
                                style={{
                                  backgroundColor: textColors.hex,
                                }}
                                mr={5}
                              />
                              <Typography variant="h4">
                                Hex <strong>{bgColors.hex}</strong> RGB{" "}
                                <strong>
                                  {bgColors.rgb.r}, {bgColors.rgb.g},{" "}
                                  {bgColors.rgb.b}
                                </strong>{" "}
                                HSL{" "}
                                <strong>{convertedObject(bgColors.hsl)}</strong>
                              </Typography>
                            </HeaderColorPicker>

                            <ColorPickerContainer>
                              <SketchPicker
                                className="customPicker"
                                color={textColors}
                                onChange={(e) => setTextColors(e)}
                                sx={{
                                  boxShadow: "none",
                                  width: "100%",
                                }}
                              />

                              <HuePickerStyled
                                className="huePicker"
                                direction="vertical"
                                color={textColors.hex}
                                onChange={(e) => setTextColors(e)}
                                sx={{ ml: 2 }}
                              />

                              <HuePickerListContainer>
                                <HuePickerHeaderColor
                                  sx={{
                                    backgroundColor: textColors.hex,
                                  }}
                                />

                                <HuePickerContent>
                                  <HueValueContainer sx={{ mb: 3 }}>
                                    <HueKey>#</HueKey>
                                    <HueValue>
                                      {textColors.hex?.substring(1)}
                                    </HueValue>
                                  </HueValueContainer>

                                  <HueValueContainer>
                                    <HueKey>R</HueKey>
                                    <HueValue>{textColors.rgb.r}</HueValue>
                                  </HueValueContainer>
                                  <HueValueContainer>
                                    <HueKey>G</HueKey>
                                    <HueValue>{textColors.rgb.g}</HueValue>
                                  </HueValueContainer>
                                  <HueValueContainer>
                                    <HueKey>B</HueKey>
                                    <HueValue>{textColors.rgb.b}</HueValue>
                                  </HueValueContainer>

                                  <HueValueContainer sx={{ mt: 4 }}>
                                    <HueKey>H</HueKey>
                                    <HueValue>
                                      {Math.floor(
                                        parseInt(textColors.hsl.h || 0),
                                      )}
                                    </HueValue>
                                  </HueValueContainer>
                                  <HueValueContainer>
                                    <HueKey>S</HueKey>
                                    <HueValue>
                                      {convertMathFloor(textColors.hsl.s)}
                                    </HueValue>
                                  </HueValueContainer>
                                  <HueValueContainer>
                                    <HueKey>L</HueKey>
                                    <HueValue>
                                      {convertMathFloor(textColors.hsl.l)}
                                    </HueValue>
                                  </HueValueContainer>
                                </HuePickerContent>
                              </HuePickerListContainer>
                            </ColorPickerContainer>
                          </ColorPickerWrapper>
                        </Item>
                      </Grid>

                      {/* Background colors */}
                      <Grid item xs={12} sm={12} lg={6}>
                        <Item>
                          <CustomLabelInput sx={{ mb: 3 }}>
                            {t("_text_color")}
                          </CustomLabelInput>

                          <ColorPickerWrapper>
                            <HeaderColorPicker>
                              <ColorPickerCircle
                                style={{
                                  backgroundColor: bgColors.hex,
                                }}
                                mr={5}
                              />
                              <Typography variant="h4">
                                Hex <strong>{bgColors.hex}</strong> RGB{" "}
                                <strong>
                                  {bgColors.rgb.r}, {bgColors.rgb.g},{" "}
                                  {bgColors.rgb.b}
                                </strong>{" "}
                                HSL{" "}
                                <strong>{convertedObject(bgColors.hsl)}</strong>
                              </Typography>
                            </HeaderColorPicker>

                            <ColorPickerContainer>
                              <SketchPicker
                                className="customPicker"
                                color={bgColors}
                                onChange={(e) => setBgColors(e)}
                                sx={{
                                  boxShadow: "none",
                                  width: "100%",
                                }}
                              />

                              <HuePickerStyled
                                className="huePicker"
                                direction="vertical"
                                color={bgColors.hex}
                                onChange={(e) => setBgColors(e)}
                                sx={{ ml: 2 }}
                              />

                              <HuePickerListContainer>
                                <HuePickerHeaderColor
                                  sx={{
                                    backgroundColor: bgColors.hex,
                                  }}
                                />

                                <HuePickerContent>
                                  <HueValueContainer sx={{ mb: 3 }}>
                                    <HueKey>#</HueKey>
                                    <HueValue>
                                      {bgColors.hex?.substring(1)}
                                    </HueValue>
                                  </HueValueContainer>

                                  <HueValueContainer>
                                    <HueKey>R</HueKey>
                                    <HueValue>{bgColors.rgb.r}</HueValue>
                                  </HueValueContainer>
                                  <HueValueContainer>
                                    <HueKey>G</HueKey>
                                    <HueValue>{bgColors.rgb.g}</HueValue>
                                  </HueValueContainer>
                                  <HueValueContainer>
                                    <HueKey>B</HueKey>
                                    <HueValue>{bgColors.rgb.b}</HueValue>
                                  </HueValueContainer>

                                  <HueValueContainer sx={{ mt: 4 }}>
                                    <HueKey>H</HueKey>
                                    <HueValue>
                                      {Math.floor(
                                        parseInt(bgColors.hsl.h || 0),
                                      )}
                                    </HueValue>
                                  </HueValueContainer>
                                  <HueValueContainer>
                                    <HueKey>S</HueKey>
                                    <HueValue>
                                      {convertMathFloor(bgColors.hsl.s)}
                                    </HueValue>
                                  </HueValueContainer>
                                  <HueValueContainer>
                                    <HueKey>L</HueKey>
                                    <HueValue>
                                      {convertMathFloor(bgColors.hsl.l)}
                                    </HueValue>
                                  </HueValueContainer>
                                </HuePickerContent>
                              </HuePickerListContainer>
                            </ColorPickerContainer>
                          </ColorPickerWrapper>
                        </Item>
                      </Grid>
                    </Grid>

                    {/* Multiple Download */}
                    <FormGroup sx={{ ml: 1, mb: 2, mt: 3 }}>
                      <Box sx={{ display: "flex", justifyContent: "start" }}>
                        <AntSwitch
                          inputProps={{ "aria-label": "ant design" }}
                          checked={isDownload}
                          onChange={(e) => setIsDownload(e.target.checked)}
                        />
                        <Box sx={{ display: "block", ml: 3 }}>
                          <Typography variant="subtitle2">
                            {t("_multiple_download")}
                          </Typography>
                          <Typography
                            component="span"
                            sx={{ fontSize: "12px" }}
                          >
                            {t("_multiple_download_description")}
                          </Typography>
                        </Box>
                      </Box>
                    </FormGroup>

                    {/* No ads */}
                    <FormGroup sx={{ ml: 1, mb: 2, mt: 5.5 }}>
                      <Box sx={{ display: "flex", justifyContent: "start" }}>
                        <AntSwitch
                          inputProps={{ "aria-label": "ant design" }}
                          checked={checked}
                          onChange={(e) => setChecked(e.target.checked)}
                        />
                        <Box sx={{ display: "block", mt: -2, ml: 3 }}>
                          <Typography variant="subtitle2">
                            {t("_no_ads")}
                          </Typography>
                          <Typography
                            component="span"
                            sx={{ fontSize: "12px" }}
                          >
                            {t("_no_ads_description")}
                          </Typography>
                        </Box>
                      </Box>
                    </FormGroup>

                    {/* Captcha */}
                    <FormGroup sx={{ ml: 1, mb: 2, mt: 5.5 }}>
                      <Box sx={{ display: "flex", justifyContent: "start" }}>
                        <AntSwitch
                          inputProps={{ "aria-label": "ant design" }}
                          checked={isCaptcha}
                          onChange={(e) => setIsCaptcha(e.target.checked)}
                        />
                        <Box sx={{ display: "block", mt: -2, ml: 3 }}>
                          <Typography variant="subtitle2">
                            {t("_no_captcha")}
                          </Typography>
                          <Typography
                            component="span"
                            sx={{ fontSize: "12px" }}
                          >
                            {t("_no_captcha_description")}
                          </Typography>
                        </Box>
                      </Box>
                    </FormGroup>

                    {/* Batch Download */}
                    <FormGroup sx={{ ml: 1, mb: 2, mt: 5.5 }}>
                      <Box sx={{ display: "flex", justifyContent: "start" }}>
                        <AntSwitch
                          inputProps={{ "aria-label": "ant design" }}
                          checked={isBatch}
                          onChange={(e) => setIsBatch(e.target.checked)}
                        />
                        <Box sx={{ display: "block", mt: -2, ml: 3 }}>
                          <Typography variant="subtitle2">
                            Batch Download
                          </Typography>
                          <Typography
                            component="span"
                            sx={{ fontSize: "12px" }}
                          >
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Quod dignissimos dolor
                          </Typography>
                        </Box>
                      </Box>
                    </FormGroup>

                    {/* Unlimited Download */}
                    <FormGroup sx={{ ml: 1, mb: 2, mt: 5.5 }}>
                      <Box sx={{ display: "flex", justifyContent: "start" }}>
                        <AntSwitch
                          inputProps={{ "aria-label": "ant design" }}
                          checked={isUnlimit}
                          onChange={(e) => setIsUnlimit(e.target.checked)}
                        />
                        <Box sx={{ display: "block", mt: -2, ml: 3 }}>
                          <Typography variant="subtitle2">
                            Unlimited Download
                          </Typography>
                          <Typography
                            component="span"
                            sx={{ fontSize: "12px" }}
                          >
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Quod dignissimos dolor
                          </Typography>
                        </Box>
                      </Box>
                    </FormGroup>

                    {/* Custom expired link */}
                    <FormGroup sx={{ ml: 1, mb: 2, mt: 5.5 }}>
                      <Box sx={{ display: "flex", justifyContent: "start" }}>
                        <AntSwitch
                          inputProps={{ "aria-label": "ant design" }}
                          checked={isExpiredLink}
                          onChange={(e) => setIsExpiredLink(e.target.checked)}
                        />
                        <Box sx={{ display: "block", mt: -2, ml: 3 }}>
                          <Typography variant="subtitle2">
                            Custom expired link
                          </Typography>
                          <Typography
                            component="span"
                            sx={{ fontSize: "12px" }}
                          >
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Quod dignissimos dolor
                          </Typography>
                        </Box>
                      </Box>
                    </FormGroup>

                    {/* Download folder */}
                    <FormGroup sx={{ ml: 1, mb: 2, mt: 5.5 }}>
                      <Box sx={{ display: "flex", justifyContent: "start" }}>
                        <AntSwitch
                          inputProps={{ "aria-label": "ant design" }}
                          checked={isDownloadFolder}
                          onChange={(e) =>
                            setIsDownloadFolder(e.target.checked)
                          }
                        />
                        <Box sx={{ display: "block", mt: -2, ml: 3 }}>
                          <Typography variant="subtitle2">
                            Download folder
                          </Typography>
                          <Typography
                            component="span"
                            sx={{ fontSize: "12px" }}
                          >
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Quod dignissimos dolor
                          </Typography>
                        </Box>
                      </Box>
                    </FormGroup>

                    {/* Remote upload */}
                    <FormGroup sx={{ ml: 1, mb: 2, mt: 5.5 }}>
                      <Box sx={{ display: "flex", justifyContent: "start" }}>
                        <AntSwitch
                          inputProps={{ "aria-label": "ant design" }}
                          checked={isRemoteUpload}
                          onChange={(e) => setIsRemoteUpload(e.target.checked)}
                        />
                        <Box sx={{ display: "block", mt: -2, ml: 3 }}>
                          <Typography variant="subtitle2">
                            Remote upload
                          </Typography>
                          <Typography
                            component="span"
                            sx={{ fontSize: "12px" }}
                          >
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Quod dignissimos dolor
                          </Typography>
                        </Box>
                      </Box>
                    </FormGroup>

                    {/* IOS application */}
                    <FormGroup sx={{ ml: 1, mb: 2, mt: 5.5 }}>
                      <Box sx={{ display: "flex", justifyContent: "start" }}>
                        <AntSwitch
                          inputProps={{ "aria-label": "ant design" }}
                          checked={isIOS}
                          onChange={(e) => setIsIOS(e.target.checked)}
                        />
                        <Box sx={{ display: "block", mt: -2, ml: 3 }}>
                          <Typography variant="subtitle2">
                            IOS application
                          </Typography>
                          <Typography
                            component="span"
                            sx={{ fontSize: "12px" }}
                          >
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Quod dignissimos dolor
                          </Typography>
                        </Box>
                      </Box>
                    </FormGroup>

                    {/* Android application */}
                    <FormGroup sx={{ ml: 1, mb: 2, mt: 5.5 }}>
                      <Box sx={{ display: "flex", justifyContent: "start" }}>
                        <AntSwitch
                          inputProps={{ "aria-label": "ant design" }}
                          checked={isAndroid}
                          onChange={(e) => setIsAndroid(e.target.checked)}
                        />
                        <Box sx={{ display: "block", mt: -2, ml: 3 }}>
                          <Typography variant="subtitle2">
                            Android application
                          </Typography>
                          <Typography
                            component="span"
                            sx={{ fontSize: "12px" }}
                          >
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Quod dignissimos dolor
                          </Typography>
                        </Box>
                      </Box>
                    </FormGroup>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        mt: 3,
                        mb: 5,
                      }}
                    >
                      <CustomButton
                        variant="contained"
                        type="button"
                        style={{
                          backgroundColor: "#F6F6F7",
                          color: "#807C8C",
                          paddingLeft: 25,
                          paddingRight: 25,
                        }}
                        onClick={() => navigate("/dashboard/package_manage")}
                      >
                        {t("_cancel_button")}
                      </CustomButton>
                      <CustomButton
                        sx={{ ml: 3 }}
                        variant="contained"
                        color="primaryTheme"
                        type="submit"
                      >
                        {t("_save_button")}
                      </CustomButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Paper>
          </Box>
        </form>
      )}
    </Formik>
  );
}

export default AddPackage;
