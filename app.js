const bodyParser = require('body-parser');
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');
const { requestLogger, errorLogger } = require('./middlewares/Logger');
const RateLimit = require('./middlewares/RateLimit');
const CentralizedErrorHandler = require('./errors/CentralizedErrorHandler');
const router = require('./routes');

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/bitfilmsdb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(helmet());

app.use(RateLimit);

app.use('/static', express.static('static'));

app.use(cors());

app.use(requestLogger);

app.use(router);

app.use(errorLogger);

app.use(errors());

app.use(CentralizedErrorHandler);

app.listen(3000, () => {
  console.log('SERVER ON');
});
