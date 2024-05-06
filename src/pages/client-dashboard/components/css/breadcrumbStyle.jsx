import { styled } from "@mui/system";

export const BreadcrumbExtendFolderContainer = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  p: {
    height: "unset",
    fontSize: "1rem",
    fontWeight: "bold",
  },
  ".mui-title-and-switch": {
    alignItems: "center",
  },

  ".MuiBreadcrumbs-li": {
    fontSize: "1rem",
    fontWeight: "bold",
  },
}));
