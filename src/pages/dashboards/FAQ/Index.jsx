import { useMutation } from "@apollo/client";
import ClearIcon from "@mui/icons-material/Clear";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Tooltip,
  Typography,
  styled,
  useMediaQuery,
} from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { DataGrid } from "@mui/x-data-grid";
import React, { Fragment, useState } from "react";
import * as MUI from "../css/manageFile";
import { CREATE_FAQ, DELETE_FAQ, UPDATE_FAQS } from "./apollo/faqs";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import { AiOutlinePlus } from "react-icons/ai";
import * as Icon from "../../../icons/icons";
import "./../css/style.css";
// icons
import heEncrypt from "he";
import { useTranslation } from "react-i18next";
import { errorMessage, successMessage } from "../../../components/Alerts";
import BreadcrumbNavigate from "../../../components/BreadcrumbNavigate";
import NormalButton from "../../../components/NormalButton";
import PaginationStyled from "../../../components/PaginationStyled";
import { THEMES } from "../../../constants";
import useAuth from "../../../hooks/useAuth";
import usePermission from "../../../hooks/usePermission";
import DialogDeleteV1 from "../components/DialogDeleteV1";
import SelectV1 from "../components/SelectV1";
import useFilter from "../manageFile/hooks/useFilter";
import ManageFAQ from "./manageFAQ";
import { TextareaAutosize } from "@mui/base";
import { handleGraphqlErrors } from "../../../functions";

const Textarea = styled(TextareaAutosize)(
  ({ theme }) => `
  width: 100%;
  box-sizing: border-box;
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ccc;

  &:focus {
    outline: 0;
    border-color: #17766B;
  }
  &:focus-visible {
    outline: 0;
  }

  margin-top: 20px
`,
);

