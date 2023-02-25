const cardSchema = require("../models/card");
const ERROR_CODE_INCORRECT_REQ = 400;
const ERROR_CODE_NO_CARD = 404;

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  cardSchema
    .create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) =>
      res.status(ERROR_CODE_INCORRECT_REQ).send({
        message: `Ошибка при создании карточки ${err.message}`,
      })
    );
};

module.exports.getCards = (req, res) => {
  cardSchema
    .find({})
    .then((cards) => res.send(cards))
    .catch((err) =>
      res
        .status(ERROR_CODE_INCORRECT_REQ)
        .send({ message: `Ошибка при получении карточек ${err.message}` })
    );
};

module.exports.removeCard = (req, res) => {
  cardSchema
    .findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (card) {
        res.status(200).send(card);
      } else {
        res
          .status(ERROR_CODE_NO_CARD)
          .send({ message: ` Такой карточки не существует ` });
        return;
      }
    })
    .catch((err) =>
      res.status(ERROR_CODE_INCORRECT_REQ).send({
        message: `Ошибка при удалении карточки ${err.message} ${err.name}`,
      })
    );
};

module.exports.likeCard = async (req, res) => {
  cardSchema
    .findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    )
    .then((likes) => {
      if (likes) {
        res.status(200).send(likes);
      } else {
        res.status(ERROR_CODE_NO_CARD).send({
          message: `Такой карточки не существует. Нельзя поставить лайк `,
        });
        return;
      }
    })

    .catch((err) => {
      res
        .status(ERROR_CODE_INCORRECT_REQ)
        .send({
          message: `Ошибка добавления лайка ${err.message} ${err.name}`,
        });
    });
};

module.exports.dislikeCard = (req, res) =>
  cardSchema
    .findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true }
    )
    .then((likes) => {
      if (likes) {
        res.status(200).send(likes);
      } else {
        res.status(ERROR_CODE_NO_CARD).send({
          message: `Такой карточки не существует. Нельзя убрать лайк `,
        });
        return;
      }
    })
    .catch((err) =>
      res
        .status(ERROR_CODE_INCORRECT_REQ)
        .send({ message: `Ошибка при удалении лайка ${err.message}` })
    );
