// const app = require("./app");
// const dotenv = require("dotenv");
// const mongoose = require("mongoose");
import app from "./app.js";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config({ path: "./config.env" });

const db = process.env.DATABASE_URL.replace(
  "<db_password>",
  process.env.DATABASE_PASSWORD
);

mongoose.connect(db).then((con) => {
  console.log("Database connected successfully.");
});

app.listen(process.env.PORT, () => {
  console.log(`Server started at localhost:${process.env.PORT}`);
});
