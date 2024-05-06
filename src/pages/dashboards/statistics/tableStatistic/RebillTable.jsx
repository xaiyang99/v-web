import { Box, Typography } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { purshaseState } from "../../../../redux/slices/purshareStatistic";
import { useRebillsPurchase } from "../hooks/useFirstPurshase";
import monthName from "./MonthName";
import UploadTable from "./UploadTable";
import DateRange from "./DateRange";
import { useTranslation } from "react-i18next";

function RebillTable() {
  const { t } = useTranslation();
  const purshaseValue = useSelector(purshaseState);
  const [value, setValue] = React.useState({
    startDate: null,
    endDate: null,
  });

  const rebillPurshase = useRebillsPurchase(
    value?.startDate ? value : purshaseValue.rebillsDate
  );

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
  const columns = [t("_no"), t("_rebill_account"), t("_date")];
  const monthNames = monthName();
  const rowsByDate =
    rebillPurshase?.data &&
    rebillPurshase?.data?.reduce((acc, row) => {
      const createdAtDate = new Date(row?.orderedAt);

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
      rows,
      length: rows?.length ?? 0,
    }));

  return (
    <div>
      <Box sx={{ display: "block", mb: 3, m: 4 }}>
        <Typography
          variant="h6"
          component="h6"
          sx={{ fontSize: "14px", mb: 3 }}
        >
          {t("_date_period")}:
        </Typography>
        <DateRange onChange={handleDateRangeChange} />
      </Box>
      <UploadTable columns={columns} rows={rowsWithLength} />
    </div>
  );
}

export default RebillTable;
