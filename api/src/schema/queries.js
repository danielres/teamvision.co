export default {
  ME: /* GraphQL */ `
    query Me {
      me {
        id
        email
      }
    }
  `,

  RESET_PASSWORD: /* GraphQL */ `
    mutation ResetPassword($password: String!, $token: String!) {
      resetPassword(password: $password, token: $token)
    }
  `,

  RESET_PASSWORD_REQUEST: /* GraphQL */ `
    mutation ResetPasswordRequest($email: String!, $tenantShortId: String!) {
      resetPasswordRequest(email: $email, tenantShortId: $tenantShortId)
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

  VERIFY_EMAIL: /* GraphQL */ `
    mutation VerifyEmai($token: String!) {
      verifyEmail(token: $token)
    }
  `,
};
