import { useMutation } from "@apollo/client";
import axios from "axios";
import React, { useState } from "react";
import {
  DELETE_FILE,
  DELETE_FOLDER,
  RESTORE_FILE,
  RESTORE_FOLDER,
} from "./apollo";

// material ui components
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
} from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { createTheme } from "@mui/material/styles";
import { FileIcon, defaultStyles } from "react-file-icon";

// material ui icons
import DeleteForeverIcon from "@mui/icons-material/Delete";
import FolderIcon from "@mui/icons-material/Folder";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import RestoreIcon from "@mui/icons-material/Restore";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

// components
import { errorMessage, successMessage } from "../../../components/Alerts";
import AlertDialog from "../../../components/deleteDialog";
import { GetFileType, truncateName } from "../../../functions";
import useAuth from "../../../hooks/useAuth";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});
function ItemCard(props) {
  const { user } = useAuth();
  const theme = createTheme();
  const name = props?.name;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openDropdown = Boolean(anchorEl);
  const [restoreFolder] = useMutation(RESTORE_FOLDER);
  const [restoreFile] = useMutation(RESTORE_FILE);
  const [deleteFolder] = useMutation(DELETE_FOLDER);
  const [focus, setFocus] = useState(Boolean(false));
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseDropdown = () => {
    setAnchorEl(null);
  };

  const [open, setOpen] = useState(false);
  const [deleteFileFromDB] = useMutation(DELETE_FILE);

  // dialog Alert
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const handleDialogClose = (value) => {
    setDialogOpen(value);
  };

  // Dialog restore
  const HanldeRemove = () => {
    setOpen(true);
    setFocus(true);
  };
  const HanldeRemoveClose = () => {
    setOpen(false);
  };
  // handle delete file from bunny
  const handleDeleteFileFromBunny = () => {
    let real_path;
    if (props.path == "main") {
      real_path = "";
    } else {
      real_path = truncateName(props.path);
    }
    const options = {
      method: "DELETE",
      url:
        "https://sg.storage.bunnycdn.com/vshare/" +
        user.username +
        "/" +
        real_path +
        props.newName,
      headers: { AccessKey: "6ebfab2b-3abc-441e-bdd8a3941153-41a3-49d3" },
    };

    axios
      .request(options)
      .then(function (response) {
        successMessage(`Deleted ${props?.name} successfull`, 3000);
        props?.folderRefetch();
      })
      .catch(function (error) {
        console.error(error);
        errorMessage("Deleted failed!", 2000);
      });
  };

  // handle delete
  const handleDelete = async () => {
    handleCloseDropdown();
    setDialogOpen(false);
    if (props?.checkTypeItem === "folder") {
      const removeFolder = await deleteFolder({
        variables: {
          where: {
            _id: props?.id,
          },
        },
      });
      if (removeFolder) {
        successMessage(`Folder delete ${props?.name} successful`, 3000);
        handleCloseDropdown();
        props?.folderRefetch();
      }
    } else {
      try {
        let deleteFile = await deleteFileFromDB({
          variables: {
            where: {
              _id: props.id,
            },
          },
        });

        if (deleteFile?.data?.deleteFiles?._id) {
          handleDeleteFileFromBunny();
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const restoreHandle = async () => {
    try {
      if (props?.checkTypeItem === "folder") {
        const restoreFolderActive = await restoreFolder({
          variables: {
            data: {
              status: "active",
            },
            where: {
              _id: props?.id,
            },
          },
        });
        if (restoreFolderActive) {
          successMessage(`Restore ${props?.name} successfull`, 3000);
          props?.folderRefetch();
          handleCloseDropdown();
        }
      } else {
        const restoreFileActive = await restoreFile({
          variables: {
            data: {
              status: "active",
            },
            where: { _id: props?.id },
          },
        });
        if (restoreFileActive?.data?.updateFiles?._id) {
          handleCloseDropdown();
          setOpen(false);
          successMessage(`Restore ${props?.name} successfull`, 3000);
          props?.folderRefetch();
        }
      }
    } catch (error) {
      console.error(error);
      errorMessage(`Restore ${props?.name} failed`, 3000);
    }
  };
  const onMouseOver = () => {
    setFocus(false);
  };
  const onMouseFocus = () => {
    setFocus(true);
  };

  return (
    <>
      <Card
        sx={{
          minWidth: 150,
          margin: "1rem 0",
          background: "#EEF7F6",
          border: "2px solid #CDE7E4",
        }}
      >
        <CardContent onDoubleClick={HanldeRemove}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {props?.checkTypeItem === "folder" ? (
              <Typography
                variant="p"
                mt={2}
                sx={{
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  [theme.breakpoints.down("sm")]: {
                    maxWidth: "100px",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  },
                }}
              >
                {props?.name}
              </Typography>
            ) : (
              <Typography
                variant="p"
                mt={2}
                sx={{
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  [theme.breakpoints.down("sm")]: {
                    maxWidth: "100px",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  },
                }}
              >
                {props.name}
              </Typography>
            )}

            <MoreVertIcon
              id="basic-button"
              aria-controls={openDropdown ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={openDropdown ? "true" : undefined}
              onClick={handleClick}
              sx={{ cursor: "pointer" }}
            />
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={openDropdown}
              onClose={handleCloseDropdown}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                  mt: 1.5,
                  width: 200,
                  "& .MuiAvatar-root": {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 50,
                  },
                  "&:before": {
                    content: "''",
                    display: "block",
                    position: "absolute",
                    top: 1,
                    right: 5,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              sx={{ zIndex: "99999999999999999" }}
            >
              <MenuItem
                onClick={(e) => {
                  setDialogOpen(true);
                  handleCloseDropdown();
                }}
                sx={{ fontSize: "16px" }}
              >
                <DeleteForeverIcon />
                &nbsp;Delete
              </MenuItem>
              <MenuItem onClick={restoreHandle} sx={{ fontSize: "16px" }}>
                <RestoreIcon />
                &nbsp;Restore
              </MenuItem>
            </Menu>
          </Box>
          <Box
            sx={{
              textAlign: "center",
              marginTop: "0.5rem",
              display: "flex",
              justifyContent: "center",
            }}
          >
            {props?.checkTypeItem === "folder" ? (
              <FolderIcon sx={{ fontSize: "7rem", color: "#2F998B" }} />
            ) : (
              <Box
                style={{
                  width: "100px",
                  display: "flex",
                  height: "90px",
                  margin: "10px",
                }}
              >
                <FileIcon
                  extension={GetFileType(name)}
                  {...defaultStyles[GetFileType(name)]}
                />
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>
      <AlertDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onClick={handleDelete}
        title="Delete this item?"
        message={"If you click okay " + props.name + " will be deleted?"}
      />

      {/* Dialog Restore  */}
      <Dialog
        disableEnforceFocus={true}
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={HanldeRemoveClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle sx={{ mt: 2 }}>
          {`Your ${props?.checkTypeItem} is in trash`}&nbsp;
        </DialogTitle>
        <DialogContent style={{ fontWeight: "bold" }}>
          {`You must restore ${props?.checkTypeItem}`} ?
        </DialogContent>

        <DialogActions sx={{ mb: 2 }}>
          {focus ? (
            <Button
              sx={{
                borderRadius: "20px",
                padding: "8px 15px",
                textTransform: "capitalize",
              }}
              onClick={HanldeRemoveClose}
              onMouseOver={onMouseOver}
            >
              Cancel
            </Button>
          ) : (
            <Button
              variant="outlined"
              sx={{
                borderRadius: "20px",
                padding: "8px 15px",
                textTransform: "capitalize",
              }}
              onClick={HanldeRemoveClose}
              onMouseOver={onMouseOver}
            >
              Cancel
            </Button>
          )}

          {focus ? (
            <Button
              variant="outlined"
              sx={{
                borderRadius: "20px",
                padding: "8px 15px",
                textTransform: "capitalize",
              }}
              onClick={restoreHandle}
            >
              Restore
            </Button>
          ) : (
            <Button
              sx={{
                borderRadius: "20px",
                padding: "8px 15px",
                textTransform: "capitalize",
              }}
              onClick={restoreHandle}
              onMouseOver={onMouseFocus}
            >
              Restore
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ItemCard;
