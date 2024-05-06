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
import { Line } from "react-chartjs-2";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../../../components/Loader";
import {
  currentDateAndLastYearDate,
  formateViews,
} from "../../../../functions";
import { selectOptionState } from "../../../../redux/slices/statistics";
import {
  setUploadCount,
  uploadDownState,
} from "../../../../redux/slices/uploadDownloadStatistic";
import Sections from "../Sections";
import OptionsStatistics from "../authentication/menu/optionsStatistics";
import useFilter12Month from "../hooks/useFilter12Month";
import useFilterWeek from "../hooks/useFilterWeek";
import useFilterYear from "../hooks/useFilterYear";
import useSetLabels from "../hooks/useSetLabels";
import useUploadDownloadData from "../hooks/useUploadDownloadData";
import useUploadDownloadOption from "../hooks/useUploadDownloadOption";
import { useUploadSize } from "../hooks/useUploadStatic";
import monthName from "../tableStatistic/MonthName";
import DateRange from "../tableStatistic/DateRange";
import UploadTable from "../tableStatistic/UploadTable";
const ChartWrapper = styled.div`
  width: 100%;
`;

function UploadCount({ theme }) {
  const { t } = useTranslation();
  const isMobile = useMediaQuery("(min-width:600px)");
  const selectedValue = useSelector(selectOptionState);
  const uploadDownValue = useSelector(uploadDownState);
  const menuOptions = OptionsStatistics();
  const dataOfLabels = useSetLabels();
  const dispatch = useDispatch();
  const [value, setValue] = React.useState({
    startDate: null,
    endDate: null,
  });
  const uploadSizeData = useUploadSize(
    value?.startDate ? value : uploadDownValue?.uploadCountDate
  );
  const currentDate = new Date();
  const handleSelectChange = (e) => {
    const newValue = e.target.value;
    const selectedOption = menuOptions.find(
      (option) => option.value === newValue
    );
    if (selectedOption) {
      dispatch(
        setUploadCount({
          uploadCount: newValue,
          date: currentDateAndLastYearDate(newValue, currentDate),
        })
      );
    }
  };
  React.useEffect(() => {
    if (selectedValue.toggle === "grid") {
      setValue({ startDate: null, endDate: null });
    }
  }, [selectedValue.toggle]);
  const handleDateRangeChange = (value) => {
    const formattedStartDate = value
      ? value[0]?.toLocaleDateString("en-CA")
      : null;
    const formattedEndDate = value
      ? value[1]?.toLocaleDateString("en-CA")
      : null;
    const isValidDate = value?.every(
      (date) => date instanceof Date && !isNaN(date)
    );
    if (isValidDate) {
      setValue({
        startDate: formattedEndDate ?? null,
        endDate: formattedStartDate ?? null,
      });
    } else {
      setValue({ startDate: null, endDate: null });
    }
  };
  const weeklyDateDates = dataOfLabels.weeklyDates.map((date) =>
    date.slice(0, 10)
  );
  const last12MonthsDate = dataOfLabels.last12MonthsDates();
  const dataDates = uploadSizeData?.data?.map((item) =>
    item.createdAt?.slice(0, 10)
  );

  const filteredWeeklyCounts = useFilterWeek(weeklyDateDates, dataDates);
  const filteredMonthlyCounts = useFilter12Month(
    last12MonthsDate,
    uploadSizeData?.data
  );

  const filteredYearly = useFilterYear(
    dataOfLabels.dateYearly,
    uploadSizeData?.data
  );

  let labels;
  let datasetEvents;
  if (uploadDownValue.uploadCount === "weekly") {
    labels = dataOfLabels.weekly;
    datasetEvents = filteredWeeklyCounts;
  } else if (uploadDownValue.uploadCount === "monthly") {
    labels = dataOfLabels.monthly(12);
    datasetEvents = filteredMonthlyCounts;
  } else {
    labels = dataOfLabels.yearly(5);
    datasetEvents = filteredYearly;
  }

  const dataMax = Array.isArray(datasetEvents)
    ? Math.max(...datasetEvents.map((value) => Number(value)))
    : null;
  const customeTheme = theme.palette.primary.main;
  const themeFont = theme.palette.text.secondary;
  const data = useUploadDownloadData({
    customeTheme,
    labels,
    datasetEvents,
  });
  const options = useUploadDownloadOption({ dataMax, themeFont });
  const columns = ["ID", "Upload count", "Date"];
  const monthNames = monthName();
  const rowsByDate = uploadSizeData?.data?.reduce((acc, row) => {
    const createdAtDate = new Date(row?.createdAt);
    const formattedDate = `${createdAtDate.getDate()} ${
      monthNames[createdAtDate.getMonth()]
    } ${createdAtDate.getFullYear()}`;
    if (!acc[formattedDate]) {
      acc[formattedDate] = [];
    }

    acc[formattedDate]?.push(row);

    return acc;
  }, {});

  const rowsWithLength =
    rowsByDate &&
    Object.entries(rowsByDate)?.map(([date, rows]) => ({
      date,
      length: rows.length,
    }));

  return (
    <div>
      <Card
        sx={{
          height: isMobile ? "650px" : "600px",
          boxShadow: (theme) => theme.baseShadow.secondary,
        }}
      >
        <CardHeader
          title={t("_upload_count")}
          subheader={`${
            selectedValue.toggle === "grid"
              ? t("_total") + " " + formateViews(dataMax)
              : ""
          }`}
          action={
            selectedValue.toggle !== "grid" && (
              <Sections
                selectedValue={uploadDownValue.uploadCount}
                dispatch={handleSelectChange}
              />
            )
          }
        />
        {uploadSizeData?.data?.length === undefined ||
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
          <Box>
            <CardContent>
              {uploadSizeData?.data?.length &&
                selectedValue.toggle !== "grid" && (
                  <Box sx={{ display: "block", marginLeft: "10px" }}>
                    <Typography variant="h6" component="h6">
                      {selectedValue.refreshing ? 0 : formateViews(dataMax)}
                    </Typography>
                    <Typography
                      variant="p"
                      sx={{
                        color: (theme) => theme.palette.secondaryTheme.main,
                      }}
                    >
                      Subsribers Gained
                    </Typography>
                  </Box>
                )}
            </CardContent>
            <ChartWrapper>
              {selectedValue.toggle !== "grid" ? (
                <Line data={data} options={options} height={400} />
              ) : (
                <Box>
                  <Box sx={{ display: "block", mb: 3, m: 4 }}>
                    <Typography
                      variant="h6"
                      component="h6"
                      sx={{ fontSize: "14px", mb: 3 }}
                    >
                      Date period:
                    </Typography>
                    <DateRange onChange={handleDateRangeChange} />
                  </Box>
                  <UploadTable columns={columns} rows={rowsWithLength} />
                </Box>
              )}
            </ChartWrapper>
          </Box>
        )}
      </Card>
    </div>
  );
}

export default withTheme(UploadCount);
