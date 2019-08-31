const cookieParser = require("cookie-parser");
const express = require("express");
const http = require("http");
const { ApolloServer } = require("apollo-server-express");

const authMiddleware = require("./authMiddleware");
const env = require("./env");
const schema = require("./schema");

const app = express()
  .use(cookieParser())
  .use(authMiddleware);

app.get("/authenticate", (req, res) => {
  // Route provided for using authMiddleware alone
  res.end();
});

app.get("/logout", (req, res) => {
  res.cookie("uptal_jwt", "", { expires: new Date(0) });
  res.cookie("uptal_authenticated", "", { expires: new Date(0) });
  res.end();
});

const httpServer = http.createServer(app);

const graphQlServer = new ApolloServer({
  schema,
  context: async ({ req, res }) => {
    try {
      return { isAuthenticated: req.isAuthenticated, userInfo: req.userInfo };
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  }
});

graphQlServer.applyMiddleware({ app });

httpServer.listen({ port: env.PORT }, () => {
  console.log(`🚀 Socket.io ready at http://localhost:${env.PORT}`);
  console.log(
    `🚀 GraphQl ready at http://localhost:${env.PORT}${graphQlServer.graphqlPath}`
  );
});
