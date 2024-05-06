import { Box, createTheme } from "@mui/material";
import NormalButton from "../../../../components/NormalButton";
import * as Icon from "../../../../icons/icons";
import { THEMES } from "../../../../constants";

export default function useAction(props) {
  const theme = createTheme();
  const { data, event } = props;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        columnGap: (theme) => theme.spacing(2),
      }}
    >
      {props?.status === 1 && (
        <NormalButton
          onClick={() => event.handleEvent({ action: "open", data: data })}
        >
          <Icon.Eye
            size="18px"
            color={theme.name === THEMES.DARK ? "white" : "grey"}
          />
        </NormalButton>
      )}

      {props.status !== 3 && (
        <NormalButton
          onClick={() => {
            event.handleEvent({ action: "edit", data: data });
          }}
        >
          <Icon.Edit
            size="18px"
            color={theme.name === THEMES.DARK ? "white" : "grey"}
          />
        </NormalButton>
      )}
      {(props?.status === 2 || props?.status === 3) && (
        <NormalButton
          onClick={() => event.handleEvent({ action: "send", data: data })}
        >
          <Icon.Send
            size="18px"
            color={theme.name === THEMES.DARK ? "white" : "grey"}
          />
        </NormalButton>
      )}

      <NormalButton
        onClick={() => event.handleEvent({ action: "delete", data: data })}
      >
        <Icon.Trash
          size="18px"
          color={theme.name === THEMES.DARK ? "white" : "grey"}
        />
      </NormalButton>
    </Box>
  );
}
