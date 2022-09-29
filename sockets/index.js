const http = require('http');
const { Server } = require('socket.io');

const { Connection } = require('../models');
const updateChallengers = require('./updateChallengers');
// This code adapted from https://socket.io/how-to/use-with-express-session
/**
 * Converts the session middleware to io middleware
 * @param {Session} middleware - The session middleware
 * @returns {IOMiddleware}
 */
const socketWrapper = middleware => (socket, next) => middleware(socket.request, {}, next);

/**
 * Creates the socket.io interface for use with express
 * @param {object} app - The express app
 * @param {function} session - The express-session middleware
 * @returns {object} - Returns the io and server objects. Also adds the io object to the app and adds a client store array to the app.
 */
const createIoInterface = (app, session) => {
  // Use https when deployed live
  const server = http.createServer(app);
  const io = new Server(server);

  io.use(socketWrapper(session));
  io.use((socket, next) => {
    const ioSession = socket.request.session;
    if (ioSession?.logged_in) {
      next();
    } else {
      next(new Error('Unauthorized access'));
    }
  });
  io.on('connection', async (socket) => {
    const userID = socket.request.session.user_id;
    const userConnection = await Connection.create({
      id: socket.id,
      user_id: userID
    });
    console.log('user connected');
    socket.on('disconnect', () => {
      console.log('disconnected user');
      userConnection.destroy();
    });
  });

  // Store reference to io in the app for use in routes.

  app.use((req, res, next) => {
    req.io = io;
    req.updateChallengers = function(){
      updateChallengers(io, ...arguments);
    }
    next();
  })

  return { io, server };
};

module.exports = createIoInterface;