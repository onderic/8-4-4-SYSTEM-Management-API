import { Sequelize } from "sequelize-typescript";
require('dotenv').config();
import { Staff } from "../src/models/staff";
import { Class } from "../src/models/class";
import { Stream } from "../src/models/stream";
import { Department } from "../src/models/department";
import { DepartmentHeadHistory } from "../src/models/departmentHistory";


const sequelize = new Sequelize({
  dialect: "postgres",
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  logging: true,
  models: [Staff,Class,Stream, Department, DepartmentHeadHistory],
});

export default sequelize;

// sudo -u postgres psql -d sqltest