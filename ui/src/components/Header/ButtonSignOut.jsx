import { useMutation } from '@apollo/react-hooks';
import React from 'react';
import buttons from '../../css/buttons';
import queries from '../../queries';

const css = {
  buttons,
};

export default () => {
  const [signOut, { client }] = useMutation(queries.SIGN_OUT);

  const handleSignout = async () => {
    await signOut();
    client.writeData({ data: { me: null } });
  };

  return (
    <button className={css.buttons.text} onClick={handleSignout} type="button">
      Sign out
    </button>
  );
};
