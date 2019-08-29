import React from "react";

import { useAuth0 } from "./auth0";

export default function Nav() {
  const props = useAuth0();
  const { isAuthenticated, logout } = props;
  const login = () => props.loginWithPopup();

  return (
    <>
      <div>
        {isAuthenticated ? (
          <button onClick={logout}>Logout</button>
        ) : (
          <button onClick={login}>Login</button>
        )}
      </div>
      <hr />
    </>
  );
}
