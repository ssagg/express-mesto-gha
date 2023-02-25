const userSchema = require("../models/user");
const ERROR_CODE = 400;
const ERROR_CODE_NO_USER = 404;

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  userSchema
    .create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) =>
      res
        .status(ERROR_CODE)
        .send({ message: `Ошибка создания пользователя: ${err.message}` })
    );
};

module.exports.getUsers = (req, res) => {
  userSchema
    .find({})
    .then((users) => res.send(users))
    .catch((err) =>
      res
        .status(ERROR_CODE)
        .send({ message: `Ошибка поиска пользователей: ${err.message}` })
    );
};

module.exports.getUserById = async (req, res) => {
  try {
    const response = await userSchema.findById(req.params.userId);
    if (response) {
      user = await res.status(200).send(response);
    } else {
      res
        .status(ERROR_CODE_NO_USER)
        .send({ message: "Запрашиваемый пользователь не найден" });
    }
  } catch (e) {
    res
      .status(ERROR_CODE)
      .send({ message: `Ошибка поиска пользователя: ${e.message}` });
  }
};

module.exports.updateUser = async (req, res) => {
  try {
    const { name, about } = req.body;
    const response = await userSchema.findByIdAndUpdate(
      req.user._id,
      {
        name,
        about,
      },
      { new: true, runValidators: true }
    );
    user = await res.status(200).send(response);
  } catch (e) {
    res
      .status(ERROR_CODE)
      .send({ message: `Ошибка обновления пользователя: ${e.message}` });
  }
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  userSchema
    .findByIdAndUpdate(req.user._id, { avatar: avatar }, { new: true })
    .then((avatar) => res.send({ data: avatar }))
    .catch((err) =>
      res
        .status(ERROR_CODE)
        .send({ message: `Ошибка обновления аватара: ${err.message}` })
    );
};

const generateError = (message, statusCode, data) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.data = data || {};
  error.error = true;
  return error;
};
