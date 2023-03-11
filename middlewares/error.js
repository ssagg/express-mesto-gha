const errH = (err, req, res, next) => {
  next();
};

module.exports = errH;
