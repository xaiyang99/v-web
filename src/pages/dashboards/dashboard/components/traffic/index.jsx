import { Box, Typography, useTheme } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import * as Icon from "../../../../../icons/icons";
import useManageSignupMostCountries from "../../hooks/useManageSignupMostCountries";
import TrafficItem from "./TrafficItem";

const TrafficContainer = styled("div")(({ theme, ...props }) => ({
  p: {
    height: "auto",
  },
  display: "flex",
  flexDirection: "column",
  backgroundColor: theme.palette.mode === "dark" ? "#fff" : "#fff",
  ...theme.typography.body2,
  textAlign: "left",
  color: theme.palette.text.secondary,
  borderRadius: "8px",
  rowGap: theme.spacing(4),
  height: "100%",
}));

const index = (props) => {
  const { t } = useTranslation();

  const manageSignupMostCountries = useManageSignupMostCountries();

  const reportData = manageSignupMostCountries.data.reports;
  const theme = useTheme();

  return (
    <TrafficContainer>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          rowGap: theme.spacing(0.5),
          fontWeight: 600,
        }}
      >
        <Typography
          sx={{
            typography: "h4",
            fontWeight: 600,
          }}
        >
          {t("_most_signup_country_topic")}
        </Typography>
        <Typography component="span">
          {t("_most_signup_country_title")}
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          rowGap: (theme) => theme.spacing(4),
          justifyContent: "space-between",
        }}
      >
        {reportData.map((data, index) => {
          return (
            <TrafficItem
              name={data._title}
              amount={data.count}
              icon={<Icon.FcGlobeIcon />}
              percent={data.discrepancy}
              key={index}
            />
          );
        })}
      </Box>
    </TrafficContainer>
  );
};

export default index;
