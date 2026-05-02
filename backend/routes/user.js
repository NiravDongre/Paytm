const { Router } = require("express");
const userMiddleware = require("../middleware/authmiddleware");
const { edit, bulk } = require("../controllers/user.controller");
const { signup, signin, loggout } = require("../controllers/auth.controller");
const { RefreshTokenHandler } = require("../middleware/refreshTokenHandler");


const User = Router();

User.get("/", (req, res) => {
    res.send("hello brother")
})

User.post("/signup", signup)

User.post("/signin", signin)

User.post("/loggout", loggout)

User.post("/refresh", RefreshTokenHandler)

User.put("/edit", userMiddleware, edit)

User.get("/bulk", userMiddleware, bulk)


module.exports = User