import { useMutation } from "@apollo/client";
import AddIcon from "@mui/icons-material/Add";
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
import { DataGrid } from "@mui/x-data-grid";
import moment from "moment";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { errorMessage, successMessage } from "../../../components/Alerts";
import NormalButton from "../../../components/NormalButton";
import PaginationStyled from "../../../components/PaginationStyled";
import { THEMES } from "../../../constants";
import {
  indexPagination,
  isValidEmail,
  validatePhoneRegExp,
} from "../../../functions";
import * as Icon from "../../../icons/icons";
import useFilterAnnouncement from "../announcement/hooks/useFilterAnnouncement";
import DialogDeleteV1 from "../components/DialogDeleteV1";
import SelectV1 from "../components/SelectV1";
import * as MUI from "../css/manageFile";
import Reload from "../help/Reload";
import UseAction from "../help/hooks/useAction";
import Dialog from "./Dialog";
import { CREATE_COUPON, DELETE_COUPON, SEND_COUPON_CODE } from "./apollo";
import useManageCoupon from "./hooks/useManageCoupon";
import useUpdateCoupon from "./hooks/useUpdateCoupon";
import { useTranslation } from "react-i18next";

function CouponDetail() {
  const theme = createTheme();
  const [t] = useTranslation();
  const isMobile = useMediaQuery("(max-width:768px)");
  const params = useParams();
  const [createCoupon] = useMutation(CREATE_COUPON);
  const [deleteCoupon] = useMutation(DELETE_COUPON);
  const [sendCouponCode] = useMutation(SEND_COUPON_CODE);
  const filter = useFilterAnnouncement();
  filter.data.id = parseInt(params.id);
  const manageCoupon = useManageCoupon({ filter: filter.data });
  const [loading, setLoading] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteMultiOpen, setDeleteMultiOpen] = useState(false);
  const [sendOpen, setSendOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [isSubmit, setIsSubmit] = useState(null);
  const [dataForEvents, setDataForEvents] = React.useState({
    action: null,
    type: null,
    data: {},
  });
  const handleUpdateStatus = useUpdateCoupon(isSubmit, "sent");

  const resetDataForEvents = () => {
    setDataForEvents((state) => ({
      ...state,
      action: null,
      data: {},
    }));
  };
  React.useEffect(() => {
    if (isSubmit) {
      handleUpdateStatus(isSubmit, "sent");
    }
  }, [isSubmit]);
  const sendHandleClose = () => {
    setSendOpen(false);
    resetDataForEvents();
  };
  const createHandleClose = () => {
    setCreateOpen(false);
    resetDataForEvents();
  };
  const deleteHandleClose = () => {
    setDeleteOpen(false);
    resetDataForEvents();
  };
  const deleteMultiHandleClose = () => {
    setDeleteMultiOpen(false);
    resetDataForEvents();
  };
  const handleLoadingClose = () => {
    setLoading(false);
  };

  const handleSend = async () => {
    try {
      if (!dataForEvents.data.send) {
        throw new Error("required");
      } else if (
        dataForEvents.data.action === "whatsapp"
          ? !validatePhoneRegExp(dataForEvents.data.send)
          : ""
      ) {
        throw new Error("Example: 20 7885 6194");
      } else if (
        dataForEvents.data.action === "email"
          ? !isValidEmail(dataForEvents.data.send)
          : ""
      ) {
        throw new Error("Example: John@gmail.com");
      }
      switch (dataForEvents.data.action) {
        case "whatsapp":
          if (dataForEvents.data.send) {
            let message = "Hi, save code to verify :";
            const sanitizedNumber = dataForEvents.data.send
              .replace(/[^\w\s]/gi, "")
              .replace(/ /g, "");
            const url = `https://web.whatsapp.com/send?phone=${sanitizedNumber}&text=${encodeURI(
              message + dataForEvents.data.code
            )}&app_absent=0`;

            window.open(url);
            setIsSubmit(dataForEvents.data._id);
          }
          sendHandleClose();
          setTimeout(() => {
            manageCoupon.customQueryCoupon();
          }, 100);
          break;
        case "email":
          setLoading(true);
          await sendCouponCode({
            variables: {
              data: {
                code: parseInt(dataForEvents.data.code),
                customerEmail: dataForEvents.data.send,
              },
            },
            onCompleted: () => {
              successMessage("Send code success", 2000);
              sendHandleClose();
              manageCoupon.customQueryCoupon();
              setLoading(false);
            },
          });
          break;
        default:
      }
    } catch (error) {
      setDataForEvents((state) => ({
        ...state,
        data: { ...state.data, error: error.message },
      }));
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      deleteCoupon({
        variables: {
          where: {
            _id: parseInt(dataForEvents.data?._id),
          },
        },
        onCompleted: () => {
          successMessage("Delete Coupon success", 2000);
          setLoading(false);
          manageCoupon.customQueryCoupon();
        },
      });
    } catch (error) {
      errorMessage("Delete coupon failed", 2000);
    }
  };
  const handleMultiDelete = async () => {
    setLoading(true);
    try {
      for (let i = 0; i < manageCoupon.selectedRow.length; i++) {
        deleteCoupon({
          variables: {
            where: {
              _id: manageCoupon.selectedRow[i]?._id,
            },
          },
          onCompleted: () => {
            manageCoupon.customQueryCoupon();
          },
        });
      }
      setLoading(false);
      successMessage("Delete Coupon success", 2000);
    } catch (error) {
      errorMessage("Delete filed please try again ", 2000);
    }
  };
  React.useEffect(() => {
    if (dataForEvents.action && dataForEvents.data) {
      menuOnClick(dataForEvents.action);
    }
  }, [dataForEvents.action]);

  const menuOnClick = async (action) => {
    const currentDate = moment(new Date()).format("YYYY-MM-DD");
    const startDate = moment(dataForEvents.data.typeCouponID.startDate).format(
      "YYYY-MM-DD"
    );

    const endDate = moment(dataForEvents.data.typeCouponID.expird).format(
      "YYYY-MM-DD"
    );

    switch (action) {
      case "delete":
        setDeleteOpen(true);
        break;
      case "send":
        if (
          dataForEvents.data?.typeCouponID?.status === "active" &&
          dataForEvents.data.status === "available" &&
          currentDate >= startDate &&
          currentDate <= endDate
        ) {
          setDataForEvents((state) => ({
            ...state,
            data: { ...state.data, action: "email" },
          }));
          setSendOpen(true);
        } else {
          resetDataForEvents();
          errorMessage("This coupon type inactive or expired date", 2000);
        }
        break;
      default:
        return;
    }
  };
  const handleCreate = async () => {
    await createCoupon({
      variables: {
        data: {
          totalCreate: parseInt(dataForEvents.data.total),
          typeCouponID: parseInt(params.id),
        },
      },
      onCompleted: () => {
        manageCoupon.customQueryCoupon();
        createHandleClose();
        successMessage("Create new coupon success", 2000);
      },
    });
  };

  const hanleSelect = (data) => {
    const selectedOptionIds = data.map((dataId) => {
      const option = manageCoupon.data.find(
        (option) => parseInt(option._id) === parseInt(dataId)
      );
      if (option) {
        return option;
      }
      return "";
    });
    manageCoupon.setSelectedRow(selectedOptionIds);
  };
  const columns = [
    {
      field: "id",
      headerName: t("_no"),
      width: 50,
      sortable: false,
      renderCell: (params) => {
        return (
          <div>
            <span>
              {indexPagination({
                filter: filter?.state,
                index: params?.row?.no,
              })}
            </span>
          </div>
        );
      },
    },
    {
      field: "code",
      headerName: t("_code"),
      flex: 1,
      minWidth: 200,
      sortable: false,
    },
    {
      field: "unit",
      headerName: t("_unit"),
      flex: 1,
      minWidth: 100,
      sortable: false,
      renderCell: (params) => {
        return (
          <span>
            {params.row.typeCouponID.actionCoupon} &nbsp;
            {params.row.typeCouponID.unit}
          </span>
        );
      },
    },
    {
      field: "status",
      headerName: t("_status"),
      width: 100,
      sortable: false,
      renderCell: (params) => {
        const status = params.row.status;
        if (status === "available") {
          return (
            <div style={{ color: "green" }}>
              <Chip
                sx={{ backgroundColor: "#dcf6e8", color: "#29c770" }}
                label={status}
                size="small"
              />
            </div>
          );
        } else if (status === "send") {
          return (
            <div>
              <Chip
                sx={{ backgroundColor: "#dcf6e8", color: "#bac729" }}
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
      width: 150,
      sortable: false,
      headerAlign: "right",
      align: "right",
      renderCell: (params) => {
        return (
          <div>
            <UseAction
              status={3}
              data={params.row}
              event={{
                handleEvent: (action, data) => {
                  setDataForEvents(action, data);
                },
              }}
            />
          </div>
        );
      },
    },
  ];
  return (
    <div>
      <Paper
        sx={{
          mt: (theme) => theme.spacing(3),
          boxShadow: (theme) => theme.baseShadow.secondary,
          flex: "1 1 0%",
        }}
      >
        <Card>
          <CardContent>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
              }}
            >
              {t("_coupon_title")}
            </Typography>
            <MUI.ListFilter>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
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
                      onChange: (e) =>
                        filter.dispatch({
                          type: filter.ACTION_TYPE.PAGE_ROW,
                          payload: e?.value || null,
                        }),
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
                        filter.dispatch({
                          type: filter.ACTION_TYPE.TITLE,
                          payload: e.target.value,
                        });
                      }}
                      onBlur={(e) => {
                        filter.dispatch({
                          type: filter.ACTION_TYPE.TITLE,
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
                    <NormalButton
                      {...(manageCoupon.selectedRow.length && {
                        onClick: () => setDeleteMultiOpen(true),
                      })}
                      sx={{
                        padding: "0 10px",
                        height: "35px",
                        alignItems: "center",
                        border: "1px solid",
                        ml: 3,
                        borderColor:
                          theme.name === THEMES.DARK
                            ? "rgba(255,255,255,0.4)"
                            : "rgba(0,0,0,0.4)",
                        borderRadius: "4px",
                        ...(manageCoupon.selectedRow.length < 2
                          ? {
                              cursor: "default",
                              opacity: 0.5,
                            }
                          : {
                              "&:hover": {
                                borderColor:
                                  theme.name === THEMES.DARK
                                    ? "rgb(255,255,255)"
                                    : "rgb(0,0,0)",
                              },
                            }),
                      }}
                    >
                      {!isMobile && (
                        <Box
                          sx={{
                            flex: "1 1 0%",
                            color:
                              theme.name === THEMES.DARK
                                ? "rgb(255,255,255)"
                                : "rgb(0,0,0)",
                          }}
                        >
                          {t("_multiple_delete")}
                        </Box>
                      )}
                      <Box sx={{}}>
                        <Icon.Trash
                          style={{
                            fontSize: "1.25rem",
                            color:
                              theme.name === THEMES.DARK
                                ? "rgb(255,255,255)"
                                : "rgb(0,0,0,0.7)",
                          }}
                        />
                      </Box>
                    </NormalButton>
                  </MUI.FilterFile>
                  <MUI.FilterFile>
                    <NormalButton
                      sx={{
                        ml: 2,
                        height: "35px",
                        width: "100%",
                        alignItems: "center",
                        border: "1px solid",
                        padding: (theme) => theme.spacing(3),
                        borderColor: (theme) => theme.palette.primaryTheme.main,
                        backgroundColor: (theme) =>
                          theme.palette.primaryTheme.main,
                        borderRadius: "4px",
                        color: "white !important",
                        justifyContent: "center",
                      }}
                      onClick={() => {
                        setCreateOpen(true);
                      }}
                    >
                      <AddIcon />
                      {isMobile ? "" : t("_create_new")}
                    </NormalButton>
                  </MUI.FilterFile>
                </Box>
              </Box>
            </MUI.ListFilter>
            &nbsp;
            <Box
              style={{
                width: "100%",
                flex: "1 1 0%",
              }}
            >
              <DataGrid
                autoHeight
                rows={manageCoupon?.data || []}
                getRowId={(row) => row._id}
                columns={columns}
                AutoGenerateColumns="True"
                checkboxSelection
                disableSelectionOnClick
                disableColumnFilter
                hideFooter
                onSelectionModelChange={(ids) => {
                  manageCoupon.setSelectedRow(ids);
                  hanleSelect(ids);
                }}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              {manageCoupon?.total > 0 && (
                <Box
                  sx={{
                    padding: (theme) => theme.spacing(4),
                  }}
                >
                  Showing {filter?.state?.currentPageNumber} to &nbsp;
                  {filter?.state?.pageLimit} &nbsp;of&nbsp;
                  {manageCoupon?.total} &nbsp; entries
                </Box>
              )}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  padding: (theme) => theme.spacing(4),
                  flex: "1 1 0%",
                }}
              >
                {filter.state?.pageLimit < manageCoupon?.total && (
                  <PaginationStyled
                    currentPage={filter.data?.currentPageNumber}
                    total={Math.ceil(
                      manageCoupon?.total / filter.data?.pageLimit
                    )}
                    setCurrentPage={(e) =>
                      filter.dispatch({
                        type: filter.ACTION_TYPE.PAGINATION,
                        payload: e,
                      })
                    }
                  />
                )}
              </Box>
            </Box>
          </CardContent>
        </Card>
        <Reload isOpen={loading} onClose={handleLoadingClose} />
        <DialogDeleteV1
          isOpen={deleteOpen}
          onClose={deleteHandleClose}
          onConfirm={handleDelete}
          label={`code coupon ${dataForEvents.data?.code} `}
        />
        {deleteMultiOpen && (
          <DialogDeleteV1
            isOpen={deleteMultiOpen}
            onClose={deleteMultiHandleClose}
            onConfirm={handleMultiDelete}
            label="multi items? This action is irreversible. Confirm?"
          />
        )}
        <Dialog
          status={2}
          isOpen={createOpen}
          onClose={createHandleClose}
          onClick={handleCreate}
          setDataForEvents={setDataForEvents}
          dataForEvents={dataForEvents}
          label={t("_create_coupon_title")}
          disableDefaultButton
        />
        {sendOpen && (
          <Dialog
            status={1}
            isOpen={sendOpen}
            onClose={sendHandleClose}
            onClick={handleSend}
            setDataForEvents={setDataForEvents}
            dataForEvents={dataForEvents}
            label="Send coupon"
            desc="Invate your friend to sneat, if thay sign up, you and your friend will get 30 days free trial"
          />
        )}
      </Paper>
    </div>
  );
}

export default CouponDetail;
