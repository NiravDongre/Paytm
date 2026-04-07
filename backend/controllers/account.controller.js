const { DBAccount } = require("../models/account")
const CustomError = require("../utils/CustomError")

const balance = async(req, res, next) => {
    try{
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

    }catch(e){
    const error = new CustomError(403, "Something went wrong")
}
}


const transfer = async(req, res, next) => {

    try{
    const session = await mongoose.startSession();

    session.startTransaction();
    const { amount, to } = req.body;

    const NumericAmount = Number(amount)

    const account = await DBAccount.findOne({userId: req.userId}).session(session);

    if(!account || account.balance < NumericAmount){
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

    await DBAccount.updateOne({userId: to}, {$inc: { balance: NumericAmount}}).session(session)
    await DBAccount.updateOne({userId: req.userId}, {$inc: { balance: -NumericAmount}}).session(session);

    await session.commitTransaction()

    return res.json({
        message: "Transaction successful"
    })
    } catch(e){
        const error = new CustomError(409, "The transaction got canceled")
        next(error)
    }
}

module.exports = {
    balance, transfer
}