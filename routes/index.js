const router = require('express').Router();
const userRouter = require('./users');
const movieRouter = require('./movies');
const { NOT_FOUND } = require('../errors/errors');

router.use('/api/movies', movieRouter);
router.use('/api', userRouter);
router.use('*', (req, res, next) => {
  next(new NOT_FOUND('Страница не найдена'));
});

module.exports = router;
