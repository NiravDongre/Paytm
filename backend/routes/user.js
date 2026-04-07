const { Router } = require("express");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const { DBUser, DBAccount } = require("../db");
const userMiddleware = require("../middleware");

const User = Router();

User.post("/signup", )

User.post("/signin",)

User.put("/edit", userMiddleware,)

User.get("/bulk", userMiddleware)


module.exports = User