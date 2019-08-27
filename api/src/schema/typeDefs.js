const typeDefs = /* GraphQL */ `
  schema {
    query: Query
    mutation: Mutation
  }

  type Query {
    person(email: String, id: ID): Person
    persons(search: String): [Person]
  }

  type Mutation {
    createCurrentUserPerson: Person
    updateCurrentUserPersonName(name: String!): Person
  }

  type Person {
    id: ID!
    email: String!
    name: String
    created: String
  }
`;

module.exports = typeDefs;
