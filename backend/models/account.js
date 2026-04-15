const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const accountSchema = new Schema({
    userId : {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    balance: {
        type: Number,
        balance: true
    }
})

const DBAccount = mongoose.model("account", accountSchema)

module.exports = { DBAccount }