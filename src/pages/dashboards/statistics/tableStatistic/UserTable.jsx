import { Box, Typography } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import "rsuite/dist/rsuite.min.css";
import { selectOptionState } from "../../../../redux/slices/statistics";
import useNewUser from "../hooks/useNewUser";
import useUserActive from "../hooks/useUserActive";
import DateRange from "./DateRange";
import monthName from "./MonthName";
import StatisticTableCustom from "./StatisticTableCustom";
import "./customDateRangePicker.css";
import { useTranslation } from "react-i18next";

function UserTable(props) {
  const { t } = useTranslation();
  const [value, setValue] = React.useState({ startDate: null, endDate: null });
  const selectedValue = useSelector(selectOptionState);

  const activeUser = useUserActive(
    value?.startDate ? value : selectedValue.optionValueDate
  );

  const newUser = useNewUser(
    value?.startDate ? value : selectedValue.optionValueDate
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

  // combined between active user and new user to same array
  const combinedData = [];

  activeUser?.data?.forEach((active) => {
    const matchingNewUser = newUser?.data?.find(
      (newUserItem) => newUserItem.createdAt === active.createdAt
    );
    if (matchingNewUser) {
      // If a matching new user is found, merge the data
      combinedData.push({ ...active, ...matchingNewUser });
    } else {
      // If no matching new user is found, add only the active user
      combinedData.push(active);
    }
  });

  // Add any remaining new users that don't have a matching active user
  newUser?.data?.forEach((newUserItem) => {
    const hasMatchingActiveUser = activeUser?.data?.some(
      (active) => active.createdAt === newUserItem.createdAt
    );
    if (!hasMatchingActiveUser) {
      combinedData.push(newUserItem);
    }
  });
  const monthNames = monthName();
  const columns = [t("_no"), t("_active_user"), t("_new_user"), t("_date")];
  // reduce data between active use and new user to  get length
  const rowsByDate = combinedData.reduce((acc, row) => {
    const createdAtDate = new Date(row.createdAt);
    const formattedDate = ` ${createdAtDate.getDate()} ${
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
    Object.entries(rowsByDate).map(([date, rows]) => ({
      date,
      rows,
      length: rows?.length ?? 0,
      activeUser: rows.reduce((count, row) => count + (!row.name ? 0 : 1), 0),
      newUser: rows.reduce((count, row) => count + (row.name ? 0 : 1), 0),
    }));
  const newUsers = rowsWithLength?.reduce(
    (total, item) => total + item.newUser,
    0
  );
  const activeUsers = rowsWithLength?.reduce(
    (total, item) => total + item.activeUser,
    0
  );

  return (
    <div>
      {props.userLabel?.map((item, index) => (
        <Box sx={{ ml: 4, display: "flex" }} key={index}>
          <Box sx={{ width: "80px" }}>
            <Typography variant="p">{item.value}</Typography>
          </Box>
          <Box>
            <Typography variant="p" sx={{ ml: 4 }}>
              {item.value == "Active user" ? activeUsers : newUsers}
              {" user"}
            </Typography>
          </Box>
        </Box>
      ))}
      <Box sx={{ ml: 4, display: "flex" }}>
        <Box sx={{ width: "80px" }}>
          <Typography variant="p">{t("_all_user")}</Typography>
        </Box>
        <Box>
          <Typography variant="p" sx={{ ml: 4 }}>
            {activeUsers + newUsers} user
          </Typography>
        </Box>
      </Box>
      <Box sx={{ display: "block", mb: 3, mt: 3 }}>
        <Typography
          variant="h6"
          component="h6"
          sx={{ fontSize: "14px", mb: 3 }}
        >
          {t("_date_period")}:
        </Typography>

        <DateRange onChange={handleDateRangeChange} />
      </Box>
      <StatisticTableCustom rows={rowsWithLength} column={columns} />
    </div>
  );
}

export default UserTable;
