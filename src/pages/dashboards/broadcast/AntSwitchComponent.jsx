import { Box, FormGroup, Switch, Typography, styled } from "@mui/material";

const AntSwitch = styled(Switch)(({ theme }) => ({
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

function AntSwitchComponent(props) {
  const { checked, setChecked } = props.props;

  return (
    <div>
      <FormGroup>
        <Box sx={{ display: "flex", justifyContent: "start" }}>
          <AntSwitch
            inputProps={{ "aria-label": "controlled" }}
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
          />
          <Box sx={{ display: "block", mt: -2, ml: 3 }}>
            <Typography variant="subtitle2">{props.title}</Typography>
            <Typography variant="body2" sx={{ fontSize: "12px" }}>
              {props.desc}
            </Typography>
          </Box>
        </Box>
      </FormGroup>
    </div>
  );
}

export default AntSwitchComponent;
