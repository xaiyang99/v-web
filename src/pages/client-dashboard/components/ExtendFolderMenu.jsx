import { Base64 } from "js-base64";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// material ui icon and component
import DeleteForeverSharpIcon from "@mui/icons-material/DeleteForeverSharp";
import DownloadIcon from "@mui/icons-material/Download";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import InfoIcon from "@mui/icons-material/Info";
import InsertLinkIcon from "@mui/icons-material/InsertLink";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import PersonAdd from "@mui/icons-material/PersonAdd";
import StarPurple500Icon from "@mui/icons-material/StarPurple500";
import { IconButton, Menu, MenuItem } from "@mui/material";
import ListItemIcon from "@mui/material/ListItemIcon";
import Tooltip from "@mui/material/Tooltip";

// component
import { useMutation } from "@apollo/client";
import { successMessage } from "../../../components/Alerts";
import { UPADATE_FOLDERS } from "../folder/apollo/folder";

//package
import axios from "axios";
import JSZip from "jszip";
import { CopyToClipboard } from "react-copy-to-clipboard";
import {
  CutFileType,
  extractDirectoryName,
  extractFileNames,
} from "../../../functions";
import useAuth from "../../../hooks/useAuth";

const ExtendFolderMenu = ({ ...props }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [renameOpen, setRenameOpen] = React.useState(Boolean(false));
  const [openShare, setOpenShare] = React.useState(Boolean(false));
  const [deleteOpen, setDeleteOpen] = useState(Boolean(false));
  const [updateFolder] = useMutation(UPADATE_FOLDERS);
  const [coppied, setCoppied] = useState(false);
  const [valueURL, setValueURL] = useState("");
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const open = Boolean(anchorEl);
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [procesing, setProcesing] = React.useState(true);
  const [progressing, setProgressing] = React.useState(0);
  const [path, setPath] = React.useState("");

  const handleClick = (event, id, title, url, path) => {
    setAnchorEl(event.currentTarget);
    setId(id);
    setTitle(title);
    setPath(path);
    // GET LINK
    const URL_HTTP_DOMAIN = window.location.href;
    const base64URL = Base64.encodeURI(url);
    const linkUrl = window.location.href + "/" + base64URL;

    setValueURL(linkUrl);
    localStorage.setItem("MY_FOLDER_HTTP_URL", URL_HTTP_DOMAIN);
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

  const handleRenameClick = async () => {
    const renameFolder = await updateFolder({
      variables: {
        data: {
          folder_name: title,
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
      props?.refecthFolder();
    }
  };

  // create share
  const handleCreateShare = () => {
    setOpenShare(true);
  };
  const handleDeleteFolder = () => {
    setDeleteOpen(true);
  };

  // open sub folder
  const handleOpenSubFolder = (id, url, path) => {
    const linkUrl = window.location.href;
    const base64URL = Base64.encodeURI(url);
    navigate(`/myfile/my-folder/${base64URL}`, {
      state: { id, url: base64URL, linkUrl, folder_name: props.text, path },
    });
  };

  // download
  const handleDownloadZipFile = async (e) => {
    handleClose();
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
              Base64.decode(CutFileType(item.ObjectName)),
            );
            const file_url =
              "http://beta.vshare.net:81/" +
              user.username +
              "/" +
              path +
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

  return (
    <>
      <Tooltip title="Show more options">
        <IconButton
          onClick={(e) =>
            handleClick(e, props?.id, props?.text, props?.url, props?.path)
          }
          aria-controls={open ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          size="small"
          sx={{ ml: 2 }}
        >
          <MoreVertRoundedIcon />
        </IconButton>
      </Tooltip>
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
          onClick={() => {
            handleRename(id, title);
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
        <MenuItem onClick={(e) => handleDownloadZipFile(e)}>
          <ListItemIcon>
            <DownloadIcon fontSize="small" />
          </ListItemIcon>
          Download
        </MenuItem>
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
      </Menu>
    </>
  );
};

export default ExtendFolderMenu;
