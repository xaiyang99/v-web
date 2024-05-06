import { Box, Grid, MenuItem, Typography, useMediaQuery } from "@mui/material";
import { createTheme, styled } from "@mui/material/styles";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { intToPrettyString, stringPluralize } from "../../../../../functions";
import * as Icon from "../../../../../icons/icons";
import useManageTicket from "../../hooks/useManageTicket";
import SelectStyled from "../SelectedStyled";
import DoughnutChart from "./doughnutChart";

const theme = createTheme();

const SupportTrackerContainer = styled("div")(({ theme, ...props }) => ({
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

const SupportTrackerItem = styled("div")(({ theme, ...props }) => ({}));

const TicketList = (props) => {
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
          img: {
            width: 25,
            height: 25,
          },
          ...(props.iconProps?.sx || {}),
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
          {intToPrettyString(props.value)}
        </Typography>
      </Typography>
    </Box>
  );
};
const index = (props) => {
  const { t } = useTranslation();
  const [selectedValue, setSelectedValue] = useState("lastSevenDays");

  const manageTickets = useManageTicket({
    labels: selectedValue,
  });

  const reportData = manageTickets.data.reports;

  const isMobile = useMediaQuery("(max-width:768px)");
  const isMax400px = useMediaQuery("(max-width:400px)");
  return (
    <SupportTrackerContainer>
      <SupportTrackerItem
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
            {t("_support_ticket_topic")}
          </Typography>
          <Typography component="div">
            {selectedValue === "lastSevenDays"
              ? t("_support_ticket_title")
              : t("_support_ticket_title2")}
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
            label="lastSevenDays"
            variant="outlined"
            onChange={(e) => setSelectedValue(e.target.value)}
          >
            <MenuItem value={"lastSevenDays"}>
              {t("_support_ticket_title")}
            </MenuItem>
            <MenuItem value={"latestMonth"}>
              {t("_support_ticket_title2")}
            </MenuItem>
          </SelectStyled>
        </Box>
      </SupportTrackerItem>
      <SupportTrackerItem
        sx={{
          flexGrow: 1,
        }}
      >
        <Grid
          container
          sx={{
            display: "flex",
          }}
        >
          <Grid
            item
            md={6}
            sm={12}
            sx={{
              display: "flex",
              flexDirection: "column",
              rowGap: theme.spacing(4),
              flexGrow: 1,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                rowGap: theme.spacing(0.5),
              }}
            >
              <Typography
                component="div"
                sx={{
                  typography: "h1",
                  fontWeight: 600,
                }}
              >
                {reportData.amount.total}
              </Typography>
              <Typography component="div" sx={{ fontWeight: 600 }}>
                Total {stringPluralize(reportData.amount.total, "Ticket", "s")}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                rowGap: 4,
              }}
            >
              <TicketList
                icon={<Icon.TicketIcon />}
                title={"New Tickets"}
                value={reportData.amount.newTickets}
              />
              <TicketList
                icon={<Icon.CircleCheckIcon />}
                title={"Pending Tickets"}
                value={reportData.amount.pendingTickets}
                iconProps={{
                  sx: {
                    backgroundColor: "rgb(235,249,251)",
                  },
                }}
              />
              <TicketList
                icon={<Icon.ClockIcon />}
                title={"Closed Tickets"}
                value={reportData.amount.closedTickets}
                iconProps={{
                  sx: {
                    backgroundColor: "rgb(255,247,250)",
                  },
                }}
              />
            </Box>
          </Grid>
          <Grid
            item
            md={6}
            sm={12}
            sx={{
              height: "300px",
              position: "relative",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%,-50%)",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  rowGap: theme.spacing(0.5),
                  flexGrow: 1,
                  textAlign: "center",
                }}
              >
                <Typography component="div" sx={{ fontWeight: 600 }}>
                  {t("_completed_task")}
                </Typography>
                <Typography
                  component="div"
                  sx={{
                    typography: "h1",
                    fontWeight: 600,
                  }}
                >
                  {reportData.percent.completedTask >= 100
                    ? 100
                    : reportData.percent.completedTask}
                  %
                </Typography>
              </Box>
            </Box>
            <DoughnutChart data={reportData} />
          </Grid>
        </Grid>
      </SupportTrackerItem>
    </SupportTrackerContainer>
  );
};
export default index;
