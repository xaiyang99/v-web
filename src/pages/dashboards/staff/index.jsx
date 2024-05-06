import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Paper,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { useMemo, useRef, useState } from "react";
import { CSVLink } from "react-csv";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";

// components
import { useMutation } from "@apollo/client";
import * as MUI from "../css/manageFile";
// import useAuth from "../../../hooks/useAuth";
import moment from "moment";
import { errorMessage, successMessage } from "../../../components/Alerts";
import {
  ConvertBytetoMBandGB,
  getFileNameExtension,
  indexPagination,
  isValueOrNull,
} from "../../../functions";
import "./../css/style.css";
// icon
import "react-responsive-pagination/themes/classic.css";
import { v4 as uuid } from "uuid";
import NormalButton from "../../../components/NormalButton";
import PaginationStyled from "../../../components/PaginationStyled";
import { THEMES } from "../../../constants";
import useAuth from "../../../hooks/useAuth";
import usePermission from "../../../hooks/usePermission";
import * as Icon from "../../../icons/icons";
import regexPatterns from "../../../regexPatterns";
import { DATE_PATTERN_FORMAT } from "../../../utils/date";
import DialogDeleteV1 from "../components/DialogDeleteV1";
import DialogForm from "../components/DialogForm";
import DialogPreviewUser from "../components/DialogPreviewUser";
import SelectV1 from "../components/SelectV1";
import {
  MUTATION_CREATE_STAFF,
  MUTATION_DELETE_STAFF,
  MUTATION_UPDATE_STAFF,
} from "./apollo";
import useFilter from "./hooks/useFilter";
import useManageStaffs from "./hooks/useManageStaffs";
import useSelectCountries from "./hooks/useSelectCountries";
import useSelectRoles from "./hooks/useSelectRoles";

const {
  REACT_APP_BUNNY_URL,
  REACT_APP_BUNNY_PULL_ZONE,
  REACT_APP_ACCESSKEY_BUNNY,
  REACT_APP_ZONE_PROFILE,
} = process.env;

const createStaffValidationSchema = Yup.object().shape({
  firstName: Yup.string().trim("Required").required("Required"),
  lastName: Yup.string().trim("Required").required("Required"),
  username: Yup.string().trim("Required").required("Required"),
  password: Yup.string()
    .trim("Required")
    .min(8, "Password must be at least 8 characters")
    .required("Required"),
  rePassword: Yup.string()
    .required("Required")
    .oneOf([Yup.ref("password"), null], "Passwords must match"),
  gender: Yup.lazy((value) => {
    switch (typeof value) {
      case "object":
        return Yup.object()
          .shape({
            label: Yup.string(),
            value: Yup.string(),
          })
          .required("Required");
      default:
        return Yup.string().required("Required");
    }
  }),
  birthDay: Yup.string().trim("Required").required("Required"),
  phone: Yup.string().trim("Required").required("Required"),
  district: Yup.string().trim("Required"),
  email: Yup.string()
    .trim("Required")
    .matches(regexPatterns.email, { message: "Invalid email address" })
    .required("Required"),
  country: Yup.lazy((value) => {
    switch (typeof value) {
      case "object":
        return Yup.object()
          .shape({
            label: Yup.string(),
            value: Yup.string(),
          })
          .required("Required");
      default:
        return Yup.string().required("Required");
    }
  }),
  village: Yup.string().trim("Required"),
  role: Yup.lazy((value) => {
    switch (typeof value) {
      case "object":
        return Yup.object()
          .shape({
            label: Yup.string(),
            value: Yup.string(),
          })
          .required("Required");
      default:
        return Yup.string().required("Required");
    }
  }),

  status: Yup.lazy((value) => {
    switch (typeof value) {
      case "object":
        return Yup.object()
          .shape({
            label: Yup.string(),
            value: Yup.string(),
          })
          .required("Required");
      default:
        return Yup.string().required("Required");
    }
  }),
  addProfileImage: Yup.mixed()
    .test("is-valid-type", "Not a valid image type", (value) => {
      if (value?.name) {
        return value.type?.split("/")?.[0] === "image";
      }
      return true;
    })
    .test("is-valid-size", "Max allowed size is 100KB", (value) => {
      const MAX_FILE_SIZE = 5 * 1000 * 1000; //5MB;
      return value?.name ? value.size <= MAX_FILE_SIZE : true;
    }),
});

