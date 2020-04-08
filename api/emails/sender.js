/* eslint-disable no-console */
export default {
  signUpSuccess: ({ name, email }) => {
    console.log('');
    console.log(`== SEND EMAIL to ${email} `.padEnd(70, '='));
    console.log(`
      Hi ${name}!

      Thank you for signing up.
      Your account has been created.

      Please click on the following link to verify your email:
      [TODO].
    `);
    console.log(''.padEnd(70, '='));
    console.log('');
  },
};
