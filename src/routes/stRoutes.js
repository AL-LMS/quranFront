import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import VpnKeyOutlinedIcon from "@mui/icons-material/VpnKeyOutlined";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import LibraryBooksOutlinedIcon from "@mui/icons-material/LibraryBooksOutlined";
import LiveTvOutlinedIcon from "@mui/icons-material/LiveTvOutlined";
import PaymentOutlinedIcon from "@mui/icons-material/PaymentOutlined";
import QuizOutlinedIcon from "@mui/icons-material/QuizOutlined";
import BallotOutlinedIcon from "@mui/icons-material/BallotOutlined";
import AddchartRoundedIcon from "@mui/icons-material/AddchartRounded";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import PrivacyTipOutlinedIcon from "@mui/icons-material/PrivacyTipOutlined";
import AccountBoxOutlinedIcon from "@mui/icons-material/AccountBoxOutlined";

export const stRoutes = [
  {
    id: 0,
    name: "داشبورد",
    route: "dashboard",
    icon: <DashboardOutlinedIcon />,
  },
  {
    id: 1,
    name: "کیف پول",
    route: "wallet",
    icon: <AccountBalanceWalletOutlinedIcon />,
  },
  {
    id: 2,
    name: "پروفایل کاربری",
    route: "profile",
    icon: <AccountBoxOutlinedIcon />,
  },
  {
    id: 4,
    name: "سبد خرید",
    route: "cart",
    icon: <LocalMallOutlinedIcon />,
  },
  {
    id: 6,
    name: "دوره های من",
    route: "my-course",
    icon: <LibraryBooksOutlinedIcon />,
  },
  {
    id: 7,
    name: "لیست پرداخت",
    route: "payments",
    icon: <PaymentOutlinedIcon />,
  },
  {
    id: 8,
    name: "آزمون",
    route: "quiz",
    icon: <QuizOutlinedIcon />,
  },
  {
    id: 9,
    name: "پکیج های آموزشی",
    route: "package",
    icon: <LibraryBooksOutlinedIcon />,
  },
  {
    id: 12,
    name: "قوانین و مقررات",
    route: "privacy-policy",
    icon: <PrivacyTipOutlinedIcon />,
  },
];
