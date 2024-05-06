import { useMutation } from "@apollo/client";
import AddIcon from "@mui/icons-material/Add";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Paper,
  TextField,
  Typography,
  createTheme,
  useMediaQuery,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import moment from "moment";
import React, { useMemo, useRef, useState } from "react";
import { errorMessage, successMessage } from "../../../components/Alerts";
import BreadcrumbNavigate from "../../../components/BreadcrumbNavigate";
import NormalButton from "../../../components/NormalButton";
import PaginationStyled from "../../../components/PaginationStyled";
import { THEMES } from "../../../constants";
import { DateOfNumber, compareIndochinaDateToGeneral, indexPagination } from "../../../functions";
import * as Icon from "../../../icons/icons";
import useFilterAnnouncement from "../announcement/hooks/useFilterAnnouncement";
import DatePickerV1 from "../components/DatePickerV1";
import DialogDeleteV1 from "../components/DialogDeleteV1";
import SelectV1 from "../components/SelectV1";
import * as MUI from "../css/manageFile";
import Reload from "../help/Reload";
import UseAction from "../help/hooks/useAction";
import Dialog from "./Dialog";
import { CREATE_BROADCAST, DELETE_BROADCAST, SEND_BROADCAST, UPDATE_BROADCAST } from "./apollo";
import useManangeBroadcast from "./hooks/useManangeBroadcast";
import DialogForm from "../components/DialogForm";
import * as Yup from "yup";
import { textEditorState } from "../../../redux/slices/textEditorSlice";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const createValidationSchema = Yup.object().shape({
  title: Yup.string().required("Required"),
  status: Yup.string().required("Required"),
  startDate: Yup.string().required("Required"),
  endDate: Yup.string().required("Required"),
});
const editValidationSchema = Yup.object().shape({
  title: Yup.string().required("Required"),
});
function Index() {
  const theme = createTheme();
  const { t } = useTranslation();
  const editorRef = useRef(null);
  const isMobile = useMediaQuery("(max-width:768px)");
  const filter = useFilterAnnouncement();
  const [deleteBroadcast] = useMutation(DELETE_BROADCAST);
  const [updateBroadcast] = useMutation(UPDATE_BROADCAST);
  const [createBroadcast] = useMutation(CREATE_BROADCAST);
  const [sendBroadcast] = useMutation(SEND_BROADCAST);
  const manageBroadcast = useManangeBroadcast({ filter: filter.data });
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteMultiOpen, setDeleteMultiOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [send, setSend] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const textEditorDesc = useSelector(textEditorState);
  const [dataForEvents, setDataForEvents] = React.useState({
    action: null,
    type: null,
    data: {},
  });

  const statusOptions = [
    { label: "draft", value: "draft" },
    { label: "published", value: "published" },
    { label: "expired", value: "expired" },
  ];
  const resetDataForEvents = () => {
    setDataForEvents((state) => ({
      ...state,
      action: null,
      data: {},
    }));
  };

  const formFields = useMemo(() => {
    const defaultValue = dataForEvents.data;
    return [
      {
        name: "title",
        label: t("_title"),
        value: defaultValue.title || "",
        type: "text",
      },

      {
        name: "status",
        label: t("_status"),
        disableClear: true,
        value: statusOptions.filter((status) => status.value === defaultValue.status)?.[0],
        type: "select",
        options: statusOptions,
      },
      {
        name: "startDate",
        label: t("_start_date"),
        value: defaultValue.startDate ? moment(defaultValue.startDate, "YYYY-MM-DD").toDate() : "",
        type: "date",
      },
      {
        name: "endDate",
        label: t("_end_date"),
        value: defaultValue.endDate ? moment(defaultValue.endDate, "YYYY-MM-DD").toDate() : "",
        type: "date",
      },
      {
        name: "descriptions",
        label: t("_description"),
        value: defaultValue.content || "",
        type: "textEditor",
      },
    ];
  }, [dataForEvents.data]);

  const createHandleClose = () => {
    setCreateOpen(false);
    resetDataForEvents();
  };
  const handleLoadingClose = () => {
    setLoading(false);
  };
  const handleSendClose = () => {
    setSend(false);
    setChecked(false);
    setTimeout(() => {
      resetDataForEvents();
    }, 10);
  };
  const deleteHandleClose = () => {
    setDeleteOpen(false);
    resetDataForEvents();
  };
  const editHandleClose = () => {
    setEditOpen(false);
    resetDataForEvents();
  };
  const deleteMultiHandleClose = () => {
    setDeleteMultiOpen(false);
    resetDataForEvents();
  };

  const hanleSelect = (data) => {
    const selectedOptionIds = data.map((dataId) => {
      const option = manageBroadcast.data.find(
        (option) => parseInt(option._id) === parseInt(dataId),
      );
      if (option) {
        return option;
      }
      return "";
    });
    manageBroadcast.setSelectedRow(selectedOptionIds);
  };

  const handleMultiDelete = async () => {
    setLoading(true);
    try {
      for (let i = 0; i < manageBroadcast.selectedRow.length; i++) {
        deleteBroadcast({
          variables: {
            id: manageBroadcast.selectedRow[i]?._id,
          },
          onCompleted: () => {
            manageBroadcast.customQueryAnnounCement();
          },
        });
      }
      setLoading(false);
      successMessage("Delete Broadcast success", 2000);
    } catch (error) {
      setLoading(false);
      errorMessage("Delete filed please try again ", 2000);
    }
  };

  const handleCreate = async (inputValues) => {
    try {
      setLoading(true);
      await createBroadcast({
        variables: {
          input: {
            title: inputValues.title,
            content: textEditorDesc.desc,
            startDate: compareIndochinaDateToGeneral(inputValues.startDate),
            endDate: compareIndochinaDateToGeneral(inputValues.endDate),
            status: inputValues.status,
          },
        },
        onCompleted: () => {
          successMessage("Create broadcast success", 2000);
          createHandleClose();
          manageBroadcast.customQueryAnnounCement();
        },
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      errorMessage("Create broadcast failed", 2000);
    }
  };
  const handleUpdate = async (inputValues) => {
    await updateBroadcast({
      variables: {
        id: parseInt(dataForEvents.data._id),
        input: {
          title: inputValues.title,
          content: editorRef.current?.getContent(),
          status: inputValues.status.value ?? inputValues.status,
          startDate: compareIndochinaDateToGeneral(inputValues.startDate),
          endDate: compareIndochinaDateToGeneral(inputValues.endDate),
        },
      },
      onCompleted: () => {
        successMessage("Update broadcast success", 2000);
        editHandleClose();
        manageBroadcast.customQueryAnnounCement();
      },
    });
  };
  const handleDelete = async () => {
    setLoading(true);
    try {
      deleteBroadcast({
        variables: {
          id: dataForEvents.data?._id,
        },
        onCompleted: () => {
          successMessage("Delete broadcast success", 2000);
          setLoading(false);
          manageBroadcast.customQueryAnnounCement();
        },
      });
    } catch (error) {
      errorMessage("Delete broadcast failed", 2000);
    }
  };

  const handleSend = async () => {
    try {
      if (
        (!dataForEvents.data?.chips || dataForEvents.data?.chips === "undifined") &&
        !dataForEvents.data?.data
      ) {
        throw new Error("chip");
      } else {
        setDataForEvents((state) => ({
          ...state,
          data: { ...state.data, error: "" },
        }));
      }
      if (dataForEvents.data?.data) {
        for (let i = 0; i < dataForEvents.data.data?.length; i++) {
          await sendBroadcast({
            variables: {
              input: {
                broadcastId: parseInt(dataForEvents.data._id),
                email: dataForEvents.data.data[i]?.email,
              },
            },
          });
        }
        handleSendClose();
        manageBroadcast.customQueryAnnounCement();
        successMessage("Send broadcast success", 2000);
      } else {
        for (let i = 0; i < dataForEvents.data.chips.length; i++) {
          await sendBroadcast({
            variables: {
              input: {
                broadcastId: parseInt(dataForEvents.data._id),
                email: dataForEvents.data.chips[i],
              },
            },
          });
        }
        handleSendClose();
        manageBroadcast.customQueryAnnounCement();
        successMessage("Send broadcast success", 2000);
      }
    } catch (error) {
      if (error.message === "chip") {
        setDataForEvents((state) => ({
          ...state,
          data: { ...state.data, error: error.message },
        }));
      } else {
        errorMessage("Create broadcast failed", 2000);
      }
    }
  };
  React.useEffect(() => {
    if (dataForEvents.action && dataForEvents.data) {
      menuOnClick(dataForEvents.action);
    }
  }, [dataForEvents.action]);
  const menuOnClick = async (action) => {
    const currentDate = moment(new Date()).format("YYYY-MM-DD");
    const startDate = moment(dataForEvents.data.startDate).format("YYYY-MM-DD");

    const endDate = moment(dataForEvents.data.endDate).format("YYYY-MM-DD");
    switch (action) {
      case "edit":
        setEditOpen(true);
        break;
      case "delete":
        setDeleteOpen(true);
        break;
      case "send":
        if (
          dataForEvents.data.status === "published" &&
          currentDate >= startDate &&
          currentDate <= endDate
        ) {
          setDataForEvents((state) => ({
            ...state,
            data: { ...state.data, action: "email" },
          }));

          setSend(true);
        } else {
          resetDataForEvents();
          errorMessage("This broadcast  is not publish", 2000);
        }
        break;
      default:
        return;
    }
  };

  const columns = [
    {
      field: "id",
      headerName: t("_no"),
      width: 50,
      sortable: false,
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
      field: "title",
      headerName: t("_title"),
      flex: 1,
      minWidth: 300,
      sortable: false,
    },

    {
      field: "endDate",
      headerName: t("_date"),
      flex: 1,
      sortable: false,
      minWidth: 100,
      renderCell: (params) => {
        return <div>{DateOfNumber(params.row.endDate)}</div>;
      },
    },
    {
      field: "status",
      headerName: t("_status"),
      width: 100,
      sortable: false,
      renderCell: (params) => {
        const status = params.row.status;
        if (status === "send") {
          return (
            <div style={{ color: "green" }}>
              <Chip
                sx={{ backgroundColor: "#dcf6e8", color: "#29c770" }}
                label={status}
                size="small"
              />
            </div>
          );
        } else if (status === "draft") {
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
        } else {
          return (
            <div>
              <Chip
                sx={{
                  backgroundColor: "rgba(255, 159, 67,0.16)",
                  color: "rgb(255, 159, 67)",
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
      width: 100,
      sortable: false,
      headerAlign: "right",
      align: "right",
      renderCell: (params) => {
        return (
          <div>
            <UseAction
              status={2}
              data={params.row}
              event={{
                handleEvent: (action, data) => {
                  setDataForEvents(action, data);
                },
              }}
            />
          </div>
        );
      },
    },
  ];
  return (
    <div>
      <React.Fragment>
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <BreadcrumbNavigate
            separatorIcon={<Icon.ForeSlash />}
            path={["broadcast", "manage broadcast"]}
            readablePath={[t("_broadcast"), t("_manage_broadcast")]}
          />
          <Paper
            sx={{
              mt: (theme) => theme.spacing(3),
              boxShadow: (theme) => theme.baseShadow.secondary,
              flex: "1 1 0%",
            }}>
            <Card>
              <CardContent>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                  }}>
                  {t("_broadcast_title")}
                </Typography>
                <MUI.ListFilter>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      spacing: "10px",
                    }}>
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
                            margin: "0 10px 0 0",
                          },
                          InputLabelProps: {
                            shrink: false,
                          },
                        },
                      }}
                    />
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
                            margin: "0 0 0 10px",
                          },
                        },
                        InputLabelProps: {
                          shrink: false,
                        },
                      }}
                    />
                  </Box>

                  <MUI.ListFilter>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}>
                      <MUI.FilterFile>
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
                      <Box sx={{ display: "flex", mt: 1 }}>
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
                                type: filter.ACTION_TYPE.TITLE,
                                payload: e.target.value,
                              });
                            }}
                            onBlur={(e) => {
                              filter.dispatch({
                                type: filter.ACTION_TYPE.TITLE,
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

                        <MUI.FilterFile>
                          <NormalButton
                            {...(manageBroadcast.selectedRow.length && {
                              onClick: () => setDeleteMultiOpen(true),
                            })}
                            sx={{
                              padding: "0 10px",
                              height: "35px",
                              alignItems: "center",
                              border: "1px solid",
                              ml: 3,

                              borderColor:
                                theme.name === THEMES.DARK
                                  ? "rgba(255,255,255,0.4)"
                                  : "rgba(0,0,0,0.4)",
                              borderRadius: "4px",
                              ...(manageBroadcast.selectedRow.length < 2
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
                            {!isMobile && (
                              <Box
                                sx={{
                                  flex: "1 1 0%",
                                  color:
                                    theme.name === THEMES.DARK ? "rgb(255,255,255)" : "rgb(0,0,0)",
                                }}>
                                {t("_multiple_delete")}
                              </Box>
                            )}
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
                        <MUI.FilterFile>
                          <NormalButton
                            sx={{
                              ml: 2,
                              height: "35px",
                              width: "100%",
                              alignItems: "center",
                              border: "1px solid",
                              padding: (theme) => theme.spacing(3),
                              borderColor: (theme) => theme.palette.primaryTheme.main,
                              backgroundColor: (theme) => theme.palette.primaryTheme.main,
                              borderRadius: "4px",
                              color: "white !important",
                              justifyContent: "center",
                            }}
                            onClick={() => {
                              setCreateOpen(true);
                            }}>
                            <AddIcon />
                            {isMobile ? "" : t("_create_new")}
                          </NormalButton>
                        </MUI.FilterFile>
                      </Box>
                    </Box>
                  </MUI.ListFilter>
                </MUI.ListFilter>
                &nbsp;
                <Box
                  style={{
                    width: "100%",
                    flex: "1 1 0%",
                  }}>
                  <DataGrid
                    autoHeight
                    rows={manageBroadcast?.data || []}
                    getRowId={(row) => row._id}
                    columns={columns}
                    AutoGenerateColumns="True"
                    checkboxSelection
                    disableSelectionOnClick
                    disableColumnFilter
                    hideFooter
                    onSelectionModelChange={(ids) => {
                      manageBroadcast.setSelectedRow(ids);
                      hanleSelect(ids);
                    }}
                  />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}>
                  {manageBroadcast?.data?.length > 0 && (
                    <Box
                      sx={{
                        padding: (theme) => theme.spacing(4),
                      }}>
                      Showing {filter?.state?.currentPageNumber} to &nbsp;
                      {filter?.state?.pageLimit} &nbsp;of&nbsp;
                      {manageBroadcast?.total} &nbsp; entries
                    </Box>
                  )}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      padding: (theme) => theme.spacing(4),
                      flex: "1 1 0%",
                    }}>
                    {manageBroadcast?.data?.length > 0 &&
                      filter.state?.pageLimit < manageBroadcast?.data?.length > 0 && (
                        <PaginationStyled
                          currentPage={filter.data.currentPageNumber}
                          total={Math.ceil(manageBroadcast.total / filter.data.pageLimit)}
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

        {editOpen && (
          <DialogForm
            loading={loading}
            formFields={formFields}
            disableDefaultButton
            title={t("_update_broadcast")}
            onSubmit={handleUpdate}
            validationSchema={editValidationSchema}
            isOpen={editOpen}
            onClose={editHandleClose}
            gridTemplateColumns="repeat(6, 1fr)"
          />
        )}
        {deleteMultiOpen && (
          <DialogDeleteV1
            isOpen={deleteMultiOpen}
            onClose={deleteMultiHandleClose}
            onConfirm={handleMultiDelete}
            label="multi items? This action is irreversible. Confirm?"
          />
        )}
        <DialogForm
          loading={loading}
          formFields={formFields}
          disableDefaultButton
          title={t("_create_broadcast")}
          onSubmit={handleCreate}
          validationSchema={createValidationSchema}
          isOpen={createOpen}
          onClose={createHandleClose}
          gridTemplateColumns="repeat(6, 1fr)"
        />
        <Dialog
          isOpen={send}
          onClose={handleSendClose}
          onClick={handleSend}
          setDataForEvents={setDataForEvents}
          dataForEvents={dataForEvents}
          label={t("_send_broadcast")}
          setChecked={setChecked}
          checked={checked}
        />
        <DialogDeleteV1
          isOpen={deleteOpen}
          onClose={deleteHandleClose}
          onConfirm={handleDelete}
          label={`Are you sure you want to delete (${dataForEvents.data.title})`}
        />
        <Reload isOpen={loading} onClose={handleLoadingClose} />
      </React.Fragment>
    </div>
  );
}

export default Index;
