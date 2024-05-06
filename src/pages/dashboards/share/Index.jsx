import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import OutlinedInput from "@mui/material/OutlinedInput";
import React, { useEffect, useMemo, useState } from "react";
import { BiEdit, BiTrash } from "react-icons/bi";
import Swal from "sweetalert2";

// component
import { useLazyQuery, useMutation } from "@apollo/client";
import { DataGrid } from "@mui/x-data-grid";
import { DateFormat } from "../../../functions";
import AppPagination from "../manageFile/AppPagination";
import * as MUI from "./../css/manageFile";
import "./../css/style.css";
import {
  DELETE_SHARE,
  QUERY_SHARE_ALL,
  UPDATE_STATUS_SHARE,
} from "./apollo/Index";

function Index() {
  const [getShareFiles, setGetShareFiles] = useState([]);
  const [getShare, { data, refetch: shareRefecth }] =
    useLazyQuery(QUERY_SHARE_ALL);
  const [multiData, setMultiData] = useState([]);
  const [updateShareStatus] = useMutation(UPDATE_STATUS_SHARE);
  const [deleteShare] = useMutation(DELETE_SHARE, {
    refetchQueries: [
      {
        query: QUERY_SHARE_ALL,
        variables: {
          where: {
            isShare: "yes",
            status: "active",
          },
        },
        awaitRefetchQueries: true,
      },
    ],
  });
  const [open, setOpen] = React.useState(false);
  const [status, setStatus] = React.useState("");
  const [id, setId] = useState("");
  const handleChange = (event) => {
    setStatus(event.target.value || "");
  };

  const handleClickOpen = (id, status) => {
    setOpen(true);
    setId(id);
    setStatus(status);
  };

  const handleClose = (event, reason) => {
    if (reason !== "backdropClick") {
      setOpen(false);
    }
  };

  const deleteHandle = async (id) => {
    await Swal.fire({
      title: "Do you want to delete?",
      confirmButtonText: "Delete",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#17766B",
      cancelButtonColor: "#EA5455",
    }).then((result) => {
      if (result.isConfirmed) {
        if (multiData.length > 1) {
          const deleted = deleteShare({
            variables: {
              id: multiData,
            },
          });
          if (deleted) {
            Swal.fire("Delete Success!", "", "success");
          }
          shareRefecth();
        } else {
          const deleted = deleteShare({
            variables: {
              id: id,
            },
          });
          if (deleted) {
            Swal.fire("Delete Success!", "", "success");
          }
          shareRefecth();
        }
      }
    });
  };

  useEffect(() => {
    const queryShare = async () => {
      const shared = await getShare({
        variables: {
          orderBy: "createdAt_DESC",
          limit: 20,
          where: {
            isShare: "yes",
          },
        },
      });
      setGetShareFiles(shared?.data?.getShare?.data);
    };
    queryShare();
  }, [data, getShareFiles]);

  // update
  const handleUpdateStatus = async () => {
    try {
      const updated = await updateShareStatus({
        variables: {
          id: id,
          body: {
            status: status,
          },
        },
      });
      if (updated) {
        Swal.fire("Update Success!", "", "success");
      }
      handleClose();
      shareRefecth();
    } catch (error) {
      Swal.fire("Update failed!", "", "error");
      handleClose();
    }
  };
  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 70,
    },
    {
      field: "created_At",
      headerName: "Date Shared",
      flex: 1,
      renderCell: (param) => {
        return <div>{DateFormat(param.row.createdAt)}</div>;
      },
    },
    {
      field: "fromAccount",
      headerName: "By User",
      flex: 1,
      renderCell: (param) => {
        return <div>{param.row.fromAccount?.username}</div>;
      },
    },
    {
      field: "toAccount",
      headerName: "To User",
      flex: 1,
      renderCell: (param) => {
        return <div>{param.row.toAccount?.username}</div>;
      },
    },
    {
      field: "permission",
      headerName: "Access Level",
      flex: 1,
      renderCell: (param) => {
        return <div>{param.row.permission}</div>;
      },
    },
    {
      field: "isPublic",
      headerName: "Is Global Share",
      flex: 1,
      renderCell: (param) => {
        return <div>{param.row.isPublic}</div>;
      },
    },
    {
      field: "accessedAt",
      headerName: "Last Accessed",
      flex: 1,
      renderCell: (param) => {
        return <div>{DateFormat(param.row.accessedAt)}</div>;
      },
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => {
        if (params?.formattedValue === "active") {
          return (
            <div style={{ color: "green" }}>
              <Chip
                sx={{ backgroundColor: "#dcf6e8", color: "#29c770" }}
                label={params.formattedValue}
                size="small"
              />
            </div>
          );
        } else if (params?.formattedValue === "deleted") {
          return (
            <div>
              <Chip
                sx={{ backgroundColor: "#ffefe1", color: "#ffa44f" }}
                label={params.formattedValue}
                color="error"
                size="small"
              />
            </div>
          );
        } else {
          return <div>{params.formattedValue}</div>;
        }
      },
    },
    {
      field: "Action",
      headerName: "Action",
      sortable: false,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <strong>
          <ButtonGroup variant="text" aria-label="outlined button group">
            <Button
              disabled={multiData.length > 1 ? true : false}
              onClick={() => handleClickOpen(params?.id, params?.row?.status)}
            >
              <BiEdit size="18px" color={multiData.length > 1 ? "" : "grey"} />
            </Button>
            <Button
              disabled={multiData.length > 1 ? true : false}
              onClick={() => deleteHandle(params?.id)}
            >
              <BiTrash size="18px" color={multiData.length > 1 ? "" : "grey"} />
            </Button>
          </ButtonGroup>
        </strong>
      ),
    },
  ];

  const rows = useMemo(
    () => getShareFiles.map((row) => ({ ...row, id: row._id })) || [],
    [getShareFiles],
  );
  const onRowsSelectionHandler = (ids) => {
    setMultiData(ids);
  };

  return (
    <div>
      <Box>
        <Card>
          <CardContent>
            <Typography variant="h3">Manage Sharing</Typography>
            <MUI.ListFilter>
              <MUI.FileManage>
                <MUI.FilterFile>
                  <Typography variant="p" sx={{ mt: 1 }}>
                    Filter
                  </Typography>
                  &nbsp;
                  <TextField variant="outlined" size="small" />
                </MUI.FilterFile>
                <MUI.FilterFile>
                  <Button
                    sx={{ display: multiData.length > 1 ? "" : "none" }}
                    hidden
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={deleteHandle}
                  >
                    More delete
                  </Button>
                </MUI.FilterFile>
              </MUI.FileManage>
            </MUI.ListFilter>
            <Box>
              <DataGrid
                autoHeight
                rows={rows}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 5 },
                  },
                }}
                AutoGenerateColumns="True"
                hideFooterPagination={true}
                hideFooterSelectedRowCount={true}
                checkboxSelection
                disableSelectionOnClick
                onSelectionModelChange={(ids) => onRowsSelectionHandler(ids)}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                width: "90%",
                mt: 3,
              }}
            >
              <AppPagination />
            </Box>
          </CardContent>
        </Card>

        <Dialog disableEscapeKeyDown open={open} onClose={handleClose}>
          <DialogTitle>Status</DialogTitle>
          <DialogContent>
            <Box component="form" sx={{ display: "flex", flexWrap: "wrap" }}>
              <FormControl sx={{ m: 1, minWidth: 350 }}>
                <InputLabel id="demo-dialog-select-label">Status</InputLabel>
                <Select
                  labelId="demo-dialog-select-label"
                  id="demo-dialog-select"
                  value={status}
                  onChange={handleChange}
                  input={<OutlinedInput label="Status" />}
                >
                  <MenuItem value="active">active</MenuItem>
                  <MenuItem value="deleted">delete</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions sx={{ mb: 3, mr: 5 }}>
            <Button
              variant="contained"
              color="error"
              sx={{ borderRadius: "6px" }}
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primaryTheme"
              sx={{ borderRadius: "6px" }}
              onClick={handleUpdateStatus}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </div>
  );
}

export default Index;
