const server = require("./src/app.js");
const mongoose = require("mongoose");
require("dotenv").config();
const { DB_TEXT } = process.env;

const connectionString = DB_TEXT;
server.listen(3000, () => {
  mongoose
    .connect(connectionString, {
      useNewUrlParser: true,
    })
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(err));
  console.log("%s listening at 3000"); // eslint-disable-line no-console
});
