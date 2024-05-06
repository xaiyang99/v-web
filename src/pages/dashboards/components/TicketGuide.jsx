import { Box, Link, Paper, Typography } from "@mui/material";
import { Fragment } from "react";
import { TicketBody } from "../../client-dashboard/new-ticket/style";
import {
  HeaderGuidline,
  GuideListContainer,
  GuideList,
  GuideAllButton,
  GuideButtonContainer,
} from "../../client-dashboard/ticket/style";

function TicketGuide() {
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
          <HeaderGuidline>
            <Typography variant="h4">selected for you</Typography>
            <Typography variant="h2">Guides</Typography>
          </HeaderGuidline>
          <GuideListContainer>
            <GuideList>
              <Box mb={2}>
                <Typography variant="h2">
                  How to create your first Pull Zone
                </Typography>
                <Typography variant="span">
                  To start using Bunny CDN, you will first need to create a Pull
                  Zone. Usually, a Pull Zone is created for each website. This
                  tells our system where to find your files and how to serve
                  them to your
                </Typography>
              </Box>
              <Link>Read more</Link>
            </GuideList>
            <GuideList>
              <Box mb={2}>
                <Typography variant="h2">
                  How to set up a custom CDN hostname
                </Typography>
                <Typography variant="span">
                  To start using Bunny CDN, you will first need to create a Pull
                  Zone. Usually, a Pull Zone is created for each website. This
                  tells our system where to find your files and how to serve
                  them to your
                </Typography>
              </Box>
              <Link>Read more</Link>
            </GuideList>
            <GuideList>
              <Box mb={3}>
                <Typography variant="h2">
                  How to check if your website is correctly configured with
                  bunny.net
                </Typography>
                <Typography variant="span">
                  To start using Bunny CDN, you will first need to create a Pull
                  Zone. Usually, a Pull Zone is created for each website. This
                  tells our system where to find your files and how to serve
                  them to your
                </Typography>
              </Box>
              <Link>Read more</Link>
            </GuideList>
          </GuideListContainer>

          <GuideButtonContainer>
            <GuideAllButton>All guides</GuideAllButton>
          </GuideButtonContainer>
        </TicketBody>
      </Paper>
    </Fragment>
  );
}

export default TicketGuide;
