import { createContext, useState } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() =>
    localStorage.getItem("token")
      ? JSON.parse(localStorage.getItem("token"))
      : null
  );
  const [user, setUser] = useState(() =>
    localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null
  );
  const [role, setRole] = useState(() =>
    localStorage.getItem("role")
      ? JSON.parse(localStorage.getItem("role"))
      : null
  );

  return (
    <AuthContext.Provider
      value={{ auth, setAuth, user, setUser, role, setRole }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
