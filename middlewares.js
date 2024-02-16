const axios = require("axios");
const authConfig = require("./secret/management_config.json");
const bodyParser = require('body-parser')
const adminTokenURL = 'https://dev-btzqcfy7fq2uv7xm.jp.auth0.com/oauth/token'
const {requiresAuth} = require("./repositories/auth0");
const {defaultHeaders} = require("./constants");

let adminToken
function adminLogin (req, res, next) {
    if (adminToken) {
        req.headers.authorization = adminToken
        next()
        return
    }
    axios.post(adminTokenURL,
        JSON.stringify(authConfig),
        {headers: defaultHeaders},
    ).then(function (resp) {
        adminToken = `Bearer ${resp.data.access_token}`
        req.headers.authorization = adminToken
        next()
    });
}

// create application/json parser
var jsonParser = bodyParser.json()

module.exports = {
    adminLogin,
    jsonParser,
    requiresAuth,
}
