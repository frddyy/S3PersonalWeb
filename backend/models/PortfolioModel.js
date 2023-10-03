import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import PortfolioImage from "./PortfolioImageModel.js";

const { DataTypes } = Sequelize;

const Portfolio = db.define(
  "portfolios",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    attachment: {
        type: DataTypes.STRING,
        allowNull: true,
      }
  },
  {
    freezeTableName: true,
  }
);

// Define the foreign key relationship
Portfolio.hasMany(PortfolioImage);
PortfolioImage.belongsTo(Portfolio);

export default Portfolio;

(async () => {
  try {
    await db.sync();
    console.log("Database synchronized");
  } catch (error) {
    console.error("Error synchronizing database:", error);
  }
})();