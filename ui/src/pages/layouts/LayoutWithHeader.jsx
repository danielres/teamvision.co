import React from 'react';
import AppHeader from '../../components/AppHeader';
import LayoutBare from './LayoutBare';

export default ({ children }) => {
  return (
    <>
      <AppHeader />
      <LayoutBare>{children}</LayoutBare>
    </>
  );
};
