import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import { useAuth } from "./auth";
import Navbar from "./Navbar";
import Persons from "./Persons";
import Profile from "./Profile";

function Home() {
  return <div>Welcome on the Uptal platform!</div>;
}

function NoMatch() {
  return <div>Page not found :(</div>;
}

export default function App() {
  const { isAuthenticated, login } = useAuth();

  if (isAuthenticated)
    return (
      <Router>
        <Navbar />

        <Switch>
          <Route path="/" component={Home} exact />
          <Route path="/persons/" component={Persons} />
          <Route path="/profile/" component={Profile} />
          <Route component={NoMatch} />
        </Switch>
      </Router>
    );

  return (
    <div>
      <button onClick={login}>Login</button>
    </div>
  );
}
