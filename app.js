/* eslint-disable operator-linebreak */
/* eslint-disable no-unused-vars */
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const cors = require('cors');
const config = require('./config');
const signRouter = require('./routes/sign');
const userRouter = require('./routes/users');
const auth = require('./middlewares/auth');
const errorsHandler = require('./middlewares/errorsHandler');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(cookieParser());
app.use(cors());

mongoose.connect(config.CONNECTION_ADDRESS, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use('/', signRouter);
app.use('/', auth, userRouter);

app.use(errorsHandler);

app.listen(config.PORT, () => console.log(`App listening on port ${config.PORT}`));