import express = require('express');
import {Request, Response} from 'express-serve-static-core';
import {AxiosError, AxiosResponse} from 'axios';
import {URLSearchParams} from 'url';
const {auth0, adminTokenURL} = require('../repositories/auth0');
const axios = require('axios');
const managementConfig = require('../secret/management_config.json');
const {requiresAuth, jsonParser, adminLogin} = require('../middlewares');
const {defaultHeaders} = require('../constants');
const auth = express();

auth.use(auth0);

interface OIDC {
  oidc: {
    user: {
      sub: string;
    };
  };
}

auth.post(
  '/update-password',
  requiresAuth(),
  adminLogin,
  jsonParser,
  (req: Request, res: Response) => {
    const newReq: Request & OIDC = Object.assign(req);
    axios
      .post(
        adminTokenURL,
        new URLSearchParams({
          client_id: managementConfig.client_id,
          client_secret: managementConfig.client_secret,
          audience: managementConfig.audience,
          grant_type: 'password',
          username: req.body.email,
          password: req.body.password,
        }),
        {
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
          },
        }
      )
      .then((resp: AxiosResponse) => {
        res.send(resp.data);
        //TODO
      })
      .catch((err: AxiosError) => {
        console.log('check password failed', err);
        res.send(`error: ${err.message}`);
      });

    axios
      .patch(
        `${managementConfig.audience}users/${newReq.oidc.user.sub}`,
        {
          password: req.body.password,
          // email_verified: req.body.email_verified,
          // Add additional fields if needed
        },
        {
          headers: {
            ...defaultHeaders,
            Authorization: req.headers.authorization,
          },
        }
      )
      .then((resp: AxiosResponse) => {
        res.send(resp.data);
      })
      .catch((err: AxiosError) => {
        console.log('patch user failed', err);
        res.send(`error: ${err.message}`);
      });
  }
);

module.exports = auth;
