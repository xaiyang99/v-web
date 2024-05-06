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
  setCoupon,
} from "../../../../redux/slices/generalStatistics";
import { selectOptionState } from "../../../../redux/slices/statistics";
import Sections from "../Sections";
import OptionsStatistics from "../authentication/menu/optionsStatistics";
import useCoupon from "../hooks/useCoupon";
import useFilter12Month from "../hooks/useFilter12Month";
import useFilterWeek from "../hooks/useFilterWeek";
import useFilterYear from "../hooks/useFilterYear";
import useGeneralData from "../hooks/useGeneralData";
import useGeneralOption from "../hooks/useGeneralOption";
import useSetLabels from "../hooks/useSetLabels";
import CouponTable from "../tableStatistic/CouponTable";
import React from "react";
import { useTranslation } from "react-i18next";
const Card = styled(MuiCard)(spacing);

const ChartWrapper = styled.div`
  height: "450px";
  width: 100%;
`;

function CouponChart({ theme }) {
  const { t } = useTranslation();
  const isMobile = useMediaQuery("(min-width:600px)");
  const generalValue = useSelector(generalState);
  const selectedValue = useSelector(selectOptionState);
  const dispatch = useDispatch();
  const menuOptions = OptionsStatistics();
  const dataOfLabels = useSetLabels();
  const couponData = useCoupon(generalValue.couponDate);
  const currentDate = new Date();
  const handleSelectChange = (e) => {
    const newValue = e.target.value;
    const selectedOption = menuOptions.find(
      (option) => option.value === newValue
    );
    if (selectedOption) {
      dispatch(
        setCoupon({
          coupon: newValue,
          date: currentDateAndLastYearDate(newValue, currentDate),
        })
      );
    }
  };
  React.useEffect(() => {
    if (selectedValue.refreshing) {
      couponData.customCoupon();
    }
  }, [selectedValue.refreshing]);
  const dataDates = couponData?.data?.map((item) =>
    item.createdAt?.slice(0, 10)
  );
  const weeklyDateDates = dataOfLabels.weeklyDates.map((date) =>
    date.slice(0, 10)
  );
  const last12MonthsDate = dataOfLabels.last12MonthsDates();
  const filteredWeeklyCounts = useFilterWeek(weeklyDateDates, dataDates);
  const filteredMonthlyCounts = useFilter12Month(
    last12MonthsDate,
    couponData?.data
  );
  const filteredYearly = useFilterYear(
    dataOfLabels.dateYearly,
    couponData.data
  );

  let datasetEvents;
  let labels;
  let subtitle;
  if (generalValue.coupon === "weekly") {
    subtitle = t("_weekly_earning_overview");
    datasetEvents = filteredWeeklyCounts;
    labels = dataOfLabels.weekly;
  } else if (generalValue.coupon === "monthly") {
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
  const maxArray = Array.isArray(datasetEvents)
    ? Math.max(...datasetEvents.map((value) => Number(value)))
    : null;
  const minArray = Array.isArray(datasetEvents)
    ? Math.min(...datasetEvents?.map((value) => value))
    : null;
  const title = t("_coupon");
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
          title={t("_coupon")}
          subheader={`${
            selectedValue.toggle !== "grid"
              ? subtitle
              : t("_total") + " " + couponData?.data?.length
          }`}
          action={
            selectedValue.toggle !== "grid" && (
              <Sections
                selectedValue={generalValue.coupon}
                dispatch={handleSelectChange}
              />
            )
          }
        />
        {couponData?.data?.length === undefined || selectedValue.refreshing ? (
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
              <Box sx={{ display: "block", marginLeft: "10px", mb: 2 }}>
                <Typography variant="h6" component="h6">
                  {formateViews(dataMax)}
                </Typography>
                <Typography
                  variant="p"
                  sx={{
                    color: (theme) => theme.palette.secondaryTheme.main,
                  }}
                >
                  {t("_active_title")}
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
                <CouponTable />
              )}
            </ChartWrapper>
          </CardContent>
        )}
      </Card>
    </div>
  );
}

export default withTheme(CouponChart);
