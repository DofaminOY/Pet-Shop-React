const express = require("express");

const Product = require("../database/models/product");
const { getProductImages } = require("../utils/productImages");

const router = express.Router();

function prepareProduct(product) {
  const productData = product.toJSON();

  const images = getProductImages(productData.id);

  return {
    ...productData,
    images,
  };
}

router.get("/all", async (req, res) => {
  try {
    const products = await Product.findAll();

    res.json(products.map(prepareProduct));
  } catch {
    res.status(500).json({
      status: "ERR",
      message: "failed to load products",
    });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  if (Number.isNaN(Number(id))) {
    res.status(400).json({
      status: "ERR",
      message: "wrong id",
    });

    return;
  }

  try {
    const product = await Product.findByPk(Number(id));

    if (!product) {
      res.status(404).json({
        status: "ERR",
        message: "product not found",
      });

      return;
    }

    // Сохраняем существующий формат ответа API
    res.json([prepareProduct(product)]);
  } catch {
    res.status(500).json({
      status: "ERR",
      message: "failed to load product",
    });
  }
});

router.get(
  "/add/:title/:price/:discont_price/:description",
  async (req, res) => {
    const { title, price, discont_price, description } = req.params;

    try {
      await Product.create({
        title,
        price,
        discont_price,
        description,
        categoryId: 1,
      });

      res.json("добавлено");
    } catch {
      res.status(500).json({
        status: "ERR",
        message: "failed to add product",
      });
    }
  },
);

module.exports = router;
