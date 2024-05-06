import {
  Box,
  DialogContent,
  InputAdornment,
  OutlinedInput,
  Typography,
} from "@mui/material";
import { Fragment, useState } from "react";
// import DialogV1 from "./DialogV1";
import { useMutation } from "@apollo/client";
import IconAdd from "@mui/icons-material/Add";
import IconDel from "@mui/icons-material/Close";
import IconEmpty from "@mui/icons-material/CreateNewFolder";
import { LoadingButton } from "@mui/lab";
import axios from "axios";
import { Formik } from "formik";
import { FileIcon, defaultStyles } from "react-file-icon";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import {
  ConvertBytetoMBandGB,
  GetFileType,
  keyBunnyCDN,
  linkBunnyCDN,
} from "../functions";
import useAuth from "../hooks/useAuth";
import { CREATE_REPLY_MESSAGE } from "../pages/dashboards/chat-message/apollo";
import {
  BoxAddFile,
  BoxDelFile,
  BoxPreviewFile,
  BoxPreviewFileContainer,
  BoxPreviewFileInnerV1,
  BoxPreviewFileInnerV1Container,
  BoxPreviewFileV1,
  BoxProgressItem,
  BoxProgressItemLine,
  BoxProgressText,
  ChatPreviewFileData,
  ChatPreviewUploadFile,
  ChatShowUploadFileContainer,
  ChatShowUploadFileHeader,
  ShowUploadChatFile,
  ShowUploadChatForm,
} from "../pages/dashboards/css/chatStyle";
import * as ChatAction from "../redux/slices/chatMessageSlice";
import { errorMessage } from "./Alerts";
import DialogV1 from "./DialogV1";

