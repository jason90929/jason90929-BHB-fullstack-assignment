import {Request, Response} from 'express-serve-static-core';
import express = require('express');
import {AxiosError, AxiosResponse} from 'axios';

const axios = require('axios');
const managementConfig = require('../secret/management_config.json');
const {defaultHeaders} = require('../constants');
const {jsonParser, requiresAuth, adminLogin} = require('../middlewares');
const me = express();

interface OIDC {
  oidc: {
    user: {
      sub: string;
    };
  };
}

me.get('/me', requiresAuth(), adminLogin, (req: Request, res: Response) => {
  const newReq: Request & OIDC = Object.assign(req);
  axios
    .get(`${managementConfig.audience}users/${newReq.oidc.user.sub}`, {
      headers: {
        ...defaultHeaders,
        Authorization: req.headers.authorization,
      },
    })
    .then((resp: AxiosResponse) => {
      res.send(resp.data);
    })
    .catch((err: AxiosError) => {
      console.log('get user failed', err);
      res.send(`error: ${err.message}`);
    });
});

me.patch(
  '/me',
  requiresAuth(),
  adminLogin,
  jsonParser,
  (req: Request, res: Response) => {
    const newReq: Request & OIDC = Object.assign(req);
    axios
      .patch(
        `${managementConfig.audience}users/${newReq.oidc.user.sub}`,
        {
          name: req.body.name,
          // Add additional fields if needed
          // email_verified: req.body.email_verified,
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

me.post(
  '/me/resend-email-verification',
  requiresAuth(),
  adminLogin,
  jsonParser,
  (req: Request, res: Response) => {
    const newReq: Request & OIDC = Object.assign(req);
    axios
      .post(
        `${managementConfig.audience}jobs/verification-email`,
        {
          user_id: newReq.oidc.user.sub,
          // identity: {
          //     user_id: req.params.id,
          //     provider: ""
          // },
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

module.exports = me;
