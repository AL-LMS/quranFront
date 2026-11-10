import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { localDemoAuthApi } from "./localDemoApi";

const LocalDemoAuthContext = createContext(null);

export function LocalDemoAuthProvider({ children }) {
  const [account, setAccount] = useState(null);
  const [status, setStatus] = useState("checking");
  const [sessionError, setSessionError] = useState(null);

  const refreshSession = useCallback(async ({ signal } = {}) => {
    try {
      const current = await localDemoAuthApi.currentUser({ signal });
      setAccount(current);
      setSessionError(null);
      setStatus("authenticated");
      return current;
    } catch (error) {
      if (error?.name === "AbortError") return null;
      if (error?.status === 401) {
        setAccount(null);
        setSessionError(null);
        setStatus("anonymous");
        return null;
      }
      setSessionError(error);
      setStatus("unavailable");
      return null;
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void refreshSession({ signal: controller.signal });
    return () => controller.abort();
  }, [refreshSession]);

  useEffect(() => {
    if (status !== "authenticated") return undefined;
    const timer = window.setInterval(() => {
      void refreshSession();
    }, 60_000);
    return () => window.clearInterval(timer);
  }, [refreshSession, status]);

  const login = useCallback(async (alias, password) => {
    const authenticatedAccount = await localDemoAuthApi.login(alias, password);
    setAccount(authenticatedAccount);
    setSessionError(null);
    setStatus("authenticated");
    return authenticatedAccount;
  }, []);

  const createOtpChallenge = useCallback(
    (alias) => localDemoAuthApi.createOtpChallenge(alias),
    []
  );

  const verifyOtp = useCallback(async (challengeId, code) => {
    const authenticatedAccount = await localDemoAuthApi.verifyOtp(challengeId, code);
    setAccount(authenticatedAccount);
    setSessionError(null);
    setStatus("authenticated");
    return authenticatedAccount;
  }, []);

  const logout = useCallback(async () => {
    try {
      await localDemoAuthApi.logout();
    } catch (error) {
      if (error?.status !== 401) throw error;
    }
    setAccount(null);
    setSessionError(null);
    setStatus("anonymous");
  }, []);

  const value = useMemo(
    () => ({
      account,
      status,
      sessionError,
      login,
      createOtpChallenge,
      verifyOtp,
      logout,
      refreshSession,
    }),
    [
      account,
      status,
      sessionError,
      login,
      createOtpChallenge,
      verifyOtp,
      logout,
      refreshSession,
    ]
  );

  return (
    <LocalDemoAuthContext.Provider value={value}>
      {children}
    </LocalDemoAuthContext.Provider>
  );
}

export function useLocalDemoAuth() {
  const context = useContext(LocalDemoAuthContext);
  if (!context) {
    throw new Error("useLocalDemoAuth must be used inside LocalDemoAuthProvider");
  }
  return context;
}
