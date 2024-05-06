import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import React from "react";

// mutation

export const DeleteFileStatus = (props) => {
  const { onClose, onClick, open, title, name } = props;

  return (
    <div>
      <Dialog
        open={open}
        keepMounted
        onClose={onClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle sx={{ mt: 2 }}>
          {title}&nbsp;
          <span style={{ fontWeight: "bold" }}>{name} ?</span>
        </DialogTitle>

        <DialogActions sx={{ mb: 2 }}>
          <Button
            sx={{
              borderRadius: "20px",
              padding: "8px 15px",
              textTransform: "capitalize",
            }}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            color="error"
            sx={{
              borderRadius: "20px",
              padding: "8px 15px",
              textTransform: "capitalize",
            }}
            onClick={onClick}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
