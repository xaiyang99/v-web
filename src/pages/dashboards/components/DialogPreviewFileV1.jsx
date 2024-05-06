import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

//mui component and style
import { Box, Chip, Typography } from "@mui/material";
import { styled as muiStyled } from "@mui/system";
import moment from "moment";
import { FileIcon, defaultStyles } from "react-file-icon";
import DialogV1 from "../../../components/DialogV1";
import { ConvertBytetoMBandGB, GetFileType } from "../../../functions";
import { DATE_PATTERN_FORMAT } from "../../../utils/date";

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

const DialogPreviewFileV1 = (props) => {
  const { t } = useTranslation();
  const memorizedValue = useRef({});
  const { filename, size, ip, owner, status, totalDownload, date } =
    memorizedValue.current;
  useEffect(() => {
    memorizedValue.current = props.data;
  }, [props.data]);
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
          <Typography
            component="div"
            className="icon"
            sx={{
              width: "90px",
              height: "90px",
              "& > svg": {
                height: "100%",
                display: "flex",
              },
            }}
          >
            <FileIcon
              extension={GetFileType(filename)}
              {...{ ...defaultStyles[GetFileType(filename)] }}
            />
          </Typography>
          <Typography
            variant="h4"
            className="filename"
            sx={{
              color: (theme) => theme.palette.primaryTheme.brown(),
            }}
          >
            {filename}
          </Typography>
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
            <FileItem title={t("_file_name")} content={filename} />
            <FileItem
              title={t("_size")}
              content={size ? ConvertBytetoMBandGB(size) : 0}
            />
            <FileItem title={t("_ip")} content={ip || ""} />
            <FileItem title={t("_owner")} content={owner || ""} />
            <FileItem
              title={t("_status")}
              content={(() => {
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
              })()}
            />
            <FileItem
              title={t("_total_download")}
              content={totalDownload ? `${totalDownload} times` : "0 time"}
            />
            <FileItem
              title={t("_created_at")}
              content={moment(date).format(DATE_PATTERN_FORMAT.date)}
            />
          </Box>
        </Box>
      </DialogPreviewFileV1Boby>
    </DialogV1>
  );
};

export default DialogPreviewFileV1;
