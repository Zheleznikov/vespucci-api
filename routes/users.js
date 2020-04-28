const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getUser } = require('../controllers/users');

router.get('/users/me', celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().length(24),
  }),
}), getUser);
module.exports = router;