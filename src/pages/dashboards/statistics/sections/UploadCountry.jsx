import { withTheme } from "@emotion/react";
import styled from "@emotion/styled";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Paper,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { alpha } from "@mui/system";
import React from "react";
import { Doughnut } from "react-chartjs-2";
import { useTranslation } from "react-i18next";
import { GoDotFill } from "react-icons/go";
import { useDispatch, useSelector } from "react-redux";
import {
  currentDateAndLastYearDate,
  formatePercentString,
  formateViews,
} from "../../../../functions";
import * as Icon from "../../../../icons/icons";
import { selectOptionState } from "../../../../redux/slices/statistics";
import {
  setUploadCountry,
  uploadDownState,
} from "../../../../redux/slices/uploadDownloadStatistic";
import Sections from "../Sections";
import OptionsStatistics from "../authentication/menu/optionsStatistics";
import useSetLabels from "../hooks/useSetLabels";
import { useUploadCountry } from "../hooks/useUploadStatic";

const CustomLabel = styled("span")(({ theme }) => ({
  color: theme.palette.defaultText.main,
  fontSize: "12px",
  textDecoration: "line-through",
}));
const DoughnutInner = styled.div`
  width: 100%;
  position: absolute;
  top: ${(props) => (props.isMobile ? "30%" : "35%")};
  left: 0;
  text-align: center;
  z-index: 0;
`;

const UploadCountryContainer = styled("div")(({ theme, ...props }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
}));

