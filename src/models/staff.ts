import { Table, Model, Column, DataType, HasOne, HasMany } from "sequelize-typescript";
import { Class } from "./class";
import { Stream } from "./stream";
import { Mpesa } from "./mpesa";
import { Department } from "./department";

interface StaffAttributes {
  name: string;
  number: string;
  email: string;
  type: "TEACHING" | "NON-TEACHING";
  role: "ADMIN" | "STAFF"; 
  refreshToken: string;
  id:number
  is_paid: boolean;
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

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  is_paid!: boolean;


  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: true,
    defaultValue: [],
  })
  refreshToken!: string[];
  
    
  @HasOne(() => Class)
  staffClass!: Class;

  @HasMany(() => Stream)
  streams!: Stream[];

  @HasOne(() => Department)
  staffDepartment!: Department;
}
