import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Portfolio from "./PortfolioModel.js";

const { DataTypes } = Sequelize;

const PortfolioImage = db.define(
  "portfolio_images",
  {
    image: {
      type: DataTypes.BLOB,
      allowNull: true,
    },
    portfolio_id: {
      type: DataTypes.INTEGER,
      allowNull: false, // Assuming each education entry is associated with a user
    }
  },
  {
    freezeTableName: true,
  }
);

// Define the foreign key relationship
PortfolioImage.belongsTo(Portfolio, { foreignKey: "portfolio_id" });

export default Portfolio;

(async () => {
  try {
    await db.sync();
    console.log("Database synchronized");
  } catch (error) {
    console.error("Error synchronizing database:", error);
  }
})();
