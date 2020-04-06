import { gql } from 'apollo-server';

const typeDefs = gql`
  type Query {
    topics(tenantId: ID!): [Topic]!
  }

  type Topic {
    id: ID!
  }
`;

export default typeDefs;