function Index() {
  const theme = createTheme();
  const { t } = useTranslation();
  const isMobile = useMediaQuery("(max-width:767px)");
  const [createFAQ] = useMutation(CREATE_FAQ);
  const [deletFAQ] = useMutation(DELETE_FAQ);
  const [updateFAQ] = useMutation(UPDATE_FAQS);
  const [multiId, setMultiId] = React.useState([]);
  const [id, setId] = React.useState("");
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState(null);
  const [displayStatus, setDisplayStatus] = useState("client");
  const filter = useFilter();
  const useManageFAQ = ManageFAQ({ filter: filter.data });
  const { user } = useAuth();
  const permission = usePermission(user?._id);

  const handleClose = () => {
    setOpen(false);
  };

  const handleDeleteClose = () => {
    setOpenDelete(false);
  };

  // create
  const handleCrateFAQ = async () => {
    try {
      if (status === "edit") {
        const resUpdate = await updateFAQ({
          variables: {
            data: {
              display: displayStatus,
              question: question,
              answer: answer,
            },
            where: { _id: id },
          },
        });

        if (resUpdate.data) {
          successMessage("Update question and answer success", 3000);
        }
        useManageFAQ.customeFAQ();
        handleClose();
        setId("");
        setQuestion("");
        setAnswer("");
        setDisplayStatus("client");
      } else {
        const resCreate = await createFAQ({
          variables: {
            data: {
              display: displayStatus,
              question: question,
              answer: answer,
            },
          },
        });

        if (resCreate.data) {
          successMessage("Create question and answer success", 3000);
        }
        useManageFAQ.customeFAQ();
        handleClose();
        setId("");
        setQuestion("");
        setAnswer("");
        setDisplayStatus("client");
      }
    } catch (error) {
      let cutErr = error.message.replace(/(ApolloError: )?Error: /, "");
      errorMessage(handleGraphqlErrors(cutErr), 3000);
    }
  };

  // DELETE
  const handleDeleteFAQ = async () => {
    try {
      const deleted = await deletFAQ({
        variables: {
          where: {
            _id: parseInt(id),
          },
        },
      });
      if (deleted?.data?.deleteFaq) {
        successMessage("Delete successfull!", 3000);
        handleDeleteClose();
        useManageFAQ.customeFAQ();
      }
    } catch (error) {
      let cutErr = error.message.replace(/(ApolloError: )?Error: /, "");
      errorMessage(handleGraphqlErrors(cutErr), 3000);
    }
  };

  const handleMultipleDelete = async () => {
    try {
      let successCount = 0;
      const totalCount = multiId.length;
      for (let i = 0; i < totalCount; i++) {
        const result = await deletFAQ({
          variables: {
            where: {
              _id: parseInt(multiId[i]),
            },
          },
        });
        if (result?.data?.deleteFaq) {
          successCount++;
          if (successCount === totalCount) {
            handleDeleteClose();
          }
        }
      }
      successMessage("These items selected were deleted successful!", 2000);
      useManageFAQ.customeFAQ();
    } catch (error) {
      let cutErr = error.message.replace(/(ApolloError: )?Error: /, "");
      errorMessage(handleGraphqlErrors(cutErr), 3000);
    }
  };

  const columns = [
    {
      field: "no",
      headerName: t("_no"),
      width: isMobile ? 50 : 70,
    },
    {
      field: "question",
      headerName: t("_question"),
      flex: 1,
      renderCell: (params) => {
        const question = params?.row?.question;

        return <> {heEncrypt.decode(question)} </>;
      },
    },
    {
      field: "answer",
      headerName: t("_answer"),
      flex: 1,
      renderCell: (params) => {
        const answer = params?.row?.answer;

        return <Fragment> {heEncrypt.decode(answer)} </Fragment>;
      },
    },
    {
      field: "display",
      headerName: t("_status"),
      width: isMobile ? 50 : 150,
      renderCell: (params) => {
        if (params?.row?.display === "client") {
          return (
            <div>
              <Chip
                sx={{
                  backgroundColor: "#dcf6e8",
                  color: "#29c770",
                }}
                label={t("_landing_page")}
                size="small"
              />
            </div>
          );
        } else {
          return (
            <div>
              <Chip
                sx={{
                  backgroundColor: "#FCE4E4",
                  color: "#EA5455",
                }}
                label={t("_client_back_office")}
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
      width: 70,

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
                permission?.hasPermission("faq_edit") ? "Edit" : "No permission"
              }
            >
              <NormalButton
                onClick={() => {
                  if (permission?.hasPermission("faq_edit")) {
                    setId(params?.id);
                    setQuestion(heEncrypt.decode(params?.row?.question));
                    setAnswer(heEncrypt.decode(params?.row?.answer));
                    setStatus("edit");
                    setOpen(true);
                    setDisplayStatus(params?.row?.display);
                  }
                }}
                sx={{
                  cursor: permission?.hasPermission("faq_edit")
                    ? "pointer"
                    : "not-allowed",
                  opacity: permission?.hasPermission("faq_edit") ? 1 : 0.5,
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
                permission?.hasPermission("faq_delete")
                  ? "Delete"
                  : "No permission"
              }
            >
              <NormalButton
                onClick={() => {
                  if (permission?.hasPermission("faq_delete")) {
                    setId(params?.id);
                    setOpenDelete(true);
                  }
                }}
                sx={{
                  cursor: permission?.hasPermission("faq_delete")
                    ? "pointer"
                    : "not-allowed",
                  opacity: permission?.hasPermission("faq_delete") ? 1 : 0.5,
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

  return (
    <React.Fragment>
      <BreadcrumbNavigate
        separatorIcon={<Icon.ForeSlash />}
        path={["FAQ", ""]}
        readablePath={[t("_faq"), t("_faq_manage")]}
      />
      <Paper
        sx={{
          mt: (theme) => theme.spacing(3),
          boxShadow: (theme) => theme.baseShadow.secondary,
          flex: "1 1 0%",
        }}
      >
        <Card>
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
                {t("_faq_title")}
              </Typography>
              <MUI.ListFilter>
                <Box
                  sx={{
                    display: isMobile ? "block" : "flex",
                    justifyContent: "space-between",
                    mb: 4,
                  }}
                >
                  <Box>
                    <Grid container spacing={2} sx={{ width: "100%" }}>
                      <Grid
                        item
                        sm={12}
                        md={4}
                        lg={4}
                        sx={{
                          width: isMobile ? "100%" : "auto",
                        }}
                      >
                        <SelectV1
                          disableLabel
                          selectStyle={{
                            height: "35px",
                            minHeight: "35px",
                            marginRight: "0.5rem",
                            width: isMobile ? "100%" : "150px",
                            color: "#989898",
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
                              { label: 15, value: 15 },
                              { label: 30, value: 30 },
                              { label: 50, value: 50 },
                            ],
                            defaultValue: [{ label: 10, value: 10 }],
                            sx: {
                              "& .MuiInputBase-root": {
                                height: "35px",
                              },
                            },
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                  <Box>
                    <Grid container spacing={2}>
                      <Grid
                        item
                        sm={12}
                        md={3}
                        lg={3}
                        sx={{ width: isMobile ? "98%" : "" }}
                      >
                        <TextField
                          sx={{
                            width: "100%",
                            marginTop: theme.spacing(1),
                            "& .MuiInputBase-root": {
                              input: {
                                "&::placeholder": {
                                  opacity: 1,
                                  color: "#989898",
                                },
                              },
                            },
                          }}
                          onChange={(e) => {
                            filter.dispatch({
                              type: filter.ACTION_TYPE.SEARCH,
                              payload: e.target.value,
                            });
                          }}
                          onBlur={(e) => {
                            filter.dispatch({
                              type: filter.ACTION_TYPE.SEARCH,
                              payload: e.target.value,
                            });
                          }}
                          placeholder={t("_search")}
                          size="small"
                          InputLabelProps={{
                            shrink: false,
                          }}
                        />
                      </Grid>
                      <Grid item sm={6} md={3} lg={3}>
                        <SelectV1
                          disableLabel
                          selectStyle={{
                            height: "35px",
                            minHeight: "35px",
                            marginTop: "0.3rem",
                          }}
                          selectProps={{
                            disableClear: true,
                            onChange: (e) =>
                              filter.dispatch({
                                type: filter.ACTION_TYPE.STATUS,
                                payload: e?.value || null,
                              }),
                            options: [
                              { label: t("_select_all"), value: "" },
                              { label: t("_landing_page"), value: "client" },
                              {
                                label: t("_client_back_office"),
                                value: "back",
                              },
                            ],
                          }}
                        />
                      </Grid>
                      <Grid item sm={6} md={3} lg={3}>
                        <NormalButton
                          onClick={() => {
                            if (
                              multiId?.length > 1 &&
                              permission?.hasPermission("faq_delete")
                            ) {
                              setOpenDelete(true);
                            }
                          }}
                          sx={{
                            padding: "0 10px",
                            height: "35px",
                            alignItems: "center",
                            border: "1px solid",
                            marginTop: theme.spacing(1),
                            borderColor:
                              theme.name === THEMES.DARK
                                ? "rgba(255,255,255,0.4)"
                                : "rgba(0,0,0,0.4)",
                            borderRadius: "4px",
                            ...(!multiId?.length > 0 ||
                            !permission?.hasPermission("faq_delete")
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
                      </Grid>
                      <Grid item sm={6} md={3} lg={3}>
                        <Button
                          color="primaryTheme"
                          variant="contained"
                          sx={{
                            padding: "0 12px",
                            height: "35px",
                            alignItems: "center",
                            border: "1px solid",
                            borderRadius: "6px",
                            marginTop: theme.spacing(1),
                            opacity: permission?.hasPermission("faq_create")
                              ? 1
                              : 0.5,
                            cursor: permission?.hasPermission("faq_create")
                              ? "pointer"
                              : "not-allowed",
                          }}
                          onClick={() => {
                            if (permission?.hasPermission("faq_create")) {
                              setOpen(true);
                              setStatus("create");
                              setQuestion("");
                              setId("");
                              setAnswer("");
                            }
                          }}
                        >
                          <AiOutlinePlus />
                          &nbsp; {isMobile ? "" : t("_create_new")}
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              </MUI.ListFilter>
            </Box>

            <DataGrid
              sx={{
                borderRadius: 0,
                height: "100% !important",
                "& .MuiDataGrid-columnSeparator": { display: "none" },
                "& .MuiDataGrid-virtualScroller": {
                  overflowX: "hidden",
                },
                "& .MuiDataGrid-cell:focus": {
                  outline: "none",
                },
              }}
              autoHeight
              getRowId={(row) => row._id}
              rows={useManageFAQ.data || []}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 5 },
                },
              }}
              pageSizeOptions={[5, 10]}
              checkboxSelection
              disableSelectionOnClick
              disableColumnFilter
              disableColumnMenu
              hideFooter
              onSelectionModelChange={(ids) => {
                useManageFAQ.setSelectedRow(ids);
                setMultiId(ids);
              }}
            />
            {useManageFAQ?.data?.length > filter.state.pageSize && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    padding: (theme) => theme.spacing(4),
                  }}
                >
                  Showing 1 to 10 of {useManageFAQ.total} entries
                </Box>
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
                    total={Math.ceil(
                      useManageFAQ.total / filter.data.pageLimit,
                    )}
                    setCurrentPage={(e) =>
                      filter.dispatch({
                        type: filter.ACTION_TYPE.PAGINATION,
                        payload: e,
                      })
                    }
                  />
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>
      </Paper>
      <Dialog
        open={open}
        maxWidth="lg"
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle
          id="responsive-dialog-title"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="body" sx={{ color: "#5D596C" }}>
            {question ? t("_update_faq_title") : t("_create_faq_title")}
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "#E2E1E5",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            onClick={handleClose}
          >
            <ClearIcon sx={{ color: "#5D596C" }} />
          </Box>
        </DialogTitle>

        <DialogContent>
          <Grid container spacing={4} sx={{ mt: 3 }}>
            <Grid item lg={12} md={12} xs={12}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  {t("_status")}
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Age"
                  onChange={(e) => setDisplayStatus(e.target.value)}
                  value={displayStatus}
                >
                  <MenuItem value="client">{t("_landing_page")}</MenuItem>
                  <MenuItem value="back">{t("_client_back_office")}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item lg={12} md={12} xs={12}>
              <TextField
                type="text"
                label={t("_question_placeholder")}
                fullWidth
                onChange={(e) => setQuestion(e.target.value)}
                value={question}
              />
            </Grid>
          </Grid>

          <Textarea
            rows={6}
            aria-label="maximum height"
            placeholder={t("_answer_placeholder")}
            onChange={(e) => setAnswer(e.target.value)}
            value={answer}
          />
        </DialogContent>

        <DialogActions
          sx={{
            mb: 5,
            ml: 5,
            display: "flex",
            alignItems: "center",
            justifyContent: "start",
          }}
        >
          <Button
            variant="contained"
            color="primaryTheme"
            onClick={handleCrateFAQ}
            autoFocus
          >
            {question ? t("_update_button") : t("_save_button")}
          </Button>
          <Button
            autoFocus
            variant="contained"
            color="secondaryTheme"
            onClick={handleClose}
          >
            {t("_cancel_button")}
          </Button>
        </DialogActions>
      </Dialog>

      <DialogDeleteV1
        isOpen={openDelete}
        onClose={handleDeleteClose}
        onConfirm={multiId.length > 1 ? handleMultipleDelete : handleDeleteFAQ}
      />
    </React.Fragment>
  );
}

export default Index;
