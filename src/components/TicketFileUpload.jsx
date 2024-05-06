import FileDoc from "@mui/icons-material/ReceiptSharp";
import { Box, Typography } from "@mui/material";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FiUpload } from "react-icons/fi";
import { ConvertBytetoMBandGB } from "../functions";
import * as MUI from "../pages/client-dashboard/css/ticketStyle";
import {
  BrowseImageButton,
  ButtonUpload,
} from "../pages/client-dashboard/ticket/style";
import DeleteIcon from "@mui/icons-material/Delete";

export default function TicketFileUpload(props) {
  const [files, setFiles] = useState([]);
  const onDrop = useCallback(
    (acceptedFiles) => {
      acceptedFiles.forEach(() => {
        // setFiles([...acceptedFiles]);
        // props.handleFile([...acceptedFiles]);
        setFiles([...files, ...acceptedFiles]);
        props.handleFile([...files, ...acceptedFiles]);
      });
    },
    [files]
  );
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,

    multiple: true,
  });

  function handleDelete(index) {
    setFiles(() => {
      return files.filter((_, i) => i !== index);
    });
    props.handleFile([...files]);
  }

  return (
    <MUI.TicketContainerWrapper>
      <MUI.TicketBodyUpload>
        <MUI.TicketHeader {...getRootProps()}>
          <Box mb={5}>
            <Typography component="span">10 MB Limit per file</Typography>
          </Box>
          <ButtonUpload style={{ marginBottom: "8px" }} variant="text">
            <FiUpload
              sx={{
                fontSize: "30px",
              }}
            />
          </ButtonUpload>
          <Typography variant="h4">Drag & drop to upload</Typography>
          <Box>
            <Typography variant="span">or</Typography>
          </Box>
          <BrowseImageButton
            style={{ marginTop: "1rem" }}
            type="button"
            variant="outlined"
            onClick={() => {
              props.handleFile([]);
              setFiles([]);
            }}
          >
            Browse image
            <input {...getInputProps()} hidden={true} />
          </BrowseImageButton>
        </MUI.TicketHeader>

        {files.length > 0 && (
          <MUI.FileList mt={3}>
            {files.map((file, index) => {
              return (
                <MUI.FileListItem key={index}>
                  <Box className="box-img">
                    <FileDoc className="icon" />
                  </Box>
                  <Box className="text-file">
                    <Box className="file-wrapper">
                      <Typography component="p">{file.name}</Typography>
                      <Typography component="span">
                        {index} {ConvertBytetoMBandGB(file.size)}
                      </Typography>
                    </Box>

                    <Box className="action-file">
                      <DeleteIcon
                        className="icon"
                        onClick={() => handleDelete(index)}
                      />
                    </Box>
                  </Box>
                </MUI.FileListItem>
              );
            })}
          </MUI.FileList>
        )}
      </MUI.TicketBodyUpload>
    </MUI.TicketContainerWrapper>
  );
}
