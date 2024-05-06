import {
  Box,
  Button,
  InputLabel,
  Skeleton,
  TextField,
  Typography,
  styled,
  useMediaQuery,
} from "@mui/material";
import React, { useState } from "react";
import DialogV1 from "../../../components/DialogV1";

import QRCode from "qrcode.react";
const FileItem = (props) => {
  return (
    <Box
      sx={{
        display: "flex",
        columnGap: (theme) => theme.spacing(2),
      }}
    >
      <Typography
        component="div"
        sx={{
          fontWeight: 500,
          fontSize: "15px",
        }}
      >
        {props.title}
      </Typography>
      <Typography
        component="div"
        sx={{
          fontSize: "15px",
        }}
      >
        {props.content}
      </Typography>
    </Box>
  );
};

const ContainerTextField = styled(Box)({
  display: "flex",
});

const TextFieldItem = styled(TextField)({
  width: "80%",
  paddingRight: "20px",
});
const ButtonItem = styled(Button)({
  borderRadius: "6px",
});

function DialogQRCode(props) {
  const isMobile = useMediaQuery("(max-width:600px)");
  const { envent } = props;
  const [progress, setProgress] = React.useState(0);
  const [status, setStatus] = useState(null);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) =>
        prevProgress > 100 ? 100 : prevProgress + 5
      );
    }, 100);

    return () => {
      clearInterval(timer);
    };
  }, []);
  if (status && progress > 80) {
    envent("sendQRcode", props.data);
  }
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

  return (
    <div>
      <DialogV1
        {...props}
        dialogProps={{
          PaperProps: {
            sx: {
              overflowY: "initial",
              width: "100%",
            },
          },
        }}
        dialogContentProps={{
          sx: {
            backgroundColor: "white !important",
            borderRadius: "6px",
            padding: (theme) => `${theme.spacing(8)} ${theme.spacing(6)}`,
          },
        }}
      >
        {progress < 100 ? (
          <Box>
            <Skeleton sx={{ mb: 3 }} width={150} />
            <Skeleton sx={{ mb: 1 }} width={250} />
            <Skeleton sx={{ mb: 1 }} width={150} />
            <Skeleton sx={{ mb: 1 }} width={280} />
            <Skeleton sx={{ mt: 3, mb: 3 }} width={50} />
            <Skeleton
              sx={{ mt: 3 }}
              variant="rectangular"
              width={150}
              height={150}
            />
            <Skeleton sx={{ ml: 3 }} width={110} height={60} />
            &nbsp;
            <Skeleton width={180} />
            <Box
              sx={{
                display: "flex",
                width: "90%",
                justifyContent: "space-between",
              }}
            >
              <Skeleton
                sx={{ paddingRight: "20px" }}
                variant="rounded"
                width="80%"
                height={40}
              />
              <Skeleton variant="rounded" width="16%" height={40} />
            </Box>
          </Box>
        ) : (
          <Box>
            <Typography
              component="div"
              sx={{
                color: (theme) => theme.palette.primaryTheme.brown(0.5),
                mb: 3,
              }}
            >
              QR CODE DETAILS
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                rowGap: "6px",
              }}
            >
              <FileItem
                title="ID Card Or Passport:"
                content={props.data.firstName}
              />
              <FileItem title="Username:" content={props.data.username} />
              <FileItem title="Email:" content={props.data.email} />
            </Box>
            <Box sx={{ mt: 4, mb: 5 }}>
              <Box sx={{ mb: 3 }}>
                <FileItem title="QR Code" sx={{ mb: 3 }} />
              </Box>
              <QRCode
                id="qr-code-canvas"
                value={props?.data?.otpQRcode}
                size={isMobile ? 100 : 150}
                level="H"
                fgColor="#000000"
                bgColor="#FFFFFF"
                renderAs="canvas"
              />
              <Box sx={{ display: "flex", mt: 3 }}>
                <ButtonItem
                  sx={{ ml: 3 }}
                  variant="contained"
                  color="primaryTheme"
                  onClick={downloadQR}
                >
                  Download QR
                </ButtonItem>
              </Box>
              <Box sx={{ marginTop: "2rem" }}>
                <InputLabel
                  sx={{
                    color: (theme) => theme.palette.primaryTheme.brown(1),
                  }}
                >
                  Share QR Code to email
                </InputLabel>
                <ContainerTextField>
                  <TextFieldItem
                    size="small"
                    placeholder="example@gmail.com"
                    value={props.data.email}
                  />
                  <ButtonItem
                    variant="contained"
                    color="primaryTheme"
                    onClick={() => {
                      setProgress(0);
                      setStatus("send");
                    }}
                  >
                    Send
                  </ButtonItem>
                </ContainerTextField>
              </Box>
            </Box>
          </Box>
        )}
      </DialogV1>
    </div>
  );
}

export default DialogQRCode;
