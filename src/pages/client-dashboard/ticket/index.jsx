import { Fragment, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  HeaderLayout,
  FormLayoutField,
  getColorStatus,
  TicketSectionContainer,
  HeaderTicketTitle,
  TickCardContent,
} from "./style";
import {
  Typography,
  Box,
  Button,
  InputAdornment,
  OutlinedInput,
  Chip,
  Paper,
  Card,
  useMediaQuery,
  IconButton,
} from "@mui/material";
import { GoSearch, GoPlus } from "react-icons/go";
import { DataGrid } from "@mui/x-data-grid";
import { DateFormat, indexPagination } from "../../../functions";
import IconReply from "@mui/icons-material/ForumSharp";
import useManageTicket from "../../dashboards/ticket/hooks/useManageTicket";
import useFilter from "../../dashboards/ticket/hooks/useTicket";
import PaginationStyled from "../../../components/PaginationStyled";
import useAuth from "../../../hooks/useAuth";
import heDecode from "he";
// import TicketGuide from "../../dashboards/components/TicketGuide";
// import TicketIntro from "../../dashboards/components/TicketIntro";
// import TicketPopular from "../../dashboards/components/TicketPopular";

function Ticket() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery("(max-width: 950px)");
  const filter = useFilter();
  const dataTicket = useManageTicket({ filter: filter.data });

  const columns = [
    {
      field: "index",
      headerName: "ID",
      sortable: false,
      minWidth: 100,
      headerAlign: "center",
      align: "center",
      renderCell: function (params) {
        return (
          <Box>
            {indexPagination({
              filter: filter?.state,
              index: params?.row?.index,
            })}
          </Box>
        );
      },
    },
    {
      field: "title",
      headerName: "Your Ticket",
      sortable: false,
      minWidth: 500,
      flex: 1,
      renderCell: (params) => {
        const row = params?.row;
        return (
          <Box sx={{ color: "#17766B", fontWeight: "600" }}>
            {heDecode.decode(row?.title)}
          </Box>
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 150,
      flex: 1,
      sortable: false,
      renderCell: (params) => {
        const status = params?.row?.status;
        return (
          <Chip
            label={status === "close" ? status + "d" : status}
            style={getColorStatus(status)}
          />
        );
      },
    },
    {
      field: "updatedAt",
      headerName: "Last Updated",
      sortable: false,
      minWidth: 200,
      flex: 1,
      renderCell: (params) => {
        const updatedAt = params?.row?.updatedAt;
        return <>{DateFormat(updatedAt)}</>;
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      sortable: false,
      minWidth: 100,
      renderCell: (params) => {
        const row = params?.row;
        return (
          <IconButton onClick={() => handleShowChat(row?._id)}>
            <IconReply />
          </IconButton>
        );
      },
    },
  ];

  useEffect(() => {
    filter.dispatch({
      type: filter.ACTION_TYPE.CREATED_BY,
      payload: user?._id,
    });
  }, []);

  function handleAddTicket() {
    navigate("new", { relativeTo: location.pathname });
  }

  function handleShowChat(id) {
    navigate(`reply/${id}`, { relativeTo: location.pathname });
  }

  return (
    <Fragment>
      <TicketSectionContainer sx={{ mt: 4 }}>
        <HeaderLayout>
          <Typography variant="h3" fontWeight={400}>
            Support Ticket
          </Typography>
        </HeaderLayout>

        <Paper
          sx={{
            mt: (theme) => theme.spacing(3),
            boxShadow: (theme) => theme.baseShadow.secondary,
            flex: "1 1 0",
          }}
        >
          <Card>
            <TickCardContent>
              <HeaderTicketTitle>
                <Typography variant="h2">List all Tickets</Typography>
              </HeaderTicketTitle>
              <FormLayoutField>
                <OutlinedInput
                  placeholder="Search"
                  size="small"
                  endAdornment={
                    <InputAdornment position="end">
                      <GoSearch />
                    </InputAdornment>
                  }
                  onChange={(e) => {
                    filter.dispatch({
                      type: filter.ACTION_TYPE.SEARCH,
                      payload: e.target.value || "",
                    });
                  }}
                />
                <Button variant="contained" onClick={handleAddTicket}>
                  {isMobile ? (
                    <GoPlus style={{ fontSize: "1.5rem" }} />
                  ) : (
                    "Create Ticket"
                  )}
                </Button>
              </FormLayoutField>
            </TickCardContent>
          </Card>

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
            rows={dataTicket.data || []}
            getRowId={(row) => row._id}
            columns={columns}
            AutoGenerateColumns="True"
            disableSelectionOnClick
            disableColumnFilter
            disableColumnMenu
            hideFooter
          />

          {/* Pagination */}
          {dataTicket.total > 10 && (
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
                  total={Math.ceil(dataTicket.total / filter.data.pageLimit)}
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
        </Paper>
      </TicketSectionContainer>

      {/* <TicketSectionContainer>
        <TicketGuide />
      </TicketSectionContainer> */}

      {/* <TicketSectionContainer>
        <TicketIntro />
      </TicketSectionContainer> */}

      {/* <TicketSectionContainer>
        <TicketPopular />
      </TicketSectionContainer> */}
    </Fragment>
  );
}

export default Ticket;
