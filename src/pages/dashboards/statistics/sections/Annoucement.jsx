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
import { Line } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import {
  currentDateAndLastYearDate,
  formateViews,
} from "../../../../functions";
import {
  generalState,
  setAnnoucement,
} from "../../../../redux/slices/generalStatistics";
import { selectOptionState } from "../../../../redux/slices/statistics";
import Sections from "../Sections";
import OptionsStatistics from "../authentication/menu/optionsStatistics";
import useAnnoucement from "../hooks/useAnnoucement";
import useFilter12Month from "../hooks/useFilter12Month";
import useFilterWeek from "../hooks/useFilterWeek";
import useFilterYear from "../hooks/useFilterYear";
import useGeneralData from "../hooks/useGeneralData";
import useGeneralOption from "../hooks/useGeneralOption";
import useSetLabels from "../hooks/useSetLabels";
import AnnoucementTable from "../tableStatistic/AnnoucementTable";
import Loader from "../../../../components/Loader";
import React from "react";
import { useTranslation } from "react-i18next";
const Card = styled(MuiCard)(spacing);

const ChartWrapper = styled.div`
  height: "450px";
  width: 100%;
`;

function Annoucement({ theme }) {
  const { t } = useTranslation();
  const isMobile = useMediaQuery("(min-width:600px)");
  const generalValue = useSelector(generalState);
  const selectedValue = useSelector(selectOptionState);
  const dispatch = useDispatch();
  const menuOptions = OptionsStatistics();
  const dataOfLabels = useSetLabels();
  const annoucemenData = useAnnoucement(generalValue.annoucementDate);
  const currentDate = new Date();
  const handleSelectChange = (e) => {
    const newValue = e.target.value;
    const selectedOption = menuOptions.find(
      (option) => option.value === newValue
    );
    if (selectedOption) {
      dispatch(
        setAnnoucement({
          annoucement: newValue,
          date: currentDateAndLastYearDate(newValue, currentDate),
        })
      );
    }
  };
  React.useEffect(() => {
    if (selectedValue.refreshing) {
      annoucemenData.customAnnoucement();
    }
  }, [selectedValue.refreshing]);
  const dataDates = annoucemenData?.data?.map((item) =>
    item.createdAt?.slice(0, 10)
  );
  const weeklyDateDates = dataOfLabels.weeklyDates.map((date) =>
    date.slice(0, 10)
  );
  const last12MonthsDate = dataOfLabels.last12MonthsDates();
  const filteredWeeklyCounts = useFilterWeek(weeklyDateDates, dataDates);
  const filteredMonthlyCounts = useFilter12Month(
    last12MonthsDate,
    annoucemenData?.data
  );
  const filteredYearly = useFilterYear(
    dataOfLabels.dateYearly,
    annoucemenData.data
  );

  let datasetEvents;
  let labels;
  let subtitle;
  if (generalValue.annoucement === "weekly") {
    subtitle = t("_weekly_earning_overview");
    datasetEvents = filteredWeeklyCounts;
    labels = dataOfLabels.weekly;
  } else if (generalValue.annoucement === "monthly") {
    subtitle = t("_monthly_earning_overview");
    labels = dataOfLabels.monthly(12);
    datasetEvents = filteredMonthlyCounts;
  } else {
    labels = dataOfLabels.yearly(5);
    subtitle = t("_yearly_earning_overview");
    datasetEvents = filteredYearly;
  }

  const customTheme = {
    bg: theme.palette.primaryTheme.main,
    color: theme.palette.primaryTheme.contrastText,
    secondaryText: theme.palette.text.secondary,
  };
  const maxArray = Array.isArray(datasetEvents)
    ? Math.max(...datasetEvents.map((value) => Number(value)))
    : null;
  const minArray = Array.isArray(datasetEvents)
    ? Math.min(...datasetEvents?.map((value) => value))
    : null;
  const title = t("_announcement");
  const maxValue = maxArray + minArray;
  const data = useGeneralData({ title, labels, customTheme, datasetEvents });
  const customOptions = useGeneralOption({ customTheme, maxValue });
  const dataMax = Array.isArray(datasetEvents)
    ? Math.max(...datasetEvents.map((value) => Number(value)))
    : null;

  return (
    <div>
      <Card
        sx={{
          height: isMobile ? "650px" : "600px",
          boxShadow: (theme) => theme.baseShadow.secondary,
        }}
      >
        <CardHeader
          title={t("_announcement")}
          subheader={`${
            selectedValue.toggle !== "grid"
              ? subtitle
              : t("_total") + " " + annoucemenData?.data?.length
          }`}
          action={
            selectedValue.toggle !== "grid" && (
              <Sections
                selectedValue={generalValue.annoucement}
                dispatch={handleSelectChange}
              />
            )
          }
        />
        {(annoucemenData?.data?.length === undefined) |
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
              <Box sx={{ display: "block", marginLeft: "10px" }}>
                <Typography variant="h6" component="h6">
                  {formateViews(dataMax)}
                </Typography>
                <Typography
                  variant="p"
                  sx={{
                    color: (theme) => theme.palette.secondaryTheme.main,
                  }}
                >
                  {t("_publish")}
                </Typography>
              </Box>
            )}

            <ChartWrapper>
              {selectedValue.toggle !== "grid" ? (
                <Line
                  data={data}
                  options={customOptions.options}
                  height={400}
                  plugins={[customOptions.myPlugin]}
                />
              ) : (
                <AnnoucementTable />
              )}
            </ChartWrapper>
          </CardContent>
        )}
      </Card>
    </div>
  );
}

export default withTheme(Annoucement);
