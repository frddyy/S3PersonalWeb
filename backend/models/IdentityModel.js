import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import User from "./UserModel.js";

const { DataTypes } = Sequelize;

const Identity = db.define("identities",{
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    image: {
        type: DataTypes.BLOB,
        allowNull: false
    },
    place_of_birth: {
        type: DataTypes.STRING,
        allowNull: false
    },
    date_of_birth: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    phone_number: {
        type: DataTypes.STRING,
        allowNull: true
      },
    email: {
    type: DataTypes.STRING,
    allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false 
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false 
    },
  },{
    freezeTableName: true,
  }
);

// Define the foreign key relationship
Identity.belongsTo(User, { foreignKey: 'user_id' });

export default Identity;

(async () => {
    try {
      await db.sync();
      console.log("Database synchronized");
    } catch (error) {
      console.error("Error synchronizing database:", error);
    }
  })();

