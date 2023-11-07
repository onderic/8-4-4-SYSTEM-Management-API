// models/departmentHead.ts

import { Table, Model, Column, DataType, BelongsTo } from "sequelize-typescript";
import { Staff } from "./staff";
import { Department } from "./department";

@Table
export class DepartmentHead extends Model<DepartmentHead> {
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  start_date!: Date;

  @Column({
    type: DataType.DATE,
  })
  end_date!: Date | null;

  // Define associations
  @BelongsTo(() => Staff, "head")
  head!: Staff;

  @BelongsTo(() => Department)
  department!: Department;
    headId: any;
    departmentId: any;
}
