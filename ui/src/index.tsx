import * as React from "react";
import * as ReactDOM from "react-dom";
import { Route, Switch } from "react-router-dom";
import "regenerator-runtime/runtime";
import Header from "./components/Header";
import "./global.css";
import Providers from "./services/Providers";

if (module.hot) module.hot.accept();

const css = { container: `bg-white p-8 mx-auto my-8 shadow rounded` };

ReactDOM.render(
  <Providers>
    <Header />

    <Switch>
      <Route path="/">
        <Home />
      </Route>
    </Switch>
  </Providers>,
  document.getElementById("root")
);

function Home() {
  return (
    <div className="mx-8">
      <div className={css.container}>
        <h2>Home</h2>
      </div>
    </div>
  );
}
