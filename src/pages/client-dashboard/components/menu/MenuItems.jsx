import { BiLockOpen, BiWorld } from "react-icons/bi";
import { BsPinAngle } from "react-icons/bs";
import {
  FiDownload,
  FiEdit,
  FiEye,
  FiFile,
  FiLink,
  FiShare2,
  FiLock,
  FiFileText,
} from "react-icons/fi";
import { HiOutlineTrash } from "react-icons/hi";
import {
  MdOutlineDone,
  MdOutlineFavoriteBorder,
  MdOutlineRestore,
} from "react-icons/md";

import CloudDownloadOutlinedIcon from "@mui/icons-material/CloudDownloadOutlined";

const menuItems = [
  { icon: <FiEye />, title: "Details", action: "detail" },
  { icon: <FiShare2 />, title: "Share", action: "share", disabled: true },
  { icon: <FiLink />, title: "Get Link", action: "get link", disabled: true },
  { icon: <FiLock />, title: "Password", action: "password" },
  { icon: <FiEdit />, title: "Rename", action: "rename" },
  {
    icon: <MdOutlineFavoriteBorder />,
    title: "Favourite",
    action: "favourite",
  },

  {
    icon: <FiDownload />,
    title: "Download",
    action: "download",
    disabled: true,
  },
  { icon: <HiOutlineTrash />, title: "Move to trash", action: "delete" },
];

export const shareWithMeFolderMenuItems = [
  { icon: <FiShare2 />, title: "Share", action: "share", disabled: true },
  { icon: <FiLink />, title: "Get Link", action: "get link", disabled: true },
  { icon: <FiEdit />, title: "Rename", action: "rename" },
  {
    icon: <FiDownload />,
    title: "Download",
    action: "download",
    disabled: true,
  },
  { icon: <FiFile />, title: "File Drop", action: "filedrop" },
  { icon: <HiOutlineTrash />, title: "Delete", action: "delete" },
];

export const shareWithMeFileMenuItems = [
  { icon: <FiEye />, title: "Details", action: "detail" },
  { icon: <FiShare2 />, title: "Share", action: "share", disabled: true },
  { icon: <FiLink />, title: "Get Link", action: "get link", disabled: true },
  { icon: <FiEdit />, title: "Rename", action: "rename" },
  {
    icon: <FiDownload />,
    title: "Download",
    action: "download",
    disabled: true,
  },
  { icon: <HiOutlineTrash />, title: "Delete", action: "delete" },
];

export const fileDropMenuItems = [
  { icon: <FiEye />, title: "Details", action: "detail" },
  { icon: <FiEdit />, title: "Rename", action: "rename" },
  {
    icon: <FiDownload />,
    title: "Download",
    action: "download",
    disabled: true,
  },
  {
    icon: <CloudDownloadOutlinedIcon />,
    title: "Save to Cloud",
    action: "save_to_cloud",
    disabled: true,
  },
  { icon: <HiOutlineTrash />, title: "Delete", action: "delete" },
];

export const foldersFavoriteMenuItems = [
  { icon: <FiShare2 />, title: "Share", action: "share" },
  { icon: <FiLink />, title: "Get Link", action: "get link" },
  { icon: <FiEdit />, title: "Rename", action: "rename" },
  {
    icon: <BsPinAngle />,
    title: "Pin",
    action: "pin",
  },

  { icon: <FiDownload />, title: "Download", action: "download" },
  { icon: <HiOutlineTrash />, title: "Move to trash", action: "delete" },
];

export const trashMenuItems = [
  { icon: <MdOutlineRestore />, title: "Restore", action: "restore" },
  {
    icon: <HiOutlineTrash />,
    title: "Delete Forever",
    action: "delete forever",
  },
];

export const favouriteMenuItems = [
  // { icon: <FiEye />, title: "Details", action: "detail" },
  { icon: <FiShare2 />, title: "Share", action: "share", disabled: true },
  { icon: <FiLink />, title: "Get Link", action: "get link", disabled: true },
  { icon: <FiEdit />, title: "Rename", action: "rename" },
  { icon: <FiLock />, title: "Password", action: "password", disabled: true },
  {
    icon: <FiFileText />,
    title: "Export CSV",
    action: "export-csv",
    disabled: true,
  },
  {
    icon: <BsPinAngle />,
    title: "Pin",
    action: "pin",
  },
  {
    icon: <FiDownload />,
    title: "Download",
    action: "download",
    disabled: true,
  },
  { icon: <FiFile />, title: "File Drop", action: "filedrop" },
  { icon: <HiOutlineTrash />, title: "Remove to Trash", action: "delete" },
];

export const shortFavouriteMenuItems = [
  { icon: <FiShare2 />, title: "Share", action: "share", disabled: true },
  {
    icon: <FiDownload />,
    title: "Download",
    action: "download",
    disabled: true,
  },
  { icon: <FiEdit />, title: "Rename", action: "rename" },
];

export const shortMyCloudMenuItems = [
  { icon: <FiShare2 />, title: "Share", action: "share", disabled: true },
  {
    icon: <FiDownload />,
    title: "Download",
    action: "download",
    disabled: true,
  },
  { icon: <FiEdit />, title: "Rename", action: "rename" },
  {
    icon: <BsPinAngle />,
    title: "Pin",
    action: "pin",
  },
];

export const roleShareMenu = [
  {
    icon: <MdOutlineDone fill="#17766B" />,
    title: "Can view",
    action: "view",
  },
  {
    icon: <MdOutlineDone fill="#17766B" />,
    title: "Can edit",
    action: "edit",
  },
];

export const menuShareStatus = [
  { icon: <BiWorld />, title: "Public", action: "public" },
  {
    icon: <BiLockOpen />,
    title: "Private",
    action: "private",
  },
];

export const shortFileShareMenu = [
  { icon: <FiShare2 />, title: "Share", action: "share", disabled: true },
  {
    icon: <FiDownload />,
    title: "Download",
    action: "download",
    disabled: true,
  },
  { icon: <FiEdit />, title: "Rename", action: "rename" },
];

export default menuItems;
