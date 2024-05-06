import React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
} from "@mui/material";

function DialogDelete(props) {
  const { open, onClose, title, onClick } = props;
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
          <DialogActions sx={{ mb: 3, mr: 3 }}>
            <Button
              onClick={onClose}
              variant="contained"
              color="error"
              sx={{ borderRadius: "6px" }}
            >
              Close
            </Button>
            <Button
              type="button"
              variant="contained"
              color="primaryTheme"
              sx={{ borderRadius: "6px" }}
              onClick={onClick}
            >
              Delete
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </div>
  );
}

export default DialogDelete;
