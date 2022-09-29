const path = require("path");
const express = require("express");
const session = require("express-session");
const exphbs = require("express-handlebars");
const routes = require("./controllers");
const sequelize = require('./config/connection');
const createIoInterface = require('./sockets');

const helpers = require("./utils/helper");

const SequelizeStore = require("connect-session-sequelize")(session.Store);

const app = express();
const PORT = process.env.PORT || 3001;

const hbs = exphbs.create({ helpers });
// const hbs = exphbs.create({ helpers });
// const config = {
//   authRequired: false,
//   auth0Logout: true,
//   secret: process.env.SERVER_SECRET,// Put in your .env file
//   baseURL: 'http://localhost:3001',
//   clientID: 'pgxhXkOq7ovZ0mAD11rcT5dPtpU2vMmU',
//   issuerBaseURL: 'https://dev-oomhbcoc.us.auth0.com'
// };

const sess = {
  secret: "!8mTcu1xDDBsOpyTnMxI;q/lnKJ>J0vgTzk[PqEcKCAX-:p3f3W?6kE8PBT:$k=p1",
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: false,
    sameSite: "strict",
  },
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};

const sessionMiddleware = session(sess);

app.use(sessionMiddleware);

// Create our server and io object. Io is probably not needed here, but it is returned in case we eventually do need it here.
const { io, server } = createIoInterface(app, sessionMiddleware);


app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

app.use(routes);

// code from auth0 implementation
// app.get('/', (req, res) => {
//   res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
// });

// app.use(session(sess));

sequelize.sync({ force: false }).then(() => {
  // have socket.io and express listen
  server.listen(PORT, () => console.log(`Now listening at http://localhost:${PORT}`));
});
