const express = require("express");
// const tourRouter = require('./routes/tourRoutes');
const authRoutes = require("./routes/authRoutes");
// const reviewRouter = require('./routes/reviewRoutes');
// const globalErrorHandler = require('./controllers/errorControllers');

var cors = require("cors");
const app = express();
app.use(cors());

app.use((req, res, next) => {
  console.log("Hello from the middleware11");
  next();
});

app.use(express.json({ limit: "10kb" }));

app.use("/api/v1/users", authRoutes);
// app.use(globalErrorHandler);
module.exports = app;
