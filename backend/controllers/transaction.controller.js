const { DBAccount } = require("../models/account")
const { TransactionModel } = require("../models/transcations")
const asyncHandler = require("../utils/asyncHandler")
const CustomError = require("../utils/CustomError")



const history = asyncHandler(async(req, res, next) => {

    const account = await DBAccount.findOne({ userId: req.userId })

    if(!account){
        return next(new CustomError("Account not found", 404))
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
        return next(new CustomError("Page not Found", 404))
    }

    const transactions = await TransactionModel
    .find(filter)
    .sort("-createdAt")
    .skip(skip)
    .limit(limit)

    return res.status(200).json({
        results: transactions.length,
        total,
        data: transactions
   })
})


module.exports = { history }