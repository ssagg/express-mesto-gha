const userSchema = require('../models/user');

const ERROR_CODE_INCORRECT_REQ = 400;
const ERROR_CODE_NO_USER = 404;

module.exports.createUser = async (req, res) => {
  try {
    const { name, about, avatar } = req.body;
    const response = await userSchema.create({ name, about, avatar });
    res.send(response);
  } catch (e) {
    res
      .status(ERROR_CODE_INCORRECT_REQ)
      .send({ message: 'Ошибка создания пользователя' });
  }
};

module.exports.getUsers = async (req, res) => {
  try {
    const response = await userSchema.find({});
    res.send(response);
  } catch (e) {
    res
      .status(ERROR_CODE_INCORRECT_REQ)
      .send({ message: 'Ошибка поиска пользователей' });
  }
};

module.exports.getUserById = async (req, res) => {
  try {
    const response = await userSchema.findById(req.params.userId);
    if (response) {
      res.send(response);
    } else {
      res
        .status(ERROR_CODE_NO_USER)
        .send({ message: 'Запрашиваемый пользователь не найден' });
    }
  } catch (e) {
    res
      .status(ERROR_CODE_INCORRECT_REQ)
      .send({ message: 'Ошибка поиска пользователя' });
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
      { new: true, runValidators: true },
    );
    res.send(response);
  } catch (e) {
    res
      .status(ERROR_CODE_INCORRECT_REQ)
      .send({ message: 'Ошибка обновления пользователя' });
  }
};

module.exports.updateAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    const response = await userSchema.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    );
    res.send(response);
  } catch (e) {
    res
      .status(ERROR_CODE_INCORRECT_REQ)
      .send({ message: 'Ошибка обновления аватара' });
  }
};
