const mongoose = require("mongoose")

const main = async () => {
try{
 await mongoose.connect(process.env.MONGO_URL)
 console.log("Connected");
}catch(e){
    console.log("DataBase Crashed")
}

}

module.exports = main
