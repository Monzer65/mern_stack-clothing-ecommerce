/** @format */

const express = require("express");

const app = express();

const cookieParser = require("cookie-parser");

require("dotenv").config();

const mongoose = require("mongoose");

const uri = require("./config/dbUri");

mongoose
  .connect(uri)
  .then(() => {
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

app.use(express.json());

app.use(cookieParser());

const cors = require("cors");

const corsOptions = require("./config/corsOptions");

app.use(cors(corsOptions));

const categories = require("./routes/categories");
app.use("/categories", categories);

const products = require("./routes/products");
app.use("/products", products);

const auth = require("./routes/auth");
app.use("/auth", auth);
