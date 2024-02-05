const express = require("express");
const {auth0, requiresAuth} = require("../repositories/auth0")
const auth = express()
const _ = require('lodash')
const {admin} = require("../repositories/admin");

auth.use(auth0)
auth.use(admin)

module.exports = {
    auth,
    requiresAuth
}
