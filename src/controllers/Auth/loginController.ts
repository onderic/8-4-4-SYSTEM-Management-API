
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Staff } from '../../models/staff';

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const cookies = req.cookies;
    // console.log(`cookie available at login: ${JSON.stringify(cookies)}`);

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
      res.status(401).json({ message: 'Login failed' });
      return;
    }

    // Hash the provided plain text number and compare with the hashed number in the database
    const isNumberValid = await bcrypt.compare(number, staffMember.dataValues.number);

    if (!isNumberValid) {
      res.status(401).json({ message: 'Login failed' });
      return;
    }

    // If authentication is successful, generate a new refresh token and a JWT token
    const accessToken = jwt.sign(
      {
        staffId: staffMember.id,
        email: staffMember.dataValues.email,
        role: staffMember.dataValues.role,
      },
      process.env.JWT_SECRET || '',
      {
        expiresIn: '30m',
      }
    );

    const newRefreshToken = jwt.sign(
      { staffId: staffMember.id },
      process.env.REFRESH_TOKEN_SECRET || '',
      {
        expiresIn: '1d',
      }
    );

    // Store the refresh token in the database
      const updatedStaff = await staffMember.update({
        refreshToken: [...(staffMember.refreshToken || []), newRefreshToken],
      } as any);

     
    // Clear any existing refresh token cookie
    if (cookies?.refreshToken) {
      res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'None' as 'none', secure: true });
    }

    // Creates Secure Cookie with refresh token
    res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'None' as 'none', maxAge: 24 * 60 * 60 * 1000 });

    res.json({
      success: true,
      message: 'Login success',
      staffMember,
      token: accessToken,
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export default { login };
