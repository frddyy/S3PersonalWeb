import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Identity from "./IdentityModel.js";

const { DataTypes } = Sequelize;

const SocialMedia = db.define("social_media",{
    platform: {
        type: DataTypes.STRING,
        allowNull: true
    },
    account: {
        type: DataTypes.STRING,
        allowNull: true
    },
    thumbnail: {
        type: DataTypes.BLOB,
        allowNull: true
    },
    identity_id: {
        type: DataTypes.INTEGER,
        allowNull: false 
    }
  },{
    freezeTableName: true,
  }
);

// Define the foreign key relationship
SocialMedia.belongsTo(Identity, { foreignKey: 'identity_id' });

export default SocialMedia;

(async () => {
    try {
      await db.sync();
      console.log("Database synchronized");
    } catch (error) {
      console.error("Error synchronizing database:", error);
    }
  })();

