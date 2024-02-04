const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const { auth, requiresAuth } = require('express-openid-connect');
const {join} = require("path");

const app = express();
app.use(morgan("dev"));
app.use(helmet());
app.use(express.static(join(__dirname, "public")));

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: 'a long, randomly-generated string stored in env',
  baseURL: 'http://localhost:3000',
  clientID: 'F536bnAdrHQ2IfxpXXDhalM67sx1LdoD',
  issuerBaseURL: 'https://dev-btzqcfy7fq2uv7xm.jp.auth0.com'
};

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// req.isAuthenticated is provided from the auth router
app.get('/', (req, res) => {
  req.oidc.isAuthenticated()
      ? res.redirect('/profile')
      : res.sendFile(join(__dirname, "src/index.html"));
});

app.get('/profile', requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
});

module.exports = app;
