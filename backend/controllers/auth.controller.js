const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const CustomError = require("../utils/CustomError");
const { ProtectedSignup, ProtectedSignin } = require("../validations/user.validation");

const { DBUser } = require("../models/user");



const signup = async(req, res, next) => {

    try{
    const payload = req.body;
    const createpayload = ProtectedSignup.safeParse(payload);

    if(!createpayload.success){
        const error = new CustomError(401 ,"Pls put Correct inputs")
        next(error)
    }

    const { FirstName, LastName, Password } = req.body;

    const existeduser = await DBUser.findOne({
        FirstName: FirstName
    })

    if(existeduser){
        const error = new CustomError(409, "The User is already Signed Up Pls Sign-in to log");
        next(error)
    }

    const HashedPassword = await bcrypt.hash(Password, 10);

    const user = await DBUser.create({
        FirstName: FirstName,
        LastName: LastName,
        Password: HashedPassword
    })

    const IDOFIT = user._id

    await DBAccount.create({
        userId: IDOFIT,
        balance: 1 + Math.random() * 10000
    })

    const token = jwt.sign({
        IDOFIT
    }, JWT_SECRET);

    if(user){
        return res.status(201).json({
            token: token,
            userId: IDOFIT,
            message: "SignedUp"
        })
    }

} catch(e){
    const error = new CustomError(400, "Pls try again");
    next(error)
}
}

const signin = async(req, res, next) => {

    try{
    const payload = req.body;
    const createpayload = ProtectedSignin.safeParse(payload);

    if(!createpayload.success){
        const error = new CustomError(401, "Pls put Correct Inputs")
        next(error)
    }

    const { FirstName, Password } = req.body;

    const MatchPassword = await bcrypt.compare(Password)

    const user = await DBUser.findOne({
        FirstName: FirstName,
        Password: MatchPassword
    })

    const token = jwt.sign({
        IDOFIT: user._id
    }, JWT_SECRET)

    return res.status(201).json({
        message: "SignedIn",
        token: token
    })

} catch(e){
    const error = new CustomError(400, "Pls try again");
    next(error)
}
}

module.exports = {
    signup, signin
}