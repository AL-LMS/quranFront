import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import LibraryBooksOutlinedIcon from "@mui/icons-material/LibraryBooksOutlined";
import PaymentOutlinedIcon from "@mui/icons-material/PaymentOutlined";
import AccountBoxOutlinedIcon from "@mui/icons-material/AccountBoxOutlined";

export const stRoutes = [
  {
    id: 0,
    name: "میزکار",
    route: "dashboard",
    icon: <DashboardOutlinedIcon />,
  },
  {
    id: 2,
    name: "پروفایل کاربری",
    route: "profile",
    icon: <AccountBoxOutlinedIcon />,
  },
  {
    id: 6,
    name: "دوره‌های ثبت نامی",
    route: "my-course",
    icon: <LibraryBooksOutlinedIcon />,
  },
  {
    id: 7,
    name: "گزارش‌گیری",
    route: "payments",
    icon: <PaymentOutlinedIcon />,
  },
];
