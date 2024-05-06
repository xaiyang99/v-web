//mui component and style
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { styled as muiStyled } from "@mui/system";
import * as Icon from "../icons/icons";
import NormalButton from "./NormalButton";

const DialogV1Container = muiStyled("div")({
  position: "relative",
});
const DialogV1Content = muiStyled("div")({
  display: "flex",
  flexDirection: "column",
  overflowY: "auto",
});

const DialogV1 = (props) => {
  return (
    <DialogV1Container>
      <Dialog
        open={props?.isOpen}
        PaperProps={{
          id: "dialog-v1",
          sx: {
            overflowY: "auto",
          },
          ...(props.PaperProps || {}),
        }}
        fullWidth={true}
        {...{
          ...props.dialogProps,
          sx: {
            // zIndex: 9999999999,
            zIndex: { ...(props?.dialogProps?.zIndex || 9999999999) },
            ...(props.dialogProps?.sx || {}),
          },
          PaperProps: {
            ...(props.dialogProps?.PaperProps || {}),
          },
          slotProps: {
            ...(props.dialogProps?.slotProps || {}),
          },
        }}
        onClose={() => props.onClose()}
        /* keepMounted={true} */
      >
        <DialogV1Content>
          {props.customButton || props.disableDefaultButton ? (
            props.customButton
          ) : (
            <NormalButton
              onClick={() => props.onClose()}
              sx={{
                position: "absolute",
                width: "initial",
                height: "initial",
                padding: (theme) => theme.spacing(1.5),
                boxShadow: (theme) => theme.baseShadow.primary,
                right: 0,
                transform: "translate(30%, -30%)",
                backgroundColor: "white !important",
                borderRadius: (theme) => theme.spacing(1),
                color: "rgba(0, 0, 0, 0.3)",
              }}
            >
              <Icon.FaTimesIcon />
            </NormalButton>
          )}

          {props.titleContent && (
            <DialogTitle>{props.titleContent}</DialogTitle>
          )}
          <DialogContent {...props.dialogContentProps}>
            {props.children}
          </DialogContent>
        </DialogV1Content>
      </Dialog>
    </DialogV1Container>
  );
};

export default DialogV1;
