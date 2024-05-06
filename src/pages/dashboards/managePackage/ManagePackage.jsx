import { useMutation } from "@apollo/client";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Paper,
  TextField,
  Typography,
  createTheme,
  useMediaQuery,
} from "@mui/material";
import Button from "@mui/material/Button";
import React, { useState } from "react";
import * as MUI from "../css/manageFile";
import "./../css/style.css";
import { DELETE_PACKAGE, UPDATE_PACKAGE } from "./apollo/index";
// icon
import { DataGrid } from "@mui/x-data-grid";
import { useTranslation } from "react-i18next";
import "react-responsive-pagination/themes/classic.css";
import { useNavigate } from "react-router-dom";
import { errorMessage, successMessage } from "../../../components/Alerts";
import NormalButton from "../../../components/NormalButton";
import PaginationStyled from "../../../components/PaginationStyled";
import { THEMES } from "../../../constants";
import {
  ConvertBinaryToByte,
  ConvertStorage,
  handleGraphqlErrors,
} from "../../../functions";
import * as Icon from "../../../icons/icons";
import DialogDeleteTicket from "../components/DialogDeleteTicket";
import DialogDeleteV1 from "../components/DialogDeleteV1";
import SelectV1 from "../components/SelectV1";
import DialogUpdatePackage from "./DialogUpdatePackage";
import useManagePackage from "./hooks/useManagePackage";
import usePackageFilter from "./hooks/usePackageFilter";
import usePermission from "../../../hooks/usePermission";
import useAuth from "../../../hooks/useAuth";

