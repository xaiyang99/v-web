import { useLazyQuery } from "@apollo/client";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Paper,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { CSVLink } from "react-csv";
import * as Yup from "yup";

// components
import { useMutation } from "@apollo/client";
import moment from "moment";
import { errorMessage, successMessage } from "../../../components/Alerts";
import {
  ConvertBytetoMBandGB,
  getFileNameExtension,
  handleGraphqlErrors,
  indexPagination,
} from "../../../functions";
import * as MUI from "../css/manageFile";
import "./../css/style.css";
// icon
import { useTranslation } from "react-i18next";
import "react-responsive-pagination/themes/classic.css";
import BreadcrumbNavigate from "../../../components/BreadcrumbNavigate";
import NormalButton from "../../../components/NormalButton";
import PaginationStyled from "../../../components/PaginationStyled";
import { THEMES } from "../../../constants";
import useAuth from "../../../hooks/useAuth";
import usePermission from "../../../hooks/usePermission";
import * as Icon from "../../../icons/icons";
import regexPatterns from "../../../regexPatterns";
import { DATE_PATTERN_FORMAT } from "../../../utils/date";
import DatePickerV1 from "../components/DatePickerV1";
import DialogDeleteV1 from "../components/DialogDeleteV1";
import DialogForm from "../components/DialogForm";
import SelectV1 from "../components/SelectV1";
import {
  MUTATION_CREATE_ADVERTISING,
  MUTATION_CREATE_INCOME,
  MUTATION_DELETE_ADVERTISING,
  MUTATION_UPDATE_ADVERTISING,
  QUERY_INCOMES,
} from "./apollo";
import useFilter from "./hooks/useFilter";
import useManageAdvertising from "./hooks/useManageAdvertising";
import useSelectCompanies from "./hooks/useSelectCompany";
import useSelectCurrencies from "./hooks/useSelectCurrencies";

const { REACT_APP_BUNNY_URL, REACT_APP_ACCESSKEY_BUNNY } = process.env;

const createAdvertisingValidationSchema = Yup.object().shape({
  company: Yup.lazy((value) => {
    switch (typeof value) {
      case "object":
        return Yup.object()
          .shape({
            label: Yup.string(),
            value: Yup.string(),
          })
          .required("Required");
      default:
        return Yup.string().required("Required");
    }
  }),
  currency: Yup.lazy((value) => {
    switch (typeof value) {
      case "object":
        return Yup.object()
          .shape({
            label: Yup.string(),
            value: Yup.string(),
          })
          .required("Required");
      default:
        return Yup.string().required("Required");
    }
  }),
  adsLink: Yup.string()
    .matches(regexPatterns.url, { message: "Invalid url" })
    .required("Required"),
  price: Yup.string().trim("Required").required("Required"),
  totalAmountClick: Yup.string().trim("Required").required("Required"),
  addSlipTransferImage: Yup.mixed()
    .test("is-valid-type", "Not a valid image type", (value) => {
      if (value?.name) {
        return value.type?.split("/")?.[0] === "image";
      }
      return true;
    })
    .test("is-valid-size", "Max allowed size is 100KB", (value) => {
      const MAX_FILE_SIZE = 5 * 1000 * 1000; //5MB;
      return value?.name ? value.size <= MAX_FILE_SIZE : true;
    }),

  status: Yup.lazy((value) => {
    switch (typeof value) {
      case "object":
        return Yup.object()
          .shape({
            label: Yup.string(),
            value: Yup.string(),
          })
          .required("Required");
      default:
        return Yup.string().required("Required");
    }
  }),
});

const editAdvertisingValidationSchema = Yup.object().shape({
  company: Yup.lazy((value) => {
    switch (typeof value) {
      case "object":
        return Yup.object()
          .shape({
            label: Yup.string(),
            value: Yup.string(),
          })
          .required("Required");
      default:
        return Yup.string().required("Required");
    }
  }),
  currency: Yup.lazy((value) => {
    switch (typeof value) {
      case "object":
        return Yup.object()
          .shape({
            label: Yup.string(),
            value: Yup.string(),
          })
          .required("Required");
      default:
        return Yup.string().required("Required");
    }
  }),
  adsLink: Yup.string()
    .matches(regexPatterns.url, { message: "Invalid url" })
    .required("Required"),
  price: Yup.string().trim("Required").required("Required"),
  totalAmountClick: Yup.string().trim("Required").required("Required"),
  status: Yup.lazy((value) => {
    switch (typeof value) {
      case "object":
        return Yup.object()
          .shape({
            label: Yup.string(),
            value: Yup.string(),
          })
          .required("Required");
      default:
        return Yup.string().required("Required");
    }
  }),
});

