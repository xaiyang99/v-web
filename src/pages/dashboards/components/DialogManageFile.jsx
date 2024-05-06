import React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  FormControlLabel,
  FormLabel,
  RadioGroup,
} from "@mui/material";
import Radio from "@mui/material/Radio";

function DialogManageFile(props) {
  const { open, onClose, onClick, status, setStatus } = props;

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
        <Box sx={{ width: "350px" }}>
          <DialogContent>
            <FormControl>
              <FormLabel
                id="demo-row-radio-buttons-group-label"
                sx={{ mt: 2, mb: 3 }}
              >
                Status
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
              >
                <FormControlLabel
                  value="active"
                  control={<Radio />}
                  label="active"
                  checked={status === "active"}
                  onChange={(e) => setStatus(e.target.value)}
                />

                <FormControlLabel
                  value="deleted"
                  control={<Radio />}
                  label="deleted"
                  checked={status === "deleted"}
                  onChange={(e) => setStatus(e.target.value)}
                />
              </RadioGroup>
            </FormControl>
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
              onClick={onClick}
              sx={{ borderRadius: "6px" }}
            >
              Save Change
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </div>
  );
}

export default DialogManageFile;
