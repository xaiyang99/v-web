import { useLazyQuery, useMutation } from "@apollo/client";
import { ForumOutlined } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Paper,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import heDecode from "he";
import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { errorMessage, successMessage } from "../../../components/Alerts";
import BreadcrumbNavigate from "../../../components/BreadcrumbNavigate";
import NormalButton from "../../../components/NormalButton";
import PaginationStyled from "../../../components/PaginationStyled";
import { THEMES } from "../../../constants";
import {
  handleGraphqlErrors,
  indexPagination,
  keyBunnyCDN,
  linkBunnyCDN,
} from "../../../functions";
import useAuth from "../../../hooks/useAuth";
import { SocketServer } from "../../../hooks/useSocketIO";
import * as Icon from "../../../icons/icons";
import { QUERY_TICKET_BY_TYPE } from "../../client-dashboard/replyTicket/apollo";
import { getColorStatus } from "../../client-dashboard/ticket/style";
import DatePickerV1 from "../components/DatePickerV1";
import DialogDeleteTicket from "../components/DialogDeleteTicket";
import DialogCloseTicket from "../components/DialogTicketClose";
import SelectV1 from "../components/SelectV1";
import { CardHeaderTitle } from "../css/feedback";
import * as MUI from "../css/manageFile";
import { DELETE_TYPE_TICKET, UPDATE_TYPE_TICKET } from "./apollo";
import useManageTicket from "./hooks/useManageTicket";
import useFilter from "./hooks/useTicket";
// import DialogTicketStatus from "../components/DialogTicketStatus";

