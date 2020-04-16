import { gql } from 'apollo-server';

const typeDefs = gql`
  type Query {
    topics(tenantId: ID!): [Topic]!
  }

  type Topic {
    id: ID!
  }

  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Mutation {
    signIn(args: SignInInput!): Boolean!
    signUp(args: SignUpInput!): Boolean!
  }

  input SignInInput {
    email: String!
    password: String!
    tenantShortId: ID!
  }

  input SignUpInput {
    email: String!
    name: String!
    password: String!
  }
`;

export default typeDefs;
