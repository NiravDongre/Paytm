require("dotenv").config()
const express = require("express");
const cors = require("cors");
const router = require("./routes/main-router");
const ERROR = require("./middleware/errorHandler");
const ConnectDB = require("./config/config")

const app = express();

app.use(express.json())
app.use(cors());
app.use("/api/v1/", router);
app.use(ERROR);

const PORT = 3000

ConnectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on Port ${PORT}`)
  })
})
