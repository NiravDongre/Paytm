const mongoose = require('mongoose');
const Schema = mongoose.Schema;

async function main(){
 await mongoose.connect(process.env.MONGO_URL)
 console.log("Connected")
}

main()

const user = new Schema({
    FirstName: String,
    LastName: String,
    Password: String
})

const accountSchema = new Schema({
    userId : {
        type: Schema.Types.ObjectId,
        ref: "DBUser",
        required: true
    },
    balance: {
        type: Number,
        balance: true
    }
})

const DBUser = mongoose.model("user", user);
const DBAccount = mongoose.model("account", accountSchema)

module.exports = {
    DBUser, DBAccount }