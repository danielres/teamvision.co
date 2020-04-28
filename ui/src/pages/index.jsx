/* eslint-disable no-nested-ternary */
import React from 'react';
import { Switch } from 'react-router-dom';
import FormResetPassword from '../components/Auth/FormResetPassword';
import FormResetPasswordRequest from '../components/Auth/FormResetPasswordRequest';
import Sign from '../components/Auth/Sign';
import FormSignUp from '../components/Auth/Sign/FormSignUp';
import VerifyEmail from '../components/Auth/VerifyEmail';
import Topics from '../components/Topics';
import Protected from './PageProtected';
import Public from './PagePublic';
import { paths } from './paths';

export default () => {
  return (
    <Switch>
      <Public path={paths.HOME} exact>
        <Sign />
      </Public>

      <Public path={paths.SIGN_UP} exact>
        <FormSignUp />
      </Public>

      <Public path={paths.PASSWORD_RESET_REQUEST} exact>
        <FormResetPasswordRequest />
      </Public>

      <Public path={paths.PASSWORD_RESET} exact>
        <FormResetPassword />
      </Public>

      <Public path={paths.VERIFY_EMAIL} exact>
        <VerifyEmail />
      </Public>

      <Protected path={paths.DASHBOARD} exact>
        <Dashboard />
      </Protected>

      <Protected path={paths.TOPICS}>
        <Topics />
      </Protected>
    </Switch>
  );
};

const Dashboard = () => {
  return <div>DASHBOARD</div>;
};
