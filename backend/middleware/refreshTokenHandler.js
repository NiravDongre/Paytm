const jwt = require("jsonwebtoken")
const asyncHandler = require("../utils/asyncHandler");
const CustomError = require("../utils/CustomError");
const { REFRESH_JWT_SECRET, ACCESS_JWT_SECRET } = require("../config/config");
const { DBUser } = require("../models/user");

const RefreshTokenHandler = asyncHandler(async(req, res) => {

    const authorization = req.headers.authorization;
    if(!authorization || !authorization.startsWith("Bearer ")){throw new CustomError(401, "Authorization Token required")}
    const token = authorization.split(" ")[1];

    let response;

    try{
        response = jwt.verify(token, REFRESH_JWT_SECRET);
    }catch(err){
        throw new CustomError(401, "Auth refresh token is required")
    }

    const user = await DBUser.findById(response.IDOFIT);

    if(!user){
        throw new CustomError(404, "User not found")
    }

    if(! user.RefreshToken !== token ){
        throw new CustomError(401, "Expired token or Invalid token")
    }

    const accessToken = jwt.sign({IDOFIT: user._id}, ACCESS_JWT_SECRET, { expiresIn: "15m"}) 
    const refreshToken = jwt.sign({IDOFIT: user._id}, REFRESH_JWT_SECRET, { expiresIn: "15d"}) 

    user.RefreshToken = refreshToken;
    await user.save();

    return res.status(200).json({
        status: "success",
        accessToken,
        refreshToken
    })
})

module.exports = {
    RefreshTokenHandler
}