import React, { useEffect } from "react";

//mui component and style
import { Box, Typography, useTheme } from "@mui/material";
import { styled as muiStyled } from "@mui/system";
import { produce } from "immer";
import { useTranslation } from "react-i18next";
import DialogV1 from "../../../components/DialogV1";
import NormalButton from "../../../components/NormalButton";
import { capitalizeFirstLetter } from "../../../functions";
import * as Icon from "../../../icons/icons";

const StatusItem = (props) => {
  const theme = useTheme();
  const primaryColor = theme.palette.primaryTheme.main;
  return (
    <NormalButton
      {...props.btnProps}
      sx={{
        display: "flex",
        alignItems: "center",
        border: "1px solid rgba(0,0,0,0.3)",
        padding: (theme) => theme.spacing(2),
        ...(props.isActive && {
          borderColor: primaryColor,
        }),
        borderRadius: (theme) => theme.spacing(1),
      }}
    >
      <Box
        sx={{
          fontSize: (theme) => theme.spacing(7),
          padding: (theme) => theme.spacing(3),
          display: "flex",
          color: (theme) => theme.palette.primaryTheme.brown(),
          ...(props.isActive && {
            color: primaryColor,
          }),
        }}
      >
        {props.icon}
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          flexDirection: "column",
          ...(props.isActive && {
            color: primaryColor,
          }),
          rowGap: (theme) => theme.spacing(2),
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 600,
            color: (theme) => theme.palette.primaryTheme.brown(),
            ...(props.isActive && {
              color: primaryColor,
            }),
          }}
        >
          {capitalizeFirstLetter(props.title)}
        </Typography>
        <Typography
          component="div"
          sx={{
            color: (theme) => theme.palette.primaryTheme.brown(0.8),
            ...(props.isActive && {
              color: primaryColor,
            }),
          }}
        >
          {props.description}
        </Typography>
      </Box>
    </NormalButton>
  );
};

const FileEditStatusDialogBoby = muiStyled("div")(({ theme }) => ({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  rowGap: theme.spacing(5),
}));

const FileEditStatusDialog = (props) => {
  const { t } = useTranslation();
  const UsersMenu = [
    {
      icon: <Icon.UserCheck />,
      title: t("_active_title"),
      value: "active",
      description: t("_active_description"),
    },
    {
      icon: <Icon.UserX />,
      title: t("_disable_title"),
      value: "disabled",
      description: t("_disable_description"),
    },
  ];

  const menu = [
    {
      icon: <Icon.UserCheck />,
      title: t("_active_title"),
      value: "active",
      description: t("_active_description"),
    },
    {
      icon: <Icon.UserX />,
      title: t("_disable_title"),
      value: "disabled",
      description: t("_disable_description"),
    },
    {
      icon: <Icon.TbTrashIcon />,
      title: t("_deleted_title"),
      value: "deleted",
      description: t("_deleted_description"),
    },
    {
      icon: <Icon.TbTrashOffIcon />,
      title: t("_permanent_deleted_title"),
      value: "permanent",
      description: t("_permanent_deleted_description"),
    },
  ];

  const [menuStatus, setMenuStatus] = React.useState(
    props?.pathStatus ? UsersMenu : menu,
  );

  const [status, setStatus] = React.useState(null);

  useEffect(() => {
    setStatus(
      menuStatus?.filter((data) => {
        return data.isActive;
      })[0]?.value || null,
    );
  }, [menuStatus, props.pathStatus]);
  useEffect(() => {
    setMenuStatus((prevState) => {
      return produce(prevState, (draft) => {
        draft.forEach((data) => {
          data.isActive = props.status === data.value;
        });
      });
    });
  }, [props.status]);

  const handleMenuStatus = (inputIndex) => {
    setMenuStatus((prevState) => {
      return produce(prevState, (draft) => {
        draft?.forEach((data, index) => {
          data.isActive = data.isActive ? !data.isActive : index === inputIndex;
        });
      });
    });
  };

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
        sx: {
          columnGap: "20px",
        },
      }}
      dialogContentProps={{
        sx: {
          backgroundColor: "white !important",
          borderRadius: "6px",
          padding: (theme) => `${theme.spacing(10)} ${theme.spacing(15)}`,
        },
      }}
    >
      <FileEditStatusDialogBoby>
        <Typography
          variant="h3"
          sx={{
            width: "100%",
            display: "flex",
            fontWeight: "bold",
            justifyContent: "center",
            color: (theme) => theme.palette.primaryTheme.brown(),
          }}
        >
          {t("_edit_status")}
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            rowGap: (theme) => theme.spacing(4),
          }}
        >
          {menuStatus?.map((data, index) => {
            return (
              <StatusItem
                key={index}
                {...data}
                btnProps={{
                  onClick: () => handleMenuStatus(index),
                }}
              />
            );
          })}
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            columnGap: (theme) => theme.spacing(3),
          }}
        >
          <Box
            sx={{
              display: "flex",
              columnGap: (theme) => theme.spacing(3),
            }}
          >
            <NormalButton
              sx={{
                padding: (theme) => `${theme.spacing(2)} ${theme.spacing(4)}`,
                borderRadius: (theme) => theme.spacing(1),
                backgroundColor: (theme) => theme.palette.primaryTheme.main,
                color: "white !important",
                ...(!status && {
                  opacity: 0.5,
                  cursor: "default",
                }),
              }}
              {...(status && {
                onClick: () => {
                  props.onSave(status);
                  props.onClose();
                },
              })}
            >
              {t("_save_button")}
            </NormalButton>
            <NormalButton
              onClick={() => props.onClose()}
              sx={{
                padding: (theme) => `${theme.spacing(2)} ${theme.spacing(4)}`,
                borderRadius: (theme) => theme.spacing(1),
                backgroundColor: "rgba(0,0,0,0.1)",
                color: "rgba(0,0,0,0.5)",
              }}
            >
              {t("_cancel_button")}
            </NormalButton>
          </Box>
        </Box>
      </FileEditStatusDialogBoby>
    </DialogV1>
  );
};

export default FileEditStatusDialog;
