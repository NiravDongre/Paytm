const { DBUser } = require("../models/user");
const asyncHandler = require("../utils/asyncHandler");
const CustomError = require("../utils/CustomError");


const edit = asyncHandler(async(req, res, next) => {
    const { Password } = req.body;

    const user = await DBUser.findOneAndUpdate(
        { _id: req.userId },
        { Password }
    )

    if(!user){
        return res.json({
            message: "Something Broke"
        })
    }
    return res.json({
        status: "success",
        message: "Got updated"
    })
})


const bulk = asyncHandler(async(req, res) => {

    const userId = req.userId;

    const filter = req.query.filter || "";

    const AllUser = await DBUser.find({
        _id: { $ne: userId},
        UserName: { "$regex": filter, "$options": "i" }
    })

    return res.json({
        status: "success",
        user: AllUser.map(users => ({
            FirstName: users.FirstName,
            LastName: users.LastName,
            _id: users._id
        }))
    })
})


module.exports = {
    edit, bulk
}