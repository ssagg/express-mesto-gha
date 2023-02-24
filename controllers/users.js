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

// module.exports.getUserId = (req, res, next) => {
//   userSchema
//     .findById(req.params.userId)
//     // .orFail(() => {
//     //   res.status(ERROR_CODE_NO_USER);
//     //   throw generateError("User not found in database", 404);
//     // })
//     .then((user) => res.send({ data: user }))
//     .catch((err) =>
//       res.status(ERROR_CODE).send({ message: `Error occured ${err.message}` })
//     );
// };

module.exports.getUserId = async (req, res) => {
  try {
    const response = await userSchema.findById(req.params.userId);
    if (req.params.userId != user._id) {
      res
        .status(ERROR_CODE_NO_USER)
        .send({ message: `Error occured test ${e.message}` });
    }
    user = await res.status(200).send(response);
  } catch (e) {
    res.status(ERROR_CODE).send({ message: `Error occured ${e.message}` });
  }
};

// module.exports.updateUser = (req, res) => {
//   const { name, about } = req.body;

//   userSchema
//     .findByIdAndUpdate(req.user._id, { name, about })
//     .then((user) => res.send({ data: user }))
//     .catch((err) =>
//       res.status(ERROR_CODE).send({ message: `Error occured ${err.message}` })
//     );
// };

// async
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
    console.log(e);
    res.status(ERROR_CODE).json({ message: `Error occured ${e.message}` });
  }
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  userSchema
    .findByIdAndUpdate(req.user._id, { avatar: avatar }, { new: true })
    .then((avatar) => res.send({ data: avatar }))
    .catch((err) =>
      res.status(ERROR_CODE).send({ message: `Error occured ${err.message}` })
    );
};

const generateError = (message, statusCode, data) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.data = data || {};
  error.error = true;
  return error;
};
