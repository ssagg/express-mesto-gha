const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken')
const userSchema = require('../models/user');

const { ERROR_CODE_INCORRECT_REQ, ERROR_CODE_NO_USER, ERROR_CODE_DEFAULT } = require('../constants/errors');

// signup
module.exports.createUser = async (req, res) => {
  try {
    const {
      name, about, avatar, email, password,
    } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const response = await userSchema.create({
      name, about, avatar, email, password: hash,
    });
    res.send(response);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(ERROR_CODE_INCORRECT_REQ).send({
        message: 'Переданы некорректные данные при создании пользователя.',
      });
    } else {
      res.status(ERROR_CODE_DEFAULT).send({
        message: 'Ошибка при создании пользователя',
      });
    }
  }
};
// signin
module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userSchema.findOne({ email });
    const uncrypt = await bcrypt.compare(password, user.password);
    if (uncrypt) {
      const jwt = jsonwebtoken.sign({ _id: user._id }, 'secret_word', { expiresIn: '7d' });
      return res.send({ jwt });
    }
    return res.status(401).send({
      message: 'Польователь не найден',
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(ERROR_CODE_INCORRECT_REQ).send({
        message: 'Переданы некорректные данные при создании пользователя.',
      });
    } else {
      res.status(ERROR_CODE_DEFAULT).send({
        message: 'Ошибка при создании пользователя',
      });
    }
  }
};
// GET users/me

module.exports.getCurrentUser = async (req, res) => {
  res.status(200).send({ message: 'get user' });
  // try {
  //   const response = await userSchema.find({});
  //   res.send(response);
  // } catch (e) {
  //   res
  //     .status(ERROR_CODE_DEFAULT)
  //     .send({ message: 'Ошибка получения пользователей' });
  // }
};

module.exports.getUsers = async (req, res) => {
  try {
    const response = await userSchema.find({});
    res.send(response);
  } catch (e) {
    res
      .status(ERROR_CODE_DEFAULT)
      .send({ message: 'Ошибка получения пользователей' });
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
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(ERROR_CODE_INCORRECT_REQ).send({
        message: 'Ошибка при поиске пользователя. Некорректный id пользователя',
      });
    } else {
      res.status(ERROR_CODE_DEFAULT).send({
        message: 'Ошибка при получении пользователя.',
      });
    }
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
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(ERROR_CODE_INCORRECT_REQ).send({
        message: 'Ошибка обновления данных пользователя.Переданы некорректные данные.',
      });
    } else {
      res.status(ERROR_CODE_DEFAULT).send({
        message: 'Ошибка обновления пользователя',
      });
    }
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
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(ERROR_CODE_INCORRECT_REQ).send({
        message: 'Ошибка обновления аватара. Переданы некорректные данные.',
      });
    } else {
      res.status(ERROR_CODE_DEFAULT).send({
        message: 'Ошибка обновления аватара',
      });
    }
  }
};
