const router = require('express').Router();
const { login, createUser, logout } = require('../controllers/users');
const {
  loginValidator,
  createUserValidator,
} = require('../validators/auth');

router.post('/signin', loginValidator, login);
router.post('/signup', createUserValidator, createUser);
router.post('/signout', logout);

module.exports = router;
