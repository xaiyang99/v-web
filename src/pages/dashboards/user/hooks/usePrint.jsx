import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Table,
  TableBody,
  Typography,
} from "@mui/material";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import { DateOfNumber } from "../../../../functions";
function usePrint(props) {
  const { open, onClose, exportCSV } = props;
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  return (
    <div>
      <Dialog
        open={open}
        sx={{
          "& .MuiDialog-container": {
            "& .MuiPaper-root": {
              width: "100%",
              maxWidth: "1000px",
            },
          },
        }}
        aria-labelledby="responsive-dialog-title"
        onClose={onClose}
      >
        <DialogContent ref={componentRef}>
          <Typography
            variant="h6"
            sx={{ display: "flex", justifyContent: "center", mb: 3 }}
          >
            Welcome to Vshare
          </Typography>
          <TableContainer component={Paper}>
            <Table size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell align="left">Name</TableCell>
                  <TableCell align="left">Username</TableCell>
                  <TableCell align="left">Email</TableCell>
                  <TableCell align="left">Gender</TableCell>
                  <TableCell align="left">Country</TableCell>
                  <TableCell align="left">Status</TableCell>
                  <TableCell align="left">CreatedAt</TableCell>
                </TableRow>
              </TableHead>
              {exportCSV.length > 0 && (
                <TableBody>
                  {exportCSV.map((row) => (
                    <TableRow
                      key={row.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.id}
                      </TableCell>
                      <TableCell align="left">
                        {row.FirstName}&nbsp;
                        {row.LastName}
                      </TableCell>
                      <TableCell align="left">{row.Useraname}</TableCell>
                      <TableCell align="left">{row.Email}</TableCell>
                      <TableCell align="left">{row.Gender}</TableCell>
                      <TableCell align="left">{row.Country}</TableCell>
                      <TableCell align="left">{row.Status}</TableCell>
                      <TableCell align="left">
                        {DateOfNumber(row.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              )}
            </Table>
          </TableContainer>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Close</Button>
          <Button
            onClick={() => (handlePrint(), onClose())}
            startIcon={<LocalPrintshopIcon />}
          >
            print
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default usePrint;
