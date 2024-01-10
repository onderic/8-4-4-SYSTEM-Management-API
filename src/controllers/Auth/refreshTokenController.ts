import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Staff } from '../../models/staff';

export const refresh = async (req: Request, res: Response): Promise<void> => {
  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Bearer token is missing or invalid' });
      return;
    }

    const refreshToken = authorizationHeader.split(' ')[1];

    // Verify the refresh token
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET || '') as any;
    } catch (verifyError) {
      res.status(401).json({ message: 'Invalid refresh token' });
      return;
    }

    // Find the staff member based on the decoded staffId
    const staffMember = await Staff.findByPk(decoded.staffId);

    if (!staffMember) {
      res.status(401).json({ message: 'Invalid refresh token' });
      return;
    }

    // Check if the provided refresh token is among the stored refresh tokens
    const isRefreshTokenValid = staffMember.dataValues.refreshToken && staffMember.dataValues.refreshToken.includes(refreshToken);

    if (!isRefreshTokenValid) {
      res.status(401).json({ message: 'Invalid refresh token' });
      return;
    }

    // If everything is valid, generate a new access token and refresh token
    const newAccessToken = jwt.sign(
      {
        staffId: staffMember.id,
        email: staffMember.dataValues.email,
        role: staffMember.dataValues.role,
      },
      process.env.JWT_SECRET || '',
      {
        expiresIn: '1d',
      }
    );

    const newRefreshToken = jwt.sign(
      { staffId: staffMember.id },
      process.env.REFRESH_TOKEN_SECRET || '',
      {
        expiresIn: '2d',
      }
    );

    // Update the refresh token in the database
    await staffMember.update({
      refreshToken: [...(staffMember.dataValues.refreshToken || []), newRefreshToken],
    } as any);

    // Send the new access token in the response
    res.json({  
      success: true,
      message: 'Token refreshed successfully',
      newToken: newAccessToken,
    });
  } catch (error) {
    console.error('Error during token refresh:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export default { refresh };
