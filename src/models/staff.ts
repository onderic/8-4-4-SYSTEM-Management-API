import { Table, Model, Column, DataType } from "sequelize-typescript";

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
}
