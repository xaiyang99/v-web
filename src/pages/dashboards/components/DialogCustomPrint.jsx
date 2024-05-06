import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Table,
  TableBody,
  Typography,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { safeGetProperty } from "../../../functions";

function DialogCustomPrint(props) {
  const { open, onClose, columns, rows } = props;
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
                  {columns.map((column, index) => {
                    return (
                      <TableCell {...column.attributes} key={index}>
                        {column.header || column.name}
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {(rows || []).map((row) => (
                  <TableRow
                    key={row.no}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    {columns.map((column, index) => {
                      return (
                        <TableCell {...column.attributes} key={index}>
                          {safeGetProperty(row, column.name)}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
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

export default DialogCustomPrint;
