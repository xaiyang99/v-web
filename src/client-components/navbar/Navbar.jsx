import { withTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { Menu as MenuIcon } from "@mui/icons-material";
import {
  Box,
  ClickAwayListener,
  Grid,
  AppBar as MuiAppBar,
  IconButton as MuiIconButton,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { createTheme } from "@mui/material/styles";
import React, { Fragment, useState } from "react";
import NavbarUserDropdown from "./NavbarUserDropdown";

import { useLazyQuery } from "@apollo/client";
import { ThemeProvider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ENV_KEYS } from "../../constants";
import {
  DateOfNumber,
  GetFileTypeFromFullType,
  getFilenameWithoutExtension,
  truncateName,
} from "../../functions";
import useAuth from "../../hooks/useAuth";
import FileCardItemIcon from "../../pages/client-dashboard/components/file/FileCardItemIcon";
import { QUERY_SEARCH } from "../../pages/client-dashboard/search/apollo";
import InputSearch from "../../pages/client-dashboard/search/inputSearch";
const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
      width642: 642,
      width599: 599,
    },
  },
});

const AppSearch = styled("div")({
  borderRadius: "2px",
  padding: "5px 0px",
  position: "relative",
  background: "#FFF",
  width: "100%",
});
const SearchBar = styled("div")({
  borderRadius: "2px",
  border: "1px solid #ececec",
  position: "absolute",
  left: 0,
  right: 0,
  top: "90%",
  background: "#fff",
  display: "none",
  [theme.breakpoints.up("sm")]: {
    display: "block",
  },
  [theme.breakpoints.between("width599", "width642")]: {
    display: "none",
  },
});
const SearchBarLayout = styled("div")({
  marginTop: 2.5,
  border: "1px solid #ececec",
  boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
  background: "#fff",
  padding: "1rem",
  whiteSpace: "nowrap",
  overflow: "auto",
  maxHeight: "80dvh",
});

const AppBar = styled(MuiAppBar)`
  background: ${(props) => props.theme.header.background};
  color: ${(props) => props.theme.header.color};
  border-bottom: 1px solid #ececec;
`;

const IconButton = styled(MuiIconButton)`
  svg {
    width: 22px;
    height: 22px;
  }
`;

const IconFolderContainer = styled("div")({
  width: "30px",
});

const {
  REACT_APP_STORAGE_ZONE,
  REACT_APP_BUNNY_SECRET_KEY,
  REACT_APP_BUNNY_PULL_ZONE,
  REACT_APP_ACCESSKEY_BUNNY,
  REACT_APP_DOWNLOAD_URL,
} = process.env;

const Navbar = ({ onDrawerToggle }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchFolderAndFile] = useLazyQuery(QUERY_SEARCH, {
    fetchPolicy: "no-cache",
  });
  const [inputSearch, setInputSearch] = useState(null);
  const [inputHover, setInputHover] = useState(false);
  const [dataOfSearch, setDataOfSearch] = useState([]);
  const isMobile = useMediaQuery("(max-width:900px)");

  const handleOnSearchChange = async (value) => {
    if (value) {
      await searchFolderAndFile({
        variables: {
          where: {
            name: value,
            createdBy: user?._id,
          },
        },
        onCompleted: (data) => {
          setDataOfSearch(data.searchFolderAndFile?.data);
        },
      });
    } else {
      setDataOfSearch([]);
    }
    setInputSearch(value);
  };

  const handleOnSearchEnter = () => {
    if (dataOfSearch.length > 0) {
      navigate(`/search/${inputSearch}`);
    }
  };

  const handleOnClickAwaySearch = () => {
    setInputHover(false);
  };

  return (
    <React.Fragment>
      <AppBar position="sticky" elevation={0}>
        <Toolbar>
          <Grid container alignItems="center" sx={{ display: "flex" }}>
            <Grid item sx={{ display: { xs: "block", md: "none" } }}>
              <IconButton
                color="inherit"
                aria-label="Open drawer"
                onClick={onDrawerToggle}
                size="large"
              >
                <MenuIcon />
              </IconButton>
            </Grid>
            <ThemeProvider theme={theme}>
              <Grid
                item
                sx={{
                  width: { lg: "50%", md: "50%" },
                }}
              >
                <ClickAwayListener onClickAway={handleOnClickAwaySearch}>
                  <AppSearch>
                    <InputSearch
                      data={{
                        inputSearch: inputSearch,
                        setInputHover: setInputHover,
                        onChange: handleOnSearchChange,
                        onEnter: handleOnSearchEnter,
                      }}
                    />
                    {inputHover && (
                      <SearchBar>
                        {dataOfSearch?.length > 0 && (
                          <SearchBarLayout>
                            <Typography
                              component="div"
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                rowGap: 1,
                              }}
                            >
                              {dataOfSearch?.map((data, index) => {
                                /* cant get size from API */
                                const isContainsFiles =
                                  data.checkTypeItem === "folder" && data?.size
                                    ? Number(data.size) > 0
                                      ? true
                                      : false
                                    : false;
                                return (
                                  <Fragment key={index}>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        flexShrink: 0,
                                        columnGap: 1,
                                        height: "50px",
                                      }}
                                    >
                                      <Typography
                                        component="div"
                                        sx={{
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          width: "50px",
                                          minWidth: "50px",
                                          height: "100%",
                                        }}
                                      >
                                        <FileCardItemIcon
                                          isContainFiles={isContainsFiles}
                                          name={data.name}
                                          fileType={GetFileTypeFromFullType(
                                            data.type,
                                          )}
                                          imageUrl={
                                            REACT_APP_BUNNY_PULL_ZONE +
                                            user.newName +
                                            "-" +
                                            user._id +
                                            "/" +
                                            (data.newPath
                                              ? truncateName(data.newPath)
                                              : "") +
                                            data.newName
                                          }
                                          thumbnailImageUrl={
                                            REACT_APP_BUNNY_PULL_ZONE +
                                            user.newName +
                                            "-" +
                                            user._id +
                                            "/" +
                                            ENV_KEYS.REACT_APP_THUMBNAIL_PATH +
                                            "/" +
                                            getFilenameWithoutExtension(
                                              data?.newName,
                                            ) +
                                            `.${ENV_KEYS.REACT_APP_THUMBNAIL_EXTENSION}`
                                          }
                                        />
                                      </Typography>

                                      <Box
                                        sx={{
                                          flexGrow: 1,
                                          overflow: "hidden",
                                          textOverflow: "ellipsis",
                                        }}
                                      >
                                        {data.name}
                                      </Box>
                                      <Box>{DateOfNumber(data?.updatedAt)}</Box>
                                    </Box>
                                  </Fragment>
                                );
                              })}
                            </Typography>
                          </SearchBarLayout>
                        )}
                      </SearchBar>
                    )}
                  </AppSearch>
                </ClickAwayListener>
              </Grid>
            </ThemeProvider>
            <Grid item xs />
            <Grid
              item
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* <NavbarNotificationsDropdown />
              <NavbarLanguagesDropdown /> */}
              <NavbarUserDropdown />
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
};

export default withTheme(Navbar);
