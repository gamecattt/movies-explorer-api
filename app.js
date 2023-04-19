const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const { errors } = require('celebrate');
const NotFoundError = require('./errors/not-found-err');

const app = express();
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { DATABASE_URL } = process.env;

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

mongoose.connect(DATABASE_URL, {
  useNewUrlParser: true,
  // useCreateIndex: true,
  // useFindAndModify: false
});

app.use('/api', require('./routes/index'));

app.use((req, res, next) => {
  next(new NotFoundError('Route not found'));
});

app.use(errorLogger);
app.use(errors());

app.use((err, req, res, next) => {
  const { code = 500, message } = err;

  res.status(code).send({
    message: code === 500 ? 'На сервере произошла ошибка' : message,
  });
  next();
});

app.listen(3000);
