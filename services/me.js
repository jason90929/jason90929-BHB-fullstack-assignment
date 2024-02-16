const express = require("express");
const axios = require("axios")
const authConfig = require("../secret/management_config.json")
const {defaultHeaders} = require("../constants");
const {jsonParser, requiresAuth, adminLogin} = require("../middlewares");
const me = express();
me.get("/me", requiresAuth(), adminLogin, async (req, res, next) => {
    console.log('req.oidc.user', req.oidc.user)
    try {
        const resp = await axios.get(`${authConfig.audience}users/${req.oidc.user.sub}`,
            {
                headers: {
                    ...defaultHeaders,
                    Authorization: req.headers.authorization,
                }
            },
        )
        res.send(resp.data)
    } catch (err) {
        console.log('err', err)
        res.send(`error: ${err.message}`)
    }
})

me.patch("/me", requiresAuth(), adminLogin, jsonParser, async (req, res, next) => {
    try {
        const resp = await axios.patch(`${authConfig.audience}users/${req.oidc.user.sub}`, {
                name: req.body.name,
                password: req.body.password,
                // Add additional fields if needed
            },
            {
                headers: {
                    ...defaultHeaders,
                    Authorization: req.headers.authorization,
                }
            }
        )
        res.send(resp.data)
    } catch (err) {
        res.send(`error: ${err.message}`)
    }
})

me.post("/me/resend-email-verification", requiresAuth(), adminLogin, jsonParser, async (req, res, next) => {
    try {
        const resp = await axios.post(`${authConfig.audience}jobs/verification-email`, {
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
            }
        )
        res.send(resp.data)
    } catch (err) {
        res.send(`error: ${err.message}`)
    }
})

module.exports = me
