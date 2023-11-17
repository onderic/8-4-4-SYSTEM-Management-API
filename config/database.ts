import { Sequelize } from "sequelize-typescript";
require('dotenv').config();
import { Staff } from "../src/models/staff";
import { Class } from "../src/models/class";
import { Stream } from "../src/models/stream";
import { Department } from "../src/models/department";
import { DepartmentHeadHistory } from "../src/models/departmentHistory";
import { Subject } from "../src/models/subject";
import { Exam } from "../src/models/exam";
import { SubjectsToBeDone } from "../src/models/subjectsToBeDone";
import { ClassSubjects } from "../src/models/classSubjects";


const sequelize = new Sequelize({
  dialect: "postgres",
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  logging: false,
  models: [
    Staff,
    Class,
    Stream, 
    Department, 
    DepartmentHeadHistory,
    Subject,
    Exam,
    SubjectsToBeDone,
    ClassSubjects
  ],
});

export default sequelize;

// sudo -u postgres psql -d sqltest