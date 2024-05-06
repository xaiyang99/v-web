import { useLazyQuery, useMutation } from "@apollo/client";
import {
  Box,
  Card,
  CardContent,
  Checkbox,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
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
import React, { useState } from "react";
import * as MUI from "../css/manageFile";
import "./../css/style.css";
import { DELETE_FEATURE_PACKAGE, QUERY_FEATURE_PACKAGE } from "./apollo/index";
// icon
import DeleteIcon from "@mui/icons-material/Delete";
import moment from "moment";
import ResponsivePagination from "react-responsive-pagination";
import "react-responsive-pagination/themes/classic.css";
import { errorMessage, successMessage } from "../../../components/Alerts";
import { rowItems } from "../../../functions";
import SelectUsers from "../componentSearch/userSearch";
import DialogDeleteLoading from "../components/DialogDeleteLoading";
import AddFeaturePackage from "./AddFeaturePackage";
import UpdatePackage from "./UpdatePackage";
function FeaturePackage() {
  const [getData, setGetData] = useState([]);
  const [listFiles, { data: isData }] = useLazyQuery(QUERY_FEATURE_PACKAGE, {
    fetchPolicy: "cache-and-network",
  });
  const [deleteFeaturePackage] = useMutation(DELETE_FEATURE_PACKAGE);
  const [getIDUser, setGetIDUser] = useState();
  const [selectedIds, setSelectedIds] = useState([]);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [getSearch, setGetSearch] = useState();
  let numberRows = rowItems;
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loadingButton, setLoadingButton] = useState(false);
  const [reloading, setReloading] = useState(false);
  const [isSatatus, setIsSatatus] = useState();
  React.useEffect(() => {
    const where = {
      detial: getSearch ? String(getSearch) : undefined,
      status:
        isSatatus === "all"
          ? undefined
          : isSatatus
          ? String(isSatatus)
          : undefined,
      createdBy: getIDUser ? parseInt(getIDUser) : undefined,
    };
    if (startDate && endDate) {
      where.createdAtBetween = [startDate, endDate];
    }
    listFiles({
      variables: {
        where,
        skip: getSearch ? 0 : numberRows * (currentPage - 1),
        limit: getSearch ? 1000 : numberRows,
        orderby: "createdAt_DESC",
      },
    });
    if (isData) {
      setGetData(isData?.featurpackage?.data);
      setTotalPages(isData?.featurpackage?.total);
    }
  }, [
    isData,
    getIDUser,
    currentPage,
    startDate,
    endDate,
    reloading,
    getSearch,
    isSatatus,
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
      const newSelectedIds = getData?.map((item) => item._id);
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
        let _checkDownload;
        let countDeleteSuccess = 0;
        for (const id of selectedIds) {
          _checkDownload = await deleteFeaturePackage({
            variables: {
              where: {
                _id: id,
              },
            },
          });
          if (_checkDownload) {
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
            <Typography variant="h6">Manage package</Typography>
            <MUI.ListFilter>
              <MUI.FileManage>
                <MUI.FilterFile>
                  <AddFeaturePackage refresh={() => setReloading(!reloading)} />
                </MUI.FilterFile>
                <MUI.FilterFile>
                  <TextField
                    variant="outlined"
                    label="Search by title"
                    size="small"
                    onChange={(e) => setGetSearch(e.target.value)}
                  />
                </MUI.FilterFile>
                <MUI.FilterFile>
                  <SelectUsers
                    value={getIDUser}
                    onChange={(id) => setGetIDUser(id)}
                  />
                </MUI.FilterFile>
                <MUI.FilterFile>
                  &nbsp;
                  <FormControl sx={{ minWidth: 120 }} size="small">
                    <InputLabel id="demo-select-small-label">Status</InputLabel>
                    <Select
                      labelId="demo-select-small-label"
                      id="demo-select-small"
                      label="Status"
                      value={isSatatus || ""}
                      onChange={(e) => setIsSatatus(e.target.value)}
                    >
                      <MenuItem value="all">all</MenuItem>
                      <MenuItem value="active">active</MenuItem>
                      <MenuItem value="disabled">disabled</MenuItem>
                      <MenuItem value="deleted">deleted</MenuItem>
                    </Select>
                  </FormControl>
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
                            selectedIds.length < getData.length
                          }
                          checked={
                            getData.length > 0 &&
                            selectedIds.length === getData.length
                          }
                          onChange={handleSelectAllClick}
                        />
                      </TableCell>
                      <TableCell>ID</TableCell>
                      <TableCell align="left">Title</TableCell>
                      <TableCell align="left">Subtitle</TableCell>
                      <TableCell align="left">Detial</TableCell>
                      <TableCell align="center">Status</TableCell>
                      <TableCell align="center">Created by</TableCell>
                      <TableCell align="center">Created date</TableCell>
                      <TableCell align="center">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {getData?.length > 0 ? (
                      <>
                        {getData?.map((item, index) => {
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
                              <TableCell align="left">{item?.title}</TableCell>
                              <TableCell align="left">
                                {item?.subtitle}
                              </TableCell>
                              <TableCell
                                align="left"
                                style={{
                                  overflowWrap: "break-word",
                                  maxWidth: "100px",
                                }}
                              >
                                {item?.detial}
                              </TableCell>
                              <TableCell align="center">
                                {item?.status === "active" ? (
                                  <>
                                    <div style={{ color: "green" }}>
                                      <Chip
                                        sx={{
                                          backgroundColor: "#dcf6e8",
                                          color: "#29c770",
                                        }}
                                        label={item?.status}
                                        size="small"
                                      />
                                    </div>
                                  </>
                                ) : item?.status === "disabled" ? (
                                  <>
                                    <div>
                                      <Chip
                                        sx={{
                                          backgroundColor: "#ffefe1",
                                          color: "#ffa44f",
                                        }}
                                        label={item?.status}
                                        color="error"
                                        size="small"
                                      />
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <div>
                                      <Chip
                                        sx={{
                                          backgroundColor: "#ffcdd2",
                                          color: "#e53935",
                                        }}
                                        label={item?.status}
                                        color="primary"
                                        size="small"
                                      />
                                    </div>
                                  </>
                                )}
                              </TableCell>
                              <TableCell align="center">
                                {item?.createdBy?.firstName
                                  ? item?.createdBy?.firstName +
                                    " " +
                                    item?.createdBy?.lastName
                                  : "---"}
                              </TableCell>
                              <TableCell align="center">
                                {moment(item?.createdAt).format("D-MM-YYYY")}
                              </TableCell>
                              <TableCell align="center">
                                <UpdatePackage
                                  data={item}
                                  refresh={() => setReloading(!reloading)}
                                />
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </>
                    ) : (
                      <>
                        <TableRow>
                          <TableCell
                            component="th"
                            align="center"
                            colSpan={10}
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

export default FeaturePackage;
