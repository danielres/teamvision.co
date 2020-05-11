import React from 'react';
import ButtonSignOut from './ButtonSignOut';
import Spacer from './Spacer';

export default ({ data, loading }) => {
  if (loading) return <div>Loading...</div>;

  return (
    <>
      {data.me.email}
      <Spacer />
      <ButtonSignOut />
    </>
  );
};
