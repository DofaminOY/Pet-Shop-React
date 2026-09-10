const express = require("express");
const { Op } = require("sequelize");

const Product = require("../database/models/product");
const Customer = require("../database/models/customer");

const router = express.Router();

function getProductPrice(product) {
  const price = Number(product.price);

  const discountPrice =
    product.discont_price !== null && product.discont_price !== undefined
      ? Number(product.discont_price)
      : null;

  if (discountPrice !== null && discountPrice < price) {
    return discountPrice;
  }

  return price;
}

function normalizeEmail(email) {
  return String(email || "")
    .trim()
    .toLowerCase();
}

router.post("/send", async (req, res) => {
  const { customerId, name, phone, email, products } = req.body;

  const normalizedName = String(name || "").trim();
  const normalizedPhone = String(phone || "").trim();
  const normalizedEmail = normalizeEmail(email);

  if (
    normalizedName.length < 2 ||
    !normalizedPhone ||
    !normalizedEmail ||
    !Array.isArray(products) ||
    products.length === 0
  ) {
    res.status(400).json({
      status: "ERR",
      message: "Please check the order data.",
    });

    return;
  }

  const productIds = products
    .map((item) => Number(item.id))
    .filter((id) => Number.isInteger(id));

  if (productIds.length !== products.length) {
    res.status(400).json({
      status: "ERR",
      message: "Invalid products data.",
    });

    return;
  }

  const hasInvalidQuantity = products.some(
    (item) =>
      !Number.isInteger(Number(item.quantity)) || Number(item.quantity) < 1,
  );

  if (hasInvalidQuantity) {
    res.status(400).json({
      status: "ERR",
      message: "Invalid product quantity.",
    });

    return;
  }

  try {
    // Загружаем реальные товары из базы,
    // чтобы не доверять цене, пришедшей с frontend
    const databaseProducts = await Product.findAll({
      where: {
        id: {
          [Op.in]: productIds,
        },
      },
    });

    if (databaseProducts.length !== productIds.length) {
      res.status(400).json({
        status: "ERR",
        message: "One or more products were not found.",
      });

      return;
    }

    let subtotal = 0;

    products.forEach((orderItem) => {
      const databaseProduct = databaseProducts.find(
        (product) => product.id === Number(orderItem.id),
      );

      subtotal += getProductPrice(databaseProduct) * Number(orderItem.quantity);
    });

    let customer = null;
    let hasFirstOrderDiscount = false;

    // Если заказ делает зарегистрированный пользователь,
    // определяем аккаунт только по его id
    if (customerId) {
      customer = await Customer.findByPk(Number(customerId));

      if (!customer) {
        res.status(404).json({
          status: "ERR",
          message: "Customer was not found.",
        });

        return;
      }

      // Email аккаунта нельзя подменить в заказе
      if (normalizeEmail(customer.email) !== normalizedEmail) {
        res.status(400).json({
          status: "ERR",
          message: "Customer email does not match the active account.",
        });

        return;
      }

      hasFirstOrderDiscount = customer.hasCompletedFirstPurchase === false;
    }

    const discountAmount = hasFirstOrderDiscount ? subtotal * 0.05 : 0;

    const total = subtotal - discountAmount;

    if (customer && hasFirstOrderDiscount) {
      // После успешного первого заказа отмечаем скидку использованной
      customer.hasCompletedFirstPurchase = true;

      await customer.save();
    }

    res.json({
      status: "OK",
      message: "Order placed successfully.",

      order: {
        // Эти данные относятся только к этому заказу
        name: normalizedName,
        phone: normalizedPhone,
        email: normalizedEmail,

        subtotal,
        discountAmount,
        total,

        products: products.map((item) => ({
          id: Number(item.id),
          quantity: Number(item.quantity),
        })),
      },

      // Возвращаем исходный аккаунт.
      // Имя и телефон из формы заказа его не изменяют.
      customer: customer ? customer.toJSON() : null,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: "ERR",
      message: "Failed to place order.",
    });
  }
});

module.exports = router;
