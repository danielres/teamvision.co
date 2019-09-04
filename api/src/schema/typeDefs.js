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
    applyTagging(
      name: String!
      description: String
      targetLabel: String!
      targetKey: String!
      targetValue: String!
    ): TaggingRelationship!
    createCurrentUserPerson: Person
    updateCurrentUserPersonName(name: String!): Person
  }

  type Person {
    id: ID!
    email: String!
    name: String
    created: String
  }

  type TaggingRelationship {
    id: ID!
    description: String
    tag: Tag!
    target: TaggingRelationshipTarget!
  }

  type TaggingRelationshipTarget {
    id: ID!
    label: String!
    name: String
    description: String
  }

  type Tag {
    id: ID!
    name: String!
    description: String
    created: String
  }
`;

module.exports = typeDefs;
