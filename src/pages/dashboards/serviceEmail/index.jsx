import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Paper,
  Typography,
} from "@mui/material";
import React, { Fragment, useState } from "react";
import BreadcrumbNavigate from "../../../components/BreadcrumbNavigate";
import * as Icon from "../../../icons/icons";
import { useMutation } from "@apollo/client";
import { DELETE_SERVICE_EMAIL } from "./apollo";
import { DataGrid } from "@mui/x-data-grid";
import ServiceEmailDialog from "./components/serviceEmailDialog";
import { CardHeaderTitle } from "../css/feedback";
import NormalButton from "../../../components/NormalButton";
import DialogDeleteV1 from "../components/DialogDeleteV1";
import { errorMessage, successMessage } from "../../../components/Alerts";
import useManageServiceEmail from "./hooks/useManageServiceEmail";
import useServiceFilter from "./hooks/useFilter";
import AddIcon from "@mui/icons-material/Add";
import PaginationStyled from "../../../components/PaginationStyled";
import { DateOfNumber } from "../../../functions";

function ServiceEmail() {
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isDelete, setIsDelete] = useState(false);

  const [dataForEvents, setDataForEvents] = useState({});

  const [deleteEmail] = useMutation(DELETE_SERVICE_EMAIL);

  const useFilter = useServiceFilter();
  const useManageData = useManageServiceEmail({
    filter: useFilter.data,
  });

  const columns = [
    {
      field: "index",
      headerName: "No",
      width: 50,
      sortable: false,
    },

    {
      field: "name",
      headerName: "Name",
      minWidth: 200,
      sortable: false,
      flex: 1,
    },

    {
      field: "email",
      headerName: "Email",
      minWidth: 250,
      sortable: false,
      flex: 1,
    },

    {
      field: "type",
      headerName: "Type",
      minWidth: 120,
      sortable: false,
      flex: 1,
    },

    {
      field: "created_at",
      headerName: "Create At",
      minWidth: 100,
      flex: 1,
      renderCell: (params) => {
        const createdAt = params?.row?.createdAt;

        return <Fragment>{DateOfNumber(createdAt)}</Fragment>;
      },
    },

    {
      field: "status",
      headerName: "Status",
      minWidth: 120,
      sortable: false,
      flex: 1,
      renderCell: (params) => {
        const status = params?.row.status;

        if (status === "active") {
          return (
            <div style={{ color: "green" }}>
              <Chip
                sx={{
                  backgroundColor: "#dcf6e8",
                  color: "#29c770",
                  textTransform: "capitalize",
                }}
                label={status}
                size="small"
              />
            </div>
          );
        } else {
          return (
            <div>
              <Chip
                sx={{
                  backgroundColor: "rgba(168, 170, 174,0.16)",
                  color: "rgb(168, 170, 174)",
                  textTransform: "capitalize",
                }}
                label={status}
                size="small"
              />
            </div>
          );
        }
      },
    },

    {
      field: "action",
      headerName: "Action",
      minWidth: 120,
      sortable: false,
      flex: 1,

      renderCell: (params) => {
        const dataRow = params?.row;

        return (
          <Box sx={{ display: "flex", gap: 2 }}>
            <NormalButton
              onClick={() => {
                setIsUpdate(true);
                setDataForEvents(dataRow);
                handleIsOpen();
              }}
            >
              <Icon.Edit size={20} color="grey" />
            </NormalButton>
            <NormalButton
              onClick={() => {
                setDataForEvents(dataRow);
                setIsDelete(true);
              }}
            >
              <Icon.Trash size={20} color="grey" />
            </NormalButton>
          </Box>
        );
      },
    },
  ];

  function handleIsOpen() {
    setIsOpen(true);
  }

  function handleIsClose() {
    handleResetEvent();
    setIsOpen(false);
    setIsUpdate(false);
  }

  function handleResetEvent() {
    setDataForEvents({});
  }

  function handleDelClose() {
    handleResetEvent();
    setIsDelete(false);
  }

  function handleReloadData() {
    useManageData.fetchingData();
  }

  async function handleDelete() {
    try {
      const result = await deleteEmail({
        variables: {
          id: dataForEvents?._id,
        },
      });

      if (result.data?.deleteEmail) {
        successMessage("The data was deleted successfully", 2000);
        handleReloadData();
      }
    } catch (error) {
      errorMessage("Something went wrong", 3000);
    }
  }

  return (
    <Fragment>
      <Box>
        <BreadcrumbNavigate
          separatorIcon={<Icon.ForeSlash />}
          path={["files", "manage-files"]}
          readablePath={["Setting", "Email"]}
        />

        <Paper
          sx={{
            mt: (theme) => theme.spacing(3),
            boxShadow: (theme) => theme.baseShadow.secondary,
            flex: "1 1 0%",
          }}
        >
          <Card>
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                paddingLeft: "0 !important",
                paddingRight: "0 !important",
              }}
            >
              <Box sx={{ padding: (theme) => `0 ${theme.spacing(6)}` }}>
                <Box>
                  <CardHeaderTitle>
                    <Typography variant="h3">List all Email</Typography>
                  </CardHeaderTitle>
                </Box>

                <Box
                  sx={{
                    mt: 4,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    mb: 5,
                  }}
                >
                  {/* <Box>
                    <SelectV1
                      disableLabel
                      selectStyle={{
                        height: "35px",
                        minHeight: "35px",
                        width: "120px",
                      }}
                      selectProps={{
                        disableClear: true,
                        onChange: (e) => {
                          useFilter.dispatch({
                            type: useFilter.ACTION_TYPE.PAGE_ROW,
                            payload: e?.value || null,
                          });
                        },
                        options: [
                          { label: 10, value: 10 },
                          { label: 30, value: 30 },
                          { label: 50, value: 50 },
                          { label: 100, value: 100 },
                        ],
                        defaultValue: [{ label: 10, value: 10 }],
                        sx: {
                          "& .MuiInputBase-root": {
                            height: "35px",
                          },
                        },
                      }}
                    />
                  </Box> */}
                  <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                    {/* <TextField placeholder="Search" size="small" /> */}
                    <Button variant="contained" onClick={handleIsOpen}>
                      <AddIcon sx={{ mr: 1 }} />
                      Create new
                    </Button>
                  </Box>
                </Box>
              </Box>

              <DataGrid
                sx={{
                  height: "100% !important",
                  borderRadius: 0,
                  "& .MuiDataGrid-columnSeparator": { display: "none" },
                  "& .MuiDataGrid-virtualScroller": {
                    overflowX: "scroll",
                  },

                  "& .MuiDataGrid-virtualScroller::-webkit-scrollbar-thumb": {
                    background: "#d33",
                  },
                }}
                autoHeight
                columns={columns}
                getRowId={(row) => row?._id}
                rows={useManageData.data || []}
                AutoGenerateColumns="True"
                disableSelectionOnClick
                disableColumnFilter
                disableColumnMenu
                hideFooter
              />

              {useManageData.total > 10 && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      padding: (theme) => theme.spacing(4),
                      flex: "1 1 0%",
                    }}
                  >
                    <PaginationStyled
                      currentPage={useFilter.data.currentPageNumber}
                      total={Math.ceil(
                        dataTicket.total / useFilter.data.pageLimit,
                      )}
                      setCurrentPage={(e) =>
                        useFilter.dispatch({
                          type: useFilter.ACTION_TYPE.PAGINATION,
                          payload: e,
                        })
                      }
                    />
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Paper>
      </Box>

      <ServiceEmailDialog
        isOpen={isOpen}
        isUpdate={isUpdate}
        dataValue={dataForEvents}
        onConfirm={handleReloadData}
        onClose={handleIsClose}
      />

      <DialogDeleteV1
        isOpen={isDelete}
        onConfirm={handleDelete}
        onClose={handleDelClose}
      />
    </Fragment>
  );
}

export default ServiceEmail;
