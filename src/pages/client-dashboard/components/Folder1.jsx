import { useMutation } from "@apollo/client";
import axios from "axios";
import CryptoJS from "crypto-js";
import { Base64 } from "js-base64";
import JSZip from "jszip";
import React from "react";
import { useNavigate } from "react-router-dom";

// functions
import {
  CutFileType,
  extractDirectoryName,
  extractFileNames,
} from "../../../functions";

// components
import { successMessage } from "../../../components/Alerts";
import AlertDialog from "../../../components/deleteDialog";
import useAuth from "../../../hooks/useAuth";
import * as MUI from "../css/componentStyle";
import { MUTATION_SOFT_DELETE_FOLDER, MUTATION_UPDATE_FOLDER } from "./apollo";
import ProgressingBar from "./progressingBar";

import {
  Box,
  Button,
  TextField,
  ThemeProvider,
  Typography,
  styled,
  useMediaQuery,
} from "@mui/material";
import { createTheme } from "@mui/material/styles";

// material ui components
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";

// material ui icons
import DeleteForeverSharpIcon from "@mui/icons-material/DeleteForeverSharp";
import DownloadIcon from "@mui/icons-material/Download";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import FolderIcon from "@mui/icons-material/Folder";
import InsertLinkIcon from "@mui/icons-material/InsertLink";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import PersonAdd from "@mui/icons-material/PersonAdd";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import StarPurple500Icon from "@mui/icons-material/StarPurple500";

const theme = createTheme();

const FolderCard = styled("div")({
  width: "auto",
  borderRadius: "0.5rem",
  background: "#ffffff",
  boxShadow: "rgba(17, 17, 26, 0.1) 0px 1px 1px",
  margin: "1rem 1rem 1rem 0",
  [theme.breakpoints.down("sm")]: {
    boxShadow: "none",
    width: "40%",
    padding: "auto",
  },
});

