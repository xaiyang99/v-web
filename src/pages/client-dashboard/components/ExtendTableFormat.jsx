import FolderIcon from "@mui/icons-material/Folder";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Card, CardContent } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Box } from "@mui/system";
import moment from "moment";
import React from "react";
import { FileIcon, defaultStyles } from "react-file-icon";

function ExtendTableFormat(props) {
  const [selected, setSelected] = React.useState([]);

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;
  return (
    <div>
      <Paper sx={{ width: "100%", mb: 2, marginTop: "7rem" }}>
        <Card>
          <CardContent>
            <TableContainer>
              <Table
                sx={{ minWidth: 250 }}
                aria-labelledby="tableTitle"
                size="small"
              >
                <TableHead>
                  <TableRow>
                    <TableCell>FileName</TableCell>
                    <TableCell>Owner</TableCell>
                    <TableCell>Update Date</TableCell>
                    <TableCell>Size</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {props.listSubfolder[0]?.parentkey[0]?._id
                    ? props.listSubfolder[0]?.parentkey.map((row, index) => {
                        const isItemSelected = isSelected(index);
                        const labelId = `enhanced-table-checkbox-${index}`;
                        return (
                          <TableRow
                            hover
                            onClick={(event) => handleClick(event, index)}
                            role="checkbox"
                            aria-checked={isItemSelected}
                            tabIndex={-1}
                            key={index}
                            selected={isItemSelected}
                            sx={{ cursor: "pointer" }}
                          >
                            <TableCell>
                              {isItemSelected ? (
                                <Checkbox
                                  color="success"
                                  checked={isItemSelected}
                                  inputProps={{
                                    "aria-labelledby": labelId,
                                  }}
                                />
                              ) : (
                                <IconButton sx={{ color: "#2F998B" }}>
                                  {row?.folder_type === "folder" ? (
                                    <FolderIcon />
                                  ) : (
                                    <Box sx={{ width: "25px", height: "25px" }}>
                                      <FileIcon
                                        extension={row.folder_name}
                                        {...defaultStyles.pdf}
                                      />
                                    </Box>
                                  )}
                                </IconButton>
                              )}

                              {row.folder_name}
                            </TableCell>
                            <TableCell>{row.username ? "" : "..."}</TableCell>
                            <TableCell>
                              {moment(row.updatedAt).format("YYYY-MM-D")}
                            </TableCell>
                            <TableCell>{row.size ? "" : "..."}</TableCell>
                            <TableCell>
                              <IconButton>{<MoreVertIcon />}</IconButton>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    : null}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Paper>
    </div>
  );
}

export default ExtendTableFormat;
