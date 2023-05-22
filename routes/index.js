const router = require('express').Router();
const userRouter = require('./users');
const movieRouter = require('./movies');
const { CustomError, NOT_FOUND } = require('../errors/errors');

router.use('/movies', movieRouter);
router.use('/', userRouter);
router.use('*', (req, res, next) => {
  next(new CustomError(NOT_FOUND, 'Страница не найдена'));
});

module.exports = router;
