import * as Icon from "../../../../icons/icons";
export const MenuUserItem = [
  {
    icon: <Icon.Eye size="20" />,
    title: "View",
    action: "preview",
  },
  {
    icon: <Icon.PiQr size="20" />,
    title: "Generate QRCode",
    action: "gen_qrcode",
    disabled: true,
  },
  { icon: <Icon.Edit size="20" />, title: "Edit", action: "edit" },
  {
    icon: <Icon.Trash size="20" />,
    title: "delete",
    action: "delete_single",
  },
];
