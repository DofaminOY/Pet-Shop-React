const express = require("express");
const { Op } = require("sequelize");

const Customer = require("../database/models/customer");
const Product = require("../database/models/product");

const router = express.Router();

function normalizeEmail(email) {
  return String(email || "")
    .trim()
    .toLowerCase();
}

function normalizeName(name) {
  return String(name || "")
    .normalize("NFKC")
    .toLowerCase()
    .replace(/\s+/g, "");
}

function normalizePhone(phone) {
  let digits = String(phone || "").replace(/\D/g, "");

  if (digits.startsWith("0049")) {
    digits = digits.slice(2);
  }

  if (digits.startsWith("0")) {
    digits = `49${digits.slice(1)}`;
  }

  return digits;
}

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

router.get("/send", (req, res) => {
  res.json({});
});

router.post("/send", async (req, res) => {
  try {
    const { name, email, phone, products } = req.body || {};

    if (
      !name ||
      !email ||
      !phone ||
      !Array.isArray(products) ||
      products.length === 0
    ) {
      return res.status(400).json({
        status: "ERR",
        message: "Invalid order data.",
      });
    }

    const emailNormalized = normalizeEmail(email);
    const phoneNormalized = normalizePhone(phone);
    const nameNormalized = normalizeName(name);

    const customers = await Customer.findAll({
      where: {
        [Op.or]: [{ emailNormalized }, { phoneNormalized }],
      },
    });

    if (customers.length > 1) {
      return res.status(409).json({
        status: "ERR",
        message: "Customer identification data conflict.",
      });
    }

    const customer = customers[0] || null;

    // Если пользователь найден,
    // все три значения должны совпасть
    if (customer) {
      const sameName = normalizeName(customer.name) === nameNormalized;

      const sameEmail = customer.emailNormalized === emailNormalized;

      const samePhone = customer.phoneNormalized === phoneNormalized;

      if (!sameName || !sameEmail || !samePhone) {
        return res.status(409).json({
          status: "ERR",
          message:
            "The entered customer information does not match the registered account.",
        });
      }
    }

    const normalizedItems = products.map((item) => ({
      id: Number(item.id),
      quantity: Number(item.quantity),
    }));

    const hasInvalidItem = normalizedItems.some(
      (item) =>
        !Number.isInteger(item.id) ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1,
    );

    if (hasInvalidItem) {
      return res.status(400).json({
        status: "ERR",
        message: "Invalid products.",
      });
    }

    const uniqueProductIds = [
      ...new Set(normalizedItems.map((item) => item.id)),
    ];

    // Цены берем исключительно из базы данных
    const databaseProducts = await Product.findAll({
      where: {
        id: {
          [Op.in]: uniqueProductIds,
        },
      },
    });

    if (databaseProducts.length !== uniqueProductIds.length) {
      return res.status(400).json({
        status: "ERR",
        message: "Some products do not exist.",
      });
    }

    const productMap = new Map(
      databaseProducts.map((product) => [product.id, product]),
    );

    let subtotal = 0;

    normalizedItems.forEach((item) => {
      const product = productMap.get(item.id);

      subtotal += getProductPrice(product) * item.quantity;
    });

    subtotal = Number(subtotal.toFixed(2));

    let firstOrderDiscountApplied = false;

    // Только зарегистрированный пользователь,
    // который еще не покупал, получает дополнительные 5%
    if (customer) {
      const [updatedRows] = await Customer.update(
        {
          hasCompletedFirstPurchase: true,
        },
        {
          where: {
            id: customer.id,
            hasCompletedFirstPurchase: false,
          },
        },
      );

      firstOrderDiscountApplied = updatedRows === 1;
    }

    const firstOrderDiscountAmount = firstOrderDiscountApplied
      ? Number((subtotal * 0.05).toFixed(2))
      : 0;

    const total = Number((subtotal - firstOrderDiscountAmount).toFixed(2));

    const updatedCustomer = customer
      ? await Customer.findByPk(customer.id)
      : null;

    return res.json({
      status: "OK",
      message: "request processed",

      firstOrderDiscountApplied,

      pricing: {
        subtotal,
        firstOrderDiscountAmount,
        total,
      },

      customer: updatedCustomer
        ? {
            id: updatedCustomer.id,
            name: updatedCustomer.name,
            email: updatedCustomer.email,
            phone: updatedCustomer.phone,
            hasCompletedFirstPurchase:
              updatedCustomer.hasCompletedFirstPurchase,
          }
        : null,
    });
  } catch (error) {
    console.error("Order error:", error);

    return res.status(500).json({
      status: "ERR",
      message: "Internal server error.",
    });
  }
});

module.exports = router;
