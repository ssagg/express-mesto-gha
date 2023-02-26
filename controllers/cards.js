const cardSchema = require('../models/card');
const { ERROR_CODE_INCORRECT_REQ, ERROR_CODE_NO_CARD, ERROR_CODE_DEFAULT } = require('../constants/errors');

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  cardSchema
    .create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE_INCORRECT_REQ).send({
          message: 'Переданы некорректные данные при создании карточки.',
        });
      } else {
        res.status(ERROR_CODE_DEFAULT).send({
          message: 'Ошибка при создании карточки',
        });
      }
    });
};

module.exports.getCards = (req, res) => {
  cardSchema
    .find({})
    .populate('owner')
    .then((cards) => res.send(cards))
    .catch((err) => {
      res.status(ERROR_CODE_DEFAULT).send({
        message: `Ошибка при получении карточек ${err.message}`,
      });
    });
};

module.exports.removeCard = (req, res) => {
  cardSchema
    .findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (card) {
        res.send(card);
      } else {
        res
          .status(ERROR_CODE_NO_CARD)
          .send({ message: 'Такой карточки не существует' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE_INCORRECT_REQ).send({
          message: 'Ошибка при удалении карточки. Некорректный id карточки',
        });
      } else {
        res.status(ERROR_CODE_DEFAULT).send({
          message: 'Ошибка при удалении карточки',
        });
      }
    });
};

module.exports.likeCard = async (req, res) => {
  cardSchema
    .findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    ).populate(['owner', 'likes'])
    .then((likes) => {
      if (likes) {
        res.send(likes);
      } else {
        res.status(ERROR_CODE_NO_CARD).send({
          message: 'Такой карточки не существует. Нельзя поставить лайк',
        });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE_INCORRECT_REQ).send({
          message: 'Переданы некорректные данные для постановки лайка',
        });
      } else {
        res.status(ERROR_CODE_DEFAULT).send({
          message: 'Ошибка при лайке карточки',
        });
      }
    });
};

module.exports.dislikeCard = (req, res) => cardSchema
  .findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
  .then((likes) => {
    if (likes) {
      res.send(likes);
    } else {
      res.status(ERROR_CODE_NO_CARD).send({
        message: 'Такой карточки не существует. Нельзя убрать лайк',
      });
    }
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(ERROR_CODE_INCORRECT_REQ).send({
        message: 'Ошибка при удалении лайка. Переданы некорректные данные.',
      });
    } else {
      res.status(ERROR_CODE_DEFAULT).send({
        message: 'Ошибка при снятии лайка карточки',
      });
    }
  });
