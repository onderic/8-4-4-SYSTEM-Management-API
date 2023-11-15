import {
    Table,
    Model,
    Column,
    DataType,
    BelongsToMany,
    Unique,
  } from "sequelize-typescript";
  import { Class } from "./class";
  
  interface SubjectAttributes {
    name: string;
    code: string;
    isCompulsory: boolean;
  }
  
  @Table({
    timestamps: true,
    tableName: "subjects",
  })
  export class Subject extends Model<SubjectAttributes> {
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
    code!: string;
  
    @Column({
      type: DataType.BOOLEAN,
      allowNull: false,
    })
    isCompulsory!: boolean;
  
    // @BelongsToMany(() => Class, {
    //     through: 'SubjectClass',
    //     foreignKey: 'subjectId',
    //     otherKey: 'classId',
    //   })
    //   classes!: Class[];
  }
  