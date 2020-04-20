import React from 'react';
import parseQs from '../../../utils/parseQs';
import FormResetPassword from './FormResetPassword';
import FormResetPasswordRequest from './FormResetPasswordRequest';

export default () => {
  const { token } = parseQs();
  if (token) return <FormResetPassword />;
  return <FormResetPasswordRequest />;
};
