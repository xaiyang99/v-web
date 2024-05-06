//mui component and style
import { Box, CircularProgress, Typography, useTheme } from "@mui/material";
import { styled as muiStyled } from "@mui/system";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import DialogV1 from "../../../components/DialogV1";
import NormalButton from "../../../components/NormalButton";
import { THEMES } from "../../../constants";
import { capitalizeFirstLetter } from "../../../functions";
import * as Icon from "../../../icons/icons";
import CustomFormBody from "./CustomFormBody";

const DialogFormBoby = muiStyled("div")(({ theme }) => ({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  position: "relative",
  rowGap: theme.spacing(5),
}));

const DialogForm = (props) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const formik = useFormik({
    enableReinitialize: true,
    validationSchema: props.validationSchema,
    initialValues: {
      ...Object.assign(
        {},
        ...(props.formFields?.map((field) => {
          return {
            ...(field.type === "image" &&
              field.canDeleteImage && {
                [`isDelete${capitalizeFirstLetter(field.name)}Image`]: false,
              }),
            [field.name]: field.value,
          };
        }) || []),
      ),
    },
    onSubmit: (values) => {
      const result = Object.keys(values).reduce((acc, key) => {
        acc[key] = values[key] === "" ? null : values[key];
        return acc;
      }, {});
      if (!props.disabledSave) {
        props.onSubmit(result);
      }
    },
  });

  return (
    <DialogV1
      {...props}
      dialogProps={{
        PaperProps: {
          sx: {
            overflowY: "initial",
            maxWidth: props.width || "800px",
          },
        },
      }}
      dialogContentProps={{
        sx: {
          borderRadius: "6px",
          padding: (theme) => `${theme.spacing(8)} ${theme.spacing(6)}`,
        },
      }}
    >
      {props.loading && (
        <Box
          component="div"
          className="loading-layout"
          sx={{
            width: "100%",
            height: "100%",
            left: 0,
            top: 0,
            position: "absolute",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999999999999,
            backgroundColor: "rgba(0,0,0, 0.1)",
          }}
        >
          <CircularProgress
            sx={{
              zIndex: 99999999999999,
            }}
          />
        </Box>
      )}
      <DialogFormBoby>
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
          {props.disableDefaultButton && (
            <NormalButton
              onClick={() => props.onClose()}
              sx={{
                position: "absolute",
                width: "initial",
                height: "initial",
                padding: (theme) => theme.spacing(1.5),
                top: 0,
                right: 0,
                transform: "translateY(-5%)",
                backgroundColor: "rgba(75, 70, 92, 0.16)",
                borderRadius: (theme) => theme.spacing(1),
                color: "rgba(0, 0, 0, 0.3)",
              }}
            >
              <Icon.FaTimesIcon />
            </NormalButton>
          )}
          <Typography
            variant="h4"
            className="title"
            sx={{
              color: (theme) => theme.palette.primaryTheme.brown(),
            }}
          >
            {props.title}
          </Typography>
        </Box>
        {props.header}
        <Typography component="form" onSubmit={formik.handleSubmit}>
          <Box
            sx={{
              display: "grid",
              color: (theme) => theme.palette.primaryTheme.brown(),
            }}
            {...{
              ...(props.gridTemplateColumns
                ? {
                    gridTemplateColumns: props.gridTemplateColumns,
                  }
                : {
                    gridTemplateColumns: "repeat(12, 1fr)",
                  }),
            }}
            rowGap={2}
            columnGap={4}
          >
            <CustomFormBody formik={formik} formFields={props?.formFields} />
          </Box>
          <Box
            sx={{
              display: "flex",
              columnGap: (theme) => theme.spacing(3),
              marginTop: (theme) => theme.spacing(3),
            }}
          >
            <NormalButton
              type="submit"
              disabled={props.disabledSave}
              sx={{
                width: "auto",
                padding: (theme) => `${theme.spacing(2)} ${theme.spacing(4)}`,
                borderRadius: (theme) => theme.spacing(1),
                ...(props.disabledSave
                  ? {
                      cursor: "default",
                      backgroundColor: "rgba(0,0,0,0.1)",
                    }
                  : {
                      backgroundColor: (theme) =>
                        theme.palette.primaryTheme.main,
                      color: "white !important",
                    }),
              }}
            >
              {t("_save_button")}
            </NormalButton>
            <NormalButton
              type="button"
              onClick={() => props.onClose()}
              sx={{
                width: "auto",
                padding: (theme) => `${theme.spacing(2)} ${theme.spacing(4)}`,
                borderRadius: (theme) => theme.spacing(1),
                backgroundColor: "rgba(0,0,0,0.1)",
                color: `${
                  theme.name === THEMES.DARK ? "white" : "rgba(0, 0, 0, 0.5)"
                } !important`,
              }}
            >
              {t("_cancel_button")}
            </NormalButton>
          </Box>
        </Typography>
      </DialogFormBoby>
    </DialogV1>
  );
};

export default DialogForm;