function ManagePackage() {
  const theme = createTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:768px)");
  const { user } = useAuth();
  const permission = usePermission(user?._id);
  const [deletePage] = useMutation(DELETE_PACKAGE);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [packageData, setPackageData] = useState([]);

  const [textColor, setTextColor] = React.useState("");
  const [bgColor, setBgColor] = React.useState("");
  const [textColors, setTextColors] = useState({
    hex: "#17766B",
    hsl: {
      h: "",
      s: "",
      l: "",
    },
    rgb: {
      r: "23",
      g: "118",
      b: "107",
    },
  });
  const [bgColors, setBgColors] = useState({
    hex: "#17766B",
    hsl: {
      h: "",
      s: "",
      l: "",
    },
    rgb: {
      r: "23",
      g: "118",
      b: "107",
    },
  });

  const [isMultipleDel, setIsMultipleDel] = useState(false);

  const [checked, setChecked] = React.useState(false);
  const [isDownload, setIsDownload] = React.useState(false);
  const [isCaptcha, setIsCaptcha] = React.useState(false);
  const [isBatch, setIsBatch] = useState(false);
  const [isUnlimit, setIsUnlimit] = useState(false);
  const [isExpiredLink, setIsExpiredLink] = useState(false);
  const [isDownloadFolder, setIsDownloadFolder] = useState(false);
  const [isRemoteUpload, setIsRemoteUpload] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);

  const [updatePackage] = useMutation(UPDATE_PACKAGE);

  const filter = usePackageFilter();
  const managePackage = useManagePackage({
    filter: filter.data,
  });

  const [dataPackage, setDataPackage] = useState({
    id: "",
    name: "",
    sort: "",
    desc: "",
    annualPrice: "",
    monthlyPrice: "",
    storage: "",
    multipleUpload: "",
    downloadPerday: "",
    uploadPerday: "",
    maxUploadSize: "",
    discount: 0,
    currency: "",
    converStorage: "GB",
    status: "active",
    convertMultipleUpload: "limit",
    convertUploadPerday: "limit",
    convertDownloadPerday: "limit",
    support: "",
    downLoadOption: "",
  });

  const handleSelectData = (data) => {
    const selectedOptionIds = data.map((dataId) => {
      const option = managePackage.data.find(
        (option) => parseInt(option._id) === parseInt(dataId),
      );
      if (option) {
        return option;
      }
      return "";
    });
    managePackage.setSelectedRow(selectedOptionIds);
  };

  const submitDelData = async () => {
    try {
      //
      let delValues = [...managePackage.selectedRow];

      delValues.forEach(async (value) => {
        await deletePage({
          variables: {
            id: value._id,
          },
          onCompleted: (val) => {
            if (val)
              setTimeout(() => {
                managePackage.customPackage();
              }, 100);
          },
        });
      });

      successMessage("Deleted package success", 3000);
    } catch (error) {
      let cutErr = error.message.replace(/(ApolloError: )?Error: /, "");
      errorMessage(handleGraphqlErrors(cutErr), 3000);
    }
  };

  const deleteHandleClose = () => {
    setDeleteOpen(false);
    setPackageData([]);
  };

  const editHandleClose = () => {
    setEditOpen(false);
  };

  function openIsMultipleDelete() {
    setIsMultipleDel(true);
  }

  function closeIsMultipleDelete() {
    managePackage.setSelectedRow([]);
    setIsMultipleDel(false);
  }

  const handleEdit = async () => {
    let convered = ConvertStorage({
      data: dataPackage.storage,
      byte: dataPackage.converStorage,
    });

    let updateDataPackage = {
      name: dataPackage.name,
      sort: dataPackage.sort,
      description: dataPackage.desc,
      storage: `${convered}`,
      multipleUpload: dataPackage.convertMultipleUpload,
      numberOfFileUpload:
        dataPackage.convertMultipleUpload === "limit"
          ? parseInt(dataPackage.multipleUpload || 0)
          : null,
      uploadPerDay: dataPackage.convertUploadPerday,
      fileUploadPerDay:
        dataPackage.convertUploadPerday === "limit"
          ? parseInt(dataPackage.uploadPerday || 0)
          : null,
      maxUploadSize: dataPackage.maxUploadSize,
      currencyId: parseInt(dataPackage.currency),
      status: dataPackage.status,
      support: dataPackage.support,
      downLoadOption: dataPackage.downLoadOption,
      textColor: textColors.hex,
      bgColor: bgColors.hex,
      // Boolean checked
      ads: checked ? 1 : 0,
      multipleDownload: isDownload ? 1 : 0,
      captcha: isCaptcha ? 1 : 0,
      batchDownload: isBatch ? 1 : 0,
      unlimitedDownload: isUnlimit ? 1 : 0,
      customExpiredLink: isExpiredLink ? 1 : 0,
      downloadFolder: isDownloadFolder ? 1 : 0,
      remoteUpload: isRemoteUpload ? 1 : 0,
      iosApplication: isIOS ? 1 : 0,
      androidApplication: isAndroid ? 1 : 0,
    };

    try {
      await updatePackage({
        variables: {
          id: dataPackage?.id,
          input: updateDataPackage,
        },
        onCompleted: () => {
          successMessage("Update a package success", 2000);
          setDataPackage({});
          setEditOpen(false);
          managePackage.customPackage();
        },
      });
    } catch (error) {
      let cutErr = error.message.replace(/(ApolloError: )?Error: /, "");
      errorMessage(handleGraphqlErrors(cutErr), 3000);
    }
  };

  const handleDelete = async () => {
    try {
      const result = await deletePage({
        variables: {
          id: packageData?._id,
        },
      });

      if (result.data?.deletePackage) {
        setTimeout(() => {
          managePackage.customPackage();
        }, 100);
        successMessage("Deleted package success", 2000);
      }
    } catch (error) {
      let cutErr = error.message.replace(/(ApolloError: )?Error: /, "");
      errorMessage(handleGraphqlErrors(cutErr), 3000);
    }
  };

  const columns = [
    {
      field: "index",
      headerName: t("_no"),
      width: 50,
    },

    {
      field: "name",
      headerName: t("_package_name"),
      flex: 1,
      minWidth: 80,
    },

    {
      field: "annualPrice",
      headerName: "Annual price",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "monthlyPrice",
      headerName: "Monthly price",
      flex: 1,
      minWidth: 120,
    },

    {
      field: "fullname",
      headerName: t("_user"),
      flex: 1,
      renderCell: (params) => {
        const value = params.row;
        return (
          <span>
            {value?.createdBy?.firstName} {value?.createdBy?.lastName}{" "}
          </span>
        );
      },
    },
    {
      field: "status",
      headerName: t("_status"),
      width: 100,
      renderCell: (params) => {
        const status = params.row.status;
        if (status === "active") {
          return (
            <div style={{ color: "green" }}>
              <Chip
                sx={{ backgroundColor: "#dcf6e8", color: "#29c770" }}
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
      headerName: t("_action"),
      width: 70,
      renderCell: (params) => {
        let storage = ConvertBinaryToByte({
          data: params?.row?.storage,
          byte: "GB",
        });

        let rowData = params?.row;
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              columnGap: (theme) => theme.spacing(2),
            }}
          >
            <NormalButton
              onClick={() => {
                if (permission?.hasPermission("package_edit")) {
                  setEditOpen(true);
                  setChecked(rowData.ads === 1 ? true : false);
                  setIsDownload(rowData.multipleDownload === 1 ? true : false);
                  setIsCaptcha(rowData.captcha === 1 ? true : false);
                  setIsBatch(rowData.batchDownload === 1 ? true : false);
                  setIsUnlimit(rowData.unlimitedDownload === 1 ? true : false);
                  setIsExpiredLink(
                    rowData.customExpiredLink === 1 ? true : false,
                  );
                  setIsDownloadFolder(
                    rowData.downloadFolder === 1 ? true : false,
                  );
                  setIsRemoteUpload(rowData.remoteUpload === 1 ? true : false);
                  setIsUnlimit(rowData.unlimitedDownload === 1 ? true : false);
                  setIsIOS(rowData.iosApplication === 1 ? true : false);
                  setIsAndroid(rowData.androidApplication === 1 ? true : false);

                  setTextColor(rowData.textColor || "#ccc");
                  setTextColors({
                    hex: rowData.textColor || "#ccc",
                    rgb: {
                      r: "",
                      g: "",
                      b: "",
                    },
                    hsl: {
                      h: "",
                      s: "",
                      l: "",
                    },
                  });
                  setBgColors({
                    hex: rowData.bgColor || "#fff",
                    // rgb: {
                    //   r: "",
                    //   g: "",
                    //   b: "",
                    // },
                    // hsl: {
                    //   h: "",
                    //   s: "",
                    //   l: "",
                    // },
                  });
                  setBgColor(rowData.bgColor || "#17766B");
                  setDataPackage({
                    id: rowData.packageId,
                    name: rowData.name,
                    desc: rowData.description,
                    storage: storage,

                    convertMultipleUpload: rowData.multipleUpload,
                    multipleUpload: rowData.numberOfFileUpload ?? "",

                    convertUploadPerday: rowData.uploadPerDay,
                    uploadPerday: rowData.fileUploadPerDay ?? "",

                    maxUploadSize: rowData.maxUploadSize,
                    discount: rowData.discount,
                    currency: rowData.currencyId._id,
                    converStorage: "GB",
                    status: rowData.status,
                    ads: rowData.ads,

                    sort: rowData.sort,
                    support: rowData.support,
                    downLoadOption: rowData.downLoadOption,

                    annualPrice: rowData.annualPrice,
                    monthlyPrice: rowData.monthlyPrice,
                  });
                }
              }}
              sx={{
                ...(!permission?.hasPermission("package_edit")
                  ? {
                      cursor: "not-allowed",
                      opacity: 0.5,
                    }
                  : {
                      opacity: 1,
                    }),
              }}
            >
              <Icon.Edit
                size="20px"
                color={theme.name === THEMES.DARK ? "white" : "grey"}
              />
            </NormalButton>

            <NormalButton
              onClick={() => {
                if (permission?.hasPermission("package_delete")) {
                  setDeleteOpen(true);
                  setPackageData(params?.row);
                }
              }}
              sx={{
                ...(!permission?.hasPermission("package_delete")
                  ? {
                      cursor: "not-allowed",
                      opacity: 0.5,
                    }
                  : {
                      opacity: 1,
                    }),
              }}
            >
              <Icon.Trash
                size="20px"
                color={theme.name === THEMES.DARK ? "white" : "grey"}
              />
            </NormalButton>
          </Box>
        );
      },
    },
  ];

  return (
    <React.Fragment>
      <Paper
        sx={{
          mt: (theme) => theme.spacing(3),
          boxShadow: (theme) => theme.baseShadow.secondary,
          flex: "1 1 0%",
        }}
      >
        <Card elevation={0}>
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              paddingLeft: "0 !important",
              paddingRight: "0 !important",
            }}
          >
            <Box
              sx={{
                padding: (theme) => `0 ${theme.spacing(4)}`,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                }}
              >
                {t("_package_titles")}
              </Typography>
              <MUI.ListFilter>
                <MUI.PackageSearchContainer>
                  <Box>
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
                  </Box>
                  <MUI.FilterFile sx={{ gap: "1rem" }}>
                    <TextField
                      placeholder={t("_search")}
                      size="small"
                      onChange={(e) =>
                        filter.dispatch({
                          type: filter.ACTION_TYPE.SEARCH,
                          payload: e.target.value,
                        })
                      }
                    />
                    <Button
                      variant="contained"
                      startIcon={<DeleteIcon />}
                      color="error"
                      size="small"
                      onClick={() => {
                        openIsMultipleDelete();
                      }}
                      disabled={
                        managePackage.selectedRow.length > 1 &&
                        permission?.hasPermission("package_delete")
                          ? false
                          : true
                      }
                    >
                      {isMobile ? "" : t("_multiple_delete")}
                    </Button>
                    <Button
                      sx={{
                        opacity: permission?.hasPermission("package_create")
                          ? 1
                          : 0.5,
                        cursor: permission?.hasPermission("package_create")
                          ? "pointer"
                          : "not-allowed",
                      }}
                      size="small"
                      variant="contained"
                      onClick={() => {
                        if (permission?.hasPermission("package_create")) {
                          navigate("/dashboard/create_package");
                        }
                      }}
                      startIcon={<AddIcon />}
                    >
                      {t("_create_new")}
                    </Button>
                  </MUI.FilterFile>
                </MUI.PackageSearchContainer>
              </MUI.ListFilter>
            </Box>
            &nbsp;
            <Box
              style={{
                width: "100%",
                flex: "1 1 0%",
              }}
            >
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
                columns={columns}
                rows={(managePackage.data || []).map((row) => ({
                  ...row,
                  _id: row?._id,
                }))}
                key={(row) => row?._id}
                getRowId={(row) => row?._id}
                AutoGenerateColumns="True"
                checkboxSelection
                disableSelectionOnClick
                disableColumnFilter
                disableColumnMenu
                hideFooter
                onSelectionModelChange={handleSelectData}
              />
            </Box>
            {managePackage.data?.length > filter.state.pageSize && (
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
                    currentPage={filter.data?.currentPageNumber}
                    total={Math.ceil(
                      managePackage.total / filter.data?.pageLimit,
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

      <DialogDeleteV1
        isOpen={deleteOpen}
        label={("Are you sure you want to delete", packageData?.name)}
        onClose={deleteHandleClose}
        onConfirm={handleDelete}
      />

      <DialogDeleteTicket
        isOpen={isMultipleDel}
        onClose={closeIsMultipleDelete}
        onConfirm={submitDelData}
      />

      <DialogUpdatePackage
        isOpen={editOpen}
        onClose={editHandleClose}
        onConfirm={handleEdit}
        setDataPackage={setDataPackage}
        dataPackage={dataPackage}
        textColor={textColor}
        textColors={textColors}
        setTextColor={setTextColor}
        setTextColors={setTextColors}
        bgColor={bgColor}
        bgColors={bgColors}
        setBgColor={setBgColor}
        setBgColors={setBgColors}
        // Toggle => on-off
        checked={checked}
        setChecked={setChecked}
        isDownload={isDownload}
        setIsDownload={setIsDownload}
        isCaptcha={isCaptcha}
        setIsCaptcha={setIsCaptcha}
        isBatch={isBatch}
        setIsBatch={setIsBatch}
        isUnlimit={isUnlimit}
        setIsUnlimit={setIsUnlimit}
        isExpiredLink={isExpiredLink}
        setIsExpiredLink={setIsExpiredLink}
        isDownloadFolder={isDownloadFolder}
        setIsRemoteUpload={setIsRemoteUpload}
        isIOS={isIOS}
        setIsIOS={setIsIOS}
        isAndroid={isAndroid}
        setIsAndroid={setIsAndroid}
      />
    </React.Fragment>
  );
}

export default ManagePackage;
