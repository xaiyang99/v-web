import React from "react";
import * as Icon from "../../../icons/icons";
import SelectV1 from "../components/SelectV1";
import DialogCreateSEO from "../components/DialogCreateSEO";
import DialogDeleteSEO from "../components/DialogDeleteSEO";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  InputLabel,
  Paper,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import BreadcrumbNavigate from "../../../components/BreadcrumbNavigate";
import {
  MUTATION_DELETE_PAGE,
  QUERY_PAGE,
  CREATE_SEO,
  UPDATE_SEO,
} from "./apollo";
import { useLazyQuery, useMutation } from "@apollo/client";
import useFilter from "./useFilter";
import useManageSEO from "./hooks/manageSEO";
import { errorMessage, successMessage } from "../../../components/Alerts";
import { useTranslation } from "react-i18next";

const CardHeaderTitle = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
});

const CardHeaderFunction = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "start",
  justifyContent: "start",
  flexDirection: "column",
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
  },
}));

const BoxAddNewPage = styled(Box)({
  width: "50%",
  textAlign: "end",
});

const ActionButtonArea = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "end",
  marginTop: "2rem",
});

function SEOComponent() {
  const { t } = useTranslation();
  const filter = useFilter();
  const manageSEO = useManageSEO({ filter: filter.data });
  const [pageId, setPageId] = React.useState(0);
  const [pageName, setPageName] = React.useState("");
  const [openDialog, setOpenDialog] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [isUpdate, setIsUpdate] = React.useState(false);
  const [pages, setPages] = React.useState([]);

  const [id, setId] = React.useState(manageSEO?.data?.[0]?._id || "");
  const [title, setTitle] = React.useState(manageSEO?.data?.[0]?.title || "");
  const [description, setDescription] = React.useState(
    manageSEO?.data?.[0]?.description || ""
  );
  const [keyword, setKeyword] = React.useState(
    manageSEO?.data?.[0]?.keywords || ""
  );
  React.useEffect(() => {
    if (manageSEO.data && manageSEO.data.length === 1) {
      setId(manageSEO?.data?.[0]?._id);
      setTitle(manageSEO?.data?.[0]?.title);
      setDescription(manageSEO?.data?.[0]?.description);
      setKeyword(manageSEO?.data?.[0]?.keywords);
    } else {
      setId(0);
      setTitle("");
      setDescription("");
      setKeyword("");
    }
  }, [
    manageSEO?.data?.[0]?.title,
    manageSEO?.data?.[0]?.description,
    manageSEO?.data?.[0]?.keywords,
  ]);

  const [deletePage] = useMutation(MUTATION_DELETE_PAGE);
  const [createNewSEO] = useMutation(CREATE_SEO);
  const [updateNewSEO] = useMutation(UPDATE_SEO);
  const [getPages, { data: pageData, refetch: pageRefetch }] =
    useLazyQuery(QUERY_PAGE);

  const handleCloseCreateDialog = () => {
    setOpenDialog(false);
  };

  const handleCloseDialog = () => {
    setDeleteOpen(false);
  };

  const reloadData = () => {
    pageRefetch();
    manageSEO.customSEO();
    setIsUpdate(false);
    setOpenDialog(false);
  };

  const handleCreateSEO = async () => {
    try {
      const result = await createNewSEO({
        variables: {
          input: {
            title: title,
            description: description,
            keywords: keyword,
            status: "active",
          },
        },
      });
      if (result?.data?.createSEO?._id) {
        manageSEO.customSEO();
        pageRefetch();
        successMessage("SEO created successful!", 2000);
      }
    } catch (error) {
      errorMessage("SEO creation is failed! try again later!", 3000);
    }
  };

  const handleUpdateSEO = async () => {
    try {
      const result = await updateNewSEO({
        variables: {
          id: id,
          input: {
            title: title,
            description: description,
            keywords: keyword,
            status: "active",
          },
        },
      });
      if (result?.data?.updateSEO) {
        manageSEO.customSEO();
        pageRefetch();
        successMessage("SEO updated successful!", 2000);
      }
    } catch (error) {
      errorMessage("Updating is failed! try again later!", 3000);
    }
  };

  const handleDeletePage = async () => {
    try {
      const result = await deletePage({
        variables: {
          id: pageId,
        },
      });
      if (result?.data?.deletePage) {
        setDeleteOpen(false);
        manageSEO.customSEO();
        pageRefetch();
        successMessage("Delete successful!", 2000);
      }
    } catch (error) {
      errorMessage("Delete failed! try again later!", 3000);
    }
  };

  React.useEffect(() => {
    getPages({
      variables: {
        where: {
          status: "active",
        },
        orderBy: "createdAt_DESC",
      },
    });
    const pagesData = pageData?.getPages?.data;
    setPages(pageData?.getPages?.data);
    if (pagesData?.length > 0) {
      const firstPage = pagesData?.[0];
      filter.dispatch({
        type: filter.ACTION_TYPE.PAGE,
        payload: firstPage._id,
      });
      setPageId(firstPage._id);
      setPageName(firstPage.name);
    }
  }, [pageData]);

  const options = pages?.map((item) => ({
    label: item.name,
    value: item._id,
  }));

  return (
    <React.Fragment>
      <Box sx={{ margin: "0.5rem 0" }}>
        <BreadcrumbNavigate
          separatorIcon={<Icon.ForeSlash />}
          path={["setting", "seo"]}
          readablePath={[t("_setting"), t("_seo_management")]}
        />
      </Box>
      <Paper elevation={3} sx={{ mt: 3 }}>
        <Card>
          <CardContent>
            <CardHeaderTitle>
              <SelectV1
                label="Select page"
                selectStyle={{
                  height: "45px",
                  minHeight: "45px",
                  width: "60%",
                }}
                selectProps={{
                  onChange: (e) => {
                    filter.dispatch({
                      type: filter.ACTION_TYPE.PAGE,
                      payload: e?.value || null,
                    });
                    setPageId(e?.value || null);
                    setPageName(e?.label || null);
                  },
                  options: options,
                  placeholder: "Select page",
                  defaultValue: options?.[0],
                }}
              />
              <BoxAddNewPage>
                <Button variant="contained" onClick={() => setOpenDialog(true)}>
                  {t("_create_new")}
                </Button>
              </BoxAddNewPage>
            </CardHeaderTitle>
            <CardHeaderFunction>
              {pageId > 0 && (
                <Box sx={{ mt: 4 }}>
                  <Typography
                    variant=""
                    sx={{
                      fontSize: "1.1rem",
                      fontWeight: 600,
                      mt: 3,
                      mb: 1,
                      color: "#5D586C",
                    }}
                  >
                    {pageName}
                  </Typography>
                  &nbsp;&nbsp;
                  <Button onClick={() => setDeleteOpen(true)} color="error">
                    {t("_delete_button")}
                  </Button>
                  <Button
                    color="success"
                    onClick={() => {
                      setIsUpdate(true);
                      setOpenDialog(true);
                    }}
                  >
                    {t("_update_button")}
                  </Button>
                </Box>
              )}
              <Typography
                variant=""
                sx={{
                  fontSize: "0.8rem",
                  fontWeight: 500,
                  mt: 1,
                  mb: 1,
                  color: "#A5A2AE",
                }}
              >
                {t("_show_text_detail")} {pageName}:
              </Typography>
            </CardHeaderFunction>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12}>
                <InputLabel
                  htmlFor="my-input"
                  sx={{ color: "#5D586C", fontWeight: 500 }}
                >
                  {t("_website_title")}
                </InputLabel>
                <TextField
                  sx={{
                    width: "100%",
                    "& .MuiInputBase-root": {
                      input: {
                        fontWeight: 600,
                        color: "#5D586C !important",
                        "&::placeholder": {
                          opacity: 1,
                          color: "#9F9F9F",
                        },
                      },
                    },
                  }}
                  placeholder={t("_website_title_placeholder")}
                  size="medium"
                  InputLabelProps={{
                    shrink: false,
                  }}
                  helperText={t("_website_title_description")}
                  FormHelperTextProps={{
                    style: {
                      fontSize: "0.8rem",
                      color: "#A5A2AE",
                      height: "auto",
                    },
                  }}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sx={{ mt: 2 }}>
                <InputLabel
                  htmlFor="my-input"
                  sx={{ color: "#5D586C", fontWeight: 500 }}
                >
                  {t("_website_description")}
                </InputLabel>
                <TextField
                  sx={{
                    width: "100%",
                    "& .MuiInputBase-root": {
                      input: {
                        fontWeight: 600,
                        color: "#5D586C !important",
                        "&::placeholder": {
                          opacity: 1,
                          color: "#9F9F9F",
                        },
                      },
                    },
                  }}
                  placeholder={t("_website_description_placeholder")}
                  size="medium"
                  InputLabelProps={{
                    shrink: false,
                  }}
                  helperText="Description of your website"
                  multiline
                  rows={3}
                  FormHelperTextProps={{
                    style: {
                      fontSize: "0.8rem",
                      color: "#A5A2AE",
                      height: "auto",
                    },
                  }}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sx={{ mt: 2 }}>
                <InputLabel
                  htmlFor="my-input"
                  sx={{ color: "#5D586C", fontWeight: 500 }}
                >
                  {t("_website_keyword")}
                </InputLabel>
                <TextField
                  sx={{
                    width: "100%",
                    "& .MuiInputBase-root": {
                      input: {
                        fontWeight: 600,
                        color: "#5D586C !important",
                        "&::placeholder": {
                          opacity: 1,
                          color: "#9F9F9F",
                        },
                      },
                    },
                  }}
                  placeholder={t("_website_keyword_placeholder")}
                  size="medium"
                  InputLabelProps={{
                    shrink: false,
                  }}
                  helperText={t("_website_keyword_description")}
                  multiline
                  rows={3}
                  FormHelperTextProps={{
                    style: {
                      fontSize: "0.8rem",
                      color: "#A5A2AE",
                      height: "auto",
                    },
                  }}
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </Grid>
            </Grid>
            <ActionButtonArea>
              <Button
                variant="contained"
                size="medium"
                sx={{
                  background: "#F1F1F2",
                  color: "#A8AAAE",
                  "& :hover": {
                    background: "#F1F1F2",
                    color: "#A8AAAE",
                  },
                  mr: 4,
                }}
              >
                {t("_discard_button")}
              </Button>
              <Button
                variant="contained"
                size="medium"
                onClick={
                  manageSEO?.data?.length === 1
                    ? handleUpdateSEO
                    : handleCreateSEO
                }
              >
                {manageSEO?.data?.length === 1
                  ? t("_update_button")
                  : t("_save_change")}
              </Button>
            </ActionButtonArea>
          </CardContent>
        </Card>
      </Paper>

      <DialogDeleteSEO
        isOpen={deleteOpen}
        onClose={handleCloseDialog}
        onClick={handleDeletePage}
        title={pageName}
      />

      <DialogCreateSEO
        pageName={isUpdate ? pageName : ""}
        pageId={isUpdate ? pageId : 0}
        isOpen={openDialog}
        onClose={handleCloseCreateDialog}
        onLoadData={reloadData}
        isUpdate={isUpdate}
      />
    </React.Fragment>
  );
}

export default SEOComponent;
