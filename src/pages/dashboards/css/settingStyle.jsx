import {
  Box,
  FormControlLabel,
  Radio,
  Switch,
  createTheme,
  styled,
} from "@mui/material";
const theme = createTheme();

// Radio Button
export const BpRadio = (props) => {
  return (
    <Radio
      disableRipple
      color="default"
      checkedIcon={<BpCheckedIcon />}
      icon={<BpIcon />}
      {...props}
    />
  );
};

export const BpIcon = styled("span")(({ theme }) => ({
  borderRadius: "50%",
  width: 15,
  height: 15,
  boxShadow:
    theme.palette.mode === "dark"
      ? "0 0 0 1px rgb(16 22 26 / 40%)"
      : "inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)",
  backgroundImage:
    theme.palette.mode === "dark"
      ? "linear-gradient(180deg,hsla(0,0%,100%,.05),hsla(0,0%,100%,0))"
      : "linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))",
  ".Mui-focusVisible &": {
    outline: "2px auto rgba(19,124,189,.6)",
    outlineOffset: 2,
  },
  "input:hover ~ &": {
    // backgroundColor: theme.palette.mode === "dark" ? "#30404d" : "#ebf1f5",
  },
}));

export const BpCheckedIcon = styled(BpIcon)({
  backgroundColor: "#17766B",
  backgroundImage:
    "linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))",
  "&::before": {
    display: "block",
    width: 15,
    height: 15,
    backgroundImage: "radial-gradient(#fff,#fff 28%,transparent 32%)",
    content: "''",
  },
  "input:hover ~ &": {
    backgroundColor: "#025144",
  },
});

export const SwitchToggle = styled(Switch)(({ theme }) => ({
  width: 36,
  height: 20,
  padding: 0,

  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        // backgroundColor: theme.palette.mode === "dark" ? "#2ECA45" : "#65C466",
        backgroundColor: "#17766B",
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color:
        theme.palette.mode === "light"
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 16,
    height: 16,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },

  "& .css-1h7xx4f-MuiTypography-root": {
    marginLeft: "10px",
  },
}));

export const GroupFormControl = styled(FormControlLabel)({
  ".MuiFormControlLabel-label": {
    fontSize: "12.5px",

    [theme.breakpoints.down("md")]: {
      fontSize: "11px",
    },
  },
});

export const SettingContainer = styled(Box)({
  marginBottom: "1.8rem",

  [theme.breakpoints.down("md")]: {
    marginBottom: "0.8rem",
  },
});

export const SettingWrapperContainer = styled(Box)({
  padding: "1.5rem",
});

export const SettingHeaderContainer = styled(Box)(({ theme }) => ({
  marginBottom: "1.12rem",

  h1: {
    fontSize: "0.98rem",
    color: "#5D596C",
    fontWeight: "500",
    marginBottom: "0.35rem",

    [theme.breakpoints.down("md")]: {
      fontSize: "0.88rem",
    },

    [theme.breakpoints.down("sm")]: {
      fontSize: "0.82rem",
    },
  },

  h2: {
    fontSize: "0.87rem",
    color: theme.palette.mode === "light" ? "#5D596C" : "#fff",
    fontWeight: "500",
    marginBottom: "0.35rem",

    [theme.breakpoints.down("md")]: {
      fontSize: "0.8rem",
    },

    [theme.breakpoints.down("sm")]: {
      fontSize: "0.75rem",
    },
  },

  h4: {
    fontSize: "0.75rem",
    color: theme.palette.mode === "light" ? "#A5A3AE" : "#fff",

    [theme.breakpoints.down("sm")]: {
      fontSize: "0.7rem",
    },
  },
}));

export const SettingSubHeaderContainer = styled(Box)(({ theme }) => ({
  marginTop: "0.7rem",

  ".sub-toggle": {
    display: "flex",
    alignItems: "center",
    marginTop: "0.3rem",

    [theme.breakpoints.down("md")]: {
      alignItems: "flex-start",
      flexDirection: "column",
    },

    ".sub-toggle-text": {
      marginLeft: "0.28rem",

      [theme.breakpoints.down("md")]: {
        marginLeft: "-0.55rem",
        marginTop: "0.5rem",
      },

      h4: {
        fontSize: "0.7rem",
        color: theme.palette.mode === "light" ? "#5D596C" : "#fff",

        [theme.breakpoints.down("md")]: {
          fontSize: "0.67rem",
        },
      },
    },
  },
}));

export const SettingUploadContainer = styled(Box)({
  borderRadius: "8px",

  ".fav-text": {
    fontSize: "0.86rem",
    marginBottom: "0.9rem",
    color: "#5D596C",
  },
});

export const SettingPaymentContainer = styled(Box)({
  padding: "0.3rem 0",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
});

export const SettingPaymentItem = styled(Box)({
  display: "flex",
  alignItems: "center",

  ".payment-icon": {
    marginRight: "0.9rem",
    width: "36px",
    height: "36px",

    [theme.breakpoints.down("sm")]: {
      width: "32px",
      height: "32px",
    },

    img: {
      width: "100%",
      objectFit: "cover",
    },
  },
});

export const SettingPaymentText = styled(Box)({
  h2: {
    fontSize: "0.9rem",
    marginBottom: "0.25rem",

    [theme.breakpoints.down("sm")]: {
      marginBottom: "0.2rem",
      fontSize: "0.8rem",
    },
  },

  span: {
    fontSize: "0.75rem",

    [theme.breakpoints.down("sm")]: {
      fontSize: "0.65rem",
    },
  },
});

export const SettingLineAction = styled(Box)({
  width: "100%",
  height: "1px",
  backgroundColor: "#E7E6E9",
  margin: "2rem 0",
});

export const SettingAction = styled(Box)({
  textAlign: "right",
});

export const SettingUserForm = styled(Box)({
  position: "relative",
});

export const SettingLabel = styled("label")({
  display: "block",
  marginBottom: "0.14rem",
  fontSize: "0.77rem",
  fontWeight: "500",
  color: "#4B465C",
});

export const SettingHint = styled("span")({
  display: "block",
  marginTop: "0.35rem",
  color: "#4B465C",
  fontSize: "0.66rem",
});

export const SettingBoxTypeFileContainer = styled(Box)({
  border: "1px solid #E7E6E9",
  width: "100%",
  padding: "0.7rem",
  height: "fit-content",
  borderRadius: "5px",
  backgroundColor: "#fff",
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",

  ".empty-type": {
    span: {
      fontSize: "0.76rem",
      color: "#CECECE",
      fontWeight: "400",
    },
  },
});

export const SettingBoxTypeFileItem = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "0.6rem",
  flexWrap: "nowrap",
});

export const SettingBoxTypeFile = styled(Box)({
  borderRadius: "4px",
  backgroundColor: "#E2E1E5",
  padding: "5px 8px",
  display: "flex",
  alignItems: "center",

  span: {
    fontSize: "0.7rem",
    color: "#5D596C",
    fontWeight: "600",
  },

  ".icon-del": {
    marginLeft: "10px",
    cursor: "pointer",
    width: "17px",
    height: "17px",
    borderRadius: "50%",
    backgroundColor: "#807C8C",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    ".icon": { color: "#fff", fontSize: "11px" },
  },
});
