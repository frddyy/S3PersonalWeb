import { Sequelize } from "sequelize";

const db = new Sequelize('personal_web_db', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});

export default db;