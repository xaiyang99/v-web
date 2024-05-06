import { DataGrid } from "@mui/x-data-grid";
import { Base64 } from "js-base64";
import React from "react";
import { NavLink } from "react-router-dom";
import * as Mui from "../css/fileDropStyle";

// components
import { useLazyQuery, useMutation } from "@apollo/client";
import Swal from "sweetalert2";
import { errorMessage, successMessage } from "../../../components/Alerts";
import {
  generateRandomUniqueNumber,
  getDateFormate,
  getDateFormateYYMMDD,
} from "../../../functions";
import useAuth from "../../../hooks/useAuth";
import {
  CREATE_FILEDROP_LINK_CLIENT,
  DELETE_FILEDROP_LINK,
  QUERY_FILEDROP_LINKS,
} from "./apollo";

// material ui
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DownloadDoneIcon from "@mui/icons-material/DownloadDone";
import FileDownloadDoneIcon from "@mui/icons-material/FileDownloadDone";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import {
  Box,
  Button,
  Chip,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Tooltip from "@mui/material/Tooltip";
import CopyToClipboard from "react-copy-to-clipboard";
import { BiTrash } from "react-icons/bi";

function Index() {
  const user = useAuth();

  const link = process.env.REACT_APP_FILE_DROP_LINK;
  const [value, setValue] = React.useState(link);
  const [isCopy, setIsCopy] = React.useState(false);
  const [isCopied, setIsCopied] = React.useState({});
  // const [data, setData] = React.useState([]);
  // const [total, setTotal] = React.useState(0);
  const [selectDay, setSelectDay] = React.useState(1);
  const [expiredDate, setExpiredDate] = React.useState(null);
  const [isShow, setIsShow] = React.useState(false);

  const [createFileDropLink] = useMutation(CREATE_FILEDROP_LINK_CLIENT);
  const [deleteFiledropLink] = useMutation(DELETE_FILEDROP_LINK);
  const [queryFileDropLinks, { data: linkData, refetch: refetchDropLink }] =
    useLazyQuery(QUERY_FILEDROP_LINKS, { fetchPolicy: "no-cache" });

  // checked file pagination
  const generateFileDropLink = async () => {
    setIsCopy(false);
    const genLink = link + user?.user?._id + "-" + generateRandomUniqueNumber();
    setValue(genLink);
    try {
      let createfiledropLink = await createFileDropLink({
        variables: {
          input: {
            url: genLink,
            expiredAt:
              expiredDate == null
                ? getDateFormateYYMMDD(calculateExpirationDate(1))
                : expiredDate,
          },
        },
      });
      if (createfiledropLink?.data?.createPrivateFileDropUrl?._id) {
        setSelectDay(1);
        setExpiredDate(null);
        refetchDropLink();
        setIsShow(true);
        successMessage("Your new link is created!!", 3000);
      }
    } catch (error) {
      errorMessage("Something wrong! Please tray again", 2000);
    }
  };

  const handleCopyLink = () => {
    setIsCopy(true);
  };

  const queryFileDropLink = async () => {
    await queryFileDropLinks({
      variables: {
        where: {
          createdBy: user?.user?._id,
          status: "opening",
          folderIsNull: true,
        },
      },
    });
    // if (linkData) {
    //   setData(linkData?.getPrivateFileDropUrl?.data);
    //   setTotal(linkData?.getPrivateFileDropUrl?.total);
    // }
  };

  React.useEffect(() => {
    queryFileDropLink();
  }, [user?.user?._id]);

  const handleCopy = (url, id) => {
    successMessage("Link is copied!", 3000);
    setIsCopied((prev) => ({ ...prev, [id]: true }));
    navigator.clipboard.writeText(url);
    setTimeout(() => {
      setIsCopied((prev) => ({ ...prev, [id]: false }));
    }, 60000);
  };

  const handleDelete = async (id) => {
    await Swal.fire({
      title: "Do you want to delete?",
      confirmButtonText: "Delete",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#17766B",
      cancelButtonColor: "#EA5455",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const { data } = await deleteFiledropLink({
            variables: {
              id: id,
            },
          });

          if (data && data?.deleteFileDropUrl) {
            refetchDropLink();
            Swal.fire("Delete Success!", "", "success");
          } else {
            Swal.fire("Something went wrong during deletion!", "", "error");
          }
        } catch (error) {
          Swal.fire("Error during deletion!", "", "error");
        }
      }
    });
  };

  const calculateExpirationDate = (days) => {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + days);

    // Set a specific time (e.g., 12:00 PM)
    expirationDate.setHours(12, 0, 0, 0);
    return expirationDate.toISOString();
  };

  const handleExpiredDateChange = (event) => {
    const selectedDays = event.target.value;
    setSelectDay(selectedDays);

    const expirationDateTime = calculateExpirationDate(selectedDays);
    setExpiredDate(getDateFormateYYMMDD(expirationDateTime));
  };

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 70,
      headerAlign: "center",
      align: "center",
    },
    { field: "url", headerName: "URL", flex: 1 },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return (
          <div style={{ color: "green" }}>
            <Chip
              sx={{ backgroundColor: "#dcf6e8", color: "#29c770" }}
              label={params?.row?.status}
              size="small"
            />
          </div>
        );
      },
    },
    {
      field: "folderId",
      headerName: "Source",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const folder = params?.row?.folderId?.folder_name;
        return (
          <div style={{ color: "green" }}>
            <Chip
              sx={{
                backgroundColor: folder ? "#FFEFE1" : "#dcf6e8",
                color: folder ? "#FFA44F" : "#29c770",
              }}
              label={folder ? "/" + folder : "public"}
              size="small"
            />
          </div>
        );
      },
    },
    {
      field: "createdAt",
      headerName: "Created date",
      flex: 1,
      renderCell: (params) => {
        return (
          <div>
            <span>{getDateFormate(params?.row?.createdAt)}</span>
          </div>
        );
      },
    },
    {
      field: "expiredAt",
      headerName: "Expired date",
      flex: 1,
      renderCell: (params) => {
        return (
          <div>
            <span>{getDateFormate(params?.row?.expiredAt)}</span>
          </div>
        );
      },
    },
    {
      field: "Action",
      headerName: "Action",
      sortable: false,
      headerAlign: "center",
      align: "center",
      flex: 1,
      renderCell: (params) => (
        <strong>
          <Tooltip title="Copy file drop link" placement="top">
            {isCopied[params?.row?._id] ? (
              <IconButton disabled>
                <FileDownloadDoneIcon sx={{ color: "#17766B" }} />
              </IconButton>
            ) : (
              <IconButton
                onClick={() => handleCopy(params?.row?.url, params?.row?._id)}
              >
                <ContentCopyIcon sx={{ fontSize: "16px" }} />
              </IconButton>
            )}
          </Tooltip>
          <Tooltip title="View details" placement="top">
            <IconButton
              component={NavLink}
              to={`/file-drop-detail/${Base64.encode(params?.row?.url)}`}
            >
              <RemoveRedEyeIcon sx={{ fontSize: "18px" }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete" placement="top">
            <IconButton onClick={() => handleDelete(params?.row?._id)}>
              <BiTrash size="18px" />
            </IconButton>
          </Tooltip>
        </strong>
      ),
    },
  ];

  return (
    <Typography
      component="div"
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Mui.PaperGlobal>
        <Mui.FiledropContainer>
          <Mui.ShowHeaderDetail>
            <Typography variant="h3">
              Select expired date to this link! Default: 24 hours
            </Typography>
            <Typography variant="h6">
              Please share this link with the intended recipient of the file.
            </Typography>
          </Mui.ShowHeaderDetail>
          <Mui.GenerateLinkArea>
            <FormControl sx={{ width: "20%" }} size="small">
              <InputLabel id="demo-simple-select-label">
                Expired date
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectDay}
                label="Expired date"
                onChange={handleExpiredDateChange}
              >
                <MenuItem value={1}>1 day after created</MenuItem>
                <MenuItem value={2}>2 days after created</MenuItem>
                <MenuItem value={3}>3 days after created</MenuItem>
              </Select>
            </FormControl>
            <TextField
              sx={{
                width: "75%",
                fontSize: "18px !important",
                color: "grey !important",
              }}
              size="small"
              InputLabelProps={{
                shrink: false,
              }}
              disabled
              value={value == link ? "Link to upload..." : value}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {isCopy ? (
                      <IconButton>
                        <DownloadDoneIcon sx={{ color: "#17766B" }} />
                      </IconButton>
                    ) : (
                      <CopyToClipboard
                        text={value}
                        onCopy={handleCopyLink}
                        sx={{ cursor: "copy" }}
                      >
                        <IconButton
                          aria-label="copy"
                          disabled={value == link ? true : false}
                        >
                          <ContentCopyIcon sx={{ fontSize: "1rem" }} />
                        </IconButton>
                      </CopyToClipboard>
                    )}
                  </InputAdornment>
                ),
              }}
            />
          </Mui.GenerateLinkArea>
          <Box
            sx={{
              display: "flex",
              alignItems: "start",
              justifyContent: "start",
              flexDirection: "column",
            }}
          >
            {isShow && (
              <Typography
                variant=""
                sx={{ fontSize: "0.8rem", color: "#4B465C" }}
              >
                This link: <span style={{ color: "#17766B" }}>{value}</span>{" "}
                will be expired on: &nbsp;
                <span style={{ color: "#17766B" }}>
                  {expiredDate
                    ? expiredDate
                    : getDateFormateYYMMDD(calculateExpirationDate(1))}
                  .
                </span>
              </Typography>
            )}
            <Button
              variant="contained"
              onClick={generateFileDropLink}
              sx={{ mt: 4 }}
            >
              Generate link now
            </Button>
          </Box>
        </Mui.FiledropContainer>
      </Mui.PaperGlobal>
      <Mui.PaperGlobal sx={{ marginTop: "1.5rem", flex: 1 }}>
        <Typography variant="h4">
          Comprehensive inventory of all file drops
        </Typography>
        <div style={{ width: "100%", marginTop: "1rem", height: "100%" }}>
          <DataGrid
            rows={linkData?.getPrivateFileDropUrl?.data || []}
            getRowId={(row) => row?._id}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            pageSizeOptions={[5, 10]}
            checkboxSelectionVisible={true}
          />
        </div>
      </Mui.PaperGlobal>
    </Typography>
  );
}

export default Index;
