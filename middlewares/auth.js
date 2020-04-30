const jwt = require('jsonwebtoken');
const Token = require('../models/token');
const UnauthorizedError = require('../errors/unauthorizedError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (authorization === undefined) {
    next(new UnauthorizedError('Необходима авторизация'));
  } else {
    Token.findOne({ token: authorization })
      .then((checkedToken) => {
        if (checkedToken === null) {
          if (!authorization || !authorization.startsWith('Bearer ')) {
            next(new UnauthorizedError('Необходима авторизация'));
          }
          const token = authorization.replace('Bearer ', '');
          let payload;
          try {
            payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
          } catch (err) {
            next(new UnauthorizedError('Необходима авторизация'));
          }
          req.user = payload;
          next();
        } else {
          next(new UnauthorizedError('Необходима авторизация'));
        }
      })
      .catch((err) => next(err));
  }
};