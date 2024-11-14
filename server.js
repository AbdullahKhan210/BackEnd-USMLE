const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./configuration.env" });
const app = require("./app");

const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then(() => console.log("DB connection successful!"));

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`listening to port ${port}`);
});
