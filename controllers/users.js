const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
const userSchema = require('../models/user');

const {
  ERROR_CODE_INCORRECT_REQ, ERROR_CODE_NO_USER, ERROR_CODE_DEFAULT, ERROR_CODE_USER_EXIST,
} = require('../constants/errors');

module.exports.createUser = async (req, res, next) => {
  try {
    const {
      name, about, avatar, email, password,
    } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await userSchema.create({
      name, about, avatar, email, password: hash,
    });
    res.send({
      name, about, avatar, email,
    });
  } catch (err) {
    next(err);
    // if (err.name === 'ValidationError') {
    //   res.status(ERROR_CODE_INCORRECT_REQ).send({
    //     message: 'Переданы некорректные данные при создании пользователя.',
    //   });
    // } else if (err.code === 11000) {
    //   res.status(ERROR_CODE_USER_EXIST).send({
    //     message: 'Такой польщователь уже зарегистрирован.',
    //   });
    // } else {
    //   res.status(ERROR_CODE_DEFAULT).send({
    //     message: 'Ошибка при создании пользователя',
    //   });
    // }
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userSchema.findOne({ email }).select('+password');
    const uncrypt = await bcrypt.compare(password, user.password);
    if (uncrypt) {
      const jwt = jsonwebtoken.sign({ _id: user._id }, 'secret_word', { expiresIn: '7d' });
      res.send({ jwt });
    } else {
      res.status(401).send({ message: 'Пользователь не найден' });
    }
  } catch (err) {
    next(err);
    // if (err.name === 'ValidationError') {
    //   res.status(ERROR_CODE_INCORRECT_REQ).send({
    //     message: 'Переданы некорректные данные при создании пользователя.',
    //   });
    // } else {
    //   res.status(ERROR_CODE_DEFAULT).send({
    //     message: 'Ошибка при логине',
    //   });
    // }
  }
};

module.exports.getCurrentUser = async (req, res) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer')) {
    res.status(401).send({ message: 'Необходима авторизация' });
  }
  let payload;
  const jwt = authorization.replace('Bearer ', '');
  try {
    payload = jsonwebtoken.verify(jwt, 'secret_word');
    const response = await userSchema.findById(payload._id);
    res.send(response);
  } catch (err) {
    res.status(401).send({ message: 'Необходима авторизация' });
  }
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

module.exports.getUserById = async (req, res, next) => {
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
    next(err);
    // if (err.name === 'CastError') {
    //   res.status(ERROR_CODE_INCORRECT_REQ).send({
    //     message: 'Ошибка при поиске пользователя. Некорректный id пользователя',
    //   });
    // } else {
    //   res.status(ERROR_CODE_DEFAULT).send({
    //     message: 'Ошибка при получении пользователя.',
    //   });
    // }
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
