import React from "react";
import * as Icon from "../../../icons/icons";

// components
import BreadcrumbNavigate from "../../../components/BreadcrumbNavigate";
import NormalButton from "../../../components/NormalButton";
import { THEMES } from "../../../constants";
import { DateFormat } from "../../../functions";
import useManageCompany from "./hooks/manageCompany";
import useFilter from "./hooks/useFilter";

// material ui components and icons
import { useMutation } from "@apollo/client";
import AddIcon from "@mui/icons-material/Add";
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
  styled,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { errorMessage, successMessage } from "../../../components/Alerts";
import DialogCreateCompany from "../components/DialogCreateCompany";
import DialogDeleteCompany from "../components/DialogDeleteCompany";
import { MUTATION_DELETE_COMPANY } from "./apollo";
import { useTranslation } from "react-i18next";
import useAuth from "../../../hooks/useAuth";
import usePermission from "../../../hooks/usePermission";

// style css
const CardHeaderFunction = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
  },
}));

const DivLeftHeader = styled("div")(({ theme }) => ({
  width: "50%",
  [theme.breakpoints.down("sm")]: {
    width: "100%",
  },
}));

const DivRightHeader = styled("div")(({ theme }) => ({
  width: "30%",
  [theme.breakpoints.between("sm", "md")]: {
    width: "100%",
    marginLeft: "1rem",
  },
  [theme.breakpoints.down("sm")]: {
    width: "100%",
    marginTop: "0.5rem",
  },
}));

