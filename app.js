require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const { errors } = require('celebrate');
const rateLimit = require('express-rate-limit');

const config = require('./config');
const router = require('./routes/index');

const errorsHandler = require('./middlewares/errorsHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { NODE_ENV } = process.env;

const app = express();

app.use(rateLimit(config.RATE_LIMIT));
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

app.use(requestLogger);
app.use('/', router);
app.use(errorLogger);
app.use((NODE_ENV === 'production' ? errorsHandler : errors()));
app.use(errorsHandler);

app.listen(config.PORT, () => console.log(`App listening on port ${config.PORT}`));