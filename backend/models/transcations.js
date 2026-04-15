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
    status : {
        type: String,
        enum: { 
            value: ["Pending", "Complete", "Failed"]
        },
        default: "Pending"
    },
    amount : {
        type: Number,
        required : true,
        min: [0]
    },
    idempotencykey : {
        type: String,
        required: true,
        unique: true,
        index: true
    }
}, {
    timestamps: true
})


const TransactionModel = mongoose.model("transactions", transaction);

module.exports = {
    TransactionModel
}