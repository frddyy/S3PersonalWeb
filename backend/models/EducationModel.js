import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Education = db.define(
  "educations",
  {
    name_sch: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    start_year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    end_year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    major: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    information: {
      type: DataTypes.TEXT,
      allowNull: true,
    }
  },
  {
    freezeTableName: true,
  }
);

export default Education;

(async () => {
  try {
    await db.sync();
    console.log("Database synchronized");
  } catch (error) {
    console.error("Error synchronizing database:", error);
  }
})();
