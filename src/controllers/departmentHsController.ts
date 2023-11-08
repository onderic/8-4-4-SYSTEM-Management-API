import { Request, Response } from "express";
import { Staff } from "../models/staff";
import { Department } from "../models/department";
import { DepartmentHeadHistory } from "../models/departmentHistory"


export const getDepartmentHistory = async (req: Request, res: Response) => {
    try {
      // Get the department ID from the request parameters
      const departmentId = req.params.id;
  
      // Find the department by its ID
      const department = await Department.findByPk(departmentId);
  
      if (!department) {
        return res.status(404).json({ error: "Department not found." });
      }
  
      // Fetch the department head history for the specified department
      const departmentHistory = await DepartmentHeadHistory.findAll({
        where: { departmentId },
        include: [Staff, Department],
      });
  
      res.status(200).json(departmentHistory);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to retrieve department history." });
    }
  };



export const getDepartments = async (req: Request, res: Response) => {
    try {
      const department = await DepartmentHeadHistory.findAll({
        include: [
          {
            model: Staff,
            as: 'head', 
          },
          {
            model: Department,
            as: 'department', 
          }
        ],
      });
  
      res.status(200).json(department);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to retrieve Departments' });
    }
}


export const updateDepartmentHead = async (req: Request, res: Response) => {
  try {
    const { departmentId, newHeadId, endDate } = req.body;
    // Validate that the new head is a TEACHING staff member
    const newHead = await Staff.findByPk(newHeadId);

    if (!newHead || newHead.dataValues.type !== 'TEACHING') {
      return res.status(400).json({ error: "Invalid new department head. Must be a TEACHING staff member." });
    }

    // Find the most recent department head entry for the department
    const previousHeadEntry = await DepartmentHeadHistory.findOne({
      where: {
        departmentId,
        endDate: null, // The previous head's entry is currently active
      },
    });

    if (!previousHeadEntry) {
      return res.status(404).json({ error: "Department or previous head not found." });
    }

    // Update the previous head's entry with the end date
    if (endDate) {
      await previousHeadEntry.update({ endDate });
    }

    // Create a new entry for the new department head
    const newHeadEntry = await DepartmentHeadHistory.create({
      departmentId,
      headId: newHeadId,
      startDate: new Date(),
      endDate: null, // The new head is currently active
    } as DepartmentHeadHistory);

    res.status(200).json({ message: "Department head updated successfully", newHeadEntry });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update department head. Try again later." });
  }
};
