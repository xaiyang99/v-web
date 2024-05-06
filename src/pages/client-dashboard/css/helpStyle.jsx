import { Box, Button, Paper } from "@mui/material";
import { styled, createTheme } from "@mui/material/styles";
const theme = createTheme();

const mainColor = "#17766B";
const secondColor = "#DAE9E7";
const textMainColor = "#5D596C";
const textSecondColor = "#5D596C";

export const PaperGlobal = styled(Paper)({
  padding: "4rem 2rem",
  boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
  [theme.breakpoints.down("sm")]: {
    padding: "1rem 0.5rem",
  },
});

export const BoxShowHelpSection1 = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  padding: "6rem 0",
  background: "#ECF4F3",
  h2: {
    color: "#5D596C",
  },
  h6: {
    color: "#5D596C",
  },
  [theme.breakpoints.down("sm")]: {
    padding: "2rem 0.5rem",
    h2: {
      fontSize: "1rem",
    },
    h6: {
      fontSize: "0.8rem",
    },
  },
});

export const BoxShowHelpSection2 = styled(Box)({
  background: "#ffffff",
  padding: "4rem 0",
  h3: {
    textAlign: "center",
    color: "#5D596C",
  },
  [theme.breakpoints.down("sm")]: {
    padding: "1rem 0",
    h3: {
      fontSize: "1rem",
    },
  },
});

export const BoxShowArticle = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  margin: "2rem 0",
  padding: "0 4rem",
});

export const BoxShowHelpSection3 = styled(Box)({
  background: "#FBFBFC",
  margin: "1rem 0",
  padding: "3rem 0",
  h3: {
    textAlign: "center",
    color: "#5D596C",
    margin: "2rem",
  },
  [theme.breakpoints.down("sm")]: {
    padding: "1rem 0",
    margin: "0",
    h3: {
      margin: "0.5rem",
      fontSize: "1rem",
    },
  },
});

export const BoxShowKnowladgeCard = styled(Box)({
  padding: "0 4rem",
});

export const BoxShowHelpSection4 = styled(Box)({
  background: "#FFFFFF",
  margin: "5rem 0 4rem 0",
  h3: {
    textAlign: "center",
    color: "#5D596C",
    margin: "2rem",
  },
});

export const BoxShowHelpSection5 = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  padding: "6rem 0",
  margin: "2rem 0",
  background: "#FBFBFC",
  h3: {
    color: `${textMainColor}`,
  },
  h6: {
    color: `${textSecondColor}`,
    margin: "0.2rem 0",
  },
  [theme.breakpoints.down("sm")]: {
    padding: "1rem 0",
    h3: {
      fontSize: "1rem",
    },
    h6: {
      fontSize: "0.8rem",
    },
  },
});

export const BoxShowButton = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

export const HelpButton = styled(Button)({
  background: `${mainColor}`,
  color: "#ffffff",
  margin: "0 1rem",
});

// article card
export const BoxShowCard = styled(Box)({
  border: "1px solid #DBDADE",
  padding: "2rem 3rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  borderRadius: "10px",
  img: {
    width: "80px",
    height: "80px",
  },
  h4: {
    color: "#5D596C",
  },
  h6: {
    margin: "1rem 0",
    color: "#6F6B7D",
  },
  [theme.breakpoints.down("sm")]: {
    padding: "1rem",
    h4: {
      fontSize: "1rem",
    },
    h6: {
      fontSize: "0.8rem",
    },
  },
});

export const ReadMoreButton = styled(Button)({
  background: `${secondColor}`,
  color: `${mainColor}`,
  padding: "0.4rem 2rem",
  fontWeight: "800",
});

// knowladge card
export const BoxShowKnowledge = styled(Button)({
  display: "flex",
  alignItems: "start",
  justifyContent: "start",
  flexDirection: "column",
  padding: "2rem 3rem",
  width: "100%",
  boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
  borderRadius: "10px",
  [theme.breakpoints.down("sm")]: {
    padding: "0.5rem",
  },
});

export const BoxShowKnowledgeHeader = styled(Button)({
  display: "flex",
  textAlign: "center",
  justifyContent: "start",
  color: "#5D596C",
  h4: {
    fontWeight: "600",
  },
  [theme.breakpoints.down("sm")]: {
    h4: {
      fontSize: "0.9rem",
    },
  },
});

export const BoxShowKnowledgeBody = styled(Button)({
  padding: "0",
  margin: "0",
  ul: {
    paddinLeft: "1rem",
    display: "flex",
    alignItems: "start",
    justifyContent: "start",
    flexDirection: "column",
    li: {
      fontSize: "1rem",
    },
  },
  [theme.breakpoints.down("sm")]: {
    ul: {
      li: {
        fontSize: "0.8rem",
      },
    },
  },
});

export const BoxShowKnowledgeFooter = styled(Button)({
  color: "#5D596C",
  h5: {
    fontWeight: "600",
  },
});
