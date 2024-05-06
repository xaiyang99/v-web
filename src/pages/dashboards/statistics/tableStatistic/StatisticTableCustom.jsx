import { Box } from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useState } from "react";
import PaginationStyled from "../../../../components/PaginationStyled";
import { formateViews } from "../../../../functions";

function StatisticTableCustom(props) {
  const ITEM_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastItem = currentPage * ITEM_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEM_PER_PAGE;
  const currentItems = props.rows?.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(props.rows?.length / ITEM_PER_PAGE);

  return (
    <div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 450 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              {props.column?.map((column, index) => (
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
                    {formateViews(row?.activeUser)}
                  </TableCell>
                  <TableCell align="left">
                    {formateViews(row?.newUser)}
                  </TableCell>

                  <TableCell align="left">{row.date}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {props?.rows?.length > ITEM_PER_PAGE && (
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

export default StatisticTableCustom;
