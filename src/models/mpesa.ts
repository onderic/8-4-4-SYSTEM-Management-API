import { Table, Model, Column, DataType,BelongsTo,ForeignKey } from "sequelize-typescript";
import { Staff } from "./staff";

interface MpesaAttributes {
  PhoneNumber: string;
  Amount: number;
  ResultCode: number;
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResultDesc: string;
  MpesaReceiptNumber: string;
  TransactionDate: string;
  staffId: string;
}

@Table({
  timestamps: true,
  tableName: "mpesa_payments",
})
export class Mpesa extends Model<MpesaAttributes> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  PhoneNumber!: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  Amount!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  ResultCode!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  MerchantRequestID!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  CheckoutRequestID!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  ResultDesc!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  MpesaReceiptNumber!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  TransactionDate!: string;

  @ForeignKey(() => Staff)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  staffId!: Staff;

}
