import { useMutation } from "@apollo/client";
import { createTheme } from "@mui/material/styles";
import React, { useMemo, useRef, useState } from "react";
// component
import { errorMessage, successMessage } from "../../../components/Alerts";
import { DateOfNumber, indexPagination } from "../../../functions";
import { MUTATION_UPDATE_USER, TWO_FA_GENERATE, TWO_FA_USER } from "./apollo";
// material ui component and icons
import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  InputLabel,
  Paper,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { CSVLink } from "react-csv";
import { useTranslation } from "react-i18next";
import NormalButton from "../../../components/NormalButton";
import PaginationStyled from "../../../components/PaginationStyled";
import { THEMES } from "../../../constants";
import useAuth from "../../../hooks/useAuth";
import usePermission from "../../../hooks/usePermission";
import * as Icon from "../../../icons/icons";
import DatePickerV1 from "../components/DatePickerV1";
import DialogDeleteV1 from "../components/DialogDeleteV1";
import UserEditStatusDialog from "../components/DialogFileEditStatus";
import DialogPreviewUser from "../components/DialogPreviewUser";
import DialogQRCode from "../components/DialogQRCode";
import SelectV1 from "../components/SelectV1";
import * as MUI from "../css/manageFile";
import useFilter from "../manageFile/hooks/useFilter";
import "./../css/style.css";
import useManageUser from "./hooks/useManageUser";
import UsePrint from "./hooks/usePrint";

