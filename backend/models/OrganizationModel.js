import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import User from "./UserModel.js";

const { DataTypes } = Sequelize;

const Organization = db.define(
  "organizations",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image: {
      type: DataTypes.BLOB,
      allowNull: true,
    },
    start_year: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    end_year: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    role: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    jobdesc: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false, // Assuming each education entry is associated with a user
    },
  },
  {
    freezeTableName: true,
  }
);

// Define the foreign key relationship
Organization.belongsTo(User, { foreignKey: "user_id" });

export default Organization;

(async () => {
  try {
    await db.sync();
    console.log("Database synchronized");
  } catch (error) {
    console.error("Error synchronizing database:", error);
  }
})();
