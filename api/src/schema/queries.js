export default {
  SIGN_IN: /* GraphQL */ `
    mutation SignIn($args: SignInInput!) {
      signIn(args: $args) {
        id
        email
        name
      }
    }
  `,

  SIGN_UP: /* GraphQL */ `
    mutation SignUp($args: SignUpInput!) {
      signUp(args: $args)
    }
  `,
};
