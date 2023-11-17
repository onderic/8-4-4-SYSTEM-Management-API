// models/classSubjects.ts
import {
    Table,
    Model,
    Column,
    ForeignKey,
  } from "sequelize-typescript";
  import { Class } from "./class";
  import { Subject } from "./subject";
  
  @Table({
    tableName: "classSubjects",
  })
  export class ClassSubjects extends Model {
    @ForeignKey(() => Class)
    @Column
    classId!: number;
  
    @ForeignKey(() => Subject)
    @Column
    subjectId!: number;
  }
  