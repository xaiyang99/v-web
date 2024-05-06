import { Box, Paper, TableCell, TableRow } from "@mui/material";
import { createTheme, styled } from "@mui/material/styles";
const theme = createTheme();

const textMainColor = "#5D596C";
const textSecondColor = "#5D596C";

export const PaperGlobal = styled(Paper)({
  boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
  [theme.breakpoints.down("sm")]: {
    padding: "1rem 0.5rem",
  },
  [theme.breakpoints.between("sm", "md")]: {
    padding: "1rem 0.5rem",
  },
});

export const BoxShowSection1 = styled(Box)({
  paddingTop: "2rem",
  paddingBottom: "2rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  h3: {
    color: `${textMainColor}`,
    marginBottom: "1rem",
  },
  h6: {
    color: `${textSecondColor}`,
    margin: "0.2rem 0",
  },
  [theme.breakpoints.down("sm")]: {
    padding: "1rem 0.5rem",
    h3: {
      fontSize: "1rem",
    },
    h6: {
      fontSize: "0.8rem",
    },
  },
});

export const BoxShowSwitchPlan = styled(Box)({
  margin: "2rem 0",
  h6: {
    margin: "0 1rem",
  },
});

export const BoxShowSection2 = styled(Box)({
  padding: "0 4rem",
  [theme.breakpoints.down("sm")]: {
    padding: "1rem 0.5rem",
  },
  [theme.breakpoints.between("sm", "md")]: {
    padding: "2rem 0",
  },
});

export const BoxShowSection3 = styled(Box)({
  display: "flex",
  alignItems: "start",
  justifyContent: "center",
  flexDirection: "column",
  padding: "2rem 4rem",
  margin: "2rem 0",
  background: "rgba(23, 118, 107, .08)",
  h3: {
    color: "#17766B",
    margin: "0.5rem 0",
  },
  h6: {
    color: `${textMainColor}`,
    margin: "0.5rem 0",
  },
  [theme.breakpoints.down("sm")]: {
    padding: "1rem 1rem",
    h3: {
      fontSize: "1rem",
    },
    h6: {
      fontSize: "0.8rem",
    },
  },
});

export const BoxShowSection4 = styled(Box)({
  padding: "4rem 2rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  h3: {
    color: `${textMainColor}`,
  },
  h6: {
    color: `${textSecondColor}`,
  },
  [theme.breakpoints.down("sm")]: {
    padding: "1rem 1rem",
    h3: {
      fontSize: "1rem",
    },
    h6: {
      fontSize: "0.8rem",
      textAlign: "center",
    },
  },
});

export const RowTableRow = styled(TableRow)({});

export const CellTableCell = styled(TableCell)({
  fontSize: "0.9rem",
  fontWeight: "550",
  color: "#5D596C",
  [theme.breakpoints.down("sm")]: {
    fontSize: "0.8rem",
    fontWeight: "400",
  },
  h5: {
    fontSize: "0.8rem",
    textTransform: "uppercase",
  },
  h6: {
    fontSize: "0.8rem",
  },
});

// price card css start
export const BoxShowPriceCard = styled(Box)(({ theme }) => ({
  height: "100%",
  position: "relative",
  border: "1px solid #DBDADE",
  "&:hover": {
    borderColor: theme.palette.primaryTheme.main,
  },
  borderRadius: "10px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  padding: "2rem 1rem",
  h3: {
    color: `${textMainColor}`,
    margin: "1rem 0",
  },
  h6: {
    color: `${textSecondColor}`,
    FontSize: "0.8rem",
  },
  [theme.breakpoints.down("sm")]: {
    padding: "1rem 0.5rem",
    h3: {
      fontSize: "1rem",
    },
    h6: {
      fontSize: "0.8rem",
    },
  },
}));

export const BoxShowChip = styled(Box)({
  width: "100%",
  textAlign: "end",
});

export const BoxShowPriceIcon = styled(Box)({
  img: {
    width: "80px",
    height: "80px",
  },
});

export const BoxShowFeatureList = styled(Box)({
  flexGrow: 1,
  width: "100%",
  display: "flex",
  flexDirection: "column",
});
