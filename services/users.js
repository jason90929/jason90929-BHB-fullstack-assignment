const express = require("express");
const axios = require("axios")
const authConfig = require("../secret/management_config.json")
const {defaultHeaders} = require("../constants");
const {adminLogin} = require("../middlewares");
const users = express();
users.get("/users", adminLogin, (req, res, next) => {
    axios.get(`${authConfig.audience}users`,
        {
            headers: {
                ...defaultHeaders,
                Authorization: req.headers.authorization,
            }
        },
    ).then(function (resp) {
        res.send(resp.data)
    }).catch(function (err) {
        console.log("get users failed", err)
        res.send(`error: ${err.message}`)
    })
})

module.exports = users
