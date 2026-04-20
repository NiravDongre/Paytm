const mongoose = require("mongoose");
const CustomError = require("../utils/CustomError");
const JWT_SECRET = process.env.JWT_SECRET;

if(!JWT_SECRET){
    throw new CustomError(401, "jsonwebtoken is required")
}

const main = async () => {
try{
 await mongoose.connect(process.env.MONGO_URL)
 console.log("Connected");
}catch(e){
    console.log("DataBase Crashed")
}

}

module.exports = {
    JWT_SECRET: JWT_SECRET
    ,main
}