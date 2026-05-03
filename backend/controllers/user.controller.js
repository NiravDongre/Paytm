const { DBUser } = require("../models/user");
const asyncHandler = require("../utils/asyncHandler");
const CustomError = require("../utils/CustomError");


const edit = asyncHandler(async(req, res, next) => {
    const { Password } = req.body;

    logger.info("attempting to change the password")

    const user = await DBUser.findOneAndUpdate(
        { _id: req.userId },
        { Password }
    )

    if(!user){
        logger.warn("Couldn't found user to change the password")
        return res.status(404).json({
            message: "Couldn't found user to change the password"
        })
    }

    logger.info("Successfully attempt to update the password")
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
            UserName: users.UserName,
            _id: users._id
        }))
    })
})


module.exports = {
    edit, bulk
}
