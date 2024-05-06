import { FaSearch } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { LuLayoutList } from "react-icons/lu";
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp,
} from "react-icons/md";
import {
  TbFileDownload,
  TbFileReport,
  TbFileSearch,
  TbFileSymlink,
} from "react-icons/tb";
import { ReactComponent as IconAdio } from "./../clound/icons/Type_files_icon/Audio.svg";
import { ReactComponent as IconsFiles } from "./../clound/icons/Type_files_icon/Files.svg";
import { ReactComponent as IconImage } from "./../clound/icons/Type_files_icon/Image.svg";
import { ReactComponent as IconOther } from "./../clound/icons/Type_files_icon/Other.svg";
import { ReactComponent as IconText } from "./../clound/icons/Type_files_icon/Text.svg";
import { ReactComponent as IconVideo } from "./../clound/icons/Type_files_icon/Video.svg";

export const LuLayoutListIcon = (props) => {
  return <LuLayoutList {...props} />;
};

export const IoIosArrowDownIcon = (props) => {
  return <IoIosArrowDown {...props} />;
};
export const MdOutlineKeyboardArrowDownIcon = (props) => {
  return <MdOutlineKeyboardArrowDown {...props} />;
};
export const MdOutlineKeyboardArrowUpIcon = (props) => {
  return <MdOutlineKeyboardArrowUp {...props} />;
};
export const ApplicationIcon = (props) => {
  return <IconsFiles {...props} />;
};

export const ImageIcon = (props) => {
  return <IconImage {...props} />;
};

export const VideoIcon = (props) => {
  return <IconVideo {...props} />;
};
export const AudioIcon = (props) => {
  return <IconAdio {...props} />;
};

export const TextIcon = (props) => {
  return <IconText {...props} />;
};

export const OthersIcon = (props) => {
  return <IconOther {...props} />;
};

export const TbFileReportIcon = (props) => {
  return <TbFileReport {...props} />;
};

export const TbFileSymlinkIcon = (props) => {
  return <TbFileSymlink {...props} />;
};

export const TbFileSearchIcon = (props) => {
  return <TbFileSearch {...props} />;
};

export const TbFileDownloadIcon = (props) => {
  return <TbFileDownload {...props} />;
};

export const FaSearchIcon = (props) => {
  return <FaSearch {...props} />;
};
