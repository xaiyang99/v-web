import { withTheme } from "@emotion/react";
import styled from "@emotion/styled";
import React, { useState } from "react";
import { Doughnut } from "react-chartjs-2";

import {
  Box,
  CardHeader,
  Card as MuiCard,
  CardContent as MuiCardContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { alpha, spacing } from "@mui/system";
import { GoDotFill } from "react-icons/go";
import { useSelector } from "react-redux";
import Loader from "../../../../components/Loader";
import PaginationStyled from "../../../../components/PaginationStyled";
import { formateViews } from "../../../../functions";
import { selectOptionState } from "../../../../redux/slices/statistics";
import useAllUser from "../hooks/useAllUser";
import useUser2FA from "../hooks/useUser2FA";
import monthName from "../tableStatistic/MonthName";
import { useTranslation } from "react-i18next";

const Card = styled(MuiCard)(spacing);

const CardContent = styled(MuiCardContent)`
  &:last-child {
    padding-bottom: ${(props) => props.theme.spacing(2)};
  }
`;

const ChartWrapper = styled.div`
  position: relative;
`;

const DoughnutInner = styled.div`
  width: 100%;
  position: absolute;
  top: 50%;
  left: 0;
  margin-top: -22px;
  text-align: center;
  z-index: 0;
`;
const CustomLabel = styled("span")(({ theme }) => ({
  color: theme.palette.defaultText.main,
  fontSize: "12px",
  textDecoration: "line-through",
}));

const Doughnut2FA = ({ theme }) => {
  const { t } = useTranslation();
  const twoFAColor = theme.palette.primary.main;
  const totalColor = alpha(theme.palette.primary.main, 0.2);
  const selectedValue = useSelector(selectOptionState);
  const [currentPage, setCurrentPage] = useState(1);
  const activeUser = useAllUser();
  const user2FA = useUser2FA(selectedValue.optionValueDate);
  const isMobile = useMediaQuery("(max-width:600px)");
  const ITEM_PER_PAGE = 10;
  const userLabel = [
    {
      value: "2FA",
      bg: twoFAColor,
      total: user2FA?.total || 0,
    },
    {
      value: "Total",
      bg: totalColor,
      total: activeUser?.total || 0,
    },
  ];
  const [selected, setSelected] = React.useState(null);
  const handleChange = (value) => {
    setSelected((prevSelected) => (prevSelected === value ? null : value));
  };
  const data = {
    labels: [userLabel[0].value, userLabel[1].value],
    datasets: [
      {
        data: [
          selected === userLabel[0]?.value ? 0 : user2FA?.total,
          selected === userLabel[1]?.value ? 0 : activeUser?.total,
        ],
        backgroundColor: [twoFAColor, totalColor],
        borderWidth: 0,
        borderColor: theme.palette.background.paper,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    cutout: "70%",
  };

  const monthNames = monthName();
  const rowsByDate = user2FA?.data?.reduce((acc, row) => {
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
      twoFA: rows.reduce(
        (count, row) => count + (row.twoFactorIsEnabled ? 1 : 0),
        0
      ),
    }));
  // calculator pagination
  const indexOfLastItem = currentPage * ITEM_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEM_PER_PAGE;
  const currentItems = rowsWithLength?.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(rowsWithLength?.length / ITEM_PER_PAGE);

  const subheader = `${((user2FA?.total / activeUser?.total) * 100).toFixed(
    2
  )}% ${t("_increase_two_factor")}`;
  const columns = [t("_no"), t("_2fa"), t("_date")];
  return (
    <Card mb={6} sx={{ height: isMobile ? "400px" : "750px" }}>
      <CardHeader
        title={t("_two_factor_authentication")}
        subheader={subheader}
      />
      {user2FA?.data?.length === undefined || selectedValue.refreshing ? (
        <CardContent
          sx={{
            height: isMobile ? "400px" : "750px",
            boxShadow: (theme) => theme.baseShadow.secondary,
          }}
        >
          <Loader />
        </CardContent>
      ) : (
        <CardContent sx={{ marginBottom: "50px" }}>
          {selectedValue?.toggle !== "grid" && (
            <Box sx={{ display: "block", mb: 4 }}>
              {userLabel?.map((user) => (
                <Box
                  key={user.value}
                  sx={{ display: "flex", cursor: "pointer" }}
                  value={user.value}
                  onClick={() => handleChange(user.value)}
                >
                  <Box>
                    <GoDotFill size={18} style={{ color: user.bg }} />
                  </Box>
                  <Typography variant="body">
                    {selected === user.value ? (
                      <CustomLabel>{user.value} user</CustomLabel>
                    ) : (
                      `${user.value} ${
                        selectedValue.refreshing ? 0 : user?.total
                      } user`
                    )}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
          <ChartWrapper>
            {selectedValue?.toggle !== "grid" ? (
              <Box>
                <DoughnutInner>
                  <Typography variant="h4">{user2FA?.total}</Typography>
                  <Typography variant="caption">
                    {userLabel[0]?.value}
                  </Typography>
                </DoughnutInner>
                <Box
                  sx={{
                    marginTop: "50px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Doughnut
                    data={data}
                    options={options}
                    height={isMobile ? 180 : 200}
                  />
                </Box>
              </Box>
            ) : (
              <Box>
                <TableContainer component={Paper}>
                  <Table
                    sx={{ minWidth: 350 }}
                    size="small"
                    aria-label="a dense table"
                  >
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
                        const uniqueRowId =
                          index + 1 + (currentPage - 1) * ITEM_PER_PAGE;
                        return (
                          <TableRow
                            key={index}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <TableCell component="th" scope="row">
                              {uniqueRowId}
                            </TableCell>
                            <TableCell align="left">
                              {formateViews(row?.twoFA)}
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
              </Box>
            )}
          </ChartWrapper>
        </CardContent>
      )}
    </Card>
  );
};

export default withTheme(Doughnut2FA);
