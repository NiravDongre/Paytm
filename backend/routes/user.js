const { Router } = require("express");
const jwt = require("jsonwebtoken");
const userMiddleware = require("../middleware/user.middleware");

const User = Router();

User.post("/signup", )

User.post("/signin",)

User.put("/edit", userMiddleware, )

User.get("/bulk", userMiddleware, bu)


module.exports = User