import request from 'supertest';
import { Server } from '../src/server';

export const GraphqlClient = ({ server = Server() } = {}) => {
  const client = {};

  client.mutate = ({ query, variables }) =>
    request(server)
      .post('/graphql')
      .set('Accept', 'application/json')
      .send({ query, variables })
      .then(({ body }) => body);

  return client;
};
