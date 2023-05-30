const rateLimit = require('express-rate-limit');

module.exports = rateLimit({
  windowMs: 10 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
});
