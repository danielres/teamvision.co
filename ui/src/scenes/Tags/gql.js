import { gql } from "apollo-boost"; // or you can use `import gql from 'graphql-tag';` instead

export const CREATE_TAG = gql`
  mutation createTag($name: String!, $description: String!) {
    createTag(name: $name, description: $description) {
      name
      description
    }
  }
`;

export const GET_TAGS = gql`
  {
    tags {
      name
      description
    }
  }
`;
