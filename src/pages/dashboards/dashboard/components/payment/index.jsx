import { Box, MenuItem, Typography, useMediaQuery } from "@mui/material";
import { createTheme, styled } from "@mui/material/styles";
import _ from "lodash";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { intToPrettyString, stringPluralize } from "../../../../../functions";
import * as Icon from "../../../../../icons/icons";
import useManagePayment from "../../hooks/useManagePayment";
import SelectStyled from "../SelectedStyled";
import BarChart from "./BarChart";

const theme = createTheme();

const PaymentContainer = styled("div")(({ theme, ...props }) => ({
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

const PaymentItem = styled("div")(({ theme, ...props }) => ({
  flexGrow: 1,
}));

const PaymentList = (props) => {
  const { t } = useTranslation();
  return (
    <Box sx={{ display: "flex", columnGap: 3 }}>
      <Typography
        component="div"
        sx={{
          width: 35,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(23,118,107,0.125)",
          padding: `${theme.spacing(0.5)} ${theme.spacing(1.25)}`,
          margin: "3px 0",
          borderRadius: "4px",
          img: {
            width: 25,
            height: 25,
          },
          ...(props.iconProps?.sx || {}),
        }}
      >
        {props.icon}
      </Typography>
      <Typography
        component="div"
        sx={{
          display: "flex",
          width: "150px",
          flexDirection: "column",
        }}
      >
        <Typography
          component="span"
          sx={{
            fontWeight: 600,
          }}
        >
          {_.capitalize(props.title)}
        </Typography>
        <Typography component="span" sx={{}}>
          {intToPrettyString(props.amount)}{" "}
          {stringPluralize(props.amount, t("_customer"))}
        </Typography>
      </Typography>
      <Typography
        component="div"
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Typography component="span" sx={{ fontWeight: 600 }}>
          ${intToPrettyString(props.amountDiscrepancy)}
        </Typography>
      </Typography>
      <Typography
        component="div"
        sx={{
          display: "flex",
          columnGap: 1,
          alignItems: "center",
        }}
      >
        {props.percent > 0 ? (
          <Typography
            component="div"
            sx={{
              display: "flex",
              alignItems: "center",
              color: "#29c770",
            }}
          >
            <Icon.IoIosArrowUpIcon />
          </Typography>
        ) : (
          <>
            {props.percent < 0 && (
              <Typography
                component="div"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  color: "rgb(234, 84, 85)",
                }}
              >
                <Icon.IoIosArrowDownIcon />
              </Typography>
            )}
          </>
        )}

        <Typography component="span" sx={{}}>
          {props.percent}%
        </Typography>
      </Typography>
    </Box>
  );
};

const index = (props) => {
  const [selectedValue, setSelectedValue] = useState("weekly");

  const managePayments = useManagePayment({
    labels: selectedValue,
  });

  const reportData = managePayments.data.reports;
  const amountTotal = reportData.amount.total;
  const discrepancy = reportData.discrepancy;

  const isMobile = useMediaQuery("(max-width:768px)");
  const isMax400px = useMediaQuery("(max-width:400px)");
  const { t } = useTranslation();
  return (
    <PaymentContainer>
      <PaymentItem
        sx={{
          display: "flex",
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
            {t("_package_topic")}
          </Typography>
          <Typography component="div">{t("_package_title")}</Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <SelectStyled
            value={selectedValue}
            label="Weekly"
            variant="outlined"
            onChange={(e) => setSelectedValue(e.target.value)}
          >
            <MenuItem value={"weekly"}>{t("_weekly")}</MenuItem>
            <MenuItem value={"monthly"}>{t("_monthly")}</MenuItem>
            <MenuItem value={"yearly"}>{t("_yearly")}</MenuItem>
          </SelectStyled>
        </Box>
      </PaymentItem>
      <PaymentItem>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            rowGap: 2,
          }}
        >
          <PaymentList
            icon={<Icon.TagIcon />}
            title={t("_free_package")}
            amount={amountTotal.free}
            percent={discrepancy.freePercent}
            amountDiscrepancy={discrepancy.freeAmount}
          />
          <PaymentList
            icon={<Icon.DiamondIcon />}
            title={t("_pro_package")}
            iconProps={{
              sx: {
                backgroundColor: "rgb(235,249,251)",
              },
            }}
            amount={amountTotal.pro}
            percent={discrepancy.proPercent}
            amountDiscrepancy={discrepancy.proAmount}
          />
          <PaymentList
            icon={<Icon.CrownIcon />}
            title={t("_premium_package")}
            iconProps={{
              sx: {
                backgroundColor: "rgb(255,247,250)",
              },
            }}
            amount={amountTotal.premium}
            percent={discrepancy.premiumPercent}
            amountDiscrepancy={discrepancy.premiumAmount}
          />
        </Box>
      </PaymentItem>
      <PaymentItem
        sx={{
          height: "400px",
        }}
      >
        <BarChart
          labels={reportData.labels}
          data={discrepancy}
          labelName={reportData.labelName}
        />
      </PaymentItem>
    </PaymentContainer>
  );
};
export default index;
