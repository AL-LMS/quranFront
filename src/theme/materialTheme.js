import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  typography: {
    fontFamily: "iranyekan",
    fontWeightLight: 200,
    fontWeightRegular: 300,
    fontWeightMedium: 400,
    fontWeightBold: 500,
    fontWeightHeavy: 700,
    fontWeightFat: 900,
  },
  direction: "rtl",
  palette: {
    primary: {
      main: "#3f3f97",
    },
    secondary: {
      main: "#cb9f41",
    },
    mainText: "#666",
    success: { main: "#61d215" },
    error: { main: "#f74b4a" },
  },
});
