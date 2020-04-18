import React from 'react';
import { Link } from 'react-router-dom';
import buttons from '../../css/buttons';
import ButtonSignOut from './ButtonSignOut';
import Spacer from './Spacer';

const css = {
  buttons,
};

export default ({ data, loading }) => {
  if (loading) return <div>Loading...</div>;

  if (data && data.me)
    return (
      <>
        {data.me.email}
        <Spacer />
        <ButtonSignOut />
      </>
    );

  return (
    <Link className={css.buttons.text} to="/auth">
      SignIn
    </Link>
  );
};
