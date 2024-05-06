import IconCloseMessage from "@mui/icons-material/Close";
import { Box, IconButton, Typography } from "@mui/material";
import he from "he";
import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BiInfoCircle } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import BreadcrumbNavigate from "../../../components/BreadcrumbNavigate";
import useAuth from "../../../hooks/useAuth";
import { SocketServer } from "../../../hooks/useSocketIO";
import * as Icon from "../../../icons/icons";
import {
  chatMessageSelector,
  setChatMessageEMPTY,
  setFocus,
} from "../../../redux/slices/chatMessageSlice";
import {
  default as avatar,
  default as iconPerson,
} from "../../../utils/images/meeting.jpg";
import useManageReply from "../../client-dashboard/replyTicket/hooks/useManageReply";
import InifinityChatScroll from "../../components/InfinityChatScroll";
import useFilter from "../../dashboards/ticket/hooks/useTicket";
import ChatFormReply from "../components/ChatFormReply";
import ChatPanel from "../components/ChatPanel";
import DialogUserInfo from "../components/DialogUserInfo";
import * as MUI from "../css/chatStyle";
import useManageTypeTicket from "../ticket/hooks/useManageTypeTicket";
import useManageChat from "./hooks/useManageChat";

export default function ChatMessage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [hasMore, setHasMore] = useState(true);
  const [isDrawer, setIsDrawer] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [userClient, setUserClient] = useState({});
  const { chatId } = useParams();
  const filter = useFilter();
  const chatSelector = useSelector(chatMessageSelector);
  const imageUrl = process.env.REACT_APP_BUNNY_PULL_ZONE;
  const imageProfile = process.env.REACT_APP_ZONE_PROFILE;

  const dispatch = useDispatch();

  const manageChat = useManageChat({
    typeTicketID: chatId,
  });

  const userCreate = useManageTypeTicket({
    typeID: chatId,
  })?.data?.[0];

  const manageReply = useManageReply({
    pathID: chatId,
  });

  function handleOpenDrawer() {
    setIsDrawer(true);
  }

  const ChatScrollContainer = ({ messages }) => {
    const messageByDate = {};
    messages?.forEach((message) => {
      const date = new Date(message.updatedAt).toLocaleDateString();
      if (!messageByDate[date]) {
        messageByDate[date] = [];
      }

      messageByDate[date].push(message);
    });

    let contents = [];
    for (const date in messageByDate) {
      messageByDate[date].forEach((message) => {
        contents.push(
          <ChatPanel
            key={message?._id}
            chat={message}
            userReply={userClient}
            ticketStatus={manageReply?.dataStatus}
          />,
        );
      });

      contents.push(<MUI.BoxHeaderDate key={date} date={date} />);
    }

    return (
      <Fragment>
        <InifinityChatScroll
          chatMessages={manageChat.data}
          hasMore={hasMore}
          onRefreshLimit={onLoadLimitData}
        >
          {contents}
        </InifinityChatScroll>
      </Fragment>
    );
  };

  function onLoadLimitData() {
    if ((manageChat.data?.length || []) >= manageChat.total) {
      setHasMore(false);
      return;
    }

    setTimeout(() => {
      handleScrollData();
    }, 500);
  }

  const handleReloading = () => manageChat.customChatMessage();

  const handleScrollData = () => {
    if (manageChat.limit > manageChat.data?.length) return;

    manageChat.handleLimit(20);
  };

  const removeChatReply = () => {
    dispatch(setChatMessageEMPTY());
    dispatch(setFocus(false));
  };

  function handleCloseDrawer() {
    setIsDrawer(false);
  }

  useEffect(() => {
    let userAccount = userCreate?.createdBy;
    setUserClient(userAccount);
    setPreviewImage(
      `${imageUrl}${userAccount?.newName}-${userAccount?._id}/${imageProfile}/${userAccount?.profile}`,
    );
  }, [userCreate]);

  useEffect(() => {
    const getChatMessage = () =>
      filter.dispatch({
        type: filter.ACTION_TYPE.ID,
        payload: chatId,
      });
    getChatMessage();
  }, []);

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

  useEffect(() => {
    function getMessageTicketStatus() {
      const socket = SocketServer();

      try {
        socket.emit("joinRoom", parseInt(user?._id));
        socket.on("closeTypeTicket", (data) => {
          if (!data) return;
          manageReply.customTicketTypes();
        });
      } catch (error) {
        console.error(error);
      }
    }

    getMessageTicketStatus();
  }, []);

  return (
    <Fragment>
      <BreadcrumbNavigate
        separatorIcon={<Icon.ForeSlash />}
        disableDefault
        title="ticket"
        titlePath="/dashboard/ticket"
        path={["ticket"]}
        readablePath={[t("_ticket"), t("_message")]}
      />
      <MUI.ChatContainer>
        <MUI.ChatHeader>
          <MUI.ChatHeaderWrapper>
            <MUI.ChatHeaderLeft>
              <Box>
                <img
                  src={previewImage || iconPerson}
                  alt={userClient?.firstName}
                />
              </Box>
              <Box className="header-info">
                <Typography variant="h2">
                  {userClient?.firstName} {userClient?.lastName}
                </Typography>
                <Typography component="span">Customer</Typography>
              </Box>
            </MUI.ChatHeaderLeft>
            <MUI.ChatHeaderRight>
              <IconButton
                size="medium"
                color="default"
                onClick={handleOpenDrawer}
              >
                <BiInfoCircle />
              </IconButton>
            </MUI.ChatHeaderRight>
          </MUI.ChatHeaderWrapper>
        </MUI.ChatHeader>

        <MUI.ChatContentContainer>
          {/* ======== Chat Lists ======== */}
          {ChatScrollContainer({ messages: manageChat.data })}

          {/* ======== Chat Form ======== */}
          <MUI.ChatFooterContainer>
            <MUI.ChatMessageReply>
              {chatSelector?.dataReply ? (
                <MUI.ChatReplyBoxMessage>
                  <MUI.ChatReplyBoxMessageContainer>
                    <Box>
                      <Typography variant="h2">
                        {chatSelector.dataReply?.createdByCustomer?.firstName}{" "}
                        {chatSelector.dataReply?.createdByCustomer?.lastName}
                      </Typography>
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
              {manageReply?.dataStatus !== "close" ? (
                <MUI.ChatMessageReplyForm>
                  <ChatFormReply
                    dataReply={userCreate}
                    handleReloading={handleReloading}
                    isAdmin={true}
                  />
                </MUI.ChatMessageReplyForm>
              ) : (
                <MUI.ChatTicketClose>
                  <Typography variant="h2">This ticket was closed</Typography>
                </MUI.ChatTicketClose>
              )}
            </MUI.ChatMessageReply>
          </MUI.ChatFooterContainer>
        </MUI.ChatContentContainer>
      </MUI.ChatContainer>

      <DialogUserInfo
        isOpen={isDrawer}
        data={userClient}
        imgSrc={previewImage}
        onClose={handleCloseDrawer}
      />
    </Fragment>
  );
}
