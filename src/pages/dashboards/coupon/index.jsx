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
  styled,
  useMediaQuery,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import moment from "moment";
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { errorMessage, successMessage } from "../../../components/Alerts";
import BreadcrumbNavigate from "../../../components/BreadcrumbNavigate";
import NormalButton from "../../../components/NormalButton";
import PaginationStyled from "../../../components/PaginationStyled";
import { THEMES } from "../../../constants";
import {
  DateOfNumber,
  compareIndochinaDateToGeneral,
  indexPagination,
} from "../../../functions";
import * as Icon from "../../../icons/icons";
import useFilterAnnouncement from "../announcement/hooks/useFilterAnnouncement";
import DatePickerV1 from "../components/DatePickerV1";
import DialogDeleteV1 from "../components/DialogDeleteV1";
import DialogForm from "../components/DialogForm";
import SelectV1 from "../components/SelectV1";
import * as MUI from "../css/manageFile";
import Reload from "../help/Reload";
import UseAction from "../help/hooks/useAction";
import {
  CREATE_COUPON,
  CREATE_TYPE_COUPON,
  DELETE_TYPE_COUPON,
  UPDATE_TYPE_COUPON,
} from "./apollo";
import useManageTypeCoupon from "./hooks/useManageTypeCoupon";
import useTotalCoupon from "./hooks/useTotalCoupon";
import { useTranslation } from "react-i18next";

const CustomCouponEmpty = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "50%",

  left: "50%",
  fontSize: "2rem",
  fontWeight: theme.typography.h1.fontWeight,
}));

const createValidationSchema = Yup.object().shape({
  typeCoupon: Yup.string().required("Required"),
  total: Yup.string().required("Required"),
  actionCoupon: Yup.string().required("Required"),
  unit: Yup.string().required("Required"),
  status: Yup.string().required("Required"),
  startDate: Yup.string().required("Required"),
  expird: Yup.string().required("Required"),
});
const editValidationSchema = Yup.object().shape({
  typeCoupon: Yup.string().required("Required"),
  total: Yup.string().required("Required"),
  actionCoupon: Yup.string().required("Required"),
});

