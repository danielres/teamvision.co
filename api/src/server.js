const { ApolloServer, AuthenticationError } = require("apollo-server");

const { verifyTokenAndGetUserInfo } = require("./auth");
const schema = require("./schema");

const server = new ApolloServer({
  schema,
  context: async ({ req }) => {
    try {
      const token = req.headers.authorization;
      const userInfo = await verifyTokenAndGetUserInfo(token);
      console.log({ userInfo });
      return { user: userInfo };
    } catch (error) {
      throw new AuthenticationError(error.message);
    }
  }
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
