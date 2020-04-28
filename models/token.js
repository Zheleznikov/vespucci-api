/* eslint-disable func-names */
const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  token: {
    type: String,
  },
  createdAt: {
    type: Date,
    expires: '604800s',
    default: Date.now,
  },
});

module.exports = mongoose.model('token', tokenSchema);