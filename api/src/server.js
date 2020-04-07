import { ApolloServer, makeExecutableSchema } from 'apollo-server-express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express from 'express';
import resolvers from './schema/resolvers';
import typeDefs from './schema/typeDefs';

const path = '/';

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

  app.use(path, bodyParser.json(), cookieParser());

  server.applyMiddleware({
    app,
    path: '/',
  });

  server.applyMiddleware({ app, path });

  return app;
};
