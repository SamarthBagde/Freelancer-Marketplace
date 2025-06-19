import app from "./app.js";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config({ path: "./config.env" });

const db = process.env.DATABASE_URL.replace(
  "<db_password>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(db)
  .then((con) => {
    console.log("Database connected successfully.");
  })
  .catch((e) => {
    console.log("Error while connecting to db", e.name, e.message);
  });

const server = app.listen(process.env.PORT, () => {
  console.log(`Server started at localhost:${process.env.PORT}`);
});

//Note : you should not blindly relly on these  error handlers. you should handled right where they occure

//occurs when a Promise is rejected and no .catch() handler is attached to handle that rejection.
process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejections");
  console.log(err.name, err.message);
  //in this case close your server
  server.close(() => {
    process.exit(1);
  });
});

//handling uncaught exception like variable is use but not defined
// this should be at top of this file
process.on("uncaughtException", (err) => {
  console.log("Unhandled Rejections");
  console.log(err.name, err.message);
  process.exit(1);
});
