const edit = async(req, res, next) => {
    
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

}


const bulk = async(req, res, next) => {

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
}

module.exports = {
    edit, bulk
}