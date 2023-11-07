import { Table, Model, Column, DataType, BelongsTo, HasMany, BeforeCreate } from "sequelize-typescript";
import { Staff } from "./staff";
import { DepartmentHead } from "./departmentHead";

@Table
export class Department extends Model<Department> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  // Define associations
  @BelongsTo(() => Staff, "head")
  head!: Staff;

  @HasMany(() => DepartmentHead)
  departmentHeads!: DepartmentHead[];

  // Hook to initialize the department head
  @BeforeCreate
  static initializeHead(instance: Department) {
    if (instance.head) {
      instance.initializeHead(instance.head);
    }
  }

  // Method to initialize department head
  private initializeHead(head: Staff): void {
    // Create a new department head record with the current date as the start date
    const departmentHead = new DepartmentHead();
    departmentHead.headId = head.id;
    departmentHead.departmentId = this.id;
    departmentHead.start_date = new Date();
    departmentHead.end_date = null;

    // Save the new department head record
    departmentHead.save();
  }

  // Method to get the current active department head
  async getCurrentHead(): Promise<Staff | null> {
    const currentHead = await this.head;
    if (currentHead) {
      return currentHead;
    }

    // If there's no current head, check the historical department heads to find the most recent one
    const historicalHeads = await DepartmentHead.findAll({
      where: { departmentId: this.id },
      order: [["start_date", "DESC"]],
      limit: 1,
    });

    if (historicalHeads.length > 0) {
      return Staff.findByPk(historicalHeads[0].headId);
    }

    return null; // If no current or historical head is found
  }
}
