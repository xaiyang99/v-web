import { useLazyQuery } from "@apollo/client";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Paper,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { useMemo, useRef, useState } from "react";
import { CSVLink } from "react-csv";

// components
import { useMutation } from "@apollo/client";
import * as MUI from "../css/manageFile";
// import useAuth from "../../../hooks/useAuth";
import { successMessage } from "../../../components/Alerts";
import { indexPagination } from "../../../functions";
import { UPDATE_FILES } from "../manageFile/apollo";
import "./../css/style.css";
// icon
import { useTranslation } from "react-i18next";
import "react-responsive-pagination/themes/classic.css";
import BreadcrumbNavigate from "../../../components/BreadcrumbNavigate";
import NormalButton from "../../../components/NormalButton";
import PaginationStyled from "../../../components/PaginationStyled";
import { THEMES } from "../../../constants";
import useAuth from "../../../hooks/useAuth";
import usePermission from "../../../hooks/usePermission";
import * as Icon from "../../../icons/icons";
import DialogDeleteV1 from "../components/DialogDeleteV1";
import FileEditStatusDialog from "../components/DialogFileEditStatus";
import DialogManageRoleV1 from "../components/DialogManageRoleV1";
import DialogPreviewFileV1 from "../components/DialogPreviewFileV1";
import SelectV1 from "../components/SelectV1";
import {
  GET_PERMISSION_DETAIL_STAFFS,
  GET_PERMISSION_STAFFS,
  MUTATION_CREATE_PERMISSION_DETAIL_STAFF,
  MUTATION_CREATE_ROLE_STAFF,
  MUTATION_DELETE_PERMISSION_DETAIL_STAFF,
  MUTATION_DELETE_ROLE_STAFF,
  // MUTATION_UPDATE_PERMISSION_STAFF,
  MUTATION_UPDATE_ROLE_STAFF,
} from "./apollo";
import useFilter from "./hooks/useFilter";
import useManagePermission from "./hooks/useManagePermissions";
import useManageRoles from "./hooks/useManageRoles";
import useSelectRoles from "./hooks/useSelectRoles";

