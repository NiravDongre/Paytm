require("dotenv").config()
const express = require("express");
const cors = require("cors");
const ratelimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize")
const helmet = require("helmet");
const router = require("./routes/main-router");
const ERROR = require("./middleware/errorHandler");
const { main } = require("./config/config");
const logger = require("./utils/logger");

const app = express();

const limiter = ratelimit({
  windowMs: 15 * 60 * 1000,
  limit: 15,
  message: "Please try again after 15 minutes"
})

app.use(express.json());
app.use(mongoSanitize())
app.use(helmet())
app.use("/api/v1", limiter)
app.use(cors());
app.use("/api/v1/", router);
app.use(ERROR);

const PORT = process.env.PORT || 3000

main().then(() => {
  app.listen(PORT, () => {
    logger.info(`Server is running on Port ${PORT}`)
  })
})
