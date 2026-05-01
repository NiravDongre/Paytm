const winston = require("winston");
const { combine, timestamp, printf, errors} = winston.format

const logger = winston.createLogger({
    level: "info",
    format: combine(
        errors({stack: true}),
        timestamp(),
        printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({filename: "error.log", level: "error"})
    ]
})

module.exports = logger