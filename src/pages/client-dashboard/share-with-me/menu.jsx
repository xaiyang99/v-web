import { ListItemIcon, Menu, MenuItem } from "@mui/material";
import { useState } from "react";

// icon
import DeleteForeverSharpIcon from "@mui/icons-material/DeleteForeverSharp";
import DownloadIcon from "@mui/icons-material/Download";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import InfoIcon from "@mui/icons-material/Info";
import InsertLinkIcon from "@mui/icons-material/InsertLink";
import PersonAdd from "@mui/icons-material/PersonAdd";
import StarPurple500Icon from "@mui/icons-material/StarPurple500";
// package
import { useMutation } from "@apollo/client";
import { CopyToClipboard } from "react-copy-to-clipboard";
//components
import { errorMessage, successMessage } from "../../../components/Alerts";
import useAuth from "../../../hooks/useAuth";
import CreateShare from "../components/CreateShare";
import { DeleteFileStatus } from "../components/DeleteFileStatus";
import RenameDialogFile from "../components/RenameDialogFile";
import { DELETE_SHARE_STATUS } from "./apollo";
function MenuShare(props) {
  const {
    open,
    onClose,
    valueURL,
    setCoppied,
    id,
    name,
    folderId,
    folderName,
    folderType,
    openShare,
    setOpenShare,
    refetchFolder,
  } = props;

  const { user } = useAuth();
  const [deleteOpen, setDeleteOpen] = useState(Boolean(false));
  const [deletedShare] = useMutation(DELETE_SHARE_STATUS);
  // deleted file status handle close
  const deletedFileClose = () => {
    setDeleteOpen(false);
  };
  const handleDeleteFolder = () => {
    setDeleteOpen(true);
  };

  // create share
  const handleCreateShare = () => {
    setOpenShare(true);
  };
  const handleDeleteFolderStatus = async () => {
    if (folderType === "folder") {
      const deleteShareStatus = await deletedShare({
        variables: {
          body: {
            status: "deleted",
            toAccount: user?.email,
          },
          id: id,
        },
      });

      if (deleteShareStatus) {
        successMessage("Delete folder success !", 3000);
        refetchFolder();
        deletedFileClose();
      }
    } else {
      errorMessage("Something went wrong!", 2000);
    }
  };

  return (
    <div>
      <Menu
        anchorEl={props.anchorEl}
        id="account-menu"
        open={open}
        onClose={onClose}
        onClick={onClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 0px 5px rgba(0,0,0,0.05))",
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
        <MenuItem onClick={onClose}>
          <ListItemIcon>
            <InfoIcon fontSize="small" />
          </ListItemIcon>
          Details
        </MenuItem>
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
        <MenuItem onClick={() => props.setRenameOpen(true)}>
          <ListItemIcon>
            <DriveFileRenameOutlineIcon fontSize="small" />
          </ListItemIcon>
          Rename
        </MenuItem>
        <MenuItem onClick={onClose}>
          <ListItemIcon>
            <StarPurple500Icon fontSize="small" />
          </ListItemIcon>
          Star message
        </MenuItem>

        <MenuItem>
          <ListItemIcon onClick={props.onClick}>
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
      {/* Dialog create share  */}
      {openShare ? (
        <CreateShare
          onClose={() => {
            setOpenShare(false);
          }}
          open={() => {
            setOpenShare(true);
          }}
          id={folderId}
          title={folderName}
          folderType={folderType}
          refecthFolder={refetchFolder}
          valueURL={valueURL}
        />
      ) : null}
      {/* dialog update folder */}

      <RenameDialogFile
        open={props.renameOpen}
        onClose={props.renameClose}
        onClick={props.onClick}
        title="Change File Name"
        label="Rename File"
        id={id}
        name={props.name}
        setName={props.setName}
      />

      {/* Dialog delete folder */}
      {folderType === "folder" ? (
        <DeleteFileStatus
          onClose={deletedFileClose}
          open={deleteOpen}
          onClick={handleDeleteFolderStatus}
          title="Do you want to delete folder"
          name={folderName}
        />
      ) : (
        <DeleteFileStatus title="Do you want to delete file" name={name} />
      )}
    </div>
  );
}

export default MenuShare;
