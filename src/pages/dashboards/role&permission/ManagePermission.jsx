import React, { useEffect, useState } from "react";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { styled } from "@mui/material/styles";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { useMutation } from "@apollo/client";
import {
  MUTATION_CREATE_ROLE,
  MUTATION_UPDATE_ROLE,
  QUERY_ROLES,
} from "./apollo";
import { successMessage, errorMessage } from "../../../components/Alerts";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "left",
  color: theme.palette.text.secondary,
}));

function ManageRole(props) {
  const [dashboardView, setDashboardView] = useState(false);
  const [createUser, setCreateUser] = useState(false);
  const [viewUser, setViewUser] = useState(false);
  const [editUser, setEditUser] = useState(false);
  const [deleteUser, setDeteUser] = useState(false);
  const [createFile, setCreateFile] = useState(false);
  const [viewFile, setViewFile] = useState(false);
  const [editFile, setEditFile] = useState(false);
  const [deletedFile, setDeletedFile] = useState(false);
  const [uploadFile, setUploadFile] = useState(false);
  const [downloadFile, setDownloadFile] = useState(false);
  const [shareFile, setShareFile] = useState(false);
  const [exportFile, setExportFile] = useState(false);
  const [createShare, setCreateShare] = useState(false);
  const [viewShare, setViewShare] = useState(false);
  const [editShare, setEditShare] = useState(false);
  const [deleteShare, setDeleteShare] = useState(false);
  const [role_id, setRole_id] = useState("");
  const [errMessage, setErrMessage] = useState("");
  const [access, setAccess] = useState("");
  // update
  const [updateDashboarView, seTupdateDashboarView] = useState(false);
  const [updatCreateFile, setUpdateCreateFile] = useState(false);
  const [updateViewFile, setUpdatVeiewFile] = useState(false);
  const [updateEditFile, setUpateEditFile] = useState(false);
  const [updateDeletedFile, setUpdateDeletedFile] = useState(false);
  const [updateUploadFile, setUpdateUploadFile] = useState(false);
  const [updateDownloadFile, seUpdatetDownloadFile] = useState(false);
  const [updateShareFile, setUpdateShareFile] = useState(false);
  const [updateExportFile, setUpdateExportFile] = useState(false);
  const [updateUserCreate, setUpdateUserCreate] = useState(false);
  const [updateUserEdit, setUpdateUserEdit] = useState(false);
  const [updateUserView, setUpdateUserView] = useState(false);
  const [updateUserDelete, setUpdateUserDelete] = useState(false);
  const [updateShareView, setUpdateShareView] = useState(false);
  const [updateShareCreate, setUpdateShareCreate] = useState(false);
  const [updateShareEdit, setUpdateShareEdit] = useState(false);
  const [updateShareDelete, setUpdateShareDelete] = useState(false);
  const hide = () => setErrMessage(false);
  const [role_data, setRole_data] = useState("");
  const [multiId, setMultiId] = useState([]);
  const [updateRole_and_permision] = useMutation(MUTATION_UPDATE_ROLE, {
    refetchQueries: [
      {
        query: QUERY_ROLES,
        variables: {
          where: {
            status: "active",
          },
        },
        awaitRefetchQueries: true,
      },
    ],
  });
  const [createRolde_and_Permission] = useMutation(MUTATION_CREATE_ROLE, {
    refetchQueries: [
      {
        query: QUERY_ROLES,
        variables: {
          where: {
            status: "active",
          },
        },
        awaitRefetchQueries: true,
      },
    ],
  });
  // update file

  const [permissionValue, setPermissionValue] = useState({
    name: "",
    access: "limit",
  });

  // get role name when onChange
  useEffect(() => {
    setRole_data(props?.data?.name);
    setRole_id(props?.data?.id);
    setAccess(props?.data?.access);
    setMultiId(props?.multiId);

    seTupdateDashboarView(props?.data?.dashboardView === 1 ? true : false);
    setUpdateUserCreate(props?.data?.userCreate === 1 ? true : false);
    setUpdateUserEdit(props?.data?.userEdit === 1 ? true : false);
    setUpdateUserDelete(props?.data?.userDelete === 1 ? true : false);
    setUpdateUserView(props?.data?.userView === 1 ? true : false);

    setUpdateCreateFile(props?.data?.fileCreate === 1 ? true : false);
    setUpdatVeiewFile(props?.data?.fileView === 1 ? true : false);
    setUpateEditFile(props?.data?.fileEdit === 1 ? true : false);
    setUpdateUploadFile(props?.data?.fileUpload === 1 ? true : false);
    setUpdateDeletedFile(props?.data?.fileDelete === 1 ? true : false);
    seUpdatetDownloadFile(props?.data?.fileDownload === 1 ? true : false);
    setUpdateShareFile(props?.data?.fileShare === 1 ? true : false);
    setUpdateExportFile(props?.data?.fileExport === 1 ? true : false);

    setUpdateShareCreate(props?.data?.shareCreate === 1 ? true : false);
    setUpdateShareEdit(props?.data?.shareEdit === 1 ? true : false);
    setUpdateShareView(props?.data?.shareView === 1 ? true : false);
    setUpdateShareDelete(props?.data?.shareDelete === 1 ? true : false);
  }, [props]);

  const handleChange2 = () => {
    setCreateUser(!createUser);
    setUpdateUserCreate(!updateUserCreate);
  };

  const handleChange3 = () => {
    setViewUser(!viewUser);
    setUpdateUserView(!updateUserView);
  };
  const handleChange4 = () => {
    setEditUser(!editUser);
    setUpdateUserEdit(!updateUserEdit);
  };
  const handleChange5 = () => {
    setDeteUser(!deleteUser);
    setUpdateUserDelete(!updateUserDelete);
  };

  // dashboard
  const handleDashboardView = () => {
    setDashboardView(!dashboardView);
    seTupdateDashboarView(!updateDashboarView);
  };
  // hanlde file

  const handleCreateFiles = () => {
    setCreateFile(!createFile);
    setUpdateCreateFile(!updatCreateFile);
  };
  const handleViewFile = () => {
    setViewFile(!viewFile);
    setUpdatVeiewFile(!updateViewFile);
  };
  const handleEditFile = () => {
    setEditFile(!editFile);
    setUpateEditFile(!updateEditFile);
  };
  const handleDeleteFile = () => {
    setDeletedFile(!deletedFile);
    setUpdateDeletedFile(!updateDeletedFile);
  };
  const handleUploadFile = () => {
    setUploadFile(!uploadFile);
    setUpdateUploadFile(!updateUploadFile);
  };
  const handleDownloadFile = () => {
    setDownloadFile(!downloadFile);
    seUpdatetDownloadFile(!updateDownloadFile);
  };
  const handleShareFile = () => {
    setShareFile(!shareFile);
    setUpdateShareFile(!updateShareFile);
  };
  const handleExportFile = () => {
    setExportFile(!exportFile);
    setUpdateExportFile(!updateExportFile);
  };
  // share

  const handleCreateShare = () => {
    setCreateShare(!createShare);
    setUpdateShareCreate(!updateShareCreate);
  };
  const handleViewShare = () => {
    setViewShare(!viewShare);
    setUpdateShareView(!updateShareView);
  };
  const handleEditShare = () => {
    setEditShare(!editShare);
    setUpdateShareEdit(!updateShareEdit);
  };
  const handleDeleteShare = () => {
    setDeleteShare(!deleteShare);
    setUpdateShareDelete(!updateShareDelete);
  };

  // create permission
  const handleAddPermission = async () => {
    try {
      if (permissionValue.name === "") {
        setErrMessage("Role is required!");
        setTimeout(hide, 3000);
      } else {
        if (permissionValue.access === "full") {
          const permissonInput = await createRolde_and_Permission({
            variables: {
              body: {
                name: permissionValue.name,
                access: permissionValue.access,
              },
            },
          });
          if (permissonInput) {
            successMessage("add permisson success", 3000);
          }
        } else {
          const permissonInput = await createRolde_and_Permission({
            variables: {
              body: {
                name: permissionValue.name,
                access: permissionValue.access,
                dashboardView: dashboardView === true ? 1 : 0,
                userCreate: createUser === true ? 1 : 0,
                userEdit: editUser === true ? 1 : 0,
                userDelete: deleteUser === true ? 1 : 0,
                userView: viewUser === true ? 1 : 0,
                fileView: viewFile === true ? 1 : 0,
                fileCreate: createFile === true ? 1 : 0,
                fileEdit: editFile === true ? 1 : 0,
                fileDelete: deletedFile === true ? 1 : 0,
                fileUpload: uploadFile === true ? 1 : 0,
                fileDownload: downloadFile === true ? 1 : 0,
                fileShare: shareFile === true ? 1 : 0,
                fileExport: exportFile === true ? 1 : 0,
              },
            },
          });
          if (permissonInput) {
            successMessage("add new role and permisson success", 3000);
          }
          props?.roleRefetch();
        }
      }
    } catch (error) {
      errorMessage("Update failed somting wrong !", 3000);
    }
  };
  // update role and permission
  const handleUpadate_role_permission = async () => {
    try {
      if (role_data === "") {
        setErrMessage("Role is required!");
        setTimeout(hide, 3000);
      } else {
        if (access === "full") {
          const update_role_permission = await updateRole_and_permision({
            variables: {
              id: role_id,
              body: {
                name: role_data,
                access: access,
              },
            },
          });
          if (update_role_permission) {
            successMessage("Update Role and Permisson success", 3000);
          }
        } else {
          const update_role_permission = await updateRole_and_permision({
            variables: {
              id: role_id,
              body: {
                name: role_data,
                access: access,
                dashboardView: updateDashboarView === true ? 1 : 0,
                userCreate: updateUserCreate === true ? 1 : 0,
                userEdit: updateUserEdit === true ? 1 : 0,
                userDelete: updateUserDelete === true ? 1 : 0,
                userView: updateUserView === true ? 1 : 0,

                fileView: updateViewFile === true ? 1 : 0,
                fileCreate: updatCreateFile === true ? 1 : 0,
                fileEdit: updateEditFile === true ? 1 : 0,
                fileDelete: updateDeletedFile === true ? 1 : 0,
                fileUpload: updateUploadFile === true ? 1 : 0,
                fileDownload: updateDownloadFile === true ? 1 : 0,
                fileShare: updateShareFile === true ? 1 : 0,
                fileExport: updateExportFile === true ? 1 : 0,

                shareCreate: updateShareCreate === true ? 1 : 0,
                shareDelete: updateShareDelete === true ? 1 : 0,
                shareEdit: updateShareEdit === true ? 1 : 0,
                shareView: updateShareView === true ? 1 : 0,
              },
            },
          });
          if (update_role_permission) {
            successMessage("Update Role and Permisson success", 3000);
            handleCancel();
          }
        }
      }
    } catch (error) {
      errorMessage("Update failed somting wrong !", 3000);
    }
  };
  // cancel
  const handleCancel = () => {
    setRole_data("");
  };

  const dashboardChildren = (
    <Box sx={{ display: "flex", marginLeft: "50px" }}>
      {role_data && multiId.length < 1 ? (
        <FormControlLabel
          label="view"
          control={
            <Checkbox
              checked={updateDashboarView}
              onChange={handleDashboardView}
              sx={{
                color: "grey",
                "&.Mui-checked": {
                  color: "green",
                },
              }}
            />
          }
        />
      ) : (
        <FormControlLabel
          label="view"
          control={
            <Checkbox
              checked={dashboardView}
              onChange={handleDashboardView}
              sx={{
                color: "grey",
                "&.Mui-checked": {
                  color: "green",
                },
              }}
            />
          }
        />
      )}
    </Box>
  );
  const userChildren = (
    <Box sx={{ display: "flex", marginLeft: "50px" }}>
      {role_data && multiId.length < 1 ? (
        <FormControlLabel
          label="create"
          control={
            <Checkbox
              checked={updateUserCreate}
              onChange={handleChange2}
              sx={{
                color: "grey",
                "&.Mui-checked": {
                  color: "green",
                },
              }}
            />
          }
        />
      ) : (
        <FormControlLabel
          label="create"
          control={
            <Checkbox
              checked={createUser}
              onChange={handleChange2}
              sx={{
                color: "grey",
                "&.Mui-checked": {
                  color: "green",
                },
              }}
            />
          }
        />
      )}
      {role_data && multiId.length < 1 ? (
        <FormControlLabel
          label="view"
          control={
            <Checkbox
              checked={updateUserView}
              onChange={handleChange3}
              sx={{
                color: "grey",
                "&.Mui-checked": {
                  color: "green",
                },
              }}
            />
          }
        />
      ) : (
        <FormControlLabel
          label="view"
          control={
            <Checkbox
              checked={viewUser}
              onChange={handleChange3}
              sx={{
                color: "grey",
                "&.Mui-checked": {
                  color: "green",
                },
              }}
            />
          }
        />
      )}

      {role_data && multiId.length < 1 ? (
        <FormControlLabel
          label="edit"
          control={
            <Checkbox
              checked={updateUserEdit}
              onChange={handleChange4}
              sx={{
                color: "grey",
                "&.Mui-checked": {
                  color: "green",
                },
              }}
            />
          }
        />
      ) : (
        <FormControlLabel
          label="edit"
          control={
            <Checkbox
              checked={editUser}
              onChange={handleChange4}
              sx={{
                color: "grey",
                "&.Mui-checked": {
                  color: "green",
                },
              }}
            />
          }
        />
      )}

      {role_data && multiId.length < 1 ? (
        <FormControlLabel
          label="deleted"
          control={
            <Checkbox
              checked={updateUserDelete}
              onChange={handleChange5}
              sx={{
                color: "grey",
                "&.Mui-checked": {
                  color: "green",
                },
              }}
            />
          }
        />
      ) : (
        <FormControlLabel
          label="deleted"
          control={
            <Checkbox
              checked={deleteUser}
              onChange={handleChange5}
              sx={{
                color: "grey",
                "&.Mui-checked": {
                  color: "green",
                },
              }}
            />
          }
        />
      )}
    </Box>
  );
  const filesChildren = (
    <Box sx={{ display: "flex", marginLeft: "50px" }}>
      {role_data && multiId.length < 1 ? (
        <FormControlLabel
          label="create"
          control={
            <Checkbox
              checked={updatCreateFile}
              onChange={handleCreateFiles}
              sx={{
                color: "grey",
                "&.Mui-checked": {
                  color: "green",
                },
              }}
            />
          }
        />
      ) : (
        <FormControlLabel
          label="create"
          control={
            <Checkbox
              checked={createFile}
              onChange={handleCreateFiles}
              sx={{
                color: "grey",
                "&.Mui-checked": {
                  color: "green",
                },
              }}
            />
          }
        />
      )}
      {role_data && multiId.length < 1 ? (
        <FormControlLabel
          label="view"
          control={
            <Checkbox
              checked={updateViewFile}
              onChange={handleViewFile}
              sx={{
                color: "grey",
                "&.Mui-checked": {
                  color: "green",
                },
              }}
            />
          }
        />
      ) : (
        <FormControlLabel
          label="view"
          control={
            <Checkbox
              checked={viewFile}
              onChange={handleViewFile}
              sx={{
                color: "grey",
                "&.Mui-checked": {
                  color: "green",
                },
              }}
            />
          }
        />
      )}
      {role_data && multiId.length < 1 ? (
        <FormControlLabel
          label="edit"
          control={
            <Checkbox
              checked={updateEditFile}
              onChange={handleEditFile}
              sx={{
                color: "grey",
                "&.Mui-checked": {
                  color: "green",
                },
              }}
            />
          }
        />
      ) : (
        <FormControlLabel
          label="edit"
          control={
            <Checkbox
              checked={editFile}
              onChange={handleEditFile}
              sx={{
                color: "grey",
                "&.Mui-checked": {
                  color: "green",
                },
              }}
            />
          }
        />
      )}
      {role_data && multiId.length < 1 ? (
        <FormControlLabel
          label="deleted"
          control={
            <Checkbox
              checked={updateDeletedFile}
              onChange={handleDeleteFile}
              sx={{
                color: "grey",
                "&.Mui-checked": {
                  color: "green",
                },
              }}
            />
          }
        />
      ) : (
        <FormControlLabel
          label="deleted"
          control={
            <Checkbox
              checked={deletedFile}
              onChange={handleDeleteFile}
              sx={{
                color: "grey",
                "&.Mui-checked": {
                  color: "green",
                },
              }}
            />
          }
        />
      )}
      {role_data && multiId.length < 1 ? (
        <FormControlLabel
          label="upload"
          control={
            <Checkbox
              checked={updateUploadFile}
              onChange={handleUploadFile}
              sx={{
                color: "grey",
                "&.Mui-checked": {
                  color: "green",
                },
              }}
            />
          }
        />
      ) : (
        <FormControlLabel
          label="upload"
          control={
            <Checkbox
              checked={uploadFile}
              onChange={handleUploadFile}
              sx={{
                color: "grey",
                "&.Mui-checked": {
                  color: "green",
                },
              }}
            />
          }
        />
      )}
      {role_data && multiId.length < 1 ? (
        <FormControlLabel
          label="download"
          control={
            <Checkbox
              checked={updateDownloadFile}
              onChange={handleDownloadFile}
              sx={{
                color: "grey",
                "&.Mui-checked": {
                  color: "green",
                },
              }}
            />
          }
        />
      ) : (
        <FormControlLabel
          label="download"
          control={
            <Checkbox
              checked={downloadFile}
              onChange={handleDownloadFile}
              sx={{
                color: "grey",
                "&.Mui-checked": {
                  color: "green",
                },
              }}
            />
          }
        />
      )}
      {role_data && multiId.length < 1 ? (
        <FormControlLabel
          label="share"
          control={
            <Checkbox
              checked={updateShareFile}
              onChange={handleShareFile}
              sx={{
                color: "grey",
                "&.Mui-checked": {
                  color: "green",
                },
              }}
            />
          }
        />
      ) : (
        <FormControlLabel
          label="share"
          control={
            <Checkbox
              checked={shareFile}
              onChange={handleShareFile}
              sx={{
                color: "grey",
                "&.Mui-checked": {
                  color: "green",
                },
              }}
            />
          }
        />
      )}
      {role_data && multiId.length < 1 ? (
        <FormControlLabel
          label="exports"
          control={
            <Checkbox
              checked={updateExportFile}
              onChange={handleExportFile}
              sx={{
                color: "grey",
                "&.Mui-checked": {
                  color: "green",
                },
              }}
            />
          }
        />
      ) : (
        <FormControlLabel
          label="exports"
          control={
            <Checkbox
              checked={exportFile}
              onChange={handleExportFile}
              sx={{
                color: "grey",
                "&.Mui-checked": {
                  color: "green",
                },
              }}
            />
          }
        />
      )}
    </Box>
  );
  const shareChildren = (
    <Box sx={{ display: "flex", marginLeft: "50px" }}>
      {role_data && multiId.length < 1 ? (
        <FormControlLabel
          label="create"
          control={
            <Checkbox
              checked={updateShareCreate}
              onChange={handleCreateShare}
              sx={{
                color: "grey",
                "&.Mui-checked": {
                  color: "green",
                },
              }}
            />
          }
        />
      ) : (
        <FormControlLabel
          label="create"
          control={
            <Checkbox
              checked={createShare}
              onChange={handleCreateShare}
              sx={{
                color: "grey",
                "&.Mui-checked": {
                  color: "green",
                },
              }}
            />
          }
        />
      )}
      {role_data && multiId.length < 1 ? (
        <FormControlLabel
          label="view"
          control={
            <Checkbox
              checked={updateShareView}
              onChange={handleViewShare}
              sx={{
                color: "grey",
                "&.Mui-checked": {
                  color: "green",
                },
              }}
            />
          }
        />
      ) : (
        <FormControlLabel
          label="view"
          control={
            <Checkbox
              checked={viewShare}
              onChange={handleViewShare}
              sx={{
                color: "grey",
                "&.Mui-checked": {
                  color: "green",
                },
              }}
            />
          }
        />
      )}
      {role_data && multiId.length < 1 ? (
        <FormControlLabel
          label="edit"
          control={
            <Checkbox
              checked={updateShareEdit}
              onChange={handleEditShare}
              sx={{
                color: "grey",
                "&.Mui-checked": {
                  color: "green",
                },
              }}
            />
          }
        />
      ) : (
        <FormControlLabel
          label="edit"
          control={
            <Checkbox
              checked={editShare}
              onChange={handleEditShare}
              sx={{
                color: "grey",
                "&.Mui-checked": {
                  color: "green",
                },
              }}
            />
          }
        />
      )}
      {role_data && multiId.length < 1 ? (
        <FormControlLabel
          label="delete"
          control={
            <Checkbox
              checked={updateShareDelete}
              onChange={handleDeleteShare}
              sx={{
                color: "grey",
                "&.Mui-checked": {
                  color: "green",
                },
              }}
            />
          }
        />
      ) : (
        <FormControlLabel
          label="delete"
          control={
            <Checkbox
              checked={deleteShare}
              onChange={handleDeleteShare}
              sx={{
                color: "grey",
                "&.Mui-checked": {
                  color: "green",
                },
              }}
            />
          }
        />
      )}
    </Box>
  );

  return (
    <div>
      <Card>
        <CardContent sx={{ mt: 3 }}>
          <Typography variant="h4">
            {role_data && multiId.length < 1
              ? "Update Role and Permission"
              : "Add Role and Permission"}
          </Typography>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={6} md={6}>
                <Item>
                  {role_data && multiId.length < 1 ? (
                    <TextField
                      fullWidth
                      sx={{ mt: 3 }}
                      id="outlined-basic"
                      label="Add Role"
                      variant="outlined"
                      value={role_data}
                      onChange={(e) => setRole_data(e.target.value)}
                    />
                  ) : (
                    <TextField
                      fullWidth
                      sx={{ mt: 3 }}
                      id="outlined-basic"
                      label="Add Role"
                      variant="outlined"
                      value={permissionValue?.name}
                      onChange={(e) =>
                        setPermissionValue({
                          ...permissionValue,
                          name: e.target.value,
                        })
                      }
                    />
                  )}

                  {errMessage && (
                    <Typography variant="body" color="error">
                      {errMessage}
                    </Typography>
                  )}
                </Item>
              </Grid>
              <Grid item xs={6} md={6}>
                <Item>
                  {role_data && multiId.length < 1 ? (
                    <FormControl fullWidth sx={{ mt: 3 }}>
                      <InputLabel id="demo-simple-select-label">
                        Access
                      </InputLabel>
                      <Select
                        label="Access"
                        value={access}
                        onChange={(e) => setAccess(e.target.value)}
                      >
                        <MenuItem value="full">Full</MenuItem>
                        <MenuItem value="limit">Limit</MenuItem>
                      </Select>
                    </FormControl>
                  ) : (
                    <FormControl fullWidth sx={{ mt: 3 }}>
                      <InputLabel id="demo-simple-select-label">
                        Access
                      </InputLabel>
                      <Select
                        label="Access"
                        value={permissionValue.access}
                        onChange={(e) =>
                          setPermissionValue({
                            ...permissionValue,
                            access: e.target.value,
                          })
                        }
                      >
                        <MenuItem value="full">Full</MenuItem>
                        <MenuItem value="limit">Limit</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                </Item>
              </Grid>
            </Grid>
          </Box>
          {permissionValue.access === "limit" ? (
            <Box
              sx={{
                mt: 5,
                minHeight: 10,
                flexGrow: 1,
                maxWidth: 800,
                overflowY: "auto",
              }}
              px={2}
            >
              <Box>
                <Typography variant="h5">Dashboard</Typography>
              </Box>
              {dashboardChildren}
            </Box>
          ) : (
            ""
          )}
          {permissionValue.access === "limit" ? (
            <Box
              sx={{
                minHeight: 10,
                flexGrow: 1,
                maxWidth: 800,
                overflowY: "auto",
              }}
              px={2}
            >
              <Box>
                <Typography variant="h5">Users</Typography>
              </Box>

              {userChildren}
            </Box>
          ) : (
            ""
          )}
          {permissionValue.access === "limit" ? (
            <Box
              sx={{
                minHeight: 10,
                flexGrow: 1,
                maxWidth: 800,
                overflowY: "auto",
              }}
              px={2}
            >
              <Box>
                <Typography variant="h5">Files</Typography>
              </Box>

              {filesChildren}
            </Box>
          ) : (
            ""
          )}
          {permissionValue.access === "limit" ? (
            <Box
              sx={{
                minHeight: 10,
                flexGrow: 1,
                maxWidth: 800,
                overflowY: "auto",
              }}
              px={2}
            >
              <Box>
                <Typography variant="h5">Share</Typography>
              </Box>

              {shareChildren}
            </Box>
          ) : (
            ""
          )}
        </CardContent>

        <CardActions sx={{ mb: 3, ml: 5 }}>
          {role_data && multiId.length < 1 ? (
            <Box sx={{ ml: 2 }}>
              <Button
                variant="contained"
                color="error"
                sx={{ borderRadius: "6px" }}
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                sx={{ ml: 5, borderRadius: "6px" }}
                variant="contained"
                color="primaryTheme"
                onClick={handleUpadate_role_permission}
              >
                Update Permisson
              </Button>
            </Box>
          ) : (
            <Button
              variant="contained"
              color="primaryTheme"
              sx={{ borderRadius: "6px" }}
              onClick={handleAddPermission}
            >
              Add Permisson
            </Button>
          )}
        </CardActions>
      </Card>
    </div>
  );
}

export default ManageRole;
