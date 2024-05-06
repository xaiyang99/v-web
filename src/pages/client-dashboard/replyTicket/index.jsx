import IconCloseMessage from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Chip,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import he from "he";
import { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import * as Icon from "../../../icons/icons";
import * as MUI from "../../dashboards/css/chatStyle";
import { ReplyContainer, TicketContainer } from "../new-ticket/style";
import { HeaderLayout, getColorStatus } from "../ticket/style";

import { useMutation } from "@apollo/client";
import { useDispatch, useSelector } from "react-redux";
import { errorMessage, successMessage } from "../../../components/Alerts";
import BreadcrumbNavigate from "../../../components/BreadcrumbNavigate";
import { SocketServer } from "../../../hooks/useSocketIO";
import {
  chatMessageSelector,
  setChatMessageEMPTY,
  setFocus,
} from "../../../redux/slices/chatMessageSlice";
import InifinityChatScroll from "../../components/InfinityChatScroll";
import useManageChat from "../../dashboards/chat-message/hooks/useManageChat";
import ChatFormReply from "../../dashboards/components/ChatFormReply";
import DialogCloseTicket from "../../dashboards/components/DialogTicketClose";
import { UPDATE_TYPE_TICKET } from "../../dashboards/ticket/apollo";
import useManageTypeTicket from "../../dashboards/ticket/hooks/useManageTypeTicket";
import ReplyClosed from "../components/ReplyClosed";
import ReplyPanel from "../components/ReplyPanel";
import useManageReply from "./hooks/useManageReply";

function ReplyTicket() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { paramId } = useParams();
  const { user } = useAuth();

  const dispatch = useDispatch();
  const [updateCloseTicket] = useMutation(UPDATE_TYPE_TICKET);

  const manageChat = useManageChat({
    typeTicketID: paramId,
  });

  const userCreate = useManageTypeTicket({
    typeID: paramId,
  }).data?.[0];

  const manageReply = useManageReply({
    pathID: paramId,
  });
  const chatSelector = useSelector(chatMessageSelector);

  const handleReloading = () => manageChat.customChatMessage();

  function handleOpen() {
    if (manageReply.dataStatus === "close") return;
    setIsOpen(true);
  }
  function handleCloseOpen() {
    setIsOpen(false);
  }
  function handleReloadTicket() {
    manageReply.customTicketTypes();
  }

  const handleScrollData = () => {
    if (manageChat.limit > manageChat.data?.length) return;

    manageChat.handleLimit(20);
  };

  const ChatScrollContainer = ({ messages }) => {
    const messageByDate = {};
    messages?.forEach((message) => {
      const date = new Date(message.updatedAt).toLocaleDateString();
      if (!messageByDate[date]) {
        messageByDate[date] = [];
      }

      messageByDate[date].push(message);
    });

    let chatContents = [];
    for (const data in messageByDate) {
      messageByDate[data].forEach((message) => {
        chatContents.push(
          <ReplyPanel
            key={message?._id}
            chat={message}
            ticketStatus={manageReply?.dataStatus}
          />
        );
      });

      chatContents.push(<MUI.BoxHeaderDate key={data} date={data} />);
    }

    return (
      <Fragment>
        <InifinityChatScroll
          chatMessages={manageChat.data}
          hasMore={hasMore}
          onRefreshLimit={onLoadLimitData}
        >
          {chatContents}
        </InifinityChatScroll>
      </Fragment>
    );
  };

  function onLoadLimitData() {
    if (manageChat.data.length >= manageChat.total) {
      setHasMore(false);
      return;
    }

    setTimeout(() => {
      handleScrollData();
    }, 500);
  }

  async function submitCloseTicket() {
    try {
      const result = await updateCloseTicket({
        variables: {
          data: {
            status: "close",
          },
          where: {
            _id: paramId,
          },
        },
      });

      if (result?.data?.updateTypetickets?._id) {
        handleReloadTicket();
        successMessage("Ticket was closed successfully", 2000);
        handleCloseOpen();
      }
    } catch (error) {
      errorMessage("Something went wrong, please try again", 3000);
    }
  }

  const removeChatReply = () => {
    dispatch(setChatMessageEMPTY());
    dispatch(setFocus(false));
  };

  useEffect(() => {
    function getMessageServer() {
      const socket = SocketServer();
      try {
        socket.emit("joinRoom", parseInt(user?._id));
        socket.on("newMessage", (data) => {
          if (!data) return;
          handleReloading();
        });
      } catch (error) {
        console.error(error);
      }

      return () => {
        socket.disconnect();
      };
    }
    getMessageServer();
  }, []);

  return (
    <Fragment>
      <ReplyContainer>
        <HeaderLayout>
          <BreadcrumbNavigate
            separatorIcon={<Icon.ForeSlash />}
            disableDefault
            title="support-ticket"
            titlePath="/support-ticket"
            path={["support-ticket"]}
            readablePath={["Support Ticket", `Support Ticket #${paramId} `]}
          />

          <Chip
            label={
              manageReply?.dataStatus === "close"
                ? manageReply?.dataStatus + "d"
                : manageReply?.dataStatus || "New"
            }
            style={getColorStatus(manageReply?.dataStatus || "New")}
          />
        </HeaderLayout>

        <TicketContainer>
          {manageReply?.dataStatus === "close" && (
            <Paper
              sx={{
                mt: (theme) => theme.spacing(3),
                boxShadow: (theme) => theme.baseShadow.secondary,
                flex: "1 1 0",
              }}
            >
              <ReplyClosed />
            </Paper>
          )}
          <MUI.ChatContainer>
            {/* ========= Header ========= */}
            <MUI.ChatHeader>
              <MUI.ChatHeaderWrapper>
                <MUI.ChatHeaderLeft>
                  <Box className="admin-logo">
                    {/* <img src={iconPerson} alt="icon-person" /> */}
                    <Typography variant="h4">V</Typography>
                  </Box>

                  <Box className="admin-info">
                    <Typography variant="h2">Admin</Typography>
                    <Typography component="span">Vshare admin</Typography>
                  </Box>
                </MUI.ChatHeaderLeft>
                {manageReply?.dataStatus !== "close" && (
                  <MUI.ChatHeaderRight>
                    <Button
                      size="small"
                      color="error"
                      variant="text"
                      sx={{ fontWeight: "bold" }}
                      onClick={handleOpen}
                    >
                      Close
                    </Button>
                  </MUI.ChatHeaderRight>
                )}
              </MUI.ChatHeaderWrapper>
            </MUI.ChatHeader>

            <MUI.ChatContentContainer>
              {/* ========= Chat message ========= */}
              {ChatScrollContainer({
                messages: manageChat.data,
              })}
              <MUI.ChatFooterContainer>
                <MUI.ChatMessageReply>
                  {chatSelector?.dataReply ? (
                    <MUI.ChatReplyBoxMessage>
                      <MUI.ChatReplyBoxMessageContainer>
                        <Box>
                          <Typography variant="h2">Admin</Typography>
                          <Typography variant="h4">
                            {he.decode(chatSelector.dataReply?.message)}
                          </Typography>
                        </Box>
                        <MUI.ChatReplyBoxMessageClose>
                          <IconButton
                            aria-label="icon-close"
                            onClick={removeChatReply}
                          >
                            <IconCloseMessage />
                          </IconButton>
                        </MUI.ChatReplyBoxMessageClose>
                      </MUI.ChatReplyBoxMessageContainer>
                    </MUI.ChatReplyBoxMessage>
                  ) : null}

                  {manageReply?.dataStatus !== "close" && (
                    <MUI.ChatMessageReplyForm>
                      <ChatFormReply
                        dataReply={userCreate}
                        isAdmin={false}
                        handleReloading={handleReloading}
                      />
                    </MUI.ChatMessageReplyForm>
                  )}
                </MUI.ChatMessageReply>
              </MUI.ChatFooterContainer>
            </MUI.ChatContentContainer>
          </MUI.ChatContainer>
        </TicketContainer>
      </ReplyContainer>

      <DialogCloseTicket
        isOpen={isOpen}
        onConfirm={submitCloseTicket}
        onClose={handleCloseOpen}
      />
    </Fragment>
  );
}

export default ReplyTicket;
