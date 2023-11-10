import { Table, Model, Column, DataType,HasOne,HasMany } from "sequelize-typescript";
import { Class } from "./class";
import { Stream } from "./stream";
import { Department } from "./department";


@Table({
    timestamps: true,
    tableName: "staff_members",
})

export class Staff extends Model{
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    name!: string

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
    class!: Class; 

    @HasMany(() => Stream)
    stream!: Stream; 

    @HasMany(() => Department)
    department!: Department; 
}
