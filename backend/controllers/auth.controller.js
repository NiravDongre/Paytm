const signup = async(req, res, next) => {
    const { FirstName, LastName, Password } = req.body;

    const user = await DBUser.create({
        FirstName: FirstName,
        LastName: LastName,
        Password: Password
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
}

const signin = async(req, res, next) => {

    const { FirstName, Password } = req.body;

    const user = await DBUser.findOne({
        FirstName: FirstName,
        Password: Password
    })

    const token = jwt.sign({
        IDOFIT: user._id
    }, JWT_SECRET)

    return res.status(201).json({
        message: "SignedIn",
        token: token
    })
}

module.exports = {
    signup, signin
}