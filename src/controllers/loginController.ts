import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Staff } from '../models/staff';
require('dotenv').config();


export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, number } = req.body;

    if (!email || !number) {
      res.status(400).json({ message: 'Both email and number are required for login' });
      return;
    }

    // Find the staff member based on the entered email
    const staffMember = await Staff.findOne({
      where: {
        email,
      },
    });

    if (!staffMember) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Hash the provided plain text number and compare with the hashed number in the database
    const isNumberValid = await bcrypt.compare(String(number), staffMember.dataValues.number);

    if (!isNumberValid) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // If authentication is successful, generate a JWT token
    const token = jwt.sign(
      {  staffId: staffMember.id,
         email: staffMember.dataValues.email,
         role: staffMember.dataValues.role 
        },
      process.env.JWT_SECRET || 'a0995f5b68e324680cb121f73966531a8cd6794eb35b2b38884d5694ec97cd70',
      {
        expiresIn: '1m',
      }
    );

    res.status(200).json({
      status: 200,
      success: true,
      message: 'Login success',
      staffId: staffMember.id, 
      role: staffMember.dataValues.role, 
      email: staffMember.dataValues.email,
      name: staffMember.dataValues.name,
      token: token,
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
