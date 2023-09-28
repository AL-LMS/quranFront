import React from "react";
import useAuth from "../../hooks/useAuth";
import {
  AppBar,
  Button,
  IconButton,
  InputBase,
  styled,
  Tab,
  Tabs,
  Toolbar,
  Typography,
} from "@mui/material";
import { Box, Container } from "@mui/system";
import { Link, useNavigate } from "react-router-dom";
//Icons
import MenuIcon from "@mui/icons-material/Menu";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
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
  marginLeft: "100px !important",
  marginRight: "100px",
}));

const Navbar = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState(() =>
    localStorage.getItem("tab")
      ? JSON.parse(localStorage.getItem("tab"))
      : "one"
  );
  const [sidebar, setSidebar] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleChange = (event, newtab) => {
    setTab(newtab);
    localStorage.setItem("tab", JSON.stringify(newtab));
  };

  const changeSearch = (e) => {
    setSearch(e.target.value);
  };

  const searchHandler = () => {
    if (search) {
      navigate(`search/?search=${search}`);
    }
  };
  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          backgroundColor: "#ffffffa6",
          backdropFilter: "blur(30px)",
          boxShadow: "none",
          padding: "1rem 0",
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
            {/* <Box
              sx={{
                display: { xs: "none", md: "flex" },
                width: "40%",
                padding: "5px 5px 5px 20px",
                borderRadius: "40px",
                backgroundColor: "#f0f0f0",
              }}
            >
              <InputBase
                placeholder="جستجوی دوره‌ها"
                sx={{ width: "90%" }}
                value={search}
                onChange={changeSearch}
              />
              <IconButton
                sx={{
                  backgroundColor: "#9126FF",
                  "&:hover": { color: "#fff", backgroundColor: "#9126FF" },
                }}
                color="inherit"
                onClick={searchHandler}
              >
                <SearchRoundedIcon />
              </IconButton>
            </Box> */}
            <NavbarButton>
              {/* {user?.role === "student" && (
                <Link to="/panel/cart">
                  <IconButton>
                    <LocalMallOutlinedIcon color="primary" />
                  </IconButton>
                </Link>
              )} */}
              <Link to="/panel/dashboard">
                <Button
                  variant="contained"
                  style={{
                    marginLeft: "100px !important",
                    marginRight: "100px !important",
                  }}
                  sx={{
                    borderRadius: "40px",
                    ml: 2,
                    boxShadow: "none",
                  }}
                >
                  {user?.first_name
                    ? `${user.first_name} ${user.last_name}`
                    : "ورود | ثبت نام"}
                </Button>
              </Link>
            </NavbarButton>
          </StyledToolbar>
          <Box
            sx={{
              display: { xs: "flex", md: "none" },
              width: "100%",
              marginTop: 1,
              padding: "0px 0px 0px 20px",
              borderRadius: "40px",
              backgroundColor: "#f0f0f0",
            }}
          >
            <InputBase
              placeholder="جستجوی دوره ها"
              sx={{ width: "90%" }}
              value={search}
              onChange={changeSearch}
            />
            <IconButton
              sx={{
                backgroundColor: "#9126FF",
                "&:hover": { color: "#fff", backgroundColor: "#9126FF" },
              }}
              onClick={searchHandler}
              color="inherit"
            >
              <SearchRoundedIcon />
            </IconButton>
          </Box>
          <Tabs
            value={tab}
            onChange={handleChange}
            textColor="primary"
            indicatorColor="primary"
            aria-label="secondary tabs example"
            sx={{
              justifyContent: "space-between",
              marginTop: 2,
              display: { xs: "none", md: "flex" },
            }}
          >
            {/* <Tab
              value="one"
              label={
                <Link className="nav-link" to="/">
                  خانه
                </Link>
              }
            /> */}
            {/* <Tab
              value="two"
              label={
                <Link className="nav-link" to="/course">
                  دوره ها
                </Link>
              }
            /> */}
            {/* <Tab
              value="three"
              label={
                <Link className="nav-link" to="/packages">
                  پکیج ها
                </Link>
              }
            />
            <Tab
              value="four"
              label={
                <Link className="nav-link" to="/timing-package">
                  پکیج های اشتراک زمانی
                </Link>
              }
            />
            <Tab
              value="five"
              label={
                <Link className="nav-link" to="/applications">
                  اپلیکیشن ها
                </Link>
              }
            /> */}
            {/* <Tab
              value="six"
              label={
                <Link className="nav-link" to="/FAQ">
                  سوالات پرتکرار
                </Link>
              }
            /> */}
          </Tabs>
        </Container>
      </AppBar>
      <Sidebar sidebar={sidebar} setSidebar={setSidebar} />
    </>
  );
};

export default Navbar;
