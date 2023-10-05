import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Education from "./EducationModel.js";
import Organization from "./OrganizationModel.js";
import Skill from "./SkillModel.js";
import Portfolio from "./PortfolioModel.js";

const { DataTypes } = Sequelize;

const Identity = db.define("identities",{
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [3, 100]
      }
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    place_of_birth: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    date_of_birth: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        notEmpty: true,
        len: [10, 15]
      }
      },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        isEmail: true
      }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false 
    },
    instagram: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    linkedin: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    twitter: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    github: {
      type: DataTypes.STRING,
      allowNull: true,
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

Education.belongsTo(Identity);
Organization.belongsTo(Identity);
Skill.belongsTo(Identity);
Portfolio.belongsTo(Identity);
Skill.belongsTo(Identity);


export default Identity;

// (async () => {
//     try {
//       await db.sync();
//       console.log("Database synchronized");
//     } catch (error) {
//       console.error("Error synchronizing database:", error);
//     }
//   })();

