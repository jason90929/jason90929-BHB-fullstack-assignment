const express = require("express");
const axios = require("axios")
const managementConfig = require("../secret/management_config.json")
const {defaultHeaders} = require("../constants");
const {jsonParser, requiresAuth, adminLogin} = require("../middlewares");
const me = express();
me.get("/me", requiresAuth(), adminLogin, (req, res, next) => {
    axios.get(`${managementConfig.audience}users/${req.oidc.user.sub}`,
        {
            headers: {
                ...defaultHeaders,
                Authorization: req.headers.authorization,
            }
        },
    ).then(function (resp) {
        res.send(resp.data)
    }).catch(function (err) {
        console.log("get user failed", err)
        res.send(`error: ${err.message}`)
    })
})

me.patch("/me", requiresAuth(), adminLogin, jsonParser, (req, res, next) => {
    axios.patch(`${managementConfig.audience}users/${req.oidc.user.sub}`, {
        name: req.body.name,
        // Add additional fields if needed
        // email_verified: req.body.email_verified,
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

me.post("/me/resend-email-verification", requiresAuth(), adminLogin, jsonParser, (req, res, next) => {
    axios.post(`${managementConfig.audience}jobs/verification-email`, {
        user_id: req.oidc.user.sub,
        // identity: {
        //     user_id: req.params.id,
        //     provider: ""
        // },
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

module.exports = me
