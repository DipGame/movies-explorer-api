const router = require('express').Router();
const userRouter = require('./users');
const movieRouter = require('./movies');

router.use('/movies', movieRouter);
router.use('/', userRouter);

module.exports = router;
