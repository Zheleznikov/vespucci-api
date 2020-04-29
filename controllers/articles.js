/* eslint-disable no-unused-expressions */
const Article = require('../models/article');
const User = require('../models/user');
const ForbiddenError = require('../errors/forbiddenError');
const NotFoundError = require('../errors/notFoundError');
const BadRequestError = require('../errors/badRequestError');

const { NODE_ENV } = process.env;

// создать статью
module.exports.createArticle = (req, res, next) => {
  const { keyword, title, text, date, source, link, image } = req.body;
  Article.create({ keyword, title, text, date, source, link, image, owner: req.user._id })
    .then((article) => {
      User.findByIdAndUpdate(req.user._id, { $addToSet: { articles: article } }, { new: true })
        .then(() => res.status(201).send({ data: article }))
        .catch(next);
    })
    .catch((err) => (NODE_ENV === 'production' ? next(new BadRequestError('Что-то не так со статьей')) : next(new BadRequestError(`${err.message}`))));
};

// удалить статью
module.exports.deleteArticle = (req, res, next) => {
  Article.findById(req.params.articleId).select('+owner')
    .then((article) => {
      if (String(article.owner) !== req.user._id) {
        throw new ForbiddenError('Нельзя удалить эту статью потому что ее может удалить только владелец');
      }
      article.remove()
        .then((data) => {
          User.findByIdAndUpdate(req.user._id, { $pull: { articles: article._id } }, { new: true })
            .then(() => res.send({ message: 'Эта статья была удалена', data }))
            .catch(next);
        });
    })
    .catch((err) => (NODE_ENV === 'production' ? next(new NotFoundError('Что-то не так со статьей')) : next(new NotFoundError(`${err.message}`))));
};

// получить список всех статей статей
module.exports.getArticles = (req, res, next) => {
  Article.find({})
    .populate({ path: 'owner', model: User })
    .then((articles) => res.send({ data: articles }))
    .catch(next);
};