import { withTheme } from "@emotion/react";
import styled from "@emotion/styled";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Bar } from "react-chartjs-2";
import { TbCurrencyDollar } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../../../components/Loader";
import {
  currentDateAndLastYearDate,
  formatePercentString,
  formateViews,
  formattedAmount,
} from "../../../../functions";
import {
  purshaseState,
  setRebills,
} from "../../../../redux/slices/purshareStatistic";
import { selectOptionState } from "../../../../redux/slices/statistics";
import Sections from "../Sections";
import OptionsStatistics from "../authentication/menu/optionsStatistics";
import useFilter12Month from "../hooks/useFilter12Month";
import useFilterWeek from "../hooks/useFilterWeek";
import useFilterYear from "../hooks/useFilterYear";
import { useRebillsPurchase } from "../hooks/useFirstPurshase";
import useSetLabels from "../hooks/useSetLabels";
import RebillTable from "../tableStatistic/RebillTable";
import { useTranslation } from "react-i18next";
const ChartWrapper = styled.div`
  width: 100%;
`;

function RebillsAccount({ theme }) {
  const { t } = useTranslation();
  const isMobile = useMediaQuery("(min-width:600px)");
  const purshaseValue = useSelector(purshaseState);
  const selectedValue = useSelector(selectOptionState);
  const menuOptions = OptionsStatistics();
  const dataOfLabels = useSetLabels();
  const rebillPurshase = useRebillsPurchase(purshaseValue.rebillsDate);
  const dispatch = useDispatch();
  const currentDate = new Date();
  const handleSelectChange = (e) => {
    const newValue = e.target.value;
    const selectedOption = menuOptions.find(
      (option) => option.value === newValue
    );
    if (selectedOption) {
      dispatch(
        setRebills({
          rebills: newValue,
          date: currentDateAndLastYearDate(newValue, currentDate),
        })
      );
    }
  };

  const weeklyDateDates = dataOfLabels.weeklyDates.map((date) =>
    date.slice(0, 10)
  );
  const dataDates = rebillPurshase?.data?.map((item) =>
    item.orderedAt?.slice(0, 10)
  );
  const last12MonthsDate = dataOfLabels.last12MonthsDates();
  const filteredWeeklyCounts = useFilterWeek(weeklyDateDates, dataDates);
  const filteredMonthlyCounts = useFilter12Month(
    last12MonthsDate,
    rebillPurshase?.data
  );

  const filteredYearCounts = useFilterYear(
    dataOfLabels.dateYearly,
    rebillPurshase?.data
  );

  // get data 1 week and 12 month last year
  const lastedWeekPurchase = useRebillsPurchase(dataOfLabels.last1Week);
  const lastedMonthPurchase = useRebillsPurchase({
    startDate: last12MonthsDate[1].endDate,
    endDate: last12MonthsDate[1].startDate,
  });
  const currentMonth = useRebillsPurchase({
    startDate: last12MonthsDate[0].endDate,
    endDate: last12MonthsDate[0].startDate,
  });
  const lastedyearPurchase = useRebillsPurchase(dataOfLabels.dateFullYearly[1]);
  const currentyearPurchase = useRebillsPurchase(
    dataOfLabels.dateFullYearly[0]
  );
  let datasetEvents;
  let labels;
  let subtitle;
  let totalCurrentAmount;
  let totalLastAmount;
  if (purshaseValue.rebills === "weekly") {
    labels = dataOfLabels.weekly;
    datasetEvents = filteredWeeklyCounts;
    totalLastAmount = lastedWeekPurchase?.data
      ? lastedWeekPurchase?.data?.reduce(
          (sum, amount) => sum + amount.amount,
          0
        )
      : 0;
    totalCurrentAmount = rebillPurshase?.data
      ? rebillPurshase?.data?.reduce((sum, amount) => sum + amount.amount, 0)
      : 0;
    subtitle = t("_weekly_earning_overview");
  } else if (purshaseValue.rebills === "monthly") {
    labels = dataOfLabels.monthly(12);
    subtitle = t("_monthly_earning_overview");
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
    datasetEvents = filteredYearCounts;
    subtitle = t("_yearly_earning_overview");
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
  const totalMoney = rebillPurshase?.data?.reduce(
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
        label: t("_rebill_account"),
        backgroundColor: theme.palette.primaryTheme.main,
        borderColor: theme.palette.primaryTheme.main,
        hoverBackgroundColor: theme.palette.primaryTheme.main,
        hoverBorderColor: theme.palette.primaryTheme.main,
        data: datasetEvents,
        barPercentage: 0.4,
        categoryPercentage: 0.8,
        borderRadius: 4,
      },
    ],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
      },
    },

    scales: {
      y: {
        grid: {
          display: true,
          color: "#DBDADE",
        },
        border: {
          dash: [5, 5],
          color: "transparent",
        },

        stacked: true,
        ticks: {
          count: 8,
          autoSkip: false,
          fontColor: theme.palette.text.secondary,
          callback: (value) => formateViews(Math?.round(value)),
        },
        beginAtZero: true,
        min: 0,
        max: dataMax,
      },

      x: {
        beginAtZero: true,
        stacked: true,
        grid: {
          border: {
            dash: [5, 5],
            color: "transparent",
          },
          display: true,
          color: "transparent",
        },

        ticks: {
          fontColor: theme.palette.text.secondary,
        },
      },
    },
  };
  return (
    <div>
      <Card
        sx={{
          height: isMobile ? "650px" : "600px",
          boxShadow: (theme) => theme.baseShadow.secondary,
        }}
      >
        <CardHeader
          title={t("_rebill_account")}
          subheader={`${
            selectedValue.toggle !== "grid"
              ? subtitle
              : t("_total") +
                " " +
                (selectedValue.refreshing
                  ? "..."
                  : rebillPurshase?.data?.length)
          } `}
          action={
            selectedValue.toggle !== "grid" && (
              <Sections
                selectedValue={purshaseValue.rebills}
                dispatch={handleSelectChange}
              />
            )
          }
        />
        {rebillPurshase?.data?.length === undefined ||
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
          <CardContent>
            {selectedValue.toggle !== "grid" && (
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}
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
                      {formattedAmount(totalMoney)}
                    </Typography>
                    <Typography
                      variant="p"
                      sx={{
                        color: (theme) => theme.palette.secondaryTheme.main,
                      }}
                    >
                      {t("_total_earning")}
                    </Typography>
                  </Box>
                </Box>
                <Typography
                  variant="h6"
                  component="h6"
                  sx={{ color: "#28C76F" }}
                >
                  {roundedPercentChange >= 0
                    ? `+${formatePercentString(roundedPercentChange)}`
                    : `${formatePercentString(roundedPercentChange)}`}
                </Typography>
              </Box>
            )}
            <ChartWrapper>
              {selectedValue.toggle !== "grid" ? (
                <Bar
                  data={data}
                  options={options}
                  height={isMobile ? 150 : 400}
                />
              ) : (
                <RebillTable />
              )}
            </ChartWrapper>
          </CardContent>
        )}
      </Card>
    </div>
  );
}

export default withTheme(RebillsAccount);
