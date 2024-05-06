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
import { currentDateAndLastYearDate } from "../../../../functions";
import * as Icon from "../../../../icons/icons";
import { selectOptionState } from "../../../../redux/slices/statistics";
import {
  setUploadCountry,
  setUploadDevice,
  uploadDownState,
} from "../../../../redux/slices/uploadDownloadStatistic";
import Sections from "../Sections";
import OptionsStatistics from "../authentication/menu/optionsStatistics";
import useSetLabels from "../hooks/useSetLabels";
import { useUploadSuccess } from "../hooks/useUploadStatic";
import {
  BraveBrowser,
  ChromeBrowser,
  DuckgoBrowser,
  EdgeBrowser,
  FireFoxBrowser,
  OperaBrowser,
  SafariBrowser,
  VivalidBrowser,
} from "../../../client-dashboard/account-info/logined/icon";
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

function UploadDevice({ theme }) {
  const { t } = useTranslation();
  const twoFAColor = theme.palette.primary.main;
  const totalColor = alpha(theme.palette.primary.main, 0.2);
  const isMobile = useMediaQuery("(min-width:600px)");
  const selectedValue = useSelector(selectOptionState);
  const uploadDownValue = useSelector(uploadDownState);
  const menuOptions = OptionsStatistics();
  const dataOfLabels = useSetLabels();
  const dispatch = useDispatch();
  const uploadCountryData = useUploadSuccess(uploadDownValue?.uploadDeviceDate);

  const currentDate = new Date();

  const handleSelectChange = (e) => {
    const newValue = e.target.value;
    const selectedOption = menuOptions.find(
      (option) => option.value === newValue
    );
    if (selectedOption) {
      dispatch(
        setUploadDevice({
          device: newValue,
          date: currentDateAndLastYearDate(newValue, currentDate),
        })
      );
    }
  };
  const [selected, setSelected] = React.useState(null);
  const handleChange = (value) => {
    setSelected((prevSelected) => (prevSelected === value ? null : value));
  };

  const filterCountry = uploadCountryData?.data?.map((country) => {
    const descriptionObject = JSON.parse(country.description);
    return descriptionObject;
  });
  const gradientColor = "#459189";
  const gradientColor1 = "#74ADA6";
  const gradientColor2 = "#A2C8C4";
  const gradientColor3 = alpha(theme.palette.primary.main, 0.2);
  const browserIcons = [
    {
      icon: <EdgeBrowser />,
      title: "Edge",
      value: "Edge",
    },
    {
      icon: <ChromeBrowser />,
      title: "Chrome",
      value: "Chrome",
    },
    {
      icon: <FireFoxBrowser />,
      title: "Firefox",
      value: "Firefox",
    },
    {
      icon: <OperaBrowser />,
      title: "Opera",
      value: "Opera",
    },
    {
      icon: <SafariBrowser />,
      title: "Safari",
      value: "Safari",
    },
    {
      icon: <BraveBrowser />,
      title: "Brave",
      value: "Brave",
    },
    {
      icon: <VivalidBrowser />,
      title: "Vivaldi",
      value: "Vivaldi",
    },
    {
      icon: <DuckgoBrowser />,
      title: "DuckDuckGo",
      value: "DuckDuckGo",
    },
  ];

  const data = {
    labels: browserIcons?.map((icon) => icon.title),
    datasets: [
      {
        label: browserIcons?.map((icon) => icon.title),
        data: [12, 19, 3, 5, 2],
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
    },
    cutout: "75%",
  };
  return (
    <div>
      <Card
        sx={{
          boxShadow: (theme) => theme.baseShadow.secondary,
        }}
      >
        <CardHeader
          title={t("_upload_device")}
          action={
            selectedValue.toggle !== "grid" && (
              <Sections
                selectedValue={uploadDownValue.uploadDevice}
                dispatch={handleSelectChange}
              />
            )
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
            <DoughnutInner>
              <Typography
                variant="h4"
                sx={{ color: theme.palette.customeText.main }}
              >
                15,00
                <span style={{ color: "#28C76F", fontSize: "12px" }}>
                  &nbsp;12.24%
                </span>
              </Typography>
              <Typography variant="p">Total</Typography>
            </DoughnutInner>

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
                {browserIcons?.map((item) => (
                  <Box
                    component={Paper}
                    sx={{
                      display: "flex",
                      justifyContent: "start",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                    key={item.value}
                    value={item.value}
                    onClick={() => handleChange(item.value)}
                  >
                    <GoDotFill size={18} style={{ color: item.bg }} />
                    {selected === item.value ? (
                      <CustomLabel>{item.value}</CustomLabel>
                    ) : (
                      <Typography variant="p">{item.title}</Typography>
                    )}
                  </Box>
                ))}
              </CardContent>
            </Card>
          </CardContent>
        ) : (
          <Card>
            {selectedValue.toggle !== "list" && (
              <CardContent>
                <Box sx={{ display: "block", marginLeft: "10px" }}>
                  <Box sx={{ display: "flex" }}>
                    <Typography variant="h6" component="h6">
                      150
                    </Typography>
                    <Typography
                      style={{
                        color: "#28C76F",
                        fontSize: "12px",
                        marginLeft: "10px",
                      }}
                    >
                      &nbsp;12.24%
                    </Typography>
                  </Box>
                  <Typography
                    variant="p"
                    sx={{
                      color: (theme) => theme.palette.secondaryTheme.main,
                    }}
                  >
                    Since of date
                  </Typography>
                </Box>
              </CardContent>
            )}
            <CardContent>
              {browserIcons.map((item) => (
                <UploadCountryContainer>
                  <Box
                    sx={{ display: "flex", mb: 2, columnGap: 3, width: "100%" }}
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
                        12.4k
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
                          color: "#29c770",
                        }}
                      >
                        <Icon.IoIosArrowUpIcon />
                      </Typography>
                      <Typography
                        component="span"
                        sx={{ color: "#29c770", fontSize: "14px" }}
                      >
                        18.6%
                      </Typography>
                    </Typography>
                  </Box>
                </UploadCountryContainer>
              ))}
            </CardContent>
          </Card>
        )}
      </Card>
    </div>
  );
}

export default withTheme(UploadDevice);
