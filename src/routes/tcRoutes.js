import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import LibraryBooksOutlinedIcon from "@mui/icons-material/LibraryBooksOutlined";
import AccountBoxOutlinedIcon from "@mui/icons-material/AccountBoxOutlined";

export const tcRoutes = [
  {
    id: 0,
    name: "داشبورد",
    route: "dashboard",
    icon: <DashboardOutlinedIcon />,
  },
  {
    id: 2,
    name: "پروفایل",
    route: "profile",
    icon: <AccountBoxOutlinedIcon />,
  },
  {
    id: 1,
    name: "دوره های من",
    route: "my-coures",
    icon: <LibraryBooksOutlinedIcon />,
  },
];
