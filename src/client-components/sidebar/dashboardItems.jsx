import { AiOutlineCloud } from "react-icons/ai";
import { BiTime } from "react-icons/bi";
import { BsPinAngleFill, BsTrash3 } from "react-icons/bs";
import { FiFile } from "react-icons/fi";
import { HiOutlineShare } from "react-icons/hi";
import { MdOutlineFavoriteBorder } from "react-icons/md";
import { TbDashboard } from "react-icons/tb";

const dashboard = [
  {
    href: "/dashboard",
    icon: TbDashboard,
    title: "Dashboard",
  },
];

const myCloud = [
  {
    href: "/my-cloud",
    icon: AiOutlineCloud,
    title: "My Cloud",
    pin: [
      {
        icon: BsPinAngleFill,
        title: "folder",
      },
      {
        icon: BsPinAngleFill,
        title: "folder1",
      },
    ],
  },
];

// const myFolders = [
//   {
//     href: "/my-folder",
//     icon: FaRegFolderOpen,
//     title: "My folders",
//   },
// ];

const shareWithMe = [
  {
    href: "/share-with-me",
    icon: HiOutlineShare,
    title: "Share with me",
  },
];

const recent = [
  {
    href: "/recent",
    icon: BiTime,
    title: "Recent",
  },
];

const myFavourite = [
  { href: "/favourite", icon: MdOutlineFavoriteBorder, title: "Favourite" },
];

const myFileDrop = [{ href: "/file-drop", icon: FiFile, title: "File Drop" }];

const trash = [
  {
    href: "/trash",
    icon: BsTrash3,
    title: "Trash",
  },
];

const navItems = [
  {
    title: "",
    pages: dashboard,
  },
  {
    title: "",
    pages: myCloud,
  },
  {
    title: "",
    pages: shareWithMe,
  },
  // {
  //   title: "",
  //   pages: myTicket,
  // },
  {
    title: "",
    pages: recent,
  },
  {
    title: "",
    pages: myFavourite,
  },
  {
    title: "",
    pages: myFileDrop,
  },
  {
    title: "",
    pages: trash,
  },
];

export default navItems;
