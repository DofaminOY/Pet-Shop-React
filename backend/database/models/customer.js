const sequelize = require("../database");
const { DataTypes } = require("sequelize");

const Customer = sequelize.define("customer", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  // Нормализованный email используется для поиска пользователя
  emailNormalized: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  // Нормализованный номер позволяет сравнивать
  // локальный и международный формат
  phoneNormalized: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

  // false — дополнительная скидка 5% еще доступна
  // true — первая покупка уже выполнена
  hasCompletedFirstPurchase: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

module.exports = Customer;
