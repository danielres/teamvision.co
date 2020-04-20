import React from 'react';
import { Link } from 'react-router-dom';
import buttons from '../../../../css/buttons';
import FormResetPasswordRequest from './FormResetPasswordRequest';

const css = {
  buttons,
  success: { outer: `py-12 text-center` },
};

export default () => {
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [email, setEmail] = React.useState('');

  const onSuccess = ({ email: successEmail }) => {
    setIsSuccess(true);
    setEmail(successEmail);
  };

  if (isSuccess)
    return (
      <div className={css.success.outer}>
        <p>Password reset instructions have been sent to your email:</p>
        <p className="my-4">{email}</p>

        <br />

        <Link className={css.buttons.primary} to="/auth">
          Back
        </Link>
      </div>
    );

  return <FormResetPasswordRequest onSuccess={onSuccess} />;
};
