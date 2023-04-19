module.exports = (err, req, res, next) => {
  const { code = 500, message } = err;

  res.status(code).send({
    message: code === 500 ? 'На сервере произошла ошибка' : message,
  });
  next();
};
