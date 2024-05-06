import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import { Box, CssBaseline, Paper as MuiPaper } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { spacing } from "@mui/system";

import GlobalStyle from "../components/GlobalStyle";
import Navbar from "../components/navbar/Navbar";
// import dashboardItems from "../components/sidebar/dashboardItems";
import Sidebar from "../components/sidebar/Sidebar";
// import Footer from "../components/Footer";
import { useTranslation } from "react-i18next";
import Settings from "../components/Settings";

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
  Settings as MUISetting,
  MessageCircle,
  MessageSquare,
  Package,
  Sliders,
  User,
  Users,
} from "react-feather";
import { BiCast, BiEnvelope } from "react-icons/bi";
import { RiCoupon3Line } from "react-icons/ri";
import { TbSpeakerphone } from "react-icons/tb";
import useAuth from "../hooks/useAuth";

const drawerWidth = 258;

const Root = styled.div`
  display: flex;
  min-height: 100vh;
`;

const Drawer = styled.div`
  ${(props) => props.theme.breakpoints.up("md")} {
    width: ${drawerWidth}px;
    flex-shrink: 0;
  }
`;

const AppContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 100%;
`;

const Paper = styled(MuiPaper)(spacing);

const MainContent = styled(Paper)`
  flex: 1;
  background: ${(props) => props.theme.palette.background.default};

  @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
    flex: none;
  }

  .MuiPaper-root .MuiPaper-root {
    box-shadow: none;
  }
