const express = require("express");
const { errorHandler, notFound } = require("./middlewares/errorHandler");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const mongoose = require("mongoose");
const uri = require("./config/dbUri");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");

const app = express();

mongoose
  .connect(uri)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB:", err);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.send("Server is running");
});
app.use("/categories", require("./routes/categories"));
app.use("/products", require("./routes/products"));
app.use("/reviews", require("./routes/reviews"));
app.use("/cart", require("./routes/cart"));
app.use("/auth", require("./routes/auth"));
app.use("/profile", require("./routes/profile"));

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
