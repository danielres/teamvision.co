import { Server } from './server';
import config from '../config';

const server = Server();
const { port } = config.api;

server.listen({ port }, () => {
  console.log(`🚀 Server ready at ${port}`); // eslint-disable-line no-console
});
