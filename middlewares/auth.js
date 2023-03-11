const jsonwebtoken = require('jsonwebtoken');

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer')) {
    res.status(401).send({ message: 'Необходима авторизация' });
  }
  let payload;
  const jwt = authorization.replace('Bearer ', '');
  try {
    payload = jsonwebtoken.verify(jwt, 'secret_word');
    // res.status(200).send(payload);
  } catch (err) {
    res.status(401).send({ message: 'Необходима авторизация' });
  }
  req.user = payload;
  next();
};

module.exports = auth;
