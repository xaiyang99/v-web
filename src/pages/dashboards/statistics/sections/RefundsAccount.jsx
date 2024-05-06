import { withTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { Line } from "react-chartjs-2";

import {
  Box,
  CardContent,
  CardHeader,
  Card as MuiCard,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { spacing } from "@mui/system";
import { useDispatch, useSelector } from "react-redux";
import {
  currentDateAndLastYearDate,
  formatePercentString,
  formattedAmount,
} from "../../../../functions";
import {
  purshaseState,
  setRefund,
} from "../../../../redux/slices/purshareStatistic";
import { selectOptionState } from "../../../../redux/slices/statistics";
import Sections from "../Sections";
import OptionsStatistics from "../authentication/menu/optionsStatistics";
import useSetLabels from "../hooks/useSetLabels";
import { TbCurrencyDollar } from "react-icons/tb";
import { useRefundPurchase } from "../hooks/useFirstPurshase";
import useFilterWeek from "../hooks/useFilterWeek";
import useFilter12Month from "../hooks/useFilter12Month";
import useFilterYear from "../hooks/useFilterYear";
import Loader from "../../../../components/Loader";
import RefundTable from "../tableStatistic/RefundTable";
import { useTranslation } from "react-i18next";

const Card = styled(MuiCard)(spacing);

const ChartWrapper = styled.div`
  height: 378px;
  width: 100%;
  margin-top: 50px;
`;

function RefundsAccount({ theme }) {
  const { t } = useTranslation();
  const isMobile = useMediaQuery("(min-width:600px)");
  const selectedValue = useSelector(selectOptionState);
  const dispatch = useDispatch();
  const purshaseValue = useSelector(purshaseState);
  const menuOptions = OptionsStatistics();
  const dataOfLabels = useSetLabels();
  const currentDate = new Date();
  const refundPurshase = useRefundPurchase(purshaseValue.refundDate);

  const handleSelectChange = (e) => {
    const newValue = e.target.value;
    const selectedOption = menuOptions.find(
      (option) => option.value === newValue
    );
    if (selectedOption) {
      dispatch(
        setRefund({
          option: newValue,
          date: currentDateAndLastYearDate(newValue, currentDate),
        })
      );
    }
  };
  const weeklyDateDates = dataOfLabels.weeklyDates.map((date) =>
    date.slice(0, 10)
  );
  const last12MonthsDate = dataOfLabels.last12MonthsDates();
  const dataDates = refundPurshase?.data?.map((item) =>
    item.orderedAt?.slice(0, 10)
  );
  const filteredMonthlyCounts = useFilter12Month(
    last12MonthsDate,
    refundPurshase?.data
  );
  const filteredYearly = useFilterYear(
    dataOfLabels.dateYearly,
    refundPurshase.data
  );
  const filteredWeeklyCounts = useFilterWeek(weeklyDateDates, dataDates);
  // get data 1 week and 12 month last year
  const lastedWeekPurchase = useRefundPurchase(dataOfLabels.last1Week);
  const lastedMonthPurchase = useRefundPurchase({
    startDate: last12MonthsDate[1].endDate,
    endDate: last12MonthsDate[1].startDate,
  });
  const currentMonth = useRefundPurchase({
    startDate: last12MonthsDate[0].endDate,
    endDate: last12MonthsDate[0].startDate,
  });
  const lastedyearPurchase = useRefundPurchase(dataOfLabels.dateFullYearly[1]);
  const currentyearPurchase = useRefundPurchase(dataOfLabels.dateFullYearly[0]);

  let datasetEvents;
  let labels;
  let subtitle;
  let totalCurrentAmount;
  let totalLastAmount;
  if (purshaseValue.refund === "weekly") {
    subtitle = t("_weekly_earning_overview");
    labels = dataOfLabels.weekly;
    datasetEvents = filteredWeeklyCounts;
    totalLastAmount = lastedWeekPurchase?.data
      ? lastedWeekPurchase?.data?.reduce(
          (sum, amount) => sum + amount.amount,
          0
        )
      : 0;
    totalCurrentAmount = refundPurshase?.data
      ? refundPurshase?.data?.reduce((sum, amount) => sum + amount.amount, 0)
      : 0;
  } else if (purshaseValue.refund === "monthly") {
    subtitle = t("_monthly_earning_overview");
    labels = dataOfLabels.monthly(12);
    datasetEvents = filteredMonthlyCounts;
    totalLastAmount = lastedMonthPurchase?.data
      ? lastedMonthPurchase?.data?.reduce(
          (sum, amount) => sum + amount.amount,
          0
        )
      : 0;
    totalCurrentAmount = currentMonth?.data
      ? currentMonth?.data?.reduce((sum, amount) => sum + amount.amount, 0)
      : 0;
  } else {
    labels = dataOfLabels.yearly(5);
    subtitle = t("_yearly_earning_overview");
    datasetEvents = filteredYearly;
    totalLastAmount = lastedyearPurchase?.data
      ? lastedyearPurchase?.data?.reduce(
          (sum, amount) => sum + amount.amount,
          0
        )
      : 0;
    totalCurrentAmount = currentyearPurchase?.data
      ? currentyearPurchase?.data?.reduce(
          (sum, amount) => sum + amount.amount,
          0
        )
      : 0;
  }
  const totalMoney = refundPurshase?.data?.reduce(
    (sum, amount) => sum + amount.amount,
    0
  );
  const percentChange =
    ((totalCurrentAmount - totalLastAmount) /
      Math.abs(totalLastAmount ? totalLastAmount : 1)) *
    100;

  const roundedPercentChange = Number.isInteger(percentChange)
    ? percentChange.toFixed(0)
    : percentChange.toFixed(2);
  const dataMax = Array.isArray(datasetEvents)
    ? Math.max(...datasetEvents.map((value) => Number(value)))
    : null;

  const data = {
    labels: labels,
    datasets: [
      {
        label: t("_refund_account"),
        fill: true,
        backgroundColor: function (context) {
          const chart = context.chart;
          const { ctx, chartArea } = chart;

          if (!chartArea) {
            return null;
          }

          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, alpha(theme.palette.primary.main, 1));
          gradient.addColorStop(1, alpha(theme.palette.primary.main, 0.0975));

          return gradient;
        },

        borderColor: theme.palette.primary.main,
        hoverBackgroundColor: theme.palette.primary.main,
        hoverBorderColor: theme.palette.primary.main,
        pointStyle: false,
        tension: 0,
        showLine: true,
        data: datasetEvents,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        border: {
          dash: [5, 5],
          color: "transparent",
        },

        stacked: true,
        ticks: {
          display: false,
        },
        grid: {
          display: true,
          color: "#DBDADE",
        },
        min: 0,
        max: dataMax,
      },

      x: {
        border: {
          color: "transparent",
        },
        stacked: false,
        grid: {
          display: false,
        },
        ticks: {
          fontColor: theme.palette.text.secondary,
        },
      },
    },
  };

  return (
    <Card
      mb={6}
      sx={{
        height: isMobile ? "700px" : "600px",
        boxShadow: (theme) => theme.baseShadow.secondary,
      }}
    >
      <CardHeader
        title={t("_refund_account")}
        subheader={`${
          selectedValue.toggle !== "grid"
            ? subtitle
            : t("_total") +
              " " +
              (selectedValue.refreshing ? "..." : refundPurshase?.data?.length)
        } `}
        action={
          <Sections
            selectedValue={purshaseValue.refund}
            dispatch={handleSelectChange}
          />
        }
      />
      {refundPurshase?.data?.length === undefined ||
      selectedValue.refreshing ? (
        <Card
          sx={{
            height: isMobile ? "650px" : "600px",
            boxShadow: (theme) => theme.baseShadow.secondary,
          }}
        >
          <Loader />
        </Card>
      ) : (
        <CardContent sx={{ mt: selectedValue.toggle == "grid" ? 0 : 10 }}>
          {selectedValue.toggle !== "grid" && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 4,
              }}
            >
              <Box sx={{ display: "flex" }}>
                <Typography
                  component={Box}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "rgba(23, 118, 107, 0.08)",
                    height: "40px",
                    width: "40px",
                    borderRadius: "6px",
                  }}
                >
                  <TbCurrencyDollar size={22} style={{ color: "#17766B" }} />
                </Typography>
                <Box sx={{ display: "block", marginLeft: "10px" }}>
                  <Typography variant="h6" component="h6">
                    {totalMoney ? formattedAmount(totalMoney) : ""}
                  </Typography>
                  <Typography
                    variant="p"
                    sx={{ color: (theme) => theme.palette.secondaryTheme.main }}
                  >
                    {t("_total_earning")}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="h6" component="h6" sx={{ color: "#28C76F" }}>
                {roundedPercentChange >= 0
                  ? `+${formatePercentString(roundedPercentChange)}`
                  : `${formatePercentString(roundedPercentChange)}`}
              </Typography>
            </Box>
          )}
          <ChartWrapper>
            {selectedValue.toggle !== "grid" ? (
              <Line data={data} options={options} />
            ) : (
              <RefundTable />
            )}
          </ChartWrapper>
        </CardContent>
      )}
    </Card>
  );
}
export default withTheme(RefundsAccount);
