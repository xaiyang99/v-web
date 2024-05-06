import React from "react";

// material ui components
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import { FileIcon, defaultStyles } from "react-file-icon";
// material ui icons
import DeleteForeverSharpIcon from "@mui/icons-material/DeleteForeverSharp";
import DownloadIcon from "@mui/icons-material/Download";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import FolderIcon from "@mui/icons-material/Folder";
import InfoIcon from "@mui/icons-material/Info";
import InsertLinkIcon from "@mui/icons-material/InsertLink";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PersonAdd from "@mui/icons-material/PersonAdd";
import StarPurple500Icon from "@mui/icons-material/StarPurple500";
import { Box, ListItemIcon } from "@mui/material";
// package
import axios from "axios";
import { Base64 } from "js-base64";
import { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useNavigate } from "react-router-dom";
// compontents

import { useMutation } from "@apollo/client";
import JSZip from "jszip";
import { errorMessage, successMessage } from "../../../components/Alerts";
import {
  CutFileType,
  GetFileType,
  extractDirectoryName,
  extractFileNames,
  getFileExtension,
  truncateName,
} from "../../../functions";
import useAuth from "../../../hooks/useAuth";
import {
  MUTATION_DELETE_RECENT_FILE,
  MUTATION_UPDATE_RECENT_FILE,
} from "../clound/apollo";
import { UPADATE_FOLDERS } from "../folder/apollo/folder";
import { MUTATION_ACTION_FILE } from "../recent/apollo";
import CreateShare from "./CreateShare";
import { DeleteFileStatus } from "./DeleteFileStatus";
import RenameDialogFile from "./RenameDialogFile";
import RenameDialog from "./RenameDialogFolder";
import { DialogDelete } from "./deleteFolder";

