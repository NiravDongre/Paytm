const { Router } = require("express");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const { DBUser, DBAccount } = require("../db");
const userMiddleware = require("../middleware");

const User = Router();

User.post("/signup", async(req, res) => {
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
            message: "SignedUp"
        })
    }
})

User.post("/signin", async(req, res) => {

    const { FirstName, Password } = req.body;

    const user = await DBUser.findOne({
        FirstName: FirstName,
        Password: Password
    })

    const token = jwt.sign({
        UserInfo: user._id
    }, JWT_SECRET)

    return res.status(201).json({
        message: "SignedIn",
        token: token
    })
})

User.put("/edit", userMiddleware, async(req, res) => {
    
    const { Password } = req.body;

    const user = await DBUser.findOneAndUpdate( Password ,{
        _id: req.userId
    })

    if(!user){
        return res.json({
            message: "Something Broke"
        })
    }

    return res.json({
        message: "Got updated"
    })

})

User.get("/bulk", userMiddleware, async(req, res) => {

    const filter = req.query.filter || "";

    const AllUser = DBUser.find({
        $or:[{
            FirstName: {
                "$regex": filter
            }
        },{
            LastName: {
                "$regex": filter
            }
        }]
    })

    return res.json({
        user: AllUser.map(users => ({
            FirstName: users.FirstName,
            LastName: users.LastName,
            _id: users._id
        }))
    })
})
module.exports = User