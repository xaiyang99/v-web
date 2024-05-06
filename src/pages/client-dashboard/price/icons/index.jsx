import { ChevronRight } from "@mui/icons-material";
import { ReactComponent as Cart } from "./Cart.svg";
import { ReactComponent as Address } from "./Address.svg";
import { ReactComponent as Payment } from "./Payment.svg";
import { ReactComponent as Confirmation } from "./Confirmation.svg";
import { MdOutlineBookmarks } from "react-icons/md";
import { FiUpload } from "react-icons/fi";
import { BiTimeFive } from "react-icons/bi";
import { FaTimes } from "react-icons/fa";

export const ChevronRightIcon = (props) => {
  return <ChevronRight {...props} />;
};

export const CartIcon = (props) => {
  return (
    <Cart
      {...props}
      style={{
        "--payment-cart-color": props.style?.color || "#4B465C",
      }}
    />
  );
};

export const AddressIcon = (props) => {
  return (
    <Address
      {...props}
      style={{
        "--payment-address-color": props.style?.color || "#4B465C",
      }}
    />
  );
};

export const PaymentIcon = (props) => {
  return (
    <Payment
      {...props}
      style={{
        ...props.style,
        "--payment-color": props.style?.color || "#4B465C",
      }}
    />
  );
};

export const ConfirmationIcon = (props) => {
  return (
    <Confirmation
      {...props}
      style={{
        ...props.style,
        "--payment-confirmation-color": props.style?.color || "#4B465C",
      }}
    />
  );
};

export const MdOutlineBookmarksIcon = (props) => {
  return <MdOutlineBookmarks {...props} />;
};

export const FiUploadIcon = (props) => {
  return <FiUpload {...props} />;
};

export const BiTimeFiveIcon = (props) => {
  return <BiTimeFive {...props} />;
};

export const FaTimesIcon = (props) => {
  return <FaTimes {...props} />;
};
