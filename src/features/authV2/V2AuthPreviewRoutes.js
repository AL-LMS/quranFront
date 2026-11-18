import { Navigate, Route, Routes } from "react-router-dom";
import { V2PreviewProvider } from "./V2PreviewContext";
import {
  PreviewLogin,
  PreviewSignup,
  PreviewVerifyPhone,
  PreviewRequestOtp,
  PreviewSigninOtp,
  PreviewRecovery,
  PreviewDashboard,
} from "./V2PreviewExperience";
import "./V2PreviewExperience.css";

export const V2_PREVIEW_PATH = "/__preview/m3-auth";

// This entire route tree is loaded only through App.js's DEV + explicit
// VITE_ENABLE_M3_AUTH_V2_PREVIEW gate. It has no legacy auth fallback.
export default function V2AuthPreviewRoutes() {
  return (
    <V2PreviewProvider>
      <Routes>
        <Route index element={<Navigate to="login" replace />} />
        <Route path="login" element={<PreviewLogin />} />
        <Route path="signup" element={<PreviewSignup />} />
        <Route path="confirm-phone" element={<PreviewVerifyPhone />} />
        <Route path="send-otp" element={<PreviewRequestOtp />} />
        <Route path="check-otp" element={<PreviewSigninOtp />} />
        <Route path="recovery" element={<PreviewRecovery />} />
        <Route path="dashboard" element={<PreviewDashboard />} />
        <Route path="*" element={<Navigate to="login" replace />} />
      </Routes>
    </V2PreviewProvider>
  );
}
