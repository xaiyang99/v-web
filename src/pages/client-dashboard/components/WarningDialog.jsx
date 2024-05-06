import * as React from "react";
import * as Mui from "../css/fileDropStyle";

// component and functions
import DialogV1 from "../../../components/DialogV1";

//mui component and style
import { styled as muiStyled } from "@mui/system";
import { Typography } from "@mui/material";

const DialogPreviewFileV1Boby = muiStyled("div")(({ theme }) => ({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  rowGap: theme.spacing(3),
  "& .MuiDialogActions-root": {
    display: "none",
  },
}));

const DialogPreviewQRcode = (props) => {
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
        <Mui.FiledropContainer>
          <Mui.ShowHeaderDetail>
            <Typography variant="h3">{props.title}</Typography>
            <Typography variant="h6">{props.description}</Typography>
          </Mui.ShowHeaderDetail>
        </Mui.FiledropContainer>
      </DialogPreviewFileV1Boby>
    </DialogV1>
  );
};

export default DialogPreviewQRcode;
