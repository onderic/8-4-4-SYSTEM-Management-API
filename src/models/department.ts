import {
  Table,
  Model,
  Column,
  DataType,
  BelongsTo,
  ForeignKey,
  HasMany,
} from "sequelize-typescript";
import { Staff } from "./staff";
import { DepartmentHeadHistory } from "./departmentHistory"


@Table({
  timestamps: true,
  tableName: "departments",
})

export class Department extends Model<Department> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @ForeignKey(() => Staff)
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