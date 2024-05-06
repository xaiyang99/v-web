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
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../../../components/Loader";
import {
  currentDateAndLastYearDate,
  formateViews,
} from "../../../../functions";
import { selectOptionState } from "../../../../redux/slices/statistics";
import {
  setUploadFailed,
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
import { useTranslation } from "react-i18next";
import { useUploadFailed } from "../hooks/useUploadStatic";
import DateRange from "../tableStatistic/DateRange";
import monthName from "../tableStatistic/MonthName";
import UploadTable from "../tableStatistic/UploadTable";
const ChartWrapper = styled.div`
  width: 100%;
`;

function UploadFailed({ theme }) {
  const { t } = useTranslation();
  const isMobile = useMediaQuery("(min-width:600px)");
  const selectedValue = useSelector(selectOptionState);
  const uploadDownValue = useSelector(uploadDownState);
  const menuOptions = OptionsStatistics();
  const dataOfLabels = useSetLabels();
  const dispatch = useDispatch();
  const currentDate = new Date();
  const [value, setValue] = React.useState({
    startDate: null,
    endDate: null,
  });
  const uploadFailedData = useUploadFailed(
    value?.startDate ? value : uploadDownValue?.uploadFailDate
  );
  const handleSelectChange = (e) => {
    const newValue = e.target.value;
    const selectedOption = menuOptions.find(
      (option) => option.value === newValue
    );
    if (selectedOption) {
      dispatch(
        setUploadFailed({
          failed: newValue,
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
  const calculateTotalSize = (data) => {
    if (data && Array.isArray(data)) {
      let totalSize = 0;
      data.forEach((item) => {
        const descData = JSON.parse(item.description);
        if (descData) {
          totalSize += parseInt(descData?.size) || 0;
        }
      });
      return totalSize;
    } else {
      return 0;
    }
  };
  const totalSize = calculateTotalSize(uploadFailedData?.data);

  const weeklyDateDates = dataOfLabels.weeklyDates.map((date) =>
    date.slice(0, 10)
  );

  const last12MonthsDate = dataOfLabels.last12MonthsDates();
  const dataDates = uploadFailedData?.data?.map((item) =>
    item.createdAt?.slice(0, 10)
  );

  const filteredWeekly = useFilterWeek(weeklyDateDates, dataDates);
  const filteredMonthly = useFilter12Month(
    last12MonthsDate,
    uploadFailedData?.data
  );
  const filteredYearly = useFilterYear(
    dataOfLabels.dateYearly,
    uploadFailedData.data
  );
  let labels;
  let datasetEvents;

  if (uploadDownValue.uploadFailed === "weekly") {
    labels = dataOfLabels.weekly;
    datasetEvents = filteredWeekly;
  } else if (uploadDownValue.uploadFailed === "monthly") {
    labels = dataOfLabels.monthly(12);
    datasetEvents = filteredMonthly;
  } else {
    labels = dataOfLabels.yearly(5);
    datasetEvents = filteredYearly;
  }
  const nonZeroValues = Array.isArray(datasetEvents)
    ? datasetEvents.filter((value) => value !== 0)
    : [];
  const dataMax = Array.isArray(datasetEvents)
    ? Math.max(...datasetEvents.map((value) => Number(value)))
    : null;

  const minValue = Array.isArray(nonZeroValues)
    ? Math.min(...nonZeroValues.map((value) => Number(value)))
    : null;
  const maxValue = dataMax + (minValue < dataMax ? minValue : 0);
  const customeTheme = "#EA5455";
  const themeFont = theme.palette.text.secondary;
  const title = "Upload fail";
  const data = useUploadDownloadData({
    customeTheme,
    labels,
    title,
    datasetEvents,
  });

  const options = useUploadDownloadOption({ maxValue, themeFont });
  const columns = ["ID", "Upload failed", "Date"];
  const monthNames = monthName();
  const rowsByDate = uploadFailedData?.data?.reduce((acc, row) => {
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
      length: +rows.reduce((sum, row) => {
        const descData = JSON.parse(row.description);
        return sum + Number(descData.size);
      }, 0),
    }));
  const totalSumLength = rowsWithLength
    ? rowsWithLength.reduce((total, entry) => total + entry.length, 0)
    : 0;

  return (
    <div>
      <Card
        sx={{
          height: isMobile ? "650px" : "600px",
          boxShadow: (theme) => theme.baseShadow.secondary,
        }}
      >
        <CardHeader
          title={t("_upload_failed")}
          subheader={`${
            selectedValue.toggle === "grid"
              ? "Total " + formateViews(totalSumLength)
              : ""
          }`}
          action={
            selectedValue.toggle !== "grid" && (
              <Sections
                selectedValue={uploadDownValue.uploadFailed}
                dispatch={handleSelectChange}
              />
            )
          }
        />
        {uploadFailedData?.data?.length === undefined ||
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
            {selectedValue.toggle !== "grid" && (
              <CardContent>
                {uploadFailedData?.data?.length && (
                  <Box sx={{ display: "block", marginLeft: "10px" }}>
                    <Typography variant="h6" component="h6">
                      {formateViews(totalSize ?? 0)}
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
            )}
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

export default withTheme(UploadFailed);
