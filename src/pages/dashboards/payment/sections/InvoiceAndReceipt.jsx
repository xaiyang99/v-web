import { useLazyQuery, useMutation } from "@apollo/client";
import {
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  styled,
  useTheme,
} from "@mui/material";
import { useFormik } from "formik";
import _ from "lodash";
import moment from "moment";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import { successMessage } from "../../../../components/Alerts";
import InputTextField from "../../../../components/InputTextField";
import NormalButton from "../../../../components/NormalButton";
import { prettyNumberFormat, safeGetProperty } from "../../../../functions";
import useAuth from "../../../../hooks/useAuth";
import usePermission from "../../../../hooks/usePermission";
import * as Icon from "../../../../icons/icons";
import { paymentState } from "../../../../redux/slices/paymentSlice";
import VshareLogo from "../../../../utils/images/vshare-black-logo.png";
import DatePickerV1 from "../../components/DatePickerV1";
import SelectV1 from "../../components/SelectV1";
import {
  MUTATION_CREATE_INVOICE,
  MUTATION_SEND_INVOICE,
  MUTATION_SEND_RECEIPT,
  QUERY_INVOICES,
  QUERY_PAYMENTS,
} from "../apollo";
import useSelectCustomers from "../hooks/useSelectCustomers";

const AntSwitch = styled(Switch)(({ theme }) => ({
  width: 35,
  height: 21,
  padding: 0,
  display: "flex",
  "&:active": {
    "& .MuiSwitch-thumb": {
      width: 15 + 2,
    },
    "& .MuiSwitch-switchBase.Mui-checked": {
      transform: "translateX(9px)",
    },
  },
  "& .MuiSwitch-switchBase": {
    padding: 2,
    "&.Mui-checked": {
      transform: "translateX(14px)",
      color: "#fff",
      "& .MuiSwitch-thumb": {
        backgroundColor: "white",
      },
      "& + .MuiSwitch-track": {
        opacity: 1,
      },
    },
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: theme.palette.primaryTheme.brown(0.3),
    width: 14,
    height: 14,
    borderRadius: 10,
    transition: theme.transitions.create(["width"], {
      duration: 200,
    }),
    transform: "translate(2px, 1px)",
  },
  "& .MuiSwitch-track": {
    borderRadius: 20,
    opacity: 1,
    border: `1px solid ${theme.palette.primaryTheme.brown(0.3)}`,
    backgroundColor:
      theme.palette.mode === "dark" ? "rgba(255,255,255,.35)" : "white",
    boxSizing: "border-box",
  },
}));

const InvoiceContainer = styled("form")(({ theme }) => ({
  marginTop: theme.spacing(3),
  color: `${theme.palette.primaryTheme.brown()} !important`,
}));

const InvoicePaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(9),
  color: `${theme.palette.primaryTheme.brown()} !important`,
}));

const InvoiceItemLayout = styled("div")(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  rowGap: theme.spacing(3),
}));

const InvoiceItem = styled("div")({});

const Item = styled("div")({
  display: "flex",
});

