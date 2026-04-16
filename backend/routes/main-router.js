const { Router } = require("express");
const User = require("./user");
const Account = require("./account");
const Transaction = require("./transaction");

const router = Router();

router.use("/user", User);
router.use("/account", Account);
router.use("/transactions", Transaction)

module.exports = router