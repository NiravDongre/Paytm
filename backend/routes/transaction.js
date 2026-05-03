const { Router } = require("express");
const ratelimit = require("express-rate-limit");
const userMiddleware = require("../middleware/authmiddleware");
const { history } = require("../controllers/transaction.controller");


const Transaction = Router();

Transaction.get("/history", userMiddleware, history);

module.exports = Transaction;



