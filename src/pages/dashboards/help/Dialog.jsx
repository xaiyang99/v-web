import DialogV1 from "../../../components/DialogV1";

import {
  Box,
  Button,
  Card,
  CardContent,
  FormGroup,
  Grid,
  InputLabel,
  Switch,
  TextField,
  Tooltip,
  Typography,
  styled,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Editor } from "@tinymce/tinymce-react";
import { THEMES } from "../../../constants";
import InputImageField from "../components/InputImageField";
import { useTranslation } from "react-i18next";

const CustomButton = styled(Button)({
  borderRadius: "6px",
});
const CustomInputLabel = styled(InputLabel)(({ theme }) => ({
  color: theme.palette.primaryTheme.brown(),
  fontWeight: theme.typography.fontWeightMedium,
  marginTop: "20px",
}));
const InputFileFieldLayout = styled(Box)(({ theme }) => ({
  color: theme.palette.primaryTheme.brown(),
  width: "100%",
  height: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}));
const InputFileFieldContainer = styled(Box)({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  height: "100%",
  minHeight: "100%",
});
const AntSwitch = styled(Switch)(({ theme }) => ({
  width: 28,
  height: 18,
  padding: 0,
  display: "flex",
  "&:active": {
    "& .MuiSwitch-thumb": {
      width: 15,
    },
    "& .MuiSwitch-switchBase.Mui-checked": {
      transform: "translateX(9px)",
    },
  },
  "& .MuiSwitch-switchBase": {
    padding: 2,
    "&.Mui-checked": {
      transform: "translateX(12px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        opacity: 1,
      },
    },
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "0 2px 3px 0 rgb(0 35 11 / 20%)",
    width: 13,
    height: 13.5,
    borderRadius: 6,
    transition: theme.transitions.create(["width"], {
      duration: 200,
    }),
  },
  "& .MuiSwitch-track": {
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,.35)"
        : "rgba(0,0,0,.25)",
    boxSizing: "border-box",
  },
}));
function Dialog(props) {
  const theme = useTheme();
  const { t } = useTranslation();
  const {
    onClose,
    onClick,
    dataForEvents,
    setDataForEvents,
    editorRef,
    checked,
    setChecked,
  } = props;

  const isMobile = useMediaQuery("(max-width:600px)");
  const desc = dataForEvents.data?.description;

  return (
    <div>
      <DialogV1
        {...props}
        dialogProps={{
          PaperProps: {
            sx: {
              overflowY: "initial",
              maxWidth: "sm",
            },
            zindex: 10000,
          },
          sx: {
            columnGap: "20px",
          },
        }}
        dialogContentProps={{
          sx: {
            backgroundColor: "white !important",
            borderRadius: "6px",
            padding: (theme) => `${theme.spacing(5)}`,
          },
        }}
      >
        <Card>
          <CardContent>
            <Typography sx={{ mb: 5 }} variant="h6">
              {props.label}
            </Typography>
            <Box>
              <Box sx={{ mb: 3 }}>
                {dataForEvents?.action === "edit" ? (
                  <InputFileFieldContainer>
                    <Box
                      marginTop={theme.spacing(1)}
                      sx={{
                        display: "flex",
                        "&:hover": {
                          borderColor:
                            theme.name === THEMES.DARK ? "white" : "black",
                        },
                        width: "100%",
                        border: `1px solid ${
                          theme.name === THEMES.DARK
                            ? "rgba(255,255,255,0.23)"
                            : "rgba(0,0,0,0.23)"
                        }`,
                        color: "#9F9F9F",
                        borderRadius: "4px",
                        "&::-webkit-file-upload-button": {
                          height: "100%",
                          border: "none",
                          color: theme.palette.primaryTheme.brown(),
                          borderRight: `1px solid ${
                            theme.name === THEMES.DARK
                              ? "rgba(255,255,255,0.23)"
                              : "rgba(0,0,0,0.23)"
                          }`,
                          padding: "0 10px",
                          marginRight: 3,
                        },
                      }}
                    >
                      <Box
                        component="label"
                        className="choose-file"
                        sx={{
                          width: "100%",
                          overflow: "hidden",
                          cursor: "pointer",
                        }}
                      >
                        <InputFileFieldLayout>
                          <Typography
                            id="inputFile"
                            component="input"
                            type="file"
                            sx={{
                              height: "35px",
                              minHeight: "35px",
                              display: "none",
                            }}
                            onChange={(e) =>
                              setDataForEvents((state) => ({
                                ...state.data,
                                action: "show",
                                data: {
                                  ...state.data,
                                  image: e.target.files[0],
                                },
                              }))
                            }
                          />
                          <Box
                            component="div"
                            sx={{
                              height: "100%",
                              display: "flex",
                              alignItems: "center",
                              padding: 3,
                              borderRight: `1px solid ${
                                theme.name === THEMES.DARK
                                  ? "rgba(255,255,255,0.23)"
                                  : "rgba(0,0,0,0.23)"
                              }`,
                            }}
                          >
                            {t("_choose_image")}
                          </Box>
                          <Box
                            className="file-content"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              columnGap: 1,
                              width: "100%",
                              height: "100%",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {dataForEvents.data?.image && (
                              <Typography
                                component="img"
                                src={`${process.env.REACT_APP_BUNNY_PULL_ZONE}image/${dataForEvents.data.image}`}
                                alt="slip-transfer"
                                width={"60%"}
                                height="150px"
                                sx={{ m: 2 }}
                              />
                            )}
                            <Tooltip
                              title={dataForEvents.data.image}
                              placement="bottom-start"
                            >
                              {dataForEvents.data.image ? (
                                <Typography
                                  component="div"
                                  sx={{
                                    display: "flex",
                                    flex: 1,
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  <span>{dataForEvents.data.image}</span>
                                </Typography>
                              ) : (
                                <span>{dataForEvents.data.image}</span>
                              )}
                            </Tooltip>
                          </Box>
                        </InputFileFieldLayout>
                      </Box>
                    </Box>
                  </InputFileFieldContainer>
                ) : (
                  <InputImageField
                    label={
                      dataForEvents.action
                        ? t("_edit_image")
                        : t("_choose_image")
                    }
                    fileData={dataForEvents.data?.image}
                    inputLayoutProps={{
                      sx: {
                        height: "35px",
                        minHeight: "35px",
                      },
                    }}
                    inputProps={{
                      onChange: (e) => {
                        setDataForEvents((state) => ({
                          ...state.data,
                          action: dataForEvents.action ? "edit" : "",
                          data: {
                            ...state.data,
                            image: e.target.files[0],
                          },
                        }));
                      },
                    }}
                  />
                )}
                {dataForEvents.data.error === "Image" && (
                  <Typography
                    variant="p"
                    style={{
                      color: "red",
                      fontSize: "12px",
                    }}
                  >
                    {dataForEvents.data.error} &nbsp;required
                  </Typography>
                )}
              </Box>
              <CustomInputLabel>{t("_title")}</CustomInputLabel>
              <TextField
                error={dataForEvents.data.error === "Title" ? true : false}
                type="text"
                placeholder={t("_title_placeholder")}
                fullWidth
                name="name"
                value={dataForEvents.data?.name}
                onChange={(e) =>
                  setDataForEvents((state) => ({
                    ...state,
                    data: { ...state.data, name: e.target.value },
                  }))
                }
              />
              {dataForEvents.data.error === "Title" && (
                <Typography
                  variant="p"
                  style={{
                    color: "red",
                    fontSize: "12px",
                  }}
                >
                  {dataForEvents.data.error} &nbsp;required
                </Typography>
              )}
              <CustomInputLabel>{t("_description")}</CustomInputLabel>
            </Box>
            <Grid container spacing={4}>
              <Grid
                item
                xs={12}
                sx={{
                  "& .tox-statusbar__branding": {
                    display: "none",
                  },
                  "&.tox-statusbar__branding svg": {
                    display: "none",
                  },
                }}
              >
                <Editor
                  apiKey={process.env.REACT_APP_TINYMCE_API}
                  initialValue={desc}
                  onInit={(evt, editor) => (editorRef.current = editor)}
                  init={{
                    height: isMobile ? 200 : 300,
                    menubar: false,
                    plugins: [
                      "advlist",
                      "autolink",
                      "lists",
                      "link",
                      "image",
                      "charmap",
                      "preview",
                      "anchor",
                      "searchreplace",
                      "visualblocks",
                    ],
                    toolbar:
                      "insertfile undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent image",
                    content_style:
                      "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                    image_uploadtab: true,
                    file_picker_callback: function (callback) {
                      const input = document.createElement("input");
                      input.type = "file";
                      input.accept = "image/*";
                      input.onchange = function () {
                        if (input.files.length > 0) {
                          const file = input.files[0];
                          const reader = new FileReader();
                          reader.onload = function () {
                            callback(reader.result, { title: file.name });
                          };
                          reader.readAsDataURL(file);
                        }
                      };
                      input.click();
                    },
                  }}
                />
              </Grid>
            </Grid>

            {dataForEvents.action && (
              <FormGroup sx={{ mt: 4, ml: 1 }}>
                <Box sx={{ display: "flex", justifyContent: "start", mt: 3 }}>
                  <AntSwitch
                    name="ads"
                    inputProps={{ "aria-label": "ant design" }}
                    checked={checked}
                    onChange={(e) => setChecked(e.target.checked)}
                  />
                  <Box sx={{ display: "block", mt: -2, ml: 3 }}>
                    <Typography variant="subtitle2">No Ads</Typography>
                    <Typography variant="body2" sx={{ fontSize: "12px" }}>
                      Enaling this will make all people a having this plan to
                      not see any ads.
                    </Typography>
                  </Box>
                </Box>
              </FormGroup>
            )}
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                mt: 3,
                mb: 5,
              }}
            >
              <CustomButton
                variant="contained"
                color="primaryTheme"
                onClick={onClick}
              >
                {dataForEvents.action ? t("_update_button") : t("_save_button")}
              </CustomButton>
              <CustomButton
                sx={{ ml: 3 }}
                variant="contained"
                color="secondaryTheme"
                onClick={onClose}
              >
                {t("_cancel_button")}
              </CustomButton>
            </Box>
          </CardContent>
        </Card>
      </DialogV1>
    </div>
  );
}

export default Dialog;
