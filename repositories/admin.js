const express = require("express");
const axios = require("axios")
const authConfig = require("../secret/management_config.json")

const admin = express();
const adminTokenURL = 'https://dev-btzqcfy7fq2uv7xm.jp.auth0.com/oauth/token'
const headers= {'content-type': 'application/json'};
Object.freeze(headers)
admin.post("/admin-login", async (req, res, next) => {
    const resp = await axios.post(adminTokenURL,
        JSON.stringify(authConfig),
        {headers},
    );

    res.send(resp.data)
    next()
})
admin.get("/user-list", async (req, res, next) => {
    if (req.headers.authorization !== '') {
        const resp = await axios.get('https://dev-btzqcfy7fq2uv7xm.jp.auth0.com/api/v2/users',
            {headers: {
                ...headers,
                Authorization: req.headers.authorization,
            }},
        );

        res.send(resp.data)
    } else {
        res.send("Unauthorized")
    }
    next()
})

module.exports = {
    admin,
}
