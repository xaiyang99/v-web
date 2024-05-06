import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { Fragment, useMemo, useRef, useState } from "react";
import { CSVLink } from "react-csv";
import { useTranslation } from "react-i18next";

// components
import moment from "moment";
import { errorMessage, successMessage } from "../../../../components/Alerts";
import {
  CutfileName,
  indexPagination,
  truncateName,
} from "../../../../functions";
import * as MUI from "../../css/payment";
import "./../../css/style.css";

import { useMutation } from "@apollo/client";
import { useSelector } from "react-redux";
import "react-responsive-pagination/themes/classic.css";
import NormalButton from "../../../../components/NormalButton";
import PaginationStyled from "../../../../components/PaginationStyled";
import { THEMES } from "../../../../constants";
import useAuth from "../../../../hooks/useAuth";
import usePermission from "../../../../hooks/usePermission";
import * as Icon from "../../../../icons/icons";
import { paymentState } from "../../../../redux/slices/paymentSlice";
import { DATE_PATTERN_FORMAT } from "../../../../utils/date";
import DropdownMenu from "../../../client-dashboard/components/DropdownMenu";
import DatePickerV1 from "../../components/DatePickerV1";
import DialogCustomPrint from "../../components/DialogCustomPrint";
import DialogDeleteV1 from "../../components/DialogDeleteV1";
import DialogFileEditStatus from "../../components/DialogFileEditStatus";
import DialogPreviewFileV1 from "../../components/DialogPreviewFileV1";
import SelectV1 from "../../components/SelectV1";
import { MUTATION_DELETE_PAYMENT } from "../apollo";
import useFilter from "./../hooks/useFilter";
import useManagePayments from "./../hooks/useManagePayments";
import useSelectPackages from "./../hooks/useSelectPackages";

