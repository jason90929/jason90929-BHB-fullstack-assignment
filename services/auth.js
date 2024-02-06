const express = require("express");
const {auth0, requiresAuth} = require("../repositories/auth0")
const auth = express()
const _ = require('lodash')
const {admin} = require("./admin");

auth.use(auth0)

module.exports = {
    auth,
    requiresAuth
}
