import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import User from "./UserModel.js";

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
        type: DataTypes.BLOB,
        allowNull: true,
      },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false, // Assuming each education entry is associated with a user
    }
  },
  {
    freezeTableName: true,
  }
);

// Define the foreign key relationship
Portfolio.belongsTo(User, { foreignKey: "user_id" });

export default Portfolio;

(async () => {
  try {
    await db.sync();
    console.log("Database synchronized");
  } catch (error) {
    console.error("Error synchronizing database:", error);
  }
})();