const editStaffValidationSchema = Yup.object().shape({
  firstName: Yup.string().required("Required"),
  lastName: Yup.string().required("Required"),
  username: Yup.string().required("Required"),
  gender: Yup.lazy((value) => {
    switch (typeof value) {
      case "object":
        return Yup.object()
          .shape({
            label: Yup.string(),
            value: Yup.string(),
          })
          .required("Required");
      default:
        return Yup.string().required("Required");
    }
  }),
  birthDay: Yup.string().required("Required"),
  phone: Yup.string().required("Required"),
  district: Yup.string(),
  email: Yup.string()
    .matches(regexPatterns.email, { message: "Invalid email address" })

    .required("Required"),
  country: Yup.lazy((value) => {
    switch (typeof value) {
      case "object":
        return Yup.object()
          .shape({
            label: Yup.string(),
            value: Yup.string(),
          })
          .required("Required");
      default:
        return Yup.string().required("Required");
    }
  }),
  village: Yup.string(),
  role: Yup.lazy((value) => {
    switch (typeof value) {
      case "object":
        return Yup.object()
          .shape({
            label: Yup.string(),
            value: Yup.string(),
          })
          .required("Required");
      default:
        return Yup.string().required("Required");
    }
  }),
  status: Yup.lazy((value) => {
    switch (typeof value) {
      case "object":
        return Yup.object()
          .shape({
            label: Yup.string(),
            value: Yup.string(),
          })
          .required("Required");
      default:
        return Yup.string().required("Required");
    }
  }),
});

