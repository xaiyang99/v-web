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
import Loader from "../../../../components/Loader";
import {
  currentDateAndLastYearDate,
  formateViews,
} from "../../../../functions";
import {
  generalState,
  setAdvertising,
} from "../../../../redux/slices/generalStatistics";
import { selectOptionState } from "../../../../redux/slices/statistics";
import Sections from "../Sections";
import OptionsStatistics from "../authentication/menu/optionsStatistics";
import useAdvertisement from "../hooks/useAdvertisement";
import useFilter12Month from "../hooks/useFilter12Month";
import useFilterWeek from "../hooks/useFilterWeek";
import useFilterYear from "../hooks/useFilterYear";
import useGeneralData from "../hooks/useGeneralData";
import useGeneralOption from "../hooks/useGeneralOption";
import useSetLabels from "../hooks/useSetLabels";
import AdertisingTable from "../tableStatistic/AdvertisingTable";
import React from "react";
import { useTranslation } from "react-i18next";
const Card = styled(MuiCard)(spacing);

const ChartWrapper = styled.div`
  height: "450px";
  width: 100%;
`;

function Advertisement({ theme }) {
  const { t } = useTranslation();
  const isMobile = useMediaQuery("(min-width:600px)");
  const generalValue = useSelector(generalState);
  const selectedValue = useSelector(selectOptionState);
  const dispatch = useDispatch();
  const menuOptions = OptionsStatistics();
  const dataOfLabels = useSetLabels();
  const advertisementData = useAdvertisement(generalValue.advertisingDate);
  const currentDate = new Date();
  const handleSelectChange = (e) => {
    const newValue = e.target.value;
    const selectedOption = menuOptions.find(
      (option) => option.value === newValue
    );
    if (selectedOption) {
      dispatch(
        setAdvertising({
          advertising: newValue,
          date: currentDateAndLastYearDate(newValue, currentDate),
        })
      );
    }
  };
  React.useEffect(() => {
    if (selectedValue.refreshing) {
      advertisementData.customeAdvertisement();
    }
  }, [selectedValue.refreshing]);
  const dataDates = advertisementData?.data?.map((item) =>
    item.createdAt?.slice(0, 10)
  );
  const weeklyDateDates = dataOfLabels.weeklyDates.map((date) =>
    date.slice(0, 10)
  );
  const last12MonthsDate = dataOfLabels.last12MonthsDates();
  const filteredWeeklyCounts = useFilterWeek(weeklyDateDates, dataDates);
  const filteredMonthlyCounts = useFilter12Month(
    last12MonthsDate,
    advertisementData?.data
  );
  const filteredYearly = useFilterYear(
    dataOfLabels.dateYearly,
    advertisementData.data
  );

  let datasetEvents;
  let labels;
  let subtitle;
  if (generalValue.advertising === "weekly") {
    subtitle = t("_weekly_earning_overview");
    datasetEvents = filteredWeeklyCounts;
    labels = dataOfLabels.weekly;
  } else if (generalValue.advertising === "monthly") {
    subtitle = t("_monthly_earning_overview");
    labels = dataOfLabels.monthly(12);
    datasetEvents = filteredMonthlyCounts;
  } else {
    labels = dataOfLabels.yearly(5);
    subtitle = t("_yearly_earning_overview");
    datasetEvents = filteredYearly;
  }

  const customTheme = {
    bg: "#FF9F43",
    color: theme.palette.primaryTheme.contrastText,
    secondaryText: theme.palette.text.secondary,
  };
  const nonZeroValues = datasetEvents.filter((value) => value !== 0);
  const maxArray = Array.isArray(datasetEvents)
    ? Math.max(...datasetEvents.map((value) => Number(value)))
    : null;
  const minArray = Array.isArray(nonZeroValues)
    ? Math.min(...nonZeroValues?.map((value) => value))
    : null;
  const title = t("_advertisement");
  const data = useGeneralData({ title, labels, customTheme, datasetEvents });
  const customOptions = useGeneralOption({ customTheme, maxArray });

  return (
    <div>
      <Card
        sx={{
          height: isMobile ? "650px" : "600px",
          boxShadow: (theme) => theme.baseShadow.secondary,
        }}
      >
        <CardHeader
          title={t("_advertisement")}
          subheader={`${
            selectedValue.toggle !== "grid"
              ? subtitle
              : t("_total") + " " + advertisementData?.data?.length
          }`}
          action={
            selectedValue.toggle !== "grid" && (
              <Sections
                selectedValue={generalValue.advertising}
                dispatch={handleSelectChange}
              />
            )
          }
        />
        {advertisementData?.data?.length === undefined ||
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
                  {formateViews(maxArray)}
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
                <AdertisingTable />
              )}
            </ChartWrapper>
          </CardContent>
        )}
      </Card>
    </div>
  );
}

export default withTheme(Advertisement);
