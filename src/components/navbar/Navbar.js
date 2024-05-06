import { withTheme } from "@emotion/react";
import styled from "@emotion/styled";
import React from "react";
import { Search as SearchIcon } from "react-feather";
import { useTranslation } from "react-i18next";

import {
  Grid,
  InputBase,
  AppBar as MuiAppBar,
  // IconButton as MuiIconButton,
  Toolbar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { THEMES } from "../../constants";
import NavbarLanguagesDropdown from "./NavbarLanguagesDropdown";
import NavbarMessagesDropdown from "./NavbarMessagesDropdown";
import NavbarNotificationsDropdown from "./NavbarNotificationsDropdown";
import NavbarUserDropdown from "./NavbarUserDropdown";

const AppBar = styled(MuiAppBar)`
  background: ${(props) => props.theme.palette.background.default};
`;

const Search = styled("div")(({ theme }) => ({
  color: theme.palette.primary.main,
  display: "flex",
  alignItems: "center",
  marginLeft: theme.spacing(4),
  columnGap: theme.spacing(2.5),
}));

const Input = styled(InputBase)(({ theme }) => ({
  input: {
    color: theme.palette.primary.main,
    "&::placeholder": {
      color: "#000000",
    },
  },
}));

// const Navbar = ({ onDrawerToggle }) => { // ໂຕເກົ່າທີ່ບໍ່ໄດ້ໃຊ້
const Navbar = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isLgUp = useMediaQuery(theme.breakpoints.up("lg"));
  return (
    <React.Fragment>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          padding: `0 ${isLgUp ? "30px" : "20px"}`,
        }}
      >
        <Toolbar
          sx={{
            padding: "0 !important",
            minHeight: "0 !important",
            marginTop: (theme) => `${theme.spacing(3)}`,
          }}
        >
          <Grid
            container
            alignItems="center"
            sx={{
              padding: "2px 10px 2px 2px",
              backgroundColor: "#FFFFFF",
              borderRadius: "6px",
              boxShadow: (theme) => theme.baseShadow.primary,
            }}
          >
            {/* <Grid item sx={{ display: { xs: "block", md: "none" } }}>
              <IconButton
                color="black"
                aria-label="Open drawer"
                onClick={onDrawerToggle}
                size="large"
              >
                <MenuIcon />
              </IconButton>
            </Grid> */}
            <Grid item>
              <Search>
                <SearchIcon
                  color={
                    theme.name === THEMES.DEFAULT
                      ? theme?.palette?.main
                      : theme.palette.primary.main
                  }
                />
                <Input placeholder={t("Search")} />
              </Search>
              {/* <Search>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <Input placeholder={t("Search")} />
              </Search> */}
            </Grid>
            <Grid item xs />
            <Grid
              item
              sx={{
                color:
                  theme.name === THEMES.DEFAULT
                    ? theme?.palette?.main
                    : theme.palette.primary.main,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <NavbarMessagesDropdown />
              &nbsp;
              <NavbarNotificationsDropdown />
              &nbsp;
              <NavbarLanguagesDropdown />
              &nbsp;
              <NavbarUserDropdown />
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
};

export default withTheme(Navbar);
