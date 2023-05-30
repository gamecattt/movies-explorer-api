const router = require('express').Router();
const {
  getProfile,
  updateProfile,
} = require('../controllers/users');
const { updateProfileValidator } = require('../validators/users');

router.get('/me', getProfile);
router.patch('/me', updateProfileValidator, updateProfile);

module.exports = router;
