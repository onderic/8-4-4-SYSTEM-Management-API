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

  @ForeignKey(() => Class)
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

  @BelongsTo(() => Exam)
  exam!: Exam;

  @BelongsTo(() => Subject)
  subject!: Subject;

  @BelongsTo(() => Class)
  class!: Class;
}

// NOTE: If you encounter issues with TypeScript compilation for the unique constraint,
// you may need to create the "subjectsToBeDone" table manually with the following SQL:

// CREATE TABLE "subjectsToBeDone" (
//   "examId" INTEGER,
//   "subjectId" INTEGER,
//   "classId" INTEGER,
//   "maxScore" INTEGER,
//   "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
//   "updatedAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
//   CONSTRAINT "composite_unique" UNIQUE ("examId", "subjectId", "classId"),
//   CONSTRAINT "subjectsToBeDoned_pkey" PRIMARY KEY ("examId", "subjectId", "classId")
// );
