import { gql } from "apollo-boost";

export const TOPICS = gql`
  query Topics($tenantId: ID!) {
    topics(tenantId: $tenantId) {
      id
    }
  }
`;
