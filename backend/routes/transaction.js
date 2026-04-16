const { Router } = require("express");
const userMiddleware = require("../middleware/user.middleware");
const { history } = require("../controllers/transaction.controller");


const Transaction = Router();

Transaction.get("/history", userMiddleware, history);

module.exports = Transaction;



