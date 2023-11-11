import {
  Table,
  Model,
  Column,
  DataType,
  BelongsTo,
  ForeignKey,
  HasMany,
  Unique,
} from "sequelize-typescript";
import { Staff } from "./staff";
import { DepartmentHeadHistory } from "./departmentHistory"


interface DepartmentAttributes {
  name: string;
  headId: number;
}


@Table({
  timestamps: true,
  tableName: "departments",
})

export class Department extends Model<Department, DepartmentAttributes> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @ForeignKey(() => Staff)
  @Unique
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  headId!: number;

  @BelongsTo(() => Staff, 'headId')
  head!: Staff;

  @HasMany(() => DepartmentHeadHistory)
  headHistory!: DepartmentHeadHistory[];
}