import { Box, MenuItem, Typography, useMediaQuery } from "@mui/material";
import { createTheme, styled } from "@mui/material/styles";
import { t } from "i18next";
import { useState } from "react";
import { useSelector } from "react-redux";
import {
  intToPrettyString,
  prettyNumberFormat,
} from "../../../../../functions";
import * as Icon from "../../../../../icons/icons";
import { paymentState } from "../../../../../redux/slices/paymentSlice";
import useManageIncome from "../../hooks/useManageIncome";
import SelectStyled from "../SelectedStyled";
import LineChart from "./LineChart";

const theme = createTheme();

const EarningReportContainer = styled("div")(({ theme, ...props }) => ({
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

const EarningReportItem = styled("div")(({ theme, ...props }) => ({
  flexGrow: 1,
}));

const EarningReportList = (props) => {
  const paymentSelector = useSelector(paymentState);
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
          {paymentSelector.currencySymbol}
          {intToPrettyString(prettyNumberFormat(props.title))}
        </Typography>
        <Typography component="span" sx={{}}>
          {t("_total_earning")}
        </Typography>
      </Typography>
      <Typography
        component="div"
        sx={{
          display: "flex",
          columnGap: 1,
          flexGrow: 1,
          justifyContent: "end",
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

        <Typography
          component="span"
          sx={{
            ...(props.percent > 0 && {
              color: "#29c770",
            }),
            ...(props.percent < 0 && {
              color: "rgb(234, 84, 85)",
            }),
          }}
        >
          {props.percent}%
        </Typography>
      </Typography>
    </Box>
  );
};

const EarningProfitReportList = (props) => {
  const paymentSelector = useSelector(paymentState);
  return (
    <Box sx={{ display: "flex", columnGap: 3 }}>
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
      </Typography>
      <Typography
        component="div"
        sx={{
          display: "flex",
          flexGrow: 1,
          columnGap: 3,
          justifyContent: "end",
          alignItems: "center",
        }}
      >
        <Typography component="span" sx={{ fontWeight: 600 }}>
          {paymentSelector.currencySymbol}
          {prettyNumberFormat(props.amount, {
            minimumFractionDigits: 0,
          })}
        </Typography>
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

        <Typography
          component="span"
          sx={{
            ...(props.percent > 0 && {
              color: "#29c770",
            }),
            ...(props.percent < 0 && {
              color: "rgb(234, 84, 85)",
            }),
          }}
        >
          {props.percent}%
        </Typography>
      </Typography>
    </Box>
  );
};

const index = (props) => {
  const [selectedValue, setSelectedValue] = useState("weekly");

  const manageIncomes = useManageIncome({
    labels: selectedValue,
  });

  const reportData = manageIncomes.data.reports;
  const amountTotal = reportData.amount.total;
  const discrepancy = reportData.discrepancy;

  const isMobile = useMediaQuery("(max-width:768px)");
  const isMax400px = useMediaQuery("(max-width:400px)");
  return (
    <EarningReportContainer>
      <EarningReportItem
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
            {t("_earning_report_topic")}
          </Typography>
          <Typography component="div">
            {t(`_${selectedValue}`)} Earning Overview
          </Typography>
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
      </EarningReportItem>
      <EarningReportItem>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            rowGap: 2,
          }}
        >
          <EarningReportList
            icon={<Icon.CurrencyDollarIcon />}
            title={amountTotal.all}
            percent={discrepancy.totalPercent}
          />
        </Box>
      </EarningReportItem>
      <EarningReportItem
        sx={{
          flexGrow: 1,
        }}
      >
        <LineChart labels={reportData.labels} data={discrepancy} />
      </EarningReportItem>
      <EarningReportItem>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            rowGap: 2,
          }}
        >
          <EarningProfitReportList
            title={t("_finance_income_menu")}
            amount={amountTotal.income}
            percent={discrepancy.incomePercent}
          />
          <EarningProfitReportList
            title={t("_profit")}
            amount={amountTotal.profit}
            percent={discrepancy.profitPercent}
          />
        </Box>
      </EarningReportItem>
    </EarningReportContainer>
  );
};
export default index;
