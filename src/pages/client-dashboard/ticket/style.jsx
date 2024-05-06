import { Link } from "react-router-dom";
import {
  Button,
  CardContent,
  IconButton,
  createTheme,
  Box,
} from "@mui/material";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import { styled } from "@mui/system";

const theme = createTheme();

export const TicketSectionContainer = styled(Box)({
  marginBottom: "1.8rem",

  [theme.breakpoints.down("md")]: {
    marginBottom: "0.8rem",
  },

  [theme.breakpoints.down("1280")]: {
    padding: "20px",
  },
});

export const HeaderTicketTitle = styled(Box)({
  marginBottom: "1rem",
  h2: {
    fontSize: "1.2rem",
    color: "#4B465C",
  },

  [theme.breakpoints.down("md")]: {
    h2: {
      fontSize: "1rem",
    },
  },
});

export const HeaderLayout = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "1.5rem",
  marginBottom: "1rem",
  [theme.breakpoints.down("1280")]: {
    padding: "0 20px",
  },

  [theme.breakpoints.down("sm")]: {
    gap: "0.8rem",
  },

  h3: {
    fontSize: "1.2rem",
  },

  [theme.breakpoints.down("md")]: {
    h3: {
      fontSize: "1rem",
    },
  },
});

export const TickCardContent = styled(CardContent)({
  paddingBottom: 0,
});

export const FormLayoutField = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "0.7rem",
  justifyContent: "flex-end",
});

export const ActionLayout = styled(Box)({
  marginTop: "3rem",
  marginBottom: "2rem",
  display: "flex",
  alignItems: "center",
  justifyItems: "start",
  gap: "0.8rem",
});

export const CloseTicketButton = styled(Button)({
  backgroundColor: "#F1F0F2",
  color: "#777777",
  fontWeight: "600",
  "&:hover": {
    backgroundColor: "#D9D9DA",
  },
});

export const TicketLink = styled(Link)({
  cursor: "pointer",
  textDecoration: "none",
  "&:hover": {
    textDecoration: "underline",
  },
  fontWeight: 600,
  // color: "#1870c6",
  color: "#17766B",
});

export const BrowseImageButton = styled("button")({
  backgroundColor: "#D2E1DF",
  color: "#17766B",
  padding: "6px 20px",
  height: "40px",
  borderRadius: "5px",
  fontSize: "0.85rem",
  border: "0",
  outline: "none",
  cursor: "pointer",
  fontWeight: "600",
  "&:hover": {
    backgroundColor: "#B8D3CF",
  },
});

export const ButtonUpload = styled(IconButton)({
  background: "#E8E8EA",
  borderRadius: "8px",
  "&:hover": {
    background: "#E8E8EA",
  },
});

export const HeaderGuidline = styled(Box)({
  marginBottom: "1.5rem",

  [theme.breakpoints.down("md")]: {
    marginBottom: "1rem",
  },

  h4: {
    textTransform: "uppercase",
    fontSize: "1rem",
    color: "#B0AEB8",

    [theme.breakpoints.down("md")]: {
      fontSize: "0.8rem",
    },
  },

  h2: {
    marginTop: "0.6rem",
    fontSize: "1.5rem",
    color: "#4B465C",

    [theme.breakpoints.down("md")]: {
      fontSize: "1rem",
      marginTop: "0.2rem",
    },
  },
});

export const GuideListContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  marginBottom: "1.2rem",
});

export const GuideList = styled(Box)({
  borderRadius: "8px",
  padding: "1.2rem 1.5rem",
  backgroundColor: "#F8F8F8",

  h2: {
    fontSize: "1.5rem",
    marginBottom: "1rem",

    [theme.breakpoints.down("lg")]: {
      fontSize: "1.2rem",
      marginBottom: "0.6rem",
    },

    [theme.breakpoints.down("md")]: {
      fontSize: "1rem",
    },
  },

  span: {
    fontSize: "0.8rem",
    lineHeight: "1.6",

    [theme.breakpoints.down("md")]: {
      fontSize: "0.7rem",
    },
  },

  a: {
    color: "#17766B",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "0.8rem",
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },

    [theme.breakpoints.down("md")]: {
      fontSize: "0.7rem",
    },
  },
});

