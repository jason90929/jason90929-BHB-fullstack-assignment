import {Request, Response} from 'express-serve-static-core';
import {AxiosError, AxiosResponse} from 'axios';

const express = require('express');
const axios = require('axios');
const managementConfig = require('../secret/management_config.json');
const {defaultHeaders} = require('../constants');
const {adminLogin} = require('../middlewares');
const users = express();
users.get('/users', adminLogin, (req: Request, res: Response) => {
  axios
    .get(`${managementConfig.audience}users`, {
      headers: {
        ...defaultHeaders,
        Authorization: req.headers.authorization,
      },
    })
    .then((resp: AxiosResponse) => {
      res.send(resp.data);
    })
    .catch((err: AxiosError) => {
      console.log('get users failed', err);
      res.send(`error: ${err.message}`);
    });
});

module.exports = users;
