import { Fragment } from "react";
import { TicketBody } from "../../client-dashboard/new-ticket/style";
import { Paper, Typography } from "@mui/material";
import { PopularHeader } from "../../client-dashboard/ticket/style";
import PopularAccordion from "./PopularAccordion";

function TicketPopular() {
  return (
    <Fragment>
      <Paper
        sx={{
          mt: (theme) => theme.spacing(3),
          boxShadow: (theme) => theme.baseShadow.secondary,
          flex: "1 1 0",
        }}
      >
        <TicketBody>
          <PopularHeader>
            <Typography component="span">read further</Typography>
            <Typography component="h2">popular help articles</Typography>
          </PopularHeader>

          <PopularAccordion />
        </TicketBody>
      </Paper>
    </Fragment>
  );
}

export default TicketPopular;
