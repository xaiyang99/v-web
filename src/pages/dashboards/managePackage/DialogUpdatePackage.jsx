import React, { useEffect } from "react";
import {
  Typography,
  Box,
  styled,
  Button,
  InputLabel,
  Paper,
  Card,
  CardContent,
  Grid,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  FormGroup,
} from "@mui/material";
import DialogV1 from "../../../components/DialogV1";
import { useLazyQuery } from "@apollo/client";
import { QUERY_CURRENCY } from "./apollo";
import { useNavigate } from "react-router-dom";
// import * as Icon from "../../../icons/icons";
import { SketchPicker } from "react-color";
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
import "../managePackage/packageStyle.css";
import { useTranslation } from "react-i18next";
import { inputNumberOnly } from "../../../functions";
import "../css/packageStyle";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: "left",
  color: theme.palette.text.secondary,
}));

const CustomLabelInput = styled(InputLabel)({
  color: "black",
});

const CustomButton = styled(Button)({
  borderRadius: "6px",
});

function DialogUpdatePackage(props) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    onConfirm,
    dataPackage,
    setDataPackage,
    checked,
    setChecked,
    textColors,
    setTextColors,
    bgColors,
    setBgColors,
    isDownload,
    setIsDownload,
    isCaptcha,
    setIsCaptcha,
    isBatch,
    setIsBatch,
    isUnlimit,
    setIsUnlimit,
    isExpiredLink,
    setIsExpiredLink,
    isDownloadFolder,
    setIsDownloadFolder,
    isRemoteUpload,
    setIsRemoteUpload,
    isIOS,
    setIsIOS,
    isAndroid,
    setIsAndroid,
  } = props;

  const [getCurrency, { data: isCurrency }] = useLazyQuery(QUERY_CURRENCY, {
    fetchPolicy: "no-cache",
  });

  useEffect(() => {
    getCurrency({
      variables: {},
    });
  }, []);

  const renderValue = (value) => {
    const option = isCurrency.getCurrency.data.find(
      (option) => option._id === value,
    );
    return option ? option.name : "";
  };

  const convertMathFloor = (val) => {
    return Math.floor(val * 100);
  };

  const convertedObject = (val) => {
    const h = Math.floor(parseInt(val.h || 0));
    const s = convertMathFloor(val.s);
    const l = convertMathFloor(val.l);

    return `${h}, ${s}, ${l}`;
  };

  const renderLabel = (option) => {
    return option?.label;
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setDataPackage((values) => ({ ...values, [name]: value }));
  };

  return (
    <DialogV1
      {...props}
      dialogProps={{
        PaperProps: {
          sx: {
            overflowY: "initial",
            maxWidth: "1200px",
          },
        },
        sx: {
          columnGap: "20px",
        },
      }}
      dialogContentProps={{
        sx: {
          backgroundColor: "white !important",
          borderRadius: "6px",
          padding: (theme) => `${theme.spacing(5)}`,
        },
      }}
    >
      <Card>
        <CardContent>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
            }}
          >
            {t("_update_package")}
          </Typography>
          <Box sx={{ flexGrow: 1, mt: 4 }}>
            <Grid container>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <Item>
                  <CustomLabelInput>{t("_package_topic")}</CustomLabelInput>
                  <TextField
                    size="small"
                    type="text"
                    fullWidth
                    placeholder={t("_package_topic")}
                    variant="outlined"
                    name="name"
                    value={dataPackage.name}
                    onChange={handleChange}
                  />
                </Item>
              </Grid>
            </Grid>

            <Grid container spacing={1}>
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
                      value={dataPackage.annualPrice || ""}
                      onChange={handleChange}
                      onKeyPress={inputNumberOnly}
                    />
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
                      value={dataPackage.monthlyPrice || ""}
                      onChange={handleChange}
                      onKeyPress={inputNumberOnly}
                    />
                  </FormControl>
                </Item>
              </Grid>
            </Grid>

            <Grid>
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
                  value={dataPackage.sort}
                  onChange={handleChange}
                  onKeyPress={inputNumberOnly}
                />
              </Item>
            </Grid>

            <Grid>
              {/* Desc */}
              <Item sx={{ width: "100%" }}>
                <CustomLabelInput>{t("_description")}</CustomLabelInput>
                <StyledTextarea
                  maxRows={40}
                  aria-label="maximum height"
                  placeholder={t("_description")}
                  name="desc"
                  value={dataPackage.desc}
                  onChange={handleChange}
                />
              </Item>
            </Grid>

            <Grid container spacing={1}>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                {/* Storage */}
                <Item>
                  <CustomLabelInput>{t("_storage")}</CustomLabelInput>
                  <TextField
                    type="number"
                    id="outlined-end-adornment"
                    size="small"
                    placeholder={t("_storage")}
                    fullWidth
                    variant="outlined"
                    name="storage"
                    value={dataPackage.storage}
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
                            value={dataPackage.converStorage}
                            onChange={handleChange}
                          >
                            <MenuItem value="GB">GB</MenuItem>
                            <MenuItem value="TB">TB</MenuItem>
                          </Select>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Item>
              </Grid>

              <Grid item xs={12} sm={12} md={6} lg={6}>
                {/* Multiple Upload */}
                <Item>
                  <CustomLabelInput>{t("_multiple_upload")}</CustomLabelInput>
                  <TextField
                    type="text"
                    id="outlined-end-adornment"
                    size="small"
                    placeholder={t("_multiple_upload")}
                    fullWidth
                    variant="outlined"
                    disabled={
                      dataPackage?.convertMultipleUpload === "unlimited"
                        ? true
                        : false
                    }
                    name="multipleUpload"
                    value={
                      dataPackage?.convertMultipleUpload === "unlimited"
                        ? ""
                        : dataPackage.multipleUpload || ""
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
                            value={dataPackage.convertMultipleUpload}
                            onChange={handleChange}
                          >
                            <MenuItem value="limit">Limit</MenuItem>
                            <MenuItem value="unlimited">Unlimited</MenuItem>
                          </Select>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Item>
              </Grid>
            </Grid>

            <Grid container spacing={1}>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                {/* Upload / Perday */}
                <Item>
                  <CustomLabelInput>{t("_upload_perday")}</CustomLabelInput>
                  <TextField
                    type="text"
                    id="outlined-end-adornment"
                    size="small"
                    placeholder={t("_upload_perday")}
                    fullWidth
                    disabled={
                      dataPackage?.convertUploadPerday === "unlimited"
                        ? true
                        : false
                    }
                    variant="outlined"
                    name="uploadPerday"
                    value={
                      dataPackage.convertUploadPerday === "unlimited"
                        ? ""
                        : dataPackage.uploadPerday
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
                            value={dataPackage.convertUploadPerday}
                            onChange={handleChange}
                          >
                            <MenuItem value="limit">Limit</MenuItem>
                            <MenuItem value="unlimited">Unlimited</MenuItem>
                          </Select>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Item>
              </Grid>

              <Grid item xs={12} sm={12} md={6} lg={6}>
                {/* Max Download Size */}
                <Item>
                  <CustomLabelInput>{t("_max_download_size")}</CustomLabelInput>
                  <TextField
                    size="small"
                    type="number"
                    placeholder={t("_max_download_size")}
                    fullWidth
                    variant="outlined"
                    name="maxUploadSize"
                    value={dataPackage.maxUploadSize}
                    onChange={handleChange}
                  />
                </Item>
              </Grid>
            </Grid>

            <Grid container spacing={1}>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                {/* Currency */}
                <Item>
                  <InputLabel id="demo-select-small-label">
                    {t("_currency")}
                  </InputLabel>
                  <FormControl required fullWidth>
                    <Select
                      renderValue={renderValue}
                      // renderlabel={renderLabel}
                      size="small"
                      labelId="demo-select-small-label"
                      id="demo-select-small"
                      placeholder={t("_currency")}
                      name="currency"
                      value={String(dataPackage.currency)}
                      onChange={handleChange}
                    >
                      {isCurrency?.getCurrency.data?.map((item, index) => (
                        <MenuItem value={item._id} key={index}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Item>
              </Grid>

              <Grid item xs={12} sm={12} md={6} lg={6}>
                {/* Support */}
                <Item>
                  <CustomLabelInput>{t("_support_type")}</CustomLabelInput>
                  <FormControl fullWidth>
                    <Select
                      id="support-select"
                      labelId="demo-select-small-label"
                      size="small"
                      name="support"
                      onChange={handleChange}
                      value={dataPackage.support}
                    >
                      <MenuItem value="" disabled={true}>
                        {t("_support_type")}
                      </MenuItem>
                      <MenuItem value="normal">{t("_normal")}</MenuItem>
                      <MenuItem value="premium">{t("_premium")}</MenuItem>
                    </Select>
                  </FormControl>
                </Item>
              </Grid>
            </Grid>

            <Grid container spacing={1}>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                {/* Download Option */}
                <Item>
                  <CustomLabelInput>{t("_download_option")}</CustomLabelInput>
                  <FormControl fullWidth>
                    <Select
                      size="small"
                      labelId="select-download-option"
                      id="download-option-select"
                      name="downLoadOption"
                      value={dataPackage.downLoadOption || ""}
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
                </Item>
              </Grid>

              <Grid item xs={12} sm={12} md={6} lg={6}>
                {/* Status */}
                <Item>
                  <InputLabel id="demo-select-small-label">
                    {t("_status")}
                  </InputLabel>
                  <FormControl fullWidth>
                    <Select
                      size="small"
                      labelId="demo-select-small-label"
                      id="demo-select-small"
                      name="status"
                      value={dataPackage.status}
                      onChange={handleChange}
                    >
                      <MenuItem value="active">{t("_active_title")}</MenuItem>
                      <MenuItem value="inactive">{t("_inactive")}</MenuItem>
                    </Select>
                  </FormControl>
                </Item>
              </Grid>
            </Grid>

            <Grid container>
              {/* Text Coor */}
              <Grid item xs={12} lg={6}>
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
                        Hex <strong>{textColors.hex}</strong>
                        {/* RGB{" "}
                        <strong>
                          {bgColors.rgb.r}, {bgColors.rgb.g}, {bgColors.rgb.b}
                        </strong>{" "}
                        HSL <strong>{convertedObject(bgColors.hsl)}</strong> */}
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
                            <HueValue>{textColors.hex?.substring(1)}</HueValue>
                          </HueValueContainer>
                        </HuePickerContent>
                      </HuePickerListContainer>
                    </ColorPickerContainer>
                  </ColorPickerWrapper>
                </Item>
              </Grid>

              {/* Background colors */}
              <Grid item xs={12} lg={6}>
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
                        Hex <strong>{bgColors.hex}</strong>
                        {/* RGB{" "}
                        <strong>
                          {bgColors.rgb.r}, {bgColors.rgb.g}, {bgColors.rgb.b}
                        </strong>{" "}
                        HSL <strong>{convertedObject(bgColors.hsl)}</strong> */}
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
                          <HueValueContainer sx={{ mb: 0 }}>
                            <HueKey>#</HueKey>
                            <HueValue>{bgColors.hex?.substring(1)}</HueValue>
                          </HueValueContainer>

                          {/* <HueValueContainer>
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
                              {Math.floor(parseInt(bgColors.hsl.h || 0))}
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
                          </HueValueContainer> */}
                        </HuePickerContent>
                      </HuePickerListContainer>
                    </ColorPickerContainer>
                  </ColorPickerWrapper>
                </Item>
              </Grid>
            </Grid>

            {/* Multiple Download */}
            <FormGroup sx={{ ml: 1, mt: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "start" }}>
                <AntSwitch
                  inputProps={{ "aria-label": "ant design" }}
                  checked={isDownload}
                  onChange={(e) => setIsDownload(e.target.checked)}
                />
                <Box sx={{ display: "block", mt: -2, ml: 3 }}>
                  <Typography variant="subtitle2">
                    {t("_multiple_download")}
                  </Typography>
                  <Typography component="span" sx={{ fontSize: "12px" }}>
                    {t("_multiple_download_description")}
                  </Typography>
                </Box>
              </Box>
            </FormGroup>

            {/* No ads */}
            <FormGroup sx={{ mt: 5, ml: 1 }}>
              <Box sx={{ display: "flex", justifyContent: "start" }}>
                <AntSwitch
                  name="ads"
                  inputProps={{ "aria-label": "ant design" }}
                  checked={checked}
                  onChange={(e) => setChecked(e.target.checked)}
                />
                <Box sx={{ display: "block", mt: -2, ml: 3 }}>
                  <Typography variant="subtitle2">{t("_no_ads")}</Typography>
                  <Typography variant="body2" sx={{ fontSize: "12px" }}>
                    {t("_no_ads_description")}
                  </Typography>
                </Box>
              </Box>
            </FormGroup>

            {/* Captcha */}
            <FormGroup sx={{ ml: 1, mb: 2, mt: 8 }}>
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
                  <Typography component="span" sx={{ fontSize: "12px" }}>
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
                  <Typography variant="subtitle2">Batch Download</Typography>
                  <Typography component="span" sx={{ fontSize: "12px" }}>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Quod dignissimos dolor
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
                  <Typography component="span" sx={{ fontSize: "12px" }}>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Quod dignissimos dolor
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
                  <Typography component="span" sx={{ fontSize: "12px" }}>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Quod dignissimos dolor
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
                  onChange={(e) => setIsDownloadFolder(e.target.checked)}
                />
                <Box sx={{ display: "block", mt: -2, ml: 3 }}>
                  <Typography variant="subtitle2">Download folder</Typography>
                  <Typography component="span" sx={{ fontSize: "12px" }}>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Quod dignissimos dolor
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
                  <Typography variant="subtitle2">Remote upload</Typography>
                  <Typography component="span" sx={{ fontSize: "12px" }}>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Quod dignissimos dolor
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
                  <Typography variant="subtitle2">IOS application</Typography>
                  <Typography component="span" sx={{ fontSize: "12px" }}>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Quod dignissimos dolor
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
                  <Typography component="span" sx={{ fontSize: "12px" }}>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Quod dignissimos dolor
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
                onClick={onConfirm}
              >
                {t("_save_button")}
              </CustomButton>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </DialogV1>
  );
}

export default DialogUpdatePackage;
