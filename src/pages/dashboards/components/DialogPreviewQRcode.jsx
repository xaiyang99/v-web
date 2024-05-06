import React from "react";

//mui component and style
import { styled as muiStyled } from "@mui/system";
import DialogV1 from "../../../components/DialogV1";
import QRCode from "react-qr-code";
import { Box, Button } from "@mui/material";
import { getNameFromUrl } from "../../../functions";
import * as htmlToImage from "html-to-image";

const DialogPreviewFileV1Boby = muiStyled("div")(({ theme }) => ({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  rowGap: theme.spacing(3),
}));

const DialogPreviewQRcode = (props) => {
  const items = props?.data;
  const name = getNameFromUrl(items);
  const ref = React.useRef();

  const downloadQRcodeAsImage = () => {
    const element = ref.current;
    const style = `
    font-size: 24px;
    background-color: white;
    color: black;
    padding: 2rem;
  `;
    element.style = style;

    htmlToImage.toPng(element, { inlineCSS: false }).then((dataUrl) => {
      const link = document.createElement("a");
      link.download = name;
      link.href = dataUrl;
      link.click();
    });
  };

  return (
    <DialogV1
      {...props}
      dialogProps={{
        PaperProps: {
          sx: {
            overflowY: "initial",
            maxWidth: "500px",
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
      <DialogPreviewFileV1Boby>
        <Box sx={{ textAlign: "center" }}>
          <h3 style={{ color: "#4B465C" }}>
            Your QR code has been generated successfully!!
          </h3>
          <Box ref={ref}>
            <QRCode
              id="qr-code-canvas"
              value={items}
              size={200}
              level="H"
              fgColor="#000000"
              bgColor="#FFFFFF"
              renderas="canvas"
            />
          </Box>
          <Button
            sx={{
              background: "#ffffff",
              color: "#17766B",
              fontSize: "14px",
              padding: "2px 10px",
              borderRadius: "20px",
              border: "1px solid #17766B",
              "&:hover": {
                border: "1px solid #17766B",
                color: "#17766B",
              },
              margin: "1rem 0",
            }}
            onClick={downloadQRcodeAsImage}
          >
            Download QR
          </Button>
        </Box>
      </DialogPreviewFileV1Boby>
    </DialogV1>
  );
};

export default DialogPreviewQRcode;
