const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const {join} = require("path");
const {auth, requiresAuth} = require("./services/auth");
const admin = require("./services/admin");
const users = require("./services/users");

const app = express();
app.use(morgan("dev"));
app.use(helmet());

app.use(auth)
app.use(admin)
app.use(users)

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
