const jwt = require("jsonwebtoken");
const CustomError = require("../utils/CustomError");
const { ACCESS_JWT_SECRET } = require("../config/config");


const userMiddleware = async (req, res, next) => {
    
  try{

  const authorization = req.headers.authorization;

  if(!authorization || !authorization.startsWith("Bearer ")){throw new CustomError(401, "Token invalid")}

  const token = authorization.split(" ")[1]

  if(!token){
    return res.json({
      message: "token is not present"
  })
}

  const response = jwt.verify(token, ACCESS_JWT_SECRET);
  req.userId = response.IDOFIT;

  next()
  
  } catch(e){
    const error = new CustomError(402, "The token is expired")
    next(error)

  }
}

module.exports = userMiddleware
