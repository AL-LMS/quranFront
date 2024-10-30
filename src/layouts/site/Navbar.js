import React from "react";
import useAuth from "../../hooks/useAuth";
import {
  AppBar,
  Button,
  IconButton,
  styled,
  Toolbar,
  Typography,
} from "@mui/material";
import { Box, Container } from "@mui/system";
import { Link } from "react-router-dom";
//Icons
import MenuIcon from "@mui/icons-material/Menu";
import "./styleNav.css";
import { useState } from "react";
import Sidebar from "./Sidebar";

const StyledToolbar = styled(Toolbar)({
  display: "flex",
  justifyContent: "space-between",
});

const NavbarButton = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginLeft: "75px !important",
  marginRight: "75px",
}));

const AppBarContainer = styled(AppBar)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    width: "100%",
  },
  [theme.breakpoints.up("md")]: {
    width: "80%",
  },
  [theme.breakpoints.up("lg")]: {
    width: "90%",
    marginLeft: "auto",
    marginRight: "auto",
  },
}));
const Navbar = () => {
  const { user } = useAuth();
  const [sidebar, setSidebar] = useState(false);
  return (
    <>
      <AppBarContainer
        position="sticky"
        sx={{
          backgroundColor: "#ffffffa6",
          backdropFilter: "blur(30px)",
          boxShadow: "none",
          borderTopRightRadius: "100px",
          borderBottomRightRadius: "100px",
          borderTopLeftRadius: "100px",
          borderBottomLeftRadius: "100px",
          marginTop: "2rem",
        }}
      >
        <Container>
          <StyledToolbar>
            <Box component="div" display="flex" alignItems="center">
              <IconButton
                onClick={() => setSidebar(true)}
                sx={{ display: { sx: "block", md: "none" } }}
              >
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
                  دارالقرآن
                </Typography>
              </Link>
            </Box>
            <NavbarButton>
              <Link
                to={
                  window.location.pathname === "/send-otp"
                    ? "/signup"
                    : window.location.pathname === "/signup"
                    ? "/send-otp"
                    : "/panel/dashboard"
                }
              >
                <Button
                  variant="contained"
                  style={{
                    marginLeft: "100px !important",
                    marginRight: "100px !important",
                  }}
                  sx={{
                    borderRadius: "5px",
                    ml: 2,
                    boxShadow: "none",
                  }}
                >
                  {user?.first_name
                    ? `${user.first_name} ${user.last_name}`
                    : window.location.pathname !== "/send-otp"
                    ? "ورود"
                    : "ثبت‌نام"}
                </Button>
              </Link>
              {!user?.first_name && (
                <Link to={"/signup"}>
                  <Button
                    variant="contained"
                    style={{
                      marginLeft: "100px !important",
                      marginRight: "100px !important",
                    }}
                    sx={{
                      borderRadius: "5px",
                      ml: 2,
                      boxShadow: "none",
                    }}
                  >
                    {"همکاری"}
                  </Button>
                </Link>
              )}
            </NavbarButton>
          </StyledToolbar>
        </Container>
      </AppBarContainer>
      <Sidebar sidebar={sidebar} setSidebar={setSidebar} />
    </>
  );
};

export default Navbar;
