import { Box, Grid } from "@mui/material";
import { useState } from "react";
import BreadcrumbNavigate from "../../../components/BreadcrumbNavigate";
import * as Icon from "../../../icons/icons";
import {
  AdminDashboardContainer,
  AdminDashboardItem,
} from "../../client-dashboard/css/adminDashboardStyle";
import Customer from "./components/customer";
import EarningReport from "./components/earningReport";
import Payment from "./components/payment";
import SupportTracker from "./components/supportTracker";
import Traffic from "./components/traffic";
import TransactionMethod from "./components/transactionMethod";

const Index = () => {
  const [activeStep, setActiveStep] = useState("main");

  const pages = [
    {
      name: "main",
      path: ["/dashboard/default"],
      readablePath: ["Dashboard"],
    },
  ];

  const getIndexOfAPage = pages.map((data) => data.name).indexOf(activeStep);
  return (
    <>
      <BreadcrumbNavigate
        disableDefault
        disableTitleNavigate
        separatorIcon={<Icon.ForeSlash />}
        path={pages[getIndexOfAPage]?.path}
        readablePath={pages[getIndexOfAPage]?.readablePath}
        handleNavigate={(path) => path}
      />
      <AdminDashboardContainer>
        <AdminDashboardItem>
          <Grid container spacing={5}>
            <Grid item xs={12} md={8.5}>
              <Box
                sx={{
                  height: "100%",
                  backgroundColor: (theme) =>
                    theme.palette.mode === "dark" ? "#fff" : "#fff",
                  borderRadius: "8px",
                  padding: (theme) => theme.spacing(6),
                  boxShadow: "rgba(0, 0, 0, 0.09) 0px 3px 12px",
                }}
              >
                <Customer />
              </Box>
            </Grid>
            <Grid item xs={12} md={3.5}>
              <Box
                sx={{
                  height: "100%",
                  backgroundColor: (theme) =>
                    theme.palette.mode === "dark" ? "#fff" : "#fff",
                  borderRadius: "8px",
                  padding: (theme) => theme.spacing(6),
                  boxShadow: "rgba(0, 0, 0, 0.09) 0px 3px 12px",
                }}
              >
                <Traffic />
              </Box>
            </Grid>
          </Grid>
        </AdminDashboardItem>
        <AdminDashboardItem>
          <Grid container spacing={5}>
            <Grid item xs={12} md={8.5}>
              <Box
                sx={{
                  height: "100%",
                  backgroundColor: (theme) =>
                    theme.palette.mode === "dark" ? "#fff" : "#fff",
                  borderRadius: "8px",
                  padding: (theme) => theme.spacing(6),
                  boxShadow: "rgba(0, 0, 0, 0.09) 0px 3px 12px",
                }}
              >
                <Payment />
              </Box>
            </Grid>
            <Grid item xs={12} md={3.5}>
              <Box
                sx={{
                  height: "100%",
                  backgroundColor: (theme) =>
                    theme.palette.mode === "dark" ? "#fff" : "#fff",
                  borderRadius: "8px",
                  padding: (theme) => theme.spacing(6),
                  boxShadow: "rgba(0, 0, 0, 0.09) 0px 3px 12px",
                }}
              >
                <EarningReport />
              </Box>
            </Grid>
          </Grid>
        </AdminDashboardItem>
        <AdminDashboardItem>
          <Grid container spacing={5}>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  height: "100%",
                  backgroundColor: (theme) =>
                    theme.palette.mode === "dark" ? "#fff" : "#fff",
                  borderRadius: "8px",
                  boxShadow: "rgba(0, 0, 0, 0.09) 0px 3px 12px",
                }}
              >
                <TransactionMethod />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  height: "100%",
                  backgroundColor: (theme) =>
                    theme.palette.mode === "dark" ? "#fff" : "#fff",
                  borderRadius: "8px",
                  padding: (theme) => theme.spacing(6),
                  boxShadow: "rgba(0, 0, 0, 0.09) 0px 3px 12px",
                }}
              >
                <SupportTracker />
              </Box>
            </Grid>
          </Grid>
        </AdminDashboardItem>
      </AdminDashboardContainer>
    </>
  );
};

export default Index;
