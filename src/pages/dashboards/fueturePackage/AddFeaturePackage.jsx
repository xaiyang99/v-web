import { useMutation } from "@apollo/client";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import { TextField } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import { Formik } from "formik";
import PropTypes from "prop-types";
import * as React from "react";
import { errorMessage, successMessage } from "../../../components/Alerts";
import { CREATE_FEATURE_PACKAGE } from "./apollo";
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export default function AddFeaturePackage({ refresh }) {
  const [open, setOpen] = React.useState(false);
  const [createFeaturePackage] = useMutation(CREATE_FEATURE_PACKAGE);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Formik
      initialValues={{
        title: "",
        subtitle: "",
        detial: "",
      }}
      enableReinitialize={false}
      validate={(values) => {
        const errors = {};
        if (!values?.title) errors.title = "Please enter the title again!";
        if (!values?.subtitle)
          errors.subtitle = "Please enter the sub title again!";
        if (!values?.detial) errors.detial = "Please enter the detail again!";
        return errors;
      }}
      onSubmit={async (values, { resetForm }) => {
        try {
          let _addPackage = await createFeaturePackage({
            variables: {
              data: {
                title: String(values.title),
                subtitle: String(values.subtitle),
                detial: String(values.detial),
              },
            },
          });
          if (_addPackage) {
            resetForm();
            refresh();
            handleClose();
            successMessage("Created feature package successfully", 3000);
          }
        } catch (error) {
          errorMessage("Create feature package Failed try again!!", 3000);
        }
      }}
    >
      {({ values, errors, handleChange, handleSubmit }) => (
        <div>
          <Button
            variant={"contained"}
            color="primaryTheme"
            startIcon={<AddIcon />}
            onClick={handleClickOpen}
          >
            Add Package Feature
          </Button>
          <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={open}
            fullWidth={true}
            maxWidth="sm"
            PaperProps={{
              style: {
                position: "absolute",
                top: 0,
              },
            }}
          >
            <BootstrapDialogTitle
              id="customized-dialog-title"
              onClose={handleClose}
            >
              <div
                style={{
                  display: "flex",
                  marginTop: "10px",
                }}
              >
                <AddIcon />
                Add Package Feature
              </div>
            </BootstrapDialogTitle>
            <DialogContent dividers>
              <form onSubmit={handleSubmit} style={{ padding: "25px" }}>
                <TextField
                  label={errors.title ? errors.title : "Title"}
                  type="text"
                  size="small"
                  name="title"
                  fullWidth={true}
                  onChange={handleChange}
                  value={values.title}
                  error={errors.title ? true : false}
                />
                <br />
                <br />
                <TextField
                  label={errors.subtitle ? errors.subtitle : "Sub title"}
                  type="text"
                  size="small"
                  name="subtitle"
                  fullWidth={true}
                  onChange={handleChange}
                  value={values.subtitle}
                  error={errors.subtitle ? true : false}
                />
                <br />
                <br />
                <TextField
                  label={errors.detial ? errors.detial : "Detail"}
                  size="small"
                  name="detial"
                  fullWidth={true}
                  multiline
                  rows={4}
                  onChange={handleChange}
                  value={values.detial}
                  error={errors.detial ? true : false}
                />
                <br />
              </form>
              <div
                style={{
                  display: "flex",
                  justifyContent: "right",
                  paddingRight: "25px",
                  paddingBottom: "30px",
                }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  color="error"
                  size="small"
                  startIcon={<CloseIcon />}
                  onClick={handleClose}
                >
                  Close
                </Button>
                &nbsp;
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={() => handleSubmit()}
                  startIcon={<SaveIcon />}
                >
                  Save
                </Button>
              </div>
            </DialogContent>
          </BootstrapDialog>
        </div>
      )}
    </Formik>
  );
}
