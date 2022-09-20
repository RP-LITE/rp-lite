const http = require('http');
const https = require('https');
const { Server } = require('socket.io');
// This code adapted from https://socket.io/how-to/use-with-express-session
/**
 * Converts the session middleware to io middleware
 * @param {Session} middleware - The session middleware
 * @returns {IOMiddleware}
 */
const socketWrapper = middleware => (socket, next) => middleware(socket.request, {}, next);

/**
 * Creates the socket.io interface for use with express
 * @param {Express} app - The express app
 * @param {Session} session - The express-session middleware
 * @returns {object} - Returns the io and server objects. Also adds the io object to the app and adds a client store array to the app.
 */
const createIoInterface = (app,session) => {
  // Use https when deployed live
  const httpType = process.env.JAWSDB_URL ? https : http;
  const server = httpType.createServer(app);
  const io = new Server(server);

  io.use(socketWrapper(session));
  io.use((socket,next) => {
    const ioSession = socket.request.session;
    if(ioSession?.authenticated){
      next();
    }else{
      next(new Error('Unauthorized access'));
    }
  });
  io.on('connection',function(socket){
    const userID = socket.request.session.user_id;

    // TODO: Need to connect the socket and user information
    console.log('user connected');
  });
  app.set('clients', []);
  // Store reference to io in the app for use in routes.
  app.set('io',io);

  return { io, server };
};

module.exports = createIoInterface;