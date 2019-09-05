import { gql } from "apollo-boost"; // or you can use `import gql from 'graphql-tag';` instead

export const CREATE_PERSON = gql`
  mutation createPerson($email: String!, $name: String!) {
    createPerson(email: $email, name: $name) {
      email
      name
    }
  }
`;

export const GET_PERSONS = gql`
  {
    persons {
      id
      email
      name
    }
  }
`;
