import { ApolloServer, makeExecutableSchema } from 'apollo-server-express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cookieSession from 'cookie-session';
import express from 'express';
import config from '../config';
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
      session: req.session,
    }),
  });

  const path = '/';
  const { key1, key2, secure } = config.auth.cookie;

  app.use(path, bodyParser.json(), cookieParser());

  app.use(
    cookieSession({
      name: 'session',
      keys: [key1, key2],
      maxAge: 100000,
      secure,
    }),
  );

  server.applyMiddleware({ app, path });

  return app;
};
