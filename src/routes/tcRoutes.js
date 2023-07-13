import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import LibraryBooksOutlinedIcon from "@mui/icons-material/LibraryBooksOutlined";
import LiveTvIcon from '@mui/icons-material/LiveTv';

export const tcRoutes = [
  {
    id: 0,
    name: "داشبورد",
    route: "dashboard",
    icon: <DashboardOutlinedIcon />,
  },
  {
    id: 1,
    name: "دوره های من",
    route: "my-coures",
    icon: <LibraryBooksOutlinedIcon />,
  },
  {
    id: 2,
    name: "پخش زنده",
    route: "live",
    icon: <LiveTvIcon />,
  },
];