function Index() {
  const theme = useTheme();
  const { t } = useTranslation();
  //data hooks
  const filter = useFilter();
  const { user } = useAuth();
  const permission = usePermission(user?._id);
  const manageRoles = useManageRoles({ filter: filter.data });
  const managePermission = useManagePermission();
  const selectRoles = useSelectRoles();
  const [dataForEvents, setDataForEvents] = React.useState({
    action: null,
    type: null,
    data: {},
  });

  const [getPermissionDetailStaffs] = useLazyQuery(
    GET_PERMISSION_DETAIL_STAFFS,
    {
      fetchPolicy: "no-cache",
    },
  );

  /* test */

  const [getPermissionStaffs] = useLazyQuery(GET_PERMISSION_STAFFS, {
    fetchPolicy: "no-cache",
  });

  const [createRole] = useMutation(MUTATION_CREATE_ROLE_STAFF);
  const [updateRole] = useMutation(MUTATION_UPDATE_ROLE_STAFF);
  const [createPermissionDetail] = useMutation(
    MUTATION_CREATE_PERMISSION_DETAIL_STAFF,
  );
  // const [updatePermissionDetail] = useMutation(
  //   MUTATION_UPDATE_PERMISSION_STAFF
  // );
  const [deletePermissionDetail] = useMutation(
    MUTATION_DELETE_PERMISSION_DETAIL_STAFF,
  );
  const [deleteRole] = useMutation(MUTATION_DELETE_ROLE_STAFF);

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [createRoleOpen, setCreateRoleOpen] = useState(false);
  const [editRoleOpen, setEditRoleOpen] = useState(false);
  const [updateFilesManage] = useMutation(UPDATE_FILES);
  const [reloading, setReloading] = useState(false);
  const csvInstance = useRef();
  const editHandleClose = () => {
    setEditOpen(false);
  };

  // const [deleteType, setDeleteType] = useState("single");
  const resetDataForEvents = () => {
    setDataForEvents((state) => ({
      ...state,
      action: null,
    }));
  };

  const deleteHandleClose = () => {
    setDeleteOpen(false);
    resetDataForEvents();
  };

  const handleDeleteRole = () => {
    deleteRole({
      variables: {
        where: {
          _id: dataForEvents.data._id,
        },
      },
      onCompleted: () => {
        successMessage("Deleted successfully", 3000);
        filter.dispatch({
          type: filter.ACTION_TYPE.PAGINATION,
          payload: 1,
        });
      },
    });
  };

  const previewHandleClose = () => {
    setPreviewOpen(false);
    resetDataForEvents();
  };

  const createRoleHandleClose = () => {
    setCreateRoleOpen(false);
    resetDataForEvents();
  };

  const handleCreateRole = async (values, permissions) => {
    await createRole({
      variables: {
        data: {
          status: "active",
          name: values.name,
        },
      },
      onCompleted: async (role) => {
        await Promise.all(
          permissions.map(async (permission) => {
            return Promise.all(
              permission[permission.groupName].map(async (eachPermission) => {
                for (const [permissionName, permissionStatus] of Object.entries(
                  eachPermission,
                )) {
                  const [data] =
                    (
                      await getPermissionStaffs({
                        variables: {
                          where: {
                            name: permissionName,
                            groupName: permission.groupName,
                          },
                        },
                      })
                    )?.data?.permissions_staffs?.data || [];
                  if (data) {
                    if (permissionStatus?.isCreated) {
                      return await createPermissionDetail({
                        variables: {
                          data: {
                            roleID: role.createRole_staff._id,
                            permisionID: data._id,
                          },
                        },
                      });
                    }
                  }
                }
              }),
            );
          }),
        );
        successMessage("Created successfully", 3000);
        filter.dispatch({
          type: filter.ACTION_TYPE.PAGINATION,
          payload: 1,
        });
        createRoleHandleClose();
      },
    });
  };

  const handleEditRole = async (values, permissions) => {
    await updateRole({
      variables: {
        where: {
          _id: values.roleId,
        },
        data: {
          name: values.name,
        },
      },
      onCompleted: async () => {
        await Promise.all(
          permissions.map(async (permission) => {
            return Promise.all(
              permission[permission.groupName]
                .filter((eachPermission) => eachPermission.isActive)
                .map(async (eachPermission) => {
                  for (const [
                    permissionName,
                    permissionStatus,
                  ] of Object.entries(eachPermission)) {
                    const [data] =
                      (
                        await getPermissionStaffs({
                          variables: {
                            where: {
                              name: permissionName,
                              groupName: permission.groupName,
                            },
                          },
                        })
                      )?.data?.permissions_staffs?.data || [];
                    if (data) {
                      if (permissionStatus?.isUpdated) {
                        return await createPermissionDetail({
                          variables: {
                            data: {
                              roleID: values.roleId,
                              permisionID: data._id,
                            },
                          },
                        });
                      }
                      if (permissionStatus?.isDeleted) {
                        const permissionDetailId = (
                          await getPermissionDetailStaffs({
                            variables: {
                              where: {
                                roleID: values.roleId,
                                permisionID: data._id,
                              },
                            },
                          })
                        ).data.detail_staff_permisions.data?.[0]._id;
                        if (permissionDetailId) {
                          return await deletePermissionDetail({
                            variables: {
                              where: {
                                _id: permissionDetailId,
                              },
                            },
                          });
                        }
                      }
                    }
                  }
                }),
            );
          }),
        );
        successMessage("Updated successfully", 3000);
        manageRoles.customGetRoles();
        editRoleHandleClose();
      },
    });
  };

  const editRoleHandleClose = () => {
    setEditRoleOpen(false);
    resetDataForEvents();
  };

  const columns = [
    {
      field: "id",
      headerName: t("_no"),
      width: 50,
      renderCell: (params) => {
        const no = params.row.no;
        return (
          <div>
            {indexPagination({
              filter: {
                pageLimit: filter.data.pageLimit,
                currentPageNumber: filter.data.currentPageNumber,
              },
              index: no,
            })}
          </div>
        );
      },
    },
    {
      field: "name",
      headerName: t("_role"),
      flex: 1,
    },
    {
      field: "status",
      headerName: t("_status"),
      width: 200,
      renderCell: (params) => {
        const status = params.row.status;
        if (status === "active" || status === "success") {
          return (
            <div style={{ color: "green" }}>
              <Chip
                sx={{ backgroundColor: "#dcf6e8", color: "#29c770" }}
                label={status}
                size="small"
              />
            </div>
          );
        } else if (status === "deleted" || status === "inactive") {
          return (
            <div>
              <Chip
                sx={{
                  backgroundColor: "rgba(255, 159, 67,0.16)",
                  color: "rgb(255, 159, 67)",
                }}
                label={status}
                color="error"
                size="small"
              />
            </div>
          );
        } else if (status === "disabled" || status === "checking") {
          return (
            <div>
              <Chip
                sx={{
                  backgroundColor: "rgba(168, 170, 174,0.16)",
                  color: "rgb(168, 170, 174)",
                }}
                label={status}
                size="small"
              />
            </div>
          );
        } else {
          return (
            <div>
              <Chip
                sx={{
                  backgroundColor: "rgba(234, 84, 85,0.16)",
                  color: "rgb(234, 84, 85)",
                }}
                label={status}
                size="small"
              />
            </div>
          );
        }
      },
    },
    {
      field: "actions",
      headerName: t("_action"),
      headerAlign: "center",
      align: "center",
      sortable: false,
      renderCell: (params) => {
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              columnGap: (theme) => theme.spacing(2),
            }}
          >
            <Tooltip
              title={
                !permission?.hasPermission("role_edit")
                  ? "No permission"
                  : "Edit"
              }
            >
              <NormalButton
                sx={{
                  cursor: permission?.hasPermission("role_edit")
                    ? "pointer"
                    : "not-allowed",
                  opacity: permission?.hasPermission("role_edit") ? 1 : 0.5,
                }}
                onClick={() => {
                  if (permission?.hasPermission("role_edit")) {
                    setDataForEvents({
                      action: "edit_role",
                      data: params.row,
                    });
                  }
                }}
              >
                <Icon.Edit
                  size="20px"
                  color={theme.name === THEMES.DARK ? "white" : "grey"}
                />
              </NormalButton>
            </Tooltip>
            <Tooltip
              title={
                !permission?.hasPermission("role_delete")
                  ? "No permission"
                  : "delete"
              }
            >
              <NormalButton
                sx={{
                  cursor: permission?.hasPermission("role_delete")
                    ? "pointer"
                    : "not-allowed",
                  opacity: permission?.hasPermission("role_delete") ? 1 : 0.5,
                }}
                onClick={() => {
                  if (permission?.hasPermission("role_delete")) {
                    setDataForEvents({
                      action: "delete_single",
                      data: params.row,
                    });
                    setDeleteOpen(true);
                  }
                }}
              >
                <Icon.Trash
                  size="20px"
                  color={theme.name === THEMES.DARK ? "white" : "grey"}
                />
              </NormalButton>
            </Tooltip>
          </Box>
        );
      },
    },
  ];

  const exportCSV = useMemo(
    () =>
      manageRoles.data?.map((row, index) => ({
        id: index + 1,
        status: row.status,
      })) || [],
    [manageRoles.data],
  );

  // edit file
  const handleEditFile = async (status) => {
    const updateFiles = await updateFilesManage({
      variables: {
        data: {
          status: status,
        },
        where: {
          _id: dataForEvents.data._id,
        },
      },
    });
    if (updateFiles?.data?.updateFiles?._id) {
      successMessage("update file success", 3000);
      editHandleClose();
      manageRoles.customGetRoles();
    }
  };

  const menuOnClick = async (action) => {
    switch (action) {
      case "edit_role":
        setEditRoleOpen(true);
        break;
      case "delete_multiple":
        setDeleteOpen(true);
        setReloading(!reloading);
        break;
      case "delete_single":
        setDeleteOpen(true);
        setReloading(!reloading);
        break;
      default:
        return;
    }
  };

  React.useEffect(() => {
    if (
      dataForEvents.action &&
      (dataForEvents.data || dataForEvents.action === "delete_multiple")
    ) {
      menuOnClick(dataForEvents.action);
    }
  }, [dataForEvents.action]);

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <BreadcrumbNavigate
          separatorIcon={<Icon.ForeSlash />}
          path={["roles-and-permissions", "roles"]}
          readablePath={["Roles & Permissions", "Roles"]}
        />
        <Paper
          sx={{
            mt: (theme) => theme.spacing(3),
            boxShadow: (theme) => theme.baseShadow.secondary,
            flex: "1 1 0%",
          }}
        >
          <Card sx={{ height: "100%" }}>
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                paddingLeft: "0 !important",
                paddingRight: "0 !important",
              }}
            >
              <Box
                sx={{
                  padding: (theme) => `0 ${theme.spacing(4)}`,
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                  }}
                >
                  {t("_role_title")}
                </Typography>
                <MUI.ListFilter>
                  <MUI.ListFilter>
                    <Grid
                      container
                      columnSpacing={5}
                      sx={{
                        alignItems: "end",
                      }}
                    >
                      <Grid item xs={6} sm={6} md={6} lg={6}>
                        <Grid
                          container
                          columnSpacing={5}
                          sx={{
                            alignItems: "end",
                          }}
                        >
                          <Grid item xs={5} sm={5} md={4} lg={3}>
                            <MUI.FilterFile>
                              <SelectV1
                                disableLabel
                                selectStyle={{
                                  height: "35px",
                                  minHeight: "35px",
                                }}
                                selectProps={{
                                  disableClear: true,
                                  onChange: (e) =>
                                    filter.dispatch({
                                      type: filter.ACTION_TYPE.PAGE_ROW,
                                      payload: e?.value || null,
                                    }),
                                  options: [
                                    { label: 10, value: 10 },
                                    { label: 30, value: 30 },
                                    { label: 50, value: 50 },
                                    { label: 100, value: 100 },
                                  ],
                                  defaultValue: [{ label: 10, value: 10 }],
                                  sx: {
                                    "& .MuiInputBase-root": {
                                      height: "35px",
                                      width: "100%",
                                    },
                                  },
                                }}
                              />
                            </MUI.FilterFile>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={6} sm={6} md={6} lg={6}>
                        <Grid
                          container
                          columnSpacing={5}
                          sx={{
                            alignItems: "end",
                          }}
                        >
                          <Grid item xs={6} sm={6} md={6} lg={6}>
                            <MUI.FilterFile>
                              <TextField
                                sx={{
                                  width: "100%",
                                  "& .MuiInputBase-root": {
                                    input: {
                                      "&::placeholder": {
                                        opacity: 1,
                                        color: "#9F9F9F",
                                      },
                                    },
                                  },
                                }}
                                onChange={(e) => {
                                  filter.dispatch({
                                    type: filter.ACTION_TYPE.NAME,
                                    payload: e.target.value,
                                  });
                                }}
                                placeholder={t("_search")}
                                size="small"
                                InputLabelProps={{
                                  shrink: false,
                                }}
                              />
                            </MUI.FilterFile>
                          </Grid>
                          <Grid item xs={3} sm={3} md={3} lg={3}>
                            <MUI.FilterFile>
                              <SelectV1
                                disableLabel
                                selectStyle={{
                                  height: "35px",
                                  minHeight: "35px",
                                }}
                                label="Select Role"
                                selectProps={{
                                  options: selectRoles.options,
                                  onChange: (e) =>
                                    filter.dispatch({
                                      type: filter.ACTION_TYPE.NAME,
                                      payload: e?.value || null,
                                    }),
                                  onInputChange: (e) => {
                                    selectRoles.getRoles({
                                      variables: {
                                        where: {
                                          ...(e && {
                                            name: e,
                                          }),
                                        },
                                        limit: 10,
                                      },
                                    });
                                  },
                                  placeholder: t("_select_role"),
                                }}
                              />
                            </MUI.FilterFile>
                          </Grid>
                          <Grid item xs={3} sm={3} md={3} lg={3}>
                            <MUI.FilterFile>
                              <NormalButton
                                onClick={() => {
                                  if (
                                    permission?.hasPermission("role_create")
                                  ) {
                                    setDataForEvents((prevState) => ({
                                      ...prevState,
                                      data: {},
                                    }));
                                    setCreateRoleOpen(true);
                                  }
                                }}
                                sx={{
                                  height: "35px",
                                  width: "100%",
                                  alignItems: "center",
                                  border: "1px solid",
                                  padding: (theme) => theme.spacing(3),
                                  borderColor: (theme) =>
                                    theme.palette.primaryTheme.main,
                                  backgroundColor: (theme) =>
                                    theme.palette.primaryTheme.main,
                                  borderRadius: "4px",
                                  color: "white !important",
                                  justifyContent: "center",
                                  ...(!permission?.hasPermission("role_create")
                                    ? {
                                        cursor: "not-allowed",
                                        opacity: 0.5,
                                      }
                                    : {
                                        opacity: 1,
                                      }),
                                }}
                              >
                                {t("_create_new")}
                              </NormalButton>
                            </MUI.FilterFile>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </MUI.ListFilter>
                  <CSVLink data={exportCSV} separator={","} ref={csvInstance} />
                </MUI.ListFilter>
              </Box>
              &nbsp;
              <Box
                style={{
                  width: "100%",
                  flex: "1 1 0%",
                }}
              >
                <DataGrid
                  sx={{
                    "& .MuiDataGrid-main": {
                      minHeight: "500px !important",
                    },
                    borderRadius: 0,
                    height: "100% !important",
                    "& .MuiDataGrid-columnSeparator": { display: "none" },
                    "& .MuiDataGrid-virtualScroller": {
                      overflowX: "hidden",
                    },
                  }}
                  rows={manageRoles.data || []}
                  getRowId={(row) => row._id}
                  columns={columns}
                  AutoGenerateColumns="True"
                  disableSelectionOnClick
                  disableColumnSelector
                  disableColumnFilter
                  disableColumnMenu
                  hideFooter
                  onSelectionModelChange={(ids) => {
                    manageRoles.setSelectedRow(ids);
                  }}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {manageRoles.total > 0 && (
                  <Box
                    sx={{
                      padding: (theme) => theme.spacing(4),
                    }}
                  >
                    Showing 1 to 10 of {manageRoles.total} entries
                  </Box>
                )}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    padding: (theme) => theme.spacing(4),
                    flex: "1 1 0%",
                  }}
                >
                  <PaginationStyled
                    currentPage={filter.data.currentPageNumber}
                    total={Math.ceil(manageRoles.total / filter.data.pageLimit)}
                    setCurrentPage={(e) =>
                      filter.dispatch({
                        type: filter.ACTION_TYPE.PAGINATION,
                        payload: e,
                      })
                    }
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Paper>
        <FileEditStatusDialog
          isOpen={editOpen}
          status={dataForEvents.data?.status || null}
          onClose={() => {
            setEditOpen(false);
            resetDataForEvents();
          }}
          onSave={handleEditFile}
        />
        <DialogDeleteV1
          isOpen={deleteOpen}
          onClose={deleteHandleClose}
          onConfirm={handleDeleteRole}
        />
        <DialogPreviewFileV1
          data={{
            ...dataForEvents.data,
            owner: dataForEvents.data.createdBy?.username,
            date: dataForEvents.data.createdAt,
          }}
          isOpen={previewOpen}
          onClose={previewHandleClose}
        />
        <DialogManageRoleV1
          title={t("_create_role_title")}
          onSubmit={handleCreateRole}
          onClose={createRoleHandleClose}
          isOpen={createRoleOpen}
          permissionData={managePermission.data?.map((data) => {
            return {
              _id: data._id,
              permissionName: data.name,
              groupName: data.groupName,
              value: {
                [data.groupName]: {
                  ...Object.assign(
                    {},
                    ...["view", "create", "edit", "delete"].map(
                      (permissionName) => {
                        return {
                          [permissionName]: {
                            value: false,
                            isDisabled: !managePermission.permissions[
                              data.groupName
                            ].some((data) => data.name === permissionName),
                          },
                        };
                      },
                    ),
                  ),
                },
              },
            };
          })}
        />
        <DialogManageRoleV1
          title={t("_edit_role_title")}
          onSubmit={handleEditRole}
          onClose={editRoleHandleClose}
          isOpen={editRoleOpen}
          roleId={dataForEvents.data._id}
          roleName={dataForEvents.data.name}
          permissionData={managePermission.data?.map((data) => {
            return {
              _id: data._id,
              permissionName: data.name,
              groupName: data.groupName,
              value: {
                [data.groupName]: {
                  ...Object.assign(
                    {},
                    ...["view", "create", "edit", "delete"].map(
                      (permissionName) => {
                        return {
                          [permissionName]: {
                            value: dataForEvents.data.permision?.some(
                              (userPermission) => {
                                return (
                                  userPermission.name === permissionName &&
                                  userPermission.groupName === data.groupName
                                );
                              },
                            ),
                            isDisabled: !managePermission.permissions[
                              data.groupName
                            ].some((data) => data.name === permissionName),
                          },
                        };
                      },
                    ),
                  ),
                },
              },
            };
          })}
        />
      </Box>
    </>
  );
}

export default Index;
