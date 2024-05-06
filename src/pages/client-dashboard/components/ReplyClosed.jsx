import { Typography } from "@mui/material";
import { ReplyCloseContainer } from "../css/replyStyle";

function ReplyClosed() {
  return (
    <ReplyCloseContainer>
      <Typography variant="h2">This ticket was closed</Typography>
      <Typography component="span">
        If you still have a problem, please open a new ticket.
      </Typography>
    </ReplyCloseContainer>
  );
}

export default ReplyClosed;
