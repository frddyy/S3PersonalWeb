import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import User from "./UserModel.js";

const { DataTypes } = Sequelize;

const Education = db.define("educations",{
    name_sch: {
        type: DataTypes.STRING,
        allowNull: false
    },
    start_year: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    end_year: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    major: {
        type: DataTypes.STRING,
        allowNull: true
    },
    information: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false, // Assuming each education entry is associated with a user
      },
  },{
    freezeTableName: true,
  }
);

// Define the foreign key relationship
Education.belongsTo(User, { foreignKey: 'user_id' });


export default Education;

(async () => {
    try {
      await db.sync();
      console.log("Database synchronized");
    } catch (error) {
      console.error("Error synchronizing database:", error);
    }
  })();

