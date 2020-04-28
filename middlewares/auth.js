/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
const Token = require('../models/token');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  Token.findOne({ token: authorization })
    .then((checkedToken) => {
      if (checkedToken === null) {
        if (!authorization || !authorization.startsWith('Bearer ')) {
          return res.status(401).send({ message: 'Необходима авторизация' });
        }
        const token = authorization.replace('Bearer ', '');
        let payload;
        try {
          payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
        } catch (err) {
          return res.status(401).send({ message: 'Необходима авторизация' });
        }
        req.user = payload;
        next();
      } else {
        return res.status(401).send({ message: 'Необходима авторизация' });
      }
    })
    .catch(() => console.log('не нашли'));
};