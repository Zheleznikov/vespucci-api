require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserVespucci = require('../models/user');
const Token = require('../models/token');

const UnauthorizedError = require('../errors/unauthorizedError');
const ConflictError = require('../errors/conflictError');

const { NODE_ENV, JWT_SECRET } = process.env;

// создать пользователя
module.exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => UserVespucci.create({
      name: req.body.name,
      email: req.body.email,
      password: hash,
    }))
    .then((user) => res.status(201).send({
      message: 'Congratulate',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        articles: user.articles,
      },
    }))
    .catch((err) => (NODE_ENV === 'production' ? next(new ConflictError('email занят')) : next(new ConflictError(`${err.message}`))));
};

// залогиниться
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return UserVespucci.findUserByCredentials(email, password)
    .then((user) => {
      if (!user.email) {
        throw new UnauthorizedError('Такого пользователя нет');
      }
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.send({
        message: 'Congratulate',
        token,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          articles: user.articles,
        },
      });
    })
    .catch((err) => {
      if (req.headers.authorization !== undefined) {
        Token.create({ token: req.headers.authorization })
          .then(next)
          .catch(next);
      }
      if (NODE_ENV === 'production') {
        next(new UnauthorizedError('Неправильная почта или пароль'));
      } else {
        next(new UnauthorizedError(`${err.message}`));
      }
    });
};

// разлогиниться
module.exports.logout = (req, res, next) => {
  UserVespucci.findById(req.user._id)
    .then(() => {
      Token.create({ token: req.headers.authorization })
        .then(() => res.send({ message: 'Успешный выход' }))
        .catch(next);
    })
    .catch((err) => (NODE_ENV === 'production' ? next(new UnauthorizedError('Что-то не получилось')) : next(new UnauthorizedError(`${err.message}`))));
};

// получить данные о себе
module.exports.getUser = (req, res, next) => {
  UserVespucci.findById(req.user._id)
    .then((user) => res.send({ message: 'Congratulate', data: user }))
    .catch((err) => (NODE_ENV === 'production' ? next(new UnauthorizedError('Что-то не получилось')) : next(new UnauthorizedError(`${err.message}`))));
};