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
    tableName:"Department_History"
})
export class DepartmentHeadHistory extends Model<DepartmentHeadHistory> {
  @ForeignKey(() => Staff)
  @Column
  headId!: number;

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

  @BelongsTo(() => Staff)
  head!: Staff;
}





