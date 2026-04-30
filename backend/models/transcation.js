const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const transaction = new Schema({
    fromAccount : {
        type: ObjectId,
        ref: "account",
        require: true,
        index: true
    },
    toAccount : {
        type: ObjectId,
        ref: "account",
        require: true,
        index: true
    },
    amount : {
        type: Number,
        required : true,
        min: [0]
    },
    idempotencykey: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    Status: {
        type: String,
        enum: ["PENDING", "COMPLETED", "FAILED"],
        default: "PENDING"
    }
},{
    timestamps: true
})

const TransactionModel = mongoose.model("transactions", transaction);
module.exports = {
    TransactionModel
}