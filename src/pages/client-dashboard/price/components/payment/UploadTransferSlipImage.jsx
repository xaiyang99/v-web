import { Box, Typography, useTheme } from "@mui/material";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import NormalButton from "../../../../../components/NormalButton";
import * as Icon from "../../icons";

const UploadTransferSlipImage = () => {
  const theme = useTheme();
  const [selectedImage, setSelectedImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const onDrop = useCallback((acceptedFiles) => {
    const imageFile = acceptedFiles[0];

    if (imageFile && imageFile.type.startsWith("image/")) {
      setSelectedImage(URL.createObjectURL(imageFile));
      setErrorMessage("");
    } else {
      setSelectedImage(null);
      setErrorMessage("Invalid file type. Please select an image.");
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });

  const resetImage = () => {
    setSelectedImage(null);
    setErrorMessage("");
  };

  return (
    <>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
        }}
      >
        Upload your transfer slip
      </Typography>

      <Typography
        component="div"
        className="bank-transfer-slip-upload"
        sx={{
          border: "1px dashed #DBDADE",
          "&:hover": {
            borderColor: theme.palette.primaryTheme.main,
          },
          position: "relative",
          borderRadius: 2,
          minWidth: "100px",
          height: "238px",
          maxHeight: "238px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          rowGap: 3,
        }}
        {...getRootProps({
          className: "dropzone",
        })}
      >
        {selectedImage ? (
          <Typography
            component="div"
            sx={{
              padding: 10,
              display: "flex",
              justifyContent: "center",
              position: "relative",
              minWidth: "100%",
              height: "100%",
              maxHeight: "100%",
            }}
          >
            <NormalButton
              onClick={(e) => {
                e.stopPropagation();
                resetImage();
              }}
              sx={{
                position: "absolute",
                width: "initial",
                height: "initial",
                padding: (theme) => theme.spacing(1.5),
                boxShadow: (theme) => theme.baseShadow.primary,
                top: 5,
                right: 5,
                backgroundColor: "white !important",
                borderRadius: (theme) => theme.spacing(1),
                color: "rgba(0, 0, 0, 0.3)",
              }}
            >
              <Icon.FaTimesIcon />
            </NormalButton>
            <img
              src={selectedImage}
              alt="Selected"
              style={{ maxWidth: "100%", maxHeight: "100%" }}
            />
          </Typography>
        ) : (
          <>
            <Typography
              className="icon"
              component="div"
              sx={{
                padding: "8px",
                borderRadius: 2,
                backgroundColor: "#F1F0F2",
              }}
            >
              <Icon.FiUploadIcon
                style={{
                  fontSize: "1.5rem",
                  display: "flex",
                }}
              />
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
              }}
            >
              {isDragActive
                ? "Drag the files here ..."
                : "Drag and drop your image here"}
            </Typography>
            <Typography component="span">or</Typography>
            <Box
              component="label"
              className="choose-file"
              sx={{
                width: "auto",
                height: "auto",
                fontWeight: 500,
                padding: "8px 16px",
                color: theme.palette.primaryTheme.main,
                borderRadius: "4px",
                display: "block",
                textAlign: "center",
                backgroundColor: "rgba(23, 118, 107, 0.16)",
                overflow: "hidden",
                cursor: "pointer",
              }}
            >
              <div
                sx={{
                  display: "none",
                }}
                {...{
                  ...getInputProps(),
                }}
              />
              Browse image
            </Box>
          </>
        )}
      </Typography>
      {errorMessage && (
        <Typography component="div" color={"#EA5455"}>
          {errorMessage}
        </Typography>
      )}
    </>
  );
};

export default UploadTransferSlipImage;
