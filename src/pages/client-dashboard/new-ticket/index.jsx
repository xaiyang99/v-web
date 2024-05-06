import { Box, Paper, Typography } from "@mui/material";
import * as MUI from "./style";
import { HeaderLayout } from "../ticket/style";
import TicketForm from "../components/TicketForm";
import * as Icon from "../../../icons/icons";
import BreadcrumbNavigate from "../../../components/BreadcrumbNavigate";

function CreateTicket() {
  return (
    <>
      <Box sx={{ mt: 3 }}>
        <HeaderLayout>
          <BreadcrumbNavigate
            separatorIcon={<Icon.ForeSlash />}
            disableDefault
            title="support-ticket"
            titlePath="/support-ticket"
            path={["support-ticket"]}
            readablePath={["New", "New Support Ticket"]}
            handleNavigate={() => {}}
          />
        </HeaderLayout>
        <MUI.TicketContainer>
          <Paper
            sx={{
              mt: (theme) => theme.spacing(3),
              boxShadow: (theme) => theme.baseShadow.secondary,
              flex: "1 1 0",
            }}
          >
            <MUI.TicketBody>
              <Typography variant="h4" fontWeight={400}>
                Add Your Ticket
              </Typography>

              <Box mt={3}>
                <TicketForm />
              </Box>
            </MUI.TicketBody>
          </Paper>
        </MUI.TicketContainer>
      </Box>
    </>
  );
}

export default CreateTicket;
