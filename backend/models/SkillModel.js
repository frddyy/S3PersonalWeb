import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import User from "./UserModel.js";

const { DataTypes } = Sequelize;

const Skill = db.define(
  "skills",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    thumbnail: {
      type: DataTypes.BLOB,
      allowNull: true,
    },
    level: {
      type: DataTypes.STRING,
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
Skill.belongsTo(User, { foreignKey: "user_id" });

export default Skill;

(async () => {
  try {
    await db.sync();
    console.log("Database synchronized");
  } catch (error) {
    console.error("Error synchronizing database:", error);
  }
})();
