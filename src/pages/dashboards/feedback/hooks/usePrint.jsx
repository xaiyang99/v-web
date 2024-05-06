import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Rating,
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
            Print user's feedback
          </Typography>
          <TableContainer component={Paper}>
            <Table size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell align="left">Owner</TableCell>
                  <TableCell align="left">Comment</TableCell>
                  <TableCell align="left">Performance</TableCell>
                  <TableCell align="left">Design</TableCell>
                  <TableCell align="left">Service</TableCell>
                  <TableCell align="left">Date</TableCell>
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
                      <TableCell align="left">{row.owner}</TableCell>
                      <TableCell align="left">
                        <Rating
                          value={parseInt(row.rating)}
                          name="half-rating"
                          defaultValue={0}
                          sx={{
                            color: "#17766B",
                            padding: "0.5rem",
                            margin: "0.5rem 0",
                          }}
                          readOnly
                        />
                        &nbsp;
                        <p dangerouslySetInnerHTML={{ __html: row.comment }} />
                      </TableCell>
                      <TableCell align="left">
                        <Rating
                          value={parseInt(row.performanceRating)}
                          name="half-rating"
                          defaultValue={0}
                          sx={{
                            color: "#17766B",
                            padding: "0.5rem",
                            margin: "0.5rem 0",
                          }}
                          readOnly
                        />
                        &nbsp;
                        {row.performanceComment}
                      </TableCell>
                      <TableCell align="left">
                        <Rating
                          value={parseInt(row.designRating)}
                          name="half-rating"
                          defaultValue={0}
                          sx={{
                            color: "#17766B",
                            padding: "0.5rem",
                            margin: "0.5rem 0",
                          }}
                          readOnly
                        />
                        &nbsp;
                        {row.designComment}
                      </TableCell>
                      <TableCell align="left">
                        <Rating
                          value={parseInt(row.serviceRating)}
                          name="half-rating"
                          defaultValue={0}
                          sx={{
                            color: "#17766B",
                            padding: "0.5rem",
                            margin: "0.5rem 0",
                          }}
                          readOnly
                        />
                        &nbsp;
                        {row.serviceComment}
                      </TableCell>
                      <TableCell align="left">
                        {DateOfNumber(row.data)}
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
