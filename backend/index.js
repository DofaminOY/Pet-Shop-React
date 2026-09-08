const express = require("express");
const cors = require("cors");

const categories = require("./routes/categories");
const products = require("./routes/products");
const sale = require("./routes/sale");
const order = require("./routes/order");

const sequelize = require("./database/database");

const Category = require("./database/models/category");
const Product = require("./database/models/product");

// Подключаем модель, чтобы Sequelize создал таблицу customers
require("./database/models/customer");

const PORT = 3333;

Category.hasMany(Product);

const app = express();

app.use(express.static("public"));

app.use(
  cors({
    origin: "*",
  }),
);

// JSON должен подключаться ДО маршрутов
app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.use("/categories", categories);
app.use("/products", products);
app.use("/sale", sale);
app.use("/order", order);

const start = async () => {
  try {
    await sequelize.sync();

    app.listen(PORT, () => {
      console.log(`Server started on ${PORT} port...`);
    });
  } catch (error) {
    console.error(error);
  }
};

start();
