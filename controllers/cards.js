const cardSchema = require('../models/card');

const ERROR_CODE_INCORRECT_REQ = 400;
const ERROR_CODE_NO_CARD = 404;

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  cardSchema
    .create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch(() => res.status(ERROR_CODE_INCORRECT_REQ).send({ message: 'Ошибка при создании карточки' }));
};

module.exports.getCards = (req, res) => {
  cardSchema
    .find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(ERROR_CODE_INCORRECT_REQ).send({ message: 'Ошибка при получении карточек' }));
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
    .catch(() => res.status(ERROR_CODE_INCORRECT_REQ).send({
      message: 'Ошибка при удалении карточки',
    }));
};

module.exports.likeCard = async (req, res) => {
  cardSchema
    .findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
    .then((likes) => {
      if (likes) {
        res.send(likes);
      } else {
        res.status(ERROR_CODE_NO_CARD).send({
          message: 'Такой карточки не существует. Нельзя поставить лайк',
        });
      }
    })

    .catch(() => {
      res
        .status(ERROR_CODE_INCORRECT_REQ)
        .send({
          message: 'Ошибка добавления лайка ',
        });
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
  .catch(() => res.status(ERROR_CODE_INCORRECT_REQ).send({ message: 'Ошибка при удалении лайка' }));
