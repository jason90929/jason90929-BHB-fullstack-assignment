import express = require('express');
import {Request, Response} from 'express-serve-static-core';
import {AxiosError} from 'axios';
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
      email: string;
      sub: string;
    };
  };
  body: {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  };
}
auth.post(
  '/update-password',
  requiresAuth(),
  adminLogin,
  jsonParser,
  async (req: Request, res: Response) => {
    const newReq: Request & OIDC = Object.assign(req);

    if (
      newReq.body.newPassword !== undefined &&
      newReq.body.newPassword !== '' &&
      newReq.body.newPassword !== newReq.body.confirmPassword
    ) {
      res.status(400).send('new password and confirm password not match');
      return;
    }

    try {
      await axios.post(
        adminTokenURL,
        new URLSearchParams({
          client_id: managementConfig.client_id,
          client_secret: managementConfig.client_secret,
          audience: managementConfig.audience,
          grant_type: 'password',
          username: newReq.oidc.user.email,
          password: newReq.body.oldPassword,
        }),
        {
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
          },
        }
      );
    } catch (err) {
      console.log('check password failed', err);
      res.status(400).send('Old password not match or try too many times');
      return;
    }
    axios
      .patch(
        `${managementConfig.audience}users/${newReq.oidc.user.sub}`,
        {
          password: newReq.body.newPassword,
        },
        {
          headers: {
            ...defaultHeaders,
            Authorization: newReq.headers.authorization,
          },
        }
      )
      .then(() => {
        res.send('password updated');
      })
      .catch((err: AxiosError) => {
        console.log('update password failed', err);
        res.status(500).send(`error: ${err.message}`);
      });
  }
);

module.exports = auth;