function ItemCard(props) {
  const { user } = useAuth();
  const [progressing, setProgressing] = React.useState(0);
  //dropdown
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [renameOpen, setRenameOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [updateFolder] = useMutation(UPADATE_FOLDERS);
  const [updateFiles] = useMutation(MUTATION_UPDATE_RECENT_FILE);
  const [deleteRecentFile] = useMutation(MUTATION_DELETE_RECENT_FILE);
  const [fileAction] = useMutation(MUTATION_ACTION_FILE);
  const [deletedFileOnpen, setDeletedFileOnpen] = useState(Boolean(false));
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [openShare, setOpenShare] = React.useState(Boolean(false));
  const [procesing, setProcesing] = React.useState(false);
  const [id, setId] = useState("");
  const [itemName, setItemName] = useState("");
  const name = props?.name;
  const [valueURL, setValueURL] = useState("");
  const [coppied, setCoppied] = useState(false);

  const handleClick = (event, id, url, title) => {
    const base64URL = Base64.encodeURI(url);
    const httpURL = localStorage.getItem("MY_FOLDER_HTTP_URL");
    setAnchorEl(event.currentTarget);
    setId(id);
    setValueURL(httpURL + "/" + base64URL);
    setItemName(title.split("/").slice(-1).join().split(".").shift());
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleRename = () => {
    setRenameOpen(true);
  };

  const renameClose = () => {
    setRenameOpen(false);
  };

  const handleDeleteFolder = () => {
    setDeleteOpen(true);
  };
  // create share
  const handleCreateShare = () => {
    setOpenShare(true);
  };
  // deleted file status handle close
  const deletedFileClose = () => {
    setDeletedFileOnpen(false);
  };
  // deleted file status handle open

  const deletedFileStatusOpen = () => {
    setDeletedFileOnpen(true);
  };
  const typefile = props?.name;
  const typeItem = typefile.split(".").pop();

  const onDoubleSubFolder = (id, url) => {
    const base64URL = Base64.encodeURI(url);
    if (props?.checkTypeItem === "folder") {
      navigate(`/myfile/my-folder/${base64URL}`, {
        state: { id, url },
      });
    } else {
      // showFileBunny();
    }
  };

  // rename
  const handleSubFolderRename = async () => {
    if (props?.checkTypeItem === "folder") {
      const renameFolder = await updateFolder({
        variables: {
          data: {
            folder_name: itemName,
          },
          where: {
            _id: id,
            checkFolder: props?.checkFolder,
          },
        },
      });

      if (renameFolder) {
        setRenameOpen(false);
        successMessage("Update folder success !", 3000);
        handleActionFile(id);
        props?.refecthFolder();
      }
    } else {
      const renameFile = await updateFiles({
        variables: {
          data: {
            filename: itemName + "." + typeItem,
          },
          where: {
            _id: id,
          },
        },
      });
      if (renameFile) {
        setRenameOpen(false);
        successMessage("Update file success !", 3000);
        handleActionFile(id);
        props?.refecthFolder();
      }
    }
  };

  // deleted file status
  const handleDeletedFileStatus = async () => {
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
        successMessage("Delete file successful!!", 2000);
        setDeletedFileOnpen(false);
        props?.refecthFolder();
      }
    } catch (err) {
      errorMessage("Sorry! Something went wrong. Please try again!");
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
        console.error("successful");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Download file
  const downloadFilesFromBunny = async (event) => {
    event.preventDefault();
    let real_path;
    if (props?.path == "main") {
      real_path = "";
    } else {
      real_path = truncateName(props?.path);
    }
    let url =
      "https://load.vshare.net/" +
      user.username +
      "/" +
      real_path +
      props.newFileName;
    let filename = name;
    const response = await fetch(url);
    const reader = response.body.getReader();
    const contentLength = +response.headers.get("Content-Length");
    let receivedLength = 0;
    const chunks = [];
    let coutPercentage = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      receivedLength += value.length;
      coutPercentage = Math.round((receivedLength / contentLength) * 100);
      setUploadProgress(coutPercentage);
    }
    if (coutPercentage === 100) {
      successMessage("Download successful!!", 2000);
    }

    const blob = new Blob(chunks);
    const href = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // download folder function
  const handleDownloadZipFile = async (event) => {
    event.preventDefault();
    const options = {
      method: "GET",
      url:
        "https://sg.storage.bunnycdn.com/vshare/" +
        user.username +
        "/" +
        props.path +
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
            const file_url =
              "https://load.vshare.net/" +
              user.username +
              "/" +
              props.path +
              "/" +
              item.ObjectName;
            const response = await fetch(file_url);
            const blob = await response.blob();
            zip.folder(directory).file(file_name, blob);
            loaded += 1;
            const percentage = Math.round((loaded / zipData.length) * 100);
            setProgressing(percentage);
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
      successMessage("Download successfully!!", 2000);
      <progressingBar procesing={procesing} progressing={progressing} />;
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
        props.path +
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
        <CardContent
          onDoubleClick={() => onDoubleSubFolder(props?.id, props?.url)}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h6" mt={2} key={props?.index}>
              {props?.name.length > 8
                ? props?.name.substring(0, 4) + "..." + `.${typeItem}`
                : props?.name}
            </Typography>
            <MoreVertIcon
              id="basic-button"
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={(e) =>
                handleClick(e, props?.id, props?.url, props?.name)
              }
            />
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
                onClick={() => setOpenShare(true)}
                onClose={handleCreateShare}
                open={openShare}
              >
                <ListItemIcon>
                  <PersonAdd fontSize="small" />
                </ListItemIcon>
                Share
              </MenuItem>
              <CopyToClipboard text={valueURL} onCopy={() => setCoppied(true)}>
                <MenuItem>
                  <ListItemIcon>
                    <InsertLinkIcon fontSize="small" />
                  </ListItemIcon>
                  Get link
                </MenuItem>
              </CopyToClipboard>
              <MenuItem
                onClick={(e) => {
                  handleRename(e, id, itemName);
                }}
              >
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
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <InfoIcon fontSize="small" />
                </ListItemIcon>
                details
              </MenuItem>
              <MenuItem
                onClick={(event) =>
                  getFileExtension(props.path)
                    ? handleDownloadZipFile(event)
                    : downloadFilesFromBunny(event)
                }
              >
                <ListItemIcon>
                  <DownloadIcon fontSize="small" />
                </ListItemIcon>
                Download
              </MenuItem>
              {props?.checkTypeItem === "folder" ? (
                <MenuItem
                  onClick={() => setDeleteOpen(true)}
                  onClose={handleDeleteFolder}
                  open={deleteOpen}
                >
                  <ListItemIcon>
                    <DeleteForeverSharpIcon fontSize="small" />
                  </ListItemIcon>
                  Delete
                </MenuItem>
              ) : (
                <MenuItem onClick={deletedFileStatusOpen}>
                  <ListItemIcon>
                    <DeleteForeverSharpIcon fontSize="small" />
                  </ListItemIcon>
                  Delete
                </MenuItem>
              )}
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
            {props?.checkTypeItem == "folder" ? (
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

      {/* dialog update folder */}
      {props?.checkTypeItem === "folder" ? (
        <RenameDialog
          open={renameOpen}
          onClose={renameClose}
          onClick={handleSubFolderRename}
          title="Change Folder Name"
          label="Rename Folder"
          id={id}
          name={itemName}
          setName={setItemName}
        />
      ) : (
        <RenameDialogFile
          open={renameOpen}
          onClose={renameClose}
          onClick={handleSubFolderRename}
          title="Change File Name"
          label="Rename File"
          id={id}
          name={itemName}
          setName={setItemName}
        />
      )}
      {/* Dialog delete folder */}
      {props?.checkTypeItem === "folder" ? (
        deleteOpen ? (
          <DialogDelete
            onClose={() => {
              setDeleteOpen(false);
            }}
            open={() => {
              setDeleteOpen(true);
            }}
            title={itemName}
            id={id}
            refecthFolder={props.refecthFolder}
          />
        ) : null
      ) : (
        <DeleteFileStatus
          onClose={deletedFileClose}
          open={deletedFileOnpen}
          onClick={handleDeletedFileStatus}
          title="Do you want to delete file"
          name={name}
        />
      )}
      {/* Dialog create share  */}
      {openShare ? (
        <CreateShare
          onClose={() => {
            setOpenShare(false);
          }}
          open={() => {
            setOpenShare(true);
          }}
          id={id}
          title={name}
          folderType={props?.checkTypeItem}
          refecthFolder={props.refecthFolder}
        />
      ) : null}
    </>
  );
}

export default ItemCard;
