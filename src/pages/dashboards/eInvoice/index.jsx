import { Box, Paper } from "@mui/material";

// components
import "./../css/style.css";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import "react-responsive-pagination/themes/classic.css";
import { useNavigate } from "react-router-dom";
import BreadcrumbNavigate from "../../../components/BreadcrumbNavigate";
import * as Icon from "../../../icons/icons";
import Invoice from "./sections/Invoice";
import Main from "./sections/Main";

function Index() {
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState("main");
  const [paymentData, setPaymentData] = useState({});
  const [isFromDataByIdPage, setisFromDataByIdPage] = useState(false);
  const navigate = useNavigate();
  const pages = [
    {
      name: "main",
      path: ["/dashboard/e-invoices"],
      readablePath: [t("_invoice")],
    },
    {
      name: "invoiceAdd",
      path: ["invoice-add"],
      readablePath: ["Create invoice"],
    },
    {
      name: "invoicePreview",
      path: ["invoice-preview"],
      readablePath: ["Preview invoice"],
    },
    {
      name: "invoicePreviewByDataId",
      path: ["invoice-preview"],
      readablePath: ["Preview invoice"],
    },
    {
      name: "invoiceEdit",
      path: ["invoice-edit"],
      readablePath: ["Edit invoice"],
    },
    {
      name: "invoiceEditByDataId",
      path: ["/dashboard/e-invoices"],
      readablePath: ["Edit invoice"],
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
          <Invoice
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
          <Invoice
            type="preview"
            data={paymentData}
            onEvent={(name, paymentValue) => {
              setPaymentData(paymentValue);
              setActiveStep(pages.find((data) => data.name === name).name);
            }}
          />
        );
        break;
      case "invoicePreviewByDataId":
        step = (
          <Invoice
            type="preview"
            isByDataId
            {...{ isFromDataByIdPage }}
            data={paymentData}
            onEvent={(name, paymentValue, valueIsFromDataByIdPage) => {
              setisFromDataByIdPage(valueIsFromDataByIdPage || false);
              setPaymentData(paymentValue);
              setActiveStep(pages.find((data) => data.name === name).name);
            }}
          />
        );
        break;
      case "invoiceEdit":
        step = (
          <Invoice
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
          <Invoice
            type="edit"
            isByDataId
            {...{ isFromDataByIdPage }}
            data={paymentData}
            onEvent={(name, paymentValue, valueIsFromDataByIdPage) => {
              setisFromDataByIdPage(valueIsFromDataByIdPage || false);
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
