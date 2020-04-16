import request from 'supertest';
import { Server } from '../src/server';

export const GraphqlClient = ({ server = Server() } = {}) => {
  const client = {};

  // FIXME: no need for separate query + mutate
  client.mutate = ({ headers: reqHeaders, query, variables }) => {
    return request(server)
      .post('/graphql')
      .set({ Accept: 'application/json', ...reqHeaders })
      .send({ query, variables })
      .then(({ body, headers }) => ({ body, headers }));
  };

  client.query = client.mutate;

  return client;
};
