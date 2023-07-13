import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../layouts/dashboard/Navbar";
import Sidebar from "../layouts/dashboard/Sidebar";

import useAuth from "../hooks/useAuth";
import Login from "../pages/site/Login";
import Back from "../components/dashboard/Back"

const PrivateRoutes = () => {
  const [sidebar, setSidebar] = useState(false);
  const { user } = useAuth();
  return user?.role === "student" || user?.role === "teacher" ? (
    <>
      <Navbar setSidebar={setSidebar} />
      <Back />
      <Sidebar sidebar={sidebar} setSidebar={setSidebar} />
      <Outlet />
    </>
  ) : (
    <>
      <Login />
    </>
  );
};

export default PrivateRoutes;
