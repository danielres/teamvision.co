const typeDefs = /* GraphQL */ `
  schema {
    query: Query
    mutation: Mutation
  }

  type Query {
    person(email: String, id: ID): Person
    persons(search: String): [Person]
    tags(search: String): [Tag]
    userInfo: User
  }

  type User {
    email: String!
    email_verified: Boolean
    picture: String
    given_name: String
    family_name: String
    name: String
    locale: String
    updated_at: String
  }

  type Mutation {
    createPerson(email: String!, name: String!): Person
    createTag(name: String!, description: String): Tag
    createCurrentUserPerson: Person
    updateCurrentUserPersonName(name: String!): Person
  }

  type Person {
    id: ID!
    email: String!
    name: String
    created: String
  }

  type Tag {
    id: ID!
    name: String!
    description: String
    created: String
  }
`;

module.exports = typeDefs;
