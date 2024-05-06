import React from "react";
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
import { useSelector } from "react-redux";
import { purshaseState } from "../../../../redux/slices/purshareStatistic";
import { useTotalPurchase } from "../hooks/useFirstPurshase";
import DateRange from "./DateRange";
import monthName from "./MonthName";
import { formateViews } from "../../../../functions";
import PaginationStyled from "../../../../components/PaginationStyled";
import { useTranslation } from "react-i18next";

function TotalPurshaseTable(props) {
  const { t } = useTranslation();
  const purshaseValue = useSelector(purshaseState);
  const [value, setValue] = React.useState({
    startDate: null,
    endDate: null,
  });
  const [currentPage, setCurrentPage] = React.useState(1);
  const totalPurchase = useTotalPurchase(
    value?.startDate ? value : purshaseValue.totalPurshaseDate
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
  const columns = [
    t("_no"),
    t("_free_package"),
    t("_pro_package"),
    t("_premium_package"),
    t("_date"),
  ];
  const monthNames = monthName();
  const rowsByDate = totalPurchase?.data?.reduce((acc, row) => {
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
      free: rows?.reduce(
        (count, row) => count + (row.packageId.category === "free" ? 1 : 0),
        0
      ),
      pro: rows?.reduce(
        (count, row) => count + (row.packageId.category === "pro" ? 1 : 0),
        0
      ),
      premium: rows?.reduce(
        (count, row) => count + (row.packageId.category === "premium" ? 1 : 0),
        0
      ),
    }));

  const totalFreeUsers = rowsWithLength?.reduce(
    (total, item) => total + item.free,
    0
  );
  const totalProUsers = rowsWithLength?.reduce(
    (total, item) => total + item.pro,
    0
  );
  const totalPremiumUsers = rowsWithLength?.reduce(
    (total, item) => total + item.premium,
    0
  );

  const ITEM_PER_PAGE = 10;
  const indexOfLastItem = currentPage * ITEM_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEM_PER_PAGE;
  const currentItems = rowsWithLength?.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(rowsWithLength?.length / ITEM_PER_PAGE);
  return (
    <div>
      {props.purchaseLabel?.map((item, index) => (
        <Box sx={{ ml: 4, display: "flex" }} key={index}>
          <Box sx={{ width: "80px" }}>
            <Typography variant="p">{item.value}</Typography>
          </Box>
          <Box>
            <Typography variant="p" sx={{ ml: 4 }}>
              {item.value === "Free"
                ? totalFreeUsers
                : item.value === "Pro"
                ? totalProUsers
                : totalPremiumUsers}
              {" user"}
            </Typography>
          </Box>
        </Box>
      ))}
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
                  <TableCell align="left">{formateViews(row?.free)}</TableCell>
                  <TableCell align="left">{formateViews(row?.pro)}</TableCell>
                  <TableCell align="left">
                    {formateViews(row?.premium)}
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

export default TotalPurshaseTable;
