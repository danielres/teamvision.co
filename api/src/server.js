const { ApolloServer, gql, AuthenticationError } = require("apollo-server");
const { getUser } = require("./auth");

const schema = require("./schema");

const server = new ApolloServer({
  schema,
  context: async ({ req }) => {
    try {
      // simple auth check on every request
      const user = await getUser({ token: req.headers.authorization });
      return { user };
    } catch (error) {
      throw new AuthenticationError(error.message);
    }
  }
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
