import * as React from "react";
import * as ReactDOM from "react-dom";
import { Route, Switch } from "react-router-dom";
import Topics from "./components/Topics";
import "regenerator-runtime/runtime";
import Header from "./components/Header";
import "./global.css";
import Providers from "./services/Providers";

if (module.hot) module.hot.accept();

const css = { container: `bg-white p-8 mx-auto my-8 shadow rounded` };

ReactDOM.render(
  <Providers>
    <Header />

    <div className="mx-8">
      <div className={css.container}>
        <Switch>
          <Route path="/topics">
            <Topics />
          </Route>

          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </div>
  </Providers>,
  document.getElementById("root")
);

function Home() {
  return (
    <React.Fragment>
      <h2>Home</h2>
    </React.Fragment>
  );
}
