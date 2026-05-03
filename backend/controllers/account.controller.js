const mongoose = require("mongoose")
const { DBAccount } = require("../models/account")
const { TransactionModel } = require("../models/transcation")
const CustomError = require("../utils/CustomError")
const asyncHandler = require("../utils/asyncHandler")
const logger = require("../utils/logger")

const balance = asyncHandler(async(req, res, next) => {
    
    const account = await DBAccount.findOne({
        userId: req.userId
    })

    if(!account){
        logger.warn("User's account not found", { 
            account: account })
        return next(new CustomError(404, "Account not found"))
    }

    logger.info("Balance fetched successfully",{
        account: account
    })

    return res.json({
        status: "success",
        Balance: account.balance
    })
})


const transfer = asyncHandler(async(req, res, next) => {

   const session = await mongoose.startSession();

   const amount = req.body?.amount
   const idempotencykey = req.headers?.idempotencykey
   const to = req.body?.to

    try{
    session.startTransaction();

    const userId = req.userId

    const NumericAmount = Number(amount)

    logger.info("Transaction attempt", {
        userId: req?.userId,
        amount: NumericAmount,
        ToAccount: req.body?.to,
        Idemkey: req.headers?.idempotencykey
    })

    if(isNaN(NumericAmount) || NumericAmount <= 0){
        logger.warn("Invalid amount", {
            Amount: NumericAmount
        })
        throw new CustomError(400, "invalid amount")
    }

    const account = await DBAccount.findOne({userId: req.userId}).session(session);

    if(!account || account.balance < NumericAmount){
        logger.warn("Insufficent amount", {
            Amount: NumericAmount
        })
        throw new CustomError(400, "Insufficent amount")
    }

    const toAccount = await DBAccount.findOne({userId: to}).session(session)

    if(!toAccount || to === req.userId){
        logger.warn("the receiver does not exists", {
            ToAccount: toAccount
        })
        await session.abortTransaction()
        return  next(new CustomError(404 ,"the receiver does not exists"))
    }

    if(!idempotencykey){
        logger.warn("Idempotency key is required",{
            idemkey: idempotencykey
        })
        await session.abortTransaction()
        return next(new CustomError(404, "Idempotency key is required"))
    }

    let transaction

    try{
    const docs = await TransactionModel.create(
        [{ 
        fromAccount: account._id,
        toAccount: toAccount._id,
        amount: NumericAmount,
        idempotencykey: idempotencykey,
        Status: "PENDING"
    }]
    , { session }
)

    transaction = docs[0]
} catch(err){

    if(err.code === 11000){

        await session.abortTransaction();
        await session.endSession();

    const isIdempotencykeyExisted = await TransactionModel.findOne({
        idempotencykey: idempotencykey
    })

        if(isIdempotencykeyExisted.Status === "COMPLETED"){
            return res.status(200).json({
                message: "Transaction already processed",
                transaction: isIdempotencykeyExisted
            })
        }

        const isStuck = (Date.now() - new Date(isIdempotencykeyExisted.createdAt)) > 10000

        if(isIdempotencykeyExisted.Status === "PENDING"){

            if(isStuck){
                return next(new CustomError(409, "Previous request stuck, retry with new key"))
            }
            return res.status(409).json({
                message: "Transaction is still processing"
            })
        }

        if(isIdempotencykeyExisted.Status === "FAILED"){

            logger.error("Transaction failed here's why:", {
            message: err.message,
            stack: err.stack,
            error: err.error,
            From: req?.userId,
            To: req.body?.to
            })
            return res.status(500).json({
                message: "Transaction processing failed, please retry"
            })
        }
    }

    throw err
}

    const result = await DBAccount.updateOne(
        {
            userId: req.userId,
            balance: { $gte: NumericAmount}
        }, 
        {$inc: { balance: -NumericAmount}}, 
        { session })


    await DBAccount.updateOne({userId: to}, {$inc: { balance: NumericAmount}}, { session })

    transaction.Status = "COMPLETED";
    await transaction.save({ session })

    await session.commitTransaction()
    await session.endSession()

    logger.info("Transaction Successed", {
          userId: userId,
          amount: amount,
          ToAccount: to,
          idemkey: idempotencykey,
    })
    return res.status(200).json({
        message: "Transaction successful"
    })

    } catch(err){
        logger.error("Transaction Failed", {
            message: err.message,
            stack: err.stack,
            error: err.error,
            From: req?.userId,
            To: req.body?.to
        })

    if (idempotencykey) {
        await TransactionModel.updateOne(
            { idempotencykey },
            { Status: "FAILED" }
        );
    }
        await session.abortTransaction();
        await session.endSession();
        next(err)
    }

})

module.exports = {
    balance, transfer
}
