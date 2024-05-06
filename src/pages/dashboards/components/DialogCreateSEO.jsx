import React from "react";

// components
import { MUTATION_CREATE_PAGE, MUTATION_UPDATE_PAGE } from "../SEO/apollo";
import { styled as muiStyled } from "@mui/system";
import DialogV1 from "../../../components/DialogV1";
import { errorMessage, successMessage } from "../../../components/Alerts";

//mui component and style
import { Box, Button, InputLabel, TextField, Typography } from "@mui/material";
import { useMutation } from "@apollo/client";
import { useTranslation } from "react-i18next";

const DialogPreviewFileV1Boby = muiStyled("div")(({ theme }) => ({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  rowGap: theme.spacing(3),
}));

const DialogPreviewQRcode = (props) => {
  const { t } = useTranslation();
  const [pageName, setPageName] = React.useState("");
  const [id, setId] = React.useState(0);
  const [updateSEO] = useMutation(MUTATION_UPDATE_PAGE);
  const [createPage] = useMutation(MUTATION_CREATE_PAGE);
  const handleCreatePage = async () => {
    try {
      let result = await createPage({
        variables: {
          input: {
            name: pageName,
            status: "active",
          },
        },
      });
      if (result?.data?.createPage?._id) {
        successMessage("Create SEO page successful!", 2000);
        props.onClose();
        props.onLoadData();
        setPageName("");
      }
    } catch (error) {
      errorMessage("Something wrong. Please try again later!", 2500);
    }
  };

  const handleUpdateSEOPage = async () => {
    try {
      let result = await updateSEO({
        variables: {
          input: {
            name: pageName,
          },
          id: id,
        },
      });
      if (result?.data?.updatePage) {
        props.onClose();
        props.onLoadData();
        successMessage("Update SEO page successful!", 2000);
        setPageName("");
      }
    } catch (err) {
      errorMessage("Something wrong! try again later!", 2000);
    }
  };

  React.useEffect(() => {
    setPageName(props?.pageName);
    setId(props?.pageId);
  }, [props?.pageName, props?.pageId]);

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
        <Box>
          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant=""
              sx={{
                fontSize: "1.2rem",
                color: "#5D586C",
                fontWeight: 600,
              }}
            >
              {props?.isUpdate
                ? t("_update_new_seo_title")
                : t("_create_new_seo_title")}
            </Typography>
            <br />
            <Typography
              variant=""
              sx={{
                fontSize: "1rem",
                color: "#5D586C",
                fontWeight: 500,
              }}
            >
              {props?.isUpdate
                ? t("_update_new_seo_description")
                : t("_create_new_seo_description")}
            </Typography>
            <br />
          </Box>
          <InputLabel sx={{ color: "#A5A3AE", mt: 4 }}>
            {t("_page_name")}
          </InputLabel>
          <TextField
            sx={{
              width: "100%",
              marginTop: 1,
              "& .MuiInputBase-root": {
                input: {
                  "&::placeholder": {
                    opacity: 1,
                  },
                },
              },
            }}
            placeholder={t("_page_name_placeholder")}
            size="medium"
            InputLabelProps={{
              shrink: false,
            }}
            multiline
            value={pageName}
            onChange={(e) => setPageName(e.target.value)}
          />
          <Box sx={{ mt: 5, textAlign: "center" }}>
            <Button
              variant="contained"
              sx={{
                background: "#F1F1F2",
                color: "#A8AAAE",
                "& :hover": {
                  background: "#F1F1F2",
                  color: "#A8AAAE",
                },
                mr: 4,
              }}
              size="medium"
            >
              {t("_cancel_button")}
            </Button>
            <Button
              variant="contained"
              size="medium"
              onClick={props?.isUpdate ? handleUpdateSEOPage : handleCreatePage}
            >
              {props?.isUpdate ? t("update_button") : t("_save_button")}
            </Button>
          </Box>
        </Box>
      </DialogPreviewFileV1Boby>
    </DialogV1>
  );
};

export default DialogPreviewQRcode;
