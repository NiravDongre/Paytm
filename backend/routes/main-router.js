const { Router } = require("express");
const ratelimit = require("express-rate-limit");
const User = require("./user");
const Account = require("./account");
const Transaction = require("./transaction");

const limiter = ratelimit({
  windowMs: 10 * 60 * 1000,
  limit: 100,
  message: "Please try again after 10 minutes"
})

const Transactionlimiter = ratelimit({
  windowMs: 3 * 60 * 1000,
  limit: 50,
  message: "Please try again after 3 minutes"
})


const router = Router();

router.use("/user", User);
router.use("/account", Account, limiter);
router.use("/transactions", Transaction, Transactionlimiter)

module.exports = router