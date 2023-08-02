import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import LibraryBooksOutlinedIcon from "@mui/icons-material/LibraryBooksOutlined";
import AccountBoxOutlinedIcon from "@mui/icons-material/AccountBoxOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import PaymentOutlinedIcon from "@mui/icons-material/PaymentOutlined";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";

export const tcRoutes = [
  {
    id: 0,
    name: "داشبورد",
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
    route: "my-course",
    icon: <LibraryBooksOutlinedIcon />,
  },
  {
    id: 3,
    name: "دوره‌های ثبت نام شده",
    route: "my-coures",
    icon: <LocalMallOutlinedIcon />,
  },
  {
    id: 4,
    name: "تراکنش‌ها",
    route: "payments",
    icon: <PaymentOutlinedIcon />,
  },
  {
    id: 5,
    name: "سابقه پرداخت‌ها",
    route: "wallet",
    icon: <AccountBalanceWalletOutlinedIcon />,
  },
];