function Company() {
  const theme = useTheme();
  const { t } = useTranslation();
  const filter = useFilter();
  const manageCompany = useManageCompany({ filter: filter.data });
  const { user } = useAuth();
  const permission = usePermission(user?._id);
  const isTablet = useMediaQuery("(max-width: 1024px)");
  const isMobile = useMediaQuery("(max-width:767px)");
  const [selectedIds, setSelectedIds] = React.useState([]);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [isUpdate, setIsUpdate] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [dataForEvents, setDataForEvents] = React.useState({
    action: null,
    type: null,
    data: {},
  });

  const [deleteCompany] = useMutation(MUTATION_DELETE_COMPANY);

  const handleCloseCreateDialog = () => {
    setOpenDialog(false);
    setIsUpdate(false);
    // setDataForEvents({
    //   action: "",
    //   data: {},
    // });
  };

  const handleReloadData = () => {
    manageCompany.customCompany();
    setIsUpdate(false);
  };

  const handleCloseDialog = () => {
    setDeleteOpen(false);
  };

  const handleDeleteCompany = async () => {
    try {
      let result = await deleteCompany({
        variables: {
          id: dataForEvents?.data?._id,
        },
      });
      if (result?.data?.deletePartner) {
        setDeleteOpen(false);
        manageCompany.customCompany();
        successMessage("Delete successful!", 2500);
      }
    } catch (error) {
      errorMessage("Delete failed!", 2500);
    }
  };

  const handleMultipleDelete = async () => {
    try {
      let successCount = 0;
      const totalCount = selectedIds.length;
      for (let i = 0; i < totalCount; i++) {
        const result = await deleteCompany({
          variables: {
            id: selectedIds[i],
          },
        });
        if (result?.data?.deletePartner) {
          successCount++;
          if (successCount === totalCount) {
            handleCloseDialog();
            successMessage("The selected Companies are deleted!!", 2000);
            manageCompany.customCompany();
          }
        }
      }
    } catch (err) {
      errorMessage("Something went wrong. Please try again later", 3000);
    }
  };

  const columns = [
    { field: "no", headerName: t("_company_id"), width: 100 },
    {
      field: "name",
      headerName: t("_name"),
      flex: 1,
      editable: false,
    },
    {
      field: "email",
      headerName: t("_email"),
      flex: 1,
      editable: false,
    },
    {
      field: "phone",
      headerName: t("_phone"),
      flex: 1,
      editable: false,
    },
    {
      field: "address",
      headerName: t("_address"),
      flex: 1,
      editable: false,
    },
    {
      field: "status",
      headerName: t("_status"),
      flex: 1,
      renderCell: (params) => {
        const status = params?.row?.status;
        if (status == "active") {
          return (
            <div>
              <Chip
                sx={{
                  backgroundColor: "#DCF6E8",
                  color: "#29C770",
                }}
                label={status}
                size="small"
              />
            </div>
          );
        } else if (status == "inactive") {
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
                  backgroundColor: "#F4DBDB",
                  color: "#EA5455",
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
      headerName: t("_date"),
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
            <Tooltip
              title={
                permission?.hasPermission("company_edit")
                  ? "Edit SEO"
                  : "No permission"
              }
              placement="top"
            >
              <Box>
                <NormalButton
                  onClick={() => {
                    if (permission?.hasPermission("company_edit")) {
                      setOpenDialog(true);
                      setIsUpdate(true);
                      setDataForEvents({
                        action: "edit",
                        data: params.row,
                      });
                    }
                  }}
                  sx={{
                    ...(!permission?.hasPermission("company_edit")
                      ? {
                          cursor: "not-allowed",
                          opacity: 0.5,
                        }
                      : {
                          opacity: 1,
                        }),
                  }}
                >
                  <Icon.Edit
                    size="20px"
                    color={theme.name === THEMES.DARK ? "white" : "grey"}
                  />
                </NormalButton>
              </Box>
            </Tooltip>
            <Tooltip
              title={
                permission?.hasPermission("company_delete")
                  ? "Delete SEO"
                  : "No permission"
              }
              placement="top"
            >
              <Box>
                <NormalButton
                  onClick={() => {
                    if (permission?.hasPermission("company_delete")) {
                      setDataForEvents({
                        action: "delete_single",
                        data: params.row,
                      });
                      setTitle(params?.row?.name);
                      setDeleteOpen(true);
                    }
                  }}
                  sx={{
                    ...(!permission?.hasPermission("company_delete")
                      ? {
                          cursor: "not-allowed",
                          opacity: 0.5,
                        }
                      : {
                          opacity: 1,
                        }),
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

  return (
    <React.Fragment>
      <Box sx={{ margin: "0.5rem 0" }}>
        <BreadcrumbNavigate
          separatorIcon={<Icon.ForeSlash />}
          path={["seo"]}
          readablePath={[t("_company_title")]}
        />
      </Box>
      <Paper elevation={3} sx={{ mt: 3 }}>
        <Card>
          <CardContent>
            <CardHeaderFunction>
              <DivLeftHeader>
                <Grid container spacing={2}>
                  <Grid
                    item
                    sm={12}
                    md={12}
                    lg={6}
                    sx={{ width: isMobile ? "100%" : "auto" }}
                  >
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
                </Grid>
              </DivLeftHeader>
              <DivRightHeader>
                <Grid container spacing={2}>
                  <Grid
                    item
                    sm={6}
                    md={6}
                    lg={6}
                    sx={{ width: isMobile ? "50%" : "" }}
                  >
                    {isMobile ? (
                      ""
                    ) : (
                      <InputLabel sx={{ color: "#A5A3AE" }}>
                        {t("_multiple_delete")}
                      </InputLabel>
                    )}
                    <Button
                      variant="contained"
                      startIcon={<DeleteIcon />}
                      color="error"
                      sx={{
                        marginTop: theme.spacing(1),
                        width: "100%",
                        cursor: permission?.hasPermission("company_delete")
                          ? "pointer"
                          : "not-allowed",
                      }}
                      onClick={() => setDeleteOpen(true)}
                      disabled={
                        selectedIds.length > 1 &&
                        permission?.hasPermission("company_delete")
                          ? false
                          : true
                      }
                    >
                      {isTablet ? "" : t("_multiple_delete")}
                    </Button>
                  </Grid>
                  <Grid
                    item
                    sm={6}
                    md={6}
                    lg={6}
                    sx={{ width: isMobile ? "50%" : "" }}
                  >
                    {isMobile ? (
                      ""
                    ) : (
                      <InputLabel sx={{ color: "#A5A3AE" }}>
                        {t("_create_new")}
                      </InputLabel>
                    )}
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      sx={{ marginTop: theme.spacing(1), width: "100%" }}
                      onClick={() => {
                        setDataForEvents({
                          data: {},
                        });
                        setOpenDialog(true);
                      }}
                      disabled={
                        permission?.hasPermission("company_create")
                          ? false
                          : true
                      }
                    >
                      {isTablet ? "" : t("_create_new")}
                    </Button>
                  </Grid>
                </Grid>
              </DivRightHeader>
            </CardHeaderFunction>
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
                columns={columns}
                rows={(manageCompany.data || []).map((row) => ({
                  ...row,
                  id: row._id,
                }))}
                getRowId={(row) => row._id}
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
                  manageCompany.setSelectedRow(ids);
                  setSelectedIds(ids);
                }}
              />
            </Box>
          </CardContent>
        </Card>
      </Paper>

      <DialogCreateCompany
        data={dataForEvents.data}
        isOpen={openDialog}
        onClose={handleCloseCreateDialog}
        isUpdate={isUpdate}
        onLoad={handleReloadData}
      />

      <DialogDeleteCompany
        isOpen={deleteOpen}
        onClose={handleCloseDialog}
        onClick={
          selectedIds.length > 1 ? handleMultipleDelete : handleDeleteCompany
        }
        title={selectedIds.length > 1 ? "" : title}
      />
    </React.Fragment>
  );
}

export default Company;
