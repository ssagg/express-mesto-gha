const router = require("express").Router();
const {
  createUser,
  getUser,
  getUserId,
  updateUser,
  updateAvatar,
  generateError,
} = require("../controllers/users");

router.get("/", getUser);
router.get("/:userId", getUserId);

// router.get("/users/:userId", (req, res) => {
//   if (!users[req.params.userId]) {
//     res.send(`Такого пользователя не существует`);
//     return;
//   }
//   const { name, about, avatar } = users[req.params.userId];
//   res.send(`${name}, ${about}, ${avatar}`);
// });

router.patch("/me", updateUser);
router.patch("/me/avatar", updateAvatar);
router.post("/", createUser);

module.exports = router;
