const { Router } = require("express");
const mongoose = require("mongoose");
const { balance, transfer } = require("../controllers/account.controller");
const userMiddleware = require("../middleware/authmiddleware");

const Account = Router();

Account.get("/balance", userMiddleware, balance)

Account.post("/transfer", userMiddleware, transfer)

module.exports = Account