import express = require('express');
const helmet = require('helmet');
const auth = require('./services/auth');
const users = require('./services/users');
const me = require('./services/me');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../docs/swagger.json');

const app = express();
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
  res.sendStatus(200);
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server running on port ${port}`));

module.exports = app;
