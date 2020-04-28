/* eslint-disable operator-linebreak */
/* eslint-disable no-unused-vars */
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const { errors } = require('celebrate');

const config = require('./config');

const signRouter = require('./routes/sign');
const userRouter = require('./routes/users');
const articleRouter = require('./routes/articles');

const auth = require('./middlewares/auth');
const errorsHandler = require('./middlewares/errorsHandler');

const NotFoundError = require('./errors/notFoundError');

const { NODE_ENV } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());

mongoose.connect(config.CONNECTION_ADDRESS, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use('/', signRouter);
app.use('/', auth, userRouter);
app.use('/', auth, articleRouter);
app.use('*', (req, res, next) => next(new NotFoundError('Запрашиваемый ресурс не найден')));


app.use((NODE_ENV === 'production' ? errorsHandler : errors()));
app.use(errorsHandler);

app.listen(config.PORT, () => console.log(`App listening on port ${config.PORT}`));