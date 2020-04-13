export default {
  SIGN_UP: /* GraphQL */ `
    mutation SignUp($args: SignUpInput!) {
      signUp(args: $args)
    }
  `,
};
