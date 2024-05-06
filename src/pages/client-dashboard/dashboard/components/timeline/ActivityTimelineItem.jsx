import {
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
} from "@mui/lab";
import { styled } from "@mui/material/styles";

const ActivityTimelineItemContainer = styled("div")(({ theme, ...props }) => ({
  display: "flex",
  justifyContent: "space-between",
}));

const ActivityTimelineItemContentLeft = styled("div")(
  ({ theme, ...props }) => ({})
);

const ActivityTimelineItemContentRight = styled("div")(
  ({ theme, ...props }) => ({})
);

const ActivityTimelineItem = (props) => {
  return (
    <ActivityTimelineItemContainer>
      <ActivityTimelineItemContentLeft>
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot
              sx={{
                margin: 0,
                backgroundColor: (theme) => theme.palette.primary.main,
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
      </ActivityTimelineItemContentLeft>
      <ActivityTimelineItemContentRight>
        08:00 PM
      </ActivityTimelineItemContentRight>
    </ActivityTimelineItemContainer>
  );
};

export default ActivityTimelineItem;
