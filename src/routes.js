import async from "./components/Async";

// Layouts
import AuthLayout from "./layouts/Auth";
import ClientDashboardLayout from "./layouts/ClientDashboard";
import DashboardLayout from "./layouts/Dashboard";
import PresentationLayout from "./layouts/Presentation";

// Guards
import AuthGuard from "./components/guards/AuthGuard";
import ClientAuthGuard from "./components/guards/ClientAuthGuard";
import IsLoggedClientAuthGuard from "./components/guards/isLoggedClientAuthGuard";

// Auth components
import ForgotPassword from "./pages/auth/ForgotPassword";
import Page404 from "./pages/auth/Page404";
import Page500 from "./pages/auth/Page500";
import ResetPassword from "./pages/auth/ResetPassword";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";

import Login from "./pages/auth/Login";

// Landing
import Landing from "./pages/presentation/Landing";
import ContactUs from "./pages/presentation/Landing/contact-us";
import Feature from "./pages/presentation/Landing/feature";
import PrivacyPolicy from "./pages/presentation/Landing/privacy-policy";
import TermsCondition from "./pages/presentation/Landing/terms-conditions";
// import Blog from "./pages/presentation/Landing/blog";
import FeedBack from "./pages/presentation/Landing/feedback";
import FileDrop from "./pages/presentation/Landing/filedrop";
import FileDropDownload from "./pages/presentation/Landing/filedrop/fileDropDownload";

import { EventUploadTriggerProvider } from "./contexts/EventUploadTriggerContext";
import FolderProvider from "./contexts/FolderContext";
import { AuthProvider } from "./contexts/JWTContext";
import PackageCheckerProvider from "./contexts/PackageCheckerContext";
import SettingKeyProvider from "./contexts/SettingKeyContext";
import { MenuDropdownProvider } from "./pages/client-dashboard/components/menu/MenuDropdownProvider";
import ReplyTicket from "./pages/client-dashboard/replyTicket";
import SEOComponent from "./pages/dashboards/SEO";
import AuthSetting from "./pages/dashboards/authSetting";
import ChatMessage from "./pages/dashboards/chat-message";
import Company from "./pages/dashboards/company";
import ChatCustomerEmail from "./pages/dashboards/contactCustomerEmail";
import GmailApiExample from "./pages/dashboards/contactCustomerEmail/contactMessage";
import DownloadSetting from "./pages/dashboards/downloadSetting";
import FeaturePackage from "./pages/dashboards/fueturePackage";
import GeneralSetting from "./pages/dashboards/general";
import LanguageSetting from "./pages/dashboards/languageSetting";
import FileDownload from "./pages/dashboards/manageFile/downloadFile";
import CreatePackage from "./pages/dashboards/managePackage/AddPackage";
import ManagePackage from "./pages/dashboards/managePackage/ManagePackage";
import PaymentSetting from "./pages/dashboards/paymentSetting";
import PointSetting from "./pages/dashboards/pointSetting";
import Profile from "./pages/dashboards/profile/profile";
import AdminSetting from "./pages/dashboards/profile/setting";
import SecuritySetting from "./pages/dashboards/security";
import ServiceEmail from "./pages/dashboards/serviceEmail";
import Ticket from "./pages/dashboards/ticket";
import FileUploadSetting from "./pages/dashboards/uploadSetting";
import UserSetting from "./pages/dashboards/userSetting";
import Home from "./pages/presentation/Landing/home/Home";
import DownloadFile from "./pages/presentation/Landing/home/downloadFile";

// admin dashboared components
const Default = async(() => import("./pages/dashboards/dashboard"));
const AdminFeedback = async(() => import("./pages/dashboards/feedback"));
const Advertising = async(() => import("./pages/dashboards/advertising"));
const ManageFile = async(() => import("./pages/dashboards/manageFile"));
const Share = async(() => import("./pages/dashboards/share/Index"));
const User = async(() => import("./pages/dashboards/user/index"));
const AddUser = async(() => import("./pages/dashboards/user/AddUser"));
const Payment = async(() => import("./pages/dashboards/payment"));
const EInvoice = async(() => import("./pages/dashboards/eInvoice"));
const Income = async(() => import("./pages/dashboards/income"));
const AuthenticationStatistices = async(
  () => import("./pages/dashboards/statistics/authentication"),
);
const Purchases = async(() => import("./pages/dashboards/statistics/purchase"));
const UploadDdownload = async(
  () => import("./pages/dashboards/statistics/upload&download"),
);
const General = async(() => import("./pages/dashboards/statistics/general"));
const Staff = async(() => import("./pages/dashboards/staff"));

const ManageRole = async(
  () => import("./pages/dashboards/role&permission/ManageRole"),
);
const UserType = async(() => import("./pages/dashboards/userType"));
const Features = async(() => import("./pages/dashboards/features"));
const FAQ = async(() => import("./pages/dashboards/FAQ/Index"));
const HelpAdmin = async(() => import("./pages/dashboards/help"));
const Announcements = async(() => import("./pages/dashboards/announcement"));
const Broadcast = async(() => import("./pages/dashboards/broadcast"));
const Coupon = async(() => import("./pages/dashboards/coupon"));
const CouponDetail = async(
  () => import("./pages/dashboards/coupon/CouponDetail.jsx"),
);

