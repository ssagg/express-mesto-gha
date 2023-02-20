const router = require("express").Router();
const {
  getCard,
  createCard,
  removeCard,
  likeCard,
  dislikeCard,
} = require("../controllers/cards");

router.get("/", getCard);
router.post("/", createCard);
router.delete("/:cardId", removeCard);
router.put("/:cardId/likes", likeCard);
router.delete("/:cardId/likes", dislikeCard);

module.exports = router;
