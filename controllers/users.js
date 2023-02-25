const userSchema = require("../models/user");
const ERROR_CODE_INCORRECT_REQ = 400;
const ERROR_CODE_NO_USER = 404;

module.exports.createUser = async (req, res) => {
  try {
    const { name, about, avatar } = req.body;
    const response = await userSchema.create({ name, about, avatar });
    const user = await res.status(200).send(response);
  } catch (e) {
    res
      .status(ERROR_CODE_INCORRECT_REQ)
      .send({ message: `Ошибка создания пользователя: ${e.message}` });
  }
};

module.exports.getUsers = async (req, res) => {
  try {
    const response = await userSchema.find({});
    const users = await res.status(200).send(response);
  } catch (e) {
    res
      .status(ERROR_CODE_INCORRECT_REQ)
      .send({ message: `Ошибка поиска пользователей: ${err.message}` });
  }
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
      .status(ERROR_CODE_INCORRECT_REQ)
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
      .status(ERROR_CODE_INCORRECT_REQ)
      .send({ message: `Ошибка обновления пользователя: ${e.message}` });
  }
};

module.exports.updateAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    const response = await userSchema.findByIdAndUpdate(
      req.user._id,
      { avatar: avatar },
      { new: true }
    );
    const av = await res.status(200).send(response);
  } catch (e) {
    res
      .status(ERROR_CODE_INCORRECT_REQ)
      .send({ message: `Ошибка обновления аватара: ${e.message}` });
  }
};
