const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const user = new Schema({
    FirstName: String,
    LastName: String,
    Password: String
})

const DBUser = mongoose.model("user", user);


module.exports = { DBUser }