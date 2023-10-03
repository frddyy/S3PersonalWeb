import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Skill = db.define(
  "skills",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    thumbnail: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    level: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    identityId:{
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    freezeTableName: true,
  }
);

export default Skill;

(async () => {
  try {
    await db.sync();
    console.log("Database synchronized");
  } catch (error) {
    console.error("Error synchronizing database:", error);
  }
})();
