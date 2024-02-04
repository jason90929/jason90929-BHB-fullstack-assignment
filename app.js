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
    req.oidc.isAuthenticated()
        ? res.redirect('/profile')
        : res.sendFile(join(__dirname, "src/index.html"));
});

app.get('/profile', requiresAuth(), (req, res) => {
    // res.sendFile(join(__dirname, "src/profile.ejs"))
    res.send(JSON.stringify(req.oidc.user));
    // res.render(join(__dirname, "src/profile.ejs"), {
    //     str: JSON.stringify(req.oidc.user),
    //     ...req.oidc.user,
    //     // "name": "tsaistorm@gmail.com",
    //     // "updated_at": "2024-02-04T13:02:39.275Z",
    //     // "email": "tsaistorm@gmail.com",
    //     // "email_verified": true,
    //     //     "sub": "google-oauth2|114978294798968262875"
    // });
});

module.exports = app;
