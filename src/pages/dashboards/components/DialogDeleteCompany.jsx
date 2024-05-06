import React from "react";
import {
  Button,
  DialogActions,
  DialogContent,
  Typography,
} from "@mui/material";
import DialogV1 from "../../../components/DialogV1";
import { useTranslation } from "react-i18next";

function DialogDelete(props) {
  const { t } = useTranslation();
  const { onClose, title, onClick } = props;
  return (
    <React.Fragment>
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
            padding: (theme) => `${theme.spacing(3)}`,
          },
        }}
      >
        <DialogContent>
          <Typography
            variant="h4"
            sx={{
              mb: 2,
              color: "#5D596C",
              fontSize: "1rem",
              fontWeight: "bold",
            }}
          >
            {t("_delete_title")}
          </Typography>
          <Typography variant="h5" sx={{ mb: 3, fontSize: "0.9rem" }}>
            {title}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ mb: 3, mr: 3 }}>
          <Button
            onClick={onClose}
            variant="contained"
            color="error"
            sx={{ borderRadius: "6px" }}
          >
            {t("_cancel_button")}
          </Button>
          <Button
            type="button"
            variant="contained"
            color="primaryTheme"
            sx={{ borderRadius: "6px" }}
            onClick={onClick}
          >
            {t("_delete_button")}
          </Button>
        </DialogActions>
      </DialogV1>
    </React.Fragment>
  );
}

export default DialogDelete;
