import { Box, Divider, Stack, Switch, Typography } from "@mui/material";
import { styled as muiStyled } from "@mui/system";
import { useState } from "react";
import DialogV1 from "../../../components/DialogV1";
import NormalButton from "../../../components/NormalButton";

const DialogFormBoby = muiStyled("div")(({ theme }) => ({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  position: "relative",
  rowGap: theme.spacing(5),
}));

const AntSwitch = muiStyled(Switch)(({ theme }) => ({
  width: 43,
  height: 21,
  padding: 0,
  display: "flex",
  "&:active": {
    "& .MuiSwitch-thumb": {
      width: 15 + 10,
    },
    "& .MuiSwitch-switchBase.Mui-checked": {
      transform: "translateX(9px)",
    },
  },
  "& .MuiSwitch-switchBase": {
    padding: 2,
    "&.Mui-checked": {
      transform: "translateX(22px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        opacity: 1,
      },
    },
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "0 2px 4px 0 rgb(0 35 11 / 20%)",
    width: 17,
    height: 17,
    borderRadius: 10,
    transition: theme.transitions.create(["width"], {
      duration: 200,
    }),
  },
  "& .MuiSwitch-track": {
    borderRadius: 20,
    opacity: 1,
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,.35)"
        : "rgba(0,0,0,.25)",
    boxSizing: "border-box",
  },
}));

const DialogPricingCondition = (props) => {
  const [isAccepted, setIsAccepted] = useState(false);
  return (
    <DialogV1
      isOpen={props.isOpen}
      // onClose={(_) => {
      onClose={() => {
        props.onClose();
      }}
      dialogProps={{
        sx: {
          zIndex: 9999999999,
        },
        PaperProps: {
          sx: {
            overflowY: "initial",
            maxWidth: props.width || "600px",
          },
        },
      }}
      dialogContentProps={{
        sx: {
          borderRadius: "6px",
          padding: (theme) => `${theme.spacing(8)} ${theme.spacing(15)}`,
        },
      }}
    >
      <DialogFormBoby className="terms-and-conditions">
        <Typography
          className="title"
          variant="h3"
          sx={{
            width: "100%",
            display: "flex",
            fontWeight: "bold",
            justifyContent: "center",
            color: (theme) => theme.palette.primaryTheme.brown(),
          }}
        >
          Terms and Conditions
        </Typography>
        <Typography
          className="context"
          component="div"
          sx={{
            width: "100%",
            fontSize: "1rem",
            display: "flex",
            flexDirection: "column",
            rowGap: 4,
            color: (theme) => theme.palette.primaryTheme.brown(),
          }}
        >
          <div>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ad eveniet
            vitae sapiente error quisquam doloribus, culpa excepturi commodi nam
            minima dignissimos illo itaque assumenda suscipit alias provident
            aut quaerat earum.
          </div>
          <div>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ad eveniet
            vitae sapiente error quisquam doloribus, culpa excepturi commodi nam
            minima dignissimos illo itaque assumenda suscipit alias provident
            aut quaerat earum.
          </div>
          <div>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ad eveniet
            vitae sapiente error quisquam doloribus, culpa excepturi commodi nam
            minima dignissimos illo itaque assumenda suscipit alias provident
            aut quaerat earum.
          </div>
        </Typography>
        <Typography component="div">
          <Stack direction="row" spacing={3} alignItems="center">
            <AntSwitch
              checked={isAccepted}
              // onChange={(_) => setIsAccepted(!isAccepted)}
              onChange={() => setIsAccepted(!isAccepted)}
              inputProps={{ "aria-label": "ant design" }}
            />
            <Typography component="div">Accept</Typography>
          </Stack>
        </Typography>
        <Divider />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            columnGap: (theme) => theme.spacing(3),
          }}
        >
          <NormalButton
            type="submit"
            sx={{
              width: "auto",
              padding: (theme) => `${theme.spacing(2)} ${theme.spacing(4)}`,
              borderRadius: (theme) => theme.spacing(1),
              backgroundColor: (theme) => theme.palette.primaryTheme.main,
              color: "white !important",
              ...(!isAccepted && {
                opacity: 0.5,
                cursor: "default",
              }),
            }}
            {...(isAccepted && {
              onClick: () => props.onConfirm(),
            })}
          >
            Confirm
          </NormalButton>
          <NormalButton
            type="button"
            onClick={() => props.onClose()}
            sx={{
              width: "auto",
              padding: (theme) => `${theme.spacing(2)} ${theme.spacing(4)}`,
              borderRadius: (theme) => theme.spacing(1),
              backgroundColor: "rgba(0,0,0,0.1)",
              color: "rgba(0,0,0,0.5)",
            }}
          >
            Cancel
          </NormalButton>
        </Box>
      </DialogFormBoby>
    </DialogV1>
  );
};

export default DialogPricingCondition;
