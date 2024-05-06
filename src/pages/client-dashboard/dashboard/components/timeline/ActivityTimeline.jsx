import { Timeline, timelineItemClasses } from "@mui/lab";
import { Box } from "@mui/material";
import { createTheme, styled } from "@mui/material/styles";
import * as Icon from "../../icons";

const theme = createTheme();

const ActivityTimelineContainer = styled("div")(({ theme, ...props }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#fff" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(6),
  textAlign: "left",
  color: theme.palette.text.secondary,
  borderRadius: "8px",
  boxShadow: "rgba(0, 0, 0, 0.09) 0px 3px 12px",
  height: "100%",
}));

const ActivityTimeHeader = styled("div")(({ theme, ...props }) => ({
  display: "flex",
  alignItems: "center",
  columnGap: theme.spacing(4),
}));

const ActivityTimeBody = styled("div")(({ theme, ...props }) => ({}));

const ActivityTimeline = (props) => {
  return (
    <ActivityTimelineContainer>
      <ActivityTimeHeader>
        <Box
          component="div"
          sx={{
            typography: "h4",
            display: "flex",
          }}
        >
          <Icon.LuLayoutListIcon />
        </Box>
        <Box
          component="div"
          sx={{
            typography: "h4",
            fontWeight: 600,
          }}
        >
          Activity Timeline
        </Box>
      </ActivityTimeHeader>
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
    </ActivityTimelineContainer>
  );
};

export default ActivityTimeline;
