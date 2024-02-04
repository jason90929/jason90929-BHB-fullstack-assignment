const express = require("express");
const {auth0, requiresAuth} = require("../repositories/auth0")
const auth = express()

auth.use(auth0)

module.exports = {
    auth,
    requiresAuth
}
