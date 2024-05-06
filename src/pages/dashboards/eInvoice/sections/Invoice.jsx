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
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import { successMessage } from "../../../../components/Alerts";
import InputTextField from "../../../../components/InputTextField";
import NormalButton from "../../../../components/NormalButton";
import TextAreaField from "../../../../components/TextAreaField";
import {
  generateRandomUniqueNumber,
  prettyNumberFormat,
  safeGetProperty,
} from "../../../../functions";
import useAuth from "../../../../hooks/useAuth";
import * as Icon from "../../../../icons/icons";
import { paymentState } from "../../../../redux/slices/paymentSlice";
import VshareLogo from "../../../../utils/images/vshare-black-logo.png";
import SelectV1 from "../../components/SelectV1";
import {
  MUTATION_CREATE_INVOICE,
  MUTATION_SEND_INVOICE,
  MUTATION_SEND_RECEIPT,
  MUTATION_UPDATE_INVOICE,
  QUERY_INVOICES,
  QUERY_PACKAGES,
  QUERY_PAYMENTS,
} from "../apollo";
import useSelectCustomers from "../hooks/useSelectCustomers";
import useSelectPackageForInvoices from "../hooks/useSelectPackageForInvoices";

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

const InvoiceItem = styled("div")(({ theme }) => ({}));

const Item = styled("div")(({ theme }) => ({
  display: "flex",
}));

