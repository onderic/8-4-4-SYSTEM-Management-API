import {
  Table,
  Model,
  Column,
  DataType,
  BelongsTo,
  ForeignKey,
  Unique,
} from "sequelize-typescript";
import { Staff } from "./staff";
import { Class } from "./class";

interface StreamAttributes {
  name: string;
  abbreviation: string;
  teacherId: number;
  classId: number;
}

@Table({
  timestamps: true,
  tableName: "streams",
})
export class Stream extends Model<StreamAttributes> {
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
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  teacherId!: number;

  @BelongsTo(() => Staff, "teacherId")
  teacher!: Staff;

  @ForeignKey(() => Class)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  classId!: number;

  @BelongsTo(() => Class, "classId")
  streamClass!: Class;
}
