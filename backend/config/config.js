const mongoose = require("mongoose");
const CustomError = require("../utils/CustomError");
const ACCESS_JWT_SECRET = process.env.ACCESS_JWT_SECRET;
const REFRESH_JWT_SECRET = process.env.REFRESH_JWT_SECRET;


if(!ACCESS_JWT_SECRET){
    throw new CustomError(401, "jsonwebtoken is required")
}

if(!REFRESH_JWT_SECRET){
    throw new CustomError(401, "jsonwebtoken is required")
}

const main = async () => {
  try{
   await mongoose.connect(process.env.MONGO_URL)
   console.log("Connected");
  }catch(e){
    console.log("DataBase Crashed", e)
  }
}

module.exports = {
    ACCESS_JWT_SECRET: ACCESS_JWT_SECRET,
    REFRESH_JWT_SECRET: REFRESH_JWT_SECRET,
    main
}