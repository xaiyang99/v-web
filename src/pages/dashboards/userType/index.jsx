import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Chip,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import Banner from "../components/Banner";
import { DataGrid } from "@mui/x-data-grid";
import { useLazyQuery, useMutation } from "@apollo/client";
import {
  DELETE_USER_TYPE,
  MUTATION_UPDATE_USER_TYPE,
  MUTATION_USER_TYPE,
  QUERY_USER_TYPE,
} from "./apollo";
import { errorMessage, successMessage } from "../../../components/Alerts";
import DeleteIcon from "@mui/icons-material/Delete";
import DialogDelete from "../components/DialogDelete";
import "./../css/style.css";
import { BiEdit, BiTrash } from "react-icons/bi";

function UserType() {
  const [createUserType] = useMutation(MUTATION_USER_TYPE);
  const [upateUserType] = useMutation(MUTATION_UPDATE_USER_TYPE);
  const [getUser_Type, { data: user_Type_data, refetch: user_typeRefetch }] =
    useLazyQuery(QUERY_USER_TYPE);
  const [listUserType, setListUserType] = useState([]);
  const [name, setName] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(Boolean(false));
  const [id, setId] = useState("");
  const [deleteName, setDeleteName] = useState("");
  const [errMessage, setErrMessage] = useState("");
  const hide = () => setErrMessage(false);
  const [deleteRole] = useMutation(DELETE_USER_TYPE);
  const [multiId, setMultiId] = React.useState([]);
  const [status, setStatus] = useState("");
  const deleteHandleClose = () => {
    setDeleteOpen(false);
  };
  const deleteHandle = () => {
    setDeleteOpen(true);
  };
  // get user type
  React.useEffect(() => {
    const queryUserType = async () => {
      const userType = await getUser_Type({
        variables: {
          orderBy: "createdAt_DESC",
        },
      });
      if (userType) {
        setListUserType(userType?.data?.getUserType?.data);
      }
    };
    queryUserType();
    user_typeRefetch();
  }, [user_Type_data, getUser_Type]);

  // create use type
  const handleCreate_user_type = async () => {
    try {
      // edit
      if (name && id) {
        const updateUserType = await upateUserType({
          variables: {
            id: id,
            body: {
              status: status,
              name: name,
            },
          },
        });
        if (updateUserType) {
          successMessage("Update use type success!!", 3000);
          setName("");
          setId("");
          setStatus("");
          user_typeRefetch();
        }
      } else {
        if (name) {
          const userType = await createUserType({
            variables: {
              body: {
                name: name,
                status: "active",
              },
            },
          });

          if (userType) {
            successMessage("add user type success", 3000);
            setName("");
            user_typeRefetch();
          }
        } else {
          setErrMessage("Please enter user type !");
          setTimeout(hide, 3000);
        }
      }
    } catch (error) {
      if (error.message) {
        errorMessage("User type allready exits !", 3000);
      }
    }
  };

  // handle delete
  const deleteUserTypeHandle = async () => {
    try {
      let deleted = await deleteRole({
        variables: {
          id: id,
        },
      });
      if (deleted) {
        successMessage("Deleted user type success!!", 3000);
      }
      deleteHandleClose();
      user_typeRefetch();
    } catch (error) {
      errorMessage("something wrong");
    }
  };
  const hanleEditUserType = (id, name, status) => {
    setId(id);
    setName(name);
    setStatus(status);
  };
  // delete multi
  const handleDeleteMultiRole = async () => {
    try {
      let deleted = await deleteRole({
        variables: {
          id: multiId,
        },
      });
      if (deleted) {
        deleteHandleClose();
        successMessage("Deleted use type success!!", 3000);
      }
      user_typeRefetch();
    } catch (error) {
      errorMessage("something wrong");
    }
  };

  const handleCancel = () => {
    setName("");
    setId("");
  };
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "User Type", flex: 1 },
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
        } else if (params?.formattedValue === "inactive") {
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
      field: "actions",
      headerName: "Actions",
      sortable: false,
      headerAlign: "center",
      aligg: "center",
      renderCell: (params) => {
        return (
          <strong>
            <ButtonGroup variant="text" aria-label="outlined button group">
              <Button
                disabled={multiId.length > 1 ? true : false}
                onClick={() =>
                  hanleEditUserType(
                    params?.id,
                    params?.row?.name,
                    params?.row?.status
                  )
                }
              >
                <BiEdit size="18px" color={multiId.length > 1 ? "" : "grey"} />
              </Button>
              <Button
                disabled={multiId.length > 1 ? true : false}
                onClick={() =>
                  deleteHandle(
                    setId(params?.id),
                    setDeleteName(params?.row?.name)
                  )
                }
              >
                <BiTrash size="18px" color={multiId.length > 1 ? "" : "grey"} />
              </Button>
            </ButtonGroup>
          </strong>
        );
      },
    },
  ];
  const rows = useMemo(
    () => listUserType.map((row) => ({ ...row, id: row._id })),
    [listUserType]
  );
  const onRowsSelectionHandler = (ids) => {
    setMultiId(ids);
    // const selectedRowsData = ids.map((id) => rows.find((row) => row.id === id));
  };

  return (
    <div>
      <React.Fragment>
        <Banner />
        <Paper>
          <Container maxWidth="xl">
            <Grid container spacing={8} mt={5}>
              <Grid item xs={12} md={6} sx={{ height: "700px" }}>
                <Box sx={{ display: "flex" }}>
                  <h2>List all user type</h2>
                  <Box>
                    <Button
                      startIcon={<DeleteIcon />}
                      color="error"
                      variant="contained"
                      onClick={handleDeleteMultiRole}
                      sx={{
                        display: multiId.length > 1 ? "" : "none",
                        mt: 3,
                        ml: 3,
                        borderRadius: "6px",
                      }}
                    >
                      Delete
                    </Button>
                  </Box>
                </Box>
                <DataGrid
                  disableColumnFilter={true}
                  rows={rows}
                  columns={columns}
                  hideFooterPagination={true}
                  hideFooterSelectedRowCount={true}
                  checkboxSelection
                  disableSelectionOnClick
                  onSelectionModelChange={(ids) => onRowsSelectionHandler(ids)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ mt: 5 }}>
                  <Typography variant="h4" sx={{ mb: 3 }}>
                    {name && id ? "Update user type" : "Add user type"}
                  </Typography>
                  <Box>
                    <TextField
                      fullWidth
                      required
                      sx={{ mt: 3, mb: 3 }}
                      id="outlined-basic"
                      label={name && id ? "Update user type" : "Add user type"}
                      variant="outlined"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    {errMessage && (
                      <Typography variant="body" color="error" sx={{ ml: 3 }}>
                        {errMessage}
                      </Typography>
                    )}
                  </Box>

                  {id && status ? (
                    <FormControl fullWidth sx={{ mt: 3, mb: 2 }}>
                      <InputLabel id="demo-simple-select-label">
                        Status
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                      >
                        <MenuItem value="active">active</MenuItem>
                        <MenuItem value="inactive">inactive</MenuItem>
                      </Select>
                    </FormControl>
                  ) : (
                    ""
                  )}

                  {name && id ? (
                    <Box>
                      <Button
                        type="sumbit"
                        sx={{ mt: 3, borderRadius: "6px" }}
                        color="error"
                        variant="contained"
                        onClick={handleCancel}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="sumbit"
                        sx={{ mt: 3, ml: 3, borderRadius: "6px" }}
                        color="primaryTheme"
                        variant="contained"
                        onClick={handleCreate_user_type}
                      >
                        Update User Type
                      </Button>
                    </Box>
                  ) : (
                    <Button
                      type="sumbit"
                      sx={{ mt: 3, ml: 3, borderRadius: "6px" }}
                      color="primaryTheme"
                      variant="contained"
                      onClick={handleCreate_user_type}
                    >
                      Add User Type
                    </Button>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Paper>
        <DialogDelete
          open={deleteOpen}
          onClose={deleteHandleClose}
          title={`If You Delete user type "${deleteName}" !`}
          onClick={deleteUserTypeHandle}
        />
      </React.Fragment>
    </div>
  );
}

export default UserType;
