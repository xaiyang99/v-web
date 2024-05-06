import { AiOutlineMail } from "react-icons/ai";
import { BiDotsVerticalRounded, BiEdit } from "react-icons/bi";
import { BsLine, BsSend } from "react-icons/bs";
import { FaTimes, FaWhatsapp } from "react-icons/fa";
import { FcGlobe } from "react-icons/fc";
import { FiUserCheck, FiUserX } from "react-icons/fi";
import { HiOutlineTrash } from "react-icons/hi";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { LuLayoutList } from "react-icons/lu";
import { PiFileCsvLight, PiQrCode } from "react-icons/pi";
import {
  TbScreenShare as IconTbScreenShare,
  TbEye,
  TbPrinter,
  TbSlash,
  TbTrash,
  TbTrashOff,
} from "react-icons/tb";
import { ReactComponent as Amex } from "./svg/amex.svg";
import circleCheck from "./svg/circle-check.svg";
import clock from "./svg/clock.svg";
import crown from "./svg/crown.svg";
import timeOut from "./svg/time-out.svg";
import currencyDollar from "./svg/currency-dollar.svg";
import diamond from "./svg/diamond.svg";
import { ReactComponent as Diners } from "./svg/diners.svg";
import { ReactComponent as Female } from "./svg/female.svg";
import { ReactComponent as IconFolderEmpty } from "./svg/folderEmpty.svg";
import { ReactComponent as IconFolderFill } from "./svg/folderFill.svg";
import { ReactComponent as Income } from "./svg/income.svg";
import { ReactComponent as Invoice } from "./svg/invoice.svg";
import { ReactComponent as Jcb } from "./svg/jcb.svg";
import { ReactComponent as Male } from "./svg/male.svg";
import { ReactComponent as Mastercard } from "./svg/mastercard.svg";
import { ReactComponent as AngleDown } from "./svg/path.svg";
import { ReactComponent as Receipt } from "./svg/receipt.svg";
import { ReactComponent as Setting } from "./svg/settings.svg";
import tag from "./svg/tag.svg";
import ticket from "./svg/ticket.svg";
import { ReactComponent as Trash2 } from "./svg/trash2.svg";
import { ReactComponent as Visa } from "./svg/visa.svg";

export const LuLayoutListIcon = (props) => {
  return <LuLayoutList {...props} />;
};

export const ClockIcon = (props) => {
  return <img src={clock} {...props} />;
};

export const CircleCheckIcon = (props) => {
  return <img src={circleCheck} {...props} />;
};

export const TicketIcon = (props) => {
  return <img src={ticket} {...props} />;
};

export const TagIcon = (props) => {
  return <img src={tag} {...props} />;
};

export const CrownIcon = (props) => {
  return <img src={crown} {...props} />;
};

export const TimeOutIcon = (props) => {
  return <img src={timeOut} {...props} />;
};

export const DiamondIcon = (props) => {
  return <img src={diamond} {...props} />;
};

export const CurrencyDollarIcon = (props) => {
  return <img src={currencyDollar} {...props} />;
};

export const FolderFillIcon = (props) => {
  return <IconFolderFill {...props} />;
};

export const FcGlobeIcon = (props) => {
  return <FcGlobe {...props} />;
};

export const IoIosArrowDownIcon = (props) => {
  return <IoIosArrowDown {...props} />;
};

export const IoIosArrowUpIcon = (props) => {
  return <IoIosArrowUp {...props} />;
};

export const FemaleIcon = (props) => {
  return <Female {...props} />;
};

export const MaleIcon = (props) => {
  return <Male {...props} />;
};

export const MastercardIcon = (props) => {
  return <Mastercard {...props} />;
};

export const VisaIcon = (props) => {
  return <Visa {...props} />;
};
export const AmexIcon = (props) => {
  return <Amex {...props} />;
};

export const JcbIcon = (props) => {
  return <Jcb {...props} />;
};
export const DinersIcon = (props) => {
  return <Diners {...props} />;
};

export const FolderEmptyIcon = (props) => {
  return <IconFolderEmpty {...props} />;
};

export const TbScreenShare = (props) => {
  return <IconTbScreenShare {...props} />;
};

export const Trash = (props) => {
  return <HiOutlineTrash {...props} />;
};

export const TrashIcon = (props) => {
  return <Trash2 {...props} />;
};

export const AngleDownIcon = (props) => {
  return <AngleDown {...props} />;
};

export const Edit = (props) => {
  return <BiEdit {...props} />;
};

export const Eye = (props) => {
  return <TbEye {...props} />;
};

export const SettingIcon = (props) => {
  return <Setting {...props} />;
};

export const ForeSlash = (props) => {
  return <TbSlash {...props} />;
};

export const UserCheck = (props) => {
  return <FiUserCheck {...props} />;
};

export const UserX = (props) => {
  return <FiUserX {...props} />;
};

export const TbTrashOffIcon = (props) => {
  return <TbTrashOff {...props} />;
};

export const TbTrashIcon = (props) => {
  return <TbTrash {...props} />;
};

export const InvoiceIcon = (props) => {
  return <Invoice {...props} />;
};

export const ReceiptIcon = (props) => {
  return <Receipt {...props} />;
};

export const FaTimesIcon = (props) => {
  return <FaTimes {...props} />;
};

export const TbPrintIcon = (props) => {
  return <TbPrinter {...props} />;
};

export const PiFileCsvLightIcon = (props) => {
  return <PiFileCsvLight {...props} />;
};
export const PiQr = (props) => {
  return <PiQrCode {...props} />;
};
export const DotAction = (props) => {
  return <BiDotsVerticalRounded {...props} />;
};
export const Send = (props) => {
  return <BsSend {...props} />;
};

export const Mail = (props) => {
  return <AiOutlineMail {...props} />;
};
export const WhatsApp = (props) => {
  return <FaWhatsapp {...props} />;
};
export const Line = (props) => {
  return <BsLine {...props} />;
};

export const IncomeIcon = (props) => {
  return (
    <Income
      {...{
        style: {
          "--income-icon": "grey",
        },
        ...props,
      }}
    />
  );
};
