import React, { useState } from "react";
import { AutoStoriesOutlined, MenuRounded } from "@mui/icons-material";
import {
  AppBar, Box, Button, Container, IconButton, Stack,
  Toolbar, Typography,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Sidebar from "./Sidebar";
import "./styleNav.css";

export default function Navbar() {
  const { user } = useAuth();
  const location = useLocation();
  const [sidebar, setSidebar] = useState(false);
  const pathname = location.pathname;
  const loginTarget = user?.role
    ? "/panel/dashboard"
    : pathname === "/send-otp"
      ? "/signup"
      : pathname === "/signup" ? "/send-otp" : "/login";

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          top: { xs: 8, md: 16 },
          width: { xs: "calc(100% - 24px)", sm: "calc(100% - 48px)", md: "min(92%, 1180px)" },
          mx: "auto", mt: { xs: 1.2, md: 2.5 },
          borderRadius: { xs: 3, md: 4 },
          color: "#27264e",
          bgcolor: "rgba(255,255,255,.95)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(221,220,238,.8)",
          boxShadow: "0 8px 24px rgba(33,32,80,.06)",
        }}
      >
        <Container maxWidth="xl" disableGutters>
          <Toolbar sx={{
            px: { xs: 1.2, sm: 2.4, md: 3.2 },
            minHeight: { xs: "58px !important", md: "68px !important" },
            gap: 1.5, justifyContent: "space-between",
          }}>
            <Stack direction="row" alignItems="center" gap={{ xs: .7, sm: 1 }}>
              <IconButton
                aria-label="باز کردن فهرست"
                aria-expanded={sidebar}
                onClick={() => setSidebar(true)}
                sx={{
                  display: { xs: "inline-flex", md: "none" },
                  color: "#4d469c", p: .75,
                  bgcolor: "#f4f2ff", borderRadius: 2,
                }}
              >
                <MenuRounded />
              </IconButton>
              <Stack component={Link} to="/" direction="row" alignItems="center" gap={.9}
                sx={{ textDecoration: "none", color: "inherit" }}>
                <Box sx={{
                  width: { xs: 30, md: 37 }, height: { xs: 30, md: 37 },
                  display: { xs: "none", sm: "grid" },
                  placeItems: "center", borderRadius: 2,
                  bgcolor: "#f0eeff", color: "#5144ba",
                }}>
                  <AutoStoriesOutlined sx={{ fontSize: { xs: 19, md: 22 } }} />
                </Box>
                <Typography component="h4" sx={{
                  fontWeight: 900, fontSize: { xs: ".96rem", sm: "1.07rem" },
                  whiteSpace: "nowrap", color: "#343077",
                }}>
                  دارالقرآن
                </Typography>
              </Stack>
            </Stack>

            <Stack direction="row" alignItems="center" gap={{ xs: .6, sm: 1 }}>
              <Button
                component={Link}
                to={loginTarget}
                variant="contained"
                size="small"
                sx={{
                  px: { xs: 1.3, sm: 2.2 }, py: { xs: .9, md: 1 },
                  borderRadius: 2, fontSize: { xs: ".74rem", sm: ".85rem" },
                  bgcolor: "#5144ba", color: "#fff",
                  boxShadow: "none", fontWeight: 800,
                  whiteSpace: "nowrap", minWidth: 0,
                  "&:hover": { bgcolor: "#40349e", boxShadow: "none" },
                }}
              >
                {user?.first_name
                  ? [user.first_name, user.last_name].filter(Boolean).join(" ")
                  : user?.role ? "حساب کاربری"
                    : pathname === "/send-otp" ? "ثبت‌نام" : "ورود"}
              </Button>
              {!user?.role && (
                <Button
                  component={Link}
                  to="/signup"
                  variant="outlined"
                  size="small"
                  sx={{
                    px: { xs: 1.1, sm: 2 }, py: { xs: .9, md: 1 },
                    borderRadius: 2, fontSize: { xs: ".73rem", sm: ".85rem" },
                    borderColor: "#e1deef", color: "#51469c",
                    fontWeight: 750, whiteSpace: "nowrap", minWidth: 0,
                    "&:hover": { borderColor: "#afa7df", bgcolor: "#f6f4ff" },
                  }}
                >
                  همکاری
                </Button>
              )}
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>
      <Sidebar sidebar={sidebar} setSidebar={setSidebar} />
    </>
  );
}
