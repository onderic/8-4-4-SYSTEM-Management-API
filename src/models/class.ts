// models/class.ts
import {
  Table,
  Model,
  Column,
  DataType,
  BelongsTo,
  ForeignKey,
  Unique,
  HasMany,
  BelongsToMany
} from "sequelize-typescript";
import { Staff } from "./staff";
import { Stream } from "./stream";
import { SubjectsToBeDone } from "./subjectsToBeDone";
import {ClassSubjects } from './classSubjects'
import { Subject } from "./subject"


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
  @Unique
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Unique
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  abbreviation!: string;

  @ForeignKey(() => Staff)
  @Unique
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
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
