import React from "react";
import { useTranslation } from "react-i18next";

//mui component and style
import { styled as muiStyled } from "@mui/system";
import { Typography, Box, Rating } from "@mui/material";
import DialogV1 from "../../../components/DialogV1";
import feedbackIcon from "../../../utils/images/feedback.svg";
import { DateOfNumber } from "../../../functions";

const DialogPreviewFileV1Boby = muiStyled("div")(({ theme }) => ({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  rowGap: theme.spacing(3),
}));

const DialogPreviewFeedback = (props) => {
  const items = props?.data;
  const { t } = useTranslation();

  function setImageSizeInHTML(htmlContent) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    const images = doc.querySelectorAll("img");

    images.forEach(function (image) {
      image.setAttribute("width", 50);
      image.setAttribute("height", 50);
      image.style.margin = "20px 0";
      image.style.display = "none";
    });

    return doc.documentElement.outerHTML;
  }

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
      <DialogPreviewFileV1Boby>
        <Box
          sx={{
            display: "flex",
            textAlign: "center",
            justifyContent: "center",
            flexDirection: "column",
            padding: "0 !important",
          }}
        >
          <Box>
            <img src={feedbackIcon} alt="logo" width={70} height={70} />
          </Box>
          <Typography
            variant="h6"
            sx={{
              color: (theme) => theme.palette.primaryTheme.brown(0.5),
              padding: "0 !important",
            }}
          >
            {t("_customer")}:{" "}
            {items?.createdBy?.email ? items?.createdBy?.email : "Anonymous "}
          </Typography>
        </Box>
        <Box sx={{ padding: "1rem 0" }}>
          <Typography
            variant="h6"
            sx={{
              fontSize: "10px",
              color: (theme) => theme.palette.primaryTheme.brown(0.5),
              marginBottom: "0.5rem",
            }}
          >
            {t("_created_at")}: {DateOfNumber(items?.createdAt)}
          </Typography>
          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "start",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: (theme) => theme.palette.primaryTheme.brown(0.5),
                  fontSize: "12px",
                }}
              >
                {t("_rating")}:
              </Typography>
              <Rating
                name="half-rating"
                defaultValue={0}
                precision={0.5}
                sx={{ color: "#17766B" }}
                value={parseFloat(items?.rating)}
              />
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  color: (theme) => theme.palette.primaryTheme.brown(0.5),
                  fontSize: "12px",
                  margin: "0.2rem 0",
                }}
              >
                {t("_comment")}:{" "}
                <div
                  dangerouslySetInnerHTML={{
                    __html: setImageSizeInHTML(items?.comment),
                  }}
                ></div>
              </Typography>
            </Box>
          </Box>
          <br />
          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "start",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: (theme) => theme.palette.primaryTheme.brown(0.5),
                  fontSize: "12px",
                }}
              >
                {t("_performance_rating")}:
              </Typography>
              <Rating
                name="half-rating"
                defaultValue={0}
                precision={0.5}
                sx={{ color: "#17766B" }}
                value={parseFloat(items?.performanceRating)}
                readOnly
              />
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  color: (theme) => theme.palette.primaryTheme.brown(0.5),
                  fontSize: "12px",
                  margin: "0.2rem 0",
                }}
              >
                {t("_performance_comment")}: {items?.performanceComment}
              </Typography>
            </Box>
          </Box>
          <br />
          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "start",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: (theme) => theme.palette.primaryTheme.brown(0.5),
                  fontSize: "12px",
                }}
              >
                {t("_design_rating")}:
              </Typography>
              <Rating
                name="half-rating"
                defaultValue={0}
                precision={0.5}
                sx={{ color: "#17766B" }}
                value={parseFloat(items?.designRating)}
                readOnly
              />
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  color: (theme) => theme.palette.primaryTheme.brown(0.5),
                  fontSize: "12px",
                  margin: "0.2rem 0",
                }}
              >
                {t("_design_comment")}: {items?.designComment}
              </Typography>
            </Box>
          </Box>
          <br />
          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "start",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: (theme) => theme.palette.primaryTheme.brown(0.5),
                  fontSize: "12px",
                }}
              >
                {t("_service_rating")}:
              </Typography>
              <Rating
                name="half-rating"
                defaultValue={0}
                precision={0.5}
                sx={{ color: "#17766B" }}
                value={parseFloat(items?.serviceRating)}
                readOnly
              />
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  color: (theme) => theme.palette.primaryTheme.brown(0.5),
                  fontSize: "12px",
                  margin: "0.2rem 0",
                }}
              >
                {t("_service_comment")}: {items?.serviceComment}
              </Typography>
            </Box>
          </Box>
        </Box>
      </DialogPreviewFileV1Boby>
    </DialogV1>
  );
};

export default DialogPreviewFeedback;