const Invoice = (props) => {
  const { t } = useTranslation();
  const [getPayments, { data: dataPayments, refetch }] = useLazyQuery(
    QUERY_PAYMENTS,
    {
      fetchPolicy: "no-cache",
    }
  );
  const invoiceId = useMemo(() => generateRandomUniqueNumber(), []);
  const theme = useTheme();
  const { currencySymbol, taxValue, ...paymentSelector } =
    useSelector(paymentState);
  const [isInvoiceExist, setIsInvoiceExist] = useState(null);
  const { user } = useAuth();
  const [getInvoices, { data: dataInvoices, refetch: refetchInvoices }] =
    useLazyQuery(QUERY_INVOICES, {
      fetchPolicy: "no-cache",
    });

  const [getPackages, { data: dataPackges, refetch: refetchPackages }] =
    useLazyQuery(QUERY_PACKAGES, {
      fetchPolicy: "no-cache",
    });

  const [createInvoice] = useMutation(MUTATION_CREATE_INVOICE);
  const [updateInvoice] = useMutation(MUTATION_UPDATE_INVOICE);
  const paperName =
    props.forPaper === "receipt" ? t("_receipt") : t("_invoice");
  const [sendInvoice, { loading: sendInvoiceLoading }] = useMutation(
    MUTATION_SEND_INVOICE
  );

  const [sendReceipt, { loading: sendReceiptLoading }] = useMutation(
    MUTATION_SEND_RECEIPT
  );

  const selectPackageForInvoices = useSelectPackageForInvoices();
  const selectCustomers = useSelectCustomers();

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
  const [packageSelectedList, setPackageSelectedList] = useState([]);
  useEffect(() => {
    const result = dataPackges?.getPackage?.data?.[0];
    if (result) {
      setPackageSelectedList([
        {
          id: result._id,
          packageId: result.packageId,
          name: result.name,
          cost: result.price,
          qty: 1,
          description: result.description,
        },
      ]);
    }
  }, [dataPackges]);

  useEffect(() => {
    if (!_.isEmpty(data) && props.isByDataId && !props.isFromDataByIdPage) {
      const { customerId, packageId } = data;
      setPackageSelectedList([
        {
          id: packageId._id,
          packageId: packageId.packageId,
          name: packageId.name,
          cost: packageId.price,
          qty: 1,
          description: packageId.description,
        },
      ]);
    }
  }, [data]);

  const billToSectionWidth = 120;

  const userById = useMemo(() =>
    /* selectCustomers.data?.find(
        (data) => data._id === formik.values.invoiceToCustomerId
      ) || null, */
    [
      /* formik.values.invoiceToCustomerId, selectCustomers.data */
    ]
  );

  const handleOnSave = async () => {
    if (!packageSelected || isInvoiceExist) {
      return;
    }
    if (props.type === "edit" && props.isByDataId) {
      try {
        await updateInvoice({
          variables: {
            input: {
              customerId: formik.values.customer.id,
              packageId: packageSelected.packageId,
              name: "invoice",
              amount:
                packageSelected.cost * packageSelected.qty +
                packageSelected.cost * packageSelected.qty * taxValue,
            },
            id: data.invoiceId,
          },
        });
        setIsInvoiceExist(true);
        successMessage("Updated an invoice successfully", 3000);
      } catch (err) {
        return;
      }
    } else {
      try {
        await createInvoice({
          variables: {
            input: {
              customerId: formik.values.customer.id,
              packageId: packageSelected.packageId,
              name: "invoice",
              amount:
                packageSelected.cost * packageSelected.qty +
                packageSelected.cost * packageSelected.qty * taxValue,
            },
          },
        });
        setIsInvoiceExist(true);
        successMessage("Created an invoice successfully", 3000);
      } catch (err) {
        return;
      }
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      customer: {
        id: "",
        name: "",
      },
      paymentName: "",
      dateIssues: null,
      dateDue: null,
      invoiceToCustomerId: {},
      paymentId: "",
      package: [],
      /* salesperson: user ? `${user.firstname} ${user.lastname}` : "", */
    },
    onSubmit: handleOnSave,
  });

  const handleAddNewPackageSelected = () => {
    const result = packageSelectedList?.[0];
    formik.setFieldValue("package[0].id", result.id);
    formik.setFieldValue("package[0].packageId", result.packageId);
    formik.setFieldValue("package[0].name", result.name);
    formik.setFieldValue("package[0].cost", result.cost);
    formik.setFieldValue("package[0].qty", 1);
    formik.setFieldValue("package[0].description", result.description);
    successMessage(
      formik.values.package.length > 0 ? "Item changed!" : "Item added!",
      3000
    );
  };

  useEffect(() => {
    if (!_.isEmpty(data) && props.isByDataId && !props.isFromDataByIdPage) {
      const { customerId, packageId } = data;
      formik.setFieldValue("customer.id", customerId._id);
      formik.setFieldValue(
        "customer.name",
        `${customerId.firstName} ${customerId.lastName}`
      );
      formik.setFieldValue("package[0].id", packageId._id);
      formik.setFieldValue("package[0].packageId", packageId.packageId);
      formik.setFieldValue("package[0].name", packageId.name);
      formik.setFieldValue("package[0].cost", packageId.price);
      formik.setFieldValue("package[0].qty", 1);
      formik.setFieldValue("package[0].description", packageId.description);
    }
  }, [data]);

  const packageSelected = formik.values.package?.[0];

  const handleOnPreview = async () => {
    if (props.isByDataId) {
      props.onEvent(
        "invoicePreviewByDataId",
        {
          ...data,
          ...formik.values,
        },
        true
      );
    } else {
      props.onEvent("invoicePreview", {
        ...data,
        ...formik.values,
      });
    }
  };

  const handleSendPaper = async () => {
    await sendInvoice({
      variables: {
        id: data.invoiceId,
      },
    });
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
                      91905, USA +1 (123) 456 7891, +44 (876) 543 219811111
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
                            value: data.invoiceId || "###########",
                          }}
                        />
                      </Typography>
                    </InvoiceItem>
                    {/* <InvoiceItem>
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
                          Date Issues
                        </Typography>
                        <DatePickerV1
                          datePickerProps={{
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
                    </InvoiceItem> */}
                    {/* <InvoiceItem>
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
                          Date Due
                        </Typography>
                        <DatePickerV1
                          datePickerProps={{
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
                    </InvoiceItem> */}
                  </InvoiceItemLayout>
                </Grid>
              </Grid>
            </InvoicePaper>
            <Divider />
            <InvoicePaper>
              <Grid container>
                <Grid item md={2} sm={2}>
                  <InvoiceItemLayout>
                    <InvoiceItem
                      sx={{
                        fontWeight: 600,
                      }}
                    >
                      {t("_invoice_to")}:
                    </InvoiceItem>
                    {isAddOrEditPage && (
                      <InvoiceItem>
                        <SelectV1
                          selectStyle={{
                            height: "35px",
                            minHeight: "35px",
                            backgroundColor: "white",
                          }}
                          selectProps={{
                            disableClear: true,
                            menuPortalTarget: document.body,
                            placeholder: "Select customer",
                            ...(formik.values.customer.id && {
                              value: {
                                label: formik.values.customer.name,
                                value: formik.values.customer.id,
                              },
                            }),
                            onChange: (e) => {
                              const customerSelected =
                                selectCustomers.data?.find(
                                  (data) => data._id === e?.value
                                );
                              formik.setFieldValue(
                                "customer.id",
                                e?.value || ""
                              );
                              formik.setFieldValue(
                                "customer.name",
                                `${customerSelected.firstName} ${customerSelected.lastName}`
                              );
                            },
                            onInputChange: (value) => {
                              selectCustomers.getCustomers({
                                variables: {
                                  where: {
                                    firstName: value,
                                  },
                                  limit: 20,
                                },
                              });
                            },
                            options: selectCustomers.options,
                            /* menuIsOpen: false,
                    isSearchable: false, */
                          }}
                        />
                      </InvoiceItem>
                    )}

                    <InvoiceItem
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        rowGap: 1,
                      }}
                    >
                      <Typography component="div">
                        {formik.values.customer.id &&
                          _.startCase(`${formik.values.customer.name}`)}
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
                            {t("description")}
                          </TableCell>
                          <TableCell width={"12.5%"}>{t("_cost")}</TableCell>
                          <TableCell width={"12.5%"}>
                            {t("_quantity")}
                          </TableCell>
                          <TableCell width={"25%"}>{t("_total")}</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {[packageSelected || {}].map((packageData) => {
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
                                {currencySymbol}{" "}
                                {prettyNumberFormat(
                                  safeGetProperty(packageData, "cost")
                                )}
                              </TableCell>
                              <TableCell>
                                {safeGetProperty(packageData, "qty")}
                              </TableCell>
                              <TableCell>
                                {currencySymbol}{" "}
                                {prettyNumberFormat(
                                  safeGetProperty(packageData, "cost") *
                                    safeGetProperty(packageData, "qty")
                                )}
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
            {isAddOrEditPage && (
              <>
                <InvoicePaper>
                  <Grid container>
                    <Grid item md={12} sm={12}>
                      <InvoiceItemLayout>
                        <InvoiceItem>
                          <Typography
                            component="div"
                            sx={{
                              display: "flex",
                            }}
                          >
                            <Typography
                              component="div"
                              width={"50%"}
                              padding={"12px"}
                            >
                              {t("_item")}
                            </Typography>
                            <Typography
                              component="div"
                              width={"30%"}
                              padding={"12px"}
                            >
                              {t("_cost")}
                            </Typography>
                            <Typography
                              component="div"
                              width={"10%"}
                              padding={"12px"}
                            >
                              {t("_quantity")}
                            </Typography>
                            <Typography
                              component="div"
                              width={"7%"}
                              padding={"12px"}
                            >
                              {t("_price")}
                            </Typography>
                            <Typography
                              component="div"
                              width={"3%"}
                              padding={"12px"}
                            ></Typography>
                          </Typography>
                          <Table
                            aria-label="simple table"
                            sx={{
                              "& th,td": {
                                border: 0,
                                padding: 3,
                              },
                            }}
                          >
                            <TableBody
                              sx={{
                                display: "block",
                                border: "1px solid rgba(0,0,0,0.23)",
                                borderRadius: "4px",
                              }}
                            >
                              <TableRow>
                                <TableCell width={"50%"}>
                                  <SelectV1
                                    selectStyle={{
                                      height: "35px",
                                      minHeight: "35px",
                                    }}
                                    selectProps={{
                                      id: "package.id",
                                      name: "package.id",
                                      onChange: (e) => {
                                        if (e?.value) {
                                          getPackages({
                                            variables: {
                                              where: {
                                                packageId: e.value,
                                              },
                                            },
                                          });
                                        }
                                      },
                                      ...(packageSelected && {
                                        value:
                                          selectPackageForInvoices.options.find(
                                            (data) =>
                                              data.value ===
                                              packageSelectedList?.[0]
                                                ?.packageId
                                          ),
                                      }),
                                      disableClear: true,
                                      menuPortalTarget: document.body,
                                      options: selectPackageForInvoices.options,
                                      placeholder: "Select Item",
                                    }}
                                  />
                                </TableCell>
                                <TableCell width={"30%"}>
                                  <InputTextField
                                    readOnly
                                    inputLayoutProps={{
                                      sx: { height: 35, minHeight: 35 },
                                    }}
                                    inputProps={{
                                      id: "package.cost",
                                      name: "package[0].cost",
                                      onChange: formik.handleChange,
                                      value: packageSelectedList?.[0]?.cost
                                        ? `${prettyNumberFormat(
                                            packageSelectedList[0].cost,
                                            {
                                              minimumFractionDigits: 0,
                                            }
                                          )}$`
                                        : "",
                                    }}
                                  />
                                </TableCell>
                                <TableCell width={"10%"}>
                                  <InputTextField
                                    readOnly
                                    inputLayoutProps={{
                                      sx: { height: 35, minHeight: 35 },
                                    }}
                                    inputProps={{
                                      id: "package.qty",
                                      name: "package[0].qty",
                                      onChange: formik.handleChange,
                                      value:
                                        packageSelectedList?.[0]?.qty || "",
                                    }}
                                  />
                                </TableCell>
                                <TableCell width={"7%"}>
                                  {formik.values.package.cost &&
                                    `${
                                      paymentSelector.currencySymbol
                                    } ${formik.values.package.cost.toLocaleString()}`}
                                </TableCell>
                                <TableCell
                                  width={"3%"}
                                  sx={{
                                    textAlign: "center",
                                    verticalAlign: "top",
                                    borderLeft:
                                      "1px solid rgba(0,0,0,0.23) !important",
                                  }}
                                >
                                  X
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell width={"50%"}>
                                  <TextAreaField
                                    {...{
                                      readOnly: true,
                                      placeholder: "Description",
                                      id: "package.description",
                                      name: "package[0].description",
                                      value:
                                        packageSelectedList?.[0]?.description ||
                                        "",
                                    }}
                                  />
                                </TableCell>
                                <TableCell width={"30%"}></TableCell>
                                <TableCell width={"10%"}></TableCell>
                                <TableCell width={"7%"}></TableCell>
                                <TableCell
                                  width={"3%"}
                                  sx={{
                                    textAlign: "center",
                                    verticalAlign: "bottom",
                                    borderLeft:
                                      "1px solid rgba(0,0,0,0.23) !important",
                                  }}
                                >
                                  <Icon.SettingIcon />
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </InvoiceItem>
                        <InvoiceItem>
                          <NormalButton
                            onClick={handleAddNewPackageSelected}
                            sx={{
                              height: "35px",
                              width: "auto",
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
                            {formik.values.package.length > 0
                              ? t("_change_item")
                              : t("_add_item")}
                          </NormalButton>
                        </InvoiceItem>
                      </InvoiceItemLayout>
                    </Grid>
                  </Grid>
                </InvoicePaper>
                <Divider />
              </>
            )}
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
                          {prettyNumberFormat(
                            packageSelected?.cost * packageSelected?.qty
                          )}
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
                          {prettyNumberFormat(
                            packageSelected?.cost *
                              packageSelected?.qty *
                              taxValue
                          )}
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
                          {prettyNumberFormat(
                            packageSelected?.cost * packageSelected?.qty +
                              packageSelected?.cost *
                                packageSelected?.qty *
                                taxValue
                          )}
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
              {isAddOrEditPage && (
                <>
                  {props.type !== "add" && (
                    <NormalButton
                      {...{
                        ...(!(sendInvoiceLoading || sendReceiptLoading) && {
                          onClick: handleSendPaper,
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
                  )}

                  <NormalButton
                    {...{
                      ...(packageSelected && {
                        onClick: handleOnPreview,
                      }),

                      ...(!packageSelected && {
                        disabled: true,
                      }),
                    }}
                    sx={{
                      height: "35px",
                      width: "auto",
                      alignItems: "center",
                      border: 0,
                      padding: theme.spacing(3),
                      borderRadius: "4px",
                      backgroundColor: `${theme.palette.primaryTheme.brown(
                        0.16
                      )}`,
                      ...(packageSelected && {
                        color: theme.palette.primaryTheme.brown(),
                      }),
                      justifyContent: "center",
                    }}
                  >
                    {t("_preview_button")}
                  </NormalButton>
                  <NormalButton
                    {...{
                      ...(packageSelected && {
                        onClick: handleOnSave,
                      }),
                      ...(!packageSelected && {
                        disabled: true,
                      }),
                    }}
                    sx={{
                      height: "35px",
                      width: "auto",
                      alignItems: "center",
                      border: 0,
                      padding: (theme) => theme.spacing(3),
                      backgroundColor: theme.palette.primaryTheme.brown(0.16),
                      borderRadius: "4px",
                      ...(packageSelected && {
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
                  {props.isByDataId && (
                    <NormalButton
                      {...{
                        ...(!(sendInvoiceLoading || sendReceiptLoading) && {
                          onClick: handleSendPaper,
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
                  )}

                  {/* <NormalButton
                    sx={{
                      height: "35px",
                      width: "auto",
                      alignItems: "center",
                      border: 0,
                      padding: theme.spacing(3),
                      borderRadius: "4px",
                      backgroundColor: `${theme.palette.primaryTheme.brown(
                        0.16
                      )} !important`,
                      color: theme.palette.primaryTheme.brown(),
                      justifyContent: "center",
                    }}
                  >
                    Download
                  </NormalButton> */}
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
                    }}
                    onClick={() => printInvoicePaper()}
                  >
                    {t("_download_button")}
                  </NormalButton>
                  {!props.isByDataId && (
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
                      }}
                      onClick={() =>
                        props.onEvent("invoiceEdit", formik.values)
                      }
                    >
                      {t("_edit_invoice")}
                    </NormalButton>
                  )}

                  {/* <NormalButton
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
                    }}
                  >
                    Add Payment
                  </NormalButton> */}
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
                    placeholder: t("_payment_name"),
                    onChange: (e) => {
                      formik.setFieldValue("paymentName", e?.value || "");
                    },
                    options: paymentMethodOptions,
                    /* menuIsOpen: false,
                    isSearchable: false, */
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

export default Invoice;