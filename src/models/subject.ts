// models/subject.ts
import {
  Table,
  Model,
  Column,
  DataType,
  BelongsToMany,
} from "sequelize-typescript";
import { Class } from "./class";
import { Exam } from "./exam";
import { SubjectsToBeDone } from "./subjectsToBeDone";
import { ClassSubjects } from "./classSubjects";

interface SubjectAttributes {
  name: string;
  code: string;
  isCompulsory: boolean;
}

@Table({
  timestamps: true,
  tableName: "subjects",
})
export class Subject extends Model<SubjectAttributes> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  code!: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  isCompulsory!: boolean;
  
  @BelongsToMany(() => Class, () => ClassSubjects)
  classes!: Class[];

  @BelongsToMany(() => Exam, () => SubjectsToBeDone)
  exams!: Exam[];

  @BelongsToMany(() => Exam, () => SubjectsToBeDone)
  subjectsToBeDone!: SubjectsToBeDone[];
} 