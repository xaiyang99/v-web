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
import React from "react";
import { Bar } from "react-chartjs-2";
import { GoDotFill } from "react-icons/go";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../../../components/Loader";
import {
  currentDateAndLastYearDate,
  formatePercentString,
  formateViews,
} from "../../../../functions";
import {
  selectOptionState,
  setOptionSocialSignup,
  setOptionSocialSignupDate,
} from "../../../../redux/slices/statistics";
import Sections from "../Sections";
import OptionsStatistics from "../authentication/menu/optionsStatistics";
import useFilter12Month from "../hooks/useFilter12Month";
import useFilterWeek from "../hooks/useFilterWeek";
import useFilterYear from "../hooks/useFilterYear";
import useSetLabels from "../hooks/useSetLabels";
import useUserSignup from "../hooks/useUserSignup";
import VerifiedSocialTable from "../tableStatistic/VerifiedSocialTable";
import { useTranslation } from "react-i18next";
const Card = styled(MuiCard)(spacing);

const ChartWrapper = styled.div`
  width: 100%;
`;

const ChartPaperStatistic = styled("div")({
  width: "100%",
});

const CustomLabel = styled("span")(({ theme }) => ({
  color: theme.palette.defaultText.main,
  fontSize: "12px",
  textDecoration: "line-through",
}));

