const auth = (req, res, next) => {
  req.user = payload;
  next();
};
