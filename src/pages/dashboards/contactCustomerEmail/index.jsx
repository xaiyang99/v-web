import React, { useState } from "react";
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
import * as MUI from "../css/manageFile";
import { useLazyQuery, useMutation } from "@apollo/client";
import { DELETE_CONTACT, QUERY_MESSAGE } from "./apollo/index";
// icon
import DeleteIcon from "@mui/icons-material/Delete";
import ResponsivePagination from "react-responsive-pagination";
import "react-responsive-pagination/themes/classic.css";
import moment from "moment";
import { errorMessage, successMessage } from "../../../components/Alerts";
import DialogDeleteLoading from "../components/DialogDeleteLoading";
import { rowItems } from "../../../functions";
import "./../css/style.css";
import { useTranslation } from "react-i18next";

function ChatCustomerEmail() {
  const { t } = useTranslation();
  let numberRows = rowItems;
  const [getData, setGetData] = useState([]);
  const [listData, { data: isData }] = useLazyQuery(QUERY_MESSAGE, {
    fetchPolicy: "cache-and-network",
  });

  const [loadingButton, setLoadingButton] = useState(false);
  const [reloading, setReloading] = useState(false);
  const [isStatus, setIsStatus] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [deleteContact] = useMutation(DELETE_CONTACT);
  const [getIDUser, setGetIDUser] = useState();
  const [selectedIds, setSelectedIds] = useState([]);
  const [getSearch, setGetSearch] = useState();

  React.useEffect(() => {
    const where = {
      name: getSearch ? String(getSearch) : undefined,
    };
    if (startDate && endDate) {
      where.createdAtBetween = [startDate, endDate];
    }
    listData({
      variables: {
        where,
        skip: getSearch ? 0 : numberRows * (currentPage - 1),
        limit: getSearch ? 1000 : numberRows,
        orderby: "createdAt_DESC",
      },
    });
    if (isData) {
      setGetData(isData?.getContact?.data);
      setTotalPages(isData?.getContact?.total);
    }
  }, [
    isData,
    getIDUser,
    currentPage,
    startDate,
    endDate,
    reloading,
    getSearch,
    isStatus,
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
        let _checkDelete;
        let countDeleteSuccess = 0;
        for (const id of selectedIds) {
          _checkDelete = await deleteContact({
            variables: {
              id: id,
            },
          });
          if (_checkDelete) {
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
            <Typography variant="h6">{t("_message_title")}</Typography>
            <MUI.ListFilter>
              <MUI.FileManage>
                <MUI.FilterFile></MUI.FilterFile>
                <MUI.FilterFile>
                  <TextField
                    variant="outlined"
                    label={t("_search")}
                    size="small"
                    onChange={(e) => setGetSearch(e.target.value)}
                  />
                </MUI.FilterFile>
                <MUI.FilterFile>
                  <TextField
                    type="date"
                    variant="outlined"
                    label={t("_start_date")}
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
                    label={t("_end_date")}
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
                    {t("_multiple_delete")}
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
                      <TableCell>{t("_no")}</TableCell>
                      <TableCell align="left">{t("_full_name")}</TableCell>
                      <TableCell align="left">{t("_email")}</TableCell>
                      <TableCell align="left">{t("_message")}</TableCell>
                      <TableCell align="center">{t("_created_at")}</TableCell>
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
                              <TableCell align="left">{item?.name}</TableCell>
                              <TableCell align="left">{item?.email}</TableCell>
                              <TableCell
                                align="left"
                                style={{
                                  overflowWrap: "break-word",
                                  maxWidth: "100px",
                                }}
                              >
                                {item?.message}
                              </TableCell>
                              <TableCell align="center">
                                {moment(item?.createdAt).format("D-MM-YYYY")}
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
                            colSpan={6}
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

export default ChatCustomerEmail;
