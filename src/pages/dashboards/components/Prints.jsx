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
function Prints(props) {
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
          <Typography>Sabaiydev</Typography>
          <TableContainer component={Paper}>
            <Table size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell align="left">Name</TableCell>
                  <TableCell align="left">Size</TableCell>
                  <TableCell align="left">IP</TableCell>
                  <TableCell align="left">Owner</TableCell>
                  <TableCell align="left">Status</TableCell>
                  <TableCell align="left">Date</TableCell>
                  <TableCell align="left">TotalDownload</TableCell>
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
                      <TableCell align="left">{row.name}</TableCell>
                      <TableCell align="left">{row.size}</TableCell>
                      <TableCell align="left">{row.ip}</TableCell>
                      <TableCell align="left">{row.owner}</TableCell>
                      <TableCell align="left">{row.status}</TableCell>
                      <TableCell align="left">{row.date}</TableCell>
                      <TableCell align="left">{row.totalDownload}</TableCell>
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

export default Prints;
