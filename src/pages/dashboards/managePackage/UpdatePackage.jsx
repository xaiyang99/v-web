import { useLazyQuery, useMutation } from "@apollo/client";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import {
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
} from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import { Formik } from "formik";
import PropTypes from "prop-types";
import * as React from "react";
import { BiEdit } from "react-icons/bi";
import { errorMessage, successMessage } from "../../../components/Alerts";
import { QUERY_FEATURES_PACKAGE_LIST, UPDATE_PACKAGE } from "./apollo";
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));
const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: theme.palette.mode === "dark" ? "#2ECA45" : "#65C466",
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color:
        theme.palette.mode === "light"
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 22,
    height: 22,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
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

export default function UpdatePackage({ data, refresh }) {
  const [getData, setGetData] = React.useState([]);
  const [listData, { data: isData }] = useLazyQuery(
    QUERY_FEATURES_PACKAGE_LIST,
    {
      fetchPolicy: "cache-and-network",
    }
  );
  const [open, setOpen] = React.useState(false);
  const [openSelect, setOpenSelect] = React.useState(false);
  const [getSelect, setGetSelect] = React.useState(data?.status);
  const [updatePackage] = useMutation(UPDATE_PACKAGE);
  const idFeaturePackage = data?.idFeaturePackage;
  const defaultSelectedIds = idFeaturePackage.map((feature) => feature._id);
  const [selectedIds, setSelectedIds] = React.useState(defaultSelectedIds);
  React.useEffect(() => {
    listData({
      variables: {
        where: { status: "active" },
      },
    });
    if (isData) {
      setGetData(isData?.featurpackage?.data);
    }
  }, [isData]);
  React.useEffect(() => {
    if (defaultSelectedIds) {
      setSelectedIds(defaultSelectedIds);
    }
  }, [idFeaturePackage]);
  const handleSwitchChange = (event, item) => {
    if (event.target.checked) {
      setSelectedIds((prevSelectedIds) => [...prevSelectedIds, item._id]);
    } else {
      setSelectedIds((prevSelectedIds) =>
        prevSelectedIds.filter((id) => id !== item._id)
      );
    }
  };
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setSelectedIds(defaultSelectedIds);
  };
  const handleSelecClose = () => {
    setOpenSelect(false);
  };
  const handleOpen = () => {
    setOpenSelect(true);
  };
  return (
    <Formik
      initialValues={{
        title: data?.title || "",
        subtitle: data?.subtitle || "",
        price: data?.price || 0,
        detail: data?.detail || "",
      }}
      enableReinitialize={true}
      validate={(values) => {
        const errors = {};
        if (!values?.title) errors.title = "Please enter the title again!";
        if (!values?.subtitle)
          errors.subtitle = "Please enter the subtitle again!";
        if (values?.price === "")
          errors.price = "Please enter the price again!";
        if (!values?.detail) errors.detail = "Please enter the detail again!";
        if (selectedIds.length <= 0)
          errors.featurepackage = "Please add the feature package again!";
        return errors;
      }}
      onSubmit={async (values, { resetForm }) => {
        try {
          let _addPackage = await updatePackage({
            variables: {
              data: {
                title: String(values.title),
                subtitle: String(values.subtitle),
                status: String(getSelect),
                price: parseInt(values.price ? values.price : 0),
                detail: String(values.detail),
                idFeaturePackage: selectedIds.length > 0 ? selectedIds : [],
              },
              where: {
                _id: data?._id,
              },
            },
          });
          if (_addPackage) {
            resetForm();
            refresh();
            handleClose();
            successMessage("Update package successfully", 3000);
          }
        } catch (error) {
          errorMessage("Update package Failed try again!!", 3000);
        }
      }}
    >
      {({ values, errors, handleChange, handleSubmit }) => (
        <div>
          <Button onClick={handleClickOpen}>
            <BiEdit size="22px" color="grey" />
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
                <EditIcon />
                Update Package
              </div>
            </BootstrapDialogTitle>
            <DialogContent dividers>
              <form onSubmit={handleSubmit} style={{ padding: "25px" }}>
                <TextField
                  label={errors.title ? errors.title : "Title"}
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
                  label={errors.subtitle ? errors.subtitle : "subTitle"}
                  size="small"
                  name="subtitle"
                  fullWidth={true}
                  onChange={handleChange}
                  value={values.subtitle}
                  error={errors.subtitle ? true : false}
                />
                <br />
                <br />
                <InputLabel id="demo-controlled-open-select-label">
                  status
                </InputLabel>
                <Select
                  labelId="demo-controlled-open-select-label"
                  id="demo-controlled-open-select"
                  fullWidth={true}
                  open={openSelect}
                  onClose={handleSelecClose}
                  onOpen={handleOpen}
                  value={getSelect}
                  label="status"
                  onChange={(e) => setGetSelect(e.target.value)}
                >
                  <MenuItem value="active">active</MenuItem>
                  <MenuItem value="disabled">disabled</MenuItem>
                  <MenuItem value="deleted">deleted</MenuItem>
                </Select>
                <br />
                <br />
                <TextField
                  label={errors.price ? errors.price : "Price"}
                  type="number"
                  size="small"
                  name="price"
                  fullWidth={true}
                  onChange={handleChange}
                  value={values.price ? values.price : 0}
                  error={errors.price ? true : false}
                />
                <br />
                <br />
                <TextField
                  label={errors.detail ? errors.detail : "Detail"}
                  size="small"
                  name="detail"
                  fullWidth={true}
                  multiline
                  rows={4}
                  onChange={handleChange}
                  value={values.detail}
                  error={errors.detail ? true : false}
                />
                <br />
                <br />
                <h3>Add Package Feature</h3>
                <h4 style={{ color: "red" }}>
                  {selectedIds.length <= 0
                    ? "Please add the package feature  again!"
                    : null}
                </h4>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                  }}
                >
                  {getData?.map((item, index) => (
                    <React.Fragment key={index}>
                      <FormControlLabel
                        control={
                          <IOSSwitch
                            sx={{ m: 3 }}
                            checked={selectedIds.includes(item._id)}
                          />
                        }
                        onChange={(event) => handleSwitchChange(event, item)}
                        label={item?.title}
                      />
                    </React.Fragment>
                  ))}
                </div>
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
