import React from "react";
import {
  AutoStoriesOutlined, CloseRounded, HelpOutlineRounded,
  HomeOutlined, LoginRounded, PersonAddAltOutlined,
} from "@mui/icons-material";
import {
  Box, Divider, Drawer, IconButton, List, ListItemButton,
  ListItemIcon, ListItemText, Stack, Typography,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { catalogPreviewEnabled } from "../../features/catalogPreview/catalogPreviewRoutes";

/** Real, navigable mobile menu; previous menu contained only commented-out items. */
export default function Sidebar({ sidebar, setSidebar }) {
  const location = useLocation();
  const hasCatalogPreview = catalogPreviewEnabled({
    dev: import.meta.env.DEV,
    flag: import.meta.env.VITE_ENABLE_CATALOG_UI_PREVIEW,
  });

  const links = [
    { label: "صفحه اصلی", url: "/", icon: <HomeOutlined /> },
    ...(hasCatalogPreview
      ? [{ label: "دوره‌های آموزشی", url: "/__preview/catalog", icon: <AutoStoriesOutlined /> }]
      : []),
    { label: "سوالات پرتکرار", url: "/FAQ", icon: <HelpOutlineRounded /> },
  ];
  const accountLinks = [
    { label: "ورود", url: "/login", icon: <LoginRounded /> },
    { label: "ثبت‌نام", url: "/signup", icon: <PersonAddAltOutlined /> },
  ];

  function menuItem(item) {
    const selected = item.url === "/"
      ? location.pathname === "/"
      : location.pathname === item.url || location.pathname.startsWith(item.url + "/");
    return (
      <ListItemButton
        key={item.url}
        component={Link}
        to={item.url}
        selected={selected}
        onClick={() => setSidebar(false)}
        sx={{
          my: .3, px: 1.8, py: 1.35, borderRadius: 2.5,
          "&.Mui-selected": { bgcolor: "#eeecfc", color: "#463caa" },
          "&.Mui-selected:hover": { bgcolor: "#e5e2fa" },
          "&:hover": { bgcolor: "#f5f4fb" },
        }}
      >
        <ListItemIcon sx={{
          minWidth: 36, color: selected ? "#5144ba" : "#7c7c99",
        }}>
          {item.icon}
        </ListItemIcon>
        <ListItemText
          primary={item.label}
          primaryTypographyProps={{
            fontWeight: selected ? 850 : 650, fontSize: ".92rem",
          }}
        />
      </ListItemButton>
    );
  }

  return (
    <Drawer
      open={sidebar}
      onClose={() => setSidebar(false)}
      anchor="right"
      aria-label="فهرست ناوبری"
      sx={{ display: { xs: "block", md: "none" } }}
      PaperProps={{
        sx: {
          width: "min(84vw, 330px)", direction: "rtl",
          bgcolor: "#fff", borderRadius: "18px 0 0 18px",
          boxShadow: "-14px 0 40px rgba(18,16,63,.14)",
        },
      }}
    >
      <Box component="nav" aria-label="ناوبری موبایل" sx={{
        display: "flex", flexDirection: "column", height: "100%", minHeight: 0,
      }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between"
          sx={{ p: 2.5, pt: 3 }}>
          <Stack direction="row" alignItems="center" gap={1}>
            <Box sx={{
              width: 37, height: 37, display: "grid", placeItems: "center",
              color: "#5144ba", borderRadius: 2, bgcolor: "#efedff",
            }}>
              <AutoStoriesOutlined />
            </Box>
            <Typography fontSize="1.1rem" fontWeight={900} color="#292652">دارالقرآن</Typography>
          </Stack>
          <IconButton aria-label="بستن فهرست" onClick={() => setSidebar(false)}
            sx={{ bgcolor: "#f5f5fa", color: "#565472" }}>
            <CloseRounded />
          </IconButton>
        </Stack>
        <Divider sx={{ mx: 2.2, borderColor: "#f0eff6" }} />
        <Box sx={{ flex: 1, overflowY: "auto", px: 1.8, pt: 2 }}>
          <Typography sx={{ px: 1.8, mb: 1.1, fontSize: ".74rem", color: "#9292a7", fontWeight: 800 }}>
            فهرست سایت
          </Typography>
          <List disablePadding>{links.map(menuItem)}</List>
          <Divider sx={{ my: 2.2, mx: 1.2, borderColor: "#f0eff6" }} />
          <Typography sx={{ px: 1.8, mb: 1.1, fontSize: ".74rem", color: "#9292a7", fontWeight: 800 }}>
            حساب کاربری
          </Typography>
          <List disablePadding>{accountLinks.map(menuItem)}</List>
        </Box>
        <Box sx={{ p: 2.5, bgcolor: "#f6f5ff", borderTop: "1px solid #eeecfa" }}>
          <Typography fontSize=".76rem" lineHeight={2} color="#6c689b">
            یادگیری، قدم به قدم
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
}
