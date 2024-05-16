const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const multer = require("multer");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

const app = express();
const Authroute = require("./Routes/AuthRoute");
// console.log(require("crypto").randomBytes(64).toString("hex"));
// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, { dbName: "booth" })
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.log("Database connection failed", err));

// Middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

// Routes
app.use("/api", Authroute);

// Starting the Application
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`App is running at ${port}`);
});
