const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const user = new Schema({
    UserName: {
        type: String,
        unique: true,
        required: true
    },
    Email: {
        type: String,
        unique: true,
        required: true
    },
    Password: {
        type: String,
        required: true
    }
})

const DBUser = mongoose.model("user", user);


module.exports = { DBUser }