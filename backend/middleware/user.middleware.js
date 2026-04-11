const jwt = require("jsonwebtoken");
const CustomError = require("../utils/CustomError");
const JWT_SECRET = "234567"

const userMiddleware = async (req, res, next) => {
    
    try{

    const token = req.headers.token;

    if(!token){
        return res.json({
            message: "token is not present"
      })
    }

    const response = jwt.verify(token, JWT_SECRET);
    req.userId = response.IDOFIT;

    next()

  } catch(e){

    const error = new CustomError(402, "The token is expired")
    
    next(error)

  }
}

module.exports = userMiddleware
