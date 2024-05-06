import { useLazyQuery, useMutation } from "@apollo/client";
import {
  Box,
  Card,
  CardContent,
  Checkbox,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import React, { useEffect, useState } from "react";
import * as MUI from "../css/manageFile";
import "./../css/style.css";
import { DELETE_CHECK_DOWNLOAD, QUERY_CHECK_DOWNLOAD } from "./apollo/index";
// icon
import DeleteIcon from "@mui/icons-material/Delete";
import MenuIcon from "@mui/icons-material/Menu";
import SortIcon from "@mui/icons-material/Sort";
import moment from "moment";
import ResponsivePagination from "react-responsive-pagination";
import "react-responsive-pagination/themes/classic.css";
import { errorMessage, successMessage } from "../../../components/Alerts";
import { ConvertBytetoMBandGB, rowItems } from "../../../functions";
import SelectFileName from "../componentSearch/fileSearch";
import SelectUsers from "../componentSearch/userSearch";
import DialogDeleteLoading from "../components/DialogDeleteLoading";
function FileDownload() {
  const [getFiles, setGetFiles] = useState([]);
  const [listFiles, { data: isData }] = useLazyQuery(QUERY_CHECK_DOWNLOAD, {
    fetchPolicy: "cache-and-network",
  });
  const [deleteCheckDownload] = useMutation(DELETE_CHECK_DOWNLOAD);
  const [getIDUser, setGetIDUser] = useState();
  const [getFileName, setGetFileName] = useState();
  const [selectedIds, setSelectedIds] = useState([]);
  const [deleteOpen, setDeleteOpen] = useState(false);
  let numberRows = rowItems;
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loadingButton, setLoadingButton] = useState(false);
  const [reloading, setReloading] = useState(false);
  const [moretoless, setMoretoless] = useState(false);

  React.useEffect(() => {
    const where = {
      fileID: getFileName ? parseInt(getFileName) : undefined,
      downloadBy: getIDUser ? parseInt(getIDUser) : undefined,
    };
    if (startDate && endDate) {
      where.createdAtBetween = [startDate, endDate];
    }
    listFiles({
      variables: {
        where,
        skip: numberRows * (currentPage - 1),
        limit: numberRows,
        orderby: "createdAt_DESC",
      },
    });
    if (isData) {
      setGetFiles(isData?.checkdownloads?.data);
      setTotalPages(isData?.checkdownloads?.total);
    }
  }, [
    isData,
    getIDUser,
    currentPage,
    startDate,
    endDate,
    getFileName,
    reloading,
  ]);
  let countPage = 0;
  for (var i = 1; i <= Math.ceil(totalPages / numberRows); i++) {
    countPage = i;
  }
  const NO = (index) => {
    const no = numberRows * currentPage - numberRows;
    if (numberRows > 0) {
      return no + index + 1;
    } else {
      return index + 1;
    }
  };
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelectedIds = getFiles?.map((item) => item._id);
      setSelectedIds(newSelectedIds);
    } else {
      setSelectedIds([]);
    }
  };
  const handleClick = (event, id) => {
    const selectedIndex = selectedIds.indexOf(id);
    let newSelectedIds = [];

    if (selectedIndex === -1) {
      newSelectedIds = newSelectedIds.concat(selectedIds, id);
    } else if (selectedIndex === 0) {
      newSelectedIds = newSelectedIds.concat(selectedIds.slice(1));
    } else if (selectedIndex === selectedIds.length - 1) {
      newSelectedIds = newSelectedIds.concat(selectedIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedIds = newSelectedIds.concat(
        selectedIds.slice(0, selectedIndex),
        selectedIds.slice(selectedIndex + 1)
      );
    }

    setSelectedIds(newSelectedIds);
  };
  const deleteHandleClose = () => {
    setDeleteOpen(false);
  };
  const _deleteAny = () => {
    setDeleteOpen(true);
  };
  const handleDeleteFile = async () => {
    try {
      if (selectedIds.length > 0) {
        let countDeleteSuccess = 0;
        for (const id of selectedIds) {
          const { data: _checkDownload } = await deleteCheckDownload({
            variables: {
              where: {
                _id: id,
              },
            },
          });
          if (_checkDownload?.deleteCheckdownload?._id) {
            countDeleteSuccess++;
          }
        }
        if (countDeleteSuccess === selectedIds.length) {
          setSelectedIds([]);
          setDeleteOpen(false);
          setLoadingButton(!loadingButton);
          setReloading(!reloading);
          successMessage(
            `Delete successfully is ${countDeleteSuccess} items`,
            3000
          );
        }
      }
    } catch (error) {
      errorMessage("Delete Failed try again!", 3000);
    }
  };
  const downloadCounts = getFiles.reduce((acc, row) => {
    acc[row.fileID.filename] =
      (acc[row.fileID.filename] || 0) + row.totalDownload;
    return acc;
  }, {});
  const sortedData = [...getFiles].sort(
    (a, b) =>
      downloadCounts[b.fileID.filename] - downloadCounts[a.fileID.filename]
  );
  useEffect(() => {
    if (sortedData.length) {
      moretoless
        ? setGetFiles(sortedData)
        : setGetFiles(isData?.checkdownloads?.data);
    }
  }, [moretoless]);
  return (
    <>
      <Paper elevation={0}>
        <DialogDeleteLoading
          open={deleteOpen}
          onClose={deleteHandleClose}
          title="Do you really want to delete the data?"
          onClick={handleDeleteFile}
          statusLoading={loadingButton}
        />
        <Card elevation={0}>
          <CardContent>
            <Typography variant="h6">Download history</Typography>
            <MUI.ListFilter>
              <MUI.FileManage>
                <MUI.FilterFile>
                  <SelectFileName
                    value={getFileName}
                    onChange={(id) => setGetFileName(id)}
                  />
                </MUI.FilterFile>
                <MUI.FilterFile>
                  <SelectUsers
                    value={getIDUser}
                    onChange={(id) => setGetIDUser(id)}
                  />
                </MUI.FilterFile>

                <MUI.FilterFile>
                  <TextField
                    type="date"
                    variant="outlined"
                    label="startDate"
                    focused
                    size="small"
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                    }}
                  />
                  <TextField
                    type="date"
                    variant="outlined"
                    label="endDate"
                    focused
                    size="small"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </MUI.FilterFile>
                <MUI.FilterFile>
                  <Button
                    disabled={selectedIds.length < 1 ? true : false}
                    variant="outlined"
                    color="error"
                    startIcon={
                      <DeleteIcon
                        color={selectedIds.length > 1 ? "error" : ""}
                      />
                    }
                    onClick={() => _deleteAny()}
                  >
                    Multiple delete
                  </Button>
                </MUI.FilterFile>
                <MUI.FilterFile>
                  <Button
                    variant="outlined"
                    color={moretoless ? "primary" : "error"}
                    startIcon={moretoless ? <MenuIcon /> : <SortIcon />}
                    onClick={() => setMoretoless(!moretoless)}
                  >
                    {moretoless ? <>Default</> : <>More to less</>}
                  </Button>
                </MUI.FilterFile>
              </MUI.FileManage>
            </MUI.ListFilter>
            &nbsp;
            <Box
              style={{
                width: "100%",
              }}
            >
              <TableContainer component={Paper}>
                <Table
                  sx={{ minWidth: 650 }}
                  size="medium"
                  aria-label="a dense table"
                >
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          indeterminate={
                            selectedIds.length > 0 &&
                            selectedIds.length < getFiles.length
                          }
                          checked={
                            getFiles.length > 0 &&
                            selectedIds.length === getFiles.length
                          }
                          onChange={handleSelectAllClick}
                        />
                      </TableCell>
                      <TableCell>ID</TableCell>
                      <TableCell align="left">FileName</TableCell>
                      <TableCell align="left">Size</TableCell>
                      <TableCell align="center">TotalDownload</TableCell>
                      <TableCell align="left">DownloadBy</TableCell>
                      <TableCell align="left">IP(Download)</TableCell>
                      <TableCell align="left">Download date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {getFiles?.length > 0 ? (
                      <>
                        {getFiles?.map((item, index) => {
                          const isItemSelected =
                            selectedIds.indexOf(item._id) !== -1;
                          return (
                            <TableRow
                              key={index}
                              sx={{
                                "&:last-child td, &:last-child th": {
                                  border: 0,
                                },
                              }}
                            >
                              <TableCell
                                padding="checkbox"
                                onClick={(event) =>
                                  handleClick(event, item._id)
                                }
                              >
                                <Checkbox
                                  color="primary"
                                  checked={isItemSelected}
                                />
                              </TableCell>
                              <TableCell component="th" scope="row">
                                {NO(index)}
                              </TableCell>
                              <TableCell align="left">
                                {item?.fileID?.filename}
                              </TableCell>
                              <TableCell align="left">
                                {ConvertBytetoMBandGB(item?.fileID?.size)}
                              </TableCell>
                              <TableCell align="center">
                                {item?.totalDownload}
                              </TableCell>
                              <TableCell align="left">
                                {item?.downloadBy?.firstName
                                  ? item?.downloadBy?.firstName +
                                    " " +
                                    item?.downloadBy?.lastName
                                  : "---"}
                              </TableCell>
                              <TableCell align="left">
                                {item?.ip ? item?.ip : "---"}
                              </TableCell>
                              <TableCell align="left">
                                {moment(item?.createdAt).format("D-MM-YYYY")}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                        <TableRow>
                          <TableCell colSpan={4} align="center">
                            <strong>Total download all</strong>
                          </TableCell>
                          <TableCell align="center">
                            <strong>{totalPages ? totalPages : 0}</strong>
                          </TableCell>
                          <TableCell colSpan={3} align="center"></TableCell>
                        </TableRow>
                      </>
                    ) : (
                      <>
                        <TableRow>
                          <TableCell
                            component="th"
                            align="center"
                            colSpan={8}
                            scope="row"
                          >
                            Data is Empty
                          </TableCell>
                        </TableRow>
                      </>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                width: "90%",
                mt: 3,
              }}
            >
              <ResponsivePagination
                current={currentPage}
                total={countPage}
                onPageChange={setCurrentPage}
                maxWidth={400}
              />
            </Box>
          </CardContent>
        </Card>
      </Paper>
    </>
  );
}

export default FileDownload;
