import { useMutation } from "@apollo/client";
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
import React, { useRef, useState } from "react";
import { errorMessage, successMessage } from "../../../components/Alerts";
import BreadcrumbNavigate from "../../../components/BreadcrumbNavigate";
import NormalButton from "../../../components/NormalButton";
import PaginationStyled from "../../../components/PaginationStyled";
import { THEMES } from "../../../constants";
import {
  getFileNameExtension,
  getFilenameWithoutExtension,
  indexPagination,
  keyBunnyCDN,
  linkBunnyCDN,
} from "../../../functions";
import * as Icon from "../../../icons/icons";
import DialogDeleteV1 from "../components/DialogDeleteV1";
import SelectV1 from "../components/SelectV1";
import * as MUI from "../css/manageFile";
import Dialog from "./Dialog";
import Preview from "./Preview";
import UseLoading from "./Reload";
import {
  DELETE_HELP,
  MUATION_CREATE_HELP,
  MUTATION_UPDATE_HELP,
} from "./apollo";
import UseAction from "./hooks/useAction";
import useHelp from "./hooks/useHelp";
import useManageHelp from "./hooks/useManageHelp";
import { useTranslation } from "react-i18next";

function Index() {
  const theme = createTheme();
  const { t } = useTranslation();
  const isMobile = useMediaQuery("(max-width:768px)");
  const filter = useHelp();
  const dataHelp = useManageHelp({ filter: filter.data });
  const [dataForEvents, setDataForEvents] = React.useState({
    action: null,
    type: null,
    data: {},
  });

  const editorRef = useRef(null);
  const [createHelp] = useMutation(MUATION_CREATE_HELP);
  const [deleteHelp] = useMutation(DELETE_HELP);
  const [updateHelp] = useMutation(MUTATION_UPDATE_HELP);

  //dialog
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  // function popup
  const resetDataForEvents = () => {
    setDataForEvents((state) => ({
      ...state,
      action: null,
      data: {},
    }));
  };

  const handleLoadingClose = () => {
    setLoading(false);
  };

  const createHandleClose = () => {
    setCreateOpen(false);
    resetDataForEvents();
  };
  const deleteHandleClose = () => {
    setDeleteOpen(false);
    resetDataForEvents();
  };
  const editHandleClose = () => {
    setEditOpen(false);
    resetDataForEvents();
  };
  const detailhandleClose = () => {
    setDetailOpen(false);
    resetDataForEvents();
  };

  const handleDetailOpen = () => {};

  const handleCreateHelp = async () => {
    try {
      if (!dataForEvents?.data?.image) {
        throw new Error("Image");
      } else if (!dataForEvents.data?.name) {
        throw new Error("Title");
      }
      const randomName = Math.floor(1111111111 + Math.random() * 999999);
      await createHelp({
        variables: {
          input: {
            description: editorRef.current?.getContent(),
            image:
              randomName +
              getFileNameExtension(dataForEvents?.data?.image.name),
            name: dataForEvents.data.name,
            status: "active",
          },
        },
        onCompleted: async (data) => {
          let filename = getFilenameWithoutExtension(data?.createHelp.image);
          let fileType = getFileNameExtension(data?.createHelp.image);

          if (data?.createHelp?._id) {
            const url = `${linkBunnyCDN}image/${filename}${fileType}`;
            const apiKey = keyBunnyCDN;
            const response = await fetch(url, {
              method: "PUT",
              headers: {
                AccessKey: apiKey,
                "Content-Type": dataForEvents?.data?.image.type,
              },
              body: dataForEvents?.data?.image,
            });
            if (response.ok) {
              successMessage("Create a help success", 2000);
            } else {
              deleteHelp({
                variables: {
                  id: data?.createHelp?._id,
                },
                onCompleted: () => {
                  errorMessage("Create help faild please check again", 2000);
                },
              });
            }
            dataHelp.customQueryHelp();
            createHandleClose();
            resetDataForEvents();
          }
        },
      });
    } catch (error) {
      if (error.message !== "Image" && error.message !== "Title") {
        errorMessage("Create help failed", 2000);
      } else {
        setDataForEvents((state) => ({
          ...state,
          data: { ...state.data, error: error.message },
        }));
      }
    }
  };

  const handleEditHelp = async () => {
    const randomImageName = Math.floor(1111111111 + Math.random() * 999999);
    const url = `${linkBunnyCDN}image/${dataForEvents.image}`;
    const apiKey = keyBunnyCDN;
    try {
      if (dataForEvents?.action === "show") {
        const response = await fetch(url, {
          method: "DELETE",
          headers: {
            AccessKey: apiKey,
          },
        });
        if (response.ok) {
          await updateHelp({
            variables: {
              id: parseInt(dataForEvents.data._id),
              input: {
                name: dataForEvents.data.name,
                image:
                  randomImageName +
                  getFileNameExtension(dataForEvents?.data.image.name),
                description: editorRef.current?.getContent(),
                status: checked === true ? "active" : "inactive",
              },
            },
            onCompleted: async (data) => {
              let filename = getFilenameWithoutExtension(
                data?.updateHelp?.image
              );
              let fileType = getFileNameExtension(data?.updateHelp?.image);
              const url = `${linkBunnyCDN}image/${filename}${fileType}`;
              const apiKey = keyBunnyCDN;
              const response = await fetch(url, {
                method: "PUT",
                headers: {
                  AccessKey: apiKey,
                  "Content-Type": dataForEvents?.data?.image.type,
                },
                body: dataForEvents?.data?.image,
              });
              if (response.ok) {
                successMessage("Update help success", 2000);
                dataHelp.customQueryHelp();
                resetDataForEvents();
                editHandleClose();
              }
            },
          });
        }
      } else {
        await updateHelp({
          variables: {
            id: parseInt(dataForEvents.data._id),
            input: {
              name: dataForEvents.data.name,
              image: dataForEvents?.data.image,
              description: editorRef.current?.getContent(),
              status: checked === true ? "active" : "inactive",
            },
          },
          onCompleted: async () => {
            successMessage("Update help success", 2000);
            dataHelp.customQueryHelp();
            resetDataForEvents();
            editHandleClose();
          },
        });
      }
    } catch (error) {
      errorMessage("Update something wrong", 2000);
    }
  };

  const handleMultiDeleteHelp = async () => {
    try {
      for (let i = 0; i < dataHelp.selectedRow.length; i++) {
        const url = `${linkBunnyCDN}image/${dataHelp.selectedRow[i].image}`;
        const apiKey = keyBunnyCDN;
        const response = await fetch(url, {
          method: "DELETE",
          headers: {
            AccessKey: apiKey,
          },
        });

        if (response.ok) {
          deleteHelp({
            variables: {
              id: dataHelp.selectedRow[i]?._id,
            },
          });
        }
      }

      dataHelp.customQueryHelp();
      deleteHandleClose();
      resetDataForEvents();
      successMessage("Delete help success", 2000);
    } catch (error) {
      errorMessage("Delete filed please try again ", 2000);
    }
  };

  const handleDeleteHelp = async () => {
    setLoading(true);
    try {
      const url = `${linkBunnyCDN}image/${dataForEvents.data.image}`;
      const apiKey = keyBunnyCDN;
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          AccessKey: apiKey,
        },
      });

      if (response.ok) {
        deleteHelp({
          variables: {
            id: dataForEvents?.data?._id,
          },
          onCompleted: () => {
            setTimeout(() => {
              setLoading(false);
              handleLoadingClose();
              successMessage("Delete help success", 2000);
              deleteHandleClose();
              resetDataForEvents();
              dataHelp.customQueryHelp();
            }, 500);
          },
        });
      }
    } catch (error) {
      setLoading(false);
      errorMessage("Delete filed please try again ", 2000);
    }
  };

  React.useEffect(() => {
    if (dataForEvents.action && dataForEvents.data) {
      menuOnClick(dataForEvents.action);
    }
    if (
      dataForEvents.action === "edit" &&
      dataForEvents.data.status === "active"
    ) {
      setChecked(true);
    }
  }, [dataForEvents.action]);
  const menuOnClick = async (action) => {
    switch (action) {
      case "edit":
        setEditOpen(true);
        break;
      case "delete":
        setDeleteOpen(true);
        break;
      case "open":
        setDetailOpen(true);
        break;
      case "delete_multiple":
        break;
      default:
        return;
    }
  };
  const handleSelect = (data) => {
    const selectedOptionIds = data.map((dataId) => {
      const option = dataHelp.data.find(
        (option) => parseInt(option._id) === parseInt(dataId)
      );
      if (option) {
        return option;
      }
      return "";
    });

    dataHelp.setSelectedRow(selectedOptionIds);
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
      field: "name",
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
              status={1}
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
          path={["help", "manage-help"]}
          readablePath={[t("_help"), t("_help_manage")]}
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
                {t("_help_title")}
              </Typography>
              <MUI.ListFilter>
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
                          {...(dataHelp.selectedRow.length > 1 && {
                            onClick: () => handleMultiDeleteHelp(),
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
                            ...(dataHelp.selectedRow.length < 2
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
                          }}
                        >
                          {t("_create_new")}
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
                  sx={{
                    borderRadius: 0,
                    height: "100% !important",
                    "& .MuiDataGrid-columnSeparator": { display: "none" },
                  }}
                  autoHeight
                  rows={dataHelp?.data || []}
                  getRowId={(row) => row._id}
                  columns={columns}
                  AutoGenerateColumns="True"
                  checkboxSelection
                  disableSelectionOnClick
                  disableColumnFilter
                  disableColumnMenu
                  hideFooter
                  onSelectionModelChange={(ids) => {
                    dataHelp.setSelectedRow(ids);
                    handleSelect(ids);
                  }}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {dataHelp?.data?.length > 0 && (
                  <Box
                    sx={{
                      padding: (theme) => theme.spacing(4),
                    }}
                  >
                    Showing {filter?.state?.currentPageNumber} to &nbsp;
                    {filter?.state?.pageLimit} &nbsp;of&nbsp;
                    {dataHelp?.total} &nbsp; entries
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
                  {useManageHelp.data?.length > filter.data?.pageLimit && (
                    <PaginationStyled
                      currentPage={filter.data.currentPageNumber}
                      total={Math.ceil(dataHelp.total / filter.data.pageLimit)}
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
      <Dialog
        isOpen={createOpen}
        onClose={createHandleClose}
        onClick={handleCreateHelp}
        setDataForEvents={setDataForEvents}
        dataForEvents={dataForEvents}
        editorRef={editorRef}
        label={t("_create_help_title")}
      />
      <Dialog
        isOpen={editOpen}
        onClose={editHandleClose}
        onClick={handleEditHelp}
        setDataForEvents={setDataForEvents}
        dataForEvents={dataForEvents}
        editorRef={editorRef}
        checked={checked}
        setChecked={setChecked}
        label={t("_update_help_title")}
      />
      <DialogDeleteV1
        isOpen={deleteOpen}
        onClose={deleteHandleClose}
        onConfirm={handleDeleteHelp}
      />
      <Preview
        isOpen={detailOpen}
        onClose={detailhandleClose}
        onConfirm={handleDetailOpen}
        data={dataForEvents.data}
      />
      <UseLoading isOpen={loading} onClose={handleLoadingClose} />
    </React.Fragment>
  );
}

export default Index;
