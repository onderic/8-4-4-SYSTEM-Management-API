import { Request, Response } from 'express';
import { Staff } from '../models/staff';

export const createStaff = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, number,type} = req.body;

    if ( !name || !number || !type ){
      res.status(400).json({ message: 'All fields are required' });
      return;
    }
    // Create a new staff record
    const staff = await Staff.create({ name, number, type });

    res.status(201).json({ message: 'Staff created successfully', staff });
  } catch (error) {
    console.error('Error creating staff:', error);
    res.status(500).json({ message: 'Error creating staff' });
  }
};


export const getAllStaffs = async (req:Request, res:Response): Promise<void> =>{
    try {
        const Staffs = await Staff.findAll();
        res.status(200).json(Staffs);
    }catch(error){
        console.error('Error fetching Staffs:', error);
        res.status(500).json({ message: 'Error fetching Staffs' });
    }
}


export const updateStaff = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { field, value } = req.body;

    // Check if the staff member exists
    const existingStaff = await Staff.findByPk(id);

    console.log("Available",existingStaff)

    if (!existingStaff) {
      res.status(404).json({ message: 'Staff not found' });
      return;
    }

    // Update the staff's data based on the provided field
    if (field === 'name') {
      existingStaff.name = value;
    } else if (field === 'number') {
      existingStaff.number = value;
    } else if (field === 'type') {
      existingStaff.type = value;
    } else {
      res.status(400).json({ message: 'Invalid field for update' });
      return;
    }

    await existingStaff.save();

    res.json({ message: 'Staff updated successfully', staff: existingStaff });
  } catch (error) {
    console.error('Error updating staff:', error);
    res.status(500).json({ message: 'Error updating staff' });
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
    res.status(500).json({ message: 'Error deleting staff' });
  }
};
