const userRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  createUser, loginUser, getUserMe, patchUser,
} = require('../controllers/users');
const Auth = require('../middlewares/auth');

userRouter.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  createUser,
);

userRouter.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  loginUser,
);

userRouter.use('/users', Auth);

userRouter.get('/users/me', getUserMe);

userRouter.patch(
  '/users/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      email: Joi.string().required().email(),
    }),
  }),
  patchUser,
);

module.exports = userRouter;
