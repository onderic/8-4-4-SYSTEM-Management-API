import { Request, Response } from 'express';
import { Staff } from '../models/staff';
import bcrypt from 'bcrypt';
import CustomRequest from '../types/custom'; 



export const createStaff = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, number,type, email} = req.body;

    if ( !name || !number || !type || !email ){
      res.status(400).json({ message: 'All fields are required' });
      return;
    }
    // Hash the number field using bcrypt
    const hashNumber = await bcrypt.hash(number,10)
    // Create a new staff record
    const staff = await Staff.create({ name, number:hashNumber, type, email } as any);

    res.status(201).json({ message: 'Staff created successfully', staff });
  } catch (error) {
    console.error('Error creating staff:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


export const getAllStaffs = async (req: CustomRequest, res: Response): Promise<void> => {
      try {

      if (req.role !== 'ADMIN') {
        res.status(403).json({ message: 'Forbidden: You do not have permission to access this resource' });
        return;
      }
    const staffs = await Staff.findAll();
    res.status(200).json(staffs);
  } catch (error) {
    console.error('Error fetching staffs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUserProfile = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const userId = req.staffId;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized', error: 'Invalid token' });
      return;
    }

    // Fetch the user profile from the database
    const userProfile = await Staff.findByPk(userId, {
      attributes: ['id', 'name', 'number', 'email', 'role', 'refreshToken'],
    });

    if (!userProfile) {
      res.status(404).json({ message: 'User profile not found' });
      return;
    }

    res.status(200).json(userProfile);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



export const updateStaff = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, number, type,  email } = req.body;
    

    // Check if the staff member exists
    const existingStaff = await Staff.findByPk(id);

    if (!existingStaff) {
      res.status(404).json({ message: 'Staff not found' });
      return;
    }
   
     // Check if the current user is the owner of the staff record or has admin role
     if (req.staffId !== existingStaff.id && req.role !== 'ADMIN') {
      res.status(403).json({ message: 'Forbidden: You do not have permission to update this resource' });
      return;
    }


    // Hash the number field using bcrypt if it exists in the payload
    let hashedNumber;
    if (number) {
      hashedNumber = await bcrypt.hash(number, 10);
    }
    
     // Create a new staff record
    const updatedStaff = await existingStaff.update({
      name,
      number: hashedNumber || existingStaff.number,
      email,
      type
    });

    res.json({ message: 'Staff updated successfully',updatedStaff });
  } catch (error) {
    console.error('Error updating staff:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



export const deleteStaff = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Check if the staff with the given ID exists
    const existingStaff = await Staff.findByPk(id);
    
    if (!existingStaff) {
      res.status(404).json({ message: 'Staff not found' });
      return;
    }
    // Delete the staff
    await existingStaff.destroy();

    res.json({ message: 'Staff deleted successfully' });
  } catch (error) {
    console.error('Error deleting staff:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
