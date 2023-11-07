// models/stream.ts

import { Table, Model, Column, DataType, BelongsTo } from "sequelize-typescript";
import { Staff } from "./staff";
import { Class } from "./class"; 

@Table
export class Stream extends Model<Stream> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  abbreviation!: string;

  // Define associations
  @BelongsTo(() => Staff, "teacher")
  teacher!: Staff;

  @BelongsTo(() => Class)
  class!: Class;
}
