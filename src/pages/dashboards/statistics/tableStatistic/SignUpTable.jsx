import { Box, Typography } from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import PaginationStyled from "../../../../components/PaginationStyled";
import { formateViews } from "../../../../functions";
import { selectOptionState } from "../../../../redux/slices/statistics";
import useUserSignup from "../hooks/useUserSignup";
import DateRange from "./DateRange";
import monthName from "./MonthName";
import { useTranslation } from "react-i18next";

function SignUpTable() {
  const { t } = useTranslation();
  const selectedValue = useSelector(selectOptionState);
  const [currentPage, setCurrentPage] = useState(1);
  const [value, setValue] = React.useState({
    startDate: null,
    endDate: null,
  });
  const dataUserSignup = useUserSignup(
    value?.startDate ? value : selectedValue.optionSignupDate
  );
  const ITEM_PER_PAGE = 10;
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
  const monthNames = monthName();
  const columns = [t("_no"), t("_sign_up_statistic"), t("_date")];
  const rowsByDate = dataUserSignup?.data?.reduce((acc, row) => {
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
    }));
  const indexOfLastItem = currentPage * ITEM_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEM_PER_PAGE;
  const currentItems = rowsWithLength?.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(rowsWithLength?.length / ITEM_PER_PAGE);

  return (
    <div>
      <Box sx={{ display: "block", mb: 3 }}>
        <Typography
          variant="h6"
          component="h6"
          sx={{ fontSize: "14px", mb: 3 }}
        >
          {t("_date_period")}:
        </Typography>

        <DateRange onChange={handleDateRangeChange} />
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
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {uniqueRowId}
                  </TableCell>
                  <TableCell align="left">
                    {formateViews(row?.length)}
                  </TableCell>
                  <TableCell align="left">{row.date}</TableCell>
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
              Showing {ITEM_PER_PAGE} to {totalPages} of&nbsp;{currentPage}{" "}
              entries
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

export default SignUpTable;
