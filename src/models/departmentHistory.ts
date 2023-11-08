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
  import { Department } from "./department"
  

  
@Table({
    timestamps: false,
    tableName:"department_History"
})
export class DepartmentHeadHistory extends Model<DepartmentHeadHistory> {
  @ForeignKey(() => Staff)
  @Column
  headId!: number;

  @BelongsTo(() => Staff)
  head!: Staff;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  startDate!: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  endDate!: Date | null;
  
  @ForeignKey(() => Department)
  @Column
  departmentId!: number;

  @BelongsTo(() => Department)
  department!: Department;
}






