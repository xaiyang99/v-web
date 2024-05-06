import {
  Box,
  Checkbox,
  Divider,
  FormControlLabel,
  Tooltip,
  Typography,
  styled,
  useTheme,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import NormalButton from "../../../components/NormalButton";
import { THEMES } from "../../../constants";

const InputFileFieldContainer = styled(Box)({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  height: "100%",
  minHeight: "100%",
});

const InputFileFieldLabel = styled(Box)(({ theme }) => ({
  fontWeight: theme.typography.fontWeightMedium,
}));

const InputFileFieldLayout = styled(Box)(({ theme }) => ({
  color: theme.palette.primaryTheme.brown(),
  width: "100%",
  height: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}));

const InputImageField = (props) => {
  const fileContentRef = useRef(null);
  const fileInputRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const checkIsImageFile =
    props.imageData?.src || props.fileData?.type?.split("/")?.[0] === "image";
  //usage
  const imageSrcResult = imageSrc || props.imageData?.src;
  const imageNameResult = props.fileData?.name || props.imageData?.name;

  const [isDeleteImage, setIsDeleteImage] = useState(false);

  useEffect(() => {
    if (props.fileData instanceof File) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const result = e.target.result;
        setImageSrc(result);
      };
      reader.readAsDataURL(props.fileData);
    } else {
      setImageSrc(null);
    }
  }, [props.fileData]);

  const theme = useTheme();

  return (
    <InputFileFieldContainer>
      {!props.disableLabel && (
        <InputFileFieldLabel>{props.label}</InputFileFieldLabel>
      )}
      <Box
        marginTop={theme.spacing(1)}
        sx={{
          display: "flex",
          position: "relative",
          "&:hover": {
            borderColor: theme.name === THEMES.DARK ? "white" : "black",
          },
          width: "100%",
          border: `1px solid ${
            theme.name === THEMES.DARK
              ? "rgba(255,255,255,0.23)"
              : "rgba(0,0,0,0.23)"
          }`,
          ...(!props.inputProps?.value && {
            color: "#9F9F9F",
          }),
          borderRadius: "4px",
          "&::-webkit-file-upload-button": {
            height: "100%",
            border: "none",
            color: theme.palette.primaryTheme.brown(),
            borderRight: `1px solid ${
              theme.name === THEMES.DARK
                ? "rgba(255,255,255,0.23)"
                : "rgba(0,0,0,0.23)"
            }`,
            padding: "0 10px",
            marginRight: 3,
          },
          ...(props.inputLayoutProps?.sx || {}),
          ...(((imageSrc && checkIsImageFile) || props.imageData?.src) && {
            height: "auto",
          }),
        }}
      >
        {props.fileData instanceof File && (
          <NormalButton
            onClick={props.onRemove}
            sx={{
              position: "absolute",
              width: "initial",
              height: "initial",
              m: 1,
              padding: "4px",
              right: 0,
              position: "absolute",
              padding: (theme) => theme.spacing(1.5),
              boxShadow: (theme) => theme.baseShadow.primary,
              right: 0,
              backgroundColor: "white !important",
              borderRadius: (theme) => theme.spacing(1),
              fontWeight: 500,
            }}
          >
            X
          </NormalButton>
        )}

        <Box
          component="label"
          className="choose-file"
          sx={{
            width: "100%",
            overflow: "hidden",
            cursor: "pointer",
          }}
        >
          <InputFileFieldLayout>
            <Typography
              id="inputFile"
              component="input"
              type="file"
              ref={fileInputRef}
              {...props.inputProps}
              sx={{
                display: "none",
                ...(props.inputProps?.sx || {}),
              }}
            />
            <Box
              component="div"
              sx={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                padding: 3,
                borderRight: `1px solid ${
                  theme.name === THEMES.DARK
                    ? "rgba(255,255,255,0.23)"
                    : "rgba(0,0,0,0.23)"
                }`,
              }}
            >
              Choose File
            </Box>
            <Box
              component="div"
              className="file"
              sx={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                overflow: "hidden",
              }}
            >
              {imageSrcResult ? (
                <Box
                  component="div"
                  className="image-result-layout"
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                  }}
                >
                  <Box
                    ref={fileContentRef}
                    className="file-content"
                    sx={{
                      padding: 3,
                      display: "flex",
                      alignItems: "center",
                      columnGap: 1,
                      width: "100%",
                      height: "100%",
                      overflow: "hidden",
                    }}
                  >
                    <>
                      {checkIsImageFile && (
                        <Typography
                          component="img"
                          src={imageSrcResult}
                          width={150}
                          minWidth={150}
                          height={150}
                          {...{
                            ...(props?.inputImageProps || {}),
                          }}
                        />
                      )}
                      <Tooltip
                        {...{
                          PopperProps: {
                            sx: {
                              zIndex: 99999999999,
                            },
                          },
                        }}
                        title={imageNameResult}
                        placement="bottom-start"
                      >
                        {checkIsImageFile ? (
                          <Typography
                            component="div"
                            sx={{
                              display: "flex",
                              flex: 1,
                              justifyContent: "center",
                              alignItems: "center",
                              overflow: "hidden",
                            }}
                          >
                            <span
                              style={{
                                width: "100%",
                                overflow: "hidden",
                                whiteSpace: "nowrap",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {imageNameResult}
                            </span>
                          </Typography>
                        ) : (
                          <span
                            style={{
                              width: "100%",
                              overflow: "hidden",
                              whiteSpace: "nowrap",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {imageNameResult}
                          </span>
                        )}
                      </Tooltip>
                    </>
                  </Box>
                  {props.canDeleteImage && props.imageData?.src && (
                    <>
                      <Divider
                        sx={{
                          my: 2,
                          color: "black",
                        }}
                      />
                      <Typography
                        variant="div"
                        sx={{
                          padding: 3,
                          paddingTop: 0,
                        }}
                      >
                        <FormControlLabel
                          control={
                            <Checkbox
                              {...props.deleteImageProps}
                              checked={isDeleteImage}
                              onChange={() => setIsDeleteImage(!isDeleteImage)}
                              sx={{
                                paddingTop: 0,
                                paddingBottom: 0,
                              }}
                            />
                          }
                          label="Delete image"
                        />
                      </Typography>
                    </>
                  )}
                </Box>
              ) : (
                <Typography component="div" color={"#9F9F9F"} marginLeft={4}>
                  No file chosen
                </Typography>
              )}
            </Box>
          </InputFileFieldLayout>
        </Box>
      </Box>
    </InputFileFieldContainer>
  );
};

export default InputImageField;
