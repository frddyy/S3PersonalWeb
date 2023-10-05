import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Identity from "./IdentityModel.js";

const { DataTypes } = Sequelize;

const User = db.define('users', {
    uuid: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [4, 25]
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    }
  }, {
    freezeTableName: true,
  });

  User.hasOne(Identity);
  Identity.belongsTo(User);

export default User;

// (async () => {
//   try {
//     await db.sync();
//     console.log("Database synchronized");
//   } catch (error) {
//     console.error("Error synchronizing database:", error);
//   }
// })();
