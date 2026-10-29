import { ThemeProvider } from "@mui/system";
import { AuthProvider } from "../context/AuthContext";
import DefiProvider from "../context/DefiContext";
import { theme } from "../theme/materialTheme";

/** Keeps the existing provider order in one application setup boundary. */
export default function AppProviders({ children }) {
  return (
    <AuthProvider>
      <DefiProvider>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </DefiProvider>
    </AuthProvider>
  );
}
