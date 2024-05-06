import { withTheme } from "@emotion/react";
import styled from "@emotion/styled";
import {
  Box,
  CardContent,
  CardHeader,
  Card as MuiCard,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { spacing } from "@mui/system";
import React, { useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { GoDotFill } from "react-icons/go";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../../../components/Loader";
import {
  currentDateAndLastYearDate,
  formateViews,
} from "../../../../functions";
import {
  selectOptionState,
  setOptionUserStatic,
  setOptionValueDate,
} from "../../../../redux/slices/statistics";
import Sections from "../Sections";
import OptionsStatistics from "../authentication/menu/optionsStatistics";
import useAllUser from "../hooks/useAllUser";
import useFilter12Month from "../hooks/useFilter12Month";
import useFilterWeek from "../hooks/useFilterWeek";
import useFilterYear from "../hooks/useFilterYear";
import useNewUser from "../hooks/useNewUser";
import useSetLabels from "../hooks/useSetLabels";
import useUserActive from "../hooks/useUserActive";
import UserTable from "../tableStatistic/UserTable";
import { useTranslation } from "react-i18next";
const Card = styled(MuiCard)(spacing);

const ChartWrapper = styled.div`
  width: 100%;
`;

const CustomLabel = styled("span")(({ theme }) => ({
  color: theme.palette.defaultText.main,
  fontSize: "12px",
  textDecoration: "line-through",
}));

const BarChart = ({ theme }) => {
  const { t } = useTranslation();
  const isMobile = useMediaQuery("(min-width:600px)");
  const activeUserColor = theme.palette.primary.main;
  const newUserColor = theme.palette.orangeTheme.main;
  const selectedValue = useSelector(selectOptionState);
  const dispatch = useDispatch();
  const menuOptions = OptionsStatistics();
  const activeUser = useUserActive(selectedValue.optionValueDate);
  const dataOfLabels = useSetLabels();
  const totalUser = useAllUser();
  const newUser = useNewUser(selectedValue.optionValueDate);
  const currentDate = new Date();
  const handleSelectChange = (e) => {
    const newValue = e.target.value;
    const selectedOption = menuOptions.find(
      (option) => option.value === newValue
    );
    if (selectedOption) {
      dispatch(setOptionUserStatic(newValue));
      dispatch(
        setOptionValueDate(currentDateAndLastYearDate(newValue, currentDate))
      );
    }
  };

  const [selected, setSelected] = React.useState(null);
  const handleChange = (value) => {
    setSelected((prevSelected) => (prevSelected === value ? null : value));
  };
  useEffect(() => {
    totalUser.customTotalUsers();
    newUser.customTotalUsers();
    activeUser.customUserActive();
  }, [selectedValue.refreshing]);

  // check same formate date weekly
  const dataDates = activeUser?.data?.map((item) =>
    item.createdAt?.slice(0, 10)
  );
  const newUserWeekdataDates = newUser?.data?.map((item) =>
    item.createdAt?.slice(0, 10)
  );
  const weeklyDateDates = dataOfLabels.weeklyDates.map((date) =>
    date.slice(0, 10)
  );
  const last12MonthsDate = dataOfLabels.last12MonthsDates();
  const userLabel = [
    {
      value: t("_active_user"),
      bg: activeUserColor,
      total: activeUser?.total || 0,
    },
    {
      value: t("_new_user"),
      bg: newUserColor,
      total: newUser?.total || 0,
    },
  ];
  // use function get data 7 day of week
  const filteredWeeklyCounts = useFilterWeek(weeklyDateDates, dataDates);
  const filteredNewUserWeeklyCounts = useFilterWeek(
    weeklyDateDates,
    newUserWeekdataDates
  );

  // use function get data 12 month of year
  const filteredMonthlyCounts = useFilter12Month(
    last12MonthsDate,
    activeUser?.data
  );
  const filteredNewUserMonthlyCounts = useFilter12Month(
    last12MonthsDate,
    newUser?.data
  );
  const filteredYearCounts = useFilterYear(
    dataOfLabels.dateYearly,
    activeUser?.data
  );
  const useFilterOfYear = useFilterYear(dataOfLabels.dateYearly, newUser.data);

  let datasetEvents;
  let datasetNewUser;
  let labels;

  if (selectedValue.optionUserStatic === "weekly") {
    labels = dataOfLabels.weekly;
    datasetEvents = filteredWeeklyCounts;
    datasetNewUser = filteredNewUserWeeklyCounts;
  } else if (selectedValue.optionUserStatic === "monthly") {
    labels = dataOfLabels.monthly(12);
    datasetEvents = filteredMonthlyCounts;
    datasetNewUser = filteredNewUserMonthlyCounts;
  } else {
    labels = dataOfLabels.yearly(5);
    datasetEvents = filteredYearCounts;
    datasetNewUser = useFilterOfYear;
  }

  // function get maxValue
  const maxValueActiveUser = Math?.max(...datasetEvents?.map(Number));
  const maxNewUser = Math?.max(...datasetNewUser?.map(Number));
  const data = {
    labels: labels,
    datasets: [
      {
        label: userLabel[1].value,
        backgroundColor: newUserColor,
        borderColor: newUserColor,
        hoverBackgroundColor: newUserColor,
        hoverBorderColor: newUserColor,
        data:
          selected === userLabel[1].value || selectedValue.refreshing
            ? 0
            : datasetNewUser,
        barPercentage: 0.4,
        categoryPercentage: 0.4,
        borderRadius: 4,
      },
      {
        label: userLabel[0].value,
        backgroundColor: activeUserColor,
        borderColor: activeUserColor,
        hoverBackgroundColor: activeUserColor,
        hoverBorderColor: activeUserColor,
        data:
          selected === userLabel[0].value || selectedValue.refreshing
            ? 0
            : datasetEvents,
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
        max: maxNewUser + maxValueActiveUser ?? 100,
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
        height: isMobile ? "650px" : "600px",
        boxShadow: (theme) => theme.baseShadow.secondary,
      }}
    >
      <CardHeader
        title={t("_user_statistic")}
        subheader={`${t("_total_user_statistic")} ${totalUser?.total} ${t(
          "_user"
        )}`}
        action={
          selectedValue.toggle !== "grid" && (
            <Sections
              selectedValue={selectedValue.optionUserStatic}
              dispatch={handleSelectChange}
            />
          )
        }
      />
      {(activeUser?.data?.length === undefined &&
        newUser?.data?.length === undefined) ||
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
            <Box sx={{ display: "block", mb: 4 }}>
              {userLabel?.map((user) => (
                <Box
                  key={user.value}
                  sx={{ display: "flex", cursor: "pointer" }}
                  value={user.value}
                  onClick={() => handleChange(user.value)}
                >
                  <Box>
                    <GoDotFill size={18} style={{ color: user.bg }} />
                  </Box>
                  <Typography variant="body">
                    {selected === user.value ? (
                      <CustomLabel>{user.value} user</CustomLabel>
                    ) : (
                      `${user.value} ${
                        selectedValue.refreshing ? 0 : user?.total
                      } ${t("_user")}`
                    )}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
          <ChartWrapper>
            {selectedValue?.toggle === "grid" ? (
              <UserTable userLabel={userLabel} />
            ) : (
              <Bar
                data={data}
                options={options}
                height={isMobile ? 180 : 400}
              />
            )}
          </ChartWrapper>
        </CardContent>
      )}
    </Card>
  );
};

export default withTheme(BarChart);