export const GuideButtonContainer = styled(Box)({
  marginBottom: "1.5rem",
});
export const GuideAllButton = styled("button")({
  border: "1px solid #E8E7E9",
  borderRadius: "8px",
  fontSize: "1rem",
  cursor: "pointer",
  padding: "6px 20px",
  height: "42px",
  outline: "none",
  backgroundColor: "#F8F8F9",
  color: "#92909D",
  fontWeight: "500",
});

export const TicketIntroHeader = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: "1.5rem",
});

export const IntroHederLeft = styled(Box)({
  h4: {
    fontSize: "1rem",
    color: "#4B465C",
    marginBottom: "0.15rem",

    [theme.breakpoints.down("md")]: {
      fontSize: "0.85rem",
      marginBottom: "0.1rem",
    },
  },

  span: {
    fontSize: "0.8rem",
    color: "#B0AEB8",
    lineHeight: "1.5",

    [theme.breakpoints.down("md")]: {
      fontSize: "0.7rem",
      lineHeight: "1.3",
    },
  },

  ".service": {
    color: "#17766B",
    fontWeight: "600",
  },
});

export const IntroHederRight = styled(Box)({
  ".icon-info": {
    width: "30px",
    height: "30px",
    color: "#17766B",
  },
});

export const IntroWrapper = styled(Box)({
  display: "flex",
  flexDirection: "column",
  li: {
    color: "#17766B",
    fontSize: "0.85rem",
    lineHeight: "1.6",
    fontWeight: "600",

    [theme.breakpoints.down("md")]: {
      fontSize: "0.78rem",
    },
  },
});

export const IntroSubWrapper = styled(Box)({
  marginTop: "1rem",

  [theme.breakpoints.down("md")]: {
    marginTop: "0.6rem",
  },

  span: {
    fontSize: "0.9rem",
    color: "#92909D",

    [theme.breakpoints.down("md")]: {
      fontSize: "0.7rem",
    },
  },
});

export const PopularHeader = styled(Box)({
  marginBottom: "0.6rem",

  [theme.breakpoints.down("sm")]: {
    marginBottom: "0",
  },

  span: {
    fontSize: "0.8rem",
    fontWeight: "600",
    color: "#CFCED4",
    textTransform: "uppercase",
  },

  [theme.breakpoints.down("md")]: {
    span: {
      fontSize: "0.7rem",
    },
  },

  h2: {
    fontSize: "1.8rem",
    fontWeight: "600",
    color: "#92909D",
    textTransform: "capitalize",
  },

  [theme.breakpoints.down(992)]: {
    h2: {
      fontSize: "1.6rem",
    },
  },
  [theme.breakpoints.down(540)]: {
    h2: {
      fontSize: "1.2rem",
    },
  },
});

export const AccordionContainer = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))({
  "&:before": {
    display: "none",
  },
});

export const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.6rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  minHeight: "0",
  paddingLeft: "0",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    margin: "8px 0",
    marginLeft: theme.spacing(1),
  },

  h4: {
    fontSize: "0.89rem",
    color: "#17766B",
  },

  [theme.breakpoints.down("md")]: {
    h4: {
      fontSize: "0.75rem",
    },
  },
}));

export const AccordionDetails = styled(MuiAccordionDetails)({
  padding: "7px 5px 7px 5px",
  span: {
    fontSize: "0.8rem",
  },
});

export const getColorStatus = (status) => {
  const customStyle = {
    textTransform: "capitalize",
    fontWeight: "bold",
    fontSize: "0.7rem",
  };
  if (status === "new") {
    return {
      backgroundColor: "#D6EFE4",
      ...customStyle,
      color: "#28C76F",
    };
  } else if (status === "pending") {
    return {
      backgroundColor: "#FFEFE1",
      ...customStyle,
      color: "#FF9F43",
    };
  }
  return {
    backgroundColor: "#F1F1F2",
    ...customStyle,
    color: "#A8AAAE",
  };
};