// client dashboard components
const ClientDashbard = async(
  () => import("./pages/client-dashboard/dashboard"),
);
const Search = async(() => import("./pages/client-dashboard/search"));
const MyCloud = async(() => import("./pages/client-dashboard/clound"));
// const MyFolder = async(() => import("./pages/client-dashboard/folder"));
const MyTicket = async(() => import("./pages/client-dashboard/ticket"));
const NewTicket = async(() => import("./pages/client-dashboard/new-ticket"));
const ExtendMyFolder = async(
  () => import("./pages/client-dashboard/extendFolder/index.jsx"),
);
const SharedExtendMyFolder = async(
  () => import("./pages/client-dashboard/extendFolder/share.jsx"),
);
const Myfile = async(() => import("./pages/client-dashboard/file"));
const ShareWithMe = async(
  () => import("./pages/client-dashboard/share-with-me"),
);
const ExtendShare = async(
  () => import("./pages/client-dashboard/share-with-me/ExtendShare"),
);
const Recent = async(() => import("./pages/client-dashboard/recent"));
const Trash = async(() => import("./pages/client-dashboard/trash"));
const AccountInfo = async(
  () => import("./pages/client-dashboard/account-info"),
);
const Favourite = async(() => import("./pages/client-dashboard/favourite"));
const ClientFileDrop = async(
  () => import("./pages/client-dashboard/file-drop/index.jsx"),
);

const ClientFileDropDetail = async(
  () => import("./pages/client-dashboard/file-drop/detail.jsx"),
);

const SettingSecretKey = async(() => import("./pages/dashboards/secretKey"));

const FAQcomponent = async(() => import("./pages/client-dashboard/faq"));
const Helpcomponent = async(() => import("./pages/client-dashboard/help"));
const PriceComponent = async(() => import("./pages/client-dashboard/price"));
const PricingCheckoutComponent = async(
  () => import("./pages/client-dashboard/price/PricingCheckout.jsx"),
);

const FeedbackComponent = async(
  () => import("./pages/client-dashboard/feedback"),
);

