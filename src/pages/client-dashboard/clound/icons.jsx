import { ReactComponent as IconRecentEmpty } from "./icons/My cloud-empty.svg";
import { ReactComponent as IconMyfolerFull } from "./../../../icons/FolderIcon.svg";
import { ReactComponent as IconMyfolerEmpty } from "./../../../icons/FolderIcon-empty.svg";
import { ReactComponent as IconsFiles } from "./../../client-dashboard/clound/icons/Type_files_icon/Files.svg";
import { ReactComponent as IconImage } from "./../../client-dashboard/clound/icons/Type_files_icon/Image.svg";
import { ReactComponent as IconVideo } from "./../../client-dashboard/clound/icons/Type_files_icon/Video.svg";
import { ReactComponent as IconAdio } from "./../../client-dashboard/clound/icons/Type_files_icon/Audio.svg";
import { ReactComponent as IconText } from "./../../client-dashboard/clound/icons/Type_files_icon/Text.svg";
import { ReactComponent as IconOther } from "./../../client-dashboard/clound/icons/Type_files_icon/Other.svg";
import { ReactComponent as Icon_User_no_image } from "./../../client-dashboard/clound/icons/Icon_no_profile.svg";

export const MycloudEmpty = () => {
  return <IconRecentEmpty />;
};
export const MyfolderFull = () => {
  return <IconMyfolerFull />;
};
export const MyfolerEmpty = () => {
  return <IconMyfolerEmpty />;
};
export const Files = () => {
  return <IconsFiles />;
};
export const ImageIcon = () => {
  return <IconImage />;
};
export const VideoIcon = () => {
  return <IconVideo />;
};
export const AdioIcon = () => {
  return <IconAdio />;
};
export const TextIcon = () => {
  return <IconText />;
};
export const OtherIcon = () => {
  return <IconOther />;
};
export const UserNoImage = () => {
  return <Icon_User_no_image />;
};
