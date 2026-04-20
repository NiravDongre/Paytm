const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const CustomError = require("../utils/CustomError");
const { ProtectedSignup, ProtectedSignin } = require("../validations/user.validation");
const { DBUser } = require("../models/user");
const { DBAccount } = require("../models/account");
const asyncHandler = require("../utils/asyncHandler");
const  mongoose  = require("mongoose");



const signup = asyncHandler(async(req, res, next) => {

    const session = await mongoose.startSession();

    try{

    session.startTransaction();

    const payload = req.body;
    const createpayload = ProtectedSignup.safeParse(payload);

    if(!createpayload.success){
        console.log(createpayload.error)
        throw new CustomError(400 ,"Pls put Correct inputs")
    }

    const { FirstName, LastName, Password } = createpayload.data;

    const existeduser = await DBUser.findOne({
        FirstName: FirstName
    }).session(session)

    if(existeduser){
        throw new CustomError(409, "The User is already Signed Up Pls Sign-in to log");
    }

    const HashedPassword = await bcrypt.hash(Password, 10);

    const userArr = await DBUser.create([{
        FirstName: FirstName,
        LastName: LastName,
        Password: HashedPassword
    }], {session })
    
    const user = userArr[0]
    const IDOFIT = user._id

    await DBAccount.create([{
        userId: IDOFIT,
        balance: 1 + Math.random() * 10000
    }], { session })

    const token = jwt.sign({
        IDOFIT
    }, process.env.JWT_SECRET);

    await session.commitTransaction()
    session.endSession()

    return res.status(201).json({
        token: token,
        userId: IDOFIT,
        message: "SignedUp"
    })
   }catch(err){
    await session.abortTransaction()
    session.endSession()
    throw err
   }
})

const signin = asyncHandler(async(req, res, next) => {
    const payload = req.body;
    const createpayload = ProtectedSignin.safeParse(payload);

    if(!createpayload.success){
        throw new CustomError(401, "Pls put Correct Inputs")
    }

    const { FirstName, Password } = createpayload.data;

    const MatchPassword = await bcrypt.compare(Password, user.Password)

    if(!MatchPassword){
        throw new CustomError(401, "Wrong Password")
    }

    const user = await DBUser.findOne({
        FirstName: FirstName,
    })

    const token = jwt.sign({
        IDOFIT: user._id
    }, JWT_SECRET)

    return res.status(200).json({
        status: "success",
        message: "SignedIn",
        token: token
    })

})

module.exports = {
    signup, signin
}