const path = require("path");
const express = require("express");
const session = require("express-session");
const { auth } = require('express-openid-connect');
const exphbs = require("express-handlebars");
const routes = require("./controllers");
// const helpers = require("./utils/helpers");

// const sequelize = require("./config/connection");
// const SequelizeStore = require("connect-session-sequelize")(session.Store);

const app = express();
const PORT = process.env.PORT || 3001;

// const hbs = exphbs.create({ helpers });

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: '!8mTcu1xDDBsOpyTnMxI;q/lnKJ>J0vgTzk[PqEcKCAX-:p3f3W?6kE8PBT:$k=p1',
  baseURL: 'http://localhost:3001',
  clientID: 'pgxhXkOq7ovZ0mAD11rcT5dPtpU2vMmU',
  issuerBaseURL: 'https://dev-oomhbcoc.us.auth0.com'
};

// const sess = {
//   secret: "!8mTcu1xDDBsOpyTnMxI;q/lnKJ>J0vgTzk[PqEcKCAX-:p3f3W?6kE8PBT:$k=p1",
//   cookie: {
//     maxAge: 30 * 24 * 60 * 60 * 1000,
//     httpOnly: true,
//     secure: false,
//     sameSite: "strict",
//   },
//   resave: false,
//   saveUninitialized: true,
//   store: new SequelizeStore({
//     db: sequelize,
//   }),
// };

app.use(auth(config));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

app.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

// app.use(session(sess));

// app.engine("handlebars", hbs.engine);
// app.set("view engine", "handlebars");

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, "public")));

// app.use(routes);

// sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log("Now listening"));
// });