function DialogUploadChatFile(props) {
  const { dataReply, isAdmin, onConfirm, selectFileMore } = props;
  const [showProgress, setShowProgress] = useState(false);
  const [progressInfo, setProgressInfo] = useState([
    { percentage: 0, filename: "" },
  ]);
  const { user } = useAuth();
  const bunneyUrl = linkBunnyCDN;
  const bunnyAccess = keyBunnyCDN;
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const schema = yup
    .object()
    .shape({ reply: yup.string().required("Reply is required") });
  const [createReplyMessage] = useMutation(CREATE_REPLY_MESSAGE, {
    fetchPolicy: "no-cache",
  });
  const chatSelector = useSelector(ChatAction.chatMessageSelector);

  function handlePreviewIndex(index) {
    dispatch(ChatAction.setCurrentIndex(index));
  }

  function handleDelFile(index) {
    dispatch(ChatAction.setCurrentIndex(index));
    dispatch(ChatAction.setRemoveFile(index));
  }

  function ShowIconEmpty() {
    return (
      <IconEmpty
        sx={{
          width: "100px",
          height: "100px",
          color: "#ccc",
        }}
      />
    );
  }

  const submitDialogFormReply = async (values) => {
    try {
      let fileNames = chatSelector?.files.map((file) => file.name) ?? [];
      let _firstProgressInfos = [];
      for (let i = 0; i < chatSelector?.files.length; i++) {
        _firstProgressInfos.push({
          percentage: 0,
          filename: chatSelector?.files[i].name,
        });
      }

      setProgressInfo(_firstProgressInfos);
      setIsLoading(true);

      const result = await createReplyMessage({
        variables: {
          data: {
            title: dataReply?.title,
            typeTicketID: parseInt(dataReply?._id),
            email: dataReply?.email,
            message: values?.reply,
            image: [...fileNames],
            statusSend: chatSelector?.dataReply?._id ? null : "answerMessage",
            replyMessage: chatSelector?.dataReply?._id
              ? parseInt(chatSelector?.dataReply?._id)
              : parseInt("0"),
          },
          request: isAdmin ? "backoffice" : "client",
        },
      });

      if (result?.data?.createTickets?._id) {
        if (chatSelector?.files.length) {
          setShowProgress(true);
          const imageAccess = (await result?.data?.createTickets?.image) || [];

          for (let i = 0; i < chatSelector?.files.length; i++) {
            setProgressInfo(() => [
              {
                filename: chatSelector?.files[i].name,
                percentage: 0,
              },
            ]);
            await axios.put(
              `${bunneyUrl}/${user?.newName}-${user?._id}/${imageAccess[i]?.newNameImage}`,
              chatSelector?.files[i],
              {
                headers: {
                  AccessKey: bunnyAccess,
                  "Content-Type": "multipart/form-data",
                },
                onUploadProgress: (event) => {
                  const percentCompleted = Math.round(
                    (event.loaded * 100) / event.total,
                  );

                  if (percentCompleted === 100) {
                    setProgressInfo(() => [
                      {
                        filename: chatSelector?.files?.[i].name,
                        percentage: 99,
                      },
                    ]);
                  } else {
                    setProgressInfo(() => [
                      {
                        filename: chatSelector?.files?.[i].name,
                        percentage: percentCompleted,
                      },
                    ]);
                  }
                },
              },
            );
          }
        }
        setIsLoading(false);
        setShowProgress(false);
        onConfirm();
        dispatch(ChatAction.setChatMessageEMPTY());
        setProgressInfo([]);
      }
    } catch (error) {
      setShowProgress(false);
      setProgressInfo([]);
      setIsLoading(false);
      errorMessage("Something went wrong, please try again", 3000);
    }
  };

  return (
    <Fragment>
      <DialogV1
        {...props}
        dialogProps={{
          PaperProps: {
            sx: {
              overflowY: "initial",
              maxWidth: "600px",
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
        disableBackdropClick={true}
      >
        <DialogContent>
          {/* Preview Header file name */}
          <ChatShowUploadFileHeader>
            {chatSelector?.files.length ? (
              chatSelector?.currentIndexFile !== -1 ? (
                <Typography component="span">
                  {chatSelector?.files[chatSelector?.currentIndexFile]?.name}
                </Typography>
              ) : null
            ) : (
              <Typography component="span">No File selected</Typography>
            )}
          </ChatShowUploadFileHeader>

          <ChatShowUploadFileContainer>
            <ShowUploadChatFile>
              {chatSelector?.files.length ? (
                <>
                  {chatSelector?.files[chatSelector?.currentIndexFile]?.name ? (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        flexDirection: "column",
                      }}
                    >
                      {/* Preview Photo */}
                      <ChatPreviewUploadFile>
                        {/* file icon */}
                        <FileIcon
                          color="white"
                          extension={GetFileType(
                            chatSelector?.files[chatSelector?.currentIndexFile]
                              ?.name,
                          )}
                          {...{
                            ...defaultStyles[
                              GetFileType(
                                chatSelector?.files[
                                  chatSelector?.currentIndexFile
                                ]?.name,
                              )
                            ],
                          }}
                        />
                      </ChatPreviewUploadFile>

                      {/* Preview File with Data */}
                      <ChatPreviewFileData>
                        <Typography component="span">
                          {ConvertBytetoMBandGB(
                            chatSelector?.files[chatSelector?.currentIndexFile]
                              ?.size,
                          )}
                        </Typography>
                      </ChatPreviewFileData>
                    </Box>
                  ) : (
                    ShowIconEmpty()
                  )}
                </>
              ) : (
                ShowIconEmpty()
              )}
            </ShowUploadChatFile>

            <ShowUploadChatForm>
              <Formik
                initialValues={{ reply: "" }}
                validationSchema={schema}
                onSubmit={submitDialogFormReply}
              >
                {({ errors, touched, handleChange, handleSubmit, values }) => (
                  <form onSubmit={handleSubmit}>
                    <OutlinedInput
                      id="labelReply"
                      type="text"
                      name="reply"
                      size="medium"
                      placeholder="Type your message here..."
                      fullWidth={true}
                      multiline={true}
                      error={Boolean(touched.reply && errors.reply)}
                      value={values.reply}
                      onChange={handleChange}
                      endAdornment={
                        <InputAdornment position="end">
                          <LoadingButton
                            type="submit"
                            variant="contained"
                            loading={isLoading}
                          >
                            Send
                          </LoadingButton>
                        </InputAdornment>
                      }
                    />
                  </form>
                )}
              </Formik>
            </ShowUploadChatForm>

            <BoxPreviewFileContainer>
              {showProgress ? (
                <Fragment>
                  {progressInfo.map((file, index) => (
                    <BoxPreviewFileV1 key={index}>
                      <BoxPreviewFileInnerV1Container>
                        <BoxPreviewFileInnerV1>
                          <Box
                            sx={{
                              width: "16px",
                            }}
                          >
                            <FileIcon
                              color="white"
                              extension={GetFileType(file.filename)}
                              {...{
                                ...defaultStyles[GetFileType(file.filename)],
                              }}
                            />
                          </Box>

                          <BoxProgressText>
                            <Typography variant="span" color="initial">
                              {file.filename}
                            </Typography>
                            <BoxProgressItem>
                              <BoxProgressItemLine
                                sx={{
                                  width: file.percentage + "%",
                                }}
                              ></BoxProgressItemLine>

                              <Typography component="p">
                                {file.percentage} %
                              </Typography>
                            </BoxProgressItem>
                          </BoxProgressText>
                        </BoxPreviewFileInnerV1>
                      </BoxPreviewFileInnerV1Container>
                    </BoxPreviewFileV1>
                  ))}
                </Fragment>
              ) : (
                <Fragment>
                  {chatSelector?.files?.length ? (
                    <Fragment>
                      {chatSelector?.files?.map((file, index) => (
                        <BoxPreviewFile
                          className={
                            chatSelector?.currentIndexFile === index
                              ? "active"
                              : null
                          }
                          key={index}
                          onClick={() => handlePreviewIndex(index)}
                        >
                          <BoxDelFile
                            className="icon-del"
                            onClick={() => handleDelFile(index)}
                          >
                            <IconDel
                              sx={{ fontSize: "0.7rem", color: "#D53333" }}
                            />
                          </BoxDelFile>
                          <Box
                            sx={{
                              width: "20px",
                            }}
                          >
                            <FileIcon
                              color="white"
                              extension={GetFileType(file?.name)}
                              {...{
                                ...defaultStyles[GetFileType(file?.name)],
                              }}
                            />
                          </Box>
                        </BoxPreviewFile>
                      ))}
                    </Fragment>
                  ) : null}
                  <BoxAddFile
                    {...selectFileMore}
                    //  onClick={handleFile}
                  >
                    <IconAdd className="icon-add" />
                  </BoxAddFile>
                </Fragment>
              )}
            </BoxPreviewFileContainer>
          </ChatShowUploadFileContainer>
        </DialogContent>
      </DialogV1>
    </Fragment>
  );
}

export default DialogUploadChatFile;
