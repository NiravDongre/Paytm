const { Router } = require("express");
const mongoose = require("mongoose");
const { DBAccount } = require("../db");
const userMiddleware = require("../middleware");

const Account = Router();

Account.get("/balance", userMiddleware ,async(req, res) => {

    const account = await DBAccount.findOne({
        userId: req.userId
    })

    if(!account){
        return res.json({
            message: "NO account found"
        })
    }

    return res.json({
        Balance: account.balance
    })
})


Account.post("/transfer", userMiddleware, async(req, res) => {

    const session = await mongoose.startSession();

    session.startTransaction();
    const { amount, to } = req.body;

    const account = await DBAccount.findOne({userId: req.userId}).session(session);

    if(!account || account.balance < amount){
        await session.abortTransaction();
        return res.json({
            message: "Insignificent amount"
        })
    }

    const toAccount = await DBAccount.findOne({userId: to}).session(session)

    if(!toAccount){
        await session.abortTransaction()
        return res.json({
            message: "the receiver does not exists"
        })
    }

    await DBAccount.updateOne({userId: to}, {$inc: { balance: amount}}).session(session)
    await DBAccount.updateOne({userId: req.userId}, {$inc: { balance: -amount}}).session(session);

    await session.commitTransaction()

    return res.json({
        message: "Transaction successful"
    })
})

module.exports = Account