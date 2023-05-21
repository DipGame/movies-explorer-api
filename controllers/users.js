require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;
const User = require('../models/user');
const {
  CREATED, UNAUTHORIZED, CONFLICT, OK, CustomError, BAD_REQUEST,
} = require('../errors/errors');

const createUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        email, password: hash, name,
      })
        .then(() => {
          res.status(CREATED).send({
            email, name,
          });
        })
        .catch((err) => {
          if (err.errors.email.kind === 'unique') {
            next(new CustomError(CONFLICT, 'Пользователь уже существует'));
          } if (err.name === 'ValidationError') {
            next(new CustomError(BAD_REQUEST, 'Некорректные данные при создании пользователя'));
          } else {
            next(err);
          }
        });
    })
    .catch(next);
};

const loginUser = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        next(new CustomError(UNAUTHORIZED, 'Пароль или Email неверные'));
        return;
      }
      bcrypt.compare(password, user.password)
        .then((good) => {
          if (!good) {
            return next(new CustomError(UNAUTHORIZED, 'Пароль или Email неверные'));
          }
          const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
          res.status(OK).send({ token });
        })
        .catch(next);
    })
    .catch(next);
};

const getUserMe = (req, res, next) => {
  const id = req.user._id;

  User.findById(id)
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};

const patchUser = (req, res, next) => {
  const id = req.user._id;
  const { name, email } = req.body;

  User.findByIdAndUpdate(id, { name, email }, { new: true, runValidators: true })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new CustomError(BAD_REQUEST, 'Введены некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createUser,
  loginUser,
  getUserMe,
  patchUser,
};
