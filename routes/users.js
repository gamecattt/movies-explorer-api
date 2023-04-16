const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getProfile,
  updateProfile,
} = require('../controllers/users');
const constants = require('../utils/constants');

router.get('/users/me', getProfile);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required(),
  }),
}), updateProfile);

module.exports = router;
