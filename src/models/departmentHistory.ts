import {
  Table,
  Model,
  Column,
  DataType,
  BelongsTo,
  ForeignKey,
} from "sequelize-typescript";
import { Staff } from "./staff";
import { Department } from "./department";


interface DepartmentHeadHistoryAttributes {
  departmentId:number;
  startDate: Date;
  endDate: Date | null;
  active: boolean;
  headId: number;
}

@Table({
  timestamps: true,
  tableName: "department_History",
})
export class DepartmentHeadHistory extends Model<DepartmentHeadHistory, DepartmentHeadHistoryAttributes> {
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

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  active!: boolean;
}
