const logger = require("../utils/logger")


const ERROR = (err, req, res, next) => {
    logger.error("Error Occurred", {
    Method: err.method,
    url: err.OriginalUrl,
    stack: err.stack,
    message: err.message || "Backend Crashed"
})
    const status = err.status || "fail"

    return res.status(err.statusCode || 500).json({status , message})
}

module.exports = ERROR