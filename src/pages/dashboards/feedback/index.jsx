import React, { forwardRef, useMemo, useRef } from "react";
import * as Icon from "../../../icons/icons";
import * as Mui from "../css/feedback";
import { useTranslation } from "react-i18next";

// components
import { useMutation } from "@apollo/client";
import { DataGrid } from "@mui/x-data-grid";
import BreadcrumbNavigate from "../../../components/BreadcrumbNavigate";
import NormalButton from "../../../components/NormalButton";
import PaginationStyled from "../../../components/PaginationStyled";
import { THEMES } from "../../../constants";
import SelectV1 from "../components/SelectV1";
import useFilter from "../manageFile/hooks/useFilter";
import { DELETE_FEEDBACK } from "./apollo";
import UsePrint from "./hooks/usePrint";

// material ui
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
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
  useTheme,
} from "@mui/material";
import { CSVLink } from "react-csv";
import { errorMessage, successMessage } from "../../../components/Alerts";
import { DateFormat, handleGraphqlErrors } from "../../../functions";
import DialogDeleteV1 from "../components/DialogDeleteV1";
import DialogPreviewFeedback from "../components/DialogPreviewFeedback";
import useManageFeedback from "./hooks/useManageFeedback";
import usePermission from "../../../hooks/usePermission";
import useAuth from "../../../hooks/useAuth";

// eslint-disable-next-line react/display-name
const CsvLinkWithRef = forwardRef((props, ref) => {
  const { data, separator } = props;

  const memoizedData = useMemo(() => data, [data]);

  return (
    <CSVLink data={memoizedData} separator={separator} ref={ref}>
      {props.children}
    </CSVLink>
  );
});

