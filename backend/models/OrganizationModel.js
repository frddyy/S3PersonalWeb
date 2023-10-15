import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import User from "./UserModel.js";

const { DataTypes } = Sequelize;

const Organization = db.define(
  "organizations",
  {
    name_org: {         
      type: DataTypes.STRING,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
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
      type: DataTypes.STRING, 
      allowNull: true,
    },
    jobdesc: {
      type: DataTypes.TEXT,
      allowNull: true,
    }
  },
  {
    freezeTableName: true,
  }
);


export default Organization;

// (async () => {
//   try {
//     await db.sync();
//     console.log("Database synchronized");
//   } catch (error) {
//     console.error("Error synchronizing database:", error);
//   }
// })();