function Main() {
  const theme = createTheme();
  const { t } = useTranslation();
  const isMobile = useMediaQuery("(max-width:768px)");
  const [generateTwoFa] = useMutation(TWO_FA_GENERATE);
  const [updateUser] = useMutation(MUTATION_UPDATE_USER);
  const [sendMail] = useMutation(TWO_FA_USER);
  const filter = useFilter();
  const manageUsers = useManageUser({ filter: filter.data });
  const isCanMultipleDelete = manageUsers.selectedRow.length > 1;
  const { user } = useAuth();
  const permission = usePermission(user?._id);
  const [dataForEvents, setDataForEvents] = React.useState({
    action: null,
    type: null,
    data: {},
  });

  // delete dialog
  const [printOpen, setPrintOpen] = useState(false);
  const [deleteType, setDeleteType] = useState("single");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [genQrcode, setGenQrcode] = useState(false);
  const [reloading, setReloading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [multiSeleted, setMultiSeleted] = useState([]);
  const csvInstance = useRef();

  // function popup
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
  const genQrcodeClose = () => {
    setGenQrcode(false);
    resetDataForEvents();
  };

  const printHanleClose = () => {
    setPrintOpen(false);
  };

  const handleDeleteUser = async () => {
    try {
      if (deleteType === "multiple") {
        const selectedData = manageUsers.data.filter((data) =>
          manageUsers.selectedRow.includes(data._id),
        );
        for (let i = 0; i < selectedData?.length; i++) {
          await updateUser({
            variables: {
              id: selectedData[i]?._id,
              body: {
                status: "deleted",
              },
            },
            onCompleted: (data) => {
              if (data?.updateUser) {
                manageUsers.customUsers();
              }
            },
          });
        }
        successMessage("Deleted User success!!", 3000);
      } else {
        await updateUser({
          variables: {
            id: dataForEvents.data?._id,
            body: {
              status: "deleted",
            },
          },
          onCompleted: (data) => {
            if (data?.updateUser) {
              successMessage("Deleted User success", 3000);
              manageUsers.customUsers();
            }
          },
        });
      }
    } catch (error) {
      errorMessage("Deleted User failed");
    }
  };

  const menuOnClick = async (action) => {
    switch (action) {
      case "preview":
        setPreviewOpen(true);
        break;
      case "edit":
        setEditOpen(true);
        break;
      case "delete_multiple":
        setDeleteOpen(true);
        setReloading(!reloading);
        break;
      case "delete_single":
        if (dataForEvents?.data?.status === "deleted") {
          errorMessage("User aready deleted", 3000);
          resetDataForEvents();
        } else {
          setDeleteOpen(true);
          setReloading(!reloading);
        }
        break;
      case "gen_qrcode":
        handleGenerateQrcode();
        break;
      case "sendQRcode":
        handleSendQRcode();
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

  const handleSendQRcode = async () => {
    await sendMail({
      variables: {
        input: {
          newName: dataForEvents?.data?.newName,
          email: dataForEvents?.data?.email,
        },
      },
      onCompleted: (data) => {
        successMessage(`Send qrcode to ${data?.send2FA?.email}.`, 2000);
        resetDataForEvents();
        genQrcodeClose();
      },
    });
  };

  const handleGenerateQrcode = async () => {
    await generateTwoFa({
      variables: {
        id: dataForEvents.data?._id,
      },
      onCompleted: (data) => {
        if (data?.create2FA?._id) {
          manageUsers.customUsers();
          setDataForEvents({
            action: "",
            data: {
              ...dataForEvents?.data,
              base32: data?.create2FA?.twoFactorSecret,
              otpQRcode: data?.create2FA?.twoFactorQrCode,
            },
          });
          setGenQrcode(true);
        }
      },
    });
  };

  const handleEditUser = async (status) => {
    await updateUser({
      variables: {
        id: parseInt(dataForEvents.data?._id),
        body: {
          status: status,
        },
      },
      onCompleted: (data) => {
        if (data.updateUser?._id) {
          successMessage(`${status} user`, 3000);
          manageUsers.customUsers();
        }
      },
    });
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
      field: "firstName",
      headerName: t("_full_name"),
      flex: 1,
      minWidth: 200,
      renderCell: (params) => {
        return (
          <div>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {params?.row?.profile && (
                <img
                  src={
                    process.env.REACT_APP_BUNNY_PULL_ZONE +
                    params?.row?.newName +
                    "-" +
                    params?.row?._id +
                    "/" +
                    process.env.REACT_APP_ZONE_PROFILE +
                    "/" +
                    params?.row?.profile
                  }
                  alt=""
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                  }}
                />
              )}
              &nbsp; {params?.row?.firstName} {params?.row?.lastName}
            </Box>
          </div>
        );
      },
    },
    { field: "username", headerName: t("_username"), flex: 1, minWidth: 150 },
    {
      field: "gender",
      headerName: t("_gender"),
      flex: 1,
      minWidth: 70,
    },
    { field: "email", headerName: "Email", flex: 1, minWidth: 200 },
    {
      field: "country",
      headerName: t("_country"),
      flex: 1,
      minWidth: 100,
    },

    {
      field: "createdAt",
      headerName: t("_created_at"),
      flex: 1,
      minWidth: 100,
      renderCell: (params) => {
        return <span>{DateOfNumber(params.row.createdAt)}</span>;
      },
    },
    {
      field: "deactive",
      headerName: t("_status"),
      flex: 1,
      minWidth: 70,

      renderCell: (params) => {
        const status = params.row.status;
        if (status === "active") {
          return (
            <div style={{ color: "green" }}>
              <Chip
                sx={{ backgroundColor: "#dcf6e8", color: "#29c770" }}
                label={t("_active_title")}
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
                label={t("_deleted_title")}
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
                label={t("_disable_title")}
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
      field: "action",
      headerName: t("_action"),
      flex: 1,
      minWidth: 120,
      hideable: true,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const { email } = params.row;
        const isCanGenQrCode =
          permission?.hasPermission("customer_edit") && email;
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
                !permission?.hasPermission("customer_view")
                  ? "No permission"
                  : "view"
              }
            >
              <NormalButton
                sx={{
                  cursor: permission?.hasPermission("customer_view")
                    ? "pointer"
                    : "not-allowed",
                  opacity: permission?.hasPermission("customer_view") ? 1 : 0.5,
                }}
                onClick={() => {
                  if (permission?.hasPermission("customer_view")) {
                    setDataForEvents({
                      action: "preview",
                      data: params.row,
                    });
                  }
                }}
              >
                <Icon.Eye
                  size="20px"
                  color={theme.name === THEMES.DARK ? "white" : "grey"}
                />
              </NormalButton>
            </Tooltip>
            <Tooltip
              title={
                !permission?.hasPermission("customer_edit")
                  ? "No permission"
                  : "gen new qrcode"
              }
            >
              <NormalButton
                sx={{
                  cursor: isCanGenQrCode ? "pointer" : "not-allowed",
                  opacity: isCanGenQrCode ? 1 : 0.5,
                }}
                {...(isCanGenQrCode && {
                  onClick: () => {
                    setDataForEvents({
                      action: "gen_qrcode",
                      data: params.row,
                    });
                  },
                })}
              >
                <Icon.PiQr
                  size="20px"
                  color={theme.name === THEMES.DARK ? "white" : "grey"}
                />
              </NormalButton>
            </Tooltip>
            <Tooltip
              title={
                !permission?.hasPermission("customer_edit")
                  ? "No permission"
                  : "edit"
              }
            >
              <NormalButton
                sx={{
                  cursor: permission?.hasPermission("customer_edit")
                    ? "pointer"
                    : "not-allowed",
                  opacity: permission?.hasPermission("customer_edit") ? 1 : 0.5,
                }}
                onClick={() => {
                  {
                    if (permission?.hasPermission("customer_edit")) {
                      setDataForEvents({
                        action: "edit",
                        data: params.row,
                      });
                    }
                  }
                }}
              >
                <Icon.Edit
                  size="20px"
                  color={theme.name === THEMES.DARK ? "white" : "grey"}
                />
              </NormalButton>
            </Tooltip>
            {!isCanMultipleDelete && (
              <Tooltip
                title={
                  params.row.status === "deleted"
                    ? "Deleted"
                    : !permission?.hasPermission("customer_delete")
                      ? "No permission"
                      : "Delete"
                }
              >
                <NormalButton
                  sx={{
                    cursor:
                      permission?.hasPermission("customer_delete") &&
                      params.row.status !== "deleted"
                        ? "pointer"
                        : "not-allowed",
                    opacity:
                      permission?.hasPermission("customer_delete") &&
                      params.row.status !== "deleted"
                        ? 1
                        : 0.5,
                  }}
                  onClick={() => {
                    if (
                      permission?.hasPermission("customer_delete") &&
                      params?.row?.status !== "deleted"
                    ) {
                      setDeleteType("single");
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
            )}
          </Box>
        );
      },
    },
  ];

  const exportCSV = useMemo(
    () =>
      manageUsers.data?.map((row, index) => {
        return {
          id: index + 1,
          FirstName: row.firstName,
          LastName: row.lastName,
          Useraname: row.username,
          Gender: row.gender,
          Email: row.email,
          Country: row.country,
          Profile: row.profile,
          CreatedAt: DateOfNumber(row.createdAt),
          Status: row.status,
        };
      }) || [],
    [manageUsers.data],
  );

  return (
    <React.Fragment>
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
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
                  {t("_customer_title")}
                </Typography>
                <MUI.ListFilter>
                  <Grid
                    container
                    columnSpacing={5}
                    sx={{
                      alignItems: "end",
                    }}
                  >
                    <Grid item xs={6} sm={3} md={3} lg={3}>
                      <MUI.FilterFile>
                        <SelectV1
                          label={t("_country")}
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
                              { label: t("_active_title"), value: "active" },
                              { label: t("_disable_title"), value: "disabled" },
                              { label: t("_deleted_title"), value: "deleted" },
                            ],
                            placeholder: t("_select_country"),
                          }}
                        />
                      </MUI.FilterFile>
                    </Grid>
                    <Grid item xs={6} sm={3} md={3} lg={3}>
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
                              { label: t("_active_title"), value: "active" },
                              { label: t("_disable_title"), value: "disabled" },
                              { label: t("_deleted_title"), value: "deleted" },
                            ],
                            placeholder: t("_select_status"),
                          }}
                        />
                      </MUI.FilterFile>
                    </Grid>
                    <Grid item xs={6} sm={3} md={3} lg={3}>
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
                    <Grid item xs={6} sm={3} md={3} lg={3}>
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
                            // onError: (e) =>
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
                  </Grid>

                  <MUI.ListFilter>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "end",
                      }}
                    >
                      <MUI.FilterFile sx={{ flexGrow: 1 }}>
                        <SelectV1
                          disableLabel
                          selectStyle={{
                            height: "35px",
                            minHeight: "35px",
                            width: isMobile ? "60px" : "100px",
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
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "end",
                        }}
                      >
                        <MUI.FilterFile>
                          <Box>
                            <InputLabel sx={{ color: "black" }}>
                              {t("_search_title")}
                            </InputLabel>
                            <TextField
                              sx={{
                                marginTop: "4px",
                                width: "100%",
                                height: "35px",
                                minHeight: "35px",
                                maxHeight: "35px",
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
                                  type: filter.ACTION_TYPE.USER_NAME,
                                  payload: e.target.value,
                                });
                              }}
                              onBlur={(e) => {
                                filter.dispatch({
                                  type: filter.ACTION_TYPE.USER_NAME,
                                  payload: e.target.value,
                                });
                              }}
                              placeholder={t("_search")}
                              size="small"
                              InputLabelProps={{
                                shrink: false,
                              }}
                            />
                          </Box>
                        </MUI.FilterFile>
                        <MUI.FilterFile sx={{ mx: 2 }}>
                          <SelectV1
                            isDisabled={
                              !permission?.hasPermission("customer_edit")
                            }
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
                                    outline: `1px solid ${theme.palette.primaryTheme?.main} !important`,
                                    borderColor: `${theme.palette.primaryTheme?.main} !important`,
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
                                      }}
                                    >
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
                                        }}
                                      >
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
                                      }}
                                    >
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
                                        }}
                                      >
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
                                  }}
                                >
                                  <Icon.TbScreenShare />
                                  {isMobile ? "" : t("_export")}
                                </Box>
                              ),
                              sx: {
                                "& .MuiInputBase-root": {
                                  backgroundColor: "rgba(168,170,174,0.2)",
                                  height: "35px",
                                  width: "100%",
                                },
                              },
                            }}
                          />
                        </MUI.FilterFile>
                        <MUI.FilterFile>
                          <NormalButton
                            {...(permission?.hasPermission("customer_delete") &&
                              isCanMultipleDelete && {
                                onClick: () => {
                                  setDeleteType("multiple");
                                  setDataForEvents({
                                    action: "delete_multiple",
                                  });
                                },
                              })}
                            sx={{
                              padding: "0 10px",
                              height: "35px",
                              alignItems: "center",
                              border: "1px solid",
                              borderColor:
                                theme.name === THEMES.DARK
                                  ? "rgba(255,255,255,0.4)"
                                  : "rgba(0,0,0,0.4)",
                              borderRadius: "4px",
                              ...(!isCanMultipleDelete ||
                              !permission?.hasPermission("customer_delete")
                                ? {
                                    disabled: true,
                                    cursor: "not-allowed",
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
                            }}
                          >
                            {!isMobile && (
                              <Box
                                sx={{
                                  flex: "1 1 0%",
                                  color:
                                    theme.name === THEMES.DARK
                                      ? "rgb(255,255,255)"
                                      : "rgb(0,0,0)",
                                }}
                              >
                                {t("_multiple_delete")}
                              </Box>
                            )}
                            <Box>
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
                    </Box>
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
                    borderRadius: 0,
                    height: "100% !important",
                    "& .MuiDataGrid-columnSeparator": { display: "none" },
                    "& .MuiDataGrid-virtualScroller": {
                      overflowX: "hidden",
                    },
                  }}
                  autoHeight
                  rows={manageUsers.data || []}
                  getRowId={(row) => row._id}
                  columns={columns}
                  AutoGenerateColumns="True"
                  checkboxSelection
                  disableSelectionOnClick
                  disableColumnFilter
                  disableColumnMenu
                  hideFooter
                  onSelectionModelChange={(ids) => {
                    manageUsers.setSelectedRow(ids);
                    setMultiSeleted(ids);
                  }}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {manageUsers?.total > 0 && (
                  <Box
                    sx={{
                      padding: (theme) => theme.spacing(4),
                    }}
                  >
                    Showing {filter?.state?.currentPageNumber} to &nbsp;
                    {filter?.state?.pageLimit} &nbsp;of&nbsp;
                    {manageUsers.total} &nbsp; entries
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
                  {manageUsers?.total > filter.data?.pageLimit && (
                    <PaginationStyled
                      currentPage={filter.data.currentPageNumber}
                      total={Math.ceil(
                        manageUsers.total / filter.data.pageLimit,
                      )}
                      setCurrentPage={(e) =>
                        filter.dispatch({
                          type: filter.ACTION_TYPE.PAGINATION,
                          payload: e,
                        })
                      }
                    />
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Paper>
      </Box>

      <UserEditStatusDialog
        isOpen={editOpen}
        status={dataForEvents.data?.status || null}
        onClose={() => {
          setEditOpen(false);
          resetDataForEvents();
        }}
        onSave={handleEditUser}
        pathStatus={"customer"}
      />
      {genQrcode && dataForEvents?.data?.otpQRcode && (
        <DialogQRCode
          data={{ ...dataForEvents.data }}
          isOpen={genQrcode}
          onClose={genQrcodeClose}
          envent={(action, data) => setDataForEvents({ action, data })}
        />
      )}
      <DialogPreviewUser
        data={{
          ...dataForEvents.data,
        }}
        isOpen={previewOpen}
        onClose={previewHandleClose}
      />
      <DialogDeleteV1
        isOpen={deleteOpen}
        onClose={deleteHandleClose}
        onConfirm={handleDeleteUser}
        label={`(${
          dataForEvents?.data?.email || dataForEvents?.data?.username
        })`}
      />
      <UsePrint
        open={printOpen}
        onClose={printHanleClose}
        exportCSV={exportCSV}
      />
    </React.Fragment>
  );
}

export default Main;
