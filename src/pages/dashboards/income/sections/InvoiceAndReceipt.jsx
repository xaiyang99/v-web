import {
  Divider,
  Grid,
  Paper,
  // Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  styled,
  useTheme,
} from "@mui/material";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { prettyNumberFormat } from "../../../../functions";
import { paymentState } from "../../../../redux/slices/paymentSlice";
import VshareLogo from "../../../../utils/images/vshare-black-logo.png";

// const AntSwitch = styled(Switch)(({ theme }) => ({
//   width: 35,
//   height: 21,
//   padding: 0,
//   display: "flex",
//   "&:active": {
//     "& .MuiSwitch-thumb": {
//       width: 15 + 2,
//     },
//     "& .MuiSwitch-switchBase.Mui-checked": {
//       transform: "translateX(9px)",
//     },
//   },
//   "& .MuiSwitch-switchBase": {
//     padding: 2,
//     "&.Mui-checked": {
//       transform: "translateX(14px)",
//       color: "#fff",
//       "& .MuiSwitch-thumb": {
//         backgroundColor: "white",
//       },
//       "& + .MuiSwitch-track": {
//         opacity: 1,
//       },
//     },
//   },
//   "& .MuiSwitch-thumb": {
//     backgroundColor: theme.palette.primaryTheme.brown(0.3),
//     width: 14,
//     height: 14,
//     borderRadius: 10,
//     transition: theme.transitions.create(["width"], {
//       duration: 200,
//     }),
//     transform: "translate(2px, 1px)",
//   },
//   "& .MuiSwitch-track": {
//     borderRadius: 20,
//     opacity: 1,
//     border: `1px solid ${theme.palette.primaryTheme.brown(0.3)}`,
//     backgroundColor:
//       theme.palette.mode === "dark" ? "rgba(255,255,255,.35)" : "white",
//     boxSizing: "border-box",
//   },
// }));

const InvoiceContainer = styled("div")(({ theme }) => ({
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
  const DATE_FORMAT = "DD/MM/YYYY";
  const theme = useTheme();
  const { payerId, packageId, amount, ...data } = props.data;
  const { currencySymbol, taxValue, ...paymentSelector } =
    useSelector(paymentState);
  const paperName =
    props.forPaper === "receipt" ? t("_receipt") : t("_invoice");
  return (
    <InvoiceContainer>
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
                Office 149, 450 South Brand Brooklyn San Diego County, CA 91905,
                USA +1 (123) 456 7891, +44 (876) 543 2198
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
              <Typography
                component="span"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  rowGap: theme.spacing(3),
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
                        fontWeight: 600,
                        // fontSize: 22,
                        mr: 1,
                      }}
                    >
                      {paperName}
                    </Typography>
                    <Typography
                      component="span"
                      sx={{
                        fontWeight: 600,
                        // fontSize: 22,
                      }}
                    >
                      #{data.paymentId}
                    </Typography>
                  </Typography>
                </InvoiceItem>
                {props.forPaper === "receipt" ? (
                  <>
                    <InvoiceItem>
                      <Typography
                        component="div"
                        sx={{
                          display: "flex",
                          alignItems: "end",
                        }}
                      >
                        <Typography
                          component="div"
                          sx={{
                            mr: 1,
                          }}
                        >
                          {t("_date")}:
                        </Typography>
                        <Typography component="span">
                          {moment(
                            data.orderedAt,
                            "YYYY-MM-DDTHH:mm:ss.SSS"
                          ).format(DATE_FORMAT)}
                        </Typography>
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
                          alignItems: "end",
                        }}
                      >
                        <Typography
                          component="div"
                          sx={{
                            mr: 1,
                          }}
                        >
                          {t("_issue_date")}:
                        </Typography>
                        <Typography component="span">
                          {moment(
                            data.createdAt,
                            "YYYY-MM-DDTHH:mm:ss.SSS"
                          ).format(DATE_FORMAT)}
                        </Typography>
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
                            mr: 1,
                          }}
                        >
                          {t("_due_date")}:
                        </Typography>
                        <Typography component="span">
                          {moment(
                            data.orderedAt,
                            "YYYY-MM-DDTHH:mm:ss.SSS"
                          ).format(DATE_FORMAT)}
                        </Typography>
                      </Typography>
                    </InvoiceItem>
                  </>
                )}
              </Typography>
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
                {/* {paperName} To: */}
                {t("_invoice_to")}
              </InvoiceItem>
              <InvoiceItem
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  rowGap: 1,
                }}
              >
                <Typography component="div">
                  {payerId.firstName} {payerId.lastName}
                </Typography>
                {payerId.address && (
                  <Typography
                    component="div"
                    sx={{
                      maxWidth: 200,
                    }}
                  >
                    {payerId.address}
                  </Typography>
                )}
                {payerId.phone && (
                  <Typography component="div">{payerId.phone}</Typography>
                )}
                <Typography component="div">{payerId.email}</Typography>
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
          <InvoiceItem>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell width={"25%"}>{t("_item")}</TableCell>
                  <TableCell width={"25%"}>{t("_description")}</TableCell>
                  <TableCell width={"12.5%"}>{t("_cost")}</TableCell>
                  <TableCell width={"12.5%"}>{t("_quantity")}</TableCell>
                  <TableCell width={"25%"}>{t("_total")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[packageId].map((packageData) => (
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    key={packageData._id}
                  >
                    <TableCell>{packageData.name}</TableCell>
                    <TableCell>{packageData.description}</TableCell>
                    <TableCell>
                      {paymentSelector.currencySymbol}{" "}
                      {packageData.price?.toLocaleString()}
                    </TableCell>
                    <TableCell>1</TableCell>
                    <TableCell>
                      {paymentSelector.currencySymbol}{" "}
                      {packageData.price?.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </InvoiceItem>
        </InvoiceItemLayout>
      </InvoicePaper>
      <Divider />
      <InvoicePaper>
        <Grid container>
          <Grid item md={6} sm={6}>
            <InvoiceItemLayout>
              <InvoiceItem>
                {/* <Typography
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
                    Salesperson:
                  </Typography>
                  <Typography component="span">Alfie Solomons</Typography>
                </Typography> */}
              </InvoiceItem>
              <InvoiceItem>
                <Typography component="span">
                  {t("_thank_you_message")}
                </Typography>
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
                    {t("_total")}:
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
        <InvoiceItemLayout
          sx={{
            flexDirection: "row",
            columnGap: 1,
          }}
        >
          <Typography
            component="span"
            sx={{
              fontWeight: 600,
            }}
          >
            {t("_note")}:
          </Typography>
          <Typography component="span">{t("_note_description")}</Typography>
        </InvoiceItemLayout>
      </InvoicePaper>
    </InvoiceContainer>
  );
};

export default InvoiceAndReceipt;
