const asyncHandler = require("../utils/asyncHandler");
const logger = require("../utils/logger");



const loggerMiddleware = asyncHandler(async (req, res, next) => {
    logger.info("Incoming request", {
    Method: req.method,
    url: req.url,
    ip: req.ip
})
    next()
})

module.exports = loggerMiddleware