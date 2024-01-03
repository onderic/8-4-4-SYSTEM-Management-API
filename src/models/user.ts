import { Table, Model, Column, DataType, HasOne } from "sequelize-typescript";

interface UserAttributes {
    name: string;
    email: string;
    role: "TEACHER" | "ADMIN" | "SUPERADMIN";
  }

@Table({
    timestamps: true,
    tableName: "users",
})

export class User extends Model<UserAttributes> {
    @Column({
      type: DataType.STRING,
      allowNull: false,
      unique: true,
    })
    username!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    password!: string;

    @Column({
        type: DataType.ENUM("TEACHER", "ADMIN", "SUPERADMIN"),
        allowNull: false,
      })
      role!: "TEACHER" | "ADMIN" | "SUPERADMIN";
    
}    