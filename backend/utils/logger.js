const winston = require("winston");
const { combine, timestamp, json, errors} = winston.format

const logger = winston.createLogger({
    level: "info",
    format: combine(
        errors({stack: true}),
        timestamp(),
        json()
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({filename: "log/error.log", level: "error"}),
        new winston.transports.File({filename: "log/combined.log"})
    ]
})

module.exports = logger