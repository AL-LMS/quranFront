import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";
import useAuth from "../../hooks/useAuth";

import { stRoutes } from "../../routes/stRoutes";
import { tcRoutes } from "../../routes/tcRoutes";

const Sidebar = ({ sidebar, setSidebar }) => {
  const { user } = useAuth();
  const [routes, setRoutes] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(
    localStorage.getItem("dtab") ? JSON.parse(localStorage.getItem("dtab")) : 0
  );
  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
    localStorage.setItem("dtab", JSON.stringify(index));
  };
  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setSidebar(open);
  };
  useEffect(() => {
    if (user?.role?.toLowerCase() === "student") {
      setRoutes(stRoutes);
    } else {
      setRoutes(tcRoutes);
    }
  }, [user]);
  return (
    <Drawer open={sidebar} onClose={toggleDrawer(false)}>
      <Toolbar>
        <List sx={{ overflow: "auto", maxHeight: "100vh" }}>
          {routes.map((item) => (
            <Link
              to={`panel/${item.route}`}
              key={item.id}
              onClick={() => setSidebar(false)}
            >
              <ListItem>
                <ListItemButton
                  selected={selectedIndex === item.id}
                  onClick={(event) => handleListItemClick(event, item.id)}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText
                    primary={item.name}
                    sx={{
                      color: "#666",
                    }}
                  />
                </ListItemButton>
              </ListItem>
            </Link>
          ))}
        </List>
      </Toolbar>
    </Drawer>
  );
};

export default Sidebar;
