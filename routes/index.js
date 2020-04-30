const router = require('express').Router();

const userRouter = require('./users');
const articleRouter = require('./articles');
const signRouter = require('./sign');
const auth = require('../middlewares/auth');

const NotFoundError = require('../errors/notFoundError');

router.use('/', signRouter);
router.use('/', auth, userRouter);
router.use('/', auth, articleRouter);
router.use('*', (req, res, next) => next(new NotFoundError('Запрашиваемый ресурс не найден')));

module.exports = router;