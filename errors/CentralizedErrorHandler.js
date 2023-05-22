const { INTERNAL_SERVERE_ERROR } = require('./errors');

module.exports = ((err, req, res, next) => {
  const { statusCode = INTERNAL_SERVERE_ERROR, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === INTERNAL_SERVERE_ERROR
        ? 'Произошла ошибка на сервере'
        : message,
    });
  next();
});
