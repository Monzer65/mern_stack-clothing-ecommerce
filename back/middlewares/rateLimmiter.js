/** @format */

const rateLimit = require("express-rate-limit");
module.exports = {
  authLimmiter: rateLimit({
    windowMs: 2 * 60 * 1000, // 120 seconds
    max: 3, // Limit each IP to 3 requests per `window` (here, per 2 minutes)
    message: "Too many requests from this IP, please try again after 2 minutes",
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  }),
};
