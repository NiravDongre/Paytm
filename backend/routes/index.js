const { Router } = require("express");
const User = require("./user");
const Account = require("./account");

const router = Router();

router.use("/user", User);
router.use("/account", Account);

module.exports = router