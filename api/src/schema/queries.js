export default {
  SIGN_IN: /* GraphQL */ `
    mutation SignIn($args: SignInInput!) {
      signIn(args: $args)
    }
  `,

  SIGN_UP: /* GraphQL */ `
    mutation SignUp($args: SignUpInput!) {
      signUp(args: $args)
    }
  `,
};
