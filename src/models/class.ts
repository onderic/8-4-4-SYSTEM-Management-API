import { Table, Model, Column, DataType, BelongsTo, HasMany, BeforeValidate } from "sequelize-typescript";
import { Staff } from "./staff";
import { Stream } from "./stream";

@Table
export class Class extends Model<Class> {
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
  @BelongsTo(() => Staff, "head")
  head!: Staff;

  @HasMany(() => Stream)
  streams!: Stream[];

  @BeforeValidate
  static validateHeadType(instance: Class){
    // check if the head is Teaching
    if (instance.head && instance.head.type !== "TEACHING" ){
        throw new Error("The head of a class must be of type TEACHING.");
    }
  }
}
