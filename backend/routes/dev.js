const express = require("express");

const sequelize = require("../database/database");
const Customer = require("../database/models/customer");

const router = express.Router();

// Удаление всех тестовых пользователей.
// Маршрут предназначен только для разработки.
router.delete("/customers", async (req, res) => {
  if (process.env.NODE_ENV === "production") {
    res.status(404).json({
      status: "ERR",
      message: "Route not found.",
    });

    return;
  }

  try {
    const deletedCount = await Customer.destroy({
      where: {},
    });

    // Сбрасываем AUTOINCREMENT таблицы customers
    await sequelize.query(
      "DELETE FROM sqlite_sequence WHERE name = 'customers';",
    );

    res.json({
      status: "OK",
      deletedCount,
      message: "Customers cleared.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: "ERR",
      message: "Failed to clear customers database.",
    });
  }
});

module.exports = router;
