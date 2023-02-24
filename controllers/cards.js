const cardSchema = require("../models/card");
const ERROR_CODE = 400;
const ERROR_CODE_NO_USER = 404;
module.exports.createCard = (req, res) => {
  console.log(req.body);
  console.log(req.user._id);
  const { name, link } = req.body;
  cardSchema
    .create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) =>
      res
        .status(ERROR_CODE)
        .send({ message: `Error on card create ${err.message}` })
    );
};

module.exports.getCard = (req, res) => {
  cardSchema
    .find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) =>
      res
        .status(ERROR_CODE)
        .send({ message: `Error on card remove ${err.message}` })
    );
};

module.exports.removeCard = (req, res) => {
  cardSchema
    .findByIdAndRemove(req.params.cardId)
    .then((card) => res.send({ data: card }))
    .catch((err) =>
      res
        .status(ERROR_CODE)
        .send({ message: `Error on card remove ${err.message}` })
    );
};

module.exports.likeCard = (req, res) => {
  console.log(req.params.cardId);
  console.log(req.user._id);
  if (req.params.userId != user._id) {
    res
      .status(ERROR_CODE_NO_USER)
      .send({ message: `Error occured test ${e.message}` });
  }
  cardSchema
    .findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true }
    )
    .then((likes) => res.send({ data: likes }))
    .catch((err) =>
      res
        .status(ERROR_CODE)
        .send({ message: `Error on card remove ${err.message}` })
    );
};

module.exports.dislikeCard = (req, res) =>
  cardSchema
    .findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true }
    )
    .then((likes) => res.send({ data: likes }))
    .catch((err) =>
      res
        .status(ERROR_CODE)
        .send({ message: `Error on card remove ${err.message}` })
    );
