import { Server } from './server';

const server = Server();
const port = process.env.PORT || 3300;

server.listen({ port }, () => {
  console.log(`🚀 Server ready at ${port}`); // eslint-disable-line no-console
});
