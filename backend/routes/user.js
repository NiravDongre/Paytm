const { Router } = require("express");
const ratelimit = require("express-rate-limit");
const userMiddleware = require("../middleware/authmiddleware");
const { edit, bulk } = require("../controllers/user.controller");
const { signup, signin, loggout } = require("../controllers/auth.controller");
const { RefreshTokenHandler } = require("../middleware/refreshTokenHandler");

const limiter = ratelimit({
  windowMs: 1 * 60 * 1000,
  limit: 10,
  message: "Please try again after 15 minutes"
})

const bulklimiter = ratelimit({
  windowMs: 5 * 60 * 1000,
  limit: 50,
  message: "Please try again after 5 minutes"
})


const User = Router();

User.get("/", (req, res) => {
    res.send("hello brother")
})

User.post("/signup", signup, limiter)

User.post("/signin", signin, limiter)

User.post("/loggout", loggout, limiter)

User.post("/refresh", RefreshTokenHandler, limiter)

User.put("/edit", userMiddleware, edit, limiter)

User.get("/bulk", userMiddleware, bulk, bulklimiter)


module.exports = User