const VerifiedSignupSocial = ({ theme }) => {
  const { t } = useTranslation();
  const isMobile = useMediaQuery("(min-width:600px)");
  const googleColor = theme.palette.primary.main;
  const gitHubColor = theme.palette.orangeTheme.main;
  const facebookColor = theme.palette.blueTheme.main;
  const selectedValue = useSelector(selectOptionState);
  const dispatch = useDispatch();
  const menuOptions = OptionsStatistics();
  const activeUser = useUserSignup(selectedValue.optionSocialSignupDate);
  const dataOfLabels = useSetLabels();
  const currentDate = new Date();
  const handleSelectChange = (e) => {
    const newValue = e.target.value;
    const selectedOption = menuOptions.find(
      (option) => option.value === newValue
    );
    if (selectedOption) {
      dispatch(setOptionSocialSignup(newValue));
      dispatch(
        setOptionSocialSignupDate(
          currentDateAndLastYearDate(newValue, currentDate)
        )
      );
    }
  };
  const last12MonthsDate = dataOfLabels.last12MonthsDates();
  const [selected, setSelected] = React.useState(null);
  const handleChange = (value) => {
    setSelected((prevSelected) => (prevSelected === value ? null : value));
  };

  // filter provider signup
  const filterDataByProvider = (data, provider) => {
    return data?.filter((item) => item.provider === provider);
  };
  const filteredGoogle = filterDataByProvider(activeUser?.data, "google");
  const filteredGithub = filterDataByProvider(activeUser?.data, "github");
  const filteredFacebook = filterDataByProvider(activeUser?.data, "facebook");
  // get last week month year for calculator percent
  const lastedWeek = useUserSignup(dataOfLabels.last1Week);
  const lastedMonth = useUserSignup({
    startDate: last12MonthsDate[1].endDate,
    endDate: last12MonthsDate[1].startDate,
  });
  const currentMonth = useUserSignup({
    startDate: last12MonthsDate[0].endDate,
    endDate: last12MonthsDate[0].startDate,
  });
  const lastedYear = useUserSignup(dataOfLabels.dateFullYearly[1]);
  const currentYear = useUserSignup(dataOfLabels.dateFullYearly[0]);

  // filter without provider normal
  const lastedWeekProvider =
    lastedWeek?.data &&
    lastedWeek?.data?.filter((data) => data.provider !== "normal");
  const lastedMonthProvider =
    lastedMonth?.data &&
    lastedMonth?.data?.filter((data) => data.provider !== "normal");
  const currentMonthProvider =
    currentMonth?.data &&
    currentMonth?.data?.filter((data) => data.provider !== "normal");
  const currentYearProvider =
    currentYear?.data &&
    currentYear?.data?.filter((data) => data.prover !== "normal");
  const LastYearProvider =
    lastedYear?.data &&
    lastedYear?.data?.filter((data) => data.prover !== "normal");
  // check same formate date weekly
  const dataGoogleDates = filteredGoogle?.map((item) =>
    item.createdAt?.slice(0, 10)
  );
  const dataGithubDates = filteredGithub?.map((item) =>
    item.createdAt?.slice(0, 10)
  );
  const dataFacebookDates = filteredFacebook?.map((item) =>
    item.createdAt?.slice(0, 10)
  );
  const weeklyDateDates = dataOfLabels.weeklyDates.map((date) =>
    date.slice(0, 10)
  );

  const userLabel = [
    {
      value: t("_google"),
      bg: googleColor,
      total: filteredGoogle?.length || 0,
    },
    {
      value: t("_github"),
      bg: gitHubColor,
      total: filteredGithub?.length || 0,
    },
    {
      value: t("_facebook"),
      bg: facebookColor,
      total: filteredFacebook?.length || 0,
    },
  ];
  // use function get data 7 day of week
  const filteredWeeklyGoogleCounts = useFilterWeek(
    weeklyDateDates,
    dataGoogleDates
  );
  const filteredWeeklyGithubCounts = useFilterWeek(
    weeklyDateDates,
    dataGithubDates
  );
  const filteredWeeklyFacebookCounts = useFilterWeek(
    weeklyDateDates,
    dataFacebookDates
  );

  // filter social 12 month
  const filteredGoogle12Month = useFilter12Month(
    last12MonthsDate,
    filteredGoogle
  );
  const filteredGithub12Month = useFilter12Month(
    last12MonthsDate,
    filteredGithub
  );
  const filteredFacebook12Month = useFilter12Month(
    last12MonthsDate,
    filteredFacebook
  );
  // filter year
  const filteredGoogleYear = useFilterYear(
    dataOfLabels.dateYearly,
    filteredGoogle
  );
  const filteredGithubYear = useFilterYear(
    dataOfLabels.dateYearly,
    filteredGithub
  );
  const filteredFacebookYear = useFilterYear(
    dataOfLabels.dateYearly,
    filteredFacebook
  );

  let datasetGoogleEvents;
  let datasetGithubEvents;
  let datasetFacebookEvents;
  let labels;
  let totalCurrentLenth;
  let totalLastLength;

  if (selectedValue.optionSocialSignup === "weekly") {
    labels = dataOfLabels.weekly;
    datasetGoogleEvents = filteredWeeklyGoogleCounts;
    datasetGithubEvents = filteredWeeklyGithubCounts;
    datasetFacebookEvents = filteredWeeklyFacebookCounts;
    totalLastLength = lastedWeekProvider?.length;
    totalCurrentLenth =
      filteredFacebook?.length +
      filteredGoogle?.length +
      filteredGithub?.length;
  } else if (selectedValue.optionSocialSignup === "monthly") {
    labels = dataOfLabels.monthly(12);
    datasetGoogleEvents = filteredGoogle12Month;
    datasetGithubEvents = filteredGithub12Month;
    datasetFacebookEvents = filteredFacebook12Month;
    totalCurrentLenth = currentMonthProvider?.length;
    totalLastLength = lastedMonthProvider?.length;
  } else {
    labels = dataOfLabels.yearly(5);
    datasetGoogleEvents = filteredGoogleYear;
    datasetGithubEvents = filteredGithubYear;
    datasetFacebookEvents = filteredFacebookYear;
    totalCurrentLenth = currentYearProvider?.length;
    totalLastLength = LastYearProvider?.length;
  }
  const maxFacebook = Math?.max(...datasetFacebookEvents?.map(Number));
  const maxGithub = Math?.max(...datasetGithubEvents?.map(Number));
  const maxGoogle = Math?.max(...datasetGoogleEvents?.map(Number));

  const percentChange =
    ((totalCurrentLenth - totalLastLength) /
      Math.abs(totalLastLength ? totalLastLength : 1)) *
    100;
  const roundedPercentChange = Number.isInteger(percentChange)
    ? percentChange.toFixed(0)
    : percentChange.toFixed(2);

  const data = {
    labels: labels,
    datasets: [
      {
        label: userLabel[2].value,
        backgroundColor: facebookColor,
        borderColor: facebookColor,
        hoverBackgroundColor: facebookColor,
        hoverBorderColor: facebookColor,
        data:
          selected === userLabel[2].value ?? selectedValue.refreshing
            ? 0
            : datasetFacebookEvents,
        barPercentage: 0.4,
        categoryPercentage: 0.4,
        borderRadius: 4,
      },
      {
        label: userLabel[0].value,
        backgroundColor: googleColor,
        borderColor: googleColor,
        hoverBackgroundColor: googleColor,
        hoverBorderColor: googleColor,
        data:
          selected === userLabel[0].value ?? selectedValue.refreshing
            ? 0
            : datasetGoogleEvents,
        barPercentage: 0.4,
        categoryPercentage: 0.4,
        borderRadius: 4,
      },
      {
        label: userLabel[1].value,
        backgroundColor: gitHubColor,
        borderColor: gitHubColor,
        hoverBackgroundColor: gitHubColor,
        hoverBorderColor: gitHubColor,
        data:
          selected === userLabel[1].value ?? selectedValue.refreshing
            ? 0
            : datasetGithubEvents || 0,
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
        max: maxFacebook + maxGithub + maxGoogle ?? 100,
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
        height: isMobile ? "750px" : "700px",
      }}
    >
      <ChartPaperStatistic>
        <CardHeader
          title={t("_verify_sign_up_statistic")}
          subheader={
            selectedValue.toggle !== "grid" &&
            (roundedPercentChange == "NaN"
              ? 0
              : roundedPercentChange >= 0
              ? `+${formatePercentString(roundedPercentChange)} increase in ${
                  selectedValue.optionSocialSignup
                }`
              : `${formatePercentString(roundedPercentChange)} increase in ${
                  selectedValue.optionSocialSignup
                }`)
          }
          action={
            selectedValue.toggle !== "grid" && (
              <Sections
                selectedValue={selectedValue.optionSocialSignup}
                dispatch={handleSelectChange}
              />
            )
          }
        />
        {activeUser?.data?.length === undefined || selectedValue.refreshing ? (
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
                          user?.value === "Facebook"
                            ? filteredFacebook?.length
                            : user?.value === "Google"
                            ? filteredGoogle?.length
                            : filteredGithub?.length
                        } user`
                      )}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}

            <ChartWrapper>
              {selectedValue?.toggle !== "grid" ? (
                <Box>
                  <Bar
                    data={data}
                    options={options}
                    height={isMobile ? 150 : 420}
                  />
                </Box>
              ) : (
                <Box>
                  <VerifiedSocialTable userLabel={userLabel} />
                </Box>
              )}
            </ChartWrapper>
          </CardContent>
        )}
      </ChartPaperStatistic>
    </Card>
  );
};

export default withTheme(VerifiedSignupSocial);
