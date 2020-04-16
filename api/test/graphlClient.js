import request from 'supertest';
import { Server } from '../src/server';

const server = Server();

export default ({ headers: reqHeaders, query, variables }) =>
  request(server)
    .post('/graphql')
    .set({ Accept: 'application/json', ...reqHeaders })
    .send({ query, variables })
    .then(({ body, headers }) => ({ body, headers }));
