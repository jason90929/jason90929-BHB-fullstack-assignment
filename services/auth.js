const express = require("express");
const {auth0} = require("../repositories/auth0")
const auth = express()

auth.use(auth0)

module.exports = {
    auth,
}
