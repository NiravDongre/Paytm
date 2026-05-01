const asyncHandler = require("../utils/asyncHandler");
const logger = require("../utils/logger");



const loggerMiddleware = (req, res, next) => {

    const start =  Date.now();

    logger.info("Incoming request", {
    Method: req.method,
    url: req.originalUrl,
    ip: req.ip
    })

    res.on("finish", () => {
        logger.info("Request complete", {
            Method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            duration: `${Date.now() - start}ms`
        })
    })

    next()
}

module.exports = loggerMiddleware