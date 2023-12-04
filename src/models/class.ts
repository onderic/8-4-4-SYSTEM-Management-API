import {
  Table,
  Model,
  Column,
  DataType,
  BelongsTo,
  ForeignKey,
  HasMany,
  BelongsToMany,
} from "sequelize-typescript";
import { Staff } from "./staff";
import { Stream } from "./stream";
import { SubjectsToBeDone } from "./subjectsToBeDone";
import { ClassSubjects } from './classSubjects';
import { Subject } from "./subject";

interface ClassAttributes {
  name: string;
  abbreviation: string;
  headId: number;
}

@Table({
  timestamps: true,
  tableName: "classes",
})
export class Class extends Model<ClassAttributes> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  abbreviation!: string;

  @ForeignKey(() => Staff)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    unique: true,
  })
  headId!: number;
  
  @BelongsToMany(() => Subject, () => ClassSubjects)
  subjects!: Subject[];
  
  @BelongsTo(() => Staff, 'headId')
  head!: Staff;

  @HasMany(() => Stream)
  streams!: Stream[];

  @HasMany(() => SubjectsToBeDone)
  subjectsToBeDones!: SubjectsToBeDone[];
}
