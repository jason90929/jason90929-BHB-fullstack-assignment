const express = require("express");
const axios = require("axios")
const authConfig = require("../secret/management_config.json")

const admin = express();
const adminTokenURL = 'https://dev-btzqcfy7fq2uv7xm.jp.auth0.com/oauth/token'
const defaultHeaders= {'content-type': 'application/json'};
Object.freeze(defaultHeaders)
admin.post("/admin-login", async (req, res, next) => {
    const resp = await axios.post(adminTokenURL,
        JSON.stringify(authConfig),
        {headers: defaultHeaders},
    );

    res.send(resp.data)
    next()
})

module.exports = admin