function Index() {
  const theme = useTheme();
  //data hooks
  const { t } = useTranslation();
  const { user } = useAuth();
  const permission = usePermission(user?._id);
  const filter = useFilter();
  const manageStaffs = useManageStaffs({ filter: filter.data });
  const selectRoles = useSelectRoles();

  const selectCountries = useSelectCountries();
  const genderOptions = [
    { label: "male", value: "male" },
    { label: "female", value: "female" },
    { label: "other", value: "other" },
  ];

  const statusOptions = [
    { label: "active", value: "active" },
    { label: "deleted", value: "deleted" },
    { label: "disabled", value: "disabled" },
    { label: "inactive", value: "inactive" },
  ];

  const [dataForEvents, setDataForEvents] = React.useState({
    action: null,
    type: null,
    data: {},
  });

  const formFields = useMemo(() => {
    const defaultValue = dataForEvents.data;
    return [
      {
        name: "username",
        label: t("_username"),
        value: defaultValue.username || "",
        type: "text",
      },
      {
        name: "email",
        label: t("_email"),
        value: defaultValue.email || "",
        type: "text",
      },
      { name: "password", label: t("_password"), value: "", type: "password" },
      {
        name: "rePassword",
        label: t("_confirm_password"),
        value: "",
        type: "password",
      },
      {
        name: "firstName",
        label: t("_first_name"),
        value: defaultValue.firstname || "",
        type: "text",
      },
      {
        name: "lastName",
        label: t("_last_name"),
        value: defaultValue.lastname || "",
        type: "text",
      },
      {
        name: "gender",
        label: t("_gender"),
        value:
          genderOptions.filter(
            (gender) => gender.value === defaultValue.gender,
          )?.[0] || "",
        type: "select",
        options: genderOptions,
      },
      {
        name: "birthDay",
        label: t("_birthday"),
        value: defaultValue.birthday
          ? moment(defaultValue.birthday, "YYYY-MM-DD").toDate()
          : "",
        type: "date",
      },
      {
        name: "position",
        label: t("_position"),
        value: isValueOrNull(defaultValue.position, ""),
        type: "text",
      },
      {
        name: "phone",
        label: t("_phone"),
        value: isValueOrNull(defaultValue.phone || ""),
        type: "text",
      },
      {
        name: "addProfile",
        label: t("_choose_profile"),
        value: "",
        type: "image",
        canDeleteImage: true,
        imageData: {
          src: isValueOrNull(defaultValue.addProfile, null)
            ? `${REACT_APP_BUNNY_PULL_ZONE}/${defaultValue.newName}-${defaultValue._id}/${REACT_APP_ZONE_PROFILE}/${defaultValue.addProfile}`
            : null,
          name: isValueOrNull(defaultValue.addProfile, null),
        },
      },
      {
        name: "addProfileImage",
        label: "Add Profile FIle",
        value: {},
        type: "hidden",
        gridColumn: "span 12",
      },
      {
        name: "country",
        label: t("_country"),
        value:
          selectCountries.options.filter(
            (country) => country.value === defaultValue.country,
          )?.[0] || "",
        type: "select",
        options: selectCountries.options,
      },
      {
        name: "district",
        label: t("_district"),
        value: isValueOrNull(defaultValue.district, ""),
        type: "text",
      },
      {
        name: "village",
        label: t("_village"),
        value: isValueOrNull(defaultValue.village, ""),
        type: "text",
      },
      {
        name: "role",
        label: t("_role"),
        value:
          selectRoles.options?.filter(
            (role) => role.value === defaultValue.role?._id,
          )?.[0] || "",
        type: "select",
        options: selectRoles.options?.filter(
          (role) => role.label !== "super_admin",
        ),
      },
      {
        name: "status",
        label: t("_status"),
        disableClear: true,
        value:
          statusOptions.filter(
            (status) => status.value === (defaultValue.status || "active"),
          )?.[0] || "",
        type: "select",
        options: statusOptions,
      },
    ];
  }, [selectRoles.options, dataForEvents.data]);

  const [createStaffOpen, setCreateStaffOpen] = useState(false);
  const [editStaffOpen, setEditStaffOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [createStaff] = useMutation(MUTATION_CREATE_STAFF);
  const [updateStaff] = useMutation(MUTATION_UPDATE_STAFF);
  const [deleteStaff] = useMutation(MUTATION_DELETE_STAFF);
  const [reloading, setReloading] = useState(false);
  const csvInstance = useRef();

  const [deleteType, setDeleteType] = useState("single");

  const resetDataForEvents = () => {
    setDataForEvents((prevState) => ({
      ...prevState,
      data: {},
      action: "",
    }));
  };

  const editHandleClose = () => {
    setEditStaffOpen(false);
    resetDataForEvents();
  };

  const deleteHandleClose = () => {
    setDeleteOpen(false);
    resetDataForEvents();
  };

  const createHandleClose = () => {
    setCreateStaffOpen(false);
    resetDataForEvents();
  };

  const previewHandleClose = () => {
    setPreviewOpen(false);
    resetDataForEvents();
  };

  const columns = [
    {
      field: "id",
      headerName: t("_no"),
      width: 50,
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
      field: "firstname",
      headerName: t("_full_name"),
      flex: 2,
      renderCell: (params) => {
        const user = params.row;
        return (
          <Box
            sx={{
              display: "flex",
              columnGap: "10px",
            }}
          >
            <Avatar
              alt={`${user.firstname} ${user.lastname}`}
              {...{
                ...(user?.addProfile && {
                  src:
                    process.env.REACT_APP_BUNNY_PULL_ZONE +
                    user?.newName +
                    "-" +
                    user?._id +
                    "/" +
                    REACT_APP_ZONE_PROFILE +
                    "/" +
                    user?.addProfile,
                }),
              }}
            />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography variant="h6">{`${user.firstname} ${user.lastname}`}</Typography>
              <Typography component="div">{user.email}</Typography>
            </Box>
          </Box>
        );
      },
    },
    {
      field: "gender",
      headerName: t("_gender"),
      flex: 1,
    },
    {
      field: "position",
      headerName: t("_position"),
      flex: 1,
    },
    {
      field: "role",
      headerName: t("_role"),
      flex: 1,
      renderCell: (params) => {
        return <div>{params.row.role.name}</div>;
      },
    },
    {
      field: "status",
      headerName: t("_status"),
      width: 200,
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
        } else if (status === "deleted") {
          return (
            <div>
              <Chip
                sx={{
                  backgroundColor: "rgba(255, 159, 67,0.16)",
                  color: "rgb(255, 159, 67)",
                }}
                label={status}
                color="error"
                size="small"
              />
            </div>
          );
        } else if (status === "disabled") {
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
        } else {
          return (
            <div>
              <Chip
                sx={{
                  backgroundColor: "rgba(234, 84, 85,0.16)",
                  color: "rgb(234, 84, 85)",
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
      field: "actions",
      headerName: t("_action"),
      headerAlign: "center",
      align: "center",
      sortable: false,
      renderCell: (params) => {
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
                if (permission?.hasPermission("staff_view")) {
                  setDataForEvents({
                    action: "preview_file",
                    data: params.row,
                  });
                }
              }}
              sx={{
                ...(!permission?.hasPermission("staff_create")
                  ? {
                      cursor: "not-allowed",
                      opacity: 0.5,
                    }
                  : {
                      opacity: 1,
                    }),
              }}
            >
              <Icon.Eye
                size="20px"
                color={theme.name === THEMES.DARK ? "white" : "grey"}
              />
            </NormalButton>

            <NormalButton
              disabled={params.row.role.name === "super_admin" ? true : false}
              sx={{
                cursor: permission?.hasPermission("staff_edit")
                  ? "pointer"
                  : "not-allowed",
                opacity: permission?.hasPermission("staff_edit") ? 1 : 0.5,
              }}
              onClick={() => {
                if (permission?.hasPermission("staff_edit")) {
                  setDataForEvents({
                    action: "edit_staff",
                    data: params.row,
                  });
                }
              }}
            >
              <Icon.Edit
                size="20px"
                color={theme.name === THEMES.DARK ? "white" : "grey"}
              />
            </NormalButton>

            <NormalButton
              disabled={params.row.role.name === "super_admin" ? true : false}
              sx={{
                cursor: permission?.hasPermission("staff_delete")
                  ? "pointer"
                  : "not-allowed",
                opacity:
                  permission?.hasPermission("staff_delete") &&
                  params.row.status !== "deleted"
                    ? 1
                    : 0.5,
              }}
              onClick={() => {
                if (permission?.hasPermission("staff_delete")) {
                  setDeleteType("single");
                  setDataForEvents({
                    action: "delete_single",
                    data: params.row,
                  });
                  setDeleteOpen(true);
                }
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

  const exportCSV = useMemo(
    () =>
      manageStaffs.data?.map((row, index) => {
        const totalDownload = row.totalDownload;
        return {
          id: index + 1,
          name: row.filename,
          size: ConvertBytetoMBandGB(row.size),
          ip: row.ip,
          owner: row.createdBy?.username,
          status: row.status,
          date: moment(row.createdAt).format(DATE_PATTERN_FORMAT.date),
          totalDownload: totalDownload ? `${totalDownload} times` : "0 time",
        };
      }) || [],
    [manageStaffs.data],
  );

  const handleCreateStaff = async (inputValues) => {
    let profileName = null;
    const addProfileImage = inputValues.addProfileImage;
    if (addProfileImage instanceof File) {
      const fileExtension = getFileNameExtension(addProfileImage.name);
      profileName = `${uuid()}${fileExtension}`;
    }

    const values = {
      username: inputValues.username,
      password: inputValues.password,
      firstname: inputValues.firstName,
      lastname: inputValues.lastName,
      gender: inputValues.gender,
      phone: inputValues.phone,
      email: inputValues.email,
      birthday: inputValues.birthDay,
      ...(profileName && {
        addProfile: profileName,
      }),
      country: inputValues.country?.value || inputValues?.country,
      district: inputValues.district,
      village: inputValues.village,
      position: inputValues.position,
      role: inputValues.role?.value || inputValues?.role,
      status: inputValues.status?.value || inputValues?.status,
    };
    try {
      setReloading(true);
      const createdData = (
        await createStaff({
          variables: {
            data: {
              ...values,
            },
          },
        })
      )?.data?.createStaff;
      if (createdData) {
        resetDataForEvents();
        if (profileName) {
          const url = `${REACT_APP_BUNNY_URL}/${createdData.newName}-${createdData._id}/${REACT_APP_ZONE_PROFILE}/${profileName}`;
          await fetch(url, {
            method: "PUT",
            headers: {
              AccessKey: REACT_APP_ACCESSKEY_BUNNY,
              "Content-Type": addProfileImage.type,
            },
            body: addProfileImage,
          });
        }
      }
      setReloading(false);
      setCreateStaffOpen(false);
      successMessage("Created successfully", 3000);
      filter.dispatch({
        type: filter.ACTION_TYPE.PAGINATION,
        payload: 1,
      });
    } catch (e) {
      setReloading(false);
      errorMessage(e.message, 3000);
    }
  };

  const handleEditStaff = async (inputValues) => {
    setReloading(true);
    let profileName = null;
    const addProfileImage = inputValues.addProfileImage;
    const isDeleteAddProfileImage = inputValues.isDeleteAddProfileImage;
    if (addProfileImage instanceof File) {
      const fileExtension = getFileNameExtension(addProfileImage.name);
      profileName = `${uuid()}${fileExtension}`;
    }

    const values = {
      username: inputValues.username,
      ...(inputValues.password && {
        password: inputValues.password,
      }),
      firstname: inputValues.firstName,
      lastname: inputValues.lastName,
      phone: inputValues.phone,
      email: inputValues.email,
      gender: inputValues.gender?.value || inputValues.gender,
      birthday: inputValues.birthDay,
      ...(isDeleteAddProfileImage &&
        (dataForEvents.data.addProfile || profileName) && {
          addProfile: null,
        }),
      ...(profileName && {
        addProfile: profileName,
      }),
      country: inputValues.country?.value || inputValues?.country,
      district: inputValues.district,
      village: inputValues.village,
      position: inputValues.position,
      role: inputValues.role?.value || inputValues?.role,
      status: inputValues.status?.value || inputValues?.status,
    };
    try {
      await updateStaff({
        variables: {
          data: {
            ...values,
          },
          where: {
            _id: dataForEvents.data._id,
          },
        },
      });
      if (updateStaff) {
        if (
          (isDeleteAddProfileImage || profileName) &&
          dataForEvents.data.addProfile
        ) {
          const url = `${REACT_APP_BUNNY_URL}/${dataForEvents.data.newName}-${dataForEvents.data._id}/user_profile/${dataForEvents.data.addProfile}`;
          await fetch(url, {
            method: "DELETE",
            headers: {
              AccessKey: REACT_APP_ACCESSKEY_BUNNY,
            },
          });
        }
        if (profileName) {
          const url = `${REACT_APP_BUNNY_URL}/${dataForEvents.data.newName}-${dataForEvents.data._id}/${REACT_APP_ZONE_PROFILE}/${profileName}`;
          await fetch(url, {
            method: "PUT",
            headers: {
              AccessKey: REACT_APP_ACCESSKEY_BUNNY,
              "Content-Type": addProfileImage.type,
            },
            body: addProfileImage,
          });
        }
      }
      setReloading(false);
      setEditStaffOpen(false);
      resetDataForEvents();
      successMessage("Updated successfully", 3000);
      filter.dispatch({
        type: filter.ACTION_TYPE.PAGINATION,
        payload: 1,
      });
    } catch (e) {
      errorMessage(e.message, 3000);
    }
  };

  const handleDeleteStaff = async () => {
    try {
      if (deleteType === "multiple") {
        const selectedData = manageStaffs.data.filter((data) =>
          manageStaffs.selectedRow.includes(data._id),
        );
        await Promise.all(
          selectedData.map(async (data) => {
            const deletedData = await deleteStaff({
              variables: {
                where: {
                  _id: data._id,
                },
              },
            });
            if (deletedData) {
              const url = `${REACT_APP_BUNNY_URL}/${data.newName}-${data._id}/`;
              await fetch(url, {
                method: "DELETE",
                headers: {
                  AccessKey: REACT_APP_ACCESSKEY_BUNNY,
                },
              });
            }
          }),
        );
        successMessage("Deleted successfully", 3000);
        setReloading(false);
        filter.dispatch({
          type: filter.ACTION_TYPE.PAGINATION,
          payload: 1,
        });
      } else {
        await deleteStaff({
          variables: {
            where: {
              _id: dataForEvents.data._id,
            },
          },
        });
        if (dataForEvents.data.addProfile) {
          const url = `${REACT_APP_BUNNY_URL}/${dataForEvents.data.newName}-${dataForEvents.data._id}/`;
          await fetch(url, {
            method: "DELETE",
            headers: {
              AccessKey: REACT_APP_ACCESSKEY_BUNNY,
            },
          });
        }
        setReloading(false);
        successMessage("Deleted successfully", 3000);
        filter.dispatch({
          type: filter.ACTION_TYPE.PAGINATION,
          payload: 1,
        });
      }
    } catch (error) {
      errorMessage("Delete Failed try again!");
    }
  };

  const menuOnClick = async (action) => {
    switch (action) {
      case "preview_file":
        setPreviewOpen(true);
        break;
      case "edit_staff":
        setEditStaffOpen(true);
        break;
      case "delete_multiple":
        setDeleteOpen(true);
        setReloading(!reloading);
        break;
      case "delete_single":
        setDeleteOpen(true);
        setReloading(!reloading);
        break;
      default:
        return;
    }
  };

  React.useEffect(() => {
    if (
      dataForEvents.action &&
      (dataForEvents.data || dataForEvents.action === "delete_multiple")
    ) {
      menuOnClick(dataForEvents.action);
    }
  }, [dataForEvents.action]);

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        {/* <BreadcrumbNavigate
          separatorIcon={<Icon.ForeSlash />}
          path={["staffs"]}
          readablePath={["Staffs"]}
        /> */}
        <Paper
          sx={{
            mt: (theme) => theme.spacing(3),
            boxShadow: (theme) => theme.baseShadow.secondary,
            flex: "1 1 0%",
          }}
        >
          <Card sx={{ height: "100%" }}>
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
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                  }}
                >
                  {t("_staff_title")}
                </Typography>
                <MUI.ListFilter>
                  <Grid
                    container
                    columnSpacing={5}
                    sx={{
                      alignItems: "end",
                    }}
                  >
                    <Grid item xs={6} sm={6} md={6} lg={6}>
                      <MUI.FilterFile>
                        <SelectV1
                          selectStyle={{
                            height: "35px",
                            minHeight: "35px",
                          }}
                          label={t("_country")}
                          selectProps={{
                            options: selectCountries.options,
                            onChange: (e) =>
                              filter.dispatch({
                                type: filter.ACTION_TYPE.COUNTRY_NAME,
                                payload: e?.value || null,
                              }),
                            placeholder: t("_select_country"),
                          }}
                        />
                      </MUI.FilterFile>
                    </Grid>
                    <Grid item xs={3} sm={3} md={3} lg={3}>
                      <MUI.FilterFile>
                        <SelectV1
                          label={t("_status")}
                          selectStyle={{
                            height: "35px",
                            minHeight: "35px",
                          }}
                          selectProps={{
                            onChange: (e) =>
                              filter.dispatch({
                                type: filter.ACTION_TYPE.STATUS,
                                payload: e?.value || null,
                              }),
                            options: [
                              { label: "active", value: "active" },
                              { label: "deleted", value: "deleted" },
                              { label: "disabled", value: "disabled" },
                            ],
                            placeholder: t("_select_status"),
                          }}
                        />
                      </MUI.FilterFile>
                    </Grid>
                    <Grid item xs={3} sm={3} md={3} lg={3}>
                      <MUI.FilterFile>
                        <SelectV1
                          label={t("_role")}
                          selectStyle={{
                            height: "35px",
                            minHeight: "35px",
                          }}
                          selectProps={{
                            options: selectRoles.options,
                            onChange: (e) =>
                              filter.dispatch({
                                type: filter.ACTION_TYPE.ROLE,
                                payload: e?.value || null,
                              }),
                            placeholder: t("_select_role"),
                          }}
                        />
                      </MUI.FilterFile>
                    </Grid>
                  </Grid>
                  <MUI.ListFilter>
                    <Grid
                      container
                      columnSpacing={5}
                      sx={{
                        alignItems: "end",
                      }}
                    >
                      <Grid item xs={6} sm={6} md={6} lg={6}>
                        <Grid
                          container
                          columnSpacing={5}
                          sx={{
                            alignItems: "end",
                          }}
                        >
                          <Grid item xs={5} sm={5} md={4} lg={3}>
                            <MUI.FilterFile>
                              <SelectV1
                                disableLabel
                                selectStyle={{
                                  height: "35px",
                                  minHeight: "35px",
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
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={6} sm={6} md={6} lg={6}>
                        <Box
                          columnGap={5}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <MUI.FilterFile sx={{ flexGrow: 1 }}>
                            <TextField
                              sx={{
                                width: "100%",
                                "& .MuiInputBase-root": {
                                  height: "35px",
                                  minHeight: "35px",
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
                                  type: filter.ACTION_TYPE.FIRST_NAME,
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
                          <MUI.FilterFile sx={{ width: 150 }}>
                            <NormalButton
                              {...(permission?.hasPermission("staff_delete") &&
                                manageStaffs.selectedRow.length > 1 && {
                                  onClick: () => {
                                    setDeleteType("multiple");
                                    setDataForEvents({
                                      action: "delete_multiple",
                                      data: {},
                                    });
                                  },
                                })}
                              sx={{
                                height: "35px",
                                width: "100%",
                                alignItems: "center",
                                border: "1px solid",
                                padding: (theme) => theme.spacing(3),
                                borderColor:
                                  theme.name === THEMES.DARK
                                    ? "rgba(255,255,255,0.4)"
                                    : "rgba(0,0,0,0.4)",
                                borderRadius: "4px",
                                ...(manageStaffs.selectedRow.length <= 1 ||
                                !permission?.hasPermission("staff_delete")
                                  ? {
                                      cursor: "not-allowed",
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
                          <MUI.FilterFile sx={{ width: 200 }}>
                            <NormalButton
                              onClick={() => {
                                if (permission?.hasPermission("staff_create")) {
                                  setDataForEvents((prevState) => ({
                                    ...prevState,
                                    data: {},
                                  }));
                                  setCreateStaffOpen(true);
                                }
                              }}
                              sx={{
                                height: "35px",
                                width: "100%",
                                alignItems: "center",
                                border: "1px solid",
                                padding: (theme) => theme.spacing(3),
                                borderColor: (theme) =>
                                  theme.palette.primaryTheme.main,
                                backgroundColor: (theme) =>
                                  theme.palette.primaryTheme.main,
                                borderRadius: "4px",
                                color: "white !important",
                                justifyContent: "center",
                                ...(!permission?.hasPermission("staff_create")
                                  ? {
                                      cursor: "not-allowed",
                                      opacity: 0.5,
                                    }
                                  : {
                                      opacity: 1,
                                    }),
                              }}
                            >
                              {t("_create_new")}
                            </NormalButton>
                          </MUI.FilterFile>
                        </Box>
                      </Grid>
                    </Grid>
                  </MUI.ListFilter>
                  <CSVLink data={exportCSV} separator={","} ref={csvInstance} />
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
                    "& .MuiDataGrid-main": {
                      minHeight: "500px !important",
                    },
                    borderRadius: 0,
                    "& .MuiDataGrid-columnSeparator": { display: "none" },
                    "& .MuiDataGrid-virtualScroller": {
                      overflowX: "hidden",
                    },
                  }}
                  rows={manageStaffs.data || []}
                  getRowId={(row) => row._id}
                  columns={columns}
                  AutoGenerateColumns="True"
                  checkboxSelection
                  disableSelectionOnClick
                  disableColumnFilter
                  disableColumnMenu
                  hideFooter
                  onSelectionModelChange={(ids) => {
                    manageStaffs.setSelectedRow(ids);
                  }}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {manageStaffs.total > 0 && (
                  <Box
                    sx={{
                      padding: (theme) => theme.spacing(4),
                    }}
                  >
                    Showing 1 to 10 of {manageStaffs.total} entries
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
                  <PaginationStyled
                    currentPage={filter.data.currentPageNumber}
                    total={Math.ceil(
                      manageStaffs.total / filter.data.pageLimit,
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
            </CardContent>
          </Card>
        </Paper>

        <DialogDeleteV1
          isOpen={deleteOpen}
          onClose={deleteHandleClose}
          onConfirm={handleDeleteStaff}
        />

        <DialogPreviewUser
          data={{
            ...dataForEvents.data,
            profile: dataForEvents.data.addProfile,
            firstName: dataForEvents.data.firstname,
            lastName: dataForEvents.data.lastname,
          }}
          isOpen={previewOpen}
          onClose={previewHandleClose}
        />
        <DialogForm
          loading={reloading}
          formFields={formFields}
          disableDefaultButton
          title={t("_add_staff_title")}
          onSubmit={handleCreateStaff}
          validationSchema={createStaffValidationSchema}
          isOpen={createStaffOpen}
          onClose={createHandleClose}
        />

        <DialogForm
          loading={reloading}
          formFields={formFields}
          disableDefaultButton
          title={t("_update_staff_title")}
          onSubmit={handleEditStaff}
          validationSchema={editStaffValidationSchema}
          isOpen={editStaffOpen}
          onClose={editHandleClose}
        />
      </Box>
    </>
  );
}

export default Index;
