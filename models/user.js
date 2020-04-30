const mongoose = require('mongoose');
const validate = require('validator');
const bcrypt = require('bcryptjs');
const uniqueValidator = require('mongoose-unique-validator');

const UnauthorizedError = require('../errors/notFoundError');
const NotFoundError = require('../errors/notFoundError');

const { NODE_ENV } = process.env;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (email) => validate.isEmail(email),
      message: 'Неправильный формат почты',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
  articles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'article',
    default: [],
  }],
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(NODE_ENV === 'production' ? new Error('Неправильные почта или пароль')
          : new NotFoundError('Нет пользователя с таким email'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(NODE_ENV === 'production' ? new Error('Неправильные почта или пароль')
              : new UnauthorizedError('Неверный пароль'));
          }
          return user;
        });
    });
};
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('user', userSchema);