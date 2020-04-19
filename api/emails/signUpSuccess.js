import render from './render';

export default ({ name, email }) =>
  render({
    email,
    content: `
      Hi ${name}!

      Thank you for signing up.
      Your account has been created.

      Please click on the following link to verify your email:
      [TODO].
    `,
  });
