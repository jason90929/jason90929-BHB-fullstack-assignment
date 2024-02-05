const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const {join} = require("path");
const {auth, requiresAuth} = require("./services/auth");

const app = express();
app.use(morgan("dev"));
app.use(helmet());

app.use(auth)
// req.isAuthenticated is provided from the auth router
app.get('/', (req, res) => {
    // req.oidc.isAuthenticated()
    //     ? res.redirect('/profile')
    //     : res.send(null);
    res.send("hello")
});
app.get('/profile', requiresAuth(), (req, res) => {
    res.send(req.oidc.user);
});

module.exports = app;
