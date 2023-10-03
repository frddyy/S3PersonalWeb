import { Sequelize } from "sequelize";
import db from "../config/Database.js";

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
        type: DataTypes.STRING,
        allowNull: true
    }
  },{
    freezeTableName: true,
  }
);

export default SocialMedia;

(async () => {
    try {
      await db.sync();
      console.log("Database synchronized");
    } catch (error) {
      console.error("Error synchronizing database:", error);
    }
  })();

