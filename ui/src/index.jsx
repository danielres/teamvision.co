import React from 'react';
import ReactDOM from 'react-dom';
import 'regenerator-runtime/runtime'; // eslint-disable-line import/no-extraneous-dependencies
import EnvHeader from './components/EnvHeader';
import './global.css';
import Pages from './pages';
import Providers from './services/Providers';

if (module.hot) module.hot.accept();

ReactDOM.render(
  <Providers>
    <EnvHeader />
    <Pages />
  </Providers>,
  document.getElementById('root'),
);
