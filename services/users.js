const express = require("express");
const axios = require("axios")
const authConfig = require("../secret/management_config.json")
var bodyParser = require('body-parser')

// create application/json parser
var jsonParser = bodyParser.json()

const users = express();
const defaultHeaders = {'content-type': 'application/json'};
Object.freeze(defaultHeaders)
users.get("/users", async (req, res, next) => {
    if (req.headers.authorization !== '') {
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
    } else {
        res.send("Unauthorized")
    }
    next()
})

users.get("/users/:id", async (req, res, next) => {
    if (req.headers.authorization !== '') {
        try {
            const resp = await axios.get(`${authConfig.audience}users/${req.params.id}`,
                {
                    headers: {
                        ...defaultHeaders,
                        Authorization: req.headers.authorization,
                    }
                },
            )
            res.send(resp.data)
        } catch (err) {
            res.send(`error: ${err.message}`)
        }
    } else {
        res.send("Unauthorized")
    }
    next()
})

users.patch("/users/:id", jsonParser, async (req, res, next) => {
    if (req.headers.authorization !== '') {
        try {
            const resp = await axios.patch(`${authConfig.audience}users/${req.params.id}`, {
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
    } else {
        res.send("Unauthorized")
    }
    next()
})

module.exports = users
