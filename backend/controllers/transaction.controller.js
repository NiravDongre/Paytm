const { TransactionModel } = require("../models/transcations")
const CustomError = require("../utils/CustomError")



const history = async (req, res, next) => {
    try{

        const transaction = await TransactionModel.find({
            $or:[
                { fromAccount: req.userId },
                { toAccount: req.userId}
            ]
        })

        if(!transaction){
            const error = new CustomError("No Transaction history", 400)
            next(error)
        }

        return res.status(200).json({
            Transaction: transaction
        })

    }catch(e){
        const error = new CustomError("Not Found", 404);
        next(error)
    }
}


module.exports = { history }