require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;
const User = require('../models/user');
const {
  CREATED, UNAUTHORIZED, CONFLICT, OK, BAD_REQUEST,
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
          if (err.code === 11000) {
            next(new CONFLICT('Пользователь с таким Email уже существует'));
          } if (err.name === 'ValidationError') {
            next(new BAD_REQUEST('Введены некорректные данные при создании пользователя'));
          }
          next(err);
        });
    })
    .catch(next);
};

const loginUser = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        next(new UNAUTHORIZED('Пароль или Email неверные'));
        return;
      }
      bcrypt.compare(password, user.password)
        .then((good) => {
          if (!good) {
            return next(new UNAUTHORIZED('Пароль или Email неверные'));
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

  User.findById(id)
    .then((user) => {
      if (user.email === email) {
        User.findByIdAndUpdate(id, { name, email }, { new: true, runValidators: true })
          .then((userUp) => {
            res.send(userUp);
          })
          .catch((err) => {
            if (err.name === 'ValidationError') {
              next(new BAD_REQUEST('Введены некорректные данные'));
            } else {
              next(err);
            }
          });
      } else {
        return next(new CONFLICT('Пользователь с таким Email уже существует'));
      }
    })
    .catch(next);
};

module.exports = {
  createUser,
  loginUser,
  getUserMe,
  patchUser,
};
