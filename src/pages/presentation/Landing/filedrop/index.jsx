import React, { Fragment, useEffect, useRef, useState } from "react";

// components
import ResponsiveAppBar from "../home/Appbar";
import { useMutation } from "@apollo/client";
import Footer from "../home/Footer";
import {
  generateRandomString,
  handleGraphqlErrors,
  recaptchaKey,
} from "../../../../functions";
import { errorMessage, successMessage } from "../../../../components/Alerts";
import { CREATE_FILEDROP_LINK } from "./apollo";

// material ui component and icons
import {
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  createTheme,
  useMediaQuery,
} from "@mui/material";
import CopyToClipboard from "react-copy-to-clipboard";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { styled } from "@mui/material/styles";
import DownloadDoneIcon from "@mui/icons-material/DownloadDone";
import useManageSetting from "../../../dashboards/settings/hooks/useManageSetting";
import ReCAPTCHA from "react-google-recaptcha";

const FiledropContainer = styled(Container)(({ theme }) => ({
  marginTop: "5rem",
  textAlign: "center",
  padding: "4rem 0",
  [theme.breakpoints.down("sm")]: {
    marginTop: "3rem !important",
  },
}));

const FiledropArea = styled(Box)(({ theme }) => ({
  background: "#ECF4F3",
  padding: "2rem 2rem 4rem 2rem",
  borderRadius: "10px",
  [theme.breakpoints.down("sm")]: {
    padding: "1rem 0.5rem 6rem 0.5rem",
  },
}));

const ConditionArea = styled(Box)(({ theme }) => ({
  width: "60%",
  marginLeft: "20%",
  marginTop: "1rem",
  display: "flex",
  alignItems: "start",
  justifyContent: "center",
  flexDirection: "column",

  textAlign: "start",
  textAlign: "justify",
  textJustify: "distribute",
  hyphens: "auto",
  textAlignLast: "left",
  span: {
    fontSize: "0.9rem",
    width: "100%",
    fontWeight: 400,
  },

  [theme.breakpoints.down("md")]: {
    marginTop: "0.7rem",
  },

  [theme.breakpoints.down("sm")]: {
    width: "100%",
    marginLeft: "0",
    marginTop: "0.5rem",
    padding: "0 1rem",
    span: {
      fontSize: "0.8rem",
      marginTop: "0.2rem",
    },
  },
  [theme.breakpoints.up("sm")]: {
    width: "80%",
    marginLeft: "10%",
    padding: "0 1rem",
  },
}));

const FileDropLinkArea = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  margin: "1rem 0",
});

