import React, { useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import {
  AppBar,
  Badge,
  IconButton,
  Menu,
  MenuItem,
  styled,
  Toolbar,
  Typography,
} from "@mui/material";
import { Box, Container } from "@mui/system";
//Icons
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";

const StyledToolbar = styled(Toolbar)({
  display: "flex",
  justifyContent: "space-between",
});

const NavbarButton = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
}));

const Navbar = ({ setSidebar }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { setAuth, setUser, user } = useAuth();
  const open = Boolean(anchorEl);
  const openHandler = (e) => {
    setAnchorEl(e.currentTarget);
  };
  const closeHandler = () => {
    setAnchorEl(null);
  };
  const logOut = () => {
    setAnchorEl(null);
    setAuth("");
    setUser("");
    localStorage.clear("token");
    localStorage.clear("user");
  };
  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: "#ffffffa6",
        backdropFilter: "blur(6px)",
        boxShadow: "none",
        padding: "1rem 0",
      }}
    >
      <Container>
        <StyledToolbar>
          <Box component="div" display="flex" alignItems="center">
            <IconButton onClick={() => setSidebar(true)}>
              <MenuIcon fontSize="large" />
            </IconButton>
            <Link to="/">
              <Typography
                component="h4"
                variant="h6"
                color="primary"
                fontWeight={500}
                sx={{ textAlign: "center" }}
              >
                کلاس قرآنی
              </Typography>
            </Link>
          </Box>
          <NavbarButton>
            <IconButton
              onClick={openHandler}
              sx={[
                {
                  borderRadius: 3,
                  marginLeft: 2,
                  fontSize: "15px",
                  backgroundColor: "#9126FF",
                  boxShadow: "none",
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "#9126FF",
                    color: "#fff",
                    boxShadow: "none",
                  },
                },
              ]}
            >
              {user?.first_name} {user?.last_name}
            </IconButton>
          </NavbarButton>
        </StyledToolbar>
        <Menu
          id="profile-menu"
          open={open}
          anchorEl={anchorEl}
          onClose={closeHandler}
          MenuListProps={{ "aria-labelledby": "profile-menu" }}
          PaperProps={{
            elevation: 0,
            sx: {
              boxShadow: "0 5px 10px rgba(112,112,112,.2)",
              borderRadius: 4,
              color: "#666",
              textAlign: "center",
              padding: "0 1rem",
            },
          }}
        >
          <MenuItem onClick={closeHandler} color="text.secondary">
            <Link to="/panel/profile">پروفایل</Link>
          </MenuItem>
          <MenuItem onClick={logOut} color="text.secondary">
            خروج
          </MenuItem>
        </Menu>
      </Container>
    </AppBar>
  );
};

export default Navbar;
