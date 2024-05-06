import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { LoadingButton } from "@mui/lab";

function DialogDeleteLoading(props) {
  const { t } = useTranslation();
  const { open, onClose, title, onClick, statusLoading } = props;
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(false);
  }, [statusLoading]);
  return (
    <div>
      <Dialog
        open={open}
        onClose={onClose}
        sx={{
          backdropFilter: "blur(1px) sepia(5%)",
          "& .MuiDialog-paper": {
            borderRadius: "8px",
          },
        }}
      >
        <Box sx={{ minWidth: "350px", mt: 2 }}>
          <DialogContent>
            <Typography variant="h5" sx={{ mb: 3 }}>
              {title}
            </Typography>
          </DialogContent>
          <DialogActions sx={{ mb: 3, mr: 3, justifyContent: "center" }}>
            <Button
              onClick={onClose}
              variant="contained"
              color="error"
              sx={{ borderRadius: "6px" }}
            >
              {t("_cancel_button")}
            </Button>
            <LoadingButton
              size="medium"
              color="primaryTheme"
              onClick={() => {
                onClick();
                setLoading(true);
              }}
              loading={loading}
              variant="contained"
            >
              <span>{t("_delete_button")}</span>
            </LoadingButton>
          </DialogActions>
        </Box>
      </Dialog>
    </div>
  );
}

export default DialogDeleteLoading;
