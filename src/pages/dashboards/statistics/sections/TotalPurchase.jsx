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
import React from "react";
import { Bar } from "react-chartjs-2";
import { GoDotFill } from "react-icons/go";
import { useDispatch, useSelector } from "react-redux";
import {
  currentDateAndLastYearDate,
  formateViews,
  formattedAmount,
} from "../../../../functions";
import {
  purshaseState,
  setTotalPurshase,
} from "../../../../redux/slices/purshareStatistic";
import { selectOptionState } from "../../../../redux/slices/statistics";
import Sections from "../Sections";
import OptionsStatistics from "../authentication/menu/optionsStatistics";
import useSetLabels from "../hooks/useSetLabels";
import { TbCurrencyDollar } from "react-icons/tb";
import { useTotalPurchase } from "../hooks/useFirstPurshase";
import useFilterWeek from "../hooks/useFilterWeek";
import useFilter12Month from "../hooks/useFilter12Month";
import useFilterYear from "../hooks/useFilterYear";
import TotalPurshaseTable from "../tableStatistic/TotalPurshaseTable";
import { useTranslation } from "react-i18next";

const ChartWrapper = styled.div`
  width: 100%;
  margin-top: 10px;
`;

function TotalPurshase({ theme }) {
  const premiumBgColor = "#6ab0a6";
  const proBgColor = "#519189";
  const { t } = useTranslation();
  const freeBgColor = theme.palette.primary.main;
  const isMobile = useMediaQuery("(min-width:600px)");
  const purshaseValue = useSelector(purshaseState);
  const selectedValue = useSelector(selectOptionState);
  const menuOptions = OptionsStatistics();
  const dataOfLabels = useSetLabels();
  const totalPurchase = useTotalPurchase(purshaseValue.totalPurshaseDate);
  const dispatch = useDispatch();
  const currentDate = new Date();
  const handleSelectChange = (e) => {
    const newValue = e.target.value;
    const selectedOption = menuOptions.find(
      (option) => option.value === newValue
    );
    if (selectedOption) {
      dispatch(
        setTotalPurshase({
          option: newValue,
          date: currentDateAndLastYearDate(newValue, currentDate),
        })
      );
    }
  };

  const filterPurchase = (data, category) => {
    return data?.filter((item) => item.packageId.category === category);
  };
  const filteredFree = filterPurchase(totalPurchase?.data, "free");
  const filteredPro = filterPurchase(totalPurchase?.data, "pro");
  const filteredPremium = filterPurchase(totalPurchase?.data, "premium");

  const [selected, setSelected] = React.useState(null);
  const handleChange = (value) => {
    setSelected((prevSelected) => (prevSelected === value ? null : value));
  };
  const purchaseLabel = [
    {
      value: t("_free_package"),
      bg: freeBgColor,
    },
    {
      value: t("_pro_package"),
      bg: proBgColor,
    },
    {
      value: t("_premium_package"),
      bg: premiumBgColor,
    },
  ];
  const weeklyDateDates = dataOfLabels.weeklyDates.map((date) =>
    date.slice(0, 10)
  );
  const dataDates = filteredFree?.map((item) => item.orderedAt?.slice(0, 10));
  const dataProDates = filteredPro?.map((item) => item.orderedAt?.slice(0, 10));
  const dataPremiumDates = filteredPremium?.map((item) =>
    item.orderedAt?.slice(0, 10)
  );
  const last12MonthsDate = dataOfLabels.last12MonthsDates();
  const filteredWeeklyFreeCounts = useFilterWeek(weeklyDateDates, dataDates);
  const filteredWeeklyProCounts = useFilterWeek(weeklyDateDates, dataProDates);
  const premiumCounts = useFilterWeek(weeklyDateDates, dataPremiumDates);
  const monthlyFreeCounts = useFilter12Month(last12MonthsDate, filteredFree);
  const monthlyProCounts = useFilter12Month(last12MonthsDate, filteredPro);
  const monthlyPremiumCounts = useFilter12Month(
    last12MonthsDate,
    filteredPremium
  );
  const yearlyFreeCounts = useFilterYear(dataOfLabels.dateYearly, filteredFree);
  const yearlyProCounts = useFilterYear(dataOfLabels.dateYearly, filteredPro);
  const yearlyPremiumCounts = useFilterYear(
    dataOfLabels.dateYearly,
    filteredPremium
  );

  let datasetFree;
  let datasetPro;
  let datasetPremium;
  let labels;
  let subtitle;
  let freeTotalAmount;
  let proTotalAmount;
  let premiumTotalAmount;
  if (purshaseValue.totalPurshase === "weekly") {
    labels = dataOfLabels.weekly;
    datasetFree = filteredWeeklyFreeCounts;
    datasetPro = filteredWeeklyProCounts;
    datasetPremium = premiumCounts;
    subtitle = t("_weekly_earning_overview");
    freeTotalAmount = filteredFree
      ? filteredFree?.reduce((sum, amount) => sum + amount.amount, 0)
      : 0;
    proTotalAmount = filteredPro
      ? filteredPro?.reduce((sum, amount) => sum + amount.amount, 0)
      : 0;
    premiumTotalAmount = filteredPremium
      ? filteredPremium?.reduce((sum, amount) => sum + amount.amount, 0)
      : 0;
  } else if (purshaseValue.totalPurshase === "monthly") {
    subtitle = t("_monthly_earning_overview");
    labels = dataOfLabels.monthly(12);
    datasetFree = monthlyFreeCounts;
    datasetPro = monthlyProCounts;
    datasetPremium = monthlyPremiumCounts;
    freeTotalAmount = filteredFree
      ? filteredFree?.reduce((sum, amount) => sum + amount.amount, 0)
      : 0;
    proTotalAmount = filteredPro
      ? filteredPro?.reduce((sum, amount) => sum + amount.amount, 0)
      : 0;
    premiumTotalAmount = filteredPremium
      ? filteredPremium?.reduce((sum, amount) => sum + amount.amount, 0)
      : 0;
  } else {
    labels = dataOfLabels.yearly(5);
    subtitle = t("_yearly_earning_overview");
    datasetFree = yearlyFreeCounts;
    datasetPro = yearlyProCounts;
    datasetPremium = yearlyPremiumCounts;
    freeTotalAmount = filteredFree
      ? filteredFree?.reduce((sum, amount) => sum + amount.amount, 0)
      : 0;
    proTotalAmount = filteredPro
      ? filteredPro?.reduce((sum, amount) => sum + amount.amount, 0)
      : 0;
    premiumTotalAmount = filteredPremium
      ? filteredPremium?.reduce((sum, amount) => sum + amount.amount, 0)
      : 0;
  }

  const maxPree = Math?.max(...datasetFree?.map(Number));
  const maxPro = Math?.max(...datasetPro?.map(Number));
  const maxPremium = Math?.max(...datasetPremium?.map(Number));
  const overallMax = Math?.max(maxPro, maxPree, maxPremium);

  const data = {
    labels,
    datasets: [
      {
        label: purchaseLabel[0].value,
        backgroundColor: freeBgColor,
        borderColor: freeBgColor,
        hoverBackgroundColor: freeBgColor,
        hoverBorderColor: freeBgColor,
        data:
          selected === purchaseLabel[0].value || selectedValue.refreshing
            ? 0
            : datasetFree,
        borderRadius: 4,
        barThickness: 25,
      },
      {
        label: purchaseLabel[1].value,
        backgroundColor: proBgColor,
        borderColor: proBgColor,
        hoverBackgroundColor: proBgColor,
        hoverBorderColor: proBgColor,
        data:
          selected === purchaseLabel[1].value || selectedValue.refreshing
            ? 0
            : datasetPro,
        borderRadius: 4,
        barThickness: 25,
      },
      {
        label: purchaseLabel[2].value,
        backgroundColor: premiumBgColor,
        borderColor: premiumBgColor,
        hoverBackgroundColor: premiumBgColor,
        hoverBorderColor: premiumBgColor,
        data:
          selected === purchaseLabel[2].value || selectedValue.refreshing
            ? 0
            : datasetPremium,
        borderRadius: 4,
        barThickness: 25,
      },
    ],
  };
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      scales: {
        y: {
          grid: {
            display: false,
          },
          stacked: false,
          ticks: {
            stepSize: 6,
            fontColor: theme.palette.text.secondary,
            callback: (value) => formateViews(Math?.round(value)),
          },
          min: 0,
          max: overallMax,
        },

        x: {
          stacked: false,
          grid: {
            color: "transparent",
          },
          ticks: {
            fontColor: theme.palette.text.secondary,
          },
        },
      },
    },

    scales: {
      x: {
        grid: {
          display: true,
          color: "transparent",
        },
        border: {
          dash: [5, 5],
          color: "transparent",
        },
      },
      y: {
        grid: {
          display: true,
          color: "#DBDADE",
        },
        border: {
          dash: [5, 5],
          color: "transparent",
        },
      },
    },
  };

  return (
    <div>
      <Card
        sx={{
          height: isMobile ? "700px" : "600px",
          boxShadow: (theme) => theme.baseShadow.secondary,
        }}
      >
        <CardHeader
          title={t("_total_purchase_account")}
          subheader={`${
            selectedValue.toggle !== "grid"
              ? subtitle
              : t("_total") +
                " " +
                (selectedValue.refreshing ? "..." : totalPurchase?.data?.length)
          } `}
          action={
            selectedValue.toggle !== "grid" && (
              <Sections
                selectedValue={purshaseValue.totalPurshase}
                dispatch={handleSelectChange}
              />
            )
          }
        />
        <CardContent>
          {selectedValue.toggle !== "grid" && (
            <>
              {purchaseLabel?.map((option) => (
                <Box key={option.value}>
                  <Box
                    sx={{
                      cursor: "pointer",
                      width: "150px",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                    value={option.value}
                    onClick={() => handleChange(option.value)}
                  >
                    {selected === option.value ? (
                      <>
                        <Box
                          sx={{
                            display: "flex",
                            color: theme.palette.defaultText.main,
                            fontSize: "12px",
                            textDecoration: "line-through",
                          }}
                        >
                          <Box>
                            <GoDotFill size={18} style={{ color: option.bg }} />
                          </Box>
                          <Typography variant="p">{option.value}</Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            color: theme.palette.defaultText.main,
                            fontSize: "12px",
                            textDecoration: "line-through",
                          }}
                        >
                          <Typography variant="p">
                            {option.value === "Free"
                              ? formattedAmount(freeTotalAmount)
                              : option.value === "Pro"
                              ? proTotalAmount
                              : premiumTotalAmount}
                          </Typography>
                          <TbCurrencyDollar
                            size={14}
                            style={{ marginTop: "2px" }}
                          />
                        </Box>
                      </>
                    ) : (
                      <>
                        <Box sx={{ display: "flex" }}>
                          <Box>
                            <GoDotFill size={18} style={{ color: option.bg }} />
                          </Box>
                          <Typography variant="p">{option.value}</Typography>
                        </Box>
                        <Box sx={{ display: "flex" }}>
                          <Typography variant="p">
                            {option.value === "Free"
                              ? freeTotalAmount.toLocaleString("en-US")
                              : option.value === "Pro"
                              ? proTotalAmount.toLocaleString("en-US")
                              : premiumTotalAmount.toLocaleString("en-US")}
                          </Typography>
                          <TbCurrencyDollar
                            size={14}
                            style={{ marginTop: "2px" }}
                          />
                        </Box>
                      </>
                    )}
                  </Box>
                </Box>
              ))}
            </>
          )}

          <ChartWrapper>
            {selectedValue.toggle !== "grid" ? (
              <Bar
                data={data}
                options={options}
                height={isMobile ? 150 : 400}
              />
            ) : (
              <TotalPurshaseTable purchaseLabel={purchaseLabel} />
            )}
          </ChartWrapper>
        </CardContent>
      </Card>
    </div>
  );
}

export default withTheme(TotalPurshase);
