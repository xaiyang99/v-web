import React from "react";

//mui component and style
import { styled as muiStyled } from "@mui/system";
import { Typography, Box } from "@mui/material";
import DialogV1 from "../../../components/DialogV1";
import NormalButton from "../../../components/NormalButton";
import { useTranslation } from "react-i18next";

const FileDeleteDialogBoby = muiStyled("div")(({ theme }) => ({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  rowGap: theme.spacing(7),
}));

const DialogDeleteTicket = (props) => {
  const { t } = useTranslation();
  const { onClose, onConfirm } = props;

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
      <FileDeleteDialogBoby>
        <Typography
          variant="h4"
          sx={{
            width: "100%",
            display: "flex",
            fontWeight: "bold",
            color: (theme) => theme.palette.primaryTheme.brown(),
          }}
        >
          {props?.title ?? t("_delete_title")}
        </Typography>
        <Box
          sx={{
            display: "flex",
            rowGap: (theme) => theme.spacing(4),
          }}
        >
          {props?.label ? (
            <>
              <strong style={{ marginLeft: "8px" }}>{props.label}</strong>
            </>
          ) : (
            <></>
          )}
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            columnGap: (theme) => theme.spacing(3),
          }}
        >
          <Box
            sx={{
              display: "flex",
              columnGap: (theme) => theme.spacing(3),
            }}
          >
            <NormalButton
              onClick={() => onClose()}
              sx={{
                padding: (theme) => `${theme.spacing(2)} ${theme.spacing(4)}`,
                borderRadius: (theme) => theme.spacing(1),
                backgroundColor: "rgba(0,0,0,0.1)",
                color: "rgba(0,0,0,0.5)",
              }}
            >
              {t("_cancel_button")}
            </NormalButton>
            <NormalButton
              sx={{
                padding: (theme) => `${theme.spacing(2)} ${theme.spacing(4)}`,
                borderRadius: (theme) => theme.spacing(1),
                backgroundColor: (theme) => theme.palette.primaryTheme.main,
                color: "white !important",
              }}
              onClick={() => {
                onConfirm();
                onClose();
              }}
            >
              {t("_delete_button")}
            </NormalButton>
          </Box>
        </Box>
      </FileDeleteDialogBoby>
    </DialogV1>
  );
};

export default DialogDeleteTicket;
