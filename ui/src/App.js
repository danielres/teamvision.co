import React from "react";

import Nav from "./Nav";
import Persons from "./Persons";
import Profile from "./Profile";
import Protected from "./Protected";

export default function App() {
  return (
    <>
      <Nav />
      <Protected>
        <Profile />
        <Persons />
      </Protected>
    </>
  );
}
