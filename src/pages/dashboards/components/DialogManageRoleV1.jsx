import { useEffect, useState } from "react";

//mui component and style
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  TextField,
  Typography,
} from "@mui/material";
import { styled as muiStyled } from "@mui/system";
import { Formik } from "formik";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import DialogV1 from "../../../components/DialogV1";
import NormalButton from "../../../components/NormalButton";
import { capitalizeFirstLetter } from "../../../functions";
import useFirstRender from "../../../hooks/useFirstRender";

const EditRoleCommonItem = (props) => {
  const isFirstRender = useFirstRender();
  useEffect(() => {
    if (!isFirstRender) {
      if (props.isAdmin) {
        props.setFieldValue?.(true);
      } else {
        props.setFieldValue?.(false);
      }
    }
  }, [props.isAdmin]);

  return (
    <FormControlLabel
      control={
        <Checkbox
          id={props.id}
          name={props.name}
          {...{
            ...(!props.disabled && {
              ...(!props.isAdmin && {
                onChange: props.onChange,
              }),
              checked: props.isAdmin || props.value,
              value: props.isAdmin || props.value,
            }),
          }}
          sx={{
            padding: "5px",
          }}
          disabled={props.disabled}
        />
      }
      label={capitalizeFirstLetter(props.label)}
    />
  );
};

const EditRoleFieldItem = (props) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        height: "50px",
        maxHeight: "50px",
        borderBottom: "1px solid #DBDADE",
      }}
    >
      <Typography
        component="div"
        sx={{
          fontWeight: 600,
        }}
      >
        {props.title}
      </Typography>
      <Typography component="div">
        <FormGroup
          row
          sx={{
            columnGap: 3,
          }}
        >
          {props.data.map((data, index) => {
            return (
              <EditRoleCommonItem
                key={index}
                isAdmin={props.isAdmin}
                onChange={props.onChange}
                setFieldValue={(value) =>
                  props.setFieldValue?.(data.name, value)
                }
                {...data}
              />
            );
          })}
        </FormGroup>
      </Typography>
    </Box>
  );
};

const ManageRoleSchema = Yup.object().shape({
  name: Yup.string().trim("Required").required("Required"),
});

const DialogManageRoleV1Boby = muiStyled("div")(({ theme }) => ({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  rowGap: theme.spacing(4),
}));

