import {
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { useMemo, useRef, useState } from "react";
import { CSVLink } from "react-csv";

// components
import { errorMessage, successMessage } from "../../../../components/Alerts";
import {
  CutfileName,
  indexPagination,
  prettyNumberFormat,
  truncateName,
} from "../../../../functions";
import * as MUI from "../../css/invoice";
import "./../../css/style.css";

import { useMutation } from "@apollo/client";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import "react-responsive-pagination/themes/classic.css";
import NormalButton from "../../../../components/NormalButton";
import PaginationStyled from "../../../../components/PaginationStyled";
import { THEMES } from "../../../../constants";
import useAuth from "../../../../hooks/useAuth";
import usePermission from "../../../../hooks/usePermission";
import * as Icon from "../../../../icons/icons";
import {
  PACKAGE_TYPE,
  paymentState,
} from "../../../../redux/slices/paymentSlice";
import DatePickerV1 from "../../components/DatePickerV1";
import DialogCustomPrint from "../../components/DialogCustomPrint";
import DialogDeleteV1 from "../../components/DialogDeleteV1";
import DialogFileEditStatus from "../../components/DialogFileEditStatus";
import DialogPreviewFileV1 from "../../components/DialogPreviewFileV1";
import SelectV1 from "../../components/SelectV1";
import { MUTATION_DELETE_INVOICE } from "../apollo";
import useSelectPackages from "../hooks/useSelectPackages";
import useFilter from "./../hooks/useFilter";
import useManageInvoices from "./../hooks/useManageInvoices";

function Main(props) {
  const theme = useTheme();
  const { user } = useAuth();
  const { t } = useTranslation();
  const { currencySymbol, ...paymentSelector } = useSelector(paymentState);
  const filter = useFilter();
  const manageInvoices = useManageInvoices({ filter: filter.data });
  const permission = usePermission(user?._id);
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

  const selectPackages = useSelectPackages();

  const [deleteType, setDeleteType] = useState("single");
  const [deleteInvoice] = useMutation(MUTATION_DELETE_INVOICE);

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
      field: "packageName",
      headerName: t("_package_topic"),
      flex: 1,
      renderCell: (params) => {
        const { packageId } = params?.row;
        return <div>{packageId.name}</div>;
      },
    },
    {
      field: "priceMonthly",
      headerName: t("_monthly_price"),
      flex: 1,
      renderCell: (params) => {
        const {
          packageId: { name, type, price, ...packageData },
        } = params?.row;
        return (
          <div>
            {type === PACKAGE_TYPE.monthly &&
              `${prettyNumberFormat(price, {}, "0")} ${currencySymbol}`}
          </div>
        );
      },
    },
    {
      field: "priceYearly",
      headerName: t("_yearly_price"),
      flex: 1,
      renderCell: (params) => {
        const {
          packageId: { name, type, price, ...packageData },
        } = params?.row;
        return (
          <div>
            {type === PACKAGE_TYPE.annual &&
              `${prettyNumberFormat(price, {}, "0")} ${currencySymbol}`}
          </div>
        );
      },
    },
    {
      field: "subTotal",
      headerName: t("_subtotal"),
      flex: 1,
      renderCell: (params) => {
        const {
          packageId: { name, type, price, ...packageData },
        } = params?.row;
        return (
          <div>
            {prettyNumberFormat(price, {}, "0")} {currencySymbol}
          </div>
        );
      },
    },
    {
      field: "total",
      headerName: t("_total"),
      flex: 1,
      renderCell: (params) => {
        const {
          packageId: { name, type, price, ...packageData },
        } = params?.row;
        return (
          <div>
            {prettyNumberFormat(
              price + price * paymentSelector.taxValue,
              {},
              "0",
            )}{" "}
            {currencySymbol}
          </div>
        );
      },
    },
    {
      field: "actions",
      headerName: t("_action"),
      headerAlign: "center",
      align: "center",
      sortable: false,
      renderCell: (params) => {
        const { _id, status, name, newName, path, createdBy, packageId } =
          params.row;
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
                ...(packageId?._id && permission?.hasPermission("invoice_view")
                  ? {
                      onClick: () => {
                        if (permission?.hasPermission("invoice_view")) {
                          props.onEvent("invoicePreviewByDataId", params.row);
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
            >
              <Icon.Eye
                size="20px"
                color={theme.name === THEMES.DARK ? "white" : "grey"}
              />
            </NormalButton>
            <NormalButton
              {...{
                ...(packageId?._id && permission?.hasPermission("invoice_edit")
                  ? {
                      onClick: () => {
                        if (permission?.hasPermission("invoice_edit")) {
                          props.onEvent("invoiceEditByDataId", params.row);
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
            >
              <Icon.Edit
                size="20px"
                color={theme.name === THEMES.DARK ? "white" : "grey"}
              />
            </NormalButton>
            <NormalButton
              {...{
                ...(permission?.hasPermission("invoice_edit")
                  ? {
                      onClick: () => {
                        if (permission?.hasPermission("invoice_delete")) {
                          setDeleteType("single");
                          setDataForEvents({
                            action: "delete_single",
                            data: params.row,
                          });
                          setDeleteOpen(true);
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
            >
              <Icon.Trash
                size="20px"
                color={theme.name === THEMES.DARK ? "white" : "grey"}
              />
            </NormalButton>
          </Box>
        );
      },
    },
  ];

  const exportCSV = useMemo(
    () =>
      manageInvoices.data?.map((row) => {
        const {
          packageId: { name, type, price, ...packageData },
          amount,
          no,
        } = row;
        return {
          no,
          priceMonthly:
            type === PACKAGE_TYPE.monthly
              ? `${prettyNumberFormat(price, {}, "0")} ${currencySymbol}`
              : null,
          priceYearly:
            type === PACKAGE_TYPE.annual
              ? `${prettyNumberFormat(price, {}, "0")} ${currencySymbol}`
              : null,
          subTotal: `${prettyNumberFormat(price, {}, "0")} ${currencySymbol}`,
          total: `${prettyNumberFormat(
            price + price * paymentSelector.taxValue,
            {},
            "0",
          )} ${currencySymbol}`,
        };
      }) || [],
    [manageInvoices.data],
  );

  const exportPDF = useMemo(
    () =>
      manageInvoices.data?.map((row, index) => {
        const {
          packageId: { name, type, price, ...packageData },
          amount,
          no,
        } = row;
        return {
          ...row,
          priceMonthly:
            type === PACKAGE_TYPE.monthly
              ? `${prettyNumberFormat(price, {}, "0")} ${currencySymbol}`
              : null,
          priceYearly:
            type === PACKAGE_TYPE.annual
              ? `${prettyNumberFormat(price, {}, "0")} ${currencySymbol}`
              : null,
          subTotal: `${prettyNumberFormat(price, {}, "0")} ${currencySymbol}`,
          total: `${prettyNumberFormat(
            price + price * paymentSelector.taxValue,
            {},
            "0",
          )} ${currencySymbol}`,
        };
      }) || [],
    [manageInvoices.data],
  );

  // edit file
  const handleEditFile = async (status) => {
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
  const handleDeleteInvoice = async () => {
    try {
      if (deleteType === "multiple") {
        const selectedData = manageInvoices.data.filter((data) =>
          manageInvoices.selectedRow.includes(data._id),
        );
        for (let i = 0; i < selectedData.length; i++) {
          let real_path = "";
          let path = selectedData[i]?.newPath;
          if (path == null) {
            real_path = "";
          } else {
            real_path = truncateName(path);
          }

          deleteInvoice({
            variables: {
              id: selectedData[i].invoiceId,
            },
            onCompleted: (data) => {
              if (data.deleteInvoice) {
                deleteHandleClose();
                filter.dispatch({
                  type: filter.ACTION_TYPE.PAGINATION,
                  payload: 1,
                });
              }
            },
          });
        }
        successMessage("Deleted successfully", 3000);
      } else {
        let real_path = "";
        if (dataForEvents.data.newPath == null) {
          real_path = "";
        } else {
          real_path = truncateName(dataForEvents.data.newPath);
        }

        const deletedData = deleteInvoice({
          variables: {
            id: dataForEvents.data.invoiceId,
          },
          onCompleted: (data) => {
            if (data.deleteInvoice) {
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
              {t("_invoice_title")}
            </Typography>
            <MUI.ListFilter>
              <Grid
                container
                columnSpacing={5}
                sx={{
                  alignItems: "end",
                }}
              >
                <Grid item xs={4} sm={4} md={4} lg={4}>
                  <MUI.FilterInvoice>
                    <SelectV1
                      selectStyle={{
                        height: "35px",
                        minHeight: "35px",
                      }}
                      label={t("_package_topic")}
                      selectProps={{
                        onChange: (e) =>
                          filter.dispatch({
                            type: filter.ACTION_TYPE.PACKAGE_NAME,
                            payload: e?.value || null,
                          }),
                        placeholder: t("_package_topic"),
                        menuPortalTarget: document.body,
                        options: selectPackages.options,
                      }}
                    />
                  </MUI.FilterInvoice>
                </Grid>
                <Grid item xs={4} sm={4} md={4} lg={4}>
                  <MUI.FilterInvoice>
                    <DatePickerV1
                      label={t("_start_date")}
                      datePickerProps={{
                        value: filter.state.createdAt.startDate,
                        onChange: (e) =>
                          filter.dispatch({
                            type: filter.ACTION_TYPE.CREATED_AT_START_DATE,
                            payload: e,
                          }),
                        onError: (e) =>
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
                  </MUI.FilterInvoice>
                </Grid>
                <Grid item xs={4} sm={4} md={4} lg={4}>
                  <MUI.FilterInvoice>
                    <DatePickerV1
                      label={t("_end_date")}
                      datePickerProps={{
                        value: filter.state.createdAt.endDate,
                        onChange: (e) =>
                          filter.dispatch({
                            type: filter.ACTION_TYPE.CREATED_AT_END_DATE,
                            payload: e,
                          }),
                        onError: (e) =>
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
                  </MUI.FilterInvoice>
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
                  <Grid item xs={6} sm={6} md={6} lg={6}>
                    <Grid
                      container
                      columnSpacing={5}
                      sx={{
                        alignItems: "end",
                      }}
                    >
                      <Grid item xs={5} sm={5} md={4} lg={3}>
                        <MUI.FilterInvoice>
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
                        </MUI.FilterInvoice>
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
                      <MUI.FilterInvoice sx={{ flexGrow: 1 }}>
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
                          placeholder="Search"
                          size="small"
                          InputLabelProps={{
                            shrink: false,
                          }}
                        />
                      </MUI.FilterInvoice>
                      <MUI.FilterInvoice sx={{ width: 200 }}>
                        <SelectV1
                          isDisabled={
                            !permission?.hasPermission("invoice_edit")
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
                      </MUI.FilterInvoice>
                      <MUI.FilterInvoice sx={{ width: 150 }}>
                        <NormalButton
                          {...(permission?.hasPermission("invoice_delete") &&
                            manageInvoices.selectedRow.length > 1 && {
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
                            ...(!permission?.hasPermission("invoice_delete") ||
                            manageInvoices.selectedRow.length <= 1
                              ? {
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
                      </MUI.FilterInvoice>
                      <MUI.FilterInvoice sx={{ width: 150 }}>
                        <NormalButton
                          onClick={() => {
                            if (permission?.hasPermission("invoice_create")) {
                              props.onEvent("invoiceAdd");
                            }
                          }}
                          isDisabled={
                            !permission?.hasPermission("invoice_create")
                          }
                          sx={{
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
                            ...(!permission?.hasPermission("invoice_create")
                              ? {
                                  cursor: "not-allowed",
                                  opacity: 0.5,
                                }
                              : {
                                  opacity: 1,
                                }),
                          }}
                        >
                          {t("_create_new")}
                        </NormalButton>
                      </MUI.FilterInvoice>
                    </Box>
                  </Grid>
                </Grid>
              </MUI.ListFilter>
              <CSVLink
                data={exportCSV}
                separator={","}
                ref={csvInstance}
                headers={[
                  { label: t("_no"), key: "no" },
                  { label: t("_package_topic"), key: "packageName" },
                  { label: t("_monthly_price"), key: "priceMonthly" },
                  { label: t("_yearly_price"), key: "priceYearly" },
                  { label: t("_subtotal"), key: "subTotal" },
                  { label: t("_total"), key: "total" },
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
              rows={manageInvoices.data || []}
              getRowId={(row) => row._id}
              columns={columns}
              AutoGenerateColumns="True"
              checkboxSelection
              disableSelectionOnClick
              disableColumnFilter
              disableColumnMenu
              hideFooter
              onSelectionModelChange={(ids) => {
                manageInvoices.setSelectedRow(ids);
              }}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            {manageInvoices.total > 0 && (
              <Box
                sx={{
                  padding: (theme) => theme.spacing(4),
                }}
              >
                Showing 1 to 10 of {manageInvoices.total} entries
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
                total={Math.ceil(manageInvoices.total / filter.data.pageLimit)}
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
        onConfirm={handleDeleteInvoice}
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
            header: t("_no"),
            name: "no",
          },
          {
            header: t("_package_name"),
            name: "packageId.name",
          },
          {
            header: t("_monthly_price"),
            name: "priceMonthly",
          },
          {
            header: t("_yearly_price"),
            name: "priceYearly",
          },
          {
            header: t("_subtotal"),
            name: "subTotal",
          },
          {
            header: t("_total"),
            name: "total",
          },
        ]}
        rows={exportPDF}
      />
    </>
  );
}

export default Main;
