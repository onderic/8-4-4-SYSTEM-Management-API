import { Table, Model, Column, DataType, HasOne, HasMany } from "sequelize-typescript";
import { Class } from "./class";
import { Stream } from "./stream";
import { Department } from "./department";

interface StaffAttributes {
  name: string;
  number: string;
  type: "TEACHING" | "NON-TEACHING";
}

@Table({
  timestamps: true,
  tableName: "staff_members",
})
export class Staff extends Model<StaffAttributes> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  number!: string;

  @Column({
    type: DataType.ENUM("TEACHING", "NON-TEACHING"),
    allowNull: false,
  })
  type!: "TEACHING" | "NON-TEACHING";

  @HasOne(() => Class)
  staffClass!: Class;

  @HasMany(() => Stream)
  streams!: Stream[];

  @HasOne(() => Department)
  staffDepartment!: Department;
}
