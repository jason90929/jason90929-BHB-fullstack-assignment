const express = require("express");
const {auth0, adminTokenURL} = require("../repositories/auth0");
const axios = require("axios");
const managementConfig = require("../secret/management_config.json");
const {requiresAuth, jsonParser, adminLogin} = require("../middlewares");
const authConfig = require("../secret/auth_config.json");
const {defaultHeaders} = require("../constants");
const auth = express()

auth.use(auth0)

auth.post("/update-password", requiresAuth(), adminLogin, jsonParser, (req, res, next) => {
    // FIXME
    axios.post(adminTokenURL,
        new URLSearchParams({
            client_id: managementConfig.client_id,
            client_secret: managementConfig.client_secret,
            audience: managementConfig.audience,
            grant_type: 'password',
            username: req.body.email,
            password: req.body.password,
        }),
        {
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
            }
        },
    ).then(function (resp) {
        res.send(resp.data)
        //TODO
    }).catch(function (err) {
        console.log("check password failed", err)
        res.send(`error: ${err.message}`)
    })

    axios.patch(`${managementConfig.audience}users/${req.oidc.user.sub}`, {
            password: req.body.password,
            // email_verified: req.body.email_verified,
            // Add additional fields if needed
        },
        {
            headers: {
                ...defaultHeaders,
                Authorization: req.headers.authorization,
            }
        }).then(function (resp) {
        res.send(resp.data)
    }).catch(function (err) {
        console.log("patch user failed", err)
        res.send(`error: ${err.message}`)
    })
})

module.exports = {
    auth,
}
