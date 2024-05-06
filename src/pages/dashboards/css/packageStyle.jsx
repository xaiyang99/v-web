import { Box, Switch, TextareaAutosize, styled } from "@mui/material";
import { HuePicker } from "react-color";

export const StyledTextarea = styled(TextareaAutosize)`
  width: 100%;
  font-family:
    IBM Plex Sans,
    sans-serif;
  font-size: 0.875rem;
  font-weight: 300;
  line-height: 1.5;
  padding: 12px;
  border-radius: 5px 5px 0 5px;
  // firefox
  &:focus-visible {
    outline: 0;
  }
`;

export const AntSwitch = styled(Switch)(({ theme }) => ({
  width: 28,
  height: 18,
  padding: 0,
  display: "flex",
  "&:active": {
    "& .MuiSwitch-thumb": {
      width: 15,
    },
    "& .MuiSwitch-switchBase.Mui-checked": {
      transform: "translateX(9px)",
    },
  },
  "& .MuiSwitch-switchBase": {
    padding: 2,
    "&.Mui-checked": {
      transform: "translateX(12px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        opacity: 1,
      },
    },
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "0 2px 3px 0 rgb(0 35 11 / 20%)",
    width: 13,
    height: 13.5,
    borderRadius: 6,
    transition: theme.transitions.create(["width"], {
      duration: 200,
    }),
  },
  "& .MuiSwitch-track": {
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,.35)"
        : "rgba(0,0,0,.25)",
    boxSizing: "border-box",
  },
}));

export const ColorPickerWrapper = styled(Box)({
  position: "relative",
  // flexGrow: 0,

  h2: {
    fontSize: "17px",
    color: "#565656",

    span: {
      marginLeft: "8px",
      fontSize: "13px",
    },
  },
});

export const HuePickerStyled = styled(HuePicker)({
  ".hue-vertical": {
    div: {
      div: {
        transform: "none !important",
      },
    },

    borderRadius: 5,
  },
});

export const HuePickerListContainer = styled(Box)({
  marginLeft: 10,
  border: "1px solid #ddd",
  width: 100,
  height: "fit-content",
  borderRadius: 5,
});

export const HuePickerHeaderColor = styled(Box)({
  height: 60,
  borderTopLeftRadius: 5,
  borderTopRightRadius: 5,
});

export const HuePickerContent = styled(Box)({
  padding: "14px 20px",
});

export const HueValueContainer = styled("div")({
  display: "flex",
  alignItems: "center",
  gap: "1em",
});

export const HueKey = styled("h4")({
  fontSize: 12,
  fontWeight: 700,
  color: "#9A9A9C",
  margin: 0,
});
export const HueValue = styled("h4")({
  fontSize: 12,
  fontWeight: 700,
  color: "black",
  margin: 0,
});

export const HeaderColorPicker = styled(Box)({
  marginTop: "0.3rem",
  marginBottom: "1.1rem",

  display: "flex",
  alignItems: "center",
  width: "100%",

  h4: {
    fontSize: "0.92rem",

    strong: {
      fontWeight: 700,
      color: "black",
    },
  },
});

export const ColorAbsolute = styled(Box)({
  position: "absolute",
  height: "100%",
  top: "0",
  right: "58px",
  zIndex: 99,
  transition: "all 0.3s ease",
});

export const ColorPickerCircle = styled(Box)({
  width: "55px",
  height: "22px",
  borderRadius: "4px",
  backgroundColor: "#dddddd",
  cursor: "pointer",
});

export const ColorPickerContainer = styled(Box)({
  display: "flex",
  gap: "1.4rem",
});
