const mongoose = require("mongoose")
const { DBAccount } = require("../models/account")
const { TransactionModel } = require("../models/transcation")
const CustomError = require("../utils/CustomError")
const asyncHandler = require("../utils/asyncHandler")

const balance = asyncHandler(async(req, res, next) => {
    const account = await DBAccount.findOne({
        userId: req.userId
    })

    if(!account){
        return next(new CustomError(404, "Account not found"))
    }

    return res.json({
        status: "success",
        Balance: account.balance
    })
})


const transfer = asyncHandler(async(req, res, next) => {

   const session = await mongoose.startSession();
    try{
    session.startTransaction();

    const { amount, to } = req.body;

    const NumericAmount = Number(amount)

    if(isNaN(NumericAmount) || NumericAmount <= 0){
        throw new CustomError(400, "invalid amount")
    }

    const account = await DBAccount.findOne({userId: req.userId}).session(session);

    if(!account || account.balance < NumericAmount){
        throw new CustomError(400, "Insufficent amount")
    }

    const toAccount = await DBAccount.findOne({userId: to}).session(session)

    if(!toAccount){
        await session.abortTransaction()
        return  next(new CustomError(404 ,"the receiver does not exists"))
    }

    await DBAccount.updateOne({userId: to}, {$inc: { balance: NumericAmount}}).session(session)
    await DBAccount.updateOne({userId: req.userId}, {$inc: { balance: -NumericAmount}}).session(session);
    await TransactionModel.create([{ 
        fromAccount: req.userId,
        toAccount: to,
        amount: NumericAmount
    }], { session })


    await session.commitTransaction()
    await session.endSession()

    return res.status(200).json({
        message: "Transaction successful"
    })

    } catch(err){
        await session.abortTransaction();
        await session.endSession();
        throw err
    }

})

module.exports = {
    balance, transfer
}