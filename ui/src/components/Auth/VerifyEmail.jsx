import { useMutation } from '@apollo/react-hooks';
import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import buttons from '../../css/buttons';
import queries from '../../queries';
import parseQs from '../../utils/parseQs';
import AsyncError from '../Forms/AsyncError';
import { toDashboard, toHome } from '../../pages/paths';

const css = {
  buttons,
  success: { outer: `py-12 text-center` },
};

export default () => {
  const [verifyEmail, { loading, error }] = useMutation(queries.VERIFY_EMAIL);
  const { token } = parseQs();

  React.useEffect(() => {
    if (!token) return;
    verifyEmail({ variables: { token } });
  }, [token]);

  if (loading) return <div className={css.container}>Loading...</div>;

  if (error) return <AsyncError error={error} />;

  if (!token) return <Redirect to={toHome()} />;

  return (
    <div className={css.success.outer}>
      <p>Thank you!</p>
      <br />
      <p>Your email has been verfied successfully</p>
      <br />
      <p>
        <Link className={css.buttons.primary} to={toDashboard()}>
          sign in
        </Link>
      </p>
    </div>
  );
};
