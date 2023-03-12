const {
  ERROR_CODE_INCORRECT_REQ, ERROR_CODE_NO_USER, ERROR_CODE_DEFAULT, ERROR_CODE_USER_EXIST,
  ERROR_CODE_NO_CARD
} = require('../constants/errors');

const errHandler = (err, req, res, next) => {
  // console.log(err);

  // const statusCode = err.statusCode || 500;

  // const message = statusCode === 500
  //   ? `На сервере произошла ошибка: ${err.message}`
  //   : err.message;

  // res.status(statusCode).send({ message });

  if (err.name === 'ValidationError') {
    res.status(ERROR_CODE_INCORRECT_REQ).send({
      message: 'Переданы некорректные данные при создании пользователя.',
    });
  } else if (err.code === 11000) {
    res.status(ERROR_CODE_USER_EXIST).send({
      message: 'Такой пользователь уже зарегистрирован.',
    });
  } else {
    res.status(ERROR_CODE_DEFAULT).send({
      message: 'Ошибка при создании пользователя',
    });
  }

  if (err.name === 'CastError') {
    res.status(ERROR_CODE_INCORRECT_REQ).send({
      message: 'Ошибка при поиске пользователя. Некорректный id пользователя',
    });
  } else {
    res.status(ERROR_CODE_DEFAULT).send({
      message: 'Ошибка при получении пользователя.',
    });
  }

  next();
};

module.exports = errHandler;
