import { Sequelize } from "sequelize-typescript";
require('dotenv').config();
import { Staff } from "../src/models/staff";


const connection = new Sequelize({
  dialect: "postgres",
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  logging: true,
  models: [Staff],
});

export default connection;