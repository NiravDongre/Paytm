const { Router } = require("express");
const userMiddleware = require("../middleware/authmiddleware");
const { edit, bulk } = require("../controllers/user.controller");
const { signup, signin, loggout } = require("../controllers/auth.controller");


const User = Router();

User.post("/signup", signup)

User.post("/signin", signin)

User.post("/loggout", loggout)

User.put("/edit", userMiddleware, edit)

User.get("/bulk", userMiddleware, bulk)


module.exports = User