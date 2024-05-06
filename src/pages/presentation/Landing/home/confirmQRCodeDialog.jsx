import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import CryptoJS from "crypto-js";
import React, { Fragment, useState } from "react";
import { errorMessage } from "../../../../components/Alerts";
import { cutFileName } from "../../../../utils/limitTextLenght";
import { CutfileName } from "../../../../functions";

function ConfirmQRCodeDialog(props) {
  const {
    isOpen,
    dataPassword,
    // dataValue,
    filename,
    newFilename,
    onConfirm,
    onClose,
  } = props;
  const isMobile = useMediaQuery("(max-width: 600px)");
  const [textPassword, setTextPassword] = useState("");

  const handleClose = () => {
    setTextPassword("");
    onClose();
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();

    const modifyPassword = CryptoJS.MD5(textPassword).toString();

    if (dataPassword === modifyPassword) {
      onConfirm();
      handleClose();
    } else {
      errorMessage("Invalid password", 2000);
    }
  };

  return (
    <Fragment>
      <Dialog open={isOpen}>
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            variant=""
            sx={{
              fontSize: isMobile ? "0.9rem" : "1.2rem",
            }}
          >
            Confirm password
          </Typography>
        </DialogTitle>

        <DialogContent>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              padding: "20px 30px !important",
              maxWidth: "600px",
            }}
          >
            <Typography
              variant=""
              sx={{
                fontSize: isMobile ? "0.8rem" : "0.9rem",
                textAlign: "center",
              }}
            >
              Please enter your password for: <br />{" "}
              <span style={{ color: "#17766B" }}>
                {cutFileName(
                  CutfileName(filename || "", newFilename || ""),
                  10,
                )}
              </span>
            </Typography>
          </Box>
          <form onSubmit={handleSubmit}>
            <TextField
              size="small"
              type="password"
              label="Password"
              variant="standard"
              fullWidth={true}
              onChange={(e) => setTextPassword(e.target.value)}
              value={textPassword}
            />

            <Box
              sx={{
                marginTop: 5,
                display: "flex",
                justifyContent: "flex-end",
                gap: 3,
              }}
            >
              <Button
                type="button"
                variant="contained"
                color="error"
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={!textPassword ? true : false}
              >
                Save
              </Button>
            </Box>
          </form>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
}

export default ConfirmQRCodeDialog;
