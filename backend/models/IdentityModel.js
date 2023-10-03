import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Education from "./EducationModel.js";
import Organization from "./OrganizationModel.js";
import Skill from "./SkillModel.js";
import Portfolio from "./PortfolioModel.js";
import SocialMedia from "./SocialMediaModel.js";

const { DataTypes } = Sequelize;

const Identity = db.define("identities",{
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    image: {
        type: DataTypes.STRING,
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
    }
  },{
    freezeTableName: true,
  }
);

// Define the foreign key relationship
Identity.hasMany(Education);
Identity.hasMany(Organization);
Identity.hasMany(Skill);
Identity.hasMany(Portfolio);
Identity.hasMany(SocialMedia);

Education.belongsTo(Identity);
Organization.belongsTo(Identity);
Skill.belongsTo(Identity);
Portfolio.belongsTo(Identity);
Skill.belongsTo(Identity);


export default Identity;

(async () => {
    try {
      await db.sync();
      console.log("Database synchronized");
    } catch (error) {
      console.error("Error synchronizing database:", error);
    }
  })();
