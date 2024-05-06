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
import "moment/locale/zh-cn";
import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { errorMessage, successMessage } from "../../../components/Alerts";
import BreadcrumbNavigate from "../../../components/BreadcrumbNavigate";
import NormalButton from "../../../components/NormalButton";
import PaginationStyled from "../../../components/PaginationStyled";
import { THEMES } from "../../../constants";
import {
  getFileNameExtension,
  getFilenameWithoutExtension,
  indexPagination,
  isValueOrNull,
} from "../../../functions";
import * as Icon from "../../../icons/icons";
import {
  setDesc,
  setRadio,
  textEditorState,
} from "../../../redux/slices/textEditorSlice";
import DatePickerV1 from "../components/DatePickerV1";
import DialogDeleteV1 from "../components/DialogDeleteV1";
import DialogForm from "../components/DialogForm";
import SelectV1 from "../components/SelectV1";
import * as MUI from "../css/manageFile";
import Reload from "../help/Reload";
import UseAction from "../help/hooks/useAction";
import moment from "moment-timezone";
import {
  DELETE_ANNOUNCEMENT,
  MUTATION_CREATE_ANNOUNCEMENT,
  UPDATE_ANNOUNCEMENT,
} from "./apollo";
import useFilterAnnouncement from "./hooks/useFilterAnnouncement";
import useManageAnnouncement from "./hooks/useManageAnnouncement";
import { useTranslation } from "react-i18next";

const createValidationSchema = Yup.object().shape({
  title: Yup.string().required("Required"),
  status: Yup.string().required("Required"),
  startDate: Yup.string().required("Required"),
  endDate: Yup.string().required("Required"),
});

function Index() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const radioState = useSelector(textEditorState);
  const isMobile = useMediaQuery("(max-width:768px)");
  const theme = createTheme();
  const [createAnnouncement] = useMutation(MUTATION_CREATE_ANNOUNCEMENT);
  const [deleteAnnouncement] = useMutation(DELETE_ANNOUNCEMENT);
  const [updateAnnouncement] = useMutation(UPDATE_ANNOUNCEMENT);
  const filter = useFilterAnnouncement();
  const manageAnouncements = useManageAnnouncement({ filter: filter.data });
  const { REACT_APP_BUNNY_URL, REACT_APP_ACCESSKEY_BUNNY } = process.env;
  const asiaTimeZone = "Asia/Bangkok";
  const currentTime = moment().tz(asiaTimeZone).format("HH:mm:ss");

  const [dataForEvents, setDataForEvents] = React.useState({
    action: null,
    type: null,
    data: {},
  });

  const resetDataForEvents = () => {
    setDataForEvents((state) => ({
      ...state,
      action: "",
      data: {},
    }));
  };

  const [deleteMultiOpen, setDeleteMultiOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const statusOptions = [
    { label: "draft", value: "draft" },
    { label: "published", value: "published" },
    { label: "expired", value: "expired" },
  ];
  const displayOptions = [
    { label: "all", value: "all" },
    { label: "customer", value: "customer" },
    { label: "staff", value: "staff" },
  ];
  const radioOptions = [
    { label: t("_choose_poster"), value: "poster" },
    { label: t("_create_poster"), value: "write" },
  ];

  const formFields = useMemo(() => {
    const defaultValue = dataForEvents.data;
    return [
      {
        name: "radio",
        value:
          radioOptions.filter(
            (radio) => radio.value === defaultValue?.defaultRadio,
          )?.[0] || radioOptions[0],
        type: defaultValue?.defaultRadio ? "hidden" : "radio",
        options: radioOptions,
      },

      {
        name: "title",
        label: t("_title"),
        value: defaultValue?.title || "",
        type: "textAreaField",
      },
      {
        name: "descriptions",
        label: t("_description"),
        value: defaultValue?.descriptions || radioState.desc,
        type:
          radioState?.isRadio === radioOptions[0].value
            ? "hidden"
            : "textEditor",
      },
      {
        name: "image",
        label: t("_choose_image"),
        value: "",
        type:
          radioState?.isRadio === radioOptions[1].value ? "hidden" : "image",
        canDeleteImage: true,
        imageData: {
          src: isValueOrNull(defaultValue?.image, null)
            ? `${process.env.REACT_APP_BUNNY_PULL_ZONE}image/${dataForEvents.data.image}`
            : null,
          name: isValueOrNull(defaultValue?.image, null),
        },
      },
      {
        name: "addImage",
        label: t("_choose_image"),
        value: {},
        type: "hidden",
        gridColumn: "span 12",
      },
      {
        name: "status",
        label: t("_select_status"),
        disableClear: true,
        value: statusOptions.filter(
          (status) => status.value === defaultValue?.status,
        )?.[0],
        type: "select",
        options: statusOptions,
      },
      {
        name: "audience",
        label: t("_select_display"),
        disableClear: true,
        value: displayOptions.filter(
          (display) => display.value === defaultValue?.audience,
        )?.[0],
        type: "select",
        options: displayOptions,
      },
      {
        name: "startDate",
        label: t("_start_date"),
        value: defaultValue?.startDate
          ? moment(defaultValue?.startDate, "YYYY-MM-DD-hh-mm-ss").toDate()
          : "",
        type: "date",
      },
      {
        name: "endDate",
        label: t("_end_date"),
        value: defaultValue?.endDate
          ? moment(defaultValue?.endDate, "YYYY-MM-DD-hh-mm-ss").toDate()
          : "",
        type: "date",
      },
    ];
  }, [dataForEvents.data, radioState.isRadio, statusOptions]);

  const createHandleClose = () => {
    setCreateOpen(false);
    resetDataForEvents();
    dispatch(setDesc(null));
  };

  const handleLoadingClose = () => {
    setLoading(false);
  };

  const deleteHandleClose = () => {
    setDeleteOpen(false);
    resetDataForEvents();
  };

  const editHandleClose = () => {
    setEditOpen(false);
    resetDataForEvents();
    dispatch(setDesc(null));
  };

  const deleteMultiHandleClose = () => {
    setDeleteMultiOpen(false);
    resetDataForEvents();
  };

  React.useEffect(() => {
    if (dataForEvents.action && dataForEvents.data) {
      menuOnClick(dataForEvents.action);
      setDataForEvents((state) => ({
        ...state,
        data: {
          ...state.data,
          defaultRadio: dataForEvents.data?.content
            ? radioOptions[1].value
            : radioOptions[0].value,
        },
      }));
    }
  }, [dataForEvents.action]);

  const handleEditAnnouncement = async (inputValue) => {
    setLoading(true);
    const randomImageName = Math.floor(1111111111 + Math.random() * 999999);
    const url = `${REACT_APP_BUNNY_URL}image/${dataForEvents.data.image}`;
    const apiKey = REACT_APP_ACCESSKEY_BUNNY;
    let imageName = null;
    const imageFile = inputValue.imageImage;
    if (imageFile instanceof File) {
      const fileExtension = getFileNameExtension(imageFile.name);
      imageName = `${randomImageName}${fileExtension}`;
    }
    try {
      if (!inputValue?.image) {
        await updateAnnouncement({
          variables: {
            id: parseInt(dataForEvents.data._id),
            input: {
              content: dataForEvents.data?.content ? radioState?.desc : "",
              status: inputValue.status?.value || inputValue.status,
              audience: inputValue.audience?.value || inputValue.audience,
              title: inputValue.title,
              startDate: moment(inputValue?.startDate).format(
                `YYYY-MM-DD ${currentTime}`,
              ),
              endDate: moment(inputValue?.endDate).format(
                `YYYY-MM-DD ${currentTime}`,
              ),
            },
          },
          onCompleted: async () => {
            manageAnouncements.customQueryAnounCement();
            successMessage("Update announcemet success", 2000);
            editHandleClose();
            setLoading(false);
          },
        });
      } else {
        const response = await fetch(url, {
          method: "DELETE",
          headers: {
            AccessKey: apiKey,
          },
        });
        if (response.ok) {
          await updateAnnouncement({
            variables: {
              id: parseInt(dataForEvents.data._id),
              input: {
                image: imageName,
                status: inputValue.status?.value || inputValue.status,
                audience: inputValue.audience?.value || inputValue.audience,
                title: inputValue.title,
                startDate: moment(inputValue?.startDate).format(
                  `YYYY-MM-DD ${currentTime}`,
                ),
                endDate: moment(inputValue?.endDate).format(
                  `YYYY-MM-DD ${currentTime}`,
                ),
              },
            },
            onCompleted: async (data) => {
              let filename = getFilenameWithoutExtension(
                data?.updateAnnouncement?.image,
              );
              let fileType = getFileNameExtension(
                data?.updateAnnouncement?.image,
              );
              const url = `${REACT_APP_BUNNY_URL}image/${filename}${fileType}`;
              const response = await fetch(url, {
                method: "PUT",
                headers: {
                  AccessKey: apiKey,
                  "Content-Type": imageFile.type,
                },
                body: imageFile,
              });
              if (response.ok) {
                manageAnouncements.customQueryAnounCement();
                successMessage("Update announcemet success", 2000);
                editHandleClose();
                setLoading(false);
              }
            },
          });
        } else {
          setLoading(false);
          errorMessage("Not found image in server", 2000);
        }
      }
    } catch (error) {
      setLoading(false);
      errorMessage("Update something wrong", 2000);
    }
  };

  const handleCreateAnnouncement = async (inputValue) => {
    const randomIamgeName = Math.floor(1111111111 + Math.random() * 999999);
    let imageName = null;
    const imageFile = inputValue.imageImage;
    if (imageFile instanceof File) {
      const fileExtension = getFileNameExtension(imageFile.name);
      imageName = `${randomIamgeName}${fileExtension}`;
    }
    setLoading(true);
    try {
      await createAnnouncement({
        variables: {
          input: {
            title: inputValue.title,
            image: imageName || "",
            content: imageName ? "" : radioState.desc || "",
            status: inputValue.status || "draft",
            startDate: moment(inputValue?.startDate).format(
              `YYYY-MM-DD ${currentTime}`,
            ),
            endDate: moment(inputValue?.endDate).format(
              `YYYY-MM-DD ${currentTime}`,
            ),
            audience: inputValue.audience || "all",
          },
        },
        onCompleted: async (data) => {
          let filename = getFilenameWithoutExtension(
            data?.createAnnouncement?.image,
          );
          let fileType = getFileNameExtension(data?.createAnnouncement?.image);
          if (data?.createAnnouncement?.image) {
            const url = `${REACT_APP_BUNNY_URL}image/${filename}${fileType}`;
            const apiKey = REACT_APP_ACCESSKEY_BUNNY;
            const response = await fetch(url, {
              method: "PUT",
              headers: {
                AccessKey: apiKey,
                "Content-Type": imageFile.type,
              },
              body: imageFile,
            });
            if (response.ok) {
              successMessage("Create a announcement success", 2000);
              createHandleClose();
              resetDataForEvents();
              setLoading(false);
            } else {
              deleteAnnouncement({
                variables: {
                  id: data?.createAnnouncement?._id,
                },
                onCompleted: () => {
                  createHandleClose();
                  resetDataForEvents();
                  errorMessage(
                    "Create announcement faild please check again",
                    2000,
                  );
                },
              });
            }
          } else {
            createHandleClose();
            successMessage("Create a announcement success", 2000);
            setLoading(false);
          }
          manageAnouncements.customQueryAnounCement();
          createHandleClose();
        },
      });
    } catch (error) {
      if (error.message === "Error: Duplicate entry") {
        errorMessage("Title announcement has aready exits", 2000);
      } else {
        errorMessage("Create announcement faild", 2000);
      }
      setLoading(false);
    }
  };

  const menuOnClick = async (action) => {
    switch (action) {
      case "edit":
        setEditOpen(true);
        dispatch(setDesc(dataForEvents.data.content));
        dispatch(
          setRadio(
            dataForEvents.data.content
              ? radioOptions[1].value
              : radioOptions[0].value,
          ),
        );

        break;
      case "delete":
        setDeleteOpen(true);
        break;
      case "open":
        // setDetailOpen(true);
        break;
      case "delete_multiple":
        break;
      default:
        return;
    }
  };

  const _deleteFunction = (id) => {
    deleteAnnouncement({
      variables: {
        id: id,
      },
      onCompleted: () => {
        setLoading(false);
        manageAnouncements.customQueryAnounCement();
        successMessage("Delete announcement success", 2000);
      },
    });
  };

  const handleDeleteAnouncement = async () => {
    setLoading(true);
    let id = dataForEvents.data?._id;
    try {
      if (!dataForEvents.data.image && dataForEvents?.data?.content) {
        // _deleteFunction(dataForEvents.data?._id);
        const result = await deleteAnnouncement({
          variables: {
            id: id,
          },
        });
        if (result.data?.deleteAnnouncement) {
          setLoading(false);
          manageAnouncements.customQueryAnounCement();
          successMessage("Delete announcement success", 2000);
        }
      } else {
        const result = await deleteAnnouncement({
          variables: {
            id: id,
          },
        });
        if (result.data?.deleteAnnouncement) {
          setLoading(false);
          manageAnouncements.customQueryAnounCement();
          const url = `${REACT_APP_BUNNY_URL}image/${dataForEvents.data.image}`;
          const apiKey = REACT_APP_ACCESSKEY_BUNNY;
          await fetch(url, {
            method: "DELETE",
            headers: {
              AccessKey: apiKey,
            },
          })
            .then(() => {})
            .catch((err) => {
              console.log(err);
            });
        }
      }
    } catch (error) {
      errorMessage("Delete filed please try again ", 2000);
    }
  };

  const handleMultiDelete = async () => {
    setLoading(true);
    try {
      for (let i = 0; i < manageAnouncements.selectedRow.length; i++) {
        if (
          !manageAnouncements.selectedRow[i]?.image &&
          manageAnouncements.selectedRow[i]?.content
        ) {
          deleteAnnouncement({
            variables: {
              id: manageAnouncements.selectedRow[i]?._id,
            },
            onCompleted: () => {
              setLoading(false);
            },
          });
        } else {
          const url = `${REACT_APP_BUNNY_URL}image/${manageAnouncements.selectedRow[i].image}`;
          const apiKey = REACT_APP_ACCESSKEY_BUNNY;
          const response = await fetch(url, {
            method: "DELETE",
            headers: {
              AccessKey: apiKey,
            },
          });
          if (response.ok) {
            deleteAnnouncement({
              variables: {
                id: manageAnouncements.selectedRow[i]?._id,
              },
              onCompleted: () => {
                setLoading(false);
              },
            });
          } else {
            setLoading(false);
          }
        }
      }
      successMessage("Delete announcement success", 2000);
      manageAnouncements.customQueryAnounCement();
    } catch (error) {
      errorMessage("Delete filed please try again ", 2000);
    }
  };

  const hanleSelect = (data) => {
    const selectedOptionIds = data.map((dataId) => {
      const option = manageAnouncements.data.find(
        (option) => parseInt(option._id) === parseInt(dataId),
      );
      if (option) {
        return option;
      }
      return "";
    });
    manageAnouncements.setSelectedRow(selectedOptionIds);
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
      field: "title",
      headerName: t("_title"),
      flex: 1,
      minWidth: 300,
    },
    {
      field: "status",
      headerName: t("_status"),
      width: 100,
      renderCell: (params) => {
        const status = params.row.status;
        if (status === "draft") {
          return (
            <div style={{ color: "green" }}>
              <Chip
                sx={{ backgroundColor: "#dcf6e8", color: "#29c770" }}
                label={status}
                size="small"
              />
            </div>
          );
        } else if (status === "published") {
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
                  backgroundColor: "rgba(168, 170, 174,0.16)",
                  color: "rgb(168, 170, 174)",
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
      hideable: true,
      headerAlign: "right",
      align: "right",
      renderCell: (params) => {
        return (
          <div>
            <UseAction
              status={0}
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
    <React.Fragment>
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <BreadcrumbNavigate
          separatorIcon={<Icon.ForeSlash />}
          path={["announcement", "manage-announcement"]}
          readablePath={[t("_announcement"), t("_announcement_manage")]}
        />
        <Paper
          sx={{
            mt: (theme) => theme.spacing(3),
            boxShadow: (theme) => theme.baseShadow.secondary,
            flex: "1 1 0%",
          }}
        >
          <Card>
            <CardContent>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                }}
              >
                {t("_announcement_title")}
              </Typography>
              <MUI.ListFilter>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    spacing: "10px",
                  }}
                >
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
                    }}
                  >
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
                          {...(manageAnouncements.selectedRow.length && {
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
                            ...(manageAnouncements.selectedRow.length < 2
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
                            borderColor: (theme) =>
                              theme.palette.primaryTheme.main,
                            backgroundColor: (theme) =>
                              theme.palette.primaryTheme.main,
                            borderRadius: "4px",
                            color: "white !important",
                            justifyContent: "center",
                          }}
                          onClick={() => {
                            setCreateOpen(true);
                            dispatch(setRadio(radioOptions[0].value));
                          }}
                        >
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
                }}
              >
                <DataGrid
                  autoHeight
                  rows={manageAnouncements?.data || []}
                  getRowId={(row) => row._id}
                  columns={columns}
                  AutoGenerateColumns="True"
                  checkboxSelection
                  disableSelectionOnClick
                  disableColumnFilter
                  disableColumnMenu
                  hideFooter
                  onSelectionModelChange={(ids) => {
                    manageAnouncements.setSelectedRow(ids);
                    hanleSelect(ids);
                  }}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {manageAnouncements?.total > 0 && (
                  <Box
                    sx={{
                      padding: (theme) => theme.spacing(4),
                    }}
                  >
                    Showing {filter?.state?.currentPageNumber} to &nbsp;
                    {filter?.state?.pageLimit} &nbsp;of&nbsp;
                    {manageAnouncements?.total} &nbsp; entries
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
                  {filter.state?.pageLimit < manageAnouncements?.total && (
                    <PaginationStyled
                      currentPage={filter.data.currentPageNumber}
                      total={Math.ceil(
                        manageAnouncements.total / filter.data.pageLimit,
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

      {editOpen && dataForEvents?.data?.defaultRadio && (
        <DialogForm
          loading={loading}
          formFields={formFields}
          disableDefaultButton
          title={t("_update_announcement")}
          onSubmit={handleEditAnnouncement}
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
        title={t("_create_announcement")}
        onSubmit={handleCreateAnnouncement}
        validationSchema={createValidationSchema}
        isOpen={createOpen}
        onClose={createHandleClose}
        gridTemplateColumns="repeat(6, 1fr)"
      />

      <DialogDeleteV1
        isOpen={deleteOpen}
        onClose={deleteHandleClose}
        onConfirm={handleDeleteAnouncement}
        label={`${dataForEvents.data.title}`}
      />

      <Reload isOpen={loading} onClose={handleLoadingClose} />
    </React.Fragment>
  );
}

export default Index;
