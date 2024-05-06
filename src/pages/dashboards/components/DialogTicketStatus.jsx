import { useEffect, useState } from "react";
import { Button, DialogContent, Typography } from "@mui/material";
import DialogV1 from "../../../components/DialogV1";
import { ReplyCloseToggleAction } from "../../client-dashboard/css/replyStyle";
import { CloseTicketButton } from "../../client-dashboard/ticket/style";
import {
  ActionTicketStatus,
  TicketHeaderStatus,
  TicketStatusContainer,
} from "../../client-dashboard/css/ticketStyle";
import { errorMessage, successMessage } from "../../../components/Alerts";
import { useMutation } from "@apollo/client";
import { UPDATE_TYPE_TICKET } from "../ticket/apollo";
import { useTranslation } from "react-i18next";

function DialogTicketStatus(props) {
  const { t } = useTranslation();
  const [active, setActive] = useState("");
  const { onClose, onConfirm, dataEvent } = props;
  const [updateTypeTicket] = useMutation(UPDATE_TYPE_TICKET);

  const handleActive = (value) => setActive(value);

  const handleClose = () => {
    setActive("");
    onClose();
  };

  const handleSubmit = async () => {
    if (active) {
      try {
        const result = await updateTypeTicket({
          variables: {
            data: {
              status: active,
            },
            where: {
              _id: dataEvent?._id,
            },
          },
        });

        if (result?.data?.updateTypetickets?._id) {
          successMessage("Ticket status updated successfully", 2000);
          setActive("");
          onConfirm();
        }
      } catch (error) {
        errorMessage("Something went wrong, please try again", 3000);
      }
    }
  };

  useEffect(() => {
    setActive(dataEvent?.status);
  }, [dataEvent]);

  return (
    <DialogV1
      {...props}
      dialogProps={{
        PaperProps: {
          sx: {
            overflowY: "initial",
            maxWidth: "500px",
          },
        },
      }}
      dialogContentProps={{
        sx: {
          backgroundColor: "white !important",
          borderRadius: "6px",
          padding: (theme) => `${theme.spacing(8)} ${theme.spacing(6)}`,
        },
      }}
    >
      <DialogContent sx={{ textAlign: "center" }}>
        <TicketHeaderStatus>
          <Typography variant="h2">{t("_edit_status")}</Typography>
        </TicketHeaderStatus>

        <TicketStatusContainer>
          <ActionTicketStatus
            className={active === "new" ? "active" : ""}
            onClick={() => handleActive("new")}
          >
            <Typography variant="h4">{t("_new_status")}</Typography>
            <Typography component="span">
              {t("_new_status_description")}
            </Typography>
          </ActionTicketStatus>
          <ActionTicketStatus
            className={active === "pending" ? "active" : ""}
            onClick={() => handleActive("pending")}
          >
            <Typography variant="h4">{t("_pending_status")}</Typography>
            <Typography component="span">
              {t("_pending_status_description")}
            </Typography>
          </ActionTicketStatus>
          <ActionTicketStatus
            className={active === "close" ? "active" : ""}
            onClick={() => handleActive("close")}
          >
            <Typography variant="h4">{t("_closed_status")}</Typography>
            <Typography component="span">
              {t("_closed_status_description")}
            </Typography>
          </ActionTicketStatus>
        </TicketStatusContainer>

        <ReplyCloseToggleAction>
          <Button onClick={handleSubmit} variant="contained" type="button">
            {t("_save_button")}
          </Button>
          <CloseTicketButton
            onClick={handleClose}
            variant="contained"
            type="button"
          >
            {t("_cancel_button")}
          </CloseTicketButton>
        </ReplyCloseToggleAction>
      </DialogContent>
    </DialogV1>
  );
}

export default DialogTicketStatus;
