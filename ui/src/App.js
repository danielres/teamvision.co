import React from "react";

import { useAuth } from "./auth";
import Nav from "./Nav";
import Persons from "./Persons";
import Profile from "./Profile";

export default function App() {
  const { isAuthenticated, login } = useAuth();

  if (isAuthenticated)
    return (
      <>
        <Nav />
        <hr />
        <Persons />
        <Profile />
      </>
    );

  return (
    <div>
      <button onClick={login}>Login</button>
    </div>
  );
}
