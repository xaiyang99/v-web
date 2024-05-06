import {
  Divider,
  Grid,
  Paper,
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
import { prettyNumberFormat, safeGetProperty } from "../../../../functions";
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

const ReceiptContainer = styled("div")(({ theme }) => ({
  marginTop: theme.spacing(3),
  color: `${theme.palette.primaryTheme.brown()} !important`,
}));

const ReceiptPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(9),
  color: `${theme.palette.primaryTheme.brown()} !important`,
}));

const ReceiptItemLayout = styled("div")(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  rowGap: theme.spacing(3),
}));

const ReceiptItem = styled("div")(({ theme }) => ({}));

const Item = styled("div")(({ theme }) => ({
  display: "flex",
}));

const Receipt = (props) => {
  const { t } = useTranslation();
  const DATE_FORMAT = "DD/MM/YYYY";
  const theme = useTheme();
  const { payerId, packageId, ...data } = props.data;
  const amount = safeGetProperty(data, "amount");
  const { currencySymbol, taxValue, ...paymentSelector } =
    useSelector(paymentState);
  return (
    <ReceiptContainer>
      <ReceiptPaper>
        <Grid container>
          <Grid item md={6} sm={6}>
            <ReceiptItemLayout>
              <ReceiptItem>
                <img
                  src={VshareLogo}
                  alt="v-share logo"
                  width={150}
                  height={40}
                />
              </ReceiptItem>
              <ReceiptItem
                sx={{
                  maxWidth: 250,
                }}
              >
                Office 149, 450 South Brand Brooklyn San Diego County, CA 91905,
                USA +1 (123) 456 7891, +44 (876) 543 2198
              </ReceiptItem>
            </ReceiptItemLayout>
          </Grid>
          <Grid item md={6} sm={6}>
            <ReceiptItemLayout
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
                <ReceiptItem>
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
                        fontSize: 22,
                        mr: 1,
                      }}
                    >
                      {t("_receipt")}
                    </Typography>
                    <Typography
                      component="span"
                      sx={{
                        fontWeight: 600,
                        fontSize: 22,
                      }}
                    >
                      #{data.paymentId}
                    </Typography>
                  </Typography>
                </ReceiptItem>
                <ReceiptItem>
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
                      {moment(data.createdAt).format(DATE_FORMAT)}
                    </Typography>
                  </Typography>
                </ReceiptItem>
                <ReceiptItem>
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
                    <Typography component="span" sx={{}}>
                      {moment(data.orderedAt).format(DATE_FORMAT)}
                    </Typography>
                  </Typography>
                </ReceiptItem>
              </Typography>
            </ReceiptItemLayout>
          </Grid>
        </Grid>
      </ReceiptPaper>
      <Divider />
      <ReceiptPaper>
        <Grid container>
          <Grid item md={6} sm={6}>
            <ReceiptItemLayout>
              <ReceiptItem
                sx={{
                  fontWeight: 600,
                }}
              >
                Receipt To:
              </ReceiptItem>
              <ReceiptItem
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  rowGap: 1,
                }}
              >
                <Typography component="div">
                  {payerId.firstName} {payerId.lastName}
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
                <Typography component="div">{payerId.email}</Typography>
              </ReceiptItem>
            </ReceiptItemLayout>
          </Grid>
          <Grid item md={6} sm={6}>
            <ReceiptItemLayout>
              <ReceiptItem
                sx={{
                  fontWeight: 600,
                }}
              >
                Bill To:
              </ReceiptItem>
              <ReceiptItem
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
                    Total Due:
                  </Typography>
                  <Typography
                    component="div"
                    sx={{
                      fontWeight: 600,
                    }}
                  >
                    {currencySymbol}{" "}
                    {prettyNumberFormat(safeGetProperty(data, "amount"))}
                  </Typography>
                </Item>
                <Item>
                  <Typography
                    component="div"
                    sx={{
                      minWidth: 100,
                    }}
                  >
                    Bank name:
                  </Typography>
                  <Typography component="div">American Bank</Typography>
                </Item>
                <Item>
                  <Typography
                    component="div"
                    sx={{
                      minWidth: 100,
                    }}
                  >
                    Country:
                  </Typography>
                  <Typography component="div">United States</Typography>
                </Item>
                <Item>
                  <Typography
                    component="div"
                    sx={{
                      minWidth: 100,
                    }}
                  >
                    IBAN:
                  </Typography>
                  <Typography component="div">ETD95476213874685</Typography>
                </Item>
                <Item>
                  <Typography
                    component="div"
                    sx={{
                      minWidth: 100,
                    }}
                  >
                    SWIFT code:
                  </Typography>
                  <Typography component="div">BR91905</Typography>
                </Item>
              </ReceiptItem>
            </ReceiptItemLayout>
          </Grid>
        </Grid>
      </ReceiptPaper>
      <Divider />
      <ReceiptPaper
        sx={{
          padding: 0,
        }}
      >
        <ReceiptItemLayout>
          <ReceiptItem>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell width={"25%"}>Item</TableCell>
                  <TableCell width={"25%"}>Description</TableCell>
                  <TableCell width={"12.5%"}>Cost</TableCell>
                  <TableCell width={"12.5%"}>Quantity</TableCell>
                  <TableCell width={"25%"}>Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[packageId].map((packageData) => (
                  <TableRow
                    key={packageData._id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
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
          </ReceiptItem>
        </ReceiptItemLayout>
      </ReceiptPaper>
      <Divider />
      <ReceiptPaper>
        <Grid container>
          <Grid item md={6} sm={6}>
            <ReceiptItemLayout>
              <ReceiptItem>
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
                    Salesperson:
                  </Typography>
                  <Typography component="span">Alfie Solomons</Typography>
                </Typography>
              </ReceiptItem>
              <ReceiptItem>
                <Typography component="span">
                  Thank you for your business
                </Typography>
              </ReceiptItem>
            </ReceiptItemLayout>
          </Grid>
          <Grid item md={6} sm={6}>
            <ReceiptItemLayout
              sx={{
                whiteSpace: "nowrap",
                justifyContent: "center",
                alignItems: "flex-end",
              }}
            >
              <ReceiptItem
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
                    Subtotal:
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
                    Discount:
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
                    Tax:
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
                    Price:
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
              </ReceiptItem>
            </ReceiptItemLayout>
          </Grid>
        </Grid>
      </ReceiptPaper>
      <Divider />
      <ReceiptPaper>
        <ReceiptItemLayout
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
            Note:
          </Typography>
          <Typography component="span">
            It was a pleasure working with you and your team. We hope you will
            keep us in mind for future freelance projects. Thank You!
          </Typography>
        </ReceiptItemLayout>
      </ReceiptPaper>
    </ReceiptContainer>
  );
};

export default Receipt;
