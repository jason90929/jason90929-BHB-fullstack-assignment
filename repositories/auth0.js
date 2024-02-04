const express = require("express");
const {auth, requiresAuth} = require("express-openid-connect");
const {join} = require("path");

const auth0 = express();

const config = {
    authRequired: false,
    auth0Logout: true,
    secret: 'a long, randomly-generated string stored in env',
    baseURL: 'http://localhost:3000',
    clientID: 'F536bnAdrHQ2IfxpXXDhalM67sx1LdoD',
    issuerBaseURL: 'https://dev-btzqcfy7fq2uv7xm.jp.auth0.com',
};

// auth router attaches /login, /logout, and /callback routes to the baseURL
auth0.use(auth(config));

module.exports = {
    auth0,
    requiresAuth,
}
