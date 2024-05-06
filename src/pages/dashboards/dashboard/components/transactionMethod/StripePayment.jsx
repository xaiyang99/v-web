import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
  timelineItemClasses,
} from "@mui/lab";
import { Box } from "@mui/material";
import { createTheme, styled } from "@mui/material/styles";
import _ from "lodash";
import moment from "moment";
import { useSelector } from "react-redux";
import { numberWithCommas } from "../../../../../functions";
import { paymentState } from "../../../../../redux/slices/paymentSlice";

const theme = createTheme();

const StripePaymentTimelineContainer = styled("div")(({ theme, ...props }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#fff" : "#fff",
  ...theme.typography.body2,
  textAlign: "left",
  color: theme.palette.text.secondary,
  borderRadius: "8px",
  height: "100%",
  padding: theme.spacing(4),
  overflow: "auto",
}));

const ActivityTimeHeader = styled("div")(({ theme, ...props }) => ({
  display: "flex",
  alignItems: "center",
  columnGap: theme.spacing(4),
}));

const ActivityTimeBody = styled("div")(({ theme, ...props }) => ({}));

const StripePaymentTimeline = (props) => {
  return (
    <StripePaymentTimelineContainer>
      <ActivityTimeBody>
        <Timeline
          sx={{
            padding: 0,
            [`& .${timelineItemClasses.root}:before`]: {
              flex: 0,
              padding: 0,
            },
          }}
        >
          {props.children}
        </Timeline>
      </ActivityTimeBody>
    </StripePaymentTimelineContainer>
  );
};

const StripePaymentTimelineItemContainer = styled("div")(
  ({ theme, ...props }) => ({
    display: "flex",
    justifyContent: "space-between",
  })
);

const StripePaymentTimelineItemContentLeft = styled("div")(
  ({ theme, ...props }) => ({})
);

const StripePaymentTimelineItemContentRight = styled("div")(
  ({ theme, ...props }) => ({})
);

function randomRgba() {
  const o = Math.round,
    r = Math.random,
    s = 255;
  return {
    backgroundColor: `rgb(${o(r() * s)},${o(r() * s)},${o(r() * s)})`,
    boxShadow: `rgba(${o(r() * s)},${o(r() * s)},${o(r() * s)},0.25)`,
  };
}

const StripePaymentTimelineItem = (props) => {
  const randomRgbaData = randomRgba();
  return (
    <StripePaymentTimelineItemContainer>
      <StripePaymentTimelineItemContentLeft>
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot
              sx={{
                margin: 0,
                backgroundColor: (theme) => theme.palette.primaryTheme.main,
                boxShadow: "0px 0px 0px 3.5px rgba(23,118,107,0.25)",
              }}
            />

            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent
            sx={{
              paddingLeft: (theme) => theme.spacing(6),
              paddingTop: 0,
              display: "flex",
              flexDirection: "column",
              rowGap: (theme) => theme.spacing(2),
            }}
          >
            {props.children}
          </TimelineContent>
        </TimelineItem>
      </StripePaymentTimelineItemContentLeft>
      <StripePaymentTimelineItemContentRight>
        {props.dateTimeSection}
      </StripePaymentTimelineItemContentRight>
    </StripePaymentTimelineItemContainer>
  );
};

const sortDateDescending = (inputArray) => {
  return (inputArray || []).sort(
    (a, b) => new Date(b.orderedAt) - new Date(a.orderedAt)
  );
};

const StripePayment = (props) => {
  const paymentSelector = useSelector(paymentState);
  return (
    <StripePaymentTimeline>
      {sortDateDescending(props.data).map((data) => {
        const payer = data.payerId;
        const packageData = data.packageId;
        return (
          <StripePaymentTimelineItem
            key={data._id}
            dateTimeSection={moment(
              data.orderedAt,
              "YYYY-MM-DDTHH:mm:ss.SSS"
            ).format("DD/MM/YYYY h:mm a")}
          >
            <Box
              sx={{
                fontWeight: 600,
              }}
            >
              Paid by{" "}
              <span style={{ fontWeight: "bold" }}>
                {_.capitalize(payer.firstName)} {_.capitalize(payer.lastName)}
              </span>
            </Box>
            <Box>
              Package name:{" "}
              <span style={{ fontWeight: "bold" }}>{packageData.name}</span>
            </Box>
            <Box>
              Amount:{" "}
              <span style={{ fontWeight: "bold" }}>
                {paymentSelector.currencySymbol}
                {numberWithCommas(data.amount)}
              </span>
            </Box>
            <Box>{data.description}</Box>
          </StripePaymentTimelineItem>
        );
      })}
    </StripePaymentTimeline>
  );
};

export default StripePayment;
