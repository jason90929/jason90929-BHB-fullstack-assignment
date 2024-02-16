const express = require("express");
const axios = require("axios")
const authConfig = require("../secret/management_config.json")
const {defaultHeaders} = require("../constants");
const {adminLogin} = require("../middlewares");
const users = express();
users.get("/users", adminLogin, async (req, res, next) => {
    try {
        const resp = await axios.get(`${authConfig.audience}users`,
            {
                headers: {
                    ...defaultHeaders,
                    Authorization: req.headers.authorization,
                }
            },
        )
        res.send(resp.data)
    } catch (err) {
        res.send(err)
    }
})

module.exports = users
