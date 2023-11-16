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

interface ExamSubjectAttributes {
  examId: number;
  classId: number;
  subjectId: number;
  maxScore: number;
}

@Table({
  timestamps: true,
  tableName: "subjectsUnderTheExam",
})

export class SubjectsUnderTheExam extends Model<ExamSubjectAttributes> {
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
  
    @Column({
      type: DataType.INTEGER,
      allowNull: false,
    })
    maxScore!: number;
  
    // Relationships
    @BelongsTo(() => Exam, 'examId')
    exam!: Exam;
  
    @BelongsTo(() => Subject, 'subjectId')
    subject!: Subject;
}
