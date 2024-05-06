import { withTheme } from "@emotion/react";
import styled from "@emotion/styled";
import {
  Box,
  CardContent,
  CardHeader,
  Card as MuiCard,
  useMediaQuery,
} from "@mui/material";
import { spacing } from "@mui/system";
import { Bar } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import {
  currentDateAndLastYearDate,
  formateViews,
} from "../../../../functions";
import {
  selectOptionState,
  setOptionSignup,
  setOptionSignupDate,
} from "../../../../redux/slices/statistics";
import Sections from "../Sections";
import OptionsStatistics from "../authentication/menu/optionsStatistics";
import useAllUser from "../hooks/useAllUser";
import useFilter12Month from "../hooks/useFilter12Month";
import useFilterWeek from "../hooks/useFilterWeek";
import useFilterYear from "../hooks/useFilterYear";
import useSetLabels from "../hooks/useSetLabels";
import useUserSignup from "../hooks/useUserSignup";
import SignUpTable from "../tableStatistic/SignUpTable";
import Loader from "../../../../components/Loader";
import { useTranslation } from "react-i18next";
const Card = styled(MuiCard)(spacing);

const ChartWrapper = styled.div`
  width: 100%;
`;

const VerifiedUserSigup = ({ theme }) => {
  const { t } = useTranslation();
  const isMobile = useMediaQuery("(min-width:600px)");
  const activeUserColor = theme.palette.primary.main;
  const selectedValue = useSelector(selectOptionState);
  const dispatch = useDispatch();
  const menuOptions = OptionsStatistics();
  const dataOfLabels = useSetLabels();
  const totalUser = useAllUser();
  const dataUserSignup = useUserSignup(selectedValue.optionSignupDate);
  const currentDate = new Date();
  const handleSelectChange = (e) => {
    const newValue = e.target.value;
    const selectedOption = menuOptions.find(
      (option) => option.value === newValue
    );

    if (selectedOption) {
      dispatch(setOptionSignup(newValue));
      dispatch(
        setOptionSignupDate(currentDateAndLastYearDate(newValue, currentDate))
      );
    }
  };

  // check same formate date weekly
  const filterNormalProvider = dataUserSignup?.data?.filter((item) => {
    return item.provider === "normal";
  });

  const dataDates = filterNormalProvider?.map((item) =>
    item.createdAt?.slice(0, 10)
  );

  const weeklyDateDates = dataOfLabels.weeklyDates.map((date) =>
    date.slice(0, 10)
  );
  const last12MonthsDate = dataOfLabels.last12MonthsDates();
  const userLabel = [
    {
      value: t("_sign_up_statistic"),
      bg: activeUserColor,
      total: dataUserSignup?.total || 0,
    },
  ];
  // use function get data 7 day of week
  const filteredWeeklyCounts = useFilterWeek(weeklyDateDates, dataDates);
  const filteredNewUserMonthlyCounts = useFilter12Month(
    last12MonthsDate,
    dataUserSignup?.data
  );

  const useFilterOfYear = useFilterYear(
    dataOfLabels.dateYearly,
    dataUserSignup.data
  );
  let datasetEvents;
  let labels;

  if (selectedValue.optionSignup === "weekly") {
    labels = dataOfLabels.weekly;
    datasetEvents = filteredWeeklyCounts;
  } else if (selectedValue.optionSignup === "monthly") {
    labels = dataOfLabels.monthly(12);
    datasetEvents = filteredNewUserMonthlyCounts;
  } else {
    labels = dataOfLabels.yearly(5);
    datasetEvents = useFilterOfYear;
  }
  const maxValueSignup = Math?.max(...datasetEvents?.map(Number));
  const data = {
    labels: labels,
    datasets: [
      {
        label: userLabel[0].value,
        backgroundColor: activeUserColor,
        borderColor: activeUserColor,
        hoverBackgroundColor: activeUserColor,
        hoverBorderColor: activeUserColor,
        data: selectedValue.refreshing ? 0 : datasetEvents,
        barPercentage: 0.4,
        categoryPercentage: 0.4,
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
        max: maxValueSignup ?? 100,
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
    <Card
      sx={{
        boxShadow: (theme) => theme.baseShadow.secondary,
        height: isMobile ? "650px" : "600px",
      }}
    >
      <CardHeader
        title={t("_sign_up_statistic")}
        subheader={`${t("_total")} ${
          selectedValue.refreshing ? 0 : totalUser?.total
        } ${t("_user")}`}
        action={
          selectedValue?.toggle !== "grid" && (
            <Sections
              selectedValue={selectedValue.optionSignup}
              dispatch={handleSelectChange}
            />
          )
        }
      />
      {dataUserSignup?.data?.length === undefined ||
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
          <Box sx={{ height: isMobile ? "60px" : "20px" }}></Box>
          <ChartWrapper>
            {selectedValue?.toggle !== "grid" ? (
              <Bar
                data={data}
                options={options}
                height={isMobile ? 150 : 400}
              />
            ) : (
              <SignUpTable />
            )}
          </ChartWrapper>
        </CardContent>
      )}
    </Card>
  );
};

export default withTheme(VerifiedUserSigup);
