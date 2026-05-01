const { DBAccount } = require("../models/account")
const { TransactionModel } = require("../models/transcation")
const asyncHandler = require("../utils/asyncHandler")
const CustomError = require("../utils/CustomError")
const logger = require("../utils/logger")



const history = asyncHandler(async(req, res, next) => {

    const account = await DBAccount.findOne({ userId: req.userId })

    logger.info("Transaction history attempts")

    if(!account){
        logger.warn("Accout found")
        return next(new CustomError(404, "Account not found"))
    }

    const filter = {
        $or:[
            { fromAccount: account._id },
            { toAccount: account._id}
        ]
    }

    const page = req.query.page*1 || 1;
    const limit = req.query.limit*1 || 10;
    const skip = ( page - 1) * limit

    const total = await TransactionModel.countDocuments(filter);

    if(skip >= total){
        logger.warn("Only this much transation are stored")
        return next(new CustomError(404, "Page not Found"))
    }

    const transactions = await TransactionModel
    .find(filter)
    .sort("-createdAt")
    .skip(skip)
    .limit(limit)

    logger.info("Transaction history successfull")

    return res.status(200).json({
        results: transactions.length,
        total,
        data: transactions
   })
})


module.exports = { history }