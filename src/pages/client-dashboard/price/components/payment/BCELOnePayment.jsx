import { Typography, useMediaQuery, useTheme } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useRef } from "react";
import NormalButton from "../../../../../components/NormalButton";

const BCELOnePaymentContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  rowGap: 12,
});

const BCELOnePayment = (props) => {
  const theme = useTheme();
  const qrCodeRef = useRef(null);
  const isMobile = useMediaQuery("(max-width:900px)");

  const handleDownloadQrCode = () => {
    const img = qrCodeRef.current;

    img.crossOrigin = "anonymous";

    fetch(img.src, { mode: "cors" })
      .then((response) => response.blob())
      .then((blob) => {
        const dataUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = "qr_code.png";
        link.click();
        URL.revokeObjectURL(dataUrl);
      });
  };

  return (
    <BCELOnePaymentContainer>
      <Typography component="div">QR Code (BCEL One Bank)</Typography>
      {isMobile ? (
        <>
          {props.link && (
            <Typography
              component="a"
              sx={{
                width: "max-content",
                fontSize: theme.spacing(4),
                fontWeight: 600,
              }}
              href={props.link}
            >
              Payment link
            </Typography>
          )}
        </>
      ) : (
        <>
          {props.qrCode && (
            <>
              <Typography
                component="img"
                src={props.qrCode}
                width={"25%"}
                ref={qrCodeRef}
                sx={{
                  boxShadow: "rgba(0, 0, 0, 0.09) 0px 3px 12px",
                }}
              />
              <NormalButton
                onClick={handleDownloadQrCode}
                sx={{
                  fontWeight: 600,
                  width: "max-content",
                  margin: (theme) => `${theme.spacing(2)} ${theme.spacing(4)}`,
                  borderRadius: (theme) => theme.spacing(1),
                  color: (theme) => theme.palette.primaryTheme.main,
                }}
              >
                Download an image
              </NormalButton>
            </>
          )}
        </>
      )}

      <Typography component="div">Account number</Typography>
      <Typography
        component="div"
        sx={{
          width: "max-content",
          padding: (theme) => `${theme.spacing(1)} ${theme.spacing(6)}`,
          border: "1px solid",
          borderColor: (theme) => theme.palette.primaryTheme.brown(0.2),
          borderRadius: (theme) => theme.spacing(1),
        }}
      >
        1122 2255 8899 6633
      </Typography>
    </BCELOnePaymentContainer>
  );
};

export default BCELOnePayment;