function Index() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = createTheme();
  const isMobile = useMediaQuery("(max-width:768px)");
  const [isCoupon, setIsCoupon] = useState(true);
  const [deleteMultiOpen, setDeleteMultiOpen] = useState(false);
  const filter = useFilterAnnouncement();
  const manageTypeCoupon = useManageTypeCoupon({ filter: filter.data });
  const manageTotalCoupon = useTotalCoupon({ filter: filter.data });
  const [deleteCoupon] = useMutation(DELETE_TYPE_COUPON);
  const [createCoupon] = useMutation(CREATE_COUPON);
  const [createTypeCoupon] = useMutation(CREATE_TYPE_COUPON);
  const [updateTypeCoupon] = useMutation(UPDATE_TYPE_COUPON);
  // const [updateCoupon] = useMutation(UPDATE_COUPON);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const unitOptions = [
    { label: "percent", value: "percent" },
    { label: "point", value: "point" },
    { label: "discount", value: "discount" },
  ];
  const statusOptions = [
    { label: "active", value: "active" },
    { label: "inactive", value: "inactive" },
  ];
  const [dataForEvents, setDataForEvents] = React.useState({
    action: "",
    type: null,
    data: {},
  });

  const formFields = useMemo(() => {
    const defaultValue = dataForEvents.data ?? null;
    return [
      {
        name: "typeCoupon",
        label: t("_coupon_name"),
        value: defaultValue.typeCoupon || "",
        type: "text",
      },
      {
        name: "total",
        label: t("_total"),
        value: manageTotalCoupon?.total || defaultValue.total,
        type: "number",
        disabled: manageTotalCoupon?.total || defaultValue.total ? true : false,
      },
      {
        name: "actionCoupon",
        label: t("_amount"),
        value: defaultValue.actionCoupon || "",
        type: "number",
      },
      {
        name: "unit",
        label: t("_unit"),
        disableClear: true,
        value: unitOptions.filter(
          (unit) => unit.value === defaultValue.unit,
        )?.[0],
        type: "select",
        options: unitOptions,
      },
      {
        name: "status",
        label: t("_status"),
        disableClear: true,
        value: statusOptions.filter(
          (status) => status.value === defaultValue.status,
        )?.[0],
        type: "select",
        options: statusOptions,
      },
      {
        name: "startDate",
        label: t("_start_date"),
        value: defaultValue.startDate
          ? moment(defaultValue.startDate, "YYYY-MM-DD").toDate()
          : "",
        type: "date",
      },
      {
        name: "expird",
        label: t("_expired_date"),
        value: defaultValue.expird
          ? moment(defaultValue.expird, "YYYY-MM-DD").toDate()
          : "",
        type: "date",
      },
    ];
  }, [dataForEvents.data, manageTotalCoupon.total]);

  const resetDataForEvents = () => {
    setDataForEvents((state) => ({
      ...state,
      action: "",
      data: {},
    }));
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
    filter.dispatch({
      type: filter.ACTION_TYPE.ID,
      payload: null,
    });
  };
  const deleteMultiHandleClose = () => {
    setDeleteMultiOpen(false);
    resetDataForEvents();
  };
  const createHandleClose = () => {
    setCreateOpen(false);
    resetDataForEvents();
  };

  const handleEdit = async (inputValues) => {
    try {
      await updateTypeCoupon({
        variables: {
          where: {
            _id: parseInt(filter.state.id),
          },
          data: {
            typeCoupon: inputValues.typeCoupon,
            actionCoupon: String(inputValues.actionCoupon),
            startDate: compareIndochinaDateToGeneral(inputValues.startDate),
            expird: compareIndochinaDateToGeneral(inputValues.expird),
            status: inputValues.status,
            unit: inputValues.unit.value,
          },
        },
        onCompleted: async () => {
          editHandleClose();
          manageTypeCoupon.customQueryTypeCoupon();
          successMessage("Update coupon success", 2000);
        },
      });
    } catch (error) {
      errorMessage("Update failed", 2000);
    }
  };

  const handleCreate = async (inputValues) => {
    const values = {
      typeCoupon: inputValues.typeCoupon,
      actionCoupon: String(inputValues.actionCoupon),
      unit: inputValues.unit,
      status: inputValues.status,
      startDate: compareIndochinaDateToGeneral(inputValues.startDate),
      expird: compareIndochinaDateToGeneral(inputValues.expird),
    };
    try {
      await createTypeCoupon({
        variables: {
          data: { ...values },
        },
        onCompleted: async (data) => {
          if (data.createTypecoupon?._id) {
            await createCoupon({
              variables: {
                data: {
                  totalCreate: parseInt(inputValues.total),
                  typeCouponID: parseInt(data.createTypecoupon?._id),
                },
              },
            });
          }
          successMessage("Create coupon success", 2000);
          createHandleClose();
          manageTypeCoupon.customQueryTypeCoupon();
        },
      });
    } catch (error) {
      errorMessage("Create coupon failed", 2000);
    }
  };

  const handleMultiDelete = async () => {
    setLoading(true);
    try {
      for (let i = 0; i < manageTypeCoupon.selectedRow.length; i++) {
        deleteCoupon({
          variables: {
            where: {
              _id: manageTypeCoupon.selectedRow[i]?._id,
            },
          },
          onCompleted: () => {
            manageTypeCoupon.customQueryTypeCoupon();
          },
        });
      }
      setLoading(false);
      successMessage("Delete Coupon success", 2000);
    } catch (error) {
      setLoading(false);
      errorMessage("Delete filed please try again ", 2000);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      deleteCoupon({
        variables: {
          where: {
            _id: parseInt(dataForEvents.data?._id),
          },
        },
        onCompleted: () => {
          successMessage("Delete Coupon success", 2000);
          setLoading(false);
          manageTypeCoupon.customQueryTypeCoupon();
        },
      });
    } catch (error) {
      errorMessage("Delete coupon failed", 2000);
    }
  };

  const hanleSelect = (data) => {
    const selectedOptionIds = data.map((dataId) => {
      const option = manageTypeCoupon.data.find(
        (option) => parseInt(option._id) === parseInt(dataId),
      );
      if (option) {
        return option;
      }
      return "";
    });
    manageTypeCoupon.setSelectedRow(selectedOptionIds);
  };
  React.useEffect(() => {
    setDataForEvents((state) => ({
      ...state,
      data: { ...state.data, action: "email" },
    }));
  }, [dataForEvents.action]);

  React.useEffect(() => {
    if (dataForEvents.action && dataForEvents.data) {
      menuOnClick(dataForEvents.action);
    }
  }, [dataForEvents.action]);

  const menuOnClick = async (action) => {
    switch (action) {
      case "edit":
        setEditOpen(true);
        filter.dispatch({
          type: filter.ACTION_TYPE.ID,
          payload: dataForEvents.data._id,
        });
        break;
      case "delete":
        setDeleteOpen(true);
        break;
      case "open":
        navigate(`/dashboard/coupon/detail/${dataForEvents.data._id}`);
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
      field: "typeCoupon",
      headerName: t("_coupon_type_name"),
      flex: 1,
      minWidth: 200,
      sortable: false,
    },
    {
      field: "actionCoupon",
      headerName: t("_amount"),
      flex: 1,
      minWidth: 100,
      sortable: false,
      renderCell: (params) => {
        return <div>{params.row?.actionCoupon + "  " + params.row?.unit}</div>;
      },
    },

    {
      field: "expired",
      headerName: t("_expired_date"),
      flex: 1,
      sortable: false,
      minWidth: 100,
      renderCell: (params) => {
        return <div>{DateOfNumber(params.row.expird)}</div>;
      },
    },
    {
      field: "status",
      headerName: t("_status"),
      width: 100,
      sortable: false,
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
      width: 150,
      sortable: false,
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
    <div>
      <React.Fragment>
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <BreadcrumbNavigate
            separatorIcon={<Icon.ForeSlash />}
            path={["coupon", "coupon"]}
            readablePath={[t("_coupon_type"), t("_manage_coupon_type")]}
          />
          {isCoupon ? (
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
                    {t("_coupon_type_title")}
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
                              {...(manageTypeCoupon.selectedRow.length && {
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
                                ...(manageTypeCoupon.selectedRow.length < 2
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
                      rows={manageTypeCoupon?.data || []}
                      getRowId={(row) => row._id}
                      columns={columns}
                      AutoGenerateColumns="True"
                      checkboxSelection
                      disableSelectionOnClick
                      disableColumnFilter
                      hideFooter
                      onSelectionModelChange={(ids) => {
                        manageTypeCoupon.setSelectedRow(ids);
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
                    {manageTypeCoupon?.total > 0 && (
                      <Box
                        sx={{
                          padding: (theme) => theme.spacing(4),
                        }}
                      >
                        Showing {filter?.state?.currentPageNumber} to &nbsp;
                        {filter?.state?.pageLimit} &nbsp;of&nbsp;
                        {manageTypeCoupon?.total} &nbsp; entries
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
                      {filter.state?.pageLimit < manageTypeCoupon.total && (
                        <PaginationStyled
                          currentPage={filter.data.currentPageNumber}
                          total={Math.ceil(
                            manageTypeCoupon.total / filter.data.pageLimit,
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
              <Reload isOpen={loading} onClose={handleLoadingClose} />
              <DialogDeleteV1
                isOpen={deleteOpen}
                onClose={deleteHandleClose}
                onConfirm={handleDelete}
                label={`code coupon ${dataForEvents.data.typeCoupon} `}
              />
              {deleteMultiOpen && (
                <DialogDeleteV1
                  isOpen={deleteMultiOpen}
                  onClose={deleteMultiHandleClose}
                  onConfirm={handleMultiDelete}
                  label="multi items? This action is irreversible. Confirm?"
                />
              )}

              {editOpen && manageTotalCoupon.total && (
                <DialogForm
                  loading={loading}
                  formFields={formFields}
                  disableDefaultButton
                  title={t("_edit_coupon_type_title")}
                  onSubmit={handleEdit}
                  validationSchema={editValidationSchema}
                  isOpen={editOpen}
                  onClose={editHandleClose}
                />
              )}

              <DialogForm
                loading={loading}
                formFields={formFields}
                disableDefaultButton
                title={t("_create_coupon_type_title")}
                onSubmit={handleCreate}
                validationSchema={createValidationSchema}
                isOpen={createOpen}
                onClose={createHandleClose}
              />
            </Paper>
          ) : (
            <CustomCouponEmpty>{t("_coupon")}</CustomCouponEmpty>
          )}
        </Box>
      </React.Fragment>
    </div>
  );
}

export default Index;
