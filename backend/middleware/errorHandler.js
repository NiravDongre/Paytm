const logger = require("../utils/logger")


const ERROR = (err, req, res, next) => {

    const status = err.status || "fail";
    const statusCode = err.statusCode || 500;
    const message = err.message || "Backend Crashed"
    
    logger.error("Error Occurred", {
    Method: req.method,
    url: req.OriginalUrl,
    stack: err.stack,
    message,
    statusCode

})
    return res.status(statusCode).json({status , message})
}

module.exports = ERROR