const jwt = require("jsonwebtoken")
const JWT_SECRET = "234567"

const userMiddleware = async(req, res, next) => {
    const token = req.headers.token;
    if(!token){
        return res.json({
            message: "token is not present"
        })
    }
    const response = jwt.verify(token, JWT_SECRET);
   req.userId = response.IDOFIT;
    next()
}

module.exports = userMiddleware
