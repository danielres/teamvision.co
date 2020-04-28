/* eslint-disable no-nested-ternary */
import { useQuery } from '@apollo/react-hooks';
import React from 'react';
import { Route } from 'react-router-dom';
import FormSignIn from '../components/Auth/Sign/FormSignIn';
import queries from '../queries';
import LayoutBare from './layouts/LayoutBare';
import LayoutWithHeader from './layouts/LayoutWithHeader';

export default ({ children, exact, path }) => {
  return (
    <Route exact={exact} path={path}>
      <Children>{children}</Children>
    </Route>
  );
};

const Children = ({ children }) => {
  const { data, loading } = useQuery(queries.ME);

  if (loading) return <LayoutBare>Loading...</LayoutBare>;

  if (data && data.me) return <LayoutWithHeader>{children}</LayoutWithHeader>;

  return (
    <LayoutBare>
      <FormSignIn />
    </LayoutBare>
  );
};
