const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const user = new Schema({
    FirstName: {type: String, required: true},
    LastName: {type: String, required: true},
    Password: {type: Number, required: true}
})

const DBUser = mongoose.model("user", user);


module.exports = { DBUser }