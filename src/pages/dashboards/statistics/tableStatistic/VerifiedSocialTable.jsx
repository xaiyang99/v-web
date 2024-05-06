import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { DateRangePicker } from "rsuite";
import PaginationStyled from "../../../../components/PaginationStyled";
import { formateViews } from "../../../../functions";
import { selectOptionState } from "../../../../redux/slices/statistics";
import useUserSignup from "../hooks/useUserSignup";
import monthName from "./MonthName";
import { useTranslation } from "react-i18next";
function VerifiedSocialTable(props) {
  const { t } = useTranslation();
  const selectedValue = useSelector(selectOptionState);
  const [currentPage, setCurrentPage] = useState(1);
  const [value, setValue] = React.useState({
    startDate: null,
    endDate: null,
  });
  const verifiedUser = useUserSignup(
    value?.startDate ? value : selectedValue.optionSocialSignupDate
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
  const filteredEvents = verifiedUser?.data?.filter((data) => {
    return data?.provider !== "normal";
  });

  const monthNames = monthName();
  const rowsByDate = filteredEvents?.reduce((acc, row) => {
    const createdAtDate = new Date(row?.createdAt);

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
    Object.entries(rowsByDate)?.map(([date, rows]) => ({
      date,
      rows,
      length: rows?.length ?? 0,
      google: rows?.reduce(
        (count, row) => count + (row.provider === "google" ? 1 : 0),
        0
      ),
      github: rows?.reduce(
        (count, row) => count + (row.provider === "github" ? 1 : 0),
        0
      ),
      facebook: rows?.reduce(
        (count, row) => count + (row.provider === "facebook" ? 1 : 0),
        0
      ),
    }));

  const totalGoogleUsers = rowsWithLength?.reduce(
    (total, item) => total + item.google,
    0
  );
  const totalGithubUsers = rowsWithLength?.reduce(
    (total, item) => total + item.github,
    0
  );
  const totalFacebookUsers = rowsWithLength?.reduce(
    (total, item) => total + item.facebook,
    0
  );

  const customLocale = {
    ok: "Save",
  };
  const customRange = [
    {
      label: "Last 7 Days",
      value: [
        new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
        new Date(),
      ],
    },
    {
      label: "Last 30 Days",
      value: [
        new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000),
        new Date(),
      ],
    },
  ];
  const columns = [
    t("_no"),
    t("_google"),
    t("_github"),
    t("_facebook"),
    t("_date"),
  ];
  const ITEM_PER_PAGE = 10;
  const indexOfLastItem = currentPage * ITEM_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEM_PER_PAGE;
  const currentItems = rowsWithLength?.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(rowsWithLength?.length / ITEM_PER_PAGE);
  return (
    <div>
      {props.userLabel?.map((item, index) => (
        <Box sx={{ display: "flex" }} key={index}>
          <Box sx={{ width: "80px" }}>
            <Typography variant="p">{item.value}</Typography>
          </Box>
          <Box>
            <Typography variant="p" sx={{ ml: 4 }}>
              {item.value === "Google"
                ? totalGoogleUsers
                : item.value === "GitHub"
                ? totalGithubUsers
                : totalFacebookUsers}
              {" user"}
            </Typography>
          </Box>
        </Box>
      ))}
      <Box sx={{ display: "block", mb: 3, mt: 3 }}>
        <Typography
          variant="h6"
          component="h6"
          sx={{ fontSize: "14px", mb: 3 }}
        >
          {t("_date_period")}:
        </Typography>

        <DateRangePicker
          locale={customLocale}
          ranges={customRange}
          size="sm"
          onChange={handleDateRangeChange}
        />
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 450 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              {columns?.map((column, index) => (
                <TableCell key={index} align="left">
                  {column}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {currentItems?.map((row, index) => {
              const uniqueRowId = index + 1 + (currentPage - 1) * ITEM_PER_PAGE;
              return (
                <TableRow
                  key={index}
                  sx={{
                    "&:last-child td, &:last-child th": {
                      border: 0,
                    },
                  }}
                >
                  <TableCell component="th" scope="row">
                    {uniqueRowId}
                  </TableCell>
                  <TableCell align="left">
                    {formateViews(row?.google)}
                  </TableCell>
                  <TableCell align="left">
                    {formateViews(row?.github)}
                  </TableCell>
                  <TableCell align="left">
                    {formateViews(row?.facebook)}
                  </TableCell>
                  <TableCell align="left">{row?.date}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {rowsWithLength?.length > ITEM_PER_PAGE && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: (theme) => theme.spacing(5),
            }}
          >
            <Box sx={{}}>
              Showing {ITEM_PER_PAGE} to {totalPages} of&nbsp;
              {currentPage} entries
            </Box>
            <Box>
              <PaginationStyled
                currentPage={currentPage}
                total={totalPages}
                setCurrentPage={setCurrentPage}
              />
            </Box>
          </Box>
        )}
      </TableContainer>
    </div>
  );
}

export default VerifiedSocialTable;
