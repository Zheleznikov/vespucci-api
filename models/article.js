const mongoose = require('mongoose');
const validate = require('validator');

const articleSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (url) => validate.isURL(url),
      message: 'Неправильный формат ссылки',
    },
    image: {
      type: String,
      required: true,
      validate: {
        validator: (url) => validate.isURL(url),
        message: 'Неправильный формат ссылки',
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'user',
      select: false,
    },
  },
});

module.exports = mongoose.Schema('article', articleSchema);