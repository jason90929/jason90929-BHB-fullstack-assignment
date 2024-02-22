import {Request, Response, NextFunction} from 'express-serve-static-core';
import {AxiosResponse} from 'axios';
const axios = require('axios');
const managementConfig = require('./secret/management_config.json');
import bodyParser = require('body-parser');
const {requiresAuth, adminTokenURL} = require('./repositories/auth0');
const {defaultHeaders} = require('./constants');

let adminToken: string;
function adminLogin(req: Request, res: Response, next: NextFunction) {
  if (adminToken) {
    req.headers.authorization = adminToken;
    next();
    return;
  }
  axios
    .post(
      adminTokenURL,
      JSON.stringify({
        ...managementConfig,
        grant_type: 'client_credentials',
      }),
      {headers: defaultHeaders}
    )
    .then((resp: AxiosResponse) => {
      adminToken = `Bearer ${resp.data.access_token}`;
      req.headers.authorization = adminToken;
      next();
    });
}

// create application/json parser
const jsonParser = bodyParser.json();

module.exports = {
  adminLogin,
  jsonParser,
  requiresAuth,
};