function Ticket() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const columns = [
    {
      field: "index",
      headerName: t("_no"),
      sortable: false,
      headerAlign: "center",
      align: "center",
      width: 70,
      renderCell: (params) => {
        return (
          <div>
            {indexPagination({
              filter: filter?.state,
              index: params?.row?.index,
            })}
          </div>
        );
      },
    },
    {
      field: "code",
      headerName: t("_code"),
      sortable: false,
      width: 70,
    },
    {
      field: "title",
      headerName: t("_title"),
      flex: 1,
      sortable: false,
      minWidth: 400,
      renderCell: (params) => {
        let row = params?.row;

        return <Box>{heDecode.decode(row?.title)}</Box>;
      },
    },
    {
      field: "status",
      headerName: t("_status"),
      flex: 1,
      sortable: false,
      minWidth: 150,
      renderCell: (params) => {
        const status = params?.row?.status;
        return (
          <Chip
            label={status === "close" ? status + "d" : status}
            sx={getColorStatus(status)}
          />
        );
      },
    },
    {
      field: "email",
      headerName: t("_user"),
      flex: 1,
      sortable: false,
      minWidth: 200,
    },
    {
      field: "action",
      headerName: t("_action"),
      flex: 1,
      minWidth: 130,
      renderCell: (params) => {
        return (
          <Box
            sx={{
              columnGap: (theme) => theme.spacing(3),
              display: "flex",
              alignItems: "center",
            }}
          >
            <NormalButton
              onClick={() => {
                if (params?.row?.status === "close") {
                  errorMessage("This ticket was closed already.", 3000);
                  return;
                }

                setDataForEvents({
                  data: params.row,
                });
                openEditToggle();
              }}
            >
              <Icon.Edit
                size="20px"
                color={theme.name === THEMES.DARK ? "white" : "grey"}
              />
            </NormalButton>

            <NormalButton
              onClick={() => {
                navigate(`chat-message/${params?.row._id}`, {
                  relative: location.pathname,
                });
              }}
            >
              <ForumOutlined
                size="20px"
                color={theme.name === THEMES.DARK ? "white" : "grey"}
                sx={{
                  fontWeight: "bold",
                }}
              />
            </NormalButton>

            <NormalButton
              onClick={() => {
                setDataLabel({
                  data: {
                    _id: params?.row?._id,
                    title: params?.row?.title,
                    user: {
                      _id: params?.row?.createdBy?._id,
                      newName: params?.row?.createdBy?.newName,
                    },
                  },
                });
                openDelToggle();
              }}
            >
              <Icon.Trash
                size="20px"
                color={theme.name === THEMES.DARK ? "white" : "grey"}
              />
            </NormalButton>
            {/* </Tooltip> */}
          </Box>
        );
      },
    },
  ];

  const bunnyUrl = linkBunnyCDN;
  const keyBunny = keyBunnyCDN;
  const theme = useTheme();
  const filter = useFilter();
  const manageTickets = useManageTicket({ filter: filter.data });
  const [updateCloseTicket] = useMutation(UPDATE_TYPE_TICKET);
  const [getTicketData] = useLazyQuery(QUERY_TICKET_BY_TYPE);
  const [isDelete, setIsDelete] = useState(false);
  const [isDel, setIsDel] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [dataForEvents, setDataForEvents] = useState({
    action: null,
    type: null,
    data: {},
  });
  const [dataLabel, setDataLabel] = useState({
    data: {},
  });

  const [ticketDelete] = useMutation(DELETE_TYPE_TICKET);

  const isMobile = useMediaQuery("(max-width:768px)");

  const handleSelectData = (data) => {
    const selectedOptionIds = data.map((dataId) => {
      const option = manageTickets.data.find(
        (option) => parseInt(option._id) === parseInt(dataId),
      );
      if (option) {
        return option;
      }
      return "";
    });
    manageTickets.setSelectedRow(selectedOptionIds);
  };

  const handleDeleteToggle = () => setIsDelete(true);

  const openEditToggle = () => setIsEdit(true);
  const closeEditToggle = () => {
    setDataForEvents({ data: {} });
    setIsEdit(false);
  };

  const openDelToggle = () => setIsDel(true);
  const closeDeleteToggle = () => setIsDelete(false);

  async function submitCloseTicket() {
    try {
      const result = await updateCloseTicket({
        variables: {
          data: {
            status: "close",
          },
          where: {
            _id: dataForEvents.data?._id,
          },
        },
      });

      if (result?.data?.updateTypetickets?._id) {
        onReloadData();
        successMessage("Ticket was closed successfully", 2000);
      }
    } catch (error) {
      let cutErr = error.message.replace(/(ApolloError: )?Error: /, "");
      errorMessage(handleGraphqlErrors(cutErr), 3000);
    }
  }

  function onReloadData() {
    manageTickets.customTicket();
    closeEditToggle();
  }

  function closeDelToggle() {
    setIsDel(false);
    setDataLabel({ data: {} });
  }

  const deleteTicket = async () => {
    try {
      // delete ticket

      // Get data image from the ticket
      const resData = await getTicketData({
        variables: {
          where: {
            typeTicketID: parseInt(dataLabel.data?._id),
          },
          noLimit: true,
        },
      });

      if (resData.data?.tickets?.data?.length) {
        const ticketData = (await resData?.data?.tickets?.data) || [];
        const result = await ticketDelete({
          variables: {
            where: {
              _id: dataLabel.data?._id,
            },
          },
        });

        if (result.data?.deleteTypetickets?._id) {
          ticketData?.map((ticket) => {
            const imageTicketData = ticket?.image;
            const bunnyPath = `${bunnyUrl}${dataLabel.data?.user?.newName}-${dataLabel.data?.user?._id}`;

            imageTicketData?.forEach(async (file) => {
              if (!!file?.image) {
                await fetch(`${bunnyPath}/${file?.newNameImage}`, {
                  headers: {
                    AccessKey: keyBunny,
                  },
                  method: "DELETE",
                })
                  .then(() => {})
                  .catch((err) => {
                    console.log(err);
                  });
              }
            });
          });

          successMessage("Ticket is deleted", 2000);
          closeDelToggle();
          manageTickets.customTicket();
        }
      }
    } catch (error) {
      let cutErr = error.message.replace(/(ApolloError: )?Error: /, "");
      errorMessage(handleGraphqlErrors(cutErr), 3000);
    }
  };

  const handleMultipleDelete = async () => {
    try {
      // userMaps = [_id, newName]
      const userMaps = manageTickets.selectedRow.map((data) => {
        return {
          _id: data._id,
          user: {
            _id: data.createdBy._id,
            newName: data.createdBy.newName,
          },
        };
      });

      userMaps.forEach(async (userVal) => {
        let resImage = await getTicketData({
          variables: {
            where: {
              typeTicketID: parseInt(userVal._id),
            },
            noLimit: true,
          },
        });

        const dataWraps = [...resImage?.data?.tickets?.data];
        const result = await ticketDelete({
          variables: {
            where: { _id: userVal._id },
          },
        });

        const bunnyPath = `${bunnyUrl}${userVal?.user?.newName}-${userVal?.user._id}`;
        if (result?.data?.deleteTypetickets?._id) {
          const ticketMultipleData = dataWraps || [];
          // [image, newNameImage];
          ticketMultipleData.map((ticket) => {
            ticket?.image?.forEach(async (file) => {
              if (!!file?.image) {
                await fetch(`${bunnyPath}/${file.newNameImage}`, {
                  headers: {
                    AccessKey: keyBunny,
                  },
                })
                  .then(() => {})
                  .catch((error) => {
                    console.log(error);
                  });
              }
            });
          });
        }
        manageTickets.customTicket();
        manageTickets.setSelectedRow([]);
      });
      // End
      closeDeleteToggle();
      successMessage("All selected tickets are deleted successfully", 2000);
    } catch (error) {
      let cutErr = error.message.replace(/(ApolloError: )?Error: /, "");
      errorMessage(handleGraphqlErrors(cutErr), 3000);
    }
  };

  useEffect(() => {
    const getMessageServer = () => {
      try {
        const socket = SocketServer();
        socket.emit("joinRoom", parseInt(user?._id));
        socket.on("newTicket", () => {
          manageTickets.customTicket();
        });

        return () => {
          socket.disconnect();
        };
      } catch (error) {
        console.log(error);
      }
    };

    getMessageServer();
  }, []);

  return (
    <Fragment>
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <BreadcrumbNavigate
          path={["ticket", "ticket"]}
          readablePath={[t("_support_ticket"), t("_manage_ticket")]}
        />

        <Paper
          sx={{
            mt: (theme) => theme.spacing(3),
            boxShadow: (theme) => theme.baseShadow.secondary,
            flex: "1 1 0",
          }}
        >
          <Card>
            <CardContent>
              <CardHeaderTitle>
                <Typography variant="h3">{t("_ticket_title")}</Typography>
                <Box>
                  <Grid container columnSpacing={3} rowSpacing={{ xs: 1 }}>
                    <Grid item xs={12} md={2} lg={2}>
                      <MUI.FilterFile>
                        <SelectV1
                          placeholder={t("_select_status")}
                          label={t("_status")}
                          selectStyle={{
                            height: "35px",
                            minHeight: "35px",
                          }}
                          selectProps={{
                            onChange: (e) => {
                              filter.dispatch({
                                type: filter.ACTION_TYPE.STATUS,
                                payload: e?.value || null,
                              });
                            },
                            options: [
                              { label: "New", value: "new" },
                              { label: "Pending", value: "pending" },
                              { label: "Closed", value: "close" },
                            ],
                          }}
                        />
                      </MUI.FilterFile>
                    </Grid>
                    <Grid item xs={12} md={5} lg={5}>
                      <DatePickerV1
                        label={t("_start_date")}
                        datePickerProps={{
                          value: filter.state.createdAt.startDate,
                          onChange: (e) => {
                            filter.dispatch({
                              type: filter.ACTION_TYPE.CREATED_AT_START_DATE,
                              payload: e,
                            });
                          },
                          onError: () =>
                            filter.dispatch({
                              type: filter.ACTION_TYPE.CREATED_AT_START_DATE,
                              payload: null,
                            }),
                          sx: {
                            "& .MuiInputBase-root": {
                              height: "35px",
                            },
                            InputLabelProps: {
                              shrink: false,
                            },
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={5} lg={5}>
                      <DatePickerV1
                        label={t("_end_date")}
                        datePickerProps={{
                          value: filter.state.createdAt.startDate,
                          onChange: (e) => {
                            filter.dispatch({
                              type: filter.ACTION_TYPE.CREATED_AT_END_DATE,
                              payload: e,
                            });
                          },
                          onError: () =>
                            filter.dispatch({
                              type: filter.ACTION_TYPE.CREATED_AT_END_DATE,
                              payload: null,
                            }),
                          sx: {
                            "& .MuiInputBase-root": {
                              height: "35px",
                            },
                            InputLabelProps: {
                              shrink: false,
                            },
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                  {/* </MUI.ListFilter> */}
                </Box>
                &nbsp;
                <MUI.TicketStyle>
                  <MUI.FilterFile>
                    <SelectV1
                      disableLabel
                      selectStyle={{
                        height: "35px",
                        minHeight: "35px",
                        width: isMobile ? "60px" : "100px",
                      }}
                      selectProps={{
                        disableClear: true,
                        onChange: (e) => {
                          filter.dispatch({
                            type: filter.ACTION_TYPE.PAGE_LIMIT,
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
                            width: "100%",
                          },
                        },
                      }}
                    />
                  </MUI.FilterFile>
                  <Box sx={{ display: "flex", mt: 1 }}>
                    <MUI.FilterFile>
                      <TextField
                        fullWidth={true}
                        sx={{
                          width: "100%",
                          "& .MuiInputBase-root": {
                            input: {
                              "&::placeholder": {
                                opacity: 1,
                                color: "#9F9F9F",
                              },
                            },
                          },
                        }}
                        onChange={(e) => {
                          {
                            filter.dispatch({
                              type: filter.ACTION_TYPE.SEARCH,
                              payload: e.target.value,
                            });
                          }
                        }}
                        onBlur={(e) => {
                          filter.dispatch({
                            type: filter.ACTION_TYPE.SEARCH,
                            payload: e.target.value,
                          });
                        }}
                        placeholder={t("_search")}
                        size="small"
                        InputLabelProps={{
                          shrink: false,
                        }}
                      />
                    </MUI.FilterFile>
                    <MUI.FilterFile>
                      <Button
                        variant="contained"
                        startIcon={<DeleteIcon />}
                        color="error"
                        sx={{
                          width: "100%",
                          ml: 3,
                        }}
                        onClick={() => {
                          handleDeleteToggle();
                        }}
                        disabled={
                          manageTickets.selectedRow.length > 1 ? false : true
                        }
                      >
                        {isMobile ? "" : t("_multiple_delete")}
                      </Button>
                    </MUI.FilterFile>
                  </Box>
                </MUI.TicketStyle>
                &nbsp;
              </CardHeaderTitle>

              {/* DataTable */}
              <DataGrid
                sx={{
                  borderRadius: 0,
                  height: "100% !important",
                  "& .MuiDataGrid-columnSeparator": { display: "none" },
                  "& .MuiDataGrid-virtualScroller": {
                    overflowX: "scroll",
                  },
                }}
                autoHeight
                rows={(manageTickets?.data || []).map((row) => ({
                  ...row,
                  id: row?._id,
                }))}
                key={(row) => row?._id}
                columns={columns}
                pageSize={100}
                getRowId={(row) => row?._id}
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 5 },
                  },
                }}
                pageSizeOptions={[5, 10]}
                checkboxSelection
                disableSelectionOnClick
                disableColumnFilter
                disableColumnMenu
                hideFooter
                onSelectionModelChange={handleSelectData}
              />

              {/* Pagination */}
              {manageTickets.total > 10 && (
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
                      currentPage={filter.data.currentPageNumber}
                      total={Math.ceil(
                        manageTickets.total / filter.data.pageLimit,
                      )}
                      setCurrentPage={(e) =>
                        filter.dispatch({
                          type: filter.ACTION_TYPE.PAGINATION,
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

      <DialogDeleteTicket
        isOpen={isDelete}
        onClose={closeDeleteToggle}
        onConfirm={handleMultipleDelete}
      />

      <DialogCloseTicket
        isOpen={isEdit}
        onClose={closeEditToggle}
        onConfirm={submitCloseTicket}
      />
      {/* <DialogTicketStatus
        isOpen={isEdit}
        dataEvent={dataForEvents.data}
        onClose={closeEditToggle}
        onConfirm={onReloadData}
      /> */}

      <DialogDeleteTicket
        isOpen={isDel}
        onClose={closeDelToggle}
        onConfirm={deleteTicket}
        label={dataLabel?.data?.title}
      />
    </Fragment>
  );
}

export default Ticket;
