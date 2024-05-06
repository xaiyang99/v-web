import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Box,
  Rating,
  TextareaAutosize,
  styled,
  createTheme,
} from "@mui/material";
const theme = createTheme();

const MuiAccordion = styled(Accordion)({
  borderRadius: "5px",
  margin: "1rem 0",
  boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px !important",
  padding: "0.5rem 0",
  h5: {
    fontWeight: "400",
    color: "#5D596C",
    margin: "0",
  },
  h6: {
    fontWeight: "400",
    color: "#5D596C",
    margin: "0",
  },
  [theme.breakpoints.down("sm")]: {
    h5: {
      fontSize: "12px",
      fontWeight: "400px",
    },
    h6: {
      fontSize: "12px",
      fontWeight: "400px",
    },
  },
});

const blue = {
  100: "#17766B",
};

const grey = {
  50: "#f6f8fa",
  100: "#eaeef2",
  200: "#d0d7de",
  300: "#afb8c1",
  400: "#8c959f",
  500: "#6e7781",
  600: "#57606a",
  700: "#424a53",
  800: "#32383f",
  900: "#24292f",
};

const StyledTextarea = styled(TextareaAutosize)(
  ({ theme }) => `
    width: 100%;
    font-family: IBM Plex Sans, sans-serif;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;
    padding: 12px;
    border-radius: 12px 12px 0 12px;
    color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
    background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
    border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
    box-shadow: 0px 2px 2px ${
      theme.palette.mode === "dark" ? grey[900] : grey[50]
    };

    &:hover {
      border-color:${blue[100]};
    }

    // firefox
    &:focus-visible {
      outline: 0;
    }
  `
);

export default function RatingComponent(props) {
  const [rating, setRating] = React.useState(0);
  const [commant, setCommant] = React.useState("");

  const handleComment = (e, newValue) => {
    e.preventDefault();
    setCommant(newValue);
    props.handleGetComment(newValue);
  };

  const handleRating = (e, value) => {
    e.preventDefault();
    const convertToNumber = parseInt(value);
    setRating(convertToNumber);
    props.handleGetRating(convertToNumber);
  };

  return (
    <React.Fragment>
      <MuiAccordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography
            variant=""
            sx={{
              fontSize: "1.125rem",
              fontWeight: 500,
              [theme.breakpoints.down("sm")]: {
                fontSize: "0.9rem",
                fontWeight: 400,
              },
            }}
          >
            {props.question}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box
            sx={{
              display: "flex",
              alignItems: "start",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <Typography
              variant=""
              sx={{
                fontSize: "0.9rem",
                fontWeight: 500,
                [theme.breakpoints.down("sm")]: {
                  fontSize: "0.8rem",
                  fontWeight: 400,
                },
              }}
            >
              Please rate your experience on this area
            </Typography>
            <Rating
              value={rating}
              onChange={(e) => {
                handleRating(e, e.target.value);
              }}
              name="half-rating"
              defaultValue={0}
              precision={0.5}
              sx={{ color: "#17766B", padding: "0.5rem", margin: "0.5rem 0" }}
            />
            <StyledTextarea
              value={commant}
              onChange={(e) => {
                handleComment(e, e.target.value);
              }}
              aria-label="minimum height"
              minRows={3}
              placeholder="Your feedback is essential to our continuous improvement..."
            />
          </Box>
        </AccordionDetails>
      </MuiAccordion>
    </React.Fragment>
  );
}