function AdminFeedback() {
  const { t } = useTranslation();
  const theme = useTheme();
  const filter = useFilter();
  const csvInstance = useRef();
  const [printOpen, setPrintOpen] = React.useState(false);
  const isMobile = useMediaQuery("(max-width:768px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");
  const manageFeedback = useManageFeedback({ filter: filter.data });
  const { user } = useAuth();
  const permission = usePermission(user?._id);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [previewOpen, setPreviewOpen] = React.useState(false);
  const [dataForEvents, setDataForEvents] = React.useState({
    action: null,
    type: null,
    data: {},
  });
  const [selectedIds, setSelectedIds] = React.useState([]);

  function setImageSizeInHTML(htmlContent) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    const images = doc.querySelectorAll("img");

    images.forEach(function (image) {
      image.setAttribute("width", 50);
      image.setAttribute("height", 50);
      image.style.margin = "20px 0";
      image.style.display = "none";
    });

    return doc.documentElement.outerHTML;
  }

  const columns = [
    { field: "no", headerName: t("_no"), width: 100 },
    {
      field: "comment",
      headerName: t("_feedback"),
      flex: 1,
      editable: false,
      renderCell: (params) => {
        if (!params.row.comment) {
          return <div>--</div>;
        } else {
          return (
            <div>
              <p
                dangerouslySetInnerHTML={{
                  __html: setImageSizeInHTML(params.row.comment),
                }}
              />
            </div>
          );
        }
      },
    },
    {
      field: "customer",
      headerName: t("_customer"),
      flex: 1,
      renderCell: (params) => {
        const customer = params?.row?.createdBy?.email;
        if (customer == null) {
          return (
            <div>
              <Chip
                sx={{
                  backgroundColor: "rgba(168, 170, 174,0.16)",
                  color: "rgb(168, 170, 174)",
                }}
                label="Anonymous"
                size="small"
              />
            </div>
          );
        } else {
          return (
            <div>
              <Chip
                sx={{ backgroundColor: "#dcf6e8", color: "#29c770" }}
                label={customer}
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
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        return <span>{DateFormat(params.row.createdAt)}</span>;
      },
    },
    {
      field: "",
      headerName: t("_action"),
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              columnGap: (theme) => theme.spacing(2),
            }}
          >
            <Tooltip title="View detail" placement="top">
              <Box>
                <NormalButton
                  sx={{
                    opacity: !permission.hasPermission("feedback_view")
                      ? 0.5
                      : "",
                    cursor: !permission.hasPermission("feedback_view")
                      ? "not-allowed"
                      : "",
                  }}
                  disabled={!permission.hasPermission("feedback_view")}
                  onClick={() => {
                    if (permission?.hasPermission("feedback_view")) {
                      setDataForEvents({
                        action: "preview",
                        data: params.row,
                      });
                      setPreviewOpen(true);
                    }
                  }}
                >
                  <Icon.Eye
                    size="20px"
                    color={theme.name === THEMES.DARK ? "white" : "grey"}
                  />
                </NormalButton>
              </Box>
            </Tooltip>
            <Tooltip title="Delete Feedback " placement="top">
              <Box>
                <NormalButton
                  sx={{
                    opacity: !permission.hasPermission("feedback_delete")
                      ? 0.5
                      : "",
                    cursor: !permission.hasPermission("feedback_delete")
                      ? "not-allowed"
                      : "",
                  }}
                  disabled={!permission.hasPermission("feedback_delete")}
                  onClick={() => {
                    if (permission?.hasPermission("feedback_delete")) {
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
              </Box>
            </Tooltip>
          </Box>
        );
      },
    },
  ];

  const [feedbackDeleted] = useMutation(DELETE_FEEDBACK);
  const previewHandleClose = () => {
    setPreviewOpen(false);
    resetDataForEvents();
  };

  // function popup
  const resetDataForEvents = () => {
    setDataForEvents((state) => ({
      ...state,
      action: null,
      data: {},
    }));
  };

  const deleteHandleClose = () => {
    setDeleteOpen(false);
    resetDataForEvents();
  };

  const handleDeleteUser = async () => {
    try {
      const result = await feedbackDeleted({
        variables: {
          id: dataForEvents.data?._id,
        },
      });
      if (result?.data?.deleteFeedback) {
        deleteHandleClose();
        successMessage("Feedback is deleted!!", 2000);
        manageFeedback.customFeedback();
      }
    } catch (error) {
      let cutErr = error.message.replace(/(ApolloError: )?Error: /, "");
      errorMessage(handleGraphqlErrors(cutErr), 3000);
    }
  };

  const handleMultipleDelete = () => {
    setDeleteOpen(true);
  };

  const multipleDelete = async () => {
    try {
      let successCount = 0;
      const totalCount = selectedIds.length;
      for (let i = 0; i < totalCount; i++) {
        const result = await feedbackDeleted({
          variables: {
            id: selectedIds[i],
          },
        });
        if (result?.data?.deleteFeedback) {
          successCount++;
          if (successCount === totalCount) {
            deleteHandleClose();
            successMessage("All feedbacks are deleted!!", 2000);
            manageFeedback.customFeedback();
          }
        }
      }
    } catch (err) {
      let cutErr = error.message.replace(/(ApolloError: )?Error: /, "");
      errorMessage(handleGraphqlErrors(cutErr), 3000);
    }
  };

  const printHanleClose = () => {
    setPrintOpen(false);
  };

  const exportCSV = useMemo(
    () =>
      manageFeedback.data?.map((row, index) => {
        return {
          id: index + 1,
          rating: row?.rating,
          comment: row?.comment,
          performanceRating: row?.performanceRating,
          performanceComment: row?.performanceComment,
          designRating: row?.designRating,
          designComment: row?.designComment,
          serviceRating: row?.serviceRating,
          serviceComment: row?.serviceComment,
          owner: row?.createdBy?.email,
          date: row?.createdAt,
        };
      }) || [],
    [manageFeedback.data],
  );

  return (
    <React.Fragment>
      <Box sx={{ margin: "0.5rem 0" }}>
        <BreadcrumbNavigate
          separatorIcon={<Icon.ForeSlash />}
          path={["admin-feedback"]}
          readablePath={["Feedback"]}
        />
      </Box>
      <Paper elevation={3} sx={{ mt: 3 }}>
        <Card>
          <CardContent>
            <Mui.CardHeaderTitle>
              <h3>{t("_feedback_title")}</h3>
            </Mui.CardHeaderTitle>
            <Mui.CardHeaderFunction>
              <Mui.DivLeftHeader>
                <Grid container spacing={2}>
                  <Grid item sm={12} md={6} lg={4}>
                    <InputLabel sx={{ color: "#A5A3AE" }}>
                      {t("_display_amount")}
                    </InputLabel>
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
                          },
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              </Mui.DivLeftHeader>
              <Mui.DivRightHeader>
                <Grid container spacing={2}>
                  <Grid item sm={6} md={4} lg={4}>
                    <InputLabel sx={{ color: "#A5A3AE" }}>
                      {t("_search_title")}
                    </InputLabel>
                    <TextField
                      sx={{
                        width: "100%",
                        marginTop: theme.spacing(1),
                        "& .MuiInputBase-root": {
                          input: {
                            "&::placeholder": {
                              opacity: 1,
                            },
                          },
                        },
                      }}
                      onKeyDown={(e) => {
                        filter.dispatch({
                          type: filter.ACTION_TYPE.COMMENT,
                          payload: e.target.value,
                        });
                      }}
                      onBlur={(e) => {
                        filter.dispatch({
                          type: filter.ACTION_TYPE.COMMENT,
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
                  <Grid item sm={6} md={4} lg={4}>
                    <InputLabel sx={{ color: "#A5A3AE" }}>
                      {t("_export")}
                    </InputLabel>
                    <SelectV1
                      isDisabled={!permission?.hasPermission("feedback_edit")}
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
                    <CsvLinkWithRef
                      data={exportCSV}
                      separator={","}
                      ref={csvInstance}
                    />
                  </Grid>
                  <Grid item sm={6} md={4} lg={4}>
                    <InputLabel sx={{ color: "#A5A3AE" }}>
                      {t("_multiple_delete")}
                    </InputLabel>
                    <Button
                      variant="contained"
                      endIcon={<DeleteIcon />}
                      sx={{ marginTop: theme.spacing(1), width: "100%" }}
                      onClick={handleMultipleDelete}
                      disabled={
                        selectedIds.length > 1 &&
                        permission?.hasPermission("feedback_delete")
                          ? false
                          : true
                      }
                    >
                      {isTablet ? "" : t("_multiple_delete")}
                    </Button>
                  </Grid>
                </Grid>
              </Mui.DivRightHeader>
            </Mui.CardHeaderFunction>
            <Box
              sx={{
                width: "100%",
                flex: "1 1 0%",
                mt: 5,
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
                  "& .MuiDataGrid-cell:focus": {
                    outline: "none",
                  },
                }}
                autoHeight
                getRowId={(row) => row._id}
                rows={manageFeedback.data || []}
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
                  manageFeedback.setSelectedRow(ids);
                  setSelectedIds(ids);
                }}
              />
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {manageFeedback.total > 0 && (
                  <Box
                    sx={{
                      padding: (theme) => theme.spacing(4),
                    }}
                  >
                    Showing 1 to 10 of {manageFeedback.total} entries
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
                    total={Math.ceil(
                      manageFeedback.total / filter.data.pageLimit,
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
            </Box>
          </CardContent>
        </Card>
      </Paper>

      <DialogDeleteV1
        isOpen={deleteOpen}
        onClose={deleteHandleClose}
        onConfirm={selectedIds.length > 1 ? multipleDelete : handleDeleteUser}
      />

      <DialogPreviewFeedback
        data={{
          ...dataForEvents.data,
        }}
        isOpen={previewOpen}
        onClose={previewHandleClose}
      />

      <UsePrint
        open={printOpen}
        onClose={printHanleClose}
        exportCSV={exportCSV}
      />
    </React.Fragment>
  );
}

export default AdminFeedback;
