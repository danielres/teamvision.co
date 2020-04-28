import React from 'react';
import Header from '../../components/Header';
import LayoutBare from './LayoutBare';

export default ({ children }) => {
  return (
    <>
      <Header />
      <LayoutBare>{children}</LayoutBare>
    </>
  );
};
