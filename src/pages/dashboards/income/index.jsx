import { Box, Paper } from "@mui/material";

// components
import "./../css/style.css";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import "react-responsive-pagination/themes/classic.css";
import { useNavigate } from "react-router-dom";
import BreadcrumbNavigate from "../../../components/BreadcrumbNavigate";
import * as Icon from "../../../icons/icons";
import InvoiceAndReceipt from "./sections/InvoiceAndReceipt";
import Main from "./sections/Main";

function Index() {
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState("main");
  const [activeInvoiceData, setActiveInvoiceData] = useState({});
  const navigate = useNavigate();
  const pages = [
    {
      name: "main",
      path: ["/dashboard/incomes"],
      readablePath: [t("_income")],
    },
    {
      name: "invoicePreview",
      path: ["/dashboard/incomes", "/dashboard/incomes"],
      readablePath: [t("_income"), t("_income_bill_title")],
    },
    {
      name: "receiptPreview",
      path: ["/dashboard/incomes", "/dashboard/incomes"],
      readablePath: [t("_income"), t("_receipt_bill_title")],
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
            <Main
              onEvent={(name, invoiceData) => {
                setActiveInvoiceData(invoiceData);
                setActiveStep(pages.find((data) => data.name === name).name);
              }}
            />
          </Paper>
        );
        break;
      case "invoicePreview":
        step = (
          <Paper
            sx={{
              mt: (theme) => theme.spacing(3),
              boxShadow: (theme) => theme.baseShadow.secondary,
              flex: "1 1 0%",
            }}
          >
            <InvoiceAndReceipt
              data={activeInvoiceData}
              onEvent={(name) =>
                setActiveStep(pages.find((data) => data.name === name).name)
              }
            />
          </Paper>
        );
        break;
      case "receiptPreview":
        step = (
          <Paper
            sx={{
              mt: (theme) => theme.spacing(3),
              boxShadow: (theme) => theme.baseShadow.secondary,
              flex: "1 1 0%",
            }}
          >
            <InvoiceAndReceipt
              forPaper="receipt"
              data={activeInvoiceData}
              onEvent={(name) =>
                setActiveStep(pages.find((data) => data.name === name).name)
              }
            />
          </Paper>
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
          title="Finance"
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