const routes = [
  {
    element: <PresentationLayout />,
    children: [
      {
        path: "/",
        element: <Landing page={<Home />} />,
      },
      {
        path: "df",
        element: <Landing page={<DownloadFile />} />,
      },

      {
        path: "feature",
        element: <Feature />,
      },
      {
        path: "contact-us",
        element: <ContactUs />,
      },
      {
        path: "terms-conditions",
        element: <TermsCondition />,
      },
      {
        path: "privacy-policy",
        element: <PrivacyPolicy />,
      },
      {
        path: "feedback-page",
        element: <FeedBack />,
      },
      {
        path: "filedrop-page",
        element: <FileDrop />,
      },
      {
        path: "filedrop-download",
        element: <FileDropDownload />,
      },
    ],
  },
  {
    path: "",
    element: (
      <FolderProvider>
        <EventUploadTriggerProvider>
          <AuthProvider>
            <ClientAuthGuard>
              <SettingKeyProvider>
                <PackageCheckerProvider>
                  <MenuDropdownProvider>
                    <ClientDashboardLayout />
                  </MenuDropdownProvider>
                </PackageCheckerProvider>
              </SettingKeyProvider>
            </ClientAuthGuard>
          </AuthProvider>
        </EventUploadTriggerProvider>
      </FolderProvider>
    ),
    children: [
      {
        path: "dashboard",
        element: <ClientDashbard />,
      },
      {
        path: "search/:name",
        element: <Search />,
      },
      {
        path: "my-cloud",
        element: <MyCloud />,
      },
      {
        path: "support-ticket",
        element: <MyTicket />,
      },
      {
        path: "support-ticket/new",
        element: <NewTicket />,
      },
      {
        path: "support-ticket/reply/:paramId",
        element: <ReplyTicket />,
      },
      // {
      //   path: "my-folder",
      //   element: (
      //     <ClientAuthGuard>
      //       <MyFolder />
      //     </ClientAuthGuard>
      //   ),
      // },
      {
        path: "folder/:id",
        element: <ExtendMyFolder />,
      },
      {
        path: "folder/share/:id",
        element: <SharedExtendMyFolder />,
      },
      {
        path: "file/:user/:fileType/:status",
        element: <Myfile />,
      },
      {
        path: "share-with-me",
        element: <ShareWithMe />,
      },
      {
        path: "share-with-me/:uuid/:id",
        element: <ExtendShare />,
      },
      {
        path: "favourite",
        element: <Favourite />,
      },
      {
        path: "file-drop",
        element: <ClientFileDrop />,
      },
      {
        path: "file-drop-detail/:url",
        element: <ClientFileDropDetail />,
      },
      {
        path: "recent",
        element: <Recent />,
      },
      {
        path: "trash",
        element: <Trash />,
      },
      {
        path: "account-setting",
        element: <AccountInfo />,
      },
      {
        path: "faq",
        element: <FAQcomponent />,
      },
      {
        path: "help",
        element: <Helpcomponent />,
      },

      {
        path: "pricing",
        element: <PriceComponent />,
      },
      {
        path: "pricing/checkout/:packageId",
        element: <PricingCheckoutComponent />,
      },

      {
        path: "feedback",
        element: <FeedbackComponent />,
      },
    ],
  },

  {
    path: "dashboard",
    element: (
      <FolderProvider>
        <EventUploadTriggerProvider>
          <AuthProvider>
            <AuthGuard>
              <DashboardLayout />
            </AuthGuard>
          </AuthProvider>
        </EventUploadTriggerProvider>
      </FolderProvider>
    ),
    children: [
      {
        path: "default",
        element: <Default />,
      },
      {
        path: "profile",
        element: <Profile />,
      },

      {
        path: "settings",
        element: <AdminSetting />,
      },
      {
        path: "filedownload",
        element: <FileDownload />,
      },
      {
        path: "statistic/authentication",
        element: <AuthenticationStatistices />,
      },
      {
        path: "statistic/purchases",
        element: <Purchases />,
      },
      {
        path: "statistic/upload/download",
        element: <UploadDdownload />,
      },
      {
        path: "statistic/general",
        element: <General />,
      },
      {
        path: "share",
        element: <Share />,
      },
      {
        path: "admin-feedback",
        element: <AdminFeedback />,
      },
      {
        path: "manage-files",
        element: <ManageFile />,
      },
      {
        path: "package_manage",
        element: <ManagePackage />,
      },
      {
        path: "e-invoices",
        element: <EInvoice />,
      },
      {
        path: "payments",
        element: <Payment />,
      },
      {
        path: "incomes",
        element: <Income />,
      },
      {
        path: "create_package",
        element: <CreatePackage />,
      },
      {
        path: "customer_messages_landingpage",
        element: <ChatCustomerEmail />,
      },
      {
        path: "chat_messages",
        element: <GmailApiExample />,
      },
      {
        path: "feature_packages",
        element: <FeaturePackage />,
      },
      {
        path: "advertising",
        element: <Advertising />,
      },
      {
        path: "company",
        element: <Company />,
      },
      {
        path: "user",
        element: <User />,
      },
      {
        path: "add-user",
        element: <AddUser />,
      },
      {
        path: "manage-staffs",
        element: <Staff />,
      },
      {
        path: "manage-roles",
        element: <ManageRole />,
      },
      {
        path: "user-type",
        element: <UserType />,
      },
      {
        path: "feature",
        element: <Features />,
      },
      {
        path: "faq",
        element: <FAQ />,
      },
      {
        path: "help",
        element: <HelpAdmin />,
      },
      {
        path: "service-email",
        element: <ServiceEmail />,
      },
      {
        path: "announcement",
        element: <Announcements />,
      },
      {
        path: "broadcast",
        element: <Broadcast />,
      },
      {
        path: "seo",
        element: <SEOComponent />,
      },
      {
        path: "general",
        element: <GeneralSetting />,
      },
      {
        path: "user-setting",
        element: <UserSetting />,
      },
      {
        path: "security",
        element: <SecuritySetting />,
      },
      {
        path: "auth-setting",
        element: <AuthSetting />,
      },
      {
        path: "payment-setting",
        element: <PaymentSetting />,
      },
      {
        path: "point-setting",
        element: <PointSetting />,
      },
      {
        path: "secret-setting",
        element: <SettingSecretKey />,
      },
      {
        path: "upload-setting",
        element: <FileUploadSetting />,
      },
      {
        path: "download-setting",
        element: <DownloadSetting />,
      },
      {
        path: "language-setting",
        element: <LanguageSetting />,
      },
      {
        path: "coupon",
        element: <Coupon />,
      },
      {
        path: "coupon/detail/:id",
        element: <CouponDetail />,
      },
      {
        path: "ticket",
        element: <Ticket />,
      },
      {
        path: "ticket/chat-message/:chatId",
        element: <ChatMessage />,
      },
    ],
  },

  {
    path: "admin",
    children: [
      {
        path: "login",
        element: (
          <AuthProvider>
            <Login />
          </AuthProvider>
          // <IsLoggedAuthGuard>
          // </IsLoggedAuthGuard>
        ),
        // element: <Login />,
      },
    ],
  },

  {
    path: "auth",
    element: (
      <AuthProvider>
        <AuthLayout />
      </AuthProvider>
    ),
    children: [
      {
        path: "sign-in",
        element: (
          <IsLoggedClientAuthGuard>
            <SignIn />
          </IsLoggedClientAuthGuard>
        ),
        // element: <SignIn />,
      },
      {
        path: "sign-up",
        element: <SignUp />,
      },
      {
        path: "reset-password/:token",
        element: <ResetPassword />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "404",
        element: <Page404 />,
      },
      {
        path: "500",
        element: <Page500 />,
      },
    ],
  },
  {
    path: "",
    element: (
      <AuthProvider>
        <AuthLayout />
      </AuthProvider>
    ),
    children: [
      {
        path: "*",
        element: <Page404 />,
      },
    ],
  },
];

export default routes;
