const express = require("express");
const { Op } = require("sequelize");

const Customer = require("../database/models/customer");

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

  // 0049... превращаем в 49...
  if (digits.startsWith("0049")) {
    digits = digits.slice(2);
  }

  // Немецкий локальный номер 0170...
  // превращаем в международный 49170...
  if (digits.startsWith("0")) {
    digits = `49${digits.slice(1)}`;
  }

  return digits;
}

function isValidName(name) {
  const value = String(name || "").trim();

  // Разрешаем обычное имя, псевдоним или nickname
  return /^[\p{L}\p{M}\p{N}][\p{L}\p{M}\p{N}\s'._-]{1,39}$/u.test(value);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(normalizeEmail(email));
}

function isValidPhone(phone) {
  const value = String(phone || "").trim();

  const allowedCharacters = /^\+?[\d\s()-]+$/.test(value);

  const normalizedPhone = normalizePhone(value);

  return (
    allowedCharacters &&
    normalizedPhone.length >= 10 &&
    normalizedPhone.length <= 15
  );
}

router.get("/send", (req, res) => {
  res.json({});
});

router.post("/send", async (req, res) => {
  try {
    const { name, email, phone } = req.body || {};

    if (!isValidName(name)) {
      return res.status(400).json({
        status: "ERR",
        code: "INVALID_NAME",
        message: "Please enter a valid name.",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        status: "ERR",
        code: "INVALID_EMAIL",
        message: "Please enter a valid email address.",
      });
    }

    if (!isValidPhone(phone)) {
      return res.status(400).json({
        status: "ERR",
        code: "INVALID_PHONE",
        message: "Please enter a valid phone number.",
      });
    }

    const emailNormalized = normalizeEmail(email);
    const phoneNormalized = normalizePhone(phone);
    const nameNormalized = normalizeName(name);

    // Ищем совпадение по email ИЛИ телефону
    const customers = await Customer.findAll({
      where: {
        [Op.or]: [{ emailNormalized }, { phoneNormalized }],
      },
    });

    // Email одного пользователя и телефон другого
    if (customers.length > 1) {
      return res.status(409).json({
        status: "ERR",
        code: "CUSTOMER_CONFLICT",
        message:
          "This email or phone number is already registered with different customer data.",
      });
    }

    const customer = customers[0] || null;

    // Новый пользователь
    if (!customer) {
      const newCustomer = await Customer.create({
        name: String(name).trim(),
        email: String(email).trim(),
        emailNormalized,
        phone: String(phone).trim(),
        phoneNormalized,
        hasCompletedFirstPurchase: false,
      });

      return res.status(201).json({
        status: "OK",
        mode: "registered",
        message: "Registration completed successfully.",
        eligibleForFirstOrderDiscount: true,

        customer: {
          id: newCustomer.id,
          name: newCustomer.name,
          email: newCustomer.email,
          phone: newCustomer.phone,
          hasCompletedFirstPurchase: newCustomer.hasCompletedFirstPurchase,
        },
      });
    }

    const sameName = normalizeName(customer.name) === nameNormalized;

    const sameEmail = customer.emailNormalized === emailNormalized;

    const samePhone = customer.phoneNormalized === phoneNormalized;

    // Есть совпадение email или phone,
    // но остальные данные не принадлежат этому пользователю
    if (!sameName || !sameEmail || !samePhone) {
      return res.status(409).json({
        status: "ERR",
        code: "CUSTOMER_ALREADY_EXISTS",
        message:
          "This customer already exists. Enter the same name, email and phone number to sign in.",
      });
    }

    // Все данные совпали — считаем это входом
    return res.json({
      status: "OK",
      mode: "signedIn",
      message: "Signed in successfully.",

      eligibleForFirstOrderDiscount: !customer.hasCompletedFirstPurchase,

      customer: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        hasCompletedFirstPurchase: customer.hasCompletedFirstPurchase,
      },
    });
  } catch (error) {
    console.error("Customer registration error:", error);

    return res.status(500).json({
      status: "ERR",
      code: "SERVER_ERROR",
      message: "Internal server error.",
    });
  }
});

module.exports = router;
