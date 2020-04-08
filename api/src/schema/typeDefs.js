import { gql } from 'apollo-server';

const typeDefs = gql`
  type Query {
    topics(tenantId: ID!): [Topic]!
  }

  type Topic {
    id: ID!
  }

  type Mutation {
    signUp(email: String!, name: String!, password: String!): Boolean!
  }
`;

export default typeDefs;
