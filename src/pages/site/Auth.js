import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const { token } = useParams();
  const { setAuth, setUser } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      const userInfo = await axios.get("/authen/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAuth(token);
      setUser(userInfo.data);
      localStorage.setItem("token", JSON.stringify(token));
      localStorage.setItem("user", JSON.stringify(userInfo.data));
      navigate("/panel/dashboard");
    };
    fetchData();
  }, []);
  return <div></div>;
};

export default Auth;
