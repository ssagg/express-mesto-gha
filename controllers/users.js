const userSchema = require("../models/user");
const ERROR_CODE = 400;
const ERROR_CODE_NO_USER = 404;
module.exports.createUser = (req, res) => {
  console.log(req.body);
  const { name, about, avatar } = req.body;
  userSchema
    .create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(ERROR_CODE).send({ message: "Error occured" }));
};

module.exports.getUser = (req, res) => {
  userSchema.find({}).then((users) => res.send({ data: users }));
};

module.exports.getUserId = (req, res) => {
  console.log(req.params.userId);
  userSchema
    .findById(req.params.userId)
    .orFail((err) =>
      res
        .status(ERROR_CODE_NO_USER)
        .send({ message: `User Not found ${err.message}` })
    )
    .then((user) => res.send({ data: user }))
    .catch((err) =>
      res.status(ERROR_CODE).send({ message: `Error occured ${err.message}` })
    );
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;

  userSchema
    .findByIdAndUpdate(req.user._id, { name, about })
    .then((user) => res.send({ data: user }))
    .catch((err) =>
      res.status(ERROR_CODE).send({ message: `Error occured ${err.message}` })
    );
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  console.log(req.body);
  userSchema
    .findByIdAndUpdate(req.user._id, { avatar: avatar })
    .then((avatar) => res.send({ data: avatar }))
    .catch((err) =>
      res.status(ERROR_CODE).send({ message: `Error occured ${err.message}` })
    );
};
