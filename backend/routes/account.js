const { Router } = require("express");
const mongoose = require("mongoose");
const { DBAccount } = require("../db");
const userMiddleware = require("../middleware");

const Account = Router();

Account.get("/balance", userMiddleware ,)


Account.post("/transfer", userMiddleware,)

module.exports = Account