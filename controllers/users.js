/* eslint-disable no-unused-expressions */
require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Token = require('../models/token');

const UnauthorizedError = require('../errors/unauthorizedError');
const BadRequestError = require('../errors/badRequestError');
const NotFoundError = require('../errors/notFoundError');

const { NODE_ENV, JWT_SECRET } = process.env;

// создать пользователя
module.exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name: req.body.name,
      email: req.body.email,
      password: hash,
    }))
    .then((user) => {
      res.status(201).send({ message: 'Congratulate', user: { _id: user._id, name: user.name, email: user.email } });
    })
    .catch((err) => {
      NODE_ENV === 'production' ? next(new BadRequestError('Данные не прошли валидацию'))
        : next(new BadRequestError(`${err.message}`));
    });
};

// залогиниться
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user.email) {
        throw new UnauthorizedError('Такого пользователя нет');
      }
      const token = jwt.sign({ _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.send({ message: 'Congratulate', token, user: { _id: user._id, name: user.name, email: user.email, articles: user.articles } });
    })
    .catch((err) => next(new UnauthorizedError(`${err.message}`)));
};

// разлогиниться
module.exports.logout = (req, res, next) => {
  User.findById(req.user._id)
    .then(() => {
      Token.create({
        token: req.headers.authorization,
      })
        .then(() => res.send({ message: 'Успешный выход' }));
    })
    .catch((err) => next(new UnauthorizedError(`${err.message}`)));
};

// получить данные о себе
module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.send({ data: user }))
    .catch((err) => next(new NotFoundError(`${err.message}`)));
};