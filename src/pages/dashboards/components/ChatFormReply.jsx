import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { LoadingButton } from "@mui/lab";
import { useSelector } from "react-redux";
import * as chatSlice from "../../../redux/slices/chatMessageSlice";
import { useDispatch } from "react-redux";
import DialogUploadChatFile from "../../../components/DialogUploadChatFile";
import { CREATE_REPLY_MESSAGE } from "../chat-message/apollo";
import { errorMessage } from "../../../components/Alerts";
import * as MUI from "../css/chatStyle";
import { useMutation } from "@apollo/client";
import { Formik } from "formik";
import * as yup from "yup";

// material ui
import { IconButton, InputAdornment, OutlinedInput } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { useDropzone } from "react-dropzone";

export default function ChatFormReply(props) {
  const { dataReply, handleReloading, isAdmin } = props;
  const [isFile, setIsFile] = useState(false);

  const inputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [textMessage, setTextMessage] = useState("");
  const [createReplyMessage] = useMutation(CREATE_REPLY_MESSAGE, {
    fetchPolicy: "no-cache",
  });
  const chatSelector = useSelector(chatSlice.chatMessageSelector);
  const dispatch = useDispatch();

  const onDropFile = useCallback(
    (acceptFiles) => {
      acceptFiles.map((file) => {
        dispatch(chatSlice.setFiles(file));
      });
      setIsFile(true);
    },
    [chatSlice.chatMessageSelector?.files]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: onDropFile,

    multiple: true,
  });

  const handleTextMessage = (evt) => {
    setTextMessage(evt.target.value);
  };

  const handleIsFileClose = () => {
    setIsFile(false);
    dispatch(chatSlice.setFilesEmpty());
    dispatch(chatSlice.setCurrentIndex(0));
    handleReloading();
  };

  const handleClearMessage = () => dispatch(chatSlice.setChatMessageEMPTY());

  // values, action
  const submitFormReply = async (values, action) => {
    // if (!textMessage) {
    //   return;
    // }

    try {
      setIsLoading(true);
      const result = await createReplyMessage({
        variables: {
          data: {
            typeTicketID: parseInt(dataReply?._id),
            title: dataReply?.title,
            email: dataReply?.email,
            // message: textMessage,
            message: values?.reply,
            image: [],
            statusSend: chatSelector?.dataReply?._id ? null : "answerMessage",
            replyMessage: chatSelector?.dataReply?._id
              ? parseInt(chatSelector?.dataReply?._id)
              : parseInt("0"),
          },
          request: isAdmin ? "backoffice" : "client",
        },
      });

      if (result?.data?.createTickets?._id) {
        handleReloading();
        setIsLoading(false);
        handleClearMessage();
        // setTextMessage("");
        action?.resetForm();
      }
    } catch (error) {
      setIsLoading(false);
      errorMessage("Something went wrong, please try again", 3000);
    }
  };

  const handleKeyDown = (e) => {
    if (e.shiftKey && e.key === "Enter") {
      e.preventDefault();
      setTextMessage((prevText) => prevText + "\n");
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <Fragment>
      {/* <form
        onSubmit={(e) => {
          e.preventDefault();
          submitFormReply();
        }}
      >
        <input type="file" multiple={true} hidden={true} {...getInputProps()} />
        <OutlinedInput
          id="labelReply"
          type="text"
          // name="reply"
          size="medium"
          placeholder="Type your message here..."
          fullWidth={true}
          ref={inputRef}
          // error={Boolean(touched.reply && errors.reply)}
          multiline={true}
          onChange={handleTextMessage}
          onKeyDown={handleKeyDown}
          value={textMessage}
          // value={values.reply}
          // onChange={handleChange}
          endAdornment={
            <InputAdornment position="end">
              <MUI.ChatReplyInput>
                <IconButton
                  aria-label="toggle password visibility"
                  edge="end"
                  type="button"
                  sx={{ marginRight: "0.8rem" }}
                  {...getRootProps()}
                >
                  {<UploadFileIcon sx={{ fontSize: "1.2rem" }} />}
                </IconButton>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={isLoading}
                >
                  Send
                </LoadingButton>
              </MUI.ChatReplyInput>
            </InputAdornment>
          }
        />
      </form> */}
      <Formik
        initialValues={{
          reply: "",
        }}
        validationSchema={yup.object().shape({
          reply: yup.string().required(),
        })}
        onSubmit={submitFormReply}
      >
        {({ handleSubmit, errors, touched, handleChange, values }) => (
          <form onSubmit={handleSubmit}>
            <input
              type="file"
              multiple={true}
              hidden={true}
              {...getInputProps()}
            />
            <OutlinedInput
              id="labelReply"
              name="reply"
              type="text"
              size="medium"
              placeholder="Type your message here..."
              fullWidth={true}
              multiline={true}
              ref={inputRef}
              error={Boolean(touched.reply && errors.reply)}
              value={values.reply}
              onChange={handleChange}
              endAdornment={
                <InputAdornment position="end">
                  <MUI.ChatReplyInput>
                    <IconButton
                      aria-label="toggle password visibility"
                      edge="end"
                      type="button"
                      sx={{ marginRight: "0.8rem" }}
                      {...getRootProps()}
                    >
                      {<UploadFileIcon sx={{ fontSize: "1.2rem" }} />}
                    </IconButton>
                    <LoadingButton
                      type="submit"
                      variant="contained"
                      loading={isLoading}
                    >
                      Send
                    </LoadingButton>
                  </MUI.ChatReplyInput>
                </InputAdornment>
              }
            />
          </form>
        )}
      </Formik>

      <DialogUploadChatFile
        isOpen={isFile}
        isAdmin={isAdmin}
        dataReply={dataReply}
        onClose={handleIsFileClose}
        onConfirm={handleIsFileClose}
        selectFileMore={{ ...getRootProps() }}
      />
    </Fragment>
  );
}
