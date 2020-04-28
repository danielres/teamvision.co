/* eslint-disable no-nested-ternary */
import React from 'react';
import { Route } from 'react-router-dom';
import LayoutBare from './layouts/LayoutBare';

export default ({ children, exact, path }) => {
  return (
    <Route exact={exact} path={path}>
      <LayoutBare>{children}</LayoutBare>
    </Route>
  );
};
