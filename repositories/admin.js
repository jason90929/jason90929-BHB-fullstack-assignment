const express = require("express");
const axios = require("axios")
const authConfig = require("../secret/management_config.json")

const admin = express();
const adminTokenURL = 'https://dev-btzqcfy7fq2uv7xm.jp.auth0.com/oauth/token'
const headers= {'content-type': 'application/json'};
Object.freeze(headers)
let token = ''
admin.get("/admin-login", async (req, res, next) => {
    const resp = await axios.post(adminTokenURL,
        JSON.stringify(authConfig),
        {headers},
    );

    token = resp.data.access_token
    // res.send("ok")
    res.send(resp.data)
    next()
})
admin.get("/user-list", async (req, res, next) => {
    if (token !== '') {
        const resp = await axios.get('https://dev-btzqcfy7fq2uv7xm.jp.auth0.com/api/v2/users',
            {headers: {
                ...headers,
                'Authorization': `Bearer ${token}`
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