function Index() {
  const { user } = useAuth();
  const permission = usePermission(user?._id);
  const { t } = useTranslation();
  const [getIncomeById, { data: dataIncomeById, refetch: refetchIncomes }] =
    useLazyQuery(QUERY_INCOMES, {
      fetchPolicy: "no-cache",
    });
  const isGetIncomeByIdExist = useMemo(() => {
    return !!getIncomeById.getIncomes?.data?.length;
  }, [getIncomeById]);
  const theme = useTheme();

  //data hooks
  const filter = useFilter();
  const manageAdvertising = useManageAdvertising({ filter: filter.data });
  const selectCompanies = useSelectCompanies();
  const selectCurrencies = useSelectCurrencies();
  const statusOptions = [
    { label: "active", value: "active" },
    { label: "inactive", value: "inactive" },
  ];
  const paymentMethodOptions = [
    { label: "BCEL One", value: "bcelone" },
    { label: "Stripe", value: "stripe" },
    { label: "Credit Card", value: "credit_card" },
  ];
  const [dataForEvents, setDataForEvents] = React.useState({
    action: null,
    type: null,
    data: {},
  });
  const [formCreateIncomeFields, setFormCreateIncomeFields] = useState([]);

  const formCreateFields = useMemo(() => {
    return [
      {
        name: "company",
        label: t("_company_name"),
        value: "",
        type: "select",
        options: selectCompanies.options,
        gridColumn: "span 12",
      },
      {
        name: "adsLink",
        label: t("_link"),
        value: "",
        type: "text",
        gridColumn: "span 12",
      },
      {
        name: "currency",
        label: t("_currency"),
        value: "",
        type: "select",
        options: selectCurrencies.options,
        gridColumn: "span 12",
      },
      {
        name: "price",
        label: t("_price"),
        value: "",
        type: "number",
        gridColumn: "span 12",
      },
      {
        name: "totalAmountClick",
        label: t("_total_click_amount"),
        value: "",
        type: "number",
        gridColumn: "span 12",
      },
      {
        name: "addSlipTransfer",
        label: t("_slip_transfer"),
        value: "",
        type: "image",
        gridColumn: "span 12",
      },
      {
        name: "addSlipTransferImage",
        label: t("_slip_transfer"),
        value: {},
        type: "hidden",
        gridColumn: "span 12",
      },
      {
        name: "status",
        label: t("_status"),
        disableClear: true,
        value: "",
        type: "select",
        options: statusOptions,
        gridColumn: "span 12",
      },
    ];
  }, [selectCompanies.options, selectCurrencies.options]);

  const formUpdateFields = useMemo(() => {
    return [
      {
        name: "company",
        label: t("_company_name"),
        value:
          selectCompanies.options?.filter(
            (company) => company.value === dataForEvents.data.companyId?._id,
          )?.[0] || "",
        type: "select",
        options: selectCompanies.options,
        gridColumn: "span 12",
      },
      {
        name: "adsLink",
        label: t("_link"),
        value: dataForEvents.data.url || "",
        type: "text",
        gridColumn: "span 12",
      },
      {
        name: "currency",
        label: t("_currency"),
        value:
          selectCurrencies.options?.filter(
            (company) => company.value === dataForEvents.data.currencyId?._id,
          )?.[0] || "",
        type: "select",
        options: selectCurrencies.options,
        gridColumn: "span 12",
      },
      {
        name: "price",
        label: t("_price"),
        value: dataForEvents.data.price || "",
        type: "number",
        gridColumn: "span 12",
      },
      {
        name: "totalAmountClick",
        label: t("_total_click_amount"),
        value: dataForEvents.data.amountClick || "",
        type: "number",
        gridColumn: "span 12",
      },

      {
        name: "status",
        label: t("_status"),
        disableClear: true,
        value:
          statusOptions.filter(
            (status) =>
              status.value === (dataForEvents.data.status || "active"),
          )?.[0] || "",
        type: "select",
        options: statusOptions,
        gridColumn: "span 12",
      },
    ];
  }, [selectCompanies.options, selectCurrencies.options, dataForEvents.data]);

  useEffect(() => {
    if (dataForEvents.data._id) {
      const fetchIncomeById = async () => {
        return await getIncomeById({
          variables: {
            where: {
              advertisementId: dataForEvents.data._id,
            },
          },
        });
      };
      fetchIncomeById();
    }

    setFormCreateIncomeFields([
      {
        name: "price",
        label: t("_price"),
        value: dataForEvents.data.price || "",
        type: "number",
        readOnly: true,
        gridColumn: "span 12",
      },
      {
        name: "paymentMethod",
        label: t("_payment_method"),
        /* readOnly: true, */
        /* value: {
          label: dataForEvents.data.paymentMethod,
          value: dataForEvents.data.paymentMethod,
        }, */
        options: paymentMethodOptions,
        type: "select",
        gridColumn: "span 12",
      },
      {
        name: "addSlipTransfer",
        label: t("_slip_transfer"),
        value: "",
        type: "image",
        gridColumn: "span 12",
      },
      {
        name: "addSlipTransferImage",
        label: t("_slip_transfer"),
        value: {},
        type: "hidden",
        gridColumn: "span 12",
      },
      {
        name: "description",
        label: t("_description"),
        value: dataForEvents.data.description || "",
        type: "textAreaField",
        gridColumn: "span 12",
        /* readOnly: true, */
        customStyles: {
          height: 100,
        },
      },
    ]);
  }, [dataForEvents.data]);

  const [createAdvertisingOpen, setCreateAdvertisingOpen] = useState(false);
  const [editAdvertisingOpen, setEditAdvertisingOpen] = useState(false);
  const [isCreateIncomeOpen, setIsCreateIncomeOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [createAdvertising] = useMutation(MUTATION_CREATE_ADVERTISING);
  const [updateAdvertising] = useMutation(MUTATION_UPDATE_ADVERTISING);
  const [deleteAdvertising] = useMutation(MUTATION_DELETE_ADVERTISING);
  const [createIncome] = useMutation(MUTATION_CREATE_INCOME);
  const [reloading, setReloading] = useState(false);
  const csvInstance = useRef();

  const [deleteType, setDeleteType] = useState("single");

  const resetDataForEvents = () => {
    setDataForEvents((state) => ({
      ...state,
      action: null,
    }));
  };

  const editHandleClose = () => {
    setEditAdvertisingOpen(false);
    resetDataForEvents();
  };

  const deleteHandleClose = () => {
    setDeleteOpen(false);
    resetDataForEvents();
  };

  const createHandleClose = () => {
    setCreateAdvertisingOpen(false);
    resetDataForEvents();
  };

  const createIncomeHandleClose = () => {
    setIsCreateIncomeOpen(false);
    resetDataForEvents();
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
      field: "companyName",
      headerName: t("_company_name"),
      flex: 1,
      renderCell: (params) => {
        return <div>{params.row.companyId.name}</div>;
      },
    },
    {
      field: "url",
      headerName: t("_link"),
      flex: 1,
    },
    {
      field: "amountClick",
      headerName: t("_total_click_amount"),
      flex: 1,
    },
    {
      field: "currency",
      headerName: t("_currency"),
      flex: 1,
      renderCell: (params) => {
        return <div>{params.row.currencyId.name}</div>;
      },
    },
    {
      field: "price",
      headerName: t("_price"),
      flex: 1,
      renderCell: (params) => {
        const nFormat = new Intl.NumberFormat();
        return <div>{nFormat.format(params.row.price)}</div>;
      },
    },
    {
      field: "status",
      headerName: t("_status"),
      width: 200,
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
        } else if (status === "deleted") {
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
        } else if (status === "disabled") {
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
            <Tooltip
              title={
                permission?.hasPermission("advertisement_edit")
                  ? "Edit"
                  : "No permission"
              }
            >
              <NormalButton
                onClick={() => {
                  if (permission?.hasPermission("advertisement_edit")) {
                    setDataForEvents({
                      action: "edit_advertising",
                      data: params.row,
                    });
                  }
                }}
                sx={{
                  ...(!permission?.hasPermission("advertisement_edit")
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
            </Tooltip>
            <Tooltip
              title={
                permission?.hasPermission("advertisement_edit") ||
                permission?.hasPermission("advertisement_create")
                  ? "Add income"
                  : "No permission"
              }
            >
              <NormalButton
                onClick={() => {
                  if (
                    permission?.hasPermission("advertisement_edit") ||
                    permission?.hasPermission("advertisement_create")
                  ) {
                    setDataForEvents({
                      action: "create_income",
                      data: params.row,
                    });
                  }
                }}
                sx={{
                  ...(permission?.hasPermission("advertisement_edit") ||
                  permission?.hasPermission("advertisement_create")
                    ? {
                        opacity: 1,
                      }
                    : {
                        cursor: "not-allowed",
                        opacity: 0.5,
                      }),
                }}
              >
                <Icon.IncomeIcon
                  size="20px"
                  color={theme.name === THEMES.DARK ? "white" : "grey"}
                />
              </NormalButton>
            </Tooltip>
            <Tooltip
              title={
                permission?.hasPermission("advertisement_delete")
                  ? "Delete"
                  : "No permission"
              }
            >
              <NormalButton
                onClick={() => {
                  if (permission?.hasPermission("advertisement_delete")) {
                    setDeleteType("single");
                    setDataForEvents({
                      action: "delete_single",
                      data: params.row,
                    });
                    setDeleteOpen(true);
                  }
                }}
                sx={{
                  cursor: permission?.hasPermission("advertisement_delete")
                    ? "pointer"
                    : "not-allowed",
                  opacity: permission?.hasPermission("advertisement_delete")
                    ? 1
                    : 0.5,
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

  const exportCSV = useMemo(
    () =>
      manageAdvertising.data?.map((row, index) => {
        const totalDownload = row.totalDownload;

        return {
          id: index + 1,
          name: row.filename,
          size: ConvertBytetoMBandGB(row.size),
          ip: row.ip,
          owner: row.createdBy?.username,
          status: row.status,
          date: moment(row.createdAt).format(DATE_PATTERN_FORMAT.date),
          totalDownload: totalDownload ? `${totalDownload} times` : "0 time",
        };
      }) || [],
    [manageAdvertising.data],
  );

  const handleCreateAdvertising = async (inputValues) => {
    const values = {
      companyId: inputValues.company?.value || inputValues.company,
      url: inputValues.adsLink,
      currencyId: inputValues.currency?.value || inputValues.currency,
      price: inputValues.price,
      amountClick: inputValues.totalAmountClick,
      status: inputValues.status?.value || inputValues.status,
    };
    try {
      const createdData = (
        await createAdvertising({
          variables: {
            input: {
              ...values,
            },
          },
        })
      )?.data?.createAdvertisement;
      setCreateAdvertisingOpen(false);
      resetDataForEvents();
      successMessage("Created successfully", 3000);
      filter.dispatch({
        type: filter.ACTION_TYPE.PAGINATION,
        payload: 1,
      });
      if (createdData) {
        const addSlipTransferImage = inputValues.addSlipTransferImage;
        if (addSlipTransferImage instanceof File) {
          const fileExtension = getFileNameExtension(addSlipTransferImage.name);
          const url = `${REACT_APP_BUNNY_URL}/"advertising"/${createdData.adsNumber}${fileExtension}`;
          await fetch(url, {
            method: "PUT",
            headers: {
              AccessKey: REACT_APP_ACCESSKEY_BUNNY,
              "Content-Type": addSlipTransferImage.type,
            },
            body: addSlipTransferImage,
          });
        }
      }
    } catch (e) {
      let cutErr = error.message.replace(/(ApolloError: )?Error: /, "");
      errorMessage(handleGraphqlErrors(cutErr), 3000);
    }
  };

  const handleEditAdvertising = async (inputValues) => {
    const values = {
      companyId: inputValues.company?.value || inputValues.company,
      url: inputValues.adsLink,
      currencyId: inputValues.currency?.value || inputValues.currency,
      price: inputValues.price,
      amountClick: inputValues.totalAmountClick,
      status: inputValues.status?.value || inputValues.status,
    };
    try {
      await updateAdvertising({
        variables: {
          input: {
            ...values,
          },
          id: dataForEvents.data.adsNumber,
        },
      });
      setEditAdvertisingOpen(false);
      resetDataForEvents();
      successMessage("Updated successfully", 3000);
      filter.dispatch({
        type: filter.ACTION_TYPE.PAGINATION,
        payload: 1,
      });
    } catch (e) {
      let cutErr = error.message.replace(/(ApolloError: )?Error: /, "");
      errorMessage(handleGraphqlErrors(cutErr), 3000);
    }
  };

  const handleDeleteAdvertising = async () => {
    try {
      if (deleteType === "multiple") {
        const selectedData = manageAdvertising.data.filter((data) =>
          manageAdvertising.selectedRow.includes(data._id),
        );
        await Promise.all(
          selectedData.map((data) => {
            return deleteAdvertising({
              variables: {
                id: data.adsNumber,
              },
            });
          }),
        );
        successMessage("Deleted successfully", 3000);
        filter.dispatch({
          type: filter.ACTION_TYPE.PAGINATION,
          payload: 1,
        });
      } else {
        await deleteAdvertising({
          variables: {
            id: dataForEvents.data.adsNumber,
          },
        });

        successMessage("Deleted successfully", 3000);
        filter.dispatch({
          type: filter.ACTION_TYPE.PAGINATION,
          payload: 1,
        });
      }
    } catch (error) {
      let cutErr = error.message.replace(/(ApolloError: )?Error: /, "");
      errorMessage(handleGraphqlErrors(cutErr), 3000);
    }
  };

  const handleCreateIncome = async (inputValues) => {
    const values = {
      paymentMethod: inputValues.paymentMethod,
      advertisementId: dataForEvents.data.adsNumber,
      amount: inputValues.price,
      description: inputValues.description,
    };

    try {
      const result = await createIncome({
        variables: {
          input: {
            ...values,
          },
        },
      });

      createIncomeHandleClose();
      successMessage("Created successfully", 3000);
      filter.dispatch({
        type: filter.ACTION_TYPE.PAGINATION,
        payload: 1,
      });

      if (result.data?.addIcome?._id) {
        const addSlipTransferImage = inputValues.addSlipTransferImage;
        if (addSlipTransferImage instanceof File) {
          const fileExtension = getFileNameExtension(addSlipTransferImage.name);
          const url = `${REACT_APP_BUNNY_URL}/"incomes"/${createdData.adsNumber}${fileExtension}`;
          await fetch(url, {
            method: "PUT",
            headers: {
              AccessKey: REACT_APP_ACCESSKEY_BUNNY,
              "Content-Type": addSlipTransferImage.type,
            },
            body: addSlipTransferImage,
          });
        }
      }
    } catch (e) {
      errorMessage(e.message, 3000);
    }
  };

  const menuOnClick = async (action) => {
    switch (action) {
      case "edit_advertising":
        setEditAdvertisingOpen(true);
        break;
      case "delete_multiple":
        setDeleteOpen(true);
        setReloading(!reloading);
        break;
      case "delete_single":
        setDeleteOpen(true);
        setReloading(!reloading);
        break;
      case "create_income":
        setIsCreateIncomeOpen(true);
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
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <BreadcrumbNavigate
          separatorIcon={<Icon.ForeSlash />}
          path={["advertisement"]}
          readablePath={[t("_advertisement")]}
        />
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
                  {t("_advertisement_title")}
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
                      <MUI.FilterFile>
                        <SelectV1
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
                              { label: "active", value: "active" },
                              { label: "inactive", value: "inactive" },
                            ],
                            placeholder: t("_select_status"),
                          }}
                        />
                      </MUI.FilterFile>
                    </Grid>
                    <Grid item xs={4} sm={4} md={4} lg={4}>
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
                    <Grid item xs={4} sm={4} md={4} lg={4}>
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
                            <MUI.FilterFile>
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
                            </MUI.FilterFile>
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
                          <MUI.FilterFile sx={{ flexGrow: 1 }}>
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
                                  type: filter.ACTION_TYPE.URL,
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
                          <MUI.FilterFile sx={{ width: 200 }}>
                            <NormalButton
                              {...(permission?.hasPermission(
                                "advertisement_delete",
                              ) &&
                                manageAdvertising.selectedRow.length > 1 && {
                                  onClick: () => {
                                    if (
                                      permission?.hasPermission(
                                        "advertisement_delete",
                                      )
                                    ) {
                                      setDeleteType("multiple");
                                      setDataForEvents({
                                        action: "delete_multiple",
                                        data: {},
                                      });
                                    }
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
                                ...(manageAdvertising.selectedRow.length <= 1 ||
                                !permission?.hasPermission(
                                  "advertisement_delete",
                                )
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
                          </MUI.FilterFile>
                          <MUI.FilterFile sx={{ width: 200 }}>
                            <NormalButton
                              onClick={() => {
                                if (
                                  permission?.hasPermission(
                                    "advertisement_create",
                                  )
                                ) {
                                  setDataForEvents((prevState) => ({
                                    ...prevState,
                                    data: {},
                                  }));
                                  setCreateAdvertisingOpen(true);
                                }
                              }}
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
                                ...(!permission?.hasPermission(
                                  "advertisement_create",
                                )
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
                          </MUI.FilterFile>
                        </Box>
                      </Grid>
                    </Grid>
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
                    "& .MuiDataGrid-main": {
                      minHeight: "500px !important",
                    },
                    borderRadius: 0,
                    "& .MuiDataGrid-columnSeparator": { display: "none" },
                    "& .MuiDataGrid-virtualScroller": {
                      overflowX: "hidden",
                    },
                  }}
                  rows={manageAdvertising.data || []}
                  getRowId={(row) => row._id}
                  columns={columns}
                  AutoGenerateColumns="True"
                  checkboxSelection
                  disableSelectionOnClick
                  disableColumnFilter
                  disableColumnMenu
                  hideFooter
                  onSelectionModelChange={(ids) => {
                    manageAdvertising.setSelectedRow(ids);
                  }}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {manageAdvertising.total > 0 && (
                  <Box
                    sx={{
                      padding: (theme) => theme.spacing(4),
                    }}
                  >
                    Showing 1 to 10 of {manageAdvertising.total} entries
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
                      manageAdvertising.total / filter.data.pageLimit,
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
            </CardContent>
          </Card>
        </Paper>
        <DialogDeleteV1
          isOpen={deleteOpen}
          onClose={deleteHandleClose}
          onConfirm={handleDeleteAdvertising}
        />
        <DialogForm
          disabledSave={isGetIncomeByIdExist}
          width="800px"
          formFields={formCreateIncomeFields}
          disableDefaultButton
          title={t("_add_new_income")}
          onSubmit={handleCreateIncome}
          isOpen={isCreateIncomeOpen}
          onClose={createIncomeHandleClose}
          header={
            <Typography
              component="div"
              sx={{ display: "flex", flexDirection: "column", rowGap: 2 }}
            >
              <MUI.IncomeFieldStyle>
                <MUI.IncomeFieldLabelStyle>
                  {t("_company_id")}:
                </MUI.IncomeFieldLabelStyle>
                <MUI.IncomeFieldValueStyle>
                  {dataForEvents.data.companyId?._id}
                </MUI.IncomeFieldValueStyle>
              </MUI.IncomeFieldStyle>
              <MUI.IncomeFieldStyle>
                <MUI.IncomeFieldLabelStyle>
                  {t("_company_name")}:
                </MUI.IncomeFieldLabelStyle>
                <MUI.IncomeFieldValueStyle>
                  {dataForEvents.data.companyId?.name}
                </MUI.IncomeFieldValueStyle>
              </MUI.IncomeFieldStyle>
              <MUI.IncomeFieldStyle>
                <MUI.IncomeFieldLabelStyle>
                  {t("_link")}:
                </MUI.IncomeFieldLabelStyle>
                <MUI.IncomeFieldValueStyle
                  sx={{
                    color: theme.palette.primaryTheme.main,
                  }}
                >
                  {dataForEvents.data.url}
                </MUI.IncomeFieldValueStyle>
              </MUI.IncomeFieldStyle>
              <MUI.IncomeFieldStyle>
                <MUI.IncomeFieldLabelStyle>
                  {t("_static_amount")}:
                </MUI.IncomeFieldLabelStyle>
                <MUI.IncomeFieldValueStyle>
                  {dataForEvents.data.amountClick}{" "}
                  {dataForEvents.data.amountClick > 1 ? "times" : "time"}
                </MUI.IncomeFieldValueStyle>
              </MUI.IncomeFieldStyle>
              <MUI.IncomeFieldStyle>
                <MUI.IncomeFieldLabelStyle>
                  {t("_status")}:
                </MUI.IncomeFieldLabelStyle>
                <MUI.IncomeFieldValueStyle
                  sx={{
                    color: theme.palette.primaryTheme.main,
                  }}
                >
                  Active
                </MUI.IncomeFieldValueStyle>
              </MUI.IncomeFieldStyle>
            </Typography>
          }
        />
        <DialogForm
          width="400px"
          formFields={formCreateFields}
          disableDefaultButton
          title={t("_add_ads_title")}
          onSubmit={handleCreateAdvertising}
          validationSchema={createAdvertisingValidationSchema}
          isOpen={createAdvertisingOpen}
          onClose={createHandleClose}
        />
        <DialogForm
          width="400px"
          formFields={formUpdateFields}
          disableDefaultButton
          title={t("_update_ads_title")}
          onSubmit={handleEditAdvertising}
          validationSchema={editAdvertisingValidationSchema}
          isOpen={editAdvertisingOpen}
          onClose={editHandleClose}
        />
      </Box>
    </>
  );
}

export default Index;
