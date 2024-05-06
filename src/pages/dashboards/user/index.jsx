import { Box, Paper } from "@mui/material";

// components
import "./../css/style.css";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import "react-responsive-pagination/themes/classic.css";
import { useNavigate } from "react-router-dom";
import BreadcrumbNavigate from "../../../components/BreadcrumbNavigate";
import * as Icon from "../../../icons/icons";
import Main from "./Main";
import ViewUser from "./sections/ViewUser";

function Index() {
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState("main");
  const [activeInvoiceData, setActiveInvoiceData] = useState({});
  const navigate = useNavigate();
  const pages = [
    {
      name: "main",
      path: ["/dashboard/user"],
      readablePath: ["Manage Customer"],
    },
    {
      name: "viewUser",
      path: ["/dashboard/view-customer"],
      readablePath: ["View Customer"],
    },
    {
      name: "editCustomer",
      path: ["/dashboard/edit-customer"],
      readablePath: ["Edit Customer"],
    },
  ];

  const getIndexOfAPage = pages.map((data) => data.name).indexOf(activeStep);
  const pageProcesses = () => {
    let step = null;
    switch (activeStep) {
      case "main":
        step = (
          <Paper
            sx={{
              mt: (theme) => theme.spacing(3),
              boxShadow: (theme) => theme.baseShadow.secondary,
              flex: "1 1 0%",
            }}
          >
            <Main />
          </Paper>
        );
        break;
      case "viewUser":
        step = (
          <Paper
            sx={{
              mt: (theme) => theme.spacing(3),
              boxShadow: (theme) => theme.baseShadow.secondary,
              flex: "1 1 0%",
            }}
          >
            <ViewUser />
          </Paper>
        );
        break;
      case "editCustomer":
        step = (
          <Paper
            sx={{
              mt: (theme) => theme.spacing(3),
              boxShadow: (theme) => theme.baseShadow.secondary,
              flex: "1 1 0%",
            }}
          ></Paper>
        );
        break;
      default:
        return;
    }
    return step;
  };
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <BreadcrumbNavigate
          disableDefault
          disableTitleNavigate
          title="Customer"
          separatorIcon={<Icon.ForeSlash />}
          path={pages[getIndexOfAPage]?.path}
          readablePath={pages[getIndexOfAPage]?.readablePath}
          handleNavigate={(path) => navigate(path)}
        />
        {pageProcesses()}
      </Box>
    </>
  );
}

export default Index;
