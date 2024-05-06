import CampaignIcon from "@mui/icons-material/Campaign";
import HelpIcon from "@mui/icons-material/Help";
import HelpCenterIcon from "@mui/icons-material/HelpCenter";
import BiPhone from "@mui/icons-material/PhonelinkSetup";
import {
  BarChart,
  Calendar,
  CreditCard,
  FileText,
  Home,
  MessageCircle,
  MessageSquare,
  Package,
  Settings,
  Sliders,
  User,
  Users,
} from "react-feather";
import { BiCast, BiEnvelope } from "react-icons/bi";
import { RiCoupon3Line } from "react-icons/ri";
import { TbSpeakerphone } from "react-icons/tb";

const pagesSection = [
  {
    href: "/dashboard/default",
    icon: Home,
    title: "Dashboard",
  },
  {
    href: "/dashboard/statistic",
    icon: BarChart,
    title: "Statistics",
    children: [
      {
        href: "/dashboard/statistic/general",
        title: "General",
      },
      {
        href: "/dashboard/statistic/purchases",
        title: "Purchases",
      },
      {
        href: "/dashboard/statistic/authentication",
        title: "Authentication",
      },
      {
        href: "/dashboard/statistic/upload/download",
        title: "Upload & download",
      },
    ],
  },
  {
    icon: Calendar,
    title: "Finance",
    children: [
      {
        href: "/dashboard/incomes",
        title: "Income",
      },
      {
        href: "/",
        title: "Expense",
      },
      {
        href: "/dashboard/e-invoices",
        title: "E-Invoice",
      },
    ],
  },
  {
    href: "/dashboard/payments",
    icon: CreditCard,
    title: "Payment",
  },
  {
    href: "/dashboard/admin-feedback",
    icon: MessageSquare,
    title: "Feedback",
  },
  {
    href: "/dashboard/manage-files",
    icon: FileText,
    title: "Files",
  },
  {
    href: "/pages",
    icon: Package,
    title: "package",
    children: [
      {
        href: "/dashboard/feature_packages",
        title: "FeaturePackage",
      },
      {
        href: "/dashboard/package_manage",
        title: "Manage Package",
      },
    ],
  },
  {
    href: "/dashboard/customer_messages_landingpage",
    icon: MessageCircle,
    title: "Contact customer",
  },
  {
    icon: Users,
    href: "/dashboard/user",
    title: "Customer",
  },
  {
    icon: User,
    title: "Staff",
    href: "/dashboard/staff",

    children: [
      {
        href: "/dashboard/manage-staffs",
        title: "Manage Staffs",
      },
      {
        href: "/dashboard/manage-roles",
        title: "Manage Roles",
      },
    ],
  },
  {
    icon: CampaignIcon,
    title: "Advertisement",
    children: [
      {
        href: "/dashboard/advertising",
        title: "Advertising",
      },
      {
        href: "/dashboard/company",
        title: "Company",
      },
    ],
  },
  {
    href: "/dashboard/feature",
    icon: Sliders,
    title: "Features",
  },
  {
    href: "/dashboard/faq",
    icon: HelpIcon,
    title: "FAQ",
  },
  {
    href: "/dashboard/help",
    icon: HelpCenterIcon,
    title: "Help",
  },
  {
    href: "/dashboard/announcement",
    icon: TbSpeakerphone,
    title: "Announcements",
  },
  {
    href: "/dashboard/broadcast",
    icon: BiCast,
    title: "Broadcast",
  },
  {
    href: "/dashboard/service-email",
    icon: BiEnvelope,
    title: "Service email",
  },
  {
    href: "/dashboard/ticket",
    icon: BiPhone,
    title: "Support ticket",
  },
  {
    href: "/dashboard/coupon",
    icon: RiCoupon3Line,
    title: "Coupon",
  },
  {
    // href: "/auth",
    icon: Settings,
    title: "Site Configuration",
    children: [
      {
        href: "/dashboard/general",
        title: "General",
      },
      {
        href: "/dashboard/user-setting",
        title: "User",
      },
      {
        href: "/dashboard/security",
        title: "Security",
      },
      {
        href: "/dashboard/auth-setting",
        title: "Auth",
      },
      {
        href: "/dashboard/payment-setting",
        title: "Payment",
      },
      {
        href: "/dashboard/point-setting",
        title: "Point",
      },
      {
        href: "/dashboard/upload-setting",
        title: "Upload",
      },
      {
        href: "/dashboard/download-setting",
        title: "Download",
      },
      {
        href: "/dashboard/seo",
        title: "SEO",
      },
    ],
  },
];

const navItems = [
  {
    title: "",
    pages: pagesSection,
  },
];

export default navItems;
