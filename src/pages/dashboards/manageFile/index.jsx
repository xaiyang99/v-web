import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Paper,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useMemo, useRef, useState } from "react";
import { CSVLink } from "react-csv";

// components
import { useMutation } from "@apollo/client";
import moment from "moment";
import { errorMessage, successMessage } from "../../../components/Alerts";
import {
  ConvertBytetoMBandGB,
  CutfileName,
  indexPagination,
  truncateName,
} from "../../../functions";
import Prints from "../components/Prints";
import * as MUI from "../css/manageFile";
import "./../css/style.css";
import { DELETE_FILE, GET_FILES, UPDATE_FILES } from "./apollo/index";
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
import { DATE_PATTERN_FORMAT } from "../../../utils/date";
import DatePickerV1 from "../components/DatePickerV1";
import DialogDeleteV1 from "../components/DialogDeleteV1";
import DialogFileEditStatus from "../components/DialogFileEditStatus";
import DialogPreviewFileV1 from "../components/DialogPreviewFileV1";
import SelectV1 from "../components/SelectV1";
import useFilter from "./hooks/useFilter";
import useManageFiles from "./hooks/useManageFiles";
import useSelectUsers from "./hooks/useSelectUsers";

const { REACT_APP_BUNNY_URL, REACT_APP_ACCESSKEY_BUNNY } = process.env;

