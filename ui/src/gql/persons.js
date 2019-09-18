import { gql } from "apollo-boost"; // or you can use `import gql from 'graphql-tag';` instead

// Person fields must be the same in CREATE_PERSON and GET_PERSONS
// for the Apollo cache to be updated
const personFields = `id email name`;

export const CREATE_PERSON = gql`
  mutation createPerson($email: String!, $name: String!) {
    createPerson(email: $email, name: $name) {
      ${personFields}
    }
  }
`;

export const GET_PERSONS = gql`
  {
    persons {
      ${personFields}
    }
  }
`;

export const GET_PERSON_WITH_TAGGINGS = gql`
  query($id: ID) {
    person(id: $id) {
      email
      name
      taggings {
        id
        on
        level
        description
        tag {
          name
        }
      }
    }
  }
`;
