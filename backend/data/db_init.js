const { Sequelize, DataTypes } = require("sequelize");
const path = require("path");

// Initialize an SQLite database
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join(__dirname, "database.sqlite"),
});

// Test the connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

// Define the models
const BlockedSeller = sequelize.define("BlockedSeller", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  blocked_by_uuid: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  website: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "njuskalo.hr",
  },
});

// Synchronize the models with the database
(async () => {
  try {
    // {alter:true}
    await sequelize.sync({ alter: true });
    console.log("All models were synchronized successfully.");
  } catch (error) {
    console.error("Unable to synchronize the models with the database:", error);
  }
})();

// Export the models
module.exports = { BlockedSeller };
