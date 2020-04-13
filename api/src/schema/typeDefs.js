import { gql } from 'apollo-server';

const typeDefs = gql`
  type Query {
    topics(tenantId: ID!): [Topic]!
  }

  type Topic {
    id: ID!
  }

  type Mutation {
    signUp(args: SignUpInput!): Boolean!
  }

  input SignUpInput {
    email: String!
    name: String!
    password: String!
  }
`;

export default typeDefs;
