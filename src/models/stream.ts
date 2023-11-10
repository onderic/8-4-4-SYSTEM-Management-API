// models/stream.ts

import { Table, Model, Column, DataType, BelongsTo,  ForeignKey, Unique } from "sequelize-typescript";
import { Staff } from "./staff";
import { Class } from "./class"; 

@Table({
  timestamps: true,
  tableName: "streams",
})
export class Stream extends Model<Stream> {
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
  // @Unique
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  teacher!: number;

  // Define associations
  @BelongsTo(() => Staff, "teacher")
  staff!: Staff;

  @ForeignKey(() => Class)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  classId!: number;

  @BelongsTo(() => Class, 'classId')
  class!: Class;
    head: any;
}
