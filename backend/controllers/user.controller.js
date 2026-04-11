const { DBUser } = require("../models/user");
const CustomError = require("../utils/CustomError");


const edit = async(req, res, next) => {

    try{
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
        message: "Got updated"
    })
    } catch(e){
        const error = new CustomError(400, "Can not edit the password")
        next(error)
    }
}


const bulk = async(req, res, next) => {

    try{
    const filter = req.query.filter || "";

    const AllUser = await DBUser.find({
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
    } catch(e){
        const error = new CustomError(404, "User not found");
        next(error)
    }
}

module.exports = {
    edit, bulk
}