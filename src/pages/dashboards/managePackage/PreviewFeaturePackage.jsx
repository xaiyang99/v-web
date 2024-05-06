import * as React from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ReorderIcon from "@mui/icons-material/Reorder";
import {
  Box,
  Chip,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import moment from "moment";
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
export default function PreviewFeaturePackage({ data }) {
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <div>
      <Button onClick={handleClickOpen}>
        <VisibilityIcon size="18px" color="grey" />
      </Button>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        fullWidth={true}
        maxWidth="md"
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
            <ReorderIcon />
            List data feature in package: {data?.title ? data?.title : "..."}
          </div>
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Box
            style={{
              width: "100%",
            }}
          >
            <TableContainer component={Paper}>
              <Table
                sx={{ minWidth: 650 }}
                size="medium"
                aria-label="a dense table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell align="left">Title</TableCell>
                    <TableCell align="left">Sub title</TableCell>
                    <TableCell align="left">Detail</TableCell>
                    <TableCell align="center">Status</TableCell>
                    <TableCell align="center">Created date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.idFeaturePackage?.length > 0 ? (
                    <>
                      {data?.idFeaturePackage?.map((item, index) => {
                        return (
                          <TableRow
                            key={index}
                            sx={{
                              "&:last-child td, &:last-child th": {
                                border: 0,
                              },
                            }}
                          >
                            <TableCell component="th" scope="row">
                              {index + 1}
                            </TableCell>
                            <TableCell align="left">{item?.title}</TableCell>
                            <TableCell align="left">{item?.subtitle}</TableCell>
                            <TableCell
                              align="left"
                              style={{
                                overflowWrap: "break-word",
                                maxWidth: "100px",
                              }}
                            >
                              {item?.detial}
                            </TableCell>
                            <TableCell align="center">
                              {item?.status === "active" ? (
                                <>
                                  <div style={{ color: "green" }}>
                                    <Chip
                                      sx={{
                                        backgroundColor: "#dcf6e8",
                                        color: "#29c770",
                                      }}
                                      label={item?.status}
                                      size="small"
                                    />
                                  </div>
                                </>
                              ) : item?.status === "disabled" ? (
                                <>
                                  <div>
                                    <Chip
                                      sx={{
                                        backgroundColor: "#ffefe1",
                                        color: "#ffa44f",
                                      }}
                                      label={item?.status}
                                      color="error"
                                      size="small"
                                    />
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div>
                                    <Chip
                                      sx={{
                                        backgroundColor: "#ffcdd2",
                                        color: "#e53935",
                                      }}
                                      label={item?.status}
                                      color="primary"
                                      size="small"
                                    />
                                  </div>
                                </>
                              )}
                            </TableCell>
                            <TableCell align="center">
                              {moment(item?.createdAt).format("D-MM-YYYY")}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </>
                  ) : (
                    <>
                      <TableRow>
                        <TableCell
                          component="th"
                          align="center"
                          colSpan={10}
                          scope="row"
                        >
                          Data is Empty
                        </TableCell>
                      </TableRow>
                    </>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </DialogContent>
      </BootstrapDialog>
    </div>
  );
}