const DialogManageRoleV1 = (props) => {
  const { t } = useTranslation();
  const [defaultPermissionValue, setDefaultPermissionValue] = useState([]);
  useEffect(() => {
    setDefaultPermissionValue(() => {
      return (
        props.permissionData?.map((data) => {
          return {
            [data.groupName]: {
              ...Object.assign(
                {},
                ...["view", "create", "edit", "delete"].map((permission) => {
                  return {
                    [permission]: {
                      value:
                        data.value[data.groupName]?.[permission]?.value ||
                        false,
                      isDisabled:
                        data.value[data.groupName]?.[permission]?.isDisabled,
                    },
                  };
                }),
              ),
            },
          };
        }) || []
      );
    });
  }, [props.permissionData]);

  return (
    <DialogV1
      {...props}
      dialogProps={{
        PaperProps: {
          sx: {
            overflowY: "initial",
            maxWidth: "700px",
          },
        },
      }}
      dialogContentProps={{
        sx: {
          backgroundColor: "white !important",
          borderRadius: "6px",
          padding: (theme) => `${theme.spacing(8)} ${theme.spacing(6)}`,
        },
      }}
    >
      <DialogManageRoleV1Boby>
        <Box
          className="header"
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            rowGap: (theme) => theme.spacing(2),
            alignItems: "center",
            color: (theme) => theme.palette.primaryTheme.brown(),
          }}
        >
          <Typography variant="h3" className="title">
            {props.title || "--"}
          </Typography>
        </Box>
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            rowGap: (theme) => theme.spacing(2),
            color: (theme) => theme.palette.primaryTheme.brown(),
          }}
        >
          <Formik
            enableReinitialize
            initialValues={{
              ...(props.roleId && {
                roleId: props.roleId.toString(),
              }),
              name: props.roleName || "",
              isAdmin: false,
              permissions: defaultPermissionValue.length
                ? defaultPermissionValue.map((permission) => {
                    const groupName = Object.keys(permission)[0]; // file, share, etc.
                    const permissions = Object.keys(permission[groupName]).map(
                      (permissionValue) => {
                        return {
                          [permissionValue]:
                            permission[groupName][permissionValue].value,
                        };
                      },
                    );
                    return {
                      [groupName]: Object.assign({}, ...permissions),
                    };
                  })
                : [],
            }}
            validationSchema={ManageRoleSchema}
            onSubmit={(values) => {
              const permissions = values.permissions
                .filter((value, i) => {
                  const groupName = Object.keys(value)[0]; // file, share, etc.
                  const permissionNames = Object.keys(value[groupName]); // {view: false}
                  return permissionNames.some(
                    (permissionName) =>
                      value[groupName][permissionName] !==
                      props.permissionData[i].value[groupName][permissionName]
                        .value,
                  );
                })
                .map((value) => {
                  const groupName = Object.keys(value)[0]; // file, share, etc.
                  const inputValue = Object.values(value)[0]; // {view: false}
                  const permissionResult = Object.keys(inputValue).map(
                    (permissionName) => {
                      const isCreated = inputValue[permissionName] || false;
                      const isUpdated = props.permissionData.some((data) => {
                        const permissionValue =
                          data.value?.[groupName]?.[permissionName].value;
                        const givenValue = inputValue[permissionName];
                        return (
                          groupName === data.groupName &&
                          !permissionValue &&
                          givenValue
                        );
                      });
                      const isDeleted = props.permissionData.some((data) => {
                        const permissionValue =
                          data.value?.[groupName]?.[permissionName].value;
                        const givenValue = inputValue[permissionName];
                        return (
                          groupName === data.groupName &&
                          permissionValue &&
                          !givenValue
                        );
                      });
                      return {
                        [permissionName]: {
                          isCreated,
                          isUpdated,
                          isDeleted,
                        },
                        isActive: props.permissionData.some((data) => {
                          const permissionValue =
                            data.value?.[groupName]?.[permissionName].value;
                          const givenValue = inputValue[permissionName];
                          return (
                            groupName === data.groupName &&
                            permissionValue !== givenValue
                          );
                        }),
                      };
                    },
                  );
                  return {
                    name: values.name,
                    ...(values?.roleId && {
                      roleId: values?.roleId,
                    }),
                    groupName,
                    [groupName]: permissionResult,
                  };
                });

              props.onSubmit(values, permissions);
            }}
          >
            {(formik) => (
              <Typography
                component="form"
                onSubmit={formik.handleSubmit}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  rowGap: (theme) => theme.spacing(5),
                }}
              >
                <Box>
                  <Typography component="label">{t("_role_name")}</Typography>
                  <TextField
                    id="name"
                    name="name"
                    value={formik.values.name}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    sx={{
                      width: "100%",
                    }}
                    placeholder={t("_role_name_placeholder")}
                    size="small"
                    InputLabelProps={{
                      shrink: false,
                    }}
                  />
                  {formik.touched.name && formik.errors.name && (
                    <Typography component="div" padding={1} color={"#EA5455"}>
                      {formik.errors.name}
                    </Typography>
                  )}
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    rowGap: (theme) => theme.spacing(2),
                  }}
                >
                  <Typography
                    variant="h4"
                    className="title"
                    sx={{
                      fontWeight: 600,
                    }}
                  >
                    {t("_asign_role_permission_title")}
                  </Typography>
                  <Box
                    display="grid"
                    gridTemplateColumns="repeat(1, 1fr)"
                    rowGap={2}
                  >
                    <EditRoleFieldItem
                      title={t("_asign_role_permission_description")}
                      onChange={formik.handleChange}
                      data={[
                        {
                          label: t("_select_all"),
                          value: formik.values.isAdmin,
                          id: "isAdmin",
                          name: "isAdmin",
                          onChange: formik.handleChange,
                        },
                      ]}
                    />
                    {defaultPermissionValue.map((data, index) => {
                      const groupName = Object.keys(data)[0];
                      const permissionGroup = Object.keys(data[groupName]).map(
                        (key) => ({ [key]: data[groupName][key] }),
                      );
                      return (
                        <EditRoleFieldItem
                          key={index}
                          title={capitalizeFirstLetter(groupName)}
                          onChange={formik.handleChange}
                          isAdmin={formik.values.isAdmin}
                          setFieldValue={formik.setFieldValue}
                          data={permissionGroup.map((permission) => {
                            const permissionName = Object.keys(permission)[0];
                            return {
                              disabled: permission[permissionName].isDisabled,
                              label: capitalizeFirstLetter(
                                t(`_can_${permissionName}`),
                              ),
                              value:
                                formik.values.permissions?.[index]?.[
                                  groupName
                                ]?.[permissionName] || false,
                              id: `permissions[${index}][${groupName}][${[
                                permissionName,
                              ]}]`,
                              name: `permissions[${index}][${groupName}][${[
                                permissionName,
                              ]}]`,
                            };
                          })}
                        />
                      );
                    })}
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      columnGap: (theme) => theme.spacing(3),
                    }}
                  >
                    <NormalButton
                      type="submit"
                      sx={{
                        padding: (theme) =>
                          `${theme.spacing(2)} ${theme.spacing(4)}`,
                        borderRadius: (theme) => theme.spacing(1),
                        backgroundColor: (theme) =>
                          theme.palette.primaryTheme.main,
                        color: "white !important",
                      }}
                    >
                      {t("_save_button")}
                    </NormalButton>
                    <NormalButton
                      type="button"
                      onClick={() => props.onClose()}
                      sx={{
                        padding: (theme) =>
                          `${theme.spacing(2)} ${theme.spacing(4)}`,
                        borderRadius: (theme) => theme.spacing(1),
                        backgroundColor: "rgba(0,0,0,0.1)",
                        color: "rgba(0,0,0,0.5)",
                      }}
                    >
                      {t("_cancel_button")}
                    </NormalButton>
                  </Box>
                </Box>
              </Typography>
            )}
          </Formik>
        </Box>
      </DialogManageRoleV1Boby>
    </DialogV1>
  );
};

export default DialogManageRoleV1;
