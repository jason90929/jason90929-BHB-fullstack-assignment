import express = require('express');
import morgan = require('morgan');
const helmet = require('helmet');
const auth = require('./services/auth');
const users = require('./services/users');
const me = require('./services/me');

const app = express();
app.use(morgan('dev'));
app.use(helmet());

app.use(auth);
app.use(users);
app.use(me);

// req.isAuthenticated is provided from the auth router
app.get('/', (req, res) => {
  // req.oidc.isAuthenticated()
  //     ? res.redirect('/profile')
  //     : res.send(null);
  res.send('hello');
});
app.get('/healthcheck', (req, res) => {
  // req.oidc.isAuthenticated()
  //     ? res.redirect('/profile')
  //     : res.send(null);
  res.sendStatus(200);
});

module.exports = app;