function Folder(props) {
  const isMobile = useMediaQuery("(max-width:600px)");
  const isMatches = useMediaQuery("(min-width:1024px)");
  const navigate = useNavigate();
  const { user } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [folderId, setFolderId] = React.useState(0);
  const [folderName, setFolderName] = React.useState("");
  const [checkFolder, setCheckFolder] = React.useState("");
  const [path, setPath] = React.useState("");
  const [progressing, setProgressing] = React.useState(0);
  const [procesing, setProcesing] = React.useState(true);
  const [showProgressing, setShowProgressing] = React.useState(false);
  const [deleteFolder] = useMutation(MUTATION_SOFT_DELETE_FOLDER);
  const [updateFolder] = useMutation(MUTATION_UPDATE_FOLDER);

  // open menu popup
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // dialog Alert
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const handleDialogClose = () => {
    setDialogOpen(!dialogOpen);
  };

  const [renameDialogOpen, setRenameDialogOpen] = React.useState(false);
  const handleCloseRenameDialog = () => {
    setRenameDialogOpen(false);
  };

  // soft delete folder
  const handleDeleteFolder = async () => {
    handleDialogClose();
    try {
      let data = await deleteFolder({
        variables: {
          where: {
            _id: folderId,
          },
          data: {
            checkFolder: checkFolder,
            status: "deleted",
          },
        },
      });

      if (data?.data?.updateFolders?._id) {
        successMessage("Delete folder successfull!", 1200);
        props.onData("success");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveRename = async () => {
    try {
      let update = await updateFolder({
        variables: {
          where: {
            _id: folderId,
            checkFolder: checkFolder,
          },
          data: {
            folder_name: folderName,
          },
        },
      });

      if (update?.data?.updateFolders?._id) {
        handleCloseRenameDialog();
        props.onData("success");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // download folder function
  const handleDownloadZipFile = async (event) => {
    event.preventDefault();
    handleClose();
    setShowProgressing(true);
    const options = {
      method: "GET",
      url:
        "https://sg.storage.bunnycdn.com/vshare/" +
        user.username +
        "/" +
        path +
        "/",
      headers: {
        accept: "application/json",
        AccessKey: "6ebfab2b-3abc-441e-bdd8a3941153-41a3-49d3",
      },
    };
    try {
      const response = await axios.request(options);
      const zipData = response.data;
      const downloadName = extractDirectoryName(zipData[0].Path);
      const zip = new JSZip();
      let loaded = 0;
      const secretKey = "jsje3j3,02.3j2jk=243j42lj34hj23l24l;2h5345l";

      // Recursive function to add files and folders to the zip
      const addFilesAndFolders = async (directory, items) => {
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          if (item.IsDirectory) {
            const subdirectory = directory
              ? directory + "/" + item.ObjectName
              : item.ObjectName;
            const subitems = await getDirectoryItems(subdirectory);
            await addFilesAndFolders(subdirectory, subitems);
          } else {
            const file_name = extractFileNames(
              Base64.decode(CutFileType(item.ObjectName))
            );
            const headers = {
              accept: "*/*",
              storageZoneName: "vshare-storage02",
              path: user.username + "/" + path,
              fileName: CryptoJS.enc.Utf8.parse(item.ObjectName),
              AccessKey: "6ebfab2b-3abc-441e-bdd8a3941153-41a3-49d3",
            };
            const encryptedHeaders = CryptoJS.AES.encrypt(
              JSON.stringify(headers),
              secretKey
            ).toString();

            const response = await fetch("https://load.vshare.net/data", {
              headers: { encryptedHeaders },
            });

            const blob = await response.blob();
            zip.folder(directory).file(file_name, blob);
            loaded += 1;
            const percentage = Math.round((loaded / zipData.length) * 100);
            setProgressing(percentage);
            setProcesing(true);
          }
        }
      };

      // Get the items in the root directory and add them to the zip
      const rootItems = await getDirectoryItems("");
      await addFilesAndFolders("", rootItems);

      // Generate the zip file and download it
      zip.generateAsync({ type: "blob" }).then((content) => {
        const url = URL.createObjectURL(content);
        const a = document.createElement("a");
        a.href = url;
        a.download = downloadName;
        a.click();
        URL.revokeObjectURL(url);
      });
      successMessage("Download successfully!! 123", 2000);
      setShowProgressing(false);
      setProcesing(false);
    } catch (error) {
      console.error(error);
    }
  };

  // Function to get the items in a directory
  const getDirectoryItems = async (directory) => {
    const options = {
      method: "GET",
      url:
        "https://sg.storage.bunnycdn.com/vshare/" +
        user.username +
        "/" +
        path +
        "/" +
        directory +
        "/",
      headers: {
        accept: "application/json",
        AccessKey: "6ebfab2b-3abc-441e-bdd8a3941153-41a3-49d3",
      },
    };
    const response = await axios.request(options);

    return response.data;
  };

  // open sub folder
  const handleOpenSubFolder = (id, url, path) => {
    const linUrl = window.location.href;
    const base64URL = Base64.encodeURI(url);
    navigate(`/myfile/my-folder/${base64URL}`, {
      state: { id, url, linUrl, path },
    });
  };

  return (
    <div>
      <ThemeProvider theme={MUI.CustomizeTheme2}>
        <FolderCard>
          {isMobile ? (
            <MUI.MobileFolder>
              <MUI.MobileFolderHeard>
                <Typography
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    width: "60%",
                  }}
                >
                  {props.text.substring(0, 5) + ".."}
                </Typography>
                <Tooltip title={props.text}>
                  <IconButton
                    aria-controls={open ? "account-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                    size="small"
                    sx={{
                      width: "30px",
                      height: "30px",
                      display: "flex",
                      alignItems: "center",
                    }}
                    onClick={(event) => {
                      handleClick(event);
                      setFolderId(props.id);
                      setFolderName(props.text);
                      setCheckFolder(props.checkFolder);
                      setPath(props.path);
                    }}
                  >
                    <MoreVertRoundedIcon />
                  </IconButton>
                </Tooltip>
              </MUI.MobileFolderHeard>
              <FolderIcon
                sx={{
                  color: "#2F998B",
                  fontSize: "25px",
                  [theme.breakpoints.down("sm")]: {
                    fontSize: "5rem",
                    padding: "0",
                    width: "100%",
                  },
                }}
              />
            </MUI.MobileFolder>
          ) : (
            <MUI.CardFolder
              onDoubleClick={() => {
                handleOpenSubFolder(props?.id, props?.url, props?.path);
              }}
            >
              <MUI.TextIcons>
                <FolderIcon
                  sx={{
                    color: "#2F998B",
                    fontSize: "25px",
                    [theme.breakpoints.down("sm")]: {
                      display: "none",
                    },
                  }}
                />
                &nbsp;
                <Typography
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    color: "#454746",
                    fontSize: "16px",
                    fontWeight: "500",
                    [theme.breakpoints.down("sm")]: {
                      fontSize: "12px",
                      justifyContent: "space-around",
                      paddingLeft: "1.2rem",
                    },
                  }}
                >
                  {props?.text}
                </Typography>
              </MUI.TextIcons>
              <MUI.TextIcons>
                <Tooltip title={props.text}>
                  <IconButton
                    aria-controls={open ? "account-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                    size="small"
                    sx={{
                      ml: 2,
                      width: "40px",
                      height: "40px",
                      display: "flex",
                      alignItems: "center",
                    }}
                    onClick={(event) => {
                      handleClick(event);
                      setFolderId(props.id);
                      setFolderName(props.text);
                      setCheckFolder(props.checkFolder);
                      setPath(props.path);
                    }}
                  >
                    <MoreVertRoundedIcon />
                  </IconButton>
                </Tooltip>
              </MUI.TextIcons>
            </MUI.CardFolder>
          )}
        </FolderCard>

        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&:before": {
                content: "''",
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
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
        >
          <MenuItem
            onClick={() =>
              handleOpenSubFolder(props?.id, props?.url, props?.path)
            }
          >
            <ListItemIcon>
              <RemoveRedEyeIcon fontSize="small" />
            </ListItemIcon>
            Details
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <PersonAdd fontSize="small" />
            </ListItemIcon>
            Share
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <InsertLinkIcon fontSize="small" />
            </ListItemIcon>
            Get link
          </MenuItem>
          <MenuItem onClick={() => setRenameDialogOpen(true)}>
            <ListItemIcon>
              <DriveFileRenameOutlineIcon fontSize="small" />
            </ListItemIcon>
            Rename
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <StarPurple500Icon fontSize="small" />
            </ListItemIcon>
            Star message
          </MenuItem>
          <MenuItem onClick={(event) => handleDownloadZipFile(event)}>
            <ListItemIcon>
              <DownloadIcon fontSize="small" />
            </ListItemIcon>
            Download
          </MenuItem>
          <MenuItem onClick={() => setDialogOpen(true)}>
            <ListItemIcon>
              <DeleteForeverSharpIcon fontSize="small" />
            </ListItemIcon>
            Delete
          </MenuItem>
        </Menu>
      </ThemeProvider>
      <AlertDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onClick={handleDeleteFolder}
        title="Are you sure that younwant to move 1 file to Rubbish bin?"
        message={"If you click okay: " + folderName + " will be deleted?"}
      />
      <Dialog open={renameDialogOpen} onClose={handleCloseRenameDialog}>
        <Box sx={{ minWidth: isMatches ? "400px" : "200px", mt: 2 }}>
          <DialogTitle>Rename file</DialogTitle>
          <DialogContent sx={{ mt: 3 }}>
            <TextField
              autoFocus
              id="name"
              label="Rename file"
              type="text"
              fullWidth
              variant="outlined"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
            />
          </DialogContent>
          <DialogActions sx={{ mb: 3, mr: 4 }}>
            <Button
              sx={{ mr: 2 }}
              onClick={handleCloseRenameDialog}
              variant="contained"
              color="greyTheme"
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primaryTheme"
              onClick={handleSaveRename}
            >
              Save
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {showProgressing && (
        <ProgressingBar procesing={procesing} progressing={progressing} />
      )}
    </div>
  );
}

export default Folder;
