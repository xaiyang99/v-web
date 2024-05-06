import React, { Fragment, useState } from "react";
import QRCode from "qrcode.react";
import CopyToClipboard from "react-copy-to-clipboard";
import { useMutation } from "@apollo/client";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DownloadDoneIcon from "@mui/icons-material/DownloadDone";

// components and functions
import { errorMessage, successMessage } from "../../../components/Alerts";
import useAuth from "../../../hooks/useAuth";
import * as MUI from "../../client-dashboard/css/accountStyle";
import { handleGraphqlErrors } from "../../../functions";

// material ui
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  TextField,
  Tooltip,
  Typography,
  styled,
  useMediaQuery,
} from "@mui/material";
import {
  MUTATION_CREATE_TWO_FA,
  MUTATION_TWO_FA_DISABLE,
  MUTATION_TWO_FA_VERIFY,
} from "./apollo";

const ContainerQR = styled("div")({
  minHeight: "50px",
  width: "auto",
});

const ContainerQRContent = styled("div")({
  width: "auto",
  display: "block",
});

function Index(props) {
  const { data, refetch } = props;
  const { user } = useAuth();
  const isMobile = useMediaQuery("(max-width:600px)");
  const [copied, setCopied] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [createTwoFactor] = useMutation(MUTATION_CREATE_TWO_FA);
  const [verityTwoFactor] = useMutation(MUTATION_TWO_FA_VERIFY);
  const [disableTwoFactor] = useMutation(MUTATION_TWO_FA_DISABLE);
  const [otpTwoFactorBase, setOtpTwoFactorBase] = useState(null);
  const [otpTwoFatorQRcode, setOtpTwoFatorQRcode] = useState(null);
  const [verifyCode, setVerifyCode] = useState("");
  const [otpIsEnable, setOtpIsEnable] = useState(0);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleEnableTwoFactor = async (val) => {
    try {
      if (val === "enable") {
        const result = await createTwoFactor({
          variables: {
            id: user?._id,
          },
        });

        if (result?.data?.createTwoFA?._id) {
          setOtpTwoFactorBase(result?.data?.createTwoFA?.twoFactorSecret);
          setOtpTwoFatorQRcode(result?.data?.createTwoFA?.twoFactorQrCode);
          refetch();
          setTimeout(() => {
            if (val === "enable") {
              handleClickOpen();
            }
          }, 300);
        }
      } else {
        const create = await disableTwoFactor({
          variables: {
            id: user?._id,
          },
        });

        if (create?.data?.disableTwoFA?._id) {
          refetch();
          successMessage("Disable two-factor authentication success ", 2000);
          setOtpIsEnable(0);
        }
      }
    } catch (error) {
      let cutErr = error.message.replace(/(ApolloError: )?Error: /, "");
      errorMessage(handleGraphqlErrors(cutErr), 3000);
    }
  };

  // verify two factor
  const handleVerifyTwofa = async () => {
    try {
      const authenVerify = await verityTwoFactor({
        variables: {
          id: parseInt(user?._id),
          code: verifyCode,
        },
        onCompleted: (data) => {
          setOtpIsEnable(data?.verifyTwoFA?.twoFactorIsEnabled);
        },
      });
      if (authenVerify?.data?.verifyTwoFA?._id) {
        successMessage("Verifty two-factor success", 2000);
        handleClose();
        setVerifyCode(null);
      }
    } catch (error) {
      let cutErr = error.message.replace(/(ApolloError: )?Error: /, "");
      errorMessage(handleGraphqlErrors(cutErr), 3000);
    }
  };

  // download RQcode
  const downloadQR = () => {
    const canvas = document.querySelector("#qr-code-canvas");
    const dataURL = canvas.toDataURL();

    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "qrcode-two-factor.png";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  function handleCopy() {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  return (
    <Fragment>
      <MUI.PaperGlobal
        elevation={5}
        sx={{
          marginTop: "2rem",
        }}
      >
        <Typography variant="h6" sx={{ color: "#5D596C", fontWeight: "600" }}>
          Two-steps verification
        </Typography>
        <Typography variant="h6" sx={{ color: "#5D596C", margin: "1rem 0" }}>
          Two-factor authentication is not enabled yet.
        </Typography>
        <Typography variant="h6" sx={{ color: "#5D596C", fontSize: "0.8rem" }}>
          Two-factor authentication adds a layer of security to your account by
          requiring more than just a password to log in. Learn more
        </Typography>
        <Button
          sx={{
            background: `${
              data?.twoFactorIsEnabled === 1 || otpIsEnable === 1
                ? "#EA5455"
                : "#17766B"
            }`,
            color: "#ffffff",
            padding: isMobile ? "0.3rem 0.5rem" : "0.5rem 2rem",
            fontSize: isMobile ? "0.8rem" : "",
            "&:hover": {
              color: "#17766B",
            },
            marginTop: "2rem",
          }}
          onClick={() =>
            handleEnableTwoFactor(
              data?.twoFactorIsEnabled === 1 || otpIsEnable === 1
                ? "disable"
                : "enable",
            )
          }
        >
          {data?.twoFactorIsEnabled === 1 || otpIsEnable === 1
            ? "Disable two-factor authentication"
            : "Enable two-factor authentication"}
        </Button>
      </MUI.PaperGlobal>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
      >
        <DialogContent>
          <ContainerQRContent>
            <ContainerQR>
              <Typography variant="h3" sx={{ fontSize: 20 }}>
                QR code two factor
              </Typography>
            </ContainerQR>
            <Box
              style={{
                width: "100%",
                border: "1px solid #fff",
                display: `${isMobile ? "block" : "flex"}`,
                gap: "2rem",
              }}
            >
              <Box>
                <QRCode
                  id="qr-code-canvas"
                  value={otpTwoFatorQRcode}
                  size={isMobile ? 150 : 200}
                  level="H"
                  fgColor="#000000"
                  bgColor="#FFFFFF"
                  renderAs="canvas"
                />

                <Box sx={{ display: "flex", mt: 3, alignItems: "center" }}>
                  <Button
                    variant="contained"
                    color="primaryTheme"
                    onClick={downloadQR}
                  >
                    Download QR
                  </Button>

                  <Box sx={{ ml: 4 }}>
                    {copied ? (
                      <IconButton>
                        <DownloadDoneIcon sx={{ color: "#17766B" }} />
                      </IconButton>
                    ) : (
                      <CopyToClipboard
                        text={otpTwoFactorBase}
                        onCopy={handleCopy}
                        sx={{ cursor: "copy" }}
                      >
                        <Tooltip title="Copy key code two-factor">
                          <ContentCopyIcon />
                        </Tooltip>
                      </CopyToClipboard>
                    )}
                  </Box>
                </Box>
              </Box>

              <Box sx={{ mt: 3 }}>
                <Typography variant="h4">Verify Code</Typography>
                <TextField
                  size="small"
                  id="outlined-basic"
                  variant="outlined"
                  sx={{ mt: 2 }}
                  value={verifyCode}
                  onChange={(e) => setVerifyCode(e.target.value)}
                />
              </Box>
            </Box>
          </ContainerQRContent>
        </DialogContent>

        <DialogActions sx={{ mb: 3, mr: 3 }}>
          <Button variant="contained" color="error" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primaryTheme"
            onClick={handleVerifyTwofa}
            autoFocus
            disabled={verifyCode ? false : true}
          >
            Verify Code
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}

export default Index;
