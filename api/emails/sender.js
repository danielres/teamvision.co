import resetPasswordRequestFailureAltTenants from './generators/resetPasswordRequestFailureAltTenants';
import resetPasswordRequestSuccess from './generators/resetPasswordRequestSuccess';
import verifyEmail from './generators/verifyEmail';
import sendMail from './lib/sendMail';

export default {
  resetPasswordRequestFailureAltTenants: ({ email: to, ...rest }) => {
    const { html, text } = resetPasswordRequestFailureAltTenants(rest);
    return sendMail({ to, subject: 'Password reset, please retry', html, text });
  },

  resetPasswordRequestSuccess: ({ email: to, ...rest }) => {
    const { html, text } = resetPasswordRequestSuccess(rest);
    return sendMail({ to, subject: 'Password reset', html, text });
  },

  verifyEmail: ({ email: to, ...rest }) => {
    const { html, text } = verifyEmail(rest);
    return sendMail({ to, subject: 'Please verify your email', html, text });
  },
};