function UploadCountry({ theme }) {
  const { t } = useTranslation();
  const twoFAColor = theme.palette.primary.main;
  const totalColor = alpha(theme.palette.primary.main, 0.2);
  const isMobile = useMediaQuery("(min-width:600px)");
  const selectedValue = useSelector(selectOptionState);
  const uploadDownValue = useSelector(uploadDownState);
  const menuOptions = OptionsStatistics();
  const dataOfLabels = useSetLabels();
  const dispatch = useDispatch();

  const uploadCountryData = useUploadCountry(
    uploadDownValue?.uploadCountryDate
  );
  const currentDate = new Date();

  const handleSelectChange = (e) => {
    const newValue = e.target.value;
    const selectedOption = menuOptions.find(
      (option) => option.value === newValue
    );

    if (selectedOption) {
      dispatch(
        setUploadCountry({
          contry: newValue,
          date: currentDateAndLastYearDate(newValue, currentDate),
        })
      );
    }
  };
  const [selected, setSelected] = React.useState("TH");
  const handleChange = (value) => {
    setSelected((prevSelected) => (prevSelected === value ? null : value));
  };

  const filterCountry = uploadCountryData.data?.filter(
    (item) => item.country && item.country.name !== null
  );

  const countryCountMap = {};
  filterCountry?.forEach((item) => {
    const country = item.country.name;
    countryCountMap[country] = (countryCountMap[country] || 0) + 1;
  });

  if (countryCountMap[selected] !== undefined) {
    countryCountMap[selected] = "";
  }
  const sortedCountryCountArray = Object.entries(countryCountMap).sort(
    (a, b) => b[1] - a[1]
  );

  const dataSet = sortedCountryCountArray
    .slice(0, 5)
    .map(([country, count]) => count);

  const last12MonthsDate = dataOfLabels.last12MonthsDates();
  // get last data
  const uploadLastedWeeked = useUploadCountry(dataOfLabels.last4Weeks[1]);
  const uploadLastedMonth = useUploadCountry({
    startDate: last12MonthsDate[1].endDate,
    endDate: last12MonthsDate[1].startDate,
  });
  const uploadLastedYear = useUploadCountry(dataOfLabels.dateFullYearly[1]);
  const lastesWeeklyCount = uploadLastedWeeked.data?.filter(
    (item) => item.country && item.country.name !== null
  );
  const lastesMonth = uploadLastedMonth.data?.filter(
    (item) => item.country && item.country.name !== null
  );
  const lastesYear = uploadLastedYear.data?.filter(
    (item) => item.country && item.country.name !== null
  );

  let totalLastAmount = 0;
  if (uploadDownValue.uploadCountry === "weekly") {
    totalLastAmount = lastesWeeklyCount?.length;
  } else if (uploadDownValue.uploadCountry === "monthly") {
    totalLastAmount = lastesMonth?.length;
  } else {
    totalLastAmount = lastesYear?.length;
  }
  let percentChange = 0;
  if (filterCountry?.length !== undefined) {
    percentChange =
      ((filterCountry?.length - totalLastAmount) /
        Math.abs(totalLastAmount > 0 ? totalLastAmount : 1)) *
      100;
  }

  const gradientColor = "#459189";
  const gradientColor1 = "#74ADA6";
  const gradientColor2 = "#A2C8C4";
  const gradientColor3 = alpha(theme.palette.primary.main, 0.2);

  const countryLabel = [
    {
      value: "",
      title: "",
      bg: gradientColor,
    },
    {
      value: "",
      title: "",
      bg: gradientColor1,
    },
    {
      value: "",
      title: "",
      bg: gradientColor2,
    },
    {
      value: "",
      title: "",
      bg: gradientColor3,
    },
  ];

  sortedCountryCountArray
    .slice(0, countryLabel.length)
    .forEach(([country, count], index) => {
      if (index < countryLabel.length) {
        const percentage = (count / filterCountry.length) * percentChange;
        countryLabel[index].title = country;
        countryLabel[index].value = country;
        countryLabel[index].count = count;
        countryLabel[index].percentage = percentage.toFixed(1) + "%";
      }
    });

  const data = {
    labels: countryLabel?.map((country) => country.title),
    datasets: [
      {
        label: "Count",
        data: dataSet,
        backgroundColor: [
          twoFAColor,
          gradientColor,
          gradientColor1,
          gradientColor2,
          gradientColor3,
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],

        borderWidth: 0,
      },
    ],
  };
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.label || "";
            if (label) {
              label += ": ";
            }
            label += formateViews(context.parsed);
            return label;
          },
        },
      },
    },
    cutout: "75%",
  };
  return (
    <div>
      <Card
        sx={{
          // height: isMobile ? "650px" : "600px",
          boxShadow: (theme) => theme.baseShadow.secondary,
        }}
      >
        <CardHeader
          title={t("_upload_country")}
          action={
            <Sections
              selectedValue={uploadDownValue.uploadCountry}
              dispatch={handleSelectChange}
            />
          }
        />
        {selectedValue.toggle !== "grid" ? (
          <CardContent
            sx={{
              margin: "40px 30px",
              position: "relative",
              color: theme.palette.customeText.main,
            }}
          >
            {filterCountry && filterCountry?.length !== undefined && (
              <DoughnutInner>
                <Typography
                  variant="h4"
                  sx={{ color: theme.palette.customeText.main }}
                >
                  {filterCountry?.length}
                  <span style={{ color: "#28C76F", fontSize: "12px" }}>
                    &nbsp;
                    {percentChange > 1
                      ? `+${formatePercentString(percentChange)}`
                      : `${formatePercentString(percentChange)}`}
                  </span>
                </Typography>
                <Typography variant="p">Total</Typography>
              </DoughnutInner>
            )}

            <Doughnut data={data} options={options} redraw />
            <Card sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
              <CardContent
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  rowGap: "10px",
                  width: "80%",
                }}
              >
                {countryLabel?.map((item, index) => {
                  if (item.value) {
                    return (
                      <Box
                        component={Paper}
                        sx={{
                          display: "flex",
                          justifyContent: "start",
                          alignItems: "center",
                          cursor: "pointer",
                        }}
                        key={index}
                        value={item.value}
                        onClick={() => handleChange(item.value)}
                      >
                        <GoDotFill size={18} style={{ color: item.bg }} />
                        {selected === item.value ? (
                          <CustomLabel>{item.title}</CustomLabel>
                        ) : (
                          <Typography variant="p">{item.title}</Typography>
                        )}
                      </Box>
                    );
                  }
                })}
              </CardContent>
            </Card>
          </CardContent>
        ) : (
          <Card>
            {selectedValue.toggle !== "list" && (
              <Box sx={{ display: "flex", m: "0 18px" }}>
                <Typography variant="h6" component="h6">
                  {filterCountry?.length}
                </Typography>
                <Typography
                  variant="p"
                  sx={{
                    color: percentChange > 0 ? "#28C76F" : "#EA5455",
                    fontSize: "12px",
                    mt: 1,
                  }}
                >
                  &nbsp;
                  {percentChange > 1
                    ? `+${formatePercentString(percentChange)}`
                    : `${formatePercentString(percentChange)}`}
                </Typography>
              </Box>
            )}
            <CardContent>
              {countryLabel.map((item) => {
                if (item.value) {
                  return (
                    <UploadCountryContainer>
                      <Box
                        sx={{
                          display: "flex",
                          mb: 2,
                          columnGap: 3,
                          width: "100%",
                        }}
                        key={item.value}
                      >
                        <Typography
                          component="div"
                          sx={{
                            fontSize: "2rem",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Icon.ClockIcon />
                        </Typography>
                        <Typography
                          component="div"
                          sx={{
                            display: "flex",
                            flexGrow: 1,
                            flexDirection: "column",
                          }}
                        >
                          <Typography
                            component="span"
                            sx={{
                              fontWeight: 600,
                              fontSize: "14px",
                              color: "#5D596C",
                            }}
                          >
                            {item.count}
                          </Typography>
                          <Typography
                            component="span"
                            sx={{
                              fontSize: "12px",
                              color: "#A5A3AE",
                            }}
                          >
                            {item.value}
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
                          <Typography
                            component="div"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              color:
                                parseFloat(item.percentage?.replace("%", "")) >
                                0
                                  ? "#28C76F"
                                  : "#EA5455",
                            }}
                          >
                            {parseFloat(item.percentage?.replace("%", "")) >
                            0 ? (
                              <Icon.IoIosArrowUpIcon />
                            ) : (
                              <Icon.IoIosArrowDownIcon />
                            )}
                          </Typography>
                          <Typography
                            component="span"
                            sx={{
                              color:
                                parseFloat(item.percentage?.replace("%", "")) >
                                0
                                  ? "#28C76F"
                                  : "#EA5455",
                              fontSize: "14px",
                            }}
                          >
                            {item.percentage}
                          </Typography>
                        </Typography>
                      </Box>
                    </UploadCountryContainer>
                  );
                }
              })}
            </CardContent>
          </Card>
        )}
      </Card>
    </div>
  );
}

export default withTheme(UploadCountry);
