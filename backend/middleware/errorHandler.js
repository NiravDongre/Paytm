

const ERROR = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const status = err.status || "fail"
    const message = err.message || "Backend Crashed"

    return res.status(statusCode).json({status ,message})
}

module.exports = ERROR