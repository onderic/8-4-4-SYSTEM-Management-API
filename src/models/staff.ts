import { Table, Model, Column, DataType, HasOne, HasMany } from "sequelize-typescript";
import { Class } from "./class";
import { Stream } from "./stream";
import { Department } from "./department";

interface StaffAttributes {
  name: string;
  number: string;
  email: string;
  type: "TEACHING" | "NON-TEACHING";
  role: "ADMIN" | "STAFF"; 
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
    unique: false,
  })
  email!: string;

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


  @Column({
    type: DataType.ENUM("ADMIN", "STAFF"),
    allowNull: false,
    defaultValue: 'STAFF',
  })
  role!: "ADMIN" | "STAFF";

  @HasOne(() => Class)
  staffClass!: Class;

  @HasMany(() => Stream)
  streams!: Stream[];

  @HasOne(() => Department)
  staffDepartment!: Department;
}
