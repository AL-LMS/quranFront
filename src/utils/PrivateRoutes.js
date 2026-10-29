import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../layouts/dashboard/Navbar";
import Sidebar from "../layouts/dashboard/Sidebar";

import useAuth from "../hooks/useAuth";
import Login from "../pages/site/Login";
import Back from "../components/dashboard/Back";
import SendOTP from "../pages/site/SendOTP";
import { hasDashboardAccess } from "../features/auth/hasDashboardAccess";

const PrivateRoutes = () => {
  const [sidebar, setSidebar] = useState(false);
  const { user } = useAuth();
  return hasDashboardAccess(user) ? (
    <>
      <Navbar setSidebar={setSidebar} />
      <Back />
      <Sidebar sidebar={sidebar} setSidebar={setSidebar} />
      <Outlet />
    </>
  ) : (
    <>
      {/* <Login /> */}
      <SendOTP />
    </>
  );
};

export default PrivateRoutes;
