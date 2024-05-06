import { Fragment } from "react";
import { Grid, Paper, Typography } from "@mui/material";
import { BiStar, BiCheckSquare } from "react-icons/bi";
import { TicketBody } from "../../client-dashboard/new-ticket/style";
import {
  IntroHederLeft,
  IntroHederRight,
  IntroSubWrapper,
  IntroWrapper,
  TicketIntroHeader,
} from "../../client-dashboard/ticket/style";

function TicketIntro() {
  return (
    <Fragment>
      <Grid container rowSpacing={2} columnSpacing={{ sm: 5 }}>
        <Grid display="flex" item lg={6} md={6} sm={12} xs={12}>
          <Paper
            sx={{
              mt: (theme) => theme.spacing(3),
              boxShadow: (theme) => theme.baseShadow.secondary,
              flex: "1 1 0",
            }}
          >
            <TicketBody>
              <TicketIntroHeader>
                <IntroHederLeft>
                  <Typography variant="h4">Support Level</Typography>
                  <Typography component="span">Basic</Typography>
                </IntroHederLeft>
                <IntroHederRight>
                  <BiStar className="icon-info" />
                </IntroHederRight>
              </TicketIntroHeader>

              <IntroWrapper>
                <Typography component="li">24/7 Support</Typography>
                <Typography component="li">
                  Less than 24h response guarantee
                </Typography>
              </IntroWrapper>

              <IntroSubWrapper>
                <Typography component="span">
                  More support options with guaranteed response time and a
                  private Slack channel are coming soon.
                </Typography>
              </IntroSubWrapper>
            </TicketBody>
          </Paper>
        </Grid>
        <Grid display="flex" item lg={6} md={6} sm={12} xs={12}>
          <Paper
            sx={{
              mt: (theme) => theme.spacing(3),
              boxShadow: (theme) => theme.baseShadow.secondary,
              flex: "1 1 0",
            }}
          >
            <TicketBody>
              <TicketIntroHeader>
                <IntroHederLeft>
                  <Typography variant="h4">Service Status</Typography>
                  <Typography className="service" component="span">
                    Status page
                  </Typography>
                </IntroHederLeft>
                <IntroHederRight>
                  <BiCheckSquare className="icon-info" />
                </IntroHederRight>
              </TicketIntroHeader>
            </TicketBody>
          </Paper>
        </Grid>
      </Grid>
    </Fragment>
  );
}

export default TicketIntro;
