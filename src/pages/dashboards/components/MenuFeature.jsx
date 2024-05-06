import { useMutation } from "@apollo/client";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { errorMessage, successMessage } from "../../../components/Alerts";
import { keyBunnyCDN, linkBunnyCDN } from "../../../functions";
import useAuth from "../../../hooks/useAuth";
import usePermission from "../../../hooks/usePermission";
import { DELETE_FEATURE, QUERY_FEATURES } from "../features/apollo/features";
import DialogDeleteLoading from "./DialogDeleteLoading";

function MenuFeature(props) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const permission = usePermission(user?._id);
  const { onClick, onClose, open, anchorEl, id, imageName } = props;
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);
  const [deleteFeatures] = useMutation(DELETE_FEATURE, {
    // refetchQueries: [
    //   {
    //     query: QUERY_FEATURES,
    //     variables: {
    //       variables: {
    //         orderBy: "createdAt_DESC",
    //       },
    //     },
    //     awaitRefetchQueries: true,
    //   },
    // ],
  });
  const _deleteAny = () => {
    setDeleteOpen(true);
  };
  const deleteHandleClose = () => {
    setDeleteOpen(false);
  };

  const handleDeleteFile = async () => {
    try {
      const url = `${linkBunnyCDN}image/${imageName}`;
      const apiKey = keyBunnyCDN;
      const result = await deleteFeatures({
        variables: {
          id: id,
        },
      });

      if (result.data?.deleteFeatures) {
        const response = await fetch(url, {
          method: "DELETE",
          headers: {
            AccessKey: apiKey,
          },
        });

        if (response.ok) {
          setLoadingButton(false);
          setDeleteOpen(false);
        } else {
          setLoadingButton(false);
          console.error(
            "An error occurred while deleting the image:",
            response.statusText,
          );
        }
      }
      setLoadingButton(false);
      props?.featureRefetch();
      successMessage("Delete Feature success", 3000);
    } catch (error) {
      setLoadingButton(false);
      errorMessage("Delete Features Erorr", 3000);
      console.error(error);
    }
  };

  return (
    <React.Fragment>
      <DialogDeleteLoading
        open={deleteOpen}
        onClose={deleteHandleClose}
        title={t("_delete_title")}
        onClick={handleDeleteFile}
        statusLoading={loadingButton}
      />
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={onClose}
        onClick={onClose}
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
              right: 10,
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
          onClick={onClick}
          disabled={!permission?.hasPermission("feature_edit") ? true : false}
        >
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          {t("_can_edit")}
        </MenuItem>
        <MenuItem
          onClick={_deleteAny}
          disabled={!permission?.hasPermission("feature_delete") ? true : false}
        >
          <ListItemIcon>
            <DeleteForeverIcon fontSize="small" />
          </ListItemIcon>
          {t("_delete_button")}
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}

export default MenuFeature;
