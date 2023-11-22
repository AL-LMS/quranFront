import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import LibraryBooksOutlinedIcon from "@mui/icons-material/LibraryBooksOutlined";
import AccountBoxOutlinedIcon from "@mui/icons-material/AccountBoxOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import PaymentOutlinedIcon from "@mui/icons-material/PaymentOutlined";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";

export const tcRoutes = [
  {
    id: 0,
    name: "میزکار",
    route: "dashboard",
    icon: <DashboardOutlinedIcon />,
  },
  {
    id: 1,
    name: "پروفایل",
    route: "profile",
    icon: <AccountBoxOutlinedIcon />,
  },
  {
    id: 2,
    name: "دوره‌های ارائه شده",
    route: "my-coures",
    icon: <LibraryBooksOutlinedIcon />,
  },
  {
    id: 3,
    name: "دوره‌های ثبت نام شده",
    route: "coures",
    icon: <LocalMallOutlinedIcon />,
  },
  {
    id: 4,
    name: "گواهی‌ و مدارک مربی",
    route: "documents",
    icon: <LocalMallOutlinedIcon />,
  },
  {
    id: 5,
    name: "تراکنش‌ها",
    route: "payments",
    icon: <PaymentOutlinedIcon />,
  },
  {
    id: 6,
    name: "سابقه پرداخت‌ها",
    route: "wallet",
    icon: <AccountBalanceWalletOutlinedIcon />,
  },
];
