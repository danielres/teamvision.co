const { ApolloServer, gql } = require("apollo-server");
const neo4jDriver = require("./neo4jDriver");

const books = [
  {
    title: "Harry Potter and the Chamber of Secrets",
    author: "J.K. Rowling"
  },
  {
    title: "Jurassic Park",
    author: "Michael Crichton"
  }
];

const typeDefs = gql`
  type Book {
    title: String
    author: String
  }

  type Query {
    books: [Book]
  }
`;

const resolvers = {
  Query: {
    books: () => books
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: { driver: neo4jDriver }
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
