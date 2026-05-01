const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const CustomError = require("../utils/CustomError");
const { ProtectedSignup, ProtectedSignin } = require("../validations/user.validation");
const { DBUser } = require("../models/user");
const { DBAccount } = require("../models/account");
const asyncHandler = require("../utils/asyncHandler");
const  mongoose  = require("mongoose");
const { ACCESS_JWT_SECRET, REFRESH_JWT_SECRET } = require("../config/config");
const logger = require("../utils/logger");



const signup = asyncHandler(async(req, res, next) => {

    const session = await mongoose.startSession();

    try{

    session.startTransaction();

    const payload = req.body;

    logger.info("Signing Up attempt", {
        username: payload?.UserName,
        email: payload?.Email,
    })

    const createpayload = ProtectedSignup.safeParse(payload);



    if(!createpayload.success){
        logger.warn("Signup validation failed", {
            error: createpayload.error,
        })
        throw new CustomError(400 ,"Pls put Correct inputs")
    }

    const { UserName, Email, Password } = createpayload.data;

    const existeduser = await DBUser.findOne({
        UserName: UserName
    }).session(session)

    if(existeduser){
        logger.info("User already existed",{
            UserName
        })
        throw new CustomError(409, "The User is already Signed Up Pls Sign-in to log");
    }

    const HashedPassword = await bcrypt.hash(Password, 10);

    const userArr = await DBUser.create([{
        UserName: UserName,
        Email: Email,
        Password: HashedPassword
    }], {session })
    
    const user = userArr[0]
    const IDOFIT = user._id

    await DBAccount.create([{
        userId: IDOFIT,
        balance: 1 + Math.random() * 10000
    }], { session })

    const accessToken = jwt.sign({
        IDOFIT
    }, ACCESS_JWT_SECRET,{
        expiresIn: "15m"
    });

    const refreshToken = jwt.sign({
        IDOFIT
    }, REFRESH_JWT_SECRET,{
        expiresIn: "15d"
    });

    user.RefreshToken = refreshToken;
    await user.save()

    await session.commitTransaction()
    session.endSession()

    logger.info("User signed-up Successfully", {
        userId: IDOFIT,
        username: UserName,
        email: Email
    })

    return res.status(201).json({
        status: "success",
        accessToken: accessToken,
        refreshToken: refreshToken,
        userId: IDOFIT,
        message: "SignedUp"
    })
   }catch(err){
    await session.abortTransaction()
    session.endSession()

    logger.error("SignedUp Failed", {
        message: err.message,
        username: req.body?.UserName,
        email: req.body?.Email,
    })
    throw err
   }
})

const signin = asyncHandler(async(req, res, next) => {

    const payload = req.body;

    logger.info("Sign-in attempt",{
        username: payload?.UserName
    })
    const createpayload = ProtectedSignin.safeParse(payload);

    if(!createpayload.success){
        logger.warn("Sign-in validation failed", {
            error: createpayload.error,
        })
        return next( new CustomError(401, "Pls put Correct Inputs"))
    }

    const { UserName, Password } = createpayload.data;

    const user = await DBUser.findOne({
        UserName: UserName,
    })

    if(!user){
        logger.warn("User not Found", {
            username: UserName
        })
        return next(new CustomError(404, "User not Found"))
    }

    const MatchPassword = await bcrypt.compare(Password, user.Password)

    if(!MatchPassword){
        logger.warn("PLS Enter valid password")
        return next(new CustomError(401, "Wrong Password"))
    }


    const accessToken = jwt.sign({
        IDOFIT: user._id
    }, ACCESS_JWT_SECRET,{
        expiresIn: "15m"
    });

    const refreshToken = jwt.sign({
        IDOFIT: user._id
    }, REFRESH_JWT_SECRET,{
        expiresIn: "15d"
    });

    user.RefreshToken = refreshToken;
    await user.save()


    logger.info("User successfully sign-In", {
        username: UserName
    })

    return res.status(200).json({
        status: "success",
        message: "SignedIn",
        accessToken: accessToken,
        refreshToken: refreshToken,
    })

})

const loggout = asyncHandler(async(req, res) => {

    const userId = req.userId

    const user = await DBUser.findById(userId)

    user.RefreshToken = null;
    await user.save();
    
    logger.info("User logged out")
    return res.status(200).json({
        message: "User logged out"
    })
})

module.exports = {
    signup, signin, loggout
}