import React from "react";
import DialogV1 from "../../../components/DialogV1";
//mui component and style
import { styled as muiStyled } from "@mui/system";
import { Typography, Box } from "@mui/material";
import { Editor } from "@tinymce/tinymce-react";
import { useTranslation } from "react-i18next";
const DialogPreviewFileV1Boby = muiStyled("div")(({ theme }) => ({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  rowGap: theme.spacing(3),
}));

function Preview(props) {
  const { data } = props;
  const { t } = useTranslation();
  return (
    <div>
      <DialogV1
        {...props}
        dialogProps={{
          PaperProps: {
            sx: {
              overflowY: "initial",
              maxWidth: "md",
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
                "& .tox-statusbar__branding": {
                  display: "none",
                },
                "&.tox-statusbar__branding svg": {
                  display: "none",
                },
                "& .tox .tox-statusbar": {
                  display: "none",
                  border: "none",
                },
                "& .tox-tinymce": {
                  border: "none",
                },
              }}
            >
              <Typography variant="p">
                {t("_image")}: {data.image}
              </Typography>
              <img
                src={`${process.env.REACT_APP_BUNNY_PULL_ZONE}image/${data.image}`}
                alt={data.image}
                width="200"
              />
              <Typography variant="subtitle2" sx={{ fontSize: "14px" }}>
                {t("_title")}: {data.name}
              </Typography>

              <Editor
                apiKey={process.env.REACT_APP_TINYMCE_API}
                initialValue={data.description}
                disabled={true}
                init={{
                  menubar: false,
                  toolbar: false,
                  readonly: true,
                  plugins: ["autoresize"],
                }}
              />
            </Box>
          </Box>
        </DialogPreviewFileV1Boby>
      </DialogV1>
    </div>
  );
}

export default Preview;
