import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Identity from "./IdentityModel.js";

const { DataTypes } = Sequelize;

const User = db.define('users', {
    username: {
      type: DataTypes.STRING,
      allowNull: false, // Add validation for username not to be null
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false, // Add validation for password not to be null
    },
    role: {
      type: DataTypes.INTEGER,
      allowNull: false, // Add validation for role not to be null
    }
  }, {
    freezeTableName: true,
  });


export default User;

User.hasOne(Identity);
Identity.belongsTo(User);

(async () => {
  try {
    await db.sync();
    console.log("Database synchronized");
  } catch (error) {
    console.error("Error synchronizing database:", error);
  }
})();
