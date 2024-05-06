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

const theme = createTheme();

const BcelOnePaymentTimelineContainer = styled("div")(
  ({ theme, ...props }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#fff" : "#fff",
    ...theme.typography.body2,
    textAlign: "left",
    color: theme.palette.text.secondary,
    borderRadius: "8px",
    height: "100%",
    padding: theme.spacing(4),
  })
);

const ActivityTimeHeader = styled("div")(({ theme, ...props }) => ({
  display: "flex",
  alignItems: "center",
  columnGap: theme.spacing(4),
}));

const ActivityTimeBody = styled("div")(({ theme, ...props }) => ({}));

const BcelOnePaymentTimeline = (props) => {
  return (
    <BcelOnePaymentTimelineContainer>
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
    </BcelOnePaymentTimelineContainer>
  );
};

const BcelOnePaymentTimelineItemContainer = styled("div")(
  ({ theme, ...props }) => ({
    display: "flex",
    justifyContent: "space-between",
  })
);

const BcelOnePaymentTimelineItemContentLeft = styled("div")(
  ({ theme, ...props }) => ({})
);

const BcelOnePaymentTimelineItemContentRight = styled("div")(
  ({ theme, ...props }) => ({})
);

const BcelOnePaymentTimelineItem = (props) => {
  return (
    <BcelOnePaymentTimelineItemContainer>
      <BcelOnePaymentTimelineItemContentLeft>
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot
              sx={{
                margin: 0,
                backgroundColor: (theme) => theme.palette.primary.main,
                boxShadow: "0px 0px 0px 3.5px rgba(23,118,107,0.25)",
                ...props.sx,
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
      </BcelOnePaymentTimelineItemContentLeft>
      <BcelOnePaymentTimelineItemContentRight>
        08:00 PM
      </BcelOnePaymentTimelineItemContentRight>
    </BcelOnePaymentTimelineItemContainer>
  );
};

const BcelOnePayment = () => {
  return (
    <BcelOnePaymentTimeline>
      <BcelOnePaymentTimelineItem>
        <Box
          sx={{
            fontWeight: 600,
          }}
        >
          Bcel One 1200 Customer
        </Box>
        <Box>Add files and other</Box>
        <Box>...</Box>
      </BcelOnePaymentTimelineItem>
      <BcelOnePaymentTimelineItem>
        <Box
          sx={{
            fontWeight: 600,
          }}
        >
          Bcel One 1000 Customer
        </Box>
        <Box>Add files and other</Box>
        <Box>...</Box>
      </BcelOnePaymentTimelineItem>
    </BcelOnePaymentTimeline>
  );
};

export default BcelOnePayment;
