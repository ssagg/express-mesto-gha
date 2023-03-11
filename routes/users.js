const router = require('express').Router();
const {
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
  getCurrentUser,
} = require('../controllers/users');

router.get('/me', getCurrentUser);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatar);
router.get('/', getUsers);
router.get('/:userId', getUserById);

module.exports = router;