function Index() {
  const theme = useTheme();
  const { user } = useAuth();
  const { t } = useTranslation();
  const filter = useFilter();
  const manageFiles = useManageFiles({ filter: filter.data });
  const selectUsers = useSelectUsers();
  const permission = usePermission(user?._id);
  const [dataForEvents, setDataForEvents] = React.useState({
    action: null,
    type: null,
    data: {},
  });

  const [deleteFile] = useMutation(DELETE_FILE, {
    refetchQueries: [
      {
        query: GET_FILES,
        variables: {
          orderby: "createdAt_DESC",
          limit: 20,
        },
        awaitRefetchQueries: true,
      },
    ],
  });

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [updateFilesManage] = useMutation(UPDATE_FILES);
  const [printOpen, setPrintOpen] = useState(false);
  const [reloading, setReloading] = useState(false);
  const csvInstance = useRef();
  const editHandleClose = () => {
    setEditOpen(false);
  };
  const [deleteType, setDeleteType] = useState("single");

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

  const previewHandleClose = () => {
    setPreviewOpen(false);
    resetDataForEvents();
  };

  const printHanleClose = () => {
    setPrintOpen(false);
  };

  const columns = [
    {
      field: "id",
      headerName: t("_no"),
      width: 50,
      renderCell: (params) => {
        return (
          <div>
            <span>
              {indexPagination({
                filter: filter?.state,
                index: params?.row?.no,
              })}
            </span>
          </div>
        );
      },
    },

    {
      field: "filename",
      headerName: t("_full_name"),
      flex: 1,
      renderCell: (params) => {
        return (
          <div>
            {params?.row?.filename
              ? CutfileName(params?.row?.filename, params?.row?.newFilename)
              : ""}
          </div>
        );
      },
    },
    {
      field: "size",
      headerName: t("_size"),
      flex: 1,
      renderCell: (params) => {
        return <div>{params.row.size ? ConvertBytetoMBandGB(params.row.size) : ""}</div>;
      },
    },
    {
      field: "ip",
      headerName: t("_ip"),
      flex: 1,
      renderCell: (params) => {
        return <div>{params.row.ip ? params.row.ip : ""}</div>;
      },
    },
    {
      field: "owner",
      headerName: t("_owner"),
      flex: 1,
      renderCell: (params) => {
        return <div>{params.row.createdBy.username}</div>;
      },
    },
    {
      field: "status",
      headerName: t("_status"),
      width: 200,
      renderCell: (params) => {
        const status = params.row.status;
        if (status === "active") {
          return (
            <div style={{ color: "green" }}>
              <Chip
                sx={{ backgroundColor: "#dcf6e8", color: "#29c770" }}
                label={status}
                size="small"
              />
            </div>
          );
        } else if (status === "deleted") {
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
        } else if (status === "disabled") {
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
      field: "createdAt",
      headerName: t("_created_at"),
      editable: false,
      renderCell: (params) => moment(params.row.createdAt).format(DATE_PATTERN_FORMAT.date),
      flex: 1,
    },
    {
      field: "totalDownload",
      headerName: t("_total_download"),
      renderCell: (params) => {
        const totalDownload = params.row.totalDownload;
        return totalDownload ? `${totalDownload} times` : "0 time";
      },
      editable: false,
      flex: 1,
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
            }}>
            <NormalButton
              sx={{
                opacity: !permission.hasPermission("file_view") ? 0.5 : "",
                cursor: !permission.hasPermission("file_view") ? "not-allowed" : "",
              }}
              disabled={!permission.hasPermission("file_view")}
              onClick={() =>
                setDataForEvents({
                  action: "preview_file",
                  data: params.row,
                })
              }>
              <Icon.Eye size="20px" color={theme.name === THEMES.DARK ? "white" : "grey"} />
            </NormalButton>
            <NormalButton
              sx={{
                opacity: !permission.hasPermission("file_edit") ? 0.5 : "",
                cursor: !permission.hasPermission("file_edit") ? "not-allowed" : "",
              }}
              disabled={!permission.hasPermission("file_edit")}
              onClick={() =>
                setDataForEvents({
                  action: "edit_status",
                  data: params.row,
                })
              }>
              <Icon.Edit size="20px" color={theme.name === THEMES.DARK ? "white" : "grey"} />
            </NormalButton>
            <NormalButton
              sx={{
                opacity: !permission.hasPermission("file_delete") ? 0.5 : "",
                cursor: !permission.hasPermission("file_delete") ? "not-allowed" : "",
              }}
              disabled={!permission.hasPermission("file_delete")}
              onClick={() => {
                setDeleteType("single");
                setDataForEvents({
                  action: "delete_single",
                  data: params.row,
                });
                setDeleteOpen(true);
              }}>
              <Icon.Trash size="20px" color={theme.name === THEMES.DARK ? "white" : "grey"} />
            </NormalButton>
          </Box>
        );
      },
    },
  ];

  const exportCSV = useMemo(
    () =>
      manageFiles.data?.map((row, index) => {
        const totalDownload = row.totalDownload;
        return {
          id: index + 1,
          name: row.filename,
          size: ConvertBytetoMBandGB(row.size),
          ip: row.ip,
          owner: row.createdBy?.username,
          status: row.status,
          date: moment(row.createdAt).format(DATE_PATTERN_FORMAT.date),
          totalDownload: totalDownload ? `${totalDownload} times` : "0 time",
        };
      }) || [],
    [manageFiles.data],
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
      manageFiles.customGetFiles();
    }
  };

  // delete file;
  const handleDeleteFile = async () => {
    try {
      if (deleteType === "multiple") {
        const selectedData = manageFiles.data.filter((data) =>
          manageFiles.selectedRow.includes(data._id),
        );
        for (let i = 0; i < selectedData.length; i++) {
          let real_path = "";
          let path = selectedData[i]?.newPath;
          if (path == null) {
            real_path = "";
          } else {
            real_path = truncateName(path);
          }
          const userNewName = selectedData[i]?.createdBy?.newName;
          const nestedPath = userNewName
            ? `${userNewName}-${selectedData[i]?.createdBy?._id}`
            : "public";

          const options = {
            method: "DELETE",
            url:
              REACT_APP_BUNNY_URL + `${nestedPath}` + "/" + real_path + selectedData[i].newFilename,
            headers: {
              AccessKey: REACT_APP_ACCESSKEY_BUNNY,
            },
          };

          axios
            .request(options)
            .then(function (response) {
              if (response) {
                deleteFile({
                  variables: {
                    id: selectedData[i]._id,
                  },
                  onCompleted: () => {
                    deleteHandleClose();
                    filter.dispatch({
                      type: filter.ACTION_TYPE.PAGINATION,
                      payload: 1,
                    });
                  },
                });
              }
            })
            .catch(function () {
              errorMessage("Deleted failed!", 2000);
            });
        }
        successMessage("Deleted successfull", 3000);
      } else {
        let real_path = "";
        if (dataForEvents.data.newPath == null) {
          real_path = "";
        } else {
          real_path = truncateName(dataForEvents.data.newPath);
        }
        const userNewName = dataForEvents.data.createdBy.newName;
        const nestedPath = userNewName
          ? `${userNewName}-${dataForEvents.data.createdBy._id}`
          : "public";
        const options = {
          method: "DELETE",
          url:
            REACT_APP_BUNNY_URL +
            `${nestedPath}` +
            "/" +
            real_path +
            dataForEvents.data.newFilename,
          headers: {
            AccessKey: REACT_APP_ACCESSKEY_BUNNY,
          },
        };
        axios
          .request(options)
          .then(function (response) {
            if (response) {
              const deleteFileManage = deleteFile({
                variables: {
                  id: dataForEvents.data._id,
                },
              });
              if (deleteFileManage) {
                successMessage("Deleted successfull", 3000);
              }
              deleteHandleClose();
              filter.dispatch({
                type: filter.ACTION_TYPE.PAGINATION,
                payload: 1,
              });
            }
          })
          .catch(function (error) {
            console.error(error);
            errorMessage("Deleted failed!", 2000);
          });
      }
    } catch (error) {
      errorMessage("Delete Failed try again!");
    }
  };

  const menuOnClick = async (action) => {
    switch (action) {
      case "preview_file":
        setPreviewOpen(true);
        break;
      case "edit_status":
        setEditOpen(true);
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
          path={["files", "manage-files"]}
          readablePath={[t("_file"), t("_manage_file")]}
        />
        <Paper
          sx={{
            mt: (theme) => theme.spacing(3),
            boxShadow: (theme) => theme.baseShadow.secondary,
            flex: "1 1 0%",
          }}>
          <Card sx={{ height: "100%" }}>
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                paddingLeft: "0 !important",
                paddingRight: "0 !important",
              }}>
              <Box
                sx={{
                  padding: (theme) => `0 ${theme.spacing(4)}`,
                }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                  }}>
                  {t("_file_title")}
                </Typography>
                <MUI.ListFilter>
                  <Grid
                    container
                    columnSpacing={5}
                    rowGap={2}
                    sx={{
                      alignItems: "end",
                    }}>
                    <Grid item xs={12} sm={6} lg={3}>
                      <MUI.FilterFile>
                        <SelectV1
                          selectStyle={{
                            height: "35px",
                            minHeight: "35px",
                          }}
                          label={t("_owner")}
                          selectProps={{
                            options: selectUsers.options,
                            onChange: (e) =>
                              filter.dispatch({
                                type: filter.ACTION_TYPE.OWNER,
                                payload: e?.value || null,
                              }),
                            onInputChange: (e) => {
                              selectUsers.getUsers({
                                variables: {
                                  where: {
                                    ...(e && {
                                      username: e,
                                    }),
                                  },
                                  limit: 10,
                                },
                              });
                            },
                            placeholder: t("_owner"),
                          }}
                        />
                      </MUI.FilterFile>
                    </Grid>
                    <Grid item xs={12} sm={6} lg={3}>
                      <MUI.FilterFile>
                        <SelectV1
                          label={t("_status")}
                          selectStyle={{
                            height: "35px",
                            minHeight: "35px",
                          }}
                          selectProps={{
                            onChange: (e) =>
                              filter.dispatch({
                                type: filter.ACTION_TYPE.STATUS,
                                payload: e?.value || null,
                              }),
                            options: [
                              { label: "active", value: "active" },
                              { label: "disabled", value: "disabled" },
                              { label: "deleted", value: "deleted" },
                              { label: "permanent", value: "permanent" },
                            ],
                            placeholder: t("_status"),
                          }}
                        />
                      </MUI.FilterFile>
                    </Grid>
                    <Grid item xs={12} sm={6} lg={3}>
                      <MUI.FilterFile>
                        <SelectV1
                          options={[{ label: "one", value: 1 }]}
                          selectStyle={{
                            height: "35px",
                            minHeight: "35px",
                          }}
                          label={t("_file_type")}
                          selectProps={{
                            onChange: (e) =>
                              filter.dispatch({
                                type: filter.ACTION_TYPE.FILE_TYPE,
                                payload: e?.value || null,
                              }),
                            options: [
                              { label: "document", value: "document" },
                              { label: "image", value: "image" },
                              { label: "video", value: "video" },
                              { label: "audio", value: "audio" },
                              { label: "text", value: "text" },
                              { label: "other", value: "other" },
                            ],
                            placeholder: t("_file_type"),
                          }}
                        />
                      </MUI.FilterFile>
                    </Grid>
                    <Grid item xs={12} sm={6} lg={3}>
                      <MUI.FilterFile>
                        <SelectV1
                          selectStyle={{
                            height: "35px",
                            minHeight: "35px",
                          }}
                          label={t("_most_download")}
                          selectProps={{
                            onChange: (e) =>
                              filter.dispatch({
                                type: filter.ACTION_TYPE.ORDERBY_MOST_DOWNLOAD,
                                payload: e?.value || null,
                              }),
                            options: [
                              { label: "highest", value: "desc" },
                              { label: "lowest", value: "asc" },
                            ],
                            placeholder: t("_most_download"),
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
                  <MUI.ListFilter>
                    <Grid
                      container
                      columnSpacing={5}
                      rowGap={2}
                      sx={{
                        alignItems: "end",
                      }}>
                      <Grid item xs={12} sm={6} lg={3}>
                        <MUI.FilterFile>
                          <DatePickerV1
                            label={t("_start_date")}
                            datePickerProps={{
                              value: filter.state.createdAt.startDate,
                              onChange: (e) =>
                                filter.dispatch({
                                  type: filter.ACTION_TYPE.CREATED_AT_START_DATE,
                                  payload: e,
                                }),
                              onError: () =>
                                filter.dispatch({
                                  type: filter.ACTION_TYPE.CREATED_AT_START_DATE,
                                  payload: null,
                                }),
                              sx: {
                                "& .MuiInputBase-root": {
                                  height: "35px",
                                },
                                InputLabelProps: {
                                  shrink: false,
                                },
                              },
                            }}
                          />
                        </MUI.FilterFile>
                      </Grid>
                      <Grid item xs={12} sm={6} lg={3}>
                        <MUI.FilterFile>
                          <DatePickerV1
                            label={t("_end_date")}
                            datePickerProps={{
                              value: filter.state.createdAt.endDate,
                              onChange: (e) =>
                                filter.dispatch({
                                  type: filter.ACTION_TYPE.CREATED_AT_END_DATE,
                                  payload: e,
                                }),
                              onError: () =>
                                filter.dispatch({
                                  type: filter.ACTION_TYPE.CREATED_AT_END_DATE,
                                  payload: null,
                                }),
                              sx: {
                                "& .MuiInputBase-root": {
                                  height: "35px",
                                },
                              },
                              InputLabelProps: {
                                shrink: false,
                              },
                            }}
                          />
                        </MUI.FilterFile>
                      </Grid>
                      <Grid item xs={12} sm={6} lg={3}>
                        <MUI.FilterFile>
                          <SelectV1
                            selectStyle={{
                              height: "35px",
                              minHeight: "35px",
                            }}
                            label={t("_file_drop")}
                            selectProps={{
                              onChange: (e) =>
                                filter.dispatch({
                                  type: filter.ACTION_TYPE.FILE_DROP,
                                  payload: e?.value || null,
                                }),
                              options: [
                                { label: "all files", value: "null" },
                                { label: "file drop", value: "notnull" },
                              ],
                              placeholder: t("_file_drop"),
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
                  </MUI.ListFilter>
                  <MUI.ListFilter>
                    <Grid
                      container
                      columnSpacing={5}
                      rowGap={3}
                      sx={{
                        alignItems: "end",
                      }}>
                      <Grid item sm={12} md={6} lg={6}>
                        <Grid
                          container
                          columnSpacing={5}
                          sx={{
                            alignItems: "end",
                          }}>
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
                      <Grid item sm={12} md={6} lg={6}>
                        <Box
                          columnGap={5}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                          }}>
                          <MUI.FilterFile sx={{ flexGrow: 1 }}>
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
                                  type: filter.ACTION_TYPE.FILE_NAME,
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

                          <MUI.FilterFile sx={{ width: 200 }}>
                            <SelectV1
                              isDisabled={!permission?.hasPermission("file_edit")}
                              disableLabel
                              options={[{ label: "one", value: 1 }]}
                              selectStyle={{
                                height: "35px",
                                minHeight: "35px",
                              }}
                              {...(theme.name !== THEMES.DARK && {
                                controlStyle: (isFocused) => {
                                  return {
                                    backgroundColor: "#F1F1F2",
                                    borderColor: "#F1F1F2 !important",
                                    ...(!isFocused && {
                                      "&:hover": {
                                        borderColor: "black !important",
                                      },
                                    }),
                                    ...(isFocused && {
                                      /* outline: `1px solid ${theme.palette.primaryTheme.main} !important`, */
                                      borderColor: `${theme.palette.primaryTheme.main} !important`,
                                    }),
                                  };
                                },
                              })}
                              selectProps={{
                                options: [
                                  {
                                    label: (
                                      <Typography
                                        component="div"
                                        sx={{
                                          display: "flex",
                                          alignItems: "center",
                                          columnGap: "5px",
                                        }}>
                                        <Icon.PiFileCsvLightIcon
                                          style={{
                                            display: "flex",
                                            fontSize: "1rem",
                                          }}
                                        />
                                        <Typography
                                          component="div"
                                          sx={{
                                            lineHeight: 0,
                                          }}>
                                          CSV
                                        </Typography>
                                      </Typography>
                                    ),
                                    value: "csv",
                                  },
                                  {
                                    label: (
                                      <Typography
                                        component="div"
                                        sx={{
                                          display: "flex",
                                          alignItems: "center",
                                          columnGap: "5px",
                                        }}>
                                        <Icon.TbPrintIcon
                                          style={{
                                            display: "flex",
                                            fontSize: "1rem",
                                          }}
                                        />
                                        <Typography
                                          component="div"
                                          sx={{
                                            lineHeight: 0,
                                          }}>
                                          PDF
                                        </Typography>
                                      </Typography>
                                    ),
                                    value: "pdf",
                                  },
                                ],
                                onChange: (e) => {
                                  if (e?.value === "pdf") {
                                    setPrintOpen(true);
                                  }
                                  if (e?.value === "csv") {
                                    csvInstance.current.link.click();
                                  }
                                },
                                placeholder: (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      columnGap: (theme) => theme.spacing(1),
                                    }}>
                                    <Icon.TbScreenShare /> {t("_export")}
                                  </Box>
                                ),
                                sx: {
                                  marginTop: 0,
                                  "& .MuiInputBase-root": {
                                    backgroundColor: "rgba(168,170,174,0.2)",
                                    height: "35px",
                                    width: "100%",
                                  },
                                },
                              }}
                            />
                          </MUI.FilterFile>
                          <MUI.FilterFile sx={{ width: 150 }}>
                            <NormalButton
                              {...(manageFiles.selectedRow.length > 1 &&
                                permission?.hasPermission("file_delete") && {
                                  onClick: () => {
                                    setDeleteType("multiple");
                                    setDataForEvents((prevState) => ({
                                      ...prevState,
                                      action: "delete_multiple",
                                    }));
                                  },
                                })}
                              sx={{
                                height: "35px",
                                width: "100%",
                                alignItems: "center",
                                border: "1px solid",
                                padding: (theme) => theme.spacing(3),
                                borderColor:
                                  theme.name === THEMES.DARK
                                    ? "rgba(255,255,255,0.4)"
                                    : "rgba(0,0,0,0.4)",
                                borderRadius: "4px",
                                ...(!permission?.hasPermission("file_delete") ||
                                manageFiles.selectedRow.length <= 1
                                  ? {
                                      cursor: "default",
                                      opacity: 0.5,
                                    }
                                  : {
                                      "&:hover": {
                                        borderColor:
                                          theme.name === THEMES.DARK
                                            ? "rgb(255,255,255)"
                                            : "rgb(0,0,0)",
                                      },
                                    }),
                              }}>
                              <Box
                                sx={{
                                  flex: "1 1 0%",
                                  color:
                                    theme.name === THEMES.DARK ? "rgb(255,255,255)" : "rgb(0,0,0)",
                                }}>
                                {t("_multiple_delete")}
                              </Box>
                              <Box sx={{}}>
                                <Icon.Trash
                                  style={{
                                    fontSize: "1.25rem",
                                    color:
                                      theme.name === THEMES.DARK
                                        ? "rgb(255,255,255)"
                                        : "rgb(0,0,0,0.7)",
                                  }}
                                />
                              </Box>
                            </NormalButton>
                          </MUI.FilterFile>
                        </Box>
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
                  height: "500px",
                  flex: "1 1 0%",
                }}>
                <DataGrid
                  sx={{
                    "& .MuiDataGrid-main": {
                      minHeight: "500px !important",
                    },
                    borderRadius: 0,
                    "& .MuiDataGrid-columnSeparator": { display: "none" },
                    "& .MuiDataGrid-virtualScroller": {
                      overflowX: "scroll",
                    },
                  }}
                  rows={manageFiles.data || []}
                  getRowId={(row) => row._id}
                  columns={columns}
                  AutoGenerateColumns="True"
                  checkboxSelection
                  disableSelectionOnClick
                  disableColumnFilter
                  disableColumnMenu
                  hideFooter
                  onSelectionModelChange={(ids) => {
                    manageFiles.setSelectedRow(ids);
                  }}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}>
                {manageFiles.total > 0 && (
                  <Box
                    sx={{
                      padding: (theme) => theme.spacing(4),
                    }}>
                    Showing 1 to 10 of {manageFiles.total} entries
                  </Box>
                )}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    padding: (theme) => theme.spacing(4),
                    flex: "1 1 0%",
                  }}>
                  <PaginationStyled
                    currentPage={filter.data.currentPageNumber}
                    total={Math.ceil(manageFiles.total / filter.data.pageLimit)}
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
        <DialogFileEditStatus
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
          onConfirm={handleDeleteFile}
        />
        <DialogPreviewFileV1
          data={{
            ...dataForEvents.data,
            filename: dataForEvents.data.filename
              ? CutfileName(dataForEvents.data.filename, dataForEvents.data.newFilename)
              : "",
            owner: dataForEvents.data.createdBy?.username,
            date: dataForEvents.data.createdAt,
          }}
          isOpen={previewOpen}
          onClose={previewHandleClose}
        />
        <Prints
          open={printOpen}
          onClose={printHanleClose}
          exportCSV={exportCSV.map((data) => {
            return {
              ...data,
              name: data.name,
              size: data.size,
              ip: data.ip,
              owner: data.createdBy?.username,
              status: data.status,
              date: data.date,
              totalDownload: data.totalDownload,
            };
          })}
        />
      </Box>
    </>
  );
}

export default Index;
