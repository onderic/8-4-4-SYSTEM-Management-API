import {
  Table,
  Model,
  Column,
  DataType,
  BelongsTo,
  ForeignKey,
  Unique,
  HasMany
} from "sequelize-typescript";
import { Staff } from "./staff";
import { Stream } from "./stream";

@Table({
  timestamps: true,
  tableName: "classes",
})

export class Class extends Model<Class> {
  @Unique
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Unique
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  abbreviation!: string;

  @ForeignKey(() => Staff)
  @Unique
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  headId!: number;

  @BelongsTo(() => Staff, 'headId')
  head!: Staff;


  @HasMany(() => Stream)
  streams!: Stream[];

}