function FileDrop() {
  const theme = createTheme();
  const isMobile = useMediaQuery("(max-width:768px)");
  const captchaRef = useRef();
  const [fileDrop, setFileDrop] = useState(null);
  const link = process.env.REACT_APP_FILE_DROP_LINK;
  const [value, setValue] = React.useState(link);
  const [copied, setCopied] = React.useState(false);
  const [usedCaptcha, setUsedCaptcha] = useState(false);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [filedropLinkCreation] = useMutation(CREATE_FILEDROP_LINK);
  const [captchaKey, setCaptchaKey] = useState(false);
  const useDataSettings = useManageSetting();

  const settingKeys = {
    fileDrop: "HMFDCAU",
    fileDropCaptcha: "FDCHPA",
  };

  function handleCopy() {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  const handleData = (value) => {
    if (value) {
      setUsedCaptcha(true);
      setCaptchaKey(false);
    }
  };

  // generateFileDropLink
  const generateFileDropLink = async () => {
    const genLink = link + generateRandomString();
    try {
      let createfiledropLink = await filedropLinkCreation({
        variables: {
          input: {
            url: genLink,
          },
        },
      });
      if (createfiledropLink?.data?.createPublicFileDropUrl?._id) {
        setValue(genLink);
        successMessage("Your new link is created!!", 2000);
        setTimeout(() => {
          setUsedCaptcha(false);
          captchaRef.current?.reset();
          setCaptchaKey(true);
        }, 200);
      }
    } catch (error) {
      let cutErr = error.message.replace(/(ApolloError: )?Error: /, "");
      setTimeout(() => {
        setUsedCaptcha(false);
        captchaRef.current?.reset();
        setCaptchaKey(true);
      }, 200);
      errorMessage(handleGraphqlErrors(cutErr || ""), 3000);
    }
  };

  useEffect(() => {
    const getDataSettings = () => {
      const dataFileDrop = useDataSettings.data?.find(
        (data) => data?.productKey === settingKeys.fileDrop,
      );
      if (!!dataFileDrop) {
        setFileDrop(dataFileDrop);
      }

      const dataCaptcha = useDataSettings.data?.find(
        (data) => data?.productKey === settingKeys.fileDropCaptcha,
      );
      if (!!dataCaptcha) {
        if (dataCaptcha?.status === "on") {
          setCaptchaKey(true);
          setShowCaptcha(true);
        }
      }
    };

    getDataSettings();
  }, [useDataSettings.data]);

  return (
    <React.Fragment>
      <ResponsiveAppBar />
      <FiledropContainer>
        <FiledropArea>
          <Typography
            variant=""
            sx={{
              fontSize: "1.5rem",
              fontWeight: 600,
              color: "#4B465C",
              width: "100%",
              height: "50px",

              [theme.breakpoints.down("md")]: {
                height: "40px",
              },

              [theme.breakpoints.down("sm")]: {
                fontSize: "1rem",
                fontWeight: 500,
                height: "30px",
              },
            }}
          >
            The easiest way to share and receive files
          </Typography>
          <Typography
            sx={{
              fontSize: "1.125rem",
              fontWeight: 500,
              color: "#4B465C",
              width: "100%",
              height: "50px",

              [theme.breakpoints.down("md")]: {
                height: "40px",
              },

              [theme.breakpoints.down("sm")]: {
                fontSize: "0.8rem",
                fontWeight: 500,
                marginTop: "0.2rem",
              },
            }}
          >
            What to know before using the file drop:
          </Typography>
          <ConditionArea>
            <span>
              1. This link will expire in 24 hours to protect your file
              security.
            </span>

            <span>
              2. Download links expire after all files have been downloaded to
              protect your file security. If you need to download the files
              again, you can generate a new link.
            </span>

            <span>
              3. To protect your privacy and security, all files will be
              automatically deleted from our servers after the download link
              expires.
            </span>
          </ConditionArea>

          <Fragment sx={{ display: "flex" }}>
            <Box sx={{ margin: "auto", mt: 6, mb: 5, display: "table" }}>
              <ReCAPTCHA
                ref={captchaRef}
                sitekey={recaptchaKey}
                onChange={handleData}
                onExpired={() => {
                  setCaptchaKey(false);
                }}
              />
            </Box>
            <Button
              variant="contained"
              onClick={generateFileDropLink}
              sx={{ margin: "1rem 0" }}
              disabled={captchaKey}
            >
              Generate nows
            </Button>
          </Fragment>

          {/* {showCaptcha && (
            <Fragment>
              {!usedCaptcha && (
                <Box sx={{ margin: "auto", mt: 6, mb: 5, display: "table" }}>
                  <ReCAPTCHA
                    ref={captchaRef}
                    sitekey={recaptchaKey}
                    onChange={handleData}
                    onExpired={() => {
                      setCaptchaKey(false);
                    }}
                  />
                </Box>
              )}
            </Fragment>
          )}

          {!!fileDrop && (
            <Fragment>
              {usedCaptcha && (
                <Button
                  variant="contained"
                  onClick={generateFileDropLink}
                  sx={{ margin: "1rem 0" }}
                  disabled={captchaKey}
                >
                  Generate nows
                </Button>
              )}
            </Fragment>
          )} */}
          <FileDropLinkArea>
            <TextField
              sx={{
                width: isMobile ? "90%" : "70%",
                marginLeft: isMobile ? "5%" : "15%",
                fontSize: "18px !important",
                color: "grey !important",
              }}
              size={isMobile ? "small" : "medium"}
              InputLabelProps={{
                shrink: false,
              }}
              disabled
              value={value === link ? "" : value}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {copied ? (
                      <IconButton>
                        <DownloadDoneIcon sx={{ color: "#17766B" }} />
                      </IconButton>
                    ) : (
                      <CopyToClipboard
                        text={value}
                        onCopy={handleCopy}
                        sx={{ cursor: "copy", color: "#17766B" }}
                      >
                        <IconButton
                          aria-label="copy"
                          disabled={value === link ? true : false}
                        >
                          <ContentCopyIcon />
                        </IconButton>
                      </CopyToClipboard>
                    )}
                  </InputAdornment>
                ),
              }}
            />
          </FileDropLinkArea>
          <Typography
            sx={{
              margin: "1rem 0",
              fontSize: "0.9rem",
              width: "100%",
              [theme.breakpoints.down("sm")]: {
                margin: "0",
                fontSize: "0.8rem",
                textAlign: "start",
                padding: "0 1rem",
              },
            }}
          >
            Please share this link with the intended recipient of the file
          </Typography>
        </FiledropArea>
      </FiledropContainer>
      <Footer />
    </React.Fragment>
  );
}

export default FileDrop;
