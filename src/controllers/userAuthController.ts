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

    // Log the values of email and number before querying the database
    console.log('email:', email);
    console.log('number:', number);

    // If no staff member found or the hashed number doesn't match, authentication fails
    if (!staffMember) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Log the value of staffMember.number before the bcrypt.compare call
    console.log('staffMember.number:', staffMember.dataValues.number);

    // Hash the provided plain text number and compare with the hashed number in the database
    const isNumberValid = await bcrypt.compare(String(number), staffMember.dataValues.number);

    if (!isNumberValid) {
      // Log if the comparison fails
      console.log('Number validation failed');
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // If authentication is successful, generate a JWT token
    const token = jwt.sign(
      { staffId: staffMember.id, email: staffMember.email },
      process.env.JWT_SECRET || 'a0995f5b68e324680cb121f73966531a8cd6794eb35b2b38884d5694ec97cd70',
      {
        expiresIn: '1d',
      }
    );

    res.status(200).json({
      status: 200,
      success: true,
      message: 'Login success',
      token: token,
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
