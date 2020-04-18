import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import parseQs from '../../utils/parseQs';
import FormSignIn from './FormSignIn';
import FormSignUp from './FormSignUp';

const css = {
  heading: `text-xl mb-4 text-gray-800`,
  columns: { outer: `flex -mx-8` },
  column: {
    left: `w-1/2 px-12 border-r`,
    right: `w-1/2 px-12`,
  },
  notice: { outer: `my-10 text-gray-600` },
};

// FIXME:
const defaultValues = {
  email: 'bob@example.com',
  name: 'Bob',
  password: '123456A!',
  tenantShortId: parseQs().t,
};

export default () => {
  const history = useHistory();
  const toHome = () => history.push('/');
  const [isSignupSuccess, setIsSignupSuccess] = useState(false);
  const onSignupSuccess = () => setIsSignupSuccess(true);

  return (
    <div className={css.columns.outer}>
      <section className={css.column.left}>
        <h2 className={css.heading}>Sign In</h2>
        <FormSignIn defaultValues={defaultValues} onSuccess={toHome} />
      </section>

      <section className={css.column.right}>
        <h2 className={css.heading}>Sign Up</h2>

        {isSignupSuccess ? (
          <section className={css.notice.outer}>
            <p>Almost there, thank you for registering!</p>
            <br />
            <p>Please check your emails to confirm your account.</p>
          </section>
        ) : (
          <FormSignUp defaultValues={defaultValues} onSuccess={onSignupSuccess} />
        )}
      </section>
    </div>
  );
};