const InvoiceAndReceipt = (props) => {
  const { t } = useTranslation();
  const [getPayments, { data: dataPackages, refetch }] = useLazyQuery(
    QUERY_PAYMENTS,
    {
      fetchPolicy: "no-cache",
    }
  );
  const theme = useTheme();
  const { currencySymbol, taxValue, ...paymentSelector } =
    useSelector(paymentState);
  const [paymentById, setPaymentById] = useState({});
  const [isInvoiceExist, setIsInvoiceExist] = useState(null);
  const { amount } = paymentById;
  const { user } = useAuth();
  const permission = usePermission(user?._id);
  const selectCustomers = useSelectCustomers();
  const [getInvoices] = useLazyQuery(QUERY_INVOICES, {
    fetchPolicy: "no-cache",
  });
  const [createInvoice] = useMutation(MUTATION_CREATE_INVOICE);
  const paperName =
    props.forPaper === t("_receipt") ? t("_receipt") : t("_invoice");
  const [sendInvoice, { loading: sendInvoiceLoading }] = useMutation(
    MUTATION_SEND_INVOICE
  );
  const [sendReceipt, { loading: sendReceiptLoading }] = useMutation(
    MUTATION_SEND_RECEIPT
  );

  useEffect(() => {
    if (paymentById.paymentId) {
      (async () => {
        await getInvoices({
          variables: {
            where: {
              paymentId: paymentById.paymentId,
            },
          },
          onCompleted: (data) => {
            setIsInvoiceExist(data.getInvoice.data?.length > 0);
          },
        });
      })();
    }
  }, [paymentById]);

  const invoicePaperRef = useRef(null);

  const printInvoicePaper = useReactToPrint({
    content: () => invoicePaperRef.current,
  });

  const paymentMethodOptions = [
    { label: "BCEL One", value: "bcelone" },
    { label: "Stripe", value: "stripe" },
    { label: "Credit Card", value: "credit_card" },
  ];

  const data = useMemo(() => props.data || {}, [props.data]);
  const isAddOrEditPage = props.type === "add" || props.type === "edit";
  const isPreviewPage = props.type === "preview";
  const isPaymentByIdNotEmpty = !_.isEmpty(paymentById);

  const handleOnSave = async () => {
    if (!isPaymentByIdNotEmpty || isInvoiceExist) {
      return;
    }
    try {
      await createInvoice({
        variables: {
          input: {
            customerId: paymentById.payerId._id,
            packageId: paymentById.packageId._id,
            paymentId: paymentById.paymentId,
            name: "invoice for payment",
            amount: paymentById.amount,
          },
        },
      });
      setIsInvoiceExist(true);
      successMessage("Created an invoice successfully", 3000);
    } catch (err) {
      return;
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      dateIssues: null,
      dateDue: null,
      invoiceToCustomerId: {},
      paymentId: "",
      package: {
        id: "",
        cost: "",
        qty: "",
        description: "",
      },
      salesperson: user ? `${user.firstname} ${user.lastname}` : "",
      packageItems: [],
    },
    onSubmit: handleOnSave,
  });

  const userById = useMemo(
    () =>
      selectCustomers.data?.find(
        (data) => data._id === formik.values.invoiceToCustomerId
      ) || null,
    [formik.values.invoiceToCustomerId, selectCustomers.data]
  );

  const handleSetPaymentById = async (id) => {
    if (id) {
      const response = await getPayments({
        variables: {
          where: {
            _id: id,
          },
        },
      });
      const result = response.data?.getPayments?.data?.[0];
      if (result) {
        setPaymentById(result);
      }
    }
  };

  useEffect(() => {
    handleSetPaymentById(data._id);
  }, [data]);

  useEffect(() => {
    handleSetPaymentById(formik.values.paymentId);
  }, [formik.values.paymentId]);

  useEffect(() => {
    if (!_.isEmpty(paymentById)) {
      formik.setValues({
        ...formik.values,
        paymentId: paymentById.paymentId,
        dateIssues: moment(paymentById.createdAt).utc(true).toDate(),
        dateDue: moment(paymentById.orderedAt).utc(true).toDate(),
      });
    }
  }, [paymentById]);

  const handleOnPreview = async () => {
    props.onEvent("invoicePreview", paymentById);
  };

  if (!isPaymentByIdNotEmpty) {
    return null;
  }

  const handleSendPaper = async () => {
    if (props.forPaper === "receipt") {
      await sendReceipt({
        variables: {
          id: paymentById.paymentId,
        },
      });
    } else {
      await sendInvoice({
        variables: {
          id: paymentById.paymentId,
        },
      });
    }
    successMessage(
      `Sending an ${paperName.toLocaleLowerCase()} is successful`,
      3000
    );
  };

  return (
    <InvoiceContainer onSubmit={formik.handleSubmit}>
      <Grid container columnSpacing={5}>
        <Grid item md={10} sm={10}>
          <Paper
            ref={invoicePaperRef}
            sx={{
              boxShadow: theme.baseShadow.secondary,
              flex: "1 1 0%",
            }}
          >
            <InvoicePaper>
              <Grid container>
                <Grid item md={6} sm={6}>
                  <InvoiceItemLayout>
                    <InvoiceItem>
                      <img
                        src={VshareLogo}
                        alt="v-share logo"
                        width={150}
                        height={40}
                      />
                    </InvoiceItem>
                    <InvoiceItem
                      sx={{
                        maxWidth: 250,
                      }}
                    >
                      Office 149, 450 South Brand Brooklyn San Diego County, CA
                      91905, USA +1 (123) 456 7891, +44 (876) 543 2198
                    </InvoiceItem>
                  </InvoiceItemLayout>
                </Grid>
                <Grid item md={6} sm={6}>
                  <InvoiceItemLayout
                    sx={{
                      whiteSpace: "nowrap",
                      justifyContent: "center",
                      alignItems: "flex-end",
                    }}
                  >
                    <InvoiceItem>
                      <Typography
                        component="div"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Typography
                          component="div"
                          sx={{
                            minWidth: 100,
                            fontWeight: 600,
                            // fontSize: 22,
                          }}
                        >
                          {paperName}
                        </Typography>
                        <InputTextField
                          inputLayoutProps={{
                            sx: {
                              maxWidth: 200,
                              height: 35,
                              minHeight: 35,
                            },
                          }}
                          inputProps={{
                            InputProps: {
                              readOnly: true,
                            },
                            id: "invoiceId",
                            name: "invoiceId",
                            onChange: formik.handleChange,
                            value: formik.values.paymentId,
                          }}
                        />
                      </Typography>
                    </InvoiceItem>
                    {props.forPaper === "receipt" ? (
                      <>
                        <InvoiceItem>
                          <Typography
                            component="div"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <Typography
                              component="div"
                              sx={{
                                minWidth: 100,
                              }}
                            >
                              {t("_issue_date")}
                            </Typography>
                            <DatePickerV1
                              datePickerProps={{
                                readOnly: true,
                                disableOpenPicker: true,
                                id: "dateIssues",
                                name: "dateIssues",
                                value: formik.values.dateIssues,
                                onChange: (e) => {
                                  formik.setFieldValue(
                                    "dateIssues",
                                    e ? moment(e).utc(true).toDate() : null
                                  );
                                },
                                sx: {
                                  "& .MuiInputBase-root": {
                                    maxWidth: "200px",
                                    height: "35px",
                                  },
                                  InputLabelProps: {
                                    shrink: false,
                                  },
                                },
                                format: "dd-MM-yyyy",
                                inputFormat: "dd-MM-yyyy",
                              }}
                            />
                          </Typography>
                        </InvoiceItem>
                      </>
                    ) : (
                      <>
                        <InvoiceItem>
                          <Typography
                            component="div"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <Typography
                              component="div"
                              sx={{
                                minWidth: 100,
                              }}
                            >
                              {t("_issue_date")}
                            </Typography>
                            <DatePickerV1
                              datePickerProps={{
                                readOnly: true,
                                disableOpenPicker: true,
                                id: "dateIssues",
                                name: "dateIssues",
                                value: formik.values.dateIssues,
                                onChange: (e) => {
                                  formik.setFieldValue(
                                    "dateIssues",
                                    e ? moment(e).utc(true).toDate() : null
                                  );
                                },
                                sx: {
                                  "& .MuiInputBase-root": {
                                    maxWidth: "200px",
                                    height: "35px",
                                  },
                                  InputLabelProps: {
                                    shrink: false,
                                  },
                                },
                                format: "dd-MM-yyyy",
                                inputFormat: "dd-MM-yyyy",
                              }}
                            />
                          </Typography>
                        </InvoiceItem>
                        <InvoiceItem>
                          <Typography
                            component="div"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <Typography
                              component="div"
                              sx={{
                                minWidth: 100,
                              }}
                            >
                              {t("_due_date")}
                            </Typography>
                            <DatePickerV1
                              datePickerProps={{
                                readOnly: true,
                                disableOpenPicker: true,
                                id: "dateDue",
                                name: "dateDue",
                                value: formik.values.dateDue,
                                onChange: (e) => {
                                  formik.setFieldValue(
                                    "dateDue",
                                    e ? moment(e).utc(true).toDate() : null
                                  );
                                },
                                sx: {
                                  "& .MuiInputBase-root": {
                                    maxWidth: "200px",
                                    height: "35px",
                                  },
                                  InputLabelProps: {
                                    shrink: false,
                                  },
                                },
                                format: "dd-MM-yyyy",
                                inputFormat: "dd-MM-yyyy",
                              }}
                            />
                          </Typography>
                        </InvoiceItem>
                      </>
                    )}
                  </InvoiceItemLayout>
                </Grid>
              </Grid>
            </InvoicePaper>
            <Divider />
            <InvoicePaper>
              <Grid container>
                <Grid item md={6} sm={6}>
                  <InvoiceItemLayout>
                    <InvoiceItem
                      sx={{
                        fontWeight: 600,
                      }}
                    >
                      {paperName} To:
                    </InvoiceItem>
                    <InvoiceItem
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        rowGap: 1,
                      }}
                    >
                      <Typography component="div">
                        {paymentById?.payerId &&
                          _.startCase(
                            `${paymentById.payerId.firstName} ${paymentById.payerId.lastName}`
                          )}
                      </Typography>
                      <Typography
                        component="div"
                        sx={{
                          maxWidth: 200,
                        }}
                      >
                        Shelby Company Limited Small Heath, B10 0HF, UK
                      </Typography>
                      <Typography component="div">718-986-6062</Typography>
                      <Typography component="div">
                        {userById && userById.email}
                      </Typography>
                    </InvoiceItem>
                  </InvoiceItemLayout>
                </Grid>
              </Grid>
            </InvoicePaper>
            <Divider />
            <InvoicePaper
              sx={{
                padding: 0,
              }}
            >
              <InvoiceItemLayout>
                {isPreviewPage && data && (
                  <InvoiceItem>
                    <Table aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell width={"25%"}>{t("_item")}</TableCell>
                          <TableCell width={"25%"}>
                            {t("_description")}
                          </TableCell>
                          <TableCell width={"12.5%"}>{t("_cost")}</TableCell>
                          <TableCell width={"12.5%"}>
                            {t("_quantity")}
                          </TableCell>
                          <TableCell width={"25%"}>{t("_total")}</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {[paymentById.packageId || {}].map((packageData) => {
                          return (
                            <TableRow
                              sx={{
                                "&:last-child td, &:last-child th": {
                                  border: 0,
                                },
                              }}
                              key={`id-${packageData._id}`}
                            >
                              <TableCell>
                                {safeGetProperty(packageData, "name")}
                              </TableCell>
                              <TableCell>
                                {safeGetProperty(packageData, "description")}
                              </TableCell>
                              <TableCell>
                                {paymentSelector.currencySymbol}{" "}
                                {safeGetProperty(
                                  packageData,
                                  "price"
                                )?.toLocaleString()}
                              </TableCell>
                              <TableCell>1</TableCell>
                              <TableCell>
                                {paymentSelector.currencySymbol}{" "}
                                {safeGetProperty(
                                  packageData,
                                  "price"
                                )?.toLocaleString()}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </InvoiceItem>
                )}
              </InvoiceItemLayout>
            </InvoicePaper>
            <Divider />
            <InvoicePaper>
              <Grid container>
                <Grid item md={6} sm={6}>
                  <InvoiceItemLayout>
                    <InvoiceItem>
                      {(props.type === "add" || props.type === "edit") && (
                        <InputTextField
                          inputLayoutProps={{
                            sx: {
                              maxWidth: "100%",
                              height: 35,
                              minHeight: 35,
                            },
                          }}
                          inputProps={{
                            InputProps: {
                              readOnly: true,
                            },
                            id: "salesperson",
                            name: "salesperson",
                            onChange: formik.handleChange,
                            value: t("_thank_you_message"),
                          }}
                        />
                      )}
                      {isPreviewPage && (
                        <Typography
                          component="span"
                          sx={{
                            fontWeight: 600,
                            fontSize: "1rem",
                          }}
                        >
                          {t("_thank_you_message")}
                        </Typography>
                      )}
                    </InvoiceItem>
                  </InvoiceItemLayout>
                </Grid>
                <Grid item md={6} sm={6}>
                  <InvoiceItemLayout
                    sx={{
                      whiteSpace: "nowrap",
                      justifyContent: "center",
                      alignItems: "flex-end",
                    }}
                  >
                    <InvoiceItem
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        rowGap: 1,
                      }}
                    >
                      <Item>
                        <Typography
                          component="div"
                          sx={{
                            minWidth: 100,
                          }}
                        >
                          {t("_subtotal")}:
                        </Typography>
                        <Typography
                          component="div"
                          sx={{
                            fontWeight: 600,
                          }}
                        >
                          {currencySymbol}
                          {prettyNumberFormat(amount)}
                        </Typography>
                      </Item>
                      <Item>
                        <Typography
                          component="div"
                          sx={{
                            minWidth: 100,
                          }}
                        >
                          {t("_discount")}:
                        </Typography>
                        <Typography
                          component="div"
                          sx={{
                            fontWeight: 600,
                          }}
                        >
                          {currencySymbol}00.00
                        </Typography>
                      </Item>
                      <Item>
                        <Typography
                          component="div"
                          sx={{
                            minWidth: 100,
                          }}
                        >
                          {t("_tax")}:
                        </Typography>
                        <Typography
                          component="div"
                          sx={{
                            fontWeight: 600,
                          }}
                        >
                          <span
                            style={{
                              position: "absolute",
                              transform: "translateX(-105%)",
                            }}
                          >
                            (7%)
                          </span>
                          {currencySymbol}
                          {prettyNumberFormat(amount * taxValue)}
                        </Typography>
                      </Item>
                      <Item>
                        <Typography
                          component="div"
                          sx={{
                            minWidth: 100,
                          }}
                        >
                          {t("_price")}:
                        </Typography>
                        <Typography
                          component="div"
                          sx={{
                            fontWeight: 600,
                          }}
                        >
                          {currencySymbol}
                          {prettyNumberFormat(amount + amount * taxValue)}
                        </Typography>
                      </Item>
                    </InvoiceItem>
                  </InvoiceItemLayout>
                </Grid>
              </Grid>
            </InvoicePaper>
            <Divider />
            <InvoicePaper>
              <InvoiceItemLayout>
                <InvoiceItem
                  sx={{
                    fontWeight: 600,
                  }}
                >
                  {t("_note")}:
                </InvoiceItem>
                <InvoiceItem>
                  {isAddOrEditPage && (
                    <InputTextField
                      inputLayoutProps={{
                        sx: {
                          minHeight: 35,
                        },
                      }}
                      inputProps={{
                        InputProps: {
                          readOnly: true,
                        },
                        value: t("_note_description"),
                      }}
                    />
                  )}
                  {isPreviewPage && (
                    <Typography component="span">
                      {t("_note_description")}
                    </Typography>
                  )}
                </InvoiceItem>
              </InvoiceItemLayout>
            </InvoicePaper>
          </Paper>
        </Grid>
        <Grid item md={2} sm={2}>
          <Typography
            component="div"
            sx={{
              display: "flex",
              flexDirection: "column",
              rowGap: 4,
            }}
          >
            <Paper
              sx={{
                display: "flex",
                flexDirection: "column",
                rowGap: 2,
                boxShadow: theme.baseShadow.secondary,
                flex: "1 1 0%",
                padding: theme.spacing(5),
              }}
            >
              {(props.type === "add" || props.type === "edit") && (
                <>
                  <NormalButton
                    {...{
                      ...(!(sendInvoiceLoading || sendReceiptLoading) && {
                        onClick: permission?.hasPermission("payment_edit")
                          ? handleSendPaper
                          : undefined,
                      }),
                    }}
                    sx={{
                      height: "35px",
                      width: "auto",
                      alignItems: "center",
                      border: "1px solid",
                      padding: theme.spacing(3),
                      borderColor: theme.palette.primaryTheme.main,
                      backgroundColor: theme.palette.primaryTheme.main,
                      borderRadius: "4px",
                      color: "white !important",
                      justifyContent: "center",
                      columnGap: theme.spacing(2),
                      cursor: !permission?.hasPermission("payment_edit")
                        ? "not-allowed"
                        : "pointer",
                    }}
                  >
                    {sendInvoiceLoading || sendReceiptLoading ? (
                      <CircularProgress
                        size={40}
                        sx={{
                          color: "white !important",
                          padding: 2,
                        }}
                      />
                    ) : (
                      <>
                        <Icon.Send />
                        <span>Send {paperName}</span>
                      </>
                    )}
                  </NormalButton>
                  <NormalButton
                    {...{
                      ...(isPaymentByIdNotEmpty
                        ? {
                            onClick: permission?.hasPermission("payment_view")
                              ? handleOnPreview
                              : undefined,
                          }
                        : {
                            disabled: true,
                          }),
                    }}
                    sx={{
                      cursor: !permission?.hasPermission("payment_view")
                        ? "not-allowed"
                        : "pointer",
                      height: "35px",
                      width: "auto",
                      alignItems: "center",
                      border: 0,
                      padding: theme.spacing(3),
                      borderRadius: "4px",
                      backgroundColor: `${theme.palette.primaryTheme.brown(
                        0.16
                      )}`,
                      ...(isPaymentByIdNotEmpty && {
                        color: theme.palette.primaryTheme.brown(),
                      }),
                      justifyContent: "center",
                    }}
                  >
                    {t("_preview_button")}
                  </NormalButton>
                  <NormalButton
                    {...{
                      ...(isPaymentByIdNotEmpty && isInvoiceExist
                        ? {
                            disabled: true,
                          }
                        : {
                            onClick: permission?.hasPermission("payment_edit")
                              ? handleOnSave
                              : undefined,
                          }),
                    }}
                    sx={{
                      cursor: !permission?.hasPermission("payment_edit")
                        ? "not-allowed"
                        : "pointer",
                      height: "35px",
                      width: "auto",
                      alignItems: "center",
                      border: 0,
                      padding: (theme) => theme.spacing(3),
                      backgroundColor: theme.palette.primaryTheme.brown(0.16),
                      borderRadius: "4px",
                      ...(isPaymentByIdNotEmpty &&
                        !isInvoiceExist && {
                          color: theme.palette.primaryTheme.brown(),
                        }),
                      justifyContent: "center",
                    }}
                  >
                    {t("_save_button")}
                  </NormalButton>
                </>
              )}
              {isPreviewPage && (
                <>
                  <NormalButton
                    {...{
                      ...(!(sendInvoiceLoading || sendReceiptLoading) && {
                        onClick: permission?.hasPermission("payment_edit")
                          ? handleSendPaper
                          : undefined,
                      }),
                    }}
                    sx={{
                      height: "35px",
                      width: "auto",
                      alignItems: "center",
                      border: "1px solid",
                      padding: theme.spacing(3),
                      borderColor: theme.palette.primaryTheme.main,
                      backgroundColor: theme.palette.primaryTheme.main,
                      borderRadius: "4px",
                      color: "white !important",
                      justifyContent: "center",
                      columnGap: theme.spacing(2),
                      cursor: !permission?.hasPermission("payment_edit")
                        ? "not-allowed"
                        : "pointer",
                    }}
                  >
                    {sendInvoiceLoading || sendReceiptLoading ? (
                      <CircularProgress
                        size={40}
                        sx={{
                          color: "white !important",
                          padding: 2,
                        }}
                      />
                    ) : (
                      <>
                        <Icon.Send />
                        <span>Send {paperName}</span>
                      </>
                    )}
                  </NormalButton>
                  <NormalButton
                    sx={{
                      height: "35px",
                      width: "auto",
                      alignItems: "center",
                      border: 0,
                      padding: (theme) => theme.spacing(3),
                      backgroundColor: theme.palette.primaryTheme.brown(0.16),
                      borderRadius: "4px",
                      color: theme.palette.primaryTheme.brown(),
                      justifyContent: "center",
                      cursor: !permission?.hasPermission("payment_edit")
                        ? "not-allowed"
                        : "pointer",
                    }}
                    onClick={() => {
                      if (permission?.hasPermission("payment_edit")) {
                        printInvoicePaper();
                      }
                    }}
                  >
                    {t("_download")}
                  </NormalButton>
                  {props.forPaper !== "receipt" && (
                    <NormalButton
                      sx={{
                        height: "35px",
                        width: "auto",
                        alignItems: "center",
                        border: 0,
                        padding: (theme) => theme.spacing(3),
                        backgroundColor: theme.palette.primaryTheme.brown(0.16),
                        borderRadius: "4px",
                        color: theme.palette.primaryTheme.brown(),
                        justifyContent: "center",
                        cursor: !permission?.hasPermission("payment_edit")
                          ? "not-allowed"
                          : "pointer",
                      }}
                      onClick={() => {
                        if (permission?.hasPermission("payment_edit")) {
                          props.onEvent("invoiceEdit", paymentById);
                        }
                      }}
                    >
                      {t("_edit_invoice")}
                    </NormalButton>
                  )}
                </>
              )}
            </Paper>
            {isAddOrEditPage && (
              <>
                <SelectV1
                  label={t("_accept_payment_via")}
                  selectStyle={{
                    height: "35px",
                    minHeight: "35px",
                    backgroundColor: "white",
                  }}
                  selectProps={{
                    disableClear: true,
                    menuPortalTarget: document.body,
                    value: paymentMethodOptions.filter(
                      (paymentMethodOption) =>
                        paymentMethodOption.value ===
                        paymentById?.paymentMethod?.toLowerCase()
                    )?.[0],
                    placeholder: "Payment name",
                    menuIsOpen: false,
                    isSearchable: false,
                  }}
                />
                <Typography
                  component="div"
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    rowGap: 2,
                  }}
                >
                  <Item
                    sx={{
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography component="div">
                      {t("_payment_terms")}
                    </Typography>
                    <AntSwitch />
                  </Item>
                  <Item
                    sx={{
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography component="div">
                      {t("_client_notes")}
                    </Typography>
                    <AntSwitch />
                  </Item>
                  <Item
                    sx={{
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography component="div">
                      {t("_payment_stub")}
                    </Typography>
                    <AntSwitch />
                  </Item>
                </Typography>
              </>
            )}
          </Typography>
        </Grid>
      </Grid>
    </InvoiceContainer>
  );
};

export default InvoiceAndReceipt;
