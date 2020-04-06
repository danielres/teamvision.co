import { ApolloServer, makeExecutableSchema } from 'apollo-server-express';
import bodyParser from 'body-parser';
import express from 'express';
import resolvers from './schema/resolvers';
import typeDefs from './schema/typeDefs';

export const Server = () => {
  const app = express();

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  const server = new ApolloServer({
    schema,
    context: ({ req, res }) => ({
      req,
      res,
    }),
  });

  app.use('/', bodyParser.json());

  server.applyMiddleware({
    app,
    path: '/',
  });

  return app;
};
