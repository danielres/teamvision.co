/* eslint-disable react/jsx-fragments */
import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Switch } from 'react-router-dom';
import 'regenerator-runtime/runtime'; // eslint-disable-line import/no-extraneous-dependencies
import Header from './components/Header';
import Topics from './components/Topics';
import './global.css';
import Providers from './services/Providers';
import Auth from './components/Auth';

if (module.hot) module.hot.accept();

const css = { container: `bg-white p-8 mx-auto my-8 shadow rounded` };

ReactDOM.render(
  <Providers>
    <Header />

    <div className="mx-8">
      <div className={css.container}>
        <Route path="/auth">
          <Auth />
        </Route>

        <Switch>
          <Route path="/topics">
            <Topics />
          </Route>

          <Route path="/" exact>
            <Home />
          </Route>
        </Switch>
      </div>
    </div>
  </Providers>,
  document.getElementById('root'),
);

function Home() {
  return (
    <>
      <h2>Home</h2>
    </>
  );
}