`;

const Dashboard = ({ children }) => {
  const router = useLocation();

  const { permission } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t } = useTranslation();
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  // Close mobile menu when navigation occurs
  useEffect(() => {
    setMobileOpen(false);
  }, [router.pathname]);

  const theme = useTheme();
  const isLgUp = useMediaQuery(theme.breakpoints.up("lg"));

  const filteredNavItems =
    permission?.length > 0 &&
    permission
      .filter((permission) => {
        return permission.name === "view";
      })
      .map((permission) => {
        return `${permission.groupName}_${permission.name}`;
      });

  const pagesSection = [
    {
      href: "/dashboard/default",
      icon: Home,
      title: t("_dashboard_menu"),
      value: "dashboard_view",
      permission: true,
    },
    {
      href: "/dashboard/statistic",
      icon: BarChart,
      title: t("_statistic_menu"),
      value: "statistic_view",
      permission: true,
      children: [
        {
          href: "/dashboard/statistic/general",
          title: t("_statistic_general_menu"),
          value: "statistic_view",
          permission: false,
        },
        {
          href: "/dashboard/statistic/purchases",
          title: t("_statistic_purchase_menu"),
          value: "statistic_view",
          permission: false,
        },
        {
          href: "/dashboard/statistic/authentication",
          title: t("_statistic_authentication_menu"),
          value: "statistic_view",
          permission: false,
        },
        {
          href: "/dashboard/statistic/upload/download",
          title: t("_statistic_upload_download_menu"),
          value: "statistic_view",
          permission: false,
        },
      ],
    },
    {
      icon: Calendar,
      title: t("_finance_menu"),
      value: "finance_view",
      permission: true,
      children: [
        {
          href: "/dashboard/incomes",
          title: t("_finance_income_menu"),
          value: "income_view",
          permission: true,
        },
        // {
        //   href: "/",
        //   title: t("_finance_expense_menu"),
        // },
        {
          href: "/dashboard/e-invoices",
          title: t("_finance_e_invoice_menu"),
          value: "invoice_view",
          permission: true,
        },
      ],
    },
    {
      href: "/dashboard/payments",
      icon: CreditCard,
      title: t("_payment_menu"),
      value: "payment_view",
      permission: true,
    },
    {
      href: "/dashboard/admin-feedback",
      icon: MessageSquare,
      title: t("_feedback_menu"),
      value: "feedback_view",
      permission: true,
    },
    {
      href: "/dashboard/manage-files",
      icon: FileText,
      title: t("_files_menu"),
      value: "file_view",
      permission: true,
    },
    {
      href: "/dashboard/package_manage",
      icon: Package,
      title: t("_package_menu"),
      value: "package_view",
      permission: true,
    },
    {
      href: "/dashboard/customer_messages_landingpage",
      icon: MessageCircle,
      title: t("_contact_customer_menu"),
      value: "customer_view",
      permission: true,
    },
    {
      icon: Users,
      href: "/dashboard/user",
      title: t("_customer_menu"),
      value: "customer_view",
      permission: true,
    },
    {
      icon: User,
      title: t("_staff_menu"),
      href: "/dashboard/staff",
      value: "role_view",
      permission: true,
      children: [
        {
          href: "/dashboard/manage-staffs",
          title: t("_staff_manage_staff"),
          value: "role_view",
          permission: true,
        },
        {
          href: "/dashboard/manage-roles",
          title: t("_staff_manage_role"),
          value: "role_view",
          permission: true,
        },
      ],
    },
    {
      icon: CampaignIcon,
      title: t("_advertisement_menu"),
      value: "advertisement_view",
      permission: true,
      children: [
        {
          href: "/dashboard/advertising",
          title: t("_advertisement_ads_menu"),
          value: "advertisement_view",
          permission: true,
        },
        {
          href: "/dashboard/company",
          title: t("_advertisement_company"),
          value: "company_view",
          permission: true,
        },
      ],
    },
    {
      href: "/dashboard/feature",
      icon: Sliders,
      title: t("_feature_menu"),
      value: "feature_view",
      permission: true,
    },
    {
      href: "/dashboard/faq",
      icon: HelpIcon,
      title: t("_faq_menu"),
      value: "faq_view",
      permission: true,
    },
    {
      href: "/dashboard/help",
      icon: HelpCenterIcon,
      title: t("_help_menu"),
      value: "help_view",
      permission: true,
    },
    {
      href: "/dashboard/announcement",
      icon: TbSpeakerphone,
      title: t("_announcement_menu"),
      value: "announcement_view",
      permission: true,
    },
    {
      href: "/dashboard/broadcast",
      icon: BiCast,
      title: t("_broadcast_menu"),
      value: "broadcast_view",
      permission: true,
    },
    {
      href: "/dashboard/service-email",
      icon: BiEnvelope,
      title: "Service email",
      value: "service_email_view",
      permission: true,
    },
    {
      href: "/dashboard/ticket",
      icon: BiPhone,
      title: t("_support_ticket_menu"),
      value: "ticket_view",
      permission: true,
    },
    {
      href: "/dashboard/coupon",
      icon: RiCoupon3Line,
      title: t("_coupon_mune"),
      value: "coupon_view",
      permission: true,
    },
    {
      // href: "/auth",
      icon: MUISetting,
      title: t("_setting_configuration"),
      value: "setting_view",
      permission: true,
      children: [
        {
          href: "/dashboard/general",
          title: t("_setting_general"),
          value: "general_view",
          permission: true,
        },
        {
          href: "/dashboard/user-setting",
          title: t("_setting_user"),
          value: "user_view",
          permission: true,
        },
        {
          href: "/dashboard/security",
          title: t("_setting_security"),
          value: "security_view",
          permission: true,
        },
        {
          href: "/dashboard/auth-setting",
          title: t("_setting_auth"),
          value: "auth_view",
          permission: true,
        },
        {
          href: "/dashboard/payment-setting",
          title: t("_setting_payment"),
          value: "payment_view",
          permission: true,
        },
        {
          href: "/dashboard/point-setting",
          title: t("_setting_point"),
          value: "point_view",
          permission: true,
        },
        {
          href: "/dashboard/upload-setting",
          title: t("_setting_upload"),
          value: "upload_view",
          permission: true,
        },
        {
          href: "/dashboard/secret-setting",
          title: t("_setting_secret"),
          value: "upload_view",
          permission: true,
        },
        {
          href: "/dashboard/download-setting",
          title: t("_setting_download"),
          value: "download_view",
          permission: true,
        },
        {
          href: "/dashboard/seo",
          title: t("_setting_seo"),
          value: "seo_view",
          permission: true,
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

  const isPermissionIncluded = pagesSection?.some((page) => {
    return (
      filteredNavItems?.length > 0 && filteredNavItems?.includes(page.value)
    );
  });

  const updatePermissions = (page, filteredNavItems) => {
    if (page.children?.length > 0) {
      page.children.forEach((child) => {
        updatePermissions(child, filteredNavItems);
      });
    }

    if (filteredNavItems?.includes(page.value)) {
      page.permission = true;
    }
  };

  if (isPermissionIncluded) {
    pagesSection.forEach((page) => {
      updatePermissions(page, filteredNavItems);
    });
  }

  return (
    <Root>
      <CssBaseline />
      <GlobalStyle />
      <Drawer>
        <Box sx={{ display: { xs: "block", lg: "none" } }}>
          <Sidebar
            PaperProps={{ style: { width: drawerWidth } }}
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            items={navItems}
          />
        </Box>
        <Box sx={{ display: { xs: "none", md: "block" } }}>
          <Sidebar
            PaperProps={{ style: { width: drawerWidth } }}
            items={navItems}
          />
        </Box>
      </Drawer>
      <AppContent>
        <Navbar onDrawerToggle={handleDrawerToggle} />
        <MainContent
          sx={{
            padding: `0 ${isLgUp ? "30px" : "20px"}`,
            marginTop: (theme) => `${theme.spacing(3)}`,
            marginBottom: (theme) => `${theme.spacing(3)}`,
          }}
        >
          {children}
          <Outlet />
        </MainContent>
      </AppContent>
      <Settings />
    </Root>
  );
};

export default Dashboard;
