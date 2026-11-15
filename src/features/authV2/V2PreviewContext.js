import { createContext, useContext, useState } from "react";

const V2PreviewContext = createContext(null);

export function V2PreviewProvider({ children }) {
  const [challenge, setChallenge] = useState(null);
  const [account, setAccount] = useState(null);
  return (
    <V2PreviewContext.Provider value={{ challenge, setChallenge, account, setAccount }}>
      {children}
    </V2PreviewContext.Provider>
  );
}

export function useV2Preview() {
  return useContext(V2PreviewContext);
}
