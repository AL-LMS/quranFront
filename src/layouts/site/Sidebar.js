import React, { useState } from "react";
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

const Sidebar = ({ sidebar, setSidebar }) => {
  const [selectedIndex, setSelectedIndex] = useState(
    localStorage.getItem("tab") ? JSON.parse(localStorage.getItem("tab")) : 0
  );
  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
    localStorage.setItem("tab", JSON.stringify(index));
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
  return (
    <Drawer
      open={sidebar}
      onClose={toggleDrawer(false)}
      sx={{ display: { xs: "block", md: "none" } }}
    >
      <Toolbar>
        <List sx={{ overflow: "auto", maxHeight: "100vh" }}>
          {/* <Link to="/" onClick={() => setSidebar(false)}>
            <ListItem>
              <ListItemButton
                selected={selectedIndex === 0}
                onClick={(event) => handleListItemClick(event, 0)}
              >
                <ListItemText
                  primary="خانه"
                  sx={{
                    color: "#666",
                  }}
                />
              </ListItemButton>
            </ListItem>
          </Link> */}
          {/* <Link to="/course" onClick={() => setSidebar(false)}>
            <ListItem>
              <ListItemButton
                selected={selectedIndex === 1}
                onClick={(event) => handleListItemClick(event, 1)}
              >
                <ListItemText
                  primary="دوره ها"
                  sx={{
                    color: "#666",
                  }}
                />
              </ListItemButton>
            </ListItem>
          </Link> */}
          {/* <Link to="/packages" onClick={() => setSidebar(false)}>
            <ListItem>
              <ListItemButton
                selected={selectedIndex === 2}
                onClick={(event) => handleListItemClick(event, 2)}
              >
                <ListItemText
                  primary="پکیج ها"
                  sx={{
                    color: "#666",
                  }}
                />
              </ListItemButton>
            </ListItem>
          </Link>
          <Link to="/timing-package" onClick={() => setSidebar(false)}>
            <ListItem>
              <ListItemButton
                selected={selectedIndex === 3}
                onClick={(event) => handleListItemClick(event, 3)}
              >
                <ListItemText
                  primary="پکیج های اشتراک زمانی"
                  sx={{
                    color: "#666",
                  }}
                />
              </ListItemButton>
            </ListItem>
          </Link>
          <Link to="/applications" onClick={() => setSidebar(false)}>
            <ListItem>
              <ListItemButton
                selected={selectedIndex === 4}
                onClick={(event) => handleListItemClick(event, 4)}
              >
                <ListItemText
                  primary="اپلیکیشن ها"
                  sx={{
                    color: "#666",
                  }}
                />
              </ListItemButton>
            </ListItem>
          </Link> */}
          {/* <Link to="/FAQ" onClick={() => setSidebar(false)}>
            <ListItem>
              <ListItemButton
                selected={selectedIndex === 5}
                onClick={(event) => handleListItemClick(event, 5)}
              >
                <ListItemText
                  primary="سوالات پرتکرار"
                  sx={{
                    color: "#666",
                  }}
                />
              </ListItemButton>
            </ListItem>
          </Link> */}
        </List>
      </Toolbar>
    </Drawer>
  );
};

export default Sidebar;