function Main(props) {
  const theme = useTheme();
  const { t } = useTranslation();
  //data hooks
  const { currencySymbol } = useSelector(paymentState);
  const filter = useFilter();
  const { user } = useAuth();
  const permission = usePermission(user?._id);
  const managePayments = useManagePayments({ filter: filter.data });
  const selectPackages = useSelectPackages();
  const [dataForEvents, setDataForEvents] = React.useState({
    action: null,
    type: null,
    data: {},
  });

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [printOpen, setPrintOpen] = useState(false);
  const [reloading, setReloading] = useState(false);
  const csvInstance = useRef();
  const editHandleClose = () => {
    setEditOpen(false);
  };

  const [deleteType, setDeleteType] = useState("single");
  const [deletePayment] = useMutation(MUTATION_DELETE_PAYMENT);

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
      field: "customerName",
      headerName: t("_customer"),
      flex: 1,
      renderCell: (params) => {
        const { payerId } = params?.row;
        return (
          <div>
            {payerId.firstName} {payerId.lastName}
          </div>
        );
      },
    },
    {
      field: "packageName",
      headerName: t("_package_topic"),
      flex: 1,
      renderCell: (params) => {
        const { packageId } = params?.row;
        return <div>{packageId.name}</div>;
      },
    },
    {
      field: "paymentMethod",
      headerName: t("_payment_method"),
      flex: 1,
      renderCell: (params) => {
        const { paymentMethod } = params?.row;
        return <Fragment>{paymentMethod}</Fragment>;
      },
    },
    {
      field: "amount",
      headerName: t("_price"),
      flex: 1,
      renderCell: (params) => {
        const row = params?.row;
        return (
          <Fragment>
            {row?.amount || 0} {currencySymbol}
          </Fragment>
        );
      },
    },
    {
      field: "status",
      headerName: t("_status"),
      width: 200,
      renderCell: (params) => {
        const status = params.row.status;
        if (status === "success") {
          return (
            <div style={{ color: "green" }}>
              <Chip
                sx={{ backgroundColor: "#dcf6e8", color: "#29c770" }}
                label={status}
                size="small"
              />
            </div>
          );
        } else if (status === "cancel") {
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
        } else if (status === "failed") {
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
      renderCell: (params) =>
        moment(params.row.createdAt).format(DATE_PATTERN_FORMAT.date),
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
            }}
          >
            <NormalButton
              {...{
                ...(permission?.hasPermission("payment_view")
                  ? {
                      onClick: () => {
                        if (permission?.hasPermission("payment_view")) {
                          props.onEvent("invoicePreview", params.row);
                        }
                      },
                    }
                  : {
                      sx: {
                        opacity: 0.5,
                        cursor: "not-allowed",
                      },
                    }),
              }}
              onClick={() => {
                if (permission?.hasPermission("payment_view")) {
                  props.onEvent("invoicePreview", params.row);
                }
              }}
            >
              <Icon.Eye
                size="20px"
                color={theme.name === THEMES.DARK ? "white" : "grey"}
              />
            </NormalButton>
            <DropdownMenu
              onEvent={(name) => {
                if (permission?.hasPermission("payment_view")) {
                  props.onEvent(name, params.row);
                }
              }}
              items={[
                {
                  isDisabled: !permission?.hasPermission("payment_view")
                    ? true
                    : false,
                  name: t("_invoice"),
                  value: "invoiceEdit",
                  icon: (
                    <Icon.InvoiceIcon
                      style={{
                        width: "22px",
                        height: "22px",
                      }}
                    />
                  ),
                },
                {
                  isDisabled: !permission?.hasPermission("payment_view")
                    ? true
                    : false,
                  name: t("_receipt"),
                  value: "receiptPreview",
                  icon: (
                    <Icon.ReceiptIcon
                      style={{
                        width: "22px",
                        height: "22px",
                      }}
                    />
                  ),
                },
                {
                  isDisabled: !permission?.hasPermission("payment_delete")
                    ? true
                    : false,
                  name: t("_delete_button"),
                  value: "delete",
                  onClick: () => {
                    {
                      if (permission?.hasPermission("payment_delete")) {
                        setDeleteType("single");
                        setDataForEvents({
                          action: "delete_single",
                          data: params.row,
                        });
                        setDeleteOpen(true);
                      }
                    }
                  },
                  icon: (
                    <Icon.TrashIcon
                      style={{
                        width: "22px",
                        height: "22px",
                      }}
                    />
                  ),
                },
              ]}
              icon={
                <Icon.DotAction
                  size="20px"
                  color={theme.name === THEMES.DARK ? "white" : "grey"}
                />
              }
            />
          </Box>
        );
      },
    },
  ];

  const exportCSV = useMemo(
    () =>
      managePayments.data?.map((row) => {
        const { _customerName, amount, createdAt, no, packageId, status } = row;
        return {
          no,
          _customerName,
          packageName: packageId.name,
          amount: `${amount} ${currencySymbol}`,
          status,
          createdAt: moment(createdAt).format(DATE_PATTERN_FORMAT.date),
        };
      }) || [],
    [managePayments.data],
  );

  const exportPDF = useMemo(
    () =>
      managePayments.data?.map((row) => {
        const { amount, createdAt } = row;
        return {
          ...row,
          amount: `${amount} ${currencySymbol}`,
          createdAt: moment(createdAt).format(DATE_PATTERN_FORMAT.date),
        };
      }) || [],
    [managePayments.data],
  );

  // edit file
  const handleEditFile = async () => {
    /* const updateFiles = await updateFilesManage({
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
      managePayments.customGetFiles();
    } */
  };

  // delete file;
  const handleDeleteFile = async () => {
    try {
      if (deleteType === "multiple") {
        const selectedData = managePayments.data.filter((data) =>
          managePayments.selectedRow.includes(data._id),
        );
        for (let i = 0; i < selectedData.length; i++) {
          let real_path = "";
          let path = selectedData[i]?.newPath;
          if (path == null) {
            real_path = "";
          } else {
            real_path = truncateName(path);
          }

          const result = await deletePayment({
            variables: {
              id: selectedData[i].paymentId,
            },
          });

          if (result.data?.deletePayment) {
            deleteHandleClose();
            filter.dispatch({
              type: filter.ACTION_TYPE.PAGINATION,
              payload: 1,
            });
          }
        }

        successMessage("Deleted successfully", 3000);
      } else {
        let real_path = "";
        if (dataForEvents.data.newPath == null) {
          real_path = "";
        } else {
          real_path = truncateName(dataForEvents.data.newPath);
        }

        deletePayment({
          variables: {
            id: dataForEvents.data.paymentId,
          },
          onCompleted: (data) => {
            if (data.deletePayment) {
              successMessage("Deleted successfully", 3000);
              deleteHandleClose();
              filter.dispatch({
                type: filter.ACTION_TYPE.PAGINATION,
                payload: 1,
              });
            } else {
              errorMessage("Delete failed", 3000);
            }
          },
        });
      }
    } catch (error) {
      let cutErr = error.message.replace(/(ApolloError: )?Error: /, "");
      if (cutErr === "DO_NOT_HAVE_PERMISSION") {
        errorMessage("You do not have a permission", 3000);
      } else {
        errorMessage("Delete Failed try again!", 3000);
      }
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
              {t("_payment_title")}
            </Typography>
            <MUI.ListFilter>
              <Grid
                container
                columnSpacing={5}
                sx={{
                  alignItems: "end",
                }}
              >
                <Grid item xs={3} sm={3} md={3} lg={3}>
                  <MUI.FilterPayment>
                    <SelectV1
                      selectStyle={{
                        height: "35px",
                        minHeight: "35px",
                      }}
                      label={t("_package_topic")}
                      selectProps={{
                        options: selectPackages.options,
                        onChange: (e) =>
                          filter.dispatch({
                            type: filter.ACTION_TYPE.PACKAGE_NAME,
                            payload: e?.value || null,
                          }),
                        placeholder: t("_package_topic"),
                      }}
                    />
                  </MUI.FilterPayment>
                </Grid>
                <Grid item xs={3} sm={3} md={3} lg={3}>
                  <MUI.FilterPayment>
                    <SelectV1
                      label={t("_payment_method")}
                      selectStyle={{
                        height: "35px",
                        minHeight: "35px",
                      }}
                      selectProps={{
                        onChange: (e) =>
                          filter.dispatch({
                            type: filter.ACTION_TYPE.PAYMENT_METHOD,
                            payload: e?.value || null,
                          }),
                        options: [
                          { label: "BCEL One", value: "bcelone" },
                          { label: "Credit Card", value: "credit_card" },
                          { label: "Google pay", value: "google_pay" },
                          { label: "Apple store", value: "apple_pay" },
                        ],
                        placeholder: t("_payment_method"),
                      }}
                    />
                  </MUI.FilterPayment>
                </Grid>
                <Grid item xs={3} sm={3} md={3} lg={3}>
                  <MUI.FilterPayment>
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
                  </MUI.FilterPayment>
                </Grid>
                <Grid item xs={3} sm={3} md={3} lg={3}>
                  <MUI.FilterPayment>
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
                  </MUI.FilterPayment>
                </Grid>
              </Grid>
              <MUI.ListFilter>
                <Grid
                  container
                  columnSpacing={5}
                  sx={{
                    alignItems: "end",
                  }}
                >
                  <Grid item xs={3} sm={3} md={3} lg={3}>
                    <MUI.FilterPayment>
                      <SelectV1
                        options={[{ label: "one", value: 1 }]}
                        selectStyle={{
                          height: "35px",
                          minHeight: "35px",
                        }}
                        label={t("_status")}
                        selectProps={{
                          onChange: (e) =>
                            filter.dispatch({
                              type: filter.ACTION_TYPE.STATUS,
                              payload: e?.value || null,
                            }),
                          options: [
                            { label: "Success", value: "success" },
                            { label: "Refund", value: "refunds" },
                            { label: "Failed", value: "failed" },
                            { label: "Cancel", value: "cancelled" },
                          ],
                          placeholder: t("_status"),
                        }}
                      />
                    </MUI.FilterPayment>
                  </Grid>
                </Grid>
              </MUI.ListFilter>
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
                        <MUI.FilterPayment>
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
                        </MUI.FilterPayment>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={6} sm={6} md={6} lg={6}>
                    <Box
                      columnGap={5}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <MUI.FilterPayment sx={{ flexGrow: 1 }}>
                        <TextField
                          sx={{
                            width: "100%",
                            "& .MuiInputBase-root": {
                              height: "35px",
                              minHeight: "35px",
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
                      </MUI.FilterPayment>
                      <MUI.FilterPayment sx={{ width: 200 }}>
                        <SelectV1
                          isDisabled={
                            !permission?.hasPermission("payment_edit")
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
                                  /*  outline: `1px solid ${theme.palette.primaryTheme.main} !important`, */
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
                      </MUI.FilterPayment>
                      <MUI.FilterPayment sx={{ width: 150 }}>
                        <NormalButton
                          {...(managePayments.selectedRow.length > 1 &&
                            permission?.hasPermission("payment_delete") && {
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
                            ...(!permission?.hasPermission("payment_delete") ||
                            managePayments.selectedRow.length <= 1
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
                      </MUI.FilterPayment>
                      {/* <MUI.FilterPayment>
                        <DropdownMenu
                          onEvent={(name) => {
                            props.onEvent(name);
                          }}
                          MenuProps={{
                            PaperProps: {
                              sx: {
                                width: "150px",
                              },
                            },
                          }}
                          items={[
                            {
                              name: "Invoice",
                              value: "invoiceAdd",
                              icon: (
                                <Icon.InvoiceIcon
                                  style={{
                                    width: "22px",
                                    height: "22px",
                                  }}
                                />
                              ),
                            },
                            {
                              name: "Receipt",
                              value: "receiptAdd",
                              icon: (
                                <Icon.ReceiptIcon
                                  style={{
                                    width: "22px",
                                    height: "22px",
                                  }}
                                />
                              ),
                            },
                          ]}
                          icon={
                            <Typography
                              component="div"
                              sx={{
                                display: "flex",
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
                            >
                              Create Bill
                              <Icon.AngleDownIcon
                                style={{
                                  marginLeft: "10px",
                                }}
                              />
                            </Typography>
                          }
                        />
                      </MUI.FilterPayment> */}
                    </Box>
                  </Grid>
                </Grid>
              </MUI.ListFilter>
              <CSVLink
                data={exportCSV}
                separator={","}
                ref={csvInstance}
                headers={[
                  { label: "ID", key: "no" },
                  { label: "Customer Name", key: "_customerName" },
                  { label: "Package Name", key: "packageName" },
                  { label: "Price", key: "amount" },
                  { label: "Status", key: "status" },
                  { label: "Date", key: "createdAt" },
                ]}
              />
            </MUI.ListFilter>
          </Box>
          &nbsp;
          <Box
            style={{
              width: "100%",
              height: "500px",
              flex: "1 1 0%",
            }}
          >
            <DataGrid
              sx={{
                "& .MuiDataGrid-main": {
                  minHeight: "500px !important",
                },
                borderRadius: 0,
                "& .MuiDataGrid-columnSeparator": { display: "none" },
                "& .MuiDataGrid-virtualScroller": {
                  overflowX: "hidden",
                },
              }}
              rows={managePayments.data || []}
              getRowId={(row) => row._id}
              columns={columns}
              AutoGenerateColumns="True"
              checkboxSelection
              disableSelectionOnClick
              disableColumnFilter
              disableColumnMenu
              hideFooter
              onSelectionModelChange={(ids) => {
                managePayments.setSelectedRow(ids);
              }}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            {managePayments.total > 0 && (
              <Box
                sx={{
                  padding: (theme) => theme.spacing(4),
                }}
              >
                Showing 1 to 10 of {managePayments.total} entries
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
                total={Math.ceil(managePayments.total / filter.data.pageLimit)}
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
            ? CutfileName(
                dataForEvents.data.filename,
                dataForEvents.data.newFilename,
              )
            : "",
          owner: dataForEvents.data.createdBy?.username,
          date: dataForEvents.data.createdAt,
        }}
        isOpen={previewOpen}
        onClose={previewHandleClose}
      />
      <DialogCustomPrint
        open={printOpen}
        onClose={printHanleClose}
        columns={[
          {
            header: "ID",
            name: "no",
          },
          {
            header: "Customer Name",
            name: "_customerName",
          },
          {
            header: "Package Name",
            name: "packageId.name",
          },
          {
            header: "Price",
            name: "amount",
          },
          {
            header: "Status",
            name: "status",
          },
          {
            header: "Date",
            name: "createdAt",
          },
        ]}
        rows={exportPDF}
      />
    </>
  );
}

export default Main;
