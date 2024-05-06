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
  const [paymentData, setPaymentData] = useState({});
  const navigate = useNavigate();
  const pages = [
    {
      name: "main",
      path: ["/dashboard/payment"],
      readablePath: [t("_payment_menu")],
    },
    {
      name: "invoiceAdd",
      path: ["/dashboard/payment", "invoice-add"],
      readablePath: ["Payment", "Invoice Add"],
    },
    {
      name: "invoicePreview",
      path: ["/dashboard/payment", "invoice-preview"],
      readablePath: [t("_payment_menu"), t("_invoice_preview")],
    },
    {
      name: "receiptPreview",
      path: ["/dashboard/payment", "receipt-preview"],
      readablePath: [t("_payment_menu"), t("_receipt_preview")],
    },
    {
      name: "invoiceEdit",
      path: ["/dashboard/payment", "invoice-edit"],
      readablePath: [t("_payment_menu"), t("_edit_invoice")],
    },
    {
      name: "invoiceEditByDataId",
      path: ["/dashboard/payment", "invoice-edit"],
      readablePath: [t("_payment_menu"), t("_edit_invoice")],
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
              onEvent={(name, paymentValue) => {
                setPaymentData(paymentValue);
                setActiveStep(pages.find((data) => data.name === name).name);
              }}
            />
          </Paper>
        );
        break;
      case "invoiceAdd":
        step = (
          <InvoiceAndReceipt
            type="add"
            onEvent={(name, paymentValue) => {
              setPaymentData(paymentValue);
              setActiveStep(pages.find((data) => data.name === name).name);
            }}
          />
        );
        break;
      case "invoicePreview":
        step = (
          <InvoiceAndReceipt
            type="preview"
            data={paymentData}
            onEvent={(name, paymentValue) => {
              setPaymentData(paymentValue);
              setActiveStep(pages.find((data) => data.name === name).name);
            }}
          />
        );
        break;
      case "receiptPreview":
        step = (
          <InvoiceAndReceipt
            forPaper="receipt"
            type="preview"
            data={paymentData}
            onEvent={(name, paymentValue) => {
              setPaymentData(paymentValue);
              setActiveStep(pages.find((data) => data.name === name).name);
            }}
          />
        );
        break;
      case "invoiceEdit":
        step = (
          <InvoiceAndReceipt
            type="edit"
            data={paymentData}
            onEvent={(name, paymentValue) => {
              setPaymentData(paymentValue);
              setActiveStep(pages.find((data) => data.name === name).name);
            }}
          />
        );
        break;
      case "invoiceEditByDataId":
        step = (
          <InvoiceAndReceipt
            type="edit"
            isByDataId
            data={paymentData}
            onEvent={(name, paymentValue) => {
              setPaymentData(paymentValue);
              setActiveStep(pages.find((data) => data.name === name).name);
            }}
          />
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
