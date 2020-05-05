const express = require('express');
const http = require('http');
const Io = require('socket.io');
const { Mailcatcher } = require('..');

const config = require('../config');
const viewEmail = require('./views/viewEmail');
const logEmail = require('./logEmail');
const viewEmailNotFound = require('./views/viewEmailNotFound');

const socketIoClientFile = require.resolve('socket.io-client/dist/socket.io');

const app = express();
const server = http.createServer(app);
const io = Io(server);

const { port } = config.mailcatcher.ui;
const { logger: log } = config.mailcatcher;
const host = 'localhost';

const mailcatcher = Mailcatcher({
  onEmail: email => {
    logEmail({ email, url: `http://${host}:${port}/last` });
    io.emit('browserReload');
  },
});

const serve = async () => {
  await mailcatcher.listen();

  app.get('/scripts/socket.io.js', (req, res) => res.sendFile(socketIoClientFile));

  app.get('/', (req, res) => res.json(mailcatcher.read()));

  app.get('/last', (req, res) => {
    const lastEmail = mailcatcher.read().reverse()[0];
    res.send(lastEmail ? viewEmail(lastEmail) : viewEmailNotFound());
  });

  server.listen(port, host, () => {
    log(`[mailcatcher] UI listening on http://${host}:${port}`);
  });

  io.on('connection', () => {
    log('[mailcatcher] A user is connected');
  });
};

serve();
