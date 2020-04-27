const express = require('express');
const mongoose = require('mongoose');

const config = require('./config');
const app = express();

mongoose.connect(config.CONNECTION_ADDRESS, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});




app.listen(config.PORT, () => {
  console.log(`App listening on port ${config.PORT}`);
});