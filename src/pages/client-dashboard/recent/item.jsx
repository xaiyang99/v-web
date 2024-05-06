import React from "react";

// material ui components
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

// material ui icons
import DeleteForeverSharpIcon from "@mui/icons-material/DeleteForeverSharp";
import DownloadIcon from "@mui/icons-material/Download";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import InsertLinkIcon from "@mui/icons-material/InsertLink";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PersonAdd from "@mui/icons-material/PersonAdd";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import StarPurple500Icon from "@mui/icons-material/StarPurple500";
import { Box } from "@mui/material";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { FileIcon, defaultStyles } from "react-file-icon";

import { useMutation } from "@apollo/client";
import { errorMessage, successMessage } from "../../../components/Alerts";
import AlertDialog from "../../../components/deleteDialog";
import FormDialog from "../../../components/formDialog";
import { GetFileType, truncateFileName } from "../../../functions";
import useAuth from "../../../hooks/useAuth";
import {
  MUTATION_ACTION_FILE,
  MUTATION_DELETE_RECENT_FILE,
  MUTATION_UPDATE_RECENT_FILE,
} from "./apollo";

function ItemCard(props) {
  const { user } = useAuth();
  const [id, setId] = React.useState(0);
  const [name, setName] = React.useState("");
  const [newName, setNewName] = React.useState("");
  const [formDialogOpen, setFormDialogOpen] = React.useState(false);
  const [deleteRecentFile] = useMutation(MUTATION_DELETE_RECENT_FILE);
  const [updateFile] = useMutation(MUTATION_UPDATE_RECENT_FILE);
  const [fileAction] = useMutation(MUTATION_ACTION_FILE);
  const handleFormDialogClose = (value) => {
    setFormDialogOpen(value);
  };

  //dropdown
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openDropdown = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseDropdown = () => {
    setAnchorEl(null);
  };

  // dialog Alert
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const handleDialogClose = (value) => {
    setDialogOpen(value);
  };

  const handleDeleteRecentFile = async (event) => {
    event.preventDefault();
    try {
      let deleteFile = await deleteRecentFile({
        variables: {
          where: {
            _id: id,
          },
          data: {
            status: "deleted",
            createdBy: user._id,
          },
        },
      });

      if (deleteFile?.data?.updateFiles?._id) {
        handleDialogClose();
        successMessage("Delete file successful!!", 2000);
        props?.refetch();
      }
    } catch (err) {
      errorMessage("Sorry! Something went wrong. Please try again!");
    }
  };

  const handleRenameFile = async (reName) => {
    try {
      let updateRecentFile = await updateFile({
        variables: {
          where: {
            _id: id,
          },
          data: {
            filename: reName,
            updatedBy: user._id,
          },
        },
      });
      if (updateRecentFile?.data?.updateFiles?._id) {
        handleActionFile();
        handleFormDialogClose();
        successMessage("Update File successfull", 2000);
      }
      props?.refetch();
    } catch (error) {
      errorMessage(
        "Sorry!!. Something went wrong. Please try again later!!",
        2000
      );
    }
  };

  // File action for count in recent file
  const handleActionFile = async () => {
    try {
      let action = await fileAction({
        variables: {
          fileInput: {
            createdBy: user._id,
            fileId: parseInt(id),
          },
        },
      });
      if (action?.data?.actionFiles == true) {
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card
      sx={{
        minWidth: 150,
        margin: "1rem 0",
        background: "#EEF7F6",
        border: "2px solid #CDE7E4",
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "start",
            }}
          >
            <Box
              sx={{
                width: "18px",
              }}
            >
              <FileIcon
                extension={GetFileType(props.name)}
                {...defaultStyles[GetFileType(props.name)]}
              />
            </Box>
            <Typography variant="h6" sx={{ fontSize: "14px" }} mx={2}>
              {truncateFileName(props.name)}
            </Typography>
          </Box>
          <MoreVertIcon
            id="basic-button"
            aria-controls={openDropdown ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={openDropdown ? "true" : undefined}
            onClick={(event) => {
              handleClick(event);
              setId(props.id);
              setName(props.name);
              setNewName(props.newFilename);
            }}
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
            <MenuItem>
              <ListItemIcon>
                <RemoveRedEyeIcon fontSize="small" />
              </ListItemIcon>
              Details
            </MenuItem>
            <MenuItem>
              <ListItemIcon>
                <PersonAdd fontSize="small" />
              </ListItemIcon>
              Share
            </MenuItem>
            <MenuItem>
              <ListItemIcon>
                <InsertLinkIcon fontSize="small" />
              </ListItemIcon>
              Get link
            </MenuItem>
            <MenuItem
              onClick={(event) => {
                setAnchorEl(null);
                setFormDialogOpen(true);
              }}
            >
              <ListItemIcon>
                <DriveFileRenameOutlineIcon fontSize="small" />
              </ListItemIcon>
              Rename
            </MenuItem>
            <MenuItem>
              <ListItemIcon>
                <StarPurple500Icon fontSize="small" />
              </ListItemIcon>
              Star message
            </MenuItem>
            <MenuItem>
              <ListItemIcon>
                <DownloadIcon fontSize="small" />
              </ListItemIcon>
              Download
            </MenuItem>
            <MenuItem
              onClick={() => {
                setAnchorEl(null);
                setDialogOpen(true);
              }}
            >
              <ListItemIcon>
                <DeleteForeverSharpIcon fontSize="small" />
              </ListItemIcon>
              Delete
            </MenuItem>
          </Menu>
        </Box>
        <Box sx={{ width: "100px", textAlign: "center" }} mt={2}>
          <FileIcon
            extension={GetFileType(props.name)}
            {...defaultStyles[GetFileType(props.name)]}
          />
        </Box>
      </CardContent>

      {dialogOpen !== undefined && (
        <AlertDialog
          open={dialogOpen}
          onClose={handleDialogClose}
          onClick={handleDeleteRecentFile}
          title="Delete this item?"
          message={"If you click okay " + name + " will be deleted?"}
        />
      )}

      <FormDialog
        open={formDialogOpen}
        onClose={handleFormDialogClose}
        OriginalName={name}
        newName=""
        onData={handleRenameFile}
      />
    </Card>
  );
}

export default ItemCard;
