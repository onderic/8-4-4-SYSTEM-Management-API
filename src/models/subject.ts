import {
    Table,
    Model,
    Column,
    DataType,
    ForeignKey,
    BelongsToMany,
    BelongsTo
  } from "sequelize-typescript";
  import { Class } from "./class";
  import { Exam } from "./exam";
  import { SubjectsUnderTheExam  } from "./subjectsUnderTheExam";
  
  interface SubjectAttributes {
    name: string;
    code: string;
    isCompulsory: boolean;
    classId:number
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

    @ForeignKey(() => Class)
    @Column({
      type: DataType.INTEGER,
      allowNull: false,
    })
    classId!: number;

    @BelongsTo(() => Class)
    class!: Class;
    

    @BelongsToMany(() => Exam, () => SubjectsUnderTheExam)
    exams!: Exam[];

    @BelongsToMany(() => Exam, () => SubjectsUnderTheExam)
    subjectsUnderTheExam!: SubjectsUnderTheExam[];
  }
  