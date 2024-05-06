import IconReply from "@mui/icons-material/Reply";
import { Box, CircularProgress, IconButton, Typography } from "@mui/material";
import CryptoJS from "crypto-js";
import heEntry from "he";
import { useEffect, useRef, useState } from "react";
import { FileIcon, defaultStyles } from "react-file-icon";
import { useDispatch } from "react-redux";
import { GetFileType, getTimeLineChat, keyBunnyCDN } from "../../../functions";
import {
  setChatMessage,
  setFocus,
} from "../../../redux/slices/chatMessageSlice";
import * as MUI from "../css/chatStyle";

function ChatPanel(props) {
  const { chat, ticketStatus, userReply } = props;
  const [progress, setProgress] = useState({
    id: "",
    percentage: 0,
  });
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);

  const {
    REACT_APP_BUNNY_SECRET_KEY,
    REACT_APP_DOWNLOAD_URL,
    REACT_APP_STORAGE_ZONE,
  } = process.env;
  // reply => _id, message, image: [{image, newNameImage}], createdAt, createdByCustomer: {_id, newName, firstName, lastName }, createdByStaff: { _id }
  // reply => typeTicketID: { _id, title, email, status }

  const bunnyDownloadURL = REACT_APP_DOWNLOAD_URL;
  const bunnySecret = REACT_APP_BUNNY_SECRET_KEY;
  const storageZone = REACT_APP_STORAGE_ZONE;
  const bunnyKey = keyBunnyCDN;

  function handleReply(chat) {
    dispatch(setChatMessage(chat));
    dispatch(setFocus(true));
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollTo(0, 0);
    // messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  async function onDownloadFile(chat, file) {
    try {
      const user = chat?.createdByCustomer?._id
        ? chat?.createdByCustomer
        : chat?.createdByStaff;

      const headers = {
        accept: "*/*",
        storageZoneName: storageZone,
        isFolder: false,
        path: user?.newName + "-" + user?._id + "/" + file?.newNameImage,
        fileName: CryptoJS.enc.Utf8.parse(file?.image),
        AccessKey: bunnyKey,
      };

      const encryptedHeaders = CryptoJS.AES.encrypt(
        JSON.stringify(headers),
        bunnySecret
      ).toString();

      const response = await fetch(bunnyDownloadURL, {
        headers: { encryptedHeaders },
      });

      if (!response?.body) return;

      const contentLength = await response.headers.get("Content-Length");
      let totalLength =
        typeof contentLength === "string" && parseInt(contentLength);
      const reader = await response.body.getReader();
      let receivedLength = 0;

      const chunks = [];
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        chunks.push(value);
        receivedLength += value.length;
        if (typeof totalLength === "number") {
          const step =
            parseFloat((receivedLength / totalLength).toFixed(2)) * 100;

          if (step > 0) {
            setProgress({
              id: file?.newNameImage,
              percentage: step,
            });
          }
        }
      }

      const blob = new Blob(chunks, { type: "text/plain" });
      const href = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = href;
      link.download = file?.image;
      document.body.appendChild(link);
      link.click();

      setProgress({ id: "", percentage: 0 });
      document.body.removeChild(link);
    } catch (err) {
      console.error(err);
    }
  }

  //  {/* <img src={iconPerson} alt="icon-person" /> */}

  useEffect(() => {
    scrollToBottom();
  }, [chat]);

  return (
    <Box className="chat-panel-slide" ref={messagesEndRef}>
      {!!chat.createdByCustomer?._id ? (
        <MUI.ChatListContainer className="chat-user">
          <MUI.ChatBoxListContainer>
            <MUI.ChatBoxContainer>
              <MUI.ChatBoxCardContainer className="box-card-user">
                <MUI.ChatBoxCard className="user">
                  {chat?.replyMessage?._id ? (
                    <Box className="reply-box user">
                      <Typography component="p">You</Typography>
                      <Box>
                        <Typography component="span">
                          {heEntry.decode(
                            chat?.replyMessage?.message || "No message"
                          )}
                          {/* <Typography
                            component="a"
                            href={"#" + chat?.replyMessage?._id}
                          >
                            {heEntry.decode(
                              chat?.replyMessage?.message || "No message"
                            )}
                          </Typography> */}
                        </Typography>
                      </Box>
                    </Box>
                  ) : null}

                  <Typography component="span" id={chat?._id}>
                    {heEntry.decode(chat.message)}
                  </Typography>
                  <Box className="timeDate user">
                    <Typography component="small">
                      {getTimeLineChat(chat.createdAt)}
                    </Typography>
                  </Box>
                </MUI.ChatBoxCard>
                {ticketStatus !== "close" && (
                  <IconButton
                    color="primary"
                    aria-label="reply-message"
                    sx={{ marginLeft: "0.38rem", padding: "7px" }}
                    onClick={() => handleReply(chat)}
                  >
                    <IconReply sx={{ fontSize: "1.4rem" }} />
                  </IconButton>
                )}
              </MUI.ChatBoxCardContainer>
            </MUI.ChatBoxContainer>

            {/* Chat Files on user*/}
            <MUI.ChatBoxFileListContainer>
              {chat?.image.length
                ? chat?.image?.map((file, index) => {
                    return file?.image ? (
                      <MUI.ChatBoxFileItem
                        className="user"
                        key={index}
                        sx={{ mt: 1.3 }}
                        onClick={() => onDownloadFile(chat, file)}
                      >
                        <Box className="icon-file">
                          <Box
                            sx={{
                              width: "20px",
                              mr: 3,
                            }}
                          >
                            <FileIcon
                              color="white"
                              extension={GetFileType(file?.image)}
                              {...{
                                ...defaultStyles[GetFileType(file?.image)],
                              }}
                            />
                          </Box>
                          <Typography component="span">{file.image}</Typography>

                          {file.newNameImage === progress?.id && (
                            <CircularProgress
                              variant="determinate"
                              size="1rem"
                              value={progress.percentage}
                              sx={{ ml: 3 }}
                            />
                          )}
                        </Box>
                      </MUI.ChatBoxFileItem>
                    ) : null;
                  })
                : null}
            </MUI.ChatBoxFileListContainer>
          </MUI.ChatBoxListContainer>
        </MUI.ChatListContainer>
      ) : (
        <MUI.ChatListContainer className="chat-owner">
          <MUI.ChatBoxListContainer>
            <MUI.ChatBoxContainer>
              <MUI.ChatBoxCardContainer>
                <MUI.ChatBoxCard
                  className="owner"
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* message reply */}
                  {chat?.replyMessage?._id ? (
                    <Box className="reply-box">
                      <Typography component="p">
                        {userReply?.firstName}
                      </Typography>
                      <Box>
                        <Typography component="span">
                          {heEntry.decode(
                            chat?.replyMessage?.message || "No message"
                          )}
                          {/* <Typography
                            component="a"
                            href={"#" + chat?.replyMessage?._id}
                          >
                            {heEntry.decode(
                              chat?.replyMessage?.message || "No message"
                            )}
                          </Typography> */}
                        </Typography>
                      </Box>
                    </Box>
                  ) : null}

                  <Typography component="span">
                    {heEntry.decode(chat.message)}
                  </Typography>

                  <Box className="timeDate owner">
                    <Typography component="small">
                      {getTimeLineChat(chat.createdAt)}
                    </Typography>
                  </Box>
                </MUI.ChatBoxCard>
              </MUI.ChatBoxCardContainer>
            </MUI.ChatBoxContainer>

            {/* Chat File on owner */}
            <MUI.ChatBoxFileListContainer>
              {chat?.image.length
                ? chat?.image?.map((file, index) => {
                    return file?.image ? (
                      <MUI.ChatBoxFileItem
                        className="user"
                        key={index}
                        sx={{ mt: 1.3 }}
                        onClick={() => onDownloadFile(chat, file)}
                      >
                        <Box className="icon-file">
                          <Box
                            sx={{
                              width: "20px",
                              mr: 3,
                            }}
                          >
                            <FileIcon
                              color="white"
                              extension={GetFileType(file?.image)}
                              {...{
                                ...defaultStyles[GetFileType(file?.image)],
                              }}
                            />
                          </Box>
                          <Typography component="span">{file.image}</Typography>

                          {file.newNameImage === progress.id && (
                            <CircularProgress
                              variant="determinate"
                              size="1rem"
                              value={progress.percentage}
                              sx={{ ml: 3 }}
                            />
                          )}
                        </Box>
                      </MUI.ChatBoxFileItem>
                    ) : null;
                  })
                : null}
            </MUI.ChatBoxFileListContainer>
          </MUI.ChatBoxListContainer>
        </MUI.ChatListContainer>
      )}
    </Box>
  );
}

export default ChatPanel;
