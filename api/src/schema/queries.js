export default {
  ME: /* GraphQL */ `
    query Me {
      me {
        id
        email
      }
    }
  `,

  SIGN_IN: /* GraphQL */ `
    mutation SignIn($args: SignInInput!) {
      signIn(args: $args)
    }
  `,

  SIGN_OUT: /* GraphQL */ `
    mutation SignOut {
      signOut
    }
  `,

  SIGN_UP: /* GraphQL */ `
    mutation SignUp($args: SignUpInput!) {
      signUp(args: $args)
    }
  `,
};
