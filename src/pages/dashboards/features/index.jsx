import { useLazyQuery, useMutation } from "@apollo/client";
import { TextareaAutosize } from "@mui/base";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SendIcon from "@mui/icons-material/Send";
import { Button, CardHeader, IconButton, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import he from "he";
import React, { useState } from "react";
import Banner from "../components/Banner";
import {
  MUTATION_CREATE_FEATURE,
  QUERY_FEATURES,
  UPDATE_FEATURE,
} from "./apollo/features";
//component
import { LoadingButton } from "@mui/lab";
import { useTranslation } from "react-i18next";
import { errorMessage, successMessage } from "../../../components/Alerts";
import { keyBunnyCDN, linkBunnyCDN, previewImage } from "../../../functions";
import useAuth from "../../../hooks/useAuth";
import usePermission from "../../../hooks/usePermission";
import profileImage from "../../../image/no_image.jpg";
import MenuFeature from "../components/MenuFeature";
import * as MUI from "../css/user";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "left",
  color: theme.palette.text.secondary,
}));
const StyledTextarea = styled(TextareaAutosize)`
  margin-top: 40px;
  width: 600px;
  font-family:
    IBM Plex Sans,
    sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  padding: 12px;
  border-radius: 12px 12px 0 12px;
  // firefox
  &:focus-visible {
    outline: 0;
  }
`;
function Index() {
  const { t } = useTranslation();
  const [getFeatures, { data: isData, refetch: featureRefetch }] = useLazyQuery(
    QUERY_FEATURES,
    {
      fetchPolicy: "no-cache",
    },
  );
  const [open, setOpen] = React.useState(false);
  const [file, setFile] = React.useState({});
  const [preview, setPreview] = React.useState("");
  const [createFeature] = useMutation(MUTATION_CREATE_FEATURE);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const openMenu = Boolean(anchorEl);
  const [updateFeature] = useMutation(UPDATE_FEATURE);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [getImage, setGetImage] = useState("");
  const { user } = useAuth();
  const permission = usePermission(user?._id);
  const [featureData, setFeatureData] = useState({
    title: "",
    content: "",
  });
  const [variant, setVariant] = useState("contained");
  const [loadings, setLoadings] = useState(false);
  const handleMouseEnter = () => {
    setVariant("outlined");
  };

  const handleMouseLeave = () => {
    setVariant("contained");
  };
  const handleClickOpen = () => {
    setOpen(true);
    setTitle("");
    setContent("");
  };
  const handleClose = () => {
    setOpen(false);
    setLoadings(false);
  };
  const handleOpenMenu = (event, value) => {
    setId(value?._id);
    setContent(value?.Content1);
    setTitle(value?.title);
    setGetImage(value?.image);
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  const handleUpdateOpen = () => {
    setOpenUpdate(true);
  };

  const handleUpdateClose = () => {
    setOpenUpdate(false);
    setLoadings(false);
    setPreview("");
  };
  const preViewImage = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setPreview(reader.result);
    };
  };

  const queryFeature = async () => {
    getFeatures({
      variables: {
        orderBy: "createdAt_DESC",
      },
    });
  };

  React.useEffect(() => {
    queryFeature();
  }, []);

  const handleCreateFeatures = async (e) => {
    setLoadings(true);
    try {
      e.preventDefault();
      const fileName = file.name;
      const fileExtension = fileName.split(".").pop();
      const fileNewName = Math.floor(
        1111111111111 + Math.random() * 9999999999999,
      );
      const feature = await createFeature({
        variables: {
          data: {
            title: featureData.title,
            image: `${fileNewName}.${fileExtension}`,
            Content1: featureData.content,
          },
        },
      });
      if (feature.data?.createFeatures?._id) {
        const url = `${linkBunnyCDN}image/${fileNewName}.${fileExtension}`;
        const apiKey = keyBunnyCDN;
        const response = await fetch(url, {
          method: "PUT",
          headers: {
            AccessKey: apiKey,
            "Content-Type": file.type,
          },
          body: file,
        });

        if (response.ok) {
          setLoadings(false);
        } else {
          console.error(
            "An error occurred while uploading the image:",
            response.statusText,
          );
        }

        featureRefetch();
        setOpen(false);
        setTitle("");
        setContent("");
        setFile({});
        setFeatureData({
          content: "",
          title: "",
        });
        setPreview("");
        successMessage("Create Features success", 3000);
      }
    } catch (error) {
      errorMessage("Create Features Erorr", 3000);
    }
  };

  // update
  const handleFeatureUpdate = async () => {
    setLoadings(true);
    try {
      let fileExtension = null;
      let fileNewName = null;
      if (Object.keys(preview).length > 0) {
        const fileName = file.name;
        fileExtension = fileName.split(".").pop();
        const addfileNewName = Math.floor(
          1111111111111 + Math.random() * 9999999999999,
        );
        fileNewName = `${addfileNewName}.${fileExtension}`;
      } else {
        fileNewName = getImage;
      }

      const editFeature = await updateFeature({
        variables: {
          data: {
            image: `${fileNewName}`,
            title: he.decode(title),
            Content1: he.decode(content),
          },
          where: {
            _id: id,
          },
        },
      });
      if (editFeature.data) {
        const url = `${linkBunnyCDN}image/${fileNewName}`;
        const apiKey = keyBunnyCDN;
        const response = await fetch(url, {
          method: "PUT",
          headers: {
            AccessKey: apiKey,
            "Content-Type": file.type,
          },
          body: file,
        });

        if (response.ok) {
          if (Object.keys(preview).length > 0) {
            const response = await fetch(`${linkBunnyCDN}image/${getImage}`, {
              method: "DELETE",
              headers: {
                AccessKey: apiKey,
              },
            });

            if (!response.ok) {
              console.error(
                "An error occurred while deleting the image:",
                response.statusText,
              );
            }
          }
          setLoadings(false);
        } else {
          console.error(
            "An error occurred while uploading the image:",
            response.statusText,
          );
        }

        successMessage("Update feature success", 3000);
        featureRefetch();
        setFeatureData({
          title: "",
          content: "",
        });
        handleUpdateClose();
      }
    } catch (error) {
      errorMessage("Update Features Erorr", 3000);
    }
  };

  return (
    <React.Fragment>
      <Banner />
      <Box sx={{ flexGrow: 1, m: 5 }}>
        <Box
          sx={{
            mt: 2,
            mb: 3,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h4">{t("_feature_title")}</Typography>
          <Button
            variant={variant}
            color="primaryTheme"
            disabled={
              !permission?.hasPermission("feature_create") ? true : false
            }
            sx={{
              borderRadius: "6px",
            }}
            startIcon={<AddIcon />}
            onClick={() =>
              permission?.hasPermission("feature_create") && handleClickOpen()
            }
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {t("_create_new")}
          </Button>
        </Box>
        <Grid container spacing={2}>
          {isData?.features?.data?.map((item, index) => {
            return (
              <Grid item xs={12} md={3} key={index}>
                <Item>
                  <Card
                    sx={{
                      height: "auto",
                      mb: 2,
                      "&:hover": {
                        overflow: "auto",
                      },
                      "&::-webkit-scrollbar": {
                        width: "0",
                      },
                    }}
                  >
                    <CardHeader
                      action={
                        (permission?.hasPermission("feature_edit") ||
                          permission?.hasPermission("feature_delete")) && (
                          <IconButton
                            aria-label="settings"
                            onClick={(e) => handleOpenMenu(e, item)}
                            aria-controls={
                              openMenu ? "account-menu" : undefined
                            }
                            aria-haspopup="true"
                            aria-expanded={openMenu ? "true" : undefined}
                            id="fade-button"
                          >
                            <MoreVertIcon />
                          </IconButton>
                        )
                      }
                    />

                    <CardMedia
                      component="img"
                      height="140"
                      image={
                        item?.image
                          ? `${previewImage}${item?.image}`
                          : profileImage
                      }
                      alt={item?.image}
                      sx={{ padding: "1em 1em 0 1em", objectFit: "contain" }}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {he.decode(item?.title)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {he.decode(item?.Content1)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Item>
              </Grid>
            );
          })}
        </Grid>

        {/* create features */}
        <Dialog
          open={open}
          maxWidth="lg"
          onClose={handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title" sx={{ mt: 3 }}>
            {t("_create_new_feature_title")}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={4} sx={{ mt: 3 }}>
              <Grid item lg={12} md={12} xs={12}>
                <Grid container spacing={2}>
                  <Grid item lg={12} md={12} xs={12}>
                    <TextField
                      sx={{ mt: 3, mb: 3 }}
                      type="text"
                      label={t("_title_placeholder")}
                      fullWidth
                      value={featureData.title}
                      onChange={(e) =>
                        setFeatureData({
                          ...featureData,
                          title: e.target.value,
                        })
                      }
                    />
                  </Grid>
                  <Grid item lg={12} md={12} xs={12}>
                    <MUI.divShowPickImage>
                      <MUI.divPreviewImage>
                        {Object.keys(preview).length > 0 ? (
                          <img src={preview} alt="image" />
                        ) : (
                          <img src={profileImage} alt="previewImage" />
                        )}
                      </MUI.divPreviewImage>
                      <MUI.divShowPickerIcon>
                        <Button
                          startIcon={<AddIcon />}
                          sx={{ cursor: "pointer" }}
                          component="label"
                        >
                          {t("_choose_image")}
                          <input
                            type="file"
                            name="image"
                            hidden
                            onChange={(e) => {
                              setFile(e.target.files[0]);
                              preViewImage(e.target.files[0]);
                            }}
                          />
                        </Button>
                      </MUI.divShowPickerIcon>
                    </MUI.divShowPickImage>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <StyledTextarea
              aria-label="maximum height"
              placeholder={t("_content_placeholder")}
              maxRows={24}
              minRows={2}
              onChange={(e) =>
                setFeatureData({ ...featureData, content: e.target.value })
              }
              value={featureData.content}
            />
          </DialogContent>
          <DialogActions sx={{ mb: 5, mr: 5 }}>
            <Button
              autoFocus
              variant="contained"
              color="error"
              onClick={handleClose}
              sx={{ borderRadius: "6px" }}
              size="medium"
            >
              {t("_cancel_button")}
            </Button>
            <LoadingButton
              size="medium"
              color="primaryTheme"
              onClick={handleCreateFeatures}
              loading={loadings}
              loadingPosition="end"
              endIcon={<SendIcon />}
              variant="contained"
            >
              <span>{t("_save_button")}</span>
            </LoadingButton>
          </DialogActions>
        </Dialog>

        {/* update features */}
        <Dialog
          open={openUpdate}
          maxWidth="lg"
          onClose={handleUpdateClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title" sx={{ mt: 3 }}>
            {t("_update_new_feature_title")}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={4} sx={{ mt: 3 }}>
              <Grid item lg={12} md={12} xs={12}>
                <Grid container spacing={2}>
                  <Grid item lg={12} md={12} xs={12}>
                    <TextField
                      sx={{ mt: 3, mb: 3 }}
                      type="text"
                      label={t("_title_placeholder")}
                      fullWidth
                      value={he.decode(title)}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </Grid>
                  <Grid item lg={12} md={12} xs={12}>
                    <MUI.divShowPickImage>
                      <MUI.divPreviewImage>
                        {Object.keys(preview).length > 0 ? (
                          <img src={preview} alt="imageupload" />
                        ) : getImage ? (
                          <img src={`${previewImage}${getImage}`} alt="image" />
                        ) : (
                          <img src={profileImage} alt="previewImage" />
                        )}
                      </MUI.divPreviewImage>
                      <MUI.divShowPickerIcon>
                        <Button
                          startIcon={<AddIcon />}
                          sx={{ cursor: "pointer" }}
                          component="label"
                        >
                          {t("_choose_image")}
                          <input
                            type="file"
                            name="image"
                            hidden
                            onChange={(e) => {
                              setFile(e.target.files[0]);
                              preViewImage(e.target.files[0]);
                            }}
                          />
                        </Button>
                      </MUI.divShowPickerIcon>
                    </MUI.divShowPickImage>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <StyledTextarea
              maxRows={24}
              aria-label="maximum height"
              placeholder={t("_content_placeholder")}
              value={he.decode(content)}
              onChange={(e) => setContent(e.target.value)}
            />
          </DialogContent>
          <DialogActions sx={{ mb: 5, mr: 5 }}>
            <Button
              sx={{ borderRadius: "6px" }}
              autoFocus
              variant="contained"
              color="error"
              size="medium"
              onClick={handleUpdateClose}
            >
              {t("_cancel_button")}
            </Button>
            <LoadingButton
              size="medium"
              color="primaryTheme"
              onClick={handleFeatureUpdate}
              loading={loadings}
              loadingPosition="end"
              endIcon={<SendIcon />}
              variant="contained"
            >
              <span>{t("_save_button")}</span>
            </LoadingButton>
          </DialogActions>
        </Dialog>
      </Box>

      {/* menu */}
      <MenuFeature
        onClick={handleUpdateOpen}
        onClose={handleCloseMenu}
        open={openMenu}
        anchorEl={anchorEl}
        id={id}
        imageName={getImage}
        featureRefetch={featureRefetch}
      />
    </React.Fragment>
  );
}

export default Index;
