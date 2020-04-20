import React from 'react';
import { Link } from 'react-router-dom';
import buttons from '../../../../css/buttons';
import FormResetPassword from './FormResetPassword';

const css = {
  buttons,
  success: { outer: `py-12 text-center` },
};

export default () => {
  const [isSuccess, setIsSuccess] = React.useState(false);
  const onSuccess = () => setIsSuccess(true);

  if (isSuccess)
    return (
      <div className={css.success.outer}>
        <p>Password reset successfully!</p>

        <br />

        <Link className={css.buttons.primary} to="/auth">
          Sign in
        </Link>
      </div>
    );

  return <FormResetPassword onSuccess={onSuccess} />;
};
