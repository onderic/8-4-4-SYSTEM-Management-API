import { Request, Response } from "express";
import { Staff } from "../models/staff";
import { Department } from "../models/department";
import { DepartmentHeadHistory } from "../models/departmentHistory"


export const createDepartment = async (req:Request, res:Response) =>{
    try{
        const { name, headId } = req.body

        const existingDepartmentWithHead = await Department.findOne({
            where: {
              headId,
            },
          });
      
          if (existingDepartmentWithHead) {
            return res.status(400).json({
              error: "The staff is already leading another department.",
            });
        }
        const head = await Staff.findByPk(headId);

        if (!head || head.dataValues.type !== 'TEACHING') {
            return res.status(400).json({ error: "Invalid department head.Or Must be a TEACHING staff member." });
        }

        // create department
        const department = await Department.create({
            name,
            headId
        } as Department);

        // Create an entry in DepartmentHeadHistory
        await DepartmentHeadHistory.create({
            departmentId: department.id,
            headId: headId,
            startDate:new Date(),
            endDate: null
        }as DepartmentHeadHistory);
        // console.log("New dep history", DepartmentHeadHistory)
        res.status(201).json({ message: "Department created successfully", department });
    }catch(error){
        console.error(error);
        res.status(500).json({ error: "Failed to create a department try again later" });
    }
}

export const getDepartments = async (req: Request, res: Response) => {
    try {
      const department = await Department.findAll({
        include: [
          {
            model: Staff,
            as: 'head', 
          }
        ],
      });
  
      res.status(200).json(department);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to retrieve Departments' });
    }
}


export const updateDepartments  = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updates = { ...req.body };
  
      const [updatedRows] = await Department.update(updates, {
        where: { id },
      });
  
      if (updatedRows > 0) {
        const updatedDepartment = await Department.findByPk(id);
        if (updatedDepartment) {
          res.status(200).json({ message: 'Department updated successfully', updatedDepartment });
        } else {
          res.status(404).json({ error: 'Department not found.' });
        }
      } else {
        res.status(404).json({ error: 'Department not found.' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update the Department' });
    }
  };

export const deleteDepartmentHead = async (req:Request, res:Response)=>{
    try{
        const { id } = req.params

        const existingdepartment = await Department.findByPk(id)

        if (!existingdepartment){
            res.status(404).json({ message: 'Staff not found' });
            return;
        }
        
        await existingdepartment.destroy();
        res.json({ message: 'Department deleted successfully' });

    } catch (error) {
      console.error('Error deleting Department:', error);
      res.status(500).json({ message: 'Error deleting Department' });
    }
}