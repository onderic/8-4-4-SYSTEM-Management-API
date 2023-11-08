import {
  Table,
  Model,
  Column,
  DataType,
  BelongsTo,
  BeforeValidate,
  ForeignKey,
  Unique
} from "sequelize-typescript";
import { Staff } from "./staff";

@Table({
  timestamps: true,
  tableName: "classes",
})

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

  @ForeignKey(() => Staff)
  @Unique
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  headId!: number;

  @BelongsTo(() => Staff, 'headId')
  head!: Staff;

  // @BeforeValidate
  // static validateHeadType(instance: Class) {
  //   if (instance.head && instance.head.type !== "TEACHING") {
  //     throw new Error("The head of a class must be of type TEACHING.");
  //   }
  // }
}
