import React from "react";

import { useAuth0 } from "./auth0";

export default function Protected({ children }) {
  const { isAuthenticated } = useAuth0();
  if (isAuthenticated) return <>{children}</>;
  return null;
}
