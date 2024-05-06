import {
  Box,
  Tab,
  Tabs,
  Typography,
  createTheme,
  styled,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import useManageTransaction from "../../hooks/useManageTransaction";
import LatestPayment from "./LatestPayment";
import StripePayment from "./StripePayment";
import { useTranslation } from "react-i18next";

const theme = createTheme();

const TransactionMethodContainer = styled("div")(({ theme, ...props }) => ({
  display: "flex",
  flexDirection: "column",
  backgroundColor: theme.palette.mode === "dark" ? "#fff" : "#fff",
  ...theme.typography.body2,
  textAlign: "left",
  color: theme.palette.text.secondary,
  borderRadius: "8px",
  rowGap: theme.spacing(5),
  height: "100%",
}));

const TransactionMethodItem = styled("div")(({ theme, ...props }) => ({
  flexGrow: 1,
}));

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      sx={{
        flexGrow: 1,
        overflow: "auto",
      }}
    >
      {value === index && (
        <Box sx={{ p: 6, height: "100%" }}>
          <Typography
            component="div"
            sx={{
              height: "100%",
            }}
          >
            {children}
          </Typography>
        </Box>
      )}
    </Typography>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
    className: "payment-tab-button",
  };
}

const index = (props) => {
  const { t } = useTranslation();
  const [selectedValue, setSelectedValue] = useState("lastSevenDays");
  const manageTransaction = useManageTransaction();
  const isMobile = useMediaQuery("(max-width:768px)");
  const isMax400px = useMediaQuery("(max-width:400px)");
  const theme = useTheme();
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <TransactionMethodContainer>
      <TransactionMethodItem
        sx={{
          display: "flex",
          padding: `${theme.spacing(6)} ${theme.spacing(6)} 0 ${theme.spacing(
            6
          )}`,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            rowGap: theme.spacing(0.5),
            flexGrow: 1,
          }}
        >
          <Typography
            component="div"
            sx={{
              typography: "h4",
              fontWeight: 600,
            }}
          >
            {t("_transection_topic")}
          </Typography>
          <Typography component="div">{t("_transection_title")}</Typography>
        </Box>
      </TransactionMethodItem>
      <TransactionMethodItem
        sx={{
          height: "500px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
            sx={{
              ".payment-tab-button": {
                maxWidth: "100% !important",
              },
            }}
          >
            <Tab
              label={t("_tab_lastest_payment")}
              {...a11yProps(0)}
              sx={{
                flexGrow: 1,
              }}
            />
            {/* <Tab label="Bcel One" {...a11yProps(1)} sx={{ flexGrow: 1 }} /> */}
            <Tab
              label="Stripe payment"
              {...a11yProps(1)}
              sx={{ flexGrow: 1 }}
            />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <LatestPayment data={manageTransaction.data.latestPayment} />
        </CustomTabPanel>
        {/* <CustomTabPanel value={value} index={1}>
          <BcelOnePayment />
        </CustomTabPanel> */}
        <CustomTabPanel value={value} index={1}>
          <StripePayment data={manageTransaction.data.stripePayment} />
        </CustomTabPanel>
      </TransactionMethodItem>
    </TransactionMethodContainer>
  );
};
export default index;
