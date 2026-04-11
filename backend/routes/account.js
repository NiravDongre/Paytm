const { Router } = require("express");
const mongoose = require("mongoose");
const { DBAccount } = require("../db");
const { balance, transfer } = require("../controllers/account.controller");
const userMiddleware = require("../middleware/user.middleware");

const Account = Router();

Account.get("/balance", userMiddleware, balance)

Account.post("/transfer", userMiddleware, transfer)

module.exports = Account