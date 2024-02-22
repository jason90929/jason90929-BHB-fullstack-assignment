const express = require('express');
const {auth, requiresAuth} = require('express-openid-connect');
const authConfig = require('../secret/auth_config.json');

const auth0 = express();

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: 'a long, randomly-generated string stored in env',
  baseURL: 'http://localhost:3000',
  clientID: authConfig.clientId,
  issuerBaseURL: 'https://dev-btzqcfy7fq2uv7xm.jp.auth0.com',
};

const adminTokenURL = `${config.issuerBaseURL}/oauth/token`;

// auth router attaches /login, /logout, and /callback routes to the baseURL
auth0.use(auth(config));

module.exports = {
  auth0,
  adminTokenURL,
  requiresAuth,
};
