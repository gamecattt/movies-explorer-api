const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const { errors } = require('celebrate');
const helmet = require('helmet');

const app = express();
const { requestLogger, errorLogger } = require('./middlewares/logger');
const rateLimit = require('./middlewares/rateLimit');
const errorHandler = require('./middlewares/errorHandler');

const { NODE_ENV, DATABASE_URL } = process.env;

app.use(helmet());

const allowedCors = [
  'http://gamecat-movies-api.nomoredomains.monster',
  'https://gamecat-movies-api.nomoredomains.monster',
  'localhost:3000',
];

app.use((req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  const requestHeaders = req.headers['access-control-request-headers'];

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', '*');
  }

  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }

  return next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

app.use('/api', rateLimit);

mongoose.connect(NODE_ENV === 'production' ? DATABASE_URL : 'mongodb://127.0.0.1:27017/bitfilmsdb', {
  useNewUrlParser: true,
});

app.use('/api', require('./routes/index'));

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(3000);
