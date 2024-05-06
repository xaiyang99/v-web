import React, { useState } from "react";

//mui component and style
import { styled as muiStyled } from "@mui/system";
import { Typography, Box, Chip, Avatar } from "@mui/material";
import DialogV1 from "../../../components/DialogV1";
import Preview from "./Preview";
import { useTranslation } from "react-i18next";

const FileItem = (props) => {
  return (
    <Box
      sx={{
        display: "flex",
        columnGap: (theme) => theme.spacing(2),
      }}
    >
      <Typography
        component="div"
        sx={{
          fontWeight: 500,
          fontSize: "15px",
        }}
      >
        {props.title}:
      </Typography>
      <Typography
        component="div"
        sx={{
          fontSize: "15px",
        }}
      >
        {props.content}
      </Typography>
    </Box>
  );
};

const DialogPreviewFileV1Boby = muiStyled("div")(({ theme }) => ({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  rowGap: theme.spacing(3),
}));

const DialogPreviewUser = (props) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <DialogV1
      {...props}
      dialogProps={{
        PaperProps: {
          sx: {
            overflowY: "initial",
            maxWidth: "500px",
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
      <DialogPreviewFileV1Boby>
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
          <Avatar
            onClick={() => {
              setOpen(true);
            }}
            alt={props.data.profile ? props.data.email : ""}
            src={
              process.env.REACT_APP_BUNNY_PULL_ZONE +
              props.data?.newName +
              "-" +
              props.data?._id +
              "/" +
              process.env.REACT_APP_ZONE_PROFILE +
              "/" +
              props.data?.profile
            }
            sx={{
              cursor: "pointer",
              width: 100,
              height: 100,
              backgroundColor: "#17766B",
            }}
          />
          <h2>
            {props.data.firstName} {props.data.lastName}
          </h2>
        </Box>
        <Box
          className="header"
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            rowGap: (theme) => theme.spacing(2),
            color: (theme) => theme.palette.primaryTheme.brown(),
          }}
        >
          <Typography
            component="div"
            sx={{
              color: (theme) => theme.palette.primaryTheme.brown(0.5),
            }}
          >
            {t("_detail")}
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              rowGap: "6px",
            }}
          >
            <FileItem title={t("_first_name")} content={props.data.firstName} />
            <FileItem title={t("_last_name")} content={props.data.lastName} />
            <FileItem title={t("_gender")} content={props.data.gender} />
            <FileItem title={t("_phone")} content={props.data.phone} />
            <FileItem title={t("_email")} content={props.data.email} />
            <FileItem title={t("_username")} content={props.data.username} />
            <FileItem title={t("_country")} content={props.data.country} />
            <FileItem title={t("_state")} content={props.data.state} />
            <FileItem title={t("_zipcode")} content={props.data.zipcode} />
            <FileItem
              title={t("_status")}
              content={(() => {
                if (props.data.status === "active") {
                  return (
                    <div style={{ color: "green" }}>
                      <Chip
                        sx={{ backgroundColor: "#dcf6e8", color: "#29c770" }}
                        label={props.data.status}
                        size="small"
                      />
                    </div>
                  );
                } else if (props.data.status === "deleted") {
                  return (
                    <div>
                      <Chip
                        sx={{
                          backgroundColor: "rgba(255, 159, 67,0.16)",
                          color: "rgb(255, 159, 67)",
                        }}
                        label={props.data.status}
                        color="error"
                        size="small"
                      />
                    </div>
                  );
                } else if (props.data.status === "disabled") {
                  return (
                    <div>
                      <Chip
                        sx={{
                          backgroundColor: "rgba(168, 170, 174,0.16)",
                          color: "rgb(168, 170, 174)",
                        }}
                        label={props.data.status}
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
                        label={props.data.status}
                        size="small"
                      />
                    </div>
                  );
                }
              })()}
            />
          </Box>
        </Box>
      </DialogPreviewFileV1Boby>
      {open && (
        <Preview data={props.data} isOpen={open} onClose={handleClose} />
      )}
    </DialogV1>
  );
};

export default DialogPreviewUser;
