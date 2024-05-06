import { Box, MenuItem, Typography, useMediaQuery } from "@mui/material";
import { createTheme, styled } from "@mui/material/styles";
import _ from "lodash";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { intToPrettyString, stringPluralize } from "../../../../../functions";
import * as Icon from "../../../../../icons/icons";
import useManageCustomer from "../../hooks/useManageCustomer";
import SelectStyled from "../SelectedStyled";
import BarChart from "./BarChart";

const theme = createTheme();

const GraphSpaceContainer = styled("div")(({ theme, ...props }) => ({
  display: "flex",
  flexDirection: "column",
  backgroundColor: theme.palette.mode === "dark" ? "#fff" : "#fff",
  ...theme.typography.body2,
  textAlign: "left",
  color: theme.palette.text.secondary,
  borderRadius: "8px",
  rowGap: theme.spacing(5),
  height: "100%",
}));

const GraphSpaceItem = styled("div")(({ theme, ...props }) => ({
  flexGrow: 1,
}));

const GraphSpaceGenderList = (props) => {
  const { t } = useTranslation();
  return (
    <Box sx={{ display: "flex", columnGap: 3 }}>
      <Typography
        component="div"
        sx={{
          width: 35,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(23,118,107,0.125)",
          padding: `${theme.spacing(0.5)} ${theme.spacing(1.25)}`,
          margin: "3px 0",
          borderRadius: "4px",
        }}
      >
        {props.icon}
      </Typography>
      <Typography
        component="div"
        sx={{
          display: "flex",
          width: "150px",
          flexDirection: "column",
        }}
      >
        <Typography
          component="span"
          sx={{
            fontWeight: 600,
          }}
        >
          {_.capitalize(props.title)}
        </Typography>
        <Typography component="span" sx={{}}>
          {intToPrettyString(props.amount)}{" "}
          {stringPluralize(props.amount, t("_customer"))}
        </Typography>
      </Typography>
      <Typography
        component="div"
        sx={{
          display: "flex",
          columnGap: 1,
          flexGrow: 1,
          alignItems: "center",
          justifyContent: "end",
        }}
      >
        {props.percent > 0 ? (
          <Typography
            component="div"
            sx={{
              display: "flex",
              alignItems: "center",
              color: "#29c770",
            }}
          >
            <Icon.IoIosArrowUpIcon />
          </Typography>
        ) : (
          <>
            {props.percent < 0 && (
              <Typography
                component="div"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  color: "rgb(234, 84, 85)",
                }}
              >
                <Icon.IoIosArrowDownIcon />
              </Typography>
            )}
          </>
        )}

        <Typography component="span" sx={{}}>
          {props.percent}%
        </Typography>
      </Typography>
    </Box>
  );
};

const index = () => {
  const [selectedValue, setSelectedValue] = useState("weekly");

  const manageCustomers = useManageCustomer({
    labels: selectedValue,
  });

  const reportData = manageCustomers.data.reports;
  const amountTotal = reportData.amount.total;
  const discrepancy = reportData.discrepancy;
  const isMobile = useMediaQuery("(max-width:768px)");
  const isMax400px = useMediaQuery("(max-width:400px)");
  const { t } = useTranslation();
  return (
    <GraphSpaceContainer>
      <GraphSpaceItem
        sx={{
          display: "flex",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            rowGap: theme.spacing(0.5),
            flexGrow: 1,
          }}
        >
          <Typography
            component="div"
            sx={{
              typography: "h4",
              fontWeight: 600,
            }}
          >
            {t("_customers_topic")}
          </Typography>
          <Typography component="div">
            {/* Number of customers registered with our system title: */}
            {t("_customer_detail")}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <SelectStyled
            value={selectedValue}
            label="Weekly"
            variant="outlined"
            onChange={(e) => setSelectedValue(e.target.value)}
          >
            <MenuItem value={"weekly"}> {t("_weekly")}</MenuItem>
            <MenuItem value={"monthly"}> {t("_monthly")}</MenuItem>
            <MenuItem value={"yearly"}> {t("_yearly")}</MenuItem>
          </SelectStyled>
        </Box>
      </GraphSpaceItem>
      <GraphSpaceItem>
        <Box
          sx={{
            display: "flex",
            columnGap: theme.spacing(1),
          }}
        >
          <Box
            component="div"
            sx={{
              typography: "h3",
              fontWeight: 600,
            }}
          >
            <span>
              {intToPrettyString(amountTotal.all)}{" "}
              {stringPluralize(amountTotal.all, "Customer")}
            </span>
          </Box>
          <Box
            component="div"
            sx={{
              display: "flex",
              alignItems: "center",
              ...(discrepancy.totalPercent > 0
                ? {
                    color: "#29c770",
                    backgroundColor: "#e5f8ed",
                  }
                : {
                    ...(discrepancy.totalPercent < 0
                      ? {
                          backgroundColor: "rgba(234, 84, 85,0.16)",
                          color: "rgb(234, 84, 85)",
                        }
                      : {
                          backgroundColor: "rgba(168, 170, 174,0.16)",
                          color: "rgb(168, 170, 174)",
                        }),
                  }),
              fontWeight: 600,
              padding: `${theme.spacing(0.5)} ${theme.spacing(1.25)}`,
              borderRadius: "4px",
            }}
          >
            {discrepancy.totalPercent}%
          </Box>
        </Box>
      </GraphSpaceItem>
      <GraphSpaceItem>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            rowGap: 2,
            width: "fit-content",
          }}
        >
          <GraphSpaceGenderList
            icon={<Icon.MaleIcon />}
            title={t("_males")}
            amount={amountTotal.male}
            percent={discrepancy.malePercent}
          />
          <GraphSpaceGenderList
            icon={<Icon.FemaleIcon />}
            title={t("_females")}
            amount={amountTotal.female}
            percent={discrepancy.femalePercent}
          />
        </Box>
      </GraphSpaceItem>
      <GraphSpaceItem
        sx={{
          height: "500px",
        }}
      >
        <BarChart data={discrepancy} labels={reportData.labels} />
      </GraphSpaceItem>
    </GraphSpaceContainer>
  );
};
export default index;
