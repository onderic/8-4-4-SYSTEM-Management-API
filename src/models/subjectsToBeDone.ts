// models/subjectsToBeDone.ts
import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { Subject } from "./subject";
import { Exam } from "./exam";
import { Class } from "./class";

interface ExamSubjectAttributes {
  examId: number;
  subjectId: number;
  classId: number;
  maxScore: number;
}

@Table({
  tableName: "subjectsToBeDone",
})
export class SubjectsToBeDone extends Model<ExamSubjectAttributes> {
  @ForeignKey(() => Exam)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  examId!: number;

  @ForeignKey(() => Subject)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  subjectId!: number;

  @ForeignKey(() => Class) // Add foreign key for Class
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  classId!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  maxScore!: number;

  @BelongsTo(() => Exam, 'examId')
  exam!: Exam;

  @BelongsTo(() => Class, 'classId') // Add association for Class
  class!: Class;

  @BelongsTo(() => Subject, 'subjectId')
  subject!: Subject;
}